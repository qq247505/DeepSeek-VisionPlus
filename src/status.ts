import type { ClassifiedError } from './pool.ts'

/**
 * 视觉调用状态跟踪器 + 待显示行队列 + 视觉记忆队列。
 *
 * 显示机制（harness 原生，零补丁）：
 * - agent/request 钩子与适配器写入状态行；
 * - agent/request 钩子把待显示行投递进 agent inbox（form:'notice'），
 *   下一轮/下一步装配时被领取，UI 渲染成对话里的紧凑一行；
 * - 视觉记忆：每次视觉调用结果写入记忆队列，投递为带标记的对话行，
 *   compaction 后由重水化钩子补回。
 */

export interface VisionStatus {
  phase: 'idle' | 'calling' | 'success' | 'failed' | 'exhausted'
  label?: string
  error?: ClassifiedError
  elapsedMs?: number
  tried?: string[]
}

export type StatusListener = (status: VisionStatus) => void

/** 视觉记忆条目：带稳定 key（图片+问题哈希）供 compaction 重水化比对 */
export interface VisionMemory {
  key: string
  text: string
}

export class StatusTracker {
  private listeners = new Set<StatusListener>()
  private current: VisionStatus = { phase: 'idle' }
  private pending: string[] = []
  private memories: VisionMemory[] = []

  subscribe(listener: StatusListener): () => void {
    this.listeners.add(listener)
    try {
      listener(this.current)
    } catch {
      // 监听器异常不影响主流程
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
        // 监听器异常不影响主流程
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

  /** 记录一条视觉记忆（compaction 重水化用）。 */
  pushMemory(memory: VisionMemory): void {
    this.memories.push(memory)
  }

  /** 取出并清空待投递的视觉记忆。 */
  drainMemories(): VisionMemory[] {
    const memories = this.memories
    this.memories = []
    return memories
  }

  get(): VisionStatus {
    return this.current
  }
}