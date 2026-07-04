# 八卦项目 — shadcn/ui 重构 + React 质量审查 + 架构优化

## 概述

对八卦项目（静态导出 Next.js 16 + Tailwind v4）进行系统性 UI 重构与代码质量提升：
- 用 shadcn/ui 组件替换剩余自定义 UI
- 用 React 最佳实践审查组件质量
- 优化 layout.tsx 职责拆分

## 范围

| 阶段 | 内容 | 技能 |
|------|------|------|
| 1. 快速扫描 | 遍历所有非 shadcn 组件，列出可替换项 | `vercel:shadcn` |
| 2. 高优先级重构 | 共享组件 → shadcn | `vercel:shadcn` |
| 3. 页面级清理 | page.tsx 中残留自定义 UI 替换 | `vercel:shadcn` |
| 4. 质量审查 | 每批重构后过 React 最佳实践 | `vercel:react-best-practices` |
| 5. 架构审视 | layout.tsx 职责拆分 + App Router 最佳实践 | `vercel:nextjs` |

### 不在范围内
- 不改变数据层（`src/data/`）
- 不修改业务逻辑
- 不添加新功能
- 不改变部署方式

## 成功标准
- 可替换的自定义 UI 全部迁移到 shadcn/ui
- `vercel:react-best-practices` 审查无关键问题
- `layout.tsx` 职责合理拆分
- `npm run build` 和 `npm test` 通过

## 组件映射（预估）

| 现有 | 替换为 | 安装 |
|------|--------|------|
| `Modal.tsx` | `Dialog` | 已有 |
| `SearchOverlay.tsx` | `Command` | 已有 cmdk |
| `HexagramDetailModal.tsx` | `Dialog` 或 `Sheet` | 已有 |
| 页面内联 `<select>` | `Select` | 需安装 |
| toggle/switch 控件 | `Switch` | 需安装 |
| `ShareCard.tsx` toast | `Sonner` | 需安装 |
| `<details>` 展开区 | `Collapsible` 或 `Accordion` | 需安装 |

## 执行顺序

1. **`Modal.tsx`** → `Dialog` — 多处引用，改一处惠全局
2. **`SearchOverlay.tsx`** → `Command` — 已有 cmdk 依赖
3. **`HexagramDetailModal.tsx`** → `Dialog` / `Sheet`
4. **`ShareCard.tsx`** — 添加 toast 反馈
5. 各页面内联控件 → 对应 shadcn 组件
6. 每批后立即 `vercel:react-best-practices` 审查
7. 最后 `vercel:nextjs` 审视 `layout.tsx`
