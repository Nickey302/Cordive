import { useFrame } from '@react-three/fiber'
import { useRef } from 'react'
import { useGLTF } from '@react-three/drei'

export default function Model()
{
    const love = useGLTF('./Models/love.glb')
    const liberation = useGLTF('./Models/liberation.glb')
    const revolution = useGLTF('./Models/revolution.glb')
    const resistance = useGLTF('./Models/resistance2.glb')
    const isolation = useGLTF('./Models/isolation.glb')
    const compliance = useGLTF('./Models/compliance2.glb')
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
        // liberationRef.current.rotation.y += delta * 0.2
    })

    return(
        <>
            <primitive ref={loveRef} object={love.scene} position={[20, 12, 0]} scale={5} />
            <primitive ref={revolutionRef} object={revolution.scene} position={[-18, 12, 0]} scale={3} />
            <primitive ref={complianceRef} object={compliance.scene} position={[0, 24, 0]} scale={5} />
            <primitive ref={resistanceRef} object={resistance.scene} position={[0, 0, 0]} scale={5} />
            <primitive ref={isolationRef} object={isolation.scene} position={[18, 10, 30]} scale={5} />
            {/* <primitive ref={liberationRef} object={liberation.scene} position={[0, 12, -18]} scale={5} /> */}
        </>
    )
}

useGLTF.preload('./Models/love.glb');
useGLTF.preload('./Models/liberation.glb');
useGLTF.preload('./Models/revolution.glb');
useGLTF.preload('./Models/resistance.glb');
useGLTF.preload('./Models/isolation.glb');
useGLTF.preload('./Models/compliance.glb');