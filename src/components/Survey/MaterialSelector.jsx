'use client'

import { useState, useEffect, useRef } from 'react';
import { Html } from '@react-three/drei';
import * as THREE from 'three';
import * as Tone from 'tone';
import { RigidBody, CuboidCollider } from '@react-three/rapier';
//
//
//
const MATERIALS = [
    { 
        name: 'Holographic', 
        color: '#ffffff',
        note: 'C4',
        position: [-56.25, 20, 30],
        properties: {
            metalness: 1,
            roughness: 0.1,
            transmission: 0.5,
            clearcoat: 1,
            iridescence: 1,
        }
    },
    { 
        name: 'Crystal', 
        color: '#4E7FA0',
        note: 'D4',
        position: [-33.75, 20, 30],
        properties: {
            metalness: 0.8,
            roughness: 0.2,
            transmission: 0.8,
            clearcoat: 1,
        }
    },
    { 
        name: 'Neon', 
        color: '#48546D',
        note: 'E4',
        position: [-11.25, 20, 30],
        properties: {
            metalness: 0.5,
            roughness: 0.2,
            emissive: '#48546D',
            emissiveIntensity: 2,
        }
    },
    { 
        name: 'Mirror', 
        color: '#3c7475',
        note: 'F4',
        position: [11.25, 20, 30],
        properties: {
            metalness: 1,
            roughness: 0,
            envMapIntensity: 2,
        }
    },
    { 
        name: 'Glitch', 
        color: '#426363',
        note: 'G4',
        position: [33.75, 20, 30],
        properties: {
            metalness: 0.7,
            roughness: 0.3,
            clearcoat: 0.5,
        }
    },
    { 
        name: 'Plasma', 
        color: '#45474c',
        note: 'A4',
        position: [56.25, 20, 30],
        properties: {
            metalness: 0.9,
            roughness: 0.1,
            emissive: '#45474c',
            emissiveIntensity: 0.5,
        }
    }
];

export default function MaterialSelector({ onSelect }) {
    const synth = useRef(null);
    const rigidBodyRefs = useRef({});
    const lastCollisionTime = useRef(null);
    const [hasInitialized, setHasInitialized] = useState(false);

    useEffect(() => {
        synth.current = new Tone.Synth().toDestination();
        return () => {
            synth.current.dispose();
        };
    }, []);

    useEffect(() => {
        if (!hasInitialized) {
            // 초기 위치 설정
            MATERIALS.forEach((material, index) => {
                if (rigidBodyRefs.current[material.name]) {
                    rigidBodyRefs.current[material.name].setTranslation({
                        x: material.position[0],
                        y: material.position[1] + 50, // 높은 위치에서 시작
                        z: material.position[2]
                    });
                }
            });
            setHasInitialized(true);
        }
    }, [hasInitialized]);

    const handleCollision = () => {
        // 충돌음 재생 (볼륨 낮추고 쿨타임 추가)
        if (!lastCollisionTime.current || Date.now() - lastCollisionTime.current > 100) {
            synth.current.triggerAttackRelease("C3", "32n", undefined, 0.1);
            lastCollisionTime.current = Date.now();
        }
    };

    const handleMaterialClick = (material) => {
        // 클릭한 재질의 소리 재생
        synth.current.triggerAttackRelease(material.note, "8n", undefined, 0.3);

        // 더 강한 힘으로 수정
        if (rigidBodyRefs.current[material.name]) {
            const force = {
                x: (Math.random() - 0.5) * 50,
                y: Math.random() * 20 + 15,
                z: (Math.random() - 0.5) * 50
            };
            rigidBodyRefs.current[material.name].applyImpulse(force, true);
            
            const torque = {
                x: (Math.random() - 0.5) * 10,
                y: (Math.random() - 0.5) * 10,
                z: (Math.random() - 0.5) * 10
            };
            rigidBodyRefs.current[material.name].applyTorqueImpulse(torque, true);
        }

        onSelect(material);
    };

    return (
        <group>
            {/* 바닥 충돌체 */}
            <RigidBody type="fixed" position={[0, -1.001, 0]}>
                <mesh rotation-x={-Math.PI / 2} visible={false}>
                    <planeGeometry args={[1000, 1000]} />
                    <meshBasicMaterial />
                </mesh>
            </RigidBody>

            {MATERIALS.map((material) => (
                <RigidBody
                    key={material.name}
                    ref={(el) => rigidBodyRefs.current[material.name] = el}
                    colliders="hull"
                    restitution={0.1}
                    friction={0.5}
                    onCollisionEnter={handleCollision}
                >
                    <mesh
                        onClick={() => handleMaterialClick(material)}
                        scale={12}
                    >
                        <cylinderGeometry args={[0.5, 0.5, 4, 64]} />
                        <meshPhysicalMaterial 
                            {...material.properties}
                            color={material.color}
                        />
                    </mesh>
                </RigidBody>
            ))}
        </group>
    );
}