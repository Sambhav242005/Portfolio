"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "motion/react";
import { useMotionPreference } from "./useMotionPreference";

interface AnimatedHeroProps {
  children: React.ReactNode;
  className?: string;
  id?: string;
}

export function AnimatedHero({ children, className = "", id }: AnimatedHeroProps) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useMotionPreference();

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  const sectionOpacity = useTransform(scrollYProgress, [0, 0.9], [1, 0.1]);
  const sectionY = useTransform(scrollYProgress, [0, 0.9], [0, -30]);

  return (
    <motion.section
      ref={ref}
      className={className}
      id={id}
      style={{
        opacity: reduce ? 1 : sectionOpacity,
        y: reduce ? 0 : sectionY,
      }}
    >
      {children}
    </motion.section>
  );
}
