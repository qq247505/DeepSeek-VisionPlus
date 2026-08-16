// 控制台中文自适应输出：探测活动代码页，GBK(936) 转 GBK 字节，UTF-8(65001) 直接输出。
import { spawnSync } from 'node:child_process'
import { createRequire } from 'node:module'

let codePage = 0
try {
  const r = spawnSync('chcp', [], { shell: true, encoding: 'utf8', timeout: 3000 })
  const m = /(\d+)/.exec(r.stdout ?? '')
  if (m) codePage = Number(m[1])
} catch { /* 未知 */ }

function utf8Ok() {
  return process.platform !== 'win32' || codePage === 65001 || codePage === 0
}

let gbk = null
function gbkBytes(text) {
  if (!gbk) {
    try {
      const require = createRequire(import.meta.url)
      gbk = require('iconv-lite')
    } catch { /* iconv-lite 未装则回退 UTF-8 */ }
  }
  return gbk ? gbk.encode(text, 'gbk') : Buffer.from(text, 'utf8')
}

export function print(text) {
  const line = text.endsWith('\n') ? text : text + '\n'
  if (utf8Ok()) {
    process.stdout.write(line)
  } else {
    process.stdout.write(Buffer.from(gbkBytes(line)))
  }
}