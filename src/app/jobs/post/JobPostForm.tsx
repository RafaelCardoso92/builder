'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  Briefcase,
  MapPin,
  PoundSterling,
  Clock,
  Image,
  X,
  CheckCircle,
  AlertCircle,
  Send,
} from 'lucide-react';

interface Trade {
  id: string;
  name: string;
  parent: { name: string } | null;
}

interface JobPostFormProps {
  trades: Trade[];
}

const timeframes = [
  { value: 'ASAP', label: 'As soon as possible' },
  { value: '1_WEEK', label: 'Within 1 week' },
  { value: '2_WEEKS', label: 'Within 2 weeks' },
  { value: '1_MONTH', label: 'Within 1 month' },
  { value: 'FLEXIBLE', label: "I'm flexible" },
];

const budgetRanges = [
  { min: null, max: 500, label: 'Under £500' },
  { min: 500, max: 1000, label: '£500 - £1,000' },
  { min: 1000, max: 2500, label: '£1,000 - £2,500' },
  { min: 2500, max: 5000, label: '£2,500 - £5,000' },
  { min: 5000, max: 10000, label: '£5,000 - £10,000' },
  { min: 10000, max: null, label: 'Over £10,000' },
];

export default function JobPostForm({ trades }: JobPostFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [jobId, setJobId] = useState('');

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    tradeId: '',
    postcode: '',
    address: '',
    timeframe: '',
    budgetRange: '',
  });

  const [images, setImages] = useState<string[]>([]);
  const [imageUrl, setImageUrl] = useState('');

  // Group trades by parent
  const tradesByParent = trades.reduce((acc, trade) => {
    const parentName = trade.parent?.name || 'Other';
    if (!acc[parentName]) {
      acc[parentName] = [];
    }
    acc[parentName].push(trade);
    return acc;
  }, {} as Record<string, Trade[]>);

  const handleAddImage = () => {
    if (imageUrl && !images.includes(imageUrl)) {
      setImages([...images, imageUrl]);
      setImageUrl('');
    }
  };

  const handleRemoveImage = (url: string) => {
    setImages(images.filter((img) => img !== url));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const selectedBudget = budgetRanges.find(
        (b) => b.label === formData.budgetRange
      );

      const res = await fetch('/api/jobs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          budgetMin: selectedBudget?.min,
          budgetMax: selectedBudget?.max,
          images,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to post job');
      }

      setSuccess(true);
      setJobId(data.job.id);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="text-center py-8">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle className="w-8 h-8 text-green-600" />
        </div>
        <h2 className="text-xl font-bold text-slate-900 mb-2">Job Posted!</h2>
        <p className="text-slate-600 mb-6">
          Your job is now live. Tradespeople can view and apply to it.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={() => router.push(`/jobs/${jobId}`)}
            className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
          >
            View Job
          </button>
          <button
            onClick={() => router.push('/account/jobs')}
            className="px-6 py-2 border border-slate-300 rounded-lg hover:bg-slate-50"
          >
            My Jobs
          </button>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="flex items-center gap-2 p-4 bg-red-50 text-red-700 rounded-lg">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <p>{error}</p>
        </div>
      )}

      {/* Trade Selection */}
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-2">
          Type of Work <span className="text-red-500">*</span>
        </label>
        <div className="relative">
          <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <select
            value={formData.tradeId}
            onChange={(e) =>
              setFormData({ ...formData, tradeId: e.target.value })
            }
            required
            className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 appearance-none bg-white"
          >
            <option value="">Select a trade</option>
            {Object.entries(tradesByParent).map(([parentName, childTrades]) => (
              <optgroup key={parentName} label={parentName}>
                {childTrades.map((trade) => (
                  <option key={trade.id} value={trade.id}>
                    {trade.name}
                  </option>
                ))}
              </optgroup>
            ))}
          </select>
        </div>
      </div>

      {/* Job Title */}
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-2">
          Job Title <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          placeholder="e.g., Kitchen sink replacement"
          required
          className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
        />
      </div>

      {/* Description */}
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-2">
          Description <span className="text-red-500">*</span>
        </label>
        <textarea
          value={formData.description}
          onChange={(e) =>
            setFormData({ ...formData, description: e.target.value })
          }
          placeholder="Describe the work you need done in detail. Include any specific requirements, materials needed, or access considerations."
          required
          rows={5}
          className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
        />
      </div>

      {/* Photos */}
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-2">
          Photos (optional)
        </label>
        <div className="flex gap-2 mb-3">
          <div className="flex-1 relative">
            <Image className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="url"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              placeholder="Paste image URL"
              className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>
          <button
            type="button"
            onClick={handleAddImage}
            className="px-4 py-3 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200"
          >
            Add
          </button>
        </div>
        {images.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {images.map((img, idx) => (
              <div key={idx} className="relative group">
                <img
                  src={img}
                  alt={`Photo ${idx + 1}`}
                  className="w-20 h-20 object-cover rounded-lg"
                />
                <button
                  type="button"
                  onClick={() => handleRemoveImage(img)}
                  className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Location */}
      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Postcode <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              value={formData.postcode}
              onChange={(e) =>
                setFormData({ ...formData, postcode: e.target.value })
              }
              placeholder="e.g., SW1A 1AA"
              required
              className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Address (optional)
          </label>
          <input
            type="text"
            value={formData.address}
            onChange={(e) =>
              setFormData({ ...formData, address: e.target.value })
            }
            placeholder="Street address"
            className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
        </div>
      </div>

      {/* Timing & Budget */}
      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            When do you need this done?
          </label>
          <div className="relative">
            <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <select
              value={formData.timeframe}
              onChange={(e) =>
                setFormData({ ...formData, timeframe: e.target.value })
              }
              className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 appearance-none bg-white"
            >
              <option value="">Select timeframe</option>
              {timeframes.map((tf) => (
                <option key={tf.value} value={tf.value}>
                  {tf.label}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Estimated Budget
          </label>
          <div className="relative">
            <PoundSterling className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <select
              value={formData.budgetRange}
              onChange={(e) =>
                setFormData({ ...formData, budgetRange: e.target.value })
              }
              className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 appearance-none bg-white"
            >
              <option value="">Select budget range</option>
              {budgetRanges.map((br) => (
                <option key={br.label} value={br.label}>
                  {br.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Submit */}
      <button
        type="submit"
        disabled={loading}
        className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-primary-600 text-white font-medium rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <Send className="w-5 h-5" />
        {loading ? 'Posting...' : 'Post Job'}
      </button>

      <p className="text-sm text-slate-500 text-center">
        By posting a job, you agree to our{' '}
        <Link href="/terms" className="text-primary-600 hover:underline">
          Terms of Service
        </Link>{' '}
        and{' '}
        <Link href="/privacy" className="text-primary-600 hover:underline">
          Privacy Policy
        </Link>
        .
      </p>
    </form>
  );
}
