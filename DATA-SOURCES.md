# Data Sources

## Australian Postcode and Suburb Data

### Source
- **Repository**: https://github.com/matthewproctor/australianpostcodes
- **Type**: Community-maintained
- **Coverage**: 17,872+ residential suburbs across 2,720+ postcodes
- **Data Includes**:
  - Suburb names and postcodes
  - Latitude/longitude coordinates
  - State and territory information
  - LGA (Local Government Area)
  - Geographic regions

### Data Processing

The postcode data is downloaded and processed by the script at `scripts/data-ingestion/postcode-suburb.ts`, which:

1. Downloads the CSV file from the GitHub repository
2. Filters out non-residential postcodes (PO boxes, mail centres, LVR addresses)
3. Filters out delivery facilities (addresses ending with MC, BC, DC, LVR, PO)
4. Validates coordinates and locality names
5. Creates two lookup files:
   - `data/postcode-suburb-lookup.json` (postcode → suburbs mapping)
   - `data/suburb-postcode-lookup.json` (suburb slug → suburb data)

### Filtering Rules

**Excluded Types:**
- Post Office Boxes
- Large Volume Receiver (LVR)
- Mail Centre
- PO Boxes

**Excluded Suffixes:**
- Suburbs ending with " MC" (Mail Centre)
- Suburbs ending with " BC" (Business Centre)
- Suburbs ending with " DC" (Delivery Centre)
- Suburbs ending with " LVR" (Large Volume Receiver)
- Suburbs ending with " PO" (Post Office)

**Kept Types:**
- "Delivery Area" - These are residential suburbs (17,984 suburbs)
- Empty/blank type field

### Data Refresh

To refresh the postcode/suburb data from the source:

```bash
npm run refresh-suburbs
```

This will:
- Download the latest CSV from GitHub
- Process and filter the data
- Generate updated JSON lookup files in the `data/` directory

### Database Seeding

To seed your database with all suburbs:

```bash
# 1. Ensure your Prisma database is running
npx prisma dev

# 2. (Optional) Refresh suburb data from source
npm run refresh-suburbs

# 3. Seed the database with suburbs
npm run db:seed-suburbs
```

The seeding process:
- Seeds all 8 Australian states/territories first
- Imports 17,872+ suburbs in batches of 500
- Uses upsert operations (safe to run multiple times)
- Sets default pricing from schema
- Reports progress and any errors

### Data Structure

Each suburb in the database includes:

**Location Data:**
- `name`, `slug` - Suburb identification
- `state`, `stateSlug`, `stateFull` - State information
- `postcode` - 4-digit Australian postcode
- `city`, `citySlug` - City (nullable)
- `lga` - Local Government Area
- `region` - Geographic region
- `latitude`, `longitude` - Precise coordinates

**Market Data (optional fields for future enrichment):**
- `medianPrice`, `medianPriceFormatted`
- `propertiesSoldQtd`
- `daysOnMarket`
- `yoyGrowth`
- `statsUpdated`

**Service Pricing:**
- `basePrice` - Base photography package
- `premiumPrice` - Premium package
- `prestigePrice` - Prestige package
- `twilightPrice` - Twilight photography
- `dronePrice` - Drone photography
- `stagingPrice` - Virtual staging per room
- `travelFee` - Additional travel charges

**Metadata:**
- `description` - Suburb description
- `landmarks` - Notable landmarks
- `propertyTypes` - Common property types
- `primaryPropertyType` - Most common type
- `nearestPhotographerKm` - Distance to photographer
- `sameDayAvailable` - Same-day service availability
- `agentCount` - Number of agents in area
- `active` - Whether suburb is active
- `priority` - Display priority

### Data Statistics

Last processed data (as of latest run):

```
Total suburbs: 17,872
Total postcodes: 2,720

Suburbs by state:
  NSW: 5,259
  QLD: 3,850
  VIC: 3,484
  SA:  2,066
  WA:  1,826
  TAS:   808
  NT:    412
  ACT:   167
```

### Future Enhancements

Potential data enrichment sources:
- Domain.com.au API (already integrated in `lib/domain-api.ts`)
- Census data for demographics
- School catchment areas
- Transport proximity
- Amenity scores

### Data Quality Notes

- All coordinates validated (non-zero lat/long required)
- Some postcodes contain multiple suburbs (e.g., 0822 has 110 suburbs)
- LGA data may be null for unincorporated areas
- City assignment not yet implemented (future enhancement)
- Market statistics not yet populated (awaiting Domain API integration)

### Scripts Reference

| Script | Command | Purpose |
|--------|---------|---------|
| Data Ingestion | `npm run refresh-suburbs` | Download & process postcode CSV |
| Suburb Seeding | `npm run db:seed-suburbs` | Import suburbs to database |
| Full Seed | `npm run db:seed` | Seed states, cities, services, sample suburbs |

### File Locations

```
aura-property-media/
├── scripts/
│   ├── data-ingestion/
│   │   └── postcode-suburb.ts      # Data download & processing
│   └── seed-suburbs.ts              # Database seeding script
├── data/
│   ├── postcode-suburb-lookup.json # Postcode → suburbs
│   └── suburb-postcode-lookup.json # Suburb slug → data
├── prisma/
│   ├── schema.prisma                # Suburb model definition
│   └── seed.ts                      # Sample data seeding
└── lib/
    └── domain-api.ts                # Market data API (future)
```

### Troubleshooting

**"Suburb data file not found" error:**
- Run `npm run refresh-suburbs` first to generate the data files

**"Can't reach database server" error:**
- Start your Prisma database with `npx prisma dev`
- Verify DATABASE_URL in `.env` file

**"Duplicate slug" errors during seeding:**
- The script uses upsert (update or insert)
- Duplicates are handled by appending state/postcode to slug
- Safe to re-run if interrupted

**Data seems outdated:**
- Run `npm run refresh-suburbs` to pull latest from GitHub
- Then run `npm run db:seed-suburbs` to update database
- The community repo is updated periodically when boundaries change
