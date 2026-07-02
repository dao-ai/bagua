# 3D 爻动 — 基于 Three.js 的交互式卦象渲染系统

## 概述

为八卦项目引入 @react-three/fiber（R3F）3D 渲染引擎，构建一套通用的 `<ThreeYaoHexagram>` 组件，逐步替换/增强现有页面中的 2D 爻线显示，提供立体旋转、翻转动画和沉浸式卦象浏览体验。

## 技术方案

### 技术栈

| 组件 | 选型 | 理由 |
|------|------|------|
| 3D 引擎 | Three.js | 行业标准 WebGL 库 |
| React 绑定 | @react-three/fiber (R3F) | 声明式、融入 React 组件树、自动管理生命周期 |
| 工具库 | @react-three/drei | OrbitControls、Html、Float 等开箱即用 |
| 加载 | `next/dynamic` + `{ ssr: false }` | Three.js 不支持 SSR，仅在客户端加载 |

### 安装

```bash
npm install three @react-three/fiber @react-three/drei @react-spring/three
npm install -D @types/three
```

## 核心组件设计

### `<ThreeYaoHexagram>` — 通用 3D 卦象组件

```tsx
interface ThreeYaoHexagramProps {
  lines: [number, number, number, number, number, number]  // 从下到上 [初,二,三,四,五,上], 1=阳, 0=阴
  changingIndex?: number                                    // 动爻位置 (0-5)，触发翻转动画
  interactive?: boolean                                     // 允许点击交互切换
  size?: number                                             // 容器尺寸，默认 320
  showLabels?: boolean                                      // 显示爻位标签
  autoRotate?: boolean                                      // 自动缓慢旋转
  onYaoClick?: (index: number) => void                     // 点击回调
}
```

#### 3D 爻块建模

每个爻位是一个独立的 `Group`，按爻位从下到上垂直排列（Y 轴间距 1.2 单位）。

**阳爻（—）**：单个长方体，尺寸 `2.4 × 0.3 × 0.4`（宽 × 高 × 深），材质半透磨砂。
**阴爻（- -）**：两个短长方体，尺寸 `1.0 × 0.3 × 0.4`，间距 0.4，左右对称。

材质使用 `MeshPhysicalMaterial`：
- 阳爻：`color: var(--yang)` / `metalness: 0.1` / `roughness: 0.6`
- 阴爻：`color: var(--yin)` / `metalness: 0.1` / `roughness: 0.6`
- 动爻：加 `emissive` 和 `emissiveIntensity` 脉冲动画

#### 动爻翻转动画

1. **触发** — `changingIndex` 变化时
2. **脉冲发光**（0.5s）— `emissiveIntensity` 从 0 → 0.5 → 0
3. **Y 轴翻转**（0.6s）— 爻块绕 X 轴旋转 180°，同时切换阳/阴材质和几何体
4. **回弹**（0.3s）— 轻微 overshoot 后归位

使用 `@react-spring/three` 或 R3F 内置 `useSpring` 驱动动画。

#### 交互

- `OrbitControls` — 拖拽旋转视角、滚轮缩放
- 点击检测（raycaster）— 交互模式下点击爻块触发 `onYaoClick`
- hover 高亮 — 爻块微发光 + 轻微放大

#### 主题联动

通过 `useThree(cb)` 监听 CSS 自定义属性变化（`--yang`, `--yin`, `--accent`, `--accent2`, `--bg`）：

```ts
// 从 CSS 读取颜色
function useThemeColors() {
  const getColor = (name: string) => {
    if (typeof document === 'undefined') return '#ffffff'
    return getComputedStyle(document.documentElement).getPropertyValue(name).trim()
  }
  // 在 theme change 时重新读取并更新材质
}
```

主题切换时 Three.js 材质颜色自动跟随，无需刷新页面。

### `<ThreeYaoLine>` — 单爻 3D 表示（内部使用）

供 `ThreeYaoHexagram` 内部使用的单个 3D 爻块组件。接收 `{ yang, index, isChanging, onClick }`，管理自己的几何体切换和 hover/click 交互。

## 集成路线（五阶段）

### Phase 1：底座组件 + 变爻模拟器（/simulator）

**目标**：建立核心组件，替换 /simulator 中的 2D 爻线显示。

改动文件：
- `src/components/ThreeYaoHexagram.tsx` — 新建，核心 3D 组件
- `src/app/simulator/page.tsx` — 替换爻线渲染区域为 3D 版本

模拟器中的 3D 升级：
- 本卦显示为 3D 爻块
- 点击爻 → 3D 翻转动画（取代现有 flash/flip 2D 动画）
- 变卦结果保持当前文字展示，暂不 3D 化（后续 Phase）
- 变爻模拟器的搜索选卦、卦辞展示、互错综关系等不受影响

