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
const Effects = dynamic(() => import("./Effects/Effects"), { ssr: false });
//
//
//
export default function Experience({ activeObject }) {
    const { camera } = useThree()
    const orbitControlsRef = useRef()
    const modelRef = useRef()
    const customObjectRefs = useRef({})

    const [customObjects, setCustomObjects] = useState([]);

    const setCustomObjectRef = useCallback((id, element) => {
        if (element) {
            customObjectRefs.current[id] = element
        } else {
            delete customObjectRefs.current[id]
        }
    }, [])

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

    useFrame((state) => {
        if (orbitControlsRef.current) {
            orbitControlsRef.current.update()
        }
    })

    return (
        <>  
            {/* <Perf position="top-left" /> */}

            <OrbitControls 
                ref={orbitControlsRef}
                makeDefault
                enableDamping
                dampingFactor={0.01}
                zoomSpeed={0.5}
                minDistance={10}
                maxDistance={500}
            />

            <ambientLight intensity={ 1.5 } />
            <directionalLight position={[10, 25, 3]} color="#dcb8d3" intensity={ 3 } />

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
                    userData={{
                        username: obj.username,
                        prompt: obj.prompt
                    }}
                />
            ))}

            <Model ref={modelRef} activeObject={activeObject?.type === 'default' ? activeObject.name : null} />

            <Effects />
        </>
    )
}