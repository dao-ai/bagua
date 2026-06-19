'use client'

import { useState, useEffect, useCallback } from 'react'

const STORAGE_KEY = 'bagua-divine-history'

export interface DivineRecord {
  id: string
  timestamp: number
  method: 'number' | 'coin'
  hexName: string
  changedHexName: string
  nowSymbol: string
  changedSymbol: string
  movingName: string
  movingChange: string
  upperName: string
  lowerName: string
  changedUpperName: string
  changedLowerName: string
  yao6: number[]
  changedYao6: number[]
  movingIndex: number
}

function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 8)
}

export function useDivineHistory() {
  const [records, setRecords] = useState<DivineRecord[]>([])

  // 初始化加载
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      if (raw) {
        const parsed = JSON.parse(raw) as DivineRecord[]
        // 按时间倒序
        parsed.sort((a, b) => b.timestamp - a.timestamp)
        setRecords(parsed)
      }
    } catch { /* ignore corrupt data */ }
  }, [])

  // 持久化
  const persist = useCallback((items: DivineRecord[]) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
  }, [])

  // 添加一条记录
  const addRecord = useCallback((rec: Omit<DivineRecord, 'id' | 'timestamp'>) => {
    setRecords(prev => {
      const next: DivineRecord = {
        ...rec,
        id: generateId(),
        timestamp: Date.now(),
      }
      const updated = [next, ...prev]
      persist(updated)
      return updated
    })
  }, [persist])

  // 删除单条
  const deleteRecord = useCallback((id: string) => {
    setRecords(prev => {
      const updated = prev.filter(r => r.id !== id)
      persist(updated)
      return updated
    })
  }, [persist])

  // 清空全部
  const clearAll = useCallback(() => {
    setRecords([])
    localStorage.removeItem(STORAGE_KEY)
  }, [])

  // 按日期分组
  const grouped = records.reduce<Record<string, DivineRecord[]>>((acc, rec) => {
    const d = new Date(rec.timestamp)
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
    if (!acc[key]) acc[key] = []
    acc[key].push(rec)
    return acc
  }, {})

  return { records, grouped, addRecord, deleteRecord, clearAll }
}

// 从 DivineResult 转为可序列化记录
import type { DivineResult } from './divineTypes'

export function resultToRecord(
  result: DivineResult,
  method: 'number' | 'coin'
): Omit<DivineRecord, 'id' | 'timestamp'> {
  return {
    method,
    hexName: result.hexName,
    changedHexName: result.changedHexName,
    nowSymbol: result.nowSymbol,
    changedSymbol: result.changedSymbol,
    movingName: result.movingName,
    movingChange: result.movingChange,
    upperName: result.upperName,
    lowerName: result.lowerName,
    changedUpperName: result.changedUpperName,
    changedLowerName: result.changedLowerName,
    yao6: result.yao6,
    changedYao6: result.changedYao6,
    movingIndex: result.movingIndex,
  }
}

export function formatDateLabel(dateStr: string): string {
  const d = new Date(dateStr)
  const today = new Date()
  const yesterday = new Date(today)
  yesterday.setDate(yesterday.getDate() - 1)

  const fmt = (dt: Date) => `${dt.getFullYear()}-${String(dt.getMonth() + 1).padStart(2, '0')}-${String(dt.getDate()).padStart(2, '0')}`

  if (dateStr === fmt(today)) return '今天'
  if (dateStr === fmt(yesterday)) return '昨天'
  const weekdays = ['日', '一', '二', '三', '四', '五', '六']
  const dt = new Date(dateStr)
  return `${dateStr} 周${weekdays[dt.getDay()]}`
}

export function formatTime(ts: number): string {
  const d = new Date(ts)
  return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`
}
