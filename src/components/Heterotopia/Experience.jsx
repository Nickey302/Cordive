'use client';

import { Float, Text, useGLTF, OrbitControls, Preload } from "@react-three/drei";
import { useEffect } from "react";
//
//
//
export default function Experience() {
    const Clouds = useGLTF('./assets/Models/Clouds.glb');

    useEffect(() => {
        Clouds.scene.traverse((child) => {
            if (child.isMesh) {
                child.material.wireframe = true;
            }
        });
    }, [Clouds]);

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
            <primitive object={Clouds.scene} scale={10} />
        </>
    );
}

useGLTF.preload('./assets/Models/Clouds.glb');