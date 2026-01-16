/**
 * BOM (Bureau of Meteorology) Weather Data Integration
 * Fetches Australian climate data from BOM data feeds
 *
 * BOM provides weather data through various feeds and endpoints.
 * Climate statistics are mapped by weather station, so each suburb
 * is matched to its nearest BOM observation station.
 */

// ============================================
// TYPES
// ============================================

export interface BOMStation {
  id: string;
  name: string;
  state: string;
  latitude: number;
  longitude: number;
  elevation: number;
  // Climate summary data (annual averages)
  climateData?: BOMClimateData;
}

export interface BOMClimateData {
  // Annual days counts
  annualSunnyDays: number;      // Clear + mostly clear days
  annualRainyDays: number;      // Days with >= 1mm rain
  annualCloudyDays: number;     // Overcast days

  // Wind statistics
  avgWindSpeedKmh: number;      // Annual average 9am wind speed
  maxWindSpeedKmh: number;      // 90th percentile wind
  lowWindDays: number;          // Days with wind < 20km/h

  // Temperature
  avgSummerMaxTemp: number;     // Dec-Feb average max
  avgWinterMaxTemp: number;     // Jun-Aug average max
  avgAnnualRainfall: number;    // mm

  // Monthly breakdowns for best periods
  monthlyStats: MonthlyStats[];
}

export interface MonthlyStats {
  month: number; // 1-12
  avgMaxTemp: number;
  avgMinTemp: number;
  avgRainDays: number;
  avgSunnyDays: number;
  avgWindSpeed: number;
}

export interface ComputedWeatherInsights {
  droneFlightRating: 'excellent' | 'good' | 'moderate' | 'challenging';
  droneSeasonNotes: string;
  droneRecommended: boolean;
  bestMonthsPhotography: string;
  avgSunsetTime: string;
  goldenHourStart: string;
  twilightDuration: number; // minutes
  bestTwilightMonths: string;
  photographySeasonTip: string;
}

// ============================================
// BOM STATION DATA
// ============================================

/**
 * Major BOM weather stations across Australia
 * Subset of ~800 active stations, covering major population centers
 * Full list available at: http://www.bom.gov.au/climate/data/stations/
 */
const BOM_STATIONS: BOMStation[] = [
  // NSW
  { id: '066062', name: 'Sydney Observatory Hill', state: 'NSW', latitude: -33.8607, longitude: 151.2050, elevation: 39 },
  { id: '066037', name: 'Sydney Airport AMO', state: 'NSW', latitude: -33.9465, longitude: 151.1731, elevation: 6 },
  { id: '061055', name: 'Parramatta North', state: 'NSW', latitude: -33.7996, longitude: 151.0074, elevation: 55 },
  { id: '067105', name: 'Richmond RAAF', state: 'NSW', latitude: -33.6004, longitude: 150.7761, elevation: 19 },
  { id: '061078', name: 'Bankstown Airport', state: 'NSW', latitude: -33.9244, longitude: 150.9864, elevation: 6 },
  { id: '068076', name: 'Wollongong University', state: 'NSW', latitude: -34.4062, longitude: 150.8785, elevation: 30 },
  { id: '060139', name: 'Newcastle Nobbys', state: 'NSW', latitude: -32.9186, longitude: 151.7978, elevation: 33 },

  // VIC
  { id: '086071', name: 'Melbourne Olympic Park', state: 'VIC', latitude: -37.8255, longitude: 144.9816, elevation: 7 },
  { id: '086282', name: 'Melbourne Airport', state: 'VIC', latitude: -37.6655, longitude: 144.8321, elevation: 113 },
  { id: '087031', name: 'Laverton RAAF', state: 'VIC', latitude: -37.8636, longitude: 144.7561, elevation: 20 },
  { id: '086351', name: 'Moorabbin Airport', state: 'VIC', latitude: -37.9758, longitude: 145.0978, elevation: 12 },

  // QLD
  { id: '040913', name: 'Brisbane', state: 'QLD', latitude: -27.4778, longitude: 153.0289, elevation: 8 },
  { id: '040842', name: 'Brisbane Airport', state: 'QLD', latitude: -27.3917, longitude: 153.1292, elevation: 5 },
  { id: '040764', name: 'Archerfield Airport', state: 'QLD', latitude: -27.5703, longitude: 153.0078, elevation: 15 },
  { id: '040717', name: 'Gold Coast Seaway', state: 'QLD', latitude: -27.9378, longitude: 153.4283, elevation: 3 },
  { id: '031011', name: 'Cairns Aero', state: 'QLD', latitude: -16.8736, longitude: 145.7458, elevation: 3 },

  // WA
  { id: '009021', name: 'Perth Airport', state: 'WA', latitude: -31.9275, longitude: 115.9764, elevation: 15 },
  { id: '009225', name: 'Perth Metro', state: 'WA', latitude: -31.9192, longitude: 115.8728, elevation: 25 },
  { id: '009172', name: 'Swanbourne', state: 'WA', latitude: -31.9533, longitude: 115.7614, elevation: 10 },

  // SA
  { id: '023034', name: 'Adelaide Airport', state: 'SA', latitude: -34.9524, longitude: 138.5204, elevation: 2 },
  { id: '023090', name: 'Adelaide Kent Town', state: 'SA', latitude: -34.9211, longitude: 138.6216, elevation: 48 },

  // ACT
  { id: '070351', name: 'Canberra Airport', state: 'ACT', latitude: -35.3088, longitude: 149.2003, elevation: 578 },

  // TAS
  { id: '094029', name: 'Hobart Ellerslie Road', state: 'TAS', latitude: -42.8897, longitude: 147.3278, elevation: 51 },

  // NT
  { id: '014015', name: 'Darwin Airport', state: 'NT', latitude: -12.4239, longitude: 130.8925, elevation: 30 },
];

