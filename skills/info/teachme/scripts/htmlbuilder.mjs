#!/usr/bin/env node
import { readFileSync, writeFileSync, readdirSync, existsSync } from 'node:fs'
import { dirname, join, basename } from 'node:path'
import { fileURLToPath } from 'node:url'

const SKILL_DIR = dirname(fileURLToPath(import.meta.url))
const WORKSPACE = process.cwd()
const SCAN_DIRS = ['lessons', 'reference']

const template = readFileSync(join(SKILL_DIR, 'template.html'), 'utf8')

const args = process.argv.slice(2).map(a => a.endsWith('.md') ? a.slice(0, -3) : a)

let built = 0
for (const dir of SCAN_DIRS) {
  const full = join(WORKSPACE, dir)
  if (!existsSync(full)) continue
  const mds = readdirSync(full).filter(f => f.endsWith('.md'))
  const targets = args.length
    ? mds.filter(f => args.includes(basename(f, '.md')))
    : mds
  for (const file of targets) {
    buildOne(full, file)
    built++
  }
}

if (args.length && built === 0) {
  console.error(`找不到要构建的 .md：${args.join(', ')}`)
  process.exit(2)
}

function buildOne(dir, file) {
  const mdPath = join(dir, file)
  const text = readFileSync(mdPath, 'utf8')
  const titleMatch = text.match(/^#\s+(.+)$/m)
  const title = titleMatch ? titleMatch[1].trim() : basename(file, '.md')
  // 注意：markdown 内若含字面 </script>，转义后渲染会显示反斜杠。
  // 教学场景出现概率低；如需嵌入此类内容，改用外部 .md 加载。
  const safe = text.replaceAll('</script>', '<\\/script>')
  const html = template
    .replace('__TITLE__', escapeHtml(title))
    .replace('__MD__', safe)
  const out = join(dir, basename(file, '.md') + '.html')
  writeFileSync(out, html)
  console.log(`built ${out}`)
}

function escapeHtml(s) {
  return s.replace(/[&<>"']/g, c => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  }[c]))
}
