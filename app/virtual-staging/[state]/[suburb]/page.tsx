import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export const dynamicParams = true;

export async function generateStaticParams() {
  if (process.env.VERCEL === '1' && process.env.CI === '1') {
    return [{ state: 'nsw', suburb: 'bondi' }];
  }
  try {
    const { prisma } = await import('@/lib/prisma');
    const suburbs = await prisma.suburb.findMany({
      where: { active: true },
      select: {
        stateSlug: true,
        slug: true,
      },
    });

    return suburbs.map((suburb: any) => ({
      state: suburb.stateSlug,
      suburb: suburb.slug,
    }));
  } catch (error) {
    return [
      { state: 'nsw', suburb: 'bondi' },
      { state: 'nsw', suburb: 'paddington' },
      { state: 'nsw', suburb: 'surry-hills' },
    ];
  }
}

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
    const suburbMap: any = {
      'bondi': { name: 'Bondi', state: 'NSW', stagingPrice: 48 },
      'paddington': { name: 'Paddington', state: 'NSW', stagingPrice: 48 },
      'surry-hills': { name: 'Surry Hills', state: 'NSW', stagingPrice: 48 },
    };
    suburb = suburbMap[suburbSlug];
  }

  if (!suburb) {
    return {
      title: 'Suburb Not Found',
    };
  }

  const stagingPrice = suburb.stagingPrice || 48;

  return {
    title: `Virtual Staging ${suburb.name} | Digital Furniture Staging ${suburb.state} | Australian Property Marketing`,
    description: `Professional virtual staging in ${suburb.name}, ${suburb.state}. From $${stagingPrice} per room. 24-hour delivery. Book online today.`,
    openGraph: {
      title: `Virtual Staging ${suburb.name} | Australian Property Marketing`,
      description: `Virtual furniture staging in ${suburb.name}. From $${stagingPrice} per room. 24-hour delivery.`,
      type: 'website',
      locale: 'en_AU',
    },
  };
}

