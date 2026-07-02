'use client'

import { Component, type ReactNode } from 'react'

interface Props {
  children: ReactNode
  fallback?: ReactNode
}

interface State {
  hasError: boolean
  error: Error | null
}

export default class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false, error: null }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    console.error('[ErrorBoundary]', error, info.componentStack)
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) return this.props.fallback

      return (
        <div className="flex flex-col items-center justify-center py-16 text-center px-5">
          <div className="text-[64px] leading-none mb-4 opacity-30 select-none">䷛</div>
          <h2 className="text-xl font-bold text-[var(--fg)] mb-2 font-heading">出了点状况</h2>
          <p className="text-sm text-[var(--muted)] max-w-[360px] mx-auto mb-8 leading-relaxed">
            大过，栋桡。页面在渲染时遇到了意外错误。刷新页面通常能解决，若问题持续请反馈。
          </p>
          <button
            onClick={() => this.setState({ hasError: false, error: null })}
            className="px-6 py-2.5 rounded-xl bg-[var(--accent)] text-white text-sm font-semibold hover:opacity-90 transition-opacity cursor-pointer border-none"
          >
            再试一次
          </button>
        </div>
      )
    }

    return this.props.children
  }
}
