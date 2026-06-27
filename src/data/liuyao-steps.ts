/**
 * 六爻装卦流程说明 — 为 /liuyao 页面提供纯数据（无 JSX），避免 Turbopack 大文件问题
 */
export interface StepInfo {
  step: number
  title: string
  subtitle: string
  icon: string
  detail: string
  example: string
}

export const steps: StepInfo[] = [
  {
    step: 1, icon: '🏛️',
    title: '定八宫',
    subtitle: '确定本卦属于哪一宫',
    detail: '将六十四卦分配至八个宫（乾兑离震巽坎艮坤），每宫八卦。第一卦为本宫卦（纯卦），然后逐爻变化产生一世到五世卦，再经游魂、归魂。确定宫位是排盘的第一步，也是后续所有步骤的基础。',
    example: '天风姤（䷫）→ 属于乾宫一世卦',
  },
  {
    step: 2, icon: '☀️',
    title: '纳甲',
    subtitle: '给每爻配上十天干',
    detail: '内卦（下三爻）用一个天干，外卦（上三爻）用一个天干。乾内甲外壬，坤内乙外癸，其余六卦内外同干：艮丙、兑丁、坎戊、离己、震庚、巽辛。',
    example: '乾为天䷀：初九甲子、九二甲寅、九三甲辰、九四壬午、九五壬申、上九壬戌',
  },
  {
    step: 3, icon: '🌙',
    title: '纳支',
    subtitle: '给每爻配上十二地支',
    detail: '阳卦（乾坤震坎艮）地支顺行，每爻隔一辰；阴卦（坤巽离兑）地支逆行。内卦三爻用前三个地支，外卦三爻用后三个。',
    example: '乾卦：子→寅→辰（内）→午→申→戌（外）。坤卦：未→巳→卯（内）→丑→亥→酉（外）',
  },
  {
    step: 4, icon: '🎯',
    title: '定世应',
    subtitle: '找出世爻（自己）和应爻（对方）',
    detail: '世爻代表求测者自己，应爻代表对方或所测之事。位置由八宫世次决定：本宫世在上爻、一世在初爻、二世在二爻……游魂同四世，归魂同三世。应爻永远与世爻隔两爻。',
    example: '天风姤为乾宫一世卦 → 世在初爻，应在四爻',
  },
  {
    step: 5, icon: '👨‍👩‍👧‍👦',
    title: '装六亲',
    subtitle: '以宫位五行为"我"定六亲关系',
    detail: '以宫五行=我，各爻地支五行=他：\n• 生我者→父母\n• 同我者→兄弟\n• 我克者→妻财\n• 克我者→官鬼\n• 我生者→子孙',
    example: '乾宫（金）：子水→子孙，寅木→妻财，午火→官鬼，辰土→父母',
  },
  {
    step: 6, icon: '🐉',
    title: '配六神',
    subtitle: '以日干定六神从初爻起排',
    detail: '六神（青龙、朱雀、勾陈、螣蛇、白虎、玄武）由占卜日天干决定起始位：甲乙→青龙，丙丁→朱雀，戊己→勾陈，庚辛→螣蛇，壬癸→玄武。从初爻到上爻依次排列。',
    example: '甲日→初青龙、二朱雀、三勾陈、四螣蛇、五白虎、上玄武',
  },
]

export const TIAN_GAN_LIST = ['甲','乙','丙','丁','戊','己','庚','辛','壬','癸']

export const BAGUA_IDS = ['qian','dui','li','zhen','xun','kan','gen','kun']

export interface HexItem {
  key: string
  name: string
  symbol: string
  upperId: string
  lowerId: string
}
