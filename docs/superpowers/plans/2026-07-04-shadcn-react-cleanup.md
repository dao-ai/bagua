# shadcn/ui 重构 + React 质量审查 + 架构优化 实施计划

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 将八卦项目中剩余的自定义 UI 替换为 shadcn/ui 组件，用 React 最佳实践审查质量，优化 layout.tsx 架构。

**Architecture:** 先安装缺少的 shadcn 组件（Select、Sonner），然后按影响力从高到低替换：Modal → Dialog（4个页面+1个组件），ShareCard 内联弹窗 → Dialog + Sonner，页面内联 `<select>` → Select，liuyao 内联 Badge → shadcn Badge。每批完成后运行 `vercel:react-best-practices` 审查，最后用 `vercel:nextjs` 审视 layout.tsx。

**Tech Stack:** Next.js 16 (static export), React 19, Tailwind CSS v4, shadcn/ui, TypeScript

## 全局约束

- 必须保持静态导出兼容（`output: 'export'`），不能引入服务端依赖
- 所有修改后的页面必须通过 `npm run build`
- 现有 vitest 测试必须通过
- 不修改数据层（`src/data/`）和业务逻辑
- 保持现有主题系统（CSS 变量 --bg/--fg/--accent 等）

---

### Task 1: 安装缺失的 shadcn 组件

**Files:**
- Create: `src/components/ui/select.tsx`
- Create: `src/components/ui/sonner.tsx`
- Modify: `package.json`

**Interfaces:**
- Produces: `Select`, `Sonner` 组件可用于后续任务

- [ ] **Step 1: 安装 Select 和 Sonner**

```bash
cd /home/wohugb/dao/bagua && npx shadcn@latest add select sonner --yes
```

Expected: 创建 `src/components/ui/select.tsx` 和 `src/components/ui/sonner.tsx`

- [ ] **Step 2: 验证构建**

```bash
npm run build
```

Expected: 构建成功

- [ ] **Step 3: Commit**

```bash
git add src/components/ui/select.tsx src/components/ui/sonner.tsx package.json
git commit -m "feat: add shadcn Select and Sonner components"
```

---

### Task 2: 替换 eight/page.tsx 中的 Modal → Dialog

**Files:**
- Modify: `src/app/eight/page.tsx`

**Interfaces:**
- Consumes: shadcn `Dialog` (已安装)
- Produces: eight/page.tsx 使用 Dialog 替代 Modal

- [ ] **Step 1: 更新 imports 和 modal 状态**

将：
```tsx
import Modal from '@/components/Modal'
// ...
const [modal, setModal] = useState<Bagua | null>(null)
```

改为：
```tsx
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
// ...
const [modal, setModal] = useState<Bagua | null>(null)
```

- [ ] **Step 2: 替换 Modal JSX**

将：
```tsx
<Modal open={!!modal} onClose={() => setModal(null)} label={modal?.name}>
  {/* content */}
</Modal>
```

改为：
```tsx
<Dialog open={!!modal} onOpenChange={(open) => { if (!open) setModal(null) }}>
  <DialogContent className="max-w-[520px] bg-[var(--bg2)] border-[var(--border)]">
    <DialogHeader>
      <DialogTitle className="sr-only">{modal?.name}卦详情</DialogTitle>
    </DialogHeader>
    {/* content */}
  </DialogContent>
</Dialog>
```

- [ ] **Step 3: 移除手动 Escape 处理**

eight/page.tsx 中有：
```tsx
useEffect(() => {
  const handleEsc = (e: KeyboardEvent) => { if (e.key === 'Escape') setModal(null) }
  window.addEventListener('keydown', handleEsc)
  return () => window.removeEventListener('keydown', handleEsc)
}, [])
```
删除这段 useEffect，shadcn Dialog 内置了 Escape 处理。

- [ ] **Step 4: 验证构建**

```bash
npm run build
```

- [ ] **Step 5: Commit**

