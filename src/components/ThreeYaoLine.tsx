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
