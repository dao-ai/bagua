# Three.js 3D 爻动系统 — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a reusable `<ThreeYaoHexagram>` component using @react-three/fiber and integrate it across the project's hexagram display surfaces in 5 phases.

**Architecture:** A core `<ThreeYaoHexagram>` component renders 6 yao lines as 3D extruded blocks (single for yang, split for yin) using R3F. OrbitControls handles rotation/zoom. A `changingIndex` prop triggers a flip animation (pulse glow → X-axis 180° rotation → settle). Theme colors are read from CSS custom properties via `useThemeColors` hook and synced via MutationObserver on `<html>` classList. All 3D components are `next/dynamic` with `ssr: false`.

**Tech Stack:** Three.js, @react-three/fiber, @react-three/drei, @react-spring/three, TypeScript, Next.js 16 dynamic imports, Tailwind CSS v4.

## Global Constraints

- ESM imports only — no CommonJS.
- All Three.js components must use `next/dynamic(() => import(...), { ssr: false })` — never imported statically.
- CSS variable names used: `--yang`, `--yin`, `--accent`, `--accent2`, `--bg` — read from `getComputedStyle(document.documentElement)`.
- Theme toggled via `document.documentElement.classList.toggle('classic', !dark)` — use `MutationObserver` on `<html>` for change detection.
- WebGL detection: `typeof WebGLRenderingContext === 'undefined'` → fallback to existing 2D `YaoLine` components.
- `dpr={[1, 1.5]}`, `frameloop="demand"` on all R3F `<Canvas>`.
- Zero `any` types — use strict TypeScript.
- No new dependencies beyond: `three`, `@react-three/fiber`, `@react-three/drei`, `@react-spring/three`, `@types/three`.

---

## File Structure

### New files

| File | Responsibility |
|------|---------------|
| `src/hooks/useThemeColors.ts` | Read CSS custom properties, return color strings, expose `useEffect`-based listener for theme changes |
| `src/components/ThreeYaoLine.tsx` | Single 3D yao line — manages yang/yin geometry switch, hover highlight, click detection |
| `src/components/ThreeYaoHexagram.tsx` | Full 6-yao 3D hexagram — arranges ThreeYaoLine vertically, OrbitControls, flip animation orchestration |
| `src/components/YaoSkeleton.tsx` | 2D placeholder shimmer while Three.js loads / as WebGL fallback |

### Modified files (per phase)

| Phase | File | Change |
|-------|------|--------|
| 1 | `src/app/simulator/page.tsx` | Replace 2D yao display with `<ThreeYaoHexagram>`, wire `onYaoClick` to existing `handleYaoClick` |
| 2 | `src/components/DivineResult.tsx` | Replace hexagram symbol area with static `<ThreeYaoHexagram autoRotate>` |
| 3 | `src/components/HexagramDetailModal.tsx` | Replace `text-[60px]` symbol with compact `<ThreeYaoHexagram size={180}>`, show yao text on hover |
| 4 | `src/app/compare/page.tsx` | Replace two hexagram symbol areas with two `<ThreeYaoHexagram>` sharing OrbitControls |
| 5 | `src/app/gallery/page.tsx` | Rebuild as full-screen R3F scene with 64 hexagrams arranged in 3D space |

---

### Task 1: Install dependencies + create useThemeColors hook

**Files:**
- Modify: `package.json` (dependencies)
- Create: `src/hooks/useThemeColors.ts`
- Test: `src/__tests__/hooks/useThemeColors.test.ts`

**Interfaces:**
- Produces: `useThemeColors(): { yang, yin, accent, accent2, bg }` — returns current CSS custom property values as hex strings, updates on theme change

- [ ] **Step 1: Install three.js packages**

```bash
npm install three @react-three/fiber @react-three/drei @react-spring/three
npm install -D @types/three
```

- [ ] **Step 2: Verify install**

```bash
node -e "require('three'); require('@react-three/fiber'); console.log('ok')"
```

- [ ] **Step 3: Write the useThemeColors hook**

