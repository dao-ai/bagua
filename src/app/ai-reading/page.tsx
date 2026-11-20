'use client'
import usePageTitle from '@/hooks/usePageTitle'

import { useState, useMemo, useRef, useEffect } from 'react'
import PageHeader from '@/components/PageHeader'
import { RubyText } from '@/components/Ruby'
import { baguaMap, getHexagramName, getHexagramSymbol, BAGUA_WUXING } from '@/data/bagua'
import { hexagramOrder, getHexagramDetail } from '@/data/hexagrams'
import { purgeLegacyApiKey, readApiKey, saveApiKey, clearStoredApiKey } from '@/lib/apiKeyStore'

// DeepSeek API 配置
// 纯静态站没有后端，默认由浏览器直连 DeepSeek；如果不想让 Key 出现在前端，
// 可通过 NEXT_PUBLIC_AI_ENDPOINT（构建期注入）指向自己的转发代理。
const DEFAULT_API_URL = 'https://api.deepseek.com/chat/completions'
const API_URL = process.env.NEXT_PUBLIC_AI_ENDPOINT || DEFAULT_API_URL

interface HexData {
  upperId: string; lowerId: string
  name: string; symbol: string
  detail: ReturnType<typeof getHexagramDetail>
}

interface ChatMessage {
  role: 'user' | 'assistant'
  content: string
}

/** 根据所选卦象生成系统提示词 */
function buildSystemPrompt(hex: HexData): string {
  const ub = baguaMap[hex.upperId]
  const lb = baguaMap[hex.lowerId]
  const detail = hex.detail
  const yaoTexts = detail?.yaoLines?.map(y => `${y.pos}：${y.text}（${y.meaning}）`).join('\n') ?? ''

  return `你是一位精通《周易》的易学专家，擅长用现代语言解读卦象。

当前正在讨论的卦象：
卦名：${hex.name}（${hex.symbol}）
上卦：${ub.name}（${ub.symbol}）— ${ub.nature}，五行属${BAGUA_WUXING[hex.upperId]}
下卦：${lb.name}（${lb.symbol}）— ${lb.nature}，五行属${BAGUA_WUXING[hex.lowerId]}
卦辞：${detail?.judgment ?? '无'}
象辞：${detail?.image ?? '无'}
现代释义：${detail?.meaning ?? '无'}
爻辞：\n${yaoTexts || '无'}

回答要求：
1. 用现代人的语言，接地气，别太玄乎
2. 每次回答简洁有力（100-200字），不说废话
3. 如果用户追问具体领域（事业、感情、健康等），结合卦象给出针对性的建议
4. 初次解读从"卦象解析、核心价值观、生活指引、一句话总结"四个角度展开
5. 允许用户追问细节或切换话题，保持对话连贯`
}

