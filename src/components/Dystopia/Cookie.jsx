import { useVideoTexture } from '@react-three/drei'

export default function Cookie(props) {
    const texture = useVideoTexture('./assets/vids/caustics.mp4');
    return <spotLight decay={0} map={texture} castShadow {...props} scale={10} />;
}
