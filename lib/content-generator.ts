/**
 * Content Generator Utilities
 *
 * Generates dynamic, service-specific content for suburb pages
 * based on Census and BOM data. Each function produces unique
 * copy that links data insights to the relevant service.
 */

// ============================================
// TYPES
// ============================================

export interface SuburbContentData {
  name: string;
  state: string;
  stateFull: string;

  // Census data
  primaryDwellingType?: string | null;
  dwellingTypeRatio?: string | null;
  avgBedrooms?: number | null;
  ownerPercentage?: number | null;
  renterPercentage?: number | null;
  tenureProfile?: string | null;
  medianWeeklyIncome?: number | null;
  medianAnnualIncome?: number | null;
  incomeQuartile?: string | null;
  incomeDescription?: string | null;
  population?: number | null;
  medianAge?: number | null;

  // Weather data
  annualSunnyDays?: number | null;
  lowWindDays?: number | null;
  droneFlightRating?: string | null;
  droneSeasonNotes?: string | null;
  bestMonthsPhotography?: string | null;
  avgSunsetTime?: string | null;
  goldenHourStart?: string | null;
  twilightDuration?: number | null;
  bestTwilightMonths?: string | null;
  photographySeasonTip?: string | null;

  // Floor plans
  floorPlanComplexity?: string | null;
  typicalLayoutNotes?: string | null;

  // Staging
  stagingTargetAudience?: string | null;
  stagingStyleHint?: string | null;

  // Market data
  medianPrice?: number | null;
  medianPriceFormatted?: string | null;
}

export interface GeneratedContent {
  heading: string;
  body: string;
  highlights?: string[];
}

// ============================================
// REAL ESTATE PHOTOGRAPHY CONTENT
// ============================================

/**
 * Generate photography-specific content for suburb page
 */
export function generatePhotographyCopy(suburb: SuburbContentData): GeneratedContent {
  const { name, primaryDwellingType, avgBedrooms, incomeQuartile, medianPriceFormatted } = suburb;

  // Build dynamic heading
  let heading = `Professional Real Estate Photography in ${name}`;

  // Build body based on available data
  const bodyParts: string[] = [];

  if (medianPriceFormatted && incomeQuartile) {
    const marketDesc = incomeQuartile === 'high'
      ? `premium ${name} market (median ${medianPriceFormatted})`
      : incomeQuartile === 'upper-middle'
      ? `established ${name} market (median ${medianPriceFormatted})`
      : `active ${name} market`;

    bodyParts.push(`In the ${marketDesc}, professional photography is essential for standing out.`);
  }

  if (primaryDwellingType && avgBedrooms) {
    const propertyDesc = primaryDwellingType === 'house'
      ? `${name}'s ${Math.round(avgBedrooms)}-bedroom houses typically feature multiple living areas and outdoor spaces`
      : primaryDwellingType === 'unit'
      ? `${name}'s apartment market demands high-quality imagery to showcase efficient layouts`
      : `${name}'s diverse property mix requires versatile photography techniques`;

    bodyParts.push(`${propertyDesc} that our photographers know how to capture beautifully.`);
  }

  if (suburb.annualSunnyDays) {
    bodyParts.push(`With ${suburb.annualSunnyDays} clear days per year, ${name} offers excellent conditions for property photography.`);
  }

  // Build highlights
  const highlights: string[] = [];
  if (suburb.annualSunnyDays && suburb.annualSunnyDays > 240) {
    highlights.push(`${suburb.annualSunnyDays} sunny days annually`);
  }
  if (suburb.photographySeasonTip) {
    highlights.push(suburb.photographySeasonTip);
  }
  if (incomeQuartile === 'high') {
    highlights.push('Prestige package popular in this area');
  }

  return {
    heading,
    body: bodyParts.join(' ') || `Professional photography services for ${name} properties.`,
    highlights: highlights.length > 0 ? highlights : undefined,
  };
}

/**
 * Generate market insights section for photography page
 */
