'use client';

import { X, Sparkles } from 'lucide-react';
import { useState } from 'react';
import Link from 'next/link';

interface AdBannerProps {
  variant?: 'top' | 'sidebar' | 'inline';
  className?: string;
}

export default function AdBanner({ variant = 'top', className = '' }: AdBannerProps) {
  const [dismissed, setDismissed] = useState(false);

  if (dismissed) return null;

  if (variant === 'top') {
    return (
      <div className={`bg-gradient-to-r from-slate-100 to-slate-50 border-b border-slate-200 ${className}`}>
        <div className="max-w-7xl mx-auto px-3 sm:px-4 py-2">
          {/* Mobile Layout */}
          <div className="flex sm:hidden items-center justify-between gap-2">
            <div className="flex items-center gap-2 flex-1 min-w-0">
              <span className="text-[10px] text-slate-400 uppercase tracking-wide shrink-0">Ad</span>
              <div className="h-10 bg-slate-200/80 rounded flex items-center justify-center flex-1 min-w-0">
                <span className="text-slate-500 text-xs truncate px-2">Advertisement</span>
              </div>
            </div>
            <div className="flex items-center gap-1 shrink-0">
              <Link
                href="/dashboard/subscription"
                className="p-2 text-primary-600 hover:text-primary-700 hover:bg-primary-50 rounded-lg transition-colors"
                aria-label="Remove ads"
              >
                <Sparkles className="w-4 h-4" />
              </Link>
              <button
                onClick={() => setDismissed(true)}
                className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                aria-label="Dismiss ad"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Desktop Layout */}
          <div className="hidden sm:flex items-center justify-between gap-4">
            <div className="flex-1 flex items-center justify-center gap-3">
              <span className="text-xs text-slate-400 uppercase tracking-wide">Ad</span>
              <div className="h-[50px] bg-slate-200/80 rounded-lg flex items-center justify-center px-8 flex-1 max-w-2xl">
                <span className="text-slate-500 text-sm">Advertisement Space</span>
              </div>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <Link
                href="/dashboard/subscription"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-primary-600 hover:text-primary-700 hover:bg-primary-50 rounded-lg transition-colors"
              >
                <Sparkles className="w-3.5 h-3.5" />
                Go ad-free
              </Link>
              <button
                onClick={() => setDismissed(true)}
                className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                aria-label="Dismiss ad"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (variant === 'sidebar') {
    return (
      <div className={`bg-gradient-to-b from-slate-100 to-slate-50 border border-slate-200 rounded-xl p-4 ${className}`}>
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs text-slate-400 uppercase tracking-wide">Sponsored</span>
          <button
            onClick={() => setDismissed(true)}
            className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-200 rounded-lg transition-colors"
            aria-label="Dismiss ad"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
        <div className="h-[180px] bg-slate-200/80 rounded-lg flex items-center justify-center">
          <span className="text-slate-500 text-sm">Ad Space</span>
        </div>
        <Link
          href="/dashboard/subscription"
          className="flex items-center justify-center gap-1.5 w-full mt-3 py-2 text-sm font-medium text-primary-600 hover:text-primary-700 hover:bg-primary-50 rounded-lg transition-colors"
        >
          <Sparkles className="w-4 h-4" />
          Go ad-free - £10/mo
        </Link>
      </div>
    );
  }

  // inline variant
  return (
    <div className={`bg-gradient-to-r from-slate-50 to-slate-100 border border-slate-200 rounded-xl p-3 sm:p-4 my-4 ${className}`}>
      {/* Mobile Layout - Stacked */}
      <div className="flex sm:hidden flex-col gap-3">
        <div className="flex items-center justify-between">
          <span className="text-[10px] text-slate-400 uppercase tracking-wide">Advertisement</span>
          <button
            onClick={() => setDismissed(true)}
            className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-200 rounded-lg transition-colors"
            aria-label="Dismiss ad"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
        <div className="h-16 bg-slate-200/80 rounded-lg flex items-center justify-center">
          <span className="text-slate-500 text-sm">Ad Space</span>
        </div>
        <Link
          href="/dashboard/subscription"
          className="flex items-center justify-center gap-1.5 py-2 text-sm font-medium text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
        >
          <Sparkles className="w-4 h-4" />
          Remove ads
        </Link>
      </div>

      {/* Desktop Layout */}
      <div className="hidden sm:flex items-center justify-between gap-4">
        <div className="flex items-center gap-3 flex-1">
          <span className="text-xs text-slate-400 uppercase tracking-wide shrink-0">Ad</span>
          <div className="h-[60px] bg-slate-200/80 rounded-lg flex items-center justify-center px-6 flex-1">
            <span className="text-slate-500 text-sm">Advertisement</span>
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <Link
            href="/dashboard/subscription"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-primary-600 hover:text-primary-700 hover:bg-primary-50 rounded-lg transition-colors"
          >
            <Sparkles className="w-3.5 h-3.5" />
            Remove ads
          </Link>
          <button
            onClick={() => setDismissed(true)}
            className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
            aria-label="Dismiss ad"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
