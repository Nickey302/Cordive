'use client'

// src/app/Utopia/page.jsx
import { Canvas } from '@react-three/fiber';
import Experience from '../components/Utopia/Experience.jsx'; // Assuming Experience.jsx is placed in the correct path
import './style.css';

const Utopia = () => {
  return (
    <div id="canvas-container">
      <Canvas
        shadows={ true }
        camera={ {
          fov: 35,
          near: 0.1,
          far: 300,
          position: [ - 4, 3, 100 ]
        } }
      >
        <Experience />  {/* This will render your 3D Experience */}
      </Canvas>
    </div>
  );
};

export default Utopia;
