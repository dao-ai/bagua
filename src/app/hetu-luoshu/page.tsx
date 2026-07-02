'use client'
import usePageTitle from '@/hooks/usePageTitle'
import { useState } from 'react'
import PageHeader from '@/components/PageHeader'
import { RubyText } from '@/components/Ruby'
import { HetuSVG, LuoshuSVG, CompareSVG } from '@/components/HetuLuoshuSVGs'
import { cardBase } from '@/constants'


// ─── 数据 ───

const overviewItems = [
  {
    title: '什么是河图？',
    icon: '🌊',
    content: '河图是一幅由黑白圆圈组成的数字图案，相传出自黄河（"河"即黄河）。它以十字形排列——东、南、西、北、中五个方位，每个方位有一对数字（生数和成数），对应五行：一六居北为水、二七居南为火、三八居东为木、四九居西为金、五十居中为土。生数为"天"，成数为"地"，体现天地交合、阴阳相配的思想。河图的数字排列方式被称为"十字形"或"辐射形"结构。',
  },
  {
    title: '什么是洛书？',
    icon: '📖',
    content: '洛书是一幅九宫数字方阵，相传出自洛水（"洛"即洛水）。它以九宫格排列——戴九履一、左三右七、二四为肩、六八为足，五居中央。这个3×3方阵的奇妙之处在于：任意一行、一列或对角线上的三个数字之和都是15。洛书是最早的"幻方"（Magic Square），比西方同类发现早了一千多年。它的结构被称为"九宫形"或"方阵形"，代表了空间秩序和平衡法则。',
  },
  {
    title: '河图洛书的传说',
    icon: '🐉',
    content: '最著名的传说：伏羲氏时，有龙马从黄河中跃出，背负"河图"；伏羲受此启发而创制了八卦。又传说夏禹治水时，有神龟从洛水中浮出，背上有"洛书"纹路；大禹据此分定九州。这就是《易传·系辞》所说的"河出图，洛出书，圣人则之"——圣人效法河图洛书而创立了文明制度。现代学者多认为河图洛书是上古先民对数字规律和宇宙秩序的天才总结。',
  },
  {
    title: '河图洛书与八卦的关系',
    icon: '☯',
    content: '河图洛书被视为八卦的"数理源头"。河图的十字方位（东木、南火、西金、北水、中土）对应后天八卦的五行定位，洛书的九宫结构更是直接对应八卦九宫方位（坎一、坤二、震三、巽四、中五、乾六、兑七、艮八、离九）。宋代易学家（如邵雍、朱熹）将河洛之学纳入理学体系，形成了"河洛易"的独特阐释传统。可以说：河图洛书是八卦的"数学骨架"，八卦是河洛的"符号血肉"。',
  },
]

const hetuDetails = [
  { label: '一六共宗 · 水', num: '1 + 6 = 7', position: '北方', color: 'text-blue-500', content: '天一生水，地六成之。一为生数（阳），六为成数（阴），一六相合而生水。水在五行中代表了生命的起源——"万物之所生也"。在八卦中对应坎卦（䷜）。冬季、黑色、咸味、肾脏都与北方水相应。' },
  { label: '二七同道 · 火', num: '2 + 7 = 9', position: '南方', color: 'text-red-500', content: '地二生火，天七成之。二为生数（阴），七为成数（阳），二七相合而生火。火代表了生长和文明——"万物之所长也"。在八卦中对应离卦（䷝）。夏季、红色、苦味、心脏都与南方火相应。' },
  { label: '三八为朋 · 木', num: '3 + 8 = 11', position: '东方', color: 'text-green-500', content: '天三生木，地八成之。三为生数（阳），八为成数（阴），三八相合而生木。木代表了生长和发展——"万物之所出也"。在八卦中对应震卦（䷲）和巽卦（䷸）。春季、绿色、酸味、肝脏都与东方木相应。' },
  { label: '四九为友 · 金', num: '4 + 9 = 13', position: '西方', color: 'text-purple-500', content: '地四生金，天九成之。四为生数（阴），九为成数（阳），四九相合而生金。金代表了收束和变革——"万物之所收也"。在八卦中对应兑卦（䷹）和乾卦（䷀）。秋季、白色、辛味、肺脏都与西方金相应。' },
  { label: '五十同途 · 土', num: '5 + 10 = 15', position: '中央', color: 'text-amber-600', content: '天五生土，地十成之。五为生数（阳），十为成数（阴），五十相合而生土。土代表了中和和承载——"万物之所归也"。在八卦中对应坤卦（䷁）和艮卦（䷳）。土旺于四季之末，黄色、甘味、脾脏都与中央土相应。' },
]

