import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

export default function EmeraldVortex() {
    const particlesCount = 3000
    const points = useRef()

    const particleSizes = useMemo(() => {
        const sizes = new Float32Array(particlesCount)
        for(let i = 0; i < particlesCount; i++) {
            sizes[i] = THREE.MathUtils.randFloat(0.15, 0.35)
        }
        return sizes
    }, [])
    // 파티클 위치 생성
    // 추후 텍스쳐 업데이트 가능성 있음
    const particles = useMemo(() => {
        const positions = new Float32Array(particlesCount * 3)
        
        for(let i = 0; i < particlesCount; i++) {
            // 더 랜덤한 분포를 위한 수정
            const angle = Math.random() * Math.PI * 2
            // 반경을 더 랜덤하게 분포
            const radius = THREE.MathUtils.randFloat(6, 10) + (Math.random() - 0.5) * 2
            // 높이도 더 랜덤하게 분포
            const height = THREE.MathUtils.randFloat(-30, 30) * (1 + (Math.random() - 0.5) * 0.5)
            
            positions[i * 3] = Math.cos(angle) * radius
            positions[i * 3 + 1] = height
            positions[i * 3 + 2] = Math.sin(angle) * radius
        }
        
        return positions
    }, [])

    

    
    // 원형 그라데이션 텍스처 생성
    const particleTexture = useMemo(() => {
        const canvas = document.createElement('canvas')
        canvas.width = 64
        canvas.height = 64
        const context = canvas.getContext('2d')
        
        const gradient = context.createRadialGradient(
            32, 32, 0,
            32, 32, 32
        )
        gradient.addColorStop(0, 'rgba(255, 255, 255, 1)')
        gradient.addColorStop(1, 'rgba(255, 255, 255, 0)')
        
        context.fillStyle = gradient
        context.fillRect(0, 0, 64, 64)
        
        const texture = new THREE.CanvasTexture(canvas)
        texture.needsUpdate = true
        return texture
    }, [])

    useFrame((state, delta) => {
        const positions = points.current.geometry.attributes.position.array
        const sizes = points.current.geometry.attributes.size.array
    
        // 카메라 위치 및 회전 설정
        const time = state.clock.elapsedTime
        const radius = 3 // 카메라가 회전할 반경
        const height = Math.sin(time * 0.2) * 5 // 카메라 높이 변화 (-5 ~ 5)
        
        // 카메라 위치 설정
        state.camera.position.x = Math.cos(time * 0.5) * radius
        state.camera.position.z = Math.sin(time * 0.5) * radius
        state.camera.position.y = height
        
        // 카메라가 항상 약간 위쪽을 바라보도록 설정
        state.camera.lookAt(0, height + 2, 0)
    
        points.current.rotation.y += delta * 0.5
    
        for(let i = 0; i < particlesCount; i++) {
            const i3 = i * 3
            const x = positions[i3]
            const y = positions[i3 + 1]
            const z = positions[i3 + 2]
            
            // 높이에 따른 상승 속도 조절
            const speed = THREE.MathUtils.randFloat(1.0, 2.0) * (1 + Math.sin(y * 0.1) * 0.2)
            positions[i3 + 1] += delta * speed
            
            // 높이에 따른 회전 속도 조절
            const rotationSpeed = (2.0 - Math.abs(y) / 30) * (1 + Math.sin(state.clock.elapsedTime + i) * 0.1)
            const angle = Math.atan2(z, x) + delta * rotationSpeed * 2
            
            // 현재 높이에 따른 반경 계산 - 최소/최대 반경 조정
            const targetRadius = THREE.MathUtils.mapLinear(
                (positions[i3 + 1] + 30) / 60, // -30에서 30까지의 높이를 0~1로 정규화
                0, 1,
                5, 15 // 아래(0)일 때 5, 위(1)일 때 15의 반경
            )
            const currentRadius = Math.sqrt(x * x + z * z)
            const newRadius = THREE.MathUtils.lerp(currentRadius, targetRadius, delta * 2)
            positions[i3] = Math.cos(angle) * newRadius
            positions[i3 + 2] = Math.sin(angle) * newRadius
            
            // 위치 순환 로직 수정
            if(positions[i3 + 1] > 30) {
                positions[i3 + 1] = -30
                // 새로운 시작 위치를 기존 반경 근처로 설정
                const currentAngle = Math.atan2(positions[i3 + 2], positions[i3])
                const startRadius = currentRadius * 0.9 // 현재 반경의 90%로 시작
                positions[i3] = Math.cos(currentAngle) * startRadius
                positions[i3 + 2] = Math.sin(currentAngle) * startRadius
            }
    
            // 높이에 따른 크기 변화 - 순환적 계산
            const heightCycle = Math.abs((positions[i3 + 1] + 30) % 60 - 30) // 순환적 높이
            const sizeScale = THREE.MathUtils.mapLinear(heightCycle, 0, 30, 0.8, 1.2)
            sizes[i] = particleSizes[i] * sizeScale * (1 + Math.sin(state.clock.elapsedTime * 4 + heightCycle * 0.1) * 0.2)
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
                    array={particles}
                    itemSize={3}
                />
                <bufferAttribute
                    attach="attributes-size"
                    count={particlesCount}
                    array={particleSizes}
                    itemSize={1}
                />
            </bufferGeometry>
            <pointsMaterial
                color="#e0f7ff"
                transparent
                opacity={0.4}
                map={particleTexture}
                alphaMap={particleTexture}
                alphaTest={0.001}
                depthWrite={false}
                blending={THREE.AdditiveBlending}
                sizeAttenuation={true}
            />
        </points>
    )
}