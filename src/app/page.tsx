'use client'
import usePageTitle from '@/hooks/usePageTitle'

import DailyHexagram from '@/components/DailyHexagram'

export default function HomePage() {
  usePageTitle()

  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center">
      <DailyHexagram />
    </div>
  )
}
