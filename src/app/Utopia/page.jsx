'use client'

import dynamic from 'next/dynamic';

const Canvas = dynamic(() => import('@react-three/fiber').then((mod) => mod.Canvas), {
  ssr: false,
});
import Experience from './components/Utopia/Experience.jsx';
import '../styles/style.css';
import Header from '../components/Header.jsx';

const Utopia = () => {
  return (
    <div style={{ position: 'relative', height: '100vh', width: '100vw' }}>
    <Header />

    <div id="canvas-container">
      <Canvas
        shadows={ true }
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

export default Utopia;
