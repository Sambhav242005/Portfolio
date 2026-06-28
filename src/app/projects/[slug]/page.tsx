import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { IconBrandGithub, IconExternalLink } from "@tabler/icons-react";
import { MdxContent } from "@/components/mdx/mdx-content";
import { ProjectCoverImage } from "@/components/public/ProjectCoverImage";
import { getProjectBySlug, getProjects } from "@/lib/content/projects";

type ProjectPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export function generateStaticParams() {
  return getProjects().map((project) => ({
    slug: project.slug,
  }));
}

export async function generateMetadata({ params }: ProjectPageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = getProjectBySlug(slug);

  if (!project) {
    return {
      title: "Project not found",
    };
  }

  return {
    title: `${project.title} | Sambhav Surana`,
    description: project.summary,
  };
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const { slug } = await params;
  const project = getProjectBySlug(slug);

  if (!project) {
    notFound();
  }

  return (
    <main className="subpage-main">
      <article className="case-study">
        <header className="case-study-hero">
          <div className="case-study-intro">
            <h1>{project.title}</h1>
            <p>{project.summary}</p>
            <div className="chip-row">
              {project.tags.map((tag) => (
                <span className="chip" key={tag}>
                  {tag}
                </span>
              ))}
            </div>
            {project.githubUrl || project.liveUrl ? (
              <div className="project-proof-actions" aria-label={`${project.title} proof links`}>
                {project.githubUrl ? (
                  <a className="button button-secondary" href={project.githubUrl} target="_blank" rel="noreferrer">
                    GitHub
                    <IconBrandGithub aria-hidden="true" size={17} stroke={1.7} />
                  </a>
                ) : null}
                {project.liveUrl ? (
                  <a className="button button-secondary" href={project.liveUrl} target="_blank" rel="noreferrer">
                    Live demo
                    <IconExternalLink aria-hidden="true" size={17} stroke={1.7} />
                  </a>
                ) : null}
              </div>
            ) : null}
          </div>

          <figure className="case-study-cover-panel">
            <ProjectCoverImage className="case-study-cover" sources={project.coverImages} alt={`${project.title} cover`} priority />
          </figure>
        </header>

        <MdxContent source={project.body} />
      </article>
    </main>
  );
}
