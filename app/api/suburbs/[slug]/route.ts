import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const suburb = await prisma.suburb.findUnique({
      where: {
        slug: params.slug,
        active: true,
      },
      include: {
        portfolioImages: {
          where: { featured: true },
          take: 12,
        },
        localAgencies: {
          take: 12,
        },
        testimonials: {
          where: { featured: true },
          take: 6,
        },
        nearbySuburbsFrom: {
          take: 8,
          orderBy: { distanceKm: 'asc' },
          include: {
            nearbySuburb: {
              select: {
                id: true,
                name: true,
                slug: true,
                state: true,
                stateSlug: true,
                basePrice: true,
              },
            },
          },
        },
      },
    });

    if (!suburb) {
      return NextResponse.json(
        { error: 'Suburb not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ suburb });
  } catch (error) {
    console.error('Error fetching suburb:', error);
    return NextResponse.json(
      { error: 'Failed to fetch suburb' },
      { status: 500 }
    );
  }
}
