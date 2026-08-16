import type { Context } from '@deepseek-ai/cordis'
import { ImageButton } from './image-button.js'
import { VisionSettingsPage } from './settings-page.js'

export const name = 'vision-plus'

export const inject = ['slots', 'connection', 'modelDirectories']

/** slots / connection 服务由 harness 客户端组合提供；类型上做轻量擦除。 */
interface SlotsFace {
  inject: (name: string, factory: () => unknown) => void
  register: (options: unknown, component: unknown) => unknown
}

interface ConnectionFace {
  api: unknown
}

/** 浏览器端：设置页（DeepSeek VisionPlus）+ 输入框图片图标。 */
export function apply(ctx: Context): void {
  try {
    const slots = (ctx as Context & { slots: SlotsFace }).slots
    const api = (ctx as Context & { connection: ConnectionFace }).connection.api

    // 1) 设置卡片：官方自带的 settings.section 槽（零补丁），设置页出现独立栏目。
    try {
      slots.inject('settings.section', () => slots.register({
        name: 'settings.section',
        id: 'vision-plus',
        order: 20,
        label: () => 'DeepSeek VisionPlus',
        inject: () => ({ api }),
      }, VisionSettingsPage))
    } catch (error) {
      console.error('[vision-plus] 设置卡片注册失败:', error)
    }

    // 2) 输入框图片图标（Codex 式，占官方 input.left 座）
    slots.inject('conversation.input.left', () => slots.register({
      name: 'conversation.input.left',
      id: 'vision-plus-image',
      order: 10,
      inject: () => ({
        api,
        modelDirectories: (ctx as Context & { modelDirectories?: unknown }).modelDirectories,
      }),
    }, ImageButton))

    console.log('[vision-plus] client apply ok, slots registered')
  } catch (error) {
    console.error('[vision-plus] client apply failed:', error)
  }
}