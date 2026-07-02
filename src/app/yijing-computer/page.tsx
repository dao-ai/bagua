'use client'
import usePageTitle from '@/hooks/usePageTitle'
import { useState } from 'react'
import PageHeader from '@/components/PageHeader'
import { RubyText } from '@/components/Ruby'
import { TaijiToBitSVG, LeibnizBinarySVG, SixBitSVG, LogicGateSVG } from '@/components/YiComputerSVGs'

const parallels = [
  {
    icon: '☯',
    title: '太极 → 二进制',
    content: '太极分阴阳两仪——计算机分 0 和 1。莱布尼茨在 1703 年发表《论二进制算术》时，正是受到伏羲六十四卦次序图的启发。他看到邵雍的先天图——从坤（000000）到乾（111111）——正好是二进制的顺序。他写信给白晋神父说："伏羲是二进制算术的发明者。"',
    tag: '历史交汇',
  },
  {
    icon: '⚊⚋',
    title: '四象 → 2比特组合',
    content: '两仪生四象——四象就是 2 比特的 4 种状态（00 少阴、01 太阳、10 少阴、11 太阳）。每一种组合在计算机里对应一种逻辑运算或状态。四象之后生八卦——3 比特 8 种状态，覆盖了所有基本的开关组合。一个字节（8 比特）的一半是 4 比特（半字节/nibble），而 3 比特（八卦）就是最基础的寄存器宽度。',
    tag: '比特层级',
  },
  {
    icon: '䷀',
    title: '六爻 → 6比特 → 64卦',
    content: '八卦两两相重得六十四卦，每卦六爻。如果把阳爻视为 1、阴爻视为 0，六十四卦就是全部的 6 比特组合——64 种状态。6 位二进制能表达的数范围是 0-63，与六十四卦的编号（0-63）完全对应。现代 CPU 的最小指令长度也是 8 比特（一个字节），而六十四卦恰好卡在 6 比特的位置——再往前一步就是 8 比特一个字节了。',
    tag: '编码体系',
  },
  {
    icon: '🔄',
    title: '阴阳消长 → 逻辑门',
    content: 'AND、OR、NOT、XOR——计算机最基础的四种逻辑门，本质上就是阴阳关系的运算：AND = 两爻皆阳方为阳（纯阳）；OR = 一阳即阳（阳动）；XOR = 阴阳相异则动（一阴一阳之谓道）；NOT = 阳变阴、阴变阳（物极必反）。布尔代数研究 0 和 1 的运算规律，系辞说"乾道变化，各正性命"——底层逻辑都是同一套。',
    tag: '逻辑运算',
  },
  {
    icon: '🖥️',
    title: '卦变 → 状态机',
    content: '计算机的核心是"状态机"（State Machine）——从一个状态到下一个状态的转移。易卦的"变卦"其实就是状态转移：一个卦（当前状态）的某爻变动（输入信号），导致另一个卦（下一个状态）出现。如果把六十四卦看作 64 个状态，卦爻辞就是状态转移的规则描述——古人版的有限状态自动机。',
    tag: '计算模型',
  },
  {
    icon: '🧮',
    title: '大衍之数 → 算法',
    content: '"大衍之数五十，其用四十有九。分而为二以象两，挂一以象三，揲之以四以象四时……"蓍草占卜的过程本身就是一个精确的算法——输入（初始蓍草数 49）→ 步骤（分、挂、揲、扐）→ 输出（得到一爻）。这个算法有明确的输入、固定的流程、可重复的步骤——完全符合现代"算法"（Algorithm）的定义。比阿拉伯算法（al-Khwārizmī, 9世纪）早了上千年。',
    tag: '算法雏形',
  },
  {
    icon: '🌐',
    title: '阴阳互补 → 纠错码',
    content: '阴和阳不是简单的对立，而是互相包含、互相转化——阴中有阳、阳中有阴。这种哲学在计算机里对应"互补"的思想：反码（One"s Complement）就是阴阳完全翻转；CRC 纠错码利用数的模 2 除法检测错误，原理跟"阴阳消长、盈虚消息"同一思路。二进制的"进位"在八卦中也有体现——从坤到乾的递增，就是最低位不断翻转触发更高位变化的"进位链"。',
    tag: '信息论',
  },
  {
    icon: '💡',
    title: '易与AI',
    content: '现代 AI 的核心是 Transformer 架构和神经网络——本质上也是 0/1 信号在百万亿个参数中的传递与变换。一个模型的"训练"过程，就是不断调整阴阳比例（权重偏置），让输出"卦象"（预测结果）接近"应然之卦"（正确标签）。注意力机制（Attention）的"加权求和"——某种意义上是"当位"与"不当位"的概率化表达。不能说 AI 在"模仿易经"，但两者的底层哲学是共通的：从最简单的二元对立中，演化出无穷的复杂性。',
    tag: '前沿',
  },
]

