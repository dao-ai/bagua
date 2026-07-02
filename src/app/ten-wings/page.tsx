'use client'
import usePageTitle from '@/hooks/usePageTitle'
import { useState } from 'react'
import PageHeader from '@/components/PageHeader'
import { RubyText } from '@/components/Ruby'
import { cardBase } from '@/constants'

// ─── 十翼数据 ───

interface WingInfo {
  id: string
  name: string
  altName?: string
  symbol: string
  category: '卦爻辞' | '通论' | '八卦' | '杂论'
  brief: string
  detail: string
  structure: string
  highlights: { label: string; quote: string; source: string; modern: string }[]
  color: string
}

const wings: WingInfo[] = [
  {
    id: 'tuan-shang',
    name: '彖传上',
    altName: '彖·上',
    symbol: '📜',
    category: '卦爻辞',
    brief: '统论六十四卦卦名、卦辞，解释一卦之大义',
    detail: `"彖"（tuàn）的本义是"断"，断一卦之吉凶。彖传是对六十四卦卦辞的逐条解释，每一卦一篇。上篇从乾到离共三十卦。《彖传》的核心是阐发每一卦的"卦德"——卦象背后所蕴含的道理和吉凶判断依据。它不像卦辞那样简略，而是深入分析卦象构成（上下卦关系、中位、阴阳消长等），将抽象符号还原为具象的人事哲理。`,
    structure: '上篇30卦：䷀乾 → ䷝离；下篇34卦：䷞咸 → ䷿未济',
    highlights: [
      { label: '乾卦', quote: '大哉乾元，万物资始，乃统天。', source: '《彖传·乾》', modern: '伟大啊，乾元！万物依赖它开始存在，它统领着天道运行。这句话揭示了"元"作为宇宙本源的创生力量。' },
      { label: '坤卦', quote: '至哉坤元，万物资生，乃顺承天。', source: '《彖传·坤》', modern: '极致的坤元！万物依赖它获得形体，它柔顺地承接天道。乾坤并建——乾创始，坤完成。' },
      { label: '泰卦', quote: '天地交而万物通也，上下交而其志同也。', source: '《彖传·泰》', modern: '天上地下，阳气上升阴气下降，天地交融万物才能通达。引申到人事：上下级沟通顺畅，目标才能一致。' },
      { label: '谦卦', quote: '天道亏盈而益谦，地道变盈而流谦。', source: '《彖传·谦》', modern: '天的规律是减损满的、增益谦的；地的规律是改变满的、流向谦的。谦卦六爻皆吉，正是顺应天地之道。' },
    ],
    color: 'from-sky-500/20',
  },
  {
    id: 'xiang-shang',
    name: '象传上',
    altName: '大象·小象',
    symbol: '🖼️',
    category: '卦爻辞',
    brief: '释卦象之"大象"、释爻辞之"小象"',
    detail: `"象"就是卦象。象传分两大部分——"大象"解释每一卦的整体卦象（"上乾下坤"之类的卦象描述），从卦象引出人事启示；"小象"则逐爻解释六条爻辞，往往从爻位（当位、中位、应位）和阴阳关系切入。

大象的特点是"取象"——不是抽象地说理，而是先描述卦象，再引出君子应当如何效法。比如"天行健，君子以自强不息"就是大象。小象则更技术化，如果该爻"当位"会有相应的褒贬，是了解《易经》吉凶判断逻辑的关键入口。`,
    structure: '大象38则（上下卦象+人事启示）；小象386则（每卦6爻×64卦 + 乾坤用九用六）',
    highlights: [
      { label: '乾大象', quote: '天行健，君子以自强不息。', source: '《象传·乾》', modern: '天道的运行刚健不已，君子应效法天道，永远自我奋发、永不停歇。这十六个字，是《易经》中最广为人知的名句。' },
      { label: '坤大象', quote: '地势坤，君子以厚德载物。', source: '《象传·坤》', modern: '大地的气势宽厚和顺，君子应效法大地，以深厚的德行承载万物。"自强不息，厚德载物"——清华大学的校训即源于此。' },
      { label: '小象范例', quote: '"潜龙勿用"，阳在下也。"见龙在田"，德施普也。', source: '《象传·乾》', modern: '小象用最简洁的语言解释爻辞的根据：潜龙勿用是因为阳气还在最下面；见龙在田是因为德行开始普遍施与。每一句都有逻辑推导。' },
      { label: '谦大象', quote: '地中有山，谦。君子以裒多益寡，称物平施。', source: '《象传·谦》', modern: '高山藏于大地之中（艮山在坤地之下）就是谦卦的卦象。君子因此减少多的、增益少的，公平分配。取象精妙至极。' },
    ],
    color: 'from-emerald-500/20',
  },
  {
    id: 'xici-shang',
    name: '系辞上传',
    altName: '系辞·上',
    symbol: '📖',
    category: '通论',
    brief: '《易经》的总纲性哲学论述，涵盖了易道、乾坤、变化等根本问题',
    detail: `"系辞"意为"系属于卦爻之下的辞"——是对《易经》全书的总论和阐发。如果说《彖》《象》是逐卦分析，那《系辞》就是俯瞰全局的哲学通论。它是十翼中最重要、最系统的篇章，也是中国古代哲学最精深的论著之一。

《系辞》讨论了易道的根本问题：什么是"太极"？什么是"道"和"器"？卦象如何产生？变化如何运行？吉凶如何判断？它不仅讲易学，更是在讲宇宙论、辩证法、人生哲学。传世的版本中蕴藏着大量名言警句。`,
    structure: '上篇12章，从"天尊地卑"到"乾坤其易之缊邪"',
    highlights: [
      { label: '太极阴阳', quote: '易有太极，是生两仪，两仪生四象，四象生八卦。', source: '《系辞上传》第11章', modern: '《易经》的宇宙生成论——从太极（终极本源）分化出阴阳两仪，两仪演化出四象（老阳、少阴、少阳、老阴），四象衍生出八卦。这是中国版的"宇宙大爆炸"模型。' },
      { label: '道器论', quote: '形而上者谓之道，形而下者谓之器。', source: '《系辞上传》第12章', modern: '超越形体的叫"道"（规律、原理），有具体形体的叫"器"（器物、制度）。这是中国哲学最经典的形而上/形而下划分。"形而上"一词为日文借用翻译"metaphysics"，后传入中文。' },
      { label: '易简之理', quote: '乾以易知，坤以简能。易则易知，简则易从。', source: '《系辞上传》第1章', modern: '乾以平易被人认知，坤以简约显示功能。平易就容易了解，简约就容易遵从。大道至简——真正的智慧大道一定是简单明了的。' },
      { label: '易与天地准', quote: '易与天地准，故能弥纶天地之道。', source: '《系辞上传》第4章', modern: '《易经》与天地法则相准，所以能包罗天地之道。《易经》不是凭空臆想，而是对自然和人事规律的系统总结。' },
    ],
    color: 'from-amber-500/20',
  },
  {
    id: 'xici-xia',
    name: '系辞下传',
    altName: '系辞·下',
    symbol: '📖',
    category: '通论',
    brief: '承上传之绪，深入探讨易道起源、卦象演化、吉凶悔吝的哲学',
    detail: `《系辞下传》与上传相辅相成。上传偏重"理论"——从宇宙论出发构建易学世界观；下传则更偏重"应用"——从历史、人事、变化的角度，展示易学的实践智慧。

下传对"变"的论述尤其深邃。它讲"穷则变，变则通，通则久"——这是中国式的进化论。它还追述了《易经》的起源历史——伏羲观象制卦，以及"易"的三重含义：变易、不易、简易。下传的名句密度极高，几乎每一章都有千古流传的警句。`,
    structure: '下篇12章，从"八卦成列"到"其称名也小"',
    highlights: [
      { label: '三陈九卦', quote: '履德之基也，谦德之柄也，复德之本也……', source: '《系辞下传》第7章', modern: '这是著名的"三陈九卦"——孔子三次陈述九卦（履、谦、复、恒、损、益、困、井、巽）的德行，每一卦代表一种人生品质：履（实践）是基础，谦（谦逊）是关键……' },
      { label: '变通', quote: '穷则变，变则通，通则久。', source: '《系辞下传》第2章', modern: '穷尽就生出变化，变化就能通达，通达就能长久。这是最经典的变化哲学——困局中蕴含着突破的契机。' },
      { label: '观象制器', quote: '上古结绳而治，后世圣人易之以书契……', source: '《系辞下传》第2章', modern: '《系辞》列举了上古圣人如何从卦象中获得灵感、创造器物文明——从渔猎（离卦）到农耕（益卦），从市场交易（噬嗑卦）到舟楫交通（涣卦），从门禁（随卦）到棺椁（大过卦）。' },
      { label: '知几其神', quote: '知几其神乎？君子上交不谄，下交不渎，其知几乎！', source: '《系辞下传》第5章', modern: '能够预知事物微妙的征兆，不是神奇吗？君子对上不谄媚、对下不亵渎，这就是知"几"。"几"（jī）是事物变化的细微萌芽——"见微知著"这个成语即源于此。' },
    ],
    color: 'from-amber-500/20',
  },
  {
    id: 'wenyan',
    name: '文言传',
    symbol: '✍️',
    category: '卦爻辞',
    brief: '专释乾坤二卦，最详尽的单卦哲学解读',
    detail: `"文言"意为"文饰之言"，即对卦爻辞的深度阐发、华丽解说。它只解读两卦——乾卦和坤卦，但篇幅却非常可观，足见乾坤二卦在《易经》体系中的核心地位。

对乾卦的解释尤其精彩，几乎每一爻都引用多位"古之圣人"（可能是孔子及其弟子）的见解。比如初九"潜龙勿用"——有人从"隐"的角度解，有人从"时"的角度解，有人从"德"的角度解。这种多声部的解读方式，本身就是《论语》式的对话体哲学。

《文言传》中"元亨利贞"四德的论述——"元者善之长也，亨者嘉之会也，利者义之和也，贞者事之干也"——成为儒家修身哲学的基石。`,
    structure: '乾卦约20段（分段解释卦辞+逐爻解释爻辞）；坤卦约10段',
    highlights: [
      { label: '元亨利贞', quote: '元者，善之长也；亨者，嘉之会也；利者，义之和也；贞者，事之干也。', source: '《文言传·乾》', modern: '元是众善的首领，亨是美好的汇聚，利是义理的和谐，贞是事物的骨干。孔子将乾卦四德转化为儒家修身四德：仁（元）、礼（亨）、义（利）、智（贞）。' },
      { label: '龙德', quote: '君子以成德为行，日可见之行也。"潜"之为言也，隐而未见，行而未成，是以君子弗用也。', source: '《文言传·乾》', modern: '君子以成就德行为目标，是每天可见的行动。"潜"的意思是隐藏而未显现，行动尚未成功，所以君子暂时不动。说明"潜"不是消极等待，而是积蓄力量。' },
      { label: '坤至柔', quote: '坤至柔而动也刚，至静而德方。', source: '《文言传·坤》', modern: '坤极其柔顺但运动起来却刚强，极其安静但品德方正。《文言传》揭示了一个深刻的辩证法：最柔的往往是最刚的，最静的往往是最正的。' },
      { label: '敬义立', quote: '敬以直内，义以方外，敬义立而德不孤。', source: '《文言传·坤》', modern: '用敬来端正内心，用义来规范外在行为。敬和义确立了，德行就不会孤立。这是儒家内圣外王最经典的表述之一。' },
    ],
    color: 'from-rose-500/20',
  },
  {
    id: 'shuogua',
    name: '说卦传',
    symbol: '🔢',
    category: '八卦',
    brief: '系统阐述八卦的取象体系——八卦到底"像"什么',
    detail: `《说卦传》是学习和记忆八卦的"工具书"和"百科全书"。它集中阐明了八卦的基本性质和大量的引申象征——从自然现象到动物、人体、家庭、方位、季节、颜色、器物……无所不包。

如果说《彖传》《象传》是解读每一卦的"微观分析"，那么《说卦传》就是"宏观总纲"——它提供了一套完整的八卦符号系统，让人看到任意一个卦象，可以立刻联想到它代表的一系列事物。

《说卦传》最著名的内容是"帝出乎震"章——将八卦与方位、季节对应，形成了文王后天八卦的时空图式。另一个重要的是八卦"乾坤生六子"的家庭角色比喻——乾父坤母，震长男、巽长女……让八卦立刻"鲜活"起来。`,
    structure: '共11章，分为三部分：第1-2章揭示八卦原理，第3-4章讲先天八卦方位和"乾坤生六子"体系，第5-11章详尽列举八卦各类取象',
    highlights: [
      { label: '乾坤生六子', quote: '乾，天也，故称乎父；坤，地也，故称乎母。震一索而得男，故谓之长男……', source: '《说卦传》第10章', modern: '乾为父、坤为母。震（初爻阳）=长男，坎（中爻阳）=中男，艮（上爻阳）=少男；巽（初爻阴）=长女，离（中爻阴）=中女，兑（上爻阴）=少女。用家庭角色理解八卦——一家八口，简单好记！' },
      { label: '帝出乎震', quote: '帝出乎震，齐乎巽，相见乎离……', source: '《说卦传》第5章', modern: '天帝（主宰万物的力量）从震（东方、春）出发，到巽（东南、春夏之交）整齐万物，转到离（南方、夏）万物相见……这是后天八卦的核心理论，将八卦与方位、季节、生长阶段一一对应。' },
      { label: '取象体系', quote: '乾为马，坤为牛，震为龙，巽为鸡，坎为豕，离为雉，艮为狗，兑为羊。', source: '《说卦传》第8章', modern: '八卦对应的八种动物。为什么乾是马？因为马健行不息（乾为健）；坤是牛，因牛柔顺负重（坤为顺）。每一种取象都有内在的逻辑联系。' },
      { label: '八卦性情', quote: '乾，健也；坤，顺也；震，动也；巽，入也；坎，陷也；离，丽也；艮，止也；兑，说也。', source: '《说卦传》第7章', modern: '八卦的八大"性情"（基本属性）——这是理解所有取象的总钥匙。健顺动静入陷丽止悦——记住这八个字，就抓住了八卦的精神内核。' },
    ],
    color: 'from-purple-500/20',
  },
  {
    id: 'xugua',
    name: '序卦传',
    symbol: '🔗',
    category: '杂论',
    brief: '解释六十四卦为什么按这个顺序排列',
    detail: `六十四卦是随意排列的吗？绝对不是。《序卦传》就是要说明每一卦与下一卦之间的逻辑关系和因果链条——为什么要"先乾坤，后屯蒙"？为什么要"受之以需"、"受之以讼"？

《序卦传》解释的顺序，本质上是《易经》编纂者眼中的宇宙和人事发展序列：从天地（乾坤）开始，万物初生（屯）、蒙昧待启（蒙）、需要养育（需）、产生争执（讼）、兴师动众（师）、凝聚力量（比）……一直到最后"有过物者必济，故受之以既济"，然后又"物不可穷也，故受之以未济"——以"未完成"收尾，暗含变化永无止境的哲学。`,
    structure: '从䷀乾 → ䷁坤 → ䷂屯 → ䷃蒙 → …… → ䷾既济 → ䷿未济，共64卦的因果链',
    highlights: [
      { label: '乾坤定位', quote: '有天地然后万物生焉。盈天地之间者唯万物，故受之以屯。屯者，盈也。', source: '《序卦传》', modern: '先有天地（乾坤），然后万物才能产生。充满天地之间的是万物，所以乾坤之后是屯卦——屯就是"充满、初生"的意思。这是整个六十四卦的起点逻辑。' },
      { label: '泰否之道', quote: '泰者，通也。物不可以终通，故受之以否。', source: '《序卦传》', modern: '泰是通达的意思，但事物不可能永远通达，所以泰卦之后是否卦（闭塞）。通达和闭塞交替出现——这是辩证法的朴素表达。' },
      { label: '既济未济', quote: '有过物者必济，故受之以既济。物不可穷也，故受之以未济。终焉。', source: '《序卦传》', modern: '超越了常规的（大过卦）之后，一定能成功，所以是既济卦。但事物不可能穷尽，所以接着是未济卦——以"尚未完成"作为全书的结尾。这个安排本身就是一个哲学宣言！' },
      { label: '因果链条', quote: '夫妇之道，不可以不久也，故受之以恒。恒者，久也。', source: '《序卦传》', modern: '咸卦讲夫妇感应之道，但感应不能长久持续，必须有恒常的维系。所以咸卦之后是恒卦。每一环都有深刻的人事逻辑。' },
    ],
    color: 'from-cyan-500/20',
  },
  {
    id: 'zagua',
    name: '杂卦传',
    symbol: '🧩',
    category: '杂论',
    brief: '以两两对举的方式，用极简的话概括六十四卦的卦义',
    detail: `《杂卦传》是十翼中最短、最精炼、也最有趣的一篇。它以两两对举的方式——将六十四卦按"错卦"（阴阳相反）或"综卦"（上下颠倒）配对——每一对用一两句话概括卦义。

比如："乾刚坤柔"——乾卦刚健、坤卦柔顺，一语道破一阴一阳的对比。"比乐师忧"——比卦是亲近团结所以乐，师卦是行军打仗所以忧。一个乐一个忧，对比鲜明。

"杂"的意思是"错杂"——不是按六十四卦的原有顺序，而是打乱重组、两两对比。这种对比的读法，让人跳出每个卦的"内部"理解，从"关系"和"差异"中重新认识卦义。好比看一个颜色，只有把它和对比色放在一起，才能真正看出它的色相和明度。`,
    structure: '共约36对（每对两卦），从"乾刚坤柔"到"需不进也，讼不亲也"',
    highlights: [
      { label: '简练对比', quote: '乾刚坤柔，比乐师忧。临观之义，或与或求。', source: '《杂卦传》', modern: '乾是刚健、坤是柔顺。比卦和谐亲近所以乐，师卦兴师动众所以忧。临的义理是给予，观的意义是观察索取。每一对都用极度凝练的语言揭示核心差异。' },
      { label: '格局收尾', quote: '未济，男之穷也；夬，决也。刚决柔也，君子道长，小人道忧也。', source: '《杂卦传》末段', modern: '全文以未济卦（男性力量的穷尽）和夬卦（决断，刚决断柔）结尾。最终归结到"君子之道增长，小人之道忧惧"——以道德价值收束，呼应全经的教化宗旨。' },
      { label: '人道核心', quote: '井通而困相遇也。咸速也，恒久也。', source: '《杂卦传》', modern: '井卦是疏通（井水滋养），困卦是受阻（遭遇困境一一相对）。咸是感应迅速，恒是恒久坚持。六十四卦的微言大义，被浓缩成两两成对的精警短句。' },
    ],
    color: 'from-indigo-500/20',
  },
]

