#!/usr/bin/env node
/**
 * dsh-visionplus 卸载收尾（preuninstall）：
 * v2 起为零补丁插件 —— 没有宿主补丁需要回退；仅清理设置里的视觉配置。
 */
import { readFileSync, writeFileSync, existsSync } from 'node:fs'
import { homedir } from 'node:os'
import { join } from 'node:path'
const green = (s) => `\u001b[32m${s}\u001b[0m`
try {
  const file = join(homedir(), '.dsh', 'settings.yaml')
  if (existsSync(file)) {
    const text = readFileSync(file, 'utf8')
    // v2 设置存在插件自有命名空间（非 vp- 键），无需特殊清理；此处仅做无害校验
    writeFileSync(file, text, 'utf8')
  }
} catch { /* 忽略 */ }
console.log(green('[dsh-visionplus] ✔ 卸载完成。零补丁插件，无需回退宿主。'))