'use client';

import { useState } from 'react';
import { MessageSquare, AlertCircle, CheckCircle, Send } from 'lucide-react';

const disputeReasons = [
  { value: 'PAYMENT_MADE', label: 'Payment has been made' },
  { value: 'WORK_NOT_COMPLETED', label: 'Work was not completed as described' },
  { value: 'QUALITY_ISSUES', label: 'Quality issues with the work' },
  { value: 'DISPUTED_AMOUNT', label: 'The amount claimed is incorrect' },
  { value: 'WRONG_PERSON', label: 'I am not the person described' },
  { value: 'FALSE_INFORMATION', label: 'The report contains false information' },
  { value: 'OTHER', label: 'Other reason' },
];

interface DisputeFormProps {
  reportId: string;
}

export default function DisputeForm({ reportId }: DisputeFormProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const [formData, setFormData] = useState({
    reason: '',
    explanation: '',
    contactEmail: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch(`/api/bad-payers/${reportId}/dispute`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to submit dispute');
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
      <div className="bg-green-50 border border-green-200 rounded-xl p-6">
        <div className="flex items-center gap-3 mb-4">
          <CheckCircle className="w-6 h-6 text-green-600" />
          <h3 className="font-semibold text-green-900">Dispute Submitted</h3>
        </div>
        <p className="text-sm text-green-800">
          Your dispute has been submitted and is pending review. We will contact
          you at the email address provided once the dispute has been reviewed.
        </p>
      </div>
    );
  }

  if (!isOpen) {
    return (
      <div className="bg-slate-50 border border-slate-200 rounded-xl p-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-semibold text-slate-900">Dispute This Report</h3>
            <p className="text-sm text-slate-600 mt-1">
              If you believe this report is inaccurate, you can submit a dispute.
            </p>
          </div>
          <button
            onClick={() => setIsOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-orange-600 text-white font-medium rounded-lg hover:bg-orange-700"
          >
            <MessageSquare className="w-4 h-4" />
            File Dispute
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-orange-50 border border-orange-200 rounded-xl p-6">
      <div className="flex items-center gap-3 mb-6">
        <MessageSquare className="w-6 h-6 text-orange-600" />
        <h3 className="font-semibold text-orange-900">Submit a Dispute</h3>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="flex items-start gap-3 p-4 bg-red-50 text-red-700 rounded-lg">
            <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
            <p className="text-sm">{error}</p>
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Reason for Dispute <span className="text-red-500">*</span>
          </label>
          <select
            value={formData.reason}
            onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
            required
            className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 bg-white"
          >
            <option value="">Select a reason...</option>
            {disputeReasons.map((reason) => (
              <option key={reason.value} value={reason.value}>
                {reason.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Explanation <span className="text-red-500">*</span>
          </label>
          <textarea
            value={formData.explanation}
            onChange={(e) =>
              setFormData({ ...formData, explanation: e.target.value })
            }
            required
            rows={4}
            minLength={50}
            placeholder="Please provide details supporting your dispute. Include any relevant dates, amounts, or evidence you can provide."
            className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
          />
          <p className="text-xs text-slate-500 mt-1">
            Minimum 50 characters. {formData.explanation.length}/50
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Contact Email <span className="text-red-500">*</span>
          </label>
          <input
            type="email"
            value={formData.contactEmail}
            onChange={(e) =>
              setFormData({ ...formData, contactEmail: e.target.value })
            }
            required
            placeholder="your@email.com"
            className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
          />
          <p className="text-xs text-slate-500 mt-1">
            We will use this email to contact you about your dispute.
          </p>
        </div>

        <div className="flex items-center gap-4 pt-4">
          <button
            type="button"
            onClick={() => setIsOpen(false)}
            className="px-4 py-2 text-slate-600 hover:text-slate-900"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading || formData.explanation.length < 50}
            className="flex-1 flex items-center justify-center gap-2 py-3 px-4 bg-orange-600 text-white font-medium rounded-lg hover:bg-orange-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              'Submitting...'
            ) : (
              <>
                <Send className="w-4 h-4" />
                Submit Dispute
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
