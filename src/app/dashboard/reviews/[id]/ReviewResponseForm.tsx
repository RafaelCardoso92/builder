'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

interface ReviewResponseFormProps {
  reviewId: string;
}

export default function ReviewResponseForm({ reviewId }: ReviewResponseFormProps) {
  const router = useRouter();
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (response.trim().length < 10) {
      setError('Response must be at least 10 characters');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch('/api/reviews/' + reviewId + '/respond', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ response: response.trim() }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to submit response');
      }

      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to submit response');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
          {error}
        </div>
      )}

      <div>
        <textarea
          value={response}
          onChange={(e) => setResponse(e.target.value)}
          rows={4}
          placeholder="Thank the customer for their feedback and address any specific points they raised..."
          className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
        />
        <p className="text-sm text-slate-500 mt-1">
          {response.length} characters (minimum 10)
        </p>
      </div>

      <div className="flex gap-3">
        <button
          type="submit"
          disabled={loading}
          className="px-6 py-2 bg-primary-600 text-white font-medium rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Submitting...' : 'Submit Response'}
        </button>
        <button
          type="button"
          onClick={() => router.back()}
          className="px-6 py-2 border border-slate-300 text-slate-700 font-medium rounded-lg hover:bg-slate-50"
        >
          Cancel
        </button>
      </div>

      <p className="text-xs text-slate-500">
        Your response will be visible to everyone viewing this review. Be professional and courteous.
      </p>
    </form>
  );
}
