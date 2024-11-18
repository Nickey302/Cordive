'use client';

import { useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, Text, Html } from '@react-three/drei';
import Particles from './Particles.jsx';
import { useState, useRef, useEffect } from 'react';
import * as THREE from 'three'
import { Noise, EffectComposer, Grid } from '@react-three/postprocessing';
import { useSpring } from '@react-spring/three';
import gsap from 'gsap';
import { soundManager } from '@/app/SoundManager';
import { SCENE_SOUNDS } from '@/app/sounds';
import AudioVisualizer from '@/components/common/AudioVisualizer';
import * as Tone from 'tone';

export default function Experience({ onShowNamePrompt }) {
  const { camera } = useThree();
  const [audio, setAudio] = useState(null);
  const [isHolding, setIsHolding] = useState(false);
  const [holdProgress, setHoldProgress] = useState(0);
  const holdTimerRef = useRef(null);
  const [fov, setFov] = useState(20);
  const [aperture, setAperture] = useState(1.8);
  const maxFov = 200;
  const maxAperture = 5.6;

  useEffect(() => {
    const initSound = async () => {
      try {
        await soundManager.init();
        soundManager.setScene('MAIN');
        
        // 모든 사운드 로드 완료 대기
        await Promise.all([
          soundManager.loadSound('BGM', SCENE_SOUNDS.MAIN.BGM.url, SCENE_SOUNDS.MAIN.BGM.options),
          soundManager.loadSound('HOLD', SCENE_SOUNDS.MAIN.HOLD.url, SCENE_SOUNDS.MAIN.HOLD.options)
        ]);

        // 사운드 로드 완료 후 BGM 재생
        await soundManager.playSound('BGM', { fadeIn: 2 });
        
        setAudio({
          context: Tone.context,
          gain: soundManager.mainVolume,
          setVolume: (val) => {
            soundManager.mainVolume.volume.value = val;
          }
        });
      } catch (error) {
        console.error('Error initializing sound:', error);
      }
    };
    
    initSound();
    
    camera.position.z = 0;
    gsap.timeline()
      .to(camera.position, {
        z: 6.5,
        duration: 2,
        ease: 'power2.inOut'
      })
      .to(camera.position, {
        z: 5,
        duration: 1,
        ease: 'power2.inOut'
      });

    return () => {
      soundManager.stopAllSounds();
      if (holdTimerRef.current) {
        clearInterval(holdTimerRef.current);
      }
    };
  }, [camera.position]);

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
          onShowNamePrompt(true);
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
  }, [isHolding, onShowNamePrompt]);

  const handleHoldStart = () => {
    setIsHolding(true);
    soundManager.playSound('HOLD');
    const bgmSound = soundManager.players.get('BGM');
    if (bgmSound) {
      bgmSound.player.volume.rampTo(-30, 0.5); // BGM 볼륨 낮추기
    }
  };

  return (
    <>
      <color args={['black']} attach="background" />
      
      <Html fullscreen>
        <div style={{ position: 'absolute', top: '20px', left: '50%', transform: 'translateX(-50%)' }}>
          <AudioVisualizer audio={audio} />
        </div>
      </Html>

      <OrbitControls
        makeDefault
        zoomSpeed={0.8}
        rotateSpeed={1.4}
        panSpeed={1.4}
        minPolarAngle={Math.PI / 4}
        maxPolarAngle={Math.PI / 1.5}
      />

      <ambientLight intensity={1.5} />
      <directionalLight />

      <Text
        position={[0, 0, 2]}
        font="/assets/fonts/NeoCode.woff"
        fontSize={0.3}
        color="#dddddd"
        anchorX="center"
        anchorY="middle"
        maxWidth={10}
        bevel={10}
      >
        CORDIVE
      </Text>

      <Text
        position={[0, -0.55, 2]}
        font="/assets/fonts/Montserrat-VariableFont_wght.ttf"
        fontWeight={100}
        fontSize={0.1}
        color="#ededed"
        anchorX="center"
        anchorY="middle"
        maxWidth={5}
        bevel={1}
        onPointerDown={handleHoldStart}
        onPointerUp={() => {
          setIsHolding(false);
        }}
        onPointerOut={() => {
          setIsHolding(false);
        }}
      >
        HOLD TO DIVE
      </Text>

      <group position={[0, -0.7, 2]}>
        <mesh>
          <planeGeometry args={[0.5, 0.05]} />
          <meshBasicMaterial color="gray" opacity={0.3} transparent />
        </mesh>
        <mesh
          position={[-0.25 + (0.25 * holdProgress), 0, 0.01]}
          scale={[holdProgress, 1, 1]}
        >
          <planeGeometry args={[0.5, 0.05]} />
          <meshBasicMaterial color="white" opacity={0.7} transparent />
        </mesh>
      </group>

      <Particles focus={5.1} speed={1.1} aperture={aperture} fov={fov} curl={0.25} />
      
      <EffectComposer multisampling={0}>
        <Noise opacity={0.9} blendFunction={THREE.MultiplyBlending} />
        <Grid />
      </EffectComposer>
    </>
  );
}