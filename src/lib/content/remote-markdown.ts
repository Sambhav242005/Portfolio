import "server-only";

const defaultSourceRoot = "docs/writing";
const defaultRef = "main";
const githubApiBaseUrl = "https://api.github.com";
const githubRawBaseUrl = "https://raw.githubusercontent.com";
const userAgent = "sambhav-portfolio-content-loader";

type GitHubTree = {
  tree?: Array<{
    path?: string;
    type?: string;
  }>;
};

export type RemoteContentSource = {
  repo: string;
  ref?: string;
  sourceRoot?: string;
};

export type ParsedMarkdown = {
  frontmatter: Record<string, unknown>;
  body: string;
};

const treeCache = new Map<string, Promise<string[]>>();
const markdownCache = new Map<string, Promise<string>>();

export function parseGitHubRepo(value?: string) {
  if (!value) {
    return undefined;
  }

  const trimmed = value.trim().replace(/\.git$/, "");

  if (/^[\w.-]+\/[\w.-]+$/.test(trimmed)) {
    return trimmed;
  }

  try {
    const url = new URL(trimmed);

    if (url.hostname !== "github.com") {
      return undefined;
    }

    const [owner, repo] = url.pathname.replace(/\.git$/, "").split("/").filter(Boolean);

    if (!owner || !repo) {
      return undefined;
    }

    return `${owner}/${repo}`;
  } catch {
    return undefined;
  }
}

export function normalizeSourceRoot(value?: string) {
  return normalizeGitHubPath(value ?? defaultSourceRoot);
}

export function normalizeGitHubPath(value: string) {
  return value.replace(/\\/g, "/").replace(/^\/+|\/+$/g, "");
}

export async function listMarkdownFiles(source: RemoteContentSource) {
  const repo = assertRepo(source.repo);
  const sourceRoot = normalizeSourceRoot(source.sourceRoot);
  const ref = await resolveRef(source);
  const cacheKey = `${repo}@${ref}:${sourceRoot}`;

  if (!shouldUseContentCache()) {
    return fetchMarkdownTree(repo, ref, sourceRoot);
  }

  if (!treeCache.has(cacheKey)) {
    treeCache.set(cacheKey, fetchMarkdownTree(repo, ref, sourceRoot));
  }

  return treeCache.get(cacheKey)!;
}

export async function readMarkdownFile(source: RemoteContentSource, filePath: string) {
  const repo = assertRepo(source.repo);
  const normalizedPath = normalizeGitHubPath(filePath);
  const ref = await resolveRef(source);
  const cacheKey = `${repo}@${ref}:${normalizedPath}`;

  if (!shouldUseContentCache()) {
    return fetchMarkdown(repo, ref, normalizedPath);
  }

  if (!markdownCache.has(cacheKey)) {
    markdownCache.set(cacheKey, fetchMarkdown(repo, ref, normalizedPath));
  }

  return markdownCache.get(cacheKey)!;
}

export function parseMarkdown(raw: string, location: string): ParsedMarkdown {
  const normalized = raw.replace(/^\uFEFF/, "").replace(/\r\n/g, "\n");

  if (!normalized.startsWith("---\n")) {
    throw new Error(`${location} is missing required frontmatter.`);
  }

  const endIndex = normalized.indexOf("\n---", 4);

  if (endIndex === -1) {
    throw new Error(`${location} has unterminated frontmatter.`);
  }

  const closingLineEnd = normalized.indexOf("\n", endIndex + 4);
  const frontmatterBlock = normalized.slice(4, endIndex).trim();
  const bodyStart = closingLineEnd === -1 ? normalized.length : closingLineEnd + 1;
  const body = normalized.slice(bodyStart).trim();

  return {
    frontmatter: parseFrontmatterBlock(frontmatterBlock, location),
    body,
  };
}

async function resolveRef(source: RemoteContentSource) {
  return source.ref?.trim() || defaultRef;
}

async function fetchMarkdownTree(repo: string, ref: string, sourceRoot: string) {
  const url = `${githubApiBaseUrl}/repos/${repo}/git/trees/${encodeURIComponent(ref)}?recursive=1`;
  const tree = await fetchGitHubJson<GitHubTree>(url, `${repo}@${ref} tree`);
  const prefix = `${sourceRoot}/`;

  return (tree.tree ?? [])
    .map((entry) => entry.path)
    .filter((entryPath): entryPath is string => Boolean(entryPath))
    .filter((entryPath) => entryPath.startsWith(prefix) && entryPath.toLowerCase().endsWith(".md"))
    .sort((a, b) => a.localeCompare(b));
}

async function fetchMarkdown(repo: string, ref: string, filePath: string) {
  const encodedPath = filePath.split("/").map(encodeURIComponent).join("/");
  const url = `${githubRawBaseUrl}/${repo}/${encodeURIComponent(ref)}/${encodedPath}`;
  const response = await fetch(url, {
    headers: getGitHubHeaders(),
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch ${repo}@${ref}:${filePath} (${response.status} ${response.statusText}).`);
  }

  return response.text();
}

async function fetchGitHubJson<T>(url: string, label: string): Promise<T> {
  const response = await fetch(url, {
    headers: getGitHubHeaders("application/vnd.github+json"),
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch ${label} (${response.status} ${response.statusText}).`);
  }

  return response.json() as Promise<T>;
}

function getGitHubHeaders(accept?: string) {
  const token = process.env.GITHUB_TOKEN ?? process.env.GH_TOKEN;

  return {
    ...(accept ? { Accept: accept } : {}),
    "User-Agent": userAgent,
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

function shouldUseContentCache() {
  return process.env.NODE_ENV === "production";
}

function parseFrontmatterBlock(block: string, location: string) {
  const result: Record<string, unknown> = {};
  const lines = block.split("\n");

  for (let index = 0; index < lines.length; index += 1) {
    const line = lines[index];

    if (!line.trim() || line.trimStart().startsWith("#")) {
      continue;
    }

    const match = /^([A-Za-z0-9_-]+):(?:\s*(.*))?$/.exec(line);

    if (!match) {
      throw new Error(`${location} has invalid frontmatter line: ${line}`);
    }

    const [, key, rawValue = ""] = match;

    if (!rawValue.trim()) {
      const values: string[] = [];

      while (index + 1 < lines.length) {
        const next = lines[index + 1];
        const itemMatch = /^\s*-\s+(.+)$/.exec(next);

        if (!itemMatch) {
          break;
        }

        values.push(parseScalar(itemMatch[1]));
        index += 1;
      }

      result[key] = values;
      continue;
    }

    result[key] = parseValue(rawValue);
  }

  return result;
}

function parseValue(rawValue: string) {
  const trimmed = rawValue.trim();

  if (trimmed.startsWith("[") && trimmed.endsWith("]")) {
    return trimmed
      .slice(1, -1)
      .split(",")
      .map((item) => parseScalar(item))
      .filter(Boolean);
  }

  return parseScalar(trimmed);
}

function parseScalar(value: string) {
  const trimmed = value.trim();

  if ((trimmed.startsWith('"') && trimmed.endsWith('"')) || (trimmed.startsWith("'") && trimmed.endsWith("'"))) {
    return trimmed.slice(1, -1);
  }

  return trimmed;
}

function assertRepo(repo: string) {
  const normalized = parseGitHubRepo(repo);

  if (!normalized) {
    throw new Error(`Invalid GitHub repository source: ${repo}`);
  }

  return normalized;
}
