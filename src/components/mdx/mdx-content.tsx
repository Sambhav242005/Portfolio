import ReactMarkdown from "react-markdown";

export function MdxContent({ source }: { source: string }) {
  return (
    <div className="mdx-content">
      <ReactMarkdown>{source}</ReactMarkdown>
    </div>
  );
}
