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
      'bondi': { name: 'Bondi', state: 'NSW', videoPrice: 495 },
      'paddington': { name: 'Paddington', state: 'NSW', videoPrice: 495 },
      'surry-hills': { name: 'Surry Hills', state: 'NSW', videoPrice: 495 },
    };
    suburb = suburbMap[suburbSlug];
  }

  if (!suburb) {
    return {
      title: 'Suburb Not Found',
    };
  }

  const videoPrice = suburb.videoPrice || suburb.basePrice || 495;

  return {
    title: `Property Video ${suburb.name} | Real Estate Videography ${suburb.state} | Australian Property Marketing`,
    description: `Professional property video production in ${suburb.name}, ${suburb.state}. From $${videoPrice}. 24-hour delivery. Book online today.`,
    openGraph: {
      title: `Property Video ${suburb.name} | Australian Property Marketing`,
      description: `Professional property videography in ${suburb.name}. From $${videoPrice}. 24-hour delivery.`,
      type: 'website',
      locale: 'en_AU',
    },
  };
}

export default async function SuburbPropertyVideoPage({
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
        videoPrice: 495,
        videoPremiumPrice: 695,
        videoLuxuryPrice: 1295,
        nearbySuburbsFrom: [],
      },
    };
    suburb = suburbMap[suburbSlug] || null;
  }

  if (!suburb) {
    notFound();
  }

  const videoPrice = suburb.videoPrice || suburb.basePrice || 495;
  const videoPremiumPrice = suburb.videoPremiumPrice || suburb.premiumPrice || 695;
  const videoLuxuryPrice = suburb.videoLuxuryPrice || suburb.prestigePrice || 1295;

  return (
    <>
      <Header />
      <main className="min-h-screen pt-20">
        <nav className="bg-soft-grey py-4 px-6" aria-label="Breadcrumb">
          <ol className="max-w-7xl mx-auto flex items-center gap-2 text-sm">
            <li><Link href="/" className="text-slate-600 hover:text-primary">Home</Link></li>
            <li className="text-slate-400">/</li>
            <li><Link href="/property-video/" className="text-slate-600 hover:text-primary">Property Video</Link></li>
            <li className="text-slate-400">/</li>
            <li><Link href={`/property-video/${suburb.stateSlug}/`} className="text-slate-600 hover:text-primary">{suburb.stateFull}</Link></li>
            <li className="text-slate-400">/</li>
            <li className="text-slate-900 font-semibold">{suburb.name}</li>
          </ol>
        </nav>

        <section className="relative h-[500px] bg-gradient-to-br from-navy-900 to-slate-800">
          <div className="absolute inset-0 bg-black/40" />
          <div className="relative z-10 max-w-7xl mx-auto px-6 h-full flex flex-col justify-center">
            <h1 className="text-5xl md:text-6xl font-black text-white mb-4">
              Property Video in {suburb.name}
            </h1>
            <p className="text-xl text-white/90 mb-8 max-w-2xl">
              Professional property video production for {suburb.name} agents and vendors. From ${videoPrice} with 24-hour delivery.
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

        {/* Video Conditions - shows when weather data available */}
        {suburb.annualSunnyDays && (
          <section className="py-16 px-6 bg-white">
            <div className="max-w-7xl mx-auto">
              <h2 className="text-3xl font-black mb-8">Video Filming Conditions in {suburb.name}</h2>

              <div className="grid md:grid-cols-4 gap-6 mb-8">
                <div className="bg-soft-grey rounded-xl p-6 text-center">
                  <div className="text-4xl font-black text-primary mb-2">{suburb.annualSunnyDays}</div>
                  <div className="text-slate-600">Clear Sky Days/Year</div>
                  <p className="text-sm text-slate-500 mt-2">Ideal filming weather</p>
                </div>
                {suburb.goldenHourStart && (
                  <div className="bg-soft-grey rounded-xl p-6 text-center">
                    <div className="text-3xl font-black text-primary mb-2">{suburb.goldenHourStart}</div>
                    <div className="text-slate-600">Golden Hour Start</div>
                    <p className="text-sm text-slate-500 mt-2">Best natural lighting</p>
                  </div>
                )}
                {suburb.avgSunsetTime && (
                  <div className="bg-soft-grey rounded-xl p-6 text-center">
                    <div className="text-3xl font-black text-primary mb-2">{suburb.avgSunsetTime}</div>
                    <div className="text-slate-600">Average Sunset</div>
                    <p className="text-sm text-slate-500 mt-2">Plan twilight shoots</p>
                  </div>
                )}
                {suburb.twilightDuration && (
                  <div className="bg-soft-grey rounded-xl p-6 text-center">
                    <div className="text-4xl font-black text-primary mb-2">{suburb.twilightDuration} min</div>
                    <div className="text-slate-600">Twilight Window</div>
                    <p className="text-sm text-slate-500 mt-2">Usable twilight footage time</p>
                  </div>
                )}
              </div>

              {suburb.bestMonthsPhotography && (
                <div className="bg-soft-grey rounded-xl p-6 mb-6">
                  <div className="flex items-start gap-3">
                    <span className="material-symbols-outlined text-primary">videocam</span>
                    <div>
                      <p className="font-semibold text-navy-900 mb-1">Best Months for Video Production</p>
                      <p className="text-slate-700">{suburb.bestMonthsPhotography} offer the best natural lighting and weather conditions for property video in {suburb.name}.</p>
                    </div>
                  </div>
                </div>
              )}

              {suburb.droneFlightRating && (
                <div className="bg-soft-grey rounded-xl p-6">
                  <div className="flex items-start gap-3">
                    <span className="material-symbols-outlined text-primary">flight</span>
                    <div>
                      <p className="font-semibold text-navy-900 mb-1">Drone Footage Conditions</p>
                      <p className="text-slate-700">
                        {suburb.name} has <strong>{suburb.droneFlightRating}</strong> drone flying conditions.
                        {suburb.droneFlightRating === 'excellent' && ' Our Premium and Luxury packages include stunning aerial footage.'}
                        {suburb.droneFlightRating === 'good' && ' Aerial footage is recommended for most properties in this area.'}
                        {suburb.droneFlightRating === 'moderate' && ' We can schedule drone footage for optimal wind conditions.'}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </section>
        )}

        {/* Market Insights - shows when census data available */}
        {(suburb.medianPrice || suburb.incomeQuartile) && (
          <section className="py-16 px-6 bg-soft-grey">
            <div className="max-w-7xl mx-auto">
              <h2 className="text-3xl font-black mb-8">{suburb.name} Property Market</h2>

              <div className="grid md:grid-cols-3 gap-6 mb-8">
                {suburb.medianPrice && (
                  <div className="bg-white rounded-xl p-6 text-center">
                    <div className="text-3xl font-black text-primary mb-2">${suburb.medianPriceFormatted}</div>
                    <div className="text-slate-600">Median Property Price</div>
                  </div>
                )}
                {suburb.avgBedrooms && (
                  <div className="bg-white rounded-xl p-6 text-center">
                    <div className="text-3xl font-black text-primary mb-2">{suburb.avgBedrooms.toString()}</div>
                    <div className="text-slate-600">Average Bedrooms</div>
                    <p className="text-sm text-slate-500 mt-2">
                      {Number(suburb.avgBedrooms) >= 4 ? 'Larger homes suit longer videos' : 'Compact videos work well'}
                    </p>
                  </div>
                )}
                {suburb.daysOnMarket && (
                  <div className="bg-white rounded-xl p-6 text-center">
                    <div className="text-3xl font-black text-primary mb-2">{suburb.daysOnMarket}</div>
                    <div className="text-slate-600">Avg Days on Market</div>
                  </div>
                )}
              </div>

              {/* Package recommendation based on market */}
              {suburb.incomeQuartile === 'high' && (
                <div className="bg-white rounded-xl p-6">
                  <div className="flex items-start gap-3">
                    <span className="material-symbols-outlined text-primary">star</span>
                    <div>
                      <p className="font-semibold text-navy-900 mb-1">Luxury Package Recommended</p>
                      <p className="text-slate-700">
                        {suburb.name} is a premium market where buyers expect high-quality marketing.
                        Our <strong>Luxury Video Package</strong> with cinematic footage, twilight scenes,
                        and extensive drone coverage is popular with agents here.
                      </p>
                    </div>
                  </div>
                </div>
              )}
              {suburb.incomeQuartile === 'upper-middle' && (
                <div className="bg-white rounded-xl p-6">
                  <div className="flex items-start gap-3">
                    <span className="material-symbols-outlined text-primary">trending_up</span>
                    <div>
                      <p className="font-semibold text-navy-900 mb-1">Premium Package Popular</p>
                      <p className="text-slate-700">
                        {suburb.name} has an active property market. Our <strong>Premium Video Package</strong>
                        with drone footage and professional voice-over is the most popular choice here.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </section>
        )}

        <section className="py-20 px-6 bg-white" id="packages">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-4xl font-black text-center mb-4">Video Packages for {suburb.name}</h2>
            <p className="text-center text-slate-600 mb-12 max-w-2xl mx-auto">
              Choose the video package that suits your {suburb.name} listing
            </p>

            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-white rounded-2xl p-8 shadow-subtle">
                <h3 className="text-2xl font-bold mb-4">Standard Video</h3>
                <div className="mb-6">
                  <span className="text-4xl font-black">${videoPrice}</span>
                  <span className="text-slate-600 ml-2">+ GST</span>
                </div>
                <ul className="space-y-3 mb-8">
                  <li className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary text-sm">check_circle</span>
                    2-3 minute walkthrough video
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary text-sm">check_circle</span>
                    Professional editing & music
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary text-sm">check_circle</span>
                    4K resolution
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary text-sm">check_circle</span>
                    24-hour delivery
                  </li>
                </ul>
                <Link href={`/book/?package=video-standard&suburb=${suburb.slug}`} className="block text-center bg-slate-100 hover:bg-slate-200 text-navy-900 font-bold py-3 rounded-lg transition-colors">
                  Book Standard
                </Link>
              </div>

              <div className="bg-white rounded-2xl p-8 shadow-hover border-2 border-primary relative">
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-white text-xs font-bold px-4 py-1 rounded-full">
                  Most Popular in {suburb.name}
                </span>
                <h3 className="text-2xl font-bold mb-4">Premium Video</h3>
                <div className="mb-6">
                  <span className="text-4xl font-black">${videoPremiumPrice}</span>
                  <span className="text-slate-600 ml-2">+ GST</span>
                </div>
                <ul className="space-y-3 mb-8">
                  <li className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary text-sm">check_circle</span>
                    3-4 minute feature video
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary text-sm">check_circle</span>
                    Drone aerial footage
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary text-sm">check_circle</span>
                    Professional voice-over
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary text-sm">check_circle</span>
                    24-hour delivery
                  </li>
                </ul>
                <Link href={`/book/?package=video-premium&suburb=${suburb.slug}`} className="block text-center bg-primary hover:bg-primary/90 text-white font-bold py-3 rounded-lg transition-colors">
                  Book Premium
                </Link>
              </div>

              <div className="bg-white rounded-2xl p-8 shadow-subtle">
                <h3 className="text-2xl font-bold mb-4">Luxury Video</h3>
                <div className="mb-6">
                  <span className="text-4xl font-black">${videoLuxuryPrice}</span>
                  <span className="text-slate-600 ml-2">+ GST</span>
                </div>
                <ul className="space-y-3 mb-8">
                  <li className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary text-sm">check_circle</span>
                    5-7 minute cinematic video
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary text-sm">check_circle</span>
                    Extensive drone coverage
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary text-sm">check_circle</span>
                    Professional voice-over
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary text-sm">check_circle</span>
                    Twilight footage
                  </li>
                </ul>
                <Link href={`/book/?package=video-luxury&suburb=${suburb.slug}`} className="block text-center bg-slate-100 hover:bg-slate-200 text-navy-900 font-bold py-3 rounded-lg transition-colors">
                  Book Luxury
                </Link>
              </div>
            </div>
          </div>
        </section>

        {suburb.nearbySuburbsFrom && suburb.nearbySuburbsFrom.length > 0 && (
          <section className="py-16 px-6 bg-white">
            <div className="max-w-7xl mx-auto">
              <h2 className="text-3xl font-black mb-8">Also Serving Nearby Areas</h2>
              <p className="text-slate-600 mb-8">Looking for property video near {suburb.name}? We also serve:</p>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                {suburb.nearbySuburbsFrom.map((nearby: any) => (
                  <Link
                    key={nearby.id}
                    href={`/property-video/${nearby.nearbySuburb.stateSlug}/${nearby.nearbySuburb.slug}/`}
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
                  <span>How much does property video cost in {suburb.name}?</span>
                  <span className="material-symbols-outlined transition-transform group-open:rotate-180">expand_more</span>
                </summary>
                <div className="px-6 pb-6 text-slate-700">
                  <p>Property video in {suburb.name} starts from ${videoPrice} for our Standard package (2-3 minute video). Our Premium package (${videoPremiumPrice}) includes drone footage and professional voice-over, and is our most popular choice for {suburb.name} agents.</p>
                </div>
              </details>

              <details className="group bg-white rounded-lg">
                <summary className="flex items-center justify-between cursor-pointer p-6 font-semibold text-lg">
                  <span>How quickly can you film my listing in {suburb.name}?</span>
                  <span className="material-symbols-outlined transition-transform group-open:rotate-180">expand_more</span>
                </summary>
                <div className="px-6 pb-6 text-slate-700">
                  <p>We offer same-day and next-day bookings for {suburb.name} properties, subject to availability. Videos are delivered within 24 hours of filming, professionally edited with music.</p>
                </div>
              </details>

              <details className="group bg-white rounded-lg">
                <summary className="flex items-center justify-between cursor-pointer p-6 font-semibold text-lg">
                  <span>Do you include drone footage for {suburb.name} properties?</span>
                  <span className="material-symbols-outlined transition-transform group-open:rotate-180">expand_more</span>
                </summary>
                <div className="px-6 pb-6 text-slate-700">
                  <p>Drone footage is included in our Premium and Luxury video packages. All our drone operators are CASA-certified. {suburb.droneFlightRating && `${suburb.name} has ${suburb.droneFlightRating} drone flying conditions, making aerial footage ${suburb.droneFlightRating === 'excellent' || suburb.droneFlightRating === 'good' ? 'highly recommended' : 'achievable with good planning'}.`}</p>
                </div>
              </details>

              {suburb.goldenHourStart && (
                <details className="group bg-white rounded-lg">
                  <summary className="flex items-center justify-between cursor-pointer p-6 font-semibold text-lg">
                    <span>When is the best time to film in {suburb.name}?</span>
                    <span className="material-symbols-outlined transition-transform group-open:rotate-180">expand_more</span>
                  </summary>
                  <div className="px-6 pb-6 text-slate-700">
                    <p>The best natural lighting in {suburb.name} is during golden hour, which starts around {suburb.goldenHourStart}. {suburb.twilightDuration && `For twilight footage, we have approximately ${suburb.twilightDuration} minutes of usable shooting time after sunset.`} {suburb.bestMonthsPhotography && `${suburb.bestMonthsPhotography} generally offer the most consistent weather conditions.`}</p>
                  </div>
                </details>
              )}

              {suburb.annualSunnyDays && (
                <details className="group bg-white rounded-lg">
                  <summary className="flex items-center justify-between cursor-pointer p-6 font-semibold text-lg">
                    <span>What if it rains on the scheduled filming day?</span>
                    <span className="material-symbols-outlined transition-transform group-open:rotate-180">expand_more</span>
                  </summary>
                  <div className="px-6 pb-6 text-slate-700">
                    <p>We reschedule at no extra cost if weather conditions are unsuitable. {suburb.name} enjoys approximately {suburb.annualSunnyDays} clear days per year, so rescheduling usually only delays filming by a day or two. We monitor forecasts and will contact you in advance if rescheduling is needed.</p>
                  </div>
                </details>
              )}

              <details className="group bg-white rounded-lg">
                <summary className="flex items-center justify-between cursor-pointer p-6 font-semibold text-lg">
                  <span>Do you offer twilight video for {suburb.name} properties?</span>
                  <span className="material-symbols-outlined transition-transform group-open:rotate-180">expand_more</span>
                </summary>
                <div className="px-6 pb-6 text-slate-700">
                  <p>Yes, twilight footage is included in our Luxury package and can be added to other packages. Twilight video showcases exterior lighting and creates a premium, cinematic feel. {suburb.avgSunsetTime && `In ${suburb.name}, sunset typically occurs around ${suburb.avgSunsetTime}.`} {suburb.twilightDuration && `We have a ${suburb.twilightDuration}-minute window for capturing optimal twilight footage.`}</p>
                </div>
              </details>

              {suburb.avgBedrooms && Number(suburb.avgBedrooms) >= 4 && (
                <details className="group bg-white rounded-lg">
                  <summary className="flex items-center justify-between cursor-pointer p-6 font-semibold text-lg">
                    <span>What video length suits {suburb.name} properties?</span>
                    <span className="material-symbols-outlined transition-transform group-open:rotate-180">expand_more</span>
                  </summary>
                  <div className="px-6 pb-6 text-slate-700">
                    <p>With an average of {suburb.avgBedrooms} bedrooms per property, {suburb.name} homes often benefit from our Premium (3-4 minute) or Luxury (5-7 minute) video packages. Longer videos allow time to showcase multiple living areas, outdoor spaces, and neighbourhood features.</p>
                  </div>
                </details>
              )}
            </div>
          </div>
        </section>

        <section className="py-20 px-6 bg-primary text-white">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl font-black mb-4">Ready to Book Your {suburb.name} Video?</h2>
            <p className="text-xl mb-8 text-white/90">
              Professional property video from ${videoPrice}. 24-hour delivery. Trusted by {suburb.name} agents.
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