// ─── 概述卡片 ───

const overviewItems = [
  { title: '什么是十翼？', content: '"十翼"是对《易经》的十篇"辅翼"解说文字的统称。传统认为是孔子所作，用以"赞明易道"——像翅膀一样辅翼《周易》经文，帮助后人理解。现代学者多认为它们出自孔子及其后学之手，成书于战国至汉初。没有十翼，《周易》只是一部占卜手册；有了十翼，它才成为"群经之首、大道之源"。', icon: '🪽' },
  { title: '孔子与十翼', content: '《史记·孔子世家》记载："孔子晚而喜易，序彖、系、象、说卦、文言，读易韦编三绝。"传统认为孔子亲手撰写了十翼。现代考证表明，十翼可能是在孔门弟子（商瞿、子夏等）的传承中逐渐形成、丰富、编定的。无论作者是谁，十翼的思想底色是先秦儒家，尤其是孔子的"中庸"、"时中"等思想贯穿其中。', icon: '📚' },
  { title: '十翼的构成', content: '十翼包括十篇文字：1️⃣ 《彖传》上下 2️⃣ 《象传》上下 3️⃣ 《系辞传》上下 4️⃣ 《文言传》 5️⃣ 《说卦传》 6️⃣ 《序卦传》 7️⃣ 《杂卦传》。习惯上将《彖》《象》《系辞》各分上下，合为七种十篇，称"十翼"。其中《彖》《象》逐卦逐爻解释，是"贴身"注释；《系辞》《文言》是综合性通论；《说卦》《序卦》《杂卦》则是专题论述。', icon: '📋' },
  { title: '学十翼的意义', content: '十翼是把卦爻符号"翻译"成哲学语言的关键。想深入学易，光背卦辞爻辞远远不够——那是"经文"；十翼是"传文"，告诉你"为什么这个卦是这样"、"这个爻辞为什么这么说"。读懂十翼，才算真正入了易学的大门。孔子说"假我数年，五十以学易，可以无大过矣"——十翼就是他教我们怎么读易的课本。', icon: '🎯' },
]

