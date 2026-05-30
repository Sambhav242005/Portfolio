"use client";

import { motion, useMotionTemplate, useMotionValue } from "framer-motion";
import { MouseEvent } from "react";
import { ProjectData } from "@/lib/portfolio-data";
import { AnimatedSection } from "./AnimatedSection";
import { cn } from "@/lib/utils";
import { ExternalLink, GitBranch, Layers3 } from "lucide-react";

function GithubIcon({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.04-.015-2.04-3.338.72-4.042-1.61-4.042-1.61-.546-1.385-1.335-1.755-1.335-1.755-1.087-.745.084-.73.084-.73 1.205.085 1.838 1.235 1.838 1.235 1.07 1.835 2.809 1.305 3.495.995.105-.775.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.37 1.235-3.205-.12-.3-.54-1.524.12-3.16 0 0 1.005-.315 3.285 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.28-1.555 3.285-1.23 3.285-1.23.66 1.636.24 2.86.12 3.16.77.835 1.235 1.9 1.235 3.205 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.285 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/>
    </svg>
  );
}

export function ProjectShowcase({ data }: { data: ProjectData[] }) {
  return (
    <section className="relative overflow-hidden py-24" id="projects">
      <div className="container mx-auto px-4">
        <AnimatedSection direction="up">
          <div className="mx-auto mb-12 grid max-w-7xl gap-6 lg:grid-cols-[0.85fr_1.15fr] lg:items-end">
            <div>
              <span className="mb-4 inline-flex rounded-full border border-primary/25 bg-primary/10 px-3 py-1 text-xs font-bold uppercase tracking-[0.16em] text-primary">
                Project index
              </span>
              <h2 className="text-3xl font-bold leading-tight tracking-tight text-foreground md:text-5xl">
                Featured builds with visible engineering shape.
              </h2>
            </div>
            <div className="grid gap-3 sm:grid-cols-2 lg:justify-self-end">
              <div className="rounded-[8px] border border-border/70 bg-card/75 p-4">
                <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
                  <Layers3 className="h-4 w-4 text-primary" />
                  Systems focus
                </div>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">Agents, vision, model architecture, and full-stack product work.</p>
              </div>
              <div className="rounded-[8px] border border-border/70 bg-card/75 p-4">
                <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
                  <GitBranch className="h-4 w-4 text-primary" />
                  Open source trail
                </div>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">Each card links back to the repository or live surface when available.</p>
              </div>
            </div>
          </div>
        </AnimatedSection>
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
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

  const isAI = project.category === 'ai';
  const categoryLabel = isAI ? "AI system" : "Full-stack build";
  const mainUrl = project.liveUrl || project.githubUrl;
  const spotlight = useMotionTemplate`
    radial-gradient(
      650px circle at ${mouseX}px ${mouseY}px,
      ${isAI ? 'rgba(249, 115, 22, 0.14)' : 'rgba(8, 145, 178, 0.14)'},
      transparent 80%
    )
  `;

  return (
    <motion.div
      className={cn(
        "group relative flex h-full flex-col justify-between overflow-hidden rounded-[8px] border border-border/70 bg-card/85 p-7 outline-none transition-[border-color,box-shadow,transform] duration-300",
        isAI ? "hover:shadow-[0_22px_60px_-36px_var(--glow-primary)]" : "hover:shadow-[0_22px_60px_-36px_var(--glow-accent)]"
      )}
      onMouseMove={handleMouseMove}
      style={{ perspective: 1000 }}
      whileHover={{ y: -5 }}
    >
      {/* Interactive gradient border/glow effect on mouse hover */}
      <motion.div
        className="pointer-events-none absolute -inset-px rounded-[8px] opacity-0 transition duration-300 group-hover:opacity-100"
        style={{ background: spotlight }}
      />
      
      <div className="z-10 relative">
        <div className="mb-5 flex items-center justify-between gap-4">
          <span className="rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] text-primary">
            {categoryLabel}
          </span>
          {mainUrl && (
            <a
              href={mainUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-muted-foreground transition-colors hover:text-primary"
            >
              Open <ExternalLink className="h-3.5 w-3.5" />
            </a>
          )}
        </div>
        <div className="mb-4 flex items-start justify-between">
          <a href={mainUrl} target="_blank" rel="noopener noreferrer" className="z-10 hover:underline">
            <h3 className="pr-4 text-2xl font-bold leading-tight text-foreground transition-colors group-hover:text-primary">
              {project.title}
            </h3>
          </a>
          {project.githubUrl && (
            <a href={project.githubUrl} target="_blank" rel="noopener noreferrer" className="z-20 cursor-pointer" aria-label="View on GitHub">
              <GithubIcon className="w-6 h-6 text-muted-foreground hover:text-primary transition-colors" />
            </a>
          )}
        </div>
        
        <p className="mb-6 leading-relaxed text-muted-foreground">
          {project.description}
        </p>
      </div>

      <div className="relative z-10 mt-auto flex flex-wrap gap-2">
        {project.technologies.map((tech, idx) => (
          <span 
            key={idx} 
            className="rounded-full border border-border/70 bg-secondary/70 px-3 py-1 text-xs font-medium text-secondary-foreground"
          >
            {tech}
          </span>
        ))}
      </div>
      
      {/* Make the entire card clickable, underneath the other links */}
      <a href={mainUrl} target="_blank" rel="noopener noreferrer" className="absolute inset-0 z-0">
        <span className="sr-only">View Project</span>
      </a>
    </motion.div>
  );
}
