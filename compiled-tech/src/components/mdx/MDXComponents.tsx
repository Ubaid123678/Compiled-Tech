import React from "react";
import { Info } from "lucide-react";

export const MDXComponents = {
  h2: ({ children, id }: { children: React.ReactNode; id?: string }) => (
    <h2 id={id} className="font-display font-semibold uppercase tracking-[0.02em] text-frost text-[1.5rem] leading-[1.15] mt-10 mb-4 scroll-mt-24">
      {children}
    </h2>
  ),
  h3: ({ children, id }: { children: React.ReactNode; id?: string }) => (
    <h3 id={id} className="font-display font-semibold uppercase tracking-[0.02em] text-frost text-[1.15rem] leading-[1.3] mt-8 mb-3 scroll-mt-24">
      {children}
    </h3>
  ),
  p: ({ children }: { children: React.ReactNode }) => (
    <p className="text-mist text-[1.125rem] leading-[1.65] mb-6">{children}</p>
  ),
  ul: ({ children }: { children: React.ReactNode }) => (
    <ul className="list-disc list-inside space-y-2 text-mist text-[1.125rem] leading-[1.65] mb-6">{children}</ul>
  ),
  ol: ({ children }: { children: React.ReactNode }) => (
    <ol className="list-decimal list-inside space-y-2 text-mist text-[1.125rem] leading-[1.65] mb-6">{children}</ol>
  ),
  li: ({ children }: { children: React.ReactNode }) => (
    <li className="leading-[1.65]">{children}</li>
  ),
  a: ({ href, children }: { href: string; children: React.ReactNode }) => (
    <a href={href} className="text-steel hover:text-frost underline underline-offset-2" target={href.startsWith("http") ? "_blank" : undefined} rel={href.startsWith("http") ? "noopener noreferrer" : undefined}>
      {children}
    </a>
  ),
  code: ({ children }: { children: React.ReactNode }) => (
    <code className="font-mono text-[0.875rem] text-steel bg-slate/50 px-1.5 py-0.5 rounded-[4px]">{children}</code>
  ),
  pre: ({ children }: { children: React.ReactNode }) => (
    <CodeBlock>{children}</CodeBlock>
  ),
  blockquote: ({ children }: { children: React.ReactNode }) => (
    <Callout>{children}</Callout>
  ),
  img: ({ src, alt, title }: { src: string; alt: string; title?: string }) => (
    <Figure>
      {/* MDX image URLs are dynamic and may be remote; Next Image cannot optimize them without configured domains. */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={src} alt={alt} className="w-full rounded-[12px] border border-line" />
      {title && <figcaption className="text-center text-sm text-mist/60 mt-2">{title}</figcaption>}
    </Figure>
  ),
  table: ({ children }: { children: React.ReactNode }) => (
    <div className="overflow-x-auto my-8">
      <table className="w-full border-collapse border border-line">{children}</table>
    </div>
  ),
  th: ({ children }: { children: React.ReactNode }) => (
    <th className="border border-line bg-slate/50 px-4 py-3 text-left font-display uppercase text-[0.78rem] tracking-[0.1em] text-steel">{children}</th>
  ),
  td: ({ children }: { children: React.ReactNode }) => (
    <td className="border border-line px-4 py-3 text-mist text-base leading-[1.65]">{children}</td>
  ),
};

function CodeBlock({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-[12px] border border-line bg-night overflow-hidden">
      <pre className="p-5 overflow-x-auto"><code className="font-mono text-[0.875rem] text-frost">{children}</code></pre>
    </div>
  );
}

function Callout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative my-6 rounded-[12px] border border-line bg-night p-5">
      <div className="flex gap-3">
        <Info className="w-5 h-5 text-steel flex-shrink-0 mt-0.5" aria-hidden="true" />
        <div className="text-mist text-base leading-[1.65]">{children}</div>
      </div>
    </div>
  );
}

function Figure({ children }: { children: React.ReactNode }) {
  return <div className="my-8">{children}</div>;
}