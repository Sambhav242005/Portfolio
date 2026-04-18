"use client";

import { motion, useInView } from "framer-motion";
import { useRef, ReactNode } from "react";
import { cn } from "@/lib/utils";

interface AnimatedSectionProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  direction?: "up" | "down" | "left" | "right" | "none";
}

export function AnimatedSection({ 
  children, 
  className, 
  delay = 0,
  direction = "up"
}: AnimatedSectionProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const getVariants = () => {
    switch (direction) {
      case "up": return { y: 50, opacity: 0 };
      case "down": return { y: -50, opacity: 0 };
      case "left": return { x: 50, opacity: 0 };
      case "right": return { x: -50, opacity: 0 };
      case "none": return { opacity: 0 };
    }
  };

  return (
    <motion.div
      ref={ref}
      className={cn(className)}
      initial={getVariants()}
      animate={isInView ? { x: 0, y: 0, opacity: 1 } : getVariants()}
      transition={{ 
        duration: 0.6, 
        delay, 
        ease: [0.21, 0.47, 0.32, 0.98] 
      }}
    >
      {children}
    </motion.div>
  );
}
