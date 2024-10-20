import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import styles from './GlassmorphismOverlay.module.css';

const GlassmorphismOverlay = ({ isOpen, onClose, children }) => {
  const overlayRef = useRef(null);
  const contentRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      gsap.to(overlayRef.current, {
        duration: 0.8,
        opacity: 1,
        scale: 1,
        ease: 'power3.out',
      });
    } else {
      gsap.to(overlayRef.current, {
        duration: 0.5,
        opacity: 0,
        scale: 0.8,
        ease: 'power3.in',
      });
    }
  }, [isOpen]);

  return (
    <div className={`${styles.overlay} ${isOpen ? styles.open : ''}`}>
      <div ref={overlayRef} className={styles.content}>
        <button className={styles.closeButton} onClick={onClose}>
          <span className={styles.redDot}></span>
        </button>
        <div ref={contentRef} className={styles.scrollContent}>
          {children}
        </div>
      </div>
    </div>
  );
};

export default GlassmorphismOverlay;
