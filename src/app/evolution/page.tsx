'use client'
import usePageTitle from '@/hooks/usePageTitle'
import { useState } from 'react'
import PageHeader from '@/components/PageHeader'

// ─── 时代数据 ───

interface Era {
  id: string
  period: string
  time: string
  emoji: string
  summary: string
  items: { label: string; desc: string }[]
  color: string
}

const eras: Era[] = [
  {
    id: 'origin',
    period: '上古三代',
    time: '传说 — 前771',
    emoji: '🌅',
    summary: '从无到有——河图洛书、伏羲八卦、文王六十四卦、龟卜蓍占。八卦的源头在这里。',
    color: 'from-amber-600/20',
    items: [
      { label: '河图洛书', desc: '龙马负图出黄河，神龟背书出洛水。圣人效法河洛而创立八卦和九宫——这是中国数字哲学的起点。' },
      { label: '伏羲画八卦', desc: '"仰观天文，俯察地理，近取诸身，远取诸物"——八个符号概括宇宙万象。' },
      { label: '《周易》卦爻辞', desc: '文王演六十四卦，周公系爻辞。这是《周易》的"经"——原始占卜手册。' },
      { label: '龟卜与蓍占', desc: '殷墟甲骨——烧龟甲观裂纹断吉凶；周易——蓍草演算得卦象。两种占卜范式并存。' },
      { label: '《连山》《归藏》', desc: '夏易《连山》（艮为首）、商易《归藏》（坤为首）。均已失传，只有辑佚残文。' },
    ],
  },
  {
    id: 'classic',
    period: '春秋战国',
    time: '前770 — 前221',
    emoji: '📜',
    summary: '孔子及其弟子作《易传》十翼——从占卜手册到"群经之首、大道之源"的哲学经典。',
    color: 'from-red-600/20',
    items: [
      { label: '十翼成书', desc: '孔子晚而喜易，读易韦编三绝。十翼将卦爻符号"翻译"成哲学语言——没有十翼，《周易》只是一本占卜书。' },
      { label: '《系辞传》', desc: '"易有太极，是生两仪"——宇宙生成论；"一阴一阳之谓道"——辩证法。"河出图，洛出书，圣人则之"——河洛首次入经。' },
      { label: '《说卦传》', desc: '八卦取象体系——乾为马、坤为牛……乾坤生六子、帝出乎震。从此八卦有了"字典"。' },
      { label: '《序卦》《杂卦》', desc: '《序卦》解释六十四卦为什么这么排；《杂卦》两两对比，极简概括。' },
    ],
  },
  {
    id: 'han',
    period: '两汉',
    time: '前202 — 220',
    emoji: '🔥',
    summary: '象数大爆炸——京房纳甲、焦氏易林、卦气卦候、谶纬河洛、参同契丹道。术数的基础全打了。',
    color: 'from-orange-600/20',
    items: [
      { label: '京房纳甲筮法', desc: '八宫卦、纳甲纳支、六亲世应——一套完整的筮法体系建立。这是后世六爻、六壬的直接源头。京房最后被宦官害死，他的卦却传了两千年。' },
      { label: '《焦氏易林》', desc: '焦延寿著。一卦演为六十四卦——4096条繇辞。规模恢弘，文辞古奥。' },
      { label: '卦气说（孟喜）', desc: '将六十四卦与二十四节气、七十二候对应。卦象配天时——易学与历法合流。"卦气图"影响后世风水、择日。' },
      { label: '《周易参同契》', desc: '魏伯阳著。以乾坤为鼎炉、阴阳为药物——"万古丹经王"。易学与道家丹道融合。' },
      { label: '谶纬与河洛', desc: '《易纬》系列——将河图洛书神学化，结合天文星象、灾异符命。汉代政治哲学的重要工具。' },
      { label: '《太玄经》', desc: '扬雄仿《周易》作"玄"——81首（非64卦），用三方、九州、二十七部架构。不走寻常路，但影响深远。' },
    ],
  },
  {
    id: 'weijin',
    period: '魏晋南北朝',
    time: '220 — 589',
    emoji: '🍃',
    summary: '王弼扫象阐理——易学从象数繁琐中解放出来，走向玄学和义理。同时风水学开山。',
    color: 'from-green-600/20',
    items: [
      { label: '王弼《周易注》《周易略例》', desc: '一扫汉儒象数繁琐——"得意忘象，得象忘言"。老庄解易，将易学从占卜推向本体论哲学。28岁去世，却改变了易学一千年的走向。' },
      { label: '郭璞《葬书》', desc: '"气乘风则散，界水则止"——风水学开山之作。"风水"一词即源于此书。' },
      { label: '玄学易', desc: '何晏、王弼、韩康伯——以道解易。易学成为"三玄"（老、庄、易）之一。南朝的士族清谈以此为风尚。' },
    ],
  },
  {
    id: 'tang',
    period: '唐代',
    time: '618 — 907',
    emoji: '🏛️',
    summary: '承前启后——五行学说集大成、三柱命理、形势派风水、河洛图式萌芽。',
    color: 'from-yellow-600/20',
    items: [
      { label: '《五行大义》', desc: '萧吉著。五行学说最系统的理论汇总——术数爱好者必读。"盖五行书之总汇也"。' },
      { label: '李虚中三柱命理', desc: '李虚中——以年月日三柱推算命理。韩愈为他写墓志铭："最深五行书"。四柱八字的直接前身。' },
      { label: '形势派风水（杨筠松）', desc: '杨救贫——《撼龙经》《疑龙经》。以龙穴砂水向为核心的形势派风水。' },
      { label: '陈抟与《易龙图》', desc: '陈抟（希夷先生）传出河图洛书数字图式，成为宋代河洛之学的关键环节。' },
    ],
  },
  {
    id: 'song',
    period: '宋代',
    time: '960 — 1279',
    emoji: '🌟',
    summary: '易学空前繁荣——先天河洛、理学易、梅花易数、四柱八字成型、紫微斗数。五条线齐头并进。',
    color: 'from-blue-600/20',
    items: [
      { label: '周敦颐《太极图说》', desc: '"无极而太极"——263字构建理学宇宙观。"太极"从《易传》的概念升级为宇宙本体的核心范畴。' },
      { label: '邵雍《皇极经世》', desc: '先天易学集大成。"元会运世"——129600年为一元，构建宇宙大周期模型。"天地亦有终始"。' },
      { label: '邵雍·梅花易数', desc: '托名邵雍。以数起卦（年月日时、数字、声音、颜色皆可起卦），灵活至极。"观梅占"是千古名案。' },
      { label: '朱熹《周易本义》', desc: '将河图洛书置于卷首——宋代以前无此先例。朱熹以此确立了河洛作为易学源头的正统地位。' },
      { label: '徐子平《渊海子平》', desc: '四柱八字体系的确立——年、月、日、时四柱，天干地支、十神、大运。子平术至今是命理主流。' },
      { label: '紫微斗数', desc: '传说陈抟创制。以命宫为中心、十三宫分布——星曜+四化，与八字并称"命理双璧"。宋代道藏中已有雏形。' },
      { label: '刘牧《易数钩隐图》', desc: '第一批公开刊印的河洛图式。不过他把河图和洛书画颠倒了——这个错误流行了两百年。' },
    ],
  },
  {
    id: 'yuanmingqing',
    period: '元明清',
    time: '1271 — 1912',
    emoji: '📚',
    summary: '各门术数著作大量集成——六爻有《增删卜易》《卜筮正宗》，命理有《子平真诠》《滴天髓》，风水有《沈氏玄空》，考据有《易图明辨》。',
    color: 'from-indigo-600/20',
    items: [
      { label: '《子平真诠》', desc: '沈孝瞻著。格局派命理经典——从月令出发，以格局论命。"八字看格局"一派自此发端。' },
      { label: '《滴天髓》', desc: '托名京图著、刘基注。命理深度著作——"天道""地道""人道"三篇。以五行平衡和阴阳进退为核心。' },
      { label: '《增删卜易》', desc: '野鹤老人著。六爻实战第一经典——"重验不重理"，敢删旧说。每章有真实卦例，是六爻学习必读书。' },
      { label: '《卜筮正宗》', desc: '王洪绪著。系统整理纳甲筮+详解《黄金策》。纳甲六爻的标准教科书。' },
      { label: '《沈氏玄空学》', desc: '沈竹礽著。玄空飞星风水集大成——九宫飞星推演的系统理论。' },
      { label: '《易图明辨》', desc: '胡渭著。考据学力作——考证河图洛书图式的道教源头。质疑"河洛宋初方出"——对后世影响极大。' },
      { label: '《河洛精蕴》', desc: '江慎修（江永）著。河洛数理的终极探索——将河洛数字与音律、历法、医理贯通。' },
    ],
  },
  {
    id: 'modern',
    period: '近现代',
    time: '1912 — 至今',
    emoji: '💻',
    summary: '易学普及化时代——从尚秉和复兴象数，到南怀瑾、傅佩荣、曾仕强大众化，再到本网站的诞生。',
    color: 'from-purple-600/20',
    items: [
      { label: '尚秉和《焦氏易诂》', desc: '民国象数易复兴。' },
      { label: '杭辛斋《学易笔谈》', desc: '会通中西易学。' },
      { label: '南怀瑾《易经杂说》', desc: '通俗化、生活化——让普通人也读得懂易经。' },
      { label: '傅佩荣《易经入门》', desc: '义理为主、现代解读——"易经教你过好日子"。' },
      { label: '曾仕强《易经的智慧》', desc: '管理+人生哲学——"易经是中国人最大的智慧宝库"。' },
      { label: '数字/算力解卦', desc: 'AI 大模型解卦——用 GPT、DeepSeek 解读卦象。本网站也接入了 AI 解卦功能。' },
    ],
  },
]

