'use client'

import { useEffect, useState } from 'react'

export default function InstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null)
  const [showInstall, setShowInstall] = useState(false)
  const [standalone, setStandalone] = useState(false)

  useEffect(() => {
    // Already running as installed PWA → hide button
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setStandalone(true)
      return
    }

    // Listen for appinstalled (after successful install)
    const onInstalled = () => setShowInstall(false)
    window.addEventListener('appinstalled', onInstalled)

    // Capture the install prompt event (fired by Chrome when PWA criteria are met)
    const onPrompt = (e: Event) => {
      e.preventDefault()
      setDeferredPrompt(e)
      setShowInstall(true)
    }
    window.addEventListener('beforeinstallprompt', onPrompt)

    // Fallback: if SW is registered but beforeinstallprompt hasn't fired after 4s,
    // still show the button (works on some browsers / modes)
    const timer = setTimeout(async () => {
      if (!showInstall && 'serviceWorker' in navigator) {
        const reg = await navigator.serviceWorker.getRegistration()
        if (reg?.active) {
          setShowInstall(true)
        }
      }
    }, 4000)

    return () => {
      window.removeEventListener('appinstalled', onInstalled)
      window.removeEventListener('beforeinstallprompt', onPrompt)
      clearTimeout(timer)
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const handleInstall = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt()
      const result = await deferredPrompt.userChoice
      if (result.outcome === 'accepted') {
        setShowInstall(false)
      }
      setDeferredPrompt(null)
    } else {
      // No beforeinstallprompt captured — guide the user
      alert('请在浏览器菜单或地址栏中选择「添加至主屏幕」安装')
    }
  }

  if (standalone || !showInstall) return null

  return (
    <button
      onClick={handleInstall}
      className="fixed bottom-6 right-6 z-50 flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium shadow-lg transition-all hover:scale-105 active:scale-95 cursor-pointer"
      style={{
        background: 'var(--accent)',
        color: '#fff',
        boxShadow: '0 4px 16px rgba(0,0,0,0.3)',
      }}
    >
      📲 安装到桌面
    </button>
  )
}
