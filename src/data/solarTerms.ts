// ═══════════════════════════════════════
//  卦象与节气 — 数据和类型定义
// ═══════════════════════════════════════

export interface SolarTermItem {
  no: number
  name: string
  pinyin: string
  date: string
  celestial: string // 太阳黄经
  bagua?: string   // 对应八卦
  hexagram?: string // 对应辟卦
  description: string
  season: '春' | '夏' | '秋' | '冬'
  type: '节' | '气'
}

export interface SovereignHexagram {
  id: string
  name: string
  symbol: string
  yao: number[] // 6 lines bottom→top (1=yang, 0=yin)
  month: string
  lunarMonth: number
  solarTerms: string[]
  meaning: string
}

// 十二辟卦（十二消息卦）
export const sovereignHexagrams: SovereignHexagram[] = [
  { id:'fu', name:'复', symbol:'䷗', yao:[1,0,0,0,0,0], month:'十一月', lunarMonth:11, solarTerms:['大雪','冬至'],
    meaning:'一阳来复。阴极而阳生，大地之下已有暖意萌动。万物闭藏之极，生机已潜。' },
  { id:'lin', name:'临', symbol:'䷒', yao:[1,1,0,0,0,0], month:'十二月', lunarMonth:12, solarTerms:['小寒','大寒'],
    meaning:'二阳生长。阳气渐升，虽仍在寒冬，但春的消息已到。君子以教思无穷。' },
  { id:'tai', name:'泰', symbol:'䷊', yao:[1,1,1,0,0,0], month:'正月', lunarMonth:1, solarTerms:['立春','雨水'],
    meaning:'三阳开泰。天地交而万物通，阴气渐退、阳气渐盛。最吉祥的开端。' },
  { id:'dazhuang', name:'大壮', symbol:'䷡', yao:[1,1,1,1,0,0], month:'二月', lunarMonth:2, solarTerms:['惊蛰','春分'],
    meaning:'四阳壮盛。阳气已过半数，雷在天上震动，万物破土而出。' },
  { id:'guai', name:'夬', symbol:'䷪', yao:[1,1,1,1,1,0], month:'三月', lunarMonth:3, solarTerms:['清明','谷雨'],
    meaning:'五阳决阴。阳盛将极，只剩最后一阴。决断之时，当机立断。' },
  { id:'qian', name:'乾', symbol:'䷀', yao:[1,1,1,1,1,1], month:'四月', lunarMonth:4, solarTerms:['立夏','小满'],
    meaning:'纯阳之体。阳气达到顶点，天行刚健。万物繁盛，生机最旺。' },
  { id:'gou', name:'姤', symbol:'䷫', yao:[0,1,1,1,1,1], month:'五月', lunarMonth:5, solarTerms:['芒种','夏至'],
    meaning:'一阴初生。阳极而阴生，夏至日阴气始萌。天地相遇，品物咸章。' },
  { id:'dun', name:'遁', symbol:'䷠', yao:[0,0,1,1,1,1], month:'六月', lunarMonth:6, solarTerms:['小暑','大暑'],
    meaning:'二阴浸长。阴气渐长，阳气退避。君子以远小人，不恶而严。' },
  { id:'pi', name:'否', symbol:'䷋', yao:[0,0,0,1,1,1], month:'七月', lunarMonth:7, solarTerms:['立秋','处暑'],
    meaning:'三阴否塞。天地不交，万物不通。阴盛阳衰，宜守不宜攻。' },
  { id:'guan', name:'观', symbol:'䷓', yao:[0,0,0,0,1,1], month:'八月', lunarMonth:8, solarTerms:['白露','秋分'],
    meaning:'四阴观照。阴气已过半数，秋分昼夜等长。风在地上行，观民设教。' },
  { id:'bo', name:'剥', symbol:'䷖', yao:[0,0,0,0,0,1], month:'九月', lunarMonth:9, solarTerms:['寒露','霜降'],
    meaning:'五阴剥阳。阴盛将极，只剩最后一阳——"硕果不食"。剥极必复。' },
  { id:'kun', name:'坤', symbol:'䷁', yao:[0,0,0,0,0,0], month:'十月', lunarMonth:10, solarTerms:['立冬','小雪'],
    meaning:'纯阴之体。阴气达到顶点，大地闭藏。厚德载物，静待来年。' },
]

