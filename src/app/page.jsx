'use client'

import { useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import Experience from './components/Dystopia/Experience.jsx';
import Header from './components/Header.jsx';

const Main = () => {
  useEffect(() => {
    return () => {
      console.log('Cleaning up Three.js scene');
    };
  }, []);

  return (
    <div style={{ position: 'relative', height: '100vh', width: '100vw' }}>
      <Header />

      <div id="canvas-container" style={{ height: '100%', width: '100%' }}>
        <Canvas
          shadows={true}
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

export default Main;