export function generateMarketInsights(suburb: SuburbContentData): GeneratedContent | null {
  if (!suburb.medianAnnualIncome && !suburb.ownerPercentage) {
    return null;
  }

  const stats: string[] = [];

  if (suburb.medianPriceFormatted) {
    stats.push(`Median house price: ${suburb.medianPriceFormatted}`);
  }

  if (suburb.medianAnnualIncome) {
    const incomeK = Math.round(suburb.medianAnnualIncome / 1000);
    stats.push(`Median household income: $${incomeK}K`);
  }

  if (suburb.ownerPercentage) {
    stats.push(`Owner occupiers: ${suburb.ownerPercentage.toFixed(0)}%`);
  }

  let insight = '';
  if (suburb.incomeQuartile === 'high') {
    insight = `${suburb.name} is an affluent area where buyers expect premium marketing. Our Prestige package is popular here.`;
  } else if (suburb.incomeQuartile === 'upper-middle') {
    insight = `${suburb.name}'s established market values quality presentation. Most clients choose our Premium package.`;
  }

  return {
    heading: `${suburb.name} Market Insights`,
    body: insight || `Key market statistics for ${suburb.name} properties.`,
    highlights: stats,
  };
}

// ============================================
// DRONE PHOTOGRAPHY CONTENT
// ============================================

/**
 * Generate drone-specific content for suburb page
 */
export function generateDroneCopy(suburb: SuburbContentData): GeneratedContent {
  const { name, droneFlightRating, lowWindDays, annualSunnyDays, droneSeasonNotes } = suburb;

  let heading = `Drone Photography in ${name}`;

  const bodyParts: string[] = [];

  if (droneFlightRating && lowWindDays) {
    const ratingDesc = {
      'excellent': 'excellent',
      'good': 'very good',
      'moderate': 'suitable',
      'challenging': 'variable',
    }[droneFlightRating] || 'suitable';

    bodyParts.push(`${name} has ${ratingDesc} drone flying conditions with ${lowWindDays} low-wind days per year.`);
  }

  if (annualSunnyDays) {
    bodyParts.push(`${annualSunnyDays} annual sunny days mean crisp, well-lit aerial footage for your ${name} listing.`);
  }

  if (droneSeasonNotes) {
    bodyParts.push(droneSeasonNotes);
  }

  // Highlights based on rating
  const highlights: string[] = [];
  if (droneFlightRating === 'excellent') {
    highlights.push('Excellent conditions year-round');
  }
  if (lowWindDays && lowWindDays > 250) {
    highlights.push(`${lowWindDays} optimal flying days per year`);
  }
  highlights.push('CASA-certified pilots');
  highlights.push('Free rescheduling if conditions unsuitable');

  return {
    heading,
    body: bodyParts.join(' ') || `Professional drone photography services for ${name} properties.`,
    highlights,
  };
}

/**
 * Generate drone conditions widget data
 */
export function generateDroneConditionsData(suburb: SuburbContentData): {
  rating: string;
  ratingClass: string;
  stats: { label: string; value: string }[];
  tip?: string;
} | null {
  if (!suburb.droneFlightRating) return null;

  const ratingClasses: Record<string, string> = {
    'excellent': 'bg-green-100 text-green-800',
    'good': 'bg-blue-100 text-blue-800',
    'moderate': 'bg-yellow-100 text-yellow-800',
    'challenging': 'bg-red-100 text-red-800',
  };

  const stats: { label: string; value: string }[] = [];

  if (suburb.lowWindDays) {
    stats.push({ label: 'Low Wind Days/Year', value: suburb.lowWindDays.toString() });
  }

  if (suburb.annualSunnyDays) {
    stats.push({ label: 'Clear Sky Days', value: suburb.annualSunnyDays.toString() });
  }

  return {
    rating: suburb.droneFlightRating.toUpperCase(),
    ratingClass: ratingClasses[suburb.droneFlightRating] || 'bg-gray-100 text-gray-800',
    stats,
    tip: suburb.droneSeasonNotes || undefined,
  };
}

// ============================================
// FLOOR PLANS CONTENT
// ============================================

/**
 * Generate floor plan-specific content for suburb page
 */
