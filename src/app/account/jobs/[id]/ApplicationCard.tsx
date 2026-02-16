'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  Star,
  Shield,
  Phone,
  Mail,
  MapPin,
  PoundSterling,
  Calendar,
  CheckCircle,
  XCircle,
  Bookmark,
  ExternalLink,
} from 'lucide-react';

interface Application {
  id: string;
  coverLetter: string;
  proposedBudget: number | null;
  proposedStartDate: Date | null;
  status: string;
  createdAt: Date;
  profile: {
    id: string;
    businessName: string;
    slug: string;
    phone: string;
    email: string;
    city: string;
    postcode: string;
    averageRating: number;
    reviewCount: number;
    isVerified: boolean;
    logo: string | null;
  };
}

interface ApplicationCardProps {
  application: Application;
  jobId: string;
  disabled?: boolean;
}

const statusConfig: Record<string, { label: string; color: string }> = {
  PENDING: { label: 'Pending', color: 'bg-orange-100 text-orange-700' },
  VIEWED: { label: 'Viewed', color: 'bg-slate-100 text-slate-700' },
  SHORTLISTED: { label: 'Shortlisted', color: 'bg-blue-100 text-blue-700' },
  ACCEPTED: { label: 'Accepted', color: 'bg-emerald-100 text-emerald-700' },
  DECLINED: { label: 'Declined', color: 'bg-red-100 text-red-700' },
  WITHDRAWN: { label: 'Withdrawn', color: 'bg-slate-100 text-slate-500' },
};

export default function ApplicationCard({
  application,
  jobId,
  disabled = false,
}: ApplicationCardProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [expanded, setExpanded] = useState(false);

  const handleStatusUpdate = async (newStatus: string) => {
    setLoading(true);
    try {
      const res = await fetch(
        `/api/jobs/${jobId}/applications/${application.id}`,
        {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ status: newStatus }),
        }
      );

      if (res.ok) {
        router.refresh();
      }
    } catch (error) {
      console.error('Failed to update application:', error);
    } finally {
      setLoading(false);
    }
  };

  const status = statusConfig[application.status] || statusConfig.PENDING;
  const profile = application.profile;

  return (
    <div
      className={`bg-white rounded-xl border border-slate-200 overflow-hidden ${
        disabled ? 'opacity-60' : ''
      }`}
    >
      <div className="p-6">
        <div className="flex gap-4">
          {/* Avatar */}
          <div className="flex-shrink-0">
            {profile.logo ? (
              <img
                src={profile.logo}
                alt={profile.businessName}
                className="w-14 h-14 rounded-xl object-cover"
              />
            ) : (
              <div className="w-14 h-14 bg-primary-100 rounded-xl flex items-center justify-center">
                <span className="text-xl font-bold text-primary-600">
                  {profile.businessName.charAt(0)}
                </span>
              </div>
            )}
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <Link
                    href={`/${profile.slug}`}
                    className="text-lg font-semibold text-slate-900 hover:text-primary-600"
                  >
                    {profile.businessName}
                  </Link>
                  {profile.isVerified && (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-green-100 text-green-700 text-xs font-medium rounded-full">
                      <Shield className="w-3 h-3" />
                      Verified
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-3 mt-1 text-sm text-slate-600">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-4 h-4" />
                    {profile.city}
                  </span>
                  {profile.reviewCount > 0 && (
                    <span className="flex items-center gap-1">
                      <Star className="w-4 h-4 text-yellow-400 fill-current" />
                      {profile.averageRating.toFixed(1)} ({profile.reviewCount})
                    </span>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span
                  className={`px-2 py-1 text-xs font-medium rounded-full ${status.color}`}
                >
                  {status.label}
                </span>
              </div>
            </div>

            {/* Quote Info */}
            <div className="flex flex-wrap gap-4 mt-3 text-sm text-slate-600">
              {application.proposedBudget && (
                <span className="flex items-center gap-1 font-medium text-slate-900">
                  <PoundSterling className="w-4 h-4" />
                  {application.proposedBudget.toLocaleString()}
                </span>
              )}
              {application.proposedStartDate && (
                <span className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  Available from{' '}
                  {new Date(application.proposedStartDate).toLocaleDateString(
                    'en-GB',
                    { day: 'numeric', month: 'short' }
                  )}
                </span>
              )}
              <span className="text-slate-400">
                Applied{' '}
                {new Date(application.createdAt).toLocaleDateString('en-GB', {
                  day: 'numeric',
                  month: 'short',
                })}
              </span>
            </div>

            {/* Cover Letter */}
            <div className="mt-4">
              <p
                className={`text-slate-600 ${
                  expanded ? '' : 'line-clamp-3'
                } whitespace-pre-line`}
              >
                {application.coverLetter}
              </p>
              {application.coverLetter.length > 200 && (
                <button
                  onClick={() => setExpanded(!expanded)}
                  className="text-primary-600 text-sm hover:underline mt-1"
                >
                  {expanded ? 'Show less' : 'Read more'}
                </button>
              )}
            </div>

            {/* Contact Info (shown for accepted/shortlisted) */}
            {(application.status === 'ACCEPTED' ||
              application.status === 'SHORTLISTED') && (
              <div className="flex flex-wrap gap-4 mt-4 pt-4 border-t border-slate-100">
                <a
                  href={`tel:${profile.phone}`}
                  className="flex items-center gap-2 text-sm text-slate-600 hover:text-primary-600"
                >
                  <Phone className="w-4 h-4" />
                  {profile.phone}
                </a>
                <a
                  href={`mailto:${profile.email}`}
                  className="flex items-center gap-2 text-sm text-slate-600 hover:text-primary-600"
                >
                  <Mail className="w-4 h-4" />
                  {profile.email}
                </a>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Actions */}
      {!disabled && application.status !== 'ACCEPTED' && (
        <div className="px-6 py-3 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
          <Link
            href={`/${profile.slug}`}
            target="_blank"
            className="text-sm text-slate-600 hover:text-primary-600 flex items-center gap-1"
          >
            <ExternalLink className="w-4 h-4" />
            View Profile
          </Link>

          <div className="flex items-center gap-2">
            {application.status !== 'SHORTLISTED' &&
              application.status !== 'DECLINED' && (
                <button
                  onClick={() => handleStatusUpdate('SHORTLISTED')}
                  disabled={loading}
                  className="inline-flex items-center gap-1 px-3 py-1.5 text-sm border border-blue-200 text-blue-700 rounded-lg hover:bg-blue-50 disabled:opacity-50"
                >
                  <Bookmark className="w-4 h-4" />
                  Shortlist
                </button>
              )}
            {application.status !== 'DECLINED' && (
              <button
                onClick={() => handleStatusUpdate('DECLINED')}
                disabled={loading}
                className="inline-flex items-center gap-1 px-3 py-1.5 text-sm border border-red-200 text-red-700 rounded-lg hover:bg-red-50 disabled:opacity-50"
              >
                <XCircle className="w-4 h-4" />
                Decline
              </button>
            )}
            <button
              onClick={() => handleStatusUpdate('ACCEPTED')}
              disabled={loading}
              className="inline-flex items-center gap-1 px-3 py-1.5 text-sm bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 disabled:opacity-50"
            >
              <CheckCircle className="w-4 h-4" />
              Accept
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