export default function AIReadingPage() {
  usePageTitle()

  const [hex, setHex] = useState<HexData | null>(null)
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [apiKey, setApiKey] = useState("")
  const [showKeyInput, setShowKeyInput] = useState(true)
  const [picker, setPicker] = useState(false)
  const [search, setSearch] = useState('')
  const abortRef = useRef<AbortController | null>(null)
  const listEndRef = useRef<HTMLDivElement>(null)

  // 启动时从 sessionStorage 读取 API Key；同时清掉旧版本留在 localStorage 的明文 Key
  useEffect(() => {
    purgeLegacyApiKey()
    const saved = readApiKey()
    if (saved) {
      setApiKey(saved)
      setShowKeyInput(false)
    }
  }, [])

  const saveApiKeyToSession = (value: string) => {
    setApiKey(value)
    saveApiKey(value)
    setShowKeyInput(false)
  }

  const clearApiKey = () => {
    setApiKey('')
    clearStoredApiKey()
    setShowKeyInput(true)
  }

  // 组件卸载时取消进行中的请求
  useEffect(() => {
    return () => abortRef.current?.abort()
  }, [])

  // 新消息到达时自动滚动到底部
  useEffect(() => {
    listEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, loading])

  const filtered = useMemo(() => {
    if (!search) return hexagramOrder
    const q = search.toLowerCase().trim()
    return hexagramOrder.filter(([u, l]) => getHexagramName(u, l).includes(q))
  }, [search])

  const selectHex = (u: string, l: string) => {
    const newHex = {
      upperId: u, lowerId: l,
      name: getHexagramName(u, l),
      symbol: getHexagramSymbol(u, l),
      detail: getHexagramDetail(u, l),
    }
    setHex(newHex)
    setMessages([])     // 清空对话
    setInput('')
    setPicker(false)
    setSearch('')
  }

  /** 统一发送消息：首次解读和追问都用这个 */
  const sendMessage = async (userContent?: string) => {
    if (!hex || !apiKey) return

    // 取消前一次请求
    if (abortRef.current) abortRef.current.abort()
    const controller = new AbortController()
    abortRef.current = controller

    // 构建消息列表
    const msgs = [...messages]
    if (userContent) msgs.push({ role: 'user', content: userContent })
    setMessages([...msgs, { role: 'assistant', content: '' }])
    setLoading(true)

    const apiMsgs = [
      { role: 'system', content: buildSystemPrompt(hex) },
      ...msgs.map(m => ({ role: m.role, content: m.content })),
    ]

    try {
      const res = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: 'deepseek-chat',
          messages: apiMsgs,
          stream: true,
          max_tokens: 2000,
          temperature: 0.7,
        }),
        signal: controller.signal,
      })

      if (!res.ok) {
        const err = await res.text()
        setMessages(prev => {
          const copy = [...prev]
          if (copy.length > 0) copy[copy.length - 1].content = `⚠️ API 错误 (${res.status}): ${err}`
          return copy
        })
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
              setMessages(prev => {
                const copy = [...prev]
                if (copy.length > 0) copy[copy.length - 1].content += content
                return copy
              })
            }
          } catch {
            // skip partial lines
          }
        }
      }
    } catch (err: unknown) {
      if (err instanceof Error && err.name !== 'AbortError') {
        setMessages(prev => {
          const copy = [...prev]
          if (copy.length > 0) copy[copy.length - 1].content = `⚠️ 请求失败: ${err.message}`
          return copy
        })
      }
    }

    setLoading(false)
  }

  const handleSubmit = () => {
    const text = input.trim()
    if (!text || loading) return
    setInput('')
    sendMessage(text)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSubmit()
    }
  }

  // 消息渲染
  const hasMessages = messages.length > 0
  const isFirstReading = messages.length === 1 && messages[0].role === 'assistant' && messages[0].content.length > 0 && !loading

  return (
    <>
      <PageHeader title="AI 解卦" subtitle="选一个卦，与 AI 易学导师对话交流。" />

      {/* API Key 配置 */}
      {showKeyInput && (
        <div className="max-w-[500px] mx-auto mb-4 p-3 rounded-xl bg-[var(--bg3)] border border-[var(--border)]"
          data-mcp-action="configure-api-key"
          data-mcp-description="配置 DeepSeek API Key。用户需要提供自己的 API Key 才能使用 AI 解卦功能。"
          data-mcp-params='{"required": ["apiKey"]}'
        >
          <div className="text-[11px] text-[var(--muted)] mb-1.5">
            需要 DeepSeek API Key 才能解卦
          </div>
          <div className="flex gap-2">
            <input
              type="password"
              value={apiKey}
              onChange={e => setApiKey(e.target.value)}
              placeholder="sk-..."
              data-mcp-param="apiKey"
              data-mcp-description="DeepSeek API Key，以 sk- 开头。在 platform.deepseek.com 获取。"
              className="flex-1 px-3 py-2 rounded-lg bg-[var(--bg2)] border border-[var(--border)] text-[var(--fg)] text-sm outline-none focus:border-[var(--accent)] caret-[var(--accent)]"
            />
            <button onClick={() => saveApiKeyToSession(apiKey)}
              data-mcp-action="confirm-api-key"
              data-mcp-description="确认 DeepSeek API Key，只保存在当前浏览器会话"
              className="px-3 py-2 text-xs bg-[var(--accent)] text-[var(--bg)] rounded-lg cursor-pointer font-semibold whitespace-nowrap">确认</button>
          </div>
          <p className="text-[10px] text-[var(--muted)] leading-relaxed mt-2">
            Key 只存在当前浏览器会话（关闭页面即清除），不写入磁盘。请求由浏览器直连 DeepSeek，这是纯静态站的架构取舍；若不愿在前端暴露 Key，可用 <code className="text-[var(--accent)]">NEXT_PUBLIC_AI_ENDPOINT</code> 指向自建代理再构建。
          </p>
        </div>
      )}

      {/* Key 已配置时的精简状态条 */}
      {!showKeyInput && (
        <div className="max-w-[500px] mx-auto mb-4 flex items-center justify-between gap-2 px-3 py-2 rounded-xl bg-[var(--bg3)] border border-[var(--border)]">
          <span className="text-[11px] text-[var(--muted)]">🔑 Key 已配置（仅本次会话有效）</span>
          <div className="flex gap-3 shrink-0">
            <button onClick={() => setShowKeyInput(true)}
              className="text-[11px] text-[var(--accent)] cursor-pointer hover:underline">更换</button>
            <button onClick={clearApiKey}
              className="text-[11px] text-[var(--risk)] cursor-pointer hover:underline">清除</button>
          </div>
        </div>
      )}

      {/* 选卦 */}
      <div className="max-w-[500px] mx-auto mb-4">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setPicker(true)}
            data-mcp-action="select-hexagram-for-reading"
            data-mcp-description="从64卦中选择一个卦进行AI解读"
            className="flex-1 flex items-center gap-3 px-4 py-3 rounded-xl bg-[var(--card)] border border-[var(--border)] cursor-pointer hover:border-[var(--accent)] transition-colors text-left"
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
                <span className="text-[var(--muted)] text-lg">▼</span>
              </>
            ) : (
              <div className="flex-1 text-center py-2 text-[var(--muted)] text-sm">← 选择要解读的卦 →</div>
            )}
          </button>

          {/* 首次解卦按钮 */}
          {hex && !hasMessages && (
            <button
              onClick={() => sendMessage()}
              disabled={loading || !apiKey}
              className="px-5 py-3 text-sm font-semibold tracking-wider bg-gradient-to-r from-[var(--accent)] to-[var(--accent2)] text-[var(--bg)] border-none rounded-xl cursor-pointer transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_4px_16px_var(--glow)] disabled:opacity-40 disabled:cursor-not-allowed disabled:translate-y-0 shrink-0"
            >
              {loading ? '🤔 解卦中…' : '🔮 AI 解卦'}
            </button>
          )}
        </div>
        {!apiKey && (
          <div className="text-[10px] text-[var(--risk)] mt-1 text-center">请先配置 API Key</div>
        )}
        {/* 换卦提示 */}
        {hex && hasMessages && (
          <div className="text-[10px] text-[var(--muted)] text-center mt-1 opacity-60">
            ↻ 选其他卦可开始新对话
          </div>
        )}
      </div>

      {/* 消息列表 */}
      {hasMessages && (
        <div className="max-w-[600px] mx-auto mb-4 space-y-3">
          {messages.map((msg, i) => (
            <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div
                className={`max-w-[85%] rounded-2xl px-4 py-3 text-[13px] leading-relaxed ${
                  msg.role === 'user'
                    ? 'bg-[var(--accent)]/15 text-[var(--fg)] rounded-br-md'
                    : 'bg-[var(--bg3)] text-[var(--fg)] rounded-bl-md'
                }`}
              >
                {msg.role === 'assistant' && i === 0 && hex && (
                  <div className="text-center mb-3 pb-3 border-b border-[var(--border)]">
                    <div className="text-[36px] mb-1">{hex.symbol}</div>
                    <div className="text-[16px] font-bold"><RubyText text={hex.name} /></div>
                    <div className="text-[10px] text-[var(--muted)]">
                      {baguaMap[hex.upperId].name} · {baguaMap[hex.lowerId].name}
                    </div>
                  </div>
                )}
                <div className="whitespace-pre-wrap break-words">{msg.content}</div>
                {loading && i === messages.length - 1 && msg.role === 'assistant' && (
                  <span className="inline-block w-[6px] h-[14px] bg-[var(--fg)] ml-0.5 animate-pulse align-text-bottom" />
                )}
              </div>
            </div>
          ))}
          <div ref={listEndRef} />
        </div>
      )}

      {/* 输入框 — 首次解读完成后出现 */}
      {hasMessages && !loading && (
        <div className="max-w-[600px] mx-auto sticky bottom-4">
          <div className="flex gap-2 bg-[var(--card)] border border-[var(--border)] rounded-2xl p-2 shadow-[0_8px_32px_var(--shadow)]">
            <input
              type="text"
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="输入你的问题…"
              disabled={!apiKey}
              autoFocus
              className="flex-1 px-4 py-2 bg-transparent text-[var(--fg)] text-sm outline-none placeholder:text-[var(--muted)] disabled:opacity-30"
            />
            <button
              onClick={handleSubmit}
              disabled={!input.trim() || !apiKey}
              className="px-4 py-2 text-sm font-semibold bg-[var(--accent)] text-[var(--bg)] rounded-xl cursor-pointer transition-all hover:bg-[var(--accent2)] disabled:opacity-30 disabled:cursor-not-allowed shrink-0"
            >
              发送
            </button>
          </div>
        </div>
      )}

      {/* 空状态 */}
      {!hasMessages && hex && (
        <div className="max-w-[600px] mx-auto text-center py-16">
          <div className="text-[48px] mb-4 opacity-30">{hex.symbol}</div>
          <p className="text-sm text-[var(--muted)]">点击「AI 解卦」开始对话</p>
        </div>
      )}

      {/* 选卦弹窗 */}
      {picker && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40"
          onClick={() => { setPicker(false); setSearch('') }}
          role="dialog"
          aria-modal="true"
          aria-label="选择卦象"
        >
          <div
            className="bg-[var(--card)] border border-[var(--border)] rounded-2xl w-full max-w-[420px] max-h-[70vh] flex flex-col overflow-hidden animate-[fadeIn_0.15s_ease]"
            onClick={e => e.stopPropagation()}
            data-mcp-action="pick-hexagram-from-list"
            data-mcp-description="从64卦列表中搜索并选择一个卦"
            data-mcp-params='{"optional": ["search"]}'
          >
            <div className="p-3 border-b border-[var(--border)]">
              <input
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="搜索卦名…"
                autoFocus
                data-mcp-param="search"
                data-mcp-description="按卦名搜索过滤"
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
        ⚡ 调用 DeepSeek API，需自行配置 API Key（仅存当前会话）。可多轮对话追问卦象细节。
      </p>
    </>
  )
}
