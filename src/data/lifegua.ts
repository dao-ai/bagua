// 本命卦 — 三元命卦简化版推算与解读

import { baguaMap } from './bagua'

export interface LifeGuaResult {
  baguaId: string
  name: string
  symbol: string
  number: number
  element: string
  personality: string
  advice: string
  interpretation: string
}

// 余数 → 八卦 ID 映射（洛书九宫数）
// 5 为特例，由 calculateLifeGua 处理
const remainderToBagua: Record<number, string> = {
  1: 'kan',
  2: 'kun',
  3: 'zhen',
  4: 'xun',
  6: 'qian',
  7: 'dui',
  8: 'gen',
  9: 'li',
}

// 五行对应
const elementMap: Record<string, string> = {
  qian: '金', kun: '土', zhen: '木', xun: '木',
  kan: '水', li: '火', gen: '土', dui: '金',
}

// 简化解读
const personalityMap: Record<string, string> = {
  qian: '刚健自强，天生领导者。独立、果断，有强烈的使命感和推动力。做事讲究效率，目标感极强。',
  kun: '厚德载物，天生承载者。包容、稳重，擅长让事情落地。看似低调，实则是团队的定海神针。',
  zhen: '春雷惊蛰，天生的开创者。行动力强，敢于突破，不怕挑战。适合开拓新局、从零到一。',
  xun: '风行草偃，天生的沟通者。灵活变通，善于协调。在复杂关系中如鱼得水，信息嗅觉敏锐。',
  kan: '如水善利，天生的洞察者。思维深邃，善于在危机中找到出路。外表淡定，内心有极强的韧性。',
  li: '火照四方，天生的思想者。好学好问，追求精神世界的丰盈。善于表达，容易被知识和文化吸引。',
  gen: '如山安定，天生的守成者。稳重务实，做事有条不紊。不轻易改变，但一旦决定就持之以恒。',
  dui: '湖泽映天，天生的社交家。善于表达和分享，感染身边的人。喜欢在愉悦的氛围中工作和生活。',
}

const adviceMap: Record<string, string> = {
  qian: '🪷 提醒：刚健固然好，但别忘了柔韧的价值。适当放权，学会倾听，才走得更远。',
  kun: '🪷 提醒：包容不是没有底线。在适当的时候表达立场，你的「不」和「是」一样重要。',
  zhen: '🪷 提醒：行动力是天赋，但冲动是陷阱。大事面前三思而后行，别让勇敢变成鲁莽。',
  xun: '🪷 提醒：灵活是优势，但别失去主心骨。在随风而动的时候，别忘了自己要去哪里。',
  kan: '🪷 提醒：深思熟虑是你的本能，但别过度内耗。有些答案只有跳进去才知道。',
  li: '🪷 提醒：热爱真理是好品质，但别总用自己的标准衡量别人。温度比亮度更重要。',
  gen: '🪷 提醒：稳定是你的力量，但别害怕偶尔的不确定。只有冒一点险，才能看到新风景。',
  dui: '🪷 提醒：取悦他人是你的天赋，但别忘了取悦自己。先让自己开心，你的快乐才能感染别人。',
}

const interpretationMap: Record<string, string> = {
  qian: '乾卦是你的"先天密码"。你天生具备领袖气质，做事有始有终，追求卓越。在团队里你往往扮演推动者的角色，别人跟着你走就安心。但你也要注意：不是每个人都像你一样大步流星。适当慢下来，等等身边的人，你的脚步会更稳。',
  kun: '坤卦是你的"先天底色"。你最大的武器不是锋芒，而是格局。你能容纳不同的声音，能承载复杂的局面。很多人觉得自己在团队里微不足道，但你恰恰是最重要的那个"土壤"——没有你，花开不了。只是记得也要给自己施肥，别只管滋养别人。',
  zhen: '震卦是你的"天生能量"。你有一种"说干就干"的魄力，别人还在犹豫，你已经冲出去了。你适合做开创性的工作，从零到一是你的拿手好戏。但震的能量也容易来得快去得快——学会持续发力，比学会爆发更难。',
  xun: '巽卦是你的"天赋波段"。你对"人"和"关系"有天生的敏感度，能感知到别人没说的东西。在职场、社交中，你往往是最早读懂气氛的人。但别让这份敏感变成"讨好"——顺势而为和随风倒，中间只差一个主心骨。',
  kan: '坎卦是你的"深邃之源"。你不怕困难，甚至有些享受在困境中找出口的过程。很多人在风平浪静时活得很好，你在风浪里反而更清醒。但坎的智慧也提醒你：不是所有问题都要独自扛，学会向外求助，也是一种勇气。',
  li: '离卦是你的"精神之光"。你对知识和智慧有一种天然的向往，喜欢追根究底。你的魅力来自你脑袋里那些有趣的想法和独到的见解。但离卦外明内虚——别忘了把知识变成行动，照亮别人之前，先要暖好自己。',
  gen: '艮卦是你的"定力根基"。你做事靠谱，答应的事一定能做到。你不喜欢变化，一旦确定了节奏就不会随便改。在这个什么都快的时代，你的稳是一种稀缺的能力。但艮卦也提醒你：止中有动才是大智慧——偶尔打破一下习惯，会有意想不到的收获。',
  dui: '兑卦是你的"喜悦密码"。你天生知道怎么让别人开心，怎么让气氛活跃起来。你的笑容和表达有感染力，跟你在一起的人会觉得轻松。但兑卦也告诉你：真正的快乐来自内心深处——别只做别人的阳光，也要找到属于自己的光。',
}

/**
 * 计算本命卦（三元命卦简化版）
 *
 * 算法来源：八宅风水的三元命卦推算
 * - 男命：(100 − 出生年后两位) ÷ 9 取余数；余5寄坤
 * - 女命：(出生年后两位 − 4) ÷ 9 取余数；余数0→9，余5寄艮
 *
 * @param year 出生年份（四位数字，如 1990）
 * @param gender 性别
 * @returns 本命卦结果
 */
export function calculateLifeGua(year: number, gender: 'male' | 'female'): LifeGuaResult {
  const lastTwo = year % 100
  let remainder: number

  if (gender === 'male') {
    // (100 - lastTwo) % 9
    remainder = ((100 - lastTwo) % 9 + 9) % 9
    // 余5 → 男寄坤（余数2）
    if (remainder === 5) remainder = 2
  } else {
    // (lastTwo - 4) % 9
    remainder = ((lastTwo - 4) % 9 + 9) % 9
    // 余0 → 9（离卦）
    if (remainder === 0) remainder = 9
    // 余5 → 女寄艮（余数8）
    if (remainder === 5) remainder = 8
  }

  const baguaId = remainderToBagua[remainder]
  const target = baguaMap[baguaId]

  return {
    baguaId,
    name: target.name,
    symbol: target.symbol,
    number: remainder === 5 ? (gender === 'male' ? 2 : 8) : remainder,
    element: elementMap[baguaId],
    personality: personalityMap[baguaId],
    advice: adviceMap[baguaId],
    interpretation: interpretationMap[baguaId],
  }
}
