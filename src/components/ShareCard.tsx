'use client'

import { useRef, useState, useEffect, useMemo } from 'react'
import { baguaList, baguaMap, getHexagramName, getHexagramSymbol } from '@/data/bagua'
import { getHexagramDetail } from '@/data/hexagrams'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'

const SITE_TITLE = '八卦 · 入门'
const SITE_URL = 'dao-ai.github.io/bagua'

interface ShareData {
  name: string
  symbol: string
  judgment: string
  upperSymbol: string
  lowerSymbol: string
  upperName: string
  lowerName: string
  /** 6条爻，从下到上，1=阳 0=阴 */
  yaoLines: number[]
}

/**
 * 用 Canvas 绘制卦象分享卡片
 */
function drawCard(canvas: HTMLCanvasElement, data: ShareData) {
  const ctx = canvas.getContext('2d')
  if (!ctx) return

  const W = 540, H = 640
  canvas.width = W * 2
  canvas.height = H * 2
  ctx.scale(2, 2)

  // ── 深色渐变背景 ──
  const grad = ctx.createLinearGradient(0, 0, 0, H)
  grad.addColorStop(0, '#0b1120')
  grad.addColorStop(0.6, '#141d33')
  grad.addColorStop(1, '#1a1f3a')
  ctx.fillStyle = grad
  ctx.fillRect(0, 0, W, H)

  // ── 边框 ──
  ctx.strokeStyle = 'rgba(139, 108, 249, 0.15)'
  ctx.lineWidth = 1
  ctx.strokeRect(16, 16, W - 32, H - 32)

  // ── 顶部光晕 ──
  const glow = ctx.createRadialGradient(W / 2, 60, 10, W / 2, 60, 180)
  glow.addColorStop(0, 'rgba(139, 108, 249, 0.08)')
  glow.addColorStop(1, 'rgba(139, 108, 249, 0)')
  ctx.fillStyle = glow
  ctx.fillRect(0, 0, W, 240)

  // ── 卦符 ──
  ctx.fillStyle = '#e8e4ff'
  ctx.font = '80px serif'
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.fillText(data.symbol, W / 2, 110)

  // ── 卦名 ──
  ctx.fillStyle = '#f0ecff'
  ctx.font = 'bold 36px "Noto Serif SC", serif'
  ctx.fillText(data.name, W / 2, 190)

  // ── 上下卦信息 ──
  ctx.fillStyle = 'rgba(200, 195, 220, 0.7)'
  ctx.font = '16px "Noto Serif SC", serif'
  ctx.fillText(`上${data.upperName}（${data.upperSymbol}）· 下${data.lowerName}（${data.lowerSymbol}）`, W / 2, 230)

  // ── 爻线展示（6条，从下到上） ──
  const yaoLines = data.yaoLines || []
  if (yaoLines.length === 6) {
    const yaoCenterX = W / 2
    const yaoStartY = 275
    const yaoGap = 8
    const yangW = 80
    const yinHalfW = 30
    const yinGap = 20

    for (let i = 0; i < 6; i++) {
      const y = yaoStartY + i * (6 + yaoGap)
      const isYang = yaoLines[5 - i] === 1 // i=0显示最下层
      ctx.fillStyle = 'rgba(232, 228, 255, 0.6)'

      if (isYang) {
        ctx.fillRect(yaoCenterX - yangW / 2, y, yangW, 6)
      } else {
        const halfW = yinHalfW
        const gap = yinGap
        const totalW = halfW * 2 + gap
        ctx.fillRect(yaoCenterX - totalW / 2, y, halfW, 6)
        ctx.fillRect(yaoCenterX + gap / 2, y, halfW, 6)
      }
    }
  }

  // ── 分割线 ──
  const contentStartY = yaoLines.length === 6 ? 350 : 275
  ctx.strokeStyle = 'rgba(139, 108, 249, 0.25)'
  ctx.lineWidth = 1
  ctx.setLineDash([6, 4])
  ctx.beginPath()
  ctx.moveTo(120, contentStartY)
  ctx.lineTo(W - 120, contentStartY)
  ctx.stroke()
  ctx.setLineDash([])

  // ── 卦辞 ──
  ctx.fillStyle = '#c4b8ff'
  ctx.font = '16px "Noto Serif SC", serif'
  ctx.textAlign = 'center'

  const maxWidth = W - 80
  const lines = wrapText(ctx, data.judgment, maxWidth, 16)
  const textStartY = contentStartY + 30
  lines.slice(0, 6).forEach((line, i) => {
    ctx.fillText(line, W / 2, textStartY + i * 26)
  })

  // ── 底部品牌 ──
  ctx.fillStyle = 'rgba(139, 108, 249, 0.5)'
  ctx.font = '12px sans-serif'
  ctx.textAlign = 'center'
  ctx.fillText(SITE_TITLE, W / 2, H - 50)
  ctx.fillStyle = 'rgba(139, 108, 249, 0.35)'
  ctx.font = '11px sans-serif'
  ctx.fillText(SITE_URL, W / 2, H - 30)
}

