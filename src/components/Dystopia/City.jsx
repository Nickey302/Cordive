import { Float } from '@react-three/drei';
import { Model as Building1 } from './Buildings/Building1';
import { Model as Building2 } from './Buildings/Building2';
import { Model as Building3 } from './Buildings/Building3';
import { Model as Building4 } from './Buildings/Building4';
import { Model as Building5 } from './Buildings/Building5';
export default function City() {

    return (
        <>
            {/* <ambientLight intensity={3} /> */}
            <Float
                floatIntensity={0.02}
                floatingRange={[0.02, 0.05]}
                speed={2}
            >
                <Building2 position={[5, -1.5, -10]} scale={[0.1, 0.1, 0.1]} rotation={[0, Math.PI /3, 0]} />
            </Float>
            <Float
                floatIntensity={0.1}
                speed={0.1}
            >
                <Building1 castShadow position={[-5, -80, -45]} scale={[1.0, 1.0, 1.0]} rotation={[0, 0, 0]} />
                <Building3 castShadow position={[15, -50, -62]} scale={[0.0035, 0.0035, 0.0035]} />
                <Building3 castShadow position={[-10, -50, -78]} scale={[0.0035, 0.0035, 0.0035]} />
                <Building4 castShadow position={[30, -38, -78]} scale={[0.0035, 0.0035, 0.0035]} rotation={[0, - Math.PI / 3, 0]} />
                <Building4 castShadow position={[-15, -45, -90]} scale={[0.004, 0.004, 0.004]} rotation={[0, Math.PI / 4, 0]} />
                <Building4 castShadow position={[45, -30, -65]} scale={[0.003, 0.003, 0.003]} rotation={[0, -Math.PI / 6, 0]} />
                <Building4 castShadow position={[20, -40, -85]} scale={[0.0045, 0.0045, 0.0045]} rotation={[0, Math.PI / 2, 0]} />
                <Building5 castShadow position={[-27, -10, -40]} scale={[1, 1, 1]} rotation={[0, Math.PI / 3, 0]} />
            </Float>
        </>
    );
}