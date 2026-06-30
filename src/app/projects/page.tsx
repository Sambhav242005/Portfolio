import type { Metadata } from "next";
import { ProjectCard } from "@/components/public/ProjectCard";
import { getProjects } from "@/lib/content/projects";

export const metadata: Metadata = {
  title: "Projects | Sambhav Surana",
  description: "Published project work by Sambhav Surana.",
};

export default async function ProjectsPage() {
  const projects = await getProjects();

  return (
    <main className="subpage-main">
      <header className="subpage-header">
        <h1>Projects</h1>
        <p>Curated project work across model training, product interfaces, and systems experiments.</p>
      </header>

      <div className="project-index-grid">
        {projects.map((project) => (
          <ProjectCard key={project.slug} project={project} className="project-card-index" />
        ))}
      </div>
    </main>
  );
}