// ─── 名句汇总 ───

const famousQuotes = [
  { text: '天行健，君子以自强不息。', source: '《象传·乾》', topic: '乾卦' },
  { text: '地势坤，君子以厚德载物。', source: '《象传·坤》', topic: '坤卦' },
  { text: '易有太极，是生两仪，两仪生四象，四象生八卦。', source: '《系辞上传》', topic: '宇宙生成论' },
  { text: '形而上者谓之道，形而下者谓之器。', source: '《系辞上传》', topic: '道器论' },
  { text: '穷则变，变则通，通则久。', source: '《系辞下传》', topic: '变化哲学' },
  { text: '一阴一阳之谓道。', source: '《系辞上传》', topic: '阴阳论' },
  { text: '易，穷则变，变则通，通则久。', source: '《系辞下传》', topic: '变通' },
  { text: '仁者见之谓之仁，知者见之谓之知。', source: '《系辞上传》', topic: '见仁见智' },
  { text: '书不尽言，言不尽意。', source: '《系辞上传》', topic: '言意之辨' },
  { text: '君子居则观其象而玩其辞，动则观其变而玩其占。', source: '《系辞上传》', topic: '学易方法' },
  { text: '敬以直内，义以方外。', source: '《文言传·坤》', topic: '内圣外王' },
  { text: '元者，善之长也；亨者，嘉之会也。', source: '《文言传·乾》', topic: '元亨利贞' },
  { text: '帝出乎震，齐乎巽，相见乎离。', source: '《说卦传》', topic: '后天八卦' },
  { text: '有天地然后万物生焉。', source: '《序卦传》', topic: '宇宙秩序' },
  { text: '乾刚坤柔，比乐师忧。', source: '《杂卦传》', topic: '卦义对比' },
]


