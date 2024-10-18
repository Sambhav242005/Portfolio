import {  getPostBySlug } from '@/lib/blog/manage'
import ReactMarkdown from 'react-markdown'
import remarkGFM from "remark-gfm";


export default async function BlogPost({ params }: { params: { slug: string } }) {
  const post = await getPostBySlug(params.slug)
  console.log(post);
  
  return (
    <div className="container mx-auto px-4 py-12 lg:px-8">
      {/* Post Title */}
      <h1 className="text-4xl font-extrabold leading-tight tracking-wide text-gray-900 mb-6">
        {post.title}
      </h1>

      {/* Post Metadata */}
      <div className="mb-8 text-gray-500 flex flex-col lg:flex-row lg:items-center">
        <p className="text-sm lg:text-base lg:mr-4">
          <span className="font-semibold">Published on: </span>
          {(post.date) ? new Date(post.date).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          }) : 'No date' }
        </p>
        <p className="text-sm lg:text-base">
          <span className="font-semibold">By: </span>
          {post.author}
        </p>
      </div>

      {/* Post Content */}
      <div className="prose prose-lg max-w-none text-gray-800 leading-relaxed">
        <ReactMarkdown remarkPlugins={[remarkGFM]}>{post.content}</ReactMarkdown>
      </div>
    </div>
  );
}