import { parse } from 'csv-parse/sync';
import { writeFileSync, mkdirSync } from 'fs';
import { join } from 'path';

const CSV_URL = 'https://raw.githubusercontent.com/matthewproctor/australianpostcodes/master/australian_postcodes.csv';

// State code to full name mapping
const STATE_FULL_NAMES: Record<string, string> = {
  NSW: 'New South Wales',
  VIC: 'Victoria',
  QLD: 'Queensland',
  WA: 'Western Australia',
  SA: 'South Australia',
  TAS: 'Tasmania',
  ACT: 'Australian Capital Territory',
  NT: 'Northern Territory',
};

// Types that should be excluded (non-residential)
// Note: "Delivery Area" is actually residential suburbs, so we keep those!
const EXCLUDED_TYPES = [
  'Post Office Boxes',
  'Large Volume Receiver',
  'LVR',
  'Mail Centre',
  'PO Boxes',
];

interface PostcodeRow {
  id: string;
  postcode: string;
  locality: string;
  state: string;
  long: string;
  lat: string;
  Lat_precise: string;
  Long_precise: string;
  dc: string;
  type: string;
  status: string;
  region: string;
  lgaregion: string;
  lgacode: string;
  ced: string;
  [key: string]: string; // Allow additional fields
}

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

interface PostcodeLookup {
  [postcode: string]: SuburbData[];
}

interface SuburbLookup {
  [suburbSlug: string]: SuburbData;
}

/**
 * Convert ALL CAPS text to proper Title Case
 */
function toTitleCase(text: string): string {
  return text
    .toLowerCase()
    .split(' ')
    .map(word => {
      // Don't capitalize certain small words unless they're the first word
      const smallWords = ['a', 'an', 'and', 'at', 'but', 'by', 'for', 'in', 'of', 'on', 'or', 'the', 'to', 'up', 'via'];
      if (smallWords.includes(word)) {
        return word;
      }
      // Capitalize first letter of each word
      return word.charAt(0).toUpperCase() + word.slice(1);
    })
    .join(' ')
    // Always capitalize first letter of the string
    .replace(/^./, match => match.toUpperCase());
}

/**
 * Generate URL-friendly slug from text
 */
function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '') // Remove special characters
    .replace(/[\s_-]+/g, '-') // Replace spaces, underscores with hyphens
    .replace(/^-+|-+$/g, ''); // Remove leading/trailing hyphens
}

/**
 * Download and parse the postcode CSV data
 */
async function downloadPostcodeData(): Promise<PostcodeRow[]> {
  console.log('Downloading postcode data from GitHub...');

  const response = await fetch(CSV_URL);

  if (!response.ok) {
    throw new Error(`Failed to download CSV: ${response.statusText}`);
  }

  const csvContent = await response.text();
  console.log(`Downloaded ${csvContent.length} bytes`);

  const records = parse(csvContent, {
    columns: true,
    skip_empty_lines: true,
    trim: true,
  }) as PostcodeRow[];

  console.log(`Parsed ${records.length} records`);
  return records;
}

/**
 * Filter out non-residential postcodes
 */
function filterResidentialPostcodes(records: PostcodeRow[]): PostcodeRow[] {
  let filteredCount = {
    excludedType: 0,
    excludedSuffix: 0,
    noCoordinates: 0,
    noLocality: 0,
  };

  // Track types seen for debugging
  const typeCounts: Record<string, number> = {};

  const filtered = records.filter((record) => {
    // Track all types
    const type = (record.type || '').trim();
    typeCounts[type || '(empty)'] = (typeCounts[type || '(empty)'] || 0) + 1;

    // Exclude specific types (case-insensitive)
    const typeLower = type.toLowerCase();
    const excludedLower = EXCLUDED_TYPES.map(t => t.toLowerCase());

    if (type && excludedLower.includes(typeLower)) {
      filteredCount.excludedType++;
      return false;
    }

    // Exclude based on locality name patterns (MC, BC, DC, LVR suffixes)
    const locality = record.locality || '';
    if (
      locality.endsWith(' MC') ||
      locality.endsWith(' BC') ||
      locality.endsWith(' DC') ||
      locality.endsWith(' LVR') ||
      locality.endsWith(' PO')
    ) {
      filteredCount.excludedSuffix++;
      return false;
    }

    // Must have valid coordinates (use precise coordinates if available)
    const lat = record.Lat_precise || record.lat;
    const long = record.Long_precise || record.long;

    if (!lat || !long || lat === '0' || long === '0') {
      filteredCount.noCoordinates++;
      return false;
    }

    // Must have a locality name
    if (!locality || locality.trim() === '') {
      filteredCount.noLocality++;
      return false;
    }

    return true;
  });

  console.log(`Filtered to ${filtered.length} residential postcodes (from ${records.length})`);
  console.log(`  - Excluded by type: ${filteredCount.excludedType}`);
  console.log(`  - Excluded by suffix: ${filteredCount.excludedSuffix}`);
  console.log(`  - Missing coordinates: ${filteredCount.noCoordinates}`);
  console.log(`  - Missing locality: ${filteredCount.noLocality}`);

  // Show top types found
  console.log('\nTypes found in data:');
  const sortedTypes = Object.entries(typeCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10);
  for (const [type, count] of sortedTypes) {
    console.log(`  "${type}": ${count}`);
  }

  return filtered;
}

/**
 * Transform postcode data to suburb format
 */
