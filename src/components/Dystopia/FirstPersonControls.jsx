import { useEffect, useRef } from 'react'
import { useThree, useFrame } from '@react-three/fiber'

export default function FirstPersonControls() {
    const { camera } = useThree()
    
    // keys 객체를 useRef로 컴포넌트 레벨에서 관리
    const keys = useRef({ 
        w: false, s: false, a: false, d: false,
        ㅈ: false, ㄴ: false, ㅁ: false, ㅇ: false 
    })
    
    useEffect(() => {
        const handleKeyDown = (e) => {
            const key = e.key.toLowerCase()
            if (key === 'w' || key === 'ㅈ') keys.current.w = keys.current.ㅈ = true
            if (key === 's' || key === 'ㄴ') keys.current.s = keys.current.ㄴ = true
            if (key === 'a' || key === 'ㅁ') keys.current.a = keys.current.ㅁ = true
            if (key === 'd' || key === 'ㅇ') keys.current.d = keys.current.ㅇ = true
        }
        
        const handleKeyUp = (e) => {
            const key = e.key.toLowerCase()
            if (key === 'w' || key === 'ㅈ') keys.current.w = keys.current.ㅈ = false
            if (key === 's' || key === 'ㄴ') keys.current.s = keys.current.ㄴ = false
            if (key === 'a' || key === 'ㅁ') keys.current.a = keys.current.ㅁ = false
            if (key === 'd' || key === 'ㅇ') keys.current.d = keys.current.ㅇ = false
        }
        
        window.addEventListener('keydown', handleKeyDown)
        window.addEventListener('keyup', handleKeyUp)
        
        return () => {
            window.removeEventListener('keydown', handleKeyDown)
            window.removeEventListener('keyup', handleKeyUp)
        }
    }, [])

    const speed = 0.1

    useFrame(() => {
        if (keys.current.w || keys.current.ㅈ) camera.translateZ(-speed)
        if (keys.current.s || keys.current.ㄴ) camera.translateZ(speed)
        if (keys.current.a || keys.current.ㅁ) camera.translateX(-speed)
        if (keys.current.d || keys.current.ㅇ) camera.translateX(speed)
    })

    return null
}
