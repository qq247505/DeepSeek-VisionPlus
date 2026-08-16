import { createUserMessage } from '@deepseek-ai/dsh-llm'
import { PiAiAdapter } from '@deepseek-ai/dsh-llm-pi-ai'
import { resolveProfiles } from '@deepseek-ai/dsh-llm-pi-ai/src/config.ts'
import type { Context } from '@deepseek-ai/cordis'
import type { PiAiProviderProfile } from '@deepseek-ai/dsh-llm-pi-ai'
import type {} from '@deepseek-ai/dsh-agent'
import type {} from '@deepseek-ai/dsh-system-prompt'
// 类型增强：ctx.settings（设置服务）与 ctx.webServer（路由注册）
import { installSettingsSection } from '@deepseek-ai/dsh-settings'
import type {} from '@deepseek-ai/dsh-settings'
import { Config } from './config.js'
import type { VisionPlusConfig } from './config.js'
import { VisionRouterAdapter } from './adapter.js'
import { VisionPool } from './pool.js'
import type { PoolEntry } from './pool.js'
import { StatusTracker } from './status.js'
import { hasPendingImage } from './detect.js'
import { DEFAULT_VISION_MODELS, DEEPSEEK_MODELS_DEFAULT, settingsSchema } from './settings-schema.js'
import type { VisionPlusSettings } from './settings-schema.js'
import type { IncomingMessage, ServerResponse } from 'node:http'


export const name = 'vision-plus'

export const inject = ['llm', 'credentials', 'attachments', 'settings', 'agentDefaultModel', 'webServer']

/** 设置存放在插件自有命名空间 vision-plus（零补丁：不借用 llm-pi-ai，内部线路不进模型选择器）。 */
const NS = 'vision-plus' as never

