'use client'

import { Canvas } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import { Suspense } from 'react'
import ThreeYaoLine from './ThreeYaoLine'
import YaoSkeleton from './YaoSkeleton'
import { useWebGLSupport } from '@/hooks/useWebGLSupport'
import { HexagramDisplay } from '@/components/Yao'

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

  const webgl = useWebGLSupport()
  const handleClick = (index: number) => {
    if (interactive) onYaoClick?.(index)
  }

  if (!webgl) {
    return (
      <div style={{ width: size, height: Math.round(size * 0.85) }} className="flex items-center justify-center">
        <HexagramDisplay yao6={lines} />
      </div>
    )
  }

  return (
    <div style={{ width: size, height: Math.round(size * 0.85) }}>
      <Suspense fallback={<YaoSkeleton size={size} />}>
        <Canvas
          camera={{ position: [0, 3, 7], fov: 50 }}
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

          {interactive && (
            <OrbitControls
              target={[0, 3, 0]}
              enablePan={false}
              minDistance={3}
              maxDistance={10}
              autoRotate={autoRotate}
              autoRotateSpeed={1.5}
            />
          )}

          {!interactive && autoRotate && (
            <OrbitControls
              target={[0, 3, 0]}
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
