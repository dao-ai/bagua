'use client'

import { createContext, useContext, useState, useCallback, ReactNode } from 'react'

interface PinyinContextType {
  showPinyin: boolean
  toggle: () => void
}

const PinyinContext = createContext<PinyinContextType>({
  showPinyin: false,
  toggle: () => {},
})

export function PinyinProvider({ children }: { children: ReactNode }) {
  const [showPinyin, setShowPinyin] = useState(false)
  const toggle = useCallback(() => setShowPinyin(v => !v), [])
  return (
    <PinyinContext.Provider value={{ showPinyin, toggle }}>
      {children}
    </PinyinContext.Provider>
  )
}

export const usePinyin = () => useContext(PinyinContext)
