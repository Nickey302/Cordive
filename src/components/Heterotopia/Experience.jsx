'use client';

import { useRef, useState } from 'react';
import { Float, Text, OrbitControls, Environment, Sky, MeshReflectorMaterial } from "@react-three/drei";
import { EffectComposer, Bloom, Noise } from '@react-three/postprocessing';
import Water from './Water/Water.jsx';
import { Perf } from 'r3f-perf';
import * as THREE from 'three';
import { Physics, RigidBody } from '@react-three/rapier';
import SurveyOverlay from '../Survey/SurveyOverlay.jsx';
import { Html } from '@react-three/drei';
import CustomObject from '../CustomObject';
//
//
//
export default function Experience() {
    const [showSurvey, setShowSurvey] = useState(true);
    const [customObject, setCustomObject] = useState(null);

    const handleSurveyComplete = (results) => {
        setCustomObject(results);
        setShowSurvey(false);
    };

    // 도형 타입에 따른 geometry를 반환하는 컴포넌트
    const GeometrySelector = ({ type }) => {
        switch(type.toLowerCase()) {
            case '정육면체':
                return <boxGeometry args={[2, 2, 2]} />;
            case '구':
                return <sphereGeometry args={[1, 32, 32]} />;
            case '원뿔':
                return <coneGeometry args={[1, 2, 32]} />;
            case '원기둥':
                return <cylinderGeometry args={[1, 1, 2, 32]} />;
            case '토러스':
                return <torusGeometry args={[1, 0.4, 16, 32]} />;
            case '정사면체':
                return <tetrahedronGeometry args={[1]} />;
            default:
                return <boxGeometry args={[1, 1, 1]} />;
        }
    };

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
                minPolarAngle={Math.PI / 3}
                maxPolarAngle={Math.PI / 2 - 0.1}
                maxDistance={275}
                minDistance={30}
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
                    font="/assets/fonts/NeoCode.woff"
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
                            attach="material"
                            clipBias={0.003}
                            blur={[300, 30]}
                            resolution={256}
                            mixBlur={1}
                            mixStrength={180}
                            roughness={1}
                            depthScale={1.2}
                            minDepthThreshold={0.4}
                            maxDepthThreshold={1.4}
                            color="#202020"
                            mirror={0.75}
                            metalness={0.8}
                            reflectorOffset={0.2}
                        />
                    </mesh>
                </RigidBody>

                {/* 테스트용 박스들 */}
                {[...Array(8)].map((_, i) => (
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
                <Noise opacity={0.07} />
            </EffectComposer>

            {customObject && (
                <CustomObject 
                    geometry={customObject.geometry}
                    position={customObject.position}
                    color={customObject.color}
                    onClick={() => alert(customObject.label)}
                />
            )}
            
            {showSurvey && (
                <Html center>
                    <SurveyOverlay onComplete={handleSurveyComplete} />
                </Html>
            )}
        </>
    )
}