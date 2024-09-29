'use client'

import { useFrame } from '@react-three/fiber'
import { Text, useGLTF, Stage, Environment, OrbitControls } from '@react-three/drei'
import { useRef } from 'react'
import { Perf } from 'r3f-perf'
import * as THREE from 'three'
//
//
//
export default function Experience() {
    const love = useGLTF('./Models/love.glb')
    const liberation = useGLTF('./Models/liberation.glb')
    const revolution = useGLTF('./Models/revolution.glb')
    const resistance = useGLTF('./Models/resistance.glb')
    const isolation = useGLTF('./Models/isolation.glb')
    const compliance = useGLTF('./Models/compliance.glb')
    // console.log(love);

    const loveRef = useRef()
    const revolutionRef = useRef()
    const complianceRef = useRef()
    const resistanceRef = useRef()
    const isolationRef = useRef()
    const liberationRef = useRef()

    useFrame((state, delta) => {
        loveRef.current.rotation.y += delta * 0.2
        revolutionRef.current.rotation.y += delta * 0.2
        complianceRef.current.rotation.y += delta * 0.2
        resistanceRef.current.rotation.y += delta * 0.2
        liberationRef.current.rotation.y += delta * 0.2
    })

    return (
        <>  
            <color args={['ivory']} attach="background" />

            <Perf position="top-left" />

            <OrbitControls makeDefault />

            <Text
                position={[0, 40, 0]}
                font='./fonts/Montserrat-VariableFont_wght.ttf'
                fontSize={20}
                color="white"
                anchorX="center"
                anchorY="middle"
                maxWidth={10}
                bevel={ 10 }
            >
                UTOPIA
            </Text>

            <Environment
                preset="sunset"
                resolution={128}
                intensity={10 }
            />

            <Stage
                shadows={{ type: 'contact', opacity: 0.5, blur: 3 }}
                environment="sunset"
                preset="portrait"
                intensity={ 10 }
            >
                <primitive ref={loveRef} object={love.scene} position={[20, 12, 0]} scale={5} />
                <primitive ref={revolutionRef} object={revolution.scene} position={[-18, 12, 0]} scale={3} />
                <primitive ref={complianceRef} object={compliance.scene} position={[0, 24, 0]} scale={5} />
                <primitive ref={resistanceRef} object={resistance.scene} position={[0, 0, 0]} scale={5} />
                <primitive ref={isolationRef} object={isolation.scene} position={[18, 10, 30]} scale={5} />
                <primitive ref={liberationRef} object={liberation.scene} position={[0, 12, -18]} scale={5} />

            </Stage>
        </>
    )
}

useGLTF.preload('./Models/love.glb');
useGLTF.preload('./Models/liberation.glb');
useGLTF.preload('./Models/revolution.glb');
useGLTF.preload('./Models/resistance.glb');
useGLTF.preload('./Models/isolation.glb');
useGLTF.preload('./Models/compliance.glb');