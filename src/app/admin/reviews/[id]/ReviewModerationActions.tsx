'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { CheckCircle, XCircle, Flag, AlertTriangle } from 'lucide-react';

interface ReviewModerationActionsProps {
  reviewId: string;
  profileId: string;
  currentStatus: string;
  compact?: boolean;
}

export default function ReviewModerationActions({
  reviewId,
  profileId,
  currentStatus,
  compact = false,
}: ReviewModerationActionsProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectReason, setRejectReason] = useState('');
  const [error, setError] = useState('');

  const handleAction = async (action: 'approve' | 'reject' | 'flag', reason?: string) => {
    setIsLoading(true);
    setError('');

    try {
      const response = await fetch(`/api/admin/reviews/${reviewId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action, reason, profileId }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to update review');
      }

      router.refresh();
      if (showRejectModal) {
        setShowRejectModal(false);
        setRejectReason('');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  if (compact) {
    return (
      <div className="space-y-2">
        {currentStatus !== 'APPROVED' && (
          <button
            onClick={() => handleAction('approve')}
            disabled={isLoading}
            className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 disabled:opacity-50"
          >
            <CheckCircle className="w-4 h-4" />
            Approve
          </button>
        )}
        {currentStatus !== 'REJECTED' && (
          <button
            onClick={() => setShowRejectModal(true)}
            disabled={isLoading}
            className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-red-600 text-white font-medium rounded-lg hover:bg-red-700 disabled:opacity-50"
          >
            <XCircle className="w-4 h-4" />
            Reject
          </button>
        )}
        {currentStatus !== 'FLAGGED' && currentStatus !== 'REJECTED' && (
          <button
            onClick={() => handleAction('flag')}
            disabled={isLoading}
            className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-yellow-600 text-white font-medium rounded-lg hover:bg-yellow-700 disabled:opacity-50"
          >
            <Flag className="w-4 h-4" />
            Flag
          </button>
        )}

        {error && (
          <p className="text-sm text-red-600 mt-2">{error}</p>
        )}

        {showRejectModal && (
          <RejectModal
            isLoading={isLoading}
            reason={rejectReason}
            onReasonChange={setRejectReason}
            onConfirm={() => handleAction('reject', rejectReason)}
            onCancel={() => {
              setShowRejectModal(false);
              setRejectReason('');
            }}
          />
        )}
      </div>
    );
  }

  return (
    <div>
      <h3 className="font-semibold text-slate-900 mb-4">Moderation Actions</h3>

      {error && (
        <div className="p-3 bg-red-50 text-red-700 rounded-lg mb-4 flex items-center gap-2">
          <AlertTriangle className="w-4 h-4" />
          {error}
        </div>
      )}

      <div className="flex flex-wrap gap-3">
        <button
          onClick={() => handleAction('approve')}
          disabled={isLoading || currentStatus === 'APPROVED'}
          className="inline-flex items-center gap-2 px-6 py-3 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <CheckCircle className="w-5 h-5" />
          Approve Review
        </button>

        <button
          onClick={() => setShowRejectModal(true)}
          disabled={isLoading || currentStatus === 'REJECTED'}
          className="inline-flex items-center gap-2 px-6 py-3 bg-red-600 text-white font-medium rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <XCircle className="w-5 h-5" />
          Reject Review
        </button>

        {currentStatus !== 'FLAGGED' && currentStatus !== 'REJECTED' && (
          <button
            onClick={() => handleAction('flag')}
            disabled={isLoading}
            className="inline-flex items-center gap-2 px-6 py-3 bg-yellow-600 text-white font-medium rounded-lg hover:bg-yellow-700 disabled:opacity-50"
          >
            <Flag className="w-5 h-5" />
            Flag for Further Review
          </button>
        )}
      </div>

      <p className="text-sm text-slate-500 mt-4">
        {currentStatus === 'PENDING' && 'This review is awaiting moderation.'}
        {currentStatus === 'FLAGGED' && 'This review has been flagged and needs attention.'}
        {currentStatus === 'APPROVED' && 'This review is currently approved and visible.'}
        {currentStatus === 'REJECTED' && 'This review has been rejected and is not visible.'}
      </p>

      {showRejectModal && (
        <RejectModal
          isLoading={isLoading}
          reason={rejectReason}
          onReasonChange={setRejectReason}
          onConfirm={() => handleAction('reject', rejectReason)}
          onCancel={() => {
            setShowRejectModal(false);
            setRejectReason('');
          }}
        />
      )}
    </div>
  );
}

function RejectModal({
  isLoading,
  reason,
  onReasonChange,
  onConfirm,
  onCancel,
}: {
  isLoading: boolean;
  reason: string;
  onReasonChange: (value: string) => void;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-md w-full p-6">
        <h3 className="text-lg font-semibold text-slate-900 mb-2">
          Reject Review
        </h3>
        <p className="text-slate-600 mb-4">
          Please provide a reason for rejecting this review. This will not be shown to the reviewer.
        </p>

        <textarea
          value={reason}
          onChange={(e) => onReasonChange(e.target.value)}
          placeholder="Reason for rejection..."
          className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none"
          rows={4}
        />

        <div className="flex gap-3 mt-4">
          <button
            onClick={onCancel}
            disabled={isLoading}
            className="flex-1 px-4 py-2 border border-slate-200 text-slate-700 font-medium rounded-lg hover:bg-slate-50 disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={isLoading || !reason.trim()}
            className="flex-1 px-4 py-2 bg-red-600 text-white font-medium rounded-lg hover:bg-red-700 disabled:opacity-50"
          >
            {isLoading ? 'Rejecting...' : 'Reject Review'}
          </button>
        </div>
      </div>
    </div>
  );
}
