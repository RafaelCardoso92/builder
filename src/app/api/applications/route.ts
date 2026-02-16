import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// GET /api/applications - List tradesperson's own applications
export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Get tradesperson profile
    const profile = await prisma.tradesProfile.findUnique({
      where: { userId: session.user.id },
    });

    if (!profile) {
      return NextResponse.json(
        { error: 'Only tradespeople can view applications' },
        { status: 403 }
      );
    }

    const { searchParams } = new URL(req.url);
    const status = searchParams.get('status');

    const where: any = { profileId: profile.id };
    if (status) {
      where.status = status;
    }

    const applications = await prisma.jobApplication.findMany({
      where,
      include: {
        job: {
          select: {
            id: true,
            title: true,
            postcode: true,
            status: true,
            budgetMin: true,
            budgetMax: true,
            timeframe: true,
            createdAt: true,
            trade: {
              select: { name: true },
            },
            customer: {
              select: { name: true },
            },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ applications });
  } catch (error) {
    console.error('Error fetching applications:', error);
    return NextResponse.json(
      { error: 'Failed to fetch applications' },
      { status: 500 }
    );
  }
}