function transformToSuburbs(records: PostcodeRow[]): SuburbData[] {
  return records.map((record) => {
    const stateCode = record.state.toUpperCase();
    const suburbName = toTitleCase(record.locality); // Convert to proper title case

    // Use precise coordinates if available, fallback to regular
    const lat = record.Lat_precise || record.lat;
    const long = record.Long_precise || record.long;

    return {
      name: suburbName,
      slug: slugify(record.locality), // Use original for slug generation
      state: stateCode,
      stateSlug: slugify(stateCode),
      stateFull: STATE_FULL_NAMES[stateCode] || stateCode,
      postcode: record.postcode.padStart(4, '0'), // Ensure 4 digits
      lga: record.lgaregion && record.lgaregion.trim() !== '' ? record.lgaregion : null,
      latitude: parseFloat(lat).toFixed(8),
      longitude: parseFloat(long).toFixed(8),
      region: record.region && record.region.trim() !== '' ? record.region : null,
    };
  });
}

/**
 * Create postcode → suburbs lookup
 */
function createPostcodeLookup(suburbs: SuburbData[]): PostcodeLookup {
  const lookup: PostcodeLookup = {};

  for (const suburb of suburbs) {
    if (!lookup[suburb.postcode]) {
      lookup[suburb.postcode] = [];
    }
    lookup[suburb.postcode].push(suburb);
  }

  console.log(`Created postcode lookup with ${Object.keys(lookup).length} postcodes`);
  return lookup;
}

/**
 * Create suburb slug → suburb data lookup
 * For duplicates (same name, different postcode), append state to slug
 */
function createSuburbLookup(suburbs: SuburbData[]): SuburbLookup {
  const lookup: SuburbLookup = {};
  const slugCounts: Record<string, number> = {};

  // First pass: count slug occurrences
  for (const suburb of suburbs) {
    slugCounts[suburb.slug] = (slugCounts[suburb.slug] || 0) + 1;
  }

  // Second pass: create lookup with unique keys
  for (const suburb of suburbs) {
    let key = suburb.slug;

    // If duplicate slug, append state
    if (slugCounts[suburb.slug] > 1) {
      key = `${suburb.slug}-${suburb.stateSlug}`;
    }

    // If still duplicate, append postcode
    if (lookup[key]) {
      key = `${suburb.slug}-${suburb.stateSlug}-${suburb.postcode}`;
    }

    lookup[key] = suburb;
  }

  console.log(`Created suburb lookup with ${Object.keys(lookup).length} unique suburbs`);
  return lookup;
}

/**
 * Save lookups to JSON files
 */
function saveLookups(
  postcodeLookup: PostcodeLookup,
  suburbLookup: SuburbLookup
): void {
  const dataDir = join(process.cwd(), 'data');

  // Create data directory if it doesn't exist
  try {
    mkdirSync(dataDir, { recursive: true });
  } catch (error) {
    // Directory may already exist
  }

  const postcodeFile = join(dataDir, 'postcode-suburb-lookup.json');
  const suburbFile = join(dataDir, 'suburb-postcode-lookup.json');

  writeFileSync(postcodeFile, JSON.stringify(postcodeLookup, null, 2));
  console.log(`✓ Saved postcode lookup to ${postcodeFile}`);

  writeFileSync(suburbFile, JSON.stringify(suburbLookup, null, 2));
  console.log(`✓ Saved suburb lookup to ${suburbFile}`);
}

/**
 * Generate summary statistics
 */
function generateStats(suburbs: SuburbData[], postcodeLookup: PostcodeLookup): void {
  const stateCounts: Record<string, number> = {};

  for (const suburb of suburbs) {
    stateCounts[suburb.state] = (stateCounts[suburb.state] || 0) + 1;
  }

  console.log('\n=== Summary Statistics ===');
  console.log(`Total suburbs: ${suburbs.length}`);
  console.log(`Total postcodes: ${Object.keys(postcodeLookup).length}`);
  console.log('\nSuburbs by state:');

  for (const [state, count] of Object.entries(stateCounts).sort((a, b) => b[1] - a[1])) {
    console.log(`  ${state}: ${count}`);
  }

  // Find postcodes with multiple suburbs
  const multiSuburbPostcodes = Object.entries(postcodeLookup)
    .filter(([_, suburbs]) => suburbs.length > 1)
    .sort((a, b) => b[1].length - a[1].length)
    .slice(0, 5);

  if (multiSuburbPostcodes.length > 0) {
    console.log('\nTop postcodes with multiple suburbs:');
    for (const [postcode, suburbs] of multiSuburbPostcodes) {
      console.log(`  ${postcode}: ${suburbs.length} suburbs`);
    }
  }
}

/**
 * Main execution
 */
async function main() {
  try {
    console.log('Starting postcode data ingestion...\n');

    // Download data
    const rawData = await downloadPostcodeData();

    // Filter to residential only
    const filtered = filterResidentialPostcodes(rawData);

    // Transform to suburb format
    const suburbs = transformToSuburbs(filtered);

    // Create lookups
    const postcodeLookup = createPostcodeLookup(suburbs);
    const suburbLookup = createSuburbLookup(suburbs);

    // Save to files
    saveLookups(postcodeLookup, suburbLookup);

    // Show statistics
    generateStats(suburbs, postcodeLookup);

    console.log('\n✓ Postcode data ingestion completed successfully!');
  } catch (error) {
    console.error('Error during postcode data ingestion:', error);
    process.exit(1);
  }
}

// Run if executed directly
if (require.main === module) {
  main();
}

export { main as ingestPostcodeData };
