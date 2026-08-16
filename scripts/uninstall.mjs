#!/usr/bin/env node
/**
 * dsh-visionplus 卸载器（preuninstall）：
 * 回退 patches/ 增强补丁、重建宿主恢复原状、清理 vp-* 视觉配置。
 * 找不到目录时交互询问路径；其余失败直接输出原因。
 */
import { spawnSync } from 'node:child_process'
import { existsSync, readdirSync, readFileSync, writeFileSync } from 'node:fs'
import { dirname, join, resolve } from 'node:path'
import { homedir } from 'node:os'
import { fileURLToPath } from 'node:url'
import { createInterface } from 'node:readline'
import { print } from './print.mjs'


const here = dirname(fileURLToPath(import.meta.url))
const patchesDir = join(here, '..', 'patches')
const green = (s) => `\u001b[32m${s}\u001b[0m`
const warn = (s) => `\u001b[33m${s}\u001b[0m`
const red = (s) => `\u001b[31m${s}\u001b[0m`

function isHarnessRoot(dir) {
  try {
    const pj = JSON.parse(readFileSync(join(dir, 'package.json'), 'utf8'))
    const marker = existsSync(join(dir, 'packages', 'host', 'apiproxy', 'src', 'api-proxy.ts'))
    return (pj.name === 'deepseek-harness' || pj.name === '@deepseek-ai/dsh-root' || marker) && existsSync(join(dir, '.git'))
  } catch { return false }
}

function autoFind() {
  const candidates = []
  if (process.env.DSH_HARNESS_ROOT) candidates.push(process.env.DSH_HARNESS_ROOT)
  let dir = process.cwd()
  for (let i = 0; i < 8; i += 1) { candidates.push(dir); dir = resolve(dir, '..') }
  for (const drive of ['D:', 'C:']) candidates.push(join(drive, 'DeepSeek Harness'))
  for (const candidate of candidates) if (isHarnessRoot(candidate)) return candidate
  return null
}

async function promptPath() {
  if (!(process.stdin.isTTY && process.stdout.isTTY)) return null
  const rl = createInterface({ input: process.stdin, output: process.stdout })
  const ask = () => new Promise(r => rl.question(
    `  ${warn('未找到 Harness 安装路径。请输入 Harness 安装路径后回车：')} `,
    r,
  ))
  for (let i = 0; i < 3; i += 1) {
    const answer = (await ask()).trim().replace(/^["']|["']$/g, '')
    if (answer === '') continue
    const abs = resolve(answer)
    if (isHarnessRoot(abs)) { rl.close(); return abs }
    print(red(`  ✗ "${answer}" 不是有效的 Harness 安装路径。`))
  }
  rl.close()
  return null
}

function cleanSettings() {
  try {
    const file = join(homedir(), '.dsh', 'settings.yaml')
    if (!existsSync(file)) return
    const lines = readFileSync(file, 'utf8').split(/\r?\n/)
    const out = []
    let skipping = false
    for (const line of lines) {
      if (!skipping && /^    vp-[\w-]+:/.test(line)) { skipping = true; continue }
      if (skipping) {
        if (/^    \S/.test(line) || /^  \S/.test(line) || /^\S/.test(line)) { skipping = false; out.push(line); continue }
        continue
      }
      out.push(line)
    }
    writeFileSync(file, out.join('\n') + '\n', 'utf8')
    print(green('[dsh-visionplus] ✔ 已清理设置中的视觉模型配置'))
  } catch {
    print(warn('[dsh-visionplus] ⚠ 设置清理跳过（可稍后手动处理）'))
  }
}

const root = (await autoFind()) ?? (await promptPath())
if (root === null) {
  print(red('[dsh-visionplus] 卸载不完整：未找到 Harness 安装路径，无法回退增强补丁。'))
  print('  设置环境变量 $env:DSH_HARNESS_ROOT="你的 Harness 安装路径" 后重试卸载。')
  cleanSettings()
  process.exit(0)
}

print(green(`[dsh-visionplus] ✔ 已找到 Harness 安装路径：${root}`))
const patches = readdirSync(patchesDir).filter(name => name.endsWith('.patch')).sort().reverse()
let reverted = 0
for (const patch of patches) {
  const file = join(patchesDir, patch)
  const check = spawnSync('git', ['-C', root, 'apply', '--reverse', '--check', file], { encoding: 'utf8' })
  if (check.status === 0) {
    const run = spawnSync('git', ['-C', root, 'apply', '--reverse', file], { encoding: 'utf8' })
    if (run.status === 0) {
      print(green(`  ✔ 已回退补丁 ${patch}`))
      reverted += 1
    } else {
      print(warn(`  ⚠ 补丁 ${patch} 回退失败：${(run.stderr || '').slice(0, 200)}`))
    }
  } else {
    print(`  · 跳过 ${patch}（未应用）`)
  }
}
if (reverted > 0) {
  print(green('[dsh-visionplus] 正在重建宿主恢复原状（首次较慢，请耐心等待）…'))
  const build = spawnSync('pnpm', ['run', 'build'], { cwd: root, stdio: 'inherit', shell: true })
  if (build.status !== 0) {
    print(warn('[dsh-visionplus] ⚠ 重建未成功，请进入仓库根目录手动执行 pnpm run build。'))
  } else {
    print(green('[dsh-visionplus] ✔ 宿主已恢复官方原状。'))
  }
} else {
  print('[dsh-visionplus] 无需回退补丁。')
}
cleanSettings()
const summary = [
  '',
  '  ┌──────────────────────────────────────────────┐',
  '  │        🗑️  DeepSeek VisionPlus 卸载完成       │',
  '  └──────────────────────────────────────────────┘',
  '',
  '  已回退全部增强补丁，宿主已恢复官方原状。',
  '',
]
print(green(summary.join('\n')))