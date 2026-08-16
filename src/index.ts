import { createUserMessage } from '@deepseek-ai/dsh-llm'
import { PiAiAdapter } from '@deepseek-ai/dsh-llm-pi-ai'
import { resolveProfiles } from '@deepseek-ai/dsh-llm-pi-ai/src/config.ts'
import type { Context } from '@deepseek-ai/cordis'
import type { PiAiProviderProfile } from '@deepseek-ai/dsh-llm-pi-ai'
import type {} from '@deepseek-ai/dsh-agent'
import type {} from '@deepseek-ai/dsh-system-prompt'
import { settingsNamespace } from '@deepseek-ai/dsh-settings'
import { Config } from './config.js'
import type { VisionPlusConfig } from './config.js'
import { VisionRouterAdapter } from './adapter.js'
import { VisionPool } from './pool.js'
import type { PoolEntry } from './pool.js'
import { StatusTracker } from './status.js'
import { hasPendingImage } from './detect.js'
import { DEFAULT_VISION_MODELS } from './settings-schema.js'


export const name = 'vision-plus'

export const inject = ['llm', 'credentials', 'attachments', 'settings']

/** 视觉线路存放在官方 llm-pi-ai 命名空间（Web 客户端唯一可读写模型配置的通道）。 */
const PI_NS = settingsNamespace('llm-pi-ai')

const TEXT_BASE_URL = 'https://api.deepseek.com'

interface PiSection {
  providers?: Record<string, unknown>
}

function buildProviders(piProviders: Record<string, unknown> | undefined): Record<string, PiAiProviderProfile> {
  const providers: Record<string, PiAiProviderProfile> = {}
  for (const [route, profile] of Object.entries(piProviders ?? {})) {
    if (route.startsWith('vp-')) {
      providers[route] = profile as PiAiProviderProfile
    }
  }
  return providers
}

/**
 * vision-plus：DeepSeek Harness 视觉插件（公共、零补丁）。
 *
 * - 设置页（自定义卡片"DeepSeek 免费视觉"）读写 llm-pi-ai 的视觉线路；
 * - 模型选择器两个包装变体；发图自动走视觉池；无图走 DeepSeek；
 * - 对话内友好状态行。
 */
