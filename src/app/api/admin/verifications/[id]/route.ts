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
    const { id } = await params;

    if (!session?.user?.id || session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { action, notes, expiresAt } = body;

    if (!action || !['approve', 'reject'].includes(action)) {
      return NextResponse.json(
        { error: 'Invalid action' },
        { status: 400 }
      );
    }

    // Get the verification
    const verification = await prisma.verification.findUnique({
      where: { id },
      include: {
        profile: true,
      },
    });

    if (!verification) {
      return NextResponse.json(
        { error: 'Verification not found' },
        { status: 404 }
      );
    }

    if (verification.status !== 'PENDING') {
      return NextResponse.json(
        { error: 'Verification has already been processed' },
        { status: 400 }
      );
    }

    if (action === 'approve') {
      // Update verification to approved
      await prisma.verification.update({
        where: { id },
        data: {
          status: 'APPROVED',
          verifiedAt: new Date(),
          verifiedBy: session.user.id,
          notes: notes || null,
          expiresAt: expiresAt ? new Date(expiresAt) : null,
        },
      });

      // Check if this is the first verification - set profile as verified
      const approvedCount = await prisma.verification.count({
        where: {
          profileId: verification.profileId,
          status: 'APPROVED',
        },
      });

      if (approvedCount === 1) {
        // First approved verification - mark profile as verified
        await prisma.tradesProfile.update({
          where: { id: verification.profileId },
          data: {
            isVerified: true,
            verifiedAt: new Date(),
          },
        });
      }

      return NextResponse.json({
        success: true,
        message: 'Verification approved',
      });
    } else {
      // Reject verification
      if (!notes || notes.trim().length < 10) {
        return NextResponse.json(
          { error: 'Please provide a rejection reason' },
          { status: 400 }
        );
      }

      await prisma.verification.update({
        where: { id },
        data: {
          status: 'REJECTED',
          verifiedBy: session.user.id,
          notes: notes.trim(),
        },
      });

      return NextResponse.json({
        success: true,
        message: 'Verification rejected',
      });
    }
  } catch (error) {
    console.error('Error processing verification:', error);
    return NextResponse.json(
      { error: 'Failed to process verification' },
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
    const { id } = await params;

    if (!session?.user?.id || session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const verification = await prisma.verification.findUnique({
      where: { id },
      include: {
        profile: {
          include: {
            user: {
              select: { email: true, name: true },
            },
          },
        },
      },
    });

    if (!verification) {
      return NextResponse.json(
        { error: 'Verification not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ verification });
  } catch (error) {
    console.error('Error fetching verification:', error);
    return NextResponse.json(
      { error: 'Failed to fetch verification' },
      { status: 500 }
    );
  }
}
