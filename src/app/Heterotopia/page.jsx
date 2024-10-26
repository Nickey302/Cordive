'use client'

import styles from './page.module.css'
import { useEffect, useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import gsap from 'gsap';
import Header from '../Header.jsx';
import Experience from '../../components/Heterotopia/Experience.jsx';
//
//
//
export default function Heterotopia()
{
  const containerRef = useRef();

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
            position: [ - 1.5, 1, 5.5 ],
            fov: 45,
            near: 1,
            far: 200
          }}
        >
          <Experience />
        </Canvas>
      </div>
    </div>
  );
};