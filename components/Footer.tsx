import Link from 'next/link';
import Image from 'next/image';

export default function Footer() {
  return (
    <footer className="bg-white border-t border-slate-100 py-20 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Main Footer Content */}
        <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-12 mb-12">
          {/* Company Info */}
          <div className="lg:col-span-2">
            <div className="mb-6">
              <Link href="/">
                <Image
                  src="/APM Logo.png"
                  alt="Australian Property Marketing"
                  width={240}
                  height={52}
                  className="h-10 w-auto"
                />
              </Link>
            </div>
            <p className="text-slate-500 max-w-sm mb-6 font-medium">
              Australia&apos;s premier property marketing specialists. Delivering exceptional visual content and strategic marketing solutions nationwide.
            </p>
            <div className="flex gap-4 mb-6">
              <a className="w-10 h-10 rounded-full bg-soft-grey flex items-center justify-center text-slate-400 hover:bg-primary hover:text-white transition-all" href="#" aria-label="Social Media">
                <span className="material-symbols-outlined text-sm">social_leaderboard</span>
              </a>
              <a className="w-10 h-10 rounded-full bg-soft-grey flex items-center justify-center text-slate-400 hover:bg-primary hover:text-white transition-all" href="#" aria-label="Instagram">
                <span className="material-symbols-outlined text-sm">photo_camera</span>
              </a>
              <a className="w-10 h-10 rounded-full bg-soft-grey flex items-center justify-center text-slate-400 hover:bg-primary hover:text-white transition-all" href="#" aria-label="Video Portfolio">
                <span className="material-symbols-outlined text-sm">movie</span>
              </a>
            </div>
            {/* Contact Info */}
            <div className="space-y-2">
              <div className="flex items-center gap-3 text-slate-500 text-sm">
                <span className="material-symbols-outlined text-primary text-[18px]">call</span>
                <a href="tel:1300276463" className="hover:text-primary transition-colors">
                  1300 APM INFO
                </a>
              </div>
              <div className="flex items-center gap-3 text-slate-500 text-sm">
                <span className="material-symbols-outlined text-primary text-[18px]">mail</span>
                <a href="mailto:info@australianpropertymarketing.com.au" className="hover:text-primary transition-colors">
                  info@apm.com.au
                </a>
              </div>
            </div>
          </div>

          {/* Services */}
          <div>
            <h4 className="font-bold mb-6 text-navy-deep text-sm uppercase tracking-widest">Services</h4>
            <ul className="space-y-3 text-slate-500 text-sm font-medium">
              <li><Link className="hover:text-primary transition-colors" href="/real-estate-photography/">Photography</Link></li>
              <li><Link className="hover:text-primary transition-colors" href="/property-video/">Video Tours</Link></li>
              <li><Link className="hover:text-primary transition-colors" href="/drone-photography/">Drone</Link></li>
              <li><Link className="hover:text-primary transition-colors" href="/floor-plans/">Floor Plans</Link></li>
              <li><Link className="hover:text-primary transition-colors" href="/virtual-staging/">Virtual Staging</Link></li>
            </ul>
          </div>

          {/* Locations */}
          <div>
            <h4 className="font-bold mb-6 text-navy-deep text-sm uppercase tracking-widest">Locations</h4>
            <ul className="space-y-3 text-slate-500 text-sm font-medium">
              <li><Link className="hover:text-primary transition-colors" href="/real-estate-photography/nsw/">New South Wales</Link></li>
              <li><Link className="hover:text-primary transition-colors" href="/real-estate-photography/vic/">Victoria</Link></li>
              <li><Link className="hover:text-primary transition-colors" href="/real-estate-photography/qld/">Queensland</Link></li>
              <li className="pt-2">
                <Link className="hover:text-primary transition-colors font-bold" href="/real-estate-photography/">
                  View All →
                </Link>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="font-bold mb-6 text-navy-deep text-sm uppercase tracking-widest">Company</h4>
            <ul className="space-y-3 text-slate-500 text-sm font-medium">
              <li><Link className="hover:text-primary transition-colors" href="/">Home</Link></li>
              <li><Link className="hover:text-primary transition-colors" href="/pricing">Pricing</Link></li>
              <li><Link className="hover:text-primary transition-colors" href="#portfolio">Portfolio</Link></li>
              <li><Link className="hover:text-primary transition-colors" href="/dashboard">Agent Portal</Link></li>
              <li><Link className="hover:text-primary transition-colors" href="/book">Book Now</Link></li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-slate-100 flex flex-col md:flex-row justify-between items-center gap-4 text-slate-400 text-xs">
          <p>© 2024 Australian Property Marketing Pty Ltd. All rights reserved.</p>
          <div className="flex gap-6">
            <a className="hover:text-primary transition-colors" href="#">Privacy Policy</a>
            <a className="hover:text-primary transition-colors" href="#">Terms</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
