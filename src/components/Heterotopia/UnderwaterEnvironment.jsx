import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

export default function UnderwaterEnvironment() {
    // 해저 바닥 생성
    const seaFloor = useRef()
    const rocks = useRef([])
    
    // 해저 바닥 텍스처
    const floorTexture = useMemo(() => {
        const texture = new THREE.TextureLoader().load('/assets/textures/sand.png') // 텍스쳐 적용함
        texture.wrapS = texture.wrapT = THREE.RepeatWrapping
        texture.repeat.set(10, 10)
        return texture
    }, [])

    // 바위들 생성
    const createRocks = useMemo(() => {
        const rockGeometries = []
        const rockCount = 50

        for(let i = 0; i < rockCount; i++) {
            const geometry = new THREE.IcosahedronGeometry(
                THREE.MathUtils.randFloat(2, 5), // 크기
                1 // detail level
            )
            
            // 바위 모양 불규칙하게 만들기
            const positions = geometry.attributes.position
            for(let j = 0; j < positions.count; j++) {
                const vertex = new THREE.Vector3()
                vertex.fromBufferAttribute(positions, j)
                vertex.multiplyScalar(1 + Math.random() * 0.2)
                positions.setXYZ(j, vertex.x, vertex.y, vertex.z)
            }

            rockGeometries.push(geometry)
        }

        return rockGeometries
    }, [])

    // 안개 효과를 위한 파티클
    const fogParticles = useRef()
    const fogParticlesCount = 1000

    const fogParticlesPositions = useMemo(() => {
        const positions = new Float32Array(fogParticlesCount * 3)
        for(let i = 0; i < fogParticlesCount; i++) {
            positions[i * 3] = THREE.MathUtils.randFloat(-100, 100)
            positions[i * 3 + 1] = THREE.MathUtils.randFloat(0, 50)
            positions[i * 3 + 2] = THREE.MathUtils.randFloat(-100, 100)
        }
        return positions
    }, [])

    useFrame((state, delta) => {
        // 해저 안개 움직임
        const positions = fogParticles.current.geometry.attributes.position.array
        for(let i = 0; i < fogParticlesCount; i++) {
            const i3 = i * 3
            positions[i3] += Math.sin(state.clock.elapsedTime * 0.1 + i) * 0.02
            positions[i3 + 1] += Math.cos(state.clock.elapsedTime * 0.1 + i) * 0.02
            positions[i3 + 2] += Math.sin(state.clock.elapsedTime * 0.1 + i) * 0.02
        }
        fogParticles.current.geometry.attributes.position.needsUpdate = true
    })

    return (
        <group>
            {/* 해저 바닥 */}
            <mesh 
                ref={seaFloor} 
                rotation={[-Math.PI / 2, 0, 0]} 
                position={[0, -30, 0]}
            >
                <planeGeometry args={[200, 200, 50, 50]} />
                <meshStandardMaterial
                    color="#1a4a5f"
                    normalMap={floorTexture}
                    normalScale={[0.5, 0.5]}
                    roughness={0.8}
                    metalness={0.2}
                    side={THREE.DoubleSide}
                />
            </mesh>

            {/* 바위들 */}
            {createRocks.map((geometry, index) => (
                <mesh
                    key={index}
                    ref={el => rocks.current[index] = el}
                    geometry={geometry}
                    position={[
                        THREE.MathUtils.randFloat(-80, 80),
                        -28,
                        THREE.MathUtils.randFloat(-80, 80)
                    ]}
                    rotation={[
                        Math.random() * Math.PI,
                        Math.random() * Math.PI,
                        Math.random() * Math.PI
                    ]}
                >
                    <meshStandardMaterial
                        color="#2a5a6f"
                        roughness={0.9}
                        metalness={0.1}
                    />
                </mesh>
            ))}

            {/* 해저 안개 */}
            <points ref={fogParticles}>
                <bufferGeometry>
                    <bufferAttribute
                        attach="attributes-position"
                        count={fogParticlesCount}
                        array={fogParticlesPositions}
                        itemSize={3}
                    />
                </bufferGeometry>
                <pointsMaterial
                    color="#234758"
                    size={0.5}
                    transparent
                    opacity={0.2}
                    blending={THREE.AdditiveBlending}
                    depthWrite={false}
                />
            </points>

            {/* 주변 조명 */}
            <ambientLight intensity={1.0} />
            <directionalLight 
                position={[50, 50, -50]} 
                intensity={0.5}
                color="#447799"
            />
        </group>
    )
}