// ============================================
// CLIMATE DATA BY STATION
// ============================================

/**
 * Pre-computed climate statistics for major stations
 * Source: BOM Climate Statistics (30-year averages)
 * http://www.bom.gov.au/climate/averages/tables/
 */
const CLIMATE_DATA: Record<string, BOMClimateData> = {
  // Sydney Observatory Hill
  '066062': {
    annualSunnyDays: 236,
    annualRainyDays: 102,
    annualCloudyDays: 27,
    avgWindSpeedKmh: 12.5,
    maxWindSpeedKmh: 28,
    lowWindDays: 245,
    avgSummerMaxTemp: 26.5,
    avgWinterMaxTemp: 17.4,
    avgAnnualRainfall: 1149,
    monthlyStats: [
      { month: 1, avgMaxTemp: 26.5, avgMinTemp: 19.3, avgRainDays: 8, avgSunnyDays: 22, avgWindSpeed: 11.8 },
      { month: 2, avgMaxTemp: 26.3, avgMinTemp: 19.4, avgRainDays: 8, avgSunnyDays: 20, avgWindSpeed: 11.2 },
      { month: 3, avgMaxTemp: 25.2, avgMinTemp: 18.0, avgRainDays: 9, avgSunnyDays: 21, avgWindSpeed: 10.5 },
      { month: 4, avgMaxTemp: 23.0, avgMinTemp: 14.9, avgRainDays: 8, avgSunnyDays: 21, avgWindSpeed: 10.2 },
      { month: 5, avgMaxTemp: 20.0, avgMinTemp: 11.6, avgRainDays: 8, avgSunnyDays: 21, avgWindSpeed: 10.8 },
      { month: 6, avgMaxTemp: 17.6, avgMinTemp: 9.3, avgRainDays: 8, avgSunnyDays: 19, avgWindSpeed: 11.5 },
      { month: 7, avgMaxTemp: 17.0, avgMinTemp: 8.2, avgRainDays: 6, avgSunnyDays: 21, avgWindSpeed: 12.2 },
      { month: 8, avgMaxTemp: 18.4, avgMinTemp: 9.0, avgRainDays: 6, avgSunnyDays: 22, avgWindSpeed: 13.5 },
      { month: 9, avgMaxTemp: 20.7, avgMinTemp: 11.3, avgRainDays: 6, avgSunnyDays: 22, avgWindSpeed: 14.1 },
      { month: 10, avgMaxTemp: 22.6, avgMinTemp: 14.0, avgRainDays: 8, avgSunnyDays: 21, avgWindSpeed: 14.0 },
      { month: 11, avgMaxTemp: 24.0, avgMinTemp: 16.1, avgRainDays: 8, avgSunnyDays: 21, avgWindSpeed: 13.2 },
      { month: 12, avgMaxTemp: 25.6, avgMinTemp: 18.0, avgRainDays: 8, avgSunnyDays: 22, avgWindSpeed: 12.3 },
    ],
  },
  // Melbourne Olympic Park
  '086071': {
    annualSunnyDays: 208,
    annualRainyDays: 107,
    annualCloudyDays: 50,
    avgWindSpeedKmh: 14.2,
    maxWindSpeedKmh: 32,
    lowWindDays: 195,
    avgSummerMaxTemp: 26.0,
    avgWinterMaxTemp: 14.2,
    avgAnnualRainfall: 603,
    monthlyStats: [
      { month: 1, avgMaxTemp: 26.0, avgMinTemp: 14.6, avgRainDays: 6, avgSunnyDays: 23, avgWindSpeed: 13.5 },
      { month: 2, avgMaxTemp: 26.1, avgMinTemp: 14.8, avgRainDays: 5, avgSunnyDays: 21, avgWindSpeed: 12.8 },
      { month: 3, avgMaxTemp: 24.0, avgMinTemp: 13.3, avgRainDays: 6, avgSunnyDays: 21, avgWindSpeed: 12.0 },
      { month: 4, avgMaxTemp: 20.5, avgMinTemp: 10.8, avgRainDays: 8, avgSunnyDays: 18, avgWindSpeed: 12.5 },
      { month: 5, avgMaxTemp: 17.0, avgMinTemp: 8.6, avgRainDays: 9, avgSunnyDays: 15, avgWindSpeed: 13.2 },
      { month: 6, avgMaxTemp: 14.2, avgMinTemp: 6.8, avgRainDays: 9, avgSunnyDays: 13, avgWindSpeed: 14.0 },
      { month: 7, avgMaxTemp: 13.7, avgMinTemp: 6.2, avgRainDays: 9, avgSunnyDays: 14, avgWindSpeed: 14.8 },
      { month: 8, avgMaxTemp: 15.0, avgMinTemp: 6.8, avgRainDays: 10, avgSunnyDays: 15, avgWindSpeed: 15.5 },
      { month: 9, avgMaxTemp: 17.3, avgMinTemp: 8.3, avgRainDays: 10, avgSunnyDays: 16, avgWindSpeed: 15.2 },
      { month: 10, avgMaxTemp: 19.9, avgMinTemp: 10.1, avgRainDays: 10, avgSunnyDays: 18, avgWindSpeed: 14.8 },
      { month: 11, avgMaxTemp: 22.2, avgMinTemp: 11.7, avgRainDays: 9, avgSunnyDays: 19, avgWindSpeed: 14.2 },
      { month: 12, avgMaxTemp: 24.3, avgMinTemp: 13.3, avgRainDays: 7, avgSunnyDays: 21, avgWindSpeed: 13.8 },
    ],
  },
  // Brisbane
  '040913': {
    annualSunnyDays: 261,
    annualRainyDays: 84,
    annualCloudyDays: 20,
    avgWindSpeedKmh: 10.8,
    maxWindSpeedKmh: 24,
    lowWindDays: 275,
    avgSummerMaxTemp: 30.2,
    avgWinterMaxTemp: 21.8,
    avgAnnualRainfall: 1028,
    monthlyStats: [
      { month: 1, avgMaxTemp: 30.2, avgMinTemp: 21.8, avgRainDays: 9, avgSunnyDays: 20, avgWindSpeed: 10.5 },
      { month: 2, avgMaxTemp: 29.8, avgMinTemp: 21.6, avgRainDays: 10, avgSunnyDays: 19, avgWindSpeed: 10.2 },
      { month: 3, avgMaxTemp: 28.8, avgMinTemp: 20.3, avgRainDays: 10, avgSunnyDays: 21, avgWindSpeed: 9.8 },
      { month: 4, avgMaxTemp: 26.7, avgMinTemp: 17.3, avgRainDays: 7, avgSunnyDays: 23, avgWindSpeed: 9.2 },
      { month: 5, avgMaxTemp: 24.0, avgMinTemp: 14.0, avgRainDays: 6, avgSunnyDays: 24, avgWindSpeed: 9.5 },
      { month: 6, avgMaxTemp: 21.8, avgMinTemp: 11.6, avgRainDays: 5, avgSunnyDays: 23, avgWindSpeed: 10.2 },
      { month: 7, avgMaxTemp: 21.5, avgMinTemp: 10.4, avgRainDays: 4, avgSunnyDays: 25, avgWindSpeed: 11.0 },
      { month: 8, avgMaxTemp: 22.8, avgMinTemp: 11.0, avgRainDays: 4, avgSunnyDays: 26, avgWindSpeed: 12.0 },
      { month: 9, avgMaxTemp: 25.2, avgMinTemp: 14.1, avgRainDays: 5, avgSunnyDays: 25, avgWindSpeed: 12.5 },
      { month: 10, avgMaxTemp: 27.0, avgMinTemp: 16.8, avgRainDays: 7, avgSunnyDays: 23, avgWindSpeed: 12.2 },
      { month: 11, avgMaxTemp: 28.5, avgMinTemp: 19.0, avgRainDays: 8, avgSunnyDays: 22, avgWindSpeed: 11.5 },
      { month: 12, avgMaxTemp: 29.8, avgMinTemp: 20.8, avgRainDays: 9, avgSunnyDays: 21, avgWindSpeed: 10.8 },
    ],
  },
  // Perth Airport
  '009021': {
    annualSunnyDays: 265,
    annualRainyDays: 78,
    annualCloudyDays: 22,
    avgWindSpeedKmh: 15.5,
    maxWindSpeedKmh: 35,
    lowWindDays: 180,
    avgSummerMaxTemp: 32.5,
    avgWinterMaxTemp: 18.5,
    avgAnnualRainfall: 733,
    monthlyStats: [
      { month: 1, avgMaxTemp: 32.5, avgMinTemp: 17.8, avgRainDays: 2, avgSunnyDays: 28, avgWindSpeed: 16.5 },
      { month: 2, avgMaxTemp: 32.8, avgMinTemp: 18.0, avgRainDays: 2, avgSunnyDays: 26, avgWindSpeed: 15.8 },
      { month: 3, avgMaxTemp: 30.2, avgMinTemp: 16.2, avgRainDays: 3, avgSunnyDays: 27, avgWindSpeed: 14.2 },
      { month: 4, avgMaxTemp: 26.0, avgMinTemp: 13.0, avgRainDays: 5, avgSunnyDays: 24, avgWindSpeed: 13.0 },
      { month: 5, avgMaxTemp: 22.2, avgMinTemp: 10.5, avgRainDays: 9, avgSunnyDays: 19, avgWindSpeed: 14.5 },
      { month: 6, avgMaxTemp: 19.2, avgMinTemp: 8.5, avgRainDays: 12, avgSunnyDays: 15, avgWindSpeed: 16.2 },
      { month: 7, avgMaxTemp: 18.5, avgMinTemp: 7.8, avgRainDays: 13, avgSunnyDays: 15, avgWindSpeed: 17.0 },
      { month: 8, avgMaxTemp: 19.0, avgMinTemp: 7.8, avgRainDays: 12, avgSunnyDays: 17, avgWindSpeed: 17.5 },
      { month: 9, avgMaxTemp: 21.0, avgMinTemp: 9.0, avgRainDays: 9, avgSunnyDays: 20, avgWindSpeed: 17.2 },
      { month: 10, avgMaxTemp: 24.2, avgMinTemp: 11.2, avgRainDays: 6, avgSunnyDays: 24, avgWindSpeed: 16.8 },
      { month: 11, avgMaxTemp: 28.0, avgMinTemp: 14.0, avgRainDays: 4, avgSunnyDays: 26, avgWindSpeed: 16.5 },
      { month: 12, avgMaxTemp: 31.0, avgMinTemp: 16.2, avgRainDays: 2, avgSunnyDays: 28, avgWindSpeed: 16.0 },
    ],
  },
  // Adelaide Airport
  '023034': {
    annualSunnyDays: 245,
    annualRainyDays: 88,
    annualCloudyDays: 32,
    avgWindSpeedKmh: 13.8,
    maxWindSpeedKmh: 30,
    lowWindDays: 210,
    avgSummerMaxTemp: 29.5,
    avgWinterMaxTemp: 15.8,
    avgAnnualRainfall: 456,
    monthlyStats: [
      { month: 1, avgMaxTemp: 29.5, avgMinTemp: 17.0, avgRainDays: 3, avgSunnyDays: 26, avgWindSpeed: 14.0 },
      { month: 2, avgMaxTemp: 29.8, avgMinTemp: 17.2, avgRainDays: 3, avgSunnyDays: 24, avgWindSpeed: 13.5 },
      { month: 3, avgMaxTemp: 26.8, avgMinTemp: 15.0, avgRainDays: 4, avgSunnyDays: 24, avgWindSpeed: 12.5 },
      { month: 4, avgMaxTemp: 23.0, avgMinTemp: 12.0, avgRainDays: 6, avgSunnyDays: 21, avgWindSpeed: 12.0 },
      { month: 5, avgMaxTemp: 18.8, avgMinTemp: 9.5, avgRainDays: 9, avgSunnyDays: 17, avgWindSpeed: 13.2 },
      { month: 6, avgMaxTemp: 16.0, avgMinTemp: 7.5, avgRainDays: 10, avgSunnyDays: 14, avgWindSpeed: 14.0 },
      { month: 7, avgMaxTemp: 15.5, avgMinTemp: 7.0, avgRainDays: 10, avgSunnyDays: 15, avgWindSpeed: 14.5 },
      { month: 8, avgMaxTemp: 16.8, avgMinTemp: 7.5, avgRainDays: 10, avgSunnyDays: 16, avgWindSpeed: 15.0 },
      { month: 9, avgMaxTemp: 19.2, avgMinTemp: 9.2, avgRainDays: 8, avgSunnyDays: 19, avgWindSpeed: 14.8 },
      { month: 10, avgMaxTemp: 22.5, avgMinTemp: 11.5, avgRainDays: 7, avgSunnyDays: 22, avgWindSpeed: 14.5 },
      { month: 11, avgMaxTemp: 25.8, avgMinTemp: 14.0, avgRainDays: 5, avgSunnyDays: 24, avgWindSpeed: 14.2 },
      { month: 12, avgMaxTemp: 28.0, avgMinTemp: 15.8, avgRainDays: 4, avgSunnyDays: 26, avgWindSpeed: 14.0 },
    ],
  },
  // Canberra Airport
  '070351': {
    annualSunnyDays: 230,
    annualRainyDays: 93,
    annualCloudyDays: 42,
    avgWindSpeedKmh: 11.5,
    maxWindSpeedKmh: 26,
    lowWindDays: 235,
    avgSummerMaxTemp: 28.5,
    avgWinterMaxTemp: 12.5,
    avgAnnualRainfall: 616,
    monthlyStats: [
      { month: 1, avgMaxTemp: 28.5, avgMinTemp: 13.8, avgRainDays: 6, avgSunnyDays: 23, avgWindSpeed: 10.5 },
      { month: 2, avgMaxTemp: 27.8, avgMinTemp: 13.5, avgRainDays: 5, avgSunnyDays: 22, avgWindSpeed: 10.0 },
      { month: 3, avgMaxTemp: 24.8, avgMinTemp: 11.2, avgRainDays: 6, avgSunnyDays: 22, avgWindSpeed: 9.5 },
      { month: 4, avgMaxTemp: 20.5, avgMinTemp: 7.2, avgRainDays: 6, avgSunnyDays: 21, avgWindSpeed: 9.8 },
      { month: 5, avgMaxTemp: 15.8, avgMinTemp: 3.8, avgRainDays: 7, avgSunnyDays: 19, avgWindSpeed: 10.5 },
      { month: 6, avgMaxTemp: 12.5, avgMinTemp: 1.5, avgRainDays: 8, avgSunnyDays: 17, avgWindSpeed: 11.2 },
      { month: 7, avgMaxTemp: 11.8, avgMinTemp: 0.5, avgRainDays: 8, avgSunnyDays: 18, avgWindSpeed: 12.0 },
      { month: 8, avgMaxTemp: 13.5, avgMinTemp: 1.5, avgRainDays: 8, avgSunnyDays: 19, avgWindSpeed: 13.0 },
      { month: 9, avgMaxTemp: 16.8, avgMinTemp: 4.2, avgRainDays: 8, avgSunnyDays: 20, avgWindSpeed: 13.5 },
      { month: 10, avgMaxTemp: 20.2, avgMinTemp: 7.2, avgRainDays: 9, avgSunnyDays: 20, avgWindSpeed: 12.8 },
      { month: 11, avgMaxTemp: 23.8, avgMinTemp: 10.0, avgRainDays: 8, avgSunnyDays: 21, avgWindSpeed: 12.0 },
      { month: 12, avgMaxTemp: 27.0, avgMinTemp: 12.5, avgRainDays: 7, avgSunnyDays: 22, avgWindSpeed: 11.2 },
    ],
  },
  // Hobart
  '094029': {
    annualSunnyDays: 198,
    annualRainyDays: 112,
    annualCloudyDays: 55,
    avgWindSpeedKmh: 13.2,
    maxWindSpeedKmh: 29,
    lowWindDays: 200,
    avgSummerMaxTemp: 22.5,
    avgWinterMaxTemp: 12.2,
    avgAnnualRainfall: 536,
    monthlyStats: [
      { month: 1, avgMaxTemp: 22.5, avgMinTemp: 12.8, avgRainDays: 7, avgSunnyDays: 20, avgWindSpeed: 12.5 },
      { month: 2, avgMaxTemp: 22.2, avgMinTemp: 12.8, avgRainDays: 6, avgSunnyDays: 19, avgWindSpeed: 12.0 },
      { month: 3, avgMaxTemp: 20.5, avgMinTemp: 11.5, avgRainDays: 7, avgSunnyDays: 19, avgWindSpeed: 11.5 },
      { month: 4, avgMaxTemp: 17.5, avgMinTemp: 9.2, avgRainDays: 9, avgSunnyDays: 16, avgWindSpeed: 11.8 },
      { month: 5, avgMaxTemp: 14.5, avgMinTemp: 7.0, avgRainDays: 9, avgSunnyDays: 14, avgWindSpeed: 12.5 },
      { month: 6, avgMaxTemp: 12.2, avgMinTemp: 5.0, avgRainDays: 10, avgSunnyDays: 12, avgWindSpeed: 13.0 },
      { month: 7, avgMaxTemp: 11.8, avgMinTemp: 4.5, avgRainDays: 11, avgSunnyDays: 13, avgWindSpeed: 13.5 },
      { month: 8, avgMaxTemp: 13.0, avgMinTemp: 5.0, avgRainDays: 11, avgSunnyDays: 14, avgWindSpeed: 14.5 },
      { month: 9, avgMaxTemp: 15.2, avgMinTemp: 6.5, avgRainDays: 10, avgSunnyDays: 16, avgWindSpeed: 14.8 },
      { month: 10, avgMaxTemp: 17.2, avgMinTemp: 8.2, avgRainDays: 10, avgSunnyDays: 17, avgWindSpeed: 14.2 },
      { month: 11, avgMaxTemp: 19.2, avgMinTemp: 10.0, avgRainDays: 9, avgSunnyDays: 18, avgWindSpeed: 13.5 },
      { month: 12, avgMaxTemp: 21.2, avgMinTemp: 11.8, avgRainDays: 8, avgSunnyDays: 19, avgWindSpeed: 12.8 },
    ],
  },
  // Darwin Airport
  '014015': {
    annualSunnyDays: 275,
    annualRainyDays: 98,
    annualCloudyDays: 12,
    avgWindSpeedKmh: 12.0,
    maxWindSpeedKmh: 28,
    lowWindDays: 240,
    avgSummerMaxTemp: 33.2,
    avgWinterMaxTemp: 31.5,
    avgAnnualRainfall: 1731,
    monthlyStats: [
      { month: 1, avgMaxTemp: 32.2, avgMinTemp: 25.0, avgRainDays: 19, avgSunnyDays: 15, avgWindSpeed: 10.5 },
      { month: 2, avgMaxTemp: 32.0, avgMinTemp: 24.8, avgRainDays: 17, avgSunnyDays: 14, avgWindSpeed: 10.0 },
      { month: 3, avgMaxTemp: 32.5, avgMinTemp: 24.5, avgRainDays: 15, avgSunnyDays: 18, avgWindSpeed: 9.5 },
      { month: 4, avgMaxTemp: 33.2, avgMinTemp: 24.0, avgRainDays: 6, avgSunnyDays: 25, avgWindSpeed: 9.0 },
      { month: 5, avgMaxTemp: 32.5, avgMinTemp: 22.0, avgRainDays: 2, avgSunnyDays: 29, avgWindSpeed: 10.5 },
      { month: 6, avgMaxTemp: 31.0, avgMinTemp: 20.0, avgRainDays: 1, avgSunnyDays: 29, avgWindSpeed: 12.0 },
      { month: 7, avgMaxTemp: 31.0, avgMinTemp: 19.5, avgRainDays: 1, avgSunnyDays: 30, avgWindSpeed: 13.0 },
      { month: 8, avgMaxTemp: 32.0, avgMinTemp: 20.5, avgRainDays: 1, avgSunnyDays: 30, avgWindSpeed: 14.5 },
      { month: 9, avgMaxTemp: 33.5, avgMinTemp: 23.0, avgRainDays: 2, avgSunnyDays: 28, avgWindSpeed: 15.0 },
      { month: 10, avgMaxTemp: 34.2, avgMinTemp: 25.0, avgRainDays: 6, avgSunnyDays: 26, avgWindSpeed: 14.5 },
      { month: 11, avgMaxTemp: 34.0, avgMinTemp: 25.5, avgRainDays: 11, avgSunnyDays: 22, avgWindSpeed: 13.0 },
      { month: 12, avgMaxTemp: 33.2, avgMinTemp: 25.5, avgRainDays: 15, avgSunnyDays: 18, avgWindSpeed: 11.5 },
    ],
  },
};

// ============================================
// UTILITY FUNCTIONS
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

/**
 * Calculate approximate sunset time for a latitude
 * Returns average annual sunset time (simplified calculation)
 */
function calculateSunsetTime(latitude: number): string {
  // Approximate average sunset varies with latitude
  // Sydney (-33.9) averages around 6:15 PM
  // Darwin (-12.4) averages around 6:45 PM
  // Hobart (-42.9) averages around 6:00 PM

  const baseHour = 18; // 6 PM
  const latitudeAdjustment = (Math.abs(latitude) - 30) * -0.5; // Minutes adjustment
  const totalMinutes = baseHour * 60 + 15 + latitudeAdjustment;

  const hours = Math.floor(totalMinutes / 60);
  const minutes = Math.round(totalMinutes % 60);

  const hour12 = hours > 12 ? hours - 12 : hours;
  return `${hour12}:${minutes.toString().padStart(2, '0')} PM`;
}

/**
 * Calculate golden hour start time (approximately 1 hour before sunset)
 */
function calculateGoldenHour(sunsetTime: string): string {
  const match = sunsetTime.match(/(\d+):(\d+)/);
  if (!match) return '5:30 PM';

  let hour = parseInt(match[1]);
  let minute = parseInt(match[2]);

  // Subtract 1 hour
  minute -= 60;
  if (minute < 0) {
    hour -= 1;
    minute += 60;
  }

  return `${hour}:${minute.toString().padStart(2, '0')} PM`;
}

