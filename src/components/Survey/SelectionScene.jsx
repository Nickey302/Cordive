'use client'

import { Physics, RigidBody } from '@react-three/rapier';
import { Line, MeshReflectorMaterial } from "@react-three/drei";
import { useThree } from '@react-three/fiber';
import GeometrySelector from './GeometrySelector';
import MaterialSelector from './MaterialSelector';
import gsap from 'gsap';
import * as THREE from 'three';
//
//
//
export default function SelectionScene({ step, onGeometrySelect, onMaterialSelect }) {
    const { camera, controls } = useThree();

    const handleGeometrySelect = (geometry) => {
        gsap.to(camera.position, {
            x: 0,
            y: 50,
            z: 150,
            duration: 2,
            ease: "power2.inOut",
            onComplete: () => {
                onGeometrySelect(geometry);
            }
        });
        
        if (controls) {
            const targetPosition = new THREE.Vector3(0, 20, 0);
            gsap.to(controls.target, {
                x: targetPosition.x,
                y: targetPosition.y,
                z: targetPosition.z,
                duration: 2,
                ease: "power2.inOut"
            });
        }
    };

    return (
        <>
            <RigidBody type="fixed" colliders="trimesh">
                <mesh receiveShadow position={[0, -1, 0]} rotation={[-Math.PI / 2, 0, 0]}>
                    <planeGeometry args={[400, 400]} />
                    <MeshReflectorMaterial
                        attach="material"
                        blur={[300, 30]}
                        resolution={512}
                        mixBlur={1}
                        mixStrength={180}
                        roughness={1}
                        depthScale={1.2}
                        minDepthThreshold={0.4}
                        maxDepthThreshold={1.4}
                        color="#48546D"
                        mirror={0.75}
                        metalness={1.0}
                        reflectorOffset={0.2}
                    />
                </mesh>
            </RigidBody>

            <GeometrySelector onSelect={handleGeometrySelect} />
            
            {step >= 2 && (  // step이 2 이상일 때만 MaterialSelector 렌더링
                <MaterialSelector 
                    onSelect={onMaterialSelect} 
                    isActive={step === 2}
                />
            )}
        </>
    );
} 