export function OrganizationJsonLd() {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://builder.co.uk';

  const data = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Builder',
    description: 'Connect with verified builders, plumbers, electricians, and other tradespeople in your area.',
    url: siteUrl,
    logo: `${siteUrl}/logo.png`,
    sameAs: [
      'https://facebook.com/builderuk',
      'https://twitter.com/builderuk',
      'https://instagram.com/builderuk',
      'https://linkedin.com/company/builderuk',
    ],
    contactPoint: {
      '@type': 'ContactPoint',
      email: 'support@builder.co.uk',
      contactType: 'customer service',
      availableLanguage: 'English',
    },
    areaServed: {
      '@type': 'Country',
      name: 'United Kingdom',
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

export function WebsiteJsonLd() {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://builder.co.uk';

  const data = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Builder',
    url: siteUrl,
    description: 'Find trusted tradespeople near you. Read reviews, compare quotes, and hire with confidence.',
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${siteUrl}/search?q={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

interface LocalBusinessJsonLdProps {
  name: string;
  description: string;
  url: string;
  image?: string;
  telephone?: string;
  email?: string;
  address?: {
    streetAddress?: string;
    addressLocality: string;
    addressRegion?: string;
    postalCode?: string;
    addressCountry: string;
  };
  geo?: {
    latitude: number;
    longitude: number;
  };
  priceRange?: string;
  aggregateRating?: {
    ratingValue: number;
    reviewCount: number;
  };
  serviceArea?: string[];
  services?: string[];
}

export function LocalBusinessJsonLd({
  name,
  description,
  url,
  image,
  telephone,
  email,
  address,
  geo,
  priceRange,
  aggregateRating,
  serviceArea,
  services,
}: LocalBusinessJsonLdProps) {
  const data: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    '@id': url,
    name,
    description,
    url,
  };

  if (image) data.image = image;
  if (telephone) data.telephone = telephone;
  if (email) data.email = email;

  if (address) {
    data.address = {
      '@type': 'PostalAddress',
      ...address,
    };
  }

  if (geo) {
    data.geo = {
      '@type': 'GeoCoordinates',
      latitude: geo.latitude,
      longitude: geo.longitude,
    };
  }

  if (priceRange) data.priceRange = priceRange;

  if (aggregateRating && aggregateRating.reviewCount > 0) {
    data.aggregateRating = {
      '@type': 'AggregateRating',
      ratingValue: aggregateRating.ratingValue,
      reviewCount: aggregateRating.reviewCount,
      bestRating: 5,
      worstRating: 1,
    };
  }

  if (serviceArea && serviceArea.length > 0) {
    data.areaServed = serviceArea.map((area) => ({
      '@type': 'City',
      name: area,
    }));
  }

  if (services && services.length > 0) {
    data.hasOfferCatalog = {
      '@type': 'OfferCatalog',
      name: 'Services',
      itemListElement: services.map((service) => ({
        '@type': 'Offer',
        itemOffered: {
          '@type': 'Service',
          name: service,
        },
      })),
    };
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

interface FAQJsonLdProps {
  questions: Array<{
    question: string;
    answer: string;
  }>;
}

export function FAQJsonLd({ questions }: FAQJsonLdProps) {
  const data = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: questions.map((q) => ({
      '@type': 'Question',
      name: q.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: q.answer,
      },
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

interface BreadcrumbJsonLdProps {
  items: Array<{
    name: string;
    url: string;
  }>;
}

export function BreadcrumbJsonLd({ items }: BreadcrumbJsonLdProps) {
  const data = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

interface ServiceJsonLdProps {
  name: string;
  description: string;
  provider: string;
  providerUrl: string;
  areaServed?: string;
  serviceType: string;
}

export function ServiceJsonLd({
  name,
  description,
  provider,
  providerUrl,
  areaServed,
  serviceType,
}: ServiceJsonLdProps) {
  const data: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name,
    description,
    serviceType,
    provider: {
      '@type': 'LocalBusiness',
      name: provider,
      url: providerUrl,
    },
  };

  if (areaServed) {
    data.areaServed = {
      '@type': 'City',
      name: areaServed,
    };
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
