/**
 * BOM Weather Data Enrichment Script
 *
 * Enriches priority suburbs with weather/climate data from BOM.
 * For each suburb:
 * 1. Finds nearest BOM weather station
 * 2. Gets climate statistics (sunny days, wind, temperature)
 * 3. Computes service-specific insights (drone rating, twilight times)
 * 4. Updates database
 *
 * Run with: npx tsx scripts/data-ingestion/bom-enrichment.ts
 */

import 'dotenv/config';
import { PrismaClient, Prisma } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';
import {
  bomAPI,
  getMockWeatherData,
  computeWeatherInsights,
  type BOMClimateData,
} from '../../lib/bom-api';

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
  // Process ALL suburbs (set to 0 to include all)
  minPriority: 0,

  // Skip suburbs that already have weather data
  skipExisting: true,
};

// ============================================
// ENRICHMENT FUNCTIONS
// ============================================

/**
 * Enrich a single suburb with weather data
 */
async function enrichSuburb(suburb: {
  id: number;
  slug: string;
  name: string;
  state: string;
  latitude: Prisma.Decimal;
  longitude: Prisma.Decimal;
}): Promise<boolean> {
  try {
    const lat = Number(suburb.latitude);
    const lon = Number(suburb.longitude);

    // Find nearest BOM station and get climate data
    const weatherResult = bomAPI.getWeatherForSuburb(lat, lon);

    let climateData: BOMClimateData;
    let stationName: string;
    let stationId: string;
    let distanceKm: number;

    if (weatherResult) {
      climateData = weatherResult.climateData;
      stationName = weatherResult.station.name;
      stationId = weatherResult.station.id;
      distanceKm = weatherResult.distanceKm;
    } else {
      // Fall back to state-based mock data
      climateData = getMockWeatherData(suburb.state);
      stationName = `${suburb.state} Reference Station`;
      stationId = 'MOCK';
      distanceKm = 0;
    }

    // Compute service-specific insights
    const insights = computeWeatherInsights(climateData, lat);

    // Update database
    await prisma.suburb.update({
      where: { id: suburb.id },
      data: {
        // Climate data
        annualSunnyDays: climateData.annualSunnyDays,
        annualRainyDays: climateData.annualRainyDays,
        annualCloudyDays: climateData.annualCloudyDays,
        bestMonthsPhotography: insights.bestMonthsPhotography,

        // Wind data (for drone)
        avgWindSpeedKmh: new Prisma.Decimal(climateData.avgWindSpeedKmh),
        maxWindSpeedKmh: new Prisma.Decimal(climateData.maxWindSpeedKmh),
        lowWindDays: climateData.lowWindDays,
        droneFlightRating: insights.droneFlightRating,
        droneSeasonNotes: insights.droneSeasonNotes,
        droneRecommended: insights.droneRecommended,

        // Twilight data
        avgSunsetTime: insights.avgSunsetTime,
        goldenHourStart: insights.goldenHourStart,
        twilightDuration: insights.twilightDuration,
        bestTwilightMonths: insights.bestTwilightMonths,

        // Temperature
        avgSummerMaxTemp: new Prisma.Decimal(climateData.avgSummerMaxTemp),
        avgWinterMaxTemp: new Prisma.Decimal(climateData.avgWinterMaxTemp),

        // Station metadata
        nearestBomStation: stationName,
        bomStationId: stationId,
        bomDistanceKm: new Prisma.Decimal(distanceKm),
        weatherUpdated: new Date(),

        // Photography insights
        photographySeasonTip: insights.photographySeasonTip,
      },
    });

    return true;
  } catch (error) {
    console.error(`  ✗ Error enriching ${suburb.name}:`, error);
    return false;
  }
}

// ============================================
// MAIN EXECUTION
// ============================================

