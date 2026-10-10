const links = [
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/company/compiled-tech/",
    icon: "in",
  },
  {
    label: "X",
    href: "https://x.com/compiledtech15",
    icon: "X",
  },
  {
    label: "Instagram",
    href: "https://www.instagram.com/compiled.tech/",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <rect width="20" height="20" x="2" y="2" rx="5" />
        <circle cx="12" cy="12" r="4" />
        <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" />
      </svg>
    ),
  },
];

export function SocialLinks() {
  return (
    <div className="flex gap-4" aria-label="Social links">
      {links.map((l) => (
        <a
          key={l.label}
          href={l.href}
          target="_blank"
          rel="noopener noreferrer"
          className="font-display uppercase text-[0.8rem] tracking-[0.16em] text-mist/60 hover:text-frost transition-colors"
          aria-label={l.label}
        >
          {l.icon}
        </a>
      ))}
    </div>
  );
}