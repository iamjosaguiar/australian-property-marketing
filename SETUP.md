# Australian Property Marketing - Setup Guide

## What's Been Implemented

### ✅ Complete Features

1. **Next.js Website with Custom Design System**
   - Coral (#F05C3E) and black (#000000) color scheme
   - APM Logo integration across all pages
   - Tailwind CSS 4 custom design system
   - Material Icons integration

2. **Programmatic SEO System**
   - Database schema for Australian suburbs
   - Dynamic route structure `/real-estate-photography/[state]/[suburb]/`
   - Comprehensive structured data (LocalBusiness, FAQPage, BreadcrumbList)
   - SEO-optimized metadata and Open Graph tags
   - Geo-targeting meta tags
   - FAQ sections with collapsible details

3. **Database Schema (Prisma ORM)**
   - States, Cities, Suburbs
   - Portfolio Images
   - Local Agencies
   - Testimonials
   - Nearby Suburbs (for internal linking)
   - Services
   - Leads (for form submissions)

4. **Sample Data**
   - 3 Sydney suburbs (Bondi, Paddington, Surry Hills)
   - Complete market statistics
   - Pricing information
   - Service packages

5. **API Routes**
   - `POST /api/leads` - Lead submission
   - `GET /api/suburbs` - Search suburbs
   - `GET /api/suburbs/[slug]` - Get suburb details

## Setup Instructions

### 1. Install Dependencies

Dependencies are already installed, including:
- Next.js 16.1.1
- Prisma 7.2.0
- tsx (for running seed script)

### 2. Database Setup

You have two options:

#### Option A: Use Existing Prisma Postgres Instance

The `.env` file is already configured with a Prisma Postgres connection string. To start the local database:

```bash
# If you have Prisma Postgres CLI installed
npx prisma dev

# Or start your existing PostgreSQL database
```

#### Option B: Use Your Own PostgreSQL Database

Update the `DATABASE_URL` in `.env` file:

```env
DATABASE_URL="postgresql://user:password@localhost:5432/apm_database"
```

### 3. Run Database Migration

Once your database is running:

```bash
npm run db:migrate
```

This will:
- Create all tables based on the Prisma schema
- Generate Prisma Client

### 4. Seed the Database

Populate the database with sample suburb data:

```bash
npm run db:seed
```

This will add:
- 3 Australian states (NSW, VIC, QLD)
- 3 cities (Sydney, Melbourne, Brisbane)
- 3 Sydney suburbs with full details
- 4 photography services
- Nearby suburb relationships

### 5. Start Development Server

```bash
npm run dev
```

Visit:
- http://localhost:3000 - Homepage
- http://localhost:3000/pricing - Pricing page
- http://localhost:3000/dashboard - Agent dashboard
- http://localhost:3000/real-estate-photography/nsw/bondi/ - Bondi suburb page
- http://localhost:3000/real-estate-photography/nsw/paddington/ - Paddington suburb page
- http://localhost:3000/real-estate-photography/nsw/surry-hills/ - Surry Hills suburb page

## Database Management Commands

```bash
# Generate Prisma Client (after schema changes)
npm run db:generate

# Open Prisma Studio (database GUI)
npm run db:studio

# Create new migration
npm run db:migrate

# Seed database
npm run db:seed
```

## Project Structure

```
aura-property-media/
├── app/
│   ├── api/                    # API routes
│   │   ├── leads/             # Lead submission endpoint
│   │   └── suburbs/           # Suburb data endpoints
│   ├── dashboard/             # Agent dashboard page
│   ├── pricing/               # Pricing page
│   ├── real-estate-photography/
│   │   └── [state]/[suburb]/  # Dynamic suburb pages
│   ├── globals.css            # Global styles & design system
│   ├── layout.tsx             # Root layout
│   └── page.tsx               # Homepage
├── lib/
│   └── prisma.ts              # Prisma client singleton
├── prisma/
│   ├── schema.prisma          # Database schema
│   └── seed.ts                # Sample data seed
├── public/
│   └── APM Logo.png           # Australian Property Marketing logo
├── DESIGN_SYSTEM.md           # Design system documentation
└── SETUP.md                   # This file
```

## SEO Features Implemented

Each suburb page includes:

1. **Structured Data**
   - LocalBusiness schema with service offerings
   - FAQPage schema with 4-6 common questions
   - BreadcrumbList schema for navigation

2. **Meta Tags**
   - Title optimized for "{Service} {Suburb} | {State}"
   - Description with pricing and key benefits
   - Open Graph tags for social sharing
   - Geo-targeting tags (region, placename, coordinates)

3. **Content Sections**
   - Hero with suburb name and CTA
   - Local market statistics (median price, days on market, growth)
   - Three pricing packages (Essential, Premium, Prestige)
   - About suburb content
   - FAQ section
   - Nearby suburbs internal linking
   - Call-to-action section

## Adding More Suburbs

To add more suburbs, you can:

1. **Manually via Prisma Studio:**
   ```bash
   npm run db:studio
   ```

2. **Via API:**
   Use the seed file as a template and add more suburb data

3. **Bulk Import:**
   Create a CSV import script based on the seed.ts pattern

## Next Steps

1. **Set up the database** (follow step 2 above)
2. **Run migrations and seed data** (steps 3-4 above)
3. **Test the suburb pages** to verify everything works
4. **Add more suburbs** for your target locations
5. **Create a booking form** at `/book/` route
6. **Add more pages** (homepage improvements, portfolio, contact)
7. **Set up form handling** for lead capture
8. **Configure production database** for deployment

## Environment Variables

Current variables in `.env`:
- `DATABASE_URL` - PostgreSQL connection string

You may want to add:
- `NEXT_PUBLIC_SITE_URL` - Your production domain
- `NEXT_PUBLIC_PHONE` - Contact phone number
- `NEXT_PUBLIC_EMAIL` - Contact email

## Deployment Checklist

Before deploying to production:

- [ ] Set up production database (e.g., Railway, Supabase, Vercel Postgres)
- [ ] Update `DATABASE_URL` in production environment
- [ ] Run migrations on production database
- [ ] Seed production database with real suburb data
- [ ] Update domain in structured data URLs
- [ ] Add Google Analytics or tracking
- [ ] Set up form submission notifications
- [ ] Configure CDN for images
- [ ] Add sitemap.xml generation
- [ ] Set up robots.txt

## Support

For questions or issues with:
- **Next.js**: https://nextjs.org/docs
- **Prisma**: https://www.prisma.io/docs
- **Tailwind CSS**: https://tailwindcss.com/docs

Built with ❤️ for Australian Property Marketing
