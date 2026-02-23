import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import AdBanner from './AdBanner';

interface AdWrapperProps {
  variant?: 'top' | 'sidebar' | 'inline';
  className?: string;
}

export default async function AdWrapper({ variant = 'top', className = '' }: AdWrapperProps) {
  const session = await getServerSession(authOptions);

  // If user is logged in and is a tradesperson, check their subscription
  if (session?.user?.id && session.user.role === 'TRADESPERSON') {
    const profile = await prisma.tradesProfile.findUnique({
      where: { userId: session.user.id },
      select: { subscriptionTier: true },
    });

    // PAID users don't see ads
    if (profile?.subscriptionTier === 'PAID') {
      return null;
    }
  }

  // Show ads for:
  // - Unauthenticated users
  // - Customers (non-tradespeople)
  // - FREE tier tradespeople
  return <AdBanner variant={variant} className={className} />;
}
