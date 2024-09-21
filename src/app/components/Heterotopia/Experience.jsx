import { Float, Text, useGLTF, OrbitControls } from "@react-three/drei";
import { useEffect } from "react";

export default function Experience() {
    const clouds = useGLTF('./assets/Models/clouds.glb');

    useEffect(() => {
        // Traverse through all children in the scene and apply wireframe
        clouds.scene.traverse((child) => {
            if (child.isMesh) {
                // Enable wireframe mode on the material
                child.material.wireframe = true;
            }
        });
    }, [clouds]);

    return (
        <>
            <color args={ [ '#667B9D' ] } attach="background" />

            <OrbitControls makeDefault />

            <ambientLight intensity={ 1.0 }/>
            <directionalLight />

            <Float>
                <Text
                    position={[0, 2.5, 0]}
                    font='./assets/fonts/Montserrat-VariableFont_wght.ttf'
                    fontSize={1.5}
                    fontWeight="bold"
                    color="#5CA3A533"
                    anchorX="center"
                    anchorY="middle"
                    maxWidth={10}
                    bevel={ 10 }
                >
                    HETEROTOPIA
                </Text>
            </Float>
            <primitive object={clouds.scene} scale={10} />
        </>
    );
}
