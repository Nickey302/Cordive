'use client'

import styles from './page.module.css'
import { useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import Header from '../Header.jsx';
import Experience from '../../components/Heterotopia/Experience.jsx';
//
//
//
export default function Heterotopia()
{
  useEffect(() => {
    return () => {
      console.log('Cleaning up Three.js scene...');
    };
  }, []);

  return (
    <div style={{ position: 'relative', height: '100vh', width: '100vw' }}>
      <Header />
      <div className={styles.canvasContainer} >
        <Canvas
          shadows
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