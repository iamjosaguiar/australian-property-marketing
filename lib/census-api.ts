/**
 * ABS Census Data API Integration
 * Fetches Australian Census 2021 data from ABS Data API
 * API Documentation: https://api.data.abs.gov.au/
 *
 * Census data is organized by SA2 (Statistical Area Level 2) regions
 * Each suburb needs to be mapped to its corresponding SA2 code
 */

// ============================================
// TYPES
// ============================================

export interface CensusData {
  sa2Code: string;
  sa2Name: string;

  // Housing Structure (G32 - Dwelling Structure)
  dwellingHouses: number | null;
  dwellingUnits: number | null;
  dwellingTownhouses: number | null;
  dwellingSemiDetached: number | null;
  dwellingOther: number | null;
  totalDwellings: number | null;

  // Tenure Type (G33)
  ownerOccupied: number | null;
  renterOccupied: number | null;

  // Household Income (G02)
  medianWeeklyIncome: number | null;

  // Number of Bedrooms (G37)
  bedroomDistribution: {
    oneBedroom: number;
    twoBedroom: number;
    threeBedroom: number;
    fourBedroom: number;
    fivePlusBedroom: number;
  };

  // Demographics
  population: number | null;
  medianAge: number | null;
  familyHouseholds: number | null;
  coupleNoChildren: number | null;
  singlePersonHousehold: number | null;
}

export interface ComputedCensusInsights {
  primaryDwellingType: 'house' | 'unit' | 'townhouse' | 'semi-detached' | 'mixed';
  dwellingTypeRatio: string;
  ownerPercentage: number | null;
  renterPercentage: number | null;
  tenureProfile: 'owner-dominant' | 'renter-heavy' | 'balanced';
  medianAnnualIncome: number | null;
  incomeQuartile: 'high' | 'upper-middle' | 'middle' | 'lower';
  incomeDescription: string;
  avgBedrooms: number | null;
  floorPlanComplexity: 'simple' | 'moderate' | 'complex';
  typicalLayoutNotes: string;
  stagingTargetAudience: 'investors' | 'owner-occupiers' | 'mixed';
  stagingStyleHint: string;
}

export interface SA2Mapping {
  sa2Code: string;
  sa2Name: string;
  stateCode: string;
  latitude: number;
  longitude: number;
}

// ============================================
// API CONFIGURATION
// ============================================

const ABS_API_CONFIG = {
  baseUrl: 'https://api.data.abs.gov.au',
  // Census 2021 dataflow IDs
  dataflows: {
    dwellingStructure: 'ABS,C21_G32_SA2,1.0.0', // G32 - Dwelling Structure
    tenure: 'ABS,C21_G33_SA2,1.0.0',            // G33 - Tenure Type
    income: 'ABS,C21_G02_SA2,1.0.0',            // G02 - Selected Medians and Averages
    bedrooms: 'ABS,C21_G37_SA2,1.0.0',          // G37 - Number of Bedrooms
    demographics: 'ABS,C21_G01_SA2,1.0.0',      // G01 - Selected Person Characteristics
  },
  rateLimitMs: 100, // 10 requests per second
  retryAttempts: 3,
  retryDelayMs: 1000,
};

// ============================================
// SA2 LOOKUP UTILITIES
// ============================================

/**
 * Haversine formula to calculate distance between two coordinates
 */
function haversineDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371; // Earth's radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

// ============================================
// ABS CENSUS API CLIENT
// ============================================

class ABSCensusAPIClient {
  private lastRequestTime: number = 0;
  private sa2Mappings: SA2Mapping[] = [];

  constructor() {
    // SA2 mappings will be loaded from file or API
  }

  /**
   * Load SA2 mappings from a data file
   * This should be called once at startup
   */
  async loadSA2Mappings(mappings: SA2Mapping[]): Promise<void> {
    this.sa2Mappings = mappings;
    console.log(`Loaded ${mappings.length} SA2 mappings`);
  }

