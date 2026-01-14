import Link from 'next/link';
import Image from 'next/image';
import Footer from '@/components/Footer';

export const metadata = {
  title: 'Services & Pricing | Australian Property Marketing',
  description: 'Professional property marketing services for agents and developers across Australia. Transparent pricing, exceptional results.',
};

export default function PricingPage() {
  return (
    <div className="selection:bg-primary/10">
      {/* Header */}
      <header className="flex items-center justify-between whitespace-nowrap border-b border-slate-100 px-10 py-5 bg-white/80 backdrop-blur-md sticky top-0 z-50">
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
        <div className="flex flex-1 justify-end gap-10 items-center">
          <nav className="hidden lg:flex items-center gap-9">
            <Link className="text-slate-500 text-sm font-semibold hover:text-primary transition-colors" href="/real-estate-photography/">
              Locations
            </Link>
            <Link className="text-slate-500 text-sm font-semibold hover:text-primary transition-colors" href="/#services">
              Services
            </Link>
            <Link className="text-primary text-sm font-bold border-b-2 border-primary pb-1" href="/pricing">
              Pricing
            </Link>
            <Link className="text-slate-500 text-sm font-semibold hover:text-primary transition-colors" href="/">
              Home
            </Link>
          </nav>
          <div className="flex gap-3">
            <button className="flex min-w-[100px] cursor-pointer items-center justify-center rounded-lg h-10 px-5 bg-slate-100 text-navy-900 text-sm font-bold hover:bg-slate-200 transition-all">
              <span>Login</span>
            </button>
            <Link href="/dashboard" className="flex min-w-[120px] cursor-pointer items-center justify-center rounded-lg h-10 px-5 bg-primary text-white text-sm font-bold hover:brightness-110 transition-all shadow-md shadow-primary/20">
              <span>Book Shoot</span>
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-[1280px] mx-auto px-8 py-20">
        {/* Hero Section */}
        <div className="flex flex-col items-center text-center mb-24">
          <span className="text-primary font-bold tracking-[0.2em] text-[10px] uppercase mb-4 bg-primary/5 px-3 py-1 rounded">
            Australian Excellence
          </span>
          <h1 className="text-navy-900 tracking-tight text-5xl md:text-6xl font-black leading-[1.1] max-w-4xl">
            Premium Property Marketing.<br/>
            <span className="text-slate-400">Clear, Honest Pricing.</span>
          </h1>
          <p className="text-slate-500 text-xl font-normal leading-relaxed mt-8 max-w-2xl">
            High-end visual assets for agents and developers across Australia. No hidden fees, no complex contracts. Just world-class results.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-32 items-stretch">
          {/* Essential Package */}
          <div className="flex flex-col gap-8 rounded-2xl border border-slate-100 bg-white p-10 shadow-subtle hover:shadow-hover transition-all duration-300">
            <div className="flex flex-col gap-2">
              <h2 className="text-slate-400 text-sm font-bold uppercase tracking-widest">Essential</h2>
              <div className="flex items-baseline gap-1 mt-2">
                <span className="text-navy-900 text-5xl font-black tracking-tighter">$450</span>
                <span className="text-slate-400 text-sm font-medium">AUD</span>
              </div>
              <p className="text-slate-500 text-sm mt-4 leading-relaxed">
                The foundation for standard residential listings needing professional impact.
              </p>
            </div>
            <div className="h-px bg-slate-100 w-full"></div>
            <div className="flex flex-col gap-5 flex-grow">
              <div className="flex items-center gap-3 text-navy-800 text-sm font-medium">
                <span className="material-symbols-outlined text-primary font-bold">check</span>
                15 High-Res Professional Photos
              </div>
              <div className="flex items-center gap-3 text-navy-800 text-sm font-medium">
                <span className="material-symbols-outlined text-primary font-bold">check</span>
                Standard 2D Floor Plan
              </div>
              <div className="flex items-center gap-3 text-navy-800 text-sm font-medium">
                <span className="material-symbols-outlined text-primary font-bold">check</span>
                24-hour Digital Delivery
              </div>
              <div className="flex items-center gap-3 text-navy-800 text-sm font-medium">
                <span className="material-symbols-outlined text-primary font-bold">check</span>
                Sky &amp; Grass Enhancements
              </div>
            </div>
            <button className="w-full cursor-pointer items-center justify-center rounded-xl h-14 px-4 border-2 border-slate-100 text-navy-900 text-sm font-bold hover:bg-navy-900 hover:text-white hover:border-navy-900 transition-all">
              Select Essential
            </button>
          </div>

          {/* Platinum Package */}
          <div className="flex flex-col gap-8 rounded-2xl border-2 border-primary bg-white p-10 shadow-2xl relative transform md:-translate-y-6 z-10">
            <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-primary text-white text-[10px] font-black uppercase tracking-[0.15em] px-5 py-2 rounded-full shadow-lg shadow-primary/30">
              Most Popular
            </div>
            <div className="flex flex-col gap-2">
              <h2 className="text-primary text-sm font-bold uppercase tracking-widest">Platinum</h2>
              <div className="flex items-baseline gap-1 mt-2">
                <span className="text-navy-900 text-5xl font-black tracking-tighter">$1,200</span>
                <span className="text-slate-400 text-sm font-medium">AUD</span>
              </div>
              <p className="text-slate-500 text-sm mt-4 leading-relaxed">
                A complete cinematic digital suite designed for high-engagement listings.
              </p>
            </div>
            <div className="h-px bg-slate-100 w-full"></div>
            <div className="flex flex-col gap-5 flex-grow">
              <div className="flex items-center gap-3 text-navy-800 text-sm font-bold">
                <span className="material-symbols-outlined text-primary font-bold">auto_awesome</span>
                Everything in Essential
              </div>
              <div className="flex items-center gap-3 text-navy-800 text-sm font-medium">
                <span className="material-symbols-outlined text-primary font-bold">check</span>
                Cinematic 60s Property Film
              </div>
              <div className="flex items-center gap-3 text-navy-800 text-sm font-medium">
                <span className="material-symbols-outlined text-primary font-bold">check</span>
                Aerial 4K Drone Photography
              </div>
              <div className="flex items-center gap-3 text-navy-800 text-sm font-medium">
                <span className="material-symbols-outlined text-primary font-bold">check</span>
                Social Media Reel (9:16)
              </div>
              <div className="flex items-center gap-3 text-navy-800 text-sm font-medium">
                <span className="material-symbols-outlined text-primary font-bold">check</span>
                Agent Piece-to-Camera Intro
              </div>
            </div>
            <button className="w-full cursor-pointer items-center justify-center rounded-xl h-14 px-4 bg-primary text-white text-sm font-bold hover:brightness-110 transition-all shadow-xl shadow-primary/20">
              Select Platinum
            </button>
          </div>

          {/* Prestige Package */}
          <div className="flex flex-col gap-8 rounded-2xl border border-slate-100 bg-white p-10 shadow-subtle hover:shadow-hover transition-all duration-300">
            <div className="flex flex-col gap-2">
              <h2 className="text-slate-400 text-sm font-bold uppercase tracking-widest">Prestige</h2>
              <div className="flex items-baseline gap-1 mt-2">
                <span className="text-navy-900 text-5xl font-black tracking-tighter">$2,500</span>
                <span className="text-slate-400 text-sm font-medium">AUD</span>
              </div>
              <p className="text-slate-500 text-sm mt-4 leading-relaxed">
                The ultimate luxury presentation for premium estates and developers.
              </p>
            </div>
            <div className="h-px bg-slate-100 w-full"></div>
            <div className="flex flex-col gap-5 flex-grow">
              <div className="flex items-center gap-3 text-navy-800 text-sm font-bold">
                <span className="material-symbols-outlined text-primary font-bold">auto_awesome</span>
                Everything in Platinum
              </div>
              <div className="flex items-center gap-3 text-navy-800 text-sm font-medium">
                <span className="material-symbols-outlined text-primary font-bold">check</span>
                Full In-Home Physical Styling
              </div>
              <div className="flex items-center gap-3 text-navy-800 text-sm font-medium">
                <span className="material-symbols-outlined text-primary font-bold">check</span>
                Twilight &amp; Golden Hour Capture
              </div>
              <div className="flex items-center gap-3 text-navy-800 text-sm font-medium">
                <span className="material-symbols-outlined text-primary font-bold">check</span>
                Editorial Magazine Retouching
              </div>
              <div className="flex items-center gap-3 text-navy-800 text-sm font-medium">
                <span className="material-symbols-outlined text-primary font-bold">check</span>
                Luxury Bound Property Books
              </div>
            </div>
            <button className="w-full cursor-pointer items-center justify-center rounded-xl h-14 px-4 border-2 border-slate-100 text-navy-900 text-sm font-bold hover:bg-navy-900 hover:text-white hover:border-navy-900 transition-all">
              Select Prestige
            </button>
          </div>
        </div>

        {/* Add-ons Section */}
        <section className="mt-40">
          <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-slate-100 pb-8 mb-12">
            <div>
              <h2 className="text-navy-900 text-4xl font-black leading-tight tracking-tight">On-Demand Add-ons</h2>
              <p className="text-slate-500 mt-3 text-lg">Tailor your campaign with surgical precision.</p>
            </div>
            <div className="mt-6 md:mt-0 px-4 py-2 bg-slate-50 rounded-lg text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
              <span className="material-symbols-outlined text-primary text-sm">payments</span>
              All Prices inclusive of GST
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white p-8 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-all group">
              <div className="w-12 h-12 rounded-xl bg-primary/5 flex items-center justify-center text-primary mb-6 group-hover:bg-primary group-hover:text-white transition-colors">
                <span className="material-symbols-outlined">auto_awesome</span>
              </div>
              <h3 className="text-navy-900 font-bold text-lg mb-2">AI Virtual Staging</h3>
              <p className="text-slate-500 text-sm mb-6 leading-relaxed">
                Transform empty spaces into furnished dreams within 24 hours.
              </p>
              <div className="flex items-baseline gap-1">
                <span className="text-primary font-black text-xl">$48</span>
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">/ room</span>
              </div>
            </div>

            <div className="bg-white p-8 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-all group">
              <div className="w-12 h-12 rounded-xl bg-primary/5 flex items-center justify-center text-primary mb-6 group-hover:bg-primary group-hover:text-white transition-colors">
                <span className="material-symbols-outlined">view_in_ar</span>
              </div>
              <h3 className="text-navy-900 font-bold text-lg mb-2">Matterport 3D</h3>
              <p className="text-slate-500 text-sm mb-6 leading-relaxed">
                The industry standard for immersive 24/7 remote property walkthroughs.
              </p>
              <div className="flex items-baseline gap-1">
                <span className="text-primary font-black text-xl">$195</span>
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">/ property</span>
              </div>
            </div>

            <div className="bg-white p-8 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-all group">
              <div className="w-12 h-12 rounded-xl bg-primary/5 flex items-center justify-center text-primary mb-6 group-hover:bg-primary group-hover:text-white transition-colors">
                <span className="material-symbols-outlined">wb_twilight</span>
              </div>
              <h3 className="text-navy-900 font-bold text-lg mb-2">Day-to-Dusk</h3>
              <p className="text-slate-500 text-sm mb-6 leading-relaxed">
                Turn standard daylight photos into atmospheric evening captures.
              </p>
              <div className="flex items-baseline gap-1">
                <span className="text-primary font-black text-xl">$25</span>
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">/ image</span>
              </div>
            </div>

            <div className="bg-white p-8 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-all group">
              <div className="w-12 h-12 rounded-xl bg-primary/5 flex items-center justify-center text-primary mb-6 group-hover:bg-primary group-hover:text-white transition-colors">
                <span className="material-symbols-outlined">cleaning_services</span>
              </div>
              <h3 className="text-navy-900 font-bold text-lg mb-2">Digital Clean</h3>
              <p className="text-slate-500 text-sm mb-6 leading-relaxed">
                Seamlessly remove tenant clutter, cars, or unsightly objects from shots.
              </p>
              <div className="flex items-baseline gap-1">
                <span className="text-primary font-black text-xl">$15</span>
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">/ image</span>
              </div>
            </div>
          </div>
        </section>

        {/* Portfolio CTA Section */}
        <section className="mt-40 rounded-[2rem] overflow-hidden relative h-[500px] shadow-2xl group">
          <img
            alt="Luxury Australian home interior"
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuAtg4zcV9wF8BAHQt7oKSqNi19bbWdpuy3m3Xd82eeNJOEuU2AsAvxjZCaaf3iS0u6KsdK_wDe3Fc7-3TYKD0MVGRcf4GnngL2Hh4EX05L9jNHqmddh9z2Z0utCRzJRzbB_uIWFRflsr4cAhw5Dd_MfCSahpYT_cUn9_UQMz-TKT50YdTec0Y_k64IRPd37yiPglolHFfYhzJCut7-jCWNnkKV-UTDSTwWsVlAW2X084TIGNQIYHixRYBNiCOdZUTksivlAJL68hcUR"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-navy-900/80 via-navy-900/20 to-transparent flex flex-col justify-end p-16">
            <div className="max-w-2xl">
              <h2 className="text-white text-4xl font-black mb-6 tracking-tight">Production Excellence.</h2>
              <p className="text-slate-200 text-lg mb-8 leading-relaxed">
                Experience why Australia&apos;s leading luxury agencies rely on EstateVision Pro for their marquee listings. View our curated 2024 Showcase.
              </p>
              <button className="flex items-center gap-3 bg-white text-navy-900 px-8 py-4 rounded-xl font-bold hover:bg-primary hover:text-white transition-all transform hover:-translate-y-1">
                <span className="material-symbols-outlined">visibility</span>
                Explore Portfolio
              </button>
            </div>
          </div>
        </section>

        {/* Benefits Section */}
        <div className="mt-32 grid grid-cols-1 md:grid-cols-3 gap-16 border-t border-slate-100 pt-16">
          <div className="flex flex-col gap-5">
            <div className="w-12 h-12 rounded-full bg-slate-50 flex items-center justify-center text-primary">
              <span className="material-symbols-outlined" style={{fontSize: '28px'}}>timer</span>
            </div>
            <div>
              <h4 className="text-navy-900 font-bold text-lg">Next-Day Turnaround</h4>
              <p className="text-slate-500 text-sm mt-2 leading-relaxed">
                Time is money in real estate. Photos delivered in 24h, video in 48h. Guaranteed.
              </p>
            </div>
          </div>
          <div className="flex flex-col gap-5">
            <div className="w-12 h-12 rounded-full bg-slate-50 flex items-center justify-center text-primary">
              <span className="material-symbols-outlined" style={{fontSize: '28px'}}>workspace_premium</span>
            </div>
            <div>
              <h4 className="text-navy-900 font-bold text-lg">Unmatched Quality</h4>
              <p className="text-slate-500 text-sm mt-2 leading-relaxed">
                If you&apos;re not 100% satisfied with the production, we re-shoot at our own expense.
              </p>
            </div>
          </div>
          <div className="flex flex-col gap-5">
            <div className="w-12 h-12 rounded-full bg-slate-50 flex items-center justify-center text-primary">
              <span className="material-symbols-outlined" style={{fontSize: '28px'}}>language</span>
            </div>
            <div>
              <h4 className="text-navy-900 font-bold text-lg">Nationwide Coverage</h4>
              <p className="text-slate-500 text-sm mt-2 leading-relaxed">
                Full coverage across Sydney, Melbourne, Brisbane, Gold Coast, Perth, and Adelaide.
              </p>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