async function main() {
  console.log('╔════════════════════════════════════════╗');
  console.log('║  BOM WEATHER DATA ENRICHMENT           ║');
  console.log('╚════════════════════════════════════════╝\n');
  console.log(`Skip existing: ${CONFIG.skipExisting}`);

  // Build query - optionally skip suburbs that already have weather data
  const whereClause: any = { active: true };
  if (CONFIG.minPriority > 0) {
    whereClause.priority = { gte: CONFIG.minPriority };
  }
  if (CONFIG.skipExisting) {
    whereClause.weatherUpdated = null;
  }

  // Get suburbs to process
  const suburbs = await prisma.suburb.findMany({
    where: whereClause,
    select: {
      id: true,
      slug: true,
      name: true,
      state: true,
      latitude: true,
      longitude: true,
    },
    orderBy: [{ state: 'asc' }, { name: 'asc' }],
  });

  console.log(`Found ${suburbs.length} suburbs to enrich\n`);

  if (suburbs.length === 0) {
    console.log('No suburbs to enrich (all may already have weather data).');
    return;
  }

  // Group suburbs by nearest station to minimize lookups
  console.log('Grouping suburbs by nearest weather station...');
  const stationGroups = new Map<string, typeof suburbs>();

  for (const suburb of suburbs) {
    const result = bomAPI.findNearestStation(
      Number(suburb.latitude),
      Number(suburb.longitude)
    );

    const stationId = result?.station.id || 'NONE';

    if (!stationGroups.has(stationId)) {
      stationGroups.set(stationId, []);
    }
    stationGroups.get(stationId)!.push(suburb);
  }

  console.log(`Grouped into ${stationGroups.size} weather station regions\n`);

  let successCount = 0;
  let errorCount = 0;
  let processed = 0;
  const startTime = Date.now();

  // Process by station group
  for (const [stationId, stationSuburbs] of stationGroups) {
    const station = stationSuburbs[0];
    const stationResult = bomAPI.findNearestStation(
      Number(station.latitude),
      Number(station.longitude)
    );

    console.log(`\n--- ${stationResult?.station.name || 'Unknown'} (${stationSuburbs.length} suburbs) ---`);

    for (const suburb of stationSuburbs) {
      processed++;
      const pct = Math.round((processed / suburbs.length) * 100);

      process.stdout.write(`[${pct}%] ${suburb.name}... `);

      const success = await enrichSuburb(suburb);

      if (success) {
        successCount++;
        process.stdout.write('✓\n');
      } else {
        errorCount++;
        process.stdout.write('✗\n');
      }
    }

    // Progress update after each station group
    const elapsed = (Date.now() - startTime) / 1000;
    const rate = processed / elapsed;
    const remaining = rate > 0 ? Math.round((suburbs.length - processed) / rate) : 0;
    if (processed % 1000 < stationSuburbs.length) {
      console.log(`  Progress: ${processed}/${suburbs.length} - ETA: ${Math.round(remaining / 60)}m ${remaining % 60}s`);
    }
  }

  const totalTime = Math.round((Date.now() - startTime) / 1000);

  // Summary
  console.log('\n========================================');
  console.log('BOM ENRICHMENT SUMMARY');
  console.log('========================================');
  console.log(`✓ Successfully enriched: ${successCount} suburbs`);
  if (errorCount > 0) {
    console.log(`✗ Errors: ${errorCount} suburbs`);
  }
  console.log(`Time: ${Math.round(totalTime / 60)}m ${totalTime % 60}s`);

  // Verify drone ratings distribution
  const droneRatings = await prisma.suburb.groupBy({
    by: ['droneFlightRating'],
    where: {
      droneFlightRating: { not: null },
    },
    _count: { droneFlightRating: true },
  });

  console.log('\nDrone flight ratings distribution:');
  for (const rating of droneRatings) {
    console.log(`  ${rating.droneFlightRating}: ${rating._count.droneFlightRating} suburbs`);
  }

  const enriched = await prisma.suburb.count({
    where: {
      weatherUpdated: { not: null },
    },
  });
  console.log(`\nTotal suburbs with weather data: ${enriched}`);
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
