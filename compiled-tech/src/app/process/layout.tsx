import { generatePageMetadata } from "@/lib/seo";

// The page itself is a client component (interactive timeline), which cannot
// export metadata. This server layout gives the route its own title/description.
export const metadata = generatePageMetadata({
  title: "Our Process — How We Ship Software",
  description:
    "From first call to live product: how Compiled Tech scopes, designs, builds, tests and launches software projects, with written scope and fixed quotes before work starts.",
  path: "/process",
  type: "website",
  tags: [
    "software development process",
    "how software projects are built",
    "agency workflow",
  ],
});

export default function ProcessLayout({ children }: { children: React.ReactNode }) {
  return children;
}
