'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Upload, FileText, X, CheckCircle } from 'lucide-react';

interface VerificationRequestFormProps {
  profileId: string;
  verificationType: string;
}

export default function VerificationRequestForm({
  profileId,
  verificationType,
}: VerificationRequestFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [documentUrl, setDocumentUrl] = useState('');
  const [fileName, setFileName] = useState('');

  // For now, we'll use a simple URL input
  // In production, this would be a file upload to S3/R2

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!documentUrl.trim()) {
      setError('Please provide a document URL or upload a file');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('/api/verifications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: verificationType,
          documentUrl: documentUrl.trim(),
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to submit verification request');
      }

      router.push('/dashboard/verifications?submitted=true');
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
          {error}
        </div>
      )}

      {/* Document URL Input */}
      <div>
        <label htmlFor="documentUrl" className="block text-sm font-medium text-slate-700 mb-1">
          Document URL *
        </label>
        <input
          type="url"
          id="documentUrl"
          value={documentUrl}
          onChange={(e) => setDocumentUrl(e.target.value)}
          placeholder="https://example.com/my-document.pdf"
          className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
        />
        <p className="text-sm text-slate-500 mt-1">
          Upload your document to a cloud service (Google Drive, Dropbox) and paste the sharing link here.
          Make sure the link is accessible.
        </p>
      </div>

      {/* File Upload Placeholder - Would integrate with S3/R2 in production */}
      <div className="border-2 border-dashed border-slate-300 rounded-lg p-8 text-center">
        <Upload className="w-10 h-10 text-slate-400 mx-auto mb-3" />
        <p className="text-slate-600 mb-1">
          Direct file upload coming soon
        </p>
        <p className="text-sm text-slate-500">
          For now, please use a cloud storage link above
        </p>
      </div>

      {/* Terms */}
      <div className="bg-slate-50 rounded-lg p-4">
        <p className="text-sm text-slate-600">
          By submitting this verification request, you confirm that:
        </p>
        <ul className="text-sm text-slate-600 mt-2 space-y-1">
          <li className="flex items-start gap-2">
            <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
            The document you are submitting is genuine and unaltered
          </li>
          <li className="flex items-start gap-2">
            <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
            You are authorised to submit this document
          </li>
          <li className="flex items-start gap-2">
            <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
            The information in the document is current and valid
          </li>
        </ul>
      </div>

      {/* Submit */}
      <div className="flex gap-3">
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
          className="flex-1 px-6 py-3 bg-primary-600 text-white font-medium rounded-lg hover:bg-primary-700 disabled:opacity-50"
        >
          {loading ? 'Submitting...' : 'Submit for Review'}
        </button>
      </div>

      <p className="text-sm text-slate-500 text-center">
        Verifications are typically reviewed within 24-48 hours
      </p>
    </form>
  );
}
