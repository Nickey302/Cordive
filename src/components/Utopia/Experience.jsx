'use client'

import { Environment, OrbitControls, Sky } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import { useRef, useEffect, useState } from 'react'
import Model from './Model'
import dynamic from 'next/dynamic'
import { Perf } from 'r3f-perf'
import * as THREE from 'three'
import gsap from 'gsap'
import { supabase } from '../../utils/supabase'
import CustomObject from '../CustomObject'
const Effects = dynamic(() => import("./Effects/Effects"), { ssr: false });

export default function Experience({ activeObject }) {
    const orbitControlsRef = useRef()
    const modelRef = useRef()
    const [customObjects, setCustomObjects] = useState([]);

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

            setCustomObjects(data);
        };

        loadCustomObjects();
    }, []);

    useEffect(() => {
        if (activeObject && orbitControlsRef.current && modelRef.current) {
            const targetPosition = modelRef.current.getObjectPosition(activeObject)
            if (targetPosition) {
                const newTarget = new THREE.Vector3(
                    targetPosition.x,
                    targetPosition.y,
                    targetPosition.z
                )
                
                gsap.to(orbitControlsRef.current.target, {
                    duration: 2,
                    x: newTarget.x,
                    y: newTarget.y,
                    z: newTarget.z,
                    ease: "power2.inOut"
                })
            }
        }
    }, [activeObject])

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
                minDistance={50}
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

            {customObjects.map((obj, index) => (
                <CustomObject
                    key={obj.id}
                    geometry={obj.geometry}
                    position={obj.position}
                    color={obj.color}
                    matcap={obj.matcap}
                    label={obj.label}
                />
            ))}

            <Model ref={modelRef} activeObject={activeObject} />

            <Effects />
        </>
    )
}