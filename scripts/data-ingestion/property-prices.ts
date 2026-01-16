/**
 * Property Price Ingestion Script
 *
 * Fetches median property prices from free government data sources:
 * - Victoria: Valuer General XLSX data
 * - South Australia: SA Government XLSX data
 *
 * Run with: npx tsx scripts/data-ingestion/property-prices.ts
 */

import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';
import * as XLSX from 'xlsx';

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
// LOCAL DATA FILES
// Download XLSX files manually and place in data/property-prices/
// ============================================

import * as fs from 'fs';
import * as path from 'path';

const DATA_DIR = path.join(process.cwd(), 'data', 'property-prices');

// Expected file patterns (script will find any matching files)
const FILE_PATTERNS = {
  victoria: /vic|victoria/i,
  southAustralia: /sa|south.?australia/i,
  nsw: /nsw|new.?south.?wales/i,
  queensland: /qld|queensland/i,
  westernAustralia: /wa|western.?australia/i,
  tasmania: /tas|tasmania/i,
  act: /act|canberra/i,
  northernTerritory: /nt|northern.?territory/i,
};

const STATE_MAPPING: Record<string, string> = {
  victoria: 'VIC',
  southAustralia: 'SA',
  nsw: 'NSW',
  queensland: 'QLD',
  westernAustralia: 'WA',
  tasmania: 'TAS',
  act: 'ACT',
  northernTerritory: 'NT',
};

// ============================================
// GENERIC XLSX PARSER
// ============================================

interface PriceRecord {
  suburb: string;
  medianPrice: number;
  salesCount?: number;
}

