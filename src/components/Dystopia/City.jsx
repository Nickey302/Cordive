export default function City() {
    const buildings = [
        { position: [-2, 1.5, -6], scale: [1, 50, 1] },
        { position: [-3, 2.5, -4], scale: [2, 50, 2] },
        { position: [0, 3.5, -9], scale: [1.5, 50, 1.5] },
        { position: [3, 1.5, -8], scale: [1, 50, 1] },
        { position: [5, 2.5, -3], scale: [1.5, 50, 1.5] },
        { position: [-4, 4.5, -6], scale: [2,  50, 2] },
        { position: [4, 5.5, -8], scale: [2,  50, 2] },
        { position: [-5, 2.5, -5], scale: [1.5, 50, 1.5] },
    ];

    return (
        <>
            {buildings.map((building, index) => (
                <mesh key={index} position={building.position} scale={building.scale} castShadow receiveShadow>
                    <boxGeometry />
                    <meshStandardMaterial color="#131313" />
                </mesh>
            ))}
        </>
    );
}