import { useRef, useMemo } from 'react';
import * as THREE from 'three';
import { useLoader } from '@react-three/fiber';
import { TextureLoader } from 'three/src/loaders/TextureLoader';
import { Text } from '@react-three/drei';
import { MeshStandardMaterial, ShaderMaterial } from 'three';

// Matcap 텍스처 URL 배열
const MATCAP_URLS = [
    '5C5C04_BDBD0D_939304_A4A404',
    '045C5C_0DBDBD_049393_04A4A4',
    '60534A_211813_9B948E_8E837D',
    '68493E_B2AAA9_978C8C_130907',
    'B66D59_F0C9B2_E5B49C_DAA084',
    '050505_747474_4C4C4C_333333'
].map(id => `/assets/matcaps/${id}-256px.png`);  // matcaps 폴더에 저장된 텍스처 파일들

export default function CustomObject({ geometry, position, color, material, label }) {
    const meshRef = useRef();
    
    // 랜덤 matcap 텍스처 선택
    const matcapTexture = useLoader(
        TextureLoader, 
        MATCAP_URLS[Math.floor(Math.random() * MATCAP_URLS.length)]
    );

    // geometry 생성
    const customGeometry = useMemo(() => {
        switch(geometry) {
            case "Cube":
                return new THREE.BoxGeometry(1, 1, 1);
            case "Sphere":
                return new THREE.SphereGeometry(0.5, 32, 32);
            case "Cone":
                return new THREE.ConeGeometry(0.5, 1, 32);
            case "Cylinder":
                return new THREE.CylinderGeometry(0.5, 0.5, 1, 32);
            case "Torus":
                return new THREE.TorusGeometry(0.5, 0.2, 16, 100);
            case "Tetrahedron":
                return new THREE.TetrahedronGeometry(0.7);
            default:
                return new THREE.BoxGeometry(1, 1, 1);
        }
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
            // ... 다른 material 타입들에 대한 처리 추가
            default:
                return {
                    color: color,
                    metalness: 0.5,
                    roughness: 0.5
                };
        }
    }, [material, color]);

    return (
        <group>
            <mesh
                ref={meshRef}
                geometry={customGeometry}
                position={position}
                scale={10}
            >
                <meshStandardMaterial {...materialProps} />
            </mesh>
            
            {label && (
                <Text
                    position={[position[0], position[1] + 12, position[2]]}
                    fontSize={5}
                    color="white"
                    anchorX="center"
                    anchorY="middle"
                >
                    {`${label} - by ${userName}`}
                </Text>
            )}
        </group>
    );
} 