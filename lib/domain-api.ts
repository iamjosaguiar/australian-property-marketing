/**
 * Domain API Integration
 * Fetches Australian real estate market data from Domain's public API
 * API Documentation: https://developer.domain.com.au/
 */

export interface DomainMarketStats {
  medianPrice: number | null;
  medianRentalPrice: number | null;
  daysOnMarket: number | null;
  auctionClearanceRate: number | null;
  numberOfSales: number | null;
  capitalGrowth: number | null; // Annual percentage
  rentalYield: number | null; // Annual percentage
  propertyTypes: {
    house: { median: number | null; count: number };
    apartment: { median: number | null; count: number };
    townhouse: { median: number | null; count: number };
  };
  lastUpdated: string;
}

export interface DomainSuburbProfile {
  suburbName: string;
  state: string;
  postcode: string;
  medianHousePrice: number | null;
  medianUnitPrice: number | null;
  demographics: {
    population: number | null;
    medianAge: number | null;
    medianHouseholdIncome: number | null;
  };
  amenities: {
    schools: number;
    transport: string[];
    shopping: string[];
  };
}

class DomainAPIClient {
  private baseUrl = 'https://api.domain.com.au';
  private apiKey: string | null = null;

  constructor() {
    // API key should be set via environment variable
    this.apiKey = process.env.DOMAIN_API_KEY || null;
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    if (!this.apiKey) {
      throw new Error('Domain API key not configured. Set DOMAIN_API_KEY environment variable.');
    }

    const url = `${this.baseUrl}${endpoint}`;
    const headers = {
      'X-Api-Key': this.apiKey,
      'Content-Type': 'application/json',
      ...options.headers,
    };

    try {
      const response = await fetch(url, {
        ...options,
        headers,
      });

      if (!response.ok) {
        throw new Error(`Domain API error: ${response.status} ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Domain API request failed:', error);
      throw error;
    }
  }

  /**
   * Fetch market statistics for a suburb
   * @param suburb - Suburb name
   * @param state - State code (e.g., 'NSW', 'VIC')
   * @param postcode - Optional postcode for more accurate matching
   */
  async getMarketStats(
    suburb: string,
    state: string,
    postcode?: string
  ): Promise<DomainMarketStats | null> {
    try {
      // Domain API endpoint for suburb statistics
      const endpoint = `/v1/suburbPerformanceStatistics/${state}/${suburb}${postcode ? `/${postcode}` : ''}`;

      const data = await this.request<any>(endpoint);

      return this.parseMarketStats(data);
    } catch (error) {
      console.error(`Failed to fetch market stats for ${suburb}, ${state}:`, error);
      return null;
    }
  }

  /**
   * Fetch suburb profile information
   */
  async getSuburbProfile(
    suburb: string,
    state: string
  ): Promise<DomainSuburbProfile | null> {
    try {
      const endpoint = `/v1/suburbPerformanceStatistics/${state}/${suburb}/profile`;
      const data = await this.request<any>(endpoint);

      return {
        suburbName: data.suburb || suburb,
        state: data.state || state,
        postcode: data.postcode || '',
        medianHousePrice: data.medianSoldPrice?.house || null,
        medianUnitPrice: data.medianSoldPrice?.unit || null,
        demographics: {
          population: data.demographics?.population || null,
          medianAge: data.demographics?.medianAge || null,
          medianHouseholdIncome: data.demographics?.medianIncome || null,
        },
        amenities: {
          schools: data.amenities?.schools || 0,
          transport: data.amenities?.transport || [],
          shopping: data.amenities?.shopping || [],
        },
      };
    } catch (error) {
      console.error(`Failed to fetch suburb profile for ${suburb}, ${state}:`, error);
      return null;
    }
  }

  /**
   * Parse raw API response into standardized market stats
   */
  private parseMarketStats(data: any): DomainMarketStats {
    const now = new Date().toISOString();

    return {
      medianPrice: data.series?.seriesInfo?.medianSoldPrice || null,
      medianRentalPrice: data.series?.seriesInfo?.medianRentListingPrice || null,
      daysOnMarket: data.series?.seriesInfo?.medianDaysAdvertised || null,
      auctionClearanceRate: data.series?.seriesInfo?.auctionClearanceRate || null,
      numberOfSales: data.series?.seriesInfo?.numberSold || null,
      capitalGrowth: data.series?.seriesInfo?.annualGrowth || null,
      rentalYield: data.series?.seriesInfo?.grossRentalYield || null,
      propertyTypes: {
        house: {
          median: data.series?.seriesInfo?.medianSoldPriceHouse || null,
          count: data.series?.seriesInfo?.numberSoldHouse || 0,
        },
        apartment: {
          median: data.series?.seriesInfo?.medianSoldPriceUnit || null,
          count: data.series?.seriesInfo?.numberSoldUnit || 0,
        },
        townhouse: {
          median: data.series?.seriesInfo?.medianSoldPriceTownhouse || null,
          count: data.series?.seriesInfo?.numberSoldTownhouse || 0,
        },
      },
      lastUpdated: now,
    };
  }

  /**
   * Fetch recent sales for a suburb
   */
  async getRecentSales(
    suburb: string,
    state: string,
    limit: number = 10
  ): Promise<any[]> {
    try {
      const endpoint = `/v1/salesResults/listings?suburb=${suburb}&state=${state}&pageSize=${limit}`;
      const data = await this.request<any>(endpoint);
      return data || [];
    } catch (error) {
      console.error(`Failed to fetch recent sales for ${suburb}, ${state}:`, error);
      return [];
    }
  }
}

// Export singleton instance
export const domainAPI = new DomainAPIClient();

/**
 * Helper function to fetch and cache market stats
 * This should be called periodically (e.g., quarterly) to update suburb data
 */
export async function updateSuburbMarketStats(
  suburbName: string,
  state: string,
  postcode?: string
): Promise<DomainMarketStats | null> {
  try {
    const stats = await domainAPI.getMarketStats(suburbName, state, postcode);

    if (stats) {
      console.log(`✓ Updated market stats for ${suburbName}, ${state}`);
      // TODO: Store in database
      // await prisma.suburb.update({
      //   where: { slug: ... },
      //   data: { marketStats: stats }
      // });
    }

    return stats;
  } catch (error) {
    console.error(`Failed to update stats for ${suburbName}:`, error);
    return null;
  }
}

/**
 * Batch update market stats for multiple suburbs
 * Use with rate limiting to avoid API throttling
 */
export async function batchUpdateMarketStats(
  suburbs: Array<{ name: string; state: string; postcode?: string }>,
  delayMs: number = 1000
): Promise<void> {
  console.log(`Starting batch update for ${suburbs.length} suburbs...`);

  for (let i = 0; i < suburbs.length; i++) {
    const suburb = suburbs[i];
    console.log(`[${i + 1}/${suburbs.length}] Fetching ${suburb.name}, ${suburb.state}...`);

    await updateSuburbMarketStats(suburb.name, suburb.state, suburb.postcode);

    // Rate limiting delay
    if (i < suburbs.length - 1) {
      await new Promise(resolve => setTimeout(resolve, delayMs));
    }
  }

  console.log('✓ Batch update complete');
}

/**
 * Get mock market stats for development/testing
 * Use when Domain API is not available or during development
 */
export function getMockMarketStats(suburb: string, state: string): DomainMarketStats {
  // Generate realistic-looking mock data based on state
  const stateMultipliers: Record<string, number> = {
    NSW: 1.3,
    VIC: 1.1,
    QLD: 0.9,
    WA: 0.85,
    SA: 0.75,
    ACT: 1.15,
    TAS: 0.7,
    NT: 0.8,
  };

  const multiplier = stateMultipliers[state] || 1.0;
  const basePrice = 750000;

  return {
    medianPrice: Math.round(basePrice * multiplier),
    medianRentalPrice: Math.round(550 * multiplier),
    daysOnMarket: Math.floor(25 + Math.random() * 20),
    auctionClearanceRate: 0.65 + Math.random() * 0.2,
    numberOfSales: Math.floor(80 + Math.random() * 100),
    capitalGrowth: 3.5 + Math.random() * 4,
    rentalYield: 2.8 + Math.random() * 1.5,
    propertyTypes: {
      house: {
        median: Math.round(basePrice * multiplier * 1.2),
        count: Math.floor(50 + Math.random() * 50),
      },
      apartment: {
        median: Math.round(basePrice * multiplier * 0.7),
        count: Math.floor(30 + Math.random() * 40),
      },
      townhouse: {
        median: Math.round(basePrice * multiplier * 0.9),
        count: Math.floor(20 + Math.random() * 30),
      },
    },
    lastUpdated: new Date().toISOString(),
  };
}

/**
 * Format price for display
 */
export function formatPrice(price: number | null): string {
  if (!price) return 'N/A';

  if (price >= 1000000) {
    return `$${(price / 1000000).toFixed(2)}M`;
  }

  return `$${(price / 1000).toFixed(0)}K`;
}

/**
 * Format percentage for display
 */
export function formatPercentage(value: number | null): string {
  if (value === null) return 'N/A';
  return `${value.toFixed(1)}%`;
}
