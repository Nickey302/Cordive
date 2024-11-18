import { useRef, useMemo, forwardRef, useState } from 'react';
import * as THREE from 'three';
import { Text, Html } from '@react-three/drei';
import styles from './CustomObject.module.css';

// geometry와 material을 상수로 분리
const GEOMETRIES = {
    Cube: new THREE.BoxGeometry(1, 1, 1),
    Sphere: new THREE.SphereGeometry(0.5, 32, 32),
    Cone: new THREE.ConeGeometry(0.5, 1, 32),
    Cylinder: new THREE.CylinderGeometry(0.5, 0.5, 1, 32),
    Torus: new THREE.TorusGeometry(0.5, 0.2, 16, 100),
    Tetrahedron: new THREE.TetrahedronGeometry(0.7)
};

const CustomObject = forwardRef(({ geometry, position, color, material, label, userData, username }, ref) => {
    const meshRef = useRef();
    const [showDetails, setShowDetails] = useState(false);

    // 응답 텍스트 처리 함수
    const formatResponses = useMemo(() => {
        if (!userData?.prompt) return '';
        
        try {
            // JSON 문자열을 파싱하고 따옴표 제거
            const responses = JSON.parse(userData.prompt.replace(/\\n/g, ' '));
            
            // 배열이면 문장들을 연결
            if (Array.isArray(responses)) {
                return responses
                    .filter(text => text) // 빈 문자열 제거
                    .map(text => text.replace(/^["']|["']$/g, '').trim()) // 앞뒤 따옴표 제거
                    .join('\n\n'); // 단락으로 구분
            }
            
            // 문자열이면 따옴표만 제거
            return responses.replace(/^["']|["']$/g, '').trim();
        } catch {
            // JSON 파싱 실패시 원본 텍스트에서 따옴표만 제거
            return userData.prompt.replace(/^["']|["']$/g, '').replace(/\\n/g, ' ').trim();
        }
    }, [userData?.prompt]);

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
                    position={[position[0] + 3, position[1] + 3.5, position[2]]}
                    fontSize={1}
                    color="white"
                    anchorX="center"
                    anchorY="middle"
                    font='/assets/fonts/NeoCode.woff'
                >
                    {label}
                </Text>
            )}

            {showDetails && (
                <Html
                    position={[position[0] + 3, position[1], position[2]]}
                    center
                    className={`${styles.detailsContainer} ${showDetails ? styles.visible : ''}`}
                >
                    <div className={styles.details}>
                        <p className={styles.username}>작성자: {username || '익명'}</p>
                        <p className={styles.prompt}>{formatResponses}</p>
                    </div>
                </Html>
            )}
        </group>
    );
});

// displayName 설정 (디버깅을 위해)
CustomObject.displayName = 'CustomObject';

export default CustomObject; 