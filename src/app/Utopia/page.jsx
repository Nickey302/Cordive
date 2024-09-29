'use client'

import dynamic from 'next/dynamic';
const Canvas = dynamic(() => import('@react-three/fiber').then((mod) => mod.Canvas), {
  ssr: false,
});
import styles from './page.module.css'
import Experience from '../../components/Utopia/Experience.jsx';
import Header from '../Header.jsx';
//
//
//
export default function Utopia()
{
  return (
    <div style={{ position: 'relative', height: '100vh', width: '100vw' }}>
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