function parseXlsxFile(filePath: string): PriceRecord[] {
  console.log(`\n📥 Reading ${path.basename(filePath)}...`);

  const priceRecords: PriceRecord[] = [];

  try {
    const fileBuffer = fs.readFileSync(filePath);
    const workbook = XLSX.read(fileBuffer, { type: 'buffer' });

    // Try each sheet
    for (const sheetName of workbook.SheetNames) {
      const sheet = workbook.Sheets[sheetName];
      const data = XLSX.utils.sheet_to_json(sheet, { header: 1 }) as any[][];

      if (data.length < 2) continue;

      console.log(`  📄 Sheet "${sheetName}": ${data.length} rows`);

      // Find header row (look for "Suburb" or "Locality")
      let headerRow = -1;
      let suburbCol = -1;
      let medianCol = -1;
      let countCol = -1;

      for (let i = 0; i < Math.min(20, data.length); i++) {
        const row = data[i];
        if (!row) continue;

        for (let j = 0; j < row.length; j++) {
          const cell = String(row[j] || '').toLowerCase();
          if (cell.includes('suburb') || cell.includes('locality') || cell.includes('area name')) {
            headerRow = i;
            suburbCol = j;
          }
          if ((cell.includes('median') || cell.includes('price')) && !cell.includes('change')) {
            medianCol = j;
          }
          if (cell.includes('count') || cell.includes('sales') || cell.includes('number')) {
            countCol = j;
          }
        }
        if (headerRow >= 0 && suburbCol >= 0) break;
      }

      if (headerRow < 0 || suburbCol < 0) {
        console.log(`  ⚠️ Could not find suburb column in sheet "${sheetName}"`);
        console.log('  First rows:', data.slice(0, 3));
        continue;
      }

      // For Victorian quarterly format: data starts after multi-row headers
      // Find the first row with actual suburb data (all caps suburb name)
      let dataStartRow = headerRow + 1;
      for (let i = headerRow + 1; i < Math.min(headerRow + 10, data.length); i++) {
        const row = data[i];
        if (row && row[suburbCol]) {
          const val = String(row[suburbCol]).trim();
          // Check if it looks like a suburb name (not empty, not a header continuation)
          if (val && val.length > 1 && !val.includes('-') && val !== val.toLowerCase()) {
            // Also check if there's a numeric value in subsequent columns
            for (let j = 1; j < row.length; j++) {
              const cellVal = row[j];
              if (cellVal && !isNaN(parseFloat(String(cellVal).replace(/[,$]/g, '')))) {
                dataStartRow = i;
                break;
              }
            }
            if (dataStartRow === i) break;
          }
        }
      }

      // If no explicit median column found, look for the most recent price column
      // Victorian format: columns alternate between price and change indicators
      if (medianCol < 0) {
        // Find columns with numeric price-like values in the first data row
        const sampleRow = data[dataStartRow];
        if (sampleRow) {
          const priceColumns: number[] = [];
          for (let j = 1; j < sampleRow.length; j++) {
            const val = sampleRow[j];
            if (val) {
              const numVal = parseFloat(String(val).replace(/[,$]/g, ''));
              // Looks like a price if it's a large number (> 100000)
              if (!isNaN(numVal) && numVal > 100000) {
                priceColumns.push(j);
              }
            }
          }
          // Use the last price column (most recent quarter)
          if (priceColumns.length > 0) {
            medianCol = priceColumns[priceColumns.length - 1];
            console.log(`  Auto-detected price column: ${medianCol} (most recent of ${priceColumns.length} price columns)`);
          }
        }
      }

      // Find sales count column (usually labeled "No. of Sales" for the most recent period)
      if (countCol < 0) {
        const sampleRow = data[dataStartRow];
        if (sampleRow && medianCol >= 0) {
          // Look for a column after median that has small integers (sales counts)
          for (let j = medianCol + 1; j < sampleRow.length; j++) {
            const val = sampleRow[j];
            if (val) {
              const numVal = parseInt(String(val));
              if (!isNaN(numVal) && numVal > 0 && numVal < 1000) {
                countCol = j;
                break;
              }
            }
          }
        }
      }

      console.log(`  Data starts at row ${dataStartRow}: suburb=${suburbCol}, median=${medianCol}, count=${countCol}`);

      if (medianCol < 0) {
        console.log(`  ⚠️ Could not find price column`);
        continue;
      }

      // Process data rows
      for (let i = dataStartRow; i < data.length; i++) {
        const row = data[i];
        if (!row || !row[suburbCol]) continue;

        const suburb = String(row[suburbCol]).trim();

        // Skip non-suburb rows (totals, headers, etc.)
        if (!suburb || suburb.toLowerCase().includes('total') || suburb.toLowerCase().includes('metropolitan')) {
          continue;
        }

        const medianValue = medianCol >= 0 ? row[medianCol] : null;
        const countValue = countCol >= 0 ? row[countCol] : null;

        if (suburb && medianValue) {
          const medianPrice = typeof medianValue === 'number'
            ? medianValue
            : parseFloat(String(medianValue).replace(/[,$]/g, ''));

          if (!isNaN(medianPrice) && medianPrice > 10000) {
            priceRecords.push({
              suburb,
              medianPrice,
              salesCount: countValue ? parseInt(String(countValue)) : undefined,
            });
          }
        }
      }

      // If we found records in this sheet, don't process other sheets
      if (priceRecords.length > 0) {
        console.log(`  ✓ Parsed ${priceRecords.length} suburb records from "${sheetName}"`);
        break;
      }
    }

  } catch (error) {
    console.error(`  ❌ Error reading ${filePath}:`, error);
  }

  return priceRecords;
}

