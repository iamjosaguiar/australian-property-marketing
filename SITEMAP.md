# Australian Property Marketing - Site Navigation Structure

## Complete Navigation Hierarchy

```
Homepage (/)
├── Navigation Links:
│   ├── Locations → /real-estate-photography/
│   ├── Services → /#services
│   ├── Portfolio → /#portfolio
│   └── Pricing → /pricing
│
└── Sections:
    ├── Hero with "Browse Locations" CTA
    ├── Services Overview
    ├── **NEW** Locations Section (NSW, VIC, QLD cards)
    └── CTA with "Get Started Now" → /real-estate-photography/

---

Photography Hub (/real-estate-photography/)
├── Browse by State Section
│   ├── New South Wales → /real-estate-photography/nsw/
│   ├── Victoria → /real-estate-photography/vic/
│   └── Queensland → /real-estate-photography/qld/
│
├── Popular Locations (Featured Suburbs)
│   └── Links to individual suburb pages
│
└── Pricing Overview

---

State Hub Pages (/real-estate-photography/[state]/)
Example: /real-estate-photography/nsw/

├── State Overview with Stats
├── Featured Suburbs (priority >= 8)
│   └── Cards linking to individual suburb pages
│
├── All Suburbs Grouped by City
│   ├── Sydney
│   │   ├── Bondi → /real-estate-photography/nsw/bondi/
│   │   ├── Paddington → /real-estate-photography/nsw/paddington/
│   │   └── Surry Hills → /real-estate-photography/nsw/surry-hills/
│   │
│   └── Other Cities...
│
└── Services Overview

---

Suburb Detail Pages (/real-estate-photography/[state]/[suburb]/)
Example: /real-estate-photography/nsw/bondi/

├── Breadcrumbs (Home → Photography → State → Suburb)
├── Hero Section with CTAs
├── Market Statistics
│   ├── Median Price
│   ├── Properties Sold
│   ├── Days on Market
│   └── YoY Growth
│
├── Three Pricing Packages
│   ├── Essential ($basePrice)
│   ├── Premium ($premiumPrice) - Featured
│   └── Prestige ($prestigePrice)
│
├── About Suburb Content
│   └── Local Knowledge & Landmarks
│
├── Nearby Suburbs Internal Linking
│   └── 6 closest suburbs with distance
│
├── FAQ Section (6 questions)
│   ├── Pricing in suburb
│   ├── Turnaround time
│   ├── Drone availability
│   ├── Apartment photography
│   ├── Virtual staging
│   └── Market information
│
└── CTA with booking links

---

Pricing Page (/pricing)
├── Updated Navigation with "Locations" link
├── Package Details
└── Service Add-ons

---

Dashboard (/dashboard)
└── Agent portal (unchanged)
```

## Navigation Flow

### User Journey 1: Location-First
```
Homepage
  → "Locations" nav link
    → /real-estate-photography/ (Hub)
      → State card (e.g., "New South Wales")
        → /real-estate-photography/nsw/ (State Hub)
          → Suburb link (e.g., "Bondi")
            → /real-estate-photography/nsw/bondi/ (Suburb Page)
              → "Book Now" CTA
```

### User Journey 2: Direct Search
```
Homepage
  → Locations section (NSW, VIC, QLD cards)
    → State page
      → Suburb page
        → Booking
```

### User Journey 3: Featured Suburbs
```
Homepage
  → "Browse Locations" hero CTA
    → Photography Hub
      → Popular Locations section
        → Direct to suburb page
          → Booking
```

## Internal Linking Strategy

### Hub to Spoke
- Photography Hub links to all state pages
- State pages link to all suburbs in that state
- Suburb pages link to 6 nearby suburbs

### Cross-Linking
- Homepage features state cards with sample suburbs
- Suburb pages include breadcrumbs back to state/hub
- All pages have "Locations" in navigation

### SEO Benefits
1. **No Orphaned Pages**: Every suburb page is linked from:
   - State hub page
   - Photography services hub
   - Nearby suburb pages (6+ internal links)
   - Homepage (for featured/high-priority suburbs)

2. **Clear Hierarchy**:
   - Homepage → Hub → State → Suburb (3 clicks max)
   - Breadcrumbs on every page
   - Consistent navigation across site

3. **Internal Link Equity**:
   - High-priority suburbs get featured on homepage
   - All suburbs get state hub link
   - Nearby suburbs create natural link clusters
   - Hub pages distribute link equity to all children

## Key Pages Summary

| Page Type | Count | Example URL |
|-----------|-------|-------------|
| Homepage | 1 | `/` |
| Photography Hub | 1 | `/real-estate-photography/` |
| State Hubs | 3 | `/real-estate-photography/nsw/` |
| Suburb Pages | 3+ | `/real-estate-photography/nsw/bondi/` |
| Pricing | 1 | `/pricing` |
| Dashboard | 1 | `/dashboard` |

## Adding New Content

### To Add a New Suburb:
1. Add to database via Prisma Studio or seed file
2. Automatically appears on state hub page
3. If `priority >= 8`, appears on photography hub
4. If `priority >= 8`, appears on homepage locations section

### To Add a New State:
1. Add state to database
2. Create suburbs for that state
3. State automatically appears on photography hub
4. Manually add state card to homepage locations section

## SEO-Optimized Elements

Each suburb page includes:
- ✅ SEO-optimized title and meta description
- ✅ Open Graph tags for social sharing
- ✅ Geo-targeting meta tags (region, coordinates)
- ✅ LocalBusiness structured data (JSON-LD)
- ✅ FAQPage structured data (JSON-LD)
- ✅ BreadcrumbList structured data (JSON-LD)
- ✅ Internal links to nearby suburbs
- ✅ Local market statistics
- ✅ Location-specific content
- ✅ Clear CTAs and conversion paths

## Mobile Navigation

All pages are fully responsive:
- Hamburger menu on mobile (where applicable)
- Touch-friendly CTAs
- Simplified navigation on small screens
- Fast page loads with optimized images
