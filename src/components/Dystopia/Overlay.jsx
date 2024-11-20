'use client'

import { useState, useEffect } from 'react'
import styles from './Overlay.module.css'
//
//
//
export default function Overlay({ cameraY }) {
    const [depth, setDepth] = useState(0)
    const [holdingProgress, setHoldingProgress] = useState(0)
    const [message, setMessage] = useState("")
    
    useEffect(() => {
        setDepth(Number(Math.abs(cameraY - 0.2).toFixed(1)))
        
        if (cameraY < -38) {
            const progress = ((Math.abs(cameraY) - 38) / (119 - 38)) * 100
            setHoldingProgress(Math.min(Math.round(progress), 100))
        } else {
            setHoldingProgress(0)
        }

        const newMessage = getMessage(cameraY)
        if (newMessage !== message) {
            setMessage(newMessage)
        }
    }, [cameraY, message])

    const getMessage = (y) => {
        if (y > 0.5) {
            return ""
        } else if (y > - 4) {
            return "디스토피아 : 음성부력의 세계"
        } else if (y > - 10) {
            return "스크롤을 통해 위로 올라가세요"
        } else if (y > -16) {
            return "음성부력의 세계에서는 아무리 몸부림쳐도 아래로 가라앉습니다"
        } else if (y > -20) {
            return "소용돌이로 빨려 들어갑니다"
        } else if (y > -28) {
            return "소용돌이에 빠졌을 때는 수면에서 나오려 하지 말고"
        } else if (y > -38) {
            return "숨을 참고 밑바닥까지 잠수해서 빠져나와야 합니다"
        } else if (y > -42) {
            return "마우스 왼쪽 클릭을 홀딩하여 더 깊이 잠수하세요"
        } else return ""
    }

    return (
        <div className={styles.overlay}>
            <div className={`${styles.depthMeter} ${styles.fadeIn}`}>
                <h2>{depth * 4}m</h2>
            </div>
            <div className={`${styles.message} ${styles.fadeIn}`}>
                <p className={styles.messageText}>{message}</p>
                {cameraY <= -38 && (
                    <div className={styles.holdingProgress}>
                        <div className={styles.progressBarContainer}>
                            <svg className={styles.progressRing} viewBox="0 0 100 100">
                                <circle className={styles.progressRingBg} cx="50" cy="50" r="45" />
                                <circle 
                                    className={styles.progressRingPath} 
                                    cx="50" 
                                    cy="50" 
                                    r="45"
                                    style={{
                                        strokeDashoffset: `${(1 - holdingProgress / 100) * 283}px`
                                    }}
                                />
                            </svg>
                            <p className={styles.progressText}>{holdingProgress}%</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
} 