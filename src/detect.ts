/** 检测 agent 当前是否有"待处理"的图片（最后一次 assistant 回复之后新出现的图片）。 */
function contentHasImage(content: unknown): boolean {
  if (!Array.isArray(content)) return false
  return content.some((block: unknown) => {
    if (block === null || typeof block !== 'object') return false
    const b = block as { type?: string, content?: unknown }
    if (b.type === 'image') return true
    if (b.type === 'tool-result') return contentHasImage(b.content)
    return false
  })
}

export function hasPendingImage(agent: { session?: { deriveMessages?: () => unknown } } | undefined): boolean {
  try {
    const messages = agent?.session && typeof agent.session.deriveMessages === 'function'
      ? agent.session.deriveMessages()
      : null
    if (!Array.isArray(messages)) return false
    let lastAssistant = -1
    for (let i = messages.length - 1; i >= 0; i--) {
      const m = messages[i] as { role?: string } | null
      if (m && m.role === 'assistant') { lastAssistant = i; break }
    }
    for (let i = lastAssistant + 1; i < messages.length; i++) {
      const m = messages[i] as { content?: unknown } | null
      if (contentHasImage(m?.content)) return true
    }
    return false
  } catch {
    return false
  }
}