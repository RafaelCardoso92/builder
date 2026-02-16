import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// GET /api/jobs/[id]/applications - List applications for a job (owner only)
export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    const { id: jobId } = await params;

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Verify job ownership
    const job = await prisma.job.findUnique({
      where: { id: jobId },
    });

    if (!job) {
      return NextResponse.json(
        { error: 'Job not found' },
        { status: 404 }
      );
    }

    if (job.customerId !== session.user.id) {
      return NextResponse.json(
        { error: 'You can only view applications for your own jobs' },
        { status: 403 }
      );
    }

    const applications = await prisma.jobApplication.findMany({
      where: { jobId },
      include: {
        profile: {
          select: {
            id: true,
            businessName: true,
            slug: true,
            phone: true,
            email: true,
            city: true,
            postcode: true,
            averageRating: true,
            reviewCount: true,
            isVerified: true,
            logo: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    // Mark unviewed applications as viewed
    const unviewedIds = applications
      .filter((app) => !app.viewedAt)
      .map((app) => app.id);

    if (unviewedIds.length > 0) {
      await prisma.jobApplication.updateMany({
        where: { id: { in: unviewedIds } },
        data: {
          viewedAt: new Date(),
          status: 'VIEWED',
        },
      });
    }

    return NextResponse.json({ applications });
  } catch (error) {
    console.error('Error fetching applications:', error);
    return NextResponse.json(
      { error: 'Failed to fetch applications' },
      { status: 500 }
    );
  }
}
