/**
 * Master Suburb Enrichment Script
 *
 * Orchestrates the full enrichment pipeline:
 * 1. Select priority suburbs
 * 2. Enrich with Census data
 * 3. Enrich with BOM weather data
 *
 * Run with: npx tsx scripts/enrich-suburbs.ts
 * Or: npm run enrich-suburbs (after adding to package.json)
 */

import 'dotenv/config';
import { PrismaClient, Prisma } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';
import { execSync } from 'child_process';
import { join } from 'path';

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
// CONFIGURATION
// ============================================

const CONFIG = {
  // Skip steps that have already been run
  skipPrioritySelection: false,
  skipCensusEnrichment: false,
  skipBomEnrichment: false,

  // Run scripts as separate processes vs inline
  useSubprocesses: false,
};

// ============================================
// INLINE IMPLEMENTATIONS
// ============================================

// Import inline implementations
import {
  censusAPI,
  getMockCensusData,
  computeCensusInsights,
} from '../lib/census-api';
import {
  bomAPI,
  getMockWeatherData,
  computeWeatherInsights,
} from '../lib/bom-api';

// Priority suburbs (simplified inline version)
const PREMIUM_SUBURBS = [
  'bondi', 'paddington', 'surry-hills', 'mosman', 'manly', 'double-bay',
  'south-yarra', 'toorak', 'brighton', 'st-kilda', 'fitzroy',
  'new-farm', 'teneriffe', 'fortitude-valley', 'west-end',
  'cottesloe', 'claremont', 'subiaco',
  'norwood', 'unley', 'glenelg',
  'kingston', 'griffith', 'manuka',
];

// ============================================
// STEP FUNCTIONS
// ============================================

async function step1_SelectPrioritySuburbs(): Promise<void> {
  console.log('\n========================================');
  console.log('STEP 1: Selecting Priority Suburbs');
  console.log('========================================\n');

  if (CONFIG.skipPrioritySelection) {
    console.log('Skipped (skipPrioritySelection = true)');
    return;
  }

  // Reset all priorities
  await prisma.suburb.updateMany({
    data: { priority: 0 },
  });

  // Set premium suburbs to highest priority
  let updated = 0;
  for (const slug of PREMIUM_SUBURBS) {
    try {
      await prisma.suburb.updateMany({
        where: {
          slug: { contains: slug },
        },
        data: { priority: 10 },
      });
      updated++;
    } catch {
      // Skip if not found
    }
  }

  // Select additional suburbs by state for diversity
  const stateCounts = { NSW: 100, VIC: 80, QLD: 60, WA: 40, SA: 30, ACT: 20, TAS: 15, NT: 10 };

  for (const [state, count] of Object.entries(stateCounts)) {
    const suburbs = await prisma.suburb.findMany({
      where: { state, priority: 0, active: true },
      take: count,
      select: { id: true },
    });

    if (suburbs.length > 0) {
      await prisma.suburb.updateMany({
        where: { id: { in: suburbs.map(s => s.id) } },
        data: { priority: 5 },
      });
    }

    console.log(`  ${state}: Selected ${suburbs.length} suburbs`);
  }

  const total = await prisma.suburb.count({ where: { priority: { gt: 0 } } });
  console.log(`\n✓ Total priority suburbs: ${total}`);
}

