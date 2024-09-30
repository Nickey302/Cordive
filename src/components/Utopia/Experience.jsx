'use client'

import { Text, Stage, Environment, OrbitControls } from '@react-three/drei'
import { Perf } from 'r3f-perf'
import Model from './Model'
//
//
//
export default function Experience() {


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
                <Model />
            </Stage>
        </>
    )
}