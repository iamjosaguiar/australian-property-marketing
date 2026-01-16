/**
 * Property Price Ingestion Script
 *
 * Fetches median property prices from free government data sources:
 * - Victoria: Valuer General data
 * - South Australia: SA Government data
 * - NSW: NSW Valuer General (requires manual download)
 *
 * Run with: npx tsx scripts/data-ingestion/property-prices.ts
 */

import 'dotenv/config';
import { PrismaClient, Prisma } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';
import { parse } from 'csv-parse/sync';

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
// DATA SOURCE URLs
// ============================================

const DATA_SOURCES = {
  victoria: {
    // Victorian Property Sales Report - Median House by Suburb
    // CSV download from data.vic.gov.au
    url: 'https://discover.data.vic.gov.au/dataset/victorian-property-sales-report-median-house-by-suburb',
    apiUrl: 'https://discover.data.vic.gov.au/api/3/action/package_show?id=victorian-property-sales-report-median-house-by-suburb',
  },
  southAustralia: {
    // Metro Median House Sales from data.sa.gov.au
    url: 'https://data.sa.gov.au/data/dataset/metro-median-house-sales',
    apiUrl: 'https://data.sa.gov.au/data/api/3/action/package_show?id=metro-median-house-sales',
  },
};

// ============================================
// VICTORIA DATA INGESTION
// ============================================

interface VicPriceRecord {
  suburb: string;
  medianPrice: number;
  salesCount: number;
  quarter: string;
  propertyType: 'house' | 'unit';
}

async function fetchVictoriaData(): Promise<VicPriceRecord[]> {
  console.log('\n📥 Fetching Victoria property price data...');

  try {
    // Get the dataset metadata to find the latest CSV resource
    const metaResponse = await fetch(DATA_SOURCES.victoria.apiUrl);
    const metaData = await metaResponse.json();

    if (!metaData.success) {
      console.log('  ⚠️ Could not fetch Victoria metadata, using fallback');
      return [];
    }

    // Find the most recent CSV resource
    const resources = metaData.result?.resources || [];
    const csvResource = resources.find((r: any) =>
      r.format?.toLowerCase() === 'csv' &&
      r.name?.toLowerCase().includes('house')
    );

    if (!csvResource?.url) {
      console.log('  ⚠️ No CSV resource found for Victoria');
      return [];
    }

    console.log(`  📄 Downloading: ${csvResource.name}`);

    const csvResponse = await fetch(csvResource.url);
    const csvText = await csvResponse.text();

    // Parse CSV
    const records = parse(csvText, {
      columns: true,
      skip_empty_lines: true,
      trim: true,
    });

    const priceRecords: VicPriceRecord[] = [];

    for (const row of records) {
      // Victoria CSV typically has columns like: Suburb, Median, Count, Quarter
      const suburb = row['Suburb'] || row['suburb'] || row['SUBURB'];
      const median = row['Median'] || row['median'] || row['MEDIAN'] || row['Median Price'];
      const count = row['Count'] || row['count'] || row['Sales'] || row['sales'];
      const quarter = row['Quarter'] || row['quarter'] || row['Period'];

      if (suburb && median) {
        const medianPrice = parseFloat(median.toString().replace(/[,$]/g, ''));
        if (!isNaN(medianPrice) && medianPrice > 0) {
          priceRecords.push({
            suburb: suburb.trim(),
            medianPrice,
            salesCount: parseInt(count) || 0,
            quarter: quarter || 'Unknown',
            propertyType: 'house',
          });
        }
      }
    }

    console.log(`  ✓ Parsed ${priceRecords.length} Victoria suburb records`);
    return priceRecords;

  } catch (error) {
    console.error('  ❌ Error fetching Victoria data:', error);
    return [];
  }
}

// ============================================
// SOUTH AUSTRALIA DATA INGESTION
// ============================================

interface SAPriceRecord {
  suburb: string;
  medianPrice: number;
  quarter: string;
}

