'use client'

import styles from './page.module.css'
import { Canvas } from '@react-three/fiber';
import Experience from '../../components/Dystopia/Experience.jsx';
import { AdaptiveDpr, AdaptiveEvents, PerformanceMonitor } from '@react-three/drei';
import Overlay from '../../components/Dystopia/Overlay.jsx'
import { useState, Suspense } from 'react';
//
//
//
export default function Dystopia() {
  const [dpr, setDpr] = useState(1)
  const [cameraY, setCameraY] = useState(4)

  const handleAudioInit = (audio) => {
    const event = new CustomEvent('audioInit', { detail: audio })
    window.dispatchEvent(event)
  }

  return (
    <Suspense fallback={null}> 
      <div style={{ position: 'relative', height: '100vh', width: '100vw'}}>
        <Overlay cameraY={cameraY} />
        <div className={styles.canvasContainer}>
          <Canvas
            shadows
            frameloop="always"
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
              <Experience onCameraYChange={(y) => setCameraY(y)} />
            </PerformanceMonitor>
          </Canvas>
        </div>
      </div>
    </Suspense>
  );
}