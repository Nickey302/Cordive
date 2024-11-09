'use client'

import { Text, Stage, Environment, OrbitControls, Text3D, MeshTransmissionMaterial } from '@react-three/drei'
import { Perf } from 'r3f-perf'
import Model from './Model'
import dynamic from 'next/dynamic'
const Effects = dynamic(() => import("../Heterotopia/Effects"), { ssr: false });
//
//
//
export default function Experience() {


    return (
        <>  
            {/* <Perf position="top-left" /> */}

            <OrbitControls makeDefault enableDamping dampingFactor={0.01}/>

            <ambientLight intensity={ 1.5 } />
            <directionalLight position={[10, 25, 3]} color="#dcb8d3" intensity={ 3 } />

            <Environment
                files={'/assets/HDRI/Utopia.hdr'}
                background
                environmentIntensity={0.5}
                backgroundIntensity={0.5}
                backgroundBlurriness={0.1}
            />

            <Model />

            <Effects />
        </>
    )
}