// 先天八卦配八节
export interface PreHeavenTerm {
  baguaId: string
  baguaName: string
  baguaSymbol: string
  season: string
  solarTerm: string
  direction: string
  description: string
  yao: number[]
}

export const preHeavenTerms: PreHeavenTerm[] = [
  { baguaId:'zhen', baguaName:'震', baguaSymbol:'☳', season:'春', solarTerm:'春分', direction:'正东',
    description:'日出东方，春雷惊蛰。万物破土而出，生机勃发。', yao:[1,0,0] },
  { baguaId:'li', baguaName:'离', baguaSymbol:'☲', season:'夏', solarTerm:'夏至', direction:'正南',
    description:'太阳当空，光明鼎盛。物皆相附，明照四方。', yao:[1,0,1] },
  { baguaId:'dui', baguaName:'兑', baguaSymbol:'☱', season:'秋', solarTerm:'秋分', direction:'正西',
    description:'日落西山，万物收敛。湖泽映天，以悦待物。', yao:[1,1,0] },
  { baguaId:'kan', baguaName:'坎', baguaSymbol:'☵', season:'冬', solarTerm:'冬至', direction:'正北',
    description:'日沉于北，一阳潜藏。外柔内刚，险中求进。', yao:[0,1,0] },
  { baguaId:'gen', baguaName:'艮', baguaSymbol:'☶', season:'冬春之交', solarTerm:'立春', direction:'东北',
    description:'冬尽春来，止而复生。如山耸立，知止有定。', yao:[0,0,1] },
  { baguaId:'xun', baguaName:'巽', baguaSymbol:'☴', season:'春夏之交', solarTerm:'立夏', direction:'东南',
    description:'风行天下，万物蕃秀。顺势渗透，无孔不入。', yao:[0,1,1] },
  { baguaId:'kun', baguaName:'坤', baguaSymbol:'☷', season:'夏秋之交', solarTerm:'立秋', direction:'西南',
    description:'大地承载，成熟在即。厚德载物，柔顺包容。', yao:[0,0,0] },
  { baguaId:'qian', baguaName:'乾', baguaSymbol:'☰', season:'秋冬之交', solarTerm:'立冬', direction:'西北',
    description:'天行刚健，收藏归根。纯阳之体，自强不息。', yao:[1,1,1] },
]

