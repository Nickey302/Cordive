import { useRef, useMemo, forwardRef, useState } from 'react';
import * as THREE from 'three';
import { Text } from '@react-three/drei';

// geometry와 material을 상수로 분리
const GEOMETRIES = {
    Cube: new THREE.BoxGeometry(1, 1, 1),
    Sphere: new THREE.SphereGeometry(0.5, 32, 32),
    Cone: new THREE.ConeGeometry(0.5, 1, 32),
    Cylinder: new THREE.CylinderGeometry(0.5, 0.5, 1, 32),
    Torus: new THREE.TorusGeometry(0.5, 0.2, 16, 100),
    Tetrahedron: new THREE.TetrahedronGeometry(0.7)
};

const CustomObject = forwardRef(({ geometry, position, color, material, label, userData }, ref) => {
    const meshRef = useRef();
    const [showDetails, setShowDetails] = useState(false);

    // geometry 생성
    const customGeometry = useMemo(() => {
        return GEOMETRIES[geometry];
    }, [geometry]);

    // material에 따른 shader 또는 material 설정
    const materialProps = useMemo(() => {
        switch(material) {
            case "Holographic":
                return {
                    transparent: true,
                    opacity: 0.8,
                    metalness: 1,
                    roughness: 0.2,
                    color: color,
                    envMapIntensity: 2
                };
            case "Crystal":
                return {
                    transparent: true,
                    opacity: 0.7,
                    metalness: 0.9,
                    roughness: 0,
                    color: color,
                    envMapIntensity: 3
                };
            case "Neon":
                return {
                    emissive: color,
                    emissiveIntensity: 2,
                    metalness: 0.5,
                    roughness: 0.1,
                    color: color
                };
            default:
                return {
                    color: color,
                    metalness: 0.5,
                    roughness: 0.5
                };
        }
    }, [material, color]);

    return (
        <group ref={ref}>
            <mesh
                ref={meshRef}
                geometry={customGeometry}
                position={position}
                scale={5}
                onClick={(e) => {
                    e.stopPropagation();
                    setShowDetails(!showDetails);
                }}
            >
                <meshStandardMaterial {...materialProps} />
            </mesh>
            
            {label && (
                <Text
                    position={[position[0], position[1] + 4.5, position[2]]}
                    fontSize={1}
                    color="white"
                    anchorX="center"
                    anchorY="middle"
                    font='/assets/fonts/NeoCode.woff'
                >
                    {label}
                </Text>
            )}

            {/* 상세 정보 표시 */}
            {showDetails && (
                <group position={[position[0], position[1] + 15, position[2]]}>
                    <Text
                        position={[0, 2, 0]}
                        fontSize={0.8}
                        color="white"
                        anchorX="center"
                        anchorY="middle"
                        font='/assets/fonts/NeoCode.woff'
                        maxWidth={20}
                    >
                        {`작성자: ${userData?.username || '익명'}`}
                    </Text>
                    <Text
                        position={[0, 0, 0]}
                        fontSize={0.8}
                        color="white"
                        anchorX="center"
                        anchorY="middle"
                        font='/assets/fonts/NeoCode.woff'
                        maxWidth={20}
                    >
                        {userData?.prompt || ''}
                    </Text>
                </group>
            )}
        </group>
    );
});

// displayName 설정 (디버깅을 위해)
CustomObject.displayName = 'CustomObject';

export default CustomObject; 