  /**
   * Find the SA2 code for a given suburb based on coordinates
   */
  findSA2ForSuburb(latitude: number, longitude: number): SA2Mapping | null {
    if (this.sa2Mappings.length === 0) {
      console.warn('SA2 mappings not loaded');
      return null;
    }

    // Find the closest SA2 centroid
    let closest: SA2Mapping | null = null;
    let minDistance = Infinity;

    for (const sa2 of this.sa2Mappings) {
      const distance = haversineDistance(
        latitude,
        longitude,
        sa2.latitude,
        sa2.longitude
      );
      if (distance < minDistance) {
        minDistance = distance;
        closest = sa2;
      }
    }

    // Only return if within reasonable distance (10km)
    if (closest && minDistance < 10) {
      return closest;
    }

    return null;
  }

  /**
   * Rate-limited API request
   */
  private async request<T>(url: string): Promise<T> {
    // Rate limiting
    const now = Date.now();
    const elapsed = now - this.lastRequestTime;
    if (elapsed < ABS_API_CONFIG.rateLimitMs) {
      await new Promise(resolve =>
        setTimeout(resolve, ABS_API_CONFIG.rateLimitMs - elapsed)
      );
    }
    this.lastRequestTime = Date.now();

    // Retry logic
    let lastError: Error | null = null;
    for (let attempt = 0; attempt < ABS_API_CONFIG.retryAttempts; attempt++) {
      try {
        const response = await fetch(url, {
          headers: {
            'Accept': 'application/vnd.sdmx.data+json;version=1.0.0',
          },
        });

        if (!response.ok) {
          throw new Error(`ABS API error: ${response.status} ${response.statusText}`);
        }

        return await response.json();
      } catch (error) {
        lastError = error as Error;
        console.warn(`ABS API attempt ${attempt + 1} failed:`, error);
        if (attempt < ABS_API_CONFIG.retryAttempts - 1) {
          await new Promise(resolve =>
            setTimeout(resolve, ABS_API_CONFIG.retryDelayMs * (attempt + 1))
          );
        }
      }
    }

    throw lastError || new Error('ABS API request failed');
  }

  /**
   * Parse SDMX JSON response to extract values
   */
  private parseSDMXResponse(data: any, dimensionKey: string): number | null {
    try {
      const observations = data?.dataSets?.[0]?.observations;
      if (!observations) return null;

      // SDMX format uses dimension keys to identify values
      const obsKey = Object.keys(observations).find(k => k.includes(dimensionKey));
      if (obsKey && observations[obsKey]?.[0] !== undefined) {
        return observations[obsKey][0];
      }
      return null;
    } catch {
      return null;
    }
  }

  /**
   * Fetch dwelling structure data (G32)
   */
  async getDwellingStructure(sa2Code: string): Promise<Partial<CensusData>> {
    try {
      const url = `${ABS_API_CONFIG.baseUrl}/data/${ABS_API_CONFIG.dataflows.dwellingStructure}/${sa2Code}`;
      const data = await this.request<any>(url);

      // Parse dwelling counts by type from SDMX response
      // Structure types: Separate house, Semi-detached, Flat/unit, Other
      return {
        dwellingHouses: this.parseSDMXResponse(data, 'STRD_1'),
        dwellingSemiDetached: this.parseSDMXResponse(data, 'STRD_2'),
        dwellingUnits: this.parseSDMXResponse(data, 'STRD_3'),
        dwellingOther: this.parseSDMXResponse(data, 'STRD_4'),
        totalDwellings: this.parseSDMXResponse(data, 'TOT'),
      };
    } catch (error) {
      console.error(`Failed to fetch dwelling structure for SA2 ${sa2Code}:`, error);
      return {};
    }
  }

  /**
   * Fetch tenure data (G33)
   */
  async getTenureData(sa2Code: string): Promise<Partial<CensusData>> {
    try {
      const url = `${ABS_API_CONFIG.baseUrl}/data/${ABS_API_CONFIG.dataflows.tenure}/${sa2Code}`;
      const data = await this.request<any>(url);

      return {
        ownerOccupied: this.parseSDMXResponse(data, 'TEND_1'), // Owned outright + Owned with mortgage
        renterOccupied: this.parseSDMXResponse(data, 'TEND_2'), // Rented
      };
    } catch (error) {
      console.error(`Failed to fetch tenure data for SA2 ${sa2Code}:`, error);
      return {};
    }
  }

