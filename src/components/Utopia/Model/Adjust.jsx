/*
Auto-generated by: https://github.com/pmndrs/gltfjsx
*/

import React, { forwardRef } from 'react'
import { useGLTF } from '@react-three/drei'

export const Model = forwardRef(function Model(props, ref) {
  const { nodes, materials } = useGLTF('/assets/Models/Adjust.glb')
  return (
    <group ref={ref} {...props} dispose={null}>
      <mesh castShadow receiveShadow geometry={nodes.Cube.geometry} material={materials.Material} />
    </group>
  )
})

useGLTF.preload('/assets/Models/Adjust.glb')
