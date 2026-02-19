import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { filterReportContent, generateFilterErrorMessage } from '@/lib/content-filter';

type BadPayerStatus = 'DRAFT' | 'PENDING_REVIEW' | 'PUBLISHED' | 'DISPUTED' | 'RESOLVED' | 'REJECTED' | 'REMOVED' | 'EXPIRED';

interface BadPayerWhereClause {
  status?: BadPayerStatus;
  isPublic?: boolean;
  OR?: Array<{
    workDescription?: { contains: string; mode: 'insensitive' };
    locationArea?: { contains: string; mode: 'insensitive' };
  }>;
  locationPostcode?: { startsWith: string };
}

// GET /api/bad-payers - List published reports (public) or all reports (admin)
export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    const { searchParams } = new URL(req.url);

    const page = Math.max(1, parseInt(searchParams.get('page') || '1'));
    const limit = Math.min(50, Math.max(1, parseInt(searchParams.get('limit') || '20')));
    const search = searchParams.get('search') || '';
    const postcode = searchParams.get('postcode') || '';
    const status = searchParams.get('status') || '';

    const isAdmin = session?.user?.role === 'ADMIN';

    // Build where clause
    const where: BadPayerWhereClause = {};

    // Public users can only see published, public reports
    if (!isAdmin) {
      where.status = 'PUBLISHED';
      where.isPublic = true;
    } else if (status) {
      where.status = status as BadPayerStatus;
    }

    if (search) {
      where.OR = [
        { workDescription: { contains: search, mode: 'insensitive' } },
        { locationArea: { contains: search, mode: 'insensitive' } },
      ];
    }

    if (postcode) {
      where.locationPostcode = { startsWith: postcode.toUpperCase().slice(0, 4) };
    }

    const [reports, total] = await Promise.all([
      prisma.badPayerReport.findMany({
        where,
        include: {
          reporter: {
            select: {
              businessName: true,
              slug: true,
              isVerified: true,
            },
          },
          _count: {
            select: {
              evidence: true,
              disputes: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.badPayerReport.count({ where }),
    ]);

    return NextResponse.json({
      reports,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Error fetching bad payer reports:', error);
    return NextResponse.json(
      { error: 'Failed to fetch reports' },
      { status: 500 }
    );
  }
}

// POST /api/bad-payers - Create new report
export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'You must be logged in to submit a report' },
        { status: 401 }
      );
    }

    // Get tradesperson profile
    const profile = await prisma.tradesProfile.findUnique({
      where: { userId: session.user.id },
    });

    if (!profile) {
      return NextResponse.json(
        { error: 'Only registered tradespeople can submit reports' },
        { status: 403 }
      );
    }

    const body = await req.json();

    const {
      incidentDate,
      workDescription,
      agreedAmount,
      amountOwed,
      paymentTerms,
      locationArea,
      locationPostcode,
      invoiceReference,
      contractReference,
      communicationSummary,
      legalConsentGiven,
      truthDeclaration,
    } = body;

    // Validate required fields
    if (!incidentDate || !workDescription || !agreedAmount || !amountOwed || !locationArea) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    if (!legalConsentGiven || !truthDeclaration) {
      return NextResponse.json(
        { error: 'You must agree to the legal terms and confirm the information is true' },
        { status: 400 }
      );
    }

    if (workDescription.length < 50) {
      return NextResponse.json(
        { error: 'Work description must be at least 50 characters' },
        { status: 400 }
      );
    }

    // Content filter - check for PII
    const filterResult = filterReportContent({
      workDescription,
      locationArea,
      communicationSummary,
    });

    if (!filterResult.isValid) {
      return NextResponse.json(
        { error: generateFilterErrorMessage(filterResult.issues), issues: filterResult.issues },
        { status: 400 }
      );
    }

    // Set expiry date (2 years from now)
    const expiresAt = new Date();
    expiresAt.setFullYear(expiresAt.getFullYear() + 2);

    // Create report
    const report = await prisma.badPayerReport.create({
      data: {
        reporterId: profile.id,
        incidentDate: new Date(incidentDate),
        workDescription: workDescription.trim(),
        agreedAmount: parseFloat(agreedAmount),
        amountOwed: parseFloat(amountOwed),
        paymentTerms: paymentTerms?.trim() || null,
        locationArea: locationArea.trim(),
        locationPostcode: locationPostcode?.toUpperCase().slice(0, 4) || null,
        invoiceReference: invoiceReference?.trim() || null,
        contractReference: contractReference?.trim() || null,
        communicationSummary: communicationSummary?.trim() || null,
        legalConsentGiven: true,
        legalConsentTimestamp: new Date(),
        truthDeclaration: true,
        status: 'PENDING_REVIEW',
        expiresAt,
      },
    });

    return NextResponse.json({ report }, { status: 201 });
  } catch (error) {
    console.error('Error creating bad payer report:', error);
    return NextResponse.json(
      { error: 'Failed to create report' },
      { status: 500 }
    );
  }
}
