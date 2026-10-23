import type { Metadata } from "next";
import { site, type TourPackage } from "@/data/site";

/** Public origin of this build: the Vercel production domain when deployed there, else the company domain. */
export const siteUrl = process.env.VERCEL_PROJECT_PRODUCTION_URL
  ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
  : "https://vibentravelpakistan.com";

export const absUrl = (path: string) => new URL(path, siteUrl).href;

export const defaultTitle = "Vibe & Travel Pakistan | Discover Pakistan";
export const defaultDescription =
  "Explore Pakistan with Vibe & Travel Pakistan. Discover northern mountain destinations, scenic road trips, trekking adventures, group tours, and custom travel experiences.";

/** 1200x630 JPG used for link previews (WhatsApp doesn't render WebP). */
export const ogImageFor = (image: string) => `/images/og/${image.split("/").pop()!.replace(/\.\w+$/, "")}.jpg`;
const defaultOg = { url: "/images/og.jpg", width: 1200, height: 630, alt: "Hunza Valley and the Karakoram mountains" };

/**
 * Per-page metadata with canonical URL, Open Graph and Twitter card. Child pages replace the
 * layout's openGraph object wholesale, so every page goes through here to keep previews complete.
 */
export function pageMeta({ title, description, path, image }: { title?: string; description: string; path: string; image?: string }): Metadata {
  const fullTitle = title ? `${title} | ${site.name}` : defaultTitle;
  const images = image ? [{ url: ogImageFor(image), width: 1200, height: 630, alt: title ?? site.name }] : [defaultOg];
  return {
    ...(title && { title }),
    description,
    alternates: { canonical: path },
    openGraph: { type: "website", siteName: site.name, locale: "en_PK", url: path, title: fullTitle, description, images },
    twitter: { card: "summary_large_image", title: fullTitle, description, images: images.map((i) => i.url) },
  };
}

const orgId = `${siteUrl}/#organization`;

/** Site-wide structured data: the travel agency and the website. */
export const siteJsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "TravelAgency",
      "@id": orgId,
      name: site.name,
      url: absUrl("/"),
      logo: absUrl("/images/logo.png"),
      image: absUrl("/images/og.jpg"),
      description: defaultDescription,
      telephone: `+${site.phoneRaw}`,
      areaServed: { "@type": "Country", name: "Pakistan" },
      founder: { "@type": "Person", name: site.founder.name, sameAs: [site.founder.instagram] },
      sameAs: [site.instagram],
    },
    { "@type": "WebSite", "@id": `${siteUrl}/#website`, name: site.name, url: absUrl("/"), publisher: { "@id": orgId }, inLanguage: "en" },
  ],
};

const breadcrumbs = (items: { name: string; path: string }[]) => ({
  "@type": "BreadcrumbList",
  itemListElement: items.map((it, i) => ({ "@type": "ListItem", position: i + 1, name: it.name, item: absUrl(it.path) })),
});

/** Trip, breadcrumb and FAQ structured data for a package page. */
export function packageJsonLd(p: TourPackage) {
  const path = `/tour-packages/${p.slug}`;
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "TouristTrip",
        name: p.name,
        description: p.overview,
        url: absUrl(path),
        image: absUrl(p.image),
        touristType: p.hiking ? ["Adventure travelers", "Hikers"] : ["Families", "Couples", "Groups"],
        provider: { "@id": orgId },
        itinerary: {
          "@type": "ItemList",
          numberOfItems: p.itinerary.length,
          itemListElement: p.itinerary.map((d) => ({ "@type": "ListItem", position: d.day, name: `Day ${d.day}: ${d.title}`, description: d.description })),
        },
        offers: {
          "@type": "Offer",
          price: p.price,
          priceCurrency: "PKR",
          url: absUrl(path),
          availability: p.available ? "https://schema.org/InStock" : "https://schema.org/SoldOut",
        },
      },
      breadcrumbs([
        { name: "Home", path: "/" },
        { name: "Tour Packages", path: "/tour-packages" },
        { name: p.name, path },
      ]),
      ...(p.faqs.length
        ? [{ "@type": "FAQPage", mainEntity: p.faqs.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })) }]
        : []),
    ],
  };
}

/** List of every trip, for the packages index page. */
export const packagesListJsonLd = (list: TourPackage[]) => ({
  "@context": "https://schema.org",
  "@type": "ItemList",
  name: "Pakistan tour packages",
  itemListElement: list.map((p, i) => ({ "@type": "ListItem", position: i + 1, name: p.name, url: absUrl(`/tour-packages/${p.slug}`) })),
});

/** Renders structured data; `<` is escaped so content can't break out of the script tag. */
export function JsonLd({ data }: { data: object }) {
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }} />;
}