const luoshuDetails = [
  { label: '坎 — 北', num: '1', position: '正北', color: 'text-blue-600', content: '洛书北方之数为一，对应八卦中的坎卦（䷜）。水的数字，五行属水。在洛书九宫中，一白水星主事。一为万物之始，所以坎卦代表了险难、陷落，但也代表智慧——"君子以常德行，习教事"。' },
  { label: '坤 — 西南', num: '2', position: '西南', color: 'text-yellow-700', content: '洛书西南之数为二，对应八卦中的坤卦（䷁）。地的数字，五行属土。二为阴数之始，坤为纯阴之卦，代表柔顺、承载、养育——"地势坤，君子以厚德载物"。黑符星主事。' },
  { label: '震 — 东', num: '3', position: '正东', color: 'text-green-600', content: '洛书东方之数为三，对应八卦中的震卦（䷲）。雷的数字，五行属木。三为阳数，代表了震动、奋起和新生力量——"万物出乎震"。碧禄星主事，春季对应。' },
  { label: '巽 — 东南', num: '4', position: '东南', color: 'text-green-500', content: '洛书东南之数为四，对应八卦中的巽卦（䷸）。风的数字，五行属木。四代表了渗透、传递、无所不入——"随风巽，君子以申命行事"。绿文曲星主事，是文昌的象征。' },
  { label: '中 — 中央', num: '5', position: '中央', color: 'text-amber-600', content: '洛书中央之数为五，对应中央土。五月为十（五+十合为土），居中统摄四方。五是变化的枢纽——在八卦九宫中，五黄廉贞星是最重要的"飞星"之一。"中"是最尊贵的位置，但也需要高度警觉，因为"过犹不及"。' },
  { label: '乾 — 西北', num: '6', position: '西北', color: 'text-orange-600', content: '洛书西北之数为六，对应乾卦（䷀）。天的数字，五行属金。六代表了刚健、创造和权威——"天行健，君子以自强不息"。六白武曲星主事。乾为父、为君，代表领导力和开创精神。' },
  { label: '兑 — 西', num: '7', position: '正西', color: 'text-purple-600', content: '洛书西方之数为七，对应兑卦（䷹）。泽的数字，五行属金。七代表了喜悦、沟通和口才——"说（悦）言乎兑"。七赤破军星主事。兑为口舌、为少女，代表交流表达和情感流露。' },
  { label: '艮 — 东北', num: '8', position: '东北', color: 'text-yellow-600', content: '洛书东北之数为八，对应艮卦（䷳）。山的数字，五行属土。八代表了止息、积蓄和安定——"艮为止"。八白左辅星主事，是当运的旺星（八运2004-2023年）。艮为少男，代表稳重和坚韧。' },
  { label: '离 — 南', num: '9', position: '正南', color: 'text-red-600', content: '洛书南方之数为九，对应离卦（䷝）。火的数字，五行属火。九为阳数之极，代表了圆满、光明和智慧——"离为火"，"明两作离"。九紫右弼星主事。离为目、为中女，代表文明和智慧的光辉。' },
]

