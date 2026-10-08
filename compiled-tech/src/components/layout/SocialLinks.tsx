import { Github, Linkedin, X } from "lucide-react";

const links = [
  { label: "GitHub", href: "https://github.com", icon: Github },
  { label: "LinkedIn", href: "https://linkedin.com", icon: Linkedin },
  { label: "X", href: "https://x.com", icon: X },
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
          <l.icon className="w-5 h-5" aria-hidden="true" />
        </a>
      ))}
    </div>
  );
}