export function apply(ctx: Context, config: unknown): void {
  const cfg = Config.parse(config ?? {}) as VisionPlusConfig

  // 0) 专用测试通道（第 8 个补丁）：apiproxy 的 visionPlus.test RPC 会取本服务。
  //     测试按官方对接方式真实发起：chat/completions + Bearer + 官方参数（视觉带测试图）。
  ctx.provide?.('vision-plus-test', {
    test: (input: { route: string }) => runVisionTest(ctx, input.route),
  })

  // 1) 首次启动植入 llm-pi-ai 设置（vp-deepseek 文本后端 + 保留用户已有平台）。
  //    llm-pi-ai 的命名空间可能在本插件之后才注册（加载顺序竞态），
  //    所以做成"重试式"：未注册/写入失败时不报错，等 2 秒再试（最多 15 次）。
  let implantAttempts = 0
  const runImplant = (): void => {
    if (implantAttempts >= 15) return
    implantAttempts += 1
    try {
      const section = ctx.settings.get(PI_NS) as PiSection | undefined
      const providers = section?.providers ?? {}
      // 构建期望的 providers（迁移 + 排序），整体一次性 set
      const finalProviders: Record<string, unknown> = {}
      finalProviders['vp-deepseek'] = providers['vp-deepseek'] ?? {
        displayName: 'DeepSeek',
        api: 'openai-completions',
        baseURL: TEXT_BASE_URL,
        apiKeyEnv: 'DEEPSEEK_API_KEY',
        models: [
          { id: 'deepseek-v4-pro', name: 'DeepSeek-V4-Pro', input: ['text'], contextWindow: 1048576 },
          { id: 'deepseek-v4-flash', name: 'DeepSeek-V4-Flash', input: ['text'], contextWindow: 1048576 },
        ],
      }
      // 迁移：旧单模型线路 vp-glm46v 并入 vp-glm 平台
      const legacy = providers['vp-glm46v']
      const glmCurrent = providers['vp-glm']
      if (legacy !== undefined && glmCurrent !== undefined) {
        const legacyModels = ((legacy as { models?: Array<{ id?: string }> }).models ?? []).filter(m => typeof m?.id === 'string')
        const glmModels = [...((glmCurrent as { models?: Array<{ id?: string }> }).models ?? [])]
        for (const m of legacyModels) {
          if (!glmModels.some(x => x?.id === m.id)) glmModels.push(m)
        }
        finalProviders['vp-glm'] = { ...(glmCurrent as object), models: glmModels }
      } else if (legacy !== undefined) {
        finalProviders['vp-glm'] = legacy
      } else if (glmCurrent !== undefined) {
        finalProviders['vp-glm'] = glmCurrent
      }
      // 视觉平台：只保留用户已有的（绝不自动添加缺失的预置平台）。
      // 预置平台只是"可添加的模板"，用户添加保存了什么，配置里才有什么。
      for (const model of DEFAULT_VISION_MODELS) {
        const route = `vp-${model.id}`
        if (providers[route] !== undefined && !(route in finalProviders)) finalProviders[route] = providers[route]
      }
      // 用户自定义平台（模板之外、非迁移源）追加在末尾
      const templateRoutes = new Set(DEFAULT_VISION_MODELS.map(model => `vp-${model.id}`))
      for (const [route, value] of Object.entries(providers)) {
        if (route.startsWith('vp-') && route !== 'vp-deepseek' && route !== 'vp-glm46v' && !templateRoutes.has(route) && !(route in finalProviders)) {
          finalProviders[route] = value
        }
      }
      // 规格升级：旧默认值 → 权威官方值（仅当值仍是旧默认或缺失时升级，不覆盖用户手动改过的值）
      const SPEC_UPGRADES: Record<string, Record<string, { contextWindow?: { from?: number, to: number }, maxTokens?: { from?: number, to: number } }>> = {
        'vp-deepseek': {
          'deepseek-v4-pro': { contextWindow: { from: 1000000, to: 1048576 } },
          'deepseek-v4-flash': { contextWindow: { from: 1000000, to: 1048576 } },
        },
        'vp-glm': {
          'glm-4.1v-thinking-flash': { contextWindow: { from: 128000, to: 65536 }, maxTokens: { to: 16384 } },
          'glm-4.6v-flash': { contextWindow: { from: 128000, to: 131072 }, maxTokens: { to: 32768 } },
        },
        'vp-siliconflow': {
          'Qwen/Qwen3-VL-8B-Instruct': { maxTokens: { to: 16384 } },
        },
      }
      // 提供方显示名升级：旧默认名 → 官方名称（仅当仍是旧默认名时替换）
      const DISPLAYNAME_UPGRADES: Record<string, { from: string[], to: string }> = {
        'vp-glm': { from: ['GLM-4.1V-Thinking-Flash（免费）'], to: '智谱（GLM）' },
        'vp-siliconflow': { from: ['SiliconFlow Qwen3-VL-8B（免费）', 'SiliconFlow（硅基流动）'], to: 'Qwen（千问）' },
      }
      for (const [route, upgrade] of Object.entries(DISPLAYNAME_UPGRADES)) {
        const provider = finalProviders[route]
        if (provider === undefined) continue
        if (upgrade.from.includes((provider as { displayName?: string }).displayName ?? '')) {
          finalProviders[route] = { ...(provider as object), displayName: upgrade.to }
        }
      }
      for (const [route, upgrades] of Object.entries(SPEC_UPGRADES)) {
        const provider = finalProviders[route]
        if (provider === undefined) continue
        const models = ((provider as { models?: Array<Record<string, unknown>> }).models ?? []).map(m => ({ ...m }))
        let changed = false
        for (const m of models) {
          const upgrade = upgrades[String(m.id ?? '')]
          if (upgrade === undefined) continue
          const cw = upgrade.contextWindow
          if (cw !== undefined) {
            const cur = m.contextWindow
            if ((typeof cur !== 'number' && cw.from === undefined) || cur === cw.from) {
              m.contextWindow = cw.to
              changed = true
            }
          }
          const mt = upgrade.maxTokens
          if (mt !== undefined) {
            const cur = m.maxTokens
            if ((typeof cur !== 'number' && mt.from === undefined) || cur === mt.from) {
              m.maxTokens = mt.to
              changed = true
            }
          }
        }
        if (changed) finalProviders[route] = { ...(provider as object), models }
      }
      if (JSON.stringify(providers) !== JSON.stringify(finalProviders)) {
        void ctx.settings.mutate(PI_NS, [{ op: 'set', path: ['providers'], value: finalProviders }])
          .then(() => {
            implantAttempts = 15 // 成功，不再重试
          })
          .catch(() => {
            // llm-pi-ai 尚未注册（或写入失败）：稍后重试，绝不把未处理拒绝抛给进程
            setTimeout(runImplant, 2000)
          })
      } else {
        implantAttempts = 15 // 无需变更，停止
      }
    } catch {
      // get 抛错（未注册）等情况：稍后重试
      setTimeout(runImplant, 2000)
    }
  }
  runImplant()

  // 2) 内部适配器：每次请求按当前 llm-pi-ai 设置解析（保存后实时生效）。
  const inner = new PiAiAdapter({
    profiles: () => {
      const section = ctx.settings.get(PI_NS) as PiSection | undefined
      return resolveProfiles(buildProviders(section?.providers))
    },
    resolveApiKey: async (_provider, profile) => {
      const ref = profile.apiKeyEnv
      if (typeof ref !== 'string' || ref.length === 0) return undefined
      try {
        const resolved = await ctx.credentials.resolve(ref as never)
        return resolved?.value ?? undefined
      } catch {
        return undefined
      }
    },
    resolveAttachments: () => (ctx.attachments as never) ?? undefined,
  })

  // 3) 视觉池 + 状态跟踪 + 注册路由。
  const poolOf = (): PoolEntry[] => {
    const section = ctx.settings.get(PI_NS) as PiSection | undefined
    const providers = section?.providers ?? {}
    const entries: PoolEntry[] = []
    for (const [route, raw] of Object.entries(providers)) {
      if (!route.startsWith('vp-') || route === 'vp-deepseek') continue
      const profile = raw as { displayName?: string, models?: Array<{ id?: string, name?: string }> }
      for (const m of profile.models ?? []) {
        if (typeof m?.id !== 'string' || m.id.length === 0) continue
        entries.push({ id: `${route}/${m.id}`, label: m.name ?? m.id, provider: route, model: m.id })
      }
    }
    return entries
  }
  const pool = new VisionPool(poolOf, cfg.rateLimit)
  const status = new StatusTracker()
  const adapter = new VisionRouterAdapter(cfg, inner, pool, status)
  ctx.llm.registerAdapter([cfg.providerId], adapter)

  // 4) 状态行投递：把视觉调用的结果行/进行中行注入对话。
  ctx.on('agent/request', async (payload, next) => {
    const base = await next()
    const agent = payload.agent
    const push = (text: string, summary: string): void => {
      agent.inject(
        createUserMessage({
          content: [{ type: 'text', text }],
          source: { kind: 'plugin', plugin: 'vision-plus', form: 'notice', summary },
        }),
      )
    }
    try {
      const lines = status.drainAll()
      if (lines.length > 0) push(lines.join('\n'), lines[0] ?? 'vision-plus')
    } catch {
      // 状态行只是增强显示，失败不影响主流程
    }
    try {
      if (hasPendingImage(agent as never)) {
        const first = pool.ordered()[0]
        if (first !== undefined) {
          status.set({ phase: 'calling', label: first.label, tried: [] })
          push(`vision-plus：🔍 正在调用 ${first.label} 处理图片…`, `vision-plus：🔍 正在调用 ${first.label} 处理图片…`)
        }
      }
    } catch {
      // 忽略
    }
    return base
  })
  ctx.logger.info(`vision-plus: provider "${cfg.providerId}" 就绪`)
}

