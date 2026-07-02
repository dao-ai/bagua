// 本命卦 — 三元命卦简化版 + 四柱补充卦推算

import { baguaMap, BAGUA_WUXING } from './bagua'

/** 单个卦结果 */
export interface GuaResult {
  baguaId: string
  name: string
  symbol: string
  number: number
  element: string
}

/** 完整本命卦结果 */
export interface LifeGuaResult {
  year: GuaResult      // 年卦 — 主命卦
  month: GuaResult     // 月卦 — 当下能量
  day: GuaResult       // 日卦 — 日常表现
  hour: GuaResult      // 时卦 — 深层本质

  personality: string
  advice: string
  interpretation: string
}

// 余数 → 八卦 ID（洛书九宫数）
const remainderToBagua: Record<number, string> = {
  1: 'kan', 2: 'kun', 3: 'zhen', 4: 'xun',
  6: 'qian', 7: 'dui', 8: 'gen', 9: 'li',
}

// 五行 — 使用统一的 BAGUA_WUXING

// ═══════════════════════════════════════
//  余数 → 卦（处理 5 的寄宫 + 0→9）
// ═══════════════════════════════════════
function remainderToGua(rem: number, gender: 'male' | 'female'): GuaResult {
  let r = rem
  // 余0 → 9（离）
  if (r === 0) r = 9
  // 余5 → 寄宫
  if (r === 5) r = gender === 'male' ? 2 : 8

  const baguaId = remainderToBagua[r]
  const target = baguaMap[baguaId]
  return {
    baguaId,
    name: target.name,
    symbol: target.symbol,
    number: r,
    element: BAGUA_WUXING[baguaId],
  }
}

// ═══════════════════════════════════════
//  时辰索引
// ═══════════════════════════════════════
export const shichenList = [
  { index: 0, name: '子时', range: '23:00 — 00:59' },
  { index: 1, name: '丑时', range: '01:00 — 02:59' },
  { index: 2, name: '寅时', range: '03:00 — 04:59' },
  { index: 3, name: '卯时', range: '05:00 — 06:59' },
  { index: 4, name: '辰时', range: '07:00 — 08:59' },
  { index: 5, name: '巳时', range: '09:00 — 10:59' },
  { index: 6, name: '午时', range: '11:00 — 12:59' },
  { index: 7, name: '未时', range: '13:00 — 14:59' },
  { index: 8, name: '申时', range: '15:00 — 16:59' },
  { index: 9, name: '酉时', range: '17:00 — 18:59' },
  { index: 10, name: '戌时', range: '19:00 — 20:59' },
  { index: 11, name: '亥时', range: '21:00 — 22:59' },
]

// ═══════════════════════════════════════
//  四柱命卦推算
// ═══════════════════════════════════════

/**
 * 年卦 — 本命卦（三元命卦）
 *
 * 男命：(100 − 年后两位) % 9，余5寄坤
 * 女命：(年后两位 − 4) % 9，余0→9，余5寄艮
 */
function calcYearGua(year: number, gender: 'male' | 'female'): GuaResult {
  const lastTwo = year % 100
  let r = gender === 'male'
    ? ((100 - lastTwo) % 9 + 9) % 9
    : ((lastTwo - 4) % 9 + 9) % 9
  return remainderToGua(r, gender)
}

/**
 * 月卦 — 月份洛书数
 * 月份数 % 9，余0→9
 */
function calcMonthGua(month: number, gender: 'male' | 'female'): GuaResult {
  return remainderToGua(month % 9, gender)
}

/**
 * 日卦 — 日期洛书数
 * 日期数 % 9，余0→9
 */
function calcDayGua(day: number, gender: 'male' | 'female'): GuaResult {
  return remainderToGua(day % 9, gender)
}

/**
 * 时卦 — 时辰洛书数
 * (时辰索引 + 1) % 9，余0→9
 */
function calcHourGua(shichenIndex: number, gender: 'male' | 'female'): GuaResult {
  return remainderToGua((shichenIndex + 1) % 9, gender)
}

// ═══════════════════════════════════════
//  解读文案
// ═══════════════════════════════════════

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

/** 四柱各卦的简短解读 */
export const pillarInterpretation: Record<string, Record<string, string>> = {
  month: {
    qian: '月入乾宫，这个月你思路清晰、行动力强，适合推动关键事务。',
    kun:  '月入坤宫，本月宜包容等待，不适合硬闯。顺势而为，自有结果。',
    zhen: '月入震宫，这个月有新的机会开启，勇敢迈出第一步。',
    xun:  '月入巽宫，本月人际关系活跃，适合沟通协商、拓展人脉。',
    kan:  '月入坎宫，本月内心易有波动，适合沉淀思考，不宜冒进。',
    li:   '月入离宫，这个月求知欲强，适合学习、写作、表达创意。',
    gen:  '月入艮宫，本月宜守不宜攻，稳扎稳打比激进更重要。',
    dui:  '月入兑宫，这个月社交运好，适合聚会、交流、开心地做事。',
  },
  day: {
    qian: '日入乾宫，今天你精力充沛，适合做决策、推进关键事项。',
    kun:  '日入坤宫，今天宜沉下心来，做好手头的每一件小事。',
    zhen: '日入震宫，今天行动力在线，适合启动新任务、运动锻炼。',
    xun:  '日入巽宫，今天适合沟通交流，多听听别人的想法。',
    kan:  '日入坎宫，今天需要多留个心眼，细节处容易出问题。',
    li:   '日入离宫，今天灵感不错，适合创作、阅读、表达。',
    gen:  '日入艮宫，今天不宜变动，按计划行事就是最好的节奏。',
    dui:  '日入兑宫，今天心情不错，适合和朋友分享、吃顿好的。',
  },
  hour: {
    qian: '时入乾宫，你内心深处有强烈的进取心，不甘平庸。',
    kun:  '时入坤宫，你内心渴望被理解和接纳，需要一个安定的归属。',
    zhen: '时入震宫，你的潜意识里藏着不安分的能量，随时准备突破。',
    xun:  '时入巽宫，你内心敏感细腻，能察觉到别人忽略的细节。',
    kan:  '时入坎宫，独处时你会想很多，需要学会在安静中安放自己。',
    li:   '时入离宫，你的精神世界丰富，独处时总有想不完的灵感。',
    gen:  '时入艮宫，你内心追求稳定和平静，不轻易向外人敞开。',
    dui:  '时入兑宫，你骨子里乐观开朗，即使独处也能自得其乐。',
  },
}

// ═══════════════════════════════════════
//  主入口
// ═══════════════════════════════════════

export function calculateLifeGua(
  year: number,
  month: number,
  day: number,
  shichenIndex: number,
  gender: 'male' | 'female',
): LifeGuaResult {
  const yearGua = calcYearGua(year, gender)
  const monthGua = calcMonthGua(month, gender)
  const dayGua = calcDayGua(day, gender)
  const hourGua = calcHourGua(shichenIndex, gender)

  const bid = yearGua.baguaId

  return {
    year: yearGua,
    month: monthGua,
    day: dayGua,
    hour: hourGua,
    personality: personalityMap[bid],
    advice: adviceMap[bid],
    interpretation: interpretationMap[bid],
  }
}
