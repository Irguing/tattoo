import React from "react";
import Image from "next/image";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

function normalizeSrc(src: unknown): string {
  const s = typeof src === "string" ? src : "";
  if (!s) return "";
  if (s.startsWith("http") || s.startsWith("/")) return s;
  return `/${s}`;
}

export default function Markdown({ content }: { content: string }) {
  return (
    <div className="space-y-4">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          h1: ({ children }) => <h1 className="text-3xl font-semibold tracking-tight">{children}</h1>,
          h2: ({ children }) => <h2 className="text-2xl font-semibold tracking-tight mt-6">{children}</h2>,
          h3: ({ children }) => <h3 className="text-xl font-semibold mt-5">{children}</h3>,
          p: ({ children }) => <p className="text-base leading-7 text-neutral-800">{children}</p>,
          a: ({ href, children }) => (
            <a href={href} className="underline underline-offset-4" rel="noreferrer">
              {children}
            </a>
          ),
          ul: ({ children }) => <ul className="list-disc pl-6 space-y-1">{children}</ul>,
          ol: ({ children }) => <ol className="list-decimal pl-6 space-y-1">{children}</ol>,
          li: ({ children }) => <li className="leading-7 text-neutral-800">{children}</li>,
          blockquote: ({ children }) => (
            <blockquote className="border-l-4 border-neutral-200 pl-4 text-neutral-700 italic">{children}</blockquote>
          ),
          code: ({ children }) => (
            <code className="rounded bg-neutral-100 px-1.5 py-0.5 font-mono text-sm">{children}</code>
          ),
          pre: ({ children }) => (
            <pre className="overflow-x-auto rounded-lg border bg-neutral-50 p-3 text-sm">{children}</pre>
          ),
          hr: () => <hr className="my-6 border-neutral-200" />,
          img: ({ src, alt }) => {
            const normalized = normalizeSrc(src);
            if (!normalized) return null;

            return (
              <span className="block">
                <span className="relative block w-full overflow-hidden rounded-lg border">
                  <span className="block pt-[56.25%]" />
                  <Image
                    src={normalized}
                    alt={alt ?? ""}
                    fill
                    sizes="(max-width: 768px) 100vw, 768px"
                    className="object-cover"
                  />
                </span>
              </span>
            );
          },
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
