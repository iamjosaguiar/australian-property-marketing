/**
 * Priority Suburb Selection Script
 *
 * Selects 100-500 priority suburbs based on:
 * - Major metro areas (Sydney, Melbourne, Brisbane, Perth, Adelaide, Canberra)
 * - High median price areas (premium markets)
 * - Suburbs with existing content
 *
 * Run with: npx tsx scripts/data-ingestion/select-priority-suburbs.ts
 */

import 'dotenv/config';
import { PrismaClient, Prisma } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';

// Database connection
const connectionString = process.env.DATABASE_URL?.startsWith('prisma+postgres')
  ? 'postgres://postgres:postgres@localhost:51214/template1?sslmode=disable'
  : process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error('DATABASE_URL environment variable is required');
}

const pool = new Pool({ connectionString, max: 10 });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

// ============================================
// PRIORITY CONFIGURATION
// ============================================

/**
 * Metro area definitions with suburb counts
 * These are the primary target markets for enrichment
 */
const PRIORITY_METROS = [
  // Sydney metro - highest priority
  {
    city: 'Sydney',
    state: 'NSW',
    count: 150,
    keywords: ['sydney', 'eastern suburbs', 'northern beaches', 'inner west', 'north shore'],
    priority: 10,
  },
  // Melbourne metro
  {
    city: 'Melbourne',
    state: 'VIC',
    count: 120,
    keywords: ['melbourne', 'bayside', 'inner east', 'yarra', 'stonnington'],
    priority: 9,
  },
  // Brisbane metro
  {
    city: 'Brisbane',
    state: 'QLD',
    count: 80,
    keywords: ['brisbane', 'gold coast', 'sunshine coast'],
    priority: 8,
  },
  // Perth metro
  {
    city: 'Perth',
    state: 'WA',
    count: 50,
    keywords: ['perth', 'western suburbs', 'coastal'],
    priority: 7,
  },
  // Adelaide metro
  {
    city: 'Adelaide',
    state: 'SA',
    count: 40,
    keywords: ['adelaide', 'eastern suburbs', 'hills'],
    priority: 7,
  },
  // Canberra
  {
    city: 'Canberra',
    state: 'ACT',
    count: 30,
    keywords: ['canberra', 'inner south', 'inner north'],
    priority: 7,
  },
  // Gold Coast (separate from Brisbane)
  {
    city: 'Gold Coast',
    state: 'QLD',
    count: 30,
    keywords: ['gold coast', 'surfers', 'broadbeach', 'burleigh'],
    priority: 6,
  },
];

/**
 * High-value suburbs that should always be included
 * These are well-known premium suburbs
 */
const PREMIUM_SUBURBS = [
  // Sydney
  'bondi', 'paddington', 'surry-hills', 'mosman', 'manly', 'double-bay',
  'vaucluse', 'point-piper', 'rose-bay', 'bronte', 'coogee', 'woollahra',
  'darlinghurst', 'potts-point', 'kirribilli', 'neutral-bay', 'cremorne',
  'balmain', 'rozelle', 'newtown', 'glebe', 'chippendale', 'redfern',
  'alexandria', 'waterloo', 'zetland', 'mascot', 'randwick', 'kingsford',
  // Melbourne
  'south-yarra', 'toorak', 'brighton', 'st-kilda', 'fitzroy', 'collingwood',
  'richmond', 'prahran', 'armadale', 'malvern', 'hawthorn', 'kew',
  'carlton', 'brunswick', 'northcote', 'thornbury', 'preston', 'coburg',
  // Brisbane
  'new-farm', 'teneriffe', 'fortitude-valley', 'west-end', 'paddington-qld',
  'bulimba', 'hawthorne', 'ascot', 'hamilton', 'clayfield',
  // Perth
  'cottesloe', 'claremont', 'nedlands', 'dalkeith', 'subiaco', 'leederville',
  // Adelaide
  'norwood', 'unley', 'glenelg', 'north-adelaide', 'hyde-park',
  // Canberra
  'kingston', 'barton', 'griffith', 'manuka', 'forrest', 'red-hill',
];

// ============================================
// SELECTION FUNCTIONS
// ============================================

/**
 * Select suburbs by LGA (Local Government Area)
 */
