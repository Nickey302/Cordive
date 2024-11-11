'use client';

import { useRef } from 'react';
import { Float, Text, OrbitControls, Environment, Sky, MeshReflectorMaterial } from "@react-three/drei";
import { EffectComposer, Bloom, Noise, DepthOfField } from '@react-three/postprocessing';
import Water from './Water/Water.jsx';
import dynamic from 'next/dynamic';
import { Perf } from 'r3f-perf';
import * as THREE from 'three';
import { Model as Computer } from './Computer.jsx';
import { Physics, RigidBody } from '@react-three/rapier';
// const Effects = dynamic(() => import('./Effects'), { ssr: false });
//
//
//
export default function Experience() {
    return (
        <>
            {/* <Perf /> */}
            {/* <color attach="background" args={['black']} />
            <fog attach="fog" args={['black', 10, 300]} /> */}

            <hemisphereLight intensity={0.15} groundColor="black" />
            <spotLight decay={0} position={[10, 20, 50]} angle={0.12} penumbra={1} intensity={1} castShadow shadow-mapSize={1024} />

            {/* <ambientLight intensity={1} />
            <directionalLight position={[10, 10, 10]} intensity={1} color="#3c7475" /> */}

            <OrbitControls
                makeDefault
                enableDamping
                dampingFactor={0.01}
                minPolarAngle={- Math.PI / 2}
                maxPolarAngle={Math.PI / 2}
            />


            <Environment
                files={"/assets/HDRI/Dystopia.hdr"}
                background
                environmentIntensity={0.2}
                backgroundBlurriness={0.1}
            />

            <Water />

            <Float floatIntensity={0.5} speed={0.5}>
                <Text
                    receiveShadow
                    castShadow
                    position={[0, 10, 0]}
                    fontSize={8}
                    color="#ffffff"
                    anchorX="center"
                    anchorY="middle"
                    // font="/assets/fonts/Montserrat-VariableFont_wght.ttf"
                    font="/assets/fonts/Neocode.woff"
                >
                    HETEROTOPIA
                </Text>
            </Float>

            <Physics>
                {/* 바닥 */}
                <RigidBody type="fixed" colliders="trimesh">
                    <mesh receiveShadow position={[0, -1, 0]} rotation={[-Math.PI / 2, 0, 0]}>
                        <planeGeometry args={[400, 400]} />
                        <MeshReflectorMaterial
                            blur={[300, 30]}
                            resolution={1024}
                            mixBlur={1}
                            mixStrength={180}
                            roughness={1}
                            depthScale={1.2}
                            minDepthThreshold={0.4}
                            maxDepthThreshold={1.4}
                            color="#202020"
                            metalness={0.8}
                        />
                    </mesh>
                </RigidBody>

                {/* 테스트용 박스들 */}
                {[...Array(5)].map((_, i) => (
                    <RigidBody key={i} colliders="cuboid" position={[
                        Math.random() * 10 - 5,
                        10 + i * 2,
                        Math.random() * 10 - 5
                    ]}>
                        <mesh castShadow>
                            <boxGeometry args={[2, 2, 2]} />
                            <meshStandardMaterial color={
                                i === 0 ? '#4E7FA0' :
                                i === 1 ? '#48546D' :
                                i === 2 ? '#3c7475' :
                                i === 3 ? '#426363' :
                                '#ffffff'
                            } />
                        </mesh>
                    </RigidBody>
                ))}
            </Physics>
        
            <EffectComposer disableNormalPass multisampling={0}>
                <Bloom 
                    mipmapBlur
                    intensity={0.8}
                    luminanceThreshold={0.5}
                    luminanceSmoothing={0.1}
                />
                <Noise opacity={0.08} />
            </EffectComposer>
        </>
    )
}