function findDataFiles(): { state: string; filePath: string }[] {
  const files: { state: string; filePath: string }[] = [];

  if (!fs.existsSync(DATA_DIR)) {
    console.log(`\n⚠️ Data directory not found: ${DATA_DIR}`);
    console.log('   Please create it and add XLSX/XLS files with property price data.');
    return files;
  }

  const dirFiles = fs.readdirSync(DATA_DIR);
  const xlsFiles = dirFiles.filter(f => /\.(xlsx?|csv)$/i.test(f));

  if (xlsFiles.length === 0) {
    console.log(`\n⚠️ No XLSX/XLS/CSV files found in ${DATA_DIR}`);
    console.log('   Download property price data from:');
    console.log('   - Victoria: https://www.land.vic.gov.au/valuations/resources-and-reports/property-sales-statistics');
    console.log('   - SA: https://data.sa.gov.au/data/dataset/metro-median-house-sales');
    console.log('   - NSW: https://valuation.property.nsw.gov.au/embed/propertySalesInformation');
    console.log('   - QLD: https://www.data.qld.gov.au/ (search "property sales")');
    return files;
  }

  console.log(`\n📁 Found ${xlsFiles.length} data file(s) in ${DATA_DIR}`);

  for (const file of xlsFiles) {
    const filePath = path.join(DATA_DIR, file);
    const fileName = file.toLowerCase();

    // Match file to state
    for (const [key, pattern] of Object.entries(FILE_PATTERNS)) {
      if (pattern.test(fileName)) {
        const state = STATE_MAPPING[key];
        files.push({ state, filePath });
        console.log(`   ${file} → ${state}`);
        break;
      }
    }

    // If no pattern matched, try to infer from file content later
    if (!files.find(f => f.filePath === filePath)) {
      console.log(`   ${file} → (unknown state - will skip)`);
    }
  }

  return files;
}

// ============================================
// DATABASE UPDATE
// ============================================

async function updateSuburbPrices(
  state: string,
  priceData: PriceRecord[]
): Promise<{ updated: number; notFound: string[] }> {
  let updated = 0;
  const notFound: string[] = [];

  for (const record of priceData) {
    try {
      // Normalize suburb name for matching
      const normalizedName = record.suburb
        .replace(/\s+/g, ' ')
        .trim();

      // Try exact match first
      let suburb = await prisma.suburb.findFirst({
        where: {
          state: state,
          name: {
            equals: normalizedName,
            mode: 'insensitive',
          },
        },
      });

      // If not found, try without common suffixes
      if (!suburb) {
        const simplifiedName = normalizedName
          .replace(/\s+(North|South|East|West|Upper|Lower|Central)$/i, '');

        suburb = await prisma.suburb.findFirst({
          where: {
            state: state,
            name: {
              contains: simplifiedName,
              mode: 'insensitive',
            },
          },
        });
      }

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
        notFound.push(record.suburb);
      }
    } catch (error) {
      // Skip individual errors
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
  console.log('║  From Local XLSX/XLS Files             ║');
  console.log('╚════════════════════════════════════════╝');

  try {
    // Find all data files
    const dataFiles = findDataFiles();

    if (dataFiles.length === 0) {
      console.log('\n❌ No data files to process.');
      console.log('\nTo use this script:');
      console.log('1. Download property price XLSX files from government data portals');
      console.log('2. Place them in: data/property-prices/');
      console.log('3. Name files to include state (e.g., "vic-median-prices.xlsx", "sa-house-sales.xlsx")');
      console.log('4. Run this script again');
      return;
    }

    const results: { state: string; records: number; updated: number }[] = [];

    // Process each file
    for (const { state, filePath } of dataFiles) {
      const priceData = parseXlsxFile(filePath);

      if (priceData.length > 0) {
        console.log(`\n📊 Updating ${state} suburbs...`);
        const result = await updateSuburbPrices(state, priceData);
        console.log(`  ✓ Updated: ${result.updated}`);

        if (result.notFound.length > 0 && result.notFound.length <= 10) {
          console.log(`  ⚠️ Not found: ${result.notFound.join(', ')}`);
        } else if (result.notFound.length > 10) {
          console.log(`  ⚠️ ${result.notFound.length} suburbs not found in database`);
        }

        results.push({ state, records: priceData.length, updated: result.updated });
      }
    }

    // Summary
    console.log('\n========================================');
    console.log('INGESTION SUMMARY');
    console.log('========================================');

    for (const r of results) {
      console.log(`${r.state}: ${r.records} records → ${r.updated} suburbs updated`);
    }

    // Check total updated
    const totalWithPrices = await prisma.suburb.count({
      where: { medianPrice: { not: null } }
    });
    console.log(`\nTotal suburbs with price data: ${totalWithPrices}`);

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