const leibnizHistory = [
  { year: '1679', event: '莱布尼茨写出《论二进制算术》初稿，但未发表。他已发现所有数可以用 0 和 1 表达。' },
  { year: '1687', event: '法国传教士白晋（Joachim Bouvet）前往中国传教。他在北京接触到邵雍的《皇极经世》和伏羲六十四卦图。' },
  { year: '1697', event: '莱布尼茨发表《中国最新消息》——他对中国文化产生了极大兴趣，并与白晋开始通信。' },
  { year: '1701', event: '白晋从北京寄给莱布尼茨一封信，附上伏羲六十四卦次序图（邵雍先天图）。白晋指出：伏羲的卦序正是二进制的计数顺序。' },
  { year: '1703', event: '莱布尼茨发表了《论二进制算术》——在论文中明确提到了伏羲六十四卦图与二进制的一致性。他说："一切数都可以由 0 和 1 产生……这跟伏羲的符号系统完全一致。"' },
  { year: '1716', event: '莱布尼茨去世。他始终认为二进制是对宇宙真理的表达——"从无中生有"（Ex nihilo omnia fiunt）——跟"太极生两仪"异曲同工。' },
]

const cardBase = 'bg-[var(--card)] border border-[var(--border)] rounded-xl'

export default function YiComputerPage() {
  usePageTitle()

  const [expandedParallel, setExpandedParallel] = useState<number | null>(null)
  const [expandedLeibniz, setExpandedLeibniz] = useState<number | null>(null)

  return (
    <>
      <PageHeader
        title="《易》与计算机 — 二进制·逻辑门·图灵完备"
        subtitle="太极生两仪，两仪生四象，四象生八卦。计算机从 0 和 1 开始，演算出整个数字宇宙。这不仅仅是比喻——从哲学到数学，易与计算机共享着同一个底层逻辑。"
      />

      {/* ═══ 0. 太极到比特 ═══ */}
      <section className={`${cardBase} p-5 md:p-6 mb-5`}>
        <h3 className="text-base font-bold text-[var(--fg)] mb-4">☯ 太极 → 两仪 → 比特</h3>
        <p className="text-xs text-[var(--muted)] mb-4">
          这不是一个穿越的玩笑。从太极到阴阳、从阴阳到四象四象到八卦、从八卦到六十四卦——每一步都对应计算机科学的底层结构。来看这个"中国古代宇宙论 vs 现代计算机"的平行对照。
        </p>
        <div className="bg-[var(--bg3)]/30 rounded-xl p-3 md:p-4">
          <TaijiToBitSVG />
        </div>
      </section>

      {/* ═══ 1. 莱布尼茨与伏羲 ═══ */}
      <section className={`${cardBase} p-5 md:p-6 mb-5`}>
        <h3 className="text-base font-bold text-[var(--fg)] mb-4">🤝 历史交汇点：莱布尼茨 + 伏羲</h3>
        <p className="text-xs text-[var(--muted)] mb-4">
          这不是后人附会。二进制发明者莱布尼茨的论文中，真的引用了伏羲六十四卦图。1701 年到 1703 年，这是一段真实的历史。
        </p>

        {/* 莱布尼茨 vs 邵雍 对比图 */}
        <div className="bg-[var(--bg3)]/30 rounded-xl p-3 md:p-4 mb-4">
          <LeibnizBinarySVG />
        </div>

        {/* 时间线 */}
        <div className="relative">
          <div className="absolute left-4 top-0 bottom-0 w-px bg-[var(--border)]" />
          {leibnizHistory.map((h, i) => (
            <div
              key={i}
              onClick={() => setExpandedLeibniz(expandedLeibniz === i ? null : i)}
              className="relative pl-10 pb-3 cursor-pointer transition-all duration-200 hover:bg-[var(--glow)] rounded-lg -ml-2 pl-8 pr-2 py-1.5"
            >
              <div className="absolute left-[11px] top-2.5 w-2.5 h-2.5 rounded-full border-2 border-[var(--accent)] bg-[var(--card)]" />
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-mono font-bold text-[var(--accent)]">{h.year}</span>
              </div>
              <p className="text-[10px] text-[var(--fg)]/70 leading-relaxed mt-0.5">{h.event}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ═══ 2. 六爻 = 6比特 ═══ */}
      <section className={`${cardBase} p-5 md:p-6 mb-5`}>
        <h3 className="text-base font-bold text-[var(--fg)] mb-4">🔢 六十四卦 = 6 比特 = 64 种状态</h3>
        <p className="text-xs text-[var(--muted)] mb-4">
          如果以阳爻为 1、阴爻为 0，六十四卦正好对应 6 位二进制数的 64 种排列（0-63）。一个字节的一半是半个字节（4 比特 = 16 种)，一个字节是 8 比特（256 种）——六十四卦卡在中间，恰好是 6 比特。
        </p>
        <div className="bg-[var(--bg3)]/30 rounded-xl p-3 md:p-4">
          <SixBitSVG />
        </div>
      </section>

      {/* ═══ 3. 逻辑门 = 阴阳关系 ═══ */}
      <section className={`${cardBase} p-5 md:p-6 mb-5`}>
        <h3 className="text-base font-bold text-[var(--fg)] mb-4">🔌 逻辑门：计算机的"阴阳爻"</h3>
        <p className="text-xs text-[var(--muted)] mb-4">
          计算机最底层的运算单元——逻辑门——的输入输出关系，完全可以用阴阳来理解。
        </p>
        <div className="bg-[var(--bg3)]/30 rounded-xl p-3 md:p-4">
          <LogicGateSVG />
        </div>
      </section>

      {/* ═══ 4. 八大平行对照 ═══ */}
      <h3 className="text-lg font-bold text-[var(--fg)] mb-4">🔬 八大平行对照</h3>

      <div className="space-y-3 mb-5">
        {parallels.map((p, i) => {
          const isExpanded = expandedParallel === i
          return (
            <section key={i} className={`${cardBase} overflow-hidden transition-all duration-300`}>
              <button
                onClick={() => setExpandedParallel(isExpanded ? null : i)}
                className="w-full flex items-center gap-3 p-4 md:p-5 cursor-pointer hover:bg-[var(--glow)] transition-colors text-left"
              >
                <span className="text-2xl shrink-0">{p.icon}</span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-bold text-[var(--fg)]">{p.title}</h3>
                    <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-[var(--accent)]/10 text-[var(--accent2)]">{p.tag}</span>
                  </div>
                </div>
                <span className={`text-xs text-[var(--muted)] transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`}>▼</span>
              </button>

              {isExpanded && (
                <div className="px-4 md:px-5 pb-5 animate-[fadeSlideIn_0.25s_ease-out]">
                  <div className="border-t border-[var(--border)] pt-4">
                    <p className="text-xs text-[var(--fg)]/80 leading-relaxed">{p.content}</p>
                  </div>
                </div>
              )}
            </section>
          )
        })}
      </div>

      {/* ═══ 5. 硬核对照表 ═══ */}
      <section className={`${cardBase} p-5 md:p-6 mb-5`}>
        <h3 className="text-base font-bold text-[var(--fg)] mb-4">📊 易学概念 ↔ 计算机概念 对照表</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[var(--border)]">
                <th className="text-[11px] font-bold text-[var(--accent)] px-3 py-2">易学概念</th>
                <th className="text-[11px] font-bold text-[var(--accent)] px-3 py-2">计算机对应</th>
                <th className="text-[11px] font-bold text-[var(--accent)] px-3 py-2 hidden sm:table-cell">道理</th>
              </tr>
            </thead>
            <tbody>
              {[
                ['太极', '量子态 / 未知', '一切可能性尚未分化'],
                ['阴阳', '0 / 1', '最基本的二元对立'],
                ['两仪', '比特（Bit）', '一个二进制位，最小信息单元'],
                ['四象', '2比特组合', '4种逻辑门输入状态'],
                ['八卦', '3比特 / 半字节前3位', '3位二进制 = 8种状态'],
                ['六十四卦', '6比特', '6位二进制 = 64种状态'],
                ['阳爻 ⚊', '1 / True / High', '高电平、真值'],
                ['阴爻 ⚋', '0 / False / Low', '低电平、假值'],
                ['爻变（动爻）', '信号翻转 Flip-flop', '状态变化，从0变1或1变0'],
                ['卦变', '状态机转移', '当前状态+输入=下一状态'],
                ['当位', '位对齐 / 寄存器匹配', '正确的位置有正确的值'],
                ['中正', '平衡二叉树平衡因子', '不偏不倚，恰到好处'],
                ['得位失位', '栈溢出 / 内存对齐错误', '数据放错了位置'],
                ['大衍之数算法', '算法 Algorithm', '步骤化的计算过程'],
                ['蓍草十八变', '循环迭代', '重复步骤直到输出稳定'],
                ['互卦', '中间件 / 中间状态', '从原卦到变卦的过渡状态'],
                ['错卦（阴阳全反）', '反码 ~（取反）', '所有位取反'],
                ['综卦（上下颠倒）', '字节序反转 Endianness', '顺序颠倒的另一种视角'],
                ['吉凶悔吝', '返回值 / 状态码', '不同的输出结果'],
                ['先天八卦次序', '二进制自然计数', '从0到7的自然递增'],
              ].map((row, i) => (
                <tr key={i} className="border-b border-[var(--border)]/50 hover:bg-[var(--glow)] transition-colors">
                  <td className="text-xs px-3 py-2 text-[var(--fg)]">{row[0]}</td>
                  <td className="text-xs px-3 py-2 text-[var(--accent2)]">{row[1]}</td>
                  <td className="text-[11px] px-3 py-2 text-[var(--muted)] hidden sm:table-cell">{row[2]}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* ═══ 6. 结语 ═══ */}
      <section className={`${cardBase} p-5 md:p-6 mb-5`}>
        <h3 className="text-base font-bold text-[var(--fg)] mb-3">💭 结语：道法自然</h3>
        <div className="space-y-2 text-xs text-[var(--fg)]/80 leading-relaxed">
          <p>
            莱布尼茨在 1703 年看到伏羲六十四卦图的时候，他并没有说"中国古人发明了计算机"。他说的是：<strong>"伏羲的符号系统证明，宇宙可以用最简单的二元法则来描述。"</strong>
          </p>
          <p>
            三百年后，我们用 0 和 1 构建了整个数字文明。如果说二进制是易学的"现代转世"，那不是穿越，而是<strong>同一个底层逻辑在不同文明语境中的独立发现</strong>。
          </p>
          <p>
            老子说"道生一，一生二，二生三，三生万物"——计算机"一"是比特，"二"是布尔代数的两个真值，"三"是逻辑门的三种基本运算（AND、OR、NOT），"万物"是运行在上面的软件系统。两千年前的哲学家和现代计算机科学家，站在同一个地方看着同一个东西，只是用了不同的语言描述。
          </p>
          <p className="text-[var(--accent)] font-semibold mt-3">
            易简而天下之理得矣。——《系辞传》
          </p>
        </div>
      </section>

      <style jsx>{`
        @keyframes fadeSlideIn {
          from { opacity: 0; transform: translateY(-6px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </>
  )
}