export function generateFloorPlanCopy(suburb: SuburbContentData): GeneratedContent {
  const { name, primaryDwellingType, avgBedrooms, floorPlanComplexity, dwellingTypeRatio } = suburb;

  let heading = `Floor Plans for ${name} Properties`;

  const bodyParts: string[] = [];

  if (dwellingTypeRatio) {
    bodyParts.push(`${name} features ${dwellingTypeRatio}.`);
  }

  if (primaryDwellingType && avgBedrooms) {
    if (primaryDwellingType === 'house') {
      bodyParts.push(`${name}'s detached houses (average ${avgBedrooms.toFixed(1)} bedrooms) often feature outdoor areas and multiple living zones that benefit from detailed floor plans.`);
    } else if (primaryDwellingType === 'unit') {
      bodyParts.push(`${name}'s apartment market requires accurate floor plans to help buyers compare layouts and living efficiency.`);
    } else if (primaryDwellingType === 'townhouse') {
      bodyParts.push(`${name}'s townhouses typically have multi-level layouts where 3D floor plans help visualize the flow between floors.`);
    }
  }

  // Package recommendation based on complexity
  const highlights: string[] = [];
  if (floorPlanComplexity === 'complex' && avgBedrooms && avgBedrooms >= 4) {
    highlights.push(`${avgBedrooms.toFixed(0)}+ bedroom layouts benefit from 3D visualization`);
    highlights.push('3D Bundle recommended for complex properties');
  } else if (primaryDwellingType === 'unit') {
    highlights.push('Essential for apartment comparisons');
    highlights.push('2D plans show exact dimensions');
  }

  if (suburb.typicalLayoutNotes) {
    bodyParts.push(suburb.typicalLayoutNotes);
  }

  return {
    heading,
    body: bodyParts.join(' ') || `Professional floor plan services for ${name} properties.`,
    highlights: highlights.length > 0 ? highlights : undefined,
  };
}

/**
 * Generate floor plan recommendation based on property data
 */
export function generateFloorPlanRecommendation(suburb: SuburbContentData): string | null {
  const { name, primaryDwellingType, avgBedrooms, floorPlanComplexity } = suburb;

  if (!primaryDwellingType) return null;

  if (floorPlanComplexity === 'complex' || (avgBedrooms && avgBedrooms >= 4)) {
    return `${name} properties typically have ${floorPlanComplexity || 'complex'} layouts${avgBedrooms ? ` (average ${avgBedrooms.toFixed(1)} bedrooms)` : ''}, often multi-level. Our 3D Bundle helps buyers visualize these spaces effectively.`;
  }

  if (primaryDwellingType === 'unit') {
    return `For ${name} apartments, floor plans are essential to show room proportions and layout efficiency. Our 2D plans start at $95.`;
  }

  return null;
}

// ============================================
// VIRTUAL STAGING CONTENT
// ============================================

/**
 * Generate virtual staging-specific content for suburb page
 */
export function generateVirtualStagingCopy(suburb: SuburbContentData): GeneratedContent {
  const { name, ownerPercentage, renterPercentage, stagingTargetAudience, incomeQuartile, stagingStyleHint } = suburb;

  let heading = `Virtual Staging for ${name}`;

  const bodyParts: string[] = [];

  if (renterPercentage && ownerPercentage) {
    const tenureDesc = renterPercentage > 50
      ? `investor-focused market (${renterPercentage.toFixed(0)}% rental properties)`
      : `owner-occupier market (${ownerPercentage.toFixed(0)}% owner-occupied)`;

    bodyParts.push(`${name} has an ${tenureDesc}.`);
  }

  // Style recommendations
  const highlights: string[] = [];

  if (stagingTargetAudience === 'investors') {
    bodyParts.push('Virtual staging helps investors visualize tenant-ready presentation and rental potential.');
    highlights.push('Contemporary, minimalist styles popular');
    highlights.push('Neutral tones appeal to broad tenant demographics');
  } else if (stagingTargetAudience === 'owner-occupiers') {
    bodyParts.push('Virtual staging helps families visualize living spaces and creates emotional connection with the home.');
    highlights.push('Warm, family-friendly designs recommended');
    highlights.push('Quality furnishings match buyer expectations');
  }

  if (incomeQuartile === 'high') {
    highlights.push('Luxury furniture collection recommended');
  }

  if (stagingStyleHint) {
    const styleMap: Record<string, string> = {
      'luxury-contemporary': 'Luxury Contemporary',
      'modern-minimalist': 'Modern Minimalist',
      'warm-family-friendly': 'Warm Family-Friendly',
      'contemporary-neutral': 'Contemporary Neutral',
    };
    highlights.push(`Popular style: ${styleMap[stagingStyleHint] || stagingStyleHint}`);
  }

  return {
    heading,
    body: bodyParts.join(' ') || `Virtual staging services for ${name} properties.`,
    highlights: highlights.length > 0 ? highlights : undefined,
  };
}

