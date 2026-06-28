"use client";

export function GradientMesh({ className = "" }: { className?: string }) {
  return (
    <div className={`gradient-mesh-wrap ${className}`} aria-hidden="true">
      <div className="gradient-mesh" />
    </div>
  );
}
