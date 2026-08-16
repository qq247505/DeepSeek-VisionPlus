import type { ClassifiedError } from './pool.ts'

/**
 * 视觉调用状态跟踪器 + 待显示行队列。
 *
 * 显示机制（harness 原生，零补丁）：
 * - agent/request 钩子与适配器写入状态行；
 * - agent/request 钩子把待显示行投递进 agent inbox（form:'notice'），
 *   下一轮/下一步装配时被领取，UI 渲染成对话里的紧凑一行：
 *     🔍 正在调用 GLM 视觉处理图片…
 *     ✅ 图片已由 GLM 视觉处理完成（2.3s）
 *     ❌ 视觉池 3 个模型全部失败，已交由模型自行处理
 */

export interface VisionStatus {
  phase: 'idle' | 'calling' | 'success' | 'failed' | 'exhausted'
  label?: string
  error?: ClassifiedError
  elapsedMs?: number
  tried?: string[]
}

export type StatusListener = (status: VisionStatus) => void

export class StatusTracker {
  private listeners = new Set<StatusListener>()
  private current: VisionStatus = { phase: 'idle' }
  private pending: string[] = []

  subscribe(listener: StatusListener): () => void {
    this.listeners.add(listener)
    try {
      listener(this.current)
    } catch {
      // 监听者异常不影响主流程
    }
    return () => {
      this.listeners.delete(listener)
    }
  }

  set(next: VisionStatus): void {
    this.current = next
    for (const listener of this.listeners) {
      try {
        listener(next)
      } catch {
        // 监听者异常不影响主流程
      }
    }
  }

  /** 追加一条待显示行。 */
  report(line: string): void {
    this.pending.push(line)
  }

  /** 取出并清空全部待显示行（无则空数组）。 */
  drainAll(): string[] {
    const lines = this.pending
    this.pending = []
    return lines
  }

  get(): VisionStatus {
    return this.current
  }
}