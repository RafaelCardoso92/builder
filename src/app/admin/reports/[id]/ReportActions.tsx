'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Search, CheckCircle, XCircle, AlertTriangle, Ban } from 'lucide-react';

interface ReportActionsProps {
  reportId: string;
  currentStatus: string;
  targetType: string;
  targetId: string;
  compact?: boolean;
}

export default function ReportActions({
  reportId,
  currentStatus,
  targetType,
  targetId,
  compact = false,
}: ReportActionsProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [showResolveModal, setShowResolveModal] = useState(false);
  const [resolution, setResolution] = useState('');
  const [actionTaken, setActionTaken] = useState('');
  const [error, setError] = useState('');

  const handleAction = async (
    action: 'investigate' | 'resolve' | 'dismiss',
    resolutionText?: string,
    contentAction?: string
  ) => {
    setIsLoading(true);
    setError('');

    try {
      const response = await fetch(`/api/admin/reports/${reportId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action,
          resolution: resolutionText,
          contentAction,
          targetType,
          targetId,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to update report');
      }

      router.refresh();
      if (showResolveModal) {
        setShowResolveModal(false);
        setResolution('');
        setActionTaken('');
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
        {currentStatus === 'PENDING' && (
          <button
            onClick={() => handleAction('investigate')}
            disabled={isLoading}
            className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            <Search className="w-4 h-4" />
            Start Investigation
          </button>
        )}
        {(currentStatus === 'PENDING' || currentStatus === 'INVESTIGATING') && (
          <>
            <button
              onClick={() => setShowResolveModal(true)}
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 disabled:opacity-50"
            >
              <CheckCircle className="w-4 h-4" />
              Resolve
            </button>
            <button
              onClick={() => handleAction('dismiss', 'Report dismissed - no action required')}
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-slate-600 text-white font-medium rounded-lg hover:bg-slate-700 disabled:opacity-50"
            >
              <XCircle className="w-4 h-4" />
              Dismiss
            </button>
          </>
        )}

        {error && <p className="text-sm text-red-600 mt-2">{error}</p>}

        {showResolveModal && (
          <ResolveModal
            isLoading={isLoading}
            resolution={resolution}
            actionTaken={actionTaken}
            targetType={targetType}
            onResolutionChange={setResolution}
            onActionChange={setActionTaken}
            onConfirm={() => handleAction('resolve', resolution, actionTaken)}
            onCancel={() => {
              setShowResolveModal(false);
              setResolution('');
              setActionTaken('');
            }}
          />
        )}
      </div>
    );
  }

  return (
    <div>
      <h3 className="font-semibold text-slate-900 mb-4">Report Actions</h3>

      {error && (
        <div className="p-3 bg-red-50 text-red-700 rounded-lg mb-4 flex items-center gap-2">
          <AlertTriangle className="w-4 h-4" />
          {error}
        </div>
      )}

      <div className="flex flex-wrap gap-3">
        {currentStatus === 'PENDING' && (
          <button
            onClick={() => handleAction('investigate')}
            disabled={isLoading}
            className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            <Search className="w-5 h-5" />
            Start Investigation
          </button>
        )}

        <button
          onClick={() => setShowResolveModal(true)}
          disabled={isLoading}
          className="inline-flex items-center gap-2 px-6 py-3 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 disabled:opacity-50"
        >
          <CheckCircle className="w-5 h-5" />
          Resolve Report
        </button>

        <button
          onClick={() => handleAction('dismiss', 'Report dismissed - no action required')}
          disabled={isLoading}
          className="inline-flex items-center gap-2 px-6 py-3 bg-slate-600 text-white font-medium rounded-lg hover:bg-slate-700 disabled:opacity-50"
        >
          <XCircle className="w-5 h-5" />
          Dismiss Report
        </button>
      </div>

      <p className="text-sm text-slate-500 mt-4">
        {currentStatus === 'PENDING' && 'This report is awaiting review.'}
        {currentStatus === 'INVESTIGATING' && 'This report is currently being investigated.'}
        {currentStatus === 'RESOLVED' && 'This report has been resolved.'}
        {currentStatus === 'DISMISSED' && 'This report has been dismissed.'}
      </p>

      {showResolveModal && (
        <ResolveModal
          isLoading={isLoading}
          resolution={resolution}
          actionTaken={actionTaken}
          targetType={targetType}
          onResolutionChange={setResolution}
          onActionChange={setActionTaken}
          onConfirm={() => handleAction('resolve', resolution, actionTaken)}
          onCancel={() => {
            setShowResolveModal(false);
            setResolution('');
            setActionTaken('');
          }}
        />
      )}
    </div>
  );
}

function ResolveModal({
  isLoading,
  resolution,
  actionTaken,
  targetType,
  onResolutionChange,
  onActionChange,
  onConfirm,
  onCancel,
}: {
  isLoading: boolean;
  resolution: string;
  actionTaken: string;
  targetType: string;
  onResolutionChange: (value: string) => void;
  onActionChange: (value: string) => void;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  const contentActions = [
    { value: 'none', label: 'No action on content', description: 'Leave the reported content as-is' },
    ...(targetType === 'REVIEW'
      ? [
          { value: 'reject', label: 'Reject the review', description: 'Remove the review from public view' },
          { value: 'flag', label: 'Flag for further review', description: 'Keep visible but flag internally' },
        ]
      : []),
    ...(targetType === 'PROFILE'
      ? [
          { value: 'deactivate', label: 'Deactivate the profile', description: 'Hide the profile from search' },
        ]
      : []),
    ...(targetType === 'MESSAGE'
      ? [
          { value: 'delete', label: 'Delete the message', description: 'Remove the message permanently' },
        ]
      : []),
  ];

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-slate-200">
          <h3 className="text-lg font-semibold text-slate-900">Resolve Report</h3>
          <p className="text-slate-600 mt-1">
            Provide details about how this report was handled.
          </p>
        </div>

        <div className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Action taken on content
            </label>
            <div className="space-y-2">
              {contentActions.map((action) => (
                <label
                  key={action.value}
                  className={
                    'flex items-start gap-3 p-3 rounded-lg border cursor-pointer transition-colors ' +
                    (actionTaken === action.value
                      ? 'border-primary-500 bg-primary-50'
                      : 'border-slate-200 hover:border-slate-300')
                  }
                >
                  <input
                    type="radio"
                    name="action"
                    value={action.value}
                    checked={actionTaken === action.value}
                    onChange={(e) => onActionChange(e.target.value)}
                    className="mt-0.5"
                  />
                  <div>
                    <p className="font-medium text-slate-900">{action.label}</p>
                    <p className="text-sm text-slate-500">{action.description}</p>
                  </div>
                </label>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Resolution notes
            </label>
            <textarea
              value={resolution}
              onChange={(e) => onResolutionChange(e.target.value)}
              placeholder="Describe what action was taken and why..."
              className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none"
              rows={4}
            />
          </div>
        </div>

        <div className="flex gap-3 p-6 border-t border-slate-200">
          <button
            onClick={onCancel}
            disabled={isLoading}
            className="flex-1 px-4 py-2 border border-slate-200 text-slate-700 font-medium rounded-lg hover:bg-slate-50 disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={isLoading || !actionTaken || !resolution.trim()}
            className="flex-1 px-4 py-2 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 disabled:opacity-50"
          >
            {isLoading ? 'Resolving...' : 'Resolve Report'}
          </button>
        </div>
      </div>
    </div>
  );
}
