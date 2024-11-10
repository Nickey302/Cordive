'use client'

import { useRef, useEffect } from 'react'
import { useThree } from '@react-three/fiber'
import { Model as Landmark } from './Model/Landmark.jsx'
import { Model as Love } from './Model/Love.jsx'
import { Model as Liberation } from './Model/Liberation.jsx'
import { Model as Aversion } from './Model/Aversion.jsx'
import { Model as Resist } from './Model/Resist.jsx'
import { Model as Isolation } from './Model/Isolation.jsx'
import { Model as Adjust } from './Model/Adjust.jsx'
import { Float } from '@react-three/drei'
import gsap from 'gsap'
import * as THREE from 'three'

export default function Model({ activeObject })
{
    const positionAdd = 5
    const scaleAdd = 3
    
    const refs = {
        Love: useRef(null),
        Aversion: useRef(null),
        Adjust: useRef(null),
        Resist: useRef(null),
        Isolation: useRef(null),
        Liberation: useRef(null),
        Landmark: useRef(null)
    }

    const { camera } = useThree()

    useEffect(() => {
        if (activeObject && refs[activeObject].current) {
            const targetPosition = refs[activeObject].current.position
            
            const distance = 100
            
            const cameraX = targetPosition.x + distance * Math.cos(Math.PI / 4)
            const cameraY = targetPosition.y + distance * 0.5
            const cameraZ = targetPosition.z + distance * Math.sin(Math.PI / 4)

            gsap.to(camera.position, {
                duration: 2,
                x: cameraX,
                y: cameraY,
                z: cameraZ,
                ease: "power2.inOut",
                onUpdate: () => {
                    camera.lookAt(
                        targetPosition.x,
                        targetPosition.y,
                        targetPosition.z
                    )
                }
            })

            const lookAtVector = new THREE.Vector3(
                targetPosition.x,
                targetPosition.y,
                targetPosition.z
            )
            camera.lookAt(lookAtVector)
        }
    }, [activeObject, camera])

    const positions = {
        Love: [30 * positionAdd, 0, 0],
        Aversion: [-25 * positionAdd, 0, 0],
        Adjust: [0, 24 * positionAdd, 0],
        Resist: [0, -24 * positionAdd, 0],
        Isolation: [30 * positionAdd, 0, 30 * positionAdd],
        Liberation: [0, 0, -25 * positionAdd],
        Landmark: [0, -15, 0]
    }

    return(
        <>
            <Love 
                ref={refs.Love} 
                position={positions.Love}
                scale={[30 * scaleAdd, 30 * scaleAdd, 30 * scaleAdd]}
            />
            <Aversion 
                ref={refs.Aversion} 
                position={positions.Aversion}
                scale={[5 * scaleAdd, 5 * scaleAdd, 5 * scaleAdd]}
            />
            <Adjust 
                ref={refs.Adjust} 
                position={positions.Adjust}
                scale={[5 * scaleAdd, 5 * scaleAdd, 5 * scaleAdd]}
            />
            <Resist 
                ref={refs.Resist} 
                position={positions.Resist}
                scale={[5 * scaleAdd, 5 * scaleAdd, 5 * scaleAdd]}
            />
            <Isolation 
                ref={refs.Isolation} 
                position={positions.Isolation}
                scale={[5 * scaleAdd, 5 * scaleAdd, 5 * scaleAdd]}
            />
            <Liberation 
                ref={refs.Liberation} 
                position={positions.Liberation}
                scale={[4 * scaleAdd, 4 * scaleAdd, 4 * scaleAdd]}
            />
            <Float
                speed={3}
                rotationIntensity={1}
                floatIntensity={1}
            >
                <Landmark 
                    ref={refs.Landmark} 
                    position={positions.Landmark}
                    scale={[3, 3, 3]}
                />
            </Float>
        </>
    )
}