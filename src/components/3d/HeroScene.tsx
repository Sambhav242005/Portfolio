"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { Float, Line, OrbitControls, Text } from "@react-three/drei";
import { Suspense, type ComponentProps, useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";

const nodes = [
  { label: "Agents", position: [-2.9, 1.35, 0.1], color: "#f97316" },
  { label: "Vision", position: [2.75, 1.2, -0.1], color: "#0891b2" },
  { label: "Models", position: [0.1, 2.55, -0.35], color: "#2563eb" },
  { label: "APIs", position: [-2.35, -1.45, -0.2], color: "#ea580c" },
  { label: "Data", position: [2.45, -1.55, 0.05], color: "#0f766e" },
] as const;

type SceneTextProps = ComponentProps<typeof Text>;

function SceneText(props: SceneTextProps) {
  return (
    <Suspense fallback={null}>
      <Text {...props} />
    </Suspense>
  );
}

function StaticSystemFallback() {
  return (
    <div className="absolute inset-0 overflow-hidden bg-gradient-to-br from-background via-background to-[hsl(var(--gradient-end))]">
      <div className="absolute right-[-34%] top-[22%] h-[24rem] w-[24rem] rotate-[-10deg] border border-primary/25 bg-card/55 shadow-[0_30px_90px_-60px_var(--glow-primary)] md:right-[8%] md:h-[30rem] md:w-[30rem]" />
      <div className="absolute right-[4%] top-[38%] h-28 w-48 rotate-[8deg] rounded-[8px] border border-foreground/15 bg-background/85 shadow-xl md:right-[20%] md:h-32 md:w-56" />
      <div className="absolute right-[12%] top-[45%] h-1 w-36 rotate-[8deg] bg-primary/70 md:right-[26%]" />
      <div className="absolute right-[-24%] top-[58%] h-px w-80 rotate-[-18deg] bg-gradient-to-r from-transparent via-primary/25 to-transparent md:right-[10%] md:w-[25rem]" />
      <div className="absolute right-[-10%] top-[30%] h-px w-72 rotate-[24deg] bg-gradient-to-r from-transparent via-accent/35 to-transparent md:right-[18%] md:w-[19rem]" />
    </div>
  );
}

function DataPanel({
  position,
  rotation,
  title,
  lines,
}: {
  position: [number, number, number];
  rotation: [number, number, number];
  title: string;
  lines: string[];
}) {
  return (
    <group position={position} rotation={rotation}>
      <mesh position={[0, 0, -0.018]}>
        <boxGeometry args={[2.27, 1.3, 0.035]} />
        <meshBasicMaterial color="#0f172a" transparent opacity={0.86} />
      </mesh>
      <mesh>
        <boxGeometry args={[2.15, 1.18, 0.04]} />
        <meshBasicMaterial color="#f8fafc" transparent opacity={0.94} />
      </mesh>
      <mesh position={[0, 0.43, 0.03]}>
        <boxGeometry args={[1.82, 0.03, 0.02]} />
        <meshBasicMaterial color="#f97316" transparent opacity={0.88} />
      </mesh>
      <SceneText position={[-0.86, 0.35, 0.06]} fontSize={0.105} color="#0f172a" anchorX="left" anchorY="middle">
        {title}
      </SceneText>
      {lines.map((line, index) => (
        <SceneText
          key={line}
          position={[-0.86, 0.08 - index * 0.2, 0.06]}
          fontSize={0.078}
          color={index === 1 ? "#c2410c" : "#475569"}
          anchorX="left"
          anchorY="middle"
        >
          {line}
        </SceneText>
      ))}
    </group>
  );
}

function SystemNode({
  label,
  position,
  color,
}: {
  label: string;
  position: readonly [number, number, number];
  color: string;
}) {
  return (
    <Float speed={1.4} rotationIntensity={0.25} floatIntensity={0.35}>
      <group position={position}>
        <mesh>
          <sphereGeometry args={[0.2, 32, 32]} />
          <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.55} roughness={0.2} metalness={0.45} />
        </mesh>
        <mesh>
          <ringGeometry args={[0.34, 0.36, 48]} />
          <meshBasicMaterial color={color} transparent opacity={0.28} side={THREE.DoubleSide} />
        </mesh>
        <SceneText
          position={[0, -0.46, 0]}
          fontSize={0.13}
          color="#f8fafc"
          outlineWidth={0.006}
          outlineColor="#0f172a"
          anchorX="center"
          anchorY="middle"
        >
          {label}
        </SceneText>
      </group>
    </Float>
  );
}