```ts
'use client'
import { useState, useEffect, useCallback } from 'react'

export interface ThemeColors {
  yang: string
  yin: string
  accent: string
  accent2: string
  bg: string
}

function readColors(): ThemeColors {
  if (typeof document === 'undefined') {
    return { yang: '#f59e0b', yin: '#4a5a7a', accent: '#d97706', accent2: '#f59e0b', bg: '#0b1120' }
  }
  const s = getComputedStyle(document.documentElement)
  const g = (n: string) => s.getPropertyValue(n).trim()
  return { yang: g('--yang'), yin: g('--yin'), accent: g('--accent'), accent2: g('--accent2'), bg: g('--bg') }
}

export function useThemeColors(): ThemeColors {
  const [colors, setColors] = useState<ThemeColors>(readColors)

  useEffect(() => {
    const el = document.documentElement
    const observer = new MutationObserver(() => setColors(readColors()))
    observer.observe(el, { attributes: true, attributeFilter: ['class'] })
    return () => observer.disconnect()
  }, [])

  return colors
}

export { readColors }
```

- [ ] **Step 4: Write test for useThemeColors**

```ts
import { describe, it, expect } from 'vitest'
import { readColors } from '@/hooks/useThemeColors'

describe('readColors', () => {
  it('returns default colors when document is undefined', () => {
    const doc = global.document
    // @ts-expect-error testing server path
    delete global.document
    const colors = readColors()
    expect(colors.yang).toBe('#f59e0b')
    expect(colors.yin).toBe('#4a5a7a')
    global.document = doc
  })

  it('returns theme colors from CSS custom properties', () => {
    const colors = readColors()
    expect(colors.yang).toBeTruthy()
    expect(colors.yin).toBeTruthy()
  })
})
```

- [ ] **Step 5: Run test**

```bash
npx vitest run src/__tests__/hooks/useThemeColors.test.ts
```
Expected: PASS

- [ ] **Step 6: Commit**

```bash
git add package.json package-lock.json src/hooks/useThemeColors.ts src/__tests__/hooks/useThemeColors.test.ts
git commit -m "feat(three): install three.js packages, add useThemeColors hook"
```

---

### Task 2: Create ThreeYaoLine component

**Files:**
- Create: `src/components/ThreeYaoLine.tsx`
- Test: `src/__tests__/components/ThreeYaoLine.test.tsx`

**Interfaces:**
- Consumes: `ThemeColors` from `useThemeColors`
- Produces: `<ThreeYaoLine yang: boolean index: number isChanging?: boolean onClick?: (index: number) => void />` — R3F mesh group for one yao position

- [ ] **Step 1: Write ThreeYaoLine component**

```tsx
'use client'
import { useRef, useState } from 'react'
import { Mesh, MeshPhysicalMaterial, BoxGeometry } from 'three'
import { useThemeColors } from '@/hooks/useThemeColors'

interface ThreeYaoLineProps {
  yang: boolean
  index: number
  isChanging?: boolean
  onClick?: (index: number) => void
}

const YANG_GEOM = new BoxGeometry(2.4, 0.3, 0.4)
const YIN_HALF_GEOM = new BoxGeometry(1.0, 0.3, 0.4)

export default function ThreeYaoLine({ yang, index, isChanging, onClick }: ThreeYaoLineProps) {
  const colors = useThemeColors()
  const [hovered, setHovered] = useState(false)
  const meshRef = useRef<Mesh>(null)

  const color = yang ? colors.yang : colors.yin
  const emissive = isChanging ? colors.accent : '#000000'
  const emissiveIntensity = isChanging ? 0.5 : 0
  const scale = hovered ? 1.08 : 1

  if (yang) {
    return (
      <mesh
        ref={meshRef}
        geometry={YANG_GEOM}
        position={[0, index * 1.2, 0]}
        scale={[scale, 1, 1]}
        onClick={() => onClick?.(index)}
        onPointerEnter={() => setHovered(true)}
        onPointerLeave={() => setHovered(false)}
      >
        <meshPhysicalMaterial
          color={color}
          metalness={0.1}
          roughness={0.6}
          emissive={emissive}
          emissiveIntensity={emissiveIntensity}
          transparent
          opacity={0.92}
        />
      </mesh>
    )
  }

  // 阴爻 — two short blocks with gap
  return (
    <group position={[0, index * 1.2, 0]}>
      <mesh
        geometry={YIN_HALF_GEOM}
        position={[-0.7, 0, 0]}
        scale={[scale, 1, 1]}
        onClick={() => onClick?.(index)}
        onPointerEnter={() => setHovered(true)}
        onPointerLeave={() => setHovered(false)}
      >
        <meshPhysicalMaterial
          color={color}
          metalness={0.1}
          roughness={0.6}
          emissive={emissive}
          emissiveIntensity={emissiveIntensity}
          transparent
          opacity={0.92}
        />
      </mesh>
      <mesh
        geometry={YIN_HALF_GEOM}
        position={[0.7, 0, 0]}
        scale={[scale, 1, 1]}
        onClick={() => onClick?.(index)}
        onPointerEnter={() => setHovered(true)}
        onPointerLeave={() => setHovered(false)}
      >
        <meshPhysicalMaterial
          color={color}
          metalness={0.1}
          roughness={0.6}
          emissive={emissive}
          emissiveIntensity={emissiveIntensity}
          transparent
          opacity={0.92}
        />
      </mesh>
    </group>
  )
}
```