const quoteSections = [
  { source: '《易传·系辞上传》', quote: '河出图，洛出书，圣人则之。', note: '黄河出现河图，洛水出现洛书，圣人效法它们而创作八卦和治理天下。这是河图洛书在先秦经典中唯一的确切记载，也是后世"河洛之学"的经典依据。孔子及其弟子把河图洛书放到了"圣人创制"的高度——与伏羲画卦、大禹治水并列。' },
  { source: '《论语·子罕》', quote: '子曰："凤鸟不至，河不出图，吾已矣夫！"', note: '孔子感叹：凤凰不来，黄河不出图，我的道没有希望实现了。孔子在人生的末路中以"河不出图"为喻，表达了对太平盛世难再的感慨。可见在孔子的时代，河图已经被视为天降祥瑞、圣人出世的象征。' },
  { source: '《尚书·顾命》', quote: '天球、河图在东序。', note: '周成王驾崩，康王即位时陈列的珍宝中有"河图"。这是最早的文献记载之一——证明河图在周代就被视为珍贵的器物。但这里的"河图"究竟是指数字图还是玉器，学者至今仍有争议。' },
  { source: '《礼记·礼运》', quote: '天不爱其道，地不爱其宝……河出马图。', note: '上天不吝惜显示其道，大地不吝惜出产珍宝……黄河出现了龙马负图。这个叙述与伏羲画卦的传说直接联系起来，说明河图是圣人获得天启、创立文明的重要中介。' },
]

const keyPoints = [
  { num: '❶', title: '数字哲学', content: '河图洛书的核心是数字——不是简单的算术，而是一套关于宇宙秩序的数学模型。奇数（1、3、5、7、9）为"天数"、属阳；偶数（2、4、6、8、10）为"地数"、属阴。"天地之数"相加为55（1+2+…+10=55），这个数字在后世易学中极为重要。' },
  { num: '❷', title: '五行方位', content: '河图将1-10对应五行四方：一六北水、二七南火、三八东木、四九西金、五十中土。洛书则将1-9配入九宫：北一、西南二、东三、东南四、中五、西北六、西七、东北八、南九。两者共同构建了五行方位体系的数理基础。' },
  { num: '❸', title: '生成与变化', content: '河图中每一对数字都是"生数+成数"——生数为"天"、为始、为阳；成数为"地"、为终、为阴。生数在里圈，成数在外圈。这个结构描绘了宇宙中"从无到有"、"从小到大"的生成过程——任何事物都有其生数和成数，生数是种子，成数是果实。' },
  { num: '❹', title: '河洛与八卦', content: '河图的十字方位对应后天八卦的五行定位；洛书的九宫则是八卦九宫的数学表达——坎1坤2震3巽4中5乾6兑7艮8离9。宋代邵雍从河洛中推导出"先天八卦方位"，朱熹把河图洛书放在《周易本义》卷首，从此"河洛之学"成为宋明理学的核心内容之一。' },
  { num: '❺', title: '东西方的呼应', content: '洛书是一个3阶幻方（Magic Square），所有行、列、对角线之和均为15。西方最早的幻方记载是公元1世纪的希腊，而洛书的传说至少可追溯到周代。这种"秩序之美"是人类共同的精神遗产——无论东西方，先民们都相信数字中隐藏着宇宙的密码。' },
]

