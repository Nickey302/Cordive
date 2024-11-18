'use client'

import { Environment, OrbitControls, Sky } from '@react-three/drei'
import { useFrame, useThree } from '@react-three/fiber'
import { useRef, useEffect, useState, useCallback } from 'react'
import Model from './Model'
import dynamic from 'next/dynamic'
import { Perf } from 'r3f-perf'
import * as THREE from 'three'
import gsap from 'gsap'
import { supabase } from '../../utils/supabase'
import CustomObject from '../CustomObject'
import { soundManager } from '@/app/SoundManager'
import { SCENE_SOUNDS } from '@/app/sounds'
import * as Tone from 'tone'

const Effects = dynamic(() => import("./Effects/Effects"), { ssr: false });

export default function Experience({ activeObject }) {
    const { camera } = useThree()
    const orbitControlsRef = useRef()
    const modelRef = useRef()
    const customObjectRefs = useRef({})
    const [customObjects, setCustomObjects] = useState([])
    const [audioInitialized, setAudioInitialized] = useState(false)
    const [soundsLoaded, setSoundsLoaded] = useState(false)

    // 오브젝트 위치 정보
    const objectPositions = {
        LANDMARK: new THREE.Vector3(10, 0, 0),
        LOVE: new THREE.Vector3(-10, 0, 10),
        AVERSION: new THREE.Vector3(15, 0, -5),
        ADJUST: new THREE.Vector3(-5, 0, -15),
        RESIST: new THREE.Vector3(20, 0, 5),
        ISOLATION: new THREE.Vector3(-15, 0, -10),
        LIBERATION: new THREE.Vector3(0, 0, 20)
    }

    const setCustomObjectRef = useCallback((id, element) => {
        if (element) {
            customObjectRefs.current[id] = element
        } else {
            delete customObjectRefs.current[id]
        }
    }, [])

    // 사운드 초기화
    useEffect(() => {
        let mounted = true

        const initAudio = async () => {
            try {
                await Tone.start()
                await soundManager.init()
                
                // 모든 사운드 먼저 로드
                await Promise.all([
                    soundManager.loadSound('BGM', SCENE_SOUNDS.UTOPIA.BGM.url),
                    soundManager.loadSound('LANDMARK', SCENE_SOUNDS.UTOPIA.LANDMARK.url),
                    soundManager.loadSound('LOVE', SCENE_SOUNDS.UTOPIA.LOVE.url),
                    soundManager.loadSound('AVERSION', SCENE_SOUNDS.UTOPIA.AVERSION.url),
                    soundManager.loadSound('ADJUST', SCENE_SOUNDS.UTOPIA.ADJUST.url),
                    soundManager.loadSound('RESIST', SCENE_SOUNDS.UTOPIA.RESIST.url),
                    soundManager.loadSound('ISOLATION', SCENE_SOUNDS.UTOPIA.ISOLATION.url),
                    soundManager.loadSound('LIBERATION', SCENE_SOUNDS.UTOPIA.LIBERATION.url)
                ])

                if (mounted) {
                    setSoundsLoaded(true)
                    
                    // BGM 재생
                    await soundManager.playSound('BGM', { 
                        volume: -20,
                        loop: true 
                    })

                    // 각 오브젝트 사운드 재생
                    const objectSounds = ['LANDMARK', 'LOVE', 'AVERSION', 'ADJUST', 'RESIST', 'ISOLATION', 'LIBERATION']
                    for (const name of objectSounds) {
                        await soundManager.playSound(name, {
                            volume: -80,
                            loop: true
                        })
                    }

                    setAudioInitialized(true)
                }
            } catch (error) {
                console.error('Audio initialization error:', error)
            }
        }

        // 사용자 인터랙션 대기
        const handleUserInteraction = async () => {
            if (!audioInitialized) {
                await initAudio()
            }
        }

        window.addEventListener('click', handleUserInteraction, { once: true })
        window.addEventListener('touchstart', handleUserInteraction, { once: true })

        return () => {
            mounted = false
            soundManager.stopAllSounds()
            window.removeEventListener('click', handleUserInteraction)
            window.removeEventListener('touchstart', handleUserInteraction)
        }
    }, [])

    // Custom Objects 로드
    useEffect(() => {
        const loadCustomObjects = async () => {
            const { data, error } = await supabase
                .from('custom_objects')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) {
                console.error('Error loading objects:', error);
                return;
            }

            const updatePromises = data.map(async (obj) => {
                const { error: updateError } = await supabase
                    .from('custom_objects')
                    .update({ completed: true })
                    .eq('id', obj.id);

                if (updateError) {
                    console.error('Error updating object:', updateError);
                }
            });

            await Promise.all(updatePromises);
            setCustomObjects(data);
        };

        loadCustomObjects();
    }, []);

    // 카메라 이동 효과
    useEffect(() => {
        if (activeObject && orbitControlsRef.current) {
            let targetPosition;
            let cameraOffset;

            if (activeObject.type === 'default' && modelRef.current) {
                targetPosition = modelRef.current.getObjectPosition(activeObject.name);
            } else if (activeObject.type === 'custom') {
                const customObj = customObjects.find(obj => obj.id === activeObject.id);
                if (customObj) {
                    targetPosition = {
                        x: customObj.position[0],
                        y: customObj.position[1],
                        z: customObj.position[2]
                    };
                    cameraOffset = {
                        distance: 10,
                        heightOffset: 5,
                        angle: Math.PI / 4
                    };
                }
            }

            if (targetPosition) {
                const newTarget = new THREE.Vector3(
                    targetPosition.x,
                    targetPosition.y,
                    targetPosition.z
                );
                
                gsap.to(orbitControlsRef.current.target, {
                    duration: 2,
                    x: newTarget.x,
                    y: newTarget.y,
                    z: newTarget.z,
                    ease: "power2.inOut"
                });

                if (cameraOffset) {
                    const cameraX = targetPosition.x + cameraOffset.distance * Math.cos(cameraOffset.angle);
                    const cameraY = targetPosition.y + cameraOffset.heightOffset;
                    const cameraZ = targetPosition.z + cameraOffset.distance * Math.sin(cameraOffset.angle);

                    gsap.to(camera.position, {
                        duration: 2,
                        x: cameraX,
                        y: cameraY,
                        z: cameraZ,
                        ease: "power2.inOut"
                    });
                }
            }
        }
    }, [activeObject, customObjects, camera]);

    // 거리 기반 볼륨 조절
    const updateVolumes = useCallback(() => {
        if (!audioInitialized || !soundsLoaded || !camera) return;

        // 카메라 거리에 따른 전체 볼륨 스케일 계산
        const cameraDistance = camera.position.length();
        const minCameraDistance = 10;  // OrbitControls의 minDistance와 동일
        const maxCameraDistance = 500; // OrbitControls의 maxDistance와 동일
        
        // 카메라 거리에 따른 볼륨 스케일 계산 (가까울록 1, 멀수록 0.3)
        const volumeScale = THREE.MathUtils.lerp(
            1,
            0.3,
            Math.min(Math.max((cameraDistance - minCameraDistance) / (maxCameraDistance - minCameraDistance), 0), 1)
        );

        // BGM은 항상 일정한 볼륨으로 재생 (줌 레벨에 영향 받지 않음)
        const bgmSound = soundManager.players.get('BGM');
        if (bgmSound?.player) {
            bgmSound.player.volume.rampTo(-20, 0.5);
        }

        Object.entries(objectPositions).forEach(([name, position]) => {
            const sound = soundManager.players.get(name);
            if (!sound?.player) return;

            // 활성화된 오브젝트인 경우
            if (activeObject?.type === 'default' && activeObject.name.toUpperCase() === name) {
                // 선택된 오브젝트는 큰 볼륨으로 재생 (줌 레벨에 따라 조절)
                const activeVolume = -6 * (1 / volumeScale);
                sound.player.volume.rampTo(activeVolume, 0.5);
            } else {
                // 거리에 따른 볼륨 계산
                const distance = camera.position.distanceTo(position);
                
                // 거리에 따른 볼륨 감쇄 계산
                const minDistance = 10;
                const maxDistance = 100;
                const minVolume = -30;
                const maxVolume = -60;
                
                let volume;
                if (distance <= minDistance) {
                    volume = minVolume;
                } else if (distance >= maxDistance) {
                    volume = maxVolume;
                } else {
                    // 거리에 따른 선형 보간
                    const t = (distance - minDistance) / (maxDistance - minDistance);
                    volume = minVolume + t * (maxVolume - minVolume);
                }

                // 줌 레벨에 따른 볼륨 조절
                volume = volume * (1 / volumeScale);

                // 부드러운 볼륨 전환을 위해 rampTo 사용
                sound.player.volume.rampTo(volume, 0.5);
            }
        });
    }, [activeObject, audioInitialized, soundsLoaded, camera]);

    useFrame((state) => {
        if (orbitControlsRef.current) {
            orbitControlsRef.current.update()
        }
        updateVolumes()
    })

    useEffect(() => {
        const initAudio = async () => {
            if (soundManager) {
                await soundManager.init();
                
                // 페이지 진입 시 자동 재생 시도
                const startAudio = async () => {
                    try {
                        await soundManager.playSound('yourSoundName', { loop: true });
                    } catch (error) {
                        console.error('사운드 재생 에러:', error);
                    }
                };
                
                startAudio();

                // 클릭 이벤트로도 시도
                const handleClick = () => {
                    startAudio();
                };

                document.addEventListener('click', handleClick);
                return () => document.removeEventListener('click', handleClick);
            }
        };

        initAudio();
    }, []);

    return (
        <>  
            <OrbitControls 
                ref={orbitControlsRef}
                makeDefault
                enableDamping
                dampingFactor={0.01}
                zoomSpeed={0.5}
                minDistance={10}
                maxDistance={500}
            />

            <ambientLight intensity={1.5} />
            <directionalLight position={[10, 25, 3]} color="#dcb8d3" intensity={3} />

            <Environment
                files={'/assets/HDRI/Utopia.hdr'}
                background
                environmentIntensity={0.3}
                backgroundBlurriness={0.07}
            />

            {customObjects.map((obj) => (
                <CustomObject
                    key={obj.id}
                    ref={(el) => setCustomObjectRef(obj.id, el)}
                    geometry={obj.geometry}
                    position={obj.position}
                    color={obj.color}
                    material={obj.material}
                    label={obj.label}
                    username={obj.username}
                    userData={{
                        prompt: obj.responses
                    }}
                />
            ))}

            <Model ref={modelRef} activeObject={activeObject?.type === 'default' ? activeObject.name : null} />

            <Effects />
        </>
    )
}