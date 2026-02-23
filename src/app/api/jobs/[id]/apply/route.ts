import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// POST /api/jobs/[id]/apply - Submit application
export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    const { id: jobId } = await params;

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'You must be logged in to apply' },
        { status: 401 }
      );
    }

    // Get tradesperson profile
    const profile = await prisma.tradesProfile.findUnique({
      where: { userId: session.user.id },
      include: {
        trades: { include: { trade: true } },
      },
    });

    if (!profile) {
      return NextResponse.json(
        { error: 'Only tradespeople can apply to jobs' },
        { status: 403 }
      );
    }

    // Get job
    const job = await prisma.job.findUnique({
      where: { id: jobId },
      include: { trade: true },
    });

    if (!job) {
      return NextResponse.json(
        { error: 'Job not found' },
        { status: 404 }
      );
    }

    if (job.status !== 'OPEN') {
      return NextResponse.json(
        { error: 'This job is no longer accepting applications' },
        { status: 400 }
      );
    }

    // Check if job has expired
    if (job.expiresAt && new Date(job.expiresAt) < new Date()) {
      return NextResponse.json(
        { error: 'This job has expired' },
        { status: 400 }
      );
    }

    // Check if already applied
    const existingApplication = await prisma.jobApplication.findUnique({
      where: {
        jobId_profileId: {
          jobId,
          profileId: profile.id,
        },
      },
    });

    if (existingApplication) {
      return NextResponse.json(
        { error: 'You have already applied to this job' },
        { status: 400 }
      );
    }

    // Parse request body
    const body = await req.json();
    const { coverLetter, proposedBudget, proposedStartDate } = body;

    const trimmedCoverLetter = coverLetter?.trim();
    if (!trimmedCoverLetter || trimmedCoverLetter.length < 50) {
      return NextResponse.json(
        { error: 'Cover letter must be at least 50 characters' },
        { status: 400 }
      );
    }

    // Validate proposed start date if provided
    let parsedStartDate: Date | null = null;
    if (proposedStartDate) {
      parsedStartDate = new Date(proposedStartDate);
      if (isNaN(parsedStartDate.getTime())) {
        return NextResponse.json(
          { error: 'Invalid start date format' },
          { status: 400 }
        );
      }
    }

    // Create application
    const application = await prisma.jobApplication.create({
      data: {
        jobId,
        profileId: profile.id,
        coverLetter: trimmedCoverLetter,
        proposedBudget: proposedBudget ? parseInt(proposedBudget) : null,
        proposedStartDate: parsedStartDate,
        status: 'PENDING',
      },
      include: {
        job: {
          select: { title: true },
        },
        profile: {
          select: { businessName: true },
        },
      },
    });

    return NextResponse.json({ application }, { status: 201 });
  } catch (error) {
    console.error('Error submitting application:', error);
    return NextResponse.json(
      { error: 'Failed to submit application' },
      { status: 500 }
    );
  }
}