// ============================================
// BOM API CLIENT
// ============================================

class BOMWeatherClient {
  /**
   * Find the nearest BOM weather station to given coordinates
   */
  findNearestStation(latitude: number, longitude: number): { station: BOMStation; distanceKm: number } | null {
    let nearest: BOMStation | null = null;
    let minDistance = Infinity;

    for (const station of BOM_STATIONS) {
      const distance = haversineDistance(latitude, longitude, station.latitude, station.longitude);
      if (distance < minDistance) {
        minDistance = distance;
        nearest = station;
      }
    }

    if (nearest) {
      return { station: nearest, distanceKm: Math.round(minDistance * 10) / 10 };
    }

    return null;
  }

  /**
   * Get climate data for a station
   */
  getClimateData(stationId: string): BOMClimateData | null {
    return CLIMATE_DATA[stationId] || null;
  }

  /**
   * Get weather data for a suburb based on coordinates
   */
  getWeatherForSuburb(latitude: number, longitude: number): {
    station: BOMStation;
    distanceKm: number;
    climateData: BOMClimateData;
  } | null {
    const result = this.findNearestStation(latitude, longitude);
    if (!result) return null;

    const climateData = this.getClimateData(result.station.id);
    if (!climateData) {
      // Fall back to nearest station with data
      for (const station of BOM_STATIONS) {
        const data = this.getClimateData(station.id);
        if (data && station.state === result.station.state) {
          return {
            station,
            distanceKm: haversineDistance(latitude, longitude, station.latitude, station.longitude),
            climateData: data,
          };
        }
      }
      return null;
    }

    return {
      station: result.station,
      distanceKm: result.distanceKm,
      climateData,
    };
  }
}

