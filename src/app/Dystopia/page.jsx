'use client'

import styles from './page.module.css'
import { Canvas } from '@react-three/fiber';
import Header from '../Header.jsx';
import Experience from '../../components/Dystopia/Experience.jsx';
import { AdaptiveDpr, AdaptiveEvents, PerformanceMonitor } from '@react-three/drei';
import Overlay from '../../components/Dystopia/Overlay.jsx'
import { useState } from 'react';
//
//
//
export default function Dystopia()
{
  const [dpr, setDpr] = useState(1)
  const [cameraY, setCameraY] = useState(4)

  return (
    <div style={{ position: 'fixed', height: '100vh', width: '100vw'}}>
      <Header />
      <Overlay cameraY={cameraY} />
      <div className={styles.canvasContainer}>
        <Canvas
          shadows
          frameloop="demand"
          dpr={dpr}
          gl={{ antialias: false, powerPreference: "high-performance" }}
          camera={{
            fov: 35,
            near: 1,
            far: 300,
            position: [ 6, 2, 12 ],
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
            <Experience onCameraYChange={setCameraY} />
          </PerformanceMonitor>
        </Canvas>
      </div>
    </div>
  );
};
