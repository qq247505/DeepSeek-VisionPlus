#!/usr/bin/env node
/**
 * dsh-visionplus 卸载器（preuninstall）：
 * 与安装相反 —— 回退 patches/ 下已应用的增强补丁、重建宿主恢复原状、
 * 清理 llm-pi-ai 里的 vp-* 视觉线路配置。找不到仓库时只提示，不报错中断。
 */
import { spawnSync } from 'node:child_process'
import { existsSync, readdirSync, readFileSync, writeFileSync } from 'node:fs'
import { dirname, join, resolve, homedir } from 'node:path'
import { fileURLToPath } from 'node:url'

const here = dirname(fileURLToPath(import.meta.url))
const patchesDir = join(here, '..', 'patches')
const green = (s) => `\u001b[32m${s}\u001b[0m`
const warn = (s) => `\u001b[33m${s}\u001b[0m`

function findHarnessRoot() {
  const candidates = []
  if (process.env.DSH_HARNESS_ROOT) candidates.push(process.env.DSH_HARNESS_ROOT)
  let dir = process.cwd()
  for (let i = 0; i < 8; i += 1) {
    candidates.push(dir)
    dir = resolve(dir, '..')
  }
  for (const drive of ['D:', 'C:']) candidates.push(join(drive, 'DeepSeek Harness'))
  for (const candidate of candidates) {
    try {
      const pj = JSON.parse(readFileSync(join(candidate, 'package.json'), 'utf8'))
      const isHarness = pj.name === 'deepseek-harness' || pj.name === '@deepseek-ai/dsh-root'
        || existsSync(join(candidate, 'packages', 'host', 'apiproxy', 'src', 'api-proxy.ts'))
      if (isHarness && existsSync(join(candidate, '.git'))) return candidate
    } catch { /* continue */ }
  }
  return null
}

// 1) 清理 settings.yaml 中的 vp-* 线路（llm-pi-ai.providers 下的 4 空格缩进块）
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
    console.log(green('[dsh-visionplus] 已清理设置中的 vp-* 视觉线路'))
  } catch {
    console.log(warn('[dsh-visionplus] 设置清理跳过（可稍后手动处理）'))
  }
}

const root = findHarnessRoot()
if (root === null) {
  console.log(warn('[dsh-visionplus] 未找到 Harness 源码仓库，跳过补丁回退。'))
  console.log(warn('  设置 DSH_HARNESS_ROOT 指向仓库根目录后重试，或手动执行 patches\\增强补丁.bat 反向操作。'))
  cleanSettings()
  process.exit(0)
}

console.log(green(`[dsh-visionplus] 找到 Harness 仓库：${root}`))
const patches = readdirSync(patchesDir).filter((name) => name.endsWith('.patch')).sort().reverse()
let reverted = 0
for (const patch of patches) {
  const file = join(patchesDir, patch)
  const check = spawnSync('git', ['-C', root, 'apply', '--reverse', '--check', file], { encoding: 'utf8' })
  if (check.status === 0) {
    const run = spawnSync('git', ['-C', root, 'apply', '--reverse', file], { encoding: 'utf8' })
    if (run.status === 0) {
      console.log(green(`  已回退 ${patch}`))
      reverted += 1
    } else {
      console.log(warn(`  ${patch} 回退失败：${(run.stderr || '').slice(0, 200)}`))
    }
  } else {
    console.log(`  跳过 ${patch}（未应用）`)
  }
}
if (reverted > 0) {
  console.log(green('[dsh-visionplus] 重建宿主恢复原状（首次较慢，请耐心等待）…'))
  const build = spawnSync('pnpm', ['run', 'build'], { cwd: root, stdio: 'inherit', shell: true })
  if (build.status !== 0) {
    console.log(warn('[dsh-visionplus] 重建未成功，请进入仓库根目录手动执行 pnpm run build。'))
  } else {
    console.log(green('[dsh-visionplus] 宿主已恢复原状。'))
  }
} else {
  console.log('[dsh-visionplus] 无补丁需要回退。')
}
cleanSettings()
console.log(green('[dsh-visionplus] 卸载完成。'))