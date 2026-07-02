'use client'

export function useWebGLSupport(): boolean {
  if (typeof window === 'undefined') return false
  try {
    const canvas = document.createElement('canvas')
    return !!(
      typeof WebGLRenderingContext !== 'undefined' &&
      (!!canvas.getContext('webgl') || !!canvas.getContext('webgl2'))
    )
  } catch {
    return false
  }
}
