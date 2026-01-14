import { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export const metadata: Metadata = {
  title: 'Real Estate Photography Australia | Professional Property Photos | Australian Property Marketing',
  description: 'Professional real estate photography across Australia. From $295 with 24-hour delivery. Trusted by 1000+ agents nationwide. Book online today.',
  openGraph: {
    title: 'Real Estate Photography Australia | Australian Property Marketing',
    description: 'Professional property photography from $295. 24-hour delivery across Australia.',
    type: 'website',
    locale: 'en_AU',
  },
};

// Force dynamic rendering to fetch fresh data from database on each request
export const dynamic = 'force-dynamic';

export default async function RealEstatePhotographyPage() {
  // Fetch states with suburb counts (with fallback if DB not set up)
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
      by: ['state', 'stateFull'],
      where: { active: true },
      _count: { id: true },
    });
  } catch (error) {
    // Database not set up - use placeholder data
    suburbsByState = [
      { state: 'NSW', stateFull: 'New South Wales', _count: { id: 3 } },
      { state: 'VIC', stateFull: 'Victoria', _count: { id: 0 } },
      { state: 'QLD', stateFull: 'Queensland', _count: { id: 0 } },
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
          <li className="text-slate-900 font-semibold">Real Estate Photography</li>
        </ol>
      </nav>

      {/* Hero Section */}
      <section className="relative h-[500px] bg-gradient-to-br from-navy-900 to-slate-800">
        <div className="absolute inset-0 bg-black/40" />
        <div className="relative z-10 max-w-7xl mx-auto px-6 h-full flex flex-col justify-center">
          <h1 className="text-5xl md:text-6xl font-black text-white mb-4">
            Real Estate Photography Australia
          </h1>
          <p className="text-xl text-white/90 mb-8 max-w-2xl">
            Professional property photography across Australia. From $295 with 24-hour delivery. Trusted by 1000+ agents nationwide.
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

      {/* Service Overview */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-black text-center mb-4">Why Choose Australian Property Marketing?</h2>
          <p className="text-center text-slate-600 mb-12 max-w-2xl mx-auto">
            We're Australia's trusted property photography partner, delivering exceptional results for agents and vendors nationwide.
          </p>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="material-symbols-outlined text-primary text-3xl">photo_camera</span>
              </div>
              <h3 className="text-xl font-bold mb-3">Professional Quality</h3>
              <p className="text-slate-600">
                Expert photographers using professional equipment to showcase your property at its absolute best.
              </p>
            </div>

            <div className="text-center p-6">
              <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="material-symbols-outlined text-primary text-3xl">schedule</span>
              </div>
              <h3 className="text-xl font-bold mb-3">24-Hour Delivery</h3>
              <p className="text-slate-600">
                Fast turnaround with professionally edited images delivered within 24 hours of your shoot.
              </p>
            </div>

            <div className="text-center p-6">
              <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="material-symbols-outlined text-primary text-3xl">verified</span>
              </div>
              <h3 className="text-xl font-bold mb-3">Trusted Nationwide</h3>
              <p className="text-slate-600">
                1000+ satisfied agents across Australia trust us for their property marketing needs.
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
                href={`/real-estate-photography/${stateData.state.toLowerCase()}/`}
                className="bg-white p-8 rounded-2xl hover:shadow-hover transition-shadow group"
              >
                <h3 className="text-2xl font-bold mb-2 group-hover:text-primary transition-colors">
                  {stateData.stateFull}
                </h3>
                <p className="text-slate-600 mb-4">{stateData._count.id} suburbs available</p>
                <div className="flex items-center text-primary font-semibold">
                  View suburbs
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
              Browse our most popular photography locations across Australia
            </p>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {featuredSuburbs.map((suburb) => (
                <Link
                  key={suburb.id}
                  href={`/real-estate-photography/${suburb.stateSlug}/${suburb.slug}/`}
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
                    From <span className="font-bold text-primary">${suburb.basePrice}</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Pricing Overview */}
      <section className="py-20 px-6 bg-soft-grey">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-4xl font-black mb-4">Simple, Transparent Pricing</h2>
          <p className="text-slate-600 mb-8 max-w-2xl mx-auto">
            Choose from three packages designed to suit every property type and budget
          </p>

          <div className="grid md:grid-cols-3 gap-8 mb-12">
            <div className="bg-white p-8 rounded-2xl">
              <h3 className="text-2xl font-bold mb-4">Essential</h3>
              <div className="mb-6">
                <span className="text-4xl font-black">$295</span>
                <span className="text-slate-600"> + GST</span>
              </div>
              <p className="text-slate-600">15 professional photos with 24-hour delivery</p>
            </div>

            <div className="bg-white p-8 rounded-2xl border-2 border-primary">
              <div className="bg-primary text-white text-xs font-bold px-3 py-1 rounded-full inline-block mb-3">
                Most Popular
              </div>
              <h3 className="text-2xl font-bold mb-4">Premium</h3>
              <div className="mb-6">
                <span className="text-4xl font-black">$495</span>
                <span className="text-slate-600"> + GST</span>
              </div>
              <p className="text-slate-600">25 photos + floor plan included</p>
            </div>

            <div className="bg-white p-8 rounded-2xl">
              <h3 className="text-2xl font-bold mb-4">Prestige</h3>
              <div className="mb-6">
                <span className="text-4xl font-black">$895</span>
                <span className="text-slate-600"> + GST</span>
              </div>
              <p className="text-slate-600">40 photos + twilight + drone + video</p>
            </div>
          </div>

          <Link
            href="/pricing/"
            className="inline-block bg-primary hover:bg-primary/90 text-white font-bold px-10 py-4 rounded-lg transition-colors"
          >
            View Full Pricing
          </Link>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6 bg-primary text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-black mb-4">Ready to Get Started?</h2>
          <p className="text-xl mb-8 text-white/90">
            Book your property photography shoot today. Same-day and next-day availability across Australia.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/book/"
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