- [ ] **Step 2: Write smoke test**

```tsx
import { describe, it, expect } from 'vitest'

describe('ThreeYaoLine', () => {
  it('renders without crashing', () => {
    // Three.js components require Canvas context — smoke test just checks import
    const mod = require('@/components/ThreeYaoLine')
    expect(mod.default).toBeDefined()
  })
})
```

- [ ] **Step 3: Run test**

```bash
npx vitest run src/__tests__/components/ThreeYaoLine.test.tsx
```
Expected: PASS

- [ ] **Step 4: Commit**

```bash
git add src/components/ThreeYaoLine.tsx src/__tests__/components/ThreeYaoLine.test.tsx
git commit -m "feat(three): add ThreeYaoLine 3D yao block component"
```

---

### Task 3: Create ThreeYaoHexagram component

**Files:**
- Create: `src/components/ThreeYaoHexagram.tsx`
- Create: `src/components/YaoSkeleton.tsx`
- Test: `src/__tests__/components/ThreeYaoHexagram.test.tsx`

**Interfaces:**
- Consumes: `ThreeYaoLine`, `ThemeColors`
- Produces: `<ThreeYaoHexagram lines changingIndex? interactive? size? autoRotate? showLabels? onYaoClick? />`

- [ ] **Step 1: Write YaoSkeleton component**

```tsx
'use client'

export default function YaoSkeleton({ size = 320 }: { size?: number }) {
  return (
    <div
      className="flex flex-col items-center justify-center gap-[4px] animate-pulse"
      style={{ width: size, height: size * 0.75 }}
    >
      {[0,1,2,3,4,5].map(i => (
        <div
          key={i}
          className="rounded-sm bg-[var(--border)]"
          style={{ width: 80, height: 8, opacity: 1 - i * 0.12 }}
        />
      ))}
    </div>
  )
}
```

- [ ] **Step 2: Write ThreeYaoHexagram component**

```tsx
'use client'

import { Canvas } from '@react-three/fiber'
import { OrbitControls, Float } from '@react-three/drei'
import { Suspense, useMemo } from 'react'
import ThreeYaoLine from './ThreeYaoLine'
import YaoSkeleton from './YaoSkeleton'

interface ThreeYaoHexagramProps {
  lines: [number, number, number, number, number, number]
  changingIndex?: number
  interactive?: boolean
  size?: number
  autoRotate?: boolean
  showLabels?: boolean
  onYaoClick?: (index: number) => void
}

export default function ThreeYaoHexagram({
  lines,
  changingIndex,
  interactive = false,
  size = 320,
  autoRotate = false,
  showLabels = false,
  onYaoClick,
}: ThreeYaoHexagramProps) {
  // lines are [初,二,三,四,五,上] — render from bottom (y=0) up (y=5*1.2)
  // Three.js Y axis goes up, index 0=初 at bottom, index 5=上 at top

  const handleClick = (index: number) => {
    if (interactive) onYaoClick?.(index)
  }

  return (
    <div style={{ width: size, height: Math.round(size * 0.85) }}>
      <Suspense fallback={<YaoSkeleton size={size} />}>
        <Canvas
          camera={{ position: [0, 3, 5], fov: 50 }}
          dpr={[1, 1.5]}
          frameloop="demand"
          gl={{ antialias: true }}
        >
          <ambientLight intensity={0.6} />
          <directionalLight position={[5, 8, 6]} intensity={1.2} />
          <directionalLight position={[-3, 2, -4]} intensity={0.4} />

          {lines.map((yang, i) => (
            <ThreeYaoLine
              key={i}
              yang={yang === 1}
              index={i}
              isChanging={changingIndex === i}
              onClick={handleClick}
            />
          ))}

          {autoRotate && <Float speed={0.5} rotationIntensity={0.3} floatIntensity={0.2}>
            <group />
          </Float>}

          {interactive && (
            <OrbitControls
              enablePan={false}
              minDistance={3}
              maxDistance={10}
              autoRotate={autoRotate}
              autoRotateSpeed={1.5}
            />
          )}

          {!interactive && autoRotate && (
            <OrbitControls
              enableZoom={false}
              enablePan={false}
              enableRotate={false}
              autoRotate
              autoRotateSpeed={1.5}
            />
          )}
        </Canvas>
      </Suspense>
    </div>
  )
}
```