  /**
   * Fetch income data (G02)
   */
  async getIncomeData(sa2Code: string): Promise<Partial<CensusData>> {
    try {
      const url = `${ABS_API_CONFIG.baseUrl}/data/${ABS_API_CONFIG.dataflows.income}/${sa2Code}`;
      const data = await this.request<any>(url);

      return {
        medianWeeklyIncome: this.parseSDMXResponse(data, 'MEDHINC'),
        population: this.parseSDMXResponse(data, 'TOTPOP'),
        medianAge: this.parseSDMXResponse(data, 'MEDAGE'),
      };
    } catch (error) {
      console.error(`Failed to fetch income data for SA2 ${sa2Code}:`, error);
      return {};
    }
  }

  /**
   * Fetch bedroom distribution (G37)
   */
  async getBedroomData(sa2Code: string): Promise<Partial<CensusData>> {
    try {
      const url = `${ABS_API_CONFIG.baseUrl}/data/${ABS_API_CONFIG.dataflows.bedrooms}/${sa2Code}`;
      const data = await this.request<any>(url);

      return {
        bedroomDistribution: {
          oneBedroom: this.parseSDMXResponse(data, 'BEDD_1') || 0,
          twoBedroom: this.parseSDMXResponse(data, 'BEDD_2') || 0,
          threeBedroom: this.parseSDMXResponse(data, 'BEDD_3') || 0,
          fourBedroom: this.parseSDMXResponse(data, 'BEDD_4') || 0,
          fivePlusBedroom: this.parseSDMXResponse(data, 'BEDD_5') || 0,
        },
      };
    } catch (error) {
      console.error(`Failed to fetch bedroom data for SA2 ${sa2Code}:`, error);
      return {
        bedroomDistribution: {
          oneBedroom: 0,
          twoBedroom: 0,
          threeBedroom: 0,
          fourBedroom: 0,
          fivePlusBedroom: 0,
        },
      };
    }
  }

  /**
   * Fetch all census data for an SA2 code
   */
  async getFullCensusData(sa2Code: string, sa2Name: string): Promise<CensusData | null> {
    try {
      // Fetch all data types in parallel where possible
      const [dwelling, tenure, income, bedrooms] = await Promise.all([
        this.getDwellingStructure(sa2Code),
        this.getTenureData(sa2Code),
        this.getIncomeData(sa2Code),
        this.getBedroomData(sa2Code),
      ]);

      return {
        sa2Code,
        sa2Name,
        dwellingHouses: dwelling.dwellingHouses ?? null,
        dwellingUnits: dwelling.dwellingUnits ?? null,
        dwellingTownhouses: dwelling.dwellingTownhouses ?? null,
        dwellingSemiDetached: dwelling.dwellingSemiDetached ?? null,
        dwellingOther: dwelling.dwellingOther ?? null,
        totalDwellings: dwelling.totalDwellings ?? null,
        ownerOccupied: tenure.ownerOccupied ?? null,
        renterOccupied: tenure.renterOccupied ?? null,
        medianWeeklyIncome: income.medianWeeklyIncome ?? null,
        population: income.population ?? null,
        medianAge: income.medianAge ?? null,
        familyHouseholds: null, // Would need additional API call
        coupleNoChildren: null,
        singlePersonHousehold: null,
        bedroomDistribution: bedrooms.bedroomDistribution || {
          oneBedroom: 0,
          twoBedroom: 0,
          threeBedroom: 0,
          fourBedroom: 0,
          fivePlusBedroom: 0,
        },
      };
    } catch (error) {
      console.error(`Failed to fetch census data for SA2 ${sa2Code}:`, error);
      return null;
    }
  }
}

// Export singleton instance
export const censusAPI = new ABSCensusAPIClient();

// ============================================
// COMPUTED INSIGHTS
// ============================================

/**
 * Compute derived insights from raw census data
 * These insights are service-specific and used for content generation
 */
