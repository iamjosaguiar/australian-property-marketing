import Link from 'next/link';
import Image from 'next/image';

export const metadata = {
  title: 'Agent Dashboard | Australian Property Marketing',
  description: 'Manage your property marketing campaigns and creative assets with precision.',
};

export default function DashboardPage() {
  return (
    <div className="bg-background-main font-display text-slate-900 min-h-screen">
      <div className="flex h-screen overflow-hidden">
        {/* Sidebar */}
        <aside className="w-64 flex-shrink-0 bg-sidebar-bg flex flex-col justify-between border-r border-slate-200">
          <div className="flex flex-col gap-6 p-6">
            <Link href="/" className="flex flex-col gap-2">
              <Image
                src="/APM Logo.png"
                alt="Australian Property Marketing"
                width={200}
                height={44}
                className="h-8 w-auto"
              />
              <p className="text-slate-500 text-xs font-normal">Agent Portal • Sydney</p>
            </Link>
            <nav className="flex flex-col gap-1">
              <Link className="flex items-center gap-3 px-3 py-2 rounded-lg active-nav" href="#">
                <span className="material-symbols-outlined">dashboard</span>
                <span className="text-sm font-semibold">Dashboard</span>
              </Link>
              <Link className="flex items-center gap-3 px-3 py-2 text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors rounded-lg" href="#">
                <span className="material-symbols-outlined text-slate-400">house</span>
                <span className="text-sm font-medium">My Listings</span>
              </Link>
              <Link className="flex items-center gap-3 px-3 py-2 text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors rounded-lg" href="#">
                <span className="material-symbols-outlined text-slate-400">calendar_today</span>
                <span className="text-sm font-medium">Bookings</span>
              </Link>
              <Link className="flex items-center gap-3 px-3 py-2 text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors rounded-lg" href="#">
                <span className="material-symbols-outlined text-slate-400">analytics</span>
                <span className="text-sm font-medium">Analytics</span>
              </Link>
              <Link className="flex items-center gap-3 px-3 py-2 text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors rounded-lg" href="#">
                <span className="material-symbols-outlined text-slate-400">payments</span>
                <span className="text-sm font-medium">Billing</span>
              </Link>
            </nav>
          </div>
          <div className="flex flex-col gap-4 p-6">
            <button className="w-full flex items-center justify-center gap-2 rounded-lg h-11 bg-primary hover:bg-primary/90 text-white text-sm font-bold transition-all shadow-md">
              <span className="material-symbols-outlined">add_a_photo</span>
              <span>Book New Shoot</span>
            </button>
            <div className="flex flex-col gap-1 border-t border-slate-100 pt-4">
              <Link className="flex items-center gap-3 px-3 py-2 text-slate-500 hover:text-slate-900 transition-colors" href="#">
                <span className="material-symbols-outlined text-[20px]">settings</span>
                <span className="text-sm font-medium">Settings</span>
              </Link>
              <Link className="flex items-center gap-3 px-3 py-2 text-slate-500 hover:text-slate-900 transition-colors" href="#">
                <span className="material-symbols-outlined text-[20px]">help</span>
                <span className="text-sm font-medium">Support</span>
              </Link>
            </div>
          </div>
        </aside>

        <main className="flex-1 flex flex-col overflow-y-auto">
          {/* Header */}
          <header className="sticky top-0 z-10 flex items-center justify-between border-b border-slate-200 bg-white/80 backdrop-blur-md px-8 py-4">
            <div className="flex items-center gap-4 flex-1 max-w-xl">
              <div className="relative w-full">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">search</span>
                <input
                  className="w-full bg-slate-100 border-none rounded-lg pl-10 pr-4 py-2 text-sm focus:ring-2 focus:ring-primary text-slate-900 placeholder-slate-500"
                  placeholder="Search addresses, campaigns or assets..."
                  type="text"
                />
              </div>
            </div>
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                <button className="p-2 text-slate-500 hover:bg-slate-100 rounded-lg relative">
                  <span className="material-symbols-outlined">notifications</span>
                  <span className="absolute top-2 right-2.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
                </button>
                <button className="p-2 text-slate-500 hover:bg-slate-100 rounded-lg">
                  <span className="material-symbols-outlined">person</span>
                </button>
              </div>
              <div className="flex items-center gap-3 pl-6 border-l border-slate-200">
                <div className="text-right hidden sm:block">
                  <p className="text-sm font-bold text-slate-900">Marcus Sterling</p>
                  <p className="text-xs text-slate-500">Senior Partner</p>
                </div>
                <div className="size-10 rounded-full overflow-hidden border-2 border-primary/20">
                  <img
                    alt="Professional headshot"
                    className="w-full h-full object-cover"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuByTlX44safrKrEKUg17ZO90-CBCtTV7DfkpnzVZ0SBFEgOZ6bNNez66HXHLO-unIFZ0gxtv731lEuXrA7794UI4BJ7Xktr9VxnJi2QmHHIpJXC1YDgVUtf56teHYtlCObrsxnJ7yE7GUzCw-Inx2A2B_lpaDzUIPwArD8_d1JKzJ65uQ9FXhvhMyMGVyib6dPkuZ5iBUCqPL8xAHtkL_tuA-H26IGR3pRByTA_PMeBfpNfxkT25xDi1dbLEFeLLjI8T169hOr5l8m9"
                  />
                </div>
              </div>
            </div>
          </header>

          <div className="p-8 max-w-7xl mx-auto w-full">
            {/* Page Title */}
            <div className="flex flex-wrap items-end justify-between gap-4 mb-8">
              <div>
                <h2 className="text-3xl font-black tracking-tight mb-2 text-slate-900">Campaign Dashboard</h2>
                <p className="text-slate-500">Manage your property marketing and creative assets with precision.</p>
              </div>
              <div className="flex gap-3">
                <button className="px-4 py-2 rounded-lg border border-slate-200 bg-white text-slate-700 font-semibold text-sm hover:bg-slate-50 transition-colors shadow-sm">
                  Export Report
                </button>
                <button className="px-4 py-2 rounded-lg bg-primary text-white font-semibold text-sm hover:bg-primary/90 transition-colors shadow-md">
                  View All Listings
                </button>
              </div>
            </div>

            {/* Listings Overview */}
            <section className="mb-10">
              <h3 className="text-lg font-bold mb-4 flex items-center gap-2 text-slate-800">
                My Listings Overview
                <span className="px-2 py-0.5 rounded-full bg-slate-200 text-[10px] uppercase font-black text-slate-600">8 Active</span>
              </h3>
              <div className="flex gap-4 overflow-x-auto pb-2 -mx-2 px-2">
                <div className="flex items-center gap-2 bg-primary text-white px-4 py-2.5 rounded-lg cursor-pointer shrink-0 shadow-lg shadow-primary/20">
                  <span className="material-symbols-outlined text-sm">list</span>
                  <span className="text-sm font-medium">All Listings</span>
                  <span className="bg-white/20 px-1.5 rounded text-[10px] font-bold">12</span>
                </div>
                <div className="flex items-center gap-2 bg-white border border-slate-200 px-4 py-2.5 rounded-lg cursor-pointer shrink-0 hover:border-primary transition-colors shadow-sm">
                  <span className="material-symbols-outlined text-sm text-amber-500">calendar_month</span>
                  <span className="text-sm font-medium text-slate-700">Shoot Scheduled</span>
                  <span className="bg-slate-100 px-1.5 rounded text-[10px] font-bold text-slate-500">3</span>
                </div>
                <div className="flex items-center gap-2 bg-white border border-slate-200 px-4 py-2.5 rounded-lg cursor-pointer shrink-0 hover:border-primary transition-colors shadow-sm">
                  <span className="material-symbols-outlined text-sm text-blue-500">edit_square</span>
                  <span className="text-sm font-medium text-slate-700">Editing</span>
                  <span className="bg-slate-100 px-1.5 rounded text-[10px] font-bold text-slate-500">4</span>
                </div>
                <div className="flex items-center gap-2 bg-white border border-slate-200 px-4 py-2.5 rounded-lg cursor-pointer shrink-0 hover:border-primary transition-colors shadow-sm">
                  <span className="material-symbols-outlined text-sm text-green-500">check_circle</span>
                  <span className="text-sm font-medium text-slate-700">Ready for Download</span>
                  <span className="bg-slate-100 px-1.5 rounded text-[10px] font-bold text-slate-500">5</span>
                </div>
              </div>
            </section>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Main Content */}
              <div className="lg:col-span-2 space-y-6">
                <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
                  <div className="p-6 border-b border-slate-100 flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="px-2 py-0.5 rounded bg-green-100 text-green-700 text-[10px] font-black uppercase tracking-wider">Ready for Download</span>
                        <span className="text-xs text-slate-400">• Delivered 2h ago</span>
                      </div>
                      <h4 className="text-xl font-bold text-slate-900">420 Collins Street, Melbourne VIC 3000</h4>
                      <p className="text-slate-500 text-sm font-medium">Luxury 3 Bed Penthouse • Campaign #8821</p>
                    </div>
                    <div className="flex gap-2">
                      <button className="p-2 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors">
                        <span className="material-symbols-outlined text-slate-500">share</span>
                      </button>
                      <button className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg font-bold text-sm shadow-md">
                        <span className="material-symbols-outlined text-sm">download</span>
                        Download All
                      </button>
                    </div>
                  </div>
                  <div className="p-6 grid grid-cols-12 gap-3 h-[450px]">
                    <div className="col-span-8 h-full rounded-lg overflow-hidden group relative">
                      <img
                        alt="Main luxury living room photo"
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                        src="https://lh3.googleusercontent.com/aida-public/AB6AXuBkxxVkgrNphHKO36roIoDfKrZ1ID1qIqOYrW10plDwBj9VEi_xsbEfnPitzf5HYCmlotarxRtXfG2V3PNjTvvQZkWkExJgM3uSOyofoy3vGEH2m-IWwePECXI03XPx5K2CvDqgDlG9vq1gcHCciHGyW_qKh4UPTGJPS4woD-0picozZ5MN35MQA6_U9fj2H427JNp4d8C8RECvUtJI8K1oeTq4zty8P22IJ3dRHDGFXogngr7z1DyZtQhmtFOQDSNk_udLXmdFNqYY"
                      />
                      <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <button className="bg-white text-slate-900 px-4 py-2 rounded-full font-bold text-xs uppercase tracking-widest shadow-xl">
                          Preview Large
                        </button>
                      </div>
                    </div>
                    <div className="col-span-4 flex flex-col gap-3">
                      <div className="h-1/2 rounded-lg overflow-hidden group relative">
                        <img
                          alt="Luxury kitchen design"
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                          src="https://lh3.googleusercontent.com/aida-public/AB6AXuDTRbU5dnadSbKX2fXZE2sfZzMhYYK0MLu8Ua4xnAGnZEchjmpf3NXgiTot95EtAoYrsnLRFnoFhTUZHVY8ljTF_r5_G-E1HA40kQ3Z_3VjaZgpjw46eV9QahCOni9DBex0siOdw4Y3dWDgb8EA2jcNMEDV1B3NpxyleMXLC53C4AHTk9wsrvcF-LwSv7r-LV5CxKyk7sFK_gyV50dOqd0dSpkETddgQRHJ5KmxdTmRjPULqKP7vFAyrM0h647wfWijce04jiqQ4jIJ"
                        />
                      </div>
                      <div className="h-1/2 rounded-lg overflow-hidden relative group">
                        <img
                          alt="Modern bathroom fixtures"
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                          src="https://lh3.googleusercontent.com/aida-public/AB6AXuBHADcYsv_6vt4gAdRJ-LBFdJdjf5nJc-5wu6tp_cu2BwPUvElNI3aRst-on1g00xhgbBi0hvGC1HfR4GWh7lADWKVQigfJRjkAOwOs3AIwjvmccRCUrcbfurYDnn1ICFosCjBxII5RrfT2Q_3s0b-BKHBCcSTP3BHsrDL_mRqBTUGl-hxXyTKIxxlk3qSS6nXnXTxdh8UofS0aa_Q_uygepCjSTHXkw597571IeizCQ-k0IFdFzNjxRC12eO9FDzzE8b44onj3-2Kl"
                        />
                        <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                          <span className="text-white font-black text-xl">+12 Photos</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="px-6 py-4 bg-slate-50 flex flex-wrap gap-4 border-t border-slate-100">
                    <a className="flex-1 min-w-[180px] flex items-center gap-3 px-4 py-2 bg-white border border-slate-200 rounded-lg group transition-all hover:border-primary hover:shadow-md" href="#">
                      <div className="size-8 rounded bg-red-50 flex items-center justify-center text-red-500 group-hover:bg-red-500 group-hover:text-white transition-colors">
                        <span className="material-symbols-outlined text-[20px]">movie</span>
                      </div>
                      <div className="text-left">
                        <p className="text-xs font-bold leading-none mb-1 text-slate-800">Cinematic Video</p>
                        <p className="text-[10px] text-slate-500">4K HDR • 90 Seconds</p>
                      </div>
                    </a>
                    <a className="flex-1 min-w-[180px] flex items-center gap-3 px-4 py-2 bg-white border border-slate-200 rounded-lg group transition-all hover:border-primary hover:shadow-md" href="#">
                      <div className="size-8 rounded bg-blue-50 flex items-center justify-center text-blue-500 group-hover:bg-blue-500 group-hover:text-white transition-colors">
                        <span className="material-symbols-outlined text-[20px]">floor</span>
                      </div>
                      <div className="text-left">
                        <p className="text-xs font-bold leading-none mb-1 text-slate-800">Interactive Floorplan</p>
                        <p className="text-[10px] text-slate-500">2D &amp; 3D Rendered</p>
                      </div>
                    </a>
                    <a className="flex-1 min-w-[180px] flex items-center gap-3 px-4 py-2 bg-white border border-slate-200 rounded-lg group transition-all hover:border-primary hover:shadow-md" href="#">
                      <div className="size-8 rounded bg-purple-50 flex items-center justify-center text-purple-500 group-hover:bg-purple-500 group-hover:text-white transition-colors">
                        <span className="material-symbols-outlined text-[20px]">share_reviews</span>
                      </div>
                      <div className="text-left">
                        <p className="text-xs font-bold leading-none mb-1 text-slate-800">Social Media Reel</p>
                        <p className="text-[10px] text-slate-500">Instagram / TikTok optimized</p>
                      </div>
                    </a>
                  </div>
                </div>
              </div>

              {/* Sidebar Content */}
              <div className="space-y-6">
                <div className="bg-gradient-to-br from-primary to-primary/90 p-6 rounded-xl text-white shadow-xl relative overflow-hidden group">
                  <div className="relative z-10">
                    <div className="flex items-center gap-2 mb-4">
                      <span className="material-symbols-outlined">auto_awesome</span>
                      <span className="text-[10px] font-black uppercase tracking-tighter bg-white/20 px-2 py-1 rounded">AI Enhanced</span>
                    </div>
                    <h5 className="text-xl font-bold mb-2 leading-tight">Virtual Staging</h5>
                    <p className="text-white/80 text-sm mb-6">
                      Convert empty rooms into designer spaces in 12 hours. AI-powered realism that drives 40% more views.
                    </p>
                    <button className="w-full bg-white text-primary font-bold py-3 rounded-lg hover:bg-slate-50 transition-colors shadow-lg shadow-black/10">
                      Request AI Staging
                    </button>
                  </div>
                  <div className="absolute -right-4 -bottom-4 opacity-10 transform rotate-12 group-hover:scale-110 transition-transform duration-700">
                    <span className="material-symbols-outlined text-[140px]">chair_alt</span>
                  </div>
                </div>

                <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
                  <h5 className="font-bold mb-4 flex items-center justify-between text-slate-800">
                    Campaign Stats
                    <span className="text-[10px] text-slate-400 font-normal uppercase">Real-time</span>
                  </h5>
                  <div className="space-y-5">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="size-10 rounded-lg bg-blue-50 flex items-center justify-center">
                          <span className="material-symbols-outlined text-primary">visibility</span>
                        </div>
                        <div>
                          <p className="text-xs text-slate-500">Total Views</p>
                          <p className="font-bold text-slate-900">2,481</p>
                        </div>
                      </div>
                      <span className="text-green-600 text-xs font-bold flex items-center">
                        +12% <span className="material-symbols-outlined text-sm">trending_up</span>
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="size-10 rounded-lg bg-blue-50 flex items-center justify-center">
                          <span className="material-symbols-outlined text-primary">group</span>
                        </div>
                        <div>
                          <p className="text-xs text-slate-500">Direct Leads</p>
                          <p className="font-bold text-slate-900">42</p>
                        </div>
                      </div>
                      <span className="text-green-600 text-xs font-bold flex items-center">
                        +5% <span className="material-symbols-outlined text-sm">trending_up</span>
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="size-10 rounded-lg bg-blue-50 flex items-center justify-center">
                          <span className="material-symbols-outlined text-primary">schedule</span>
                        </div>
                        <div>
                          <p className="text-xs text-slate-500">Days on Market</p>
                          <p className="font-bold text-slate-900">4 Days</p>
                        </div>
                      </div>
                      <span className="text-slate-400 text-xs font-bold flex items-center">-</span>
                    </div>
                  </div>
                  <button className="w-full mt-6 text-primary text-xs font-bold flex items-center justify-center gap-1 hover:underline">
                    Full Analytics Report <span className="material-symbols-outlined text-sm">arrow_forward</span>
                  </button>
                </div>

                <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
                  <h5 className="font-bold mb-4 text-slate-800">Marketing Checklist</h5>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <span className="material-symbols-outlined text-green-500 text-sm">check_circle</span>
                      <span className="text-sm text-slate-700">Professional Photography</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="material-symbols-outlined text-green-500 text-sm">check_circle</span>
                      <span className="text-sm text-slate-700">Floorplan Drafting</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="material-symbols-outlined text-slate-300 text-sm">circle</span>
                      <span className="text-sm text-slate-500">Print Brochure Design</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="material-symbols-outlined text-slate-300 text-sm">circle</span>
                      <span className="text-sm text-slate-500">Facebook Ad Campaign</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
