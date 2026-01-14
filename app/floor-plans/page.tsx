import { Metadata } from 'next';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export const metadata: Metadata = {
  title: 'Floor Plans Australia | 2D & 3D Property Floor Plans | Australian Property Marketing',
  description: 'Professional floor plans for real estate. 2D and 3D floor plans from $95. 24-hour delivery. Book online today.',
  openGraph: {
    title: 'Floor Plans Australia | Australian Property Marketing',
    description: 'Professional 2D and 3D floor plans from $95. 24-hour delivery.',
    type: 'website',
    locale: 'en_AU',
  },
};

export default async function FloorPlansPage() {
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
            <li className="text-slate-900 font-semibold">Floor Plans</li>
          </ol>
        </nav>

        {/* Hero Section */}
        <section className="relative h-[500px] bg-gradient-to-br from-navy-900 to-slate-800">
          <div className="absolute inset-0 bg-black/40" />
          <div className="relative z-10 max-w-7xl mx-auto px-6 h-full flex flex-col justify-center">
            <h1 className="text-5xl md:text-6xl font-black text-white mb-4">
              Professional Floor Plans
            </h1>
            <p className="text-xl text-white/90 mb-8 max-w-2xl">
              Accurate 2D and 3D floor plans that help buyers understand property layout. From $95 with 24-hour delivery.
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
                <div className="text-3xl font-black text-primary mb-2">$95</div>
                <div className="text-sm text-slate-600">Starting Price</div>
              </div>
              <div className="text-center p-6 bg-soft-grey rounded-xl">
                <div className="text-3xl font-black text-primary mb-2">24hr</div>
                <div className="text-sm text-slate-600">Fast Delivery</div>
              </div>
              <div className="text-center p-6 bg-soft-grey rounded-xl">
                <div className="text-3xl font-black text-primary mb-2">±5%</div>
                <div className="text-sm text-slate-600">Accuracy</div>
              </div>
              <div className="text-center p-6 bg-soft-grey rounded-xl">
                <div className="text-3xl font-black text-primary mb-2">2D/3D</div>
                <div className="text-sm text-slate-600">Both Available</div>
              </div>
            </div>
          </div>
        </section>

        {/* Floor Plan Packages */}
        <section className="py-20 px-6 bg-soft-grey">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-4xl font-black text-center mb-4">Floor Plan Services</h2>
            <p className="text-center text-slate-600 mb-12 max-w-2xl mx-auto">
              Choose from 2D or 3D floor plans to help buyers visualize your property's layout
            </p>

            <div className="grid md:grid-cols-3 gap-8">
              {/* 2D Floor Plan */}
              <div className="bg-white rounded-2xl p-8 shadow-subtle">
                <h3 className="text-2xl font-bold mb-4">2D Floor Plan</h3>
                <div className="mb-6">
                  <span className="text-4xl font-black">$95</span>
                  <span className="text-slate-600 ml-2">+ GST</span>
                </div>
                <ul className="space-y-3 mb-8">
                  <li className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary text-sm">check_circle</span>
                    Professional 2D layout
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary text-sm">check_circle</span>
                    Accurate measurements
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary text-sm">check_circle</span>
                    Room labels & dimensions
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary text-sm">check_circle</span>
                    Total area calculation
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
                  Order 2D Plan
                </Link>
              </div>

              {/* 3D Floor Plan */}
              <div className="bg-white rounded-2xl p-8 shadow-hover border-2 border-primary relative">
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-white text-xs font-bold px-4 py-1 rounded-full">
                  Most Popular
                </span>
                <h3 className="text-2xl font-bold mb-4">3D Floor Plan</h3>
                <div className="mb-6">
                  <span className="text-4xl font-black">$195</span>
                  <span className="text-slate-600 ml-2">+ GST</span>
                </div>
                <ul className="space-y-3 mb-8">
                  <li className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary text-sm">check_circle</span>
                    Photorealistic 3D visualization
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary text-sm">check_circle</span>
                    Furnished rooms
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary text-sm">check_circle</span>
                    Textured finishes
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary text-sm">check_circle</span>
                    Multiple viewing angles
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
                  Order 3D Plan
                </Link>
              </div>

              {/* Complete Package */}
              <div className="bg-white rounded-2xl p-8 shadow-subtle">
                <h3 className="text-2xl font-bold mb-4">2D + 3D Bundle</h3>
                <div className="mb-6">
                  <span className="text-4xl font-black">$249</span>
                  <span className="text-slate-600 ml-2">+ GST</span>
                </div>
                <ul className="space-y-3 mb-8">
                  <li className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary text-sm">check_circle</span>
                    Both 2D & 3D plans
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary text-sm">check_circle</span>
                    Accurate measurements
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary text-sm">check_circle</span>
                    Furnished 3D visualization
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary text-sm">check_circle</span>
                    Multiple file formats
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary text-sm">check_circle</span>
                    Save $41
                  </li>
                </ul>
                <Link
                  href="/book/"
                  className="block text-center bg-slate-100 hover:bg-slate-200 text-navy-900 font-bold py-3 rounded-lg transition-colors"
                >
                  Order Bundle
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Why Floor Plans */}
        <section className="py-20 px-6 bg-white">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-4xl font-black text-center mb-4">Why Include Floor Plans?</h2>
            <p className="text-center text-slate-600 mb-12 max-w-2xl mx-auto">
              Floor plans are now expected by buyers and required by many premium portals
            </p>

            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center p-6">
                <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="material-symbols-outlined text-primary text-3xl">visibility</span>
                </div>
                <h3 className="text-xl font-bold mb-3">30% More Views</h3>
                <p className="text-slate-600">
                  Listings with floor plans receive significantly more views than those without, especially in competitive markets.
                </p>
              </div>

              <div className="text-center p-6">
                <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="material-symbols-outlined text-primary text-3xl">explore</span>
                </div>
                <h3 className="text-xl font-bold mb-3">Better Understanding</h3>
                <p className="text-slate-600">
                  Floor plans help buyers understand room flow, sizes, and how spaces connect - information photos alone can't convey.
                </p>
              </div>

              <div className="text-center p-6">
                <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="material-symbols-outlined text-primary text-3xl">verified</span>
                </div>
                <h3 className="text-xl font-bold mb-3">Portal Requirements</h3>
                <p className="text-slate-600">
                  Premium listings on Domain and realestate.com.au benefit from floor plans, with some tiers requiring them.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* 2D vs 3D */}
        <section className="py-20 px-6 bg-soft-grey">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-4xl font-black text-center mb-12">2D vs 3D Floor Plans</h2>

            <div className="grid md:grid-cols-2 gap-8">
              {/* 2D Benefits */}
              <div className="bg-white p-8 rounded-2xl">
                <h3 className="text-2xl font-bold mb-6 flex items-center gap-3">
                  <span className="material-symbols-outlined text-primary text-3xl">grid_on</span>
                  2D Floor Plans
                </h3>
                <ul className="space-y-4">
                  <li className="flex items-start gap-3">
                    <span className="material-symbols-outlined text-primary text-sm mt-0.5">check</span>
                    <div>
                      <p className="font-semibold mb-1">Clean & Easy to Read</p>
                      <p className="text-slate-600 text-sm">Simple overhead view that's instantly understood by all buyers</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="material-symbols-outlined text-primary text-sm mt-0.5">check</span>
                    <div>
                      <p className="font-semibold mb-1">Accurate Measurements</p>
                      <p className="text-slate-600 text-sm">Shows exact dimensions for every room and space</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="material-symbols-outlined text-primary text-sm mt-0.5">check</span>
                    <div>
                      <p className="font-semibold mb-1">Cost-Effective</p>
                      <p className="text-slate-600 text-sm">Budget-friendly option that still provides essential layout information</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="material-symbols-outlined text-primary text-sm mt-0.5">check</span>
                    <div>
                      <p className="font-semibold mb-1">Portal Compatible</p>
                      <p className="text-slate-600 text-sm">Meets requirements for all major property portals</p>
                    </div>
                  </li>
                </ul>
              </div>

              {/* 3D Benefits */}
              <div className="bg-white p-8 rounded-2xl">
                <h3 className="text-2xl font-bold mb-6 flex items-center gap-3">
                  <span className="material-symbols-outlined text-primary text-3xl">view_in_ar</span>
                  3D Floor Plans
                </h3>
                <ul className="space-y-4">
                  <li className="flex items-start gap-3">
                    <span className="material-symbols-outlined text-primary text-sm mt-0.5">check</span>
                    <div>
                      <p className="font-semibold mb-1">Immersive Visualization</p>
                      <p className="text-slate-600 text-sm">Helps buyers visualize spaces in three dimensions</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="material-symbols-outlined text-primary text-sm mt-0.5">check</span>
                    <div>
                      <p className="font-semibold mb-1">Furnished Spaces</p>
                      <p className="text-slate-600 text-sm">Shows furniture placement and scale within each room</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="material-symbols-outlined text-primary text-sm mt-0.5">check</span>
                    <div>
                      <p className="font-semibold mb-1">Premium Presentation</p>
                      <p className="text-slate-600 text-sm">Elevates your marketing for prestige properties</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="material-symbols-outlined text-primary text-sm mt-0.5">check</span>
                    <div>
                      <p className="font-semibold mb-1">Emotional Connection</p>
                      <p className="text-slate-600 text-sm">Helps buyers imagine themselves living in the space</p>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* What We Need */}
        <section className="py-20 px-6 bg-white">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-4xl font-black mb-12 text-center">How Floor Plan Creation Works</h2>

            <div className="space-y-6">
              <div className="bg-soft-grey p-6 rounded-xl flex gap-4">
                <div className="flex-shrink-0">
                  <div className="bg-primary text-white w-12 h-12 rounded-full flex items-center justify-center font-black text-xl">
                    1
                  </div>
                </div>
                <div>
                  <h3 className="font-bold text-lg mb-2">Book & Schedule</h3>
                  <p className="text-slate-600">
                    Book your floor plan service. If you're also booking photography, we can measure during the photo shoot at no extra charge.
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
                  <h3 className="font-bold text-lg mb-2">Onsite Measurement</h3>
                  <p className="text-slate-600">
                    Our technician visits the property with professional laser measuring equipment to capture accurate dimensions.
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
                  <h3 className="font-bold text-lg mb-2">Professional Drafting</h3>
                  <p className="text-slate-600">
                    Our design team creates your floor plan using professional CAD software, ensuring accuracy and clarity.
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
                    Receive your floor plan within 24 hours in multiple formats (JPEG, PNG, PDF) ready for portals and print.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* What's Included */}
        <section className="py-20 px-6 bg-soft-grey">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-4xl font-black mb-8 text-center">What's Included</h2>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-white p-6 rounded-xl">
                <h3 className="font-bold text-lg mb-3 flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary">straighten</span>
                  Room Dimensions
                </h3>
                <p className="text-slate-700">
                  All rooms labeled with accurate measurements in square meters and/or square feet.
                </p>
              </div>

              <div className="bg-white p-6 rounded-xl">
                <h3 className="font-bold text-lg mb-3 flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary">calculate</span>
                  Total Area Calculation
                </h3>
                <p className="text-slate-700">
                  Internal living area, external areas, and total property area clearly displayed.
                </p>
              </div>

              <div className="bg-white p-6 rounded-xl">
                <h3 className="font-bold text-lg mb-3 flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary">meeting_room</span>
                  Doors & Windows
                </h3>
                <p className="text-slate-700">
                  All doors, windows, and openings marked to show room access and natural light.
                </p>
              </div>

              <div className="bg-white p-6 rounded-xl">
                <h3 className="font-bold text-lg mb-3 flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary">countertops</span>
                  Fixtures & Fittings
                </h3>
                <p className="text-slate-700">
                  Built-in wardrobes, kitchen layouts, bathroom fixtures, and other permanent features.
                </p>
              </div>

              <div className="bg-white p-6 rounded-xl">
                <h3 className="font-bold text-lg mb-3 flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary">import_export</span>
                  Multiple Formats
                </h3>
                <p className="text-slate-700">
                  Delivered in JPEG, PNG, and PDF formats for web, print, and portal use.
                </p>
              </div>

              <div className="bg-white p-6 rounded-xl">
                <h3 className="font-bold text-lg mb-3 flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary">trending_up</span>
                  High Resolution
                </h3>
                <p className="text-slate-700">
                  Print-quality resolution suitable for brochures, signboards, and large format printing.
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
                  href={`/floor-plans/${stateData.stateSlug}/`}
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
                Browse our most popular floor plan locations across Australia
              </p>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {featuredSuburbs.map((suburb) => (
                  <Link
                    key={suburb.id}
                    href={`/floor-plans/${suburb.stateSlug}/${suburb.slug}/`}
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
                      From <span className="font-bold text-primary">${suburb.floorPlanPrice || 95}</span>
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
            <h2 className="text-4xl font-black mb-4">Ready to Add a Floor Plan?</h2>
            <p className="text-xl mb-8 text-white/90">
              Professional floor plans from $95. 24-hour delivery. Accurate measurements guaranteed.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/book/"
                className="bg-white text-primary font-bold px-10 py-4 rounded-lg hover:bg-slate-100 transition-colors"
              >
                Order Floor Plan
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
