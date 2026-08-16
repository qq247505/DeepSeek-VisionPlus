import { useRef, useState, useSyncExternalStore } from 'react'

/** 内联 SVG 图片图标（Codex 客户端同款"相片"图标风格）。 */
const ICON = 'data:image/svg+xml;utf8,' + encodeURIComponent(
  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="5" width="18" height="14" rx="2"/><circle cx="8.5" cy="10" r="1.5"/><path d="M21 15.5l-5-5-9 9"/></svg>',
)

interface ImageButtonProps {
  input: { imageIds: readonly string[] } | undefined
  inputActions: { addImages: (files: File[]) => boolean | undefined } | undefined
  sessionId?: string
  /** 官方模型选择服务：每个会话一个共享目录（订阅驱动，非轮询） */
  modelDirectories?: {
    directoryFor: (sessionId: string) => {
      store: {
        getSnapshot: () => { current: { model: string } | null }
        subscribe: (listener: () => void) => () => void
      }
    }
  }
}

/** 本插件的两个视觉变体模型 ID（只有选中它们时才显示图片按钮） */
const VISION_MODEL_IDS = ['deepseek-v4-pro-visionplus', 'deepseek-v4-flash-visionplus']

/**
 * 输入框图片图标（占官方预留的 conversation.input.left 座）。
 * 点击弹出系统文件选择器，选中后经 inputActions.addImages 进入草稿，
 * 缩略图由 harness 自带 AttachmentRail 展示；粘贴/拖拽原生支持不变。
 */
export function ImageButton({ inputActions, sessionId, modelDirectories }: ImageButtonProps): React.ReactElement {
  const fileRef = useRef<HTMLInputElement | null>(null)
  const [busy, setBusy] = useState(false)

  // 订阅官方模型选择目录（与模型选择器同一数据源）：模型切换即推送，无需轮询。
  const directory = sessionId !== undefined && modelDirectories !== undefined
    ? modelDirectories.directoryFor(sessionId)
    : undefined
  const currentModel = useSyncExternalStore(
    listener => directory?.store.subscribe(listener) ?? (() => {}),
    () => directory?.store.getSnapshot().current ?? null,
  )
  const visible = currentModel !== null && VISION_MODEL_IDS.includes(currentModel.model)

  if (!visible) return <></>

  const pick = (): void => {
    fileRef.current?.click()
  }
  const onChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    const files = Array.from(event.target.files ?? [])
    event.target.value = ''
    if (files.length === 0 || inputActions === undefined) return
    setBusy(true)
    try {
      inputActions.addImages(files)
    } finally {
      setBusy(false)
    }
  }

  return (
    <>
      <input
        ref={fileRef}
        type="file"
        accept="image/png,image/jpeg,image/webp,image/gif"
        multiple
        hidden
        onChange={onChange}
      />
      <button
        type="button"
        onClick={pick}
        disabled={busy || inputActions === undefined}
        aria-label="添加图片"
        title="添加图片（也可直接粘贴或拖拽）"
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: '28px',
          height: '28px',
          padding: 0,
          border: 'none',
          borderRadius: '6px',
          background: 'transparent',
          color: 'var(--icon, currentColor)',
          opacity: inputActions === undefined ? 0.4 : 0.75,
          cursor: inputActions === undefined ? 'default' : 'pointer',
        }}
        onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.opacity = '1' }}
        onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.opacity = inputActions === undefined ? '0.4' : '0.75' }}
      >
        <img src={ICON} alt="" width={17} height={17} style={{ display: 'block' }} />
      </button>
    </>
  )
}