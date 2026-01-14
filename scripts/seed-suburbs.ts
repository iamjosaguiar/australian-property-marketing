import 'dotenv/config';
import { PrismaClient, Prisma } from '@prisma/client';
import { readFileSync, existsSync } from 'fs';
import { join } from 'path';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';

// This project requires an adapter - use TCP connection for seeding
const connectionString = process.env.DATABASE_URL?.startsWith('prisma+postgres')
  ? 'postgres://postgres:postgres@localhost:51214/template1?sslmode=disable'
  : process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error('DATABASE_URL environment variable is required');
}

const pool = new Pool({ connectionString, max: 10 });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

interface SuburbData {
  name: string;
  slug: string;
  state: string;
  stateSlug: string;
  stateFull: string;
  postcode: string;
  lga: string | null;
  latitude: string;
  longitude: string;
  region: string | null;
}

interface SuburbLookup {
  [slug: string]: SuburbData;
}

/**
 * Load suburb data from the generated JSON file
 */
function loadSuburbData(): SuburbData[] {
  const dataPath = join(process.cwd(), 'data', 'suburb-postcode-lookup.json');

  if (!existsSync(dataPath)) {
    throw new Error(
      `Suburb data file not found at ${dataPath}. Please run "npm run refresh-suburbs" first.`
    );
  }

  console.log(`Loading suburb data from ${dataPath}...`);

  const fileContent = readFileSync(dataPath, 'utf-8');
  const lookup: SuburbLookup = JSON.parse(fileContent);

  const suburbs = Object.values(lookup);
  console.log(`Loaded ${suburbs.length} suburbs from file`);

  return suburbs;
}

/**
 * Seed all states first to ensure foreign key constraints are satisfied
 */
async function seedAllStates() {
  console.log('Seeding all states...');

  const states = [
    { code: 'NSW', name: 'New South Wales', slug: 'nsw' },
    { code: 'VIC', name: 'Victoria', slug: 'vic' },
    { code: 'QLD', name: 'Queensland', slug: 'qld' },
    { code: 'WA', name: 'Western Australia', slug: 'wa' },
    { code: 'SA', name: 'South Australia', slug: 'sa' },
    { code: 'TAS', name: 'Tasmania', slug: 'tas' },
    { code: 'ACT', name: 'Australian Capital Territory', slug: 'act' },
    { code: 'NT', name: 'Northern Territory', slug: 'nt' },
  ];

  for (const state of states) {
    await prisma.state.upsert({
      where: { code: state.code },
      update: {},
      create: {
        name: state.name,
        slug: state.slug,
        code: state.code,
        active: true,
      },
    });
  }

  console.log(`✓ Seeded ${states.length} states`);
}

/**
 * Seed suburbs in batches for better performance
 */
async function seedSuburbs(suburbs: SuburbData[], batchSize: number = 500) {
  console.log(`Seeding ${suburbs.length} suburbs in batches of ${batchSize}...`);

  let successCount = 0;
  let errorCount = 0;
  const errors: Array<{ slug: string; error: string }> = [];

  for (let i = 0; i < suburbs.length; i += batchSize) {
    const batch = suburbs.slice(i, i + batchSize);
    const batchNumber = Math.floor(i / batchSize) + 1;
    const totalBatches = Math.ceil(suburbs.length / batchSize);

    console.log(`Processing batch ${batchNumber}/${totalBatches}...`);

    // Process each suburb in the batch
    for (const suburb of batch) {
      try {
        await prisma.suburb.upsert({
          where: { slug: suburb.slug },
          update: {
            name: suburb.name,
            state: suburb.state,
            stateSlug: suburb.stateSlug,
            stateFull: suburb.stateFull,
            postcode: suburb.postcode,
            lga: suburb.lga,
            latitude: new Prisma.Decimal(suburb.latitude),
            longitude: new Prisma.Decimal(suburb.longitude),
            region: suburb.region,
          },
          create: {
            name: suburb.name,
            slug: suburb.slug,
            state: suburb.state,
            stateSlug: suburb.stateSlug,
            stateFull: suburb.stateFull,
            postcode: suburb.postcode,
            lga: suburb.lga,
            latitude: new Prisma.Decimal(suburb.latitude),
            longitude: new Prisma.Decimal(suburb.longitude),
            region: suburb.region,
            // Use default values from schema for other fields
            basePrice: 295,
            premiumPrice: 495,
            prestigePrice: 895,
            twilightPrice: 150,
            dronePrice: 150,
            stagingPrice: 48,
            travelFee: 0,
            sameDayAvailable: 'Yes',
            agentCount: 0,
            active: true,
            priority: 0,
          },
        });

        successCount++;
      } catch (error) {
        errorCount++;
        errors.push({
          slug: suburb.slug,
          error: error instanceof Error ? error.message : String(error),
        });

        // Only log first few errors to avoid spam
        if (errorCount <= 5) {
          console.error(`  ✗ Error seeding ${suburb.name} (${suburb.slug}):`, error);
        }
      }
    }

    console.log(`  ✓ Batch ${batchNumber}/${totalBatches} completed`);
  }

  console.log(`\n=== Seeding Summary ===`);
  console.log(`✓ Successfully seeded: ${successCount} suburbs`);
  if (errorCount > 0) {
    console.log(`✗ Errors: ${errorCount} suburbs`);

    if (errors.length > 0) {
      console.log('\nFirst few errors:');
      errors.slice(0, 10).forEach((err) => {
        console.log(`  - ${err.slug}: ${err.error}`);
      });
    }
  }

  return { successCount, errorCount, errors };
}

/**
 * Main execution
 */
async function main() {
  try {
    console.log('Starting suburb seeding from postcode data...\n');

    // Load suburb data from JSON
    const suburbs = loadSuburbData();

    // Seed all states first
    await seedAllStates();

    // Seed suburbs
    const result = await seedSuburbs(suburbs);

    if (result.errorCount === 0) {
      console.log('\n✓ All suburbs seeded successfully!');
    } else {
      console.log(`\n⚠ Seeding completed with ${result.errorCount} errors`);
    }
  } catch (error) {
    console.error('Error during suburb seeding:', error);
    process.exit(1);
  }
}

main()
  .catch((e) => {
    console.error('Fatal error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
