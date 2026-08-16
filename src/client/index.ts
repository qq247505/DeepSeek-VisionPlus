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

    // 1) 设置卡片：只挂在官方"模型"页内（settings.models.extra 槽，由安装时的增强补丁提供）。
    //    槽缺失 = 增强补丁未应用 → 直接失败并输出原因，不做任何降级。
    const slotsWithVersion = ctx as Context & { slots: SlotsFace & { getVersion?: (name: string) => unknown } }
    if (slotsWithVersion.slots.getVersion?.('settings.models.extra') === undefined) {
      throw new Error('[dsh-visionplus] 增强补丁未应用：模型页槽 settings.models.extra 不存在。请重新安装插件（安装脚本会自动应用补丁），或手动执行插件内 patches\\增强补丁.bat')
    }
    slots.inject('settings.models.extra', () => slots.register({
      name: 'settings.models.extra',
      id: 'vision-plus-card',
      order: 10,
      inject: () => ({ api }),
    }, VisionSettingsPage))

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