async function step2_CensusEnrichment(): Promise<void> {
  console.log('\n========================================');
  console.log('STEP 2: Census Data Enrichment');
  console.log('========================================\n');

  if (CONFIG.skipCensusEnrichment) {
    console.log('Skipped (skipCensusEnrichment = true)');
    return;
  }

  const suburbs = await prisma.suburb.findMany({
    where: { priority: { gt: 0 }, active: true },
    select: { id: true, slug: true, name: true, state: true, latitude: true, longitude: true },
    orderBy: { priority: 'desc' },
  });

  console.log(`Processing ${suburbs.length} suburbs...\n`);

  let success = 0;
  let errors = 0;

  for (let i = 0; i < suburbs.length; i++) {
    const suburb = suburbs[i];

    try {
      // Get mock census data
      const censusData = getMockCensusData(
        `mock-${suburb.slug}`,
        suburb.name,
        suburb.state
      );
      const insights = computeCensusInsights(censusData);

      await prisma.suburb.update({
        where: { id: suburb.id },
        data: {
          dwellingHouses: censusData.dwellingHouses,
          dwellingUnits: censusData.dwellingUnits,
          dwellingTownhouses: censusData.dwellingTownhouses,
          primaryDwellingType: insights.primaryDwellingType,
          dwellingTypeRatio: insights.dwellingTypeRatio,
          ownerOccupied: censusData.ownerOccupied,
          renterOccupied: censusData.renterOccupied,
          ownerPercentage: insights.ownerPercentage ? new Prisma.Decimal(insights.ownerPercentage) : null,
          renterPercentage: insights.renterPercentage ? new Prisma.Decimal(insights.renterPercentage) : null,
          tenureProfile: insights.tenureProfile,
          medianWeeklyIncome: censusData.medianWeeklyIncome,
          medianAnnualIncome: insights.medianAnnualIncome,
          incomeQuartile: insights.incomeQuartile,
          avgBedrooms: insights.avgBedrooms ? new Prisma.Decimal(insights.avgBedrooms) : null,
          population: censusData.population,
          medianAge: censusData.medianAge,
          censusYear: 2021,
          censusUpdated: new Date(),
          floorPlanComplexity: insights.floorPlanComplexity,
          typicalLayoutNotes: insights.typicalLayoutNotes,
          stagingTargetAudience: insights.stagingTargetAudience,
          stagingStyleHint: insights.stagingStyleHint,
        },
      });

      success++;
      if ((i + 1) % 50 === 0) {
        console.log(`  Progress: ${i + 1}/${suburbs.length}`);
      }
    } catch (error) {
      errors++;
    }
  }

  console.log(`\n✓ Census enrichment: ${success} success, ${errors} errors`);
}

async function step3_BomEnrichment(): Promise<void> {
  console.log('\n========================================');
  console.log('STEP 3: BOM Weather Enrichment');
  console.log('========================================\n');

  if (CONFIG.skipBomEnrichment) {
    console.log('Skipped (skipBomEnrichment = true)');
    return;
  }

  const suburbs = await prisma.suburb.findMany({
    where: { priority: { gt: 0 }, active: true },
    select: { id: true, slug: true, name: true, state: true, latitude: true, longitude: true },
    orderBy: { priority: 'desc' },
  });

  console.log(`Processing ${suburbs.length} suburbs...\n`);

  let success = 0;
  let errors = 0;

  for (let i = 0; i < suburbs.length; i++) {
    const suburb = suburbs[i];

    try {
      const lat = Number(suburb.latitude);
      const lon = Number(suburb.longitude);

      // Try to get real station data, fall back to mock
      const weatherResult = bomAPI.getWeatherForSuburb(lat, lon);
      const climateData = weatherResult?.climateData || getMockWeatherData(suburb.state);
      const insights = computeWeatherInsights(climateData, lat);

      await prisma.suburb.update({
        where: { id: suburb.id },
        data: {
          annualSunnyDays: climateData.annualSunnyDays,
          annualRainyDays: climateData.annualRainyDays,
          bestMonthsPhotography: insights.bestMonthsPhotography,
          avgWindSpeedKmh: new Prisma.Decimal(climateData.avgWindSpeedKmh),
          lowWindDays: climateData.lowWindDays,
          droneFlightRating: insights.droneFlightRating,
          droneSeasonNotes: insights.droneSeasonNotes,
          droneRecommended: insights.droneRecommended,
          avgSunsetTime: insights.avgSunsetTime,
          goldenHourStart: insights.goldenHourStart,
          twilightDuration: insights.twilightDuration,
          bestTwilightMonths: insights.bestTwilightMonths,
          avgSummerMaxTemp: new Prisma.Decimal(climateData.avgSummerMaxTemp),
          avgWinterMaxTemp: new Prisma.Decimal(climateData.avgWinterMaxTemp),
          nearestBomStation: weatherResult?.station.name || `${suburb.state} Reference`,
          bomStationId: weatherResult?.station.id || 'MOCK',
          weatherUpdated: new Date(),
          photographySeasonTip: insights.photographySeasonTip,
        },
      });

      success++;
      if ((i + 1) % 50 === 0) {
        console.log(`  Progress: ${i + 1}/${suburbs.length}`);
      }
    } catch (error) {
      errors++;
    }
  }

  console.log(`\n✓ BOM enrichment: ${success} success, ${errors} errors`);
}