async function selectByLGA(state: string, count: number, priority: number): Promise<string[]> {
  const suburbs = await prisma.suburb.findMany({
    where: {
      state,
      active: true,
    },
    select: { slug: true, lga: true },
    take: count * 2, // Get more to filter
  });

  // Prioritize well-known LGAs
  const priorityLGAs = {
    NSW: ['Sydney', 'Woollahra', 'Waverley', 'Randwick', 'Inner West', 'North Sydney', 'Mosman', 'Willoughby', 'Lane Cove', 'Hunters Hill'],
    VIC: ['Melbourne', 'Port Phillip', 'Stonnington', 'Yarra', 'Boroondara', 'Bayside', 'Glen Eira', 'Moreland'],
    QLD: ['Brisbane', 'Gold Coast', 'Sunshine Coast', 'Noosa'],
    WA: ['Perth', 'Cottesloe', 'Nedlands', 'Claremont', 'Cambridge'],
    SA: ['Adelaide', 'Burnside', 'Norwood Payneham St Peters', 'Unley', 'Holdfast Bay'],
    ACT: ['Canberra Central', 'South Canberra'],
  };

  const stateLGAs = priorityLGAs[state as keyof typeof priorityLGAs] || [];

  // Sort by LGA priority, then randomly
  const sorted = suburbs.sort((a, b) => {
    const aIndex = stateLGAs.findIndex(lga => a.lga?.toLowerCase().includes(lga.toLowerCase()));
    const bIndex = stateLGAs.findIndex(lga => b.lga?.toLowerCase().includes(lga.toLowerCase()));

    // If both in priority list, sort by list order
    if (aIndex >= 0 && bIndex >= 0) return aIndex - bIndex;
    // Priority list items first
    if (aIndex >= 0) return -1;
    if (bIndex >= 0) return 1;
    // Random for others
    return Math.random() - 0.5;
  });

  return sorted.slice(0, count).map(s => s.slug);
}

/**
 * Update suburb priority in database
 */
async function updatePriority(slugs: string[], priority: number): Promise<number> {
  let updated = 0;

  for (const slug of slugs) {
    try {
      await prisma.suburb.update({
        where: { slug },
        data: { priority },
      });
      updated++;
    } catch {
      // Suburb might not exist, skip
    }
  }

  return updated;
}

/**
 * Reset all suburb priorities to 0
 */
async function resetAllPriorities(): Promise<void> {
  console.log('Resetting all suburb priorities to 0...');

  await prisma.suburb.updateMany({
    data: { priority: 0 },
  });

  console.log('✓ All priorities reset');
}

/**
 * Main selection logic
 */
async function selectPrioritySuburbs(): Promise<void> {
  console.log('Starting priority suburb selection...\n');

  // First, reset all priorities
  await resetAllPriorities();

  let totalSelected = 0;

  // 1. Mark premium suburbs with highest priority
  console.log('\n--- Marking Premium Suburbs ---');
  const premiumUpdated = await updatePriority(PREMIUM_SUBURBS, 10);
  console.log(`✓ Marked ${premiumUpdated} premium suburbs with priority 10`);
  totalSelected += premiumUpdated;

  // 2. Select by metro area
  console.log('\n--- Selecting by Metro Area ---');

  for (const metro of PRIORITY_METROS) {
    console.log(`\nProcessing ${metro.city} (${metro.state})...`);

    const selected = await selectByLGA(metro.state, metro.count, metro.priority);
    const updated = await updatePriority(selected, metro.priority);

    console.log(`  ✓ Selected ${updated} suburbs for ${metro.city}`);
    totalSelected += updated;
  }

  // 3. Get final counts
  console.log('\n--- Final Summary ---');

  const priorities = await prisma.suburb.groupBy({
    by: ['priority'],
    where: { priority: { gt: 0 } },
    _count: { priority: true },
    orderBy: { priority: 'desc' },
  });

  console.log('\nSuburbs by priority:');
  for (const p of priorities) {
    console.log(`  Priority ${p.priority}: ${p._count.priority} suburbs`);
  }

  const totalPriority = await prisma.suburb.count({
    where: { priority: { gt: 0 } },
  });

  console.log(`\n✓ Total priority suburbs selected: ${totalPriority}`);
}

// ============================================
// MAIN EXECUTION
// ============================================

async function main() {
  try {
    await selectPrioritySuburbs();
    console.log('\n✓ Priority selection complete!');
  } catch (error) {
    console.error('Error during priority selection:', error);
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
    await pool.end();
  });
