'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Star } from 'lucide-react';

interface ReviewFormProps {
  profile: {
    id: string;
    businessName: string;
    slug: string;
  };
}

const workTypes = [
  'Repair',
  'Installation',
  'Maintenance',
  'Full project',
  'Consultation',
  'Emergency callout',
  'Other',
];

const costRanges = [
  'Under £100',
  '£100 - £250',
  '£250 - £500',
  '£500 - £1,000',
  '£1,000 - £2,500',
  '£2,500 - £5,000',
  '£5,000 - £10,000',
  'Over £10,000',
];

function StarRating({
  label,
  value,
  onChange,
  required = false,
}: {
  label: string;
  value: number;
  onChange: (rating: number) => void;
  required?: boolean;
}) {
  const [hovered, setHovered] = useState(0);

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-slate-700">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => onChange(star)}
            onMouseEnter={() => setHovered(star)}
            onMouseLeave={() => setHovered(0)}
            className="p-1 transition-transform hover:scale-110"
          >
            <Star
              className={`w-8 h-8 ${
                star <= (hovered || value)
                  ? 'fill-amber-400 text-amber-400'
                  : 'text-slate-300'
              }`}
            />
          </button>
        ))}
      </div>
    </div>
  );
}

export default function ReviewForm({ profile }: ReviewFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Ratings
  const [overallRating, setOverallRating] = useState(0);
  const [qualityRating, setQualityRating] = useState(0);
  const [reliabilityRating, setReliabilityRating] = useState(0);
  const [valueRating, setValueRating] = useState(0);

  // Review content
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  // Work details
  const [workType, setWorkType] = useState('');
  const [workDate, setWorkDate] = useState('');
  const [cost, setCost] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (overallRating === 0) {
      setError('Please provide an overall rating');
      return;
    }

    if (!title.trim()) {
      setError('Please provide a review title');
      return;
    }

    if (!content.trim()) {
      setError('Please write your review');
      return;
    }

    if (content.trim().length < 50) {
      setError('Please write at least 50 characters in your review');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          profileId: profile.id,
          overallRating,
          qualityRating: qualityRating || null,
          reliabilityRating: reliabilityRating || null,
          valueRating: valueRating || null,
          title: title.trim(),
          content: content.trim(),
          workType: workType || null,
          workDate: workDate || null,
          cost: cost || null,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to submit review');
      }

      router.push('/' + profile.slug + '?reviewed=true');
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to submit review');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
          {error}
        </div>
      )}

      {/* Rating Section */}
      <div className="space-y-6">
        <h3 className="text-lg font-semibold text-slate-900 border-b border-slate-200 pb-2">
          Your Ratings
        </h3>

        <StarRating
          label="Overall Rating"
          value={overallRating}
          onChange={setOverallRating}
          required
        />

        <div className="grid sm:grid-cols-3 gap-6">
          <StarRating
            label="Quality of Work"
            value={qualityRating}
            onChange={setQualityRating}
          />
          <StarRating
            label="Reliability"
            value={reliabilityRating}
            onChange={setReliabilityRating}
          />
          <StarRating
            label="Value for Money"
            value={valueRating}
            onChange={setValueRating}
          />
        </div>
      </div>

      {/* Review Content */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-slate-900 border-b border-slate-200 pb-2">
          Your Review
        </h3>

        <div>
          <label htmlFor="title" className="block text-sm font-medium text-slate-700 mb-1">
            Review Title <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Summarise your experience"
            maxLength={100}
            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          />
        </div>

        <div>
          <label htmlFor="content" className="block text-sm font-medium text-slate-700 mb-1">
            Your Review <span className="text-red-500">*</span>
          </label>
          <textarea
            id="content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={6}
            placeholder="Tell others about your experience. What work was done? How was the quality? Would you recommend them?"
            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          />
          <p className="text-sm text-slate-500 mt-1">
            {content.length} characters (minimum 50)
          </p>
        </div>
      </div>

      {/* Work Details */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-slate-900 border-b border-slate-200 pb-2">
          Work Details (Optional)
        </h3>

        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="workType" className="block text-sm font-medium text-slate-700 mb-1">
              Type of Work
            </label>
            <select
              id="workType"
              value={workType}
              onChange={(e) => setWorkType(e.target.value)}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            >
              <option value="">Select type</option>
              {workTypes.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="workDate" className="block text-sm font-medium text-slate-700 mb-1">
              When was the work done?
            </label>
            <input
              type="month"
              id="workDate"
              value={workDate}
              onChange={(e) => setWorkDate(e.target.value)}
              max={new Date().toISOString().slice(0, 7)}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            />
          </div>
        </div>

        <div>
          <label htmlFor="cost" className="block text-sm font-medium text-slate-700 mb-1">
            Approximate Cost
          </label>
          <select
            id="cost"
            value={cost}
            onChange={(e) => setCost(e.target.value)}
            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          >
            <option value="">Select cost range</option>
            {costRanges.map((range) => (
              <option key={range} value={range}>
                {range}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Terms */}
      <div className="bg-slate-50 rounded-lg p-4">
        <p className="text-sm text-slate-600">
          By submitting this review, you confirm that it is based on a genuine experience
          and that you have not been offered any incentive to write it. Reviews may be
          moderated before publication.
        </p>
      </div>

      {/* Submit */}
      <div className="flex gap-4">
        <button
          type="button"
          onClick={() => router.back()}
          className="flex-1 px-6 py-3 border border-slate-300 text-slate-700 font-medium rounded-lg hover:bg-slate-50"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={loading}
          className="flex-1 px-6 py-3 bg-primary-600 text-white font-medium rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Submitting...' : 'Submit Review'}
        </button>
      </div>
    </form>
  );
}
