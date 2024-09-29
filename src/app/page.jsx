'use client';

import styles from './page.module.css';
import { Canvas } from '@react-three/fiber';
import Experience from '../components/main/Experience.jsx';
import Header from './Header.jsx';
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
            fov: 35,
            near: 0.1,
            far: 2000,
            position: [-4, 85, 140],
          }}
        >
          <Experience />
        </Canvas>
      </div>
    </div>
  );
};
