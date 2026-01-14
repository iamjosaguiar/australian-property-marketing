import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

function createPrismaClient(): PrismaClient {
  // During Vercel build, create a mock client that immediately throws
  // This allows build to complete quickly using fallback data in try-catch blocks
  const isVercelBuild = process.env.VERCEL === '1' && process.env.CI === '1'

  if (isVercelBuild) {
    console.log('Vercel build detected - using mock Prisma client')

    // Create mock client that throws on any database operation
    const mockClient: any = {
      $connect: async () => { throw new Error('Mock Prisma - no database') },
      $disconnect: async () => {},
    }

    // Add mock accessors for all models
    const models = ['suburb', 'state', 'city', 'service', 'lead', 'portfolioImage', 'testimonial', 'localAgency']
    models.forEach(model => {
      mockClient[model] = new Proxy({}, {
        get() {
          throw new Error('Mock Prisma - database not available during build')
        }
      })
    })

    return mockClient as PrismaClient
  }

  // Production runtime - use real database
  if (!process.env.DATABASE_URL) {
    throw new Error('DATABASE_URL is required in production runtime')
  }

  const { PrismaPg } = require('@prisma/adapter-pg')
  const { Pool } = require('pg')

  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    max: 10,
  })

  const adapter = new PrismaPg(pool)
  return new PrismaClient({ adapter })
}

export const prisma = globalForPrisma.prisma ?? createPrismaClient()

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma
