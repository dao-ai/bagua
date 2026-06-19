'use client'

import { getPinyin } from '@/data/pinyin'

/**
 * 将文本中含生僻字的字符包裹在 <ruby> 标签中，打开注音时显示拼音。
 * 使用方式：
 *   <RubyText text="乾坤屯蒙需讼师" />
 * 或对已有 JSX 手动套 ruby：
 *   <Ruby char="乾" pinyin="qián" />
 */
export function RubyText({ text, className }: { text: string; className?: string }) {
  return (
    <span className={className}>
      {Array.from(text).map((char, i) => {
        const py = getPinyin(char)
        return py
          ? <ruby key={i}>{char}<rt>{py}</rt></ruby>
          : <span key={i}>{char}</span>
      })}
    </span>
  )
}

/**
 * 单个字符的 Ruby 注解，用于已有 JSX 中需要注音的部分
 */
export function Ruby({ char, pinyin }: { char: string; pinyin?: string }) {
  const py = pinyin || getPinyin(char)
  if (!py) return <>{char}</>
  return <ruby>{char}<rt>{py}</rt></ruby>
}
