import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

export default function EmeraldVortex() {
    const particlesCount = 20000 // 입자 수 증가
    const points = useRef()

    const bubbleTexture = useMemo(() => {
        return new THREE.TextureLoader().load('/assets/textures/bubble.png')
    }, [])
    
    const particles = useMemo(() => {
        const positions = new Float32Array(particlesCount * 3)
        const sizes = new Float32Array(particlesCount)
        
        for(let i = 0; i < particlesCount; i++) {
            const i3 = i * 3
            const t = i / particlesCount
            
            // 구면 좌표계로 입자 분포 (카메라 주변을 감싸도록)
            const phi = Math.random() * Math.PI * 2
            const theta = Math.random() * Math.PI
            const radius = THREE.MathUtils.lerp(10, 100, Math.pow(Math.random(), 0.5))
            
            positions[i3] = radius * Math.sin(theta) * Math.cos(phi)
            positions[i3 + 1] = radius * Math.cos(theta)
            positions[i3 + 2] = radius * Math.sin(theta) * Math.sin(phi)
            
            // 크기를 더 크게, 카메라에 가까울수록 더 큰 입자
            sizes[i] = THREE.MathUtils.lerp(4.0, 1.0, radius / 100)
        }
        
        return { positions, sizes }
    }, [])

    useFrame((state, delta) => {
        const positions = points.current.geometry.attributes.position.array
        const sizes = points.current.geometry.attributes.size.array
        const time = state.clock.elapsedTime

        for(let i = 0; i < particlesCount; i++) {
            const i3 = i * 3
            const x = positions[i3]
            const y = positions[i3 + 1]
            const z = positions[i3 + 2]

            // 구면 좌표로 변환
            const radius = Math.sqrt(x * x + y * y + z * z)
            const theta = Math.acos(y / radius)
            const phi = Math.atan2(z, x)

            // 회전 속도는 중심에 가까울수록 빠르게
            const rotationSpeed = (1.0 - radius / 100) * delta * 2

            // 상승/하강 움직임
            const verticalSpeed = Math.sin(time + i * 0.1) * delta * 5

            // 새로운 위치 계산
            const newPhi = phi + rotationSpeed
            const newTheta = theta + verticalSpeed * 0.1

            // 구면 좌표를 직교 좌표로 변환
            positions[i3] = radius * Math.sin(newTheta) * Math.cos(newPhi)
            positions[i3 + 1] = radius * Math.cos(newTheta)
            positions[i3 + 2] = radius * Math.sin(newTheta) * Math.sin(newPhi)

            // 난류 효과 강화
            const turbulence = {
                x: Math.sin(time * 0.5 + i * 0.1) * 3,
                y: Math.cos(time * 0.3 + i * 0.05) * 3,
                z: Math.sin(time * 0.4 + i * 0.15) * 3
            }

            positions[i3] += turbulence.x
            positions[i3 + 1] += turbulence.y
            positions[i3 + 2] += turbulence.z

            // 크기 변화 - 더 동적으로
            const sizeScale = 1 + Math.sin(time * 2 + radius * 0.02) * 0.3
            sizes[i] = particles.sizes[i] * sizeScale
        }

        points.current.geometry.attributes.position.needsUpdate = true
        points.current.geometry.attributes.size.needsUpdate = true
    })

    return (
        <points ref={points}>
            <bufferGeometry>
                <bufferAttribute
                    attach="attributes-position"
                    count={particlesCount}
                    array={particles.positions}
                    itemSize={3}
                />
                <bufferAttribute
                    attach="attributes-size"
                    count={particlesCount}
                    array={particles.sizes}
                    itemSize={1}
                />
            </bufferGeometry>
            <pointsMaterial
                color="#4fc1e9"
                transparent
                opacity={0.9}
                size={1} // 기본 크기 더 증가
                sizeAttenuation={true}
                blending={THREE.AdditiveBlending}
                depthWrite={false}
                map={bubbleTexture}
                alphaMap={bubbleTexture}
                alphaTest={0.001}
            />
        </points>
    )
}