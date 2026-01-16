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
  // Only process suburbs with priority > 0
  minPriority: 1,
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
  console.log('Starting BOM weather data enrichment...\n');
  console.log(`Min priority: ${CONFIG.minPriority}\n`);

  // Get priority suburbs
  const suburbs = await prisma.suburb.findMany({
    where: {
      priority: { gte: CONFIG.minPriority },
      active: true,
    },
    select: {
      id: true,
      slug: true,
      name: true,
      state: true,
      latitude: true,
      longitude: true,
    },
    orderBy: { priority: 'desc' },
  });

  console.log(`Found ${suburbs.length} priority suburbs to enrich\n`);

  if (suburbs.length === 0) {
    console.log('No suburbs to enrich. Run select-priority-suburbs.ts first.');
    return;
  }

  // Group suburbs by nearest station to minimize lookups
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

  // Process by station group
  for (const [stationId, stationSuburbs] of stationGroups) {
    const station = stationSuburbs[0];
    const stationResult = bomAPI.findNearestStation(
      Number(station.latitude),
      Number(station.longitude)
    );

    console.log(`\n--- Station: ${stationResult?.station.name || 'Unknown'} (${stationSuburbs.length} suburbs) ---`);

    for (const suburb of stationSuburbs) {
      processed++;
      const progress = `[${processed}/${suburbs.length}]`;

      process.stdout.write(`${progress} ${suburb.name}... `);

      const success = await enrichSuburb(suburb);

      if (success) {
        successCount++;
        console.log('✓');
      } else {
        errorCount++;
        console.log('✗');
      }
    }
  }

  // Summary
  console.log('\n=== BOM Enrichment Summary ===');
  console.log(`✓ Successfully enriched: ${successCount} suburbs`);
  if (errorCount > 0) {
    console.log(`✗ Errors: ${errorCount} suburbs`);
  }

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
