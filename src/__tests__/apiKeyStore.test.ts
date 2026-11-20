import { describe, it, expect, beforeEach } from 'vitest'
import {
  API_KEY_STORAGE_KEY,
  readApiKey,
  saveApiKey,
  clearStoredApiKey,
  purgeLegacyApiKey,
} from '@/lib/apiKeyStore'

describe('apiKeyStore', () => {
  beforeEach(() => {
    localStorage.clear()
    sessionStorage.clear()
  })

  it('把 Key 写进 sessionStorage 而不是 localStorage', () => {
    saveApiKey('sk-test')

    expect(sessionStorage.getItem(API_KEY_STORAGE_KEY)).toBe('sk-test')
    expect(localStorage.getItem(API_KEY_STORAGE_KEY)).toBeNull()
  })

  it('读取当前会话的 Key', () => {
    sessionStorage.setItem(API_KEY_STORAGE_KEY, 'sk-session')

    expect(readApiKey()).toBe('sk-session')
  })

  it('没有配置时返回空串', () => {
    expect(readApiKey()).toBe('')
  })

  it('清除后读不到 Key', () => {
    saveApiKey('sk-test')
    clearStoredApiKey()

    expect(readApiKey()).toBe('')
  })

  it('清掉旧版本残留在 localStorage 的明文 Key', () => {
    localStorage.setItem(API_KEY_STORAGE_KEY, 'sk-legacy')
    sessionStorage.setItem(API_KEY_STORAGE_KEY, 'sk-session')

    purgeLegacyApiKey()

    expect(localStorage.getItem(API_KEY_STORAGE_KEY)).toBeNull()
    // 当前会话的 Key 不受影响
    expect(readApiKey()).toBe('sk-session')
  })

  it('存储抛错时不抛出异常', () => {
    const desc = Object.getOwnPropertyDescriptor(window, 'sessionStorage')
    Object.defineProperty(window, 'sessionStorage', {
      configurable: true,
      get() {
        throw new Error('storage disabled')
      },
    })

    try {
      expect(() => readApiKey()).not.toThrow()
      expect(() => saveApiKey('sk-test')).not.toThrow()
      expect(() => clearStoredApiKey()).not.toThrow()
    } finally {
      if (desc) Object.defineProperty(window, 'sessionStorage', desc)
    }
  })
})
