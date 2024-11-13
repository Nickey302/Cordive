'use client'

import { useState } from 'react';
import { Canvas } from '@react-three/fiber';
import styles from './page.module.css'
import Header from '../Header.jsx';
import Experience from '../../components/Heterotopia/Experience.jsx';
import InputForm from '../../components/Heterotopia/InputForm.jsx';
import { AdaptiveEvents, PerformanceMonitor, AdaptiveDpr } from '@react-three/drei';
//
//
//
export default function Heterotopia()
{
  // const [analysisResult, setAnalysisResult] = useState('');
  const [dpr, setDpr] = useState(1)
  
  return (
    <div style={{ position: 'relative', height: '100vh', width: '100vw' }}>
      <Header />
      <div className={styles.canvasContainer} >
        <Canvas
          frameloop="always"
          dpr={dpr}
          shadows
          gl={{ antialias: true, powerPreference: "high-performance" }}
          camera={{
            position: [ 3, 30, 50 ],
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
      {/* <InputForm onAnalyze={setAnalysisResult} /> */}
    </div>
  );
};