```bash
git add src/app/eight/page.tsx
git commit -m "refactor(eight): replace Modal with shadcn Dialog"
```

---

### Task 3: 替换 hexagrams/page.tsx 中的 Modal → Dialog

**Files:**
- Modify: `src/app/hexagrams/page.tsx`

**Interfaces:**
- Consumes: shadcn `Dialog`
- Produces: hexagrams/page.tsx 使用 Dialog

- [ ] **Step 1: 更新 imports**

将：
```tsx
import Modal from '@/components/Modal'
```
改为：
```tsx
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
```

- [ ] **Step 2: 替换 Modal 用法**

hexagrams/page.tsx 使用 `setModal(<div>...</div>)` 模式（传入 JSX 而非数据）。将 Modal 替换为 Dialog：
```tsx
<Dialog open={!!modal} onOpenChange={(open) => { if (!open) setModal(null) }}>
  <DialogContent className="max-w-[520px] bg-[var(--bg2)] border-[var(--border)]">
    <DialogHeader>
      <DialogTitle className="sr-only">卦象详情</DialogTitle>
    </DialogHeader>
    {modal}
  </DialogContent>
</Dialog>
```

- [ ] **Step 3: 移除手动 Escape 处理**

删除：
```tsx
useEffect(() => {
  const handleEsc = (e: KeyboardEvent) => { if (e.key === 'Escape') setModal(null) }
  window.addEventListener('keydown', handleEsc)
  return () => window.removeEventListener('keydown', handleEsc)
}, [])
```

- [ ] **Step 4: 验证构建**

```bash
npm run build
```

- [ ] **Step 5: Commit**

```bash
git add src/app/hexagrams/page.tsx
git commit -m "refactor(hexagrams): replace Modal with shadcn Dialog"
```

---

### Task 4: 替换 HexagramDetailModal.tsx 中的 Modal → Dialog

**Files:**
- Modify: `src/components/HexagramDetailModal.tsx`

**Interfaces:**
- Consumes: shadcn `Dialog`, `DialogContent`, `DialogHeader`, `DialogTitle`
- Produces: HexagramDetailModal 使用 Dialog

- [ ] **Step 1: 更新 imports**

将：
```tsx
import Modal from '@/components/Modal'
```
改为：
```tsx
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
```

- [ ] **Step 2: 替换 Modal**

将 `<Modal open={true} onClose={onClose} label={...}>` 替换为：

```tsx
<Dialog open={true} onOpenChange={(open) => { if (!open) onClose() }}>
  <DialogContent className="max-w-[520px] bg-[var(--bg2)] border-[var(--border)] max-h-[90vh] overflow-y-auto thin-scroll">
    <DialogHeader>
      <DialogTitle className="sr-only">{name}卦详情</DialogTitle>
    </DialogHeader>
    {/* 保持内部内容不变 */}
    <div className="flex flex-col items-center">
      ...
    </div>
  </DialogContent>
</Dialog>
```

注意：需要删除 `Modal` 的关闭按钮（×），Dialog 自带关闭按钮。调整内容区顶部间距。

- [ ] **Step 3: 验证构建**

```bash
npm run build
```

- [ ] **Step 4: Commit**

```bash
git add src/components/HexagramDetailModal.tsx
git commit -m "refactor(HexagramDetailModal): replace Modal with shadcn Dialog"
```

---

### Task 5: 替换 LifeGuaResult.tsx 中的 Modal → Dialog

**Files:**
- Modify: `src/components/LifeGuaResult.tsx`

**Interfaces:**
- Consumes: shadcn `Dialog`
- Produces: LifeGuaResult 使用 Dialog

- [ ] **Step 1: 找到 Modal 使用位置并替换 imports**

```tsx
// 替换
import Modal from '@/components/Modal'
// 为
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
```

- [ ] **Step 2: 替换 Modal 为 Dialog**

