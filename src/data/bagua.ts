// 八卦数据
export interface Bagua {
  id: string
  name: string
  pinyin: string
  symbol: string
  yao: number[]  // 下、中、上 (1=阳 0=阴)
  decimal: number
  binary: string
  keywords: string[]
  nature: string
  animal: string
  body: string
  family: string
  direction: string
  season: string
  attribute: string
  description: string
  short: string
}

export const baguaList: Bagua[] = [
  { id:'qian', name:'乾', pinyin:'qián', symbol:'☰', yao:[1,1,1], decimal:7, binary:'111',
    keywords:['健','天','君'], nature:'天', animal:'马', body:'首', family:'父',
    direction:'西北', season:'秋冬之交', attribute:'刚健',
    description:'纯阳之体，健行不息。天行健，君子以自强不息。',
    short:'天行健，自强不息' },
  { id:'kun', name:'坤', pinyin:'kūn', symbol:'☷', yao:[0,0,0], decimal:0, binary:'000',
    keywords:['顺','地','民'], nature:'地', animal:'牛', body:'腹', family:'母',
    direction:'西南', season:'夏秋之交', attribute:'柔顺',
    description:'纯阴之体，厚德载物。地势坤，君子以厚德载物。',
    short:'地势坤，厚德载物' },
  { id:'zhen', name:'震', pinyin:'zhèn', symbol:'☳', yao:[1,0,0], decimal:4, binary:'100',
    keywords:['动','雷','长子'], nature:'雷', animal:'龙', body:'足', family:'长男',
    direction:'东', season:'春', attribute:'发动',
    description:'一阳在下，奋起向上。如春雷惊蛰，万物复苏。',
    short:'一阳奋起，春雷惊蛰' },
  { id:'xun', name:'巽', pinyin:'xùn', symbol:'☴', yao:[0,1,1], decimal:3, binary:'011',
    keywords:['入','风','长女'], nature:'风', animal:'鸡', body:'股', family:'长女',
    direction:'东南', season:'春夏之交', attribute:'渗透',
    description:'一阴在下，风行草偃。风无孔不入，顺势而行。',
    short:'风行草偃，无孔不入' },
  { id:'kan', name:'坎', pinyin:'kǎn', symbol:'☵', yao:[0,1,0], decimal:2, binary:'010',
    keywords:['陷','水','中男'], nature:'水', animal:'豕', body:'耳', family:'中男',
    direction:'北', season:'冬', attribute:'险陷',
    description:'阳陷阴中，外柔内刚。水虽险，亦能润物。',
    short:'外柔内刚，险中求进' },
  { id:'li', name:'离', pinyin:'lí', symbol:'☲', yao:[1,0,1], decimal:5, binary:'101',
    keywords:['附','火','中女'], nature:'火', animal:'雉', body:'目', family:'中女',
    direction:'南', season:'夏', attribute:'附丽',
    description:'阴附阳中，外明内虚。火借物而燃，明照四方。',
    short:'外明内虚，附丽而明' },
  { id:'gen', name:'艮', pinyin:'gèn', symbol:'☶', yao:[0,0,1], decimal:1, binary:'001',
    keywords:['止','山','少男'], nature:'山', animal:'狗', body:'手', family:'少男',
    direction:'东北', season:'冬春之交', attribute:'静止',
    description:'一阳在上，如山耸立。知止而后有定，艮之义也。',
    short:'如山耸立，知止有定' },
  { id:'dui', name:'兑', pinyin:'duì', symbol:'☱', yao:[1,1,0], decimal:6, binary:'110',
    keywords:['悦','泽','少女'], nature:'泽', animal:'羊', body:'口', family:'少女',
    direction:'西', season:'秋', attribute:'喜悦',
    description:'一阴在上，如湖泽映天。沟通交流，以悦待物。',
    short:'湖泽映天，以悦待物' },
]

export const baguaMap = Object.fromEntries(baguaList.map(b => [b.id, b])) as Record<string, Bagua>

// 先天八卦数映射
export const numToBagua: Record<number, string> = {
  1: 'qian', 2: 'dui', 3: 'li', 4: 'zhen',
  5: 'xun', 6: 'kan', 7: 'gen', 0: 'kun',
}

// 六十四卦名表 [下卦][上卦]
export const hexagramNames: string[][] = [
  ['乾','夬','大有','大壮','小畜','需','大畜','泰'],
  ['履','兑','睽','归妹','中孚','节','损','临'],
  ['同人','革','离','丰','家人','既济','贲','明夷'],
  ['无妄','随','噬嗑','震','益','屯','颐','复'],
  ['姤','大过','鼎','恒','巽','井','蛊','升'],
  ['讼','困','未济','解','涣','坎','蒙','师'],
  ['遁','咸','旅','小过','渐','蹇','艮','谦'],
  ['否','萃','晋','豫','观','比','剥','坤'],
]

export const baguaIndex: Record<string, number> = {
  qian: 0, dui: 1, li: 2, zhen: 3,
  xun: 4, kan: 5, gen: 6, kun: 7,
}

export function getHexagramName(upperId: string, lowerId: string): string {
  return hexagramNames[baguaIndex[lowerId]][baguaIndex[upperId]]
}

