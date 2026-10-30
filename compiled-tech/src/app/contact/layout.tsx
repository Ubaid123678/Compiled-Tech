import { generatePageMetadata } from "@/lib/seo";

// The page itself is a client component (contact form), which cannot export
// metadata. This server layout gives the route its own title/description.
export const metadata = generatePageMetadata({
  title: "Contact — Start a Project",
  description:
    "Tell Compiled Tech what you want to build. Email hello@compiledtech.io, WhatsApp +92 310 734 9552, or send the form — we reply within one working day.",
  path: "/contact",
  type: "website",
  tags: [
    "hire software developers",
    "contact software agency",
    "software development quote",
  ],
});

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return children;
}
