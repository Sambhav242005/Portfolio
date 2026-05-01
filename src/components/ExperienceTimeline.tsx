"use client";

import { ExperienceData } from "@/lib/portfolio-data";
import { AnimatedSection } from "./AnimatedSection";
import { Briefcase } from "lucide-react";
import { motion } from "framer-motion";

export function ExperienceTimeline({ data }: { data: ExperienceData[] }) {
  if (!data || data.length === 0) return null;

  return (
    <section className="container mx-auto px-4 py-16" id="experience">
      <AnimatedSection direction="up">
        <h2 className="text-3xl font-bold mb-12 text-center text-gradient">Experience</h2>
      </AnimatedSection>

      <div className="relative max-w-4xl mx-auto">
        {/* Central connecting line for desktop */}
        <motion.div 
          className="hidden md:block absolute left-1/2 top-4 bottom-4 w-0.5 bg-border -translate-x-1/2 origin-top" 
          initial={{ scaleY: 0 }}
          whileInView={{ scaleY: 1 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 1.5, ease: "easeInOut" }}
        />
        
        <div className="space-y-12">
          {data.map((item, index) => {
            const isEven = index % 2 === 0;
            return (
              <div key={item.id} className="relative flex flex-col md:flex-row items-center">
                
                {/* Desktop Left Side */}
                <div className={`hidden md:block w-1/2 ${isEven ? 'pr-12 text-right' : 'order-last pl-12 text-left'}`}>
                  <AnimatedSection direction={isEven ? "right" : "left"} delay={0.1}>
                    <TimelineCard item={item} />
                  </AnimatedSection>
                </div>

                {/* Center marker */}
                <div className="hidden md:flex absolute left-1/2 -translate-x-1/2 w-10 h-10 rounded-full bg-background border-4 border-primary items-center justify-center z-10">
                  <Briefcase className="w-4 h-4 text-primary" />
                </div>

                {/* Mobile version (Stacked) */}
                <div className="w-full md:hidden ml-4 pl-8 border-l-2 border-border relative">
                  <div className="absolute left-[-11px] top-4 w-5 h-5 rounded-full bg-primary" />
                  <AnimatedSection direction="up">
                    <TimelineCard item={item} />
                  </AnimatedSection>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function TimelineCard({ item }: { item: ExperienceData }) {
  return (
    <div className="glass p-6 rounded-2xl glow-hover text-left">
      <span className="inline-block px-3 py-1 mb-4 text-xs font-semibold text-primary bg-primary/10 rounded-full">
        {item.dateRange}
      </span>
      <h3 className="text-xl font-bold mb-1">{item.role}</h3>
      <p className="text-muted-foreground font-semibold mb-4">{item.company}</p>
      
      <ul className="space-y-2 text-sm text-foreground/90">
        {item.bullets.map((bullet, i) => (
          <li key={i} className="flex relative pl-5 leading-relaxed">
            <span className="absolute left-0 top-2 w-1.5 h-1.5 rounded-full bg-primary" />
            {bullet}
          </li>
        ))}
      </ul>
    </div>
  );
}