/**
 * Generate staging room recommendation based on property data
 */
export function generateStagingRecommendation(suburb: SuburbContentData): string | null {
  const { name, avgBedrooms, stagingTargetAudience } = suburb;

  if (!avgBedrooms) return null;

  const packageRec = avgBedrooms >= 4 ? '5 Room Package' :
                     avgBedrooms >= 3 ? '3 Room Package' : 'Single Room';

  const rooms = avgBedrooms >= 4 ? 'living room, master bedroom, and additional living spaces' :
                avgBedrooms >= 3 ? 'living room, master bedroom, and dining area' : 'key living area';

  let audience = '';
  if (stagingTargetAudience === 'investors') {
    audience = 'This appeals to investors looking for tenant-ready presentation.';
  } else if (stagingTargetAudience === 'owner-occupiers') {
    audience = 'This helps families visualize themselves in the space.';
  }

  return `${name} properties average ${avgBedrooms.toFixed(1)} bedrooms. Our most popular package here is the ${packageRec} covering ${rooms}. ${audience}`;
}

// ============================================
// PROPERTY VIDEO CONTENT
// ============================================

/**
 * Generate video-specific content for suburb page
 */
export function generateVideoCopy(suburb: SuburbContentData): GeneratedContent {
  const { name, annualSunnyDays, goldenHourStart, twilightDuration, bestTwilightMonths } = suburb;

  let heading = `Property Video in ${name}`;

  const bodyParts: string[] = [];

  if (annualSunnyDays) {
    bodyParts.push(`${name} enjoys ${annualSunnyDays} clear days per year, providing excellent conditions for property video production.`);
  }

  if (goldenHourStart && twilightDuration) {
    bodyParts.push(`Golden hour begins around ${goldenHourStart}, with approximately ${twilightDuration} minutes of beautiful twilight filming opportunity.`);
  }

  const highlights: string[] = [];

  if (bestTwilightMonths) {
    highlights.push(`Best for twilight video: ${bestTwilightMonths}`);
  }

  if (suburb.primaryDwellingType === 'house' && suburb.avgBedrooms && suburb.avgBedrooms >= 4) {
    highlights.push('Premium Video package recommended for larger homes');
  }

  if (suburb.medianPrice && suburb.medianPrice > 2000000) {
    highlights.push('Luxury package with cinematic drone footage');
  }

  return {
    heading,
    body: bodyParts.join(' ') || `Professional property video services for ${name}.`,
    highlights: highlights.length > 0 ? highlights : undefined,
  };
}

/**
 * Generate video package recommendation
 */
export function generateVideoRecommendation(suburb: SuburbContentData): string | null {
  const { name, primaryDwellingType, avgBedrooms, medianPrice, medianPriceFormatted } = suburb;

  if (medianPrice && medianPrice > 2000000) {
    return `With a median price of ${medianPriceFormatted}, ${name} listings warrant premium video production. Our Luxury package includes cinematic drone footage and professional voice-over to match buyer expectations.`;
  }

  if (primaryDwellingType === 'house' && avgBedrooms && avgBedrooms >= 4) {
    return `${name}'s larger family homes (${avgBedrooms.toFixed(1)} average bedrooms) benefit from our Premium Video package with extended runtime to showcase all living areas, outdoor spaces, and neighborhood context.`;
  }

  return null;
}

// ============================================
// FAQ GENERATION
// ============================================

export interface FAQ {
  question: string;
  answer: string;
}

/**
 * Generate service-specific FAQs based on suburb data
 */
