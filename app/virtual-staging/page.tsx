import { Metadata } from 'next';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export const metadata: Metadata = {
  title: 'Virtual Staging Australia | Digital Furniture Staging | Australian Property Marketing',
  description: 'Professional virtual staging for real estate. Transform vacant properties from $48 per room. 24-hour delivery. Book online today.',
  openGraph: {
    title: 'Virtual Staging Australia | Australian Property Marketing',
    description: 'Virtual furniture staging from $48 per room. Transform empty spaces digitally.',
    type: 'website',
    locale: 'en_AU',
  },
};

export default async function VirtualStagingPage() {
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
            <li className="text-slate-900 font-semibold">Virtual Staging</li>
          </ol>
        </nav>

        {/* Hero Section */}
        <section className="relative h-[500px] bg-gradient-to-br from-navy-900 to-slate-800">
          <div className="absolute inset-0 bg-black/40" />
          <div className="relative z-10 max-w-7xl mx-auto px-6 h-full flex flex-col justify-center">
            <h1 className="text-5xl md:text-6xl font-black text-white mb-4">
              Virtual Staging Services
            </h1>
            <p className="text-xl text-white/90 mb-8 max-w-2xl">
              Transform vacant properties with photorealistic digital furniture. From $48 per room with 24-hour delivery. Help buyers visualize the potential.
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
                <div className="text-3xl font-black text-primary mb-2">$48</div>
                <div className="text-sm text-slate-600">Per Room</div>
              </div>
              <div className="text-center p-6 bg-soft-grey rounded-xl">
                <div className="text-3xl font-black text-primary mb-2">24hr</div>
                <div className="text-sm text-slate-600">Fast Delivery</div>
              </div>
              <div className="text-center p-6 bg-soft-grey rounded-xl">
                <div className="text-3xl font-black text-primary mb-2">100+</div>
                <div className="text-sm text-slate-600">Furniture Styles</div>
              </div>
              <div className="text-center p-6 bg-soft-grey rounded-xl">
                <div className="text-3xl font-black text-primary mb-2">4K</div>
                <div className="text-sm text-slate-600">High Resolution</div>
              </div>
            </div>
          </div>
        </section>

        {/* Pricing */}
        <section className="py-20 px-6 bg-soft-grey">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-4xl font-black text-center mb-4">Virtual Staging Pricing</h2>
            <p className="text-center text-slate-600 mb-12 max-w-2xl mx-auto">
              Affordable, professional virtual staging to help vacant properties sell faster
            </p>

            <div className="grid md:grid-cols-3 gap-8">
              {/* Single Room */}
              <div className="bg-white rounded-2xl p-8 shadow-subtle">
                <h3 className="text-2xl font-bold mb-4">Single Room</h3>
                <div className="mb-6">
                  <span className="text-4xl font-black">$48</span>
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
                <Link
                  href="/book/"
                  className="block text-center bg-slate-100 hover:bg-slate-200 text-navy-900 font-bold py-3 rounded-lg transition-colors"
                >
                  Order 1 Room
                </Link>
              </div>

              {/* 3 Room Package */}
              <div className="bg-white rounded-2xl p-8 shadow-hover border-2 border-primary relative">
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-white text-xs font-bold px-4 py-1 rounded-full">
                  Most Popular
                </span>
                <h3 className="text-2xl font-bold mb-4">3 Room Package</h3>
                <div className="mb-6">
                  <span className="text-4xl font-black">$129</span>
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
                    24-hour delivery
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary text-sm">check_circle</span>
                    Save $15
                  </li>
                </ul>
                <Link
                  href="/book/"
                  className="block text-center bg-primary hover:bg-primary/90 text-white font-bold py-3 rounded-lg transition-colors"
                >
                  Order 3 Rooms
                </Link>
              </div>

              {/* 5 Room Package */}
              <div className="bg-white rounded-2xl p-8 shadow-subtle">
                <h3 className="text-2xl font-bold mb-4">5 Room Package</h3>
                <div className="mb-6">
                  <span className="text-4xl font-black">$195</span>
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
                    24-hour delivery
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary text-sm">check_circle</span>
                    Save $45
                  </li>
                </ul>
                <Link
                  href="/book/"
                  className="block text-center bg-slate-100 hover:bg-slate-200 text-navy-900 font-bold py-3 rounded-lg transition-colors"
                >
                  Order 5 Rooms
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Why Virtual Staging */}
        <section className="py-20 px-6 bg-white">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-4xl font-black text-center mb-4">Why Virtual Staging?</h2>
            <p className="text-center text-slate-600 mb-12 max-w-2xl mx-auto">
              Virtual staging helps buyers visualize the potential of vacant properties at a fraction of the cost of physical staging
            </p>

            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center p-6">
                <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="material-symbols-outlined text-primary text-3xl">savings</span>
                </div>
                <h3 className="text-xl font-bold mb-3">97% Cost Savings</h3>
                <p className="text-slate-600">
                  Virtual staging costs a fraction of traditional staging, typically saving thousands of dollars per property.
                </p>
              </div>

              <div className="text-center p-6">
                <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="material-symbols-outlined text-primary text-3xl">speed</span>
                </div>
                <h3 className="text-xl font-bold mb-3">Instant Results</h3>
                <p className="text-slate-600">
                  No need to wait for furniture delivery or setup. Virtual staging is delivered within 24 hours of receiving photos.
                </p>
              </div>

              <div className="text-center p-6">
                <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="material-symbols-outlined text-primary text-3xl">psychology</span>
                </div>
                <h3 className="text-xl font-bold mb-3">Helps Buyers Visualize</h3>
                <p className="text-slate-600">
                  Empty rooms feel smaller and cold. Furnished rooms help buyers emotionally connect and visualize living there.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Furniture Styles */}
        <section className="py-20 px-6 bg-soft-grey">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-4xl font-black text-center mb-12">Available Furniture Styles</h2>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white p-6 rounded-xl">
                <h3 className="font-bold text-lg mb-2">Contemporary</h3>
                <p className="text-slate-600 text-sm">
                  Clean lines, neutral colors, and modern furniture for today's buyers.
                </p>
              </div>

              <div className="bg-white p-6 rounded-xl">
                <h3 className="font-bold text-lg mb-2">Coastal</h3>
                <p className="text-slate-600 text-sm">
                  Light, breezy aesthetic perfect for beachside and waterfront properties.
                </p>
              </div>

              <div className="bg-white p-6 rounded-xl">
                <h3 className="font-bold text-lg mb-2">Luxury</h3>
                <p className="text-slate-600 text-sm">
                  High-end furniture and finishes for prestige properties.
                </p>
              </div>

              <div className="bg-white p-6 rounded-xl">
                <h3 className="font-bold text-lg mb-2">Minimalist</h3>
                <p className="text-slate-600 text-sm">
                  Simple, uncluttered design that highlights the space itself.
                </p>
              </div>

              <div className="bg-white p-6 rounded-xl">
                <h3 className="font-bold text-lg mb-2">Scandinavian</h3>
                <p className="text-slate-600 text-sm">
                  Warm woods, simple lines, and cozy textiles for a welcoming feel.
                </p>
              </div>

              <div className="bg-white p-6 rounded-xl">
                <h3 className="font-bold text-lg mb-2">Industrial</h3>
                <p className="text-slate-600 text-sm">
                  Exposed materials and urban styling for warehouse conversions and lofts.
                </p>
              </div>

              <div className="bg-white p-6 rounded-xl">
                <h3 className="font-bold text-lg mb-2">Traditional</h3>
                <p className="text-slate-600 text-sm">
                  Classic furniture styles for heritage homes and period properties.
                </p>
              </div>

              <div className="bg-white p-6 rounded-xl">
                <h3 className="font-bold text-lg mb-2">Mid-Century</h3>
                <p className="text-slate-600 text-sm">
                  Retro-modern pieces popular with design-conscious buyers.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section className="py-20 px-6 bg-white">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-4xl font-black mb-12 text-center">How Virtual Staging Works</h2>

            <div className="space-y-6">
              <div className="bg-soft-grey p-6 rounded-xl flex gap-4">
                <div className="flex-shrink-0">
                  <div className="bg-primary text-white w-12 h-12 rounded-full flex items-center justify-center font-black text-xl">
                    1
                  </div>
                </div>
                <div>
                  <h3 className="font-bold text-lg mb-2">Send Us Your Photos</h3>
                  <p className="text-slate-600">
                    Provide high-quality photos of the empty rooms you want staged. We need well-lit, straight-on shots for best results.
                  </p>
                </div>
              </div>

              <div className="bg-soft-grey p-6 rounded-xl flex gap-4">
                <div className="flex-shrink-0">
                  <div className="bg-primary text-white w-12 h-12 rounded-full flex items-center justify-center font-black text-xl">
                    2
                  </div>
                </div>
                <div>
                  <h3 className="font-bold text-lg mb-2">Choose Your Style</h3>
                  <p className="text-slate-600">
                    Select from our range of furniture styles, or let us choose what works best for your property type and market.
                  </p>
                </div>
              </div>

              <div className="bg-soft-grey p-6 rounded-xl flex gap-4">
                <div className="flex-shrink-0">
                  <div className="bg-primary text-white w-12 h-12 rounded-full flex items-center justify-center font-black text-xl">
                    3
                  </div>
                </div>
                <div>
                  <h3 className="font-bold text-lg mb-2">Professional Staging</h3>
                  <p className="text-slate-600">
                    Our designers digitally furnish each room with photorealistic furniture, ensuring proper scale and lighting.
                  </p>
                </div>
              </div>

              <div className="bg-soft-grey p-6 rounded-xl flex gap-4">
                <div className="flex-shrink-0">
                  <div className="bg-primary text-white w-12 h-12 rounded-full flex items-center justify-center font-black text-xl">
                    4
                  </div>
                </div>
                <div>
                  <h3 className="font-bold text-lg mb-2">24-Hour Delivery</h3>
                  <p className="text-slate-600">
                    Receive your virtually staged images within 24 hours, ready to upload to property portals and marketing materials.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Best Practices */}
        <section className="py-20 px-6 bg-soft-grey">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-4xl font-black mb-8 text-center">Virtual Staging Best Practices</h2>

            <div className="space-y-6">
              <div className="bg-white p-6 rounded-xl">
                <h3 className="font-bold text-lg mb-3 flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary">photo_camera</span>
                  Quality Photos Required
                </h3>
                <p className="text-slate-700">
                  Virtual staging requires well-lit, high-resolution photos taken from eye level. Poor quality photos will result in poor staging results.
                </p>
              </div>

              <div className="bg-white p-6 rounded-xl">
                <h3 className="font-bold text-lg mb-3 flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary">info</span>
                  Disclosure Required
                </h3>
                <p className="text-slate-700">
                  Real Estate regulations require disclosure that images are virtually staged. We recommend adding "Virtually Staged" watermarks or captions.
                </p>
              </div>

              <div className="bg-white p-6 rounded-xl">
                <h3 className="font-bold text-lg mb-3 flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary">compare</span>
                  Provide Before & After
                </h3>
                <p className="text-slate-700">
                  Consider showing both the empty and staged versions so buyers understand what's included with the property.
                </p>
              </div>

              <div className="bg-white p-6 rounded-xl">
                <h3 className="font-bold text-lg mb-3 flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary">design_services</span>
                  Focus on Key Rooms
                </h3>
                <p className="text-slate-700">
                  Stage the main living areas, master bedroom, and any rooms that are difficult to visualize when empty. Bathrooms and kitchens rarely need staging.
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
                  href={`/virtual-staging/${stateData.stateSlug}/`}
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
                Browse our most popular virtual staging locations across Australia
              </p>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {featuredSuburbs.map((suburb) => (
                  <Link
                    key={suburb.id}
                    href={`/virtual-staging/${suburb.stateSlug}/${suburb.slug}/`}
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
                      From <span className="font-bold text-primary">${suburb.stagingPrice || 48}</span> per room
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
            <h2 className="text-4xl font-black mb-4">Ready to Transform Your Listing?</h2>
            <p className="text-xl mb-8 text-white/90">
              Professional virtual staging from $48 per room. 24-hour delivery. Help buyers fall in love with your property.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/book/"
                className="bg-white text-primary font-bold px-10 py-4 rounded-lg hover:bg-slate-100 transition-colors"
              >
                Order Virtual Staging
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
