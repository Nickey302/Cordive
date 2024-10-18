import { useFrame } from '@react-three/fiber'
import { useRef } from 'react'
import { useGLTF } from '@react-three/drei'

export default function Model()
{
    const love = useGLTF('./assets/Models/love4.glb')
    const liberation = useGLTF('./assets/Models/liberation2.glb')
    const revolution = useGLTF('./assets/Models/revolution.glb')
    const resistance = useGLTF('./assets/Models/resistance2.glb')
    const isolation = useGLTF('./assets/Models/isolation.glb')
    const compliance = useGLTF('./assets/Models/compliance2.glb')

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

    return(
        <>
            <primitive ref={loveRef} object={love.scene} position={[20, 12, 0]} scale={30} />
            <primitive ref={revolutionRef} object={revolution.scene} position={[-18, 12, 0]} scale={3} />
            <primitive ref={complianceRef} object={compliance.scene} position={[0, 24, 0]} scale={5} />
            <primitive ref={resistanceRef} object={resistance.scene} position={[0, 0, 0]} scale={5} />
            <primitive ref={isolationRef} object={isolation.scene} position={[18, 10, 30]} scale={5} />
            <primitive ref={liberationRef} object={liberation.scene} position={[0, 12, -18]} scale={8} />
        </>
    )
}

useGLTF.preload('./assets/Models/love4.glb');
useGLTF.preload('./assets/Models/liberation2.glb');
useGLTF.preload('./assets/Models/revolution.glb');
useGLTF.preload('./assets/Models/resistance2.glb');
useGLTF.preload('./assets/Models/isolation.glb');
useGLTF.preload('./assets/Models/compliance2.glb');