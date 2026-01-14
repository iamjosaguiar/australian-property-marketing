import Link from 'next/link';
import Image from 'next/image';
import Footer from '@/components/Footer';

export default async function Home() {
  // Fetch featured suburbs for homepage (with fallback if DB not set up)
  let featuredSuburbs: Array<{ id: number; name: string }> = [];

  try {
    const { prisma } = await import('@/lib/prisma');
    featuredSuburbs = await prisma.suburb.findMany({
      where: { active: true, priority: { gte: 8 } },
      orderBy: [{ priority: 'desc' }, { name: 'asc' }],
      take: 3,
      select: { id: true, name: true },
    });
  } catch (error) {
    // Database not set up yet - use placeholder suburbs
    featuredSuburbs = [
      { id: 1, name: 'Bondi' },
      { id: 2, name: 'Paddington' },
      { id: 3, name: 'Surry Hills' },
    ];
  }
  return (
    <div className="bg-white font-display text-charcoal transition-colors duration-300">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 glass-nav">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <Link href="/" className="flex items-center">
            <Image
              src="/APM Logo.png"
              alt="Australian Property Marketing"
              width={280}
              height={60}
              className="h-12 w-auto"
              priority
            />
          </Link>
          <div className="hidden md:flex items-center gap-10">
            <Link href="/service-areas" className="text-sm font-semibold text-slate-600 hover:text-primary transition-colors">
              Service Areas
            </Link>
            <Link href="#services" className="text-sm font-semibold text-slate-600 hover:text-primary transition-colors">
              Services
            </Link>
            <Link href="#portfolio" className="text-sm font-semibold text-slate-600 hover:text-primary transition-colors">
              Portfolio
            </Link>
            <Link href="/pricing" className="text-sm font-semibold text-slate-600 hover:text-primary transition-colors">
              Pricing
            </Link>
          </div>
          <div className="flex items-center gap-4">
            <button className="hidden sm:block text-sm font-bold text-slate-700 px-5 py-2 hover:text-primary transition-colors">
              Login
            </button>
            <Link href="/dashboard" className="bg-navy-deep hover:bg-slate-800 text-white text-sm font-bold px-6 py-2.5 rounded-lg transition-all shadow-md">
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      <main className="pt-20">
        {/* Hero Section */}
        <section className="relative min-h-[85vh] flex items-center justify-center px-6 overflow-hidden hero-gradient">
          <div className="max-w-7xl w-full grid lg:grid-cols-2 gap-16 items-center py-12">
            <div className="flex flex-col gap-8 z-10">
              <div className="flex gap-3 flex-wrap">
                <div className="flex items-center gap-2 bg-primary/5 border border-primary/10 px-3 py-1.5 rounded-full">
                  <span className="material-symbols-outlined text-primary text-[16px]">shutter_speed</span>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-primary">24-Hour Turnaround</span>
                </div>
                <div className="flex items-center gap-2 bg-accent-gold/5 border border-accent-gold/10 px-3 py-1.5 rounded-full">
                  <span className="material-symbols-outlined text-accent-gold text-[16px]">map</span>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-accent-gold">National Coverage</span>
                </div>
              </div>
              <h1 className="text-5xl md:text-7xl font-black leading-[1.05] tracking-tight text-navy-deep">
                Elevate Every <span className="text-primary">Property</span>.
              </h1>
              <p className="text-lg md:text-xl text-slate-500 max-w-lg leading-relaxed font-medium">
                Professional photography, cinematic video tours, and strategic marketing solutions. Australia&apos;s premier property marketing specialists.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 mt-2">
                <Link href="/real-estate-photography/" className="h-14 px-8 bg-primary hover:bg-primary/90 transition-colors text-white font-bold rounded-lg flex items-center justify-center gap-2 shadow-lg shadow-primary/20">
                  Browse Locations
                  <span className="material-symbols-outlined">arrow_forward</span>
                </Link>
                <Link href="/pricing" className="h-14 px-8 bg-white border border-slate-200 hover:border-slate-300 hover:bg-soft-grey text-slate-700 font-bold rounded-lg transition-colors flex items-center justify-center gap-2">
                  View Pricing
                </Link>
              </div>
            </div>
            <div className="relative group cursor-ew-resize">
              <div className="relative aspect-[4/3] rounded-2xl overflow-hidden shadow-2xl border border-slate-100 bg-slate-50">
                <div
                  className="absolute inset-0 bg-cover bg-center"
                  style={{backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuCf_XmYXU62VKL-D072NoS_jEmPgzky5SA3xHtwfTLemdstztwUhmLxNYNbqccbEbYtfDWdkhJAf7rzvnEz2SYDF6KAFLIgFHFbZSl0gQ-crvmGoqzjiq7uoCOZhd7I-csPiaRTH1ax2JDBqjmI3oFod4L4QZof9Psjgdtxtd4Or9McT5WqIZKYCjMqudyk95G7TiBjPQXioSwo2TTPgdb6MHLaJUcnZ_Cd5DMJAphzDcje0Dq-Fl5oMAWxS1fDMCPXcyCaZZFjaKMz")'}}
                />
                <div
                  className="absolute inset-0 bg-cover bg-center"
                  style={{
                    backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuBV9bUN8FLUjXz1mHD1HeBwalsAdmhsqshzcquw6r8YDmuMGNOTY84PUpZWS8GQQrhrn3sgTbiNjQeC956cfndVDV8caJWri2L0SoixAOlK9-fUxrOToyFE_iU-yYWqN0QVxRUMUMHxh_UzA3KYpLejtcsy8UZ5VR-A2aSeaswzcv0H01EFTkSGIPtrYjiMD2cv1cu4DQPKM06CPj3v3UYMbFRpAR551wODQO2-yzvgOWSrroz9ahDY_Qf-IY2qrdo46X6B8DjVauSM")',
                    clipPath: 'inset(0 50% 0 0)'
                  }}
                />
                <div className="absolute top-0 bottom-0 left-1/2 w-[2px] bg-white/80 backdrop-blur-sm slider-handle pointer-events-none">
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-11 h-11 bg-white rounded-full shadow-xl flex items-center justify-center border-4 border-white">
                    <span className="material-symbols-outlined text-navy-deep text-xl">unfold_more</span>
                  </div>
                </div>
                <div className="absolute bottom-6 left-6 bg-white/90 backdrop-blur px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-tight text-slate-800 shadow-sm border border-white/50">
                  Before: Day
                </div>
                <div className="absolute bottom-6 right-6 bg-accent-gold px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-tight text-white shadow-md">
                  After: Dusk Enhancement
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Trusted By Section */}
        <section className="py-16 border-y border-slate-100 bg-soft-grey">
          <div className="max-w-7xl mx-auto px-6">
            <p className="text-center text-slate-400 text-xs font-bold uppercase tracking-[0.25em] mb-12">
              Trusted by Australia&apos;s Leading Agencies
            </p>
            <div className="flex flex-wrap justify-center items-center gap-12 md:gap-24 opacity-40 grayscale hover:grayscale-0 transition-all duration-500">
              <div className="h-8 w-32 flex items-center justify-center font-black text-slate-800 text-xl tracking-tighter">McGrath</div>
              <div className="h-8 w-32 flex items-center justify-center font-black text-slate-800 text-xl tracking-tight">BELLE</div>
              <div className="h-8 w-32 flex items-center justify-center font-black text-slate-800 text-xl">Ray White</div>
              <div className="h-8 w-32 flex items-center justify-center font-black text-slate-800 text-xl tracking-tight">LJ Hooker</div>
              <div className="h-8 w-32 flex items-center justify-center font-black text-slate-800 text-xl">THE AGENCY</div>
            </div>
          </div>
        </section>

        {/* Services Section */}
        <section className="py-24 px-6 bg-white" id="services">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-20 max-w-3xl mx-auto">
              <h2 className="text-primary font-bold uppercase tracking-widest text-sm mb-4">Premium Solutions</h2>
              <h3 className="text-4xl md:text-5xl font-black text-navy-deep mb-6">
                Mastering the Art of Real Estate Presentation
              </h3>
              <p className="text-slate-500 text-lg font-medium">
                We combine high-end artistry with cutting-edge AI technology to deliver assets that close deals faster.
              </p>
            </div>
            <div className="grid md:grid-cols-3 gap-8">
              {/* Service Cards */}
              <div className="group bg-white border border-slate-100 p-10 rounded-2xl hover:border-primary/20 hover:shadow-xl hover:shadow-slate-100 transition-all duration-300 relative">
                <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                  <span className="material-symbols-outlined text-8xl text-navy-deep">movie</span>
                </div>
                <div className="w-14 h-14 bg-primary/5 rounded-xl flex items-center justify-center mb-8 border border-primary/10">
                  <span className="material-symbols-outlined text-primary text-3xl">theaters</span>
                </div>
                <h4 className="text-xl font-bold text-navy-deep mb-4">Cinematic Storytelling</h4>
                <p className="text-slate-500 leading-relaxed mb-6 font-medium">
                  Bespoke video tours that capture the soul of a property and engage high-value buyers with emotion-led visuals.
                </p>
                <ul className="text-sm space-y-3 text-slate-600">
                  <li className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary text-lg">check_circle</span> 4K Drone Integration
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary text-lg">check_circle</span> Professional Voiceover
                  </li>
                </ul>
              </div>

              <div className="group bg-white border border-slate-100 p-10 rounded-2xl hover:border-primary/20 hover:shadow-xl hover:shadow-slate-100 transition-all duration-300 relative">
                <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                  <span className="material-symbols-outlined text-8xl text-navy-deep">bolt</span>
                </div>
                <div className="w-14 h-14 bg-primary/5 rounded-xl flex items-center justify-center mb-8 border border-primary/10">
                  <span className="material-symbols-outlined text-primary text-3xl">bolt</span>
                </div>
                <h4 className="text-xl font-bold text-navy-deep mb-4">AI-Powered Speed</h4>
                <p className="text-slate-500 leading-relaxed mb-6 font-medium">
                  Industry-leading 24-hour turnaround times powered by custom AI enhancement workflows without sacrificing detail.
                </p>
                <ul className="text-sm space-y-3 text-slate-600">
                  <li className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary text-lg">check_circle</span> Automated Sky Replacement
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary text-lg">check_circle</span> Item Removal AI
                  </li>
                </ul>
              </div>

              <div className="group bg-white border border-slate-100 p-10 rounded-2xl hover:border-primary/20 hover:shadow-xl hover:shadow-slate-100 transition-all duration-300 relative">
                <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                  <span className="material-symbols-outlined text-8xl text-navy-deep">verified</span>
                </div>
                <div className="w-14 h-14 bg-primary/5 rounded-xl flex items-center justify-center mb-8 border border-primary/10">
                  <span className="material-symbols-outlined text-primary text-3xl">security</span>
                </div>
                <h4 className="text-xl font-bold text-navy-deep mb-4">Absolute Consistency</h4>
                <p className="text-slate-500 leading-relaxed mb-6 font-medium">
                  A unified high-end signature style for every listing, ensuring your brand integrity remains pristine across every franchise.
                </p>
                <ul className="text-sm space-y-3 text-slate-600">
                  <li className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary text-lg">check_circle</span> Style Matching Engine
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary text-lg">check_circle</span> Quality Control Audit
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Locations Section */}
        <section className="py-24 px-6 bg-soft-grey">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16 max-w-3xl mx-auto">
              <h2 className="text-primary font-bold uppercase tracking-widest text-sm mb-4">Coverage Nationwide</h2>
              <h3 className="text-4xl md:text-5xl font-black text-navy-deep mb-6">
                Servicing Locations Across Australia
              </h3>
              <p className="text-slate-500 text-lg font-medium">
                Professional real estate photography in major cities and suburbs. Same-day and next-day availability.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8 mb-12">
              <Link href="/real-estate-photography/nsw/" className="group bg-white p-8 rounded-2xl hover:shadow-hover transition-all">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h4 className="text-2xl font-bold text-navy-deep group-hover:text-primary transition-colors mb-2">
                      New South Wales
                    </h4>
                    <p className="text-slate-500">Sydney & surrounding areas</p>
                  </div>
                  <span className="material-symbols-outlined text-slate-400 group-hover:text-primary transition-colors">arrow_forward</span>
                </div>
                <div className="flex flex-wrap gap-2 mt-6">
                  {featuredSuburbs.map((suburb) => (
                    <span key={suburb.id} className="text-xs bg-soft-grey px-3 py-1.5 rounded-full text-slate-600">{suburb.name}</span>
                  ))}
                  <span className="text-xs bg-soft-grey px-3 py-1.5 rounded-full text-slate-600">+more</span>
                </div>
              </Link>

              <Link href="/real-estate-photography/vic/" className="group bg-white p-8 rounded-2xl hover:shadow-hover transition-all">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h4 className="text-2xl font-bold text-navy-deep group-hover:text-primary transition-colors mb-2">
                      Victoria
                    </h4>
                    <p className="text-slate-500">Melbourne & regional areas</p>
                  </div>
                  <span className="material-symbols-outlined text-slate-400 group-hover:text-primary transition-colors">arrow_forward</span>
                </div>
                <div className="text-sm text-slate-600 mt-6">
                  Comprehensive coverage across Melbourne metro
                </div>
              </Link>

              <Link href="/real-estate-photography/qld/" className="group bg-white p-8 rounded-2xl hover:shadow-hover transition-all">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h4 className="text-2xl font-bold text-navy-deep group-hover:text-primary transition-colors mb-2">
                      Queensland
                    </h4>
                    <p className="text-slate-500">Brisbane & Gold Coast</p>
                  </div>
                  <span className="material-symbols-outlined text-slate-400 group-hover:text-primary transition-colors">arrow_forward</span>
                </div>
                <div className="text-sm text-slate-600 mt-6">
                  Servicing South East Queensland
                </div>
              </Link>
            </div>

            <div className="text-center">
              <Link
                href="/real-estate-photography/"
                className="inline-flex items-center gap-2 bg-navy-deep hover:bg-slate-800 text-white font-bold px-8 py-4 rounded-lg transition-colors"
              >
                View All Locations
                <span className="material-symbols-outlined">arrow_forward</span>
              </Link>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-24 px-6 bg-white">
          <div className="max-w-6xl mx-auto bg-navy-deep rounded-3xl p-12 md:p-20 relative overflow-hidden text-center shadow-2xl">
            <div
              className="absolute top-0 left-0 w-full h-full opacity-[0.03] pointer-events-none"
              style={{
                backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)',
                backgroundSize: '32px 32px'
              }}
            />
            <h2 className="text-4xl md:text-6xl font-black text-white mb-8 relative z-10 tracking-tight">
              Ready to outshine the competition?
            </h2>
            <p className="text-slate-300 text-lg md:text-xl max-w-2xl mx-auto mb-12 relative z-10">
              Join the top 1% of Australian real estate agents. Get your first listing shot and edited within 24 hours.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 relative z-10">
              <Link href="/real-estate-photography/" className="bg-primary text-white text-lg font-bold px-10 py-5 rounded-xl shadow-xl hover:bg-primary/90 transition-all hover:scale-105">
                Get Started Now
              </Link>
              <Link href="/pricing" className="bg-white/10 backdrop-blur-md border border-white/20 text-white text-lg font-bold px-10 py-5 rounded-xl hover:bg-white/20 transition-colors">
                View Pricing
              </Link>
            </div>
            <div className="mt-12 flex flex-wrap items-center justify-center gap-8 opacity-60 text-white text-xs font-bold uppercase tracking-widest">
              <span className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[18px]">star</span> Top Rated
              </span>
              <span className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[18px]">schedule</span> 24h Delivery
              </span>
              <span className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[18px]">public</span> National Reach
              </span>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