```tsx
<Dialog open={!!modalGua} onOpenChange={(open) => { if (!open) setModalGua(null) }}>
  <DialogContent className="max-w-[520px] bg-[var(--bg2)] border-[var(--border)]">
    <DialogHeader>
      <DialogTitle>{modalGua?.name}</DialogTitle>
    </DialogHeader>
    {/* 卦象详情内容 */}
  </DialogContent>
</Dialog>
```

- [ ] **Step 3: 验证构建**

```bash
npm run build
```

- [ ] **Step 4: Commit**

```bash
git add src/components/LifeGuaResult.tsx
git commit -m "refactor(LifeGuaResult): replace Modal with shadcn Dialog"
```

---

### Task 6: 删除 Modal.tsx，更新测试

**Files:**
- Delete: `src/components/Modal.tsx`
- Modify: `src/__tests__/components.test.tsx`

**Interfaces:**
- Consumes: 所有 Modal 引用已在前序任务中替换
- Produces: Modal 组件彻底移除

- [ ] **Step 1: 确认无残留引用**

```bash
grep -rn "from '@/components/Modal'" src/ --include="*.tsx" --include="*.ts"
```

Expected: 只有 `src/__tests__/components.test.tsx` 中还有引用（如果有其他文件，必须先处理）

- [ ] **Step 2: 删除 Modal.tsx**

```bash
rm src/components/Modal.tsx
```

- [ ] **Step 3: 更新测试文件**

删除测试文件中的 Modal 导入和相关测试：
```tsx
// 删除这行
import Modal from '@/components/Modal'
```
删除 Modal 相关的测试用例（渲染、Escape 关闭、焦点管理等测试）

- [ ] **Step 4: 验证构建和测试**

```bash
npm run build && npm test
```

Expected: 构建成功，所有测试通过

- [ ] **Step 5: Commit**

```bash
git add src/components/Modal.tsx src/__tests__/components.test.tsx
git commit -m "refactor: remove Modal.tsx, all consumers migrated to shadcn Dialog"
```

---

### Task 7: 替换 ShareCard 内联弹窗 → Dialog + Sonner

**Files:**
- Modify: `src/components/ShareCard.tsx`

**Interfaces:**
- Consumes: shadcn `Dialog`, `Sonner` (sonner toast)
- Produces: ShareCard 使用 Dialog 弹窗 + toast 反馈

- [ ] **Step 1: 引入 Sonner Toaster 到 layout**

在 `src/app/layout.tsx` 的 `<body>` 末尾（`</body>` 之前）添加：
```tsx
import { Toaster } from '@/components/ui/sonner'
// ...
<Toaster />
```

- [ ] **Step 2: 重构 ShareCard.tsx — 更新 imports**

添加：
```tsx
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { toast } from 'sonner'
```

- [ ] **Step 3: 替换弹窗部分**

移除自定义遮罩和弹窗 div（`fixed inset-0 z-50 bg-black/50...` 和 `fixed inset-x-4 top-[10vh]...`），替换为：

```tsx
<Dialog open={open} onOpenChange={(isOpen) => { if (!isOpen) setOpen(false) }}>
  <DialogContent className="max-w-[420px] bg-[var(--bg2)] border-[var(--border)]">
    <DialogHeader>
      <DialogTitle>{subtitle ? `分享${subtitle}` : '分享卦象'}</DialogTitle>
    </DialogHeader>
    <div className="rounded-xl overflow-hidden border border-[var(--border)]">
      <canvas
        ref={canvasRef}
        className="w-full h-auto block"
        style={{ aspectRatio: '540/640' }}
      />
    </div>
    <div className="flex gap-3 mt-4">
      <Button onClick={handleDownload} className="flex-1">
        ⬇️ 下载图片
      </Button>
      <Button onClick={handleCopy} variant="outline" className="flex-1">
        {copied ? '✅ 已复制' : '📋 复制图片'}
      </Button>
    </div>
  </DialogContent>
</Dialog>
```

注意：需要使用 `Button` 组件替换原生 button：
```tsx
import { Button } from '@/components/ui/button'
```

