import Image from "next/image";
import Link from "next/link";
import { slugify } from "@/lib/utils";

type TeamCardProps = {
  name: string;
  role: string;
  line: string;
  image: string;
  linkedin?: string;
  github?: string;
};

const LinkedInIcon = ({ className }: { className?: string }) => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="currentColor"
    aria-hidden="true"
    className={className}
  >
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
  </svg>
);

const GitHubIcon = ({ className }: { className?: string }) => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="currentColor"
    aria-hidden="true"
    className={className}
  >
    <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z" />
  </svg>
);

export function TeamCard({ name, role, line, image, linkedin, github }: TeamCardProps) {
  return (
    <article className="group text-center">
      <div className="relative aspect-square w-full max-w-xs mx-auto mb-6 overflow-hidden rounded-[12px]">
        <Image
          src={image}
          alt={name}
          fill
          loading="eager"
          className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.05]"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        />
      </div>
      <h3
        id={slugify(name)}
        className="font-display font-semibold uppercase tracking-[0.02em] text-frost text-[1.15rem] leading-[1.3] mb-1"
      >
        {name}
      </h3>
      <p className="text-steel text-sm leading-[1.5] mb-3">{role}</p>
      <p className="text-mist text-base leading-[1.6] mb-4">{line}</p>
      <div className="flex items-center justify-center gap-4">
        {linkedin && (
          <Link
            href={linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="text-mist/60 hover:text-frost transition-colors"
            aria-label={`${name} on LinkedIn`}
          >
            <LinkedInIcon className="w-5 h-5" />
          </Link>
        )}
        {github && (
          <Link
            href={github}
            target="_blank"
            rel="noopener noreferrer"
            className="text-mist/60 hover:text-frost transition-colors"
            aria-label={`${name} on GitHub`}
          >
            <GitHubIcon className="w-5 h-5" />
          </Link>
        )}
      </div>
    </article>
  );
}