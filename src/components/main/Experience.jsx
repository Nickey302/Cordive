'use client';

import { useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, Text } from '@react-three/drei';
import { useControls } from 'leva';
import Particles from './Particles.jsx';
import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import * as THREE from 'three'
import { Noise , EffectComposer} from '@react-three/postprocessing';
//
//
//
export default function Experience() {
  const router = useRouter();
  const { camera, mouse } = useThree();

  const { focus, speed, curl } = useControls({
    focus: { value: 5.1, min: 3, max: 7, step: 0.01 },
    speed: { value: 1.1, min: 0.1, max: 100, step: 0.1 },
    curl: { value: 0.25, min: 0.01, max: 0.5, step: 0.01 },
  });

  const [fov, setFov] = useState(20);
  const [aperture, setAperture] = useState(1.8);

  const maxFov = 200;
  const maxAperture = 5.6;

  const [isHolding, setIsHolding] = useState(false);
  const [holdProgress, setHoldProgress] = useState(0);

  const holdTimerRef = useRef(null);

  useEffect(() => {
    if (isHolding) {
      // console.log('Holding started');
      setHoldProgress(0);
      const startTime = Date.now();

      holdTimerRef.current = setInterval(() => {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / 2000, 1);
        setHoldProgress(progress);
        setFov(THREE.MathUtils.lerp(20, maxFov, progress));
        setAperture(THREE.MathUtils.lerp(1.8, maxAperture, progress));
        // console.log(`Hold Progress: ${progress}`);

        if (progress >= 1) {
          clearInterval(holdTimerRef.current);
          setIsHolding(false);
          // console.log('Holding completed, navigating to next page');
          router.push('/Dystopia');
        }
      }, 50);
    } else {
      if (holdTimerRef.current) {
        clearInterval(holdTimerRef.current);
        // console.log('Holding cancelled');
        setHoldProgress(0);
        setFov(20);
        setAperture(1.8);
      }
    }

    return () => {
      if (holdTimerRef.current) {
        clearInterval(holdTimerRef.current);
      }
    };
  }, [isHolding, router]);

  useFrame((state, delta) => {
    camera.position.x = THREE.MathUtils.lerp(camera.position.x, mouse.x * 0.5, 0.1);
    camera.position.y = THREE.MathUtils.lerp(camera.position.y, mouse.y * 0.5, 0.1);
    camera.position.z = THREE.MathUtils.lerp(camera.position.z, 6, 0.1);

    camera.rotation.x = THREE.MathUtils.lerp(camera.rotation.x, mouse.y * -Math.PI * 0.05, 0.1);
    camera.rotation.y = THREE.MathUtils.lerp(camera.rotation.y, mouse.x * -Math.PI * 0.05, 0.1);
  });

  return (
    <>
      <color args={['black']} attach="background" />

      <OrbitControls makeDefault zoomSpeed={0.1} />

      <ambientLight intensity={1.5} />
      <directionalLight />

      <Text
        position={[0, 0, 2]}
        font="./fonts/Montserrat-VariableFont_wght.ttf"
        fontSize={0.3}
        color="white"
        anchorX="center"
        anchorY="middle"
        maxWidth={10}
        bevel={10}
      >
        CORDIVE
      </Text>

      <Text
        position={[0, -0.5, 2]}
        font="./fonts/Montserrat-VariableFont_wght.ttf"
        fontSize={0.1}
        color="white"
        anchorX="center"
        anchorY="middle"
        maxWidth={5}
        bevel={1}
        onPointerDown={() => {
          setIsHolding(true);
        }}
        onPointerUp={() => {
          setIsHolding(false);
        }}
        onPointerOut={() => {
          setIsHolding(false);
        }}
      >
        Hold To Dive
      </Text>

      <group position={[0, -0.7, 1]}>
        {/* 배경 게이지 */}
        <mesh>
          <planeGeometry args={[0.5, 0.05]} />
          <meshBasicMaterial color="gray" opacity={0.3} transparent />
        </mesh>
        {/* 채워지는 게이지 */}
        <mesh
          position={[-0.25 + (0.25 * holdProgress), 0, 0.01]}
          scale={[holdProgress, 1, 1]}
        >
          <planeGeometry args={[0.5, 0.05]} />
          <meshBasicMaterial color="white" opacity={0.7} transparent />
        </mesh>
      </group>

      <Particles focus={focus} speed={speed} aperture={aperture} fov={fov} curl={curl} />
      
      <EffectComposer multisampling={0}>
        <Noise opacity={0.9} blendFunction={THREE.MultiplyBlending} />
      </EffectComposer>
    </>
  );
}
