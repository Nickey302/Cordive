'use client'

import { Text, Stage, Environment, OrbitControls } from '@react-three/drei'
import { Perf } from 'r3f-perf'
import Model from './Model'
import { Autofocus, ChromaticAberration, ColorAverage, ColorDepth, Depth, DotScreen, EffectComposer, GodRays, Grid, LensFlare, LUT, Noise, Outline, Pixelation, Sepia, ToneMapping } from '@react-three/postprocessing'
//
//
//
export default function Experience() {


    return (
        <>  
            <color args={['ivory']} attach="background" />

            <Perf position="top-left" />

            <OrbitControls makeDefault />

            <ambientLight intensity={ 1.5 } />
            <directionalLight color="#666699" intensity={ 3 } />

            <Text
                position={[0, 40, 0]}
                font='./assets/fonts/Montserrat-VariableFont_wght.ttf'
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
                intensity={10}
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