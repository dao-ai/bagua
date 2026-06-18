// 八卦数据
const baguaData = [
  {
    id: 'qian',
    name: '乾',
    pinyin: 'qián',
    symbol: '☰',
    yao: [1, 1, 1], // 下、中、上（1=阳 0=阴）
    decimal: 7,
    binary: '111',
    keywords: ['健', '天', '君'],
    nature: '天',
    animal: '马',
    body: '首',
    family: '父',
    direction: '西北',
    season: '秋冬之交',
    attribute: '刚健',
    description: '纯阳之体，健行不息。天行健，君子以自强不息。',
    short: '天行健，自强不息',
  },
  {
    id: 'kun',
    name: '坤',
    pinyin: 'kūn',
    symbol: '☷',
    yao: [0, 0, 0],
    decimal: 0,
    binary: '000',
    keywords: ['顺', '地', '民'],
    nature: '地',
    animal: '牛',
    body: '腹',
    family: '母',
    direction: '西南',
    season: '夏秋之交',
    attribute: '柔顺',
    description: '纯阴之体，厚德载物。地势坤，君子以厚德载物。',
    short: '地势坤，厚德载物',
  },
  {
    id: 'zhen',
    name: '震',
    pinyin: 'zhèn',
    symbol: '☳',
    yao: [1, 0, 0],
    decimal: 4,
    binary: '100',
    keywords: ['动', '雷', '长子'],
    nature: '雷',
    animal: '龙',
    body: '足',
    family: '长男',
    direction: '东',
    season: '春',
    attribute: '发动',
    description: '一阳在下，奋起向上。如春雷惊蛰，万物复苏。',
    short: '一阳奋起，春雷惊蛰',
  },
  {
    id: 'xun',
    name: '巽',
    pinyin: 'xùn',
    symbol: '☴',
    yao: [0, 1, 1],
    decimal: 3,
    binary: '011',
    keywords: ['入', '风', '长女'],
    nature: '风',
    animal: '鸡',
    body: '股',
    family: '长女',
    direction: '东南',
    season: '春夏之交',
    attribute: '渗透',
    description: '一阴在下，风行草偃。风无孔不入，顺势而行。',
    short: '风行草偃，无孔不入',
  },
  {
    id: 'kan',
    name: '坎',
    pinyin: 'kǎn',
    symbol: '☵',
    yao: [0, 1, 0],
    decimal: 2,
    binary: '010',
    keywords: ['陷', '水', '中男'],
    nature: '水',
    animal: '豕',
    body: '耳',
    family: '中男',
    direction: '北',
    season: '冬',
    attribute: '险陷',
    description: '阳陷阴中，外柔内刚。水虽险，亦能润物。',
    short: '外柔内刚，险中求进',
  },
  {
    id: 'li',
    name: '离',
    pinyin: 'lí',
    symbol: '☲',
    yao: [1, 0, 1],
    decimal: 5,
    binary: '101',
    keywords: ['附', '火', '中女'],
    nature: '火',
    animal: '雉',
    body: '目',
    family: '中女',
    direction: '南',
    season: '夏',
    attribute: '附丽',
    description: '阴附阳中，外明内虚。火借物而燃，明照四方。',
    short: '外明内虚，附丽而明',
  },
  {
    id: 'gen',
    name: '艮',
    pinyin: 'gèn',
    symbol: '☶',
    yao: [0, 0, 1],
    decimal: 1,
    binary: '001',
    keywords: ['止', '山', '少男'],
    nature: '山',
    animal: '狗',
    body: '手',
    family: '少男',
    direction: '东北',
    season: '冬春之交',
    attribute: '静止',
    description: '一阳在上，如山耸立。知止而后有定，艮之义也。',
    short: '如山耸立，知止有定',
  },
  {
    id: 'dui',
    name: '兑',
    pinyin: 'duì',
    symbol: '☱',
    yao: [1, 1, 0],
    decimal: 6,
    binary: '110',
    keywords: ['悦', '泽', '少女'],
    nature: '泽',
    animal: '羊',
    body: '口',
    family: '少女',
    direction: '西',
    season: '秋',
    attribute: '喜悦',
    description: '一阴在上，如湖泽映天。沟通交流，以悦待物。',
    short: '湖泽映天，以悦待物',
  },
];

// 先天八卦数映射（数字法起卦用）
const numToBagua = {
  1: 'qian',
  2: 'dui',
  3: 'li',
  4: 'zhen',
  5: 'xun',
  6: 'kan',
  7: 'gen',
  0: 'kun',
};

// 六十四卦简表（本卦名 → 变卦名）
// 格式：上卦index + 下卦index → 卦名
// 乾0 兑1 离2 震3 巽4 坎5 艮6 坤7
const hexagramNames = [
  //   乾   兑   离   震   巽   坎   艮   坤  ← 上卦
  [ '乾', '夬', '大有','大壮','小畜','需', '大畜','泰' ],  // 乾下
  [ '履', '兑', '睽', '归妹','中孚','节', '损', '临' ],   // 兑下
  [ '同人','革', '离', '丰', '家人','既济','贲', '明夷' ], // 离下
  [ '无妄','随', '噬嗑','震', '益', '屯', '颐', '复' ],    // 震下
  [ '姤', '大过','鼎', '恒', '巽', '井', '蛊', '升' ],     // 巽下
  [ '讼', '困', '未济','解', '涣', '坎', '蒙', '师' ],     // 坎下
  [ '遁', '咸', '旅', '小过','渐', '蹇', '艮', '谦' ],     // 艮下
  [ '否', '萃', '晋', '豫', '观', '比', '剥', '坤' ],      // 坤下
];

// 上卦/下卦的索引：根据卦id获取索引
const baguaIndex = {
  qian: 0, dui: 1, li: 2, zhen: 3,
  xun: 4, kan: 5, gen: 6, kun: 7,
};

function getHexagramName(upperId, lowerId) {
  const ui = baguaIndex[upperId];
  const li = baguaIndex[lowerId];
  return hexagramNames[li][ui];
}

function getHexagramSymbol(upperId, lowerId) {
  // 返回六爻符号数组 [上卦上,上卦中,上卦下, 下卦上,下卦中,下卦下]
  const upper = baguaData.find(b => b.id === upperId);
  const lower = baguaData.find(b => b.id === lowerId);
  return [...upper.yao.slice().reverse(), ...lower.yao.slice().reverse()];
}