export default async function SuburbVirtualStagingPage({
  params,
}: {
  params: Promise<{ state: string; suburb: string }>;
}) {
  const { suburb: suburbSlug } = await params;
  let suburb: any = null;

  try {
    const { prisma } = await import('@/lib/prisma');

    suburb = await prisma.suburb.findUnique({
      where: { slug: suburbSlug },
      include: {
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
    const suburbMap: any = {
      'bondi': {
        id: 1,
        name: 'Bondi',
        slug: 'bondi',
        state: 'NSW',
        stateFull: 'New South Wales',
        stateSlug: 'nsw',
        city: 'Sydney',
        stagingPrice: 48,
        staging3RoomPrice: 129,
        staging5RoomPrice: 195,
        nearbySuburbsFrom: [],
      },
    };
    suburb = suburbMap[suburbSlug] || null;
  }

  if (!suburb) {
    notFound();
  }

  const stagingPrice = suburb.stagingPrice || 48;
  const staging3RoomPrice = suburb.staging3RoomPrice || 129;
  const staging5RoomPrice = suburb.staging5RoomPrice || 195;

  return (
    <>
      <Header />
      <main className="min-h-screen pt-20">
        <nav className="bg-soft-grey py-4 px-6" aria-label="Breadcrumb">
          <ol className="max-w-7xl mx-auto flex items-center gap-2 text-sm">
            <li><Link href="/" className="text-slate-600 hover:text-primary">Home</Link></li>
            <li className="text-slate-400">/</li>
            <li><Link href="/virtual-staging/" className="text-slate-600 hover:text-primary">Virtual Staging</Link></li>
            <li className="text-slate-400">/</li>
            <li><Link href={`/virtual-staging/${suburb.stateSlug}/`} className="text-slate-600 hover:text-primary">{suburb.stateFull}</Link></li>
            <li className="text-slate-400">/</li>
            <li className="text-slate-900 font-semibold">{suburb.name}</li>
          </ol>
        </nav>

        <section className="relative h-[500px] bg-gradient-to-br from-navy-900 to-slate-800">
          <div className="absolute inset-0 bg-black/40" />
          <div className="relative z-10 max-w-7xl mx-auto px-6 h-full flex flex-col justify-center">
            <h1 className="text-5xl md:text-6xl font-black text-white mb-4">
              Virtual Staging in {suburb.name}
            </h1>
            <p className="text-xl text-white/90 mb-8 max-w-2xl">
              Professional virtual staging for {suburb.name} properties. From ${stagingPrice} per room with 24-hour delivery.
            </p>
            <div className="flex gap-4">
              <Link href={`/book/?suburb=${suburb.slug}`} className="bg-primary hover:bg-primary/90 text-white font-bold px-8 py-4 rounded-lg transition-colors">
                Book Now
              </Link>
              <a href="#packages" className="bg-white text-navy-900 font-bold px-8 py-4 rounded-lg hover:bg-slate-100 transition-colors">
                View Packages
              </a>
            </div>
          </div>
        </section>

        <section className="py-20 px-6 bg-soft-grey" id="packages">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-4xl font-black text-center mb-4">Staging Packages for {suburb.name}</h2>
            <p className="text-center text-slate-600 mb-12 max-w-2xl mx-auto">
              Transform vacant {suburb.name} properties with photorealistic digital furniture
            </p>

            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-white rounded-2xl p-8 shadow-subtle">
                <h3 className="text-2xl font-bold mb-4">Single Room</h3>
                <div className="mb-6">
                  <span className="text-4xl font-black">${stagingPrice}</span>
                  <span className="text-slate-600 ml-2">+ GST</span>
                </div>
                <ul className="space-y-3 mb-8">
                  <li className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary text-sm">check_circle</span>
                    1 room virtually staged
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary text-sm">check_circle</span>
                    Photorealistic furniture
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary text-sm">check_circle</span>
                    Multiple style options
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary text-sm">check_circle</span>
                    24-hour delivery
                  </li>
                </ul>
                <Link href={`/book/?package=staging-1room&suburb=${suburb.slug}`} className="block text-center bg-slate-100 hover:bg-slate-200 text-navy-900 font-bold py-3 rounded-lg transition-colors">
                  Order 1 Room
                </Link>
              </div>

              <div className="bg-white rounded-2xl p-8 shadow-hover border-2 border-primary relative">
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-white text-xs font-bold px-4 py-1 rounded-full">
                  Most Popular in {suburb.name}
                </span>
                <h3 className="text-2xl font-bold mb-4">3 Room Package</h3>
                <div className="mb-6">
                  <span className="text-4xl font-black">${staging3RoomPrice}</span>
                  <span className="text-slate-600 ml-2">+ GST</span>
                </div>
                <ul className="space-y-3 mb-8">
                  <li className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary text-sm">check_circle</span>
                    3 rooms virtually staged
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary text-sm">check_circle</span>
                    Photorealistic furniture
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary text-sm">check_circle</span>
                    Multiple style options
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary text-sm">check_circle</span>
                    Save $15
                  </li>
                </ul>
                <Link href={`/book/?package=staging-3room&suburb=${suburb.slug}`} className="block text-center bg-primary hover:bg-primary/90 text-white font-bold py-3 rounded-lg transition-colors">
                  Order 3 Rooms
                </Link>
              </div>

              <div className="bg-white rounded-2xl p-8 shadow-subtle">
                <h3 className="text-2xl font-bold mb-4">5 Room Package</h3>
                <div className="mb-6">
                  <span className="text-4xl font-black">${staging5RoomPrice}</span>
                  <span className="text-slate-600 ml-2">+ GST</span>
                </div>
                <ul className="space-y-3 mb-8">
                  <li className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary text-sm">check_circle</span>
                    5 rooms virtually staged
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary text-sm">check_circle</span>
                    Photorealistic furniture
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary text-sm">check_circle</span>
                    Multiple style options
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary text-sm">check_circle</span>
                    Save $45
                  </li>
                </ul>
                <Link href={`/book/?package=staging-5room&suburb=${suburb.slug}`} className="block text-center bg-slate-100 hover:bg-slate-200 text-navy-900 font-bold py-3 rounded-lg transition-colors">
                  Order 5 Rooms
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Target Audience Insights - shows when Census data available */}
        {(suburb.ownerPercentage || suburb.renterPercentage || suburb.stagingTargetAudience) && (
          <section className="py-16 px-6 bg-white">
            <div className="max-w-7xl mx-auto">
              <h2 className="text-3xl font-black mb-8">Virtual Staging for {suburb.name}</h2>

              <div className="grid md:grid-cols-2 gap-8 mb-8">
                {suburb.renterPercentage && (
                  <div className="bg-soft-grey rounded-xl p-6 text-center">
                    <div className="text-4xl font-black text-navy-900 mb-2">{suburb.renterPercentage.toString()}%</div>
                    <div className="text-slate-600">Rental Properties</div>
                    <p className="text-sm text-slate-500 mt-2">Investment market activity</p>
                  </div>
                )}
                {suburb.ownerPercentage && (
                  <div className="bg-soft-grey rounded-xl p-6 text-center">
                    <div className="text-4xl font-black text-navy-900 mb-2">{suburb.ownerPercentage.toString()}%</div>
                    <div className="text-slate-600">Owner-Occupied</div>
                    <p className="text-sm text-slate-500 mt-2">Family home market</p>
                  </div>
                )}
              </div>

              {/* Investor-focused messaging */}
              {suburb.stagingTargetAudience === 'investors' && suburb.renterPercentage && (
                <div className="bg-soft-grey rounded-xl p-6 mb-8">
                  <h3 className="font-bold text-navy-900 mb-3 text-lg">High Investment Activity</h3>
                  <p className="text-slate-700 mb-4">
                    With {suburb.renterPercentage.toString()}% of properties rented, {suburb.name} attracts significant investor interest.
                    Virtual staging helps investors visualize tenant-ready presentation and rental potential.
                  </p>
                  <div className="flex items-start gap-3 bg-white rounded-lg p-4">
                    <span className="material-symbols-outlined text-primary">palette</span>
                    <div>
                      <p className="font-semibold text-navy-900">Popular styles for {suburb.name}:</p>
                      <p className="text-slate-600">Contemporary, minimalist, neutral tones that photograph well and appeal to broad tenant demographics.</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Owner-occupier messaging */}
              {suburb.stagingTargetAudience === 'owner-occupiers' && suburb.ownerPercentage && (
                <div className="bg-soft-grey rounded-xl p-6 mb-8">
                  <h3 className="font-bold text-navy-900 mb-3 text-lg">Owner-Occupier Market</h3>
                  <p className="text-slate-700 mb-4">
                    {suburb.name} is predominantly owner-occupied ({suburb.ownerPercentage.toString()}%).
                    Virtual staging helps families visualize living spaces and creates emotional connection with the home.
                  </p>
                  <div className="flex items-start gap-3 bg-white rounded-lg p-4">
                    <span className="material-symbols-outlined text-primary">palette</span>
                    <div>
                      <p className="font-semibold text-navy-900">Recommended styles for {suburb.name}:</p>
                      <p className="text-slate-600">Warm, family-friendly designs with quality furnishings that help buyers envision their family in the space.</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Income-based styling */}
              {suburb.incomeQuartile === 'high' && (
                <div className="bg-primary/10 rounded-xl p-6 mb-8">
                  <div className="flex items-start gap-3">
                    <span className="material-symbols-outlined text-primary">diamond</span>
                    <div>
                      <p className="font-semibold text-navy-900 mb-1">Premium Market</p>
                      <p className="text-slate-700">{suburb.name} buyers expect high-quality presentation. We recommend our <strong>Luxury furniture collection</strong> with designer pieces to match the caliber of properties in this area.</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Room recommendation */}
              {suburb.avgBedrooms && (
                <div className="bg-soft-grey rounded-xl p-6">
                  <div className="flex items-start gap-3">
                    <span className="material-symbols-outlined text-primary">recommend</span>
                    <div>
                      <p className="font-semibold text-navy-900 mb-1">Staging Recommendation</p>
                      <p className="text-slate-700">
                        {suburb.name} properties average {suburb.avgBedrooms.toString()} bedrooms. Our most popular package here is the
                        <strong> {Number(suburb.avgBedrooms) >= 4 ? '5 Room Package' : Number(suburb.avgBedrooms) >= 3 ? '3 Room Package' : 'Single Room'}</strong> covering
                        {Number(suburb.avgBedrooms) >= 4 ? ' living room, master bedroom, and additional living spaces' : Number(suburb.avgBedrooms) >= 3 ? ' living room, master bedroom, and dining area' : ' the key living area'}.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </section>
        )}

        {/* Demographics & Market Profile */}
        {(suburb.medianAge || suburb.population || suburb.familyHouseholds || suburb.primaryDwellingType) && (
          <section className="py-16 px-6 bg-soft-grey">
            <div className="max-w-7xl mx-auto">
              <h2 className="text-3xl font-black mb-8">{suburb.name} Buyer Demographics</h2>
              <p className="text-slate-600 mb-8">Tailoring virtual staging to your target buyer increases engagement and enquiries.</p>

              <div className="grid md:grid-cols-4 gap-6 mb-8">
                {suburb.medianAge && (
                  <div className="bg-white rounded-xl p-6 text-center">
                    <div className="text-3xl font-black text-primary mb-2">{suburb.medianAge}</div>
                    <div className="text-slate-600">Median Age</div>
                    <p className="text-sm text-slate-500 mt-2">
                      {Number(suburb.medianAge) < 35 ? 'Young professionals' : Number(suburb.medianAge) < 45 ? 'Established families' : 'Mature demographic'}
                    </p>
                  </div>
                )}
                {suburb.population && (
                  <div className="bg-white rounded-xl p-6 text-center">
                    <div className="text-3xl font-black text-primary mb-2">{suburb.population.toLocaleString()}</div>
                    <div className="text-slate-600">Population</div>
                  </div>
                )}
                {suburb.primaryDwellingType && (
                  <div className="bg-white rounded-xl p-6 text-center">
                    <div className="text-2xl font-black text-primary mb-2 capitalize">{suburb.primaryDwellingType}s</div>
                    <div className="text-slate-600">Primary Property Type</div>
                  </div>
                )}
                {suburb.medianPrice && (
                  <div className="bg-white rounded-xl p-6 text-center">
                    <div className="text-2xl font-black text-primary mb-2">${suburb.medianPriceFormatted}</div>
                    <div className="text-slate-600">Median Price</div>
                  </div>
                )}
              </div>

              {/* Style recommendations based on demographics */}
              {suburb.medianAge && Number(suburb.medianAge) < 35 && (
                <div className="bg-white rounded-xl p-6 mb-4">
                  <div className="flex items-start gap-3">
                    <span className="material-symbols-outlined text-primary">style</span>
                    <div>
                      <p className="font-semibold text-navy-900 mb-1">Young Professional Style</p>
                      <p className="text-slate-700">With a median age of {suburb.medianAge}, {suburb.name} attracts younger buyers. We recommend <strong>contemporary, minimalist styling</strong> with clean lines, modern furniture, and Instagram-worthy aesthetics.</p>
                    </div>
                  </div>
                </div>
              )}

              {suburb.medianAge && Number(suburb.medianAge) >= 35 && Number(suburb.medianAge) < 50 && suburb.familyHouseholds && (
                <div className="bg-white rounded-xl p-6 mb-4">
                  <div className="flex items-start gap-3">
                    <span className="material-symbols-outlined text-primary">style</span>
                    <div>
                      <p className="font-semibold text-navy-900 mb-1">Family-Oriented Style</p>
                      <p className="text-slate-700">{suburb.name}'s demographic (median age {suburb.medianAge}) suits <strong>warm, liveable family staging</strong>. Include practical elements like study nooks, comfortable living areas, and child-friendly spaces.</p>
                    </div>
                  </div>
                </div>
              )}

              {suburb.coupleNoChildren && suburb.familyHouseholds && Number(suburb.coupleNoChildren) > Number(suburb.familyHouseholds) * 0.5 && (
                <div className="bg-white rounded-xl p-6">
                  <div className="flex items-start gap-3">
                    <span className="material-symbols-outlined text-primary">favorite</span>
                    <div>
                      <p className="font-semibold text-navy-900 mb-1">Couples Market</p>
                      <p className="text-slate-700">{suburb.name} has a significant proportion of couples without children. Staging should emphasize <strong>sophisticated entertaining spaces</strong>, home offices, and lifestyle amenities.</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </section>
        )}

        {suburb.nearbySuburbsFrom && suburb.nearbySuburbsFrom.length > 0 && (
          <section className="py-16 px-6 bg-soft-grey">
            <div className="max-w-7xl mx-auto">
              <h2 className="text-3xl font-black mb-8">Also Serving Nearby Areas</h2>
              <p className="text-slate-600 mb-8">Looking for virtual staging near {suburb.name}? We also serve:</p>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                {suburb.nearbySuburbsFrom.map((nearby: any) => (
                  <Link
                    key={nearby.id}
                    href={`/virtual-staging/${nearby.nearbySuburb.stateSlug}/${nearby.nearbySuburb.slug}/`}
                    className="bg-soft-grey p-4 rounded-lg hover:shadow-md transition-shadow"
                  >
                    <div className="font-semibold text-navy-900">{nearby.nearbySuburb.name}</div>
                    <div className="text-sm text-slate-500">{nearby.distanceKm.toString()}km away</div>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}

        <section className="py-20 px-6 bg-soft-grey">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-4xl font-black mb-12 text-center">Frequently Asked Questions - {suburb.name}</h2>
            <div className="space-y-4">
              <details className="group bg-white rounded-lg">
                <summary className="flex items-center justify-between cursor-pointer p-6 font-semibold text-lg">
                  <span>How much does virtual staging cost in {suburb.name}?</span>
                  <span className="material-symbols-outlined transition-transform group-open:rotate-180">expand_more</span>
                </summary>
                <div className="px-6 pb-6 text-slate-700">
                  <p>Virtual staging in {suburb.name} starts from ${stagingPrice} per room. Our 3-room package (${staging3RoomPrice}) is most popular for {suburb.name} vacant properties and saves you $15 compared to ordering rooms individually.</p>
                </div>
              </details>

              <details className="group bg-white rounded-lg">
                <summary className="flex items-center justify-between cursor-pointer p-6 font-semibold text-lg">
                  <span>How quickly can you deliver virtual staging for {suburb.name}?</span>
                  <span className="material-symbols-outlined transition-transform group-open:rotate-180">expand_more</span>
                </summary>
                <div className="px-6 pb-6 text-slate-700">
                  <p>Virtual staging for {suburb.name} properties is delivered within 24 hours. Simply send us high-quality photos of your empty rooms and we'll have them furnished and ready for your marketing materials the next day.</p>
                </div>
              </details>

              <details className="group bg-white rounded-lg">
                <summary className="flex items-center justify-between cursor-pointer p-6 font-semibold text-lg">
                  <span>What furniture styles are available for {suburb.name}?</span>
                  <span className="material-symbols-outlined transition-transform group-open:rotate-180">expand_more</span>
                </summary>
                <div className="px-6 pb-6 text-slate-700">
                  <p>We offer multiple furniture styles suited to the {suburb.name} market, including Contemporary, Coastal, Luxury, Minimalist, Scandinavian, Industrial, Traditional, and Mid-Century. We can recommend the best style based on your property type and target buyers.</p>
                </div>
              </details>

              {/* Investor market FAQ */}
              {suburb.renterPercentage && Number(suburb.renterPercentage) > 50 && (
                <details className="group bg-white rounded-lg">
                  <summary className="flex items-center justify-between cursor-pointer p-6 font-semibold text-lg">
                    <span>Which staging style works best for {suburb.name}'s investor market?</span>
                    <span className="material-symbols-outlined transition-transform group-open:rotate-180">expand_more</span>
                  </summary>
                  <div className="px-6 pb-6 text-slate-700">
                    <p>With {suburb.renterPercentage.toString()}% of {suburb.name} properties rented, we recommend contemporary neutral styling that appeals to both investors and potential tenants. Clean lines and quality furnishings photograph well and suggest easy-to-maintain living.</p>
                  </div>
                </details>
              )}

              {/* Premium market FAQ */}
              {suburb.incomeQuartile === 'high' && (
                <details className="group bg-white rounded-lg">
                  <summary className="flex items-center justify-between cursor-pointer p-6 font-semibold text-lg">
                    <span>Do you offer luxury staging for high-end {suburb.name} properties?</span>
                    <span className="material-symbols-outlined transition-transform group-open:rotate-180">expand_more</span>
                  </summary>
                  <div className="px-6 pb-6 text-slate-700">
                    <p>Absolutely. {suburb.name}'s affluent market{suburb.medianAnnualIncome ? ` (median income $${Math.round(Number(suburb.medianAnnualIncome) / 1000)}K annually)` : ''} expects premium presentation. Our Luxury collection features designer furniture, art, and accessories that match the caliber of {suburb.name} properties.</p>
                  </div>
                </details>
              )}

              {/* Room count FAQ */}
              {suburb.avgBedrooms && (
                <details className="group bg-white rounded-lg">
                  <summary className="flex items-center justify-between cursor-pointer p-6 font-semibold text-lg">
                    <span>How many rooms should I stage in {suburb.name}?</span>
                    <span className="material-symbols-outlined transition-transform group-open:rotate-180">expand_more</span>
                  </summary>
                  <div className="px-6 pb-6 text-slate-700">
                    <p>{suburb.name} properties average {suburb.avgBedrooms.toString()} bedrooms. We recommend staging at least the living room and master bedroom. For properties with {Number(suburb.avgBedrooms) >= 3 ? '3+ bedrooms, our 3 or 5 Room Package provides best value' : 'up to 2 bedrooms, our Single Room package is usually sufficient'} and covers the key spaces buyers focus on.</p>
                  </div>
                </details>
              )}
            </div>
          </div>
        </section>

        <section className="py-20 px-6 bg-primary text-white">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl font-black mb-4">Ready to Transform Your {suburb.name} Listing?</h2>
            <p className="text-xl mb-8 text-white/90">
              Professional virtual staging from ${stagingPrice} per room. 24-hour delivery. Help buyers visualize your vacant property.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href={`/book/?suburb=${suburb.slug}`} className="bg-white text-primary font-bold px-10 py-4 rounded-lg hover:bg-slate-100 transition-colors">
                Book Online Now
              </Link>
              <a href="tel:1300276463" className="bg-white/10 backdrop-blur border border-white/20 text-white font-bold px-10 py-4 rounded-lg hover:bg-white/20 transition-colors">
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
