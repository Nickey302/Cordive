'use client'

import { useEffect, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Line } from "@react-three/drei";
import * as THREE from 'three';
import gsap from 'gsap';
import { RigidBody, CuboidCollider, Physics } from '@react-three/rapier';
//
//
//
const GEOMETRIES = [
    { name: 'Cube', position: [Math.cos(0) * 40, 30, Math.sin(0) * 40] },
    { name: 'Sphere', position: [Math.cos(Math.PI/3) * 40, 30, Math.sin(Math.PI/3) * 40] },
    { name: 'Cone', position: [Math.cos(2*Math.PI/3) * 40, 30, Math.sin(2*Math.PI/3) * 40] },
    { name: 'Cylinder', position: [Math.cos(Math.PI) * 40, 30, Math.sin(Math.PI) * 40] },
    { name: 'Torus', position: [Math.cos(4*Math.PI/3) * 40, 30, Math.sin(4*Math.PI/3) * 40] },
    { name: 'Tetrahedron', position: [Math.cos(5*Math.PI/3) * 40, 30, Math.sin(5*Math.PI/3) * 40] }
];

const STRING_HEIGHT = 100; // 실의 높이

const GeometryComponent = ({ type }) => {
    switch (type) {
        case 'Cube':
            return <boxGeometry args={[3, 3, 3]} />;
        case 'Sphere':
            return <sphereGeometry args={[1.5, 32, 32]} />;
        case 'Cone':
            return <coneGeometry args={[1.5, 3, 32]} />;
        case 'Cylinder':
            return <cylinderGeometry args={[1.5, 1.5, 3, 32]} />;
        case 'Torus':
            return <torusGeometry args={[1.5, 0.6, 16, 100]} />;
        case 'Tetrahedron':
            return <tetrahedronGeometry args={[2]} />;
        default:
            return null;
    }
};

export default function GeometrySelector({ onSelect }) {
    const meshRefs = useRef({});
    const lineRefs = useRef({});
    const isClicked = useRef({});

    useFrame((state) => {
        const time = state.clock.getElapsedTime();
        
        GEOMETRIES.forEach(({ name, position }, index) => {
            if (meshRefs.current[name] && !isClicked.current[name]) {
                const offset = index * (Math.PI / 3);
                const y = position[1] + Math.sin(time / 2 + offset) * 1.5;
                meshRefs.current[name].position.y = y;
                
                // 선의 위치도 함께 업데이트
                if (lineRefs.current[name]) {
                    const points = [
                        new THREE.Vector3(position[0], y, position[2]),
                        new THREE.Vector3(position[0], y + STRING_HEIGHT, position[2])
                    ];
                    lineRefs.current[name].geometry.setFromPoints(points);
                }
            }
        });
    });

    const handleClick = (geometry) => {
        if (!isClicked.current[geometry]) {
            Object.keys(meshRefs.current).forEach((key) => {
                const mesh = meshRefs.current[key];
                const line = lineRefs.current[key];
                
                if (key !== geometry) {
                    isClicked.current[key] = true;
                    
                    // 선택되지 않은 오브젝트들을 물에 가라앉히기
                    gsap.to(mesh.position, {
                        y: -100,
                        duration: 3,
                        ease: "power2.in",
                        onUpdate: () => {
                            if (line) {
                                const points = [
                                    new THREE.Vector3(mesh.position.x, mesh.position.y, mesh.position.z),
                                    new THREE.Vector3(mesh.position.x, mesh.position.y + STRING_HEIGHT, mesh.position.z)
                                ];
                                line.geometry.setFromPoints(points);
                            }
                        }
                    });
                } else {
                    // 선택된 오브젝트를 중앙으로 이동
                    gsap.to(mesh.position, {
                        x: 0,
                        y: 0,
                        z: 50,
                        duration: 2,
                        ease: "power2.inOut",
                        onUpdate: () => {
                            if (line) {
                                const points = [
                                    new THREE.Vector3(mesh.position.x, mesh.position.y, mesh.position.z),
                                    new THREE.Vector3(mesh.position.x, mesh.position.y + STRING_HEIGHT, mesh.position.z)
                                ];
                                line.geometry.setFromPoints(points);
                            }
                        }
                    });
                }
            });
            
            setTimeout(() => {
                onSelect(geometry);
            }, 1000);
        }
    };

    return (
        <Physics gravity={[0, -30, 0]}>
            <RigidBody type="fixed" position={[0, -1.001, 0]}>
                <mesh rotation-x={-Math.PI / 2}>
                    <planeGeometry args={[1000, 1000]} />
                    <meshBasicMaterial visible={false} />
                </mesh>
            </RigidBody>

            <group>
                {GEOMETRIES.map(({ name, position }) => (
                    <group key={name}>
                        <Line
                            ref={(el) => lineRefs.current[name] = el}
                            points={[
                                [position[0], position[1], position[2]],
                                [position[0], position[1] + STRING_HEIGHT, position[2]]
                            ]}
                            color="#ffffff"
                            lineWidth={0.5}
                            opacity={0.5}
                            transparent
                        />
                        <RigidBody
                            type="dynamic"
                            colliders="hull"
                            restitution={0.3}
                            friction={0.7}
                        >
                            <mesh
                                ref={(el) => meshRefs.current[name] = el}
                                position={position}
                                onClick={() => handleClick(name)}
                                scale={5}
                                castShadow
                            >
                                <GeometryComponent type={name} />
                                <meshStandardMaterial color="#bbbbbb" />
                            </mesh>
                        </RigidBody>
                    </group>
                ))}
            </group>
        </Physics>
    );
}