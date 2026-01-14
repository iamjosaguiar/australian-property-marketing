# Production Deployment Guide

## Setting Up Production Database for Vercel

Your live site needs a production database with the suburb data. Here are your options:

### Option 1: Vercel Postgres (Recommended - Easiest)

1. **Install Vercel Postgres:**
   ```bash
   # Install Vercel CLI if you haven't
   npm i -g vercel

   # Link your project
   vercel link

   # Add Vercel Postgres
   vercel postgres create
   ```

2. **Connect to your project:**
   - Go to https://vercel.com/dashboard
   - Select your project
   - Go to Storage tab
   - Create a new Postgres database
   - It will automatically add DATABASE_URL to your environment variables

3. **Push schema to production:**
   ```bash
   # Pull environment variables
   vercel env pull .env.production

   # Push schema
   DATABASE_URL="<your-vercel-postgres-url>" npx prisma db push
   ```

4. **Seed production database:**
   ```bash
   # Run suburb seeding
   DATABASE_URL="<your-vercel-postgres-url>" npm run db:seed-suburbs
   ```

5. **Redeploy:**
   ```bash
   git push  # Triggers automatic deployment
   ```

---

### Option 2: Prisma Postgres (What you're using locally)

1. **Create production database:**
   ```bash
   # Create a new hosted Prisma Postgres database
   npx prisma postgres create production-db
   ```

2. **Add to Vercel:**
   - Copy the production DATABASE_URL
   - Go to Vercel Dashboard → Your Project → Settings → Environment Variables
   - Add `DATABASE_URL` with the production URL
   - Apply to Production environment

3. **Push schema:**
   ```bash
   DATABASE_URL="<your-production-url>" npx prisma db push
   ```

4. **Seed database:**
   ```bash
   DATABASE_URL="<your-production-url>" npm run db:seed-suburbs
   ```

5. **Redeploy:**
   ```bash
   vercel --prod
   ```

---

### Option 3: Neon (Free PostgreSQL)

1. **Create Neon account:**
   - Go to https://neon.tech
   - Create a free project
   - Copy the connection string

2. **Add to Vercel:**
   - Vercel Dashboard → Settings → Environment Variables
   - Add `DATABASE_URL` with your Neon connection string

3. **Push schema:**
   ```bash
   DATABASE_URL="<your-neon-url>" npx prisma db push
   ```

4. **Seed database:**
   ```bash
   DATABASE_URL="<your-neon-url>" npm run db:seed-suburbs
   ```

5. **Redeploy**

---

### Option 4: Supabase (Free PostgreSQL)

1. **Create Supabase project:**
   - Go to https://supabase.com
   - Create a new project
   - Get connection string from Settings → Database

2. **Add to Vercel:**
   - Add `DATABASE_URL` to Vercel environment variables
   - Format: `postgresql://postgres:[YOUR-PASSWORD]@[YOUR-PROJECT-REF].supabase.co:5432/postgres`

3. **Push schema and seed:**
   ```bash
   DATABASE_URL="<your-supabase-url>" npx prisma db push
   DATABASE_URL="<your-supabase-url>" npm run db:seed-suburbs
   ```

---

## Current Status

✅ **Local Development:** Working with all 17,857 suburbs
❌ **Production (Vercel):** Needs database setup and seeding

## After Setup

Once you've completed the steps above, your Service Areas search will work on the live site with all Australian suburbs available for search!

## Troubleshooting

**"Can't reach database server" error:**
- Make sure DATABASE_URL is added to Vercel environment variables
- Redeploy after adding environment variables

**"No locations found" on live site:**
- Database might not be seeded yet
- Run the seeding script with production DATABASE_URL

**Build fails on Vercel:**
- Current code handles builds without database (mock client)
- Build should complete successfully
- Issue only affects runtime if DATABASE_URL is missing

## Quick Commands Reference

```bash
# Test API locally
curl "http://localhost:3000/api/suburbs?q=sydney&limit=5"

# Verify production database
DATABASE_URL="<prod-url>" npx tsx scripts/verify-suburbs.ts

# Seed production
DATABASE_URL="<prod-url>" npm run db:seed-suburbs

# Check Vercel deployment logs
vercel logs --prod
```
