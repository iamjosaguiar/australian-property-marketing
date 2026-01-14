import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

function createPrismaClient(): PrismaClient {
  // Use a default connection string for build time if DATABASE_URL is not set
  // This allows Prisma to initialize but operations will fail (caught by try-catch)
  const connectionString = process.env.DATABASE_URL || 'postgresql://user:password@localhost:5432/db'

  if (!process.env.DATABASE_URL) {
    console.warn('DATABASE_URL not set - using placeholder for build. Database operations will fail and use fallback data.')
  }

  const { PrismaPg } = require('@prisma/adapter-pg')
  const { Pool } = require('pg')

  const pool = new Pool({
    connectionString,
    // If using placeholder, configure to fail fast
    ...((!process.env.DATABASE_URL) && {
      max: 0,
      min: 0,
      idleTimeoutMillis: 1,
      connectionTimeoutMillis: 1
    })
  })

  const adapter = new PrismaPg(pool)
  return new PrismaClient({ adapter })
}

export const prisma = globalForPrisma.prisma ?? createPrismaClient()

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma
