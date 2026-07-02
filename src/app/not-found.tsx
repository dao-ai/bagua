import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      {/* 卦符装饰 */}
      <div className="text-[80px] leading-none mb-4 opacity-30 select-none">䷋</div>

      <h1 className="text-2xl font-bold text-[var(--fg)] mb-2 font-heading">此页不在卦中</h1>
      <p className="text-sm text-[var(--muted)] max-w-[360px] mx-auto mb-10 leading-relaxed">
        天地否，闭塞不通。您要找的页面可能已移走、改名，或从未存在。
      </p>

      <div className="flex gap-4 flex-wrap justify-center">
        <Link
          href="/"
          className="px-6 py-2.5 rounded-xl bg-[var(--accent)] text-white text-sm font-semibold no-underline hover:opacity-90 transition-opacity"
        >
          返回首页
        </Link>
        <Link
          href="/hexagrams"
          className="px-6 py-2.5 rounded-xl border border-[var(--border)] text-[var(--fg)] text-sm font-semibold no-underline hover:border-[var(--accent)] transition-colors"
        >
          浏览六十四卦
        </Link>
      </div>
    </div>
  )
}
