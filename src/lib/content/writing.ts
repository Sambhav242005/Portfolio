import "server-only";

import fs from "node:fs";
import path from "node:path";
import { getProjectContentSource, getProjects, type Project } from "@/lib/content/projects";
import { listMarkdownFiles, parseGitHubRepo, parseMarkdown, readMarkdownFile, type RemoteContentSource } from "@/lib/content/remote-markdown";

export type WritingItem = {
  title: string;
  slug: string;
  type: string;
  status: "draft" | "published";
  date: string;
  tags: string[];
  summary: string;
  body: string;
  sourceRepo?: string;
  sourcePath?: string;
  projectSlug?: string;
};

type WritingOverride = Partial<Pick<WritingItem, "title" | "type" | "status" | "date" | "tags" | "summary">>;

type WritingSourceRecord = RemoteContentSource & {
  enabled?: boolean;
  label?: string;
};

type SiteData = {
  writingSources?: WritingSourceRecord[];
  writingOverrides?: Record<string, WritingOverride>;
};

type ArticleSource = RemoteContentSource & {
  projectSlug?: string;
  ignoredPaths: string[];
};

let writingCache: Promise<WritingItem[]> | undefined;

function readSiteData() {
  const filePath = path.join(process.cwd(), "data", "site.json");

  return JSON.parse(fs.readFileSync(filePath, "utf8")) as SiteData;
}

export function clearWritingCacheForTests() {
  writingCache = undefined;
}

export async function getWriting() {
  if (!writingCache) {
    writingCache = readRemoteWriting();
  }

  return writingCache;
}

export async function getWritingBySlug(slug: string) {
  return (await getWriting()).find((item) => item.slug === slug);
}

export function formatDate(value: string) {
  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(`${value}T00:00:00`));
}

async function readRemoteWriting() {
  const siteData = readSiteData();
  const overrides = siteData.writingOverrides ?? {};
  const sources = buildArticleSources(siteData);
  const articleGroups = await Promise.all(sources.map(readSourceArticles));
  const articles = articleGroups.flat();
  const uniqueArticles = new Map<string, WritingItem>();

  for (const article of articles) {
    const override = overrides[article.slug];
    const overriddenArticle = override ? applyWritingOverride(article, override) : article;

    if (overriddenArticle.status !== "published") {
      continue;
    }

    const existing = uniqueArticles.get(overriddenArticle.slug);

    if (existing) {
      throw new Error(
        `Duplicate writing slug "${overriddenArticle.slug}" in ${existing.sourceRepo}:${existing.sourcePath} and ${overriddenArticle.sourceRepo}:${overriddenArticle.sourcePath}.`,
      );
    }

    uniqueArticles.set(overriddenArticle.slug, overriddenArticle);
  }

  return Array.from(uniqueArticles.values()).sort((a, b) => Date.parse(b.date) - Date.parse(a.date));
}

function buildArticleSources(siteData: SiteData): ArticleSource[] {
  const projectSources = getProjects().map((project) => articleSourceFromProject(project));
  const writingSources = (siteData.writingSources ?? [])
    .filter((source) => source.enabled !== false)
    .map((source) => {
      const repo = parseGitHubRepo(source.repo);

      if (!repo) {
        throw new Error(`Invalid writing source repository: ${source.repo}`);
      }

      return {
        repo,
        ref: source.ref,
        sourceRoot: source.sourceRoot,
        ignoredPaths: [],
      };
    });

  return [...projectSources, ...writingSources];
}

function articleSourceFromProject(project: Project): ArticleSource {
  const source = getProjectContentSource(project);

  return {
    repo: source.repo,
    ref: source.ref,
    sourceRoot: source.sourceRoot,
    projectSlug: project.slug,
    ignoredPaths: [source.caseStudyPath],
  };
}

async function readSourceArticles(source: ArticleSource) {
  const files = await listMarkdownFiles(source);
  const ignoredPaths = new Set(source.ignoredPaths.map((ignoredPath) => ignoredPath.toLowerCase()));
  const articlePaths = files.filter((filePath) => !ignoredPaths.has(filePath.toLowerCase()));

  return Promise.all(articlePaths.map((filePath) => readArticle(source, filePath)));
}

async function readArticle(source: ArticleSource, filePath: string): Promise<WritingItem> {
  const raw = await readMarkdownFile(source, filePath);
  const location = `${source.repo}:${filePath}`;
  const parsed = parseMarkdown(raw, location);
  const { frontmatter } = parsed;

  if (frontmatter.contentKind !== "article") {
    throw new Error(`${location} must set contentKind: article.`);
  }

  const article = {
    title: requiredString(frontmatter, "title", location),
    slug: requiredString(frontmatter, "slug", location),
    type: requiredString(frontmatter, "type", location),
    status: requiredStatus(frontmatter, location),
    date: requiredString(frontmatter, "date", location),
    tags: requiredStringArray(frontmatter, "tags", location),
    summary: requiredString(frontmatter, "summary", location),
    body: parsed.body,
    sourceRepo: source.repo,
    sourcePath: filePath,
    projectSlug: source.projectSlug,
  };

  if (!article.body) {
    throw new Error(`${location} has no markdown body.`);
  }

  return article;
}

function applyWritingOverride(article: WritingItem, override: WritingOverride): WritingItem {
  return {
    ...article,
    ...override,
    tags: override.tags ?? article.tags,
  };
}

function requiredString(frontmatter: Record<string, unknown>, key: string, location: string) {
  const value = frontmatter[key];

  if (typeof value !== "string" || !value.trim()) {
    throw new Error(`${location} must set a non-empty ${key} frontmatter field.`);
  }

  return value.trim();
}

function requiredStringArray(frontmatter: Record<string, unknown>, key: string, location: string) {
  const value = frontmatter[key];

  if (!Array.isArray(value) || value.length === 0 || !value.every((item) => typeof item === "string" && item.trim())) {
    throw new Error(`${location} must set ${key} as a non-empty string array.`);
  }

  return value.map((item) => item.trim());
}

function requiredStatus(frontmatter: Record<string, unknown>, location: string): WritingItem["status"] {
  const status = frontmatter.status;

  if (status !== "draft" && status !== "published") {
    throw new Error(`${location} must set status to draft or published.`);
  }

  return status;
}
