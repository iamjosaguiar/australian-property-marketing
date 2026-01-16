/**
 * Census Data Enrichment Script
 *
 * Enriches priority suburbs with Census 2021 data from ABS.
 * For each suburb:
 * 1. Matches to nearest SA2 code
 * 2. Fetches Census data (dwelling types, tenure, income, bedrooms)
 * 3. Computes derived insights (floor plan complexity, staging audience, etc.)
 * 4. Updates database
 *
 * Run with: npx tsx scripts/data-ingestion/census-enrichment.ts
 */

import 'dotenv/config';
import { PrismaClient, Prisma } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';
import {
  censusAPI,
  getMockCensusData,
  computeCensusInsights,
  type CensusData,
} from '../../lib/census-api';

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
  // Use mock data instead of live API calls
  // Set to false when ABS API is configured
  useMockData: true,

  // Delay between API calls (ms)
  apiDelayMs: 100,

  // Batch size for database updates
  batchSize: 50,

  // Only process suburbs with priority > 0
  minPriority: 1,
};

// ============================================
// SA2 MAPPING
// ============================================

/**
 * SA2 (Statistical Area Level 2) data
 * In production, this would be loaded from ABS geographic data
 * For now, using a simplified mapping based on major suburbs
 *
 * SA2 codes are 9-digit codes that represent geographic areas
 * Example: 117011334 = Bondi Beach - North Bondi (NSW)
 */
const SA2_MAPPINGS: Record<string, { sa2Code: string; sa2Name: string }> = {
  // NSW - Sydney Metro
  'bondi': { sa2Code: '117011334', sa2Name: 'Bondi Beach - North Bondi' },
  'bondi-beach': { sa2Code: '117011334', sa2Name: 'Bondi Beach - North Bondi' },
  'paddington-nsw': { sa2Code: '117011349', sa2Name: 'Paddington - Moore Park' },
  'surry-hills': { sa2Code: '117011356', sa2Name: 'Surry Hills' },
  'mosman': { sa2Code: '120011463', sa2Name: 'Mosman' },
  'manly': { sa2Code: '120011460', sa2Name: 'Manly - Fairlight' },
  'double-bay': { sa2Code: '117011340', sa2Name: 'Double Bay - Bellevue Hill' },
  'newtown-nsw': { sa2Code: '117021381', sa2Name: 'Newtown - Camperdown - Darlington' },
  'balmain': { sa2Code: '117021369', sa2Name: 'Balmain' },
  'neutral-bay': { sa2Code: '120011468', sa2Name: 'Neutral Bay - Kirribilli' },

  // VIC - Melbourne Metro
  'south-yarra': { sa2Code: '206041118', sa2Name: 'South Yarra - East' },
  'toorak': { sa2Code: '206041121', sa2Name: 'Toorak' },
  'brighton': { sa2Code: '206031089', sa2Name: 'Brighton (Vic.)' },
  'st-kilda': { sa2Code: '206041115', sa2Name: 'St Kilda' },
  'fitzroy': { sa2Code: '206051132', sa2Name: 'Fitzroy' },
  'richmond-vic': { sa2Code: '206051145', sa2Name: 'Richmond (Vic.)' },
  'carlton': { sa2Code: '206021071', sa2Name: 'Carlton' },
  'brunswick': { sa2Code: '206061151', sa2Name: 'Brunswick' },

  // QLD - Brisbane Metro
  'new-farm': { sa2Code: '305011170', sa2Name: 'New Farm' },
  'teneriffe': { sa2Code: '305011170', sa2Name: 'New Farm' }, // Same SA2 as New Farm
  'fortitude-valley': { sa2Code: '305011167', sa2Name: 'Fortitude Valley' },
  'west-end-qld': { sa2Code: '305011177', sa2Name: 'West End (Qld)' },
  'paddington-qld': { sa2Code: '305011172', sa2Name: 'Paddington (Qld)' },

  // WA - Perth Metro
  'cottesloe': { sa2Code: '503021076', sa2Name: 'Cottesloe' },
  'claremont-wa': { sa2Code: '503011065', sa2Name: 'Claremont (WA)' },
  'subiaco': { sa2Code: '503011068', sa2Name: 'Subiaco - Shenton Park' },

  // SA - Adelaide Metro
  'norwood': { sa2Code: '401021060', sa2Name: 'Norwood (SA)' },
  'unley': { sa2Code: '401031070', sa2Name: 'Unley' },
  'glenelg': { sa2Code: '401041085', sa2Name: 'Glenelg (SA)' },

  // ACT
  'kingston-act': { sa2Code: '801011006', sa2Name: 'Kingston (ACT)' },
  'griffith-act': { sa2Code: '801011005', sa2Name: 'Griffith (ACT)' },
};

/**
 * Get SA2 code for a suburb
 * Falls back to generating a mock code if not in mapping
 */
