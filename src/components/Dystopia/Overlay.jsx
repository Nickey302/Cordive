'use client'

import { useState, useEffect } from 'react'
import styles from './Overlay.module.css'

export default function Overlay({ cameraY }) {
    const [depth, setDepth] = useState(0)
    const [holdingProgress, setHoldingProgress] = useState(0)
    const [message, setMessage] = useState("")
    
    useEffect(() => {
        setDepth(Number(Math.abs(cameraY - 0.2).toFixed(1)))
        
        if (cameraY < -38) {
            const progress = ((Math.abs(cameraY) - 38) / (123 - 38)) * 100
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
        if (y > 0) {
            return "더 깊은 잠수를 위해 스크롤을 하세요"
        } else if (y > -38) {
            return "계속해서 스크롤을 하세요"
        } else {
            return "클릭을 홀딩하여 더 깊이 잠수하세요"
        }
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
                            <div className={styles.progressBarBg} />
                            <div 
                                className={styles.progressBar} 
                                style={{ width: `${holdingProgress}%` }}
                            />
                        </div>
                        <p className={styles.progressText}>{holdingProgress}%</p>
                    </div>
                )}
            </div>
        </div>
    )
} 