const histories = [
  { era: '上古传说', content: '河图洛书的神话起源。伏羲受河图画八卦，大禹受洛书定九州。传说的具体细节在不同典籍中略有出入，但核心精神一致——圣人得天地之启示而创制文明。' },
  { era: '先秦 · 孔子时代', content: '《论语》中孔子悲叹"河不出图"，《易传》记载"河出图，洛出书，圣人则之"，《尚书》《礼记》也有提及。但都只是提及，没有详细说明河图洛书的具体样貌和内容，给后世留下了巨大的阐释空间。' },
  { era: '汉代 · 谶纬之学', content: '汉代谶纬之学盛行，河图洛书被赋予了更多的神秘色彩。《河图括地象》《洛书甄曜度》等纬书出现，将河洛与天文星象、地理分野联系起来。但此时仍然没有具体的数字图。' },
  { era: '北宋 · 陈抟传图', content: '转折点来了。道教宗师陈抟（希夷先生）传出了河图洛书的数字图式。陈抟的传承谱系：陈抟 → 种放 → 李溉 → 许坚 → 范谔昌 → 刘牧 → 邵雍、周敦颐。一张沉寂了两千多年的"数字图"，突然以完整的图形形式出现在世人面前。' },
  { era: '北宋 · 刘牧《易数钩隐图》', content: '刘牧著《易数钩隐图》，第一次将河图洛书的数字图公开出版。不过刘牧将"河图"和"洛书"的命名搞反了——他管现在所谓的"河图"叫"洛书"，管"洛书"叫"河图"。这个错误一度成为宋易的主流。' },
  { era: '南宋 · 朱熹正名', content: '朱熹在《周易本义》卷首刊出"河图""洛书"两图，纠正了刘牧的颠倒：以"十数图"（十字形）为河图，以"九数图"（九宫形）为洛书。此后700年，这个命名一直沿用至今，成为定论。' },
  { era: '宋元明清 · 河洛之学', content: '河图洛书成为宋明理学的重要组成部分。邵雍从河洛推演先天之学，蔡元定作《洪范皇极》以河洛解《尚书·洪范》，清代胡渭《易图明辨》甚至考证河洛图式与道教炼丹术的关系。河洛之学从数字图发展出了完整的哲学体系。' },
  { era: '现代 · 科学视角', content: '现代学者从不同角度研究河图洛书：数学史家发现了洛书是世界上最早的幻方；天文史家认为河图与北斗七星的天文观测有关；考古学家推测河洛图式可能是新石器时代玉石器上的纹饰抽象化结果。无论哪种解释，河图洛书作为人类早期数学成就和哲学抽象的代表，其价值都是不可否定的。' },
]


// ─── 主组件 ───

