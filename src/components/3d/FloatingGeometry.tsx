"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Trail, Float } from "@react-three/drei";
import * as THREE from "three";

interface FloatingGeometryProps {
  color: string;
  position: [number, number, number];
  scale?: number;
  shape?: "icosahedron" | "octahedron" | "torusKnot";
  floatSpeed?: number;
  rotationSpeed?: number;
}

export function FloatingGeometry({
  color,
  position,
  scale = 1,
  shape = "icosahedron",
  floatSpeed = 1.5,
  rotationSpeed = 0.5,
}: FloatingGeometryProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const edgeRef = useRef<THREE.LineSegments>(null);

  useFrame((state, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.x += delta * rotationSpeed;
      meshRef.current.rotation.y += delta * rotationSpeed * 0.5;
    }
    if (edgeRef.current) {
      edgeRef.current.rotation.x += delta * rotationSpeed;
      edgeRef.current.rotation.y += delta * rotationSpeed * 0.5;
    }
  });

  const getGeometry = () => {
    switch (shape) {
      case "octahedron":
        return <octahedronGeometry args={[1, 0]} />;
      case "torusKnot":
        return <torusKnotGeometry args={[0.7, 0.2, 64, 8]} />;
      case "icosahedron":
      default:
        return <icosahedronGeometry args={[1, 0]} />;
    }
  };

  const getEdges = () => {
    switch (shape) {
      case "octahedron":
        return new THREE.EdgesGeometry(new THREE.OctahedronGeometry(1, 0));
      case "torusKnot":
        return new THREE.EdgesGeometry(new THREE.TorusKnotGeometry(0.7, 0.2, 64, 8));
      case "icosahedron":
      default:
        return new THREE.EdgesGeometry(new THREE.IcosahedronGeometry(1, 0));
    }
  };

  return (
    <Float speed={floatSpeed} rotationIntensity={1} floatIntensity={1}>
      <group position={position} scale={scale}>
        {/* Fill Mesh */}
        <mesh ref={meshRef}>
          {getGeometry()}
          <meshStandardMaterial 
            color={color} 
            transparent 
            opacity={0.3} 
            roughness={0.1}
            metalness={0.8}
          />
        </mesh>
        
        {/* Wireframe Outline */}
        <lineSegments ref={edgeRef} geometry={getEdges()}>
          <lineBasicMaterial color={color} transparent opacity={0.6} />
        </lineSegments>

        {/* Trail effect */}
        <Trail
          width={1.5}
          length={4}
          color={new THREE.Color(color)}
          attenuation={(t) => t * t}
        >
          {/* We attach the trail to a small invisible box inside */}
          <mesh visible={false}>
            <boxGeometry args={[0.1, 0.1, 0.1]} />
          </mesh>
        </Trail>
      </group>
    </Float>
  );
}
