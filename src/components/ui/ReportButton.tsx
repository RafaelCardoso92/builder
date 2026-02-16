'use client';

import { useState } from 'react';
import { Flag, AlertTriangle, X, CheckCircle } from 'lucide-react';

interface ReportButtonProps {
  targetType: 'REVIEW' | 'PROFILE' | 'MESSAGE';
  targetId: string;
  className?: string;
  variant?: 'icon' | 'text' | 'full';
}

const reasonOptions = [
  { value: 'SPAM', label: 'Spam', description: 'Unsolicited advertising or irrelevant content' },
  { value: 'FAKE_REVIEW', label: 'Fake Review', description: 'Review appears to be fabricated or not genuine' },
  { value: 'INAPPROPRIATE_CONTENT', label: 'Inappropriate Content', description: 'Contains offensive or unsuitable material' },
  { value: 'HARASSMENT', label: 'Harassment', description: 'Bullying, threats, or personal attacks' },
  { value: 'MISLEADING_INFO', label: 'Misleading Information', description: 'False or deceptive claims' },
  { value: 'OFFENSIVE_LANGUAGE', label: 'Offensive Language', description: 'Profanity or hate speech' },
  { value: 'SCAM', label: 'Scam', description: 'Fraudulent or deceptive business practices' },
  { value: 'OTHER', label: 'Other', description: 'Something else not listed above' },
];

export default function ReportButton({
  targetType,
  targetId,
  className = '',
  variant = 'icon',
}: ReportButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedReason, setSelectedReason] = useState('');
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async () => {
    if (!selectedReason) {
      setError('Please select a reason for your report');
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      const response = await fetch('/api/reports', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          targetType,
          targetId,
          reason: selectedReason,
          description: description.trim() || null,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to submit report');
      }

      setSuccess(true);
      setTimeout(() => {
        setIsOpen(false);
        setSuccess(false);
        setSelectedReason('');
        setDescription('');
      }, 2000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to submit report');
    } finally {
      setIsSubmitting(false);
    }
  };

  const getTargetLabel = () => {
    switch (targetType) {
      case 'REVIEW':
        return 'review';
      case 'PROFILE':
        return 'profile';
      case 'MESSAGE':
        return 'message';
      default:
        return 'content';
    }
  };

  return (
    <>
      {variant === 'icon' && (
        <button
          onClick={() => setIsOpen(true)}
          className={'p-2 text-slate-400 hover:text-red-500 transition-colors ' + className}
          title="Report this content"
        >
          <Flag className="w-4 h-4" />
        </button>
      )}

      {variant === 'text' && (
        <button
          onClick={() => setIsOpen(true)}
          className={'text-sm text-slate-500 hover:text-red-600 transition-colors ' + className}
        >
          Report
        </button>
      )}

      {variant === 'full' && (
        <button
          onClick={() => setIsOpen(true)}
          className={'inline-flex items-center gap-2 px-3 py-1.5 text-sm text-slate-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors ' + className}
        >
          <Flag className="w-4 h-4" />
          Report
        </button>
      )}

      {isOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            {success ? (
              <div className="p-8 text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="text-lg font-semibold text-slate-900 mb-2">
                  Report Submitted
                </h3>
                <p className="text-slate-600">
                  Thank you for your report. Our team will review it shortly.
                </p>
              </div>
            ) : (
              <>
                <div className="flex items-center justify-between p-4 border-b border-slate-200">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                      <Flag className="w-5 h-5 text-red-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-slate-900">Report {getTargetLabel()}</h3>
                      <p className="text-sm text-slate-500">Help us understand the issue</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="p-2 text-slate-400 hover:text-slate-600"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="p-4">
                  {error && (
                    <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-lg flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4 flex-shrink-0" />
                      <span className="text-sm">{error}</span>
                    </div>
                  )}

                  <div className="mb-4">
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Why are you reporting this {getTargetLabel()}?
                    </label>
                    <div className="space-y-2">
                      {reasonOptions.map((option) => (
                        <label
                          key={option.value}
                          className={
                            'flex items-start gap-3 p-3 rounded-lg border cursor-pointer transition-colors ' +
                            (selectedReason === option.value
                              ? 'border-primary-500 bg-primary-50'
                              : 'border-slate-200 hover:border-slate-300')
                          }
                        >
                          <input
                            type="radio"
                            name="reason"
                            value={option.value}
                            checked={selectedReason === option.value}
                            onChange={(e) => setSelectedReason(e.target.value)}
                            className="mt-0.5"
                          />
                          <div>
                            <p className="font-medium text-slate-900">{option.label}</p>
                            <p className="text-sm text-slate-500">{option.description}</p>
                          </div>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div className="mb-4">
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Additional details (optional)
                    </label>
                    <textarea
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="Provide any additional context that might help us understand the issue..."
                      className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none"
                      rows={3}
                      maxLength={1000}
                    />
                    <p className="text-xs text-slate-400 mt-1 text-right">
                      {description.length}/1000
                    </p>
                  </div>

                  <div className="flex gap-3">
                    <button
                      onClick={() => setIsOpen(false)}
                      disabled={isSubmitting}
                      className="flex-1 px-4 py-2 border border-slate-200 text-slate-700 font-medium rounded-lg hover:bg-slate-50 disabled:opacity-50"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleSubmit}
                      disabled={isSubmitting || !selectedReason}
                      className="flex-1 px-4 py-2 bg-red-600 text-white font-medium rounded-lg hover:bg-red-700 disabled:opacity-50"
                    >
                      {isSubmitting ? 'Submitting...' : 'Submit Report'}
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}
