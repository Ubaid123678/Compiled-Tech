import type { Metadata } from "next";

export const siteConfig = {
  name: "Compiled Tech",
  description: "Compiled Tech builds web apps, mobile apps, SaaS and AI solutions for startups and growing teams.",
  // Set NEXT_PUBLIC_SITE_URL at deploy time to the real origin; this fallback keeps canonical/OG URLs valid.
  url: process.env.NEXT_PUBLIC_SITE_URL || "https://compiledtech.io",
  ogImage: "/og.png",
  twitterHandle: "@compiledtech15",
  location: "Hasilpur, Punjab, Pakistan",
  email: "hello@compiledtech.io",
  phone: "+92 310 734 9552",
  // Real, live profiles only — Google matches these to the brand entity.
  // ponytail: keep in sync with data/site.ts; one list, one edit.
  socials: [
    "https://www.linkedin.com/company/compiled-tech/",
    "https://x.com/compiledtech15",
    "https://www.instagram.com/compiled.tech/",
    "https://www.tiktok.com/@compiled_tech.io",
    "https://github.com/compiledtech",
  ] as const,
};

export function generatePageMetadata({
  title,
  description,
  path,
  image,
  type = "website",
  publishedTime,
  modifiedTime,
  authors,
  tags,
}: {
  title: string;
  description: string;
  path: string;
  image?: string;
  type?: "website" | "article";
  publishedTime?: string;
  modifiedTime?: string;
  authors?: string[];
  tags?: string[];
}): Metadata {
  const fullTitle = `${title} | ${siteConfig.name}`;
  const fullUrl = `${siteConfig.url}${path}`;
  const fullImage = image || siteConfig.ogImage;

  return {
    metadataBase: new URL(siteConfig.url),
    title: fullTitle,
    description,
    keywords: tags?.join(", "),
    authors: authors?.map((name) => ({ name })),
    creator: siteConfig.name,
    publisher: siteConfig.name,
    robots: "index, follow",
    openGraph: {
      type,
      url: fullUrl,
      title: fullTitle,
      description,
      siteName: siteConfig.name,
      images: [
        {
          url: fullImage,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
      locale: "en_US",
      ...(type === "article" && {
        publishedTime,
        modifiedTime,
        authors: authors || [siteConfig.name],
        tags,
      }),
    },
    twitter: {
      card: "summary_large_image",
      site: siteConfig.twitterHandle,
      creator: siteConfig.twitterHandle,
      title: fullTitle,
      description,
      images: [fullImage],
    },
    alternates: {
      canonical: fullUrl,
    },
  };
}

export function generateJsonLd({
  type,
  name,
  description,
  url,
  image,
  address,
  telephone,
  email,
  priceRange,
  openingHours,
  author,
  datePublished,
  dateModified,
  headline,
  articleSection,
  keywords,
  items,
}: {
  type: "Organization" | "WebSite" | "Service" | "Article" | "BreadcrumbList";
  name: string;
  description: string;
  url: string;
  image?: string;
  address?: string;
  telephone?: string;
  email?: string;
  priceRange?: string;
  openingHours?: string[];
  author?: string;
  datePublished?: string;
  dateModified?: string;
  headline?: string;
  articleSection?: string;
  keywords?: string[];
  /** BreadcrumbList only: the same trail the page renders. */
  items?: Array<{ label: string; href?: string }>;
}) {
  const base = {
    "@context": "https://schema.org",
    "@type": type,
    name,
    description,
    url,
    image: image || siteConfig.ogImage,
  };

  if (type === "Organization" || type === "WebSite") {
    const isOrg = type === "Organization";
    return {
      ...base,
      // Google's Organization rich result wants a raster logo >= 112x112;
      // the repo's SVG mark isn't accepted, so use the generated PNG.
      ...(isOrg && { logo: `${siteConfig.url}/logo/compiled-tech-logo-512.png` }),
      address: address
        ? {
            "@type": "PostalAddress",
            addressLocality: "Hasilpur",
            addressRegion: "Punjab",
            addressCountry: "PK",
          }
        : undefined,
      telephone,
      email,
      priceRange,
      openingHours,
      // Real profile URLs — Google uses sameAs to connect the site to the
      // brand's LinkedIn/Instagram/X accounts in search results.
      sameAs: [...siteConfig.socials],
    };
  }

  if (type === "Service") {
    return {
      ...base,
      "@type": "Service",
      serviceType: name,
      provider: {
        "@type": "Organization",
        name: siteConfig.name,
        url: siteConfig.url,
      },
      areaServed: "Worldwide",
      availableChannel: {
        "@type": "ServiceChannel",
        serviceUrl: url,
        servicePhone: telephone,
        availableLanguage: "English",
      },
    };
  }

  if (type === "Article") {
    return {
      ...base,
      "@type": "Article",
      headline: headline || name,
      author: author ? { "@type": "Person", name: author } : { "@type": "Organization", name: siteConfig.name },
      datePublished,
      dateModified,
      articleSection,
      keywords: keywords?.join(", "),
      publisher: {
        "@type": "Organization",
        name: siteConfig.name,
        logo: {
          "@type": "ImageObject",
          url: `${siteConfig.url}/icon.svg`,
        },
      },
    };
  }

  if (type === "BreadcrumbList") {
    // Real trail when the page supplies one; otherwise just Home. Google needs
    // at least 2 items for a breadcrumb result, so a 1-item list is a no-op —
    // harmless, but pages should pass `items` (they all render a trail).
    const trail = items?.length
      ? items
      : [{ label: "Home", href: siteConfig.url }];

    return {
      ...base,
      "@type": "BreadcrumbList",
      itemListElement: trail.map((item, index) => ({
        "@type": "ListItem",
        position: index + 1,
        name: item.label,
        ...(item.href ? { item: item.href.startsWith("http") ? item.href : `${siteConfig.url}${item.href}` } : {}),
      })),
    };
  }

  return base;
}