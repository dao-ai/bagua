'use client'
import type { ReactNode } from 'react'

/** 将 **加粗** 和 markdown 表格渲染为对应 HTML */
export default function MarkdownText({ text }: { text: string }) {
  const blocks = splitBlocks(text)
  return <>{blocks.map((block, i) => {
    if (block.type === 'table') {
      return <TableBlock key={i} rows={block.rows} />
    }
    return <TextBlock key={i} text={block.text} />
  })}</>
}

// ─── 分块 ───

interface TextChunk { type: 'text'; text: string }
interface TableChunk { type: 'table'; rows: string[][] }

function splitBlocks(text: string): (TextChunk | TableChunk)[] {
  const lines = text.split('\n')
  const blocks: (TextChunk | TableChunk)[] = []
  let i = 0

  while (i < lines.length) {
    // 收集连续的表格行（以 | 开头，包含 |）
    if (/^\s*\|.+\|\s*$/.test(lines[i])) {
      const tableLines: string[] = []
      while (i < lines.length && /^\s*\|.+\|\s*$/.test(lines[i])) {
        tableLines.push(lines[i].trim())
        i++
      }
      const parsed = parseTable(tableLines)
      if (parsed && parsed.length >= 2) {
        blocks.push({ type: 'table', rows: parsed })
        continue
      }
      // 解析失败就当普通文本
    }

    // 普通文本行
    const textLines: string[] = []
    while (i < lines.length && !/^\s*\|.+\|\s*$/.test(lines[i])) {
      textLines.push(lines[i])
      i++
    }
    blocks.push({ type: 'text', text: textLines.join('\n') })
  }

  return blocks
}

/** 解析表格行，跳过分隔行（|---|），返回 [row1[], row2[], ...] */
function parseTable(lines: string[]): string[][] | null {
  const rows: string[][] = []
  for (const line of lines) {
    // 跳过分隔行
    if (/^\|[-:| ]+\|$/.test(line)) continue
    const cells = line
      .replace(/^\|/, '')
      .replace(/\|$/, '')
      .split('|')
      .map(c => c.trim())
    if (cells.length > 0) rows.push(cells)
  }
  return rows.length >= 2 ? rows : null
}

// ─── 表格渲染 ───

function TableBlock({ rows }: { rows: string[][] }) {
  // 第一行是表头
  const [header, ...data] = rows
  return (
    <div className="overflow-x-auto my-2">
      <table className="w-full text-xs border-collapse">
        <thead>
          <tr>
            {header.map((h, i) => (
              <th key={i} className="border border-[var(--border)] px-3 py-1.5 text-left font-semibold bg-[var(--bg3)] text-[var(--fg)]">
                <InlineText text={h} />
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, ri) => (
            <tr key={ri}>
              {row.map((cell, ci) => (
                <td key={ci} className="border border-[var(--border)] px-3 py-1.5 text-[var(--fg)]">
                  <InlineText text={cell} />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

// ─── 文本块渲染（含换行 + 加粗） ───

function TextBlock({ text }: { text: string }) {
  if (!text) return null
  if (text === '\n' || text.trim() === '') return <br />
  return <InlineText text={text} />
}

function InlineText({ text }: { text: string }) {
  const parts: ReactNode[] = []
  let lastIdx = 0
  let key = 0

  // 按 \n 分段
  const segs = text.split('\n')
  segs.forEach((seg, si) => {
    if (si > 0) parts.push(<br key={`br-${key++}`} />)

    // 按 **...** 拆分
    const boldRe = /\*\*(.+?)\*\*/g
    let match: RegExpExecArray | null
    let cursor = 0

    while ((match = boldRe.exec(seg)) !== null) {
      if (match.index > cursor) {
        parts.push(<span key={key++}>{seg.slice(cursor, match.index)}</span>)
      }
      parts.push(<strong key={key++}>{match[1]}</strong>)
      cursor = boldRe.lastIndex
    }
    if (cursor < seg.length) {
      parts.push(<span key={key++}>{seg.slice(cursor)}</span>)
    }
  })

  return <>{parts}</>
}
