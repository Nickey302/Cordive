import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

export default function Bubbles() {
    const particlesCount = 3000 // 물방울 수 증가
    const points = useRef()

    // 버블 텍스처 로드
    const bubbleTexture = useMemo(() => {
        return new THREE.TextureLoader().load('/assets/textures/bubble.png')
    }, [])

    const particles = useMemo(() => {
        const positions = new Float32Array(particlesCount * 3)
        const sizes = new Float32Array(particlesCount)
        
        for(let i = 0; i < particlesCount; i++) {
            // 넓은 범위에 분포
            positions[i * 3] = THREE.MathUtils.randFloat(-100, 100)
            positions[i * 3 + 1] = THREE.MathUtils.randFloat(-100, 100)
            positions[i * 3 + 2] = THREE.MathUtils.randFloat(-100, 100)
            
            sizes[i] = THREE.MathUtils.randFloat(0.5, 2) // 크기 범위 확대
        }
        
        return { positions, sizes }
    }, [])

    useFrame((state, delta) => {
        const positions = points.current.geometry.attributes.position.array
        const sizes = points.current.geometry.attributes.size.array

        for(let i = 0; i < particlesCount; i++) {
            const i3 = i * 3
            
            // 상승 운동
            positions[i3 + 1] += delta * (0.5 + Math.sin(state.clock.elapsedTime + i) * 0.5)
            
            // 좌우 흔들림
            positions[i3] += Math.sin(state.clock.elapsedTime * 0.5 + i) * delta * 0.5
            positions[i3 + 2] += Math.cos(state.clock.elapsedTime * 0.5 + i) * delta * 0.5

            // 경계 체크
            if(positions[i3 + 1] > 100) {
                positions[i3 + 1] = -100
                positions[i3] = THREE.MathUtils.randFloat(-100, 100)
                positions[i3 + 2] = THREE.MathUtils.randFloat(-100, 100)
            }

            // 크기 변화
            sizes[i] = particles.sizes[i] * (1 + Math.sin(state.clock.elapsedTime * 2 + i) * 0.2)
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
                opacity={0.7}
                size={0.5}
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