import z from '@deepseek-ai/schemastery'

/**
 * vision-plus 插件自己的设置命名空间（vision-plus）。
 * 零补丁设计：不再借用 llm-pi-ai 的 providers（那样会被内置 pi-ai 注册进
 * 模型选择器，需要宿主补丁隐藏）。读写走插件自挂的 HTTP 接口。
 */

const optionalString = z.union([z.string(), z.const(undefined)])
const optionalNatural = z.union([z.natural(), z.const(undefined)])

const modelSchema = z.object({
  id: z.string(),
  name: optionalString,
  contextWindow: optionalNatural,
  maxTokens: optionalNatural,
})

const visionProviderSchema = z.object({
  id: z.string(),
  displayName: z.string(),
  baseURL: z.string(),
  apiKeyEnv: z.string(),
  models: z.array(modelSchema),
})

export const settingsSchema = z.object({
  text: z.object({
    baseURL: z.string().default('https://api.deepseek.com'),
    apiKeyEnv: z.string().default('DEEPSEEK_API_KEY'),
    models: z.array(modelSchema),
  }),
  visionModels: z.array(visionProviderSchema),
})

export type VisionPlusSettings = {
  text: {
    baseURL: string
    apiKeyEnv: string
    models: Array<{ id: string, name?: string, contextWindow?: number, maxTokens?: number }>
  }
  visionModels: Array<{
    id: string
    displayName: string
    baseURL: string
    apiKeyEnv: string
    models: Array<{ id: string, name?: string, contextWindow?: number, maxTokens?: number }>
  }>
}

/** DeepSeek 文本后端默认模型（官方规格 1M 上下文） */
export const DEEPSEEK_MODELS_DEFAULT: VisionPlusSettings['text']['models'] = [
  { id: 'deepseek-v4-pro', name: 'DeepSeek-V4-Pro', contextWindow: 1048576 },
  { id: 'deepseek-v4-flash', name: 'DeepSeek-V4-Flash', contextWindow: 1048576 },
]

/** 预置免费视觉模型模板（权威官方规格） */
export const DEFAULT_VISION_MODELS: VisionPlusSettings['visionModels'] = [
  {
    id: 'glm',
    displayName: '智谱（GLM）',
    baseURL: 'https://open.bigmodel.cn/api/paas/v4',
    apiKeyEnv: 'GLM_API_KEY',
    models: [
      { id: 'glm-4.1v-thinking-flash', name: 'GLM-4.1V-Thinking-Flash', contextWindow: 65536, maxTokens: 16384 },
      { id: 'glm-4.6v-flash', name: 'GLM-4.6V-Flash', contextWindow: 131072, maxTokens: 32768 },
    ],
  },
  {
    id: 'siliconflow',
    displayName: 'Qwen（千问）',
    baseURL: 'https://api.siliconflow.cn/v1',
    apiKeyEnv: 'SILICONFLOW_API_KEY',
    models: [
      { id: 'Qwen/Qwen3-VL-8B-Instruct', name: 'Qwen3-VL-8B-Instruct', contextWindow: 65536, maxTokens: 16384 },
    ],
  },
]