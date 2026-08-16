import z from '@deepseek-ai/schemastery'

/**
 * vision-plus 设置命名空间 schema（平台化）：
 * - text：DeepSeek 文本后端（deepseek-official + 密钥）
 * - visionModels：视觉平台池 —— 每项是一个"平台"（OpenAI 兼容接口），
 *   平台内可挂多个该平台的模型（按顺序轮换）。
 */

const optionalString = z.union([z.string(), z.const(undefined)])
const optionalNatural = z.union([z.natural(), z.const(undefined)])

const visionModelSchema = z.object({
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
  models: z.array(visionModelSchema),
})

export const settingsSchema = z.object({
  text: z.object({
    provider: z.const('deepseek-official'),
    apiKeyEnv: z.string().default('DEEPSEEK_API_KEY'),
  }),
  visionModels: z.array(visionProviderSchema),
})

export type VisionPlusSettings = {
  text: { provider: 'deepseek-official', apiKeyEnv: string }
  visionModels: Array<{
    id: string
    displayName: string
    baseURL: string
    apiKeyEnv: string
    models: Array<{
      id: string
      name?: string
      contextWindow?: number
      maxTokens?: number
    }>
  }>
}

/**
 * 预置免费视觉平台模板（默认值）。
 * 规格均为官方权威值：
 * - GLM-4.1V-Thinking-Flash：64K / 16K（智谱官方模型概览）
 * - GLM-4.6V-Flash：128K / 32K（智谱官方模型概览）
 * - Qwen3-VL-8B-Instruct（SiliconFlow）：64K / 16K
 * - Gemini 2.5 Flash：1M / 64K（Google 官方）
 */
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