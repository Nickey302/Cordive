'use client'

import styles from './page.module.css'
import { useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import Header from '../Header.jsx';
import Experience from '../../components/Dystopia/Experience.jsx';
//
//
//
export default function Dystopia()
{
  useEffect(() => {
    return () => {
      // 페이지가 전환되거나 컴포넌트가 unmount될 때 Three.js 리소스를 정리
      console.log('Cleaning up Three.js scene...');
    };
  }, []);

  return (
    <div style={{ position: 'relative', height: '100vh', width: '100vw' }}>
      <Header />
      <div className={styles.canvasContainer}>
        <Canvas
          shadows
          camera={{
            fov: 35,
            near: 0.1,
            far: 300,
            position: [ -4, 3, 12],
          }}
        >
          <Experience />
        </Canvas>
      </div>
    </div>
  );
};