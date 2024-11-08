'use client'

import styles from './page.module.css'
import { useEffect, useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import Header from '../Header.jsx';
import Experience from '../../components/Dystopia/Experience.jsx';
import gsap from 'gsap';
import { AdaptiveDpr, AdaptiveEvents, PerformanceMonitor } from '@react-three/drei';
import { useState } from 'react';
//
//
//
export default function Dystopia()
{
  const containerRef = useRef();
  const [dpr, setDpr] = useState(1)

  useEffect(() => {
    gsap.fromTo(
      containerRef.current,
      { opacity: 0 },
      { opacity: 1, duration: 1, ease: 'power2.inOut' }
    );
  }, []);

  return (
    <div ref={containerRef} style={{ position: 'fixed', height: '100vh', width: '100vw', opacity: 0 }}>
      <Header />
      <div className={styles.canvasContainer}>
        <Canvas
          shadows
          frameloop="always"
          dpr={dpr}
          gl={{ antialias: true, powerPreference: "high-performance" }}
          camera={{
            fov: 35,
            near: 0.1,
            far: 100,
            position: [ 6, 2, 12],
          }}
        >
          <AdaptiveDpr pixelated />
          <AdaptiveEvents />
          <PerformanceMonitor
              onIncline={() => {
                setDpr(Math.min(2, window.devicePixelRatio))
              }}
              onDecline={() => {
              setDpr(1)
            }}>
            <Experience />
          </PerformanceMonitor>
        </Canvas>
      </div>
    </div>
  );
};
