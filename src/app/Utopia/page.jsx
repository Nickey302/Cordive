'use client'

import styles from './page.module.css'
import { Canvas } from '@react-three/fiber';
import { useState, useEffect } from 'react';
import Experience from '../../components/Utopia/Experience.jsx';
import ObjectsOverlay from '../../components/Utopia/ObjectsOverlay.jsx';
import { AdaptiveDpr, AdaptiveEvents, PerformanceMonitor } from '@react-three/drei';
import { supabase } from '../../utils/supabase';

export default function Utopia() {
  const [dpr, setDpr] = useState(1)
  const [activeObject, setActiveObject] = useState(null)
  const [customObjects, setCustomObjects] = useState([])

  useEffect(() => {
    const loadCustomObjects = async () => {
      const { data, error } = await supabase
        .from('custom_objects')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error loading objects:', error);
        return;
      }

      setCustomObjects(data);
    };

    loadCustomObjects();
  }, []);

  return (
    <div style={{ position: 'relative', height: '100vh', width: '100vw' }}>
      <ObjectsOverlay 
        activeObject={activeObject} 
        setActiveObject={setActiveObject} 
        customObjects={customObjects}
      />
      <div className={styles.canvasContainer}>
        <Canvas
          shadows
          frameloop="always"
          dpr={dpr}
          gl={{
            antialias: false,
            powerPreference: "high-performance",
          }}
          camera={ {
            fov: 75,
            near: 0.1,
            far: 400,
            position: [ - 10, 5, 80 ]
          } }
        >
          <AdaptiveDpr pixelated />
          <AdaptiveEvents />
          <PerformanceMonitor
            onIncline={() => setDpr(Math.min(2, window.devicePixelRatio))}
            onDecline={() => setDpr(1)}
          > 
            <Experience 
              activeObject={activeObject} 
              customObjects={customObjects}
            />
          </PerformanceMonitor>
        </Canvas>
      </div>
    </div>
  );
}
