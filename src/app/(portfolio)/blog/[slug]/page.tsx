import { getPostBySlug } from "@/lib/blog/manage";

interface PageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default async function BlogPost({
  params,
}: PageProps) {
  const post = await getPostBySlug( (await params).slug);

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
          {post.date
            ? new Date(post.date).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })
            : "No date"}
        </p>
        <p className="text-sm lg:text-base">
          <span className="font-semibold">By: </span>
          {post.author}
        </p>
      </div>

      {/* Post Content */}
      <div className="prose prose-lg max-w-none text-gray-800 leading-relaxed">
        <article className="prose lg:prose-xl mx-auto px-4">
          <h1>{post.title}</h1>
          {post.date && (
            <p className="text-gray-600">
              {new Date(post.date).toLocaleDateString()}
            </p>
          )}
          <div dangerouslySetInnerHTML={{ __html: post.content }} />
        </article>
      </div>
    </div>
  );
}
