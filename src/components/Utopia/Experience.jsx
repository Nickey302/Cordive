'use client'

import { Environment, OrbitControls } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import { useRef } from 'react'
import Model from './Model'
import dynamic from 'next/dynamic'
import { Perf } from 'r3f-perf'
const Effects = dynamic(() => import("../Heterotopia/Effects"), { ssr: false });

export default function Experience({ activeObject }) {
    const orbitControlsRef = useRef()

    useFrame((state) => {
        if (orbitControlsRef.current) {
            orbitControlsRef.current.update()
        }
    })

    return (
        <>  
            <Perf position="top-left" />

            <OrbitControls 
                ref={orbitControlsRef}
                makeDefault 
                enableDamping 
                dampingFactor={0.05}
                minDistance={50}
                maxDistance={500}
                enablePan={true}
                enableZoom={true}
                target={[0, 0, 0]}
                // minPolarAngle={Math.PI / 4}
                // maxPolarAngle={Math.PI / 2}
            />

            <ambientLight intensity={ 1.5 } />
            <directionalLight position={[10, 25, 3]} color="#dcb8d3" intensity={ 3 } />

            <Environment
                files={'/assets/HDRI/Utopia.hdr'}
                background
                environmentIntensity={0.5}
                backgroundIntensity={0.5}
                backgroundBlurriness={0.1}
            />

            <Model activeObject={activeObject} />

            <Effects />
        </>
    )
}