export function generateServiceFAQs(
  service: 'photography' | 'drone' | 'video' | 'floorplans' | 'staging',
  suburb: SuburbContentData
): FAQ[] {
  const faqs: FAQ[] = [];

  if (service === 'drone') {
    if (suburb.droneFlightRating && suburb.lowWindDays) {
      faqs.push({
        question: `What are the typical drone flying conditions in ${suburb.name}?`,
        answer: `${suburb.name} has ${suburb.droneFlightRating} drone flying conditions with ${suburb.lowWindDays} low-wind days per year. ${suburb.droneSeasonNotes || 'Our pilots monitor weather and will reschedule if conditions are unsuitable.'}`,
      });
    }

    if (suburb.droneFlightRating === 'challenging' || suburb.droneFlightRating === 'moderate') {
      faqs.push({
        question: `Is drone photography worth it in ${suburb.name} given the wind conditions?`,
        answer: `While ${suburb.name} can experience higher winds at times, we still recommend drone photography for properties with pools, large gardens, or waterfront positions. We schedule shoots during optimal windows and our flexible booking policy means free rescheduling if needed.`,
      });
    }
  }

  if (service === 'staging') {
    if (suburb.renterPercentage && suburb.renterPercentage > 50) {
      faqs.push({
        question: `Which staging style works best for ${suburb.name}'s investor market?`,
        answer: `With ${suburb.renterPercentage.toFixed(0)}% of ${suburb.name} properties rented, we recommend contemporary neutral styling that appeals to both investors and potential tenants. Clean lines and quality furnishings photograph well and suggest easy-to-maintain living.`,
      });
    }

    if (suburb.incomeQuartile === 'high') {
      faqs.push({
        question: `Do you offer luxury staging for high-end ${suburb.name} properties?`,
        answer: `Absolutely. ${suburb.name}'s affluent market${suburb.medianAnnualIncome ? ` (median income $${Math.round(suburb.medianAnnualIncome / 1000)}K annually)` : ''} expects premium presentation. Our Luxury collection features designer furniture, art, and accessories that match the caliber of ${suburb.name} properties.`,
      });
    }

    if (suburb.avgBedrooms) {
      faqs.push({
        question: `How many rooms should I stage in ${suburb.name}?`,
        answer: `${suburb.name} properties average ${suburb.avgBedrooms.toFixed(1)} bedrooms. We recommend staging at least the living room and master bedroom. For properties with ${suburb.avgBedrooms >= 3 ? '3+ bedrooms, our 3 or 5 Room Package provides best value' : 'up to 2 bedrooms, our Single Room package is usually sufficient'}.`,
      });
    }
  }

  if (service === 'floorplans') {
    if (suburb.primaryDwellingType) {
      const typeQuestion = suburb.primaryDwellingType === 'unit'
        ? `Are floor plans really necessary for apartments in ${suburb.name}?`
        : `What type of floor plan works best for ${suburb.name} houses?`;

      const typeAnswer = suburb.primaryDwellingType === 'unit'
        ? `Floor plans are essential for ${suburb.name} apartments. Buyers compare multiple units and floor plans show exact dimensions, room proportions, and layout efficiency that photos can't convey.`
        : `For ${suburb.name}'s houses${suburb.avgBedrooms ? ` (averaging ${suburb.avgBedrooms.toFixed(1)} bedrooms)` : ''}, we recommend our 3D floor plans. They help buyers visualize room sizes and flow, especially for larger or multi-level properties.`;

      faqs.push({ question: typeQuestion, answer: typeAnswer });
    }
  }

  if (service === 'photography' || service === 'video') {
    if (suburb.bestMonthsPhotography) {
      faqs.push({
        question: `When is the best time to photograph properties in ${suburb.name}?`,
        answer: `${suburb.name} has excellent conditions for photography during ${suburb.bestMonthsPhotography}. ${suburb.photographySeasonTip || 'We can shoot year-round but these months typically offer the best natural light.'}`,
      });
    }

    if (suburb.avgSunsetTime && suburb.goldenHourStart) {
      faqs.push({
        question: `When should I book twilight photography in ${suburb.name}?`,
        answer: `In ${suburb.name}, golden hour typically begins around ${suburb.goldenHourStart} with sunset around ${suburb.avgSunsetTime}. This gives approximately ${suburb.twilightDuration || 30} minutes of ideal twilight shooting conditions. ${suburb.bestTwilightMonths ? `Best months for twilight: ${suburb.bestTwilightMonths}.` : ''}`,
      });
    }
  }

  return faqs;
}
