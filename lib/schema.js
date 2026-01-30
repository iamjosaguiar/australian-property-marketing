const BASE_URL = 'https://australianpropertymarketing.com.au'

export const organizationSchema = {
  '@context': 'https://schema.org',
  '@type': 'MarketingAgency',
  '@id': `${BASE_URL}/#organization`,
  name: 'Australian Property Marketing',
  url: BASE_URL,
  logo: `${BASE_URL}/logo.png`,
  description: 'We measure listings. Not likes. Real estate marketing for agencies doing $2M+ in annual GCI.',
  email: 'info@australianpropertymarketing.com.au',
  founder: {
    '@type': 'Person',
    name: 'Andy',
    jobTitle: 'Founder',
  },
  areaServed: {
    '@type': 'Country',
    name: 'Australia',
  },
  sameAs: [
    'https://facebook.com/australianpropertymarketing',
    'https://instagram.com/australianpropertymarketing',
    'https://linkedin.com/company/australian-property-marketing',
    'https://youtube.com/@australianpropertymarketing',
    'https://x.com/auspropmktg',
  ],
}

export const websiteSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  '@id': `${BASE_URL}/#website`,
  name: 'Australian Property Marketing',
  url: BASE_URL,
  publisher: { '@id': `${BASE_URL}/#organization` },
}

export function breadcrumbSchema(items) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.name,
      item: item.url ? `${BASE_URL}${item.url}` : undefined,
    })),
  }
}

export function faqSchema(faqs) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  }
}

export function serviceSchema({ name, description, url }) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name,
    description,
    url: `${BASE_URL}${url}`,
    provider: { '@id': `${BASE_URL}/#organization` },
    areaServed: { '@type': 'Country', name: 'Australia' },
  }
}

export function articleSchema({ title, excerpt, slug, date, category }) {
  const isoDate = parseArticleDate(date)
  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: title,
    description: excerpt,
    url: `${BASE_URL}/resources/${slug}`,
    datePublished: isoDate,
    dateModified: isoDate,
    author: {
      '@type': 'Person',
      name: 'Andy',
      jobTitle: 'Founder, Australian Property Marketing',
    },
    publisher: { '@id': `${BASE_URL}/#organization` },
    articleSection: category,
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `${BASE_URL}/resources/${slug}`,
    },
  }
}

export function localBusinessSchema({ city, description }) {
  return {
    '@context': 'https://schema.org',
    '@type': 'MarketingAgency',
    name: 'Australian Property Marketing',
    url: BASE_URL,
    description,
    email: 'info@australianpropertymarketing.com.au',
    areaServed: {
      '@type': 'City',
      name: city,
    },
    parentOrganization: { '@id': `${BASE_URL}/#organization` },
  }
}

function parseArticleDate(dateStr) {
  const months = {
    January: '01', February: '02', March: '03', April: '04',
    May: '05', June: '06', July: '07', August: '08',
    September: '09', October: '10', November: '11', December: '12',
  }
  const parts = dateStr.split(' ')
  if (parts.length === 2 && months[parts[0]]) {
    return `${parts[1]}-${months[parts[0]]}-01`
  }
  return new Date().toISOString().split('T')[0]
}

export function JsonLd({ data }) {
  const schemas = Array.isArray(data) ? data : [data]
  return (
    <>
      {schemas.map((schema, i) => (
        <script
          key={i}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      ))}
    </>
  )
}
