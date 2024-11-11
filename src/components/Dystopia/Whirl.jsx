import { useMemo, useRef } from 'react'
import * as THREE from 'three'
import { useFrame } from '@react-three/fiber'
import { useLoader } from '@react-three/fiber'
import { TextureLoader } from 'three'

export default function Vortex() {
  const points = useRef()
  const positionsArray = useRef()
  
  const parameters = useMemo(() => ({
    count: 100000,
    size: 0.09,
    radius: 8,
    topRadius: 16,
    bottomRadius: 0.05,
    height: 80,
    rotationSpeed: 2,
    spin: 5,
    branches: 10,
    branchWidth: 0.15,
    randomness: 2.0,
    randomnessPower: 2,
    flowSpeed: 2,
    inwardForce: 1.0,
    spiralTightness: 0.8,
    colorRandomness: 0.2,
    insideColor: '#f2f2f3',
    branchColor: '#3c7475',
    outsideColor: '#48546d',
    accentColor: '#4e7fa0',
  }), [])

  const { positions, colors } = useMemo(() => {
    const positions = new Float32Array(parameters.count * 3)
    const colors = new Float32Array(parameters.count * 3)
    positionsArray.current = positions

    const colorInside = new THREE.Color(parameters.insideColor)
    const colorBranch = new THREE.Color(parameters.branchColor)
    const colorOutside = new THREE.Color(parameters.outsideColor)
    const colorAccent = new THREE.Color(parameters.accentColor)

    for(let i = 0; i < parameters.count; i++) {
      const i3 = i * 3
      
      // 파티클을 두 그룹으로 나눔: 브랜치용과 주변 파티클용
      const isBranchParticle = Math.random() < 0.2 // 20%는 브랜치 파티클

      // 높이에 따른 반지름 계산
      const heightFactor = i / parameters.count
      const currentRadius = THREE.MathUtils.lerp(
        parameters.topRadius,
        parameters.bottomRadius,
        heightFactor
      )
      
      const height = heightFactor * parameters.height
      const spinAngle = height * parameters.spin
      
      if (isBranchParticle) {
        // 브랜치 파티클 위치 계산
        const branchAngle = (Math.floor(Math.random() * parameters.branches) / parameters.branches) * Math.PI * 2
        const branchOffset = (Math.random() - 0.5) * parameters.branchWidth
        const adjustedBranchAngle = branchAngle + spinAngle + branchOffset

        positions[i3] = Math.cos(adjustedBranchAngle) * currentRadius
        positions[i3 + 1] = -height - 41
        positions[i3 + 2] = Math.sin(adjustedBranchAngle) * currentRadius

        // 브랜치 파티클에 랜덤하게 다양한 색상 적용
        const colorChoice = Math.random()
        if (colorChoice < 0.6) {  // 60% 흰색
          colors[i3] = colors[i3 + 1] = colors[i3 + 2] = 1
        } else if (colorChoice < 0.8) {  // 20% 첫번째 액센트 색상
          colors[i3] = colorAccent.r
          colors[i3 + 1] = colorAccent.g
          colors[i3 + 2] = colorAccent.b
        } else {  // 20% 두번째 액센트 색상
          colors[i3] = colorAccent.r
          colors[i3 + 1] = colorAccent.g
          colors[i3 + 2] = colorAccent.b
        }
      } else {
        // 주변 파티클 위치 계산
        const angle = Math.random() * Math.PI * 2
        const radiusRandomness = Math.random() * parameters.randomness * currentRadius
        const randomX = Math.pow(Math.random(), parameters.randomnessPower) * 
                       (Math.random() < 0.5 ? 1 : -1) * radiusRandomness
        const randomZ = Math.pow(Math.random(), parameters.randomnessPower) * 
                       (Math.random() < 0.5 ? 1 : -1) * radiusRandomness
        const randomY = (Math.random() - 0.5) * parameters.randomness

        positions[i3] = Math.cos(angle) * currentRadius + randomX
        positions[i3 + 1] = -height - 41 + randomY
        positions[i3 + 2] = Math.sin(angle) * currentRadius + randomZ

        // 주변 파티클 색상
        const mixedColor = colorBranch.clone()
        mixedColor.lerp(colorOutside, Math.random() * 0.5)
        colors[i3] = mixedColor.r
        colors[i3 + 1] = mixedColor.g
        colors[i3 + 2] = mixedColor.b
      }
    }

    return { positions, colors }
  }, [parameters])

  // 텍스처 로드
  const particleTexture = useLoader(TextureLoader, '/assets/textures/1.png')

  useFrame((state, delta) => {
    if (points.current && positionsArray.current) {
      points.current.rotation.y += delta * parameters.rotationSpeed

      const positions = points.current.geometry.attributes.position.array
      for(let i = 0; i < parameters.count; i++) {
        const i3 = i * 3
        
        // 현재 위치와 반경 계산
        const x = positions[i3]
        const z = positions[i3 + 2]
        const currentRadius = Math.sqrt(x * x + z * z)
        
        // 높이에 따른 목표 반경 계산 (위에서 아래로)
        const heightFactor = (-positions[i3 + 1] - 41) / parameters.height
        const targetRadius = THREE.MathUtils.lerp(
          parameters.bottomRadius,
          parameters.topRadius,
          1 - heightFactor
        )
        
        // 현재 각도와 나선 회전 계산
        const angle = Math.atan2(z, x)
        const spiralAngle = angle + delta * parameters.spiralTightness * heightFactor
        
        // 중심으로 향하는 힘 적용
        const newRadius = THREE.MathUtils.lerp(
          currentRadius,
          targetRadius,
          delta * parameters.inwardForce
        )
        
        // 위치 업데이트 (아래로 흐름)
        positions[i3] = Math.cos(spiralAngle) * newRadius
        positions[i3 + 1] -= delta * parameters.flowSpeed
        positions[i3 + 2] = Math.sin(spiralAngle) * newRadius
        
        // 리셋 로직 (바닥에 도달하면 위로 리셋)
        if(positions[i3 + 1] < -41 - parameters.height) {
          positions[i3 + 1] = -41
          
          // 브랜치 기반 시작 위치 계산
          const branchAngle = (Math.floor(Math.random() * parameters.branches) / parameters.branches) * Math.PI * 2
          const branchOffset = (Math.random() - 0.5) * parameters.branchWidth
          
          // 랜덤성 추가
          const radiusRandomness = Math.random() * parameters.randomness * parameters.topRadius
          const randomX = Math.pow(Math.random(), parameters.randomnessPower) * 
                         (Math.random() < 0.5 ? 1 : -1) * radiusRandomness
          const randomZ = Math.pow(Math.random(), parameters.randomnessPower) * 
                         (Math.random() < 0.5 ? 1 : -1) * radiusRandomness
          
          // 최종 시작 위치 계산
          positions[i3] = Math.cos(branchAngle + branchOffset) * parameters.topRadius + randomX
          positions[i3 + 2] = Math.sin(branchAngle + branchOffset) * parameters.topRadius + randomZ
        }
      }
      points.current.geometry.attributes.position.needsUpdate = true
    }
  })

  return (
    <points ref={points}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={positions.length / 3}
          array={positions}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-color"
          count={colors.length / 3}
          array={colors}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={parameters.size}
        sizeAttenuation={true}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        vertexColors={true}
        transparent={true}
        opacity={0.8}
        map={particleTexture}
      />
    </points>
  )
}
