'use client'

import styles from './page.module.css'
import { Canvas } from '@react-three/fiber';
import { useState } from 'react';
import Experience from '../../components/Utopia/Experience.jsx';
import Header from '../Header.jsx';
import { AdaptiveDpr, AdaptiveEvents, PerformanceMonitor } from '@react-three/drei';
//
//
//
export default function Utopia() {
const [dpr, setDpr] = useState(1)

return (
  <div style={{ position: 'fixed', height: '100vh', width: '100vw' }}>
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
