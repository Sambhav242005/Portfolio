import path from "path";
import fs from "fs";
import matter from 'gray-matter';

const pathBlogDirectory = path.join(
  process.cwd(),
  "src/blogs"
);

export function getPostSlugs() {
  return fs.readdirSync(pathBlogDirectory);
}
export function getPostBySlug(slug: string, fields: string[] = []) {
    const realSlug = slug.replace(/\.md$/, '')
    const fullPath = path.join(pathBlogDirectory, `${realSlug}.md`)
    const fileContents = fs.readFileSync(fullPath, 'utf8')
    const { data, content } = matter(fileContents)
  
    type Items = {
      [key: string]: string
    }
  
    const items: Items = {}
  
    fields.forEach((field) => {
      if (field === 'slug') {
        items[field] = realSlug
      }
      if (field === 'content') {
        items[field] = content
      }
      if (data[field]) {
        items[field] = data[field]
      }
    })
  
    return items
  }

  export function getAllPosts(fields: string[] = []) {
    const slugs = getPostSlugs();
    const posts = slugs
        .map((slug) => getPostBySlug(slug, fields))
        .sort((post1, post2) => (post1.data > post2.data ? -1 : 1));
    return posts;
}
