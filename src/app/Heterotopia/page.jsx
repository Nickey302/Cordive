'use client'

import { useState, useEffect, useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import gsap from 'gsap';
import styles from './page.module.css'
import Header from '../Header.jsx';
import Experience from '../../components/Heterotopia/Experience.jsx';
import InputForm from '../../components/Heterotopia/InputForm.jsx';

export default function Heterotopia()
{
  const containerRef = useRef();
  const [analysisResult, setAnalysisResult] = useState('');

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
      <div className={styles.canvasContainer} >
        <Canvas
          shadows
          gl={{ antialias: true }}
          camera={{
            position: [ - 4, 1, 10 ],
            fov: 45,
            near: 1,
            far: 200
          }}
        >
          <Experience analysisResult={analysisResult} />
        </Canvas>
      </div>
      <InputForm onAnalyze={setAnalysisResult} />
    </div>
  );
};
