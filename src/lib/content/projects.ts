import "server-only";

import fs from "node:fs";
import path from "node:path";
import {
  normalizeGitHubPath,
  normalizeSourceRoot,
  parseGitHubRepo,
  parseMarkdown,
  readMarkdownFile,
  type RemoteContentSource,
} from "@/lib/content/remote-markdown";

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
const defaultCaseStudyFileName = "case-study.md";

export type ProjectContentConfig = {
  repo?: string;
  ref?: string;
  sourceRoot?: string;
  caseStudyPath?: string;
};

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
  content?: ProjectContentConfig;
  body?: string;
};

export type ProjectWithBody = Project & {
  body: string;
};

export type ProjectContentSource = RemoteContentSource & {
  caseStudyPath: string;
};

type ProjectRecord = Omit<Project, "body" | "coverImages"> & {
  body?: string | string[];
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
      body: project.body ? normalizeProjectBody(project.body) : undefined,
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

export async function getProjectBySlugWithBody(slug: string): Promise<ProjectWithBody | undefined> {
  const project = getProjectBySlug(slug);

  if (!project) {
    return undefined;
  }

  return {
    ...project,
    body: await readProjectCaseStudy(project),
  };
}

export function getProjectContentSource(project: Project): ProjectContentSource {
  const repo = parseGitHubRepo(project.content?.repo ?? project.githubUrl);

  if (!repo) {
    throw new Error(`${project.slug} is missing a valid GitHub content source.`);
  }

  const sourceRoot = normalizeSourceRoot(project.content?.sourceRoot);
  const caseStudyPath = normalizeGitHubPath(project.content?.caseStudyPath ?? `${sourceRoot}/${defaultCaseStudyFileName}`);

  return {
    repo,
    ref: project.content?.ref,
    sourceRoot,
    caseStudyPath,
  };
}

async function readProjectCaseStudy(project: Project) {
  const source = getProjectContentSource(project);
  const location = `${source.repo}:${source.caseStudyPath}`;
  const raw = await readMarkdownFile(source, source.caseStudyPath);
  const parsed = parseMarkdown(raw, location);

  if (parsed.frontmatter.contentKind !== "case-study") {
    throw new Error(`${location} must set contentKind: case-study.`);
  }

  if (!parsed.body) {
    throw new Error(`${location} has no markdown body.`);
  }

  return parsed.body;
}

function normalizeProjectBody(body: string | string[]) {
  return Array.isArray(body) ? body.join("\n").trim() : body.trim();
}
