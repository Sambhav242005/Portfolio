import { getPostBySlug } from "@/lib/blog/manage"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
import remarkMath from "remark-math"
import rehypeKatex from "rehype-katex"
import rehypeHighlight from "rehype-highlight"
import rehypeRaw from "rehype-raw"
import { cn } from "@/lib/utils"
import Link from "next/link"
import React from "react"
import "katex/dist/katex.min.css"

// Preprocess content to handle custom highlight syntax
const preprocessContent = (content: string) => {
  if (!content) return content
  return content.replace(/==([^=]+)==/g, '<mark class="highlight">$1</mark>')
}

// Process math delimiters
const processMathDelimiters = (content: string) => {
  if (!content) return content
  let processed = content.replace(/\\\(/g, '$').replace(/\\\)/g, '$')
  processed = processed.replace(/\\\[/g, '$$').replace(/\\\]/g, '$$')
  return processed
}

// Callout configuration
const CALLOUT_TYPES = {
  NOTE: {
    icon: "📝",
    className: "border-blue-500 bg-blue-50 dark:border-blue-400 dark:bg-blue-950/50 text-blue-900 dark:text-blue-200",
  },
  TIP: {
    icon: "💡",
    className: "border-emerald-500 bg-emerald-50 dark:border-emerald-400 dark:bg-emerald-950/50 text-emerald-900 dark:text-emerald-200",
  },
  WARNING: {
    icon: "⚠️",
    className: "border-amber-500 bg-amber-50 dark:border-amber-400 dark:bg-amber-950/50 text-amber-900 dark:text-amber-200",
  },
  INFO: {
    icon: "ℹ️",
    className: "border-sky-500 bg-sky-50 dark:border-sky-400 dark:bg-sky-950/50 text-sky-900 dark:text-sky-200",
  },
  EXAMPLE: {
    icon: "🔍",
    className: "border-violet-500 bg-violet-50 dark:border-violet-400 dark:bg-violet-950/50 text-violet-900 dark:text-violet-200",
  },
  QUOTE: {
    icon: "❝",
    className: "border-gray-500 bg-gray-50 dark:border-gray-400 dark:bg-gray-950/50 text-gray-900 dark:text-gray-200",
  },
  ABSTRACT: {
    icon: "📋",
    className: "border-rose-500 bg-rose-50 dark:border-rose-400 dark:bg-rose-950/50 text-rose-900 dark:text-rose-200",
  },
}

// NEW HELPER: Strips the callout marker from React nodes
const stripCalloutMarker = (children: React.ReactNode): React.ReactNode => {
  const arr = React.Children.toArray(children);
  if (arr.length === 0) return children;

  const firstChild = arr[0];

  // Check if first child is a <p> tag
  if (React.isValidElement(firstChild) && firstChild.type === 'p') {
    const pChildren = React.Children.toArray(firstChild.props.children);
    if (pChildren.length === 0) return children;

    const firstPChild = pChildren[0];

    // Check if the first node inside <p> is a text node
    if (typeof firstPChild === 'string') {
      // Check if it starts with the marker (and optional newline)
      const match = firstPChild.match(/^\[!(\w+)\]\s*(\r\n|\r|\n)?/i);
      if (match) {
        // Create a new text node without the marker
        const modifiedText = firstPChild.substring(match[0].length);
        
        // Rebuild the <p> tag's children
        const modifiedPChildren = [modifiedText, ...pChildren.slice(1)];
        
        // Clone the <p> tag
        const modifiedP = React.cloneElement(firstChild, firstChild.props, modifiedPChildren);
        
        // Rebuild the component's children
        return [modifiedP, ...arr.slice(1)];
      }
    }
  }
  // If no match or structure is different, return original children
  return children;
}

// Callout block component
const CalloutBlock = ({ children, type }: { children: React.ReactNode; type: string }) => {
  // Ensure the lookup key is typed as a key of CALLOUT_TYPES to satisfy TypeScript
  const key = (type || "NOTE").toUpperCase() as keyof typeof CALLOUT_TYPES
  const config = CALLOUT_TYPES[key] || CALLOUT_TYPES.NOTE
  const title = key.charAt(0).toUpperCase() + key.slice(1).toLowerCase()

  return (
    <div
      role="region"
      aria-label={`${title} callout`}
      className={`border-l-4 p-5 my-6 rounded-lg shadow-sm ${config.className} dark:shadow-black/30`}
    >
      <div className="flex items-center gap-4 mb-3">
        <span className="text-3xl leading-none">{config.icon}</span>
        <span className="font-semibold text-2xl tracking-tight">{title}</span>
      </div>
      <div className="mt-2 text-lg leading-relaxed text-gray-800 dark:text-gray-100">
        {children}
      </div>
    </div>
  )
}

