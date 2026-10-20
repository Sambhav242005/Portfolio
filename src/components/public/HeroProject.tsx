import Link from "next/link";
import { IconArrowUpRight } from "@tabler/icons-react";
import { ProjectCoverImage } from "./ProjectCoverImage";
import type { Project } from "@/lib/content/projects";

export function HeroProject({ project }: { project: Project }) {
  return (
    <Link className="hero-project" href={`/projects/${project.slug}`}>
      <ProjectCoverImage sources={project.coverImages} alt={`${project.title} application preview`} priority />
      <div className="hero-project-copy">
        <h2>{project.title}<IconArrowUpRight aria-hidden="true" size={23} stroke={1.6} /></h2>
        <p>{project.summary}</p>
        <span className="hero-project-action">Explore the project<IconArrowUpRight aria-hidden="true" size={16} /></span>
      </div>
    </Link>
  );
}
