import Stripe from 'stripe';

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

// Subscription tier configuration
export const SUBSCRIPTION_TIERS = {
  FREE: {
    name: 'Free',
    price: 0,
    priceId: null,
    features: [
      'Basic profile listing',
      'Up to 5 portfolio photos',
      '10 quote requests per month',
      'Standard search placement',
      '1 verification badge',
    ],
    limits: {
      portfolioPhotos: 5,
      quoteRequestsPerMonth: 10,
      verificationBadges: 1,
      jobApplicationsPerMonth: 5,
    },
  },
  PRO: {
    name: 'Pro',
    price: 29,
    priceId: process.env.STRIPE_PRO_PRICE_ID,
    features: [
      'Everything in Free',
      'Up to 20 portfolio photos',
      'Unlimited quote requests',
      'Boosted search placement',
      'Up to 3 verification badges',
      'Response templates',
      'Basic analytics',
    ],
    limits: {
      portfolioPhotos: 20,
      quoteRequestsPerMonth: -1, // unlimited
      verificationBadges: 3,
      jobApplicationsPerMonth: 20,
    },
  },
  PREMIUM: {
    name: 'Premium',
    price: 59,
    priceId: process.env.STRIPE_PREMIUM_PRICE_ID,
    features: [
      'Everything in Pro',
      'Unlimited portfolio photos',
      'Top search placement',
      'Unlimited verification badges',
      'Featured listing badge',
      'Advanced analytics',
      'Priority support',
    ],
    limits: {
      portfolioPhotos: -1, // unlimited
      quoteRequestsPerMonth: -1,
      verificationBadges: -1,
      jobApplicationsPerMonth: -1, // unlimited
    },
  },
} as const;

export type SubscriptionTier = keyof typeof SUBSCRIPTION_TIERS;

export async function createOrRetrieveCustomer(
  userId: string,
  email: string,
  name: string
): Promise<string> {
  const { prisma } = await import('./prisma');

  const profile = await prisma.tradesProfile.findUnique({
    where: { userId },
    select: { stripeCustomerId: true },
  });

  if (profile?.stripeCustomerId) {
    return profile.stripeCustomerId;
  }

  // Create new Stripe customer
  const customer = await stripe.customers.create({
    email,
    name,
    metadata: {
      userId,
    },
  });

  // Save customer ID to profile
  await prisma.tradesProfile.update({
    where: { userId },
    data: { stripeCustomerId: customer.id },
  });

  return customer.id;
}

export async function createCheckoutSession(
  customerId: string,
  priceId: string,
  profileId: string
): Promise<Stripe.Checkout.Session> {
  const session = await stripe.checkout.sessions.create({
    customer: customerId,
    mode: 'subscription',
    payment_method_types: ['card'],
    line_items: [
      {
        price: priceId,
        quantity: 1,
      },
    ],
    success_url: process.env.NEXT_PUBLIC_APP_URL + '/dashboard/subscription?success=true',
    cancel_url: process.env.NEXT_PUBLIC_APP_URL + '/dashboard/subscription?canceled=true',
    metadata: {
      profileId,
    },
    subscription_data: {
      metadata: {
        profileId,
      },
    },
  });

  return session;
}

export async function createBillingPortalSession(
  customerId: string
): Promise<Stripe.BillingPortal.Session> {
  const session = await stripe.billingPortal.sessions.create({
    customer: customerId,
    return_url: process.env.NEXT_PUBLIC_APP_URL + '/dashboard/subscription',
  });

  return session;
}

export async function cancelSubscription(
  subscriptionId: string
): Promise<Stripe.Subscription> {
  const subscription = await stripe.subscriptions.cancel(subscriptionId);
  return subscription;
}

export async function getSubscription(
  subscriptionId: string
): Promise<Stripe.Subscription | null> {
  try {
    const subscription = await stripe.subscriptions.retrieve(subscriptionId);
    return subscription;
  } catch {
    return null;
  }
}
