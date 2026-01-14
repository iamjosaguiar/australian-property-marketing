import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const query = searchParams.get('q');
    const state = searchParams.get('state');
    const limit = parseInt(searchParams.get('limit') || '50');

    const where: any = {
      active: true,
    };

    // Search by name if query provided
    if (query) {
      where.name = {
        contains: query,
        mode: 'insensitive',
      };
    }

    // Filter by state if provided
    if (state) {
      where.state = state.toUpperCase();
    }

    const suburbs = await prisma.suburb.findMany({
      where,
      select: {
        id: true,
        name: true,
        slug: true,
        state: true,
        stateSlug: true,
        stateFull: true,
        postcode: true,
        city: true,
        basePrice: true,
        premiumPrice: true,
        prestigePrice: true,
        medianPrice: true,
        medianPriceFormatted: true,
      },
      orderBy: [
        { priority: 'desc' },
        { name: 'asc' },
      ],
      take: limit,
    });

    return NextResponse.json({
      suburbs,
      count: suburbs.length,
    });
  } catch (error) {
    console.error('Error fetching suburbs:', error);
    return NextResponse.json(
      { error: 'Failed to fetch suburbs' },
      { status: 500 }
    );
  }
}
