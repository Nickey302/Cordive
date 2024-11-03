'use client';

import { Float, Text, OrbitControls, useVideoTexture } from "@react-three/drei";
import { EffectComposer, Bloom, HueSaturation, WaterEffect, Noise, Glitch } from '@react-three/postprocessing'
import EmeraldVortex from "./EmeraldVortex";
import { useEffect } from "react";

function VideoBackground() {
    const videoTexture = useVideoTexture('./assets/vids/Underwater.mp4', {
        loop: true,
        muted: true,
        start: true,
    });

    return (
        <mesh position={[0, 0, -15]}>
            <planeGeometry args={[40, 25]} /> {/* 화면 비율에 맞게 조정 */}
            <meshBasicMaterial 
                map={videoTexture} 
                transparent 
                opacity={0.3} 
                color="#00ffcc"
                toneMapped={false}
            />
        </mesh>
    );
}

export default function Experience() {
    return (
        <>
            <color args={['#001a1a']} attach="background" />
            
            <OrbitControls 
                makeDefault 
                enableZoom={false}
                minPolarAngle={Math.PI / 3}
                maxPolarAngle={Math.PI / 2}
            />

            <ambientLight intensity={0.5} />
            <directionalLight position={[5, 5, 5]} intensity={0.5} />

            {/* 비디오 배경 추가 */}
            <VideoBackground />

            <Float>
                <Text
                    position={[0, 0, 0]}
                    font='./assets/fonts/Montserrat-VariableFont_wght.ttf'
                    fontSize={2}
                    fontWeight="bold"
                    color="#00ffcc"
                    anchorX="center"
                    anchorY="middle"
                    maxWidth={10}
                    bevel={10}
                >
                    HETEROTOPIA
                </Text>
            </Float>

            <EmeraldVortex />

            <EffectComposer disableNormalPass multisampling={0}>
                <HueSaturation saturation={0.5} />
                <WaterEffect factor={0.2} />
                <Bloom 
                    mipmapBlur 
                    luminanceThreshold={0.2} 
                    intensity={2} 
                />
                <Noise opacity={0.02} />
                <Glitch 
                    delay={[5, 10]}
                    duration={[0.2, 0.5]}
                    strength={[0.02, 0.03]}
                    active
                    ratio={0.85}
                />
            </EffectComposer>
        </>
    );
}