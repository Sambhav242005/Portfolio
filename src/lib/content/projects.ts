import "server-only";

import fs from "node:fs";
import path from "node:path";

type ResumeProject = {
  priority: number;
  date?: string;
  title?: string;
  summary?: string;
  bullets?: string[];
  tags?: string[];
  url?: string;
};

const defaultProjectCover = "/project-assets/default-project-cover.svg";

export type Project = {
  title: string;
  slug: string;
  summary: string;
  tags: string[];
  coverImage: string;
  coverImages: string[];
  githubUrl?: string;
  liveUrl?: string;
  featured: boolean;
  status: "draft" | "published";
  order: number;
  resume?: ResumeProject;
  updatedAt: string;
  body: string;
};

type ProjectRecord = Omit<Project, "body" | "coverImages"> & {
  body: string | string[];
  coverImages?: string[];
};

type SiteData = {
  projects: ProjectRecord[];
};

function getGitHubCoverCandidates(githubUrl?: string) {
  if (!githubUrl) {
    return [];
  }

  try {
    const url = new URL(githubUrl);
    if (url.hostname !== "github.com") {
      return [];
    }

    const [owner, repo] = url.pathname.split("/").filter(Boolean);
    if (!owner || !repo) {
      return [];
    }

    const repository = `${owner}/${repo}`;

    return [
      `https://raw.githubusercontent.com/${repository}/main/docs/portfolio-cover.svg`,
      `https://raw.githubusercontent.com/${repository}/master/docs/portfolio-cover.svg`,
    ];
  } catch {
    return [];
  }
}

function uniqueImageSources(sources: Array<string | undefined>) {
  return sources.filter((source, index): source is string => Boolean(source) && sources.indexOf(source) === index);
}

function readProjectFile(): Project[] {
  const filePath = path.join(process.cwd(), "data", "site.json");
  const siteData = JSON.parse(fs.readFileSync(filePath, "utf8")) as SiteData;

  return siteData.projects.map((project) => {
    const coverImages = uniqueImageSources([
      ...getGitHubCoverCandidates(project.githubUrl),
      ...(project.coverImages ?? []),
      project.coverImage,
      defaultProjectCover,
    ]);

    return {
      ...project,
      coverImage: coverImages[0] ?? defaultProjectCover,
      coverImages,
      body: Array.isArray(project.body) ? project.body.join("\n").trim() : project.body.trim(),
    };
  });
}

export function getProjects() {
  return readProjectFile()
    .filter((project) => project.status === "published")
    .sort((a, b) => a.order - b.order);
}

export function getFeaturedProjects() {
  return getProjects().filter((project) => project.featured).slice(0, 8);
}

export function getProjectBySlug(slug: string) {
  return getProjects().find((project) => project.slug === slug);
}
