/*
Auto-generated by: https://github.com/pmndrs/gltfjsx
*/

import React, { forwardRef } from 'react'
import { useGLTF } from '@react-three/drei'
//
//
//
export const Model = forwardRef(function Model(props, ref) {  
  const { nodes, materials } = useGLTF('/assets/Models/Isolation.glb')
  return (
    <group ref={ref} {...props}>
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Cone002.geometry}
        material={materials['Material.001']}
        position={[-3.858, 0.895, -1.889]}
        rotation={[-Math.PI, 0, 0]}
      />
    </group>
  )
})  

useGLTF.preload('/assets/Models/Isolation.glb')
