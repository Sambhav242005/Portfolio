import type { Metadata } from "next";
import Link from "next/link";
import { formatDate, getWriting } from "@/lib/content/writing";

export const metadata: Metadata = {
  title: "Writing | Sambhav Surana",
  description: "Published writing and research notes by Sambhav Surana.",
};

export default function WritingPage() {
  const writing = getWriting();

  return (
    <main className="subpage-main">
      <header className="subpage-header">
        <h1>Writing & Research</h1>
        <p>Published notes only. Drafts and private research stay outside the public site.</p>
      </header>

      <div className="article-index">
        {writing.map((item) => (
          <article className="article-row" key={item.slug}>
            <div>
              <span>{item.type}</span>
              <h2>
                <Link href={`/writing/${item.slug}`}>{item.title}</Link>
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
          </article>
        ))}
      </div>
    </main>
  );
}
