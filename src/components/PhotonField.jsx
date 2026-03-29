import { useRef, useMemo, useCallback, useEffect } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'

const PARTICLE_COUNT = 3000
const FIELD_RADIUS = 12
const MOUSE_INFLUENCE = 2.8
const MOUSE_RADIUS = 5
const DRIFT_SPEED = 0.06
const RETURN_SPEED = 0.01
const DEPTH_RANGE = 6

function Particles({ mouse, scrollProgress, theme }) {
  const meshRef = useRef()
  const { viewport } = useThree()

  const { positions, velocities, basePositions, sizes, opacities } = useMemo(() => {
    const positions = new Float32Array(PARTICLE_COUNT * 3)
    const velocities = new Float32Array(PARTICLE_COUNT * 3)
    const basePositions = new Float32Array(PARTICLE_COUNT * 3)
    const sizes = new Float32Array(PARTICLE_COUNT)
    const opacities = new Float32Array(PARTICLE_COUNT)

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const theta = Math.random() * Math.PI * 2
      const phi = Math.acos(2 * Math.random() - 1)
      const r = Math.pow(Math.random(), 0.55) * FIELD_RADIUS

      const x = r * Math.sin(phi) * Math.cos(theta)
      const y = r * Math.sin(phi) * Math.sin(theta)
      const z = (Math.random() - 0.5) * DEPTH_RANGE

      positions[i * 3] = x
      positions[i * 3 + 1] = y
      positions[i * 3 + 2] = z
      basePositions[i * 3] = x
      basePositions[i * 3 + 1] = y
      basePositions[i * 3 + 2] = z
      velocities[i * 3] = 0
      velocities[i * 3 + 1] = 0
      velocities[i * 3 + 2] = 0

      const roll = Math.random()
      if (roll < 0.03) {
        sizes[i] = 0.18 + Math.random() * 0.14
        opacities[i] = 0.6 + Math.random() * 0.4
      } else if (roll < 0.15) {
        sizes[i] = 0.08 + Math.random() * 0.1
        opacities[i] = 0.4 + Math.random() * 0.45
      } else {
        sizes[i] = 0.03 + Math.random() * 0.06
        opacities[i] = 0.2 + Math.random() * 0.5
      }
    }

    return { positions, velocities, basePositions, sizes, opacities }
  }, [])

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uPixelRatio: { value: Math.min(window.devicePixelRatio, 2) },
      uMouseInfluence: { value: 0 },
      uColorA: { value: new THREE.Color('#c4a8e8') },
      uColorB: { value: new THREE.Color('#8aa4bc') },
      uColorC: { value: new THREE.Color('#e8c4a0') },
    }),
    [],
  )

  useEffect(() => {
    const isDark = theme === 'dark'
    uniforms.uColorA.value.set(isDark ? '#c4a8e8' : '#b57edc')
    uniforms.uColorB.value.set(isDark ? '#8aa4bc' : '#7ba3c4')
    uniforms.uColorC.value.set(isDark ? '#e8c4a0' : '#d4a574')
  }, [theme, uniforms])

  useFrame((state, delta) => {
    if (!meshRef.current) return

    const time = state.clock.elapsedTime
    uniforms.uTime.value = time

    const mouseX = (mouse.current.x / viewport.width) * FIELD_RADIUS * 2
    const mouseY = (mouse.current.y / viewport.height) * FIELD_RADIUS * 2
    const mouseActive = Math.abs(mouse.current.x) > 0.001 || Math.abs(mouse.current.y) > 0.001

    uniforms.uMouseInfluence.value += ((mouseActive ? 1 : 0) - uniforms.uMouseInfluence.value) * 0.05

    const posAttr = meshRef.current.geometry.attributes.position
    const arr = posAttr.array

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const i3 = i * 3
      const bx = basePositions[i3]
      const by = basePositions[i3 + 1]
      const bz = basePositions[i3 + 2]

      const driftX = Math.sin(time * DRIFT_SPEED + i * 0.37) * 0.2
      const driftY = Math.cos(time * DRIFT_SPEED * 0.7 + i * 0.53) * 0.16
      const driftZ = Math.sin(time * DRIFT_SPEED * 0.5 + i * 0.71) * 0.1

      const targetX = bx + driftX
      const targetY = by + driftY
      const targetZ = bz + driftZ

      if (mouseActive) {
        const dx = arr[i3] - mouseX
        const dy = arr[i3 + 1] - mouseY
        const dist = Math.sqrt(dx * dx + dy * dy)

        if (dist < MOUSE_RADIUS) {
          const force = (1 - dist / MOUSE_RADIUS) * MOUSE_INFLUENCE
          const angle = Math.atan2(dy, dx)
          velocities[i3] += Math.cos(angle) * force * delta
          velocities[i3 + 1] += Math.sin(angle) * force * delta
          velocities[i3 + 2] += (Math.random() - 0.5) * force * delta * 0.3
        }
      }

      velocities[i3] *= 0.92
      velocities[i3 + 1] *= 0.92
      velocities[i3 + 2] *= 0.94

      arr[i3] += (targetX - arr[i3]) * RETURN_SPEED + velocities[i3]
      arr[i3 + 1] += (targetY - arr[i3 + 1]) * RETURN_SPEED + velocities[i3 + 1]
      arr[i3 + 2] += (targetZ - arr[i3 + 2]) * RETURN_SPEED + velocities[i3 + 2]
    }

    posAttr.needsUpdate = true

    const scroll = scrollProgress.current
    meshRef.current.rotation.y = scroll * 0.3
    meshRef.current.position.y = -scroll * 2
  })

  const vertexShader = `
    attribute float aSize;
    attribute float aOpacity;
    uniform float uTime;
    uniform float uPixelRatio;
    varying float vOpacity;
    varying vec3 vPosition;
    
    void main() {
      vOpacity = aOpacity;
      vPosition = position;
      
      vec4 modelPosition = modelMatrix * vec4(position, 1.0);
      vec4 viewPosition = viewMatrix * modelPosition;
      vec4 projectedPosition = projectionMatrix * viewPosition;
      
      gl_Position = projectedPosition;
      
      float pulse = sin(uTime * 0.4 + position.x * 0.6 + position.y * 0.5) * 0.25 + 0.75;
      gl_PointSize = aSize * uPixelRatio * 420.0 * pulse;
      gl_PointSize *= (1.0 / -viewPosition.z);
    }
  `

  const fragmentShader = `
    uniform float uTime;
    uniform float uMouseInfluence;
    uniform vec3 uColorA;
    uniform vec3 uColorB;
    uniform vec3 uColorC;
    varying float vOpacity;
    varying vec3 vPosition;
    
    void main() {
      float distToCenter = length(gl_PointCoord - 0.5);
      if (distToCenter > 0.5) discard;
      
      float alpha = 1.0 - smoothstep(0.0, 0.5, distToCenter);
      alpha = pow(alpha, 1.5);
      
      float colorMix = sin(vPosition.x * 0.3 + uTime * 0.15) * 0.5 + 0.5;
      float colorMix2 = cos(vPosition.y * 0.25 + uTime * 0.12) * 0.5 + 0.5;
      
      vec3 color = mix(uColorA, uColorB, colorMix);
      color = mix(color, uColorC, colorMix2 * 0.35);
      
      color += vec3(0.1) * uMouseInfluence;
      
      gl_FragColor = vec4(color, alpha * vOpacity * 0.9);
    }
  `

  return (
    <points ref={meshRef} frustumCulled={false}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={PARTICLE_COUNT}
          array={positions}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-aSize"
          count={PARTICLE_COUNT}
          array={sizes}
          itemSize={1}
        />
        <bufferAttribute
          attach="attributes-aOpacity"
          count={PARTICLE_COUNT}
          array={opacities}
          itemSize={1}
        />
      </bufferGeometry>
      <shaderMaterial
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  )
}

export default function PhotonField({ theme }) {
  const mouse = useRef({ x: 0, y: 0 })
  const scrollProgress = useRef(0)
  const containerRef = useRef(null)

  const onMouseMove = useCallback((e) => {
    const rect = containerRef.current?.getBoundingClientRect()
    if (!rect) return
    mouse.current.x = ((e.clientX - rect.left) / rect.width - 0.5) * 2
    mouse.current.y = -((e.clientY - rect.top) / rect.height - 0.5) * 2
  }, [])

  const onMouseLeave = useCallback(() => {
    mouse.current.x = 0
    mouse.current.y = 0
  }, [])

  useEffect(() => {
    const onScroll = () => {
      const h = document.documentElement.scrollHeight - window.innerHeight
      scrollProgress.current = h > 0 ? window.scrollY / h : 0
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 z-0"
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
    >
      <Canvas
        camera={{ position: [0, 0, 10], fov: 55 }}
        dpr={[1, 2]}
        gl={{
          antialias: false,
          alpha: true,
          powerPreference: 'high-performance',
        }}
        style={{ background: 'transparent' }}
      >
        <Particles mouse={mouse} scrollProgress={scrollProgress} theme={theme} />
      </Canvas>
    </div>
  )
}