// 六十四卦unicode符号映射
export const hexagramSymbol: Record<string, string> = {
  '乾':'䷀','坤':'䷁','屯':'䷂','蒙':'䷃','需':'䷄','讼':'䷅','师':'䷆','比':'䷇',
  '小畜':'䷈','履':'䷉','泰':'䷊','否':'䷋','同人':'䷌','大有':'䷍','谦':'䷎','豫':'䷏',
  '随':'䷐','蛊':'䷑','临':'䷒','观':'䷓','噬嗑':'䷔','贲':'䷕','剥':'䷖','复':'䷗',
  '无妄':'䷘','大畜':'䷙','颐':'䷚','大过':'䷛','坎':'䷜','离':'䷝',
  '咸':'䷞','恒':'䷟','遁':'䷠','大壮':'䷡','晋':'䷢','明夷':'䷣',
  '家人':'䷤','睽':'䷥','蹇':'䷦','解':'䷧','损':'䷨','益':'䷩',
  '夬':'䷪','姤':'䷫','萃':'䷬','升':'䷭','困':'䷮','井':'䷯',
  '革':'䷰','鼎':'䷱','震':'䷲','艮':'䷳','渐':'䷴','归妹':'䷵',
  '丰':'䷶','旅':'䷷','巽':'䷸','兑':'䷹','涣':'䷺','节':'䷻',
  '中孚':'䷼','小过':'䷽','既济':'䷾','未济':'䷿',
}

export function getHexagramSymbol(upperId: string, lowerId: string): string {
  return hexagramSymbol[getHexagramName(upperId, lowerId)] || '䷀'
}

// 六十四卦卦辞数据类型
// 在 bagua 中定义以免循环依赖
export interface YaoLine {
  pos: string
  text: string
  meaning: string
}

export interface HexagramDetail {
  judgment: string
  image: string
  meaning: string
  yaoLines?: YaoLine[]
}

// ─── 八卦五行 ───
export const BAGUA_WUXING: Record<string, string> = {
  qian:'金', dui:'金', li:'火', zhen:'木',
  xun:'木', kan:'水', gen:'土', kun:'土',
}

// ─── 爻位名称常量 ───
export const YAO_LABELS = ['初爻', '二爻', '三爻', '四爻', '五爻', '上爻'] as const

// ─── 共享工具函数 ───

/** 根据三爻数组 [下,中,上] 查找八卦 ID */
export function findBaguaByYao(yao: number[]): string | undefined {
  return baguaList.find(
    b => b.yao[0] === yao[0] && b.yao[1] === yao[1] && b.yao[2] === yao[2]
  )?.id
}

/**
 * 从上下卦 ID 构建六爻数组
 * yao6 = [line6, line5, line4, line3, line2, line1]
 * 上卦三爻在上半段（倒序），下卦三爻在下半段（倒序）
 */
export function buildYao6(upperId: string, lowerId: string): number[] {
  const upper = baguaMap[upperId]
  const lower = baguaMap[lowerId]
  return [...upper.yao.slice().reverse(), ...lower.yao.slice().reverse()]
}

/**
 * 从六爻数组反向查找上下卦 ID
 * yao6 = [line6, line5, line4, line3, line2, line1]
 */
export function yao6ToTrigramIds(yao6: number[]): { upperId: string; lowerId: string } | null {
  const upperYao = yao6.slice(0, 3).reverse()
  const lowerYao = yao6.slice(3, 6).reverse()
  const upperId = findBaguaByYao(upperYao)
  const lowerId = findBaguaByYao(lowerYao)
  if (!upperId || !lowerId) return null
  return { upperId, lowerId }
}

// ─── 变卦计算 ───

/** 起卦结果类型 */
export interface DivineResult {
  hexName: string; changedHexName: string
  upperName: string; lowerName: string
  changedUpperName: string; changedLowerName: string
  nowDetail?: HexagramDetail; changedDetail?: HexagramDetail
  nowSymbol: string; changedSymbol: string
  movingName: string; movingChange: string
  yao6: number[]; changedYao6: number[]
  movingIndex: number
  upperId: string; lowerId: string
  changedUpperId: string; changedLowerId: string
}

/** 根据六爻数组和动爻位置（1-based，从下到上）计算变卦结果 */
export function computeHexagramChange(
  yao6: number[],
  movingKey: number,
  getDetail: (upperId: string, lowerId: string) => HexagramDetail | undefined,
): DivineResult {
  const mi = 6 - movingKey
  const ids = yao6ToTrigramIds(yao6)
  if (!ids) throw new Error('invalid trigram')
  const { upperId: ui, lowerId: li } = ids

  const ub = baguaMap[ui], lb = baguaMap[li]
  const hn = getHexagramName(ui, li)
  const nd = getDetail(ui, li)
  const cy6 = [...yao6]; cy6[mi] = cy6[mi] === 1 ? 0 : 1
  const cids = yao6ToTrigramIds(cy6)
  if (!cids) throw new Error('invalid changed trigram')
  const { upperId: cui, lowerId: cli } = cids

  const chn = getHexagramName(cui, cli)
  const cd = getDetail(cui, cli)
  const cub = baguaMap[cui], clb = baguaMap[cli]
  const ns = getHexagramSymbol(ui, li), cs = getHexagramSymbol(cui, cli)
  const mn = YAO_LABELS[movingKey - 1]
  const mc = yao6[mi] === 1 ? '阳变阴' : '阴变阳'

  return {
    hexName: hn, changedHexName: chn,
    upperName: ub.name, lowerName: lb.name,
    changedUpperName: cub.name, changedLowerName: clb.name,
    nowDetail: nd, changedDetail: cd,
    nowSymbol: ns, changedSymbol: cs,
    movingName: mn, movingChange: mc,
    yao6, changedYao6: cy6, movingIndex: mi,
    upperId: ui, lowerId: li,
    changedUpperId: cui, changedLowerId: cli,
  }
}

