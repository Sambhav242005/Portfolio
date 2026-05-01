"use client";

import { motion, useInView } from "framer-motion";
import { useRef, ReactNode } from "react";
import { cn } from "@/lib/utils";

interface AnimatedSectionProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  direction?: "up" | "down" | "left" | "right" | "none" | "scale";
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
      case "scale": return { scale: 0.8, opacity: 0 };
      case "none": return { opacity: 0 };
    }
  };

  return (
    <motion.div
      ref={ref}
      className={cn(className)}
      initial={getVariants()}
      animate={isInView ? { x: 0, y: 0, scale: 1, opacity: 1 } : getVariants()}
      transition={{ 
        type: "spring",
        stiffness: 100,
        damping: 20,
        delay, 
      }}
    >
      {children}
    </motion.div>
  );
}
