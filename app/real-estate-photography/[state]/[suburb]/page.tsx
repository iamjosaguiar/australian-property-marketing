import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

// Generate static params for all active suburbs
export async function generateStaticParams() {
  try {
    const { prisma } = await import('@/lib/prisma');
    const suburbs = await prisma.suburb.findMany({
      where: { active: true },
      select: {
        stateSlug: true,
        slug: true,
      },
    });

    return suburbs.map((suburb) => ({
      state: suburb.stateSlug,
      suburb: suburb.slug,
    }));
  } catch (error) {
    // Database not set up - return placeholder suburbs
    return [
      { state: 'nsw', suburb: 'bondi' },
      { state: 'nsw', suburb: 'paddington' },
      { state: 'nsw', suburb: 'surry-hills' },
    ];
  }
}

// Generate metadata for SEO
export async function generateMetadata({
  params,
}: {
  params: Promise<{ state: string; suburb: string }>;
}): Promise<Metadata> {
  const { suburb: suburbSlug } = await params;
  let suburb: any = null;

  try {
    const { prisma } = await import('@/lib/prisma');
    suburb = await prisma.suburb.findUnique({
      where: { slug: suburbSlug },
    });
  } catch (error) {
    // Use placeholder data
    const suburbMap: any = {
      'bondi': { name: 'Bondi', state: 'NSW', basePrice: 350 },
      'paddington': { name: 'Paddington', state: 'NSW', basePrice: 350 },
      'surry-hills': { name: 'Surry Hills', state: 'NSW', basePrice: 320 },
    };
    suburb = suburbMap[suburbSlug];
  }

  if (!suburb) {
    return {
      title: 'Suburb Not Found',
    };
  }

  return {
    title: `Real Estate Photography ${suburb.name} | Property Photos ${suburb.state} | Australian Property Marketing`,
    description: `Professional real estate photography in ${suburb.name}, ${suburb.state}. From $${suburb.basePrice} for photos. 24-hour delivery. Book online today.`,
    keywords: `real estate photography ${suburb.name}, property photography ${suburb.name}, ${suburb.name} real estate photos, property photographer ${suburb.name} ${suburb.state}`,
    openGraph: {
      title: `Real Estate Photography ${suburb.name} | Australian Property Marketing`,
      description: `Professional property photography in ${suburb.name}. From $${suburb.basePrice}. 24-hour delivery.`,
      type: 'website',
      locale: 'en_AU',
    },
    other: suburb.latitude ? {
      'geo.region': `AU-${suburb.state}`,
      'geo.placename': suburb.name,
      'geo.position': `${suburb.latitude};${suburb.longitude}`,
      'ICBM': `${suburb.latitude}, ${suburb.longitude}`,
    } : {},
  };
}

