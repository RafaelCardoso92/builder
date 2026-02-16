import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// GET /api/bad-payers/my - Get current user's reports
export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const profile = await prisma.tradesProfile.findUnique({
      where: { userId: session.user.id },
    });

    if (!profile) {
      return NextResponse.json(
        { error: 'Profile not found' },
        { status: 404 }
      );
    }

    const reports = await prisma.badPayerReport.findMany({
      where: { reporterId: profile.id },
      include: {
        _count: {
          select: {
            evidence: true,
            disputes: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    // Calculate statistics
    const stats = {
      total: reports.length,
      pending: reports.filter((r) => r.status === 'PENDING_REVIEW').length,
      published: reports.filter((r) => r.status === 'PUBLISHED').length,
      disputed: reports.filter((r) => r.status === 'DISPUTED').length,
      rejected: reports.filter((r) => r.status === 'REJECTED').length,
      totalOwed: reports.reduce((sum, r) => sum + r.amountOwed, 0),
    };

    return NextResponse.json({ reports, stats });
  } catch (error) {
    console.error('Error fetching user reports:', error);
    return NextResponse.json(
      { error: 'Failed to fetch reports' },
      { status: 500 }
    );
  }
}
