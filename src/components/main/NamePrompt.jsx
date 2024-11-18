'use client';

import { useRef, useState, useCallback, useEffect } from 'react';
import styles from './NamePrompt.module.css';
import gsap from 'gsap';
import { supabase } from '@/utils/supabase';

export default function NamePrompt({ onComplete }) {
  const [name, setName] = useState('');
  const containerRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    gsap.fromTo(containerRef.current, 
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 1, ease: 'power3.out' }
    );
    inputRef.current?.focus();
  }, []);

  const saveUserName = async (username) => {
    try {
      const { data, error } = await supabase
        .from('users')
        .insert([{ username, created_at: new Date().toISOString() }])
        .select()
        .single();

      if (error) throw error;
      
      return { id: data.id, username };
    } catch (error) {
      console.error('사용자 저장 중 오류 발생:', error);
      throw error;
    }
  };

  const handleKeyPress = useCallback(async (e) => {
    if (e.key === 'Enter' && name.trim()) {
      try {
        const userData = await saveUserName(name.trim());
        console.log('저장된 사용자 정보:', userData);
        
        sessionStorage.setItem('userData', JSON.stringify({
          username: userData.username,
          userId: userData.id
        }));
        
        gsap.to(containerRef.current, {
          opacity: 0,
          y: -20,
          duration: 1,
          ease: 'power3.inOut',
          onComplete: () => onComplete(userData.username, userData.id)
        });
      } catch (error) {
        console.error('이름 입력 중 오류 발생:', error);
      }
    }
  }, [name, onComplete]);

  return (
    <div ref={containerRef} className={styles.container}>
      <div className={styles.promptBox}>
        <h2 className={styles.title}>당신의 이름은?</h2>
        <div className={styles.inputWrapper}>
          <input
            ref={inputRef}
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            onKeyPress={handleKeyPress}
            className={styles.input}
            maxLength={20}
          />
        </div>
        <p className={styles.hint}>Press Enter to continue</p>
      </div>
    </div>
  );
} 