// ─── 演化树 SVG ───

function EvolutionTree() {
  return (
    <svg viewBox="0 0 760 600" className="w-full max-w-[740px] mx-auto" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="tai-ji" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#d97706" stopOpacity="0.8" />
          <stop offset="100%" stopColor="#d97706" stopOpacity="0.1" />
        </radialGradient>
      </defs>

      {/* 顶部：太极 */}
      <circle cx="380" cy="28" r="24" fill="url(#tai-ji)" stroke="#d97706" strokeWidth="1.5" />
      <text x="380" y="72" fontSize="14" fill="#d97706" fontWeight="800" textAnchor="middle">太极</text>

      {/* 主干线 */}
      <line x1="380" y1="85" x2="380" y2="580" stroke="#d97706" strokeWidth="1.5" opacity="0.3" />

      {/* 分支①：八卦主线（左） */}
      <line x1="380" y1="120" x2="140" y2="120" stroke="#ef4444" strokeWidth="1.2" opacity="0.4" />
      <text x="140" y="115" fontSize="11" fill="#ef4444" fontWeight="700" textAnchor="middle">☯ 八卦 · 六十四卦</text>
      <text x="140" y="135" fontSize="9" fill="var(--muted)" textAnchor="middle" opacity="0.6">伏羲 → 文王 → 周公</text>

      {/* 八卦分支衍化 */}
      <line x1="140" y1="150" x2="140" y2="180" stroke="#ef4444" strokeWidth="1" opacity="0.3" />
      <text x="140" y="195" fontSize="9" fill="#ef4444" textAnchor="middle" opacity="0.7">┃</text>

      {/* 十翼 */}
      <rect x="80" y="205" width="120" height="28" rx="14" fill="#ef4444" opacity="0.15" stroke="#ef4444" strokeWidth="0.8" />
      <text x="140" y="223" fontSize="10" fill="#ef4444" fontWeight="600" textAnchor="middle">十翼（孔子）</text>

      {/* 义理派 */}
      <rect x="80" y="248" width="120" height="28" rx="14" fill="#f59e0b" opacity="0.15" stroke="#f59e0b" strokeWidth="0.8" />
      <text x="140" y="266" fontSize="10" fill="#f59e0b" fontWeight="600" textAnchor="middle">义理派（王弼→程朱）</text>

      {/* 象数派 */}
      <rect x="80" y="291" width="120" height="28" rx="14" fill="#22c55e" opacity="0.15" stroke="#22c55e" strokeWidth="0.8" />
      <text x="140" y="309" fontSize="10" fill="#22c55e" fontWeight="600" textAnchor="middle">象数派（卦气·卦变）</text>

      {/* 纳甲 → 六爻 */}
      <rect x="80" y="334" width="120" height="28" rx="14" fill="#3b82f6" opacity="0.15" stroke="#3b82f6" strokeWidth="0.8" />
      <text x="140" y="352" fontSize="10" fill="#3b82f6" fontWeight="600" textAnchor="middle">纳甲·六爻（京房→增删卜易）</text>

      {/* 河洛 → 先天 */}
      <rect x="80" y="377" width="120" height="28" rx="14" fill="#a855f7" opacity="0.15" stroke="#a855f7" strokeWidth="0.8" />
      <text x="140" y="395" fontSize="10" fill="#a855f7" fontWeight="600" textAnchor="middle">河洛·先天（陈抟→邵雍）</text>

      {/* 皇极 · 梅花 */}
      <line x1="260" y1="377" x2="280" y2="377" stroke="#a855f7" strokeWidth="0.8" opacity="0.3" />
      <text x="290" y="374" fontSize="9" fill="#a855f7" opacity="0.7">皇极经世</text>
      <line x1="260" y1="391" x2="280" y2="391" stroke="#a855f7" strokeWidth="0.8" opacity="0.3" />
      <text x="290" y="388" fontSize="9" fill="#a855f7" opacity="0.7">梅花易数</text>
      <line x1="260" y1="405" x2="280" y2="405" stroke="#a855f7" strokeWidth="0.8" opacity="0.3" />
      <text x="290" y="402" fontSize="9" fill="#a855f7" opacity="0.7">玄空飞星</text>

      {/* 分支②：阴阳五行（中右） */}
      <line x1="380" y1="160" x2="620" y2="160" stroke="#3b82f6" strokeWidth="1.2" opacity="0.4" />
      <text x="620" y="155" fontSize="11" fill="#3b82f6" fontWeight="700" textAnchor="middle">☯ 阴阳五行合流</text>
      <text x="620" y="175" fontSize="9" fill="var(--muted)" textAnchor="middle" opacity="0.6">战国—汉</text>

      {/* 八字 */}
      <rect x="555" y="200" width="130" height="28" rx="14" fill="#3b82f6" opacity="0.15" stroke="#3b82f6" strokeWidth="0.8" />
      <text x="620" y="218" fontSize="10" fill="#3b82f6" fontWeight="600" textAnchor="middle">四柱八字</text>
      <text x="620" y="235" fontSize="8" fill="var(--muted)" textAnchor="middle" opacity="0.5">李虚中→徐子平→沈孝瞻</text>

      {/* 紫微 */}
      <rect x="555" y="248" width="130" height="28" rx="14" fill="#ef4444" opacity="0.15" stroke="#ef4444" strokeWidth="0.8" />
      <text x="620" y="266" fontSize="10" fill="#ef4444" fontWeight="600" textAnchor="middle">紫微斗数</text>

      {/* 奇门 */}
      <rect x="555" y="296" width="130" height="28" rx="14" fill="#22c55e" opacity="0.15" stroke="#22c55e" strokeWidth="0.8" />
      <text x="620" y="314" fontSize="10" fill="#22c55e" fontWeight="600" textAnchor="middle">奇门遁甲</text>

      {/* 六壬 */}
      <rect x="555" y="344" width="130" height="28" rx="14" fill="#a855f7" opacity="0.15" stroke="#a855f7" strokeWidth="0.8" />
      <text x="620" y="362" fontSize="10" fill="#a855f7" fontWeight="600" textAnchor="middle">大六壬</text>

      {/* 风水 */}
      <rect x="555" y="392" width="130" height="28" rx="14" fill="#f59e0b" opacity="0.15" stroke="#f59e0b" strokeWidth="0.8" />
      <text x="620" y="410" fontSize="10" fill="#f59e0b" fontWeight="600" textAnchor="middle">风水（形势→理气）</text>

      {/* 分支③：河洛数理（右偏） */}
      <line x1="380" y1="460" x2="620" y2="460" stroke="#d97706" strokeWidth="1" opacity="0.3" />
      <text x="620" y="455" fontSize="11" fill="#d97706" fontWeight="700" textAnchor="middle">🔢 河洛数理</text>

      <rect x="555" y="478" width="130" height="28" rx="14" fill="#d97706" opacity="0.15" stroke="#d97706" strokeWidth="0.8" />
      <text x="620" y="496" fontSize="10" fill="#d97706" fontWeight="600" textAnchor="middle">铁板神数</text>

      <rect x="555" y="516" width="130" height="28" rx="14" fill="#d97706" opacity="0.15" stroke="#d97706" strokeWidth="0.8" />
      <text x="620" y="534" fontSize="10" fill="#d97706" fontWeight="600" textAnchor="middle">河洛理数</text>

      {/* 底部总结 */}
      <text x="380" y="580" fontSize="10" fill="var(--muted)" textAnchor="middle" opacity="0.4">三条主线 · 千载流变</text>
    </svg>
  )
}


