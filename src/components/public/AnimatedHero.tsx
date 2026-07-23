"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform, useReducedMotion } from "motion/react";

interface AnimatedHeroProps {
  children: React.ReactNode;
  className?: string;
  id?: string;
}

export function AnimatedHero({ children, className = "", id }: AnimatedHeroProps) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  const sectionOpacity = useTransform(scrollYProgress, [0, 0.9], [1, 0.1]);
  const sectionY = useTransform(scrollYProgress, [0, 0.9], [0, -30]);

  if (reduce) {
    return (
      <section ref={ref} className={className} id={id}>
        {children}
      </section>
    );
  }

  return (
    <motion.section
      ref={ref}
      className={className}
      id={id}
      style={{
        opacity: sectionOpacity,
        y: sectionY,
      }}
    >
      {children}
    </motion.section>
  );
}
