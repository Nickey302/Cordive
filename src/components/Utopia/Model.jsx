'use client'

import { useRef, useEffect, forwardRef, useImperativeHandle } from 'react'
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

const Model = forwardRef(({ activeObject }, ref) => {
    useImperativeHandle(ref, () => ({
        getObjectPosition: (objectName) => {
            if (refs[objectName] && refs[objectName].current) {
                return refs[objectName].current.position
            }
            return null
        }
    }))

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
            
            // 각 오브젝트별 최적의 카메라 오프셋 설정
            const cameraOffsets = {
                Love: {
                    distance: 40,
                    heightOffset: 25,
                    angle: Math.PI / 3
                },
                Aversion: {
                    distance: 40,
                    heightOffset: 25,
                    angle: Math.PI / 2.5
                },
                Adjust: {
                    distance: 45,
                    heightOffset: 35,
                    angle: Math.PI / 3
                },
                Resist: {
                    distance: 45,
                    heightOffset: 30,
                    angle: -Math.PI / 3
                },
                Isolation: {
                    distance: 50,
                    heightOffset: 35,
                    angle: Math.PI / 4
                },
                Liberation: {
                    distance: 40,
                    heightOffset: 30,
                    angle: -Math.PI / 2.5
                },
                Landmark: {
                    distance: 20,
                    heightOffset: 5,
                    angle: Math.PI / 4
                }
            }
            
            const offset = cameraOffsets[activeObject]
            const cameraX = targetPosition.x + offset.distance * Math.cos(offset.angle)
            const cameraY = targetPosition.y + offset.heightOffset
            const cameraZ = targetPosition.z + offset.distance * Math.sin(offset.angle)

            gsap.to(camera.position, {
                duration: 2,
                x: cameraX,
                y: cameraY,
                z: cameraZ,
                ease: "power2.inOut"
            })
        }
    }, [activeObject, camera, refs])

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
                scale={[35 * scaleAdd, 35 * scaleAdd, 35 * scaleAdd]}
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
                floatIntensity={0.5}
            >
                <Landmark 
                    ref={refs.Landmark} 
                    position={positions.Landmark}
                    scale={[3, 3, 3]}
                />
            </Float>
        </>
    )
})

// displayName 추가
Model.displayName = 'Model'

export default Model