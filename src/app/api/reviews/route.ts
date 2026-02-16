import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'You must be logged in to submit a review' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const {
      profileId,
      overallRating,
      qualityRating,
      reliabilityRating,
      valueRating,
      title,
      content,
      workType,
      workDate,
      cost,
    } = body;

    // Validate required fields
    if (!profileId || !overallRating || !title || !content) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Validate rating range
    if (overallRating < 1 || overallRating > 5) {
      return NextResponse.json(
        { error: 'Rating must be between 1 and 5' },
        { status: 400 }
      );
    }

    // Validate content length
    if (content.trim().length < 50) {
      return NextResponse.json(
        { error: 'Review must be at least 50 characters' },
        { status: 400 }
      );
    }

    // Check if profile exists
    const profile = await prisma.tradesProfile.findUnique({
      where: { id: profileId },
    });

    if (!profile) {
      return NextResponse.json(
        { error: 'Tradesperson not found' },
        { status: 404 }
      );
    }

    // Check if user has already reviewed this tradesperson
    const existingReview = await prisma.review.findFirst({
      where: {
        profileId,
        authorId: session.user.id,
      },
    });

    if (existingReview) {
      return NextResponse.json(
        { error: 'You have already reviewed this tradesperson' },
        { status: 400 }
      );
    }

    // Create the review
    const review = await prisma.review.create({
      data: {
        profileId,
        authorId: session.user.id,
        overallRating,
        qualityRating,
        reliabilityRating,
        valueRating,
        title,
        content,
        workType,
        workDate: workDate ? new Date(workDate + '-01') : null,
        cost,
        status: 'PENDING', // Requires moderation
        images: [],
      },
    });

    // Update profile's average rating and review count
    const reviews = await prisma.review.findMany({
      where: {
        profileId,
        status: 'APPROVED',
      },
      select: {
        overallRating: true,
      },
    });

    // Include this new review in calculations (assuming it will be approved)
    const allRatings = [...reviews.map(r => r.overallRating), overallRating];
    const averageRating = allRatings.reduce((a, b) => a + b, 0) / allRatings.length;

    await prisma.tradesProfile.update({
      where: { id: profileId },
      data: {
        averageRating,
        reviewCount: allRatings.length,
      },
    });

    return NextResponse.json({
      success: true,
      review: {
        id: review.id,
        status: review.status,
      },
      message: 'Your review has been submitted and is pending moderation',
    });
  } catch (error) {
    console.error('Error creating review:', error);
    return NextResponse.json(
      { error: 'Failed to submit review' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const profileId = searchParams.get('profileId');

    if (!profileId) {
      return NextResponse.json(
        { error: 'Profile ID is required' },
        { status: 400 }
      );
    }

    const reviews = await prisma.review.findMany({
      where: {
        profileId,
        status: 'APPROVED',
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json({ reviews });
  } catch (error) {
    console.error('Error fetching reviews:', error);
    return NextResponse.json(
      { error: 'Failed to fetch reviews' },
      { status: 500 }
    );
  }
}
