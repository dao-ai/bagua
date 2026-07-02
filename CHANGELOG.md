# 更新日志

## [0.6.0] - 2026-07-02

### 新增
- 🧪 **测试体系** — Vitest + React Testing Library，179 单元测试，核心数据层全覆盖
  - 八卦工具函数（`findBaguaByYao`、`buildYao6`、`computeHexagramChange` 等）27 测试
  - 互卦/错卦/综卦关系 7 测试
  - 六爻排盘（`computeLiuyao`）105 测试，含全部 64 卦完整性验证
  - 本命卦推算（`calculateLifeGua`）30 测试，含寄宫/边界/已知值
  - 组件 smoke test（Modal、PageHeader、Providers）7 测试
- 🔊 **易经与现代语言** — `/yijing-language`，200+ 条易经衍生词汇/成语，分类浏览、搜索、出处追踪
- 🚀 **CI/CD** — GitHub Actions：push/PR 自动 lint → test → build → deploy

### 重构
- 📦 **共享工具函数提取** — `findBaguaByYao`、`buildYao6`、`yao6ToTrigramIds`、`computeHexagramChange` 等集中到 `src/data/bagua.ts`
- 🔑 **Key 格式统一** — 全部六十四卦 key 统一为 `"upperId-lowerId"` 格式
- 🎨 **主题系统** — 颜色定义从 JS 迁移到 CSS `:root` / `:root.classic`，消除重复，增加 FOUC 防止脚本
- 🎬 **动画合并** — `fadeSlideIn`/`fadeIn` 重复定义统一到 `globals.css`
- 📄 **页面拆分** — 6 个超大页面缩减 29-52%
  - `divine`: 440→271，提取 `DivineResult` 组件
  - `lifegua`: 440→249，提取 `LifeGuaResult` 组件
  - `meihua`: 679→477，提取数据到 `src/data/meihua.ts`
  - `solar-terms`: 603→433，提取数据到 `src/data/solarTerms.ts`
  - `hetu-luoshu`: 547→331，提取 SVG 到 `HetuLuoshuSVGs.tsx`
  - `yijing-computer`: 534→254，提取 SVG 到 `YiComputerSVGs.tsx`
  - `yao-positions`: 741→598，提取数据到 `src/data/yaoPositions.ts`
- 🧹 **代码清理** — 零 `any` 类型、零未使用 import、`cardBase` 共享常量

### 改进
- ♿ **无障碍** — Modal 焦点锁定+Escape 关闭+`aria-modal`+`aria-label`，`<div onClick>`→`<button>`
- ⚡ **性能** — YarrowDivination、FuxiCircle/Square、FlyingStars、ShareCard 懒加载+骨架屏
- 🔧 **工程化** — ESLint 配置（`eslint-config-next`）、`npm run lint` / `npm test` 命令
- 📄 **404 页面** + **Error Boundary** — 否卦主题 404，大过卦 fallback UI
- 🐛 **数据修复** — PALACE_HEXAGRAMS 坤宫一世/二世/三世上下卦顺序错误修复

## [0.5.0] - 2026-06-28

### 新增
- 🌿 **卦象与节气历法** — `/solar-terms`，八卦配二十四节气完整交互页
  - 先天八卦配八节（二分二至+四立），点击翻转看后天八卦对照
  - 十二辟卦（十二消息卦）完整时间轴：复→临→泰→大壮→夬→乾→姤→遁→否→观→剥→坤
    - 互动点击展开详情，阴阳爻计数器
    - 阴阳消长渐变指示条（从纯阴到纯阳再到纯阴）
  - 后天八卦配八节详表（含二十四山向对应）
  - 二十四节气完整表格，按春夏秋冬分组，标注卦象/辟卦/黄经/节与气
  - 天人合一哲学内涵（时空一体·物极必反·顺势而为·天人相应）
  - 经典引文（孟喜卦气图说）+ 今日卦象实时解读

## [0.4.1] - 2026-06-28

### 新增

### 新增
- 📱 **PWA 离线支持** — 安装到手机桌面，断网也能翻卦
  - `manifest.json`：Web App Manifest（display: standalone + 快捷方式）
  - `sw.js`：Service Worker（预缓存所有页面 + 静态资源缓存优先）
  - 太极图标包：192/512 PNG、SVG、apple-touch-icon、favicon
  - meta：theme-color、viewport、apple-mobile-web-app 等
  - `InstallPrompt.tsx`：📲 安装到桌面按钮（监听 beforeinstallprompt + 4s fallback）
- 🌸 **梅花易数入门** — `/meihua`，邵雍万物皆数体系交互学习页
  - 5 种起卦法详解：年月日时/数字/声音/文字/方位
  - 体用生克核心原理 + 五行生克速查表
  - 🧮 互动数字起卦计算器
  - 八卦先天数对应表（含拼音）
  - 7 步解卦流程 + 10 句经典名句

