import Link from "next/link";
import { IconArrowRight, IconBrandGithub, IconExternalLink } from "@tabler/icons-react";
import { ProjectCoverImage } from "@/components/public/ProjectCoverImage";
import type { Project } from "@/lib/content/projects";

type ProjectCardProps = {
  project: Project;
  className?: string;
};

export function ProjectCard({ project, className = "" }: ProjectCardProps) {
  return (
    <article className={`project-card ${className}`} id={project.slug}>
      <Link className="project-card-media" href={`/projects/${project.slug}`} aria-label={`Open ${project.title} case study`}>
        <ProjectCoverImage sources={project.coverImages} alt={`${project.title} visual`} />
      </Link>
      <div className="project-card-body">
        <div>
          <h3>
            <Link href={`/projects/${project.slug}`}>{project.title}</Link>
          </h3>
          <p>{project.summary}</p>
        </div>
        <div className="chip-row" aria-label={`${project.title} technology stack`}>
          {project.tags.map((tag) => (
            <span className="chip" key={tag}>
              {tag}
            </span>
          ))}
        </div>
        <div className="project-card-actions">
          <Link className="card-link" href={`/projects/${project.slug}`}>
            View project
            <IconArrowRight aria-hidden="true" size={15} stroke={1.7} />
          </Link>
          {project.githubUrl ? (
            <a className="card-link card-link-muted" href={project.githubUrl} target="_blank" rel="noreferrer">
              GitHub
              <IconBrandGithub aria-hidden="true" size={15} stroke={1.7} />
            </a>
          ) : null}
          {project.liveUrl ? (
            <a className="card-link card-link-muted" href={project.liveUrl} target="_blank" rel="noreferrer">
              Live
              <IconExternalLink aria-hidden="true" size={15} stroke={1.7} />
            </a>
          ) : null}
        </div>
      </div>
    </article>
  );
}
