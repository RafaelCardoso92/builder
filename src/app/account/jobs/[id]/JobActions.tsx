'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { MoreVertical, XCircle, CheckCircle } from 'lucide-react';

interface Job {
  id: string;
  status: string;
}

interface JobActionsProps {
  job: Job;
}

export default function JobActions({ job }: JobActionsProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleStatusUpdate = async (newStatus: string) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/jobs/${job.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });

      if (res.ok) {
        router.refresh();
      }
    } catch (error) {
      console.error('Failed to update job:', error);
    } finally {
      setLoading(false);
      setOpen(false);
    }
  };

  const handleClose = async () => {
    if (!confirm('Are you sure you want to close this job? It will no longer accept applications.')) {
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`/api/jobs/${job.id}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        router.refresh();
      }
    } catch (error) {
      console.error('Failed to close job:', error);
    } finally {
      setLoading(false);
      setOpen(false);
    }
  };

  if (job.status === 'CLOSED' || job.status === 'COMPLETED') {
    return null;
  }

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="p-2 hover:bg-slate-100 rounded-lg"
      >
        <MoreVertical className="w-5 h-5 text-slate-600" />
      </button>

      {open && (
        <>
          <div
            className="fixed inset-0 z-10"
            onClick={() => setOpen(false)}
          />
          <div className="absolute right-0 top-full mt-1 w-48 bg-white rounded-lg shadow-lg border border-slate-200 z-20 py-1">
            {job.status === 'IN_PROGRESS' && (
              <button
                onClick={() => handleStatusUpdate('COMPLETED')}
                disabled={loading}
                className="w-full flex items-center gap-2 px-4 py-2 text-sm text-left text-slate-700 hover:bg-slate-50 disabled:opacity-50"
              >
                <CheckCircle className="w-4 h-4 text-emerald-600" />
                Mark as Completed
              </button>
            )}
            <button
              onClick={handleClose}
              disabled={loading}
              className="w-full flex items-center gap-2 px-4 py-2 text-sm text-left text-red-600 hover:bg-red-50 disabled:opacity-50"
            >
              <XCircle className="w-4 h-4" />
              Close Job
            </button>
          </div>
        </>
      )}
    </div>
  );
}
