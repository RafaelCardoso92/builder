import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { SUBSCRIPTION_TIERS } from '@/lib/stripe';

const validTypes = [
  'IDENTITY',
  'INSURANCE',
  'PUBLIC_LIABILITY',
  'QUALIFICATION',
  'GAS_SAFE',
  'NICEIC',
  'TRUSTMARK',
];

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { type, documentUrl } = body;

    // Validate type
    if (!type || !validTypes.includes(type)) {
      return NextResponse.json(
        { error: 'Invalid verification type' },
        { status: 400 }
      );
    }

    // Validate document URL
    if (!documentUrl || !documentUrl.trim()) {
      return NextResponse.json(
        { error: 'Document URL is required' },
        { status: 400 }
      );
    }

    // Get user's profile
    const profile = await prisma.tradesProfile.findUnique({
      where: { userId: session.user.id },
      include: {
        verifications: true,
      },
    });

    if (!profile) {
      return NextResponse.json(
        { error: 'Profile not found' },
        { status: 404 }
      );
    }

    // Check if already requested this type
    const existingVerification = profile.verifications.find(
      v => v.type === type && (v.status === 'PENDING' || v.status === 'APPROVED')
    );

    if (existingVerification) {
      return NextResponse.json(
        { error: 'You already have a verification of this type' },
        { status: 400 }
      );
    }

    // Check tier limits
    const tierLimits = SUBSCRIPTION_TIERS[profile.subscriptionTier].limits;
    const approvedCount = profile.verifications.filter(v => v.status === 'APPROVED').length;
    const pendingCount = profile.verifications.filter(v => v.status === 'PENDING').length;

    if (tierLimits.verificationBadges !== -1) {
      if (approvedCount + pendingCount >= tierLimits.verificationBadges) {
        return NextResponse.json(
          { error: 'You have reached your verification limit for your current plan' },
          { status: 400 }
        );
      }
    }

    // Create verification request
    const verification = await prisma.verification.create({
      data: {
        profileId: profile.id,
        type: type as 'IDENTITY' | 'INSURANCE' | 'PUBLIC_LIABILITY' | 'QUALIFICATION' | 'GAS_SAFE' | 'NICEIC' | 'TRUSTMARK' | 'FENSA' | 'CHAS' | 'CONSTRUCTIONLINE',
        documentUrl: documentUrl.trim(),
        status: 'PENDING',
      },
    });

    return NextResponse.json({
      success: true,
      verification: {
        id: verification.id,
        type: verification.type,
        status: verification.status,
      },
    });
  } catch (error) {
    console.error('Error creating verification:', error);
    return NextResponse.json(
      { error: 'Failed to submit verification request' },
      { status: 500 }
    );
  }
}

export async function GET(_request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const profile = await prisma.tradesProfile.findUnique({
      where: { userId: session.user.id },
      include: {
        verifications: {
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    if (!profile) {
      return NextResponse.json(
        { error: 'Profile not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      verifications: profile.verifications,
    });
  } catch (error) {
    console.error('Error fetching verifications:', error);
    return NextResponse.json(
      { error: 'Failed to fetch verifications' },
      { status: 500 }
    );
  }
}
