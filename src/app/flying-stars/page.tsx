'use client'
import usePageTitle from '@/hooks/usePageTitle'
import PageHeader from '@/components/PageHeader'
import dynamic from 'next/dynamic'
import { Skeleton } from '@/components/ui/skeleton'

const FlyingStars = dynamic(() => import('@/components/FlyingStars'), {
  loading: () => (
    <div className="space-y-4">
      <PageHeader title="九宫飞星" subtitle="加载中…" />
      <Skeleton className="h-96 w-full rounded-xl" />
    </div>
  ),
})

export default function FlyingStarsPage() {
  usePageTitle()
  return <FlyingStars />
}
