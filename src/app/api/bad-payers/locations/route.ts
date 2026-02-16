import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET /api/bad-payers/locations - Get report locations for map
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const postcode = searchParams.get('postcode') || '';
    const minAmount = parseFloat(searchParams.get('minAmount') || '0');
    const maxAmount = parseFloat(searchParams.get('maxAmount') || '999999');

    const where: any = {
      status: 'PUBLISHED',
      isPublic: true,
      latitude: { not: null },
      longitude: { not: null },
    };

    if (postcode) {
      where.locationPostcode = { startsWith: postcode.toUpperCase().slice(0, 4) };
    }

    if (minAmount > 0) {
      where.amountOwed = { gte: minAmount };
    }

    if (maxAmount < 999999) {
      where.amountOwed = { ...where.amountOwed, lte: maxAmount };
    }

    const reports = await prisma.badPayerReport.findMany({
      where,
      select: {
        id: true,
        latitude: true,
        longitude: true,
        locationArea: true,
        locationPostcode: true,
        amountOwed: true,
        createdAt: true,
        reporter: {
          select: {
            businessName: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
      take: 500, // Limit for performance
    });

    // Format for map display (anonymize slightly)
    const locations = reports.map((report) => ({
      id: report.id,
      lat: report.latitude,
      lng: report.longitude,
      area: report.locationArea,
      postcode: report.locationPostcode,
      amount: report.amountOwed,
      date: report.createdAt,
      reporter: report.reporter.businessName,
    }));

    return NextResponse.json({ locations });
  } catch (error) {
    console.error('Error fetching report locations:', error);
    return NextResponse.json(
      { error: 'Failed to fetch locations' },
      { status: 500 }
    );
  }
}