export default function HetuLuoshuPage() {
  usePageTitle()

  const [expandedOverview, setExpandedOverview] = useState<string | null>(null)
  const [expandedHetu, setExpandedHetu] = useState<number | null>(null)
  const [expandedLuoshu, setExpandedLuoshu] = useState<number | null>(null)
  const [expandedQuote, setExpandedQuote] = useState<number | null>(null)
  const [expandedHistory, setExpandedHistory] = useState<number | null>(null)
  const [expandedPoint, setExpandedPoint] = useState<number | null>(null)

  return (
    <>
      <PageHeader
        title="河图洛书 — 八卦的数理之源"
        subtitle={'\u201c河出图，洛出书，圣人则之。\u201d——河图洛书是中国古代文明的两大神秘图案，被认为是八卦和九宫的源头。它们用最简洁的数字符号，构建了一套完整的宇宙秩序模型。'}
      />

      {/* ═══ 0. 双图并览 ═══ */}
      <section className={`${cardBase} p-5 md:p-6 mb-5`}>
        <h3 className="text-base font-bold text-[var(--fg)] mb-4">📊 一图览尽 · 河图与洛书</h3>
        <p className="text-xs text-[var(--muted)] mb-6">
          左边是河图（黄河·龙马），右边是洛书（洛水·神龟）。河图用十字方位对应五行生成，洛书用九宫方阵体现均衡和谐。
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-[var(--bg3)]/40 rounded-xl p-4">
            <h4 className="text-sm font-bold text-[var(--fg)] text-center mb-3">🌊 河图 · 十字五行</h4>
            <HetuSVG />
            <p className="text-xs text-[var(--muted)] text-center mt-3">
              一六水 · 二七火 · 三八木 · 四九金 · 五十土
            </p>
          </div>
          <div className="bg-[var(--bg3)]/40 rounded-xl p-4">
            <h4 className="text-sm font-bold text-[var(--fg)] text-center mb-3">📖 洛书 · 九宫幻方</h4>
            <LuoshuSVG />
            <p className="text-xs text-[var(--muted)] text-center mt-3">
              载九履一 · 左三右七 · 纵横十五
            </p>
          </div>
        </div>
        {/* 对比微图 */}
        <div className="mt-4 p-3 bg-[var(--bg3)]/30 rounded-xl">
          <div className="flex items-center justify-center gap-4">
            <CompareSVG />
          </div>
        </div>
      </section>

      {/* ═══ 1. 概述 ═══ */}
      <section className={`${cardBase} p-5 md:p-6 mb-5`}>
        <h3 className="text-base font-bold text-[var(--fg)] mb-4">📚 认识河图洛书</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {overviewItems.map(item => (
            <div
              key={item.title}
              onClick={() => setExpandedOverview(expandedOverview === item.title ? null : item.title)}
              className="bg-[var(--bg3)]/50 rounded-xl p-4 cursor-pointer transition-all duration-200 hover:bg-[var(--glow)]"
            >
              <div className="flex items-start gap-2">
                <span className="text-base mt-0.5">{item.icon}</span>
                <div className="min-w-0 flex-1">
                  <h4 className="text-sm font-bold text-[var(--fg)] mb-1">{item.title}</h4>
                  <p className="text-xs text-[var(--fg)]/70 leading-relaxed line-clamp-3">
                    {expandedOverview === item.title ? item.content : item.content.slice(0, 80) + '…'}
                  </p>
                  <span className="text-[10px] text-[var(--accent)] mt-1 inline-block">
                    {expandedOverview === item.title ? '收起' : '展开'}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ═══ 2. 河图详解 ═══ */}
      <section className={`${cardBase} p-5 md:p-6 mb-5`}>
        <h3 className="text-base font-bold text-[var(--fg)] mb-4">🌊 河图详解 · 天地生成之数</h3>
        <p className="text-xs text-[var(--muted)] mb-4">
          河图以五十为中枢，四方各配一对生成之数。以下是五个方位的详细解读：生数（内圈，属天）与成数（外圈，属地）相合，生成五行。
        </p>
        <div className="space-y-2">
          {hetuDetails.map((d, i) => (
            <div
              key={i}
              onClick={() => setExpandedHetu(expandedHetu === i ? null : i)}
              className="bg-[var(--bg3)]/50 rounded-xl p-3 cursor-pointer transition-all duration-200 hover:bg-[var(--glow)]"
            >
              <div className="flex items-center gap-3">
                <span className={`text-sm font-bold font-mono ${d.color}`}>{d.num}</span>
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-bold text-[var(--fg)]">{d.label}</h4>
                  <span className="text-[10px] text-[var(--muted)]">{d.position}</span>
                </div>
                <span className={`text-[10px] text-[var(--muted)] transition-transform duration-200 ${expandedHetu === i ? 'rotate-180' : ''}`}>▼</span>
              </div>
              {expandedHetu === i && (
                <p className="mt-2 text-xs text-[var(--fg)]/80 leading-relaxed border-t border-[var(--border)] pt-2 animate-[fadeSlideIn_0.2s_ease-out]">{d.content}</p>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* ═══ 3. 洛书详解 ═══ */}
      <section className={`${cardBase} p-5 md:p-6 mb-5`}>
        <h3 className="text-base font-bold text-[var(--fg)] mb-4">📖 洛书详解 · 九宫八卦之序</h3>
        <p className="text-xs text-[var(--muted)] mb-4">
          洛书九宫以数字排列，每一宫对应一个方位和一卦。其中最精妙的是：纵、横、斜三数之和均为15（即洛书常数）。
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
          {luoshuDetails.map((d, i) => (
            <div
              key={i}
              onClick={() => setExpandedLuoshu(expandedLuoshu === i ? null : i)}
              className="bg-[var(--bg3)]/50 rounded-xl p-3 cursor-pointer transition-all duration-200 hover:bg-[var(--glow)]"
            >
              <div className="flex items-center gap-2 mb-1">
                <span className={`text-lg font-bold font-mono ${d.color}`}>{d.num}</span>
                <h4 className="text-xs font-bold text-[var(--fg)]">{d.label}</h4>
                <span className="text-[9px] text-[var(--muted)] ml-auto">{d.position}</span>
              </div>
              <p className="text-[10px] text-[var(--fg)]/70 leading-relaxed line-clamp-2">
                {expandedLuoshu === i ? d.content : d.content.slice(0, 55) + '…'}
              </p>
              <span className="text-[9px] text-[var(--accent)] mt-0.5 inline-block">
                {expandedLuoshu === i ? '收起' : '展开'}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* ═══ 4. 核心要点 ═══ */}
      <section className={`${cardBase} p-5 md:p-6 mb-5`}>
        <h3 className="text-base font-bold text-[var(--fg)] mb-4">🧠 河图洛书的五大核心要点</h3>
        <div className="space-y-2">
          {keyPoints.map((pt, i) => (
            <div
              key={i}
              onClick={() => setExpandedPoint(expandedPoint === i ? null : i)}
              className="bg-[var(--bg3)]/50 rounded-xl p-3 cursor-pointer transition-all duration-200 hover:bg-[var(--glow)]"
            >
              <div className="flex items-center gap-2">
                <span className="text-sm shrink-0">{pt.num}</span>
                <h4 className="text-sm font-bold text-[var(--fg)]">{pt.title}</h4>
                <span className={`text-[10px] text-[var(--muted)] ml-auto transition-transform duration-200 ${expandedPoint === i ? 'rotate-180' : ''}`}>▼</span>
              </div>
              {expandedPoint === i && (
                <p className="mt-2 text-xs text-[var(--fg)]/80 leading-relaxed border-t border-[var(--border)] pt-2 animate-[fadeSlideIn_0.2s_ease-out]">{pt.content}</p>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* ═══ 5. 经典引文 ═══ */}
      <section className={`${cardBase} p-5 md:p-6 mb-5`}>
        <h3 className="text-base font-bold text-[var(--fg)] mb-4">📜 经典记载</h3>
        <p className="text-xs text-[var(--muted)] mb-4">河图洛书在先秦至汉代的经典中多次被提及——虽然语焉不详，但字字千钧。</p>
        <div className="space-y-2">
          {quoteSections.map((q, i) => (
            <div
              key={i}
              onClick={() => setExpandedQuote(expandedQuote === i ? null : i)}
              className="bg-[var(--bg3)]/50 rounded-xl p-3 cursor-pointer transition-all duration-200 hover:bg-[var(--glow)]"
            >
              <div className="flex items-start gap-2">
                <span className="text-[10px] text-[var(--accent)] font-mono font-bold shrink-0 mt-1">{q.source}</span>
                <div className="min-w-0 flex-1">
                  <p className="text-xs text-[var(--fg)] leading-relaxed font-mono">&ldquo;{q.quote}&rdquo;</p>
                </div>
                <span className={`text-[10px] text-[var(--muted)] shrink-0 transition-transform duration-200 ${expandedQuote === i ? 'rotate-180' : ''}`}>▼</span>
              </div>
              {expandedQuote === i && (
                <div className="mt-2 pt-2 border-t border-[var(--border)] animate-[fadeSlideIn_0.2s_ease-out]">
                  <p className="text-[11px] text-[var(--fg)]/80 leading-relaxed">
                    <span className="text-[var(--accent)] font-semibold">💡 解读：</span>
                    {q.note}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* ═══ 6. 历史源流 ═══ */}
      <section className={`${cardBase} p-5 md:p-6 mb-5`}>
        <h3 className="text-base font-bold text-[var(--fg)] mb-4">⏳ 河图洛书的历史源流</h3>
        <p className="text-xs text-[var(--muted)] mb-4">
          从神话传说到数字图式，从先秦经典到理学核心，河图洛书走过了两千多年的历史长路。
        </p>
        <div className="relative">
          {/* 时间轴 */}
          <div className="absolute left-4 top-0 bottom-0 w-px bg-[var(--border)]" />
          {histories.map((h, i) => (
            <div
              key={i}
              onClick={() => setExpandedHistory(expandedHistory === i ? null : i)}
              className="relative pl-10 pb-4 cursor-pointer transition-all duration-200 hover:bg-[var(--glow)] rounded-lg -ml-2 pl-8 pr-2 py-2"
            >
              {/* 时间轴圆点 */}
              <div className="absolute left-[11px] top-3 w-2.5 h-2.5 rounded-full border-2 border-[var(--accent)] bg-[var(--card)]" />
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-semibold text-[var(--accent)] shrink-0">{h.era}</span>
                <span className={`text-[9px] text-[var(--muted)] ml-auto transition-transform duration-200 ${expandedHistory === i ? 'rotate-180' : ''}`}>▼</span>
              </div>
              <p className="text-[10px] text-[var(--fg)]/70 leading-relaxed mt-1">
                {expandedHistory === i ? h.content : h.content.slice(0, 70) + '…'}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ═══ 7. 学习方法论 ═══ */}
      <section className={`${cardBase} p-5 md:p-6 mb-5`}>
        <h3 className="text-base font-bold text-[var(--fg)] mb-4">🧭 如何学习河图洛书？</h3>
        {[
          { icon: '🔢', title: '从数字开始', content: '别害怕——河图洛书本质上就是数字。先记住河图五十居中、四方各配一对生成数（1-6、2-7、3-8、4-9、5-10），再记住洛书九宫的口诀"戴九履一，左三右七，二四为肩，六八为足"。背熟了数字，就等于拿到了钥匙。' },
          { icon: '🗺️', title: '记住方位对应', content: '河图是十字形四方位+中央，对应五行和四时。洛书是九宫八方位+中央，对应文王后天八卦。画在自己的笔记本上，闭上眼睛能在脑子里"看见"这两个图，就成功了。' },
          { icon: '☯', title: '联系八卦', content: '河洛之学不脱离卦就说不清楚。看洛书：九官配八卦——坎北一、坤西南二、震东三、巽东南四、中五、乾西北六、兑西七、艮东北八、离南九。把这个对应关系背下来，看风水的"九宫飞星"你就能懂了。' },
          { icon: '📚', title: '阅读经典', content: '朱熹的《周易本义》卷首有河图洛书图，是最权威的入门文本。进阶可以读宋代邵雍的《皇极经世》、清代胡渭的《易图明辨》。现代著作推荐张其成的《河洛精蕴》、李申的《河图洛书与易学》——深入浅出，兼顾学术和趣味。' },
          { icon: '🔬', title: '保持怀疑精神', content: '河图洛书的神秘有两千年历史，但宋代才出现具体的数字图式——中间有近两千年的"空白期"。有学者（如清代黄宗羲、毛奇龄）质疑河洛图式为宋人伪托。不要被这些争议困扰，关键是理解河图洛书作为数字模型和哲学工具的价值。真相在历史中，智慧在理解中。' },
        ].map((m, i) => (
          <div
            key={i}
            className="bg-[var(--bg3)]/50 rounded-xl p-3 mb-2"
          >
            <div className="flex items-center gap-2">
              <span className="text-base">{m.icon}</span>
              <h4 className="text-xs font-bold text-[var(--fg)]">{m.title}</h4>
            </div>
            <p className="mt-1 text-[11px] text-[var(--fg)]/70 leading-relaxed">{m.content}</p>
          </div>
        ))}
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
