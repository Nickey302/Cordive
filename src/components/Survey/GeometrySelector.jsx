'use client'

import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
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
    const isClicked = useRef({});
    const rigidBodyRefs = useRef({});

    useFrame((state) => {
        const time = state.clock.getElapsedTime();
        
        GEOMETRIES.forEach(({ name, position }, index) => {
            if (meshRefs.current[name] && !isClicked.current[name]) {
                const offset = index * (Math.PI / 3);
                const y = position[1] + Math.sin(time / 2 + offset) * 1.5;
                meshRefs.current[name].position.y = y;
            }
        });
    });

    const handleClick = (geometry) => {
        if (!isClicked.current[geometry]) {
            Object.keys(meshRefs.current).forEach((key) => {
                isClicked.current[key] = true;
                
                const rigidBody = rigidBodyRefs.current[key];
                if (rigidBody) {
                    gsap.to({}, {
                        duration: 2,
                        ease: "power2.in",
                        onUpdate: function() {
                            const progress = this.progress();
                            const startY = rigidBody.translation().y;
                            const targetY = 40;
                            const currentY = startY + (targetY - startY) * progress;
                            
                            rigidBody.setTranslation({ 
                                x: rigidBody.translation().x, 
                                y: currentY, 
                                z: rigidBody.translation().z 
                            });
                            rigidBody.setLinvel({ x: 0, y: 0, z: 0 });
                            rigidBody.setAngvel({ x: 0, y: 0, z: 0 });
                        }
                    });
                }
            });

            setTimeout(() => {
                onSelect(geometry);
            }, 2000);
        }
    };

    return (
        <group>
            {GEOMETRIES.map(({ name, position }) => (
                <group key={name}>
                    <RigidBody
                            ref={(el) => rigidBodyRefs.current[name] = el}
                            type="dynamic"
                            colliders="hull"
                            restitution={0.2}
                            friction={0.7}
                            linearDamping={0.5}
                            angularDamping={0.5}
                            mass={1}
                        >
                            <mesh
                                ref={(el) => meshRefs.current[name] = el}
                                position={position}
                                onClick={() => handleClick(name)}
                                scale={5}
                                castShadow
                            >
                                <GeometryComponent type={name} />
                                <meshStandardMaterial
                                    color="#bbbbbb"
                                    metalness={0.2}
                                    roughness={0.8}
                                />
                            </mesh>
                    </RigidBody>
                </group>
            ))}
        </group>
    );
}