import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { createOrRetrieveCustomer, createCheckoutSession, SUBSCRIPTION_TIERS } from '@/lib/stripe';

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
    const { tier } = body;

    if (!tier || !['PRO', 'PREMIUM'].includes(tier)) {
      return NextResponse.json(
        { error: 'Invalid subscription tier' },
        { status: 400 }
      );
    }

    // Get user's profile
    const profile = await prisma.tradesProfile.findUnique({
      where: { userId: session.user.id },
      include: {
        user: {
          select: { email: true, name: true },
        },
      },
    });

    if (!profile) {
      return NextResponse.json(
        { error: 'Profile not found. Please complete your profile first.' },
        { status: 404 }
      );
    }

    // Get or create Stripe customer
    const customerId = await createOrRetrieveCustomer(
      session.user.id,
      profile.user.email,
      profile.businessName
    );

    // Get price ID for the tier
    const tierConfig = SUBSCRIPTION_TIERS[tier as keyof typeof SUBSCRIPTION_TIERS];
    const priceId = tierConfig.priceId;

    if (!priceId) {
      return NextResponse.json(
        { error: 'Price not configured for this tier' },
        { status: 500 }
      );
    }

    // Create checkout session
    const checkoutSession = await createCheckoutSession(
      customerId,
      priceId,
      profile.id
    );

    return NextResponse.json({ url: checkoutSession.url });
  } catch (error) {
    console.error('Error creating checkout session:', error);
    return NextResponse.json(
      { error: 'Failed to create checkout session' },
      { status: 500 }
    );
  }
}
