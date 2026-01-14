import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

function createPrismaClient(): PrismaClient {
  if (!process.env.DATABASE_URL) {
    console.warn('DATABASE_URL not set - Prisma operations will fail and use fallback data')

    // Import adapters only when DATABASE_URL is available
    // This prevents initialization errors during build
    const { PrismaPg } = require('@prisma/adapter-pg')
    const { Pool } = require('pg')

    // Create a pool that will fail fast
    const dummyPool = new Pool({
      connectionString: 'postgresql://localhost:5432/dummy',
      max: 1,
      idleTimeoutMillis: 100,
      connectionTimeoutMillis: 100
    })

    const adapter = new PrismaPg(dummyPool)
    return new PrismaClient({ adapter })
  }

  // Only import when we have a real connection string
  const { PrismaPg } = require('@prisma/adapter-pg')
  const { Pool } = require('pg')

  const pool = new Pool({ connectionString: process.env.DATABASE_URL })
  const adapter = new PrismaPg(pool)
  return new PrismaClient({ adapter })
}

export const prisma = globalForPrisma.prisma ?? createPrismaClient()

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma
