import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// GET /api/jobs/[id] - Get job details
export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const job = await prisma.job.findUnique({
      where: { id },
      include: {
        trade: {
          select: { id: true, name: true, slug: true },
        },
        customer: {
          select: { id: true, name: true },
        },
        _count: {
          select: { applications: true },
        },
      },
    });

    if (!job) {
      return NextResponse.json(
        { error: 'Job not found' },
        { status: 404 }
      );
    }

    // Increment view count
    await prisma.job.update({
      where: { id },
      data: { viewCount: { increment: 1 } },
    });

    return NextResponse.json({ job });
  } catch (error) {
    console.error('Error fetching job:', error);
    return NextResponse.json(
      { error: 'Failed to fetch job' },
      { status: 500 }
    );
  }
}

// PATCH /api/jobs/[id] - Update job (owner only)
export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    const { id } = await params;

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Verify ownership
    const job = await prisma.job.findUnique({
      where: { id },
    });

    if (!job) {
      return NextResponse.json(
        { error: 'Job not found' },
        { status: 404 }
      );
    }

    if (job.customerId !== session.user.id) {
      return NextResponse.json(
        { error: 'You can only edit your own jobs' },
        { status: 403 }
      );
    }

    const body = await req.json();
    const allowedFields = [
      'title',
      'description',
      'address',
      'budgetMin',
      'budgetMax',
      'timeframe',
      'images',
      'status',
    ];

    const updateData: any = {};
    for (const field of allowedFields) {
      if (body[field] !== undefined) {
        if (field === 'budgetMin' || field === 'budgetMax') {
          updateData[field] = body[field] ? parseInt(body[field]) : null;
        } else {
          updateData[field] = body[field];
        }
      }
    }

    const updatedJob = await prisma.job.update({
      where: { id },
      data: updateData,
      include: {
        trade: { select: { name: true } },
      },
    });

    return NextResponse.json({ job: updatedJob });
  } catch (error) {
    console.error('Error updating job:', error);
    return NextResponse.json(
      { error: 'Failed to update job' },
      { status: 500 }
    );
  }
}

// DELETE /api/jobs/[id] - Close/delete job (owner only)
export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    const { id } = await params;

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Verify ownership
    const job = await prisma.job.findUnique({
      where: { id },
    });

    if (!job) {
      return NextResponse.json(
        { error: 'Job not found' },
        { status: 404 }
      );
    }

    if (job.customerId !== session.user.id) {
      return NextResponse.json(
        { error: 'You can only close your own jobs' },
        { status: 403 }
      );
    }

    // Mark as closed instead of deleting
    await prisma.job.update({
      where: { id },
      data: { status: 'CLOSED' },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error closing job:', error);
    return NextResponse.json(
      { error: 'Failed to close job' },
      { status: 500 }
    );
  }
}