- [ ] **Step 4: 替换 copied state → Sonner toast**

删除 `const [copied, setCopied] = useState(false)` 和 `setTimeout`。

在 `handleCopy` 中：
```tsx
const handleCopy = async () => {
  // ... canvas toBlob 逻辑不变 ...
  try {
    await navigator.clipboard.write([new ClipboardItem({ 'image/png': blob })])
    toast.success('图片已复制到剪贴板')
  } catch {
    toast.error('复制失败，已改为下载')
    handleDownload()
  }
}
```

- [ ] **Step 5: 验证构建**

```bash
npm run build
```

- [ ] **Step 6: Commit**

```bash
git add src/components/ShareCard.tsx src/app/layout.tsx
git commit -m "refactor(ShareCard): replace inline modal with Dialog, add Sonner toast"
```

---

### Task 8: 替换页面内联 `<select>` → shadcn Select

**Files:**
- Modify: `src/app/yao-positions/page.tsx`
- Modify: `src/app/liuyao/page.tsx`
- Modify: `src/app/lifegua/page.tsx`

**Interfaces:**
- Consumes: shadcn `Select` (Task 1 已安装)
- Produces: 三个页面使用 shadcn Select 组件

- [ ] **Step 1: yao-positions/page.tsx — 替换卦选择器**

导入：
```tsx
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
```

替换 `<select>` 元素（约第422-443行）：
```tsx
<Select value={selectedHexagram} onValueChange={setSelectedHexagram}>
  <SelectTrigger className="w-full max-w-xs bg-[var(--bg2)] border-[var(--border)] text-xs">
    <SelectValue placeholder="选择卦象" />
  </SelectTrigger>
  <SelectContent className="bg-[var(--bg2)] border-[var(--border)] max-h-[300px]">
    {baguaIds.map(lowerId => {
      const lowerBagua = baguaList.find(b => b.id === lowerId)
      return (
        <SelectGroup key={lowerId}>
          <SelectLabel>{lowerBagua?.name}（{lowerBagua?.symbol}）</SelectLabel>
          {baguaIds.map(upperId => {
            const name = getHexagramName(upperId, lowerId)
            const key = `${upperId}-${lowerId}`
            const h = allHexagrams.find(x => x.key === key)
            return (
              <SelectItem key={key} value={key}>
                {h?.symbol || ''} {name}
              </SelectItem>
            )
          })}
        </SelectGroup>
      )
    })}
  </SelectContent>
</Select>
```

- [ ] **Step 2: liuyao/page.tsx — 替换两个 select**

导入 Select 组件（同上）。替换卦选择器（第78-88行）和日干选择器（第92-96行）。

卦选择器：
```tsx
<Select value={selectedKey} onValueChange={setSelectedKey}>
  <SelectTrigger className="w-full bg-[var(--bg2)] border-[var(--border)] text-sm">
    <SelectValue />
  </SelectTrigger>
  <SelectContent className="bg-[var(--bg2)] border-[var(--border)] max-h-[300px]">
    {allHexagrams.map(h => (
      <SelectItem key={h.key} value={h.key}>
        {h.symbol} {h.name}
      </SelectItem>
    ))}
  </SelectContent>
</Select>
```

日干选择器：
```tsx
<Select value={dayStem} onValueChange={setDayStem}>
  <SelectTrigger className="w-full bg-[var(--bg2)] border-[var(--border)] text-sm">
    <SelectValue />
  </SelectTrigger>
  <SelectContent className="bg-[var(--bg2)] border-[var(--border)]">
    {TIAN_GAN.map(s => (
      <SelectItem key={s} value={s}>{s}日</SelectItem>
    ))}
  </SelectContent>
</Select>
```

- [ ] **Step 3: lifegua/page.tsx — 替换四个 select**

导入 Select 组件。替换年月日时四个 `<select>`：

