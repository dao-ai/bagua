'use client'
import { useState, useEffect } from 'react'

export interface ThemeColors {
  yang: string
  yin: string
  accent: string
  accent2: string
  bg: string
}

function readColors(): ThemeColors {
  if (typeof document === 'undefined') {
    return { yang: '#f59e0b', yin: '#4a5a7a', accent: '#d97706', accent2: '#f59e0b', bg: '#0b1120' }
  }
  const s = getComputedStyle(document.documentElement)
  const g = (n: string) => s.getPropertyValue(n).trim()
  return { yang: g('--yang'), yin: g('--yin'), accent: g('--accent'), accent2: g('--accent2'), bg: g('--bg') }
}

export function useThemeColors(): ThemeColors {
  const [colors, setColors] = useState<ThemeColors>(readColors)

  useEffect(() => {
    const el = document.documentElement
    const observer = new MutationObserver(() => setColors(readColors()))
    observer.observe(el, { attributes: true, attributeFilter: ['class'] })
    return () => observer.disconnect()
  }, [])

  return colors
}

export { readColors }
