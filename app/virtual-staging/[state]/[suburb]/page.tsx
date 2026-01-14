import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

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

        {suburb.nearbySuburbsFrom && suburb.nearbySuburbsFrom.length > 0 && (
          <section className="py-16 px-6 bg-white">
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
