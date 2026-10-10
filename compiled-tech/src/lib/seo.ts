import type { Metadata } from "next";

export const siteConfig = {
  name: "Compiled Tech",
  description: "Compiled Tech builds web apps, mobile apps, SaaS and AI solutions for startups and growing teams.",
  url: "https://compiled.tech",
  ogImage: "/og.png",
  twitterHandle: "@compiledtech",
  location: "Hasilpur, Punjab, Pakistan",
  email: "hello@compiledtech.io",
  phone: "+1 555 000 0000",
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
    return {
      ...base,
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
      sameAs: [
        "https://github.com/compiledtech",
        "https://linkedin.com/company/compiledtech",
        "https://x.com/compiledtech",
      ],
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
    return {
      ...base,
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: siteConfig.url },
      ],
    };
  }

  return base;
}