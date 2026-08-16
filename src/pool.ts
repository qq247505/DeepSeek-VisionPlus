export interface PoolEntry {
  id: string
  label: string
  provider: string
  model: string
}

/**
 * 视觉池：顺序轮换 + 免费模型保守限频 + 失败分类与冷却。
 *
 * 容错原则（公共插件）：
 * - 不兜底、不隐瞒：单个模型失败立即轮换下一个；全池失败把结构化错误抛回
 *   上层（DeepSeek 自行处理后续）；
 * - 免费模型必须节流：最小间隔 + 每分钟上限 + 失败冷却，避免 429 打爆额度。
 */

export interface ClassifiedError {
  kind: 'rate_limit' | 'timeout' | 'auth' | 'content' | 'network' | 'unknown'
  retriable: boolean
  message: string
}

export interface PoolFailure {
  entry: PoolEntry
  classified: ClassifiedError
}

/** 把上游错误归类成结构化信息，供轮换与最终报错使用。 */
export function classifyError(error: unknown): ClassifiedError {
  const code = (error as { code?: unknown } | null)?.code
  const codeText = typeof code === 'string' ? code : ''
  const message = error instanceof Error ? error.message : String(error)
  const text = `${codeText} ${message}`
  if (codeText === 'TIMEOUT' || codeText === 'ABORTED' || /timeout|timed out/i.test(text)) {
    return { kind: 'timeout', retriable: true, message: '请求超时' }
  }
  if (/429|rate.?limit|quota|too many|限流/i.test(text) || codeText === 'QUOTA_EXCEEDED') {
    return { kind: 'rate_limit', retriable: true, message: '触发限流(429)' }
  }
  if (codeText === 'MISSING_CREDENTIAL' || /401|403|invalid.*key|unauthorized|api key/i.test(text)) {
    return { kind: 'auth', retriable: false, message: '密钥无效或未配置' }
  }
  if (codeText === 'CONTEXT_WINDOW_EXCEEDED' || /context.*(window|length)|too_small|65536|tokens.*<=/i.test(text)) {
    return { kind: 'content', retriable: false, message: '内容超出上下文窗口' }
  }
  if (/ECONNREFUSED|ENOTFOUND|ECONNRESET|fetch failed|network|socket/i.test(text)) {
    return { kind: 'network', retriable: true, message: '网络错误' }
  }
  return { kind: 'unknown', retriable: false, message: message.slice(0, 120) }
}

interface EntryState {
  cooldownUntil: number
  lastRequestAt: number
  minuteCount: number
  minuteWindowStart: number
}

export class VisionPool {
  private readonly states = new Map<string, EntryState>()

  constructor(
    private readonly entries: () => readonly PoolEntry[],
    private readonly rateLimit: { minIntervalMs: number, maxPerMinute: number, cooldownMs: number },
  ) {}

  /** 当前可用的条目顺序（冷却中的排到后面，全冷却则全部返回）。 */
  ordered(): readonly PoolEntry[] {
    const now = Date.now()
    const current = this.entries()
    const usable = current.filter(entry => this.state(entry).cooldownUntil <= now)
    const cooling = current.filter(entry => this.state(entry).cooldownUntil > now)
    return [...usable, ...cooling]
  }

  /** 请求前获取许可：节流 + 每分钟上限。超限时抛错，由调用方轮换。 */
  async acquire(entry: PoolEntry): Promise<void> {
    const state = this.state(entry)
    const now = Date.now()
    if (now < state.cooldownUntil) {
      throw new Error(`[vision-plus] ${entry.label} 冷却中，剩余 ${Math.ceil((state.cooldownUntil - now) / 1000)}s`)
    }
    if (now - state.minuteWindowStart >= 60_000) {
      state.minuteWindowStart = now
      state.minuteCount = 0
    }
    if (state.minuteCount >= this.rateLimit.maxPerMinute) {
      throw new Error(`[vision-plus] ${entry.label} 超过每分钟 ${this.rateLimit.maxPerMinute} 次上限`)
    }
    const wait = state.lastRequestAt + this.rateLimit.minIntervalMs - now
    if (wait > 0) await new Promise(resolve => setTimeout(resolve, wait))
    state.minuteCount += 1
    state.lastRequestAt = Date.now()
  }

  recordSuccess(entry: PoolEntry): void {
    this.state(entry).cooldownUntil = 0
  }

  recordFailure(entry: PoolEntry, error: unknown): ClassifiedError {
    const classified = classifyError(error)
    const state = this.state(entry)
    if (classified.kind === 'rate_limit' || classified.kind === 'network' || classified.kind === 'timeout') {
      state.cooldownUntil = Date.now() + this.rateLimit.cooldownMs
    }
    return classified
  }

  private state(entry: PoolEntry): EntryState {
    let state = this.states.get(entry.id)
    if (state === undefined) {
      state = { cooldownUntil: 0, lastRequestAt: 0, minuteCount: 0, minuteWindowStart: 0 }
      this.states.set(entry.id, state)
    }
    return state
  }
}