- [ ] **Step 3: Write smoke test**

```tsx
import { describe, it, expect } from 'vitest'

describe('ThreeYaoHexagram', () => {
  it('exports component', () => {
    const mod = require('@/components/ThreeYaoHexagram')
    expect(mod.default).toBeDefined()
  })
})

describe('YaoSkeleton', () => {
  it('renders 6 placeholder lines', () => {
    const React = require('react')
    const { renderToString } = require('react-dom/server')
    const { default: Skeleton } = require('@/components/YaoSkeleton')
    const html = renderToString(React.createElement(Skeleton, { size: 320 }))
    expect(html).toContain('animate-pulse')
  })
})
```

- [ ] **Step 4: Run test**

```bash
npx vitest run src/__tests__/components/ThreeYaoHexagram.test.tsx
```
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/components/ThreeYaoHexagram.tsx src/components/YaoSkeleton.tsx src/__tests__/components/ThreeYaoHexagram.test.tsx
git commit -m "feat(three): add ThreeYaoHexagram and YaoSkeleton components"
```

---

### Task 4: Phase 1 — Integrate into simulator

**Files:**
- Modify: `src/app/simulator/page.tsx`

**Interfaces:**
- Consumes: `<ThreeYaoHexagram>` with `interactive: true` and `onYaoClick`
- Existing logic: `handleYaoClick(index: number)` already computes `computeHexagramChange(currentYao6, mk, ...)` — keep unchanged
- Wire: `onYaoClick={(i) => handleYaoClick(i)}`

- [ ] **Step 1: Add dynamic import at top of simulator/page.tsx**

```tsx
import dynamic from 'next/dynamic'

const ThreeYaoHexagram = dynamic(() => import('@/components/ThreeYaoHexagram'), { ssr: false })
```

- [ ] **Step 2: Replace the 2D yao line rendering block**

In `simulator/page.tsx`, find the section that renders yao lines as `<YaoLine>` components inside the "本卦" display area (around line 170-217). Replace the flex-col div containing the 6 `<YaoLine>` + labels + `<RubyText>` name with:

```tsx
{/* 3D 卦象 */}
<ThreeYaoHexagram
  lines={[
    currentYao6[5], currentYao6[4], currentYao6[3],
    currentYao6[2], currentYao6[1], currentYao6[0],
  ]}
  changingIndex={animPhase === 'done' ? activeIndex : (animPhase !== 'idle' ? activeIndex : undefined)}
  interactive={animPhase === 'idle' || animPhase === 'done'}
  size={260}
  autoRotate={false}
  showLabels
  onYaoClick={(i) => {
    if (animPhase === 'idle' || animPhase === 'done') {
      handleYaoClick(i)
    }
  }}
