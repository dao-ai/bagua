'use client'

import { useEffect, useState } from 'react'

export default function InstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null)
  const [isInstalled, setIsInstalled] = useState(false)
  const [standalone, setStandalone] = useState(false)

  useEffect(() => {
    // Already running as installed PWA → hide button
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setStandalone(true)
      return
    }

    // Already installed via appinstalled event
    const handler = () => setIsInstalled(true)
    window.addEventListener('appinstalled', handler)

    // Capture the install prompt
    const promptHandler = (e: Event) => {
      e.preventDefault()
      setDeferredPrompt(e)
    }
    window.addEventListener('beforeinstallprompt', promptHandler)

    return () => {
      window.removeEventListener('appinstalled', handler)
      window.removeEventListener('beforeinstallprompt', promptHandler)
    }
  }, [])

  const handleInstall = async () => {
    if (!deferredPrompt) return
    deferredPrompt.prompt()
    const result = await deferredPrompt.userChoice
    if (result.outcome === 'accepted') {
      setIsInstalled(true)
    }
    setDeferredPrompt(null)
  }

  // Already installed or running standalone → no button
  if (isInstalled || standalone || !deferredPrompt) return null

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
