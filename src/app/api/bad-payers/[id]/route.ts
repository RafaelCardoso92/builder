import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// GET /api/bad-payers/[id] - Get single report
export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    const { id } = await params;

    const report = await prisma.badPayerReport.findUnique({
      where: { id },
      include: {
        reporter: {
          select: {
            id: true,
            businessName: true,
            slug: true,
            isVerified: true,
            city: true,
          },
        },
        evidence: true,
        disputes: {
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    if (!report) {
      return NextResponse.json(
        { error: 'Report not found' },
        { status: 404 }
      );
    }

    const isAdmin = session?.user?.role === 'ADMIN';
    const isOwner = session?.user?.id && report.reporter.id === session.user.id;

    // Check access
    if (!isAdmin && !isOwner && (report.status !== 'PUBLISHED' || !report.isPublic)) {
      return NextResponse.json(
        { error: 'Report not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ report });
  } catch (error) {
    console.error('Error fetching bad payer report:', error);
    return NextResponse.json(
      { error: 'Failed to fetch report' },
      { status: 500 }
    );
  }
}

// PATCH /api/bad-payers/[id] - Update report (admin or owner)
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

    const report = await prisma.badPayerReport.findUnique({
      where: { id },
      include: {
        reporter: { select: { userId: true } },
      },
    });

    if (!report) {
      return NextResponse.json(
        { error: 'Report not found' },
        { status: 404 }
      );
    }

    const isAdmin = session.user.role === 'ADMIN';
    const isOwner = report.reporter.userId === session.user.id;

    if (!isAdmin && !isOwner) {
      return NextResponse.json(
        { error: 'You do not have permission to update this report' },
        { status: 403 }
      );
    }

    const body = await req.json();
    const updateData: any = {};

    // Admin can update status
    if (isAdmin) {
      if (body.status) {
        updateData.status = body.status;
        updateData.reviewedAt = new Date();
        updateData.reviewedBy = session.user.id;

        if (body.status === 'PUBLISHED') {
          updateData.isPublic = true;
        }

        if (body.status === 'REJECTED' && body.rejectionReason) {
          updateData.rejectionReason = body.rejectionReason;
        }
      }

      if (body.adminNotes !== undefined) {
        updateData.adminNotes = body.adminNotes;
      }
    }

    const updatedReport = await prisma.badPayerReport.update({
      where: { id },
      data: updateData,
    });

    return NextResponse.json({ report: updatedReport });
  } catch (error) {
    console.error('Error updating bad payer report:', error);
    return NextResponse.json(
      { error: 'Failed to update report' },
      { status: 500 }
    );
  }
}

// DELETE /api/bad-payers/[id] - Delete report (owner only before published)
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

    const report = await prisma.badPayerReport.findUnique({
      where: { id },
      include: {
        reporter: { select: { userId: true } },
      },
    });

    if (!report) {
      return NextResponse.json(
        { error: 'Report not found' },
        { status: 404 }
      );
    }

    const isAdmin = session.user.role === 'ADMIN';
    const isOwner = report.reporter.userId === session.user.id;

    if (!isAdmin && !isOwner) {
      return NextResponse.json(
        { error: 'You do not have permission to delete this report' },
        { status: 403 }
      );
    }

    // Only allow deletion of draft/pending reports by owner
    if (!isAdmin && !['DRAFT', 'PENDING_REVIEW', 'REJECTED'].includes(report.status)) {
      return NextResponse.json(
        { error: 'Published reports cannot be deleted' },
        { status: 400 }
      );
    }

    await prisma.badPayerReport.delete({ where: { id } });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting bad payer report:', error);
    return NextResponse.json(
      { error: 'Failed to delete report' },
      { status: 500 }
    );
  }
}
