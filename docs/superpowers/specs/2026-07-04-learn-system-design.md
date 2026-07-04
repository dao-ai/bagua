# 综合学习系统 — 八卦记忆与间隔复习

## 概述

新增 `/learn` 页面作为学习系统主入口，整合自由浏览、SM-2 间隔复习和闯关测验三种模式，覆盖八卦/六十四卦/爻辞/卦关系四类知识。本地存储学习进度，支持 JSON 导入导出。现有 `/flashcard` 保留并指向新系统。

## 技术方案

| 组件 | 选型 | 理由 |
|------|------|------|
| 存储 | localStorage | 项目无后端，跟占卜历史保持一致 |
| SRS 算法 | SM-2 (SuperMemo 2) | 简单、成熟、可解释，不需要机器学习 |
| 卡片数据 | 从 `src/data/` 现有静态数据派生 | 复用已有定义，避免数据不一致 |
| 路由 | `/learn` 单页面，Tab 切换模式 | 体验流畅，符合 SPA 风格 |

## 文件结构

```
src/app/learn/
├── page.tsx                  # 主页面，顶部模式导航
├── components/
│   ├── LearnTabs.tsx         # 浏览/复习/测验 三个标签切换
│   ├── BrowsePanel.tsx       # 自由浏览模式
│   ├── ReviewPanel.tsx       # SRS 间隔复习（复用闪卡翻转逻辑）
│   ├── QuizPanel.tsx         # 闯关测验模式
│   ├── StatsDashboard.tsx    # 学习统计面板（可折叠）
│   └── CardFace.tsx          # 通用卡片正反面组件
├── hooks/
│   └── useLearning.ts        # 核心 Hook：SRS 算法、进度、存储
├── data/
│   └── decks.ts              # 预置卡片组（八卦/六十四卦/爻辞/卦关系）
├── types.ts                  # 学习相关类型定义
├── srs.ts                    # SM-2 算法纯函数
└── storage.ts                # localStorage 读写 + 导入导出
```

## 数据模型

```ts
interface Card {
  id: string           // "hex:1" | "trigram:qian" | "yao:1-1" | "rel:1-cuo"
  type: CardType       // 'trigram' | 'hexagram' | 'yao' | 'relation'
  front: string        // 问题面（卦象/符号）
  back: string         // 答案面（卦名/卦辞/爻辞等）
  ease: number         // 记忆因子，默认 2.5，最小 1.3
  interval: number     // 当前复习间隔（天）
  repetitions: number  // 连续正确次数
  nextReview: string   // 下次复习日期 ISO
  lastReview: string | null
  learned: boolean     // 是否已至少浏览过一次
  createdAt: string    // 卡片创建日期
}

type CardType = 'trigram' | 'hexagram' | 'yao' | 'relation'
```

### 四组卡片

| 类型 | 数量 | 正面 | 背面 |
|------|------|------|------|
| 八卦 | 8 | 卦象符号 + 卦序 | 卦名、属性（自然、方位、五行等） |
| 六十四卦 | 64 | 上下卦组合 ⚊⚋ | 卦名、卦辞、意义 |
| 爻辞 | 384 | 某卦某爻位置（如"乾卦初九"） | 爻辞原文 |
| 卦关系 | ~192 | 某卦名（问"错卦/综卦/互卦是谁"） | 关系目标卦名和卦象 |

### 存储格式

- 键名：`bagua-learning`
- 值：`{ version: 1, cards: Card[], stats: {...} }` 的 JSON 字符串
- 约 648 张卡片，预估 ~100KB，localStorage 无压力

## SM-2 间隔重复算法

在 `src/app/learn/srs.ts` 中实现纯函数：

```
输入: Card + 评分 q (0-5)
输出: 更新后的 Card（ease, interval, repetitions, nextReview）

评分含义:
  0 — 完全想不起来
  1 — 看到答案后能确认（模糊）
  2 — 想起来了但很困难
  3 — 想起来了，有点犹豫
  4 — 轻松想起
  5 — 毫不费力

公式:
  if q < 2:  interval=1, repetitions=0
  if q < 4:  interval=1+repetitions*2, repetitions+=1
  if q >=4:  repetitions+=1
             if repetitions==1: interval=1
             if repetitions==2: interval=6
             if repetitions>=3: interval=round(prevInterval * ease)
  
  ease += (0.1 - (4-q) * (0.08 + (4-q) * 0.02))
  ease = max(1.3, ease)
  
  nextReview = today + interval 天
```

## 三种学习模式

### 浏览模式（BrowsePanel）

