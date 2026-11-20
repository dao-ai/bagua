/**
 * AI 解卦 API Key 的前端存储。
 *
 * 设计约束：
 * - 纯静态站，没有后端可以保管密钥，Key 只能留在用户浏览器里
 * - 因此只用 sessionStorage（关掉页面/标签页即失效），不写 localStorage，
 *   避免密钥长期明文落盘
 * - 旧版本曾把 Key 存进 localStorage，读 Key 前先清掉那份残留
 *
 * 所有存取都做了异常兜底：隐私模式、禁用存储、配额满等情况下退化为
 * 「只在内存里用一次」，不影响页面的其它功能。
 */

export const API_KEY_STORAGE_KEY = 'bagua-api-key'

function getSession(): Storage | null {
  try {
    return typeof sessionStorage === 'undefined' ? null : sessionStorage
  } catch {
    return null
  }
}

function getLocal(): Storage | null {
  try {
    return typeof localStorage === 'undefined' ? null : localStorage
  } catch {
    return null
  }
}

/** 清掉旧版本写在 localStorage 里的明文 Key */
export function purgeLegacyApiKey(): void {
  try {
    getLocal()?.removeItem(API_KEY_STORAGE_KEY)
  } catch {
    // 存储不可用，忽略
  }
}

/** 读取当前会话来带的 Key，没有则返回空串 */
export function readApiKey(): string {
  try {
    return getSession()?.getItem(API_KEY_STORAGE_KEY) ?? ''
  } catch {
    return ''
  }
}

/** 写入当前会话；写不进去也不抛错，调用方仍可在内存里继续用 */
export function saveApiKey(key: string): void {
  try {
    getSession()?.setItem(API_KEY_STORAGE_KEY, key)
  } catch {
    // 忽略
  }
}

/** 清除当前会话里的 Key */
export function clearStoredApiKey(): void {
  try {
    getSession()?.removeItem(API_KEY_STORAGE_KEY)
  } catch {
    // 忽略
  }
}
