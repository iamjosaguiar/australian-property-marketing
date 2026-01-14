import { Metadata } from 'next';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export const metadata: Metadata = {
  title: 'Property Video Australia | Real Estate Videography | Australian Property Marketing',
  description: 'Professional property video production across Australia. Cinematic walkthrough videos from $495. 24-hour delivery. Book online today.',
  openGraph: {
    title: 'Property Video Australia | Australian Property Marketing',
    description: 'Cinematic property videos from $495. 24-hour delivery across Australia.',
    type: 'website',
    locale: 'en_AU',
  },
};

export default async function PropertyVideoPage() {
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
            <li className="text-slate-900 font-semibold">Property Video</li>
          </ol>
        </nav>

        {/* Hero Section */}
        <section className="relative h-[500px] bg-gradient-to-br from-navy-900 to-slate-800">
          <div className="absolute inset-0 bg-black/40" />
          <div className="relative z-10 max-w-7xl mx-auto px-6 h-full flex flex-col justify-center">
            <h1 className="text-5xl md:text-6xl font-black text-white mb-4">
              Property Video Production
            </h1>
            <p className="text-xl text-white/90 mb-8 max-w-2xl">
              Cinematic property videos that engage buyers and increase enquiries. From $495 with 24-hour delivery. Professional editing included.
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
                <div className="text-3xl font-black text-primary mb-2">$495</div>
                <div className="text-sm text-slate-600">Starting Price</div>
              </div>
              <div className="text-center p-6 bg-soft-grey rounded-xl">
                <div className="text-3xl font-black text-primary mb-2">24hr</div>
                <div className="text-sm text-slate-600">Video Delivery</div>
              </div>
              <div className="text-center p-6 bg-soft-grey rounded-xl">
                <div className="text-3xl font-black text-primary mb-2">4K</div>
                <div className="text-sm text-slate-600">Ultra HD Quality</div>
              </div>
              <div className="text-center p-6 bg-soft-grey rounded-xl">
                <div className="text-3xl font-black text-primary mb-2">2-3min</div>
                <div className="text-sm text-slate-600">Perfect Length</div>
              </div>
            </div>
          </div>
        </section>

        {/* Video Packages */}
        <section className="py-20 px-6 bg-soft-grey">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-4xl font-black text-center mb-4">Property Video Packages</h2>
            <p className="text-center text-slate-600 mb-12 max-w-2xl mx-auto">
              Professional property videos designed to showcase your listing and drive buyer engagement
            </p>

            <div className="grid md:grid-cols-3 gap-8">
              {/* Standard Video */}
              <div className="bg-white rounded-2xl p-8 shadow-subtle">
                <h3 className="text-2xl font-bold mb-4">Standard Video</h3>
                <div className="mb-6">
                  <span className="text-4xl font-black">$495</span>
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
                <Link
                  href="/book/"
                  className="block text-center bg-slate-100 hover:bg-slate-200 text-navy-900 font-bold py-3 rounded-lg transition-colors"
                >
                  Book Standard
                </Link>
              </div>

              {/* Premium Video */}
              <div className="bg-white rounded-2xl p-8 shadow-hover border-2 border-primary relative">
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-white text-xs font-bold px-4 py-1 rounded-full">
                  Most Popular
                </span>
                <h3 className="text-2xl font-bold mb-4">Premium Video</h3>
                <div className="mb-6">
                  <span className="text-4xl font-black">$695</span>
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
                  Book Premium
                </Link>
              </div>

              {/* Luxury Video */}
              <div className="bg-white rounded-2xl p-8 shadow-subtle">
                <h3 className="text-2xl font-bold mb-4">Luxury Video</h3>
                <div className="mb-6">
                  <span className="text-4xl font-black">$1,295</span>
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
                  <li className="flex items-center gap-2">
                    <span className="material-symbols-oriented text-primary text-sm">check_circle</span>
                    Custom music selection
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary text-sm">check_circle</span>
                    4K resolution
                  </li>
                </ul>
                <Link
                  href="/book/"
                  className="block text-center bg-slate-100 hover:bg-slate-200 text-navy-900 font-bold py-3 rounded-lg transition-colors"
                >
                  Book Luxury
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Why Video */}
        <section className="py-20 px-6 bg-white">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-4xl font-black text-center mb-4">Why Property Video?</h2>
            <p className="text-center text-slate-600 mb-12 max-w-2xl mx-auto">
              Video is proven to increase buyer engagement and generate more enquiries for your listing
            </p>

            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center p-6">
                <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="material-symbols-outlined text-primary text-3xl">trending_up</span>
                </div>
                <h3 className="text-xl font-bold mb-3">4x More Enquiries</h3>
                <p className="text-slate-600">
                  Listings with video receive up to 4 times more enquiries than those with photos alone.
                </p>
              </div>

              <div className="text-center p-6">
                <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="material-symbols-outlined text-primary text-3xl">visibility</span>
                </div>
                <h3 className="text-xl font-bold mb-3">Better Engagement</h3>
                <p className="text-slate-600">
                  Video keeps buyers on your listing longer, helping them emotionally connect with the property.
                </p>
              </div>

              <div className="text-center p-6">
                <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="material-symbols-outlined text-primary text-3xl">share</span>
                </div>
                <h3 className="text-xl font-bold mb-3">Social Media Ready</h3>
                <p className="text-slate-600">
                  Perfect for sharing on social media, generating organic reach and buyer interest.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Our Process */}
        <section className="py-20 px-6 bg-soft-grey">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-4xl font-black mb-12 text-center">Our Video Production Process</h2>

            <div className="space-y-6">
              <div className="bg-white p-6 rounded-xl flex gap-4">
                <div className="flex-shrink-0">
                  <div className="bg-primary text-white w-12 h-12 rounded-full flex items-center justify-center font-black text-xl">
                    1
                  </div>
                </div>
                <div>
                  <h3 className="font-bold text-lg mb-2">Book Your Video Shoot</h3>
                  <p className="text-slate-600">
                    Choose your package and preferred time slot. We offer same-day and next-day availability.
                  </p>
                </div>
              </div>

              <div className="bg-white p-6 rounded-xl flex gap-4">
                <div className="flex-shrink-0">
                  <div className="bg-primary text-white w-12 h-12 rounded-full flex items-center justify-center font-black text-xl">
                    2
                  </div>
                </div>
                <div>
                  <h3 className="font-bold text-lg mb-2">Professional Filming</h3>
                  <p className="text-slate-600">
                    Our videographer captures your property with professional 4K cameras, gimbal stabilization, and drone (if included).
                  </p>
                </div>
              </div>

              <div className="bg-white p-6 rounded-xl flex gap-4">
                <div className="flex-shrink-0">
                  <div className="bg-primary text-white w-12 h-12 rounded-full flex items-center justify-center font-black text-xl">
                    3
                  </div>
                </div>
                <div>
                  <h3 className="font-bold text-lg mb-2">Expert Editing</h3>
                  <p className="text-slate-600">
                    Our editors craft a compelling narrative with professional color grading, music, and voice-over (if included).
                  </p>
                </div>
              </div>

              <div className="bg-white p-6 rounded-xl flex gap-4">
                <div className="flex-shrink-0">
                  <div className="bg-primary text-white w-12 h-12 rounded-full flex items-center justify-center font-black text-xl">
                    4
                  </div>
                </div>
                <div>
                  <h3 className="font-bold text-lg mb-2">24-Hour Delivery</h3>
                  <p className="text-slate-600">
                    Your finished video is delivered within 24 hours in multiple formats optimized for web, social media, and portals.
                  </p>
                </div>
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
                  href={`/property-video/${stateData.stateSlug}/`}
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
                Browse our most popular property video locations across Australia
              </p>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {featuredSuburbs.map((suburb) => (
                  <Link
                    key={suburb.id}
                    href={`/property-video/${suburb.stateSlug}/${suburb.slug}/`}
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
                      From <span className="font-bold text-primary">${suburb.videoPrice || suburb.basePrice || 495}</span>
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
            <h2 className="text-4xl font-black mb-4">Ready to Create Your Property Video?</h2>
            <p className="text-xl mb-8 text-white/90">
              Professional property videos from $495. 24-hour delivery. Same-day availability in most locations.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/book/"
                className="bg-white text-primary font-bold px-10 py-4 rounded-lg hover:bg-slate-100 transition-colors"
              >
                Book Video Shoot
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