function AISystemMap() {
  const groupRef = useRef<THREE.Group>(null);
  const ringRef = useRef<THREE.Mesh>(null);

  const connectionPoints = useMemo(
    () =>
      nodes.map((node) => [
        new THREE.Vector3(0, 0, 0),
        new THREE.Vector3(node.position[0], node.position[1], node.position[2]),
      ]),
    []
  );

  useFrame((state, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.09;
      groupRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.45) * 0.08;
    }
    if (ringRef.current) {
      ringRef.current.rotation.z -= delta * 0.16;
    }
  });

  return (
    <group ref={groupRef} position={[2.35, -0.05, 0]} rotation={[0.12, -0.35, 0.03]} scale={0.78}>
      <mesh ref={ringRef} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[1.08, 0.012, 16, 120]} />
        <meshBasicMaterial color="#f97316" transparent opacity={0.55} />
      </mesh>
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[1.62, 0.006, 16, 120]} />
        <meshBasicMaterial color="#0891b2" transparent opacity={0.32} />
      </mesh>
      <mesh>
        <icosahedronGeometry args={[0.72, 1]} />
        <meshStandardMaterial color="#f97316" emissive="#ea580c" emissiveIntensity={0.75} roughness={0.18} metalness={0.38} />
      </mesh>
      <mesh>
        <icosahedronGeometry args={[0.84, 1]} />
        <meshBasicMaterial color="#fed7aa" transparent opacity={0.08} wireframe />
      </mesh>

      {connectionPoints.map((points, index) => (
        <Line key={nodes[index].label} points={points} color={nodes[index].color} lineWidth={1.15} transparent opacity={0.48} />
      ))}

      {nodes.map((node) => (
        <SystemNode key={node.label} label={node.label} position={node.position} color={node.color} />
      ))}

      <DataPanel
        position={[-1.45, -2.35, -0.8]}
        rotation={[0.02, 0.28, -0.04]}
        title="agent.pipeline"
        lines={["idea -> spec", "tools.route()", "ship: verified"]}
      />
    </group>
  );
}

export default function HeroScene() {
  const [mounted, setMounted] = useState(false);
  const [useStaticScene, setUseStaticScene] = useState(false);

  useEffect(() => {
    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const mobileQuery = window.matchMedia("(max-width: 767px)");
    const updateSceneMode = () => {
      const deviceMemory = "deviceMemory" in navigator ? Number((navigator as Navigator & { deviceMemory?: number }).deviceMemory) : 8;
      const lowCoreDevice = navigator.hardwareConcurrency > 0 && navigator.hardwareConcurrency <= 2 && deviceMemory <= 2;
      setUseStaticScene(motionQuery.matches || mobileQuery.matches || lowCoreDevice);
    };

    setMounted(true);
    updateSceneMode();
    motionQuery.addEventListener("change", updateSceneMode);
    mobileQuery.addEventListener("change", updateSceneMode);

    return () => {
      motionQuery.removeEventListener("change", updateSceneMode);
      mobileQuery.removeEventListener("change", updateSceneMode);
    };
  }, []);

  if (!mounted || useStaticScene) return <StaticSystemFallback />;

  return (
    <div className="absolute inset-0 h-full w-full" style={{ zIndex: 0 }} aria-hidden="true">
      <div className="absolute inset-0 -z-10 bg-gradient-to-br from-background via-background to-[hsl(var(--gradient-end))]" />

      <Canvas
        camera={{ position: [0, 0, 9.2], fov: 42 }}
        gl={{ alpha: true, antialias: true, powerPreference: "high-performance" }}
        dpr={[1, 1.75]}
      >
        <ambientLight intensity={0.75} />
        <directionalLight position={[5, 7, 5]} intensity={1.25} />
        <pointLight position={[-4, -2, 3]} intensity={2.1} color="#f97316" />
        <pointLight position={[4, 2, 2]} intensity={1.15} color="#0891b2" />

        <AISystemMap />

        <OrbitControls
          enableZoom={false}
          enablePan={false}
          enableRotate
          autoRotate
          autoRotateSpeed={0.32}
          maxPolarAngle={Math.PI / 2 + 0.18}
          minPolarAngle={Math.PI / 2 - 0.18}
        />
      </Canvas>
    </div>
  );
}
