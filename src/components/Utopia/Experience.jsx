'use client'

import { Text, Stage, Environment, OrbitControls } from '@react-three/drei'
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
            <color args={['#eeeeee']} attach="background" />

            <Perf position="top-left" />

            <OrbitControls makeDefault enableDamping dampingFactor={0.01}/>

            <ambientLight intensity={ 1.5 } />
            <directionalLight position={[10, 10, 10]} color="#666699" intensity={ 3 } />

            <Text
                position={[0, 40, 0]}
                font='./assets/fonts/Montserrat-VariableFont_wght.ttf'
                fontWeight={100}
                fontSize={20}
                color="black"
                anchorX="center"
                anchorY="middle"
                maxWidth={10}
                bevel={ 10 }
            >
                UTOPIA
            </Text>

            <Environment
                preset="studio"
                resolution={128}
                intensity={0.5}
            />

                <Model />
                {/* <Love /> */}

                {/* <mesh>
                    <boxGeometry position={[10, 50, 10]} args={[10, 10, 10]}/>
                    <meshStandardMaterial metalness={0.5} roughness={0.5} color="white" />
                </mesh> */}

            <Effects />
        </>
    )
}