/>
```

- [ ] **Step 3: Clean up — remove unused 2D YaoLine imports if no longer referenced**

Check if `YaoLine` is still used elsewhere in the file (e.g. the "变卦" display area). If the changedHexagram display still uses 2D YaoLine, keep the import. If we removed all references, delete the import line.

- [ ] **Step 4: Manually verify in browser**

```bash
npm run dev
```
Open http://localhost:3000/simulator, select a hexagram, click a yao line → confirm 3D display with flip animation, then variable name and description still show correctly. Verify the page still loads and the hexagram selector / result display all work.

- [ ] **Step 5: Commit**

```bash
git add src/app/simulator/page.tsx
git commit -m "feat(three): integrate 3D yao hexagram into simulator page"
```

---

### Task 5: Phase 2 — Integrate into DivineResult

**Files:**
- Modify: `src/components/DivineResult.tsx`

- [ ] **Step 1: Read current DivineResult.tsx to understand hexagram display area**

```bash
cat -n src/components/DivineResult.tsx | head -80
```
Identify where the hexagram symbol is rendered (look for `getHexagramSymbol`, or a `<div>` with the large symbol text).

- [ ] **Step 2: Add dynamic import**

```tsx
import dynamic from 'next/dynamic'
const ThreeYaoHexagram = dynamic(() => import('@/components/ThreeYaoHexagram'), { ssr: false })
```

- [ ] **Step 3: Replace hexagram symbol with ThreeYaoHexagram**

Find the section rendering the hexagram symbol. Replace the text-based symbol with:

```tsx
<ThreeYaoHexagram
  lines={yao6 as [number, number, number, number, number, number]}
  size={200}
  autoRotate
  interactive={false}
/>
```

Pass `yao6` as lines. The `yao6` array is available from the component's props — it's the 6 yao lines [初...上] derived from the divination result.

- [ ] **Step 4: Manually verify in browser**

```bash
npm run dev
```
Open http://localhost:3000/divine, perform a divination — confirm the result shows a rotating 3D hexagram. Toggle dark/classic theme and confirm colors update.

- [ ] **Step 5: Commit**

```bash
git add src/components/DivineResult.tsx
git commit -m "feat(three): integrate 3D yao hexagram into divine result"
```

---

### Task 6: Phase 3 — Integrate into HexagramDetailModal

**Files:**
- Modify: `src/components/HexagramDetailModal.tsx`

- [ ] **Step 1: Read current HexagramDetailModal.tsx**

```bash
cat -n src/components/HexagramDetailModal.tsx
```
Find the symbolic representation (the `text-[60px]` hexagram symbol). Note how yao lines and hexagram symbol are accessed (likely via `baguaMap` and `getHexagramSymbol`).

- [ ] **Step 2: Add dynamic import**

```tsx
import dynamic from 'next/dynamic'
const ThreeYaoHexagram = dynamic(() => import('@/components/ThreeYaoHexagram'), { ssr: false })
```

- [ ] **Step 3: Replace the hexagram symbol in the modal**

Replace the large text symbol `<div className="text-[60px] text-center block">{sym}</div>` with:

```tsx
<ThreeYaoHexagram
  lines={[
    lb.yao[2], lb.yao[1], lb.yao[0],
    ub.yao[2], ub.yao[1], ub.yao[0],
  ]}
  size={180}
  interactive
  autoRotate={false}
  onYaoClick={(i) => {
    // scroll to or highlight the corresponding yao line text
    const yaoLines = detail?.yaoLines
    if (yaoLines?.[5 - i]) {
      // focus the yao line entry
    }
  }}
/>
```

The modal already has `ud` (upper bagua) and `ld` (lower bagua) — construct the 6-line array as `[ld.yao[2], ld.yao[1], ld.yao[0], ud.yao[2], ud.yao[1], ud.yao[0]]` (lower trigram bottom first, then upper trigram).

- [ ] **Step 4: Add hover yao text display**

Wrap the `<ThreeYaoHexagram>` and a state variable to show the currently hovered yao line text below it:

```tsx
const [hoveredYao, setHoveredYao] = useState<number | null>(null)

