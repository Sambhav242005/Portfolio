import type { Metadata } from "next";
import Link from "next/link";
import { formatDate, getWritingResult } from "@/lib/content/writing";
import { WritingNotice } from "@/components/public/WritingNotice";

export const metadata: Metadata = {
  title: "Writing | Sambhav Surana",
  description: "Published writing and research notes by Sambhav Surana.",
};

export default async function WritingPage() {
  const { items: writing, unavailableCount } = await getWritingResult();

  return (
    <main className="subpage-main">
      <header className="subpage-header">
        <h1>Writing & Research</h1>
        <p>Notes on building models, local AI, and the engineering behind the projects.</p>
      </header>

      <div className="article-index">
        <WritingNotice unavailableCount={unavailableCount} empty={!writing.length} />
        {writing.map((item) => (
          <Link className="article-row" href={`/writing/${item.slug}`} key={item.slug}>
            <div>
              <span className="article-type">{item.type}</span>
              <h2>
                {item.title}
              </h2>
              <p>{item.summary}</p>
              <div className="chip-row">
                {item.tags.map((tag) => (
                  <span className="chip" key={tag}>
                    {tag}
                  </span>
                ))}
              </div>
            </div>
            <time dateTime={item.date}>{formatDate(item.date)}</time>
          </Link>
        ))}
      </div>
    </main>
  );
}
