#!/usr/bin/env node
/**
 * dsh-visionplus 安装增强器（postinstall）：
 * 自动定位 DeepSeek Harness 源码仓库，应用 patches/ 下的增强补丁并重建宿主，
 * 让 `dsh plugin add` 一条命令装完即获得完整形态（真实视觉测试通道、模型页内嵌卡片等）。
 * 找不到仓库时只提示手动步骤，绝不报错中断安装。
 */
import { spawnSync } from 'node:child_process'
import { existsSync, readdirSync, readFileSync } from 'node:fs'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const here = dirname(fileURLToPath(import.meta.url))
const patchesDir = join(here, '..', 'patches')
const green = (s) => `\u001b[32m${s}\u001b[0m`
const warn = (s) => `\u001b[33m${s}\u001b[0m`

/** 定位 Harness 仓库：环境变量 → 向上查找 → 常见克隆路径 */
function findHarnessRoot() {
  const candidates = []
  const env = process.env.DSH_HARNESS_ROOT
  if (env) candidates.push(env)
  let dir = process.cwd()
  for (let i = 0; i < 8; i += 1) {
    candidates.push(dir)
    dir = resolve(dir, '..')
  }
  for (const drive of ['D:', 'C:']) candidates.push(join(drive, 'DeepSeek Harness'))
  for (const candidate of candidates) {
    try {
      const pj = JSON.parse(readFileSync(join(candidate, 'package.json'), 'utf8'))
      // 官方仓库名或任何 Harness 源码布局（含 apiproxy 源码 + .git 即认定）
      const isHarness = pj.name === 'deepseek-harness' || pj.name === '@deepseek-ai/dsh-root'
        || existsSync(join(candidate, 'packages', 'host', 'apiproxy', 'src', 'api-proxy.ts'))
      if (isHarness && existsSync(join(candidate, '.git'))) return candidate
    } catch {
      // 继续
    }
  }
  return null
}

const root = findHarnessRoot()
if (root === null) {
  console.error('[dsh-visionplus] 安装失败：未找到 DeepSeek Harness 源码仓库，无法应用"模型页"增强补丁。')
  console.error('  解决：设置环境变量 DSH_HARNESS_ROOT 指向 Harness 仓库根目录后重新安装，')
  console.error('  或先把插件内 patches\\增强补丁.bat 复制到仓库根目录双击执行，再安装插件。')
  process.exit(1)
}

console.log(green(`[dsh-visionplus] 找到 Harness 仓库：${root}`))
const patches = readdirSync(patchesDir).filter((name) => name.endsWith('.patch')).sort()
const REQUIRED = 'models-extra-slot.patch'
let applied = 0
let requiredPatchApplied = false
for (const patch of patches) {
  const file = join(patchesDir, patch)
  const check = spawnSync('git', ['-C', root, 'apply', '--check', file], { encoding: 'utf8' })
  if (check.status === 0) {
    const run = spawnSync('git', ['-C', root, 'apply', file], { encoding: 'utf8' })
    if (run.status === 0) {
      console.log(green(`  已应用 ${patch}`))
      applied += 1
      if (patch === REQUIRED) requiredPatchApplied = true
    } else {
      if (patch === REQUIRED) {
        console.error(`[dsh-visionplus] 安装失败：关键补丁 ${patch} 应用失败：${(run.stderr || '').slice(0, 300)}`)
        process.exit(1)
      }
      console.log(warn(`  ${patch} 应用失败（非关键，继续）：${(run.stderr || '').slice(0, 200)}`))
    }
  } else {
    // 未通过 check：可能已应用（check 对已应用补丁返回非零）或与当前版本冲突
    const probe = spawnSync('git', ['-C', root, 'apply', '--reverse', '--check', file], { encoding: 'utf8' })
    if (probe.status === 0) {
      console.log(`  跳过 ${patch}（已应用）`)
      if (patch === REQUIRED) requiredPatchApplied = true
    } else if (patch === REQUIRED) {
      console.error(`[dsh-visionplus] 安装失败：关键补丁 ${patch} 与当前 Harness 版本不匹配。`)
      console.error(`  原因：${(check.stderr || '').slice(0, 300)}`)
      process.exit(1)
    } else {
      console.log(warn(`  跳过 ${patch}（与当前版本不匹配，非关键）`))
    }
  }
}
if (!requiredPatchApplied) {
  console.error('[dsh-visionplus] 安装失败：模型页槽补丁 models-extra-slot.patch 未能应用。')
  process.exit(1)
}
if (applied > 0) {
  console.log(green('[dsh-visionplus] 重建宿主（首次较慢，请耐心等待）…'))
  const build = spawnSync('pnpm', ['run', 'build'], { cwd: root, stdio: 'inherit', shell: true })
  if (build.status !== 0) {
    console.error('[dsh-visionplus] 安装失败：宿主构建未成功，请进入仓库根目录手动执行 pnpm run build。')
    process.exit(1)
  }
} else {
  console.log('[dsh-visionplus] 增强补丁已就绪，无需重建。')
}
console.log(green('[dsh-visionplus] 安装完成！重启 Harness 后插件卡片显示在"模型"页内。'))