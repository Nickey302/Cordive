'use client';

import { useRef } from 'react';
import { Float, Text, OrbitControls, PerspectiveCamera } from "@react-three/drei";
import { EffectComposer, Bloom, Noise, Vignette } from '@react-three/postprocessing';
import { useFrame } from "@react-three/fiber";
import * as THREE from 'three';

// 개별 컴포넌트 import
import EmeraldVortex from "./EmeraldVortex";
import UnderwaterEnvironment from './UnderwaterEnvironment';
import Bubbles from './Bubbles';
import WaterSurface from './WaterSurface';
import { Perf } from 'r3f-perf';
import dynamic from 'next/dynamic';

const Effects = dynamic(() => import('./Effects'), { ssr: false });


// 배경 컴포넌트
function DeepSeaBackground() {
    return (
        <mesh castShadow receiveShadow position={[0, 0, -100]} rotation={[0, 0, 0]}>
            <planeGeometry  args={[300, 300]} /> {/* 크기 증가 */}            
                <shaderMaterial
                    fragmentShader={`
                        varying vec2 vUv;
                        void main() {
                            vec3 surfaceBlue = vec3(0.0, 0.2, 0.4); // 더 어두운 톤
                            vec3 deepBlue = vec3(0.0, 0.0, 0.1);    // 거의 검정에 가까운 파랑
                            vec3 color = mix(deepBlue, surfaceBlue, pow(vUv.y, 1.5));
                            gl_FragColor = vec4(color, 1.0);
                        }
                    `}
                    vertexShader={`
                        varying vec2 vUv;
                        void main() {
                            vUv = uv;
                            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
                        }
                    `}
                />
        </mesh>
    );
}

// 태양 컴포넌트
function Sun() {
    const sunRef = useRef()
    
    useFrame((state) => {
        const time = state.clock.elapsedTime
        sunRef.current.intensity = 1.5 + Math.sin(time) * 0.2
    })

    return (
        <directionalLight
            ref={sunRef}
            position={[50, 100, -50]}
            intensity={1.5}
            color="#4e7fa0" // 색상 수정 필요
            castShadow
        />
    )
}

// 광선 컴포넌트
function Rays() {
    const raysRef = useRef()
    
    useFrame((state) => {
        const time = state.clock.elapsedTime
        if (raysRef.current) {
            raysRef.current.rotation.y = time * 0.1
            raysRef.current.material.opacity = 0.3 + Math.sin(time * 0.5) * 0.1
        }
    })

    return (
        <mesh ref={raysRef} position={[0, 30, 0]} rotation={[0, 0, 0]}>
            <cylinderGeometry args={[0, 30, 60, 20, 10, true]} />
            <meshBasicMaterial
                color="#4e7fa0"
                transparent
                map={new THREE.TextureLoader().load('/assets/textures/rays.png')} // 텍스쳐 여기다가 넣을려고 넣어놓은 것 같아 일단 텍스쳐 적용해둠
                opacity={0.3}
                side={THREE.DoubleSide} // 양면 텍스쳐는 렌더링 2배로 필요해서 꼭 필요한 효과 아니면 제거 추천...
                blending={THREE.AdditiveBlending}
                depthWrite={false}
            />
        </mesh>
    )
}

// 메인 Experience 컴포넌트
export default function Experience() {
    return (
        <>
            <color args={['#48546d']} attach="background" />
            <fog attach="fog" args={['#48546d', 400, 400]} />

            <Perf position="top-left" /> {/* 성능 확인용으로 추가함 초반에 프레임 55-60 유지 권장 */}

            <ambientLight intensity={10} />
            <directionalLight position={[10, 10, 10]} intensity={1} color="#ffffff" />

            {/* Heterotopia page.jsx에도 카메라가 있어서 거기에서 수정하는걸 추천 초반 렌더링시 카메라 순간이동 */}
            
            <PerspectiveCamera
                makeDefault
                position={[0, 0, 30]} // 카메라를 소용돌이 안쪽으로 이동
                fov={75} // 시야각 확대
                near={0.1}
                far={500}
>
                <OrbitControls 
                    enableDamping
                    enableZoom={true}
                    enablePan={false}
                    enableRotate={true}
                    minDistance={5}  // 더 가깝게 볼 수 있도록
                    maxDistance={50} // 최대 거리 제한
                    minPolarAngle={Math.PI / 3}
                    maxPolarAngle={Math.PI * 2/3}
                />
            </PerspectiveCamera>
            
            {/* <DeepSeaBackground /> */}
            {/* <WaterSurface /> */}
            {/* <UnderwaterEnvironment /> */}
            {/* <Bubbles /> */}
            {/* <EmeraldVortex /> */}
            <Sun />
            {/* <Rays /> */}

            <Float floatIntensity={0.5} speed={0.5}>
                <Text
                    position={[0, 0, 0]}
                    fontSize={8}
                    color="#ffffff" // 색깔교체
                    anchorX="center"
                    anchorY="middle"
                    font="/assets/fonts/Montserrat-VariableFont_wght.ttf"
                >
                    HETEROTOPIA
                </Text>
            </Float>
        
            <EffectComposer disableNormalPass multisampling={0}>
                <Bloom 
                    mipmapBlur // 얘가 좀 이쁨 ㅋㅋ
                    intensity={3.0}
                    luminanceThreshold={0.1} // 지금 임계값을 넘는 색상이 없어 Bloom 효과가 없음, 예시로 텍스트 색상 하얀색으로 바꿔놓음 색깔 수정 필요
                    // luminanceSmoothing={0.9}
                    radius={0.8}
                />
                <Noise opacity={0.1} />
                <Vignette
                    offset={0.5}
                    darkness={0.45}
                    eskil={false}
                />
            </EffectComposer>

            {/* <Effects /> */}
        </>
    )
}