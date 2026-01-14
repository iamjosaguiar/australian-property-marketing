import { PrismaClient } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'
import { Pool } from 'pg'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

let _prisma: PrismaClient | undefined

function createPrismaClient(): PrismaClient {
  // During build time without DATABASE_URL, return a mock
  if (!process.env.DATABASE_URL) {
    console.warn('DATABASE_URL not set - creating mock Prisma client')
    // Create a mock client that will cause try-catch blocks to trigger
    const mockClient = {
      $connect: async () => { throw new Error('No DATABASE_URL') },
      $disconnect: async () => {},
    } as any

    // Add proxies for common model accessors to throw errors
    const models = ['suburb', 'state', 'city', 'service', 'lead', 'portfolioImage', 'testimonial', 'localAgency']
    models.forEach(model => {
      mockClient[model] = new Proxy({}, {
        get() {
          throw new Error('DATABASE_URL not configured')
        }
      })
    })

    return mockClient
  }

  const pool = new Pool({ connectionString: process.env.DATABASE_URL })
  const adapter = new PrismaPg(pool)
  return new PrismaClient({ adapter })
}

// Lazy initialization
export const prisma = new Proxy({} as PrismaClient, {
  get(target, prop) {
    // Initialize on first access
    if (!_prisma) {
      _prisma = globalForPrisma.prisma ?? createPrismaClient()
      if (process.env.NODE_ENV !== 'production') {
        globalForPrisma.prisma = _prisma
      }
    }

    const value = (_prisma as any)[prop]
    return typeof value === 'function' ? value.bind(_prisma) : value
  }
})