// 二十四节气完整数据
export const solarTerms24: SolarTermItem[] = [
  { no:1, name:'立春', pinyin:'lì chūn', date:'2月3-5日', celestial:'315°', bagua:'艮', hexagram:'泰䷊', season:'春', type:'节',
    description:'春季开始。万物复苏，东风解冻。三阳开泰，否极泰来。' },
  { no:2, name:'雨水', pinyin:'yǔ shuǐ', date:'2月18-20日', celestial:'330°', bagua:'艮', hexagram:'泰䷊', season:'春', type:'气',
    description:'降雨增多，草木萌动。天地交泰，润物无声。' },
  { no:3, name:'惊蛰', pinyin:'jīng zhé', date:'3月5-7日', celestial:'345°', bagua:'震', hexagram:'大壮䷡', season:'春', type:'节',
    description:'春雷乍动，蛰虫惊走。雷在天上震动，阳气奋起。' },
  { no:4, name:'春分', pinyin:'chūn fēn', date:'3月20-22日', celestial:'0°', bagua:'震', hexagram:'大壮䷡', season:'春', type:'气',
    description:'昼夜等长，阴阳平衡。春分日，震卦当令，万物破土。' },
  { no:5, name:'清明', pinyin:'qīng míng', date:'4月4-6日', celestial:'15°', bagua:'震', hexagram:'夬䷪', season:'春', type:'节',
    description:'天气清澈明朗。万物生长，清洁明净。五阳决阴，当断则断。' },
  { no:6, name:'谷雨', pinyin:'gǔ yǔ', date:'4月19-21日', celestial:'30°', bagua:'震', hexagram:'夬䷪', season:'春', type:'气',
    description:'雨生百谷。播种移苗的最佳时节。最后一缕寒气消散。' },
  { no:7, name:'立夏', pinyin:'lì xià', date:'5月5-7日', celestial:'45°', bagua:'巽', hexagram:'乾䷀', season:'夏', type:'节',
    description:'夏季开始。万物繁茂，纯阳当令。风行天下，顺势而为。' },
  { no:8, name:'小满', pinyin:'xiǎo mǎn', date:'5月20-22日', celestial:'60°', bagua:'巽', hexagram:'乾䷀', season:'夏', type:'气',
    description:'麦类灌浆，小得盈满。物至于此小得盈满——不求太满。' },
  { no:9, name:'芒种', pinyin:'máng zhǒng', date:'6月5-7日', celestial:'75°', bagua:'离', hexagram:'姤䷫', season:'夏', type:'节',
    description:'有芒作物成熟。阳极转阴，一阴初生。天地相遇。' },
  { no:10, name:'夏至', pinyin:'xià zhì', date:'6月21-22日', celestial:'90°', bagua:'离', hexagram:'姤䷫', season:'夏', type:'气',
    description:'白昼最长，阳极之至。离卦当令，光明鼎盛。夏至一阴生。' },
  { no:11, name:'小暑', pinyin:'xiǎo shǔ', date:'7月6-8日', celestial:'105°', bagua:'离', hexagram:'遁䷠', season:'夏', type:'节',
    description:'暑气渐至，炎热初临。二阴浸长，宜退守不宜进攻。' },
  { no:12, name:'大暑', pinyin:'dà shǔ', date:'7月22-24日', celestial:'120°', bagua:'离', hexagram:'遁䷠', season:'夏', type:'气',
    description:'一年中最热之时。万物疯长，同时也需养精蓄锐。' },
  { no:13, name:'立秋', pinyin:'lì qiū', date:'8月7-9日', celestial:'135°', bagua:'坤', hexagram:'否䷋', season:'秋', type:'节',
    description:'秋季开始。阴气渐长，天地否塞。坤厚载物，成熟在即。' },
  { no:14, name:'处暑', pinyin:'chǔ shǔ', date:'8月22-24日', celestial:'150°', bagua:'坤', hexagram:'否䷋', season:'秋', type:'气',
    description:'暑气至此而止。秋高气爽，收敛锋芒。' },
  { no:15, name:'白露', pinyin:'bái lù', date:'9月7-9日', celestial:'165°', bagua:'兑', hexagram:'观䷓', season:'秋', type:'节',
    description:'天气转凉，露凝而白。四阴观照，宜静观不宜妄动。' },
  { no:16, name:'秋分', pinyin:'qiū fēn', date:'9月22-24日', celestial:'180°', bagua:'兑', hexagram:'观䷓', season:'秋', type:'气',
    description:'昼夜等长，阴阳再平衡。兑卦当令，湖泽映天。' },
  { no:17, name:'寒露', pinyin:'hán lù', date:'10月7-9日', celestial:'195°', bagua:'兑', hexagram:'剥䷖', season:'秋', type:'节',
    description:'露水已寒，将凝为霜。五阴剥阳——硕果仅存，剥极必复。' },
  { no:18, name:'霜降', pinyin:'shuāng jiàng', date:'10月23-24日', celestial:'210°', bagua:'兑', hexagram:'剥䷖', season:'秋', type:'气',
    description:'霜始降，草木黄落。阴盛至极，万物收藏以待来年。' },
  { no:19, name:'立冬', pinyin:'lì dōng', date:'11月7-8日', celestial:'225°', bagua:'乾', hexagram:'坤䷁', season:'冬', type:'节',
    description:'冬季开始。纯阴当令，大地闭藏。天行刚健而入藏。' },
  { no:20, name:'小雪', pinyin:'xiǎo xuě', date:'11月22-23日', celestial:'240°', bagua:'乾', hexagram:'坤䷁', season:'冬', type:'气',
    description:'雪始降，未至盛。阴至极点，厚德载物。' },
  { no:21, name:'大雪', pinyin:'dà xuě', date:'12月6-8日', celestial:'255°', bagua:'坎', hexagram:'复䷗', season:'冬', type:'节',
    description:'雪盛，天地苍茫。阴极而一阳生——复卦之象。' },
  { no:22, name:'冬至', pinyin:'dōng zhì', date:'12月21-23日', celestial:'270°', bagua:'坎', hexagram:'复䷗', season:'冬', type:'气',
    description:'白昼最短，阴极之至。坎卦当令，一阳来复。冬至一阳生。' },
  { no:23, name:'小寒', pinyin:'xiǎo hán', date:'1月5-7日', celestial:'285°', bagua:'坎', hexagram:'临䷒', season:'冬', type:'节',
    description:'寒气未至极点。二阳渐长，虽严寒而春意已萌。' },
  { no:24, name:'大寒', pinyin:'dà hán', date:'1月20-21日', celestial:'300°', bagua:'坎', hexagram:'临䷒', season:'冬', type:'气',
    description:'一年中最冷之时。二阳在地下生长——寒极春将至。' },
]

