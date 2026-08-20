"use client";

import Link from "next/link";
import { useRef } from "react";
import { useReducedMotion } from "motion/react";
import { ProjectCoverImage } from "@/components/public/ProjectCoverImage";
import type { Project } from "@/lib/content/projects";

type ProjectCardProps = {
  project: Project;
  className?: string;
};

export function ProjectCard({ project, className = "" }: ProjectCardProps) {
  const cardRef = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();

  function handlePointerMove(e: React.PointerEvent<HTMLElement>) {
    if (reduce || !cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    cardRef.current.style.transform = `translateY(-4px) perspective(800px) rotateY(${x * 4}deg) rotateX(${-y * 4}deg)`;
  }

  function handlePointerLeave() {
    if (cardRef.current) {
      cardRef.current.style.transform = "";
    }
  }

  return (
    <article
      ref={cardRef}
      className={`project-card ${className}`}
      id={project.slug}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
    >
      <Link href={`/projects/${project.slug}`} className="project-card-image" aria-label={`View ${project.title}`}>
        <ProjectCoverImage sources={project.coverImages} alt={`${project.title} preview`} loading="eager" />
        <span className="project-card-view">View project →</span>
      </Link>
      <div className="project-card-info">
        <Link href={`/projects/${project.slug}`} className="project-card-title">
          {project.title}
        </Link>
        <p className="project-card-summary">{project.summary}</p>
        <div className="project-card-tags">
          {project.tags.slice(0, 4).map((tag) => (
            <span key={tag} className="project-card-tag">{tag}</span>
          ))}
        </div>
      </div>
    </article>
  );
}
