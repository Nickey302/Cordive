'use client'

import { useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import Header from '../components/Header.jsx';
import Experience from '../components/Heterotopia/Experience.jsx';

const Heterotopia = () => {
  useEffect(() => {
    return () => {
      // 페이지가 전환되거나 컴포넌트가 unmount될 때 Three.js 리소스를 정리
      console.log('Cleaning up Three.js scene...');
    };
  }, []);

  return (
    <div style={{ position: 'relative', height: '100vh', width: '100vw' }}>
    {/* Header를 Canvas 위에 오버레이하기 위해 absolute로 위치 설정 */}
    <Header />
    <div id="canvas-container" style={{ height: '100vh', width: '100vw' }}>
      <Canvas
        shadows={true}
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

export default Heterotopia;