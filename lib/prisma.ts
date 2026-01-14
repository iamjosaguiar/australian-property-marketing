import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

function createPrismaClient(): PrismaClient {
  // Skip real database during Vercel build to avoid timeouts
  const isVercelBuild = process.env.VERCEL === '1' && process.env.CI === '1'

  const connectionString = process.env.DATABASE_URL || 'postgresql://user:password@localhost:5432/db'

  if (!process.env.DATABASE_URL || isVercelBuild) {
    if (isVercelBuild) {
      console.log('Vercel build detected - using mock adapter to prevent timeouts')
    } else {
      console.warn('DATABASE_URL not set - using placeholder for build. Database operations will fail and use fallback data.')
    }
  }

  const { PrismaPg } = require('@prisma/adapter-pg')
  const { Pool } = require('pg')

  const pool = new Pool({
    connectionString,
    // Configure to fail fast during build or when DATABASE_URL is missing
    max: (!process.env.DATABASE_URL || isVercelBuild) ? 0 : 10,
    min: 0,
    idleTimeoutMillis: 1,
    connectionTimeoutMillis: 100,
  })

  const adapter = new PrismaPg(pool)
  return new PrismaClient({ adapter })
}

export const prisma = globalForPrisma.prisma ?? createPrismaClient()

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma
