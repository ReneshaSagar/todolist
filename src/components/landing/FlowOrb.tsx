"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { MeshDistortMaterial, Sphere, MeshTransmissionMaterial } from "@react-three/drei";
import * as THREE from "three";

export function FlowOrb() {
  const mesh = useRef<THREE.Mesh>(null!);

  useFrame((state) => {
    const { clock } = state;
    if (mesh.current) {
      mesh.current.rotation.x = clock.getElapsedTime() * 0.1;
      mesh.current.rotation.y = clock.getElapsedTime() * 0.15;
    }
  });

  return (
    <Sphere ref={mesh} args={[1, 128, 128]} scale={1.5}>
      <MeshTransmissionMaterial
        backside
        samples={16}
        thickness={0.2}
        chromaticAberration={0.05}
        anisotropy={0.1}
        distortion={0.3}
        distortionScale={0.5}
        temporalDistortion={0.1}
        clearcoat={1}
        attenuationDistance={0.5}
        attenuationColor="#ffffff"
        color="#1DB954"
      />
    </Sphere>
  );
}
