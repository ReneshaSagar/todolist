"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Sphere, TorusKnot, MeshDistortMaterial, Float, Environment } from "@react-three/drei";
import * as THREE from "three";

export default function TwistingShape() {
  const meshRef = useRef<THREE.Mesh>(null);
  const torusRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = state.clock.getElapsedTime() * 0.2;
      meshRef.current.rotation.y = state.clock.getElapsedTime() * 0.3;
    }
    if (torusRef.current) {
      torusRef.current.rotation.x = state.clock.getElapsedTime() * -0.1;
      torusRef.current.rotation.y = state.clock.getElapsedTime() * -0.2;
      torusRef.current.rotation.z = state.clock.getElapsedTime() * 0.1;
    }
  });

  return (
    <>
      <Environment preset="night" />
      <ambientLight intensity={0.5} />
      <directionalLight position={[10, 10, 5]} intensity={2} color="#ffffff" />
      <spotLight position={[-10, -10, -5]} intensity={5} color="#8a2be2" />
      
      <Float speed={2} rotationIntensity={1} floatIntensity={2}>
        <TorusKnot ref={torusRef} args={[2, 0.4, 256, 64, 3, 4]} scale={1.2}>
          <meshPhysicalMaterial 
            color="#0f0f0f" 
            metalness={0.9} 
            roughness={0.1}
            clearcoat={1}
            clearcoatRoughness={0.1}
            emissive="#1a1a1a"
          />
        </TorusKnot>

        <Sphere ref={meshRef} args={[1.5, 64, 64]}>
          <MeshDistortMaterial
            color="#4f46e5" /* Indigo brand color */
            attach="material"
            distort={0.4}
            speed={2}
            roughness={0.2}
            metalness={0.8}
            bumpScale={0.005}
            clearcoat={1}
            clearcoatRoughness={0.1}
            radius={1}
          />
        </Sphere>
      </Float>
    </>
  );
}
