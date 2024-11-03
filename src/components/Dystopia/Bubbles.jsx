import { useRef, useEffect } from 'react'
import { useFrame } from '@react-three/fiber'
import { useTexture } from '@react-three/drei'
import * as THREE from 'three'

export default function Bubbles() {
    const bubblesRef = useRef([])
    const count = 1000
    
    // 물방울 텍스쳐 로드
    const bubbleTexture = useTexture('/assets/images/circle_04.png') // 물방울 텍스쳐 경로
    
    useEffect(() => {
        bubblesRef.current = Array.from({ length: count }, () => ({
            position: [
                (Math.random() - 0.5) * 20,
                -35 + Math.random() * 31,
                (Math.random() - 0.5) * 20
            ],
            scale: 0.02 + Math.random() * 0.08,
            speed: 0.02 + Math.random() * 0.08,
            rotation: Math.random() * Math.PI
        }))
    }, [])

    useFrame(() => {
        bubblesRef.current.forEach(bubble => {
            bubble.position[1] += bubble.speed
            bubble.rotation += 0.01
            if (bubble.position[1] > -4) {
                bubble.position[1] = -35
            }
        })
    })

    return (
        <group>
            {bubblesRef.current.map((bubble, i) => (
                <sprite
                    key={i}
                    position={bubble.position}
                    scale={[bubble.scale, bubble.scale, bubble.scale]}
                    rotation={[0, bubble.rotation, 0]}
                >
                    <spriteMaterial
                        map={bubbleTexture}
                        transparent={true}
                        opacity={0.05}
                        depthWrite={false}
                        blending={THREE.AdditiveBlending}
                        alphaTest={0.01}
                    />
                </sprite>
            ))}
        </group>
    )
} 