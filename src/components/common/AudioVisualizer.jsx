'use client'

import { useEffect, useRef, useState } from 'react'
import styles from './AudioVisualizer.module.css'

export default function AudioVisualizer({ audio }) {
  const canvasRef = useRef()
  const analyserRef = useRef()
  const animationFrameRef = useRef()
  const previousHeightsRef = useRef(new Array(15).fill(2))
  const [isMuted, setIsMuted] = useState(false)

  useEffect(() => {
    if (!audio) return

    const audioContext = audio.context
    analyserRef.current = audioContext.createAnalyser()
    analyserRef.current.fftSize = 256
    
    audio.gain.connect(analyserRef.current)

    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    const centerY = canvas.height / 2

    const animate = () => {
      const dataArray = new Uint8Array(analyserRef.current.frequencyBinCount)
      analyserRef.current.getByteFrequencyData(dataArray)
      
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      
      const barWidth = 2
      const gap = 2
      const totalBars = 20
      const startX = (canvas.width - (totalBars * (barWidth + gap) - gap)) / 2
      let x = startX
      
      ctx.fillStyle = '#FFFFFF'
      
      for(let i = 0; i < totalBars; i++) {
        let targetHeight
        
        if (isMuted) {
          targetHeight = 2
        } else {
          const baseHeight = 160 - (i * 5)
          const dataIndex = Math.floor(i * dataArray.length / totalBars)
          const audioLevel = (dataArray[dataIndex] / 255)
          const time = Date.now() / 1000
          const wave = Math.sin(i * 0.5 + time * 3) * 10
          targetHeight = baseHeight * audioLevel + wave
        }

        previousHeightsRef.current[i] = previousHeightsRef.current[i] + (targetHeight - previousHeightsRef.current[i]) * 0.15

        const barHeight = previousHeightsRef.current[i]
        ctx.fillRect(x, centerY - barHeight/2, barWidth, barHeight)
        x += barWidth + gap
      }
      
      animationFrameRef.current = requestAnimationFrame(animate)
    }
    
    animate()
    
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
    }
  }, [audio, isMuted])

  const handleClick = () => {
    if (!audio) return
    
    if (isMuted) {
      audio.setVolume(10)
    } else {
      audio.setVolume(0)
    }
    setIsMuted(!isMuted)
  }

  return (
    <div className={styles.visualizerContainer} onClick={handleClick}>
      <canvas ref={canvasRef} width="200" height="60" />
    </div>
  )
}