'use client'

import { useState, useEffect } from 'react'
import AudioVisualizer from './AudioVisualizer'
//
//
//
export default function GlobalAudioVisualizer() {
  const [audio, setAudio] = useState(null)

  useEffect(() => {
    if (!window.globalAudioContext) {
      const audioContext = new (window.AudioContext || window.webkitAudioContext)()
      window.globalAudioContext = audioContext
      
      const event = new CustomEvent('audioContextInit', { 
        detail: audioContext 
      })
      window.dispatchEvent(event)
    }

    const handleAudioInit = (event) => {
      setAudio(event.detail)
    }

    window.addEventListener('audioInit', handleAudioInit)
    return () => window.removeEventListener('audioInit', handleAudioInit)
  }, [])

  return (
    <div style={{ 
      position: 'fixed', 
      top: '20px', 
      right: '0px',
      zIndex: 999
    }}>
      <AudioVisualizer audio={audio} isIdle={!audio} />
    </div>
  )
} 