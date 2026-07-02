'use client'
import usePageTitle from '@/hooks/usePageTitle'
import PageHeader from '@/components/PageHeader'
import dynamic from 'next/dynamic'

const FlyingStars = dynamic(() => import('@/components/FlyingStars'), {
  loading: () => (
    <div className="space-y-4">
      <PageHeader title="九宫飞星" subtitle="加载中…" />
      <div className="h-96 rounded-xl bg-[var(--card)] border border-[var(--border)] animate-pulse" />
    </div>
  ),
})

export default function FlyingStarsPage() {
  usePageTitle()
  return <FlyingStars />
}
