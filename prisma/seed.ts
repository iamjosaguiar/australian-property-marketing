import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Starting database seed...');

  // Seed States
  console.log('Seeding states...');
  const nsw = await prisma.state.upsert({
    where: { code: 'NSW' },
    update: {},
    create: {
      name: 'New South Wales',
      slug: 'nsw',
      code: 'NSW',
      active: true,
    },
  });

  const vic = await prisma.state.upsert({
    where: { code: 'VIC' },
    update: {},
    create: {
      name: 'Victoria',
      slug: 'vic',
      code: 'VIC',
      active: true,
    },
  });

  const qld = await prisma.state.upsert({
    where: { code: 'QLD' },
    update: {},
    create: {
      name: 'Queensland',
      slug: 'qld',
      code: 'QLD',
      active: true,
    },
  });

  // Seed Cities
  console.log('Seeding cities...');
  const sydney = await prisma.city.upsert({
    where: { id: 1 },
    update: {},
    create: {
      name: 'Sydney',
      slug: 'sydney',
      stateId: nsw.id,
      active: true,
    },
  });

  const melbourne = await prisma.city.upsert({
    where: { id: 2 },
    update: {},
    create: {
      name: 'Melbourne',
      slug: 'melbourne',
      stateId: vic.id,
      active: true,
    },
  });

  const brisbane = await prisma.city.upsert({
    where: { id: 3 },
    update: {},
    create: {
      name: 'Brisbane',
      slug: 'brisbane',
      stateId: qld.id,
      active: true,
    },
  });

  // Seed Sample Suburbs
  console.log('Seeding suburbs...');

  const bondi = await prisma.suburb.upsert({
    where: { slug: 'bondi' },
    update: {},
    create: {
      name: 'Bondi',
      slug: 'bondi',
      state: 'NSW',
      stateSlug: 'nsw',
      stateFull: 'New South Wales',
      postcode: '2026',
      city: 'Sydney',
      citySlug: 'sydney',
      lga: 'Waverley',
      region: 'Eastern Suburbs',
      latitude: -33.8915,
      longitude: 151.2767,
      medianPrice: 2850000,
      medianPriceFormatted: '2,850,000',
      propertiesSoldQtd: 45,
      daysOnMarket: 28,
      yoyGrowth: 8.5,
      statsUpdated: new Date('2024-01-01'),
      description: `Bondi is one of Sydney's most iconic beachside suburbs, famous for its stunning beach and vibrant café culture. The area attracts a mix of young professionals, families, and international visitors, creating a dynamic property market with strong demand for quality listings.

The suburb offers a lifestyle that blends coastal living with urban convenience, just 7km from the Sydney CBD. Properties here range from art deco apartments to contemporary beachfront residences, all commanding premium prices due to the location's desirability.`,
      landmarks: 'Bondi Beach, Bondi Icebergs, Campbell Parade cafes, Bondi to Bronte coastal walk',
      propertyTypes: 'Art deco apartments, modern units, beachfront houses, townhouses',
      primaryPropertyType: 'Apartment',
      basePrice: 350,
      premiumPrice: 550,
      prestigePrice: 1100,
      twilightPrice: 150,
      dronePrice: 150,
      stagingPrice: 48,
      travelFee: 0,
      nearestPhotographerKm: 2.5,
      sameDayAvailable: 'Yes',
      agentCount: 42,
      active: true,
      priority: 10,
    },
  });

  const paddington = await prisma.suburb.upsert({
    where: { slug: 'paddington' },
    update: {},
    create: {
      name: 'Paddington',
      slug: 'paddington',
      state: 'NSW',
      stateSlug: 'nsw',
      stateFull: 'New South Wales',
      postcode: '2021',
      city: 'Sydney',
      citySlug: 'sydney',
      lga: 'City of Sydney',
      region: 'Inner East',
      latitude: -33.8847,
      longitude: 151.2265,
      medianPrice: 2450000,
      medianPriceFormatted: '2,450,000',
      propertiesSoldQtd: 32,
      daysOnMarket: 25,
      yoyGrowth: 6.2,
      statsUpdated: new Date('2024-01-01'),
      description: `Paddington is a prestigious inner-eastern suburb renowned for its beautiful Victorian terrace houses and tree-lined streets. The area has a strong artistic heritage with numerous galleries along Oxford Street and the famous Paddington Markets.

The suburb attracts affluent professionals and families who appreciate its heritage architecture, village atmosphere, and proximity to the CBD. Properties here are highly sought-after, with renovated terraces commanding premium prices.`,
      landmarks: 'Paddington Markets, Victoria Barracks, Oxford Street galleries, Five Ways shopping village',
      propertyTypes: 'Victorian terraces, heritage cottages, converted warehouses',
      primaryPropertyType: 'House',
      basePrice: 350,
      premiumPrice: 550,
      prestigePrice: 1100,
      twilightPrice: 150,
      dronePrice: 150,
      stagingPrice: 48,
      travelFee: 0,
      nearestPhotographerKm: 3.2,
      sameDayAvailable: 'Yes',
      agentCount: 38,
      active: true,
      priority: 9,
    },
  });

  const surryHills = await prisma.suburb.upsert({
    where: { slug: 'surry-hills' },
    update: {},
    create: {
      name: 'Surry Hills',
      slug: 'surry-hills',
      state: 'NSW',
      stateSlug: 'nsw',
      stateFull: 'New South Wales',
      postcode: '2010',
      city: 'Sydney',
      citySlug: 'sydney',
      lga: 'City of Sydney',
      region: 'Inner City',
      latitude: -33.8830,
      longitude: 151.2130,
      medianPrice: 1650000,
      medianPriceFormatted: '1,650,000',
      propertiesSoldQtd: 58,
      daysOnMarket: 22,
      yoyGrowth: 7.8,
      statsUpdated: new Date('2024-01-01'),
      description: `Surry Hills is a trendy inner-city suburb known for its eclectic mix of Victorian terraces, converted warehouses, and modern apartments. The area has transformed from a working-class neighborhood to one of Sydney's most desirable postcodes, popular with creative professionals and young couples.

The suburb boasts an impressive food and bar scene, with Crown Street and Bourke Street lined with award-winning restaurants, craft breweries, and specialty coffee shops.`,
      landmarks: 'Crown Street dining precinct, Bourke Street cafes, Shannon Reserve, Brett Whiteley Studio',
      propertyTypes: 'Victorian terraces, warehouse conversions, modern apartments, heritage workers cottages',
      primaryPropertyType: 'Apartment',
      basePrice: 320,
      premiumPrice: 520,
      prestigePrice: 950,
      twilightPrice: 150,
      dronePrice: 150,
      stagingPrice: 48,
      travelFee: 0,
      nearestPhotographerKm: 1.8,
      sameDayAvailable: 'Yes',
      agentCount: 51,
      active: true,
      priority: 10,
    },
  });

  // Seed Services
  console.log('Seeding services...');
  await prisma.service.createMany({
    data: [
      {
        name: 'Real Estate Photography',
        slug: 'real-estate-photography',
        description: 'Professional property photography that sells homes faster.',
        shortDescription: 'Professional property photos from $295',
        basePrice: 295,
        displayOrder: 1,
        active: true,
      },
      {
        name: 'Property Video',
        slug: 'property-video',
        description: 'Cinematic property videos that engage buyers.',
        shortDescription: 'Property videos from $350',
        basePrice: 350,
        displayOrder: 2,
        active: true,
      },
      {
        name: 'Drone Photography',
        slug: 'drone-photography',
        description: 'CASA-certified aerial photography and video.',
        shortDescription: 'Aerial photos from $150',
        basePrice: 150,
        displayOrder: 3,
        active: true,
      },
      {
        name: 'Virtual Staging',
        slug: 'virtual-staging',
        description: 'Digital furniture staging for vacant properties.',
        shortDescription: 'Virtual staging from $48/room',
        basePrice: 48,
        displayOrder: 4,
        active: true,
      },
    ],
    skipDuplicates: true,
  });

  // Calculate nearby suburbs
  console.log('Calculating nearby suburbs...');
  await prisma.nearbySuburb.createMany({
    data: [
      { suburbId: bondi.id, nearbySuburbId: paddington.id, distanceKm: 4.2 },
      { suburbId: bondi.id, nearbySuburbId: surryHills.id, distanceKm: 5.8 },
      { suburbId: paddington.id, nearbySuburbId: bondi.id, distanceKm: 4.2 },
      { suburbId: paddington.id, nearbySuburbId: surryHills.id, distanceKm: 2.1 },
      { suburbId: surryHills.id, nearbySuburbId: paddington.id, distanceKm: 2.1 },
      { suburbId: surryHills.id, nearbySuburbId: bondi.id, distanceKm: 5.8 },
    ],
    skipDuplicates: true,
  });

  console.log('Database seed completed successfully!');
}

main()
  .catch((e) => {
    console.error('Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