// 后天八卦配八节
export interface PostHeavenTerm {
  baguaSymbol: string
  baguaName: string
  solarTerm: string
  direction: string
  lunarMonth: number
  significance: string
}

export const postHeavenTerms: PostHeavenTerm[] = [
  { baguaSymbol:'☵', baguaName:'坎', solarTerm:'冬至', direction:'正北', lunarMonth:11, significance:'阴极阳生，水藏于北。坎为险陷，亦为智慧之源。' },
  { baguaSymbol:'☶', baguaName:'艮', solarTerm:'立春', direction:'东北', lunarMonth:12, significance:'冬尽春来，止而复动。艮为止，如冬去春来之间的门槛。' },
  { baguaSymbol:'☳', baguaName:'震', solarTerm:'春分', direction:'正东', lunarMonth:2, significance:'雷出地奋，万物惊动。震为动力，春季之始。' },
  { baguaSymbol:'☴', baguaName:'巽', solarTerm:'立夏', direction:'东南', lunarMonth:4, significance:'风行天下，万物蕃秀。巽为渗透，顺天应时。' },
  { baguaSymbol:'☲', baguaName:'离', solarTerm:'夏至', direction:'正南', lunarMonth:5, significance:'阳光鼎盛，附丽而明。离为火，为文明，为光明。' },
  { baguaSymbol:'☷', baguaName:'坤', solarTerm:'立秋', direction:'西南', lunarMonth:7, significance:'大地承载，成熟结果。坤为顺，为包容养育。' },
  { baguaSymbol:'☱', baguaName:'兑', solarTerm:'秋分', direction:'正西', lunarMonth:8, significance:'湖泽映天，喜悦收获。兑为悦，为言说交流。' },
  { baguaSymbol:'☰', baguaName:'乾', solarTerm:'立冬', direction:'西北', lunarMonth:10, significance:'天行刚健，收藏归根。乾为健，为创始。' },
]

export const seasonColors: Record<string, string> = {
  '春': 'border-l-[var(--yang)]',
  '夏': 'border-l-[#ef4444]',
  '秋': 'border-l-[var(--accent2)]',
  '冬': 'border-l-[var(--yin)]',
}

export const seasonLabels: Record<string, string> = {
  '春': '🌱 春季', '夏': '☀️ 夏季', '秋': '🍂 秋季', '冬': '❄️ 冬季',
}
