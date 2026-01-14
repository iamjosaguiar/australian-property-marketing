import { PrismaClient } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'
import { Pool } from 'pg'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

function createPrismaClient(): PrismaClient {
  if (!process.env.DATABASE_URL) {
    console.warn('DATABASE_URL not set - using dummy adapter for build')

    // Create a minimal connection pool that won't actually connect
    const dummyPool = new Pool({
      connectionString: 'postgresql://dummy:dummy@localhost:5432/dummy',
      // Prevent actual connections
      max: 0,
      connectionTimeoutMillis: 1
    })

    const adapter = new PrismaPg(dummyPool)
    return new PrismaClient({ adapter })
  }

  const pool = new Pool({ connectionString: process.env.DATABASE_URL })
  const adapter = new PrismaPg(pool)
  return new PrismaClient({ adapter })
}

export const prisma = globalForPrisma.prisma ?? createPrismaClient()

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma
