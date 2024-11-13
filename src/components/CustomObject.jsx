import { useRef, useMemo } from 'react';
import * as THREE from 'three';
import { useLoader } from '@react-three/fiber';
import { TextureLoader } from 'three/src/loaders/TextureLoader';

// Matcap 텍스처 URL 배열
const MATCAP_URLS = [
    '5C5C04_BDBD0D_939304_A4A404',
    '045C5C_0DBDBD_049393_04A4A4',
    '60534A_211813_9B948E_8E837D',
    '68493E_B2AAA9_978C8C_130907',
    'B66D59_F0C9B2_E5B49C_DAA084',
    '050505_747474_4C4C4C_333333'
].map(id => `/assets/matcaps/${id}-256px.png`);  // matcaps 폴더에 저장된 텍스처 파일들

export default function CustomObject({ geometry, position, color }) {
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

    return (
        <mesh
            ref={meshRef}
            geometry={customGeometry}
            position={position}
            scale={10}
        >
            <meshMatcapMaterial
                matcap={matcapTexture}
                color={color}
            />
        </mesh>
    );
} 