### 修复
- PWA manifest/icons/SW 路径修复：部署于子路径时 `BASE_PATH` 手动拼接
- SW 缓存版本升级 v2，新增 `/meihua` 预缓存

## [0.4.0] - 2026-06-27

### 新增
- 📜 **河图洛书专题页** — `/hetu-luoshu`，含河图/洛书 SVG 图示、五方生成数详解、九宫八卦对应、经典引文、历史源流时间轴
- 🎲 **九宫飞星沙盘** — `/flying-stars`，交互式洛书九宫飞星推演工具：年/月飞星切换、飞星路径动画、宫位点击详解、九星速查
- 🧩 **十翼专题页** — `/ten-wings`，逐翼详解+名句集锦+学习方法论

### 改进
- 导航栏新增 visibleTabs 条目（九宫飞星直接显示在导航栏）

## [0.3.0] - 2026-06-21

### 新增
- 🌀 Logo 更换为太极符号（阴阳生于太极）
- 📑 导航栏重构：核心4项（首页·八卦·64卦·起卦）+「更多 ▼」下拉菜单兜底其余8项
- 🗂️ 移动端汉堡菜单分三组：📖学习 / 🔧工具 / 📊探索，带分隔线和组标题
- 🎬 汉堡菜单展开/收起微动效（`origin-top` + `scaleY`）

### 改进
- logo、标签 "日签" → "首页"，"历史" → "占卜记录"
- 移动端 header 垂直间距缩小（`py-3`，桌面端保持 `py-6`）
- 非 active 导航标签 hover 增加 `var(--glow)` 背景反馈
- "更多"下拉点击外部自动关闭
- 当子页面在"更多"下拉内时，"更多"按钮自动高亮

## [0.2.2] - 2026-06-21

### 新增
- 🎯 **本命卦生成器** — `/lifegua`，根据生辰生成本命卦
- 🔄 **互卦·错卦·综卦展示** — 起卦结果 & 64 卦详情页联动展示
- 🎲 **变爻模拟器** — 独立页面 `/simulator`，选卦→点爻→变卦动画
- 📇 **闪卡复习模式** — 独立页面 `/flashcard`，八卦/64 卦两种模式
- ☯️ **先天后天对照** — 独立页面 `/contrast`
- ⚖️ **双卦对比工具** — 独立页面 `/compare`
- 🤖 **AI 解卦助手** — 独立页面 `/ai-reading`，选卦调 DeepSeek AI 解读

### 改进
- 384 条爻辞完整数据（原文 + 白话解释）
- 金钱起卦法（交互式铜钱 SVG，洪武通宝样式）
- 注音切换功能（生僻字标注拼音）
- 64 卦现代释义重写（傅佩荣风格）
- 变爻动画全面修复：React 状态驱动，四步时序（闪烁→翻转→复原→完成）
- 卦象显示顺序修复（上卦在上、下卦在下）
- 主题切换 bug 修复（消除反馈循环）
- 起卦区与卦象区分离布局，扩大阅读区域
- 首页合并二进制表格视图
- 动爻改为点击触发动画（替代底部按钮）
- 底部反馈改用腾讯问卷（原 GitHub Issues），支持结构化反馈收集
- 接入 GoatCounter 访问统计

### 修复
- 64 卦列表缺少剥卦（原来只显示 63 卦）
- 变爻动画 keyframes 缺失
- 动态 classList 被 React re-render 覆盖
- 随机模式闪卡翻转不换卡
- 变爻模拟器卦名、爻线、高度对齐调整

### 数据
- 卦辞生僻字拼音库扩展
- 64 卦现代释义全部重写

## [0.2.1] - 2026-06-20

### 新增
- 接入 GoatCounter 访问统计
- 页面底部反馈入口（腾讯问卷）
- 本命卦生成器基础版本

### 改进
- 小美设计优化：64 卦卡片视觉层级、八卦页布局、字体、导航折叠
- 本命卦日期选择器：月默认1月、日默认11、时默认酉时、年默认1980
- 兼容旧版 localStorage 数据格式防报错

## [0.2.0] - 2026-06-19

### 新增
- README 增加 AI 构建说明（OpenClaw / DeepSeek / GLM 基建）

### 改进
- 桌面端导航标签水平排列，移动端汉堡菜单
- 暗色/古典双主题切换
- logo、样式优化

## [0.1.0] - 2026-06-18

### 初始版本
- 八卦学习首页
- 二进制对照
- 64 卦浏览
- 数字起卦
- 暗色/古典双主题
