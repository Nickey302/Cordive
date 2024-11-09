import { useFrame } from '@react-three/fiber'
import { useRef } from 'react'
import { useGLTF } from '@react-three/drei'

export default function Model()
{
    const love = useGLTF('./assets/Models/Love.glb')
    const liberation = useGLTF('./assets/Models/Liberation.glb')
    const revolution = useGLTF('./assets/Models/Aversion.glb')
    const resistance = useGLTF('./assets/Models/Resist.glb')
    const isolation = useGLTF('./assets/Models/Isolation.glb')
    const compliance = useGLTF('./assets/Models/Adjust.glb')

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
            <primitive ref={revolutionRef} object={revolution.scene} position={[-18, 12, 0]} scale={5} />
            <primitive ref={complianceRef} object={compliance.scene} position={[0, 24, 0]} scale={5} />
            <primitive ref={resistanceRef} object={resistance.scene} position={[0, 0, 0]} scale={5} />
            <primitive ref={isolationRef} object={isolation.scene} position={[18, 10, 30]} scale={5} />
            <primitive ref={liberationRef} object={liberation.scene} position={[0, 12, -18]} scale={4} />
        </>
    )
}

useGLTF.preload('./assets/Models/Love.glb')
useGLTF.preload('./assets/Models/Liberation.glb')
useGLTF.preload('./assets/Models/Aversion.glb')
useGLTF.preload('./assets/Models/Resist.glb')
useGLTF.preload('./assets/Models/Isolation.glb')
useGLTF.preload('./assets/Models/Adjust.glb')