// Main page component
export default async function SuburbPage({
  params,
}: {
  params: Promise<{ state: string; suburb: string }>;
}) {
  const { suburb: suburbSlug } = await params;
  let suburb: any = null;

  try {
    const { prisma } = await import('@/lib/prisma');

    // Fetch suburb data with all relations
    suburb = await prisma.suburb.findUnique({
      where: { slug: suburbSlug },
      include: {
        portfolioImages: {
          take: 6,
          where: { featured: true },
        },
        localAgencies: {
          take: 8,
        },
        testimonials: {
          take: 3,
          where: { featured: true },
        },
        nearbySuburbsFrom: {
          take: 6,
          orderBy: { distanceKm: 'asc' },
          include: {
            nearbySuburb: true,
          },
        },
      },
    });
  } catch (error) {
    // Database not set up - use placeholder data
    const suburbMap: any = {
      'bondi': {
        id: 1,
        name: 'Bondi',
        slug: 'bondi',
        state: 'NSW',
        stateFull: 'New South Wales',
        stateSlug: 'nsw',
        postcode: '2026',
        city: 'Sydney',
        basePrice: 350,
        premiumPrice: 550,
        prestigePrice: 895,
        twilightPrice: 195,
        dronePrice: 295,
        stagingPrice: 48,
        medianPrice: 2850000,
        medianPriceFormatted: '2,850,000',
        propertiesSoldQtd: 45,
        daysOnMarket: 28,
        yoyGrowth: 8.5,
        description: 'Bondi is an iconic beachside suburb known for its famous beach, coastal lifestyle, and vibrant dining scene.',
        landmarks: 'Bondi Beach, Bondi to Bronte coastal walk, and numerous cafes and restaurants',
        latitude: -33.8908,
        longitude: 151.2743,
        portfolioImages: [],
        localAgencies: [],
        testimonials: [],
        nearbySuburbsFrom: [],
        agentCount: 12,
      },
      'paddington': {
        id: 2,
        name: 'Paddington',
        slug: 'paddington',
        state: 'NSW',
        stateFull: 'New South Wales',
        stateSlug: 'nsw',
        postcode: '2021',
        city: 'Sydney',
        basePrice: 350,
        premiumPrice: 550,
        prestigePrice: 895,
        twilightPrice: 195,
        dronePrice: 295,
        stagingPrice: 48,
        medianPrice: 2450000,
        medianPriceFormatted: '2,450,000',
        propertiesSoldQtd: 38,
        daysOnMarket: 32,
        yoyGrowth: 7.2,
        description: 'Paddington is known for its Victorian terrace houses, boutique shopping on Oxford Street, and proximity to the CBD.',
        landmarks: 'Oxford Street shopping, Paddington Markets, and heritage architecture',
        latitude: -33.8844,
        longitude: 151.2295,
        portfolioImages: [],
        localAgencies: [],
        testimonials: [],
        nearbySuburbsFrom: [],
        agentCount: 15,
      },
      'surry-hills': {
        id: 3,
        name: 'Surry Hills',
        slug: 'surry-hills',
        state: 'NSW',
        stateFull: 'New South Wales',
        stateSlug: 'nsw',
        postcode: '2010',
        city: 'Sydney',
        basePrice: 320,
        premiumPrice: 520,
        prestigePrice: 865,
        twilightPrice: 195,
        dronePrice: 295,
        stagingPrice: 48,
        medianPrice: 1650000,
        medianPriceFormatted: '1,650,000',
        propertiesSoldQtd: 52,
        daysOnMarket: 25,
        yoyGrowth: 9.1,
        description: 'Surry Hills is a trendy inner-city suburb known for its cafe culture, creative industries, and vibrant nightlife.',
        landmarks: 'Crown Street dining precinct, Surry Hills Markets, and numerous art galleries',
        latitude: -33.8871,
        longitude: 151.2107,
        portfolioImages: [],
        localAgencies: [],
        testimonials: [],
        nearbySuburbsFrom: [],
        agentCount: 18,
      },
    };
    suburb = suburbMap[suburbSlug] || null;
  }

  if (!suburb) {
    notFound();
  }

  // Structured Data - LocalBusiness
  const localBusinessSchema = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    '@id': 'https://australianpropertymarketing.com.au/#organization',
    name: `Australian Property Marketing - ${suburb.name}`,
    url: `https://australianpropertymarketing.com.au/real-estate-photography/${suburb.stateSlug}/${suburb.slug}/`,
    telephone: '1300276463',
    priceRange: `$${suburb.basePrice}-$${suburb.prestigePrice}`,
    address: {
      '@type': 'PostalAddress',
      addressLocality: suburb.name,
      addressRegion: suburb.state,
      postalCode: suburb.postcode,
      addressCountry: 'AU',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: Number(suburb.latitude),
      longitude: Number(suburb.longitude),
    },
    areaServed: {
      '@type': 'Place',
      name: `${suburb.name}, ${suburb.stateFull}`,
    },
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: 'Real Estate Photography Services',
      itemListElement: [
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: 'Essential Photography Package',
            description: '15 professional property photos with 24-hour delivery',
          },
          price: suburb.basePrice.toString(),
          priceCurrency: 'AUD',
        },
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: 'Premium Photography Package',
            description: '25 photos plus floor plan',
          },
          price: suburb.premiumPrice.toString(),
          priceCurrency: 'AUD',
        },
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: 'Prestige Photography Package',
            description: '40 photos with twilight and drone photography',
          },
          price: suburb.prestigePrice.toString(),
          priceCurrency: 'AUD',
        },
      ],
    },
  };

  // Structured Data - FAQPage
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: `How much does real estate photography cost in ${suburb.name}?`,
        acceptedAnswer: {
          '@type': 'Answer',
          text: `Real estate photography in ${suburb.name} starts from $${suburb.basePrice} for our Essential package (15 photos). Our Premium package ($${suburb.premiumPrice}) includes 25 photos plus a floor plan.`,
        },
      },
      {
        '@type': 'Question',
        name: `How quickly can you photograph my listing in ${suburb.name}?`,
        acceptedAnswer: {
          '@type': 'Answer',
          text: `We offer same-day and next-day bookings for ${suburb.name} properties. Photos are delivered within 24 hours of the shoot.`,
        },
      },
      {
        '@type': 'Question',
        name: `Do you offer drone photography in ${suburb.name}?`,
        acceptedAnswer: {
          '@type': 'Answer',
          text: `Yes, we offer CASA-certified drone photography for ${suburb.name} properties starting from $${suburb.dronePrice}.`,
        },
      },
      {
        '@type': 'Question',
        name: `What is the property market like in ${suburb.name}?`,
        acceptedAnswer: {
          '@type': 'Answer',
          text: `${suburb.name} has a median house price of $${suburb.medianPriceFormatted}, with ${suburb.propertiesSoldQtd} properties sold last quarter and ${suburb.daysOnMarket} average days on market.`,
        },
      },
    ],
  };

  // Structured Data - BreadcrumbList
  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: 'https://australianpropertymarketing.com.au/',
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Real Estate Photography',
        item: 'https://australianpropertymarketing.com.au/real-estate-photography/',
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: suburb.stateFull,
        item: `https://australianpropertymarketing.com.au/real-estate-photography/${suburb.stateSlug}/`,
      },
      {
        '@type': 'ListItem',
        position: 4,
        name: suburb.name,
      },
    ],
  };

  return (
    <>
      {/* Structured Data Scripts */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      <Header />
      <main className="min-h-screen pt-20">
        {/* Breadcrumbs */}
        <nav className="bg-soft-grey py-4 px-6" aria-label="Breadcrumb">
        <ol className="max-w-7xl mx-auto flex items-center gap-2 text-sm">
          <li><Link href="/" className="text-slate-600 hover:text-primary">Home</Link></li>
          <li className="text-slate-400">/</li>
          <li><Link href="/real-estate-photography/" className="text-slate-600 hover:text-primary">Photography</Link></li>
          <li className="text-slate-400">/</li>
          <li><Link href={`/real-estate-photography/${suburb.stateSlug}/`} className="text-slate-600 hover:text-primary">{suburb.stateFull}</Link></li>
          <li className="text-slate-400">/</li>
          <li className="text-slate-900 font-semibold">{suburb.name}</li>
        </ol>
      </nav>

      {/* Hero Section */}
      <section className="relative h-[500px] bg-gradient-to-br from-navy-900 to-slate-800">
        <div className="absolute inset-0 bg-black/40" />
        <div className="relative z-10 max-w-7xl mx-auto px-6 h-full flex flex-col justify-center">
          <h1 className="text-5xl md:text-6xl font-black text-white mb-4">
            Real Estate Photography in {suburb.name}
          </h1>
          <p className="text-xl text-white/90 mb-8 max-w-2xl">
            Professional property photography for {suburb.name} agents and vendors. From ${suburb.basePrice} with 24-hour delivery.
          </p>
          <div className="flex gap-4">
            <Link
              href={`/book/?suburb=${suburb.slug}`}
              className="bg-primary hover:bg-primary/90 text-white font-bold px-8 py-4 rounded-lg transition-colors"
            >
              Book Now
            </Link>
            <a
              href="#packages"
              className="bg-white text-navy-900 font-bold px-8 py-4 rounded-lg hover:bg-slate-100 transition-colors"
            >
              View Packages
            </a>
          </div>
        </div>
      </section>

      {/* Market Stats */}
      {suburb.medianPrice && (
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-6">
            <h2 className="text-3xl font-black mb-8 text-center">{suburb.name} Property Market</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="text-center p-6 bg-soft-grey rounded-xl">
                <div className="text-3xl font-black text-primary mb-2">${suburb.medianPriceFormatted}</div>
                <div className="text-sm text-slate-600">Median House Price</div>
              </div>
              {suburb.propertiesSoldQtd && (
                <div className="text-center p-6 bg-soft-grey rounded-xl">
                  <div className="text-3xl font-black text-primary mb-2">{suburb.propertiesSoldQtd}</div>
                  <div className="text-sm text-slate-600">Properties Sold (Last Quarter)</div>
                </div>
              )}
              {suburb.daysOnMarket && (
                <div className="text-center p-6 bg-soft-grey rounded-xl">
                  <div className="text-3xl font-black text-primary mb-2">{suburb.daysOnMarket}</div>
                  <div className="text-sm text-slate-600">Avg Days on Market</div>
                </div>
              )}
              {suburb.yoyGrowth && (
                <div className="text-center p-6 bg-soft-grey rounded-xl">
                  <div className="text-3xl font-black text-primary mb-2">{suburb.yoyGrowth.toString()}%</div>
                  <div className="text-sm text-slate-600">YoY Price Growth</div>
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      {/* Packages */}
      <section className="py-20 px-6 bg-soft-grey" id="packages">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-black text-center mb-4">Photography Packages for {suburb.name}</h2>
          <p className="text-center text-slate-600 mb-12 max-w-2xl mx-auto">
            Choose the package that suits your {suburb.name} listing. All packages include professional editing and 24-hour delivery.
          </p>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Essential Package */}
            <div className="bg-white rounded-2xl p-8 shadow-subtle">
              <h3 className="text-2xl font-bold mb-4">Essential</h3>
              <div className="mb-6">
                <span className="text-4xl font-black">${suburb.basePrice}</span>
                <span className="text-slate-600 ml-2">+ GST</span>
              </div>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary text-sm">check_circle</span>
                  15 professional photos
                </li>
                <li className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary text-sm">check_circle</span>
                  Professional editing
                </li>
                <li className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary text-sm">check_circle</span>
                  24-hour delivery
                </li>
              </ul>
              <Link
                href={`/book/?package=essential&suburb=${suburb.slug}`}
                className="block text-center bg-slate-100 hover:bg-slate-200 text-navy-900 font-bold py-3 rounded-lg transition-colors"
              >
                Book Essential
              </Link>
            </div>

            {/* Premium Package */}
            <div className="bg-white rounded-2xl p-8 shadow-hover border-2 border-primary relative">
              <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-white text-xs font-bold px-4 py-1 rounded-full">
                Most Popular in {suburb.name}
              </span>
              <h3 className="text-2xl font-bold mb-4">Premium</h3>
              <div className="mb-6">
                <span className="text-4xl font-black">${suburb.premiumPrice}</span>
                <span className="text-slate-600 ml-2">+ GST</span>
              </div>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary text-sm">check_circle</span>
                  25 professional photos
                </li>
                <li className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary text-sm">check_circle</span>
                  Floor plan included
                </li>
                <li className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary text-sm">check_circle</span>
                  Professional editing
                </li>
                <li className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary text-sm">check_circle</span>
                  24-hour delivery
                </li>
              </ul>
              <Link
                href={`/book/?package=premium&suburb=${suburb.slug}`}
                className="block text-center bg-primary hover:bg-primary/90 text-white font-bold py-3 rounded-lg transition-colors"
              >
                Book Premium
              </Link>
            </div>

            {/* Prestige Package */}
            <div className="bg-white rounded-2xl p-8 shadow-subtle">
              <h3 className="text-2xl font-bold mb-4">Prestige</h3>
              <div className="mb-6">
                <span className="text-4xl font-black">${suburb.prestigePrice}</span>
                <span className="text-slate-600 ml-2">+ GST</span>
              </div>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary text-sm">check_circle</span>
                  40 professional photos
                </li>
                <li className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary text-sm">check_circle</span>
                  Twilight photography
                </li>
                <li className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary text-sm">check_circle</span>
                  Drone aerial shots
                </li>
                <li className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary text-sm">check_circle</span>
                  Property video
                </li>
              </ul>
              <Link
                href={`/book/?package=prestige&suburb=${suburb.slug}`}
                className="block text-center bg-slate-100 hover:bg-slate-200 text-navy-900 font-bold py-3 rounded-lg transition-colors"
              >
                Book Prestige
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* About Suburb */}
      {suburb.description && (
        <section className="py-20 px-6 bg-white">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-4xl font-black mb-8">Property Photography in {suburb.name}</h2>
            <div className="prose prose-lg max-w-none">
              <p className="text-slate-700 leading-relaxed">{suburb.description}</p>

              {suburb.landmarks && (
                <div className="mt-6">
                  <h3 className="text-2xl font-bold mb-4">Local Knowledge</h3>
                  <p className="text-slate-700">{suburb.name} is known for {suburb.landmarks}. Our photographers highlight these lifestyle benefits in every shoot.</p>
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      {/* Nearby Suburbs */}
      {suburb.nearbySuburbsFrom.length > 0 && (
        <section className="py-16 px-6 bg-soft-grey">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-3xl font-black mb-8">Also Serving Nearby Areas</h2>
            <p className="text-slate-600 mb-8">Looking for real estate photography near {suburb.name}? We also serve:</p>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {suburb.nearbySuburbsFrom.map((nearby: any) => (
                <Link
                  key={nearby.id}
                  href={`/real-estate-photography/${nearby.nearbySuburb.stateSlug}/${nearby.nearbySuburb.slug}/`}
                  className="bg-white p-4 rounded-lg hover:shadow-md transition-shadow"
                >
                  <div className="font-semibold text-navy-900">{nearby.nearbySuburb.name}</div>
                  <div className="text-sm text-slate-500">{nearby.distanceKm.toString()}km away</div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* FAQ Section */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl font-black mb-12 text-center">Frequently Asked Questions - {suburb.name}</h2>

          <div className="space-y-4">
            <details className="group bg-soft-grey rounded-lg">
              <summary className="flex items-center justify-between cursor-pointer p-6 font-semibold text-lg">
                <span>How much does real estate photography cost in {suburb.name}?</span>
                <span className="material-symbols-outlined transition-transform group-open:rotate-180">expand_more</span>
              </summary>
              <div className="px-6 pb-6 text-slate-700">
                <p>Real estate photography in {suburb.name} starts from ${suburb.basePrice} for our Essential package (15 photos). Our Premium package (${suburb.premiumPrice}) includes 25 photos plus a floor plan, and is our most popular choice for {suburb.name} agents. Twilight photography is available from ${suburb.twilightPrice}.</p>
              </div>
            </details>

            <details className="group bg-soft-grey rounded-lg">
              <summary className="flex items-center justify-between cursor-pointer p-6 font-semibold text-lg">
                <span>How quickly can you photograph my listing in {suburb.name}?</span>
                <span className="material-symbols-outlined transition-transform group-open:rotate-180">expand_more</span>
              </summary>
              <div className="px-6 pb-6 text-slate-700">
                <p>We offer same-day and next-day bookings for {suburb.name} properties, subject to availability. {suburb.nearestPhotographerKm && `Our nearest photographer is ${suburb.nearestPhotographerKm}km from ${suburb.name}, so we can usually accommodate urgent requests.`} Photos are delivered within 24 hours of the shoot.</p>
              </div>
            </details>

            <details className="group bg-soft-grey rounded-lg">
              <summary className="flex items-center justify-between cursor-pointer p-6 font-semibold text-lg">
                <span>Do you offer drone photography in {suburb.name}?</span>
                <span className="material-symbols-outlined transition-transform group-open:rotate-180">expand_more</span>
              </summary>
              <div className="px-6 pb-6 text-slate-700">
                <p>Yes, we offer drone photography and video for {suburb.name} properties. All our drone operators are CASA-certified. Drone photography starts from ${suburb.dronePrice} and is particularly effective for showcasing {suburb.name}'s properties and proximity to local attractions.</p>
              </div>
            </details>

            <details className="group bg-soft-grey rounded-lg">
              <summary className="flex items-center justify-between cursor-pointer p-6 font-semibold text-lg">
                <span>Can you photograph apartments in {suburb.name}?</span>
                <span className="material-symbols-outlined transition-transform group-open:rotate-180">expand_more</span>
              </summary>
              <div className="px-6 pb-6 text-slate-700">
                <p>Absolutely. We photograph apartments, townhouses, houses, and commercial properties in {suburb.name}. For apartments, we use wide-angle lenses and professional lighting to make spaces feel open and inviting. We can also capture building amenities and views where available.</p>
              </div>
            </details>

            <details className="group bg-soft-grey rounded-lg">
              <summary className="flex items-center justify-between cursor-pointer p-6 font-semibold text-lg">
                <span>Do you offer virtual staging for {suburb.name} properties?</span>
                <span className="material-symbols-outlined transition-transform group-open:rotate-180">expand_more</span>
              </summary>
              <div className="px-6 pb-6 text-slate-700">
                <p>Yes, we offer virtual staging starting from ${suburb.stagingPrice} per room. This is popular for vacant properties in {suburb.name}, helping buyers visualize the space. We can match furniture styles to the local market, from contemporary to classic.</p>
              </div>
            </details>

            {suburb.medianPrice && suburb.propertiesSoldQtd && suburb.daysOnMarket && (
              <details className="group bg-soft-grey rounded-lg">
                <summary className="flex items-center justify-between cursor-pointer p-6 font-semibold text-lg">
                  <span>What's the property market like in {suburb.name}?</span>
                  <span className="material-symbols-outlined transition-transform group-open:rotate-180">expand_more</span>
                </summary>
                <div className="px-6 pb-6 text-slate-700">
                  <p>{suburb.name} has a median house price of ${suburb.medianPriceFormatted}, with {suburb.propertiesSoldQtd} properties sold in the last quarter. Properties are averaging {suburb.daysOnMarket} days on market. Professional photography is essential in this market to help your listing stand out.</p>
                </div>
              </details>
            )}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6 bg-primary text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-black mb-4">Ready to Book Your {suburb.name} Shoot?</h2>
          <p className="text-xl mb-8 text-white/90">
            Professional property photography from ${suburb.basePrice}. 24-hour delivery. Trusted by {suburb.agentCount > 0 ? `${suburb.agentCount}+ ` : ''}{suburb.name} agents.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href={`/book/?suburb=${suburb.slug}`}
              className="bg-white text-primary font-bold px-10 py-4 rounded-lg hover:bg-slate-100 transition-colors"
            >
              Book Online Now
            </Link>
            <a
              href="tel:1300276463"
              className="bg-white/10 backdrop-blur border border-white/20 text-white font-bold px-10 py-4 rounded-lg hover:bg-white/20 transition-colors"
            >
              Call 1300 APM INFO
            </a>
          </div>
        </div>
      </section>

      <Footer />
    </main>
    </>
  );
}
