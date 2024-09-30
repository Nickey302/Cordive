import { OrbitControls, CameraShake } from '@react-three/drei';
import { useControls } from 'leva';
import { Particles } from './Particles.jsx';
import { Float, Text } from '@react-three/drei';
import { Perf } from 'r3f-perf'
import Ocean from './Water.jsx';

export default function Experience() {
  const props = useControls({
    focus: { value: 5.1, min: 3, max: 7, step: 0.01 },
    speed: { value: 100, min: 0.1, max: 100, step: 0.1 },
    aperture: { value: 1.8, min: 1, max: 5.6, step: 0.1 },
    fov: { value: 20, min: 0, max: 200 },
    curl: { value: 0.25, min: 0.01, max: 0.5, step: 0.01 },
  });

  return (
    <>
      {/* <Perf position="top-left"/> */}

      <color args={['black']} attach="background" />
      <OrbitControls
        makeDefault
        // autoRotate
        // autoRotateSpeed={0.5}
        zoomSpeed={0.1}
      />
      <CameraShake
        yawFrequency={1}
        maxYaw={0.05}
        pitchFrequency={1}
        maxPitch={0.05}
        rollFrequency={0.5}
        maxRoll={0.5}
        intensity={0.2}
      />

      <ambientLight intensity={1.5} />
      <directionalLight />

        <Text
          position={[0, 0, 2]}
          font="./fonts/Montserrat-VariableFont_wght.ttf"
          fontSize={0.3}
          color="white"
          anchorX="center"
          anchorY="middle"
          maxWidth={10}
          bevel={10}
        >
          CORDIVE
        </Text>

      {/* <Ocean /> */}

      {/* 파티클 추가 */}
      <Particles {...props} />
    </>
  );
}
