'use client';

import { useRef, useState } from 'react';
import { Float, Text, OrbitControls, Environment, Sky, MeshReflectorMaterial } from "@react-three/drei";
import { EffectComposer, Bloom, Noise } from '@react-three/postprocessing';
import Water from './Water/Water.jsx';
import { Perf } from 'r3f-perf';
import * as THREE from 'three';
import { Physics, RigidBody } from '@react-three/rapier';
import SurveyOverlay from '../Survey/SurveyOverlay.jsx';
import { Html } from '@react-three/drei';
import CustomObject from '../CustomObject';
import { useRouter } from 'next/navigation';
import { Suspense } from 'react';
import { Model as ObstractObject } from './ObstractObject';
import SelectionScene from '../Survey/SelectionScene';
import MaterialPreview from '../Survey/MaterialPreview';
import { MATERIALS } from '../Survey/constants';
import LoadingOverlay from '../Survey/LoadingOverlay';
//
//
//
export default function Experience() {
    const router = useRouter();
    const surveyOverlayRef = useRef(null);
    const [showSurvey, setShowSurvey] = useState(true);
    const [customObject, setCustomObject] = useState(null);
    const [surveyStep, setSurveyStep] = useState(1);
    const [selectedGeometry, setSelectedGeometry] = useState(null);
    const [selectedMaterial, setSelectedMaterial] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    const handleSurveyComplete = (results) => {
        setCustomObject(results);
        setIsLoading(true);
    };

    const handleSurveyClose = () => {
        setTimeout(() => {
            setShowSurvey(false);
            setTimeout(() => {
                router.push('/Utopia');
            }, 1000);
        }, 2000);
    };

    const handleGeometrySelect = (geometry) => {
        setSelectedGeometry(geometry);
        setTimeout(() => setSurveyStep(2), 1000);
    };

    const handleMaterialSelect = (material) => {
        setSelectedMaterial(material);
    };

    const handleMaterialPreviewSelect = (material) => {
        setSelectedMaterial(material);
        setTimeout(() => {
            setSurveyStep(3);
        }, 1000);
    };

    return (
        <>
            {/* <Perf /> */}
            <color attach="background" args={['#A6AEBF']} />
            <fog attach="fog" args={['#A6AEBF', 100, 400]} />

            <hemisphereLight intensity={0.15} groundColor="black" />
            <spotLight decay={0} position={[10, 20, 50]} angle={0.12} penumbra={1} intensity={1} castShadow shadow-mapSize={1024} />

            <ambientLight intensity={3} />
            <directionalLight position={[10, 10, 10]} intensity={1} color="#ffffff" />

            <OrbitControls
                makeDefault
                enableDamping
                dampingFactor={0.01}
                minPolarAngle={Math.PI / 3}
                maxPolarAngle={Math.PI / 2 - 0.1}
                maxDistance={230}
                minDistance={30}
            />

            <Water />

            <Float floatIntensity={0.5} speed={0.5}>
                <Text
                    receiveShadow
                    castShadow
                    position={[0, 50, 10]}
                    fontSize={8}
                    color="#ffffff"
                    anchorX="center"
                    anchorY="middle"
                    // font="/assets/fonts/Montserrat-VariableFont_wght.ttf"
                    font="/assets/fonts/NeoCode.woff"
                >
                    HETEROTOPIA
                </Text>
            </Float>

            <ObstractObject position={[0 , 50, 0]} scale={15} />

            {showSurvey && (
                <>
                    {surveyStep <= 2 && (
                        <Text
                            position={[0, 40, 10]}
                            fontSize={3}
                            color="white"
                            anchorX="center"
                            anchorY="middle"
                            // font="/assets/fonts/NeoCode.woff"
                            font="/assets/fonts/Montserrat-VariableFont_wght.ttf"
                        >
                            {surveyStep === 1 
                                ? "당신의 이야기를 담을 형태를 선택해주세요"
                                : "당신의 이야기에 어울리는 재질을 선택해주세요"
                            }
                        </Text>
                    )}
                </>
            )}

            <Suspense fallback={null}>
                <SelectionScene 
                    step={surveyStep}
                    onGeometrySelect={handleGeometrySelect}
                    onMaterialSelect={handleMaterialSelect}
                />
            </Suspense>

            {showSurvey && surveyStep === 3 && (
                <Html
                    position={[0, 50, 0]}
                    center
                    style={{
                        backgroundColor: 'rgba(0, 0, 0, 0.0)',
                        padding: '20px',
                        color: 'white',
                        fontSize: '0.7rem',
                        fontFamily: 'NeoCode',
                        textAlign: 'center',
                    }}
                >
                    <SurveyOverlay 
                        ref={surveyOverlayRef}
                        onComplete={handleSurveyComplete} 
                        onSurveyComplete={handleSurveyClose}
                        initialData={{
                            geometry: selectedGeometry,
                            material: selectedMaterial
                        }}
                        initialStep="questions"
                    />
                </Html>
            )}

            {showSurvey && surveyStep === 2 && (
                <Html position={[0, 100, 0]} center>
                    <MaterialPreview
                        materials={MATERIALS}
                        onSelect={handleMaterialPreviewSelect}
                        selectedMaterial={selectedMaterial}
                    />
                </Html>
            )}

            <EffectComposer disableNormalPass multisampling={0}>
                <Bloom 
                    mipmapBlur
                    intensity={0.8}
                    luminanceThreshold={0.3}
                    luminanceSmoothing={0.1}
                />
                <Noise opacity={0.07} />
            </EffectComposer>

            {customObject && (
                <CustomObject 
                    geometry={customObject.geometry}
                    position={customObject.position}
                    color={customObject.color}
                    onClick={() => alert(customObject.label)}
                />
            )}

            {isLoading && (
                <Html fullscreen>
                    <LoadingOverlay />
                </Html>
            )}
        </>
    )
}