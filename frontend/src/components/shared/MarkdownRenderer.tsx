"use client";

import { useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Copy, Check } from "lucide-react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";

function CodeBlock({ language, value }: { language: string; value: string }) {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(value);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="my-6 overflow-hidden rounded-xl border border-border-default shadow-xl">
      <div className="flex items-center justify-between px-4 py-2 bg-bg-secondary border-b border-border-default">
        <div className="flex items-center gap-2">
          <div className="flex gap-1.5">
            <div className="w-3 h-3 rounded-full bg-red-500/80" />
            <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
            <div className="w-3 h-3 rounded-full bg-green-500/80" />
          </div>
          <span className="ml-2 text-xs font-mono font-medium text-text-secondary uppercase tracking-widest">
            {language || "text"}
          </span>
        </div>
        <button
          onClick={copyToClipboard}
          className="flex items-center gap-1.5 px-2 py-1 rounded text-xs font-medium text-text-secondary hover:text-text-primary hover:bg-bg-surface transition-colors"
        >
          {copied ? <Check className="w-3.5 h-3.5 text-brand-teal" /> : <Copy className="w-3.5 h-3.5" />}
          {copied ? <span className="text-brand-teal">Copied!</span> : <span>Copy</span>}
        </button>
      </div>
      <SyntaxHighlighter
        style={vscDarkPlus}
        language={language || "text"}
        PreTag="div"
        customStyle={{ margin: 0, padding: "1.25rem", background: "#07090D", fontSize: "0.875rem", lineHeight: "1.6", overflowX: "auto" }}
      >
        {value}
      </SyntaxHighlighter>
    </div>
  );
}

export function MarkdownRenderer({ content }: { content: string }) {
  return (
    <div className="text-text-secondary leading-relaxed max-w-none">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          p: ({ node, ...props }) => <p className="mb-4 last:mb-0 leading-7 text-text-secondary" {...props} />,
          h1: ({ node, ...props }) => <h1 className="text-2xl font-bold font-display text-text-primary mt-8 mb-4 pb-2 border-b border-border-subtle" {...props} />,
          h2: ({ node, ...props }) => <h2 className="text-xl font-bold font-display text-text-primary mt-7 mb-3" {...props} />,
          h3: ({ node, ...props }) => <h3 className="text-base font-bold text-text-primary mt-5 mb-2" {...props} />,
          h4: ({ node, ...props }) => <h4 className="text-sm font-bold text-text-secondary uppercase tracking-wider mt-4 mb-2" {...props} />,
          ul: ({ node, ...props }) => <ul className="list-disc pl-6 mb-5 space-y-1.5 text-text-secondary" {...props} />,
          ol: ({ node, ...props }) => <ol className="list-decimal pl-6 mb-5 space-y-1.5 text-text-secondary" {...props} />,
          li: ({ node, children, ...props }) => <li className="leading-6 pl-1" {...props}>{children}</li>,
          input: ({ node, ...props }) => <input {...props} className="mr-2 mt-0.5 accent-brand-teal w-3.5 h-3.5 rounded" disabled />,
          a: ({ node, ...props }) => <a className="text-brand-teal hover:text-brand-teal-light underline underline-offset-2 font-medium transition-colors break-all" target="_blank" rel="noopener noreferrer" {...props} />,
          strong: ({ node, ...props }) => <strong className="font-bold text-text-primary" {...props} />,
          em: ({ node, ...props }) => <em className="italic text-text-secondary" {...props} />,
          hr: ({ node }) => (
            <div className="flex items-center my-8 gap-3">
              <div className="h-px flex-1 bg-gradient-to-r from-transparent to-brand-navy opacity-60" />
              <div className="w-1.5 h-1.5 rounded-full bg-brand-teal opacity-70" />
              <div className="h-px flex-1 bg-gradient-to-l from-transparent to-brand-teal opacity-60" />
            </div>
          ),
          blockquote: ({ node, ...props }) => <blockquote className="border-l-4 border-brand-teal pl-4 italic my-5 text-text-muted bg-brand-teal/5 py-3 pr-3 rounded-r-lg" {...props} />,
          table: ({ node, ...props }) => (
            <div className="my-6 overflow-x-auto rounded-xl border border-border-default">
              <table className="w-full text-sm border-collapse" {...props} />
            </div>
          ),
          thead: ({ node, ...props }) => <thead className="bg-bg-secondary text-text-primary border-b border-border-default" {...props} />,
          tbody: ({ node, ...props }) => <tbody className="divide-y divide-border-subtle" {...props} />,
          tr: ({ node, ...props }) => <tr className="hover:bg-bg-surface/50 transition-colors" {...props} />,
          th: ({ node, ...props }) => <th className="px-4 py-3 text-left font-semibold text-text-primary text-xs uppercase tracking-wider" {...props} />,
          td: ({ node, ...props }) => <td className="px-4 py-3 text-text-secondary" {...props} />,
          pre: ({ node, ...props }) => <>{props.children}</>,
          code: ({ node, className, children, ...props }: any) => {
            const match = /language-(\w+)/.exec(className || "");
            const codeString = String(children);
            // Treat as block if: has a language tag OR contains newlines (multi-line = fenced block)
            const isBlock = !!match || codeString.includes("\n");
            return !isBlock ? (
              <code
                className="bg-bg-primary border border-border-subtle px-1.5 py-0.5 rounded text-sm font-mono text-brand-teal"
                {...props}
              >
                {children}
              </code>
            ) : (
              <CodeBlock
                language={match?.[1] || "text"}
                value={codeString.replace(/\n$/, "")}
              />
            );
          },
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
