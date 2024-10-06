'use client'

import { Float, Text, AccumulativeShadows, RandomizedLight, OrbitControls, Environment, useGLTF, useVideoTexture, PositionalAudio } from '@react-three/drei'
import { EffectComposer, Bloom, HueSaturation, TiltShift2, WaterEffect, Grid, Noise } from '@react-three/postprocessing'
import { Perf } from 'r3f-perf'
import * as THREE from 'three'
import { useThree, useFrame } from '@react-three/fiber'
import { Suspense, useRef, useEffect, useState } from 'react'
import Water from './Water'


//
//
export default function Experience() {
    const { camera } = useThree()
    const [audioListener] = useState(() => new THREE.AudioListener())
    const audioRef = useRef()

    useEffect(() => {
        camera.add(audioListener)
        return () => camera.remove(audioListener)
    }, [camera, audioListener])

    useFrame((state) => {
        if (audioRef.current) {
            audioRef.current.setDistanceModel('linear')
            audioRef.current.setRefDistance(20)
            audioRef.current.setRolloffFactor(1)
        }
    })

    return (
        <>
            <color attach="background" args={['#242424']} />
            <fog attach="fog" args={['#242424', 10, 25]} />
            <ambientLight intensity={2} />

            <OrbitControls autoRotate autoRotateSpeed={0.1} enableZoom={false} minPolarAngle={0} maxPolarAngle={Math.PI / 2.5} />

            <Perf />

            <Float>
                <Text
                    position={[0, 0.5, 0]}
                    font='./fonts/Montserrat-VariableFont_wght.ttf'
                    fontSize={1.5}
                    fontWeight="bold"
                    color="#eeeeff"
                    anchorX="center"
                    anchorY="middle"
                    maxWidth={10}
                    bevel={10}
                >
                    DYSTOPIA
                </Text>
            </Float>

            <Cookie distance={50} intensity={15} angle={0.6} penumbra={1} position={[2, 5, 0]} />
            <AccumulativeShadows receiveShadow temporal frames={100} opacity={0.8} alphaTest={0.9} scale={12} position={[0, -0.5, 0]}>
                <RandomizedLight radius={4} ambient={0.5} position={[5, 8, -10]} bias={0.001} />
            </AccumulativeShadows>
            
            {/* 기본 도형을 이용한 건물 생성 */}
            <City />

            {/* 중앙 오브젝트들 */}
            <mesh castShadow position={[-1.5, -0.245, 1]}>
                <sphereGeometry args={[0.25, 64, 64]} />
                <meshStandardMaterial color="#353535" />
            </mesh>
            <mesh castShadow position={[1.5, -0.24, 1]} rotation={[0, Math.PI / 4, 0]}>
                <boxGeometry args={[0.5, 0.5, 0.5]} />
                <meshStandardMaterial color="#353535" />
            </mesh>
            
            {/* 바닥 */}
            <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.51, 0]} scale={100}>
                <planeGeometry />
                <meshLambertMaterial color="#353535" />
            </mesh>
            
            <Environment preset="city" />
            <Postpro />
            <PositionalAudio
                ref={audioRef}
                url="/audio/underwater.wav"
                distance={1}
                loop
                autoplay
            />

        </>
    );
}

function City() {
    // 다양한 건물들 정의
    const buildings = [
        { position: [-2, 1.5, -6], scale: [1, 4, 1] },
        { position: [-3, 2.5, -4], scale: [2, 6, 2] },
        { position: [0, 3.5, -9], scale: [1.5, 8, 1.5] },
        { position: [3, 1.5, -8], scale: [1, 4, 1] },
        { position: [5, 2.5, -3], scale: [1.5, 6, 1.5] },
        { position: [-4, 4.5, -6], scale: [2, 10, 2] },
        { position: [4, 5.5, -8], scale: [2, 12, 2] },
        { position: [-5, 2.5, -5], scale: [1.5, 6, 1.5] },
    ];

    return (
        <>
            {buildings.map((building, index) => (
                <mesh key={index} position={building.position} scale={building.scale} castShadow receiveShadow>
                    <boxGeometry />
                    <meshStandardMaterial color="#131313" />
                </mesh>
            ))}
        </>
    );
}

function Postpro() {
    return (
      <EffectComposer disableNormalPass multisampling={0}>
        <HueSaturation saturation={-1} />
        <WaterEffect factor={0.75} />
        {/* <TiltShift2 samples={12} blur={0.5} resolutionScale={256}/> */}
        <Bloom mipmapBlur luminanceThreshold={0.5} intensity={1} />
        {/* <Grid /> */}
        <Noise premultiply  />
      </EffectComposer>
    );
}

function Cookie(props) {
    const texture = useVideoTexture('./vids/caustics.mp4');
    return <spotLight decay={0} map={texture} castShadow {...props} />;
}