async function fetchSouthAustraliaData(): Promise<SAPriceRecord[]> {
  console.log('\n📥 Fetching South Australia property price data...');

  try {
    const metaResponse = await fetch(DATA_SOURCES.southAustralia.apiUrl);
    const metaData = await metaResponse.json();

    if (!metaData.success) {
      console.log('  ⚠️ Could not fetch SA metadata, using fallback');
      return [];
    }

    const resources = metaData.result?.resources || [];
    const csvResource = resources.find((r: any) =>
      r.format?.toLowerCase() === 'csv'
    );

    if (!csvResource?.url) {
      console.log('  ⚠️ No CSV resource found for SA');
      return [];
    }

    console.log(`  📄 Downloading: ${csvResource.name}`);

    const csvResponse = await fetch(csvResource.url);
    const csvText = await csvResponse.text();

    const records = parse(csvText, {
      columns: true,
      skip_empty_lines: true,
      trim: true,
    });

    const priceRecords: SAPriceRecord[] = [];

    for (const row of records) {
      const suburb = row['Suburb'] || row['suburb'] || row['SUBURB'] || row['Location'];
      const median = row['Median'] || row['median'] || row['Median Price'] || row['Price'];
      const quarter = row['Quarter'] || row['quarter'] || row['Period'] || row['Date'];

      if (suburb && median) {
        const medianPrice = parseFloat(median.toString().replace(/[,$]/g, ''));
        if (!isNaN(medianPrice) && medianPrice > 0) {
          priceRecords.push({
            suburb: suburb.trim(),
            medianPrice,
            quarter: quarter || 'Unknown',
          });
        }
      }
    }

    console.log(`  ✓ Parsed ${priceRecords.length} SA suburb records`);
    return priceRecords;

  } catch (error) {
    console.error('  ❌ Error fetching SA data:', error);
    return [];
  }
}

// ============================================
// DATABASE UPDATE
// ============================================

async function updateSuburbPrices(
  state: string,
  priceData: Array<{ suburb: string; medianPrice: number; salesCount?: number }>
): Promise<{ updated: number; notFound: number }> {
  let updated = 0;
  let notFound = 0;

  for (const record of priceData) {
    try {
      // Try to find the suburb by name and state
      const suburb = await prisma.suburb.findFirst({
        where: {
          state: state,
          name: {
            equals: record.suburb,
            mode: 'insensitive',
          },
        },
      });

      if (suburb) {
        await prisma.suburb.update({
          where: { id: suburb.id },
          data: {
            medianPrice: record.medianPrice,
            medianPriceFormatted: record.medianPrice.toLocaleString('en-AU'),
            propertiesSoldQtd: record.salesCount || suburb.propertiesSoldQtd,
            statsUpdated: new Date(),
          },
        });
        updated++;
      } else {
        notFound++;
      }
    } catch (error) {
      // Skip errors for individual records
    }
  }

  return { updated, notFound };
}

// ============================================
// MAIN EXECUTION
// ============================================

async function main() {
  console.log('╔════════════════════════════════════════╗');
  console.log('║  PROPERTY PRICE INGESTION              ║');
  console.log('║  Government Data Sources               ║');
  console.log('╚════════════════════════════════════════╝');

  try {
    // Victoria
    const vicData = await fetchVictoriaData();
    if (vicData.length > 0) {
      console.log('\n📊 Updating Victoria suburbs...');
      const vicResult = await updateSuburbPrices('VIC', vicData);
      console.log(`  ✓ Updated: ${vicResult.updated}, Not found: ${vicResult.notFound}`);
    }

    // South Australia
    const saData = await fetchSouthAustraliaData();
    if (saData.length > 0) {
      console.log('\n📊 Updating South Australia suburbs...');
      const saResult = await updateSuburbPrices('SA', saData);
      console.log(`  ✓ Updated: ${saResult.updated}, Not found: ${saResult.notFound}`);
    }

    // Summary
    console.log('\n========================================');
    console.log('INGESTION SUMMARY');
    console.log('========================================');
    console.log(`Victoria: ${vicData.length} records processed`);
    console.log(`South Australia: ${saData.length} records processed`);

    console.log('\n📝 Note: NSW data requires manual download from:');
    console.log('   https://www.valuergeneral.nsw.gov.au/land_value_summaries/lv.php');
    console.log('   Place the CSV in scripts/data-ingestion/nsw-prices.csv');
    console.log('   Then run: npx tsx scripts/data-ingestion/nsw-property-prices.ts');

    console.log('\n✓ Property price ingestion complete');

  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
    await pool.end();
  }
}

main();