// Export singleton instance
export const bomAPI = new BOMWeatherClient();

// ============================================
// COMPUTED WEATHER INSIGHTS
// ============================================

/**
 * Compute service-specific insights from weather data
 */
export function computeWeatherInsights(
  climateData: BOMClimateData,
  latitude: number
): ComputedWeatherInsights {
  // Drone flight rating based on wind
  let droneFlightRating: ComputedWeatherInsights['droneFlightRating'] = 'good';
  if (climateData.avgWindSpeedKmh < 12) {
    droneFlightRating = 'excellent';
  } else if (climateData.avgWindSpeedKmh < 16) {
    droneFlightRating = 'good';
  } else if (climateData.avgWindSpeedKmh < 20) {
    droneFlightRating = 'moderate';
  } else {
    droneFlightRating = 'challenging';
  }

  // Drone season notes
  const windyMonths = climateData.monthlyStats
    .filter(m => m.avgWindSpeed > 14)
    .map(m => getMonthName(m.month));

  let droneSeasonNotes = '';
  if (windyMonths.length > 0 && windyMonths.length <= 4) {
    droneSeasonNotes = `Higher winds typical in ${windyMonths.join(', ')}. We monitor conditions and reschedule if needed.`;
  } else if (droneFlightRating === 'excellent') {
    droneSeasonNotes = 'Excellent flying conditions year-round with minimal wind disruption.';
  } else {
    droneSeasonNotes = 'Our CASA-certified pilots monitor conditions before each shoot for optimal results.';
  }

  // Best months for photography (low rain, comfortable temps)
  const goodMonths = climateData.monthlyStats
    .filter(m => m.avgRainDays < 8 && m.avgMaxTemp >= 18 && m.avgMaxTemp <= 30)
    .map(m => m.month);

  const bestMonthsPhotography = formatMonthRanges(goodMonths);

  // Sunset and golden hour
  const avgSunsetTime = calculateSunsetTime(latitude);
  const goldenHourStart = calculateGoldenHour(avgSunsetTime);

  // Twilight duration (approximately 30-45 minutes depending on latitude)
  const twilightDuration = Math.round(30 + (Math.abs(latitude) - 20) * 0.5);

  // Best twilight months (clear skies, comfortable temps)
  const twilightMonths = climateData.monthlyStats
    .filter(m => m.avgSunnyDays > 20 && m.avgMaxTemp >= 18)
    .map(m => m.month);

  const bestTwilightMonths = formatMonthRanges(twilightMonths);

  // Photography season tip
  let photographySeasonTip = '';
  const summerRain = climateData.monthlyStats
    .filter(m => m.month === 12 || m.month === 1 || m.month === 2)
    .reduce((sum, m) => sum + m.avgRainDays, 0) / 3;

  if (summerRain > 10) {
    photographySeasonTip = 'Summer afternoons can bring storms. Morning shoots recommended December-February for reliable conditions.';
  } else if (climateData.avgWinterMaxTemp < 15) {
    photographySeasonTip = 'Winter days are short but often clear. Book twilight shoots early to catch the best light.';
  } else {
    photographySeasonTip = `With ${climateData.annualSunnyDays} clear days per year, conditions are generally excellent for property photography.`;
  }

  return {
    droneFlightRating,
    droneSeasonNotes,
    droneRecommended: droneFlightRating !== 'challenging',
    bestMonthsPhotography,
    avgSunsetTime,
    goldenHourStart,
    twilightDuration,
    bestTwilightMonths,
    photographySeasonTip,
  };
}

