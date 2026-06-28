"use client";

import { type ReactNode } from "react";

interface AnimatedHeroProps {
  children: ReactNode;
  className?: string;
}

export function AnimatedHero({ children, className = "" }: AnimatedHeroProps) {
  return (
    <div className={`hero-art--animated ${className}`}>
      {children}
    </div>
  );
}