- 左侧：分类筛选（八卦/六十四卦/爻辞/关系）+ 每类进度条
- 右侧：卡片翻转（点击翻面，复用现有闪卡翻转动画）
- 搜索过滤：输入关键词快速定位卦名
- 每张卡片显示记忆状态标签：新卡片 / 待复习 / 已掌握
- 可手动标记"需要复习"

### 复习模式（ReviewPanel）

- 自动加载当天到期（`nextReview <= today`）的卡片
- 一次展示一张，用户翻面后评估记忆质量
- 底部 0-5 评分按钮，对应 SM-2 质量分
- 顶部显示本轮进度（已完成 / 总到期数）
- 评分后自动切下一张
- 到期卡片为 0 时显示"今日任务完成"空状态
- 复习时优先展示最久未复习的卡片

### 测验模式（QuizPanel）

- 闯关结构：八卦关 → 六十四卦关（可分段 8 卦一段）→ 爻辞关 → 关系关
- 每关选择题 4 选 1，从对应卡片组随机出题
- 干扰项从同类卡片中选取（如八卦题干扰项来自其他 7 卦）
- 每关连续答对 N 题（八卦关 N=8，六十四卦关 N=20 可配置）即过关
- 答错的题自动加入复习队列（设置 `nextReview=today`）
- 过关后展示成绩和用时
- 全部通关后有总览页 + 鼓励语
- 支持重刷已通过的关卡

## 卡片数据生成（decks.ts）

`decks.ts` 负责从 `src/data/` 现有数据生成所有卡片，不使用硬编码字符串避免数据不一致：

- **八卦卡片**：遍历 `bagua.ts` 的 8 个 `Bagua` 对象，正面对卦象符号和卦序，背面为 name/自然/方位/五行等属性
- **六十四卦卡片**：遍历 `hexagrams.ts` 的 64 个 `HexagramDetail`，正面为卦象组合（取上下卦符号），背面为卦名 + 卦辞 + 意义
- **爻辞卡片**：遍历 `yao_lines.ts` 的 384 条爻辞，正面为"X卦 + 爻位（初九/六二等）"，背面为爻辞原文
- **卦关系卡片**：遍历所有卦，对每个卦生成 3 张卡片（错卦/综卦/互卦），背面为对应关系卦的名称和卦象

所有卡片在首次加载时一次性生成（纯计算，无需缓存），运行时只做 SRS 状态更新。

## 共享组件提取（CardFace.tsx）

`CardFace.tsx` 从现有 `/flashcard` 页面中提取卡片翻转动画逻辑，成为 `src/components/CardFace.tsx` 的共享组件，供 `/flashcard` 和 `/learn` 双方引用。提取时保持现有翻转动画（CSS 3D transform）不变，仅抽象 props 接口：

```ts
interface CardFaceProps {
  front: ReactNode
  back: ReactNode
  flipped: boolean
  onFlip: () => void
  status?: 'new' | 'review' | 'mastered'  // 新增，用于记忆状态标签
}
```

## 与现有闪卡页面关系

- `/flashcard` 保留原样，顶部增加一条提示链接指向 `/learn`
- `ReviewPanel` 引入 `/flashcard` 中的卡片翻转动画组件（提取为共享组件 `CardFace.tsx`）
- 现有闪卡数据不变，不做破坏性改动

## 统计面板（StatsDashboard）

页面底部可折叠面板，展示：

- 总进度：已学卡片数 / 总卡片数 + 百分比
- 今日复习：已完成 / 到期数
- 连续学习天数（streak），基于 localStorage 记录的日期
- 各分类掌握比例（柱状图或进度条）
- 总复习次数
- 最近学习时间

## 导入导出

- 导出：下载 `bagua-learning-<date>.json`，包含完整卡片数组和元数据
- 导入：上传 JSON → 格式校验 → 合并（已存在卡片取 max 值，新卡片直接添加）
- 导入前提示用户当前进度将被合并（不是覆盖）
- 版本号校验，不兼容版本给出提示

## 边界情况处理

| 场景 | 处理 |
|------|------|
| 首次使用 | 全部卡片未初始化，引导用户先去浏览模式 |
| 零到期卡片 | 复习模式显示"今日任务完成" + 建议去浏览新卡片 |
| 全部通关 | 测验模式展示总成绩，支持重刷 |
| localStorage 数据损坏 | JSON 解析失败时降级为空状态，不清空原数据 |
| 存储满 | 648 张卡片约 100KB，无风险；导入导出备份即可 |
| SSR（Next.js） | `/learn` 页面标记 `'use client'`，所有组件客户端渲染 |