交互适配：
- 当前模拟器点击交互逻辑（`handleYaoClick` → `computeHexagramChange` → 动画序列）保持不变
- 3D 组件只替换"爻线渲染"部分，`onYaoClick` 映射到现有 `handleYaoClick`
- 动画序列简化为：点击 → 3D 翻转完成 → 显示变卦结果

### Phase 2：起卦结果（/divine）

**目标**：占卜完成后，结果展示区的卦象用 3D 渲染。

改动文件：
- `src/components/DivineResult.tsx` — 将卦象显示替换为 `<ThreeYaoHexagram>`

集成方式：
- 静态展示模式 (`interactive: false`)
- 可选 `autoRotate: true`，让结果卦象缓慢旋转
- 动爻（老阴老阳）显示脉冲发光效果

### Phase 3：64 卦详情弹窗（/hexagrams）

**目标**：点击卦象打开详情弹窗时，卦符用 3D 呈现。

改动文件：
- `src/components/HexagramDetailModal.tsx` — 替换卦符为 3D

集成方式：
- 小尺寸 (`size: 180`)，精简显示
- 悬停到每爻显示爻辞（通过 Html 标签叠加）
- `interactive: true`，轻触爻块查看爻辞

### Phase 4：双卦对比（/compare）

**目标**：左右两卦并排 3D 显示。

改动文件：
- `src/app/compare/page.tsx` — 替换两个卦象为 3D

集成方式：
- 两个 `<ThreeYaoHexagram>` 并排
- 同步 OrbitControls — 旋转一个另一个跟随
- 对比模式下不自动旋转

### Phase 5：卦象画廊（/gallery）

**目标**：3D 空间中排列六十四卦，沉浸式浏览。

改动文件：
- `src/app/gallery/page.tsx` — 重构为 3D 画廊场景

集成方式：
- 一个大的 Three.js 场景，六十四卦排布在网格/圆环上
- 点击卦象 → 镜头飞入 → 显示详情（叠加 Html label）
- 搜索过滤 → 高亮匹配卦象，淡化其他
- OrbitControls 自由漫游

## 错误处理与边界情况

| 场景 | 处理 |
|------|------|
| Three.js 加载失败 | `<Suspense fallback={<YaoSkeleton />}>`，显示灰色爻块骨架，不影响页面其他功能 |
| WebGL 不支持 | 检测 `typeof WebGLRenderingContext === 'undefined'`，降级为 2D 爻线组件 |
| 性能较低 | `frameloop="demand"`（仅在有动画时渲染），`dpr={[1, 1.5]}` |
| 移动端 | 触摸交互优化，OrbitControls 单指旋转 |
| 主题切换 | 用 `MutationObserver` 监听 `<html>` 的 class 变化（`.classic` 切换），重新读取 CSS 变量更新材质颜色 |
| 组件卸载 | R3F 自动清理 WebGL 资源，无内存泄漏 |

## 目录结构变化

```
src/components/
├── ThreeYaoHexagram.tsx    # 新建 — 核心 3D 卦象组件
├── ThreeYaoLine.tsx        # 新建 — 单爻 3D 组件（内部）
├── YaoSkeleton.tsx         # 新建 — 3D 加载骨架屏
├── Yao.tsx                 # 不变 — 保留 2D 组件作为降级
└── ...
```

## 性能考量

- 所有 Three.js 组件通过 `next/dynamic(() => import(...), { ssr: false })` 懒加载
- `frameloop="demand"` — 无动画时不渲染帧
- `dpr={[1, 1.5]}` — 限制像素比，避免高 DPI 设备过度渲染
- 画廊模式下使用 `instanced mesh` 优化大量相同几何体的渲染
- 爻块几何体复用（`useMemo`），不重复创建

## 测试策略

- 不直接测试 Three.js 渲染输出（WebGL 像素级测试不稳定）
- 测试核心交互逻辑：点击坐标映射、爻位计算、动画状态机
- 测试降级路径：禁用 WebGL 时自动回退 2D 组件
- 测试主题联动：CSS 变量变化时材质颜色更新

## 设计决策记录

| 决策 | 选项 | 选择理由 |
|------|------|----------|
| 3D 框架 | R3F vs 原生 Three.js | R3F 声明式、React 生态友好、drei 工具丰富 |
| 动画驱动 | @react-spring/three vs gsap | 与 R3F 深度集成，声明式动画值绑定 |
| 交互检测 | R3F raycaster vs 自定义 | 内置 Raycaster，`onClick` 等事件直接可用 |
| 几何体管理 | 切换 geometry vs 隐藏/显示 | 切换更清晰，材质复用更好 |
| 颜色主题 | CSS var → JS 传递 vs 嵌入材质 | 跟随系统主题，不硬编码颜色值 |
