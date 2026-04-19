"use client";

import { motion, useMotionTemplate, useMotionValue } from "framer-motion";
import { MouseEvent } from "react";
import { ProjectData } from "@/lib/portfolio-data";
import { AnimatedSection } from "./AnimatedSection";
import { cn } from "@/lib/utils";
import { ExternalLink } from "lucide-react";

function GithubIcon({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.04-.015-2.04-3.338.72-4.042-1.61-4.042-1.61-.546-1.385-1.335-1.755-1.335-1.755-1.087-.745.084-.73.084-.73 1.205.085 1.838 1.235 1.838 1.235 1.07 1.835 2.809 1.305 3.495.995.105-.775.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.37 1.235-3.205-.12-.3-.54-1.524.12-3.16 0 0 1.005-.315 3.285 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.28-1.555 3.285-1.23 3.285-1.23.66 1.636.24 2.86.12 3.16.77.835 1.235 1.9 1.235 3.205 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.285 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/>
    </svg>
  );
}

export function ProjectShowcase({ data }: { data: ProjectData[] }) {
  return (
    <section className="container mx-auto px-4 py-16" id="projects">
      <AnimatedSection direction="up">
        <h2 className="text-3xl font-bold mb-8 text-center">Featured Projects</h2>
      </AnimatedSection>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
        {data.map((project, index) => (
          <AnimatedSection 
            key={project.id} 
            delay={index * 0.1} 
            direction={index % 2 === 0 ? "left" : "right"}
          >
            <ProjectCard project={project} />
          </AnimatedSection>
        ))}
      </div>
    </section>
  );
}

function ProjectCard({ project }: { project: ProjectData }) {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  function handleMouseMove({ currentTarget, clientX, clientY }: MouseEvent) {
    const { left, top, width, height } = currentTarget.getBoundingClientRect();
    const x = clientX - left;
    const y = clientY - top;
    
    mouseX.set(x);
    mouseY.set(y);
  }

  // 3D tilt calculations based on mouse position
  const rotateX = useMotionTemplate`calc((${(mouseY as any).get()}px - 50%) * 0.05deg)`;
  const rotateY = useMotionTemplate`calc((${(mouseX as any).get()}px - 50%) * -0.05deg)`;

  const isAI = project.category === 'ai';

  return (
    <motion.a
      href={project.githubUrl}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(
        "group relative flex flex-col justify-between p-8 rounded-2xl h-full outline-none",
        "glass overflow-hidden block transition-transform duration-300",
        isAI ? "hover:shadow-[0_0_30px_var(--glow-accent)]" : "hover:shadow-[0_0_30px_var(--glow-primary)]"
      )}
      onMouseMove={handleMouseMove}
      style={{ perspective: 1000 }}
      whileHover={{ y: -5 }}
    >
      {/* Interactive gradient border/glow effect on mouse hover */}
      <motion.div
        className="pointer-events-none absolute -inset-px rounded-xl opacity-0 transition duration-300 group-hover:opacity-100"
        style={{
          background: useMotionTemplate`
            radial-gradient(
              650px circle at ${mouseX}px ${mouseY}px,
              ${isAI ? 'rgba(139, 92, 246, 0.15)' : 'rgba(249, 115, 22, 0.15)'},
              transparent 80%
            )
          `,
        }}
      />
      
      <div className="z-10 relative">
        <div className="flex justify-between items-start mb-4">
          <h3 className="text-2xl font-bold group-hover:text-primary transition-colors">
            {project.title}
          </h3>
          <GithubIcon className="w-6 h-6 text-muted-foreground group-hover:text-primary transition-colors" />
        </div>
        
        <p className="text-muted-foreground mb-6 leading-relaxed">
          {project.description}
        </p>
      </div>

      <div className="flex flex-wrap gap-2 mt-auto z-10 relative">
        {project.technologies.map((tech, idx) => (
          <span 
            key={idx} 
            className="px-3 py-1 text-xs font-medium bg-secondary text-secondary-foreground rounded-full"
          >
            {tech}
          </span>
        ))}
      </div>
    </motion.a>
  );
}
