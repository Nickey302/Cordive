'use client'

import { Environment, OrbitControls } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import { useRef, useEffect } from 'react'
import Model from './Model'
import dynamic from 'next/dynamic'
import { Perf } from 'r3f-perf'
import * as THREE from 'three'
import gsap from 'gsap'
const Effects = dynamic(() => import("../Heterotopia/Effects"), { ssr: false });

export default function Experience({ activeObject }) {
    const orbitControlsRef = useRef()
    const modelRef = useRef()

    useEffect(() => {
        if (activeObject && orbitControlsRef.current && modelRef.current) {
            const targetPosition = modelRef.current.getObjectPosition(activeObject)
            if (targetPosition) {
                const newTarget = new THREE.Vector3(
                    targetPosition.x,
                    targetPosition.y,
                    targetPosition.z
                )
                
                gsap.to(orbitControlsRef.current.target, {
                    duration: 2,
                    x: newTarget.x,
                    y: newTarget.y,
                    z: newTarget.z,
                    ease: "power2.inOut"
                })
            }
        }
    }, [activeObject])

    useFrame((state) => {
        if (orbitControlsRef.current) {
            orbitControlsRef.current.update()
        }
    })

    return (
        <>  
            {/* <Perf position="top-left" /> */}

            <OrbitControls 
                ref={orbitControlsRef}
                makeDefault
                enableDamping
                dampingFactor={0.01}
                minDistance={50}
                maxDistance={500}
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

            <Model ref={modelRef} activeObject={activeObject} />

            <Effects />
        </>
    )
}