// components/GPGPUParticles.jsx
'use client';

import * as THREE from 'three';
import { useMemo, useRef } from 'react';
import { useFrame, useThree, extend } from '@react-three/fiber';
import { shaderMaterial } from '@react-three/drei';

// ShaderMaterial 생성
const SimulationMaterial = shaderMaterial(
  {
    uTime: 0,
    positions: null,
    origins: null,
  },
  // Vertex Shader
  `
  void main() {
    gl_Position = vec4(position, 1.0);
  }
  `,
  // Fragment Shader (simulationMaterial.js 내용)
  `
  uniform float uTime;
  uniform sampler2D positions;
  uniform sampler2D origins;

  void main() {
    vec2 uv = gl_FragCoord.xy / resolution.xy;
    vec4 pos = texture2D(positions, uv);
    vec4 orig = texture2D(origins, uv);

    // 시뮬레이션 로직
    pos.xy += vec2(sin(uTime), cos(uTime)) * 0.01;

    gl_FragColor = pos;
  }
  `
);

const ParticleMaterial = shaderMaterial(
  {
    positions: null,
    origins: null,
    uTime: 0,
  },
  // Vertex Shader (dofPointsMaterial.js 내용)
  `
  uniform sampler2D positions;
  uniform sampler2D origins;
  uniform float uTime;

  void main() {
    vec4 pos = texture2D(positions, uv);

    gl_PointSize = 2.0;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos.xyz, 1.0);
  }
  `,
  // Fragment Shader
  `
  void main() {
    gl_FragColor = vec4(1.0);
  }
  `
);

extend({ SimulationMaterial, ParticleMaterial });

export default function GPGPUParticles() {
  const SIZE = 256;
  const simMaterialRef = useRef();
  const particleMaterialRef = useRef();
  const { gl } = useThree();

  // 초기 위치 데이터 생성
  const positionsTexture = useMemo(() => {
    const data = new Float32Array(SIZE * SIZE * 4);
    for (let i = 0; i < SIZE * SIZE; i++) {
      data[i * 4 + 0] = (Math.random() - 0.5) * 10;
      data[i * 4 + 1] = (Math.random() - 0.5) * 10;
      data[i * 4 + 2] = (Math.random() - 0.5) * 10;
      data[i * 4 + 3] = 1.0;
    }
    const texture = new THREE.DataTexture(
      data,
      SIZE,
      SIZE,
      THREE.RGBAFormat,
      THREE.FloatType
    );
    texture.needsUpdate = true;
    return texture;
  }, [SIZE]);

  // Render Targets를 useRef로 관리
  const rt1 = useRef();
  const rt2 = useRef();

  useMemo(() => {
    const options = {
      minFilter: THREE.NearestFilter,
      magFilter: THREE.NearestFilter,
      format: THREE.RGBAFormat,
      type: THREE.FloatType,
      wrapS: THREE.ClampToEdgeWrapping,
      wrapT: THREE.ClampToEdgeWrapping,
      depthBuffer: false,
      stencilBuffer: false,
    };
    rt1.current = new THREE.WebGLRenderTarget(SIZE, SIZE, options);
    rt2.current = new THREE.WebGLRenderTarget(SIZE, SIZE, options);
  }, [SIZE]);

  // 시뮬레이션을 위한 Scene과 Camera 설정
  const simScene = useMemo(() => new THREE.Scene(), []);
  const simCamera = useMemo(
    () => new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1),
    []
  );

  // Simulation Material 설정
  useMemo(() => {
    simMaterialRef.current = new SimulationMaterial({
      uTime: 0,
      positions: positionsTexture,
      origins: positionsTexture,
    });
    const simMesh = new THREE.Mesh(
      new THREE.PlaneGeometry(2, 2),
      simMaterialRef.current
    );
    simScene.add(simMesh);
  }, [positionsTexture]);

  // 파티클 Geometry 생성
  const particleGeometry = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    const positions = new Float32Array(SIZE * SIZE * 3);
    const uvs = new Float32Array(SIZE * SIZE * 2);

    let i = 0;
    for (let x = 0; x < SIZE; x++) {
      for (let y = 0; y < SIZE; y++) {
        positions[i * 3 + 0] = 0;
        positions[i * 3 + 1] = 0;
        positions[i * 3 + 2] = 0;

        uvs[i * 2 + 0] = x / (SIZE - 1);
        uvs[i * 2 + 1] = y / (SIZE - 1);
        i++;
      }
    }

    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geo.setAttribute('uv', new THREE.BufferAttribute(uvs, 2));
    return geo;
  }, [SIZE]);

  // Particle Material 설정
  particleMaterialRef.current = new ParticleMaterial({
    positions: null,
    origins: positionsTexture,
    uTime: 0,
  });

  useFrame(({ gl, clock }) => {
    // 시뮬레이션 업데이트
    simMaterialRef.current.uniforms.uTime.value = clock.elapsedTime;
    simMaterialRef.current.uniforms.positions.value = rt1.current.texture;

    gl.setRenderTarget(rt2.current);
    gl.render(simScene, simCamera);
    gl.setRenderTarget(null);

    // Render Target 스왑
    const temp = rt1.current;
    rt1.current = rt2.current;
    rt2.current = temp;

    // 파티클 Material 업데이트
    particleMaterialRef.current.uniforms.positions.value = rt1.current.texture;
    particleMaterialRef.current.uniforms.uTime.value = clock.elapsedTime;
  });

  return (
    <points geometry={particleGeometry}>
      <primitive object={particleMaterialRef.current} attach="material" />
    </points>
  );
}
