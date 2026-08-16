import { z } from 'zod'

/**
 * vision-plus bundle 配置（静态元数据；线路/池全部来自 vision-plus 设置命名空间）。
 */
const variantSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  textProvider: z.string().min(1),
  textModel: z.string().min(1),
})

export const Config = z.object({
  providerId: z.string().min(1).default('vision-plus'),
  providerName: z.string().min(1).default('DeepSeek VisionPlus'),
  contextWindow: z.number().int().positive().default(128000),
  variants: z.array(variantSchema).min(1).default([
    { id: 'deepseek-v4-pro-visionplus', name: 'DeepSeek-V4-Pro 视觉', textProvider: 'vp-deepseek', textModel: 'deepseek-v4-pro' },
    { id: 'deepseek-v4-flash-visionplus', name: 'DeepSeek-V4-Flash 视觉', textProvider: 'vp-deepseek', textModel: 'deepseek-v4-flash' },
  ]),
  rateLimit: z.object({
    minIntervalMs: z.number().int().positive().default(1500),
    maxPerMinute: z.number().int().positive().default(8),
    cooldownMs: z.number().int().positive().default(8000),
  }).default({ minIntervalMs: 1500, maxPerMinute: 8, cooldownMs: 8000 }),
  contextMaxMessages: z.number().int().min(1).max(200).default(20),
})

export type VisionPlusConfig = z.output<typeof Config>
export type Variant = VisionPlusConfig['variants'][number]