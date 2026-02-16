import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id || session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { id } = await params;
    const body = await request.json();
    const { action, resolution, contentAction, targetType, targetId } = body;

    if (!action || !['investigate', 'resolve', 'dismiss'].includes(action)) {
      return NextResponse.json(
        { error: 'Invalid action' },
        { status: 400 }
      );
    }

    // Get the current report
    const report = await prisma.report.findUnique({
      where: { id },
    });

    if (!report) {
      return NextResponse.json(
        { error: 'Report not found' },
        { status: 404 }
      );
    }

    // Map action to status
    const statusMap = {
      investigate: 'INVESTIGATING',
      resolve: 'RESOLVED',
      dismiss: 'DISMISSED',
    } as const;

    const newStatus = statusMap[action as keyof typeof statusMap];

    // Update the report
    await prisma.report.update({
      where: { id },
      data: {
        status: newStatus,
        resolution: resolution || null,
        handledBy: session.user.id,
        handledAt: new Date(),
      },
    });

    // Handle content action if resolving
    if (action === 'resolve' && contentAction && contentAction !== 'none') {
      if (targetType === 'REVIEW') {
        if (contentAction === 'reject') {
          await prisma.review.update({
            where: { id: targetId },
            data: { status: 'REJECTED' },
          });

          // Recalculate profile stats
          const review = await prisma.review.findUnique({
            where: { id: targetId },
            select: { profileId: true },
          });

          if (review) {
            const approvedReviews = await prisma.review.findMany({
              where: {
                profileId: review.profileId,
                status: 'APPROVED',
              },
              select: { overallRating: true },
            });

            const totalRating = approvedReviews.reduce((sum, r) => sum + r.overallRating, 0);
            const averageRating = approvedReviews.length > 0 ? totalRating / approvedReviews.length : 0;

            await prisma.tradesProfile.update({
              where: { id: review.profileId },
              data: {
                averageRating: Math.round(averageRating * 10) / 10,
                reviewCount: approvedReviews.length,
              },
            });
          }
        } else if (contentAction === 'flag') {
          await prisma.review.update({
            where: { id: targetId },
            data: { status: 'FLAGGED' },
          });
        }
      }

      if (targetType === 'PROFILE' && contentAction === 'deactivate') {
        await prisma.tradesProfile.update({
          where: { id: targetId },
          data: { isActive: false },
        });
      }

      if (targetType === 'MESSAGE' && contentAction === 'delete') {
        await prisma.message.delete({
          where: { id: targetId },
        });
      }
    }

    return NextResponse.json({
      success: true,
      status: newStatus,
    });
  } catch (error) {
    console.error('Error handling report:', error);
    return NextResponse.json(
      { error: 'Failed to handle report' },
      { status: 500 }
    );
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id || session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { id } = await params;

    const report = await prisma.report.findUnique({
      where: { id },
      include: {
        reporter: {
          select: {
            id: true,
            name: true,
            email: true,
            createdAt: true,
          },
        },
      },
    });

    if (!report) {
      return NextResponse.json(
        { error: 'Report not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ report });
  } catch (error) {
    console.error('Error fetching report:', error);
    return NextResponse.json(
      { error: 'Failed to fetch report' },
      { status: 500 }
    );
  }
}
