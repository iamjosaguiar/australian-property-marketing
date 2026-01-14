import { PrismaClient } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'
import { Pool } from 'pg'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

function createPrismaClient() {
  // During build time, DATABASE_URL might not be available
  // Return a mock client that will throw on actual use
  if (!process.env.DATABASE_URL) {
    console.warn('DATABASE_URL not set - Prisma client will not be functional')
    // Return a Proxy that throws on any method call
    return new Proxy({} as PrismaClient, {
      get() {
        throw new Error('DATABASE_URL environment variable is not set. Database operations are not available.')
      }
    })
  }

  const pool = new Pool({ connectionString: process.env.DATABASE_URL })
  const adapter = new PrismaPg(pool)

  return new PrismaClient({ adapter })
}

export const prisma = globalForPrisma.prisma ?? createPrismaClient()

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma
