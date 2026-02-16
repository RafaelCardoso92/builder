'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { MessageCircle, X } from 'lucide-react';

interface MessageButtonProps {
  recipientId: string;
  recipientName: string;
}

export default function MessageButton({ recipientId, recipientName }: MessageButtonProps) {
  const router = useRouter();
  const [showModal, setShowModal] = useState(false);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!message.trim()) {
      setError('Please enter a message');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('/api/conversations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          recipientId,
          initialMessage: message.trim(),
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        if (response.status === 401) {
          router.push('/login?callbackUrl=' + encodeURIComponent(window.location.pathname));
          return;
        }
        throw new Error(data.error || 'Failed to send message');
      }

      const data = await response.json();
      router.push('/account/messages/' + data.conversation.id);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to send message');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <button
        onClick={() => setShowModal(true)}
        className="flex items-center justify-center gap-2 w-full py-3 px-4 border border-slate-300 text-slate-700 font-medium rounded-lg hover:bg-slate-50 transition-colors"
      >
        <MessageCircle className="w-5 h-5" />
        Send Message
      </button>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setShowModal(false)}
          />

          {/* Modal Content */}
          <div className="relative bg-white rounded-xl shadow-xl w-full max-w-md">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-slate-200">
              <h3 className="text-lg font-semibold text-slate-900">
                Message {recipientName}
              </h3>
              <button
                onClick={() => setShowModal(false)}
                className="p-2 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="p-4">
              {error && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                  {error}
                </div>
              )}

              <div className="mb-4">
                <label htmlFor="message" className="block text-sm font-medium text-slate-700 mb-1">
                  Your Message
                </label>
                <textarea
                  id="message"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  rows={4}
                  placeholder="Hi, I'm interested in your services..."
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                />
              </div>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 px-4 py-2 border border-slate-300 text-slate-700 font-medium rounded-lg hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 px-4 py-2 bg-primary-600 text-white font-medium rounded-lg hover:bg-primary-700 disabled:opacity-50"
                >
                  {loading ? 'Sending...' : 'Send Message'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
