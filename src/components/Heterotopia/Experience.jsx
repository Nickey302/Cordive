'use client';

import { useState, useEffect } from "react";
import { Float, Text, useGLTF, OrbitControls } from "@react-three/drei";
import { useSpring, animated } from '@react-spring/three';

export default function Experience({ analysisResult }) {
    const Clouds = useGLTF('./assets/Models/Clouds.glb');
    const [displayText, setDisplayText] = useState('');
    const [showText, setShowText] = useState(false);

    useEffect(() => {
        Clouds.scene.traverse((child) => {
            if (child.isMesh) {
                child.material.wireframe = true;
            }
        });
    }, [Clouds]);

    useEffect(() => {
        setDisplayText(analysisResult);
        setShowText(true);
    }, [analysisResult]);

    const textSpring = useSpring({
        opacity: showText ? 1 : 0,
        config: { duration: 3000 },
    });

    return (
        <>
            <color args={ [ '#667B9D' ] } attach="background" />

            <OrbitControls makeDefault />

            <ambientLight intensity={ 1.0 }/>
            <directionalLight />

            <Float>
                <Text
                    position={[0, 2.5, 0]}
                    font='./assets/fonts/Montserrat-VariableFont_wght.ttf'
                    fontSize={1.5}
                    fontWeight="bold"
                    color="#5CA3A5"
                    anchorX="center"
                    anchorY="middle"
                    maxWidth={10}
                    bevel={ 10 }
                >
                    HETEROTOPIA
                </Text>
            </Float>
            <primitive object={Clouds.scene} scale={10} />

            {showText && (
                <animated.group style={textSpring}>
                    <Text
                        position={[0.5, 1, 3]}
                        font='./assets/fonts/Montserrat-VariableFont_wght.ttf'
                        fontSize={1}
                        color="#FFFFFF"
                        anchorX="center"
                        anchorY="middle"
                        maxWidth={10}
                    >
                        {displayText}
                    </Text>
                </animated.group>
            )}
        </>
    );
}

useGLTF.preload('./assets/Models/Clouds.glb');
