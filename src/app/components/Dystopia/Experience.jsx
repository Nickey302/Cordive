import { Float, Text, OrbitControls } from "@react-three/drei"
import Water from './Water.jsx'

export default function Experience() {
    return (
        <>
            <color args={ [ '#626A88' ] } attach="background"/>

            <OrbitControls makeDefault />

            <ambientLight />
            <directionalLight />

            <Float>
                <Text
                    position={[0, 20, 0]}    // Center the text
                    font='./assets/fonts/Montserrat-VariableFont_wght.ttf'
                    fontSize={20}             // Adjust font size
                    color="white"            // Color of the text
                    anchorX="center"         // Align text horizontally to the center
                    anchorY="middle"         // Align text vertically to the middle
                    maxWidth={10}            // Limit the text width if needed
                    bevel={ 10 }
                >
                    DYSTOPIA
                </Text>
            </Float>
            <Water />
        </>
    )
}