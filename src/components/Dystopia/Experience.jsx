'use client'

import * as THREE from 'three'
import { useThree, useFrame } from '@react-three/fiber'
import { Float, Text, PointerLockControls, Environment, PositionalAudio, Sparkles } from '@react-three/drei'
import { EffectComposer, TiltShift2, Noise, Glitch } from '@react-three/postprocessing'
import { Perf } from 'r3f-perf'
import gsap from 'gsap'
import { useRef, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import FirstPersonControls from './FirstPersonControls'
import City from './City'
import Cookie from './Cookie'
import Ocean from './Ocean'
import Vortex from './Whirl'
import { Model as Object1 } from './Object/Object1'
import { Model as Object2 } from './Object/Object2'
import { Model as Object5 } from './Object/Object5'
//
//
//
export default function Experience({ onCameraYChange, onAudioInit }) {
    const { camera } = useThree()
    const [audioListener] = useState(() => new THREE.AudioListener())
    const audioRef = useRef()
    const scrollSpeed = useRef(0.001)
    const cameraY = useRef(camera.position.y)
    const controlsRef = useRef()
    const lightRef = useRef()
    const router = useRouter()
    const isAnimating = useRef(false)
    const [isHolding, setIsHolding] = useState(false)
    const returnAnimationRef = useRef(null)
    
    const oscillationAmplitude = 0.5  // 진폭 (-1 ~ 1)
    const oscillationFrequency = 0.5  // 주기 (1초)

    useEffect(() => {
        camera.add(audioListener)
        camera.position.set(0, 4, 10)
        camera.lookAt(0, 2, 0)
        
        const handleScroll = (event) => {
            scrollSpeed.current = Math.abs(event.deltaY) * 0.001
        }

        const handleKeyDown = (event) => {
            if (event.code === 'Space') {
                controlsRef.current?.lock()
            }
        }
        
        window.addEventListener('wheel', handleScroll)
        window.addEventListener('keydown', handleKeyDown)
        
        return () => {
            camera.remove(audioListener)
            window.removeEventListener('wheel', handleScroll)
            window.removeEventListener('keydown', handleKeyDown)
        }
    }, [camera, audioListener])

    useEffect(() => {
        const handleMouseDown = () => setIsHolding(true)
        const handleMouseUp = () => setIsHolding(false)
        
        window.addEventListener('mousedown', handleMouseDown)
        window.addEventListener('mouseup', handleMouseUp)
        
        return () => {
            window.removeEventListener('mousedown', handleMouseDown)
            window.removeEventListener('mouseup', handleMouseUp)
        }
    }, [])

    useFrame((state) => {
        if (isAnimating.current && !isHolding) {
            // 홀딩이 해제되었을 때만 애니메이션 중단
            const currentTween = gsap.getTweensOf(camera.position)[0]
            if (currentTween) {
                currentTween.kill()
                
                // 위로 돌아가는 애니메이션
                returnAnimationRef.current = gsap.to(camera.position, {
                    y: -38,
                    duration: 2,
                    ease: "power2.out",
                    onComplete: () => {
                        isAnimating.current = false
                        returnAnimationRef.current = null
                    }
                })
            }
            return
        }

        if (camera.position.y > -38) {
            cameraY.current -= scrollSpeed.current
            const baseY = Math.max(-38, cameraY.current)
            const oscillation = Math.sin(state.clock.elapsedTime * Math.PI * 2 * oscillationFrequency) * oscillationAmplitude
            camera.position.y = baseY + oscillation
        } else if (isHolding && !isAnimating.current) {
            // 마우스 홀딩 시에만 아래로 내려가는 애니메이션 시작
            if (returnAnimationRef.current) {
                returnAnimationRef.current.kill()
                returnAnimationRef.current = null
            }
            
            isAnimating.current = true
            gsap.to(camera.position, {
                x: 0.1,
                z: -0.5,
                y: -120,
                duration: 10,
                ease: "power2.inOut",
                onComplete: () => {
                    router.push('/Heterotopia')
                }
            })
        }
        
        onCameraYChange?.(camera.position.y)
        
        scrollSpeed.current = THREE.MathUtils.lerp(
            scrollSpeed.current,
            0.0005,
            0.005
        )

        if (lightRef.current) {
            const time = state.clock.getElapsedTime()
            lightRef.current.position.x = Math.sin(time * 0.2) * 20
            lightRef.current.position.z = Math.cos(time * 0.2) * 20
            lightRef.current.lookAt(0, -30, 0)
        }
    })

    return (
        <>
            {/* <Perf position="bottom-left" /> */}

            <color attach="background" args={['#45474c']} />
            <fog attach="fog" args={['#45474c', 10, 100]} />

            <ambientLight intensity={2} />
            <directionalLight intensity={10} position={[20, -30, 10]} color="#ffffff" />

            <PointerLockControls ref={controlsRef} makeDefault pointerSpeed={0.5}  />
            {/* <OrbitControls /> */}

            <FirstPersonControls />

            <Environment
                files={'/assets/HDRI/Dystopia.hdr'}
                background
                backgroundBlurriness={0.5}
                backgroundIntensity={0.3}
                environmentIntensity={0.5}
                blur={0.5}
            />

            <Float>
                <Text
                    position={[0, 0.5, 0]}
                    font='./assets/fonts/Montserrat-VariableFont_wght.ttf'
                    fontSize={1.5}
                    fontWeight="bold"
                    color="#eeeeff"
                    anchorX="center"
                    anchorY="middle"
                    maxWidth={10}
                    bevel={10}
                >
                    DYSTOPIA
                </Text>
                <Text
                    position={[0, -38, 0]}
                    font='./assets/fonts/NeoCode.woff'
                    fontSize={0.3}
                    color="#eeeeff"
                    anchorX="center"
                >
                    Hold to Dive
                </Text>
            </Float>

            <Cookie distance={10} intensity={3} angle={0.6} penumbra={1} position={[2, 3, 0]} />
            
            <City castShadow />

            <Float
                floatIntensity={1}
                speed={5}
            >
                <mesh castShadow position={[-1.5, -0.5, 1]}>
                    <sphereGeometry args={[0.25, 64, 64]} />
                    <meshStandardMaterial color="#020f10" />
                </mesh>
                <mesh castShadow position={[1.5, -0.5, 1]} rotation={[0, Math.PI / 4, 0]}>
                    <boxGeometry args={[0.5, 0.5, 0.5]} />
                    <meshStandardMaterial color="#020f10" />
                </mesh>
            </Float>
        
            <Vortex />

            <Ocean />

            <Float>
                <Object1 position={[-3, -5, -30]} />
                <Object2 position={[2, -3, -20]} />
                <Object5 position={[-4, -5, 0]} />
                <Object5 position={[3, -10, 0]} scale={0.5} rotation={[0, Math.PI / 6, 0]} />
                <Object5 position={[-1, -7, -4]} scale={0.5} rotation={[0, - Math.PI / 6, 0]} />
            </Float>


            <directionalLight 
                ref={lightRef}
                intensity={3} 
                position={[3, -30, -10]} 
                color="#ffffff"
            />

            <Sparkles
                position={[0, -10, 0]}
                count={1000}
                scale={100}
                size={1.8}
                speed={0.8}
                opacity={0.2}
                depthWrite={false}
            />

            {/* <Bubbles /> */}
        
            <Postpro />
            <PositionalAudio
                ref={audioRef}
                url="./assets/audio/underwater.wav"
                distance={1}
                loop
                autoplay
                volume={10}
            />
        </>
    );
}

function Postpro() {

    return (
      <EffectComposer disableNormalPass multisampling={0}>
        <TiltShift2 samples={12} blur={0.2} resolutionScale={256}/>
        {/* <Bloom 
          mipmapBlur 
          luminanceThreshold={0.8} 
          intensity={0.5} 
        /> */}
        <Noise opacity={0.01} />
        <Glitch 
          delay={[1.5, 4.5]}
          duration={[0.3, 0.65]}
          strength={[0.05, 0.06]}
          active
          ratio={0.85}
        />
        {/* <Pixelation /> */}
      </EffectComposer>
    );
}