年：
```tsx
<Select value={year} onValueChange={setYear}>
  <SelectTrigger className="w-full bg-[var(--bg3)] border-[var(--border)] text-sm text-center">
    <SelectValue />
  </SelectTrigger>
  <SelectContent className="bg-[var(--bg2)] border-[var(--border)] max-h-[240px]">
    {Array.from({ length: 200 }, (_, i) => 2099 - i).map(y => (
      <SelectItem key={y} value={String(y)}>{y}年</SelectItem>
    ))}
  </SelectContent>
</Select>
```

月、日、时辰同理替换。删除每个 select 后面的 `▼` span（Select 自带箭头）。

- [ ] **Step 4: 验证构建**

```bash
npm run build
```

- [ ] **Step 5: Commit**

```bash
git add src/app/yao-positions/page.tsx src/app/liuyao/page.tsx src/app/lifegua/page.tsx
git commit -m "refactor: replace inline <select> with shadcn Select in yao-positions, liuyao, lifegua"
```

---

### Task 9: 替换 liuyao/page.tsx 内联 Badge → shadcn Badge

**Files:**
- Modify: `src/app/liuyao/page.tsx`

**Interfaces:**
- Consumes: shadcn `Badge` (已安装在 `src/components/ui/badge.tsx`)
- Produces: liuyao/page.tsx 使用 shadcn Badge

- [ ] **Step 1: 导入 shadcn Badge**

```tsx
import { Badge } from '@/components/ui/badge'
```

- [ ] **Step 2: 替换内联 Badge 组件**

删除文件底部（约第251-256行）的内联 `Badge` 函数。将 `<Badge accent>` 改为 `<Badge variant="default" className="bg-[var(--accent)]/10 text-[var(--accent)] border-[var(--accent)]/20">`，将 `<Badge>` 改为 `<Badge variant="secondary">`。

- [ ] **Step 3: 验证构建**

```bash
npm run build
```

- [ ] **Step 4: Commit**

```bash
git add src/app/liuyao/page.tsx
git commit -m "refactor(liuyao): replace inline Badge with shadcn Badge"
```

---

### Task 10: React 最佳实践审查

**Files:**
- Review: 所有修改过的 TSX 文件

**技能: `vercel:react-best-practices`**

- [ ] **Step 1: 运行审查**

对上述所有修改过的组件运行 `vercel:react-best-practices` 技能审查。

涉及的文件：
- `src/app/eight/page.tsx`
- `src/app/hexagrams/page.tsx`
- `src/components/HexagramDetailModal.tsx`
- `src/components/LifeGuaResult.tsx`
- `src/components/ShareCard.tsx`
- `src/app/yao-positions/page.tsx`
- `src/app/liuyao/page.tsx`
- `src/app/lifegua/page.tsx`

审查重点：组件结构、hooks 使用、无障碍、性能、TypeScript 模式。

- [ ] **Step 2: 修复审查发现的问题**

根据审查结果修复代码。

- [ ] **Step 3: 验证构建和测试**

```bash
npm run build && npm test
```

- [ ] **Step 4: Commit（如有修复）**

```bash
git add -A
git commit -m "fix: apply React best practices review fixes"
```

---

### Task 11: Next.js 架构审查 — layout.tsx

**Files:**
- Review: `src/app/layout.tsx`

**技能: `vercel:nextjs`**

- [ ] **Step 1: 审查 layout.tsx**

使用 `vercel:nextjs` 技能审查 `layout.tsx`，重点关注：
- Footer 是否应提取为独立组件（当前 ~50 行 inline footer）
- 字体加载策略
- Script 标签使用
- Metadata 配置

- [ ] **Step 2: 提取 Footer 组件（如审查建议）**

如审查建议拆分，创建 `src/components/Footer.tsx`，将 footer JSX 从 layout.tsx 中移出。

- [ ] **Step 3: 验证构建和测试**

```bash
npm run build && npm test
```

- [ ] **Step 4: 最终 Commit**

```bash
git add -A
git commit -m "refactor(layout): extract Footer component, apply Next.js best practices"
```
