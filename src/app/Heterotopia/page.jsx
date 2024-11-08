'use client'

import { useState, useEffect, useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import gsap from 'gsap';
import styles from './page.module.css'
import Header from '../Header.jsx';
import Experience from '../../components/Heterotopia/Experience.jsx';
import InputForm from '../../components/Heterotopia/InputForm.jsx';
import { AdaptiveEvents, PerformanceMonitor, AdaptiveDpr } from '@react-three/drei';

export default function Heterotopia()
{
  const containerRef = useRef();
  const [analysisResult, setAnalysisResult] = useState('');
  const [dpr, setDpr] = useState(1)

  useEffect(() => {
    gsap.fromTo(
      containerRef.current,
      { opacity: 0 },
      { opacity: 1, duration: 1, ease: 'power2.inOut' }
    );
  }, []);
  
  return (
    <div ref={containerRef} style={{ position: 'relative', height: '100vh', width: '100vw' }}>
      <Header />
      <div className={styles.canvasContainer} >
        <Canvas
          frameloop="always"
          dpr={dpr}
          shadows
          gl={{ antialias: true, powerPreference: "high-performance" }}
          camera={{
            position: [ - 4, 1, 10 ],
            fov: 45,
            near: 1,
            far: 200
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
            <Experience analysisResult={analysisResult} />
          </PerformanceMonitor>
        </Canvas>
      </div>
      <InputForm onAnalyze={setAnalysisResult} />
    </div>
  );
};