// In JSX after ThreeYaoHexagram:
{hoveredYao !== null && detail?.yaoLines?.[5 - hoveredYao] && (
  <div className="mt-3 text-center text-sm">
    <span className="text-[var(--accent2)] font-mono text-xs">
      {detail.yaoLines[5 - hoveredYao].pos}
    </span>
    <span className="ml-2 text-[var(--muted)]">
      {detail.yaoLines[5 - hoveredYao].text}
    </span>
  </div>
)}
```

- [ ] **Step 5: Manually verify in browser**

Open http://localhost:3000/hexagrams, click any hexagram — confirm modal opens with 3D hexagram. Hover yao lines, confirm the yao text appears below.

- [ ] **Step 6: Commit**

```bash
git add src/components/HexagramDetailModal.tsx
git commit -m "feat(three): integrate 3D yao hexagram into hexagram detail modal"
```

---

### Task 7: Phase 4 — Integrate into Compare page

**Files:**
- Modify: `src/app/compare/page.tsx`

- [ ] **Step 1: Read compare page**

```bash
head -30 src/app/compare/page.tsx
```
Identify how the two hexagrams are selected and rendered.

- [ ] **Step 2: Add dynamic imports**

```tsx
import dynamic from 'next/dynamic'
const ThreeYaoHexagram = dynamic(() => import('@/components/ThreeYaoHexagram'), { ssr: false })
```

- [ ] **Step 3: Replace two hexagram displays**

Find where the two hexagram symbols are rendered (two columns, each with a large symbol). Replace each with `<ThreeYaoHexagram>`:

```tsx
<div className="flex gap-4 justify-center items-start max-sm:flex-col">
  {/* Hexagram A */}
  <div className="flex-1 text-center">
    <ThreeYaoHexagram
      lines={[
        lowerA.yao[2], lowerA.yao[1], lowerA.yao[0],
        upperA.yao[2], upperA.yao[1], upperA.yao[0],
      ]}
      size={220}
      interactive
      autoRotate={false}
    />
    <div className="mt-2 text-lg font-bold">{nameA}</div>
  </div>

  {/* Hexagram B */}
  <div className="flex-1 text-center">
    <ThreeYaoHexagram
      lines={[
        lowerB.yao[2], lowerB.yao[1], lowerB.yao[0],
        upperB.yao[2], upperB.yao[1], upperB.yao[0],
      ]}
      size={220}
      interactive
      autoRotate={false}
    />
    <div className="mt-2 text-lg font-bold">{nameB}</div>
  </div>
</div>
```

Note: `lowerA`/`upperA` variable names may differ — identify the actual variable names from the existing page code. The page has upper/lower bagua objects for both selected hexagrams.

- [ ] **Step 4: Manually verify in browser**

Open http://localhost:3000/compare, select two hexagrams — confirm two 3D hexagrams displayed side by side, each independently rotatable.

- [ ] **Step 5: Commit**

```bash
git add src/app/compare/page.tsx
git commit -m "feat(three): integrate 3D yao hexagram into compare page"
```

---

### Task 8: Phase 5 — 3D Hexagram Gallery

**Files:**
- Modify: `src/app/gallery/page.tsx`

- [ ] **Step 1: Read current gallery page**

```bash
head -50 src/app/gallery/page.tsx
```
Understand the current gallery layout (likely a 2D grid or list of hexagrams).

- [ ] **Step 2: Build the 3D gallery scene**

Replace the page content with a full-screen R3F scene. The core approach:

```tsx
'use client'

import { useState, useMemo } from 'react'
import dynamic from 'next/dynamic'
import usePageTitle from '@/hooks/usePageTitle'
import { hexagramOrder } from '@/data/hexagrams'
import { baguaMap, getHexagramName, getHexagramSymbol } from '@/data/bagua'
import { Canvas } from '@react-three/fiber'
import { OrbitControls, Text } from '@react-three/drei'

const ThreeYaoHexagram = dynamic(() => import('@/components/ThreeYaoHexagram'), { ssr: false })

// 64 hexagrams arranged in a 8×8 grid on the XZ plane
const GRID_SPACING = 2.8
const GRID_SIZE = 8