// ─── 主组件 ───

export default function TenWingsPage() {
  usePageTitle()

  const [expandedWing, setExpandedWing] = useState<string | null>(null)
  const [expandedOverview, setExpandedOverview] = useState<string | null>(null)
  const [expandedQuote, setExpandedQuote] = useState<number | null>(null)
  const [expandedMethod, setExpandedMethod] = useState<string | null>(null)

  // ─── 分类分组 ───
  const categories = [
    { key: '卦爻辞', label: '📜 卦爻辞解读', items: wings.filter(w => w.category === '卦爻辞') },
    { key: '通论', label: '📖 哲学通论', items: wings.filter(w => w.category === '通论') },
    { key: '八卦', label: '🔢 八卦专论', items: wings.filter(w => w.category === '八卦') },
    { key: '杂论', label: '🧩 杂论对比', items: wings.filter(w => w.category === '杂论') },
  ]

  return (
    <>
      <PageHeader
        title="十翼 — 读懂《易经》的翅膀"
        subtitle="《周易》经文深奥难懂？十翼就是古人给你配的说明书。没有十翼，易经只是占卜书；有了十翼，才成为哲学经典。"
      />

      {/* ═══ 0. 十翼全景总览卡片 ═══ */}
      <section className={`${cardBase} p-5 md:p-6 mb-5`}>
        <h3 className="text-base font-bold text-[var(--fg)] mb-4">🪽 十翼全景</h3>
        <p className="text-xs text-[var(--muted)] mb-4">
          十翼七种十篇，覆盖卦爻辞解读、哲学通论、八卦取象、顺序逻辑四大层面。点击展开查看各翼领域和作用。
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {wings.map(wing => (
            <button
              key={wing.id}
              onClick={() => setExpandedWing(expandedWing === wing.id ? null : wing.id)}
              className={`
                flex flex-col items-center gap-1.5 p-3 rounded-xl border cursor-pointer transition-all duration-200
                ${expandedWing === wing.id
                  ? 'bg-[var(--accent)]/10 border-[var(--accent)] ring-1 ring-[var(--accent)]'
                  : 'bg-[var(--bg3)]/50 border-[var(--border)] hover:border-[var(--accent)] hover:bg-[var(--glow)]'
                }
              `}
            >
              <span className="text-xl">{wing.symbol}</span>
              <span className="text-[11px] font-semibold text-[var(--fg)] text-center leading-tight">{wing.name}</span>
              <span className="text-[9px] text-[var(--muted)] text-center">{wing.brief.slice(0, 16)}</span>
            </button>
          ))}
        </div>
      </section>

      {/* ═══ 1. 十翼概述 ═══ */}
      <section className={`${cardBase} p-5 md:p-6 mb-5`}>
        <h3 className="text-base font-bold text-[var(--fg)] mb-4">📚 认识十翼</h3>
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
                    {expandedOverview === item.title ? item.content : item.content.slice(0, 60) + '…'}
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

      {/* ═══ 2. 十翼详解（分类浏览） ═══ */}
      <h3 className="text-lg font-bold text-[var(--fg)] mb-4">🔍 逐翼详解</h3>

      {categories.map(cat => (
        <div key={cat.key} className="mb-5">
          <h4 className="text-sm font-semibold text-[var(--accent2)] mb-3 px-1">{cat.label}</h4>
          <div className="space-y-3">
            {cat.items.map(wing => {
              const isExpanded = expandedWing === wing.id
              return (
                <section key={wing.id} className={`${cardBase} overflow-hidden transition-all duration-300`}>
                  {/* 折叠头 */}
                  <button
                    onClick={() => setExpandedWing(isExpanded ? null : wing.id)}
                    className="w-full flex items-center gap-3 p-4 md:p-5 cursor-pointer hover:bg-[var(--glow)] transition-colors text-left"
                  >
                    <span className="text-xl shrink-0">{wing.symbol}</span>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-bold text-[var(--fg)]">
                        <RubyText text={wing.name} />
                        {wing.altName && <span className="text-[var(--muted)] font-normal ml-1">/ {wing.altName}</span>}
                      </h3>
                      <p className="text-[11px] text-[var(--muted)] mt-0.5">{wing.brief}</p>
                    </div>
                    <span className={`text-[var(--muted)] text-xs transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`}>▼</span>
                  </button>

                  {/* 折叠内容 */}
                  {isExpanded && (
                    <div className="px-4 md:px-5 pb-5 animate-[fadeSlideIn_0.25s_ease-out]">
                      <div className="border-t border-[var(--border)] pt-4 space-y-4">
                        {/* 详细说明 */}
                        <p className="text-xs text-[var(--fg)]/80 leading-relaxed">{wing.detail}</p>

                        {/* 结构说明 */}
                        <div className="bg-[var(--bg3)]/50 rounded-lg px-3 py-2">
                          <span className="text-[10px] text-[var(--muted)] font-semibold">📐 结构：</span>
                          <span className="text-xs text-[var(--fg)]/70">{wing.structure}</span>
                        </div>

                        {/* 经典引文 */}
                        <div>
                          <h4 className="text-xs font-semibold text-[var(--fg)] mb-2">✨ 经典引文</h4>
                          <div className="space-y-2">
                            {wing.highlights.map((h, i) => (
                              <div
                                key={i}
                                onClick={() => setExpandedQuote(expandedQuote === i ? null : i)}
                                className="bg-[var(--bg3)]/50 rounded-lg px-3 py-2.5 cursor-pointer hover:bg-[var(--glow)] transition-colors"
                              >
                                <div className="flex items-start gap-2">
                                  <span className="text-[11px] text-[var(--accent)] font-mono font-bold shrink-0 mt-0.5">{h.label}</span>
                                  <div className="min-w-0 flex-1">
                                    <p className="text-xs text-[var(--fg)] leading-relaxed font-mono">&ldquo;{h.quote}&rdquo;</p>
                                    <span className="text-[10px] text-[var(--muted)]">—— {h.source}</span>
                                  </div>
                                  <span className={`text-[10px] text-[var(--muted)] transition-transform duration-200 ${expandedQuote === i ? 'rotate-180' : ''}`}>▼</span>
                                </div>
                                {expandedQuote === i && (
                                  <div className="mt-2 pt-2 border-t border-[var(--border)] animate-[fadeSlideIn_0.2s_ease-out]">
                                    <p className="text-[11px] text-[var(--fg)]/80 leading-relaxed">
                                      <span className="text-[var(--accent)] font-semibold">💡 解读：</span>
                                      {h.modern}
                                    </p>
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </section>
              )
            })}
          </div>
        </div>
      ))}

      {/* ═══ 3. 十翼解读方法论 ═══ */}
      <section className={`${cardBase} p-5 md:p-6 mb-5`}>
        <h3 className="text-base font-bold text-[var(--fg)] mb-4">🧭 如何用十翼学易？</h3>

        {[
          { title: '先读《系辞》打底', icon: '🥇', content: '不建议从《彖传》《象传》逐卦读起——那样容易陷进细节、失去全局。建议先读《系辞传》上下篇，因为它是十翼的总纲。读完《系辞》，你就知道《易经》在讲什么、怎么讲、为什么重要。有了这个"好球带"，再读其他具体篇章就胸有成竹了。' },
          { title: '配合《说卦》查字典', icon: '🗂️', content: '读到"天行健"——为什么乾代表天和健？查《说卦传》。读到"云雷屯"——为什么屯卦是云雷之象？还是查《说卦传》。《说卦传》就是八卦的"字典"和"百科全书"，读易遇疑随手翻。' },
          { title: '按卦查阅《彖》《象》', icon: '🔍', content: '读某一卦时，先看卦爻辞——再看《彖传》解释卦辞——再看《象传》的大象（卦象）和小象（爻象）。三步之后，这个卦的前世今生就基本清楚了。这相当于"精读"式学习，一卦一卦过。' },
          { title: '用《序卦》《杂卦》串连', icon: '🔗', content: '学完几个卦后，回头读《序卦传》看它们为什么连在一起——会发现卦与卦之间的逻辑链条。再用《杂卦传》做两两对比——同一概念在不同卦中的表现差异一目了然。这是"粗读"和"对比"的横向学习。' },
          { title: '精读《文言》了解乾', icon: '✍️', content: '乾卦是《易经》门户。把乾卦六爻和《文言传》结合起来精读，相当于学透了"如何当领导、如何做人、如何自处"的整套哲学。读通了乾，其他卦学起来就会快很多。' },
          { title: '十翼之间的"矛盾"', icon: '⚖️', content: '十翼各篇成书年代不同、作者不同，难免有视角差异。比如对同一卦的吉凶判断，《彖传》可能从"位"的角度分析，《象传》可能从"象"的角度解释——说法可能不完全一致。这不是问题，恰恰是经典的深度所在——多视角就多维度，不同解读可以共存。' },
        ].map((method, i) => (
          <div
            key={i}
            onClick={() => setExpandedMethod(expandedMethod === method.title ? null : method.title)}
            className="bg-[var(--bg3)]/50 rounded-xl p-4 mb-2.5 cursor-pointer transition-all duration-200 hover:bg-[var(--glow)]"
          >
            <div className="flex items-center gap-2">
              <span className="text-base">{method.icon}</span>
              <h4 className="text-sm font-bold text-[var(--fg)] flex-1">{method.title}</h4>
              <span className={`text-[10px] text-[var(--muted)] transition-transform duration-200 ${expandedMethod === method.title ? 'rotate-180' : ''}`}>▼</span>
            </div>
            {expandedMethod === method.title && (
              <p className="mt-2 text-xs text-[var(--fg)]/80 leading-relaxed animate-[fadeSlideIn_0.2s_ease-out]">{method.content}</p>
            )}
          </div>
        ))}
      </section>

      {/* ═══ 4. 十翼名句集锦 ═══ */}
      <section className={`${cardBase} p-5 md:p-6`}>
        <h3 className="text-base font-bold text-[var(--fg)] mb-4">📝 十翼名句集锦</h3>
        <p className="text-xs text-[var(--muted)] mb-4">十翼中的名句，早已融入中华文化的基因。看看你认识几句？</p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {famousQuotes.map((q, i) => (
            <div
              key={i}
              className="bg-[var(--bg3)]/50 rounded-lg px-3 py-2.5 hover:bg-[var(--glow)] transition-colors cursor-default"
            >
              <p className="text-xs text-[var(--fg)] leading-relaxed font-mono">&ldquo;{q.text}&rdquo;</p>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-[10px] text-[var(--muted)]">—— {q.source}</span>
                <span className="ml-auto text-[9px] px-1.5 py-0.5 rounded-full bg-[var(--accent)]/10 text-[var(--accent2)]">{q.topic}</span>
              </div>
            </div>
          ))}
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
