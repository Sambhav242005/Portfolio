"use client";

import { useEffect, useRef, useCallback } from "react";
import { useReducedMotion } from "motion/react";

interface WaterDropDotGridProps {
  className?: string;
}

const COLS = 28;
const ROWS = 18;
const BASE_RADIUS = 2.2;
const MAX_RADIUS = 7;
const INFLUENCE_RADIUS = 120;
const SPRING = 0.08;
const DAMPING = 0.85;

export function WaterDropDotGrid({ className = "" }: WaterDropDotGridProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const dotsRef = useRef<HTMLDivElement[]>([]);
  const mouseRef = useRef({ x: -1000, y: -1000 });
  const sizesRef = useRef<number[]>(new Array(COLS * ROWS).fill(BASE_RADIUS));
  const velocitiesRef = useRef<number[]>(new Array(COLS * ROWS).fill(0));
  const rafRef = useRef<number | null>(null);
  const reduce = useReducedMotion();

  const animate = useCallback(() => {
    const container = containerRef.current;
    if (!container) return;

    const rect = container.getBoundingClientRect();
    const time = performance.now() * 0.001;

    for (let i = 0; i < COLS * ROWS; i++) {
      const dot = dotsRef.current[i];
      if (!dot) continue;

      const col = i % COLS;
      const row = Math.floor(i / COLS);
      const dotX = ((col + 0.5) / COLS) * rect.width;
      const dotY = ((row + 0.5) / ROWS) * rect.height;

      const mx = mouseRef.current.x;
      const my = mouseRef.current.y;
      const dx = mx - dotX;
      const dy = my - dotY;
      const dist = Math.sqrt(dx * dx + dy * dy);

      let target = BASE_RADIUS;
      if (dist < INFLUENCE_RADIUS) {
        const proximity = 1 - dist / INFLUENCE_RADIUS;
        const eased = proximity * proximity * (3 - 2 * proximity);
        target = BASE_RADIUS + (MAX_RADIUS - BASE_RADIUS) * eased;
      }

      const wobble = Math.sin(time * 0.8 + i * 0.3) * 0.4;
      target += wobble;

      const current = sizesRef.current[i];
      const velocity = velocitiesRef.current[i];
      const force = (target - current) * SPRING;
      const newVelocity = (velocity + force) * DAMPING;
      const newSize = Math.max(BASE_RADIUS * 0.5, current + newVelocity);

      sizesRef.current[i] = newSize;
      velocitiesRef.current[i] = newVelocity;

      const scale = newSize / BASE_RADIUS;
      dot.style.transform = `translate(-50%, -50%) scale(${scale})`;
    }

    rafRef.current = requestAnimationFrame(animate);
  }, []);

  useEffect(() => {
    if (reduce) return;
    const container = containerRef.current;
    if (!container) return;

    const fragment = document.createDocumentFragment();
    dotsRef.current = [];

    for (let row = 0; row < ROWS; row++) {
      for (let col = 0; col < COLS; col++) {
        const dot = document.createElement("div");
        dot.className = "dot-grid__dot";
        const x = ((col + 0.5) / COLS) * 100;
        const y = ((row + 0.5) / ROWS) * 100;
        dot.style.left = `${x}%`;
        dot.style.top = `${y}%`;
        dotsRef.current.push(dot);
        fragment.appendChild(dot);
      }
    }

    container.appendChild(fragment);

    function handlePointerMove(e: PointerEvent) {
      if (!container) return;
      const rect = container.getBoundingClientRect();
      mouseRef.current = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      };
    }

    function handlePointerLeave() {
      mouseRef.current = { x: -1000, y: -1000 };
    }

    container.addEventListener("pointermove", handlePointerMove, { passive: true });
    container.addEventListener("pointerleave", handlePointerLeave);

    rafRef.current = requestAnimationFrame(animate);

    return () => {
      container.removeEventListener("pointermove", handlePointerMove);
      container.removeEventListener("pointerleave", handlePointerLeave);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      container.innerHTML = "";
      dotsRef.current = [];
    };
  }, [reduce, animate]);

  if (reduce) {
    return (
      <div className={`dot-grid dot-grid--static ${className}`} aria-hidden="true">
        {Array.from({ length: COLS * ROWS }).map((_, i) => (
          <div key={i} className="dot-grid__dot" style={{
            left: `${((i % COLS + 0.5) / COLS) * 100}%`,
            top: `${((Math.floor(i / COLS) + 0.5) / ROWS) * 100}%`,
          }} />
        ))}
      </div>
    );
  }

  return (
    <div ref={containerRef} className={`dot-grid ${className}`} aria-hidden="true" />
  );
}
