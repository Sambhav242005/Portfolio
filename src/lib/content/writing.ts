import "server-only";

import fs from "node:fs";
import path from "node:path";
import {
  listMarkdownFiles,
  normalizeGitHubPath,
  normalizeSourceRoot,
  parseGitHubRepo,
  parseMarkdown,
  readMarkdownFile,
  type RemoteContentSource,
} from "@/lib/content/remote-markdown";

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
};

type WritingOverride = Partial<Pick<WritingItem, "title" | "type" | "status" | "date" | "tags" | "summary">>;

type WritingSourceRecord = RemoteContentSource & {
  enabled?: boolean;
  ignoredPaths?: string[];
  label?: string;
  paths?: string[];
};

type ProjectContentConfig = RemoteContentSource & {
  caseStudyPath?: string;
};

type ProjectRecord = {
  githubUrl?: string;
  content?: ProjectContentConfig;
};

type SiteData = {
  projects?: ProjectRecord[];
  writingSources?: WritingSourceRecord[];
  writingOverrides?: Record<string, WritingOverride>;
};

type ArticleSource = RemoteContentSource & {
  paths?: string[];
  ignoredPaths: string[];
};

let writingCache: Promise<WritingItem[]> | undefined;
const defaultCaseStudyFileName = "case-study.md";

function readSiteData() {
  const filePath = path.join(process.cwd(), "data", "site.json");

  return JSON.parse(fs.readFileSync(filePath, "utf8")) as SiteData;
}

export function clearWritingCacheForTests() {
  writingCache = undefined;
}

export async function getWriting() {
  if (!shouldUseWritingCache()) {
    return readRemoteWriting();
  }

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
  const articleGroups = await Promise.all(sources.map((source) => readSourceArticles(source, overrides)));
  const articles = articleGroups.flat();
  const uniqueArticles = new Map<string, WritingItem>();

  for (const article of articles) {
    if (article.status !== "published") {
      continue;
    }

    const existing = uniqueArticles.get(article.slug);

    if (existing) {
      throw new Error(
        `Duplicate writing slug "${article.slug}" in ${existing.sourceRepo}:${existing.sourcePath} and ${article.sourceRepo}:${article.sourcePath}.`,
      );
    }

    uniqueArticles.set(article.slug, article);
  }

  return Array.from(uniqueArticles.values()).sort((a, b) => Date.parse(b.date) - Date.parse(a.date));
}

function buildArticleSources(siteData: SiteData): ArticleSource[] {
  const projectCaseStudyPaths = getProjectCaseStudyPathsByRepo(siteData.projects ?? []);

  return (siteData.writingSources ?? [])
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
        paths: source.paths?.map(normalizeGitHubPath),
        ignoredPaths: [
          `${normalizeSourceRoot(source.sourceRoot)}/${defaultCaseStudyFileName}`,
          ...(source.ignoredPaths ?? []).map(normalizeGitHubPath),
          ...(projectCaseStudyPaths.get(repo) ?? []),
        ],
      };
    });
}

function shouldUseWritingCache() {
  return process.env.NODE_ENV === "production";
}

function getProjectCaseStudyPathsByRepo(projects: ProjectRecord[]) {
  const pathsByRepo = new Map<string, string[]>();

  for (const project of projects) {
    const repo = parseGitHubRepo(project.content?.repo ?? project.githubUrl);

    if (!repo) {
      continue;
    }

    const sourceRoot = normalizeSourceRoot(project.content?.sourceRoot);
    const caseStudyPath = normalizeGitHubPath(project.content?.caseStudyPath ?? `${sourceRoot}/${defaultCaseStudyFileName}`);
    const existingPaths = pathsByRepo.get(repo) ?? [];

    if (!existingPaths.includes(caseStudyPath)) {
      pathsByRepo.set(repo, [...existingPaths, caseStudyPath]);
    }
  }

  return pathsByRepo;
}

async function readSourceArticles(source: ArticleSource, overrides?: Record<string, WritingOverride>) {
  const ignoredPaths = new Set(source.ignoredPaths.map((ignoredPath) => ignoredPath.toLowerCase()));
  const files = source.paths ?? (await listMarkdownFiles(source));
  const articlePaths = files.filter((filePath) => !ignoredPaths.has(filePath.toLowerCase()));

  return Promise.all(articlePaths.map((filePath) => readArticle(source, filePath, overrides)));
}

async function readArticle(source: ArticleSource, filePath: string, overrides?: Record<string, WritingOverride>): Promise<WritingItem> {
  const raw = await readMarkdownFile(source, filePath);
  const location = `${source.repo}:${filePath}`;
  const parsed = parseMarkdown(raw, location);
  const frontmatter = { ...parsed.frontmatter };

  // Derive slug from file path if not in frontmatter
  if (!frontmatter.slug) {
    const basename = filePath.split("/").pop() ?? filePath;
    frontmatter.slug = basename.replace(/\.md$/i, "").toLowerCase();
  }

  // Apply override into frontmatter before validation
  const slugKey = (frontmatter.slug as string)?.toLowerCase();
  const fileOverride = slugKey ? overrides?.[slugKey] : undefined;
  if (fileOverride) {
    if (fileOverride.title) frontmatter.title = fileOverride.title;
    if (fileOverride.type) frontmatter.type = fileOverride.type;
    if (fileOverride.status) frontmatter.status = fileOverride.status;
    if (fileOverride.date) frontmatter.date = fileOverride.date;
    if (fileOverride.tags) frontmatter.tags = fileOverride.tags;
    if (fileOverride.summary) frontmatter.summary = fileOverride.summary;
  }

  if (frontmatter.contentKind && frontmatter.contentKind !== "article") {
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
  };

  if (!article.body) {
    throw new Error(`${location} has no markdown body.`);
  }

  return article;
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
