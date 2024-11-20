import { useRef, useMemo, forwardRef, useState, useCallback, useEffect } from 'react';
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

export default function CustomObject({ position, username, prompt, ...props }) {
    const meshRef = useRef();
    const [showDetails, setShowDetails] = useState(false);
    const [adjustedPosition, setAdjustedPosition] = useState(new THREE.Vector3(...position));

    // geometry 생성
    const customGeometry = useMemo(() => {
        return GEOMETRIES[props.geometry];
    }, [props.geometry]);

    // material에 따른 shader 또는 material 설정
    const materialProps = useMemo(() => {
        switch(props.material) {
            case "Holographic":
                return {
                    metalness: 0.3,
                    roughness: 0.1,
                    transmission: 0.8,
                    clearcoat: 1,
                    iridescence: 1,
                    iridescenceIOR: 2,
                    iridescenceThicknessRange: [100, 400],
                    color: props.color
                };
            case "Crystal":
                return {
                    metalness: 0.1,
                    roughness: 0.1,
                    transmission: 0.9,
                    thickness: 0.5,
                    clearcoat: 1,
                    ior: 2.4,
                    color: props.color
                };
            case "Neon":
                return {
                    metalness: 0,
                    roughness: 0.1,
                    emissive: props.color,
                    emissiveIntensity: 4,
                    clearcoat: 0.3,
                    transmission: 0.4,
                    ior: 1.2,
                    color: props.color
                };
            case "Mirror":
                return {
                    metalness: 1,
                    roughness: 0,
                    envMapIntensity: 3,
                    clearcoat: 1,
                    color: props.color
                };
            case "Glitch":
                return {
                    metalness: 0.9,
                    roughness: 0.6,
                    clearcoat: 1,
                    emissive: props.color,
                    emissiveIntensity: 2,
                    iridescence: 1,
                    iridescenceIOR: 2.5,
                    transmission: 0.6,
                    color: props.color
                };
            default:
                return {
                    color: props.color,
                    metalness: 0.5,
                    roughness: 0.5
                };
        }
    }, [props.material, props.color]);

    // 위치 조정 함수
    const adjustPosition = useCallback((pos) => {
        const currentPos = new THREE.Vector3(...pos);
        const objects = meshRef.current?.parent?.parent?.children || [];
        let needsAdjustment = false;

        // 완전히 동일한 위치에 있는 오브젝트 확인
        objects.forEach((obj) => {
            if (obj.type !== 'Group' || obj === meshRef.current?.parent) return;
            
            const objPosition = new THREE.Vector3();
            obj.getWorldPosition(objPosition);
            
            // 위치가 정확히 일치하는 경우에만 조정
            if (
                Math.abs(currentPos.x - objPosition.x) < 0.001 &&
                Math.abs(currentPos.y - objPosition.y) < 0.001 &&
                Math.abs(currentPos.z - objPosition.z) < 0.001
            ) {
                needsAdjustment = true;
                // 랜덤한 방향으로 약간 이동
                currentPos.x += (Math.random() - 0.5) * 15;
                currentPos.z += (Math.random() - 0.5) * 15;
                currentPos.y += Math.random() * 5; // 약간 위로도 이동
            }
        });

        return needsAdjustment ? currentPos : new THREE.Vector3(...pos);
    }, []);

    useEffect(() => {
        const newPosition = adjustPosition(position);
        setAdjustedPosition(newPosition);
    }, [position, adjustPosition]);

    console.log("CustomObject props:", { position, username, prompt });

    // 응답 텍스트 처리 함수
    const formattedPrompt = useMemo(() => {
        if (!prompt) return '';
        
        try {
            // JSON 문자열을 파싱하고 따옴표 제거
            const responses = JSON.parse(prompt.replace(/\\n/g, ' '));
            
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
            return prompt.replace(/^["']|["']$/g, '').replace(/\\n/g, ' ').trim();
        }
    }, [prompt]);

    return (
        <group ref={props.ref} position={adjustedPosition}>
            <mesh
                ref={meshRef}
                scale={5}
                onClick={(e) => {
                    e.stopPropagation();
                    setShowDetails(!showDetails);
                }}
            >
                {props.geometry === 'Cube' && <boxGeometry args={[1, 1, 1]} />}
                {props.geometry === 'Sphere' && <sphereGeometry args={[0.5, 32, 32]} />}
                {props.geometry === 'Cone' && <coneGeometry args={[0.5, 1, 32]} />}
                {props.geometry === 'Cylinder' && <cylinderGeometry args={[0.5, 0.5, 1, 32]} />}
                {props.geometry === 'Torus' && <torusGeometry args={[0.5, 0.2, 16, 100]} />}
                {props.geometry === 'Tetrahedron' && <tetrahedronGeometry args={[0.7]} />}
                <meshPhysicalMaterial {...materialProps} />
            </mesh>

            {props.label && (
                <Text
                    position={[3, 3.5, 0]}
                    fontSize={1}
                    color="white"
                    anchorX="center"
                    anchorY="middle"
                    font='/assets/fonts/NeoCode.woff'
                >
                    {props.label}
                </Text>
            )}

            {showDetails && (
                <Html
                    position={[3, 0, 0]}
                    center
                    className={`${styles.detailsContainer} ${showDetails ? styles.visible : ''}`}
                >
                    <div className={styles.details}>
                        <p className={styles.username}>작성자: {username || '익명'}</p>
                        <p className={styles.prompt}>{formattedPrompt}</p>
                    </div>
                </Html>
            )}
        </group>
    );
}

// displayName 설정 (디버깅을 위해)
CustomObject.displayName = 'CustomObject'; 