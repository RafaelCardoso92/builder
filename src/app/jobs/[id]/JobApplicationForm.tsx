'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  Send,
  AlertCircle,
  CheckCircle,
  PoundSterling,
  Calendar,
  AlertTriangle,
} from 'lucide-react';

interface JobApplicationFormProps {
  jobId: string;
  subscriptionTier: 'FREE' | 'PRO' | 'PREMIUM';
}

export default function JobApplicationForm({
  jobId,
  subscriptionTier,
}: JobApplicationFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [limitReached, setLimitReached] = useState(false);
  const [success, setSuccess] = useState(false);

  const [formData, setFormData] = useState({
    coverLetter: '',
    proposedBudget: '',
    proposedStartDate: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setLimitReached(false);

    try {
      const res = await fetch(`/api/jobs/${jobId}/apply`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        if (data.limitReached) {
          setLimitReached(true);
        }
        throw new Error(data.error || 'Failed to submit application');
      }

      setSuccess(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="text-center py-6">
        <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle className="w-7 h-7 text-green-600" />
        </div>
        <h3 className="text-lg font-semibold text-slate-900 mb-2">
          Application Submitted!
        </h3>
        <p className="text-slate-600 mb-4">
          The customer will review your application and get in touch if
          interested.
        </p>
        <button
          onClick={() => router.push('/dashboard/applications')}
          className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
        >
          View My Applications
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div
          className={`flex items-start gap-2 p-4 rounded-lg ${
            limitReached ? 'bg-orange-50 text-orange-700' : 'bg-red-50 text-red-700'
          }`}
        >
          {limitReached ? (
            <AlertTriangle className="w-5 h-5 flex-shrink-0 mt-0.5" />
          ) : (
            <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
          )}
          <div>
            <p>{error}</p>
            {limitReached && (
              <Link
                href="/dashboard/subscription"
                className="inline-block mt-2 text-sm font-medium underline"
              >
                Upgrade your subscription
              </Link>
            )}
          </div>
        </div>
      )}

      {/* Cover Letter */}
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-2">
          Cover Letter <span className="text-red-500">*</span>
        </label>
        <textarea
          value={formData.coverLetter}
          onChange={(e) =>
            setFormData({ ...formData, coverLetter: e.target.value })
          }
          placeholder="Introduce yourself and explain why you're the right person for this job. Include relevant experience and any questions you have about the project."
          required
          minLength={50}
          rows={5}
          className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
        />
        <p className="text-xs text-slate-500 mt-1">
          Minimum 50 characters ({formData.coverLetter.length}/50)
        </p>
      </div>

      {/* Budget & Date */}
      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Your Quote (optional)
          </label>
          <div className="relative">
            <PoundSterling className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="number"
              value={formData.proposedBudget}
              onChange={(e) =>
                setFormData({ ...formData, proposedBudget: e.target.value })
              }
              placeholder="e.g., 500"
              min="1"
              className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Available From (optional)
          </label>
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="date"
              value={formData.proposedStartDate}
              onChange={(e) =>
                setFormData({ ...formData, proposedStartDate: e.target.value })
              }
              min={new Date().toISOString().split('T')[0]}
              className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>
        </div>
      </div>

      {/* Subscription Info */}
      {subscriptionTier === 'FREE' && (
        <div className="flex items-start gap-2 p-3 bg-slate-50 rounded-lg text-sm text-slate-600">
          <AlertTriangle className="w-4 h-4 flex-shrink-0 mt-0.5" />
          <p>
            Free accounts can apply to 5 jobs per month.{' '}
            <Link
              href="/dashboard/subscription"
              className="text-primary-600 hover:underline"
            >
              Upgrade
            </Link>{' '}
            for more applications.
          </p>
        </div>
      )}

      {/* Submit */}
      <button
        type="submit"
        disabled={loading || formData.coverLetter.length < 50}
        className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-primary-600 text-white font-medium rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <Send className="w-5 h-5" />
        {loading ? 'Submitting...' : 'Submit Application'}
      </button>
    </form>
  );
}
