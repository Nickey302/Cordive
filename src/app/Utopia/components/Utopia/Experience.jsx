import { useLoader, useFrame } from '@react-three/fiber'
import { Text, useGLTF, Stage, Environment, OrbitControls } from '@react-three/drei'
import { useRef } from 'react'
import { Perf } from 'r3f-perf'
import * as THREE from 'three'
// import { useControls } from 'leva'

export default function Experience() {
    const love = useGLTF('./assets/Models/love.glb')
    const liberation = useGLTF('./assets/Models/liberation.glb')
    const revolution = useGLTF('./assets/Models/revolution.glb')
    const resistance = useGLTF('./assets/Models/resistance.glb')
    const isolation = useGLTF('./assets/Models/isolation.glb')
    const compliance = useGLTF('./assets/Models/compliance.glb')
    // console.log(love);

    // Refs for models
    const loveRef = useRef()
    const revolutionRef = useRef()
    const complianceRef = useRef()
    const resistanceRef = useRef()
    const isolationRef = useRef()
    const liberationRef = useRef()

    // Control environment map intensity
    // const { envMapIntensity } = useControls('environment map', {
    //     envMapIntensity: { value: 7, min: 0, max: 12 }
    // }, { visible: false })
    

    // Apply texture to the material of love model's mesh
    // if (love.scene) {
    //     love.scene.traverse((child) => {
    //         if (child.isMesh) {
    //             child.material.map = texture // Assign the loaded texture
    //             child.material.needsUpdate = true
    //         }
    //     })
    // }

    // UseFrame for rotating the models
    useFrame((state, delta) => {
        // Rotate each model in place
        loveRef.current.rotation.y += delta * 0.2
        revolutionRef.current.rotation.y += delta * 0.2
        complianceRef.current.rotation.y += delta * 0.2
        resistanceRef.current.rotation.y += delta * 0.2
        // isolationRef.current.rotation.z += delta * 0.2
        liberationRef.current.rotation.y += delta * 0.2
    })

    return (
        <>  
            <color args={['ivory']} attach="background" />

            {/* <Perf position="top-left" /> */}

            <OrbitControls makeDefault />

            <Text
                position={[0, 40, 0]}    // Center the text
                font='./assets/fonts/Montserrat-VariableFont_wght.ttf'
                fontSize={20}             // Adjust font size
                color="white"            // Color of the text
                anchorX="center"         // Align text horizontally to the center
                anchorY="middle"         // Align text vertically to the middle
                maxWidth={10}            // Limit the text width if needed
                bevel={ 10 }
            >
                UTOPIA
            </Text>

            <Environment
                // background
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