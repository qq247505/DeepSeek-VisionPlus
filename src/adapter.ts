import { contentHasImage, LlmAdapter, LlmError, ReasoningEffortId } from '@deepseek-ai/dsh-llm'
import type { GenerateOptions, LlmModelInfo, LlmResolvedModelInfo, StreamChunk } from '@deepseek-ai/dsh-llm'
import type { PiAiAdapter } from '@deepseek-ai/dsh-llm-pi-ai'
import type { VisionPlusConfig, Variant } from './config.js'
import { StatusTracker } from './status.js'
import type { VisionPool } from './pool.js'

/**
 * 视觉路由适配器。
 *
 * 对外（模型选择器）：一个 provider 路由，两个包装模型变体，
 * 都声明支持 [text, image] —— 这样 harness 的"发图关卡"和 read_image
 * 关卡自然放行，无需任何源码补丁。
 *
 * 对内（stream）：按消息里有没有图片分流。
 * - 无图 → 交给文本后端（DeepSeek），原样透传；
 * - 有图 → 顺序轮换视觉池，逐个尝试；全失败抛结构化错误，
 *   由上层（DeepSeek + harness 重试）自行决策后续。
 *
 * 重放兼容：剥离内层 pi-ai 的 replayState（其 provider 是内层线路，
 * 与对外路由不一致会让 harness 重放校验报错）。剥掉后 harness 走普通
 * 请求路径，行为等价。
 */
export class VisionRouterAdapter extends LlmAdapter {
  constructor(
    private readonly config: VisionPlusConfig,
    private readonly inner: PiAiAdapter,
    private readonly pool: VisionPool,
    readonly status: StatusTracker,
  ) {
    super()
  }

  override providerInfo(provider: string): { id: string, name: string } {
    return { id: provider, name: this.config.providerName }
  }

  override listModels(): Promise<readonly LlmModelInfo[]> {
    return Promise.resolve(this.config.variants.map(variant => ({
      provider: this.config.providerId,
      id: variant.id,
      name: variant.name,
      // 声明支持图片：发图与 read_image 关卡放行。
      inputModalities: ['text', 'image'] as const,
    })))
  }

  override resolveModel(provider: string, model: string): Promise<LlmResolvedModelInfo> {
    const variant = this.variantOf(model)
    return Promise.resolve({
      provider,
      id: model,
      name: variant.name,
      inputModalities: ['text', 'image'],
      context: { contextWindow: this.config.contextWindow },
      // 推理等级跟随文本后端（DeepSeek 官方：off / high / max）；
      // 无图请求会把所选等级原样传给 DeepSeek，视觉请求会自动忽略。
      reasoning: {
        efforts: [
          { id: ReasoningEffortId('off'), name: 'Off' },
          { id: ReasoningEffortId('high'), name: 'High' },
          { id: ReasoningEffortId('max'), name: 'Max' },
        ],
        defaultEffort: ReasoningEffortId('high'),
      },
    })
  }

  override async * stream(options: GenerateOptions): AsyncIterable<StreamChunk> {
    const variant = this.variantOf(options.model)
    // 视觉路由只看"最后一条助手消息之后"的新图：
    // 历史旧图不触发视觉调用（避免把整段旧图历史塞给视觉模型）
    const lastAssistant = (() => {
      for (let i = options.messages.length - 1; i >= 0; i -= 1) {
        if (options.messages[i]?.role === 'assistant') return i
      }
      return -1
    })()
    const hasImage = options.messages
      .filter((_message, index) => index > lastAssistant)
      .some(message => contentHasImage(message.content))

    if (!hasImage) {
      // 文本请求：交给文本后端，原样透传（含推理等级等原始选项）。
      yield * this.sanitize(this.inner.stream({
        ...options,
        provider: variant.textProvider,
        model: variant.textModel,
      }))
      return
    }

    // 视觉请求：裁剪历史（只带最近 N 条），去掉推理等级（视觉模型未必支持），
    // 按池顺序轮换，直到一个成功或全部失败。
    const visionOptions: GenerateOptions = {
      ...options,
      reasoningEffort: undefined,
      messages: options.messages.slice(-this.config.contextMaxMessages),
    }
    const tried: string[] = []
    const failures: Array<{ label: string, message: string }> = []
    let last: unknown

    for (const entry of this.pool.ordered()) {
      const startedAt = Date.now()
      try {
        await this.pool.acquire(entry)
        this.status.set({ phase: 'calling', label: entry.label, tried })
        yield * this.sanitize(this.inner.stream({
          ...visionOptions,
          provider: entry.provider,
          model: entry.model,
        }))
        this.pool.recordSuccess(entry)
        const elapsedMs = Date.now() - startedAt
        this.status.set({ phase: 'success', label: entry.label, elapsedMs, tried })
        const elapsed = (elapsedMs / 1000).toFixed(1)
        this.status.report(
          tried.length > 0
            ? `vision-plus：⚠️ ${tried.join('、')} 失败后，图片已由 ${entry.label} 处理完成（${elapsed}s）`
            : `vision-plus：✅ 图片已由 ${entry.label} 处理完成（${elapsed}s）`,
        )
        return
      } catch (error: unknown) {
        last = error
        tried.push(entry.label)
        const classified = this.pool.recordFailure(entry, error)
        failures.push({ label: entry.label, message: classified.message })
        this.status.set({ phase: 'failed', label: entry.label, error: classified, tried })
      }
    }

    this.status.set({ phase: 'exhausted', label: undefined, tried })
    const detail = failures.map(failure => `${failure.label}(${failure.message})`).join('、')
    this.status.report(`vision-plus：❌ 视觉池 ${failures.length} 个模型全部失败（${detail}），已交由模型自行决策后续`)
    throw new LlmError(
      `vision-plus: 视觉池 ${failures.length} 个模型全部失败，请由 DeepSeek 自行决策后续：\n`
        + failures.map(failure => `- ${failure.label}: ${failure.message}`).join('\n'),
      'VISION_POOL_EXHAUSTED',
      { cause: last },
    )
  }

  /** 剥离 finish 块的内层 replayState，避免对外路由与重放状态不一致。
   *  注意：必须删除字段而不是置 undefined —— 会话持久化拒绝 undefined。 */
  private async * sanitize(iterable: AsyncIterable<StreamChunk>): AsyncIterable<StreamChunk> {
    for await (const chunk of iterable) {
      if (chunk.type === 'finish' && chunk.replayState !== undefined) {
        const { replayState: _ignored, ...rest } = chunk
        yield rest
      } else {
        yield chunk
      }
    }
  }

  private variantOf(model: string): Variant {
    const variant = this.config.variants.find(item => item.id === model)
    if (variant === undefined) {
      throw new LlmError(`vision-plus 没有模型 "${model}"`, 'UNKNOWN_MODEL')
    }
    return variant
  }
}