// —— 专用测试通道实现（官方对接方式） ——

/** 内置测试图（64x64 红底白圆），视觉模型可明确识别 */
const TEST_IMAGE_DATA_URL = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAFUSURBVHhe7ZJLqsQwDATfcXL/87y7zODFgDCVxB85sVA31KYXTqvI3/9xfDIjAVRmQgKozIQEUJkJCaAyE48JGAm9481SAZ6h9z1YImBl6HszuAp4MvT9EdwEvBHa0YuLgDdDe3qYFrBDaFcrUwJ2Cu1rYVjAjqGddwwJ2Dm094puARFCu8+QACrPiBTaT0gAlUTE0B01EkAlETF0R02TgMiheywSQGVN5NA9FgmgsiZy6B6LBFBpiR66yaI/gMqayKF7LBJAZU3k0D0WCaCyJnLoHkuTgELE0B01EkAlETF0R02zgEKk0H5CAqi8IkJo9xkSQOUdO4f2XjEkoLBjaOcdwwIKO4X2tTAloLBDaFcr0wIKb4b29OAioPBGaEcvbgIKT4a+P4KrgB8rQ9+bYYmAH56h9z1YKsAyEnrHm8cE7IoEUJkJCaAyExJAZSaSCzg+X6k2ZiCQeXWMAAAAAElFTkSuQmCC'

