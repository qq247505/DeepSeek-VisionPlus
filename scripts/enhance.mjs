#!/usr/bin/env node
/**
 * dsh-visionplus 安装增强器（postinstall）：
 * 定位 Harness 安装位置 → 应用 patches/ 增强补丁 → 重建宿主。
 * 找不到目录时，若在交互终端则提示用户手动输入路径后继续；其他失败（补丁冲突/构建失败）直接输出原因并中止。
 */
import { spawnSync } from 'node:child_process'
import { existsSync, readdirSync, readFileSync } from 'node:fs'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { createInterface } from 'node:readline'

// Windows 控制台默认 GBK（cp936），直接输出 UTF-8 中文会乱码。
// 先把活动代码页切到 UTF-8（chcp 65001）；非交互/重定向场景会静默失败，无副作用。
if (process.platform === 'win32') {
  try { spawnSync('chcp', ['65001'], { shell: true, stdio: 'ignore' }) } catch { /* 忽略 */ }
}

const here = dirname(fileURLToPath(import.meta.url))
const patchesDir = join(here, '..', 'patches')
const green = (s) => `\u001b[32m${s}\u001b[0m`
const warn = (s) => `\u001b[33m${s}\u001b[0m`
const red = (s) => `\u001b[31m${s}\u001b[0m`

/** 校验一个目录是否是 Harness 安装位置 */
function isHarnessRoot(dir) {
  try {
    const pj = JSON.parse(readFileSync(join(dir, 'package.json'), 'utf8'))
    const marker = existsSync(join(dir, 'packages', 'host', 'apiproxy', 'src', 'api-proxy.ts'))
    return (pj.name === 'deepseek-harness' || pj.name === '@deepseek-ai/dsh-root' || marker) && existsSync(join(dir, '.git'))
  } catch {
    return false
  }
}

/** 三层自动查找：env → 向上 → 常见路径 */
function autoFind() {
  const candidates = []
  if (process.env.DSH_HARNESS_ROOT) candidates.push(process.env.DSH_HARNESS_ROOT)
  let dir = process.cwd()
  for (let i = 0; i < 8; i += 1) { candidates.push(dir); dir = resolve(dir, '..') }
  for (const drive of ['D:', 'C:']) candidates.push(join(drive, 'DeepSeek Harness'))
  for (const candidate of candidates) if (isHarnessRoot(candidate)) return candidate
  return null
}

/** 交互式询问路径（最多 3 次），非交互环境返回 null */
async function promptPath() {
  if (!(process.stdin.isTTY && process.stdout.isTTY)) return null
  const rl = createInterface({ input: process.stdin, output: process.stdout })
  const ask = () => new Promise(resolveAnswer => rl.question(
    `  ${warn('未找到 Harness 安装路径。请输入 Harness 安装路径（例如 D:\\DeepSeek Harness）后回车：')} `,
    resolveAnswer,
  ))
  for (let i = 0; i < 3; i += 1) {
    const answer = (await ask()).trim().replace(/^["']|["']$/g, '')
    if (answer === '') continue
    const abs = resolve(answer)
    if (isHarnessRoot(abs)) { rl.close(); return abs }
    console.log(red(`  ✗ "${answer}" 不是有效的 Harness 安装路径（需含 package.json 与 .git）。`))
  }
  rl.close()
  return null
}

const root = (await autoFind()) ?? (await promptPath())
if (root === null) {
  console.error(red('[dsh-visionplus] 安装失败：未找到 Harness 安装路径，无法应用增强补丁。'))
  console.error('  解决方式二选一：')
  console.error('    1) 设置环境变量后重新安装：  $env:DSH_HARNESS_ROOT="你的 Harness 安装路径"')
  console.error('    2) 先把插件内 patches\\增强补丁.bat 复制到 Harness 仓库根目录双击执行，再重新安装插件。')
  process.exit(1)
}

console.log(green(`[dsh-visionplus] ✔ 已找到 Harness 安装路径：${root}`))
const patches = readdirSync(patchesDir).filter(name => name.endsWith('.patch')).sort()
const REQUIRED = 'models-extra-slot.patch'
let applied = 0
let requiredApplied = false
for (const patch of patches) {
  const file = join(patchesDir, patch)
  const check = spawnSync('git', ['-C', root, 'apply', '--check', file], { encoding: 'utf8' })
  if (check.status === 0) {
    const run = spawnSync('git', ['-C', root, 'apply', file], { encoding: 'utf8' })
    if (run.status === 0) {
      console.log(green(`  ✔ 已应用补丁 ${patch}`))
      applied += 1
      if (patch === REQUIRED) requiredApplied = true
    } else if (patch === REQUIRED) {
      console.error(red(`[dsh-visionplus] 安装失败：关键补丁 ${patch} 应用失败：${(run.stderr || '').slice(0, 300)}`))
      process.exit(1)
    } else {
      console.log(warn(`  ⚠ 补丁 ${patch} 应用失败（非关键，继续）：${(run.stderr || '').slice(0, 200)}`))
    }
  } else {
    const probe = spawnSync('git', ['-C', root, 'apply', '--reverse', '--check', file], { encoding: 'utf8' })
    if (probe.status === 0) {
      console.log(`  · 跳过 ${patch}（已应用）`)
      if (patch === REQUIRED) requiredApplied = true
    } else if (patch === REQUIRED) {
      console.error(red(`[dsh-visionplus] 安装失败：关键补丁 ${patch} 与当前 Harness 版本不匹配。`))
      console.error(red(`  原因：${(check.stderr || '').slice(0, 300)}`))
      process.exit(1)
    } else {
      console.log(warn(`  ⚠ 跳过 ${patch}（与当前版本不匹配，非关键）`))
    }
  }
}
if (!requiredApplied) {
  console.error(red('[dsh-visionplus] 安装失败：模型页槽补丁 models-extra-slot.patch 未能应用。'))
  process.exit(1)
}
if (applied > 0) {
  console.log(green('[dsh-visionplus] 正在重建宿主（首次较慢，请耐心等待）…'))
  const build = spawnSync('pnpm', ['run', 'build'], { cwd: root, stdio: 'inherit', shell: true })
  if (build.status !== 0) {
    console.error(red('[dsh-visionplus] 安装失败：宿主构建未成功，请进入仓库根目录手动执行 pnpm run build。'))
    process.exit(1)
  }
} else {
  console.log('[dsh-visionplus] 增强补丁已就绪，无需重建。')
}
const summary = [
  '',
  '  ┌──────────────────────────────────────────────┐',
  '  │        ✅ DeepSeek VisionPlus 安装完成        │',
  '  └──────────────────────────────────────────────┘',
  '',
  '  插件条目   dsh-visionplus（设置 → 插件 可搜索到）',
  '  设置卡片   设置 → 模型 → DeepSeek VisionPlus',
  '  模型变体   DeepSeek-V4-Pro 视觉 / DeepSeek-V4-Flash 视觉',
  '',
  '  下一步：重启 Harness，然后在"模型"页卡片里',
  '  填入 DeepSeek 密钥、添加视觉模型并保存即可使用。',
  '',
]
console.log(green(summary.join('\n')))