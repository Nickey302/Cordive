'use client'

import { Float, Text, AccumulativeShadows, RandomizedLight, PointerLockControls, Environment, PositionalAudio } from '@react-three/drei'
import { EffectComposer, Bloom, HueSaturation, TiltShift2, WaterEffect, Noise, Glitch } from '@react-three/postprocessing'
import { Perf } from 'r3f-perf'
import * as THREE from 'three'
import { useThree, useFrame } from '@react-three/fiber'
import { useRef, useEffect, useState } from 'react'
import City from './City'
import Bubbles from './Bubbles'
import gsap from 'gsap'
import Cookie from './Cookie'
import Ocean from './Ocean'
//
//
//
export default function Experience() {
    const { camera } = useThree()
    const [audioListener] = useState(() => new THREE.AudioListener())
    const audioRef = useRef()
    const scrollSpeed = useRef(0.005)
    const cameraY = useRef(camera.position.y)
    const [isUnderwater, setIsUnderwater] = useState(false)
    const environmentRef = useRef('city')
    const controlsRef = useRef()
    const lightRef = useRef()

    useEffect(() => {
        camera.add(audioListener)
        camera.position.set(0, 4, 10)
        camera.lookAt(0, 2, 0)
        
        const handleScroll = (event) => {
            scrollSpeed.current = Math.abs(event.deltaY) * 0.0001 + 0.005
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

    useFrame((state) => {
        cameraY.current -= scrollSpeed.current * 2
        camera.position.y = Math.max(-20, cameraY.current)
        
        if (camera.position.y < 0 && !isUnderwater) {
            setIsUnderwater(true)
        } else if (camera.position.y >= 0 && isUnderwater) {
            setIsUnderwater(false)
        }
        
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
            <color attach="background" args={['#464646']} />
            <fog attach="fog" args={['#242424', 10, 25]} />

            <ambientLight intensity={2} />

            <PointerLockControls ref={controlsRef} dampingFactor={0.1} enabledDamping />

            <Perf />

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
            </Float>

            <Cookie distance={10} intensity={30} angle={0.6} penumbra={1} position={[2, 3, 0]} />

            <AccumulativeShadows receiveShadow temporal frames={100} opacity={0.8} alphaTest={0.9} scale={20} position={[0, -0.5, 0]}>
                <RandomizedLight radius={8} ambient={0.5} position={[5, 8, -10]} bias={0.001} />
            </AccumulativeShadows>
            
            <City />

            <mesh castShadow position={[-1.5, -0.245, 1]}>
                <sphereGeometry args={[0.25, 64, 64]} />
                <meshStandardMaterial color="#353535" />
            </mesh>
            <mesh castShadow position={[1.5, -0.24, 1]} rotation={[0, Math.PI / 4, 0]}>
                <boxGeometry args={[0.5, 0.5, 0.5]} />
                <meshStandardMaterial color="#353535" />
            </mesh>
            
            {/* <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.51, 0]} scale={100}>
                <planeGeometry />
                <meshStandardMaterial metalness={0} roughness={0.1} transparent opacity={0.3} color="#131313" side={THREE.DoubleSide} />
            </mesh> */}

            <Ocean />

            <directionalLight 
                ref={lightRef}
                intensity={3} 
                position={[3, -30, -10]} 
                color="#ffffff"
                castShadow
                shadow-mapSize={[1024, 1024]}
                shadow-camera-far={100}
                shadow-camera-left={-20}
                shadow-camera-right={20}
                shadow-camera-top={20}
                shadow-camera-bottom={-20}
            />
            <mesh rotation={[-Math.PI / 2, 0, 0]} position={[10, -30, 10]} scale={100}>
                <planeGeometry />
                <meshStandardMaterial metalness={0} roughness={0.1} transparent opacity={1} color="#333344" />
            </mesh>

            <Bubbles />
            
            <Environment preset={environmentRef.current} />
            <Postpro isUnderwater={isUnderwater} />
            <PositionalAudio
                ref={audioRef}
                url="./assets/audio/underwater.wav"
                distance={1}
                loop
                autoplay
            />

        </>
    );
}

function Postpro({ isUnderwater }) {
    const effectsRef = useRef({
        waterFactor: 0.75,
        bloomIntensity: 1,
        noiseOpacity: 0.05,
        saturation: 0
    })

    useEffect(() => {
        gsap.to(effectsRef.current, {
            waterFactor: isUnderwater ? 1.5 : 0.75,
            bloomIntensity: isUnderwater ? 1.5 : 1,
            noiseOpacity: isUnderwater ? 0.1 : 0.05,
            saturation: isUnderwater ? 0.5 : 0,
            duration: 1,
            ease: "power2.inOut"
        })
    }, [isUnderwater])

    return (
      <EffectComposer disableNormalPass multisampling={0}>
        <WaterEffect factor={effectsRef.current.waterFactor} />
        <TiltShift2 samples={12} blur={0.5} resolutionScale={256}/>
        <Bloom 
          mipmapBlur 
          luminanceThreshold={0.5} 
          intensity={effectsRef.current.bloomIntensity} 
        />
        <Noise opacity={effectsRef.current.noiseOpacity} />
        <HueSaturation saturation={effectsRef.current.saturation} />
        <Glitch 
          delay={[1.5, 8.5]}
          duration={[0.3, 0.65]}
          strength={[0.05, 0.06]}
          active
          ratio={0.85}
        />
      </EffectComposer>
    );
}