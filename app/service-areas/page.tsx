'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const SERVICES = [
  { name: 'Real Estate Photography', slug: 'real-estate-photography', path: '/real-estate-photography' },
  { name: 'Drone Photography', slug: 'drone-photography', path: '/drone-photography' },
  { name: 'Property Video', slug: 'property-video', path: '/property-video' },
  { name: 'Floor Plans', slug: 'floor-plans', path: '/floor-plans' },
  { name: 'Virtual Staging', slug: 'virtual-staging', path: '/virtual-staging' },
];

interface Suburb {
  id: number;
  name: string;
  slug: string;
  state: string;
  stateSlug: string;
  stateFull: string;
  city?: string;
}

export default function ServiceAreasPage() {
  const router = useRouter();
  const [selectedService, setSelectedService] = useState('');
  const [locationQuery, setLocationQuery] = useState('');
  const [suggestions, setSuggestions] = useState<Suburb[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Fetch suburb suggestions when user types
  useEffect(() => {
    if (locationQuery.length >= 2) {
      setLoading(true);
      fetch(`/api/suburbs?q=${encodeURIComponent(locationQuery)}&limit=10`)
        .then(res => res.json())
        .then(data => {
          setSuggestions(data.suburbs || []);
          setShowSuggestions(true);
          setLoading(false);
        })
        .catch(() => {
          setSuggestions([]);
          setLoading(false);
        });
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  }, [locationQuery]);

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (inputRef.current && !inputRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedService && locationQuery) {
      const suburb = suggestions.find(s =>
        s.name.toLowerCase() === locationQuery.toLowerCase() ||
        `${s.name}, ${s.state}`.toLowerCase() === locationQuery.toLowerCase()
      );

      if (suburb) {
        const service = SERVICES.find(s => s.slug === selectedService);
        if (service) {
          router.push(`${service.path}/${suburb.stateSlug}/${suburb.slug}`);
        }
      }
    }
  };

  const handleSuggestionClick = (suburb: Suburb) => {
    setLocationQuery(`${suburb.name}, ${suburb.state}`);
    setShowSuggestions(false);

    if (selectedService) {
      const service = SERVICES.find(s => s.slug === selectedService);
      if (service) {
        router.push(`${service.path}/${suburb.stateSlug}/${suburb.slug}`);
      }
    }
  };

  return (
    <>
      <Header />
      <main className="min-h-screen pt-20">
        {/* Breadcrumbs */}
        <nav className="bg-soft-grey py-4 px-6" aria-label="Breadcrumb">
          <ol className="max-w-7xl mx-auto flex items-center gap-2 text-sm">
            <li><Link href="/" className="text-slate-600 hover:text-primary">Home</Link></li>
            <li className="text-slate-400">/</li>
            <li className="text-slate-900 font-semibold">Service Areas</li>
          </ol>
        </nav>

        {/* Hero Section */}
        <section className="relative h-[400px] bg-gradient-to-br from-navy-900 to-slate-800">
          <div className="absolute inset-0 bg-black/40" />
          <div className="relative z-10 max-w-7xl mx-auto px-6 h-full flex flex-col justify-center">
            <h1 className="text-5xl md:text-6xl font-black text-white mb-4">
              Find Services in Your Area
            </h1>
            <p className="text-xl text-white/90 max-w-2xl">
              Professional property media services across Australia. Search by service and location to get started.
            </p>
          </div>
        </section>

        {/* Search Section */}
        <section className="py-16 px-6 bg-white">
          <div className="max-w-4xl mx-auto">
            <div className="bg-soft-grey rounded-2xl p-8 shadow-lg">
              <h2 className="text-3xl font-black mb-6 text-center">What do you need?</h2>

              <form onSubmit={handleSearch} className="space-y-6">
                {/* Service Selection */}
                <div>
                  <label htmlFor="service" className="block text-sm font-semibold text-slate-700 mb-2">
                    I need...
                  </label>
                  <select
                    id="service"
                    value={selectedService}
                    onChange={(e) => setSelectedService(e.target.value)}
                    className="w-full px-4 py-3 rounded-lg border-2 border-slate-200 focus:border-primary focus:outline-none text-lg"
                    required
                  >
                    <option value="">Select a service</option>
                    {SERVICES.map(service => (
                      <option key={service.slug} value={service.slug}>
                        {service.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Location Search with Autosuggest */}
                <div className="relative" ref={inputRef}>
                  <label htmlFor="location" className="block text-sm font-semibold text-slate-700 mb-2">
                    In...
                  </label>
                  <input
                    id="location"
                    type="text"
                    value={locationQuery}
                    onChange={(e) => setLocationQuery(e.target.value)}
                    onFocus={() => suggestions.length > 0 && setShowSuggestions(true)}
                    placeholder="Enter suburb or city name"
                    className="w-full px-4 py-3 rounded-lg border-2 border-slate-200 focus:border-primary focus:outline-none text-lg"
                    required
                    autoComplete="off"
                  />

                  {/* Autosuggest Dropdown */}
                  {showSuggestions && suggestions.length > 0 && (
                    <div className="absolute z-10 w-full mt-2 bg-white border-2 border-slate-200 rounded-lg shadow-lg max-h-96 overflow-y-auto">
                      {suggestions.map((suburb) => (
                        <button
                          key={suburb.id}
                          type="button"
                          onClick={() => handleSuggestionClick(suburb)}
                          className="w-full text-left px-4 py-3 hover:bg-soft-grey transition-colors border-b border-slate-100 last:border-0"
                        >
                          <div className="font-semibold text-navy-900">{suburb.name}</div>
                          <div className="text-sm text-slate-600">
                            {suburb.city && `${suburb.city}, `}{suburb.stateFull}
                          </div>
                        </button>
                      ))}
                    </div>
                  )}

                  {loading && (
                    <div className="absolute right-4 top-12 text-slate-400">
                      <span>Searching...</span>
                    </div>
                  )}

                  {locationQuery.length >= 2 && !loading && suggestions.length === 0 && (
                    <div className="absolute z-10 w-full mt-2 bg-white border-2 border-slate-200 rounded-lg shadow-lg p-4">
                      <p className="text-slate-600">No locations found. Try a different search.</p>
                    </div>
                  )}
                </div>

                {/* Search Button */}
                <button
                  type="submit"
                  className="w-full bg-primary hover:bg-primary/90 text-white font-bold py-4 px-8 rounded-lg transition-colors text-lg"
                  disabled={!selectedService || !locationQuery}
                >
                  Find Services
                </button>
              </form>
            </div>
          </div>
        </section>

        {/* Browse by Service */}
        <section className="py-20 px-6 bg-soft-grey">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-4xl font-black mb-12 text-center">Browse by Service</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {SERVICES.map(service => (
                <Link
                  key={service.slug}
                  href={service.path}
                  className="bg-white rounded-xl p-6 shadow-subtle hover:shadow-hover transition-shadow group"
                >
                  <h3 className="text-2xl font-bold mb-3 group-hover:text-primary transition-colors">
                    {service.name}
                  </h3>
                  <p className="text-slate-600 mb-4">
                    View all locations offering {service.name.toLowerCase()}
                  </p>
                  <span className="text-primary font-semibold flex items-center gap-2">
                    Browse Locations
                    <span className="material-symbols-outlined text-sm">arrow_forward</span>
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Popular Locations */}
        <section className="py-20 px-6 bg-white">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-4xl font-black mb-12 text-center">Popular Service Areas</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {['Sydney, NSW', 'Melbourne, VIC', 'Brisbane, QLD', 'Perth, WA', 'Adelaide, SA', 'Gold Coast, QLD', 'Canberra, ACT', 'Newcastle, NSW'].map((location) => (
                <div
                  key={location}
                  className="bg-soft-grey p-4 rounded-lg text-center hover:shadow-md transition-shadow"
                >
                  <div className="font-semibold text-navy-900">{location}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <Footer />
      </main>
    </>
  );
}