// ─── 常量 ───

const cardBase = 'bg-[var(--card)] border border-[var(--border)] rounded-xl'

// ─── 组件 ───

export default function EvolutionPage() {
  usePageTitle()

  const [expandedEra, setExpandedEra] = useState<string | null>(null)

  return (
    <>
      <PageHeader
        title="易学流变 — 从太极到八卦再到各门术数"
        subtitle="千年易学演化全景图——太极生两仪，两仪生八卦，八卦衍万象。从上古传说到AI解卦，梳理 3000 年易学发展的主脉络。"
      />

      {/* ═══ 0. 演化树图示 ═══ */}
      <section className={`${cardBase} p-5 md:p-6 mb-5`}>
        <h3 className="text-base font-bold text-[var(--fg)] mb-4">🌳 术数演化树</h3>
        <p className="text-xs text-[var(--muted)] mb-4">
          太极分阴阳，阴阳生三才五行八卦——后世一切术数皆从此出。以下是从太极到各门术数的演化全景。
        </p>
        <div className="bg-[var(--bg3)]/30 rounded-xl p-3 md:p-5">
          <EvolutionTree />
        </div>
      </section>

      {/* ═══ 1. 分时代年表 ═══ */}
      <h3 className="text-lg font-bold text-[var(--fg)] mb-4">📜 易学三千年 · 分时代详览</h3>

      {eras.map(era => {
        const isExpanded = expandedEra === era.id
        return (
          <section key={era.id} className={`${cardBase} overflow-hidden mb-4 transition-all duration-300`}>
            <button
              onClick={() => setExpandedEra(isExpanded ? null : era.id)}
              className="w-full flex items-center gap-3 p-4 md:p-5 cursor-pointer hover:bg-[var(--glow)] transition-colors text-left"
            >
              <span className="text-2xl shrink-0">{era.emoji}</span>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-bold text-[var(--fg)]">{era.period}</h3>
                  <span className="text-[10px] text-[var(--muted)] font-mono">{era.time}</span>
                </div>
                <p className="text-[11px] text-[var(--muted)] mt-0.5 leading-relaxed line-clamp-1">{era.summary}</p>
              </div>
              <span className={`text-xs text-[var(--muted)] transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`}>▼</span>
            </button>

            {isExpanded && (
              <div className="px-4 md:px-5 pb-5 animate-[fadeSlideIn_0.25s_ease-out]">
                <div className="border-t border-[var(--border)] pt-4 space-y-2">
                  {era.items.map((item, i) => (
                    <div
                      key={i}
                      className="bg-[var(--bg3)]/50 rounded-lg px-3 py-2.5"
                    >
                      <h4 className="text-xs font-bold text-[var(--fg)] mb-0.5">{item.label}</h4>
                      <p className="text-[11px] text-[var(--fg)]/70 leading-relaxed">{item.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </section>
        )
      })}

      {/* ═══ 2. 关键词云/速览 ═══ */}
      <section className={`${cardBase} p-5 md:p-6 mb-5`}>
        <h3 className="text-base font-bold text-[var(--fg)] mb-4">🔑 三千年关键词</h3>
        <div className="flex flex-wrap gap-2">
          {[
            '河图洛书', '伏羲八卦', '文王六十四卦', '龟卜', '蓍占', '十翼',
            '京房纳甲', '焦氏易林', '卦气说', '参同契', '太玄经',
            '王弼扫象', '郭璞葬书', '五行大义', '形势风水',
            '陈抟河洛', '邵雍先天', '皇极经世', '梅花易数', '太极图说',
            '朱熹本义', '四柱八字', '紫微斗数', '奇门遁甲', '大六壬',
            '增删卜易', '卜筮正宗', '子平真诠', '滴天髓', '沈氏玄空',
            '易图明辨', '河洛精蕴', 'AI解卦',
          ].map((tag, i) => {
            // 随机大小
            const sizes = ['text-[10px]', 'text-[11px]', 'text-xs', 'text-[13px]']
            const colors = ['bg-amber-500/10 text-amber-400', 'bg-blue-500/10 text-blue-400', 'bg-red-500/10 text-red-400', 'bg-green-500/10 text-green-400', 'bg-purple-500/10 text-purple-400']
            return (
              <span
                key={i}
                className={`${sizes[i % 4]} ${colors[i % 5]} px-2 py-1 rounded-full font-semibold leading-none`}
              >
                {tag}
              </span>
            )
          })}
        </div>
      </section>

      {/* 动画样式 */}
      <style jsx>{`
        @keyframes fadeSlideIn {
          from { opacity: 0; transform: translateY(-6px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </>
  )
}