// ============================================
// SUMMARY AND VERIFICATION
// ============================================

async function printSummary(): Promise<void> {
  console.log('\n========================================');
  console.log('ENRICHMENT SUMMARY');
  console.log('========================================\n');

  // Priority counts
  const priorities = await prisma.suburb.groupBy({
    by: ['priority'],
    where: { priority: { gt: 0 } },
    _count: { priority: true },
    orderBy: { priority: 'desc' },
  });

  console.log('Priority Distribution:');
  for (const p of priorities) {
    console.log(`  Priority ${p.priority}: ${p._count.priority} suburbs`);
  }

  // Census data
  const withCensus = await prisma.suburb.count({ where: { censusYear: { not: null } } });
  console.log(`\nCensus Data: ${withCensus} suburbs`);

  // Weather data
  const withWeather = await prisma.suburb.count({ where: { weatherUpdated: { not: null } } });
  console.log(`Weather Data: ${withWeather} suburbs`);

  // Drone ratings
  const droneRatings = await prisma.suburb.groupBy({
    by: ['droneFlightRating'],
    where: { droneFlightRating: { not: null } },
    _count: { droneFlightRating: true },
  });

  console.log('\nDrone Flight Ratings:');
  for (const r of droneRatings) {
    console.log(`  ${r.droneFlightRating}: ${r._count.droneFlightRating}`);
  }

  // Sample enriched suburb
  const sample = await prisma.suburb.findFirst({
    where: { priority: 10, censusYear: { not: null } },
    select: {
      name: true,
      state: true,
      primaryDwellingType: true,
      ownerPercentage: true,
      incomeQuartile: true,
      droneFlightRating: true,
      annualSunnyDays: true,
    },
  });

  if (sample) {
    console.log('\nSample Enriched Suburb:');
    console.log(`  ${sample.name}, ${sample.state}`);
    console.log(`  - Dwelling type: ${sample.primaryDwellingType}`);
    console.log(`  - Owner %: ${sample.ownerPercentage}`);
    console.log(`  - Income: ${sample.incomeQuartile}`);
    console.log(`  - Drone rating: ${sample.droneFlightRating}`);
    console.log(`  - Sunny days: ${sample.annualSunnyDays}`);
  }
}

// ============================================
// MAIN EXECUTION
// ============================================

async function main() {
  console.log('╔════════════════════════════════════════╗');
  console.log('║  SUBURB ENRICHMENT PIPELINE            ║');
  console.log('║  Census + BOM Data                     ║');
  console.log('╚════════════════════════════════════════╝');

  const startTime = Date.now();

  try {
    await step1_SelectPrioritySuburbs();
    await step2_CensusEnrichment();
    await step3_BomEnrichment();
    await printSummary();

    const duration = ((Date.now() - startTime) / 1000).toFixed(1);
    console.log(`\n✓ Enrichment complete in ${duration}s`);
  } catch (error) {
    console.error('\n✗ Enrichment failed:', error);
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
