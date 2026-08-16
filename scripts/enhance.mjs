#!/usr/bin/env node
/**
 * dsh-visionplus 安装收尾（postinstall）：
 * v2 起为零补丁插件 —— 无需修改 Harness 源码。本脚本仅输出中文友好提示。
 */
const green = (s) => `\u001b[32m${s}\u001b[0m`
console.log(green(`[dsh-visionplus] ✔ 安装完成！DeepSeek VisionPlus 为零补丁插件，任何安装方式开箱即用。
  设置卡片：设置 → 桥接视觉（独立栏目）
  模型变体：DeepSeek-V4-Pro 视觉 / DeepSeek-V4-Flash 视觉
  下一步：重启 Harness，在卡片里填入 DeepSeek 密钥、添加视觉模型并保存即可使用。`))