export function computeCensusInsights(data: CensusData): ComputedCensusInsights {
  // Determine primary dwelling type
  const dwellingCounts = [
    { type: 'house' as const, count: data.dwellingHouses || 0 },
    { type: 'unit' as const, count: data.dwellingUnits || 0 },
    { type: 'townhouse' as const, count: data.dwellingTownhouses || 0 },
    { type: 'semi-detached' as const, count: data.dwellingSemiDetached || 0 },
  ];

  const totalDwellings = dwellingCounts.reduce((sum, d) => sum + d.count, 0);
  const sorted = [...dwellingCounts].sort((a, b) => b.count - a.count);

  const primary = sorted[0];
  const primaryDwellingType: ComputedCensusInsights['primaryDwellingType'] =
    primary.count > totalDwellings * 0.5 ? primary.type : 'mixed';

  // Calculate dwelling type ratio string
  const dwellingTypeRatio = dwellingCounts
    .filter(d => d.count > 0)
    .map(d => `${Math.round((d.count / totalDwellings) * 100)}% ${d.type}s`)
    .slice(0, 3)
    .join(', ');

  // Calculate tenure percentages
  const totalTenure = (data.ownerOccupied || 0) + (data.renterOccupied || 0);
  const ownerPercentage = totalTenure > 0
    ? Math.round(((data.ownerOccupied || 0) / totalTenure) * 100 * 100) / 100
    : null;
  const renterPercentage = totalTenure > 0
    ? Math.round(((data.renterOccupied || 0) / totalTenure) * 100 * 100) / 100
    : null;

  // Determine tenure profile
  let tenureProfile: ComputedCensusInsights['tenureProfile'] = 'balanced';
  if (ownerPercentage !== null) {
    if (ownerPercentage > 60) tenureProfile = 'owner-dominant';
    else if (ownerPercentage < 40) tenureProfile = 'renter-heavy';
  }

  // Calculate income quartile
  const weeklyIncome = data.medianWeeklyIncome || 0;
  const medianAnnualIncome = weeklyIncome * 52;

  let incomeQuartile: ComputedCensusInsights['incomeQuartile'] = 'middle';
  if (weeklyIncome > 2500) incomeQuartile = 'high';
  else if (weeklyIncome > 1800) incomeQuartile = 'upper-middle';
  else if (weeklyIncome < 1200) incomeQuartile = 'lower';

  // Generate income description
  const incomeDescriptions: Record<typeof incomeQuartile, string> = {
    'high': 'affluent area with high disposable income',
    'upper-middle': 'established area with above-average household income',
    'middle': 'middle-income suburb with diverse demographics',
    'lower': 'accessible suburb with affordable housing options',
  };
  const incomeDescription = incomeDescriptions[incomeQuartile];

  // Calculate average bedrooms
  const bd = data.bedroomDistribution;
  const totalBedrooms =
    bd.oneBedroom * 1 +
    bd.twoBedroom * 2 +
    bd.threeBedroom * 3 +
    bd.fourBedroom * 4 +
    bd.fivePlusBedroom * 5;
  const totalBedroomDwellings =
    bd.oneBedroom + bd.twoBedroom + bd.threeBedroom + bd.fourBedroom + bd.fivePlusBedroom;

  const avgBedrooms = totalBedroomDwellings > 0
    ? Math.round((totalBedrooms / totalBedroomDwellings) * 10) / 10
    : null;

  // Floor plan complexity based on bedrooms and dwelling type
  let floorPlanComplexity: ComputedCensusInsights['floorPlanComplexity'] = 'moderate';
  if (avgBedrooms !== null) {
    if (avgBedrooms >= 4 || primaryDwellingType === 'house') {
      floorPlanComplexity = 'complex';
    } else if (avgBedrooms <= 2 || primaryDwellingType === 'unit') {
      floorPlanComplexity = 'simple';
    }
  }

  // Generate typical layout notes
  let typicalLayoutNotes = '';
  if (primaryDwellingType === 'house' && avgBedrooms !== null) {
    typicalLayoutNotes = `Predominantly ${avgBedrooms.toFixed(0)}-bedroom houses, often with multiple living areas and outdoor spaces that benefit from detailed floor plans.`;
  } else if (primaryDwellingType === 'unit') {
    typicalLayoutNotes = `Primarily apartment living with efficient layouts. Floor plans help buyers compare unit sizes and configurations.`;
  } else if (primaryDwellingType === 'townhouse') {
    typicalLayoutNotes = `Mix of townhouses with multi-level layouts. 3D floor plans help visualize the flow between floors.`;
  } else {
    typicalLayoutNotes = `Diverse property mix with varying layouts. Professional floor plans help differentiate listings.`;
  }

  // Staging target audience based on tenure
  let stagingTargetAudience: ComputedCensusInsights['stagingTargetAudience'] = 'mixed';
  if (renterPercentage !== null && renterPercentage > 50) {
    stagingTargetAudience = 'investors';
  } else if (ownerPercentage !== null && ownerPercentage > 60) {
    stagingTargetAudience = 'owner-occupiers';
  }

  // Staging style hint based on income and dwelling type
  let stagingStyleHint = 'contemporary-neutral';
  if (incomeQuartile === 'high') {
    stagingStyleHint = 'luxury-contemporary';
  } else if (primaryDwellingType === 'unit' && renterPercentage && renterPercentage > 50) {
    stagingStyleHint = 'modern-minimalist';
  } else if (primaryDwellingType === 'house' && ownerPercentage && ownerPercentage > 60) {
    stagingStyleHint = 'warm-family-friendly';
  }

  return {
    primaryDwellingType,
    dwellingTypeRatio,
    ownerPercentage,
    renterPercentage,
    tenureProfile,
    medianAnnualIncome: medianAnnualIncome > 0 ? medianAnnualIncome : null,
    incomeQuartile,
    incomeDescription,
    avgBedrooms,
    floorPlanComplexity,
    typicalLayoutNotes,
    stagingTargetAudience,
    stagingStyleHint,
  };
}

