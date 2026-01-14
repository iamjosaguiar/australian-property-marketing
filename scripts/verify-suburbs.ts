import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';

const connectionString = 'postgres://postgres:postgres@localhost:51214/template1?sslmode=disable';
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  // Get total count
  const totalCount = await prisma.suburb.count();
  console.log(`Total suburbs in database: ${totalCount}`);

  // Get count by state
  const byState = await prisma.suburb.groupBy({
    by: ['state'],
    _count: true,
    orderBy: {
      _count: {
        state: 'desc'
      }
    }
  });

  console.log('\nSuburbs by state:');
  byState.forEach(item => {
    console.log(`  ${item.state}: ${item._count}`);
  });

  // Show some example suburbs
  const examples = await prisma.suburb.findMany({
    take: 5,
    select: {
      name: true,
      state: true,
      postcode: true,
      latitude: true,
      longitude: true
    }
  });

  console.log('\nExample suburbs:');
  examples.forEach(suburb => {
    console.log(`  ${suburb.name}, ${suburb.state} ${suburb.postcode} (${suburb.latitude}, ${suburb.longitude})`);
  });
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