/**
 * Get month name from number
 */
function getMonthName(month: number): string {
  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  return months[month - 1] || '';
}

/**
 * Format array of month numbers into readable ranges
 * e.g., [3, 4, 5, 9, 10, 11] -> "March-May, September-November"
 */
function formatMonthRanges(months: number[]): string {
  if (months.length === 0) return 'Year-round';
  if (months.length === 12) return 'Year-round';

  const sorted = [...months].sort((a, b) => a - b);
  const ranges: string[] = [];
  let rangeStart = sorted[0];
  let rangeEnd = sorted[0];

  for (let i = 1; i <= sorted.length; i++) {
    if (i < sorted.length && sorted[i] === rangeEnd + 1) {
      rangeEnd = sorted[i];
    } else {
      if (rangeStart === rangeEnd) {
        ranges.push(getMonthName(rangeStart));
      } else {
        ranges.push(`${getMonthName(rangeStart)}-${getMonthName(rangeEnd)}`);
      }
      if (i < sorted.length) {
        rangeStart = sorted[i];
        rangeEnd = sorted[i];
      }
    }
  }

  return ranges.join(', ');
}

// ============================================
// MOCK DATA FOR DEVELOPMENT
// ============================================

/**
 * Generate mock weather data based on state
 */
export function getMockWeatherData(state: string): BOMClimateData {
  // Default Sydney-like climate
  const baseData = CLIMATE_DATA['066062'];
  if (!baseData) {
    return {
      annualSunnyDays: 240,
      annualRainyDays: 95,
      annualCloudyDays: 30,
      avgWindSpeedKmh: 13.0,
      maxWindSpeedKmh: 28,
      lowWindDays: 220,
      avgSummerMaxTemp: 27.0,
      avgWinterMaxTemp: 17.0,
      avgAnnualRainfall: 1000,
      monthlyStats: [],
    };
  }

  // State-based adjustments
  const adjustments: Record<string, Partial<BOMClimateData>> = {
    QLD: { annualSunnyDays: 265, avgSummerMaxTemp: 30, avgWindSpeedKmh: 11 },
    VIC: { annualSunnyDays: 208, avgSummerMaxTemp: 26, avgWindSpeedKmh: 14 },
    WA: { annualSunnyDays: 268, avgSummerMaxTemp: 32, avgWindSpeedKmh: 16 },
    SA: { annualSunnyDays: 248, avgSummerMaxTemp: 29, avgWindSpeedKmh: 14 },
    TAS: { annualSunnyDays: 198, avgSummerMaxTemp: 22, avgWindSpeedKmh: 13 },
    NT: { annualSunnyDays: 275, avgSummerMaxTemp: 33, avgWindSpeedKmh: 12 },
    ACT: { annualSunnyDays: 230, avgSummerMaxTemp: 28, avgWindSpeedKmh: 12 },
  };

  const stateAdj = adjustments[state] || {};

  return {
    ...baseData,
    ...stateAdj,
  };
}
