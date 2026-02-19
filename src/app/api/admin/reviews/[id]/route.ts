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
    const { action, reason: _reason, profileId: _profileId } = body;

    if (!action || !['approve', 'reject', 'flag'].includes(action)) {
      return NextResponse.json(
        { error: 'Invalid action' },
        { status: 400 }
      );
    }

    // Get the current review
    const review = await prisma.review.findUnique({
      where: { id },
      include: { profile: true },
    });

    if (!review) {
      return NextResponse.json(
        { error: 'Review not found' },
        { status: 404 }
      );
    }

    const previousStatus = review.status;

    // Map action to status
    const statusMap = {
      approve: 'APPROVED',
      reject: 'REJECTED',
      flag: 'FLAGGED',
    } as const;

    const newStatus = statusMap[action as keyof typeof statusMap];

    // Update the review
    await prisma.review.update({
      where: { id },
      data: {
        status: newStatus,
      },
    });

    // If approving a review that wasn't previously approved, update profile stats
    if (action === 'approve' && previousStatus !== 'APPROVED') {
      // Recalculate average rating
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

    // If rejecting/flagging a previously approved review, update profile stats
    if ((action === 'reject' || action === 'flag') && previousStatus === 'APPROVED') {
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

    return NextResponse.json({
      success: true,
      status: newStatus,
    });
  } catch (error) {
    console.error('Error moderating review:', error);
    return NextResponse.json(
      { error: 'Failed to moderate review' },
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

    const review = await prisma.review.findUnique({
      where: { id },
      include: {
        profile: {
          select: {
            id: true,
            businessName: true,
            slug: true,
            averageRating: true,
            reviewCount: true,
          },
        },
        author: {
          select: {
            id: true,
            name: true,
            email: true,
            createdAt: true,
          },
        },
      },
    });

    if (!review) {
      return NextResponse.json(
        { error: 'Review not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ review });
  } catch (error) {
    console.error('Error fetching review:', error);
    return NextResponse.json(
      { error: 'Failed to fetch review' },
      { status: 500 }
    );
  }
}
