// src/app/learn/data/decks.ts
import { createCard } from '../srs'
import type { Card } from '../types'
import { baguaList, getHexagramName, getHexagramSymbol, baguaMap } from '@/data/bagua'
import { hexagramOrder, getHexagramDetail } from '@/data/hexagrams'
import { getYaoLines } from '@/data/yao_lines'
import { getInterlocking, getOpposite, getInverted } from '@/data/hexagramRelations'

export function buildAllCards(): Card[] {
  return [
    ...buildTrigramCards(),
    ...buildHexagramCards(),
    ...buildYaoCards(),
    ...buildRelationCards(),
  ]
}

function buildTrigramCards(): Card[] {
  return baguaList.map(b => {
    const front = `${b.symbol} (${b.binary})`
    const back = [
      `卦名: ${b.name} (${b.pinyin})`,
      `属性: ${b.attribute}`,
      `自然: ${b.nature}`,
      `方位: ${b.direction}`,
      `五行: ${b.keywords[0]}`,
    ].join('\n')
    return createCard(`trigram:${b.id}`, 'trigram', front, back)
  })
}

function buildHexagramCards(): Card[] {
  return hexagramOrder.map(([upperId, lowerId]) => {
    const name = getHexagramName(upperId, lowerId)
    const symbol = getHexagramSymbol(upperId, lowerId)
    const detail = getHexagramDetail(upperId, lowerId)
    const upper = baguaMap[upperId]
    const lower = baguaMap[lowerId]

    const front = symbol
    const back = detail
      ? [
          `卦名: ${name}`,
          `上卦: ${upper.name} · 下卦: ${lower.name}`,
          `卦辞: ${detail.judgment}`,
          `象曰: ${detail.image}`,
        ].join('\n')
      : `卦名: ${name}\n上卦: ${upper.name} · 下卦: ${lower.name}`

    return createCard(`hex:${upperId}-${lowerId}`, 'hexagram', front, back)
  })
}

function buildYaoCards(): Card[] {
  const cards: Card[] = []
  for (const [upperId, lowerId] of hexagramOrder) {
    const lines = getYaoLines(`${upperId}-${lowerId}`)
    if (!lines) continue
    const hexName = getHexagramName(upperId, lowerId)
    lines.forEach((line, i) => {
      const front = `${hexName} · ${line.pos}`
      const back = `${line.text}\n\n${line.meaning}`
      cards.push(createCard(`yao:${upperId}-${lowerId}-${i}`, 'yao', front, back))
    })
  }
  return cards
}

function buildRelationCards(): Card[] {
  const cards: Card[] = []
  const relations = [
    { key: 'interlocking' as const, fn: getInterlocking, label: '互卦' },
    { key: 'opposite' as const, fn: getOpposite, label: '错卦' },
    { key: 'inverted' as const, fn: getInverted, label: '综卦' },
  ]

  for (const [upperId, lowerId] of hexagramOrder) {
    const sourceName = getHexagramName(upperId, lowerId)
    for (const { key, fn, label } of relations) {
      const result = fn(upperId, lowerId)
      if (!result) continue
      const front = `${sourceName} 的${label}是？`
      const back = `${label}: ${result.name}\n${result.symbol}`
      cards.push(createCard(`rel:${upperId}-${lowerId}-${key}`, 'relation', front, back))
    }
  }
  return cards
}
