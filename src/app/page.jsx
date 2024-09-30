'use client';

import styles from './page.module.css';
import { Canvas } from '@react-three/fiber';
import Experience from '../components/main/Experience.jsx';
import Header from './Header.jsx';
import * as THREE from 'three'
//
//
//
export default function MainPage(){
  return (
    <div style={{ position: 'relative', height: '100vh', width: '100vw' }}>
      <Header />
      <div className={styles.canvasContainer}>
        <Canvas
          shadows
          camera={{
            fov: 25,
            near: 0.1,
            far: 100,
            position: [0, 0, 6],
          }}
        >
          <Experience />
        </Canvas>
      </div>
    </div>
  );
};