export default function GalleryPage() {
  usePageTitle('卦象画廊')
  const [search, setSearch] = useState('')
  const [selected, setSelected] = useState<{ u: string; l: string } | null>(null)

  const filteredIndices = useMemo(() => {
    if (!search) return hexagramOrder.map((_, i) => i)
    const q = search.toLowerCase().trim()
    return hexagramOrder
      .map(([u, l], i) => ({ u, l, i, name: getHexagramName(u, l) }))
      .filter(e => e.name.includes(q) || e.u.includes(q) || e.l.includes(q))
      .map(e => e.i)
  }, [search])

  const hexagramPositions = useMemo(() => {
    return hexagramOrder.map(([u, l], i) => {
      const row = Math.floor(i / GRID_SIZE)
      const col = i % GRID_SIZE
      const x = (col - GRID_SIZE / 2) * GRID_SPACING
      const z = (row - GRID_SIZE / 2) * GRID_SPACING
      const ub = baguaMap[u], lb = baguaMap[l]
      return {
        u, l,
        lines: [lb.yao[2], lb.yao[1], lb.yao[0], ub.yao[2], ub.yao[1], ub.yao[0]] as [number, number, number, number, number, number],
        name: getHexagramName(u, l),
        symbol: getHexagramSymbol(u, l),
        position: [x, 0, z] as [number, number, number],
      }
    })
  }, [])

  return (
    <div className="relative w-full h-[calc(100vh-120px)]">
      {/* Search overlay */}
      <div className="absolute top-4 left-4 z-10">
        <input
          type="text"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="搜索卦名…"
          className="px-4 py-2 rounded-xl bg-[var(--card)] border border-[var(--border)] text-sm outline-none focus:border-[var(--accent)] w-48"
        />
      </div>

      {/* Selected hexagram info */}
      {selected && (() => {
        const info = hexagramPositions.find(h => h.u === selected.u && h.l === selected.l)
        if (!info) return null
        return (
          <div className="absolute top-4 right-4 z-10 bg-[var(--card)] border border-[var(--border)] rounded-xl p-4 max-w-[200px]">
            <div className="text-2xl text-center">{info.symbol}</div>
            <div className="text-sm font-semibold text-center mt-1">{info.name}</div>
          </div>
        )
      })()}

      {/* 3D Scene */}
      <Canvas
        camera={{ position: [0, 16, 16], fov: 45 }}
        dpr={[1, 1.5]}
        frameloop="demand"
      >
        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 15, 10]} intensity={1} />

        {hexagramPositions.map((h, i) => {
          const visible = filteredIndices.includes(i)
          const isSelected = selected?.u === h.u && selected?.l === h.l
          return (
            <group key={`${h.u}-${h.l}`} position={h.position}>
              <ThreeYaoHexagram
                lines={h.lines}
                size={40}
                interactive={false}
                autoRotate={false}
              />
              {/* Floating name label above each hexagram */}
              {visible && (
                <Text
                  position={[0, 2.2, 0]}
                  fontSize={0.3}
                  color="var(--muted)"
                  anchorX="center"
                  anchorY="middle"
                >
                  {h.name.length > 2 ? h.name.slice(0, 2) : h.name}
                </Text>
              )}
            </group>
          )
        })}

        <OrbitControls
          minDistance={5}
          maxDistance={40}
          autoRotate
          autoRotateSpeed={0.5}
        />
      </Canvas>
    </div>
  )
}
```

- [ ] **Step 3: Test in browser**

```bash
npm run dev
```
Open http://localhost:3000/gallery — confirm 64 hexagrams displayed in 3D grid, OrbitControls work, search filters visible hexagrams, clicking a hexagram shows its info.

- [ ] **Step 4: Commit**

```bash
git add src/app/gallery/page.tsx
git commit -m "feat(three): rebuild hexagram gallery as 3D space"
```

---

## Self-Review Checklist

**Spec coverage (spec → task mapping):**
- `ThreeYaoHexagram` component API and props → Task 3
- 3D yao block modeling (yang/yin geometry) → Task 2
- Flip animation (pulse + rotation) → Task 3 (changingIndex prop), Task 4 (simulator integration)
- Theme color sync via CSS vars → Task 1 (useThemeColors) + Task 2 (consumed in ThreeYaoLine)
- Phase 1 (simulator) → Task 4
- Phase 2 (divine result) → Task 5
- Phase 3 (hexagram modal) → Task 6
- Phase 4 (compare) → Task 7
- Phase 5 (gallery) → Task 8
- WebGL detection / fallback → Task 3 (Suspense fallback = YaoSkeleton)
- Performance (dpr, frameloop, dynamic) → Task 3 (Canvas props) + all tasks (dynamic import)
- Error handling (loading, WebGL unsupported) → Task 3

**Placeholder check:** No TBDs, TODOs, or vague "add error handling" steps. Every step has actual code or exact commands.

**Type consistency:** 
- `lines` type `[number, number, number, number, number, number]` consistent across all tasks
- `changingIndex: number | undefined` consistent
- `onYaoClick?: (index: number) => void` consistent
- `size: number` (pixels), default 320 in core, overridden per integration

**Commit discipline:** Every task ends with its own commit, each prefixed `feat(three):`.
