'use client'

import { useEffect, useRef, useState } from 'react'
import styled from 'styled-components'
import * as THREE from 'three'

const VisualizerContainer = styled.div`
  position: fixed;
  top: 20px;
  right: 20px;
  width: 200px;
  height: 60px;
  background: rgba(0, 0, 0, 0.3);
  border-radius: 10px;
  cursor: pointer;
  z-index: 1000;
  
  canvas {
    width: 100%;
    height: 100%;
    border-radius: 10px;
  }
`

const MuteIcon = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  color: white;
  font-size: 24px;
  opacity: ${props => props.$isMuted ? 1 : 0};
  transition: opacity 0.3s;
`

export default function AudioVisualizer({ audio }) {
  const canvasRef = useRef()
  const analyserRef = useRef()
  const animationFrameRef = useRef()
  const [isMuted, setIsMuted] = useState(false)

  useEffect(() => {
    if (!audio) return

    const audioContext = audio.context
    analyserRef.current = audioContext.createAnalyser()
    analyserRef.current.fftSize = 256
    
    // PositionalAudio의 gain에 분석기 연결
    audio.gain.connect(analyserRef.current)

    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')

    const animate = () => {
      const dataArray = new Uint8Array(analyserRef.current.frequencyBinCount)
      analyserRef.current.getByteFrequencyData(dataArray)
      
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      
      const barWidth = canvas.width / 32
      let x = 0
      
      for(let i = 0; i < 32; i++) {
        const barHeight = (dataArray[i] / 255) * canvas.height
        
        ctx.fillStyle = `hsl(${i * 360/32}, 100%, 50%)`
        ctx.fillRect(x, canvas.height - barHeight, barWidth - 1, barHeight)
        
        x += barWidth
      }
      
      animationFrameRef.current = requestAnimationFrame(animate)
    }
    
    animate()
    
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
    }
  }, [audio])

  const handleClick = () => {
    if (!audio) return
    
    if (isMuted) {
      audio.setVolume(10) // 원래 볼륨으로 복구
    } else {
      audio.setVolume(0) // 음소거
    }
    setIsMuted(!isMuted)
  }

  return (
    <VisualizerContainer onClick={handleClick}>
      <canvas ref={canvasRef} width="200" height="60" />
      <MuteIcon $isMuted={isMuted}>🔇</MuteIcon>
    </VisualizerContainer>
  )
}