// ============================================
// MOCK DATA FOR DEVELOPMENT
// ============================================

/**
 * Generate mock census data for development/testing
 * Uses realistic ranges based on state averages
 */
export function getMockCensusData(
  sa2Code: string,
  sa2Name: string,
  state: string
): CensusData {
  // State-based multipliers for realistic variation
  const stateMultipliers: Record<string, { income: number; units: number }> = {
    NSW: { income: 1.2, units: 0.35 },
    VIC: { income: 1.1, units: 0.30 },
    QLD: { income: 0.95, units: 0.25 },
    WA: { income: 1.05, units: 0.20 },
    SA: { income: 0.90, units: 0.22 },
    ACT: { income: 1.35, units: 0.28 },
    TAS: { income: 0.85, units: 0.15 },
    NT: { income: 1.0, units: 0.18 },
  };

  const mult = stateMultipliers[state] || { income: 1.0, units: 0.25 };
  const baseIncome = 1500;
  const totalDwellings = 3000 + Math.floor(Math.random() * 5000);

  const unitRatio = mult.units + (Math.random() * 0.2 - 0.1);
  const houseRatio = 1 - unitRatio - 0.1;

  return {
    sa2Code,
    sa2Name,
    dwellingHouses: Math.floor(totalDwellings * houseRatio),
    dwellingUnits: Math.floor(totalDwellings * unitRatio),
    dwellingTownhouses: Math.floor(totalDwellings * 0.05),
    dwellingSemiDetached: Math.floor(totalDwellings * 0.05),
    dwellingOther: Math.floor(totalDwellings * 0.02),
    totalDwellings,
    ownerOccupied: Math.floor(totalDwellings * (0.5 + Math.random() * 0.3)),
    renterOccupied: Math.floor(totalDwellings * (0.2 + Math.random() * 0.3)),
    medianWeeklyIncome: Math.floor(baseIncome * mult.income * (0.8 + Math.random() * 0.4)),
    population: Math.floor(totalDwellings * 2.5),
    medianAge: Math.floor(30 + Math.random() * 15),
    familyHouseholds: Math.floor(totalDwellings * 0.35),
    coupleNoChildren: Math.floor(totalDwellings * 0.25),
    singlePersonHousehold: Math.floor(totalDwellings * 0.25),
    bedroomDistribution: {
      oneBedroom: Math.floor(totalDwellings * 0.1),
      twoBedroom: Math.floor(totalDwellings * 0.25),
      threeBedroom: Math.floor(totalDwellings * 0.35),
      fourBedroom: Math.floor(totalDwellings * 0.2),
      fivePlusBedroom: Math.floor(totalDwellings * 0.1),
    },
  };
}