// Helper to extract text content for callout detection
const getTextContent = (node: any): string => {
  if (node == null) return ""
  if (typeof node === "string") return node
  if (typeof node === "number") return String(node)
  if (React.isValidElement(node) && (node as any).props && (node as any).props.children) {
    return React.Children.toArray((node as any).props.children).map(getTextContent).join("")
  }
  if (Array.isArray(node)) return node.map(getTextContent).join("")
  return ""
}

// Helper to extract markdown content preserving structure (preserve paragraphs, lists, code fences)
const getMarkdownContent = (node: any): string => {
  if (node == null) return ""
  if (typeof node === "string") return node
  if (typeof node === "number") return String(node)

  // If it's a React element, try to preserve block boundaries
  if (React.isValidElement(node)) {
    const element: any = node
    const props = element.props || {}
    const type = element.type

    // If element itself has a language class (rare), treat as code block
    if (props.className && String(props.className).includes("language-")) {
      const lang = String(props.className).replace("language-", "")
      const code = React.Children.toArray(props.children).map(getMarkdownContent).join("")
      return `\n\n\`\`\`${lang}\n${code}\n\`\`\`\n\n`
    }

    // <pre><code class="language-...">...</code></pre>
    if (type === 'pre') {
      const first = React.Children.toArray(props.children)[0]
      if (first && (first as any).props && (first as any).props.className && String((first as any).props.className).includes("language-")) {
        const lang = String((first as any).props.className).replace("language-", "")
        const code = React.Children.toArray((first as any).props.children).map(getMarkdownContent).join("")
        return `\n\n\`\`\`${lang}\n${code}\n\`\`\`\n\n`
      }
    }

    // List item - prefix with dash and keep newline
    if (type === 'li') {
      const content = React.Children.toArray(props.children).map(getMarkdownContent).join("")
      return `- ${content}\n`
    }

    // Unordered/ordered list containers - join children and separate by newline
    if (type === 'ul' || type === 'ol') {
      const content = React.Children.toArray(props.children).map(getMarkdownContent).join("")
      return `${content}\n`
    }

    // Paragraphs, blockquotes, headings and other block elements: preserve with blank line separator
    const blockTags = new Set(['p', 'div', 'section', 'article', 'blockquote', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6'])
    if (typeof type === 'string' && blockTags.has(type)) {
      const content = React.Children.toArray(props.children).map(getMarkdownContent).join("")
      return `${content}\n\n`
    }

    // Default: inline or unknown component - join without extra whitespace
    return React.Children.toArray(props.children).map(getMarkdownContent).join("")
  }

  if (Array.isArray(node)) return node.map(getMarkdownContent).join("")
  return ""
}

// Process callout content
const processCalloutContent = (children: React.ReactNode) => {
  const arr = React.Children.toArray(children)
  const firstChild = arr[0]
  
  // Get text content for pattern matching
  let firstChildText = ""
  if (typeof firstChild === 'string') {
    firstChildText = firstChild
  } else if (React.isValidElement(firstChild) && firstChild.props && firstChild.props.children) {
    firstChildText = getTextContent(firstChild)
  }

  const lines = firstChildText.split('\n')
  const firstLine = lines[0] || ""
  const match = firstLine.match(/^\[!(\w+)\]/i)

  if (!match) return null

  const type = match[1].toUpperCase()
  
  // Extract full markdown content preserving math and structure
  const fullMarkdown = getMarkdownContent(children)
  
  // Remove the callout marker (robust: allow leading whitespace/newline, multiline)
  const content = fullMarkdown.replace(/^\s*\[!\w+\]\s*/m, '')

  return { type, content }
}

export default async function BlogPost({ params }: { params: { slug: string } }) {
  // `params` may be a Promise in App Router; await it before accessing properties
  const awaitedParams = (await params) as { slug: string }
  const post = await getPostBySlug(awaitedParams.slug)
  
  // Apply preprocessing
  const processedContent = preprocessContent(processMathDelimiters(post?.content || ""))

  return (
    <>
      <div className="container mx-auto px-4 py-8 lg:px-8">
        <Link href="/blog" className="text-primary hover:underline mb-8 inline-block">
          ← Back to Posts
        </Link>
      </div>

  <div className="container mx-auto px-4 py-12 lg:px-8 text-foreground">
        <h1 className="text-4xl md:text-5xl font-extrabold leading-tight tracking-wide mb-4">
          {post?.title}
        </h1>

  <div className="mb-8 text-muted-foreground flex flex-col lg:flex-row lg:items-center">
          <p className="text-sm lg:text-base lg:mr-4">
            <span className="font-semibold">Published:</span>{' '}
            {post?.date
              ? new Date(post.date).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })
              : "No date"}
          </p>
          {post?.author && (
            <p className="text-sm lg:text-base">
              <span className="font-semibold">Author:</span> {post.author}
            </p>
          )}
        </div>

        <article
          className={cn(
            "prose prose-lg dark:prose-invert max-w-none",
            "prose-code:before:content-none prose-code:after:content-none",
            "prose-headings:font-semibold prose-headings:text-primary",
            "prose-blockquote:border-l-4 prose-blockquote:pl-4 prose-blockquote:italic",
            "prose-img:rounded-lg prose-img:shadow-md",
            "prose-table:table-auto prose-th:border prose-th:border-border prose-th:px-4 prose-th:py-2 prose-th:bg-muted prose-td:border prose-td:border-border prose-td:px-4 prose-td:py-2",
            "prose-math:text-lg prose-math:font-normal",
            "prose-mark:px-[2px] prose-mark:rounded-sm",
            "[&_.katex-display]:my-4 [&_.katex]:font-normal"
          )}
        >
          <ReactMarkdown
            remarkPlugins={[remarkGfm, remarkMath]}
            rehypePlugins={[rehypeKatex, rehypeHighlight, rehypeRaw]}
            components={{
              code({ node, inline, className, children, ...props }: any) {
                const match = /language-(\w+)/.exec(className || "")
                return !inline && match ? (
                  <pre className="bg-card dark:bg-card/95 text-foreground p-4 rounded-lg overflow-x-auto">
                    <code className={className} {...props}>
                      {children}
                    </code>
                  </pre>
                ) : (
                  <code className="bg-muted dark:bg-card px-2 py-1 rounded text-sm font-mono" {...props}>
                    {children}
                  </code>
                )
              },

              blockquote({ children, ...props }: any) {
                    // Use getTextContent *only* for detection
                    const firstChildText = getTextContent(React.Children.toArray(children)[0]);
                    const firstLine = (firstChildText || "").split('\n')[0] || "";
                    const match = firstLine.match(/^\[!(\w+)\]/i);
                    
                    if (match) {
                      const type = match[1].toUpperCase();
                      
                      // NEW: Don't re-render. Just strip the marker.
                      const modifiedChildren = stripCalloutMarker(children);
                      
                      return (
                        <CalloutBlock type={type}>
                          {/* Render the original, processed nodes */}
                          {modifiedChildren}
                        </CalloutBlock>
                      )
                    }

                    return (
                      <blockquote className="border-l-4 border-gray-300 pl-4 italic" {...props}>
                        {children}
                      </blockquote>
                    )
                  },

                  // --- MODIFIED p COMPONENT ---
                  p({ children, ...props }: any) {
                    // Use getTextContent *only* for detection
                    const firstChildText = getTextContent(React.Children.toArray(children)[0]);
                    const firstLine = (firstChildText || "").split('\n')[0] || "";
                    const match = firstLine.match(/^\[!(\w+)\]/i);
                    
                    if (match) {
                      const type = match[1].toUpperCase();
                      
                      // NEW: Don't re-render. Just strip the marker.
                      const modifiedChildren = stripCalloutMarker(children);
                      
                      return (
                        <CalloutBlock type={type}>
                          {/* Render the original, processed nodes */}
                          {modifiedChildren}
                        </CalloutBlock>
                      )
                    }

                    return <p {...props}>{children}</p>
                  },

              table({ children, ...props }: any) {
                return (
                  <div className="overflow-x-auto my-6">
                    <table className="min-w-full divide-y divide-border" {...props}>
                      {children}
                    </table>
                  </div>
                )
              },

              th({ children, ...props }: any) {
                return (
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider" {...props}>
                    {children}
                  </th>
                )
              },

              td({ children, ...props }: any) {
                return (
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-foreground" {...props}>
                    {children}
                  </td>
                )
              },

              mark({ className, children, ...props }: any) {
                // Keep the incoming className (e.g. 'highlight') but remove inline color classes.
                // The actual highlight colors are controlled by `src/app/theme.css` using CSS vars.
                if (className && className.includes("highlight")) {
                  return (
                    <mark className={`highlight`} {...props}>
                      {children}
                    </mark>
                  )
                }

                return <mark {...props}>{children}</mark>
              },
            }}
          >
            {processedContent}
          </ReactMarkdown>
        </article>
      </div>
    </>
  )
}