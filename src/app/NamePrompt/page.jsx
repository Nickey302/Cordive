'use client'

import { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import styles from './NamePrompt.module.css';
import gsap from 'gsap';

export default function NamePrompt() {
  const [name, setName] = useState('');
  const [typedText, setTypedText] = useState('');
  const [showInput, setShowInput] = useState(false);
  const router = useRouter();
  const containerRef = useRef();
  const inputRef = useRef();

  useEffect(() => {
    gsap.to(containerRef.current, { opacity: 1, duration: 1, ease: 'power2.inOut' });

    const text = "ENNTER YOUR NAME ";
    let i = 0;
    const typingInterval = setInterval(() => {
      if (i < text.length) {
        setTypedText(prev => prev + text.charAt(i));
        i++;
      } else {
        clearInterval(typingInterval);
        setShowInput(true);
      }
    }, 100);

    return () => clearInterval(typingInterval);
  }, []);

  useEffect(() => {
    if (showInput && inputRef.current) {
      inputRef.current.focus();
    }
  }, [showInput]);

  const handleKeyPress = useCallback((e) => {
    if (e.key === 'Enter' && name.trim()) {
      try {
        console.log('입력된 이름:', name);
        gsap.to(containerRef.current, {
          opacity: 0,
          duration: 1,
          ease: 'power2.inOut',
          onComplete: () => router.push('/Dystopia')
        });
      } catch (error) {
        console.error('Error navigating to Dystopia:', error);
        // 사용자에게 에러 메시지 표시
      }
    }
  }, [name, router]);

  const handleContainerClick = () => {
    if (showInput && inputRef.current) {
      inputRef.current.focus();
    }
  };

  return (
    <div 
      ref={containerRef} 
      className={styles.container} 
      style={{ opacity: 0 }}
      onClick={handleContainerClick}
    >
      <div className={styles.prompt}>
        <div className={styles.typingText}>
          {typedText}
          {showInput ? name : ''}
          <span className={styles.cursor}></span>
        </div>
        {showInput && (
          <input
            ref={inputRef}
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            onKeyPress={handleKeyPress}
            className={styles.input}
            style={{ opacity: 0 }}
            autoFocus
          />
        )}
      </div>
    </div>
  );
}
