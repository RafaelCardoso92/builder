import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { createBillingPortalSession } from '@/lib/stripe';

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Get user's profile with Stripe customer ID
    const profile = await prisma.tradesProfile.findUnique({
      where: { userId: session.user.id },
      select: { stripeCustomerId: true },
    });

    if (!profile?.stripeCustomerId) {
      return NextResponse.json(
        { error: 'No billing account found' },
        { status: 404 }
      );
    }

    // Create billing portal session
    const portalSession = await createBillingPortalSession(profile.stripeCustomerId);

    return NextResponse.json({ url: portalSession.url });
  } catch (error) {
    console.error('Error creating billing portal session:', error);
    return NextResponse.json(
      { error: 'Failed to create billing portal session' },
      { status: 500 }
    );
  }
}
