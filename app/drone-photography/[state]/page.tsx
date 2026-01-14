import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export async function generateStaticParams() {
  try {
    const { prisma } = await import('@/lib/prisma');
    const states = await prisma.state.findMany({
      where: { active: true },
      select: { slug: true },
    });

    return states.map((state) => ({
      state: state.slug,
    }));
  } catch (error) {
    return [
      { state: 'nsw' },
      { state: 'vic' },
      { state: 'qld' },
    ];
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ state: string }>;
}): Promise<Metadata> {
  const { state: stateSlug } = await params;
  let state: any = null;

  try {
    const { prisma } = await import('@/lib/prisma');
    state = await prisma.state.findUnique({
      where: { slug: stateSlug },
    });
  } catch (error) {
    const stateMap: any = {
      nsw: { name: 'New South Wales', code: 'NSW' },
      vic: { name: 'Victoria', code: 'VIC' },
      qld: { name: 'Queensland', code: 'QLD' },
    };
    state = stateMap[stateSlug];
  }

  if (!state) {
    return {
      title: 'State Not Found',
    };
  }

  return {
    title: `Drone Photography ${state.name} | Aerial Property Photos ${state.code} | Australian Property Marketing`,
    description: `CASA-certified drone photography across ${state.name}. From $295 with 24-hour delivery. Trusted by local agents. Book online today.`,
    openGraph: {
      title: `Drone Photography ${state.name} | Australian Property Marketing`,
      description: `CASA-certified aerial photography in ${state.name}. From $295. 24-hour delivery.`,
      type: 'website',
      locale: 'en_AU',
    },
  };
}

export default async function StateDronePhotographyPage({
  params,
}: {
  params: Promise<{ state: string }>;
}) {
  const { state: stateSlug } = await params;

  let state: any = null;
  let suburbs: any[] = [];

  try {
    const { prisma } = await import('@/lib/prisma');

    state = await prisma.state.findUnique({
      where: { slug: stateSlug },
    });

    if (!state) {
      notFound();
    }

    suburbs = await prisma.suburb.findMany({
      where: {
        stateSlug: stateSlug,
        active: true,
      },
      orderBy: [
        { priority: 'desc' },
        { name: 'asc' },
      ],
    });
  } catch (error) {
    const stateMap: any = {
      nsw: { id: 1, name: 'New South Wales', slug: 'nsw', code: 'NSW' },
      vic: { id: 2, name: 'Victoria', slug: 'vic', code: 'VIC' },
      qld: { id: 3, name: 'Queensland', slug: 'qld', code: 'QLD' },
    };
    state = stateMap[stateSlug] || null;
    if (!state) notFound();

    suburbs = stateSlug === 'nsw' ? [
      { id: 1, name: 'Bondi', slug: 'bondi', stateSlug: 'nsw', city: 'Sydney', dronePrice: 295, priority: 10 },
      { id: 2, name: 'Paddington', slug: 'paddington', stateSlug: 'nsw', city: 'Sydney', dronePrice: 295, priority: 9 },
      { id: 3, name: 'Surry Hills', slug: 'surry-hills', stateSlug: 'nsw', city: 'Sydney', dronePrice: 295, priority: 10 },
    ] : [];
  }

  const suburbsByCity = suburbs.reduce((acc, suburb) => {
    const cityName = suburb.city || 'Other Areas';
    if (!acc[cityName]) {
      acc[cityName] = [];
    }
    acc[cityName].push(suburb);
    return acc;
  }, {} as Record<string, typeof suburbs>);

  const featuredSuburbs = suburbs.filter(s => s.priority >= 8).slice(0, 6);

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
            <li className="text-slate-900 font-semibold">{state.name}</li>
          </ol>
        </nav>

        <section className="relative h-[500px] bg-gradient-to-br from-navy-900 to-slate-800">
          <div className="absolute inset-0 bg-black/40" />
          <div className="relative z-10 max-w-7xl mx-auto px-6 h-full flex flex-col justify-center">
            <h1 className="text-5xl md:text-6xl font-black text-white mb-4">
              Drone Photography in {state.name}
            </h1>
            <p className="text-xl text-white/90 mb-8 max-w-2xl">
              CASA-certified drone photography across {state.name}. From $295 with 24-hour delivery. Serving {suburbs.length} locations statewide.
            </p>
            <div className="flex gap-4">
              <Link href="/book/" className="bg-primary hover:bg-primary/90 text-white font-bold px-8 py-4 rounded-lg transition-colors">
                Book Now
              </Link>
              <Link href="/pricing/" className="bg-white text-navy-900 font-bold px-8 py-4 rounded-lg hover:bg-slate-100 transition-colors">
                View Pricing
              </Link>
            </div>
          </div>
        </section>

        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="text-center p-6 bg-soft-grey rounded-xl">
                <div className="text-3xl font-black text-primary mb-2">{suburbs.length}</div>
                <div className="text-sm text-slate-600">Locations Serviced</div>
              </div>
              <div className="text-center p-6 bg-soft-grey rounded-xl">
                <div className="text-3xl font-black text-primary mb-2">24hr</div>
                <div className="text-sm text-slate-600">Fast Delivery</div>
              </div>
              <div className="text-center p-6 bg-soft-grey rounded-xl">
                <div className="text-3xl font-black text-primary mb-2">$295</div>
                <div className="text-sm text-slate-600">Starting Price</div>
              </div>
              <div className="text-center p-6 bg-soft-grey rounded-xl">
                <div className="text-3xl font-black text-primary mb-2">CASA</div>
                <div className="text-sm text-slate-600">Certified Operators</div>
              </div>
            </div>
          </div>
        </section>

        {featuredSuburbs.length > 0 && (
          <section className="py-20 px-6 bg-soft-grey">
            <div className="max-w-7xl mx-auto">
              <h2 className="text-4xl font-black mb-12">Popular Locations in {state.name}</h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {featuredSuburbs.map((suburb) => (
                  <Link
                    key={suburb.id}
                    href={`/drone-photography/${suburb.stateSlug}/${suburb.slug}/`}
                    className="bg-white p-6 rounded-2xl hover:shadow-hover transition-shadow group"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-2xl font-bold group-hover:text-primary transition-colors mb-1">
                          {suburb.name}
                        </h3>
                        {suburb.city && (
                          <p className="text-sm text-slate-500">{suburb.city}</p>
                        )}
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

        <section className="py-20 px-6 bg-white">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-4xl font-black mb-12">Browse All {state.name} Locations</h2>
            <div className="space-y-12">
              {Object.entries(suburbsByCity).map(([cityName, citySuburbs]) => (
                <div key={cityName}>
                  <h3 className="text-2xl font-bold mb-6 pb-3 border-b border-slate-200">
                    {cityName}
                  </h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {citySuburbs.map((suburb) => (
                      <Link
                        key={suburb.id}
                        href={`/drone-photography/${suburb.stateSlug}/${suburb.slug}/`}
                        className="bg-soft-grey p-4 rounded-lg hover:shadow-md transition-shadow group"
                      >
                        <div className="font-semibold group-hover:text-primary transition-colors">
                          {suburb.name}
                        </div>
                        <div className="text-sm text-slate-500">
                          From ${suburb.dronePrice || 295}
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-20 px-6 bg-primary text-white">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl font-black mb-4">Ready to Book in {state.name}?</h2>
            <p className="text-xl mb-8 text-white/90">
              CASA-certified drone photography from $295. 24-hour delivery. Same-day availability in most locations.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/book/" className="bg-white text-primary font-bold px-10 py-4 rounded-lg hover:bg-slate-100 transition-colors">
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
