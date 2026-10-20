import Link from "next/link";

export function WritingNotice({ unavailableCount, empty }: { unavailableCount: number; empty: boolean }) {
  if (!unavailableCount && !empty) return null;
  return (
    <div className="content-notice">
      <p>{unavailableCount
        ? empty ? "Writing is temporarily unavailable. Please try again later." : "Some articles are temporarily unavailable. The available articles are listed below."
        : "No articles published yet. Explore the projects in the meantime."}</p>
      <Link href="/projects">Explore projects</Link>
    </div>
  );
}
