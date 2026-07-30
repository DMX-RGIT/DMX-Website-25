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
      {/* Header Bar */}
      <div className="flex items-center justify-between px-4 py-2 bg-bg-secondary border-b border-border-default">
        <div className="flex items-center gap-2">
          {/* Mac-style window controls */}
          <div className="flex gap-1.5">
            <div className="w-3 h-3 rounded-full bg-red-500/80" />
            <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
            <div className="w-3 h-3 rounded-full bg-green-500/80" />
          </div>
          <span className="ml-2 text-xs font-mono font-medium text-text-secondary uppercase tracking-widest">
            {language}
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
      
      {/* Code Area */}
      <SyntaxHighlighter
        style={vscDarkPlus}
        language={language}
        PreTag="div"
        customStyle={{
          margin: 0,
          padding: "1.25rem",
          background: "#07090D",
          fontSize: "0.875rem",
        }}
      >
        {value}
      </SyntaxHighlighter>
    </div>
  );
}

export function MarkdownRenderer({ content }: { content: string }) {
  return (
    <div className="text-text-secondary leading-relaxed max-w-none space-y-2">
      <ReactMarkdown 
        remarkPlugins={[remarkGfm]}
        components={{
          p: ({node, ...props}) => <p className="mb-3 last:mb-0" {...props} />,
          h1: ({node, ...props}) => <h1 className="text-xl font-bold text-text-primary mt-5 mb-3" {...props} />,
          h2: ({node, ...props}) => <h2 className="text-lg font-bold text-text-primary mt-5 mb-2" {...props} />,
          h3: ({node, ...props}) => <h3 className="text-base font-bold text-text-primary mt-4 mb-2" {...props} />,
          ul: ({node, ...props}) => <ul className="list-disc pl-5 mb-4 space-y-1" {...props} />,
          ol: ({node, ...props}) => <ol className="list-decimal pl-5 mb-4 space-y-1" {...props} />,
          li: ({node, ...props}) => <li {...props} />,
          a: ({node, ...props}) => <a className="text-brand-teal hover:underline font-semibold" target="_blank" rel="noopener noreferrer" {...props} />,
          strong: ({node, ...props}) => <strong className="font-bold text-text-primary" {...props} />,
          blockquote: ({node, ...props}) => <blockquote className="border-l-4 border-brand-teal pl-4 italic my-4 text-text-muted bg-brand-teal/5 py-2 rounded-r-lg" {...props} />,
          pre: ({node, ...props}) => <>{props.children}</>,
          code: ({node, className, children, ...props}: any) => {
            const match = /language-(\w+)/.exec(className || "");
            const isInline = !match;
            return isInline ? (
              <code className="bg-bg-primary border border-border-subtle px-1.5 py-0.5 rounded text-sm font-mono text-brand-teal" {...props}>
                {children}
              </code>
            ) : (
              <CodeBlock language={match?.[1] || "text"} value={String(children).replace(/\n$/, "")} />
            );
          },
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
