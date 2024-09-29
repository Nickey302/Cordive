import { Float, Text, useGLTF, OrbitControls, Preload } from "@react-three/drei";
import { useEffect } from "react";

export default function Experience() {
    const Clouds = useGLTF('./Models/Clouds.glb');

    useEffect(() => {
        Clouds.scene.traverse((child) => {
            if (child.isMesh) {
                child.material.wireframe = true;
            }
        });
    }, [Clouds]);

    return (
        <>
            <color args={ [ '#667B9D' ] } attach="background" />

            <OrbitControls makeDefault />

            <ambientLight intensity={ 1.0 }/>
            <directionalLight />

            <Float>
                <Text
                    position={[0, 2.5, 0]}
                    font='./fonts/Montserrat-VariableFont_wght.ttf'
                    fontSize={1.5}
                    fontWeight="bold"
                    color="#5CA3A5"
                    anchorX="center"
                    anchorY="middle"
                    maxWidth={10}
                    bevel={ 10 }
                >
                    HETEROTOPIA
                </Text>
            </Float>
            <primitive object={Clouds.scene} scale={10} />
        </>
    );
}

useGLTF.preload('./Models/Clouds.glb');
