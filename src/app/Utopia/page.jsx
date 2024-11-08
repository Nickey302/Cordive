'use client'

import styles from './page.module.css'
import { Canvas } from '@react-three/fiber';
import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import Experience from '../../components/Utopia/Experience.jsx';
import Header from '../Header.jsx';
import { AdaptiveDpr, AdaptiveEvents, PerformanceMonitor } from '@react-three/drei';
//
//
//
export default function Utopia()
{
const containerRef = useRef();
const [dpr, setDpr] = useState(1)

useEffect(() => {
  gsap.fromTo(
    containerRef.current,
    { opacity: 0 },
    { opacity: 1, duration: 2, ease: 'power2.inOut' }
  );
}, []);

return (
  <div ref={containerRef} style={{ position: 'relative', height: '100vh', width: '100vw' }}>
      <Header />
      <div className={styles.canvasContainer}>
        <Canvas
          shadows
          frameloop="always"
          dpr={dpr}
          gl={{
            antialias: false,
            powerPreference: "high-performance",
          }}
          camera={ {
            fov: 75,
            near: 0.1,
            far: 500,
            position: [ - 10, 15, 60 ]
          } }
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