function getSA2ForSuburb(slug: string, state: string): { sa2Code: string; sa2Name: string } {
  // Try direct lookup
  if (SA2_MAPPINGS[slug]) {
    return SA2_MAPPINGS[slug];
  }

  // Try with state suffix
  const withState = `${slug}-${state.toLowerCase()}`;
  if (SA2_MAPPINGS[withState]) {
    return SA2_MAPPINGS[withState];
  }

  // Generate a mock SA2 code for suburbs not in mapping
  // In production, this would use ABS geographic boundary data
  const statePrefix: Record<string, string> = {
    NSW: '117',
    VIC: '206',
    QLD: '305',
    WA: '503',
    SA: '401',
    TAS: '601',
    ACT: '801',
    NT: '701',
  };

  const prefix = statePrefix[state] || '999';
  const hash = slug.split('').reduce((a, b) => a + b.charCodeAt(0), 0);
  const mockCode = `${prefix}${String(hash % 1000000).padStart(6, '0')}`;

  return {
    sa2Code: mockCode,
    sa2Name: `${slug.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())} Area`,
  };
}

// ============================================
// ENRICHMENT FUNCTIONS
// ============================================

/**
 * Fetch census data for a suburb
 */
async function fetchCensusData(
  slug: string,
  state: string,
  latitude: number,
  longitude: number
): Promise<CensusData | null> {
  const sa2 = getSA2ForSuburb(slug, state);

  if (CONFIG.useMockData) {
    // Use mock data for development
    return getMockCensusData(sa2.sa2Code, sa2.sa2Name, state);
  }

  // Live API call (when configured)
  try {
    return await censusAPI.getFullCensusData(sa2.sa2Code, sa2.sa2Name);
  } catch (error) {
    console.error(`  Failed to fetch census data for ${slug}:`, error);
    return null;
  }
}

/**
 * Enrich a single suburb with census data
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
    // Get SA2 mapping
    const sa2 = getSA2ForSuburb(suburb.slug, suburb.state);

    // Fetch census data
    const censusData = await fetchCensusData(
      suburb.slug,
      suburb.state,
      Number(suburb.latitude),
      Number(suburb.longitude)
    );

    if (!censusData) {
      console.log(`  ⚠ No census data available for ${suburb.name}`);
      return false;
    }

    // Compute derived insights
    const insights = computeCensusInsights(censusData);

    // Update database
    await prisma.suburb.update({
      where: { id: suburb.id },
      data: {
        // SA2 reference
        sa2Code: sa2.sa2Code,
        sa2Name: sa2.sa2Name,

        // Housing structure
        dwellingHouses: censusData.dwellingHouses,
        dwellingUnits: censusData.dwellingUnits,
        dwellingTownhouses: censusData.dwellingTownhouses,
        dwellingSemiDetached: censusData.dwellingSemiDetached,
        dwellingOther: censusData.dwellingOther,
        primaryDwellingType: insights.primaryDwellingType,
        dwellingTypeRatio: insights.dwellingTypeRatio,

        // Tenure
        ownerOccupied: censusData.ownerOccupied,
        renterOccupied: censusData.renterOccupied,
        ownerPercentage: insights.ownerPercentage
          ? new Prisma.Decimal(insights.ownerPercentage)
          : null,
        renterPercentage: insights.renterPercentage
          ? new Prisma.Decimal(insights.renterPercentage)
          : null,
        tenureProfile: insights.tenureProfile,

        // Income
        medianWeeklyIncome: censusData.medianWeeklyIncome,
        medianAnnualIncome: insights.medianAnnualIncome,
        incomeQuartile: insights.incomeQuartile,
        incomeDescription: insights.incomeDescription,

        // Bedrooms
        avgBedrooms: insights.avgBedrooms
          ? new Prisma.Decimal(insights.avgBedrooms)
          : null,
        bedroomDistribution: JSON.stringify(censusData.bedroomDistribution),

        // Demographics
        population: censusData.population,
        medianAge: censusData.medianAge,
        familyHouseholds: censusData.familyHouseholds,
        coupleNoChildren: censusData.coupleNoChildren,
        singlePersonHousehold: censusData.singlePersonHousehold,

        // Census metadata
        censusYear: 2021,
        censusUpdated: new Date(),
        censusDataQuality: CONFIG.useMockData ? 'estimated' : 'complete',

        // Service-specific insights
        floorPlanComplexity: insights.floorPlanComplexity,
        typicalLayoutNotes: insights.typicalLayoutNotes,
        stagingTargetAudience: insights.stagingTargetAudience,
        stagingStyleHint: insights.stagingStyleHint,
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
  console.log('Starting Census data enrichment...\n');
  console.log(`Mode: ${CONFIG.useMockData ? 'MOCK DATA' : 'LIVE API'}`);
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

  let successCount = 0;
  let errorCount = 0;

  // Process suburbs
  for (let i = 0; i < suburbs.length; i++) {
    const suburb = suburbs[i];
    const progress = `[${i + 1}/${suburbs.length}]`;

    process.stdout.write(`${progress} Enriching ${suburb.name} (${suburb.state})... `);

    const success = await enrichSuburb(suburb);

    if (success) {
      successCount++;
      console.log('✓');
    } else {
      errorCount++;
      console.log('✗');
    }

    // Rate limiting
    if (!CONFIG.useMockData && i < suburbs.length - 1) {
      await new Promise(resolve => setTimeout(resolve, CONFIG.apiDelayMs));
    }
  }

  // Summary
  console.log('\n=== Census Enrichment Summary ===');
  console.log(`✓ Successfully enriched: ${successCount} suburbs`);
  if (errorCount > 0) {
    console.log(`✗ Errors: ${errorCount} suburbs`);
  }

  // Verify
  const enriched = await prisma.suburb.count({
    where: {
      censusYear: { not: null },
    },
  });
  console.log(`\nTotal suburbs with census data: ${enriched}`);
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
