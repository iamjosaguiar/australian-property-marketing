import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const {
      name,
      email,
      phone,
      company,
      message,
      suburbSlug,
      serviceSlug,
      landingPage,
      utmSource,
      utmMedium,
      utmCampaign,
    } = body;

    // Validate required fields
    if (!email && !phone) {
      return NextResponse.json(
        { error: 'Either email or phone is required' },
        { status: 400 }
      );
    }

    // Find suburb and service IDs if provided
    let suburbId = null;
    let serviceId = null;

    if (suburbSlug) {
      const suburb = await prisma.suburb.findUnique({
        where: { slug: suburbSlug },
        select: { id: true },
      });
      suburbId = suburb?.id || null;
    }

    if (serviceSlug) {
      const service = await prisma.service.findUnique({
        where: { slug: serviceSlug },
        select: { id: true },
      });
      serviceId = service?.id || null;
    }

    // Create lead
    const lead = await prisma.lead.create({
      data: {
        name,
        email,
        phone,
        company,
        message,
        suburbId,
        serviceId,
        landingPage,
        utmSource,
        utmMedium,
        utmCampaign,
        status: 'New',
      },
    });

    return NextResponse.json(
      {
        success: true,
        leadId: lead.id,
        message: 'Lead submitted successfully',
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating lead:', error);
    return NextResponse.json(
      { error: 'Failed to submit lead' },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json(
    { message: 'Use POST to submit a lead' },
    { status: 405 }
  );
}
