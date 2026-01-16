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
      'bondi': { name: 'Bondi', state: 'NSW', floorPlanPrice: 95 },
      'paddington': { name: 'Paddington', state: 'NSW', floorPlanPrice: 95 },
      'surry-hills': { name: 'Surry Hills', state: 'NSW', floorPlanPrice: 95 },
    };
    suburb = suburbMap[suburbSlug];
  }

  if (!suburb) {
    return {
      title: 'Suburb Not Found',
    };
  }

  const floorPlanPrice = suburb.floorPlanPrice || 95;

  return {
    title: `Floor Plans ${suburb.name} | 2D & 3D Property Floor Plans ${suburb.state} | Australian Property Marketing`,
    description: `Professional floor plans in ${suburb.name}, ${suburb.state}. 2D and 3D plans from $${floorPlanPrice}. 24-hour delivery. Book online today.`,
    openGraph: {
      title: `Floor Plans ${suburb.name} | Australian Property Marketing`,
      description: `Professional 2D and 3D floor plans in ${suburb.name}. From $${floorPlanPrice}. 24-hour delivery.`,
      type: 'website',
      locale: 'en_AU',
    },
  };
}

export default async function SuburbFloorPlansPage({
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
        floorPlanPrice: 95,
        floorPlan3DPrice: 195,
        floorPlanBundlePrice: 249,
        nearbySuburbsFrom: [],
      },
    };
    suburb = suburbMap[suburbSlug] || null;
  }

  if (!suburb) {
    notFound();
  }

  const floorPlanPrice = suburb.floorPlanPrice || 95;
  const floorPlan3DPrice = suburb.floorPlan3DPrice || 195;
  const floorPlanBundlePrice = suburb.floorPlanBundlePrice || 249;

  return (
    <>
      <Header />
      <main className="min-h-screen pt-20">
        <nav className="bg-soft-grey py-4 px-6" aria-label="Breadcrumb">
          <ol className="max-w-7xl mx-auto flex items-center gap-2 text-sm">
            <li><Link href="/" className="text-slate-600 hover:text-primary">Home</Link></li>
            <li className="text-slate-400">/</li>
            <li><Link href="/floor-plans/" className="text-slate-600 hover:text-primary">Floor Plans</Link></li>
            <li className="text-slate-400">/</li>
            <li><Link href={`/floor-plans/${suburb.stateSlug}/`} className="text-slate-600 hover:text-primary">{suburb.stateFull}</Link></li>
            <li className="text-slate-400">/</li>
            <li className="text-slate-900 font-semibold">{suburb.name}</li>
          </ol>
        </nav>

        <section className="relative h-[500px] bg-gradient-to-br from-navy-900 to-slate-800">
          <div className="absolute inset-0 bg-black/40" />
          <div className="relative z-10 max-w-7xl mx-auto px-6 h-full flex flex-col justify-center">
            <h1 className="text-5xl md:text-6xl font-black text-white mb-4">
              Floor Plans in {suburb.name}
            </h1>
            <p className="text-xl text-white/90 mb-8 max-w-2xl">
              Professional 2D and 3D floor plans for {suburb.name} properties. From ${floorPlanPrice} with 24-hour delivery.
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
            <h2 className="text-4xl font-black text-center mb-4">Floor Plan Services for {suburb.name}</h2>
            <p className="text-center text-slate-600 mb-12 max-w-2xl mx-auto">
              Accurate floor plans to help buyers understand your {suburb.name} property layout
            </p>

            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-white rounded-2xl p-8 shadow-subtle">
                <h3 className="text-2xl font-bold mb-4">2D Floor Plan</h3>
                <div className="mb-6">
                  <span className="text-4xl font-black">${floorPlanPrice}</span>
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
                    24-hour delivery
                  </li>
                </ul>
                <Link href={`/book/?package=floorplan-2d&suburb=${suburb.slug}`} className="block text-center bg-slate-100 hover:bg-slate-200 text-navy-900 font-bold py-3 rounded-lg transition-colors">
                  Order 2D Plan
                </Link>
              </div>

              <div className="bg-white rounded-2xl p-8 shadow-hover border-2 border-primary relative">
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-white text-xs font-bold px-4 py-1 rounded-full">
                  Most Popular in {suburb.name}
                </span>
                <h3 className="text-2xl font-bold mb-4">3D Floor Plan</h3>
                <div className="mb-6">
                  <span className="text-4xl font-black">${floorPlan3DPrice}</span>
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
                </ul>
                <Link href={`/book/?package=floorplan-3d&suburb=${suburb.slug}`} className="block text-center bg-primary hover:bg-primary/90 text-white font-bold py-3 rounded-lg transition-colors">
                  Order 3D Plan
                </Link>
              </div>

              <div className="bg-white rounded-2xl p-8 shadow-subtle">
                <h3 className="text-2xl font-bold mb-4">2D + 3D Bundle</h3>
                <div className="mb-6">
                  <span className="text-4xl font-black">${floorPlanBundlePrice}</span>
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
                    Save $41
                  </li>
                </ul>
                <Link href={`/book/?package=floorplan-bundle&suburb=${suburb.slug}`} className="block text-center bg-slate-100 hover:bg-slate-200 text-navy-900 font-bold py-3 rounded-lg transition-colors">
                  Order Bundle
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Property Type Insights - shows when Census data available */}
        {suburb.primaryDwellingType && (
          <section className="py-16 px-6 bg-white">
            <div className="max-w-7xl mx-auto">
              <h2 className="text-3xl font-black mb-8">Floor Plans for {suburb.name} Properties</h2>

              {suburb.dwellingTypeRatio && (
                <p className="text-lg text-slate-700 mb-8">{suburb.name} features {suburb.dwellingTypeRatio}.</p>
              )}

              <div className="grid md:grid-cols-3 gap-8 mb-8">
                {suburb.primaryDwellingType && (
                  <div className="bg-soft-grey rounded-xl p-6 text-center">
                    <div className="text-lg font-bold text-navy-900 mb-2 capitalize">{suburb.primaryDwellingType}s</div>
                    <div className="text-slate-600">Primary Property Type</div>
                  </div>
                )}
                {suburb.avgBedrooms && (
                  <div className="bg-soft-grey rounded-xl p-6 text-center">
                    <div className="text-4xl font-black text-navy-900 mb-2">{suburb.avgBedrooms.toString()}</div>
                    <div className="text-slate-600">Average Bedrooms</div>
                  </div>
                )}
                {suburb.floorPlanComplexity && (
                  <div className="bg-soft-grey rounded-xl p-6 text-center">
                    <div className="text-lg font-bold text-navy-900 mb-2 capitalize">{suburb.floorPlanComplexity}</div>
                    <div className="text-slate-600">Layout Complexity</div>
                  </div>
                )}
              </div>

              {suburb.typicalLayoutNotes && (
                <div className="bg-soft-grey rounded-xl p-6 mb-8">
                  <div className="flex items-start gap-3">
                    <span className="material-symbols-outlined text-primary">info</span>
                    <div>
                      <p className="text-slate-700">{suburb.typicalLayoutNotes}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Recommendation based on property type */}
              {suburb.primaryDwellingType === 'house' && suburb.avgBedrooms && Number(suburb.avgBedrooms) >= 4 && (
                <div className="bg-primary/10 rounded-xl p-6">
                  <div className="flex items-start gap-3">
                    <span className="material-symbols-outlined text-primary">recommend</span>
                    <div>
                      <p className="font-semibold text-navy-900 mb-1">Recommendation for {suburb.name}</p>
                      <p className="text-slate-700">{suburb.name} properties typically have complex layouts (average {suburb.avgBedrooms.toString()} bedrooms), often multi-level. Our <strong>3D Bundle at ${floorPlanBundlePrice}</strong> helps buyers visualize these spaces effectively.</p>
                    </div>
                  </div>
                </div>
              )}

              {suburb.primaryDwellingType === 'unit' && (
                <div className="bg-primary/10 rounded-xl p-6">
                  <div className="flex items-start gap-3">
                    <span className="material-symbols-outlined text-primary">recommend</span>
                    <div>
                      <p className="font-semibold text-navy-900 mb-1">For {suburb.name} Apartments</p>
                      <p className="text-slate-700">Floor plans are essential for {suburb.name} apartments to show room proportions and layout efficiency. Our <strong>2D plans starting at ${floorPlanPrice}</strong> help buyers compare units effectively.</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </section>
        )}

        {/* Buyer Demographics - Census Data */}
        {(suburb.familyHouseholds || suburb.medianAge || suburb.population) && (
          <section className="py-16 px-6 bg-soft-grey">
            <div className="max-w-7xl mx-auto">
              <h2 className="text-3xl font-black mb-8">Who's Buying in {suburb.name}?</h2>
              <p className="text-slate-600 mb-8">Understanding the local buyer profile helps tailor your floor plan presentation.</p>

              <div className="grid md:grid-cols-4 gap-6 mb-8">
                {suburb.population && (
                  <div className="bg-white rounded-xl p-6 text-center">
                    <div className="text-3xl font-black text-primary mb-2">{suburb.population.toLocaleString()}</div>
                    <div className="text-slate-600">Population</div>
                  </div>
                )}
                {suburb.medianAge && (
                  <div className="bg-white rounded-xl p-6 text-center">
                    <div className="text-3xl font-black text-primary mb-2">{suburb.medianAge}</div>
                    <div className="text-slate-600">Median Age</div>
                  </div>
                )}
                {suburb.familyHouseholds && (
                  <div className="bg-white rounded-xl p-6 text-center">
                    <div className="text-3xl font-black text-primary mb-2">{suburb.familyHouseholds.toLocaleString()}</div>
                    <div className="text-slate-600">Family Households</div>
                  </div>
                )}
                {suburb.singlePersonHousehold && (
                  <div className="bg-white rounded-xl p-6 text-center">
                    <div className="text-3xl font-black text-primary mb-2">{suburb.singlePersonHousehold.toLocaleString()}</div>
                    <div className="text-slate-600">Single Person Households</div>
                  </div>
                )}
              </div>

              {/* Buyer-focused insights */}
              {suburb.familyHouseholds && suburb.singlePersonHousehold && Number(suburb.familyHouseholds) > Number(suburb.singlePersonHousehold) * 2 && (
                <div className="bg-white rounded-xl p-6">
                  <div className="flex items-start gap-3">
                    <span className="material-symbols-outlined text-primary">family_restroom</span>
                    <div>
                      <p className="font-semibold text-navy-900 mb-1">Family-Focused Market</p>
                      <p className="text-slate-700">{suburb.name} is predominantly a family area. Floor plans should clearly show children's bedrooms, living spaces, and outdoor areas. Highlighting room dimensions helps families visualize furniture placement.</p>
                    </div>
                  </div>
                </div>
              )}

              {suburb.singlePersonHousehold && suburb.familyHouseholds && Number(suburb.singlePersonHousehold) > Number(suburb.familyHouseholds) && (
                <div className="bg-white rounded-xl p-6">
                  <div className="flex items-start gap-3">
                    <span className="material-symbols-outlined text-primary">person</span>
                    <div>
                      <p className="font-semibold text-navy-900 mb-1">Singles & Professional Market</p>
                      <p className="text-slate-700">{suburb.name} has a high proportion of single-person households. Floor plans should emphasize efficient layouts, study/home office spaces, and storage solutions.</p>
                    </div>
                  </div>
                </div>
              )}

              {suburb.bedroomDistribution && (
                <div className="bg-white rounded-xl p-6 mt-6">
                  <div className="flex items-start gap-3">
                    <span className="material-symbols-outlined text-primary">bed</span>
                    <div>
                      <p className="font-semibold text-navy-900 mb-1">Bedroom Distribution</p>
                      <p className="text-slate-700">{suburb.bedroomDistribution}</p>
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
              <p className="text-slate-600 mb-8">Looking for floor plans near {suburb.name}? We also serve:</p>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                {suburb.nearbySuburbsFrom.map((nearby: any) => (
                  <Link
                    key={nearby.id}
                    href={`/floor-plans/${nearby.nearbySuburb.stateSlug}/${nearby.nearbySuburb.slug}/`}
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
                  <span>How much do floor plans cost in {suburb.name}?</span>
                  <span className="material-symbols-outlined transition-transform group-open:rotate-180">expand_more</span>
                </summary>
                <div className="px-6 pb-6 text-slate-700">
                  <p>Floor plans in {suburb.name} start from ${floorPlanPrice} for a professional 2D floor plan. Our 3D floor plan (${floorPlan3DPrice}) provides a photorealistic visualization, and our bundle (${floorPlanBundlePrice}) includes both 2D and 3D plans, saving you $41.</p>
                </div>
              </details>

              <details className="group bg-white rounded-lg">
                <summary className="flex items-center justify-between cursor-pointer p-6 font-semibold text-lg">
                  <span>How quickly can you deliver floor plans for {suburb.name}?</span>
                  <span className="material-symbols-outlined transition-transform group-open:rotate-180">expand_more</span>
                </summary>
                <div className="px-6 pb-6 text-slate-700">
                  <p>Floor plans for {suburb.name} properties are delivered within 24 hours. If you're also booking photography with us, we can measure during the photo shoot at no extra charge, making the process more efficient.</p>
                </div>
              </details>

              <details className="group bg-white rounded-lg">
                <summary className="flex items-center justify-between cursor-pointer p-6 font-semibold text-lg">
                  <span>Do floor plans help sell {suburb.name} properties faster?</span>
                  <span className="material-symbols-outlined transition-transform group-open:rotate-180">expand_more</span>
                </summary>
                <div className="px-6 pb-6 text-slate-700">
                  <p>Yes, listings with floor plans receive up to 30% more views than those without. Floor plans help {suburb.name} buyers understand room flow, sizes, and how spaces connect - information that photos alone can't convey. Many premium property portals now require or recommend floor plans for listings.</p>
                </div>
              </details>

              {/* Property-type-aware FAQ */}
              {suburb.primaryDwellingType === 'unit' && (
                <details className="group bg-white rounded-lg">
                  <summary className="flex items-center justify-between cursor-pointer p-6 font-semibold text-lg">
                    <span>Are floor plans really necessary for apartments in {suburb.name}?</span>
                    <span className="material-symbols-outlined transition-transform group-open:rotate-180">expand_more</span>
                  </summary>
                  <div className="px-6 pb-6 text-slate-700">
                    <p>Floor plans are essential for {suburb.name} apartments. Buyers often compare multiple units and floor plans show exact dimensions, room proportions, and layout efficiency that photos can't convey. They help buyers understand storage space, room sizes, and overall liveability before inspecting.</p>
                  </div>
                </details>
              )}

              {suburb.primaryDwellingType === 'house' && suburb.avgBedrooms && Number(suburb.avgBedrooms) >= 3 && (
                <details className="group bg-white rounded-lg">
                  <summary className="flex items-center justify-between cursor-pointer p-6 font-semibold text-lg">
                    <span>What type of floor plan works best for {suburb.name} houses?</span>
                    <span className="material-symbols-outlined transition-transform group-open:rotate-180">expand_more</span>
                  </summary>
                  <div className="px-6 pb-6 text-slate-700">
                    <p>For {suburb.name}'s houses (averaging {suburb.avgBedrooms.toString()} bedrooms), we recommend our 3D floor plans. They help buyers visualize room sizes and flow, especially for larger or multi-level properties. The furnished 3D visualization shows how spaces can be used, which is particularly valuable for family buyers.</p>
                  </div>
                </details>
              )}
            </div>
          </div>
        </section>

        <section className="py-20 px-6 bg-primary text-white">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl font-black mb-4">Ready to Add a Floor Plan to Your {suburb.name} Listing?</h2>
            <p className="text-xl mb-8 text-white/90">
              Professional floor plans from ${floorPlanPrice}. 24-hour delivery. Accurate measurements guaranteed.
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
