import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

export default function WaterSurface() {
    const waterRef = useRef()
    const causticRef = useRef()

    // 물결 셰이더
    const waterShader = {
        uniforms: {
            uTime: { value: 0 },
            uColorA: { value: new THREE.Color('#006994') },
            uColorB: { value: new THREE.Color('#0099dd') },
        },
        vertexShader: `
            uniform float uTime; // uTime Uniform 값으로 추가함
            varying vec2 vUv;
            varying float vElevation;
            
            void main() {
                vUv = uv;
                
                // 물결 효과 계산
                vec4 modelPosition = modelMatrix * vec4(position, 1.0);
                float elevation = sin(modelPosition.x * 3.0 + uTime * 2.0) *
                                sin(modelPosition.z * 2.0 + uTime * 1.5) * 0.2;
                
                modelPosition.y += elevation;
                vElevation = elevation;
                
                gl_Position = projectionMatrix * viewMatrix * modelPosition;
            }
        `,
        fragmentShader: `
            uniform vec3 uColorA;
            uniform vec3 uColorB;
            uniform float uTime;
            
            varying vec2 vUv;
            varying float vElevation;
            
            void main() {
                float mixStrength = (vElevation + 0.2) * 0.5;
                vec3 color = mix(uColorA, uColorB, mixStrength);
                
                // 반짝임 효과
                float shine = sin(vUv.x * 30.0 + uTime) * sin(vUv.y * 30.0 + uTime);
                color += shine * 0.1;
                
                gl_FragColor = vec4(color, 0.8);
            }
        `
    }

    useFrame((state) => {
        waterRef.current.material.uniforms.uTime.value = state.clock.elapsedTime
        causticRef.current.rotation.z += 0.001
        causticRef.current.material.opacity = 0.3 + Math.sin(state.clock.elapsedTime) * 0.1
    })

    return (
        <group position={[0, 50, 0]}>
            {/* 물 표면 */}
            <mesh ref={waterRef} rotation={[-Math.PI / 2, 0, 0]}>
                <planeGeometry args={[200, 200, 100, 100]} />
                <shaderMaterial
                    {...waterShader}
                    transparent={true}
                    side={THREE.DoubleSide}
                />
            </mesh>

            {/* 물결 투영 효과 */}
            <mesh ref={causticRef} position={[0, -1, 0]} rotation={[-Math.PI / 2, 0, 0]}>
                <planeGeometry args={[200, 200]} />
                <meshBasicMaterial
                    transparent
                    opacity={0.3}
                    blending={THREE.AdditiveBlending}
                    map={new THREE.TextureLoader().load('/assets/textures/gradient.png')} // 뭔지 몰라서 아무거나 적용해놓음
                    side={THREE.DoubleSide}
                />
            </mesh>
        </group>
    )
}