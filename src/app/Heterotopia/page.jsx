'use client'

import { useState } from 'react';
import { Canvas } from '@react-three/fiber';
import styles from './page.module.css'
import Experience from '../../components/Heterotopia/Experience.jsx';
import { AdaptiveEvents, PerformanceMonitor, AdaptiveDpr } from '@react-three/drei';
//
//
//
export default function Heterotopia()
{
  const [dpr, setDpr] = useState(1)
  
  return (
    <div style={{ position: 'relative', height: '100vh', width: '100vw' }}>
      <div className={styles.canvasContainer} >
        <Canvas
          frameloop="always"
          dpr={dpr}
          shadows
          gl={{ antialias: true, powerPreference: "high-performance" }}
          camera={{
            position: [ 3, 50, 200 ],
            fov: 45,
            near: 1,
            far: 550
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
