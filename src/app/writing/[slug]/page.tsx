import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { MdxContent } from "@/components/mdx/mdx-content";
import { formatDate, getWriting, getWritingBySlug } from "@/lib/content/writing";

type WritingPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export function generateStaticParams() {
  return getWriting().map((item) => ({
    slug: item.slug,
  }));
}

export async function generateMetadata({ params }: WritingPageProps): Promise<Metadata> {
  const { slug } = await params;
  const item = getWritingBySlug(slug);

  if (!item) {
    return {
      title: "Writing not found",
    };
  }

  return {
    title: `${item.title} | Sambhav Surana`,
    description: item.summary,
  };
}

export default async function WritingDetailPage({ params }: WritingPageProps) {
  const { slug } = await params;
  const item = getWritingBySlug(slug);

  if (!item) {
    notFound();
  }

  return (
    <main className="subpage-main">
      <article className="article-detail">
        <header className="subpage-header">
          <span className="article-type">{item.type}</span>
          <h1>{item.title}</h1>
          <p>{item.summary}</p>
          <time dateTime={item.date}>{formatDate(item.date)}</time>
        </header>

        <MdxContent source={item.body} />
      </article>
    </main>
  );
}
