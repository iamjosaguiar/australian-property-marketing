import Link from 'next/link';
import Image from 'next/image';

export default function Header() {
  return (
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
          <Link href="/#services" className="text-sm font-semibold text-slate-600 hover:text-primary transition-colors">
            Services
          </Link>
          <Link href="/#portfolio" className="text-sm font-semibold text-slate-600 hover:text-primary transition-colors">
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
  );
}