/** 文本后端（DeepSeek）与视觉池线路转成 pi-ai 内部 profile（只供本插件调用，不注册进宿主目录）。 */
function buildProfiles(settings: VisionPlusSettings): Record<string, PiAiProviderProfile> {
  const providers: Record<string, PiAiProviderProfile> = {}
  const textModels = settings.text.models.length > 0 ? settings.text.models : DEEPSEEK_MODELS_DEFAULT
  providers['vp-deepseek'] = {
    displayName: 'DeepSeek',
    api: 'openai-completions',
    baseURL: settings.text.baseURL || 'https://api.deepseek.com',
    apiKeyEnv: settings.text.apiKeyEnv || 'DEEPSEEK_API_KEY',
    models: textModels.map(m => ({
      id: m.id,
      name: m.name ?? m.id,
      input: ['text'] as const,
      ...(m.contextWindow === undefined ? {} : { contextWindow: m.contextWindow }),
      ...(m.maxTokens === undefined ? {} : { maxTokens: m.maxTokens }),
    })),
  }
  settings.visionModels.forEach((vm, index) => {
    providers[`vp-vision-${index}`] = {
      displayName: vm.displayName,
      api: 'openai-completions',
      baseURL: vm.baseURL,
      apiKeyEnv: vm.apiKeyEnv,
      models: vm.models.map(m => ({
        id: m.id,
        name: m.name ?? m.id,
        input: ['text', 'image'] as const,
        ...(m.contextWindow === undefined ? {} : { contextWindow: m.contextWindow }),
        ...(m.maxTokens === undefined ? {} : { maxTokens: m.maxTokens }),
      })),
    }
  })
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

  // 0) 专用测试通道（零补丁）：插件用官方 webServer 服务自挂 HTTP 接口，
  //     测试按官方对接方式真实发起：chat/completions + Bearer + 官方参数（视觉带测试图）。
  interface WebServerFace {
    register: (route: { kind: 'exact', path: string, handler: (req: IncomingMessage, res: ServerResponse) => void | Promise<void> }) => () => void
  }
  const webServer = (ctx as unknown as { webServer?: WebServerFace }).webServer
  if (webServer === undefined) {
    ctx.logger.warn('vision-plus: webServer 服务不可用，测试通道不可用')
  } else {
    webServer.register({
    kind: 'exact',
    path: '/api/visionPlus.test',
    handler: async (req, res) => {
      let responseSent = false
      const respond = (status: number, body: unknown): void => {
        if (responseSent) return
        responseSent = true
        res.writeHead(status, { 'content-type': 'application/json' })
        res.end(JSON.stringify(body))
      }
      try {
        let raw = ''
        for await (const chunk of req) raw += chunk as string
        const parsed = JSON.parse(raw) as { rpcId?: string, payload?: { route?: string } }
        const route = parsed.payload?.route
        if (route === undefined || route.length === 0) {
          respond(200, { type: 'server-response', rpcId: parsed.rpcId ?? '', result: { ok: true, value: { ok: false, reason: '缺少 route 参数' } } })
          return
        }
        const value = await runVisionTest(ctx, route)
        respond(200, { type: 'server-response', rpcId: parsed.rpcId ?? '', result: { ok: true, value } })
      } catch (error) {
        respond(200, { type: 'server-response', rpcId: '', result: { ok: false, error: { code: 'internal', message: error instanceof Error ? error.message : String(error) } } })
      }
    },
    })
  }

  // 1) 设置命名空间注册（自有 vision-plus）+ 旧配置迁移 + 自挂设置读写接口。
  const defaults = (): VisionPlusSettings => ({
    text: { baseURL: 'https://api.deepseek.com', apiKeyEnv: 'DEEPSEEK_API_KEY', models: DEEPSEEK_MODELS_DEFAULT.map(m => ({ ...m })) },
    visionModels: [],
  })
  let sourceThunk: () => VisionPlusSettings = () => defaults()
  installSettingsSection(ctx, NS, settingsSchema, defaults(), {
    setSource: (thunk) => { sourceThunk = thunk },
    onChange: () => {},
  })
  const readSettings = (): VisionPlusSettings => {
    try { return sourceThunk() } catch { return defaults() }
  }

  // 旧配置迁移：llm-pi-ai 里的 vp-* 线路 → 自有命名空间（仅一次；成功或无需迁移即停）
  let migrateAttempts = 0
  const migrateLegacy = (): void => {
    if (migrateAttempts >= 15) return
    migrateAttempts += 1
    try {
      const legacy = ctx.settings.get('llm-pi-ai' as never) as { providers?: Record<string, unknown> } | undefined
      const providers = legacy?.providers ?? {}
      const vpRoutes = Object.keys(providers).filter(route => route.startsWith('vp-') && route !== 'vp-deepseek')
      const current = readSettings()
      if (vpRoutes.length === 0 || current.visionModels.length > 0) {
        migrateAttempts = 15
        return
      }
      const visionModels: VisionPlusSettings['visionModels'] = vpRoutes.map((route, index) => {
        const raw = providers[route] as {
          displayName?: string
          baseURL?: string
          apiKeyEnv?: string
          models?: Array<{ id?: string, name?: string, contextWindow?: number, maxTokens?: number }>
        }
        return {
          id: `vp-${index}`,
          displayName: raw.displayName ?? route,
          baseURL: raw.baseURL ?? '',
          apiKeyEnv: raw.apiKeyEnv ?? '',
          models: (raw.models ?? []).filter(m => typeof m?.id === 'string' && m.id.length > 0).map(m => ({
            id: m.id as string,
            name: m.name ?? m.id,
            ...(m.contextWindow === undefined ? {} : { contextWindow: m.contextWindow }),
            ...(m.maxTokens === undefined ? {} : { maxTokens: m.maxTokens }),
          })),
        }
      })
      const textModels: VisionPlusSettings['text']['models'] = ((providers['vp-deepseek'] as { models?: Array<{ id?: string, name?: string, contextWindow?: number }> } | undefined)?.models ?? DEEPSEEK_MODELS_DEFAULT)
        .filter(m => typeof m?.id === 'string')
        .map(m => ({ id: m.id as string, name: m.name ?? m.id, ...(m.contextWindow === undefined ? {} : { contextWindow: m.contextWindow }) }))
      const migrated: VisionPlusSettings = {
        text: { baseURL: 'https://api.deepseek.com', apiKeyEnv: 'DEEPSEEK_API_KEY', models: textModels },
        visionModels,
      }
      void ctx.settings.replace(NS, migrated).then(() => {
        // 清掉 llm-pi-ai 里的 vp-*（保留非 vp-* 提供方）
        const remaining: Record<string, unknown> = {}
        for (const [route, value] of Object.entries(providers)) {
          if (!route.startsWith('vp-')) remaining[route] = value
        }
        void ctx.settings.replace('llm-pi-ai' as never, { providers: remaining }).catch(() => { /* 忽略 */ })
        migrateAttempts = 15
      }).catch(() => {
        // 未注册/写入失败：稍后重试
        setTimeout(migrateLegacy, 2000)
      })
    } catch {
      setTimeout(migrateLegacy, 2000)
    }
  }
  migrateLegacy()

  /** 解析设置引用的全部密钥（供界面自动填入；未配置的返回空） */
  const resolveKeys = async (settings: VisionPlusSettings): Promise<Record<string, string>> => {
    const refs = new Set<string>()
    if (settings.text.apiKeyEnv !== undefined && settings.text.apiKeyEnv !== '') refs.add(settings.text.apiKeyEnv)
    for (const vm of settings.visionModels) {
      if (vm.apiKeyEnv !== undefined && vm.apiKeyEnv !== '') refs.add(vm.apiKeyEnv)
    }
    const out: Record<string, string> = {}
    for (const ref of refs) {
      try {
        const resolved = await ctx.credentials.resolve(ref as never)
        if (resolved?.value !== undefined) out[ref] = resolved.value
      } catch { /* 未配置则忽略 */ }
    }
    return out
  }

  // 自挂设置读写接口（零补丁；浏览器端设置页通过本接口读写）
  if (webServer !== undefined) {
    webServer.register({
      kind: 'exact',
      path: '/api/visionPlus.settings',
      handler: async (req, res) => {
        let sent = false
        const respond = (body: unknown): void => {
          if (sent) return
          sent = true
          res.writeHead(200, { 'content-type': 'application/json' })
          res.end(JSON.stringify(body))
        }
        try {
          if ((req.method ?? 'GET').toUpperCase() === 'GET') {
            const settings = readSettings()
            const keys = await resolveKeys(settings)
            respond({ type: 'server-response', rpcId: '', result: { ok: true, value: { settings, keys } } })
            return
          }
          let raw = ''
          for await (const chunk of req) raw += chunk as string
          const parsed = JSON.parse(raw) as { settings?: VisionPlusSettings }
          const next = parsed.settings
          if (next === undefined) {
            respond({ type: 'server-response', rpcId: '', result: { ok: false, error: { code: 'bad-request', message: '缺少 settings 参数' } } })
            return
          }
          await ctx.settings.replace(NS, next)
          respond({ type: 'server-response', rpcId: '', result: { ok: true, value: { settings: readSettings(), keys: await resolveKeys(next) } } })
        } catch (error) {
          respond({ type: 'server-response', rpcId: '', result: { ok: false, error: { code: 'internal', message: error instanceof Error ? error.message : String(error) } } })
        }
      },
    })
  }

  // 1.4) 视觉记忆 compaction 重水化：压缩摘要遮蔽近期视觉记忆后自动补回
  const MEMORY_MARKER = '【视觉记忆·'
  try {
    const beforeCompaction = new WeakMap<object, string[]>()
    const memoryLinesOf = (session: { deriveMessages?: () => Array<{ content?: unknown }> }): string[] => {
      const lines: string[] = []
      for (const message of session.deriveMessages?.() ?? []) {
        const blocks = message.content
        if (!Array.isArray(blocks)) continue
        for (const block of blocks) {
          const text = (block as { type?: string, text?: string }).text
          if (typeof text === 'string' && text.includes(MEMORY_MARKER)) lines.push(text)
        }
      }
      return lines
    }
    ctx.on('session/event', (session, event) => {
      const anyEvent = event as { type?: string, data?: { error?: unknown } }
      const anySession = session as { deriveMessages?: () => Array<{ content?: unknown }>, append?: (type: string, message: unknown) => void }
      if (anyEvent.type === 'compaction/summary') {
        beforeCompaction.set(session as object, memoryLinesOf(anySession))
        return
      }
      if (anyEvent.type !== 'compaction/end') return
      const before = beforeCompaction.get(session as object) ?? []
      beforeCompaction.delete(session as object)
      if (anyEvent.data?.error !== undefined || before.length === 0 || anySession.append === undefined) return
      queueMicrotask(() => {
        try {
          const visible = new Set(memoryLinesOf(anySession))
          const missing = before.filter(line => !visible.has(line)).slice(-4)
          const appendFn = anySession.append
          if (appendFn === undefined || missing.length === 0) return
          for (const line of missing) {
            appendFn('user/message', createUserMessage({
              content: [{ type: 'text', text: line }],
              source: { kind: 'plugin', plugin: 'vision-plus', form: 'notice', summary: line.slice(0, 80) },
            }))
          }
          if (missing.length > 0) ctx.logger.info(`vision-plus: compaction 后补回 ${missing.length} 条视觉记忆`)
        } catch {
          // 补回失败不影响主流程
        }
      })
    })
  } catch (error) {
    ctx.logger.warn(`vision-plus: 视觉记忆重水化安装失败: ${String(error)}`)
  }

  // 1.5) 会话级切换（零补丁）：运行时接管 agentDefaultModel.saveSelection。
  //      该方法的唯一调用方是 session.selectModel（已核实），吞掉 = "切换只影响当前会话"。
  try {
    const defaultModelService = ctx.get('agentDefaultModel') as unknown as { saveSelection: (next: unknown) => Promise<void> } | undefined
    if (defaultModelService !== undefined && typeof defaultModelService.saveSelection === 'function') {
      defaultModelService.saveSelection = async () => {
        // 会话级切换：不写全局默认模型
      }
    }
  } catch {
    ctx.logger.warn('vision-plus: agentDefaultModel 服务不可用，会话级切换回退为官方行为')
  }

  // 2) 内部适配器：每次请求按当前设置解析（保存后实时生效）。
  const inner = new PiAiAdapter({
    profiles: () => resolveProfiles(buildProfiles(readSettings())),
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
    const settings = readSettings()
    const entries: PoolEntry[] = []
    settings.visionModels.forEach((vm, index) => {
      const provider = `vp-vision-${index}`
      for (const m of vm.models) {
        if (typeof m?.id !== 'string' || m.id.length === 0) continue
        entries.push({ id: `${provider}/${m.id}`, label: m.name ?? m.id, provider, model: m.id })
      }
    })
    return entries
  }
  const pool = new VisionPool(poolOf, cfg.rateLimit)
  const status = new StatusTracker()
  const adapter = new VisionRouterAdapter(cfg, inner, pool, status, (payload) => {
    status.pushMemory({ key: payload.key, text: payload.text.slice(0, 300) })
  })
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
      const memories = status.drainMemories()
      for (const memory of memories) {
        const memoryText = `【视觉记忆·${memory.key.slice(0, 12)}】${memory.text}`
        push(memoryText, `视觉记忆：${memory.text.slice(0, 60)}`)
      }
    } catch {
      // 记忆投递失败不影响主流程
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
    const rawSettings = (() => {
      try { return ctx.settings.get(NS) as VisionPlusSettings | undefined } catch { return undefined }
    })()
    const settings = rawSettings ?? {
      text: { baseURL: 'https://api.deepseek.com', apiKeyEnv: 'DEEPSEEK_API_KEY', models: DEEPSEEK_MODELS_DEFAULT.map(m => ({ ...m })) },
      visionModels: [],
    }
    let raw: TestProviderProfile
    if (route === 'vp-deepseek') {
      raw = {
        baseURL: settings.text.baseURL,
        apiKeyEnv: settings.text.apiKeyEnv,
        models: settings.text.models.map(m => ({ id: m.id })),
      }
    } else {
      const m = /^vp-vision-(\d+)$/.exec(route)
      const vm = m === null ? undefined : settings.visionModels[Number(m[1])]
      if (vm === undefined) return { ok: false, reason: `未找到视觉模型 ${route}（请先保存）` }
      raw = {
        baseURL: vm.baseURL,
        apiKeyEnv: vm.apiKeyEnv,
        models: vm.models.map(item => ({ id: item.id })),
      }
    }
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
      max_tokens: 1024,
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