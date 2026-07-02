// ═══════════════════════════════════════
//  易经与现代语言 — 词汇数据
// ═══════════════════════════════════════

export interface WordEntry {
  word: string
  source: string
  original: string
  modern: string
  category: string
}

export const categories = [
  { id: 'everyday', label: '📌 日常用词', emoji: '📌' },
  { id: 'gua-yao', label: '☰ 卦辞爻辞', emoji: '☰' },
  { id: 'tuan-xiang', label: '📜 彖传象传', emoji: '📜' },
  { id: 'xici', label: '📖 系辞传', emoji: '📖' },
  { id: 'derived', label: '🌿 后世化用', emoji: '🌿' },
  { id: 'academic', label: '🔬 学术概念', emoji: '🔬' },
] as const

export const categoryEmoji: Record<string, string> = Object.fromEntries(
  categories.map(c => [c.id, c.emoji])
)

export const allWords: WordEntry[] = [
  // ── 日常用词 ──
  { word: '乾坤', source: '乾卦、坤卦', original: '天与地', modern: '大局、一把手、宇宙', category: 'everyday' },
  { word: '变卦', source: '卦象可变', original: '卦的变化', modern: '改变主意（极高频）', category: 'everyday' },
  { word: '八卦', source: '八经卦本身', original: '八种基本卦象', modern: '闲聊、打听隐私', category: 'everyday' },
  { word: '阴阳', source: '易学根基', original: '两种基本力量', modern: '对立统一、男女、正反', category: 'everyday' },
  { word: '太极', source: '「易有太极」', original: '混沌元气', modern: '大智慧、开端、推手', category: 'everyday' },
  { word: '消息', source: '消=阴长阳消，息=阳长阴息', original: '阴阳消长过程', modern: '新闻资讯', category: 'everyday' },
  { word: '错综复杂', source: '错卦、综卦、交互卦', original: '卦象间变化关系', modern: '复杂混乱', category: 'everyday' },
  { word: '未济', source: '未济卦', original: '火在水上，事未成', modern: '尚未完成的事', category: 'everyday' },
  { word: '既济', source: '既济卦', original: '水在火上，事已成', modern: '已完成的事', category: 'everyday' },
  { word: '谦卑', source: '谦卦', original: '谦虚卑下', modern: '谦虚', category: 'everyday' },
  { word: '中正', source: '中位+当位', original: '二五爻位得中得正', modern: '公平正直', category: 'everyday' },
  { word: '形而上学', source: '《系辞》', original: '"形而上者谓之道"', modern: '哲学、不切实际', category: 'everyday' },
  { word: '九五之尊', source: '乾卦九五爻', original: '飞龙在天', modern: '皇帝、最高地位', category: 'everyday' },

  // ── 出自卦辞/爻辞 ──
  { word: '群龙无首', source: '乾卦用九', original: '见群龙无首，吉', modern: '没有领头人、一盘散沙', category: 'gua-yao' },
  { word: '亢龙有悔', source: '乾卦上九', original: '亢龙有悔', modern: '盛极而衰，有悔恨', category: 'gua-yao' },
  { word: '潜龙勿用', source: '乾卦初九', original: '潜龙勿用', modern: '时机未到，宜潜伏', category: 'gua-yao' },
  { word: '见龙在田', source: '乾卦九二', original: '见龙在田，利见大人', modern: '才华初显', category: 'gua-yao' },
  { word: '飞龙在天', source: '乾卦九五', original: '飞龙在天，利见大人', modern: '达到顶峰', category: 'gua-yao' },
  { word: '履霜坚冰至', source: '坤卦初六', original: '履霜，坚冰至', modern: '见微知著，防微杜渐', category: 'gua-yao' },
  { word: '密云不雨', source: '小畜卦', original: '密云不雨，自我西郊', modern: '事情酝酿未成', category: 'gua-yao' },
  { word: '夫妻反目', source: '小畜九三', original: '夫妻反目，不能正室', modern: '夫妻不和', category: 'gua-yao' },
  { word: '谦谦君子', source: '谦卦', original: '谦谦君子，卑以自牧也', modern: '非常谦虚的人', category: 'gua-yao' },
  { word: '不速之客', source: '需卦', original: '有不速之客三人来', modern: '不请自来的客人', category: 'gua-yao' },
  { word: '虎视眈眈', source: '颐卦', original: '虎视眈眈，其欲逐逐', modern: '贪婪凶狠地盯着', category: 'gua-yao' },
  { word: '突如其来', source: '离卦九四', original: '突如其来如，焚如，死如，弃如', modern: '突然发生', category: 'gua-yao' },
  { word: '无妄之灾', source: '无妄卦', original: '无妄之灾，或系之牛', modern: '平白无故的灾祸', category: 'gua-yao' },
  { word: '匪夷所思', source: '涣卦', original: '涣有丘，匪夷所思', modern: '超乎常人想象', category: 'gua-yao' },
  { word: '枯杨生华', source: '大过卦', original: '枯杨生华，何可久也', modern: '短暂的回光返照', category: 'gua-yao' },
  { word: '硕果不食', source: '剥卦上九', original: '硕果不食，君子得舆', modern: '成果未被享用', category: 'gua-yao' },
  { word: '介于石', source: '豫卦六二', original: '介于石，不终日，贞吉', modern: '坚如磐石', category: 'gua-yao' },
  { word: '龙战于野', source: '坤卦上六', original: '龙战于野，其血玄黄', modern: '激烈争斗', category: 'gua-yao' },

  // ── 彖传象传 ──
  { word: '自强不息', source: '乾卦《象传》', original: '天行健，君子以自强不息', modern: '自己努力向上，永不懈怠', category: 'tuan-xiang' },
  { word: '厚德载物', source: '坤卦《象传》', original: '地势坤，君子以厚德载物', modern: '以宽厚品德承载万物', category: 'tuan-xiang' },
  { word: '卑以自牧', source: '谦卦《象传》', original: '谦谦君子，卑以自牧也', modern: '以谦卑修养自身', category: 'tuan-xiang' },
  { word: '云行雨施', source: '乾卦《彖传》', original: '云行雨施，品物流形', modern: '自然界化育万物', category: 'tuan-xiang' },
  { word: '万物资始', source: '乾卦《彖传》', original: '大哉乾元，万物资始', modern: '万物由此开始', category: 'tuan-xiang' },
  { word: '保合太和', source: '乾卦《彖传》', original: '保合太和，乃利贞', modern: '保持和谐的最高状态', category: 'tuan-xiang' },
  { word: '思不出位', source: '艮卦《象传》', original: '君子以思不出其位', modern: '思考不超越本分', category: 'tuan-xiang' },
  { word: '时止则止', source: '艮卦《彖传》', original: '时止则止，时行则行，动静不失其时', modern: '该停就停，该动就动', category: 'tuan-xiang' },
  { word: '独立不惧', source: '大过《象传》', original: '君子以独立不惧', modern: '独立自主不畏惧', category: 'tuan-xiang' },
  { word: '遁世无闷', source: '大过《象传》', original: '遁世无闷', modern: '隐居不感到苦闷', category: 'tuan-xiang' },
  { word: '致命遂志', source: '困卦《象传》', original: '君子以致命遂志', modern: '牺牲生命以实现志向', category: 'tuan-xiang' },
  { word: '恐惧修省', source: '震卦《象传》', original: '君子以恐惧修省', modern: '因恐惧而修身反省', category: 'tuan-xiang' },
  { word: '惩忿窒欲', source: '损卦《象传》', original: '君子以惩忿窒欲', modern: '克制愤怒，抑制欲望', category: 'tuan-xiang' },
  { word: '见善则迁', source: '益卦《象传》', original: '君子以见善则迁，有过则改', modern: '看到好的就学习', category: 'tuan-xiang' },
  { word: '有过则改', source: '益卦《象传》', original: '同上', modern: '有错就改', category: 'tuan-xiang' },
  { word: '顺德积小', source: '升卦《象传》', original: '君子以顺德积小以高大', modern: '顺行美德，积累而大', category: 'tuan-xiang' },
  { word: '果行育德', source: '蒙卦《象传》', original: '君子以果行育德', modern: '果断行动培育品德', category: 'tuan-xiang' },
  { word: '作事谋始', source: '讼卦《象传》', original: '君子以作事谋始', modern: '做事一开始就要谋划', category: 'tuan-xiang' },
  { word: '师出以律', source: '师卦', original: '师出以律，否臧凶', modern: '军队出动要有纪律', category: 'tuan-xiang' },
  { word: '赦过宥罪', source: '解卦《象传》', original: '君子以赦过宥罪', modern: '赦免过错，宽恕罪行', category: 'tuan-xiang' },

  // ── 系辞传 ──
  { word: '穷则思变', source: '《系辞下》', original: '穷则变，变则通，通则久', modern: '走投无路时就设法改变', category: 'xici' },
  { word: '触类旁通', source: '《系辞上》', original: '引而伸之，触类而长之', modern: '举一反三', category: 'xici' },
  { word: '殊途同归', source: '《系辞下》', original: '天下同归而殊途，一致而百虑', modern: '途径不同，结局一样', category: 'xici' },
  { word: '一致百虑', source: '《系辞下》', original: '同一目标有多种考虑', modern: '同一目标，多种思考', category: 'xici' },
  { word: '见仁见智', source: '《系辞上》', original: '仁者见之谓之仁，知者见之谓之知', modern: '各人有各人的看法', category: 'xici' },
  { word: '物以类聚', source: '《系辞上》', original: '方以类聚，物以群分', modern: '同类聚集在一起', category: 'xici' },
  { word: '彰往察来', source: '《系辞上》', original: '神以知来，知以藏往', modern: '可以知晓未来与过去', category: 'xici' },
  { word: '乐天知命', source: '《系辞上》', original: '乐天知命故不忧', modern: '顺应天命，乐观豁达', category: 'xici' },
  { word: '安不忘危', source: '《系辞下》', original: '安而不忘危，存而不忘亡', modern: '平安时不忘记危险', category: 'xici' },
  { word: '洗心革面', source: '《系辞上》', original: '圣人以此洗心，退藏于密', modern: '彻底改过自新', category: 'xici' },
  { word: '顺天应人', source: '《系辞》', original: '顺乎天而应乎人', modern: '顺应天命人心', category: 'xici' },
  { word: '开物成务', source: '《系辞上》', original: '夫易开物成务，冒天下之道', modern: '通晓万物之理，成就事业', category: 'xici' },
  { word: '知几其神', source: '《系辞下》', original: '知几其神乎', modern: '预知事物微兆就是神妙', category: 'xici' },
  { word: '原始反终', source: '《系辞上》', original: '原始反终，故知死生之说', modern: '推究事物的开始和终结', category: 'xici' },
  { word: '精义入神', source: '《系辞下》', original: '精义入神，以致用也', modern: '精研义理达到神妙境界', category: 'xici' },
  { word: '穷神知化', source: '《系辞下》', original: '穷神知化，德之盛也', modern: '穷尽神妙，通达变化', category: 'xici' },
  { word: '变动不居', source: '《系辞下》', original: '变动不居，周流六虚', modern: '变化不停，不拘泥固定', category: 'xici' },
  { word: '唯变所适', source: '《系辞下》', original: '不可为典要，唯变所适', modern: '适应变化，不拘成法', category: 'xici' },
  { word: '日中则昃', source: '《系辞下》', original: '日中则昃，月盈则亏', modern: '盛极必衰', category: 'xici' },
  { word: '月盈则亏', source: '《系辞下》', original: '同上', modern: '满则损', category: 'xici' },
  { word: '尺蠖之屈', source: '《系辞下》', original: '尺蠖之屈，以求信也', modern: '以屈求伸', category: 'xici' },
  { word: '龙蛇之蛰', source: '《系辞下》', original: '龙蛇之蛰，以存身也', modern: '隐退以保存自己', category: 'xici' },
  { word: '言不尽意', source: '《系辞上》', original: '书不尽言，言不尽意', modern: '语言难以完全表达心意', category: 'xici' },
  { word: '立象尽意', source: '《系辞上》', original: '圣人立象以尽意', modern: '设立形象来表达概念', category: 'xici' },
  { word: '感而遂通', source: '《系辞上》', original: '寂然不动，感而遂通', modern: '感应而通达', category: 'xici' },
  { word: '退藏于密', source: '《系辞上》', original: '圣人以此洗心，退藏于密', modern: '退隐深藏', category: 'xici' },
  { word: '一阴一阳之谓道', source: '《系辞上》', original: '一阴一阳之谓道', modern: '阴阳交替即宇宙规律', category: 'xici' },
  { word: '二人同心其利断金', source: '《系辞上》', original: '二人同心，其利断金', modern: '团结力量大', category: 'xici' },
  { word: '穷理尽性', source: '《说卦传》', original: '穷理尽性以至于命', modern: '穷尽事物之理和人性', category: 'xici' },

  // ── 后世化用 ──
  { word: '七上八下', source: '易学数理', original: '七为少阳（阳上），八为少阴（阴下）', modern: '心里不踏实', category: 'derived' },
  { word: '否极泰来', source: '否卦+泰卦', original: '否尽泰来', modern: '坏到极点好就来了', category: 'derived' },
  { word: '剥极必复', source: '剥卦+复卦', original: '剥尽复来', modern: '衰极必兴', category: 'derived' },
  { word: '一阳来复', source: '复卦', original: '一阳生于五阴之下', modern: '希望重现', category: 'derived' },
  { word: '三阳开泰', source: '泰卦', original: '三阳在下为泰', modern: '新年吉祥（冬去春来）', category: 'derived' },
  { word: '物极必反', source: '易学核心原理', original: '极则反', modern: '事物到了极点就走向反面', category: 'derived' },
  { word: '阳极生阴', source: '易学核心原理', original: '阳极生阴，阴极生阳', modern: '盛极转衰，衰极转盛', category: 'derived' },
  { word: '阳奉阴违', source: '阴阳对偶引申', original: '阳在表面，阴在暗处', modern: '表面遵从，暗中违背', category: 'derived' },
  { word: '阴差阳错', source: '阴阳对偶引申', original: '阴阳错位', modern: '各种偶然凑在一起出岔子', category: 'derived' },
  { word: '刚柔并济', source: '易学概念', original: '刚柔相济', modern: '刚强和柔和互相配合', category: 'derived' },
  { word: '风水轮流转', source: '卦象循环', original: '卦象循环往复', modern: '时运交替变化', category: 'derived' },
  { word: '革故鼎新', source: '革卦+鼎卦', original: '革去故也，鼎取新也', modern: '除旧布新', category: 'derived' },

  // ── 学术概念 ──
  { word: '二进制', source: '八卦阴阳爻', original: '阴阳二爻=0和1', modern: '计算机底层编码（莱布尼茨受启发）', category: 'academic' },
  { word: '系统论', source: '六十四卦系统', original: '64个状态的编码系统', modern: '系统的整体性和层次性', category: 'academic' },
  { word: '遗传密码子', source: '64卦=64个密码子', original: '64个三联体密码', modern: '生物学的64个遗传密码', category: 'academic' },
  { word: '辩证法', source: '阴阳对立统一', original: '阴阳交替、相反相成', modern: '黑格尔受中国哲学间接影响', category: 'academic' },
  { word: '状态机', source: '卦的变化', original: '每个卦是一个状态，变爻=状态转移', modern: '计算机有限状态机', category: 'academic' },
  { word: '博弈论', source: '卦的制衡关系', original: '卦象间的生克制衡', modern: '策略互动分析', category: 'academic' },
]
