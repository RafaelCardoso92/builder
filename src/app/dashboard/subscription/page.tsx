import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { Check, AlertCircle, CheckCircle, Sparkles, Volume2, VolumeX } from 'lucide-react';
import SubscriptionActions from './SubscriptionActions';

async function getProfile(userId: string) {
  return prisma.tradesProfile.findUnique({
    where: { userId },
  });
}

export default async function SubscriptionPage({
  searchParams,
}: {
  searchParams: Promise<{ success?: string; canceled?: string }>;
}) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    redirect('/login');
  }

  const profile = await getProfile(session.user.id);
  const { success, canceled } = await searchParams;

  if (!profile) {
    redirect('/dashboard/profile');
  }

  const currentTier = profile.subscriptionTier;
  const hasActiveSubscription = currentTier === 'PAID' && profile.subscriptionId;
  const isFree = currentTier === 'FREE';

  return (
    <div className="max-w-2xl mx-auto">
      {/* Header */}
      <div className="text-center mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">
          {isFree ? 'Go Ad-Free' : 'Your Subscription'}
        </h1>
        <p className="text-slate-600 mt-2 text-sm sm:text-base">
          {isFree
            ? 'Enjoy an uninterrupted experience for just £10/month'
            : 'Manage your ad-free subscription'}
        </p>
      </div>

      {/* Success/Cancel Messages */}
      {success === 'true' && (
        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-xl flex items-start sm:items-center gap-3">
          <CheckCircle className="w-5 h-5 text-green-600 shrink-0 mt-0.5 sm:mt-0" />
          <p className="text-green-700 text-sm sm:text-base">
            Your subscription is active! Enjoy your ad-free experience.
          </p>
        </div>
      )}

      {canceled === 'true' && (
        <div className="mb-6 p-4 bg-orange-50 border border-orange-200 rounded-xl flex items-start sm:items-center gap-3">
          <AlertCircle className="w-5 h-5 text-orange-600 shrink-0 mt-0.5 sm:mt-0" />
          <p className="text-orange-700 text-sm sm:text-base">
            Checkout was canceled. No charges were made.
          </p>
        </div>
      )}

      {/* Current Plan Status - For paid users */}
      {hasActiveSubscription && (
        <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl border border-green-200 p-5 sm:p-6 mb-6">
          <div className="flex items-start sm:items-center justify-between gap-4 flex-col sm:flex-row">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                <VolumeX className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="font-semibold text-slate-900">Ad-Free Plan</p>
                <p className="text-sm text-green-600">Active</p>
              </div>
            </div>
            <SubscriptionActions hasSubscription={true} />
          </div>
          <p className="text-sm text-slate-600 mt-4">
            Manage billing, update payment method, or cancel anytime.
          </p>
        </div>
      )}

      {/* Upgrade Card - For free users */}
      {isFree && (
        <div className="bg-white rounded-2xl border-2 border-primary-200 shadow-lg shadow-primary-100/50 overflow-hidden mb-6">
          {/* Card Header */}
          <div className="bg-gradient-to-r from-primary-600 to-primary-700 px-5 sm:px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-white">
                <Sparkles className="w-5 h-5" />
                <span className="font-semibold">Ad-Free Plan</span>
              </div>
              <div className="text-white text-right">
                <span className="text-2xl sm:text-3xl font-bold">£10</span>
                <span className="text-primary-200 text-sm">/month</span>
              </div>
            </div>
          </div>

          {/* Card Body */}
          <div className="p-5 sm:p-6">
            {/* Benefits */}
            <div className="space-y-3 mb-6">
              <div className="flex items-start gap-3">
                <div className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center shrink-0 mt-0.5">
                  <Check className="w-3 h-3 text-green-600" />
                </div>
                <div>
                  <p className="font-medium text-slate-900">No advertisements</p>
                  <p className="text-sm text-slate-500">Browse without interruptions</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center shrink-0 mt-0.5">
                  <Check className="w-3 h-3 text-green-600" />
                </div>
                <div>
                  <p className="font-medium text-slate-900">Same great features</p>
                  <p className="text-sm text-slate-500">Unlimited photos, quotes & applications</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center shrink-0 mt-0.5">
                  <Check className="w-3 h-3 text-green-600" />
                </div>
                <div>
                  <p className="font-medium text-slate-900">Cancel anytime</p>
                  <p className="text-sm text-slate-500">No commitment, no hassle</p>
                </div>
              </div>
            </div>

            {/* CTA Button */}
            <SubscriptionActions
              hasSubscription={false}
              targetTier="PAID"
              buttonText="Upgrade Now"
              highlighted={true}
            />

            <p className="text-xs text-slate-400 text-center mt-4">
              Secure payment via Stripe. Cancel anytime.
            </p>
          </div>
        </div>
      )}

      {/* Current Free Plan Info - For free users */}
      {isFree && (
        <div className="bg-slate-50 rounded-xl border border-slate-200 p-5 sm:p-6 mb-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-slate-200 rounded-lg flex items-center justify-center">
              <Volume2 className="w-5 h-5 text-slate-500" />
            </div>
            <div>
              <p className="font-semibold text-slate-900">Free Plan</p>
              <p className="text-sm text-slate-500">Your current plan</p>
            </div>
          </div>
          <ul className="space-y-2 text-sm text-slate-600">
            <li className="flex items-center gap-2">
              <Check className="w-4 h-4 text-slate-400" />
              Full profile listing
            </li>
            <li className="flex items-center gap-2">
              <Check className="w-4 h-4 text-slate-400" />
              Unlimited portfolio photos
            </li>
            <li className="flex items-center gap-2">
              <Check className="w-4 h-4 text-slate-400" />
              Unlimited quote requests
            </li>
            <li className="flex items-center gap-2 text-slate-400">
              <Volume2 className="w-4 h-4" />
              Includes advertisements
            </li>
          </ul>
        </div>
      )}

      {/* FAQ - Collapsible style */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <div className="px-5 sm:px-6 py-4 border-b border-slate-100">
          <h3 className="font-semibold text-slate-900">Common Questions</h3>
        </div>
        <div className="divide-y divide-slate-100">
          <details className="group">
            <summary className="px-5 sm:px-6 py-4 cursor-pointer list-none flex items-center justify-between hover:bg-slate-50 transition-colors">
              <span className="font-medium text-slate-900 text-sm sm:text-base">What&apos;s included in the free plan?</span>
              <span className="text-slate-400 group-open:rotate-180 transition-transform">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </span>
            </summary>
            <p className="px-5 sm:px-6 pb-4 text-sm text-slate-600">
              The free plan includes all features - unlimited portfolio photos, quote requests, and job applications. The only difference is you&apos;ll see advertisements.
            </p>
          </details>
          <details className="group">
            <summary className="px-5 sm:px-6 py-4 cursor-pointer list-none flex items-center justify-between hover:bg-slate-50 transition-colors">
              <span className="font-medium text-slate-900 text-sm sm:text-base">Can I cancel anytime?</span>
              <span className="text-slate-400 group-open:rotate-180 transition-transform">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </span>
            </summary>
            <p className="px-5 sm:px-6 pb-4 text-sm text-slate-600">
              Yes! Cancel anytime with one click. Your ad-free access continues until the end of your billing period.
            </p>
          </details>
          <details className="group">
            <summary className="px-5 sm:px-6 py-4 cursor-pointer list-none flex items-center justify-between hover:bg-slate-50 transition-colors">
              <span className="font-medium text-slate-900 text-sm sm:text-base">How do I pay?</span>
              <span className="text-slate-400 group-open:rotate-180 transition-transform">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </span>
            </summary>
            <p className="px-5 sm:px-6 pb-4 text-sm text-slate-600">
              We accept all major credit and debit cards via Stripe, our secure payment partner.
            </p>
          </details>
        </div>
      </div>
    </div>
  );
}
