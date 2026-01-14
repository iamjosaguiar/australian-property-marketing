import { Metadata } from 'next';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export const metadata: Metadata = {
  title: 'Drone Photography Australia | Aerial Property Photos | Australian Property Marketing',
  description: 'CASA-certified drone photography across Australia. Stunning aerial property photos and video from $295. Book online today.',
  openGraph: {
    title: 'Drone Photography Australia | Australian Property Marketing',
    description: 'CASA-certified aerial photography from $295. Professional drone operators nationwide.',
    type: 'website',
    locale: 'en_AU',
  },
};

// Force dynamic rendering to fetch fresh data from database on each request
export const dynamic = 'force-dynamic';

export default async function DronePhotographyPage() {
  let states: any[] = [];
  let featuredSuburbs: any[] = [];
  let suburbsByState: any[] = [];

  try {
    const { prisma } = await import('@/lib/prisma');

    states = await prisma.state.findMany({
      where: { active: true },
      orderBy: { name: 'asc' },
    });

    featuredSuburbs = await prisma.suburb.findMany({
      where: { active: true, priority: { gte: 8 } },
      orderBy: [{ priority: 'desc' }, { name: 'asc' }],
      take: 12,
    });

    suburbsByState = await (prisma.suburb.groupBy as any)({
      by: ['state', 'stateFull', 'stateSlug'],
      where: { active: true },
      _count: { id: true },
    });
  } catch (error) {
    suburbsByState = [
      { state: 'NSW', stateFull: 'New South Wales', stateSlug: 'nsw', _count: { id: 3 } },
      { state: 'VIC', stateFull: 'Victoria', stateSlug: 'vic', _count: { id: 0 } },
      { state: 'QLD', stateFull: 'Queensland', stateSlug: 'qld', _count: { id: 0 } },
    ];
  }
  return (
    <>
      <Header />
      <main className="min-h-screen pt-20">
        {/* Breadcrumbs */}
        <nav className="bg-soft-grey py-4 px-6" aria-label="Breadcrumb">
          <ol className="max-w-7xl mx-auto flex items-center gap-2 text-sm">
            <li><Link href="/" className="text-slate-600 hover:text-primary">Home</Link></li>
            <li className="text-slate-400">/</li>
            <li className="text-slate-900 font-semibold">Drone Photography</li>
          </ol>
        </nav>

        {/* Hero Section */}
        <section className="relative h-[500px] bg-gradient-to-br from-navy-900 to-slate-800">
          <div className="absolute inset-0 bg-black/40" />
          <div className="relative z-10 max-w-7xl mx-auto px-6 h-full flex flex-col justify-center">
            <h1 className="text-5xl md:text-6xl font-black text-white mb-4">
              Drone Photography & Video
            </h1>
            <p className="text-xl text-white/90 mb-8 max-w-2xl">
              CASA-certified aerial photography and video. Showcase your property from stunning perspectives. From $295 with 24-hour delivery.
            </p>
            <div className="flex gap-4">
              <Link
                href="/book/"
                className="bg-primary hover:bg-primary/90 text-white font-bold px-8 py-4 rounded-lg transition-colors"
              >
                Book Now
              </Link>
              <Link
                href="/pricing/"
                className="bg-white text-navy-900 font-bold px-8 py-4 rounded-lg hover:bg-slate-100 transition-colors"
              >
                View Pricing
              </Link>
            </div>
          </div>
        </section>

        {/* Stats Overview */}
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="text-center p-6 bg-soft-grey rounded-xl">
                <div className="text-3xl font-black text-primary mb-2">$295</div>
                <div className="text-sm text-slate-600">Starting Price</div>
              </div>
              <div className="text-center p-6 bg-soft-grey rounded-xl">
                <div className="text-3xl font-black text-primary mb-2">24hr</div>
                <div className="text-sm text-slate-600">Fast Delivery</div>
              </div>
              <div className="text-center p-6 bg-soft-grey rounded-xl">
                <div className="text-3xl font-black text-primary mb-2">CASA</div>
                <div className="text-sm text-slate-600">Certified Operators</div>
              </div>
              <div className="text-center p-6 bg-soft-grey rounded-xl">
                <div className="text-3xl font-black text-primary mb-2">$5M</div>
                <div className="text-sm text-slate-600">Fully Insured</div>
              </div>
            </div>
          </div>
        </section>

        {/* Drone Packages */}
        <section className="py-20 px-6 bg-soft-grey">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-4xl font-black text-center mb-4">Drone Photography Packages</h2>
            <p className="text-center text-slate-600 mb-12 max-w-2xl mx-auto">
              Professional aerial photography and video to showcase your property and its location
            </p>

            <div className="grid md:grid-cols-3 gap-8">
              {/* Drone Photos */}
              <div className="bg-white rounded-2xl p-8 shadow-subtle">
                <h3 className="text-2xl font-bold mb-4">Drone Photos</h3>
                <div className="mb-6">
                  <span className="text-4xl font-black">$295</span>
                  <span className="text-slate-600 ml-2">+ GST</span>
                </div>
                <ul className="space-y-3 mb-8">
                  <li className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary text-sm">check_circle</span>
                    10 aerial photographs
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary text-sm">check_circle</span>
                    Multiple angles & elevations
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary text-sm">check_circle</span>
                    Professional editing
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary text-sm">check_circle</span>
                    24-hour delivery
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary text-sm">check_circle</span>
                    CASA-certified pilot
                  </li>
                </ul>
                <Link
                  href="/book/"
                  className="block text-center bg-slate-100 hover:bg-slate-200 text-navy-900 font-bold py-3 rounded-lg transition-colors"
                >
                  Book Photos
                </Link>
              </div>

              {/* Drone Video */}
              <div className="bg-white rounded-2xl p-8 shadow-hover border-2 border-primary relative">
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-white text-xs font-bold px-4 py-1 rounded-full">
                  Most Popular
                </span>
                <h3 className="text-2xl font-bold mb-4">Drone Video</h3>
                <div className="mb-6">
                  <span className="text-4xl font-black">$495</span>
                  <span className="text-slate-600 ml-2">+ GST</span>
                </div>
                <ul className="space-y-3 mb-8">
                  <li className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary text-sm">check_circle</span>
                    1-2 minute aerial video
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary text-sm">check_circle</span>
                    Cinematic movements
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
                <Link
                  href="/book/"
                  className="block text-center bg-primary hover:bg-primary/90 text-white font-bold py-3 rounded-lg transition-colors"
                >
                  Book Video
                </Link>
              </div>

              {/* Complete Package */}
              <div className="bg-white rounded-2xl p-8 shadow-subtle">
                <h3 className="text-2xl font-bold mb-4">Complete Package</h3>
                <div className="mb-6">
                  <span className="text-4xl font-black">$695</span>
                  <span className="text-slate-600 ml-2">+ GST</span>
                </div>
                <ul className="space-y-3 mb-8">
                  <li className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary text-sm">check_circle</span>
                    15 aerial photographs
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary text-sm">check_circle</span>
                    2-3 minute aerial video
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary text-sm">check_circle</span>
                    Professional editing
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
                <Link
                  href="/book/"
                  className="block text-center bg-slate-100 hover:bg-slate-200 text-navy-900 font-bold py-3 rounded-lg transition-colors"
                >
                  Book Complete
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Why Drone */}
        <section className="py-20 px-6 bg-white">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-4xl font-black text-center mb-4">Why Use Drone Photography?</h2>
            <p className="text-center text-slate-600 mb-12 max-w-2xl mx-auto">
              Aerial perspectives showcase your property and its location like nothing else
            </p>

            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center p-6">
                <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="material-symbols-outlined text-primary text-3xl">location_on</span>
                </div>
                <h3 className="text-xl font-bold mb-3">Showcase Location</h3>
                <p className="text-slate-600">
                  Highlight proximity to beaches, parks, schools, and other local amenities that ground-level photos can't capture.
                </p>
              </div>

              <div className="text-center p-6">
                <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="material-symbols-outlined text-primary text-3xl">landscape</span>
                </div>
                <h3 className="text-xl font-bold mb-3">Property Scale & Features</h3>
                <p className="text-slate-600">
                  Show the full property size, land dimensions, pools, outdoor entertaining areas, and landscaping.
                </p>
              </div>

              <div className="text-center p-6">
                <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="material-symbols-outlined text-primary text-3xl">auto_awesome</span>
                </div>
                <h3 className="text-xl font-bold mb-3">Premium Presentation</h3>
                <p className="text-slate-600">
                  Aerial photography adds a premium feel to your marketing, making your listing stand out from competitors.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Ideal Properties */}
        <section className="py-20 px-6 bg-soft-grey">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-4xl font-black mb-12 text-center">Ideal For These Property Types</h2>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-white p-6 rounded-xl">
                <div className="flex items-start gap-4">
                  <div className="bg-primary/10 p-3 rounded-lg">
                    <span className="material-symbols-outlined text-primary">home</span>
                  </div>
                  <div>
                    <h3 className="font-bold text-lg mb-2">Large Properties</h3>
                    <p className="text-slate-600 text-sm">
                      Acreage, rural properties, and large blocks where ground photography can't capture the full scale.
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-xl">
                <div className="flex items-start gap-4">
                  <div className="bg-primary/10 p-3 rounded-lg">
                    <span className="material-symbols-outlined text-primary">pool</span>
                  </div>
                  <div>
                    <h3 className="font-bold text-lg mb-2">Outdoor Features</h3>
                    <p className="text-slate-600 text-sm">
                      Properties with pools, tennis courts, outdoor kitchens, or extensive landscaping.
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-xl">
                <div className="flex items-start gap-4">
                  <div className="bg-primary/10 p-3 rounded-lg">
                    <span className="material-symbols-outlined text-primary">apartment</span>
                  </div>
                  <div>
                    <h3 className="font-bold text-lg mb-2">Waterfront & Views</h3>
                    <p className="text-slate-600 text-sm">
                      Beachfront, waterfront, or properties with stunning views that deserve to be showcased from above.
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-xl">
                <div className="flex items-start gap-4">
                  <div className="bg-primary/10 p-3 rounded-lg">
                    <span className="material-symbols-outlined text-primary">apartment</span>
                  </div>
                  <div>
                    <h3 className="font-bold text-lg mb-2">High-Rise Apartments</h3>
                    <p className="text-slate-600 text-sm">
                      Show the building, its facilities, and the surrounding area that makes the location desirable.
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-xl">
                <div className="flex items-start gap-4">
                  <div className="bg-primary/10 p-3 rounded-lg">
                    <span className="material-symbols-outlined text-primary">business</span>
                  </div>
                  <div>
                    <h3 className="font-bold text-lg mb-2">Commercial Properties</h3>
                    <p className="text-slate-600 text-sm">
                      Warehouses, commercial buildings, and developments where location and access are key selling points.
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-xl">
                <div className="flex items-start gap-4">
                  <div className="bg-primary/10 p-3 rounded-lg">
                    <span className="material-symbols-outlined text-primary">cottage</span>
                  </div>
                  <div>
                    <h3 className="font-bold text-lg mb-2">Prestige Properties</h3>
                    <p className="text-slate-600 text-sm">
                      High-end properties where premium marketing with aerial perspectives is expected.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Safety & Compliance */}
        <section className="py-20 px-6 bg-white">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-4xl font-black mb-8 text-center">Safety & Compliance First</h2>

            <div className="space-y-6">
              <div className="bg-soft-grey p-6 rounded-xl">
                <h3 className="font-bold text-lg mb-3 flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary">verified</span>
                  CASA-Certified Operators
                </h3>
                <p className="text-slate-700">
                  All our drone pilots hold current Remote Pilot Licenses (RePL) from CASA (Civil Aviation Safety Authority). We comply with all Australian aviation regulations.
                </p>
              </div>

              <div className="bg-soft-grey p-6 rounded-xl">
                <h3 className="font-bold text-lg mb-3 flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary">security</span>
                  $5 Million Public Liability Insurance
                </h3>
                <p className="text-slate-700">
                  We carry comprehensive insurance coverage for all drone operations, giving you complete peace of mind.
                </p>
              </div>

              <div className="bg-soft-grey p-6 rounded-xl">
                <h3 className="font-bold text-lg mb-3 flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary">policy</span>
                  Flight Planning & Approvals
                </h3>
                <p className="text-slate-700">
                  We handle all necessary flight approvals and airspace checks, ensuring every shoot is conducted safely and legally.
                </p>
              </div>

              <div className="bg-soft-grey p-6 rounded-xl">
                <h3 className="font-bold text-lg mb-3 flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary">settings</span>
                  Professional Equipment
                </h3>
                <p className="text-slate-700">
                  We use commercial-grade drones with redundant safety systems, 4K cameras, and gimbal stabilization for smooth, professional results.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Browse by State */}
        <section className="py-20 px-6 bg-soft-grey">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-4xl font-black text-center mb-12">Browse by State</h2>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {suburbsByState.map((stateData) => (
                <Link
                  key={stateData.state}
                  href={`/drone-photography/${stateData.stateSlug}/`}
                  className="bg-white p-8 rounded-2xl hover:shadow-hover transition-shadow group"
                >
                  <h3 className="text-2xl font-bold mb-2 group-hover:text-primary transition-colors">
                    {stateData.stateFull}
                  </h3>
                  <p className="text-slate-600 mb-4">{stateData._count.id} locations available</p>
                  <div className="flex items-center text-primary font-semibold">
                    View locations
                    <span className="material-symbols-outlined ml-2">arrow_forward</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Featured Suburbs */}
        {featuredSuburbs.length > 0 && (
          <section className="py-20 px-6 bg-white">
            <div className="max-w-7xl mx-auto">
              <h2 className="text-4xl font-black text-center mb-4">Popular Locations</h2>
              <p className="text-center text-slate-600 mb-12 max-w-2xl mx-auto">
                Browse our most popular drone photography locations across Australia
              </p>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {featuredSuburbs.map((suburb) => (
                  <Link
                    key={suburb.id}
                    href={`/drone-photography/${suburb.stateSlug}/${suburb.slug}/`}
                    className="bg-soft-grey p-6 rounded-xl hover:shadow-md transition-shadow group"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="text-lg font-bold group-hover:text-primary transition-colors">
                          {suburb.name}
                        </h3>
                        <p className="text-sm text-slate-500">{suburb.state}</p>
                      </div>
                      <span className="material-symbols-outlined text-slate-400 group-hover:text-primary transition-colors">
                        arrow_forward
                      </span>
                    </div>
                    <div className="text-sm text-slate-600">
                      From <span className="font-bold text-primary">${suburb.dronePrice || 295}</span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* CTA Section */}
        <section className="py-20 px-6 bg-primary text-white">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl font-black mb-4">Ready to Add Drone Photography?</h2>
            <p className="text-xl mb-8 text-white/90">
              CASA-certified aerial photography from $295. 24-hour delivery. Fully insured operators nationwide.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/book/"
                className="bg-white text-primary font-bold px-10 py-4 rounded-lg hover:bg-slate-100 transition-colors"
              >
                Book Drone Shoot
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
