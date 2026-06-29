'use client'
import { useState, useEffect } from 'react'
import usePageTitle from '@/hooks/usePageTitle'
import PageHeader from '@/components/PageHeader'

// ─── 数据定义 ──────────────────────────────────────────

interface SolarTermItem {
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

interface SovereignHexagram {
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
const sovereignHexagrams: SovereignHexagram[] = [
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
interface PreHeavenTerm {
  baguaId: string
  baguaName: string
  baguaSymbol: string
  season: string
  solarTerm: string
  direction: string
  description: string
  yao: number[]
}

const preHeavenTerms: PreHeavenTerm[] = [
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
const solarTerms24: SolarTermItem[] = [
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
interface PostHeavenTerm {
  baguaSymbol: string
  baguaName: string
  solarTerm: string
  direction: string
  lunarMonth: number
  significance: string
}

const postHeavenTerms: PostHeavenTerm[] = [
  { baguaSymbol:'☵', baguaName:'坎', solarTerm:'冬至', direction:'正北', lunarMonth:11, significance:'阴极阳生，水藏于北。坎为险陷，亦为智慧之源。' },
  { baguaSymbol:'☶', baguaName:'艮', solarTerm:'立春', direction:'东北', lunarMonth:12, significance:'冬尽春来，止而复动。艮为止，如冬去春来之间的门槛。' },
  { baguaSymbol:'☳', baguaName:'震', solarTerm:'春分', direction:'正东', lunarMonth:2, significance:'雷出地奋，万物惊动。震为动力，春季之始。' },
  { baguaSymbol:'☴', baguaName:'巽', solarTerm:'立夏', direction:'东南', lunarMonth:4, significance:'风行天下，万物蕃秀。巽为渗透，顺天应时。' },
  { baguaSymbol:'☲', baguaName:'离', solarTerm:'夏至', direction:'正南', lunarMonth:5, significance:'阳光鼎盛，附丽而明。离为火，为文明，为光明。' },
  { baguaSymbol:'☷', baguaName:'坤', solarTerm:'立秋', direction:'西南', lunarMonth:7, significance:'大地承载，成熟结果。坤为顺，为包容养育。' },
  { baguaSymbol:'☱', baguaName:'兑', solarTerm:'秋分', direction:'正西', lunarMonth:8, significance:'湖泽映天，喜悦收获。兑为悦，为言说交流。' },
  { baguaSymbol:'☰', baguaName:'乾', solarTerm:'立冬', direction:'西北', lunarMonth:10, significance:'天行刚健，收藏归根。乾为健，为创始。' },
]

// ─── 爻线渲染组件 ──────────────────────────────────────

function YaoLines({ yao, size = 6 }: { yao: number[], size?: number }) {
  return (
    <div className="flex flex-col-reverse gap-0.5 items-center" style={{ gap: `${size * 0.12}px` }}>
      {yao.map((line, i) => (
        <div
          key={i}
          className={line === 1 ? 'rounded-sm bg-[var(--yang)]' : 'rounded-sm bg-[var(--yin)]'}
          style={{
            width: `${size * 5}px`,
            height: `${size * 0.7}px`,
            opacity: 0.9,
          }}
        >
          {line === 0 && (
            <div className="flex justify-between px-[1px] h-full items-center">
              <div className="w-[30%] h-full rounded-sm bg-[var(--yin)]" />
              <div className="w-[30%] h-full rounded-sm bg-[var(--yin)]" />
            </div>
          )}
        </div>
      ))}
    </div>
  )
}

// ─── 子组件：十二辟卦时间轴 ─────────────────────────────

function SovereignTimeline() {
  const [activeIdx, setActiveIdx] = useState<number | null>(null)

  return (
    <div className="space-y-2">
      {/* 横滚动时间轴 */}
      <div className="overflow-x-auto pb-2 scrollbar-thin">
        <div className="flex gap-2 min-w-max">
          {sovereignHexagrams.map((h, idx) => (
            <button
              key={h.id}
              onClick={() => setActiveIdx(activeIdx === idx ? null : idx)}
              className={`flex flex-col items-center gap-1.5 p-2.5 rounded-xl border transition-all cursor-pointer shrink-0 w-[84px] ${
                activeIdx === idx
                  ? 'border-[var(--accent)] bg-[var(--glow)]'
                  : 'border-[var(--border)] bg-[var(--bg2)] hover:border-[var(--accent)] hover:bg-[var(--bg3)]'
              }`}
            >
              <span className="text-[20px] leading-none">{h.symbol}</span>
              <span className="text-[12px] font-heading text-[var(--fg)]">{h.name}</span>
              <YaoLines yao={h.yao} size={4} />
              <span className="text-[10px] text-[var(--muted)]">{h.month}</span>
              {/* 阴阳计数器 */}
              <div className="flex gap-1 text-[9px]">
                <span className="text-[var(--yang)]">{h.yao.filter(y=>y===1).length}阳</span>
                <span className="text-[var(--muted)]">/</span>
                <span className="text-[var(--yin)]">{h.yao.filter(y=>y===0).length}阴</span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* 选中卦的详情 */}
      {activeIdx !== null && (
        <div className="p-4 rounded-xl bg-[var(--bg3)] border border-[var(--accent)] animate-[fadeIn_0.2s_ease-out]">
          <div className="flex items-start gap-4">
            <div className="flex flex-col items-center">
              <span className="text-[32px] leading-none">{sovereignHexagrams[activeIdx].symbol}</span>
              <span className="text-[16px] font-heading text-[var(--fg)] mt-1">{sovereignHexagrams[activeIdx].name}</span>
              <YaoLines yao={sovereignHexagrams[activeIdx].yao} size={8} />
            </div>
            <div className="flex-1 min-w-0 space-y-1.5">
              <div className="flex flex-wrap gap-2 text-[12px]">
                <span className="px-2 py-0.5 rounded-full bg-[var(--bg2)] border border-[var(--border)]">
                  {sovereignHexagrams[activeIdx].month}
                </span>
                {sovereignHexagrams[activeIdx].solarTerms.map(st => (
                  <span key={st} className="px-2 py-0.5 rounded-full bg-[var(--glow)] border border-[var(--accent)] text-[var(--accent)]">
                    {st}
                  </span>
                ))}
              </div>
              <p className="text-[13px] text-[var(--muted)] leading-relaxed">
                {sovereignHexagrams[activeIdx].meaning}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* 阴阳消长指示条 */}
      <div className="p-3 rounded-lg bg-[var(--bg2)] border border-[var(--border)]">
        <div className="flex items-center gap-2 mb-1.5">
          <span className="text-[11px] text-[var(--yang)] font-medium">⬆ 阳长</span>
          <div className="flex-1 h-2 rounded-full bg-[var(--bg3)] overflow-hidden flex">
            {sovereignHexagrams.map((h, i) => {
              const yangCount = h.yao.filter(y => y === 1).length
              const isSelected = i === activeIdx
              return (
                <div
                  key={h.id}
                  className="flex-1 h-full transition-all duration-300 cursor-pointer"
                  style={{
                    background: isSelected ? 'var(--accent)' : `rgba(245,158,11,${yangCount / 6 * 0.7})`,
                    opacity: activeIdx === null || isSelected ? 1 : 0.4,
                  }}
                  title={`${h.name} (${yangCount}阳)`}
                />
              )
            })}
          </div>
          <span className="text-[11px] text-[var(--yin)] font-medium">⬇ 阴长</span>
        </div>
        <div className="flex justify-between text-[9px] text-[var(--muted)]">
          <span>冬至·一阳生</span>
          <span>春分</span>
          <span>立夏·纯阳</span>
          <span>夏至·一阴生</span>
          <span>秋分</span>
          <span>立冬·纯阴</span>
        </div>
      </div>
    </div>
  )
}

// ─── 子组件：八卦配八节卡片 ────────────────────────────

function BaguaSeasonCard({ item, index }: { item: PreHeavenTerm, index: number }) {
  const [flipped, setFlipped] = useState(false)

  return (
    <button
      onClick={() => setFlipped(!flipped)}
      className={`relative w-full rounded-xl border transition-all duration-300 cursor-pointer overflow-hidden ${
        flipped ? 'border-[var(--accent)] bg-[var(--glow)]' : 'border-[var(--border)] bg-[var(--bg2)] hover:border-[var(--accent)]'
      }`}
      style={{ animationDelay: `${index * 60}ms` }}
    >
      {/* 正面 */}
      <div className={`p-3.5 transition-opacity ${flipped ? 'opacity-0 absolute' : 'opacity-100'}`}>
        <div className="flex items-center justify-between mb-2">
          <span className="text-[28px] leading-none">{item.baguaSymbol}</span>
          <span className="text-[11px] px-2 py-0.5 rounded-full bg-[var(--bg3)] text-[var(--muted)] border border-[var(--border)]">
            {item.direction}
          </span>
        </div>
        <div className="flex items-center gap-2 mb-1.5">
          <span className="text-[16px] font-heading text-[var(--fg)]">{item.baguaName}</span>
          <span className="text-[11px] text-[var(--accent)] font-medium">{item.solarTerm}</span>
        </div>
        <YaoLines yao={item.yao} size={5} />
        <div className="mt-1.5 text-[11px] text-[var(--muted)] text-left">
          {item.description}
        </div>
      </div>
      {/* 反面 — 后天八卦对照 */}
      <div className={`p-3.5 transition-opacity ${flipped ? 'opacity-100' : 'opacity-0 absolute'}`}>
        <div className="text-[11px] text-[var(--muted)] mb-1">后天八卦</div>
        {postHeavenTerms.find(p => p.baguaName === item.baguaName) && (
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-[20px]">{item.baguaSymbol}</span>
              <span className="text-[14px] font-heading text-[var(--fg)]">{item.baguaName}</span>
              <span className="text-[12px] text-[var(--accent)]">
                {postHeavenTerms.find(p => p.baguaName === item.baguaName)?.solarTerm}
              </span>
            </div>
            <p className="text-[11px] text-[var(--muted)] leading-relaxed">
              {postHeavenTerms.find(p => p.baguaName === item.baguaName)?.significance}
            </p>
          </div>
        )}
        <div className="mt-2 text-[10px] text-[var(--muted)] italic">点击翻转 ↺ 看后天八卦对照</div>
      </div>
    </button>
  )
}

// ─── 子组件：二十四节气表 ──────────────────────────────

const seasonColors: Record<string, string> = {
  '春': 'border-l-[var(--yang)]',
  '夏': 'border-l-[#ef4444]',
  '秋': 'border-l-[var(--accent2)]',
  '冬': 'border-l-[var(--yin)]',
}

const seasonLabels: Record<string, string> = {
  '春': '🌱 春季',
  '夏': '☀️ 夏季',
  '秋': '🍂 秋季',
  '冬': '❄️ 冬季',
}

function SolarTermGrid() {
  const grouped = solarTerms24.reduce((acc, item) => {
    if (!acc[item.season]) acc[item.season] = []
    acc[item.season].push(item)
    return acc
  }, {} as Record<string, SolarTermItem[]>)

  return (
    <div className="space-y-6">
      {(['春','夏','秋','冬'] as const).map(season => (
        <div key={season}>
          <h3 className="text-[14px] font-heading text-[var(--fg)] mb-2.5">{seasonLabels[season]}</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
            {grouped[season].map(item => (
              <div
                key={item.no}
                className={`p-3 rounded-lg bg-[var(--bg2)] border border-[var(--border)] border-l-2 ${seasonColors[season]} hover:border-l-[var(--accent)] transition-colors`}
              >
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-1.5">
                    <span className="text-[12px] text-[var(--muted)] font-mono">#{item.no.toString().padStart(2,'0')}</span>
                    <span className="text-[14px] font-heading text-[var(--fg)]">{item.name}</span>
                    <span className="text-[10px] text-[var(--muted)]">{item.pinyin}</span>
                  </div>
                  <span className={`text-[10px] px-1.5 py-0.5 rounded ${item.type === '节' ? 'bg-[var(--glow)] text-[var(--accent)]' : 'bg-[var(--bg3)] text-[var(--muted)]'} border border-[var(--border)]`}>
                    {item.type}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-[11px] text-[var(--muted)] mb-1">
                  <span>{item.date}</span>
                  <span className="opacity-40">|</span>
                  <span>黄经{item.celestial}</span>
                  {item.bagua && (
                    <>
                      <span className="opacity-40">|</span>
                      <span>卦·{item.bagua}</span>
                    </>
                  )}
                  {item.hexagram && (
                    <>
                      <span className="opacity-40">|</span>
                      <span className="text-[var(--accent)]">{item.hexagram}</span>
                    </>
                  )}
                </div>
                <p className="text-[11px] text-[var(--muted)] leading-relaxed">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}

// ─── 主页面 ────────────────────────────────────────────

export default function SolarTermsPage() {
  usePageTitle()
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])

  if (!mounted) {
    return (
      <main className="px-4 pb-12 mx-auto max-w-[960px]">
        <PageHeader
          title="卦象与节气历法"
          subtitle="八卦配二十四节气 · 阴阳消长 · 天人合一"
        />
        <div className="animate-pulse space-y-6">
          {[1,2,3].map(i => <div key={i} className="h-40 rounded-xl bg-[var(--bg2)] opacity-50" />)}
        </div>
      </main>
    )
  }

  return (
    <main className="px-4 pb-16 mx-auto max-w-[960px]">
      <PageHeader
        title="卦象与节气历法"
        subtitle="八卦配二十四节气 · 阴阳消长 · 天人合一"
      />

      {/* ─── 导语 ─────────────────────────── */}
      <div className="mb-8 p-5 rounded-xl bg-[var(--bg2)] border border-[var(--border)]">
        <p className="text-sm text-[var(--muted)] leading-relaxed">
          二十四节气是中国古人观察太阳周年运动而制定的时间体系，八卦则是描述宇宙变化规律的符号语言。
          二者在汉代合流，形成了<strong className="text-[var(--fg)]">卦气说</strong>——
          将卦象配节气、节气配音律，构建了一个<strong className="text-[var(--accent)]">时空一体、天人相应</strong>的完整宇宙模型。
        </p>
        <p className="text-sm text-[var(--muted)] leading-relaxed mt-2">
          这套体系的核心思想是<strong className="text-[var(--fg)]">「阴阳消长」</strong>：
          冬至一阳生（复卦䷗），夏至一阴生（姤卦䷫），
          阳气从复卦的一爻逐渐增长到乾卦的六爻纯阳，阴气从姤卦的一爻增长到坤卦的六爻纯阴。
          一年四季的变化，就是阴阳二气此消彼长的过程——这就是<strong className="text-[var(--accent)]">天人合一</strong>最直观的体现。
        </p>
      </div>

      {/* ─── 一、先天八卦配八节 ───────────── */}
      <section className="mb-10">
        <h3 className="text-[17px] font-heading text-[var(--fg)] mb-3">📍 先天八卦配八节</h3>
        <p className="text-xs text-[var(--muted)] mb-4 leading-relaxed">
          伏羲先天八卦定空间方位，以<strong className="text-[var(--fg)]">二分二至（春分·夏至·秋分·冬至）+ 四立（立春·立夏·立秋·立冬）</strong>为骨架。
          每卦掌管一个关键节气。点击卡片翻转查看后天八卦对照。
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {preHeavenTerms.map((item, i) => (
            <BaguaSeasonCard key={item.baguaId} item={item} index={i} />
          ))}
        </div>
        {/* 四正四维示意图 */}
        <div className="mt-3 p-3 rounded-lg bg-[var(--bg2)] border border-[var(--border)] text-[11px] text-[var(--muted)] leading-relaxed">
          <strong className="text-[var(--fg)]">四正：</strong>震（春分·东）· 离（夏至·南）· 兑（秋分·西）· 坎（冬至·北）
          <span className="mx-2 opacity-30">|</span>
          <strong className="text-[var(--fg)]">四维：</strong>艮（立春·东北）· 巽（立夏·东南）· 坤（立秋·西南）· 乾（立冬·西北）
        </div>
      </section>

      {/* ─── 二、十二辟卦 · 阴阳消息 ─────────── */}
      <section className="mb-10">
        <h3 className="text-[17px] font-heading text-[var(--fg)] mb-3">📍 十二辟卦 · 阴阳消息</h3>
        <p className="text-xs text-[var(--muted)] mb-4 leading-relaxed">
          十二辟卦（又称<strong className="text-[var(--fg)]">十二消息卦</strong>）由汉代孟喜创立。
          用十二个卦象模拟一年十二个月的阴阳消长过程——每卦管一个月，含两个节气。
          点击任意卦查看详情。
        </p>
        <SovereignTimeline />
      </section>

      {/* ─── 三、后天八卦配八节 ───────────── */}
      <section className="mb-10">
        <h3 className="text-[17px] font-heading text-[var(--fg)] mb-3">📍 后天八卦配八节</h3>
        <p className="text-xs text-[var(--muted)] mb-4 leading-relaxed">
          文王后天八卦更侧重人间事，卦象与节气配合更为精细，
          每卦再分三山（二十四山向），精确对应二十四节气的具体日期。
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {postHeavenTerms.map(item => (
            <div key={item.baguaName} className="p-3 rounded-xl bg-[var(--bg2)] border border-[var(--border)]">
              <div className="flex items-center gap-2 mb-1.5">
                <span className="text-[20px]">{item.baguaSymbol}</span>
                <span className="text-[14px] font-heading text-[var(--fg)]">{item.baguaName}</span>
              </div>
              <div className="flex items-center gap-1 text-[11px] mb-1">
                <span className="text-[var(--accent)] font-medium">{item.solarTerm}</span>
                <span className="text-[var(--muted)]">· {item.direction}</span>
                <span className="text-[var(--muted)]">· {item.lunarMonth}月</span>
              </div>
              <p className="text-[11px] text-[var(--muted)] leading-relaxed">{item.significance}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ─── 四、二十四节气全表 ─────────────── */}
      <section className="mb-10">
        <h3 className="text-[17px] font-heading text-[var(--fg)] mb-3">📍 二十四节气全表</h3>
        <p className="text-xs text-[var(--muted)] mb-4 leading-relaxed">
          二十四节气按太阳黄经（0°~360°）划分，每15°一个节气。
          <strong className="text-[var(--fg)]">「节」</strong>为季节转换节点，
          <strong className="text-[var(--fg)]">「气」</strong>为气候中气。
          每个节气都对应特定的卦象，反映阴阳变化。
        </p>
        <SolarTermGrid />
      </section>

      {/* ─── 五、天人合一 ────────────────── */}
      <section className="mb-6">
        <h3 className="text-[17px] font-heading text-[var(--fg)] mb-3">📍 天人合一 · 卦气说的哲学内涵</h3>
        <div className="p-5 rounded-xl bg-gradient-to-br from-[var(--bg2)] via-[var(--bg2)] to-[var(--bg3)] border border-[var(--border)] space-y-4">
          <div className="flex items-start gap-3">
            <span className="text-[18px] mt-0.5">☯️</span>
            <div>
              <h4 className="text-[13px] text-[var(--fg)] font-medium mb-1">时空一体</h4>
              <p className="text-[12px] text-[var(--muted)] leading-relaxed">
                八卦既是空间方位（东、南、西、北、东北、东南、西南、西北），
                又是时间节律（春分、夏至、秋分、冬至、四立）。
                在卦象里，时间和空间是统一的——你站在哪个方位，就对应什么节气。
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <span className="text-[18px] mt-0.5">🔄</span>
            <div>
              <h4 className="text-[13px] text-[var(--fg)] font-medium mb-1">物极必反</h4>
              <p className="text-[12px] text-[var(--muted)] leading-relaxed">
                从复卦一阳生到乾卦纯阳（春→夏），阳气渐盛至极则一阴生（姤卦），
                再到坤卦纯阴（秋→冬），阴气渐盛至极则一阳复生——循环往复，无始无终。
                这个规律在二十四节气里同样成立：冬至阴极生阳，夏至阳极生阴。
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <span className="text-[18px] mt-0.5">🌿</span>
            <div>
              <h4 className="text-[13px] text-[var(--fg)] font-medium mb-1">顺势而为</h4>
              <p className="text-[12px] text-[var(--muted)] leading-relaxed">
                卦气说告诉我们的不是宿命，而是<strong className="text-[var(--accent)]">因时制宜</strong>的智慧。
                春分震卦当令——该行动了；夏至姤卦当令——该收敛了；
                秋分兑卦当令——该收获了；冬至复卦当令——该积蓄了。
                人不是对抗自然，而是顺应天地节律来安排自己的生活。
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <span className="text-[18px] mt-0.5">🌌</span>
            <div>
              <h4 className="text-[13px] text-[var(--fg)] font-medium mb-1">天人相应</h4>
              <p className="text-[12px] text-[var(--muted)] leading-relaxed">
                《乾卦·文言》曰：「与天地合其德，与日月合其明，与四时合其序。」
                人体的小宇宙和天地的大宇宙遵循同一个阴阳法则。
                春天养生、夏天养长、秋天养收、冬天养藏——中医的子午流注、五运六气，
                都是这个思想的具体应用。八卦配节气的终极意义，就是让人找到自己在天地间的位置。
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ─── 经典引文 ──────────────────── */}
      <blockquote className="p-4 rounded-xl bg-[var(--bg2)] border border-[var(--border)] text-center">
        <p className="text-xs text-[var(--muted)] italic leading-relaxed">
          「<strong className="text-[var(--fg)] not-italic">卦气</strong>起<strong className="text-[var(--yang)]">中孚</strong>，
          故离<strong className="text-[var(--yang)]">坎</strong>、<strong className="text-[var(--yang)]">震</strong>、<strong className="text-[var(--yang)]">兑</strong>各主一方，
          其餘六十卦，卦有六爻，爻主一日，凡主三百六十日。
          餘有五日四分日之一者，以通閏餘。」
        </p>
        <footer className="mt-1 text-[10px] text-[var(--muted)]">—— 孟喜 · 卦气图说（汉代）</footer>
      </blockquote>

      {/* 今日卦象注 */}
      <div className="mt-6 p-4 rounded-xl bg-[var(--bg3)] border border-[var(--border)]">
        <p className="text-xs text-[var(--muted)] leading-relaxed">
          📌 <strong className="text-[var(--fg)]">今日卦象：</strong>
          6月28日，时值芒种之后、夏至刚过，阴气初生未盛。
          从十二辟卦来看，正处在 <strong className="text-[var(--accent)]">姤卦䷫</strong>
          （一阴始生）向 <strong className="text-[var(--accent)]">遁卦䷠</strong>
          （二阴浸长）过渡的阶段——这也正是首页显示䷠遁卦的原因。
          阳极转阴，君子当知进退，审时度势。
        </p>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(6px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-\\[fadeIn_0\\.2s_ease-out\\] {
          animation: fadeIn 0.2s ease-out;
        }
      `}</style>
    </main>
  )
}
