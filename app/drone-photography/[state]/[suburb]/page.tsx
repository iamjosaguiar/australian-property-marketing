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
  try{
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
      'bondi': { name: 'Bondi', state: 'NSW', dronePrice: 295 },
      'paddington': { name: 'Paddington', state: 'NSW', dronePrice: 295 },
      'surry-hills': { name: 'Surry Hills', state: 'NSW', dronePrice: 295 },
    };
    suburb = suburbMap[suburbSlug];
  }

  if (!suburb) {
    return {
      title: 'Suburb Not Found',
    };
  }

  const dronePrice = suburb.dronePrice || 295;

  return {
    title: `Drone Photography ${suburb.name} | Aerial Property Photos ${suburb.state} | Australian Property Marketing`,
    description: `CASA-certified drone photography in ${suburb.name}, ${suburb.state}. From $${dronePrice}. 24-hour delivery. Book online today.`,
    openGraph: {
      title: `Drone Photography ${suburb.name} | Australian Property Marketing`,
      description: `CASA-certified aerial photography in ${suburb.name}. From $${dronePrice}. 24-hour delivery.`,
      type: 'website',
      locale: 'en_AU',
    },
  };
}

export default async function SuburbDronePhotographyPage({
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
        dronePrice: 295,
        droneVideoPrice: 495,
        droneCompletePrice: 695,
        nearbySuburbsFrom: [],
      },
    };
    suburb = suburbMap[suburbSlug] || null;
  }

  if (!suburb) {
    notFound();
  }

  const dronePrice = suburb.dronePrice || 295;
  const droneVideoPrice = suburb.droneVideoPrice || 495;
  const droneCompletePrice = suburb.droneCompletePrice || 695;

  return (
    <>
      <Header />
      <main className="min-h-screen pt-20">
        <nav className="bg-soft-grey py-4 px-6" aria-label="Breadcrumb">
          <ol className="max-w-7xl mx-auto flex items-center gap-2 text-sm">
            <li><Link href="/" className="text-slate-600 hover:text-primary">Home</Link></li>
            <li className="text-slate-400">/</li>
            <li><Link href="/drone-photography/" className="text-slate-600 hover:text-primary">Drone Photography</Link></li>
            <li className="text-slate-400">/</li>
            <li><Link href={`/drone-photography/${suburb.stateSlug}/`} className="text-slate-600 hover:text-primary">{suburb.stateFull}</Link></li>
            <li className="text-slate-400">/</li>
            <li className="text-slate-900 font-semibold">{suburb.name}</li>
          </ol>
        </nav>

        <section className="relative h-[500px] bg-gradient-to-br from-navy-900 to-slate-800">
          <div className="absolute inset-0 bg-black/40" />
          <div className="relative z-10 max-w-7xl mx-auto px-6 h-full flex flex-col justify-center">
            <h1 className="text-5xl md:text-6xl font-black text-white mb-4">
              Drone Photography in {suburb.name}
            </h1>
            <p className="text-xl text-white/90 mb-8 max-w-2xl">
              CASA-certified drone photography for {suburb.name} properties. From ${dronePrice} with 24-hour delivery.
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
            <h2 className="text-4xl font-black text-center mb-4">Drone Packages for {suburb.name}</h2>
            <p className="text-center text-slate-600 mb-12 max-w-2xl mx-auto">
              CASA-certified aerial photography to showcase your {suburb.name} property
            </p>

            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-white rounded-2xl p-8 shadow-subtle">
                <h3 className="text-2xl font-bold mb-4">Drone Photos</h3>
                <div className="mb-6">
                  <span className="text-4xl font-black">${dronePrice}</span>
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
                    CASA-certified pilot
                  </li>
                </ul>
                <Link href={`/book/?package=drone-photos&suburb=${suburb.slug}`} className="block text-center bg-slate-100 hover:bg-slate-200 text-navy-900 font-bold py-3 rounded-lg transition-colors">
                  Book Photos
                </Link>
              </div>

              <div className="bg-white rounded-2xl p-8 shadow-hover border-2 border-primary relative">
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-white text-xs font-bold px-4 py-1 rounded-full">
                  Most Popular in {suburb.name}
                </span>
                <h3 className="text-2xl font-bold mb-4">Drone Video</h3>
                <div className="mb-6">
                  <span className="text-4xl font-black">${droneVideoPrice}</span>
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
                </ul>
                <Link href={`/book/?package=drone-video&suburb=${suburb.slug}`} className="block text-center bg-primary hover:bg-primary/90 text-white font-bold py-3 rounded-lg transition-colors">
                  Book Video
                </Link>
              </div>

              <div className="bg-white rounded-2xl p-8 shadow-subtle">
                <h3 className="text-2xl font-bold mb-4">Complete Package</h3>
                <div className="mb-6">
                  <span className="text-4xl font-black">${droneCompletePrice}</span>
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
                </ul>
                <Link href={`/book/?package=drone-complete&suburb=${suburb.slug}`} className="block text-center bg-slate-100 hover:bg-slate-200 text-navy-900 font-bold py-3 rounded-lg transition-colors">
                  Book Complete
                </Link>
              </div>
            </div>
          </div>
        </section>

        {suburb.nearbySuburbsFrom && suburb.nearbySuburbsFrom.length > 0 && (
          <section className="py-16 px-6 bg-white">
            <div className="max-w-7xl mx-auto">
              <h2 className="text-3xl font-black mb-8">Also Serving Nearby Areas</h2>
              <p className="text-slate-600 mb-8">Looking for drone photography near {suburb.name}? We also serve:</p>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                {suburb.nearbySuburbsFrom.map((nearby: any) => (
                  <Link
                    key={nearby.id}
                    href={`/drone-photography/${nearby.nearbySuburb.stateSlug}/${nearby.nearbySuburb.slug}/`}
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
                  <span>How much does drone photography cost in {suburb.name}?</span>
                  <span className="material-symbols-outlined transition-transform group-open:rotate-180">expand_more</span>
                </summary>
                <div className="px-6 pb-6 text-slate-700">
                  <p>Drone photography in {suburb.name} starts from ${dronePrice} for 10 aerial photographs. Our Complete package (${droneCompletePrice}) includes both photos and video, and is popular for {suburb.name} properties where showcasing location is important.</p>
                </div>
              </details>

              <details className="group bg-white rounded-lg">
                <summary className="flex items-center justify-between cursor-pointer p-6 font-semibold text-lg">
                  <span>Are your drone operators CASA-certified for {suburb.name}?</span>
                  <span className="material-symbols-outlined transition-transform group-open:rotate-180">expand_more</span>
                </summary>
                <div className="px-6 pb-6 text-slate-700">
                  <p>Yes, all our drone pilots hold current Remote Pilot Licenses (RePL) from CASA. We carry $5M public liability insurance and handle all necessary flight approvals for {suburb.name} operations.</p>
                </div>
              </details>

              <details className="group bg-white rounded-lg">
                <summary className="flex items-center justify-between cursor-pointer p-6 font-semibold text-lg">
                  <span>What properties in {suburb.name} benefit most from drone photography?</span>
                  <span className="material-symbols-outlined transition-transform group-open:rotate-180">expand_more</span>
                </summary>
                <div className="px-6 pb-6 text-slate-700">
                  <p>Drone photography is ideal for {suburb.name} properties with large land, pools, outdoor entertaining areas, or proximity to beaches, parks, and local amenities. It's also essential for waterfront properties and prestige listings.</p>
                </div>
              </details>
            </div>
          </div>
        </section>

        <section className="py-20 px-6 bg-primary text-white">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl font-black mb-4">Ready to Book Your {suburb.name} Drone Shoot?</h2>
            <p className="text-xl mb-8 text-white/90">
              CASA-certified drone photography from ${dronePrice}. 24-hour delivery. Fully insured operators.
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
