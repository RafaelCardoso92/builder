'use client';

import { useState } from 'react';
import { Settings, Loader2, Sparkles } from 'lucide-react';

interface SubscriptionActionsProps {
  hasSubscription: boolean;
  targetTier?: 'PAID';
  buttonText?: string;
  highlighted?: boolean;
}

export default function SubscriptionActions({
  hasSubscription,
  targetTier,
  buttonText = 'Manage Subscription',
  highlighted = false,
}: SubscriptionActionsProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleCheckout = async () => {
    if (!targetTier) return;

    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tier: targetTier }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create checkout session');
      }

      // Redirect to Stripe Checkout
      window.location.href = data.url;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
      setLoading(false);
    }
  };

  const handleBillingPortal = async () => {
    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/stripe/billing-portal', {
        method: 'POST',
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to open billing portal');
      }

      // Redirect to Stripe Billing Portal
      window.location.href = data.url;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
      setLoading(false);
    }
  };

  if (hasSubscription) {
    return (
      <div>
        {error && (
          <p className="text-red-600 text-sm mb-2">{error}</p>
        )}
        <button
          onClick={handleBillingPortal}
          disabled={loading}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 border border-slate-300 text-slate-700 font-medium rounded-xl hover:bg-slate-50 active:bg-slate-100 disabled:opacity-50 transition-colors text-sm sm:text-base w-full sm:w-auto"
        >
          {loading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Settings className="w-4 h-4" />
          )}
          {loading ? 'Loading...' : 'Manage Billing'}
        </button>
      </div>
    );
  }

  return (
    <div>
      {error && (
        <p className="text-red-600 text-sm mb-3 text-center">{error}</p>
      )}
      <button
        onClick={handleCheckout}
        disabled={loading}
        className={
          'w-full flex items-center justify-center gap-2 py-3.5 px-6 font-semibold rounded-xl transition-all disabled:opacity-50 text-base ' +
          (highlighted
            ? 'bg-primary-600 text-white hover:bg-primary-700 active:bg-primary-800 shadow-lg shadow-primary-600/25 hover:shadow-xl hover:shadow-primary-600/30'
            : 'bg-slate-100 text-slate-700 hover:bg-slate-200 active:bg-slate-300')
        }
      >
        {loading ? (
          <Loader2 className="w-5 h-5 animate-spin" />
        ) : (
          <Sparkles className="w-5 h-5" />
        )}
        {loading ? 'Processing...' : buttonText}
      </button>
    </div>
  );
}
