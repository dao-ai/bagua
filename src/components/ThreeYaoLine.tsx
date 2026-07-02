'use client'
import { useState } from 'react'
import { BoxGeometry } from 'three'
import { useSpring, a } from '@react-spring/three'
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

  const color = yang ? colors.yang : colors.yin
  const emissive = isChanging ? colors.accent : '#000000'
  const scale = hovered ? 1.08 : 1

  const spring = useSpring({
    rotX: isChanging ? Math.PI : 0,
    glow: isChanging ? 0.5 : 0,
    config: { mass: 1, tension: 200, friction: 15 },
  })

  if (yang) {
    return (
      <a.mesh
        geometry={YANG_GEOM}
        position={[0, index * 1.2, 0]}
        scale={[scale, 1, 1]}
        rotation-x={spring.rotX}
        onClick={() => onClick?.(index)}
        onPointerEnter={() => setHovered(true)}
        onPointerLeave={() => setHovered(false)}
      >
        <a.meshPhysicalMaterial
          color={color}
          metalness={0.1}
          roughness={0.6}
          emissive={emissive}
          emissiveIntensity={spring.glow}
          transparent
          opacity={0.92}
        />
      </a.mesh>
    )
  }

  // 阴爻 — two short blocks with gap
  return (
    <a.group position={[0, index * 1.2, 0]}>
      <a.mesh
        geometry={YIN_HALF_GEOM}
        position={[-0.7, 0, 0]}
        scale={[scale, 1, 1]}
        rotation-x={spring.rotX}
        onClick={() => onClick?.(index)}
        onPointerEnter={() => setHovered(true)}
        onPointerLeave={() => setHovered(false)}
      >
        <a.meshPhysicalMaterial
          color={color}
          metalness={0.1}
          roughness={0.6}
          emissive={emissive}
          emissiveIntensity={spring.glow}
          transparent
          opacity={0.92}
        />
      </a.mesh>
      <a.mesh
        geometry={YIN_HALF_GEOM}
        position={[0.7, 0, 0]}
        scale={[scale, 1, 1]}
        rotation-x={spring.rotX}
        onClick={() => onClick?.(index)}
        onPointerEnter={() => setHovered(true)}
        onPointerLeave={() => setHovered(false)}
      >
        <a.meshPhysicalMaterial
          color={color}
          metalness={0.1}
          roughness={0.6}
          emissive={emissive}
          emissiveIntensity={spring.glow}
          transparent
          opacity={0.92}
        />
      </a.mesh>
    </a.group>
  )
}
