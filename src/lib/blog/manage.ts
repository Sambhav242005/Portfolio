'use server';

import path from 'path';
import * as fs from 'node:fs';
import matter from 'gray-matter';
import fetch from 'node-fetch';

const localBlogDirectory = path.join(process.cwd(), 'src/blogs');
const githubRepoOwner = 'Sambhav242005';
const githubRepoName = 'Notes';
const githubBranch = 'main';

interface PostData {
  title: string;
  date: string;
  description: string;
  author: string;
  slug: string;
  content: string;
}

/* -----------------------------
   🔹 1. Ensure local directory
-------------------------------- */
async function ensureDirectoryExists() {
  try {
    await fs.promises.access(localBlogDirectory);
  } catch {
    await fs.promises.mkdir(localBlogDirectory, { recursive: true });
  }
}

/* -----------------------------
   🔹 2. Get GitHub Notes list
-------------------------------- */
/* -----------------------------
   🔹 3. Get markdown file (local or GitHub)
-------------------------------- */
export async function getPostBySlug(slug: string): Promise<PostData> {
  const decodedSlug = decodeURIComponent(slug);
  const filePath = path.join(localBlogDirectory, `${decodedSlug}.md`);

  let fileContent: string | null = null;

  // Try local file first
  if (fs.existsSync(filePath)) {
    fileContent = await fs.promises.readFile(filePath, 'utf-8');
  } else {
    // Try GitHub
    const githubURL = `https://raw.githubusercontent.com/${githubRepoOwner}/${githubRepoName}/${githubBranch}/${decodedSlug}.md`;
    const res = await fetch(githubURL);
    if (res.ok) {
      fileContent = await res.text();
    }
  }

  if (!fileContent) {
    throw new Error(`Markdown file not found for slug: ${slug}`);
  }

  const parsed = matter(fileContent);
  const data = (parsed.data || {}) as Record<string, any>;

  // Title: prefer frontmatter.title, otherwise derive from first H1 in content
  let title = data.title || '';
  if (!title) {
    const match = parsed.content.match(/^#\s+(.+)$/m);
    if (match) {
      title = match[1].trim();
      // Remove the matched H1 from the content so it doesn't render twice
      parsed.content = parsed.content.replace(match[0], '').trimStart();
    }
  }
  if (!title) title = decodedSlug;

  return {
    title,
    date: data.date ? String(data.date) : '',
    description: data.description || '',
    author: data.author || '',
    content: parsed.content.trim(),
    slug: decodedSlug,
  } as PostData;
}

/* -----------------------------
   🔹 4. Get all posts (merged local + GitHub)
-------------------------------- */
export async function getAllPosts(): Promise<
  { date: string; title: string; slug: string; description: string }[]
> {
  await ensureDirectoryExists();

  const localFiles = (await fs.promises.readdir(localBlogDirectory)).filter((f) => f.endsWith('.md'));

  const uniqueFiles = Array.from(new Set([...localFiles,]));

  const posts = await Promise.all(
    uniqueFiles.map(async (filename) => {
      const slug = filename.replace(/\.md$/, '');
      try {
        const post = await getPostBySlug(slug);
        return {
          date: post.date || '1970-01-01',
          title: post.title,
          slug: post.slug,
          description: post.description || '',
        };
      } catch {
        return null;
      }
    })
  );

  return posts
    .filter(Boolean)
    .sort((a, b) => new Date(b!.date).getTime() - new Date(a!.date).getTime()) as any;
}

/* -----------------------------
   🔹 5. Admin helper APIs (client-facing helpers)
-------------------------------- */
// Minimal implementations so admin client components can call them.
// These operate on the local `src/blogs` directory.

export async function getMarkdownFiles(): Promise<string[]> {
  await ensureDirectoryExists();
  const files = await fs.promises.readdir(localBlogDirectory);
  return files.filter((f) => f.endsWith('.md')).sort();
}

export async function getMarkdownContent(filename: string): Promise<{ success: boolean; content: string; message?: string }> {
  try {
    const slug = filename.replace(/\.md$/, '')
    const post = await getPostBySlug(slug)
    return { success: true, content: post.content }
  } catch (err: any) {
    return { success: false, content: '', message: String(err?.message || err) }
  }
}

export async function saveMarkdownFile(filenameNoExt: string, content: string): Promise<{ success: boolean; message: string }> {
  try {
    await ensureDirectoryExists()
    const filename = filenameNoExt.endsWith('.md') ? filenameNoExt : `${filenameNoExt}.md`
    const filePath = path.join(localBlogDirectory, filename)
    await fs.promises.writeFile(filePath, content, 'utf-8')
    return { success: true, message: 'File saved successfully.' }
  } catch (err: any) {
    return { success: false, message: String(err?.message || err) }
  }
}

export async function deleteMarkdownFile(filename: string): Promise<{ success: boolean; message: string }> {
  try {
    const filePath = path.join(localBlogDirectory, filename)
    await fs.promises.unlink(filePath)
    return { success: true, message: 'File deleted successfully.' }
  } catch (err: any) {
    return { success: false, message: String(err?.message || err) }
  }

}
