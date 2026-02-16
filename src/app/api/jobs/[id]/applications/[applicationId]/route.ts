import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// Valid status transitions
const validTransitions: Record<string, string[]> = {
  PENDING: ['VIEWED', 'SHORTLISTED', 'ACCEPTED', 'DECLINED', 'WITHDRAWN'],
  VIEWED: ['SHORTLISTED', 'ACCEPTED', 'DECLINED', 'WITHDRAWN'],
  SHORTLISTED: ['ACCEPTED', 'DECLINED', 'WITHDRAWN'],
  ACCEPTED: [], // No transitions from ACCEPTED
  DECLINED: [], // No transitions from DECLINED
  WITHDRAWN: [], // No transitions from WITHDRAWN
};

// PATCH /api/jobs/[id]/applications/[applicationId] - Update application status
export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string; applicationId: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    const { id: jobId, applicationId } = await params;

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Get the application with job and profile
    const application = await prisma.jobApplication.findUnique({
      where: { id: applicationId },
      include: {
        job: { select: { customerId: true, title: true, status: true } },
        profile: {
          select: { userId: true, businessName: true },
        },
      },
    });

    if (!application) {
      return NextResponse.json(
        { error: 'Application not found' },
        { status: 404 }
      );
    }

    if (application.jobId !== jobId) {
      return NextResponse.json(
        { error: 'Application does not belong to this job' },
        { status: 400 }
      );
    }

    const body = await req.json();
    const { status } = body;

    // Validate status is a valid enum value
    const validStatuses = ['PENDING', 'VIEWED', 'SHORTLISTED', 'ACCEPTED', 'DECLINED', 'WITHDRAWN'];
    if (!validStatuses.includes(status)) {
      return NextResponse.json(
        { error: 'Invalid status value' },
        { status: 400 }
      );
    }

    // Check if transition is valid
    const currentStatus = application.status;
    const allowedNextStatuses = validTransitions[currentStatus] || [];
    if (!allowedNextStatuses.includes(status)) {
      return NextResponse.json(
        { error: `Cannot transition from ${currentStatus} to ${status}` },
        { status: 400 }
      );
    }

    const isJobOwner = application.job.customerId === session.user.id;
    const isApplicant = application.profile.userId === session.user.id;

    // Authorization checks
    const ownerAllowedStatuses = ['SHORTLISTED', 'ACCEPTED', 'DECLINED'];
    const applicantAllowedStatuses = ['WITHDRAWN'];

    if (!isJobOwner && !isApplicant) {
      return NextResponse.json(
        { error: 'You are not authorized to update this application' },
        { status: 403 }
      );
    }

    if (isJobOwner && !ownerAllowedStatuses.includes(status)) {
      return NextResponse.json(
        { error: 'Invalid status for job owner' },
        { status: 400 }
      );
    }

    if (isApplicant && !applicantAllowedStatuses.includes(status)) {
      return NextResponse.json(
        { error: 'Invalid status for applicant' },
        { status: 400 }
      );
    }

    // Handle ACCEPTED status with transaction
    if (status === 'ACCEPTED') {
      const result = await prisma.$transaction(async (tx) => {
        // Update application
        const updatedApplication = await tx.jobApplication.update({
          where: { id: applicationId },
          data: { status },
        });

        // Update job status to IN_PROGRESS
        await tx.job.update({
          where: { id: jobId },
          data: { status: 'IN_PROGRESS' },
        });

        // Create conversation between customer and tradesperson
        await tx.conversation.create({
          data: {
            participants: {
              create: [
                { userId: session.user.id },
                { userId: application.profile.userId },
              ],
            },
            messages: {
              create: {
                senderId: session.user.id,
                content: `Your application for "${application.job.title}" has been accepted! Let's discuss the details.`,
              },
            },
          },
        });

        return updatedApplication;
      });

      return NextResponse.json({ application: result });
    }

    // Handle other status updates
    const updatedApplication = await prisma.jobApplication.update({
      where: { id: applicationId },
      data: { status },
    });

    return NextResponse.json({ application: updatedApplication });
  } catch (error) {
    console.error('Error updating application:', error);
    return NextResponse.json(
      { error: 'Failed to update application' },
      { status: 500 }
    );
  }
}
