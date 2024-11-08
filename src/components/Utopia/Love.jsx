
import React, { useRef } from 'react'
import { useGLTF } from '@react-three/drei'

export default function Love(props) {
  const { nodes, materials } = useGLTF('/assets/Models/lovelove.glb')
  return (
    <group {...props} dispose={null}>
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Sphere.geometry}
        material={materials['Material']}
        position={[-0.009, 0.064, -0.015]}
        scale={-0.153 * 10}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Torus013.geometry}
        material={materials['Material.002']}
        position={[0.026, 0, -0.016]}
        scale={[0.284 * 10, 0.284 * 10, 0.253 * 10]}
      />
    </group>
  )
}

useGLTF.preload('/lovelove.glb')