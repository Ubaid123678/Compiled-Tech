import type { Metadata } from "next";

export const siteConfig = {
  name: "Compiled Tech",
  description: "Compiled Tech builds web apps, mobile apps, SaaS and AI solutions for startups and growing teams.",
  // Set NEXT_PUBLIC_SITE_URL at deploy time to the real origin; this fallback keeps canonical/OG URLs valid.
  url: process.env.NEXT_PUBLIC_SITE_URL || "https://compiledtech.io",
  // WebP keeps the social preview under 25KB; 1200x630 as the OG spec wants.
  ogImage: "/og.webp",
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

/**
 * One canonical company entity. Everything else (Service.provider,
 * Article.publisher, Offer.seller) references it by @id, so schema stays one
 * complete node instead of nine partial ones — which is exactly what the
 * "Organization: consider adding logo, sameAs, contactPoint, address"
 * warnings were complaining about.
 */
export const organizationId = `${siteConfig.url}/#organization`;
export const websiteId = `${siteConfig.url}/#website`;

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
  type:
    | "Organization"
    | "WebSite"
    | "Service"
    | "Article"
    | "BreadcrumbList";
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
    // Absolute URL — a relative path is not a valid schema image value.
    image: image
      ? image.startsWith("http")
        ? image
        : `${siteConfig.url}${image}`
      : `${siteConfig.url}${siteConfig.ogImage}`,
  };

  if (type === "Organization" || type === "WebSite") {
    const isOrg = type === "Organization";
    return {
      ...base,
      // Stable entity id so other nodes can reference this by @id.
      "@id": isOrg ? organizationId : websiteId,
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
      // Named human contact point: what the report's contactPoint check reads,
      // and what Google's Organization result can show.
      ...(isOrg && {
        contactPoint: {
          "@type": "ContactPoint",
          contactType: "sales",
          telephone: siteConfig.phone,
          email: siteConfig.email,
          availableLanguage: ["English"],
          areaServed: "Worldwide",
        },
        founder: { "@type": "Person", name: "Ubaidullah Akram" },
      }),
      // WebSite search action: the "potentialAction" the report asked for.
      ...(!isOrg && {
        publisher: { "@id": organizationId },
        potentialAction: {
          "@type": "SearchAction",
          target: {
            "@type": "EntryPoint",
            urlTemplate: `${siteConfig.url}/blog?q={search_term_string}`,
          },
          "query-input": "required name=search_term_string",
        },
      }),
    };
  }

  if (type === "Service") {
    return {
      ...base,
      "@type": "Service",
      serviceType: name,
      // @id reference, not another partial Organization blob.
      provider: { "@id": organizationId },
      areaServed: "Worldwide",
      availableChannel: {
        "@type": "ServiceChannel",
        serviceUrl: url,
        servicePhone: telephone || siteConfig.phone,
        availableLanguage: "English",
      },
    };
  }

  if (type === "Article") {
    return {
      ...base,
      "@type": "Article",
      headline: headline || name,
      author: author
        ? { "@type": "Person", name: author, url: `${siteConfig.url}/about` }
        : { "@id": organizationId },
      // Real dates only — an invented datePublished would be a lie to crawlers.
      datePublished,
      dateModified: dateModified || datePublished,
      articleSection,
      keywords: keywords?.join(", "),
      publisher: { "@id": organizationId },
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

/**
 * HowTo for a page that actually shows numbered steps. Steps come from the
 * same array the timeline renders — markup never claims a process the page
 * does not display.
 */
export function generateHowToJsonLd(
  name: string,
  steps: readonly { title: string; text: string }[],
  url: string
) {
  return {
    "@context": "https://schema.org",
    "@type": "HowTo",
    "@id": `${url}#howto`,
    name,
    url,
    step: steps.map((step, index) => ({
      "@type": "HowToStep",
      position: index + 1,
      name: step.title,
      text: step.text,
      url: `${url}#step-${index + 1}-title`,
    })),
  };
}

/**
 * WebPage node carrying `speakable`, which is what voice assistants and LLM
 * readers use to pick a section to read aloud. The selector matches the
 * data-speakable attributes the FAQ component renders, so it points at real
 * text rather than an empty promise.
 */
export function generateSpeakableJsonLd(url: string) {
  return {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": `${url}#webpage`,
    url,
    isPartOf: { "@id": websiteId },
    about: { "@id": organizationId },
    speakable: {
      "@type": "SpeakableSpecification",
      cssSelector: ["[data-speakable]"],
    },
  };
}

/**
 * FAQPage from the questions a page actually renders. Feed it the same array
 * the visible <FAQ> uses so the markup can never drift from the schema.
 */
export function generateFaqJsonLd(
  items: readonly { q: string; a: string }[],
  url: string,
  id = "faq"
) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "@id": `${url}#${id}`,
    url,
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: { "@type": "Answer", text: item.a },
    })),
  };
}

/**
 * The build packages are real, priced, purchasable packages, so they get
 * Product markup rather than a bare Offer. `from` prices are starting points,
 * which PriceSpecification.minPrice states honestly.
 */
export function generateProductJsonLd(tiers: readonly {
  name: string;
  summary: string;
  from: number;
  currency: string;
  includes: readonly string[];
}[]) {
  return tiers.map((tier) => ({
    "@context": "https://schema.org",
    "@type": "Product",
    name: `${siteConfig.name} ${tier.name}`,
    description: tier.summary,
    brand: { "@id": organizationId },
    category: "Software development",
    offers: {
      "@type": "Offer",
      url: `${siteConfig.url}/pricing#${tier.name.toLowerCase().replace(/\s+/g, "-")}`,
      priceCurrency: tier.currency,
      price: tier.from,
      priceSpecification: {
        "@type": "PriceSpecification",
        minPrice: tier.from,
        priceCurrency: tier.currency,
        valueAddedTaxIncluded: false,
      },
      availability: "https://schema.org/InStock",
      seller: { "@id": organizationId },
    },
  }));
}