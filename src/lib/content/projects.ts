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

type ProjectRecord = Partial<Omit<Project, "body" | "coverImage" | "coverImages">> & {
  coverImage?: string;
  body?: string | string[];
  coverImages?: string[];
};

type SiteData = {
  projects: ProjectRecord[];
};

let projectsCache: Promise<Project[]> | undefined;

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

  return siteData.projects.map((project, index) => {
    const fallbackTitle = project.title ?? getRepoName(project.content?.repo ?? project.githubUrl) ?? `Project ${index + 1}`;
    const coverImages = uniqueImageSources([
      ...getGitHubCoverCandidates(project.githubUrl),
      ...(project.coverImages ?? []),
      project.coverImage,
      defaultProjectCover,
    ]);

    return {
      ...project,
      title: fallbackTitle,
      slug: project.slug ?? slugify(fallbackTitle),
      summary: project.summary ?? project.resume?.summary ?? "",
      tags: project.tags ?? project.resume?.tags ?? [],
      coverImage: coverImages[0] ?? defaultProjectCover,
      coverImages,
      featured: project.featured ?? false,
      status: project.status ?? "draft",
      order: Number(project.order ?? index + 1),
      updatedAt: project.updatedAt ?? "",
      body: project.body ? normalizeProjectBody(project.body) : undefined,
    };
  });
}

export async function getProjects() {
  if (!projectsCache) {
    projectsCache = readProjectsWithRemoteMetadata();
  }

  return projectsCache;
}

export async function getFeaturedProjects() {
  return (await getProjects()).filter((project) => project.featured).slice(0, 8);
}

export async function getProjectBySlug(slug: string) {
  return (await getProjects()).find((project) => project.slug === slug);
}

export async function getProjectBySlugWithBody(slug: string): Promise<ProjectWithBody | undefined> {
  const project = await getProjectBySlug(slug);

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

async function readProjectsWithRemoteMetadata() {
  const projects = await Promise.all(readProjectFile().map(readProjectWithRemoteMetadata));
  const publishedProjects = projects.filter((project) => project.status === "published");
  const slugs = new Map<string, string>();

  for (const project of publishedProjects) {
    const existingTitle = slugs.get(project.slug);

    if (existingTitle) {
      throw new Error(`Duplicate published project slug "${project.slug}" for "${existingTitle}" and "${project.title}".`);
    }

    slugs.set(project.slug, project.title);
  }

  return publishedProjects.sort((a, b) => a.order - b.order);
}

async function readProjectWithRemoteMetadata(project: Project): Promise<Project> {
  const source = getProjectContentSource(project);
  const location = `${source.repo}:${source.caseStudyPath}`;
  const raw = await readMarkdownFile(source, source.caseStudyPath);
  const parsed = parseMarkdown(raw, location);

  assertCaseStudy(parsed.frontmatter, location);

  return applyCaseStudyFrontmatter(project, parsed.frontmatter, location);
}

async function readProjectCaseStudy(project: Project) {
  const source = getProjectContentSource(project);
  const location = `${source.repo}:${source.caseStudyPath}`;
  const raw = await readMarkdownFile(source, source.caseStudyPath);
  const parsed = parseMarkdown(raw, location);

  assertCaseStudy(parsed.frontmatter, location);

  if (!parsed.body) {
    throw new Error(`${location} has no markdown body.`);
  }

  return parsed.body;
}

function applyCaseStudyFrontmatter(project: Project, frontmatter: Record<string, unknown>, location: string): Project {
  const mergedProject = {
    ...project,
    title: optionalString(frontmatter, "title", location) ?? project.title,
    slug: optionalString(frontmatter, "slug", location) ?? project.slug,
    summary: optionalString(frontmatter, "summary", location) ?? project.summary,
    status: optionalStatus(frontmatter, location) ?? project.status,
    order: optionalNumber(frontmatter, "order", location) ?? project.order,
    featured: optionalBoolean(frontmatter, "featured", location) ?? project.featured,
    tags: optionalStringArray(frontmatter, "tags", location) ?? project.tags,
    updatedAt: optionalString(frontmatter, "updatedAt", location) ?? project.updatedAt,
  };

  validateProjectMetadata(mergedProject, location);

  return mergedProject;
}

function assertCaseStudy(frontmatter: Record<string, unknown>, location: string) {
  if (frontmatter.contentKind !== "case-study") {
    throw new Error(`${location} must set contentKind: case-study.`);
  }
}

function optionalString(frontmatter: Record<string, unknown>, key: string, location: string) {
  const value = frontmatter[key];

  if (value === undefined) {
    return undefined;
  }

  if (typeof value !== "string" || !value.trim()) {
    throw new Error(`${location} must set ${key} as a non-empty string.`);
  }

  return value.trim();
}

function optionalStringArray(frontmatter: Record<string, unknown>, key: string, location: string) {
  const value = frontmatter[key];

  if (value === undefined) {
    return undefined;
  }

  if (!Array.isArray(value) || value.length === 0 || !value.every((item) => typeof item === "string" && item.trim())) {
    throw new Error(`${location} must set ${key} as a non-empty string array.`);
  }

  return value.map((item) => item.trim());
}

function optionalStatus(frontmatter: Record<string, unknown>, location: string): Project["status"] | undefined {
  const status = frontmatter.status;

  if (status === undefined) {
    return undefined;
  }

  if (status !== "draft" && status !== "published") {
    throw new Error(`${location} must set status to draft or published.`);
  }

  return status;
}

function optionalNumber(frontmatter: Record<string, unknown>, key: string, location: string) {
  const value = frontmatter[key];

  if (value === undefined) {
    return undefined;
  }

  const numberValue = typeof value === "number" ? value : Number(value);

  if (!Number.isFinite(numberValue)) {
    throw new Error(`${location} must set ${key} as a finite number.`);
  }

  return numberValue;
}

function optionalBoolean(frontmatter: Record<string, unknown>, key: string, location: string) {
  const value = frontmatter[key];

  if (value === undefined) {
    return undefined;
  }

  if (typeof value === "boolean") {
    return value;
  }

  if (value === "true") {
    return true;
  }

  if (value === "false") {
    return false;
  }

  throw new Error(`${location} must set ${key} as true or false.`);
}

function validateProjectMetadata(project: Project, location: string) {
  if (project.status === "draft") {
    return;
  }

  if (!project.title.trim()) {
    throw new Error(`${location} must provide title for a published project.`);
  }

  if (!project.slug.trim()) {
    throw new Error(`${location} must provide slug for a published project.`);
  }

  if (!project.summary.trim()) {
    throw new Error(`${location} must provide summary for a published project.`);
  }

  if (!project.tags.length) {
    throw new Error(`${location} must provide tags for a published project.`);
  }
}

function getRepoName(value?: string) {
  const repo = parseGitHubRepo(value);

  if (!repo) {
    return undefined;
  }

  const parts = repo.split("/");

  return parts[parts.length - 1];
}

function slugify(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function normalizeProjectBody(body: string | string[]) {
  return Array.isArray(body) ? body.join("\n").trim() : body.trim();
}
