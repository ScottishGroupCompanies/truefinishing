import Image from "next/image";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

function safeUrl(url: string): string {
  const value = url.trim();
  if (value.startsWith("javascript:") || value.startsWith("data:")) return "";
  return value;
}

export function MarkdownBody({ source }: { source: string }) {
  const cleaned = source.replace(/<!--[\s\S]*?-->/g, "").trim();
  return (
    <div className="prose">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        urlTransform={safeUrl}
        components={{
          h1: ({ children }) => <h2>{children}</h2>,
          a: ({ href, children }) => {
            const url = href || "";
            const external = url.startsWith("http");
            return (
              <a href={url} {...(external ? { target: "_blank", rel: "noreferrer" } : {})}>
                {children}
              </a>
            );
          },
          img: ({ src, alt }) => {
            if (!src || typeof src !== "string") return null;
            if (!src.startsWith("/images/")) {
              return null;
            }
            return (
              <Image
                src={src}
                alt={alt || ""}
                width={1600}
                height={1000}
                sizes="(min-width: 768px) 720px, 100vw"
                className="h-auto w-full rounded-md"
              />
            );
          },
        }}
      >
        {cleaned}
      </ReactMarkdown>
    </div>
  );
}
