'use client';

import { useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, Text } from '@react-three/drei';
// import { useControls } from 'leva'; // 제거
import Particles from './Particles.jsx';
import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import * as THREE from 'three'
import { Noise , EffectComposer, Glitch, Grid } from '@react-three/postprocessing';
import { useSpring } from '@react-spring/three';

export default function Experience() {
  const router = useRouter();
  const { camera, mouse } = useThree();

  // useControls 대신 고정된 값 사용
  const focus = 5.1;
  const speed = 1.1;
  const curl = 0.25;

  const [fov, setFov] = useState(20);
  const [aperture, setAperture] = useState(1.8);

  const maxFov = 200;
  const maxAperture = 5.6;

  const [isHolding, setIsHolding] = useState(false);
  const [holdProgress, setHoldProgress] = useState(0);

  const holdTimerRef = useRef(null);

  const [cameraPosition, setCameraPosition] = useState([0, 0, 6]);
  const [cameraRotation, setCameraRotation] = useState([0, 0, 0]);

  const springProps = useSpring({
    position: cameraPosition,
    rotation: cameraRotation,
    config: { mass: 1, tension: 20, friction: 10 }
  });

  useFrame((state) => {
    state.camera.position.set(...springProps.position.get());
    state.camera.rotation.set(...springProps.rotation.get());
  });

  useEffect(() => {
    if (isHolding) {
      setHoldProgress(0);
      const startTime = Date.now();

      holdTimerRef.current = setInterval(() => {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / 2000, 1);
        setHoldProgress(progress);
        setFov(THREE.MathUtils.lerp(20, maxFov, progress));
        setAperture(THREE.MathUtils.lerp(1.8, maxAperture, progress));
          
        if (progress >= 1) {
          clearInterval(holdTimerRef.current);
          setIsHolding(false);
          router.push('/NamePrompt');
        }
      }, 50);
    } else {
      if (holdTimerRef.current) {
        clearInterval(holdTimerRef.current);
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

  return (
    <>
      <color args={['black']} attach="background" />

      <OrbitControls
        makeDefault
        zoomSpeed={0.8}
        rotateSpeed={1.4}
        panSpeed={1.4}
        minPolarAngle={Math.PI / 4}
        maxPolarAngle={Math.PI / 1.5}
        onChange={(e) => {
          setCameraPosition([e.target.object.position.x, e.target.object.position.y, e.target.object.position.z]);
          setCameraRotation([e.target.object.rotation.x, e.target.object.rotation.y, e.target.object.rotation.z]);
        }}
      />

      <ambientLight intensity={1.5} />
      <directionalLight />

      <Text
        position={[0, 0, 2]}
        font="./assets/fonts/Montserrat-VariableFont_wght.ttf"
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
        position={[0, -0.55, 2]}
        font="./assets/fonts/Montserrat-VariableFont_wght.ttf"
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

      <group position={[0, -0.7, 2]}>
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
        <Grid />
      </EffectComposer>
    </>
  );
}
