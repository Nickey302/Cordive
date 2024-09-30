'use client'

import styles from './page.module.css'
import { Canvas } from '@react-three/fiber';
import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import Experience from '../../components/Utopia/Experience.jsx';
import Header from '../Header.jsx';
//
//
//
export default function Utopia()
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
      <div className={styles.canvasContainer}>
        <Canvas
          shadows
          camera={ {
            fov: 75,
            near: 0.1,
            far: 500,
            position: [ - 10, 15, 300 ]
          } }
        >
          <Experience />
        </Canvas>
      </div>
    </div>
  );
};
