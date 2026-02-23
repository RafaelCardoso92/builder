import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { prisma } from '@/lib/prisma';
import Stripe from 'stripe';

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

async function handleSubscriptionCreated(subscription: Stripe.Subscription) {
  const profileId = subscription.metadata.profileId;
  if (!profileId) return;

  const priceId = subscription.items.data[0]?.price.id;
  const tier: 'FREE' | 'PAID' = priceId === process.env.STRIPE_PAID_PRICE_ID ? 'PAID' : 'FREE';

  await prisma.tradesProfile.update({
    where: { id: profileId },
    data: {
      subscriptionId: subscription.id,
      subscriptionTier: tier,
    },
  });
}

async function handleSubscriptionUpdated(subscription: Stripe.Subscription) {
  const profileId = subscription.metadata.profileId;
  if (!profileId) return;

  const priceId = subscription.items.data[0]?.price.id;
  const tier: 'FREE' | 'PAID' = priceId === process.env.STRIPE_PAID_PRICE_ID ? 'PAID' : 'FREE';

  // Handle subscription status
  if (subscription.status === 'active' || subscription.status === 'trialing') {
    await prisma.tradesProfile.update({
      where: { id: profileId },
      data: {
        subscriptionId: subscription.id,
        subscriptionTier: tier,
      },
    });
  } else if (
    subscription.status === 'canceled' ||
    subscription.status === 'unpaid' ||
    subscription.status === 'past_due'
  ) {
    await prisma.tradesProfile.update({
      where: { id: profileId },
      data: {
        subscriptionId: null,
        subscriptionTier: 'FREE',
      },
    });
  }
}

async function handleSubscriptionDeleted(subscription: Stripe.Subscription) {
  const profileId = subscription.metadata.profileId;
  if (!profileId) return;

  await prisma.tradesProfile.update({
    where: { id: profileId },
    data: {
      subscriptionId: null,
      subscriptionTier: 'FREE',
    },
  });
}

async function handleCheckoutCompleted(session: Stripe.Checkout.Session) {
  if (session.mode !== 'subscription') return;

  const profileId = session.metadata?.profileId;
  const subscriptionId = session.subscription as string;

  if (!profileId || !subscriptionId) return;

  // Get subscription details
  const subscription = await stripe.subscriptions.retrieve(subscriptionId);
  const priceId = subscription.items.data[0]?.price.id;
  const tier: 'FREE' | 'PAID' = priceId === process.env.STRIPE_PAID_PRICE_ID ? 'PAID' : 'FREE';

  await prisma.tradesProfile.update({
    where: { id: profileId },
    data: {
      subscriptionId,
      subscriptionTier: tier,
    },
  });
}

export async function POST(request: NextRequest) {
  const body = await request.text();
  const signature = request.headers.get('stripe-signature');

  if (!signature) {
    return NextResponse.json(
      { error: 'Missing stripe-signature header' },
      { status: 400 }
    );
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (err) {
    console.error('Webhook signature verification failed:', err);
    return NextResponse.json(
      { error: 'Invalid signature' },
      { status: 400 }
    );
  }

  try {
    switch (event.type) {
      case 'customer.subscription.created':
        await handleSubscriptionCreated(event.data.object as Stripe.Subscription);
        break;
      case 'customer.subscription.updated':
        await handleSubscriptionUpdated(event.data.object as Stripe.Subscription);
        break;
      case 'customer.subscription.deleted':
        await handleSubscriptionDeleted(event.data.object as Stripe.Subscription);
        break;
      case 'checkout.session.completed':
        await handleCheckoutCompleted(event.data.object as Stripe.Checkout.Session);
        break;
      default:
        // Stripe sends many event types - we only process the ones above
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Error processing webhook:', error);
    return NextResponse.json(
      { error: 'Webhook handler failed' },
      { status: 500 }
    );
  }
}
