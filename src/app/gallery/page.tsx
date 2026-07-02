'use client'

import { useState, useMemo, useCallback } from 'react'
import { useThemeColors } from '@/hooks/useThemeColors'
import usePageTitle from '@/hooks/usePageTitle'
import { hexagramOrder } from '@/data/hexagrams'
import { baguaMap, getHexagramName, getHexagramSymbol } from '@/data/bagua'
import { Canvas } from '@react-three/fiber'
import { OrbitControls, Text } from '@react-three/drei'

const GRID_SPACING = 2.8
const GRID_SIZE = 8

function HexagramGroup({ lines, opacity = 1 }: { lines: number[]; opacity?: number }) {
  const colors = useThemeColors()
  return (
    <group>
      {lines.map((yang, i) => {
        const color = yang === 1 ? colors.yang : colors.yin
        if (yang === 1) {
          return (
            <mesh key={i} position={[0, i * 0.35 - 0.875, 0]}>
              <boxGeometry args={[0.6, 0.08, 0.12]} />
              <meshPhysicalMaterial color={color} metalness={0.1} roughness={0.6} transparent opacity={opacity * 0.92} />
            </mesh>
          )
        }
        return (
          <group key={i} position={[0, i * 0.35 - 0.875, 0]}>
            <mesh position={[-0.18, 0, 0]}>
              <boxGeometry args={[0.25, 0.08, 0.12]} />
              <meshPhysicalMaterial color={color} metalness={0.1} roughness={0.6} transparent opacity={opacity * 0.92} />
            </mesh>
            <mesh position={[0.18, 0, 0]}>
              <boxGeometry args={[0.25, 0.08, 0.12]} />
              <meshPhysicalMaterial color={color} metalness={0.1} roughness={0.6} transparent opacity={opacity * 0.92} />
            </mesh>
          </group>
        )
      })}
    </group>
  )
}

export default function GalleryPage() {
  usePageTitle('卦象画廊 · 3D')
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
        lines: [lb.yao[2], lb.yao[1], lb.yao[0], ub.yao[2], ub.yao[1], ub.yao[0]] as number[],
        name: getHexagramName(u, l),
        symbol: getHexagramSymbol(u, l),
        position: [x, 0, z] as [number, number, number],
      }
    })
  }, [])

  const handleSelect = useCallback((u: string, l: string) => {
    setSelected(prev => (prev?.u === u && prev?.l === l) ? null : { u, l })
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

      {/* Selected hexagram info panel */}
      {selected && (() => {
        const info = hexagramPositions.find(h => h.u === selected.u && h.l === selected.l)
        if (!info) return null
        return (
          <div className="absolute top-4 right-4 z-10 bg-[var(--card)] border border-[var(--border)] rounded-xl p-4 max-w-[200px]">
            <div className="text-2xl text-center">{info.symbol}</div>
            <div className="text-sm font-semibold text-center mt-1">{info.name}</div>
            <button
              onClick={() => setSelected(null)}
              className="mt-2 text-xs text-[var(--muted)] hover:text-[var(--accent)] w-full text-center cursor-pointer"
            >
              关闭
            </button>
          </div>
        )
      })()}

      {/* 3D Scene — no nested Canvas: HexagramGroup renders meshes directly */}
      <Canvas
        camera={{ position: [0, 16, 16], fov: 45 }}
        dpr={[1, 1.5]}
        frameloop="demand"
      >
        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 15, 10]} intensity={1} />

        {hexagramPositions.map((h, i) => {
          const visible = filteredIndices.includes(i)
          const op = visible ? 1 : 0.15
          return (
            <group
              key={`${h.u}-${h.l}`}
              position={h.position}
              onClick={() => handleSelect(h.u, h.l)}
            >
              <HexagramGroup lines={h.lines} opacity={op} />
              {visible && (
                <Text
                  position={[0, 2.2, 0]}
                  fontSize={0.3}
                  color="#8899aa"
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
