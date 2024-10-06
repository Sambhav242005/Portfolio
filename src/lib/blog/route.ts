import path from "path";
import fs from "fs";
import matter, { GrayMatterFile } from "gray-matter";

// Define the path to your blog directory
const pathBlogDirectory = path.join(process.cwd(), "src/blogs");

// Define a type for the frontmatter data (including title, date, description, and author)
type PostData = {
  title: string;
  date: string;
  description: string;
  author: string;
  slug: string;
  content: string; // We will add 'content' here for the full post content
};

// Define the fields that are allowed
type PostFields = keyof PostData; // This will be a union type of 'title', 'date', 'description', 'author', and 'content'

// Function to get all post slugs
export function getPostSlugs(): string[] {
  return fs.readdirSync(pathBlogDirectory);
}

// Function to get a specific post by slug with selected fields
export function getPostBySlug(slug: string, fields: PostFields[] = []): Partial<PostData> {
  const realSlug = slug.replace(/\.md$/, "");
  const fullPath = path.join(pathBlogDirectory, `${realSlug}.md`);
  const fileContents = fs.readFileSync(fullPath, "utf8");

  // Use gray-matter to parse the post metadata (frontmatter) and content
  const { data, content } = matter(fileContents) as GrayMatterFile<string>;

  // Create a post object with the parsed data and content
  const post: Partial<PostData> = {};

  // Add the 'content' field (the actual markdown content) to the post object
  if (fields.length === 0 || fields.includes('content')) {
    post.content = content;
  }

  // Add selected fields from the frontmatter to the post object
  fields.forEach((field) => {
    if (field in data) {
      post[field] = data[field];
    }
  });

  return post;
}

// Function to get all posts with selected fields
export function getAllPosts(fields: PostFields[] = []): Partial<PostData>[] {
  const slugs = getPostSlugs();
  const posts = slugs
    .map((slug) => getPostBySlug(slug, fields))
    .sort((post1, post2) => (post1.date && post2.date && post1.date > post2.date ? -1 : 1)); // Sorting posts by date if available

  return posts;
}
