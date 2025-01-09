'use server'

import path from "path";
import * as fs from 'node:fs';
import matter from "gray-matter";

// Define the path to your blog directory
const pathBlogDirectory = path.join(process.cwd(), "src/blogs");

// Define a type for the frontmatter data (including title, date, description, and author)
interface PostData {
  title: string;
  date: string;
  description: string;
  author: string;
  slug: string;
  content: string;
}

// Function to get all post slugs
export async function getPostSlugs(): Promise<string[]> {
  const files = await fs.readdirSync(pathBlogDirectory);
  return files.filter((file) => file.endsWith('.md')).map((file) => file.replace(/\.md$/, ''));
}


// Function to get a single post by slug
export async function getPostBySlug(slug: string): Promise<PostData> {
  const filePath = path.join(pathBlogDirectory, `${slug}.md`);
  const fileContent = await fs.promises.readFile(filePath, 'utf-8');
  console.log(matter(fileContent));
  
  return { ...matter(fileContent).data,content:matter(fileContent).content, slug } as PostData;
} 
async function ensureDirectoryExists() {
  try {
    await fs.promises.access(pathBlogDirectory)
  } catch (error) {
    console.log(error);
    
    await fs.promises.mkdir(pathBlogDirectory, { recursive: true })
  }
}

export async function getMarkdownFiles() {
  try {
    await ensureDirectoryExists()
    const files = await fs.promises.readdir(pathBlogDirectory)
    return files.filter(file => file.endsWith('.md'))
  } catch (error) {
    console.error('Error reading markdown files:', error)
    return []
  }
}

// Function to get all posts
export async function getAllPosts(): Promise<{ date: string; title: string; slug: string; description: string }[]> {
  const postsData = await Promise.all(
    (await getPostSlugs()).map((slug) => getPostBySlug(slug))
  );

  console.log(postsData);
  

  return postsData.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .filter(post => post.slug !== undefined)
    .map(({ date, title, slug, description }) => ({ date, title, slug, description }));
}

// Function to save a markdown file
export async function saveMarkdownFile(filename: string, content: string): Promise<{ success: boolean; message: string }> {
  try {
    const filePath = path.join(pathBlogDirectory, `${filename}.md`);
    await fs.promises.writeFile(filePath, content, 'utf8');
    return { success: true, message: 'File saved successfully' };
  } catch (error) {
    console.error('Error saving markdown file:', error);
    return { success: false, message: 'Error saving file' };
  }
}



// Function to delete a markdown file
export async function deleteMarkdownFile(filename: string): Promise<{ success: boolean; message: string }> {
  try {
    const filePath = path.join(pathBlogDirectory, filename);
    await fs.promises.unlink(filePath);
    return { success: true, message: 'File deleted successfully' };
  } catch (error) {
    console.error('Error deleting markdown file:', error);
    return { success: false, message: 'Error deleting file' };
  }
}


// Function to get markdown content
export async function getMarkdownContent(filename: string): Promise<{ success: boolean; content: string }> {
  try {
    const filePath = path.join(pathBlogDirectory, filename);
    const content = await fs.promises.readFile(filePath, 'utf-8');
    return { success: true, content };
  } catch (error) {
    console.error('Error reading markdown file:', error);
    return { success: false, content: '' };
  }
}

