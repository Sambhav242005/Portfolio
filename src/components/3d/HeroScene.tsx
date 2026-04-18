"use client";

import { Canvas } from "@react-three/fiber";
import { Stars, OrbitControls, Environment } from "@react-three/drei";
import { Suspense, useState, useEffect } from "react";
import { FloatingGeometry } from "./FloatingGeometry";

export default function HeroScene() {
  const [mounted, setMounted] = useState(false);
  const [isLowPower, setIsLowPower] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Extremely basic heuristic: if hardware concurrency is low, we might be on a low-end device
    if (typeof navigator !== "undefined" && navigator.hardwareConcurrency <= 4) {
      // setIsLowPower(true); // Can enable this if performance is actually bad
    }
  }, []);

  if (!mounted) return <div className="absolute inset-0 bg-background" />;
  
  if (isLowPower) {
    return (
      <div className="absolute inset-0 overflow-hidden bg-gradient-to-br from-background to-[hsl(var(--gradient-end))]">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-primary/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "2s" }} />
      </div>
    );
  }

  return (
    <div className="absolute inset-0 w-full h-full" style={{ zIndex: 0 }}>
      {/* Background gradient applied via CSS */}
      <div className="absolute inset-0 bg-gradient-to-br from-background to-[hsl(var(--gradient-end))] -z-10" />
      
      <Canvas
        camera={{ position: [0, 0, 10], fov: 45 }}
        gl={{ alpha: true, antialias: true }}
        dpr={[1, 2]}
      >
        <Suspense fallback={null}>
          <ambientLight intensity={0.5} />
          <directionalLight position={[10, 10, 5]} intensity={1} />
          <pointLight position={[-10, -10, -5]} intensity={0.5} />
          
          <Stars 
            radius={50} 
            depth={50} 
            count={3000} 
            factor={3} 
            saturation={0} 
            fade 
            speed={1} 
          />

          {/* AI Category / Violet */}
          <FloatingGeometry 
            color="#8b5cf6" 
            position={[-4, 2, -2]} 
            scale={1.2} 
            shape="icosahedron"
            floatSpeed={1.5}
            rotationSpeed={0.4}
          />
          
          {/* Web Category / Cyan */}
          <FloatingGeometry 
            color="#06b6d4" 
            position={[4, -1, -3]} 
            scale={1.5} 
            shape="torusKnot"
            floatSpeed={1.2}
            rotationSpeed={0.6}
          />
          
          {/* Default/Accent / Orange */}
          <FloatingGeometry 
            color="#f97316" 
            position={[-3, -3, -1]} 
            scale={0.9} 
            shape="octahedron"
            floatSpeed={2}
            rotationSpeed={0.8}
          />
          
          {/* Extra shapes in background */}
          <FloatingGeometry 
            color="#3b82f6" 
            position={[5, 4, -8]} 
            scale={2} 
            shape="icosahedron"
            floatSpeed={0.8}
            rotationSpeed={0.2}
          />
          <FloatingGeometry 
            color="#ec4899" 
            position={[-6, -1, -6]} 
            scale={1.8} 
            shape="torusKnot"
            floatSpeed={1}
            rotationSpeed={0.3}
          />

          <Environment preset="city" />
          
          <OrbitControls 
            enableZoom={false} 
            enablePan={false}
            enableRotate={true}
            autoRotate={true}
            autoRotateSpeed={0.5}
            maxPolarAngle={Math.PI / 2 + 0.2} // Limit vertical rotation
            minPolarAngle={Math.PI / 2 - 0.2}
          />
        </Suspense>
      </Canvas>
    </div>
  );
}
