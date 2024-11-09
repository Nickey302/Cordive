'use client'

import { useState, useEffect } from 'react'
import styles from './Overlay.module.css'

export default function Overlay({ cameraY }) {
    const [depth, setDepth] = useState(0)
    
    useEffect(() => {
        // 카메라 Y 위치를 미터 단위로 변환 (절대값 사용)
        setDepth(Number(Math.abs(cameraY - 0.2).toFixed(1)))
    }, [cameraY])

    return (
        <div className={styles.overlay}>
            <div className={styles.depthMeter}>
                <h2>{depth * 4}m</h2>
                {depth >= 38 && (
                    <div className={styles.message}>
                        <p>혼합층에 도달했습니다.</p>
                    </div>
                )}
            </div>
            {depth <= 1 && (
                <div className={styles.message}>
                    <p>더 깊은 잠수를 위해 스크롤을 하세요</p>
                </div>
            )}
        </div>
    )
} 