interface TestProviderProfile {
  baseURL?: string
  apiKeyEnv?: string
  models?: Array<{ id?: string }>
}

/** 从平台错误响应里提取可读信息 */
function extractApiMessage(text: string): string {
  try {
    const parsed = JSON.parse(text) as { error?: { message?: string }, message?: string }
    return (parsed.error?.message ?? parsed.message ?? '').slice(0, 160)
  } catch {
    return text.slice(0, 160)
  }
}

/**
 * 按官方对接文档真实测试一条线路：
 * - 视觉线路：POST {baseURL}/chat/completions，Bearer 密钥，content 带 image_url(base64 测试图) + 文本；
 * - DeepSeek 文本线路：同样接口，纯文本。
 * 返回 { ok, reply | reason }，由 apiproxy 的 visionPlus.test RPC 回传给设置页。
 */
async function runVisionTest(ctx: Context, route: string): Promise<{ ok: boolean, reply?: string, reason?: string }> {
  try {
    const section = ctx.settings.get(PI_NS) as PiSection | undefined
    const raw = section?.providers?.[route] as TestProviderProfile | undefined
    if (raw === undefined) return { ok: false, reason: `未找到线路 ${route}（请先保存）` }
    const baseURL = (raw.baseURL ?? '').trim()
    if (!/^https?:\/\//i.test(baseURL)) return { ok: false, reason: 'API 地址不合法（需以 http(s):// 开头）' }
    const model = raw.models?.[0]?.id
    if (typeof model !== 'string' || model.length === 0) return { ok: false, reason: '模型目录里没有有效的模型 ID' }
    const keyRef = raw.apiKeyEnv
    let key: string | undefined
    try {
      const resolved = await ctx.credentials.resolve(keyRef as never)
      key = resolved?.value
    } catch {
      key = undefined
    }
    if (typeof key !== 'string' || key.length === 0) return { ok: false, reason: `未配置 API 密钥（${keyRef ?? '未知'}）` }

    const isVision = route !== 'vp-deepseek'
    // 智谱官方文档：image_url.url 直接传 base64（不带 data: 前缀）；
    // OpenAI 兼容端点（SiliconFlow 等）用完整 data URL。
    const imageUrl = /bigmodel\.cn/i.test(baseURL)
      ? TEST_IMAGE_DATA_URL.replace(/^data:image\/png;base64,/, '')
      : TEST_IMAGE_DATA_URL
    const content: unknown = isVision
      ? [
          { type: 'image_url', image_url: { url: imageUrl } },
          { type: 'text', text: '请只回复两个字：OK' },
        ]
      : '请只回复两个字：OK'
    const body = {
      model,
      messages: [{ role: 'user', content }],
      max_tokens: isVision ? 1024 : 32,
      stream: false,
    }
    const controller = new AbortController()
    const timer = setTimeout(() => controller.abort(), 30_000)
    let response: Response
    try {
      response = await fetch(`${baseURL.replace(/\/+$/, '')}/chat/completions`, {
        method: 'POST',
        headers: {
          'content-type': 'application/json',
          authorization: `Bearer ${key}`,
        },
        body: JSON.stringify(body),
        signal: controller.signal,
      })
    } catch (error) {
      clearTimeout(timer)
      return {
        ok: false,
        reason: error instanceof Error && error.name === 'AbortError'
          ? '请求超时（30 秒）'
          : `网络请求失败：${String(error).slice(0, 120)}`,
      }
    }
    clearTimeout(timer)
    if (!response.ok) {
      const text = await response.text().catch(() => '')
      const detail = extractApiMessage(text)
      let reason = `HTTP ${response.status}${detail !== '' ? `：${detail}` : ''}`
      if (response.status === 401 || response.status === 403) reason = `密钥无效或被拒绝（${response.status}）`
      else if (response.status === 404) reason = `接口或模型不存在（${response.status}）`
      else if (response.status === 429) reason = '触发限流（429），请稍后再试'
      return { ok: false, reason }
    }
    const data = await response.json().catch(() => null) as { choices?: Array<{ message?: { content?: string } }> } | null
    // 去掉思考模型的 <think> 推理块，只留最终回答
    const cleaned = (data?.choices?.[0]?.message?.content ?? '').replace(/<think>[\s\S]*?<\/think>/g, '').trim()
    if (cleaned.length === 0) return { ok: false, reason: '接口返回为空' }
    return { ok: true, reply: cleaned.slice(0, 200) }
  } catch (error) {
    return { ok: false, reason: `测试异常：${String(error).slice(0, 120)}` }
  }
}