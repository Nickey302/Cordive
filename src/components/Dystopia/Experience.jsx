'use client'

import { Float, Text, useGLTF, OrbitControls } from "@react-three/drei";
import Water from './Water.jsx'
//
//
//
export default function Experience() {
    return (
        <>
            <color args={ [ '#333345' ] } attach="background" />

            <OrbitControls makeDefault />

            <ambientLight intensity={ 1.5 }/>
            <directionalLight color={ [ '#633ccf' ] } intensity={3} />

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
                    bevel={ 10 }
                >
                    DYSTOPIA
                </Text>
            </Float>
            <Water />
        </>
    );
}
