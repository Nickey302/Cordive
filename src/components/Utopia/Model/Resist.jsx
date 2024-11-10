/*
Auto-generated by: https://github.com/pmndrs/gltfjsx
*/

import React, { forwardRef } from 'react'
import { useGLTF } from '@react-three/drei'

export const Model = forwardRef(function Model(props, ref) {
  const { nodes, materials } = useGLTF('/assets/Models/Resist.glb')
  return (
    <group ref={ref} {...props}>
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Plane041.geometry}
        material={materials['Material.001']}
        position={[0.39, 0.259, -0.412]}
        rotation={[-2.237, 1.124, -0.744]}
        scale={0.574}
      />
    </group>
  )
})  

useGLTF.preload('/assets/Models/Resist.glb')
