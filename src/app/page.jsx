'use client'

import styles from './page.module.css'
import { Canvas } from '@react-three/fiber';
import { useState, useRef, useEffect } from 'react';
import Experience from '@/components/main/Experience';
import NamePrompt from '@/components/main/NamePrompt';
import { AdaptiveEvents, PerformanceMonitor } from '@react-three/drei';
import { useRouter } from 'next/navigation';
import gsap from 'gsap';

export default function Home() {
  useEffect(() => {
    // 오디오 컨텍스트 초기화
    if (!window.globalAudioContext) {
      const audioContext = new (window.AudioContext || window.webkitAudioContext)()
      window.globalAudioContext = audioContext
    }

    // 오디오 초기화 및 이벤트 발생
    const gainNode = window.globalAudioContext.createGain()
    gainNode.connect(window.globalAudioContext.destination)
    gainNode.gain.value = 1

    const audioState = {
      context: window.globalAudioContext,
      gain: gainNode,
      setVolume: (value) => {
        gainNode.gain.value = value / 10
      }
    }

    // audioInit 이벤트 발생
    const event = new CustomEvent('audioInit', {
      detail: audioState
    })
    window.dispatchEvent(event)
  }, [])

  const [dpr, setDpr] = useState(1);
  const [showNamePrompt, setShowNamePrompt] = useState(false);
  const canvasContainerRef = useRef(null);
  const router = useRouter();

  const handleNameComplete = (name) => {
    gsap.to(canvasContainerRef.current, {
      opacity: 0,
      duration: 0.5,
      ease: 'power2.inOut'
    });

    console.log('Entered name:', name);
    setTimeout(() => {
      router.push('/Dystopia');
    }, 1000);
  };

  return (
    <div style={{ position: 'fixed', height: '100vh', width: '100vw' }}>
      <div 
        ref={canvasContainerRef}
        className={styles.canvasContainer}
        style={{
          opacity: showNamePrompt ? 0.4 : 1,
          transition: 'opacity 0.5s ease'
        }}
      >
        <Canvas
          shadows
          frameloop="always"
          gl={{
            antialias: true,
            powerPreference: "high-performance",
          }}
          camera={{
            fov: 25,
            near: 0.1,
            far: 100,
            position: [0, 0, 0],
          }}
        >
          <AdaptiveEvents />
          <PerformanceMonitor
            onIncline={() => {
              setDpr(Math.min(2, window.devicePixelRatio))
            }}
            onDecline={() => {
              setDpr(1)
            }}>
            <Experience onShowNamePrompt={setShowNamePrompt} />
          </PerformanceMonitor>
        </Canvas>
      </div>
      {showNamePrompt && (
        <NamePrompt onComplete={handleNameComplete} />
      )}
    </div>
  );
}
