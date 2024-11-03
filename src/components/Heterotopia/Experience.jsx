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

// 배경 컴포넌트
function DeepSeaBackground() {
    return (
        <mesh position={[0, 0, -100]} rotation={[0, 0, 0]}>
            <planeGeometry args={[300, 300]} /> {/* 크기 증가 */}            <shaderMaterial
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
            color="#4fc1e9"
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
                color="#4fc1e9"
                transparent
                opacity={0.3}
                side={THREE.DoubleSide}
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
            <color args={['#000033']} attach="background" />
            <fog attach="fog" args={['#000033', 20, 100]} /> 
            
            <PerspectiveCamera
                makeDefault
                position={[0, 0, 30]} // 카메라를 소용돌이 안쪽으로 이동
                fov={75} // 시야각 확대
                near={0.1}
                far={1000}
>
                <OrbitControls 
                    enableZoom={true}
                    enablePan={false}
                    enableRotate={true}
                    minDistance={5}  // 더 가깝게 볼 수 있도록
                    maxDistance={50} // 최대 거리 제한
                    minPolarAngle={Math.PI / 3}
                    maxPolarAngle={Math.PI * 2/3}
                />
</PerspectiveCamera>
            
            <DeepSeaBackground />
            <WaterSurface />
            <UnderwaterEnvironment />
            <Bubbles />
            <EmeraldVortex />
            <Sun />
            <Rays />

            <Float floatIntensity={0.5} speed={0.5}>
                <Text
                    position={[0, 0, 0]}
                    fontSize={8}
                    color="#4fc1e9"
                    anchorX="center"
                    anchorY="middle"
                    font="./assets/fonts/Montserrat-VariableFont_wght.ttf"
                >
                    HETEROTOPIA
                </Text>
            </Float>

            <EffectComposer>
                <Bloom 
                    intensity={1.5}
                    luminanceThreshold={0.1}
                    luminanceSmoothing={0.9}
                    radius={0.8}
                />
                <Noise opacity={0.05} />
                <Vignette
                    offset={0.5}
                    darkness={0.7}
                    eskil={false}
                />
            </EffectComposer>
        </>
    )
}