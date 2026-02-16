import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    const { id } = await params;

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'You must be logged in' },
        { status: 401 }
      );
    }

    // Get the review
    const review = await prisma.review.findUnique({
      where: { id },
      include: {
        profile: {
          select: {
            userId: true,
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

    // Check if user owns this profile
    if (review.profile.userId !== session.user.id) {
      return NextResponse.json(
        { error: 'You can only respond to reviews for your own business' },
        { status: 403 }
      );
    }

    // Check if already responded
    if (review.response) {
      return NextResponse.json(
        { error: 'You have already responded to this review' },
        { status: 400 }
      );
    }

    const body = await request.json();
    const { response } = body;

    if (!response || response.trim().length < 10) {
      return NextResponse.json(
        { error: 'Response must be at least 10 characters' },
        { status: 400 }
      );
    }

    // Update the review with the response
    const updatedReview = await prisma.review.update({
      where: { id },
      data: {
        response: response.trim(),
        respondedAt: new Date(),
      },
    });

    return NextResponse.json({
      success: true,
      review: {
        id: updatedReview.id,
        response: updatedReview.response,
        respondedAt: updatedReview.respondedAt,
      },
    });
  } catch (error) {
    console.error('Error responding to review:', error);
    return NextResponse.json(
      { error: 'Failed to respond to review' },
      { status: 500 }
    );
  }
}
