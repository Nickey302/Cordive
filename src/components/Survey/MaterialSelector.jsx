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
        color: '#FFffff',
        note: 'C4',
        position: [-56.25, 20, 30],
        properties: {
            metalness: 0.3,
            roughness: 0.1,
            transmission: 0.8,
            clearcoat: 1,
            iridescence: 1,
            iridescenceIOR: 2,
            iridescenceThicknessRange: [100, 400],
        }
    },
    { 
        name: 'Crystal', 
        color: '#ccFFFF',
        note: 'D4',
        position: [-33.75, 20, 30],
        properties: {
            metalness: 0.1,
            roughness: 0.1,
            transmission: 0.9,
            thickness: 0.5,
            clearcoat: 1,
            ior: 2.4,
        }
    },
    { 
        name: 'Neon', 
        color: '#FF9ECD',
        note: 'E4',
        position: [-11.25, 20, 30],
        properties: {
            metalness: 0,
            roughness: 0.1,
            emissive: '#FF9ECD',
            emissiveIntensity: 4,
            clearcoat: 0.3,
            transmission: 0.4,
            ior: 1.2
        }
    },
    { 
        name: 'Mirror', 
        color: '#C0C0C0',
        note: 'F4',
        position: [11.25, 20, 30],
        properties: {
            metalness: 1,
            roughness: 0,
            envMapIntensity: 3,
            clearcoat: 1,
        }
    },
    { 
        name: 'Glitch', 
        color: '#aaFF9F',
        note: 'G4',
        position: [33.75, 20, 30],
        properties: {
            metalness: 0.9,
            roughness: 0.6,
            clearcoat: 1,
            emissive: '#aaFF9F',
            emissiveIntensity: 2,
            iridescence: 1,
            iridescenceIOR: 2.5,
            transmission: 0.3,
            sheen: 0.8
        }
    },
    { 
        name: 'Plasma', 
        color: '#7B68EE',
        note: 'A4',
        position: [56.25, 20, 30],
        properties: {
            metalness: 0.5,
            roughness: 0.2,
            emissive: '#7B68EE',
            emissiveIntensity: 3,
            clearcoat: 0.8,
            transmission: 0.6,
            ior: 2,
        }
    }
];

export default function MaterialSelector({ onSelect, isActive }) {
    const synth = useRef(null);
    const rigidBodyRefs = useRef({});
    const lastCollisionTime = useRef(null);
    const [isActivated, setIsActivated] = useState(false);

    useEffect(() => {
        synth.current = new Tone.Synth().toDestination();
        return () => {
            synth.current.dispose();
        };
    }, []);

    useEffect(() => {
        if (isActive) {
            setIsActivated(true);
        }
    }, [isActive]);

    useEffect(() => {
        if (!isActivated) {
            MATERIALS.forEach((material) => {
                if (rigidBodyRefs.current[material.name]) {
                    rigidBodyRefs.current[material.name].setTranslation({
                        x: material.position[0],
                        y: material.position[1] + 100,
                        z: material.position[2]
                    });
                }
            });
        } else {
            MATERIALS.forEach((material) => {
                if (rigidBodyRefs.current[material.name]) {
                    rigidBodyRefs.current[material.name].setTranslation({
                        x: material.position[0],
                        y: material.position[1] + 100,
                        z: material.position[2]
                    });
                }
            });
        }
    }, [isActivated]);

    const handleCollision = () => {
        if (!lastCollisionTime.current || Date.now() - lastCollisionTime.current > 100) {
            synth.current.triggerAttackRelease("C3", "32n", undefined, 0.1);
            lastCollisionTime.current = Date.now();
        }
    };

    const handleMaterialClick = (material) => {
        synth.current.triggerAttackRelease(material.note, "8n", undefined, 0.3);

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
                    restitution={0.2}
                    friction={0.7}
                    linearDamping={0.5}
                    angularDamping={0.5}
                    mass={1}
                    onCollisionEnter={handleCollision}
                >
                    <mesh
                        onClick={() => isActivated && handleMaterialClick(material)}
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