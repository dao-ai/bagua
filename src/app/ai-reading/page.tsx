'use client'

import { useState, useMemo, useRef } from 'react'
import usePageTitle from '@/hooks/usePageTitle'
import { RubyText } from '@/components/Ruby'
import { baguaList, baguaMap, getHexagramName, getHexagramSymbol } from '@/data/bagua'
import { hexagramOrder, getHexagramDetail } from '@/data/hexagrams'

// DeepSeek API 配置
const API_URL = 'https://api.deepseek.com/chat/completions'

interface HexData {
  upperId: string; lowerId: string
  name: string; symbol: string
  detail: ReturnType<typeof getHexagramDetail>
}

export default function AIReadingPage() {
  usePageTitle()

  const [hex, setHex] = useState<HexData | null>(null)
  const [reading, setReading] = useState('')
  const [loading, setLoading] = useState(false)
  const [apiKey, setApiKey] = useState("")
  const [showKeyInput, setShowKeyInput] = useState(true)
  const [picker, setPicker] = useState(false)
  const [search, setSearch] = useState('')
  const abortRef = useRef<AbortController | null>(null)

  const filtered = useMemo(() => {
    if (!search) return hexagramOrder
    const q = search.toLowerCase().trim()
    return hexagramOrder.filter(([u, l]) => getHexagramName(u, l).includes(q))
  }, [search])

  const selectHex = (u: string, l: string) => {
    setHex({
      upperId: u, lowerId: l,
      name: getHexagramName(u, l),
      symbol: getHexagramSymbol(u, l),
      detail: getHexagramDetail(u, l),
    })
    setReading('')
    setPicker(false)
    setSearch('')
  }

  const doReading = async () => {
    if (!hex || !apiKey) return

    // 取消之前的请求
    if (abortRef.current) abortRef.current.abort()
    const controller = new AbortController()
    abortRef.current = controller

    setLoading(true)
    setReading('')

    const ub = baguaMap[hex.upperId]
    const lb = baguaMap[hex.lowerId]

    const prompt = `你是一位精通《周易》的易学专家。请为以下卦象做详细解读。

卦名：${hex.name}（${hex.symbol}）
上卦：${ub.name}（${ub.symbol}）— ${ub.nature}，五行属${WU_XING[hex.upperId]}
下卦：${lb.name}（${lb.symbol}）— ${lb.nature}，五行属${WU_XING[hex.lowerId]}
卦辞：${hex.detail?.judgment || '无'}
象辞：${hex.detail?.image || '无'}
现代释义：${hex.detail?.meaning || '无'}

请从以下角度解读：
1. **卦象解析** — 上下卦组合的意象，这个卦"长什么样"
2. **核心价值观** — 这个卦给现代人什么启发
3. **生活指引** — 工作、学习或人际关系中，这个卦的智慧如何运用
4. **一句话总结** — 用最精辟的话记住这个卦

注意：用现代人的语言，接地气，别太玄乎。字数控制在300-500字。`

    try {
      const res = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: 'deepseek-chat',
          messages: [
            { role: 'system', content: '你是一位精通《周易》的易学专家，擅长用现代语言解读卦象。回答简洁有力，不说废话。' },
            { role: 'user', content: prompt },
          ],
          stream: true,
          max_tokens: 2000,
          temperature: 0.7,
        }),
        signal: controller.signal,
      })

      if (!res.ok) {
        const err = await res.text()
        setReading(`⚠️ API 错误 (${res.status}): ${err}`)
        setLoading(false)
        return
      }

      const reader = res.body?.getReader()
      if (!reader) return

      const decoder = new TextDecoder()
      let buffer = ''

      while (true) {
        const { done, value } = await reader.read()
        if (done) break

        buffer += decoder.decode(value, { stream: true })
        const lines = buffer.split('\n')
        buffer = lines.pop() || ''

        for (const line of lines) {
          const trimmed = line.trim()
          if (!trimmed || trimmed === 'data: [DONE]') continue
          if (!trimmed.startsWith('data: ')) continue

          try {
            const json = JSON.parse(trimmed.slice(6))
            const content = json.choices?.[0]?.delta?.content || ''
            if (content) {
              setReading(prev => prev + content)
            }
          } catch {
            // skip parse errors for partial chunks
          }
        }
      }
    } catch (err: any) {
      if (err.name !== 'AbortError') {
        setReading(`⚠️ 请求失败: ${err.message}`)
      }
    }

    setLoading(false)
  }

  return (
    <>
      <div className="text-center pb-6">
        <h2 className="text-[26px] mb-1.5 font-heading">AI 解卦</h2>
        <p className="text-sm text-[var(--muted)] max-w-[520px] mx-auto">
          选一个卦，让人工智能从现代视角解读古人的智慧。
        </p>
      </div>

      {/* API Key 配置 */}
      {showKeyInput && (
        <div className="max-w-[500px] mx-auto mb-4 p-3 rounded-xl bg-[var(--bg3)] border border-[var(--border)]">
          <div className="text-[11px] text-[var(--muted)] mb-1.5">
            需要 DeepSeek API Key 才能解卦
          </div>
          <div className="flex gap-2">
            <input
              type="password"
              value={apiKey}
              onChange={e => setApiKey(e.target.value)}
              placeholder="sk-..."
              className="flex-1 px-3 py-2 rounded-lg bg-[var(--bg2)] border border-[var(--border)] text-[var(--fg)] text-sm outline-none focus:border-[var(--accent)] caret-[var(--accent)]"
            />
            <button onClick={() => setShowKeyInput(false)}
              className="px-3 py-2 text-xs bg-[var(--accent)] text-[var(--bg)] rounded-lg cursor-pointer font-semibold">确认</button>
          </div>
        </div>
      )}

      {/* 选卦 */}
      <div className="max-w-[500px] mx-auto mb-4">
        <button
          onClick={() => setPicker(true)}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-[var(--card)] border border-[var(--border)] cursor-pointer hover:border-[var(--accent)] transition-colors text-left"
        >
          {hex ? (
            <>
              <span className="text-[28px]">{hex.symbol}</span>
              <div className="flex-1">
                <div className="font-semibold"><RubyText text={hex.name} /></div>
                <div className="text-[11px] text-[var(--muted)]">
                  {baguaMap[hex.upperId].name} · {baguaMap[hex.lowerId].name}
                </div>
              </div>
              <span className="text-[var(--muted)]">▼</span>
            </>
          ) : (
            <div className="flex-1 text-center py-2 text-[var(--muted)] text-sm">← 选择要解读的卦 →</div>
          )}
        </button>
      </div>

      {/* AI解卦按钮 */}
      {hex && (
        <div className="text-center mb-6">
          <button
            onClick={doReading}
            disabled={loading || !apiKey}
            className="px-8 py-3 text-sm font-semibold tracking-wider bg-gradient-to-r from-[var(--accent)] to-[var(--accent2)] text-[var(--bg)] border-none rounded-xl cursor-pointer transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_4px_16px_var(--glow)] active:translate-y-0 disabled:opacity-40 disabled:cursor-not-allowed disabled:translate-y-0"
          >
            {loading ? '🤔 解卦中…' : '🔮 AI 解卦'}
          </button>
          {!apiKey && (
            <div className="text-[10px] text-[var(--risk)] mt-1">请先配置 API Key</div>
          )}
        </div>
      )}

      {/* 解读结果 */}
      {reading && (
        <div className="max-w-[600px] mx-auto animate-[fadeIn_0.3s_ease]">
          <div className="bg-[var(--bg2)] border border-[var(--border)] rounded-2xl p-6">
            {hex && (
              <div className="text-center mb-4 pb-4 border-b border-[var(--border)]">
                <div className="text-[40px] mb-1">{hex.symbol}</div>
                <div className="text-[18px] font-bold"><RubyText text={hex.name} /></div>
                <div className="text-[11px] text-[var(--muted)]">{baguaMap[hex.upperId].name} · {baguaMap[hex.lowerId].name}</div>
              </div>
            )}
            <div className="text-[13px] leading-relaxed whitespace-pre-wrap">{reading}</div>
          </div>
          <div className="text-center mt-2">
            <button onClick={() => setReading('')}
              className="text-[11px] text-[var(--muted)] underline cursor-pointer hover:text-[var(--fg)]">清除结果</button>
          </div>
        </div>
      )}

      {/* 选卦弹窗 */}
      {picker && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40"
          onClick={() => { setPicker(false); setSearch('') }}
        >
          <div
            className="bg-[var(--card)] border border-[var(--border)] rounded-2xl w-full max-w-[420px] max-h-[70vh] flex flex-col overflow-hidden animate-[fadeIn_0.15s_ease]"
            onClick={e => e.stopPropagation()}
          >
            <div className="p-3 border-b border-[var(--border)]">
              <input
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="搜索卦名…"
                autoFocus
                className="w-full px-3 py-2 rounded-lg bg-[var(--bg3)] border border-[var(--border)] text-[var(--fg)] text-sm outline-none focus:border-[var(--accent)] transition-colors"
              />
            </div>
            <div className="overflow-y-auto flex-1 p-2">
              {filtered.length === 0 ? (
                <div className="p-6 text-center text-sm text-[var(--muted)]">无匹配</div>
              ) : (
                <div className="grid grid-cols-2 gap-0.5">
                  {filtered.map(([u, l]) => (
                    <button key={`${u}-${l}`} onClick={() => selectHex(u, l)}
                      className="flex items-center gap-2 px-3 py-2 rounded-lg text-left cursor-pointer hover:bg-[var(--bg3)] transition-colors">
                      <span className="text-[18px] w-[24px] text-center">{getHexagramSymbol(u, l)}</span>
                      <span className="text-sm"><RubyText text={getHexagramName(u, l)} /></span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      <p className="text-xs text-center text-[var(--muted)] mt-4">
        ⚡ 调用 DeepSeek API，需自行配置 API Key
      </p>
    </>
  )
}

const WU_XING: Record<string, string> = {
  qian: '金', dui: '金',
  zhen: '木', xun: '木',
  kan: '水',
  li: '火',
  gen: '土', kun: '土',
}