/** 提取爻线数组（6条，从下到上） */
export function getYaoLines(upperId: string, lowerId: string): number[] {
  // 避免循环依赖，内联查找
  const ul = baguaList.find(b => b.id === upperId)
  const ll = baguaList.find(b => b.id === lowerId)
  if (!ul || !ll) return []
  return [...ll.yao, ...ul.yao]
}

function wrapText(ctx: CanvasRenderingContext2D, text: string, maxWidth: number, fontSize: number): string[] {
  const lines: string[] = []
  let current = ''
  for (const char of text) {
    const test = current + char
    if (ctx.measureText(test).width > maxWidth && current) {
      lines.push(current)
      current = char
    } else {
      current = test
    }
  }
  if (current) lines.push(current)
  return lines
}

interface Props {
  upperId: string
  lowerId: string
  /** 可选副标题，如"起卦结果" */
  subtitle?: string
}

/**
 * 卦象分享按钮 + 卡片弹窗
 * 点击按钮 → 打开弹窗 → 预览卡片 → 下载/复制
 */
export default function ShareCard({ upperId, lowerId, subtitle }: Props) {
  const [open, setOpen] = useState(false)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  // 构建 ShareData（稳定引用）
  const data = useMemo(() => {
    const ud = baguaMap[upperId]
    const ld = baguaMap[lowerId]
    const name = getHexagramName(upperId, lowerId)
    const symbol = getHexagramSymbol(upperId, lowerId)
    const detail = getHexagramDetail(upperId, lowerId)
    const yaoLines = getYaoLines(upperId, lowerId)
    return {
      name,
      symbol,
      judgment: detail?.judgment || '',
      upperSymbol: ud?.symbol || '',
      lowerSymbol: ld?.symbol || '',
      upperName: ud?.name || '',
      lowerName: ld?.name || '',
      yaoLines,
    }
  }, [upperId, lowerId])

  // 打开时渲染 Canvas
  useEffect(() => {
    if (open && canvasRef.current) {
      drawCard(canvasRef.current, data)
    }
  }, [open, data])

  const handleDownload = () => {
    const canvas = canvasRef.current
    if (!canvas) return
    const link = document.createElement('a')
    link.download = `卦-${data.name}.png`
    link.href = canvas.toDataURL('image/png')
    link.click()
  }

  const handleCopy = async () => {
    const canvas = canvasRef.current
    if (!canvas) return
    try {
      const blob = await new Promise<Blob | null>(resolve => canvas.toBlob(resolve, 'image/png'))
      if (!blob) return
      await navigator.clipboard.write([new ClipboardItem({ 'image/png': blob })])
      toast.success('图片已复制到剪贴板')
    } catch {
      toast.error('复制失败，已改为下载')
      handleDownload()
    }
  }

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="flex items-center gap-1.5 text-[var(--accent)] hover:opacity-80 transition-opacity bg-transparent border-none cursor-pointer text-[12px]"
      >
        📤 {subtitle ? `分享${subtitle}` : '分享卦象'}
      </button>
    )
  }

  return (
    <Dialog open={open} onOpenChange={(isOpen) => { if (!isOpen) setOpen(false) }}>
      <DialogContent className="max-w-[420px] bg-[var(--bg2)] border-[var(--border)]">
        <DialogHeader>
          <DialogTitle>{subtitle ? `分享${subtitle}` : '分享卦象'}</DialogTitle>
        </DialogHeader>
        <div className="max-h-[calc(90vh-8rem)] overflow-y-auto thin-scroll">
        <div className="rounded-xl overflow-hidden border border-[var(--border)]">
          <canvas
            ref={canvasRef}
            className="w-full h-auto block"
            style={{ aspectRatio: '540/640' }}
          />
        </div>
        <div className="flex gap-3 mt-4">
          <Button onClick={handleDownload} className="flex-1">
            ⬇️ 下载图片
          </Button>
          <Button onClick={handleCopy} variant="outline" className="flex-1">
            📋 复制图片
          </Button>
        </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export type { ShareData }
