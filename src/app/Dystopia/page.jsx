'use client'

import styles from './page.module.css'
import { Canvas } from '@react-three/fiber';
import Header from '../Header.jsx';
import Experience from '../../components/Dystopia/Experience.jsx';
import { AdaptiveDpr, AdaptiveEvents, PerformanceMonitor } from '@react-three/drei';
import { useState } from 'react';
//
//
//
export default function Dystopia()
{
  const [dpr, setDpr] = useState(1)

  return (
    <div style={{ position: 'fixed', height: '100vh', width: '100vw'}}>
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
