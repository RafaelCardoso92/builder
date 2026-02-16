import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { SUBSCRIPTION_TIERS } from '@/lib/stripe';
import { Check, Crown, Zap, AlertCircle, CheckCircle } from 'lucide-react';
import SubscriptionActions from './SubscriptionActions';

async function getProfile(userId: string) {
  return prisma.tradesProfile.findUnique({
    where: { userId },
  });
}

const plans = [
  {
    name: 'Free',
    price: '£0',
    period: 'forever',
    tier: 'FREE' as const,
    description: 'Get started with basic features',
    features: SUBSCRIPTION_TIERS.FREE.features,
    highlighted: false,
  },
  {
    name: 'Pro',
    price: '£29',
    period: '/month',
    tier: 'PRO' as const,
    description: 'For growing businesses',
    features: SUBSCRIPTION_TIERS.PRO.features,
    highlighted: true,
  },
  {
    name: 'Premium',
    price: '£59',
    period: '/month',
    tier: 'PREMIUM' as const,
    description: 'Maximum visibility & features',
    features: SUBSCRIPTION_TIERS.PREMIUM.features,
    highlighted: false,
  },
];

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
  const hasActiveSubscription = currentTier !== 'FREE' && profile.subscriptionId;

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900">Subscription</h1>
        <p className="text-slate-600 mt-1">
          Upgrade your plan to unlock more features and visibility
        </p>
      </div>

      {/* Success/Cancel Messages */}
      {success === 'true' && (
        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center gap-3">
          <CheckCircle className="w-5 h-5 text-green-600" />
          <p className="text-green-700">
            Your subscription has been activated successfully!
          </p>
        </div>
      )}

      {canceled === 'true' && (
        <div className="mb-6 p-4 bg-orange-50 border border-orange-200 rounded-lg flex items-center gap-3">
          <AlertCircle className="w-5 h-5 text-orange-600" />
          <p className="text-orange-700">
            Checkout was canceled. No charges were made.
          </p>
        </div>
      )}

      {/* Current Plan */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 mb-8">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-slate-500">Current Plan</p>
            <p className="text-2xl font-bold text-slate-900 flex items-center gap-2">
              {currentTier === 'PREMIUM' && <Crown className="w-6 h-6 text-yellow-500" />}
              {currentTier === 'PRO' && <Zap className="w-6 h-6 text-purple-500" />}
              {currentTier}
            </p>
          </div>
          {hasActiveSubscription && (
            <SubscriptionActions hasSubscription={true} />
          )}
        </div>
        {hasActiveSubscription && (
          <p className="text-sm text-slate-500 mt-4">
            Manage your subscription, update payment methods, or cancel through the billing portal.
          </p>
        )}
      </div>

      {/* Plans */}
      <div className="grid md:grid-cols-3 gap-6">
        {plans.map((plan) => {
          const isCurrent = currentTier === plan.tier;
          const isUpgrade =
            (currentTier === 'FREE' && plan.tier !== 'FREE') ||
            (currentTier === 'PRO' && plan.tier === 'PREMIUM');
          const isDowngrade =
            (currentTier === 'PREMIUM' && plan.tier !== 'PREMIUM') ||
            (currentTier === 'PRO' && plan.tier === 'FREE');

          return (
            <div
              key={plan.tier}
              className={
                'bg-white rounded-xl border-2 p-6 relative ' +
                (plan.highlighted
                  ? 'border-primary-500 shadow-lg'
                  : isCurrent
                  ? 'border-green-500'
                  : 'border-slate-200')
              }
            >
              {plan.highlighted && !isCurrent && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-primary-600 text-white text-xs font-medium rounded-full">
                  Most Popular
                </span>
              )}

              {isCurrent && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-green-600 text-white text-xs font-medium rounded-full">
                  Current Plan
                </span>
              )}

              <div className="text-center mb-6">
                <h3 className="text-xl font-bold text-slate-900">{plan.name}</h3>
                <div className="mt-2">
                  <span className="text-4xl font-bold text-slate-900">{plan.price}</span>
                  <span className="text-slate-500">{plan.period}</span>
                </div>
                <p className="text-sm text-slate-600 mt-2">{plan.description}</p>
              </div>

              <ul className="space-y-3 mb-6">
                {plan.features.map((feature, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                    <span className="text-sm text-slate-600">{feature}</span>
                  </li>
                ))}
              </ul>

              {isCurrent ? (
                <div className="w-full py-3 px-4 bg-green-100 text-green-700 font-medium rounded-lg text-center">
                  Current Plan
                </div>
              ) : isUpgrade ? (
                <SubscriptionActions
                  hasSubscription={false}
                  targetTier={plan.tier}
                  buttonText={'Upgrade to ' + plan.name}
                  highlighted={plan.highlighted}
                />
              ) : isDowngrade && hasActiveSubscription ? (
                <p className="text-center text-sm text-slate-500 py-3">
                  Manage via billing portal
                </p>
              ) : plan.tier === 'FREE' ? (
                <div className="w-full py-3 px-4 bg-slate-100 text-slate-500 font-medium rounded-lg text-center">
                  Free Forever
                </div>
              ) : null}
            </div>
          );
        })}
      </div>

      {/* Features Comparison */}
      <div className="mt-12 bg-white rounded-xl border border-slate-200 overflow-hidden">
        <div className="p-6 border-b border-slate-200">
          <h3 className="text-lg font-semibold text-slate-900">Feature Comparison</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-medium text-slate-500">Feature</th>
                <th className="px-6 py-3 text-center text-sm font-medium text-slate-500">Free</th>
                <th className="px-6 py-3 text-center text-sm font-medium text-slate-500">Pro</th>
                <th className="px-6 py-3 text-center text-sm font-medium text-slate-500">Premium</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              <tr>
                <td className="px-6 py-4 text-sm text-slate-900">Portfolio Photos</td>
                <td className="px-6 py-4 text-center text-sm text-slate-600">5</td>
                <td className="px-6 py-4 text-center text-sm text-slate-600">20</td>
                <td className="px-6 py-4 text-center text-sm text-slate-600">Unlimited</td>
              </tr>
              <tr>
                <td className="px-6 py-4 text-sm text-slate-900">Quote Requests</td>
                <td className="px-6 py-4 text-center text-sm text-slate-600">10/month</td>
                <td className="px-6 py-4 text-center text-sm text-slate-600">Unlimited</td>
                <td className="px-6 py-4 text-center text-sm text-slate-600">Unlimited</td>
              </tr>
              <tr>
                <td className="px-6 py-4 text-sm text-slate-900">Search Placement</td>
                <td className="px-6 py-4 text-center text-sm text-slate-600">Standard</td>
                <td className="px-6 py-4 text-center text-sm text-slate-600">Boosted</td>
                <td className="px-6 py-4 text-center text-sm text-slate-600">Top</td>
              </tr>
              <tr>
                <td className="px-6 py-4 text-sm text-slate-900">Verification Badges</td>
                <td className="px-6 py-4 text-center text-sm text-slate-600">1</td>
                <td className="px-6 py-4 text-center text-sm text-slate-600">3</td>
                <td className="px-6 py-4 text-center text-sm text-slate-600">Unlimited</td>
              </tr>
              <tr>
                <td className="px-6 py-4 text-sm text-slate-900">Analytics</td>
                <td className="px-6 py-4 text-center text-sm text-slate-600">-</td>
                <td className="px-6 py-4 text-center text-sm text-slate-600">Basic</td>
                <td className="px-6 py-4 text-center text-sm text-slate-600">Advanced</td>
              </tr>
              <tr>
                <td className="px-6 py-4 text-sm text-slate-900">Featured Listing</td>
                <td className="px-6 py-4 text-center text-sm text-slate-600">-</td>
                <td className="px-6 py-4 text-center text-sm text-slate-600">-</td>
                <td className="px-6 py-4 text-center text-sm text-green-600">
                  <Check className="w-5 h-5 mx-auto" />
                </td>
              </tr>
              <tr>
                <td className="px-6 py-4 text-sm text-slate-900">Priority Support</td>
                <td className="px-6 py-4 text-center text-sm text-slate-600">-</td>
                <td className="px-6 py-4 text-center text-sm text-slate-600">-</td>
                <td className="px-6 py-4 text-center text-sm text-green-600">
                  <Check className="w-5 h-5 mx-auto" />
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* FAQ */}
      <div className="mt-12 bg-slate-50 rounded-xl p-6">
        <h3 className="font-semibold text-slate-900 mb-4">Frequently Asked Questions</h3>
        <div className="space-y-4">
          <div>
            <p className="font-medium text-slate-900">Can I cancel anytime?</p>
            <p className="text-sm text-slate-600 mt-1">
              Yes, you can cancel your subscription at any time. Your plan will remain active until the end of the billing period.
            </p>
          </div>
          <div>
            <p className="font-medium text-slate-900">Can I switch between plans?</p>
            <p className="text-sm text-slate-600 mt-1">
              Yes, you can upgrade or downgrade at any time. When upgrading, you will be charged the prorated difference. When downgrading, the change takes effect at the next billing cycle.
            </p>
          </div>
          <div>
            <p className="font-medium text-slate-900">What payment methods do you accept?</p>
            <p className="text-sm text-slate-600 mt-1">
              We accept all major credit and debit cards through our secure payment partner, Stripe.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
