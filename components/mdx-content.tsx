interface MDXContentProps {
  code: string;
}

export function MDXContent({ code }: MDXContentProps) {
  return (
    <div className="prose prose-invert max-w-none">
      <p>MDX content will be rendered here when properly configured.</p>
      <pre>{code}</pre>
    </div>
  );
}
