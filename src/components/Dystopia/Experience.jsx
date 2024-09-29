'use client'

import { Float, Text, useGLTF, OrbitControls } from "@react-three/drei";
//
//
//
export default function Experience() {
    return (
        <>
            <color args={ [ '#667B9D' ] } attach="background" />

            <OrbitControls makeDefault />

            <ambientLight intensity={ 1.0 }/>
            <directionalLight />

            <Float>
                <Text
                    position={[0, 2.5, 0]}
                    font='./fonts/Montserrat-VariableFont_wght.ttf'
                    fontSize={1.5}
                    fontWeight="bold"
                    color="#5CA3A5"
                    anchorX="center"
                    anchorY="middle"
                    maxWidth={10}
                    bevel={ 10 }
                >
                    DYSTOPIA
                </Text>
            </Float>
        </>
    );
}
