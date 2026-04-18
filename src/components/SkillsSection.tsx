"use client";

import { SkillCategory } from "@/lib/portfolio-data";
import { AnimatedSection } from "./AnimatedSection";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import * as Icons from "lucide-react";

export function SkillsSection({ data }: { data: SkillCategory[] }) {
  return (
    <section className="container mx-auto px-4 py-16 bg-muted/30" id="skills">
      <AnimatedSection direction="up">
        <h2 className="text-3xl font-bold mb-12 text-center">Technical Skills</h2>
      </AnimatedSection>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
        {data.map((category, index) => (
          <AnimatedSection key={index} delay={index * 0.1} direction="up">
            <SkillCard category={category} />
          </AnimatedSection>
        ))}
      </div>
    </section>
  );
}

function SkillCard({ category }: { category: SkillCategory }) {
  // Try to dynamically extract the icon or fallback to Code
  const IconComponent = (Icons as any)[
    category.icon.charAt(0).toUpperCase() + category.icon.slice(1)
  ] || Icons.Code;

  return (
    <div className="glass p-6 rounded-2xl h-full glow-hover flex flex-col">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-primary/10 rounded-lg text-primary">
          <IconComponent className="w-5 h-5" />
        </div>
        <h3 className="text-xl font-semibold">{category.category}</h3>
      </div>
      
      <div className="space-y-4 flex-grow">
        {category.items.map((skill, index) => (
          <SkillBar key={index} name={skill.name} level={skill.level} index={index} />
        ))}
      </div>
    </div>
  );
}

function SkillBar({ name, level, index }: { name: string; level: number; index: number }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  return (
    <div ref={ref} className="w-full">
      <div className="flex justify-between mb-1 text-sm font-medium">
        <span>{name}</span>
        <span className="text-muted-foreground">{level}%</span>
      </div>
      <div className="w-full bg-secondary h-2.5 rounded-full overflow-hidden">
        <motion.div
          className="h-full bg-gradient-to-r from-primary to-accent"
          initial={{ width: 0 }}
          animate={{ width: isInView ? `${level}%` : 0 }}
          transition={{ duration: 1, delay: 0.2 + index * 0.1, ease: "easeOut" }}
        />
      </div>
    </div>
  );
}
