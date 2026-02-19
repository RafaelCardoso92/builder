import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

const validReasons = [
  'SPAM',
  'FAKE_REVIEW',
  'INAPPROPRIATE_CONTENT',
  'HARASSMENT',
  'MISLEADING_INFO',
  'OFFENSIVE_LANGUAGE',
  'SCAM',
  'OTHER',
];

const validTargetTypes = ['REVIEW', 'PROFILE', 'MESSAGE'];

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'You must be logged in to submit a report' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { targetType, targetId, reason, description } = body;

    // Validate target type
    if (!targetType || !validTargetTypes.includes(targetType)) {
      return NextResponse.json(
        { error: 'Invalid target type' },
        { status: 400 }
      );
    }

    // Validate target ID
    if (!targetId || typeof targetId !== 'string') {
      return NextResponse.json(
        { error: 'Target ID is required' },
        { status: 400 }
      );
    }

    // Validate reason
    if (!reason || !validReasons.includes(reason)) {
      return NextResponse.json(
        { error: 'Invalid report reason' },
        { status: 400 }
      );
    }

    // Verify the target exists
    let targetExists = false;
    if (targetType === 'REVIEW') {
      const review = await prisma.review.findUnique({ where: { id: targetId } });
      targetExists = !!review;
    } else if (targetType === 'PROFILE') {
      const profile = await prisma.tradesProfile.findUnique({ where: { id: targetId } });
      targetExists = !!profile;
    } else if (targetType === 'MESSAGE') {
      const message = await prisma.message.findUnique({ where: { id: targetId } });
      targetExists = !!message;
    }

    if (!targetExists) {
      return NextResponse.json(
        { error: 'The content you are trying to report does not exist' },
        { status: 404 }
      );
    }

    // Check if user has already reported this content
    const existingReport = await prisma.report.findFirst({
      where: {
        reporterId: session.user.id,
        targetType: targetType as 'REVIEW' | 'PROFILE' | 'MESSAGE',
        targetId,
        status: { in: ['PENDING', 'INVESTIGATING'] },
      },
    });

    if (existingReport) {
      return NextResponse.json(
        { error: 'You have already reported this content' },
        { status: 400 }
      );
    }

    // Create the report
    const report = await prisma.report.create({
      data: {
        reporterId: session.user.id,
        targetType: targetType as 'REVIEW' | 'PROFILE' | 'MESSAGE',
        targetId,
        reason: reason as 'SPAM' | 'FAKE_REVIEW' | 'INAPPROPRIATE_CONTENT' | 'HARASSMENT' | 'MISLEADING_INFO' | 'OFFENSIVE_LANGUAGE' | 'SCAM' | 'OTHER',
        description: description?.trim() || null,
      },
    });

    // If reporting a review, automatically flag it for admin attention
    if (targetType === 'REVIEW') {
      const review = await prisma.review.findUnique({ where: { id: targetId } });
      if (review && review.status === 'APPROVED') {
        await prisma.review.update({
          where: { id: targetId },
          data: { status: 'FLAGGED' },
        });
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Report submitted successfully. Our team will review it shortly.',
      reportId: report.id,
    });
  } catch (error) {
    console.error('Error creating report:', error);
    return NextResponse.json(
      { error: 'Failed to submit report' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Only admins can view reports
    if (session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Forbidden' },
        { status: 403 }
      );
    }

    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const targetType = searchParams.get('targetType');

    const where: {
      status?: 'PENDING' | 'INVESTIGATING' | 'RESOLVED' | 'DISMISSED';
      targetType?: 'REVIEW' | 'PROFILE' | 'MESSAGE';
    } = {};
    if (status && status !== 'all') {
      where.status = status as 'PENDING' | 'INVESTIGATING' | 'RESOLVED' | 'DISMISSED';
    }
    if (targetType && targetType !== 'all') {
      where.targetType = targetType as 'REVIEW' | 'PROFILE' | 'MESSAGE';
    }

    const reports = await prisma.report.findMany({
      where,
      include: {
        reporter: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
      orderBy: [
        { status: 'asc' },
        { createdAt: 'desc' },
      ],
    });

    return NextResponse.json({ reports });
  } catch (error) {
    console.error('Error fetching reports:', error);
    return NextResponse.json(
      { error: 'Failed to fetch reports' },
      { status: 500 }
    );
  }
}
