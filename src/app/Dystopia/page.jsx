'use client'

import styles from './page.module.css'
import { useEffect, useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import Header from '../Header.jsx';
import Experience from '../../components/Dystopia/Experience.jsx';
import gsap from 'gsap';

export default function Dystopia()
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
    <div ref={containerRef} style={{ position: 'relative', height: '100vh', width: '100vw', opacity: 0 }}>
      <Header />
      <div className={styles.canvasContainer}>
        <Canvas
          shadows
          gl={{ antialias: true }}
          camera={{
            fov: 35,
            near: 0.1,
            far: 500,
            position: [ 6, 2, 12],
          }}
        >
          <Experience />
        </Canvas>
      </div>
    </div>
  );
};
