import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import {
  Flag,
  Clock,
  Search,
  CheckCircle,
  XCircle,
  Filter,
  ExternalLink,
  Star,
  Building2,
  MessageCircle,
} from 'lucide-react';

async function getReports(status?: string, targetType?: string) {
  const where: any = {};
  if (status && status !== 'all') {
    where.status = status;
  }
  if (targetType && targetType !== 'all') {
    where.targetType = targetType;
  }

  const reports = await prisma.report.findMany({
    where,
    include: {
      reporter: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
    },
    orderBy: [
      { status: 'asc' },
      { createdAt: 'desc' },
    ],
  });

  return reports;
}

const statusConfig = {
  PENDING: {
    label: 'Pending',
    icon: Clock,
    className: 'bg-orange-100 text-orange-700',
  },
  INVESTIGATING: {
    label: 'Investigating',
    icon: Search,
    className: 'bg-blue-100 text-blue-700',
  },
  RESOLVED: {
    label: 'Resolved',
    icon: CheckCircle,
    className: 'bg-green-100 text-green-700',
  },
  DISMISSED: {
    label: 'Dismissed',
    icon: XCircle,
    className: 'bg-slate-100 text-slate-700',
  },
};

const targetTypeConfig = {
  REVIEW: {
    label: 'Review',
    icon: Star,
    className: 'bg-yellow-100 text-yellow-700',
  },
  PROFILE: {
    label: 'Profile',
    icon: Building2,
    className: 'bg-purple-100 text-purple-700',
  },
  MESSAGE: {
    label: 'Message',
    icon: MessageCircle,
    className: 'bg-blue-100 text-blue-700',
  },
};

const reasonLabels: Record<string, string> = {
  SPAM: 'Spam',
  FAKE_REVIEW: 'Fake Review',
  INAPPROPRIATE_CONTENT: 'Inappropriate Content',
  HARASSMENT: 'Harassment',
  MISLEADING_INFO: 'Misleading Info',
  OFFENSIVE_LANGUAGE: 'Offensive Language',
  SCAM: 'Scam',
  OTHER: 'Other',
};

export default async function AdminReportsPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; targetType?: string }>;
}) {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== 'ADMIN') {
    redirect('/');
  }

  const { status, targetType } = await searchParams;
  const reports = await getReports(status, targetType);

  const counts = {
    all: reports.length,
    pending: reports.filter((r) => r.status === 'PENDING').length,
    investigating: reports.filter((r) => r.status === 'INVESTIGATING').length,
    resolved: reports.filter((r) => r.status === 'RESOLVED').length,
    dismissed: reports.filter((r) => r.status === 'DISMISSED').length,
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900">Reports</h1>
        <p className="text-slate-600 mt-1">
          Review and handle user reports
        </p>
      </div>

      {/* Status Filters */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 mb-4">
        <div className="flex items-center gap-2 flex-wrap">
          <Filter className="w-5 h-5 text-slate-400" />
          <span className="text-sm text-slate-600">Status:</span>
          <div className="flex gap-2 flex-wrap">
            {[
              { value: 'all', label: 'All', count: counts.all },
              { value: 'PENDING', label: 'Pending', count: counts.pending },
              { value: 'INVESTIGATING', label: 'Investigating', count: counts.investigating },
              { value: 'RESOLVED', label: 'Resolved', count: counts.resolved },
              { value: 'DISMISSED', label: 'Dismissed', count: counts.dismissed },
            ].map((filter) => {
              const href = '/admin/reports' +
                (filter.value !== 'all' || targetType
                  ? '?' +
                    (filter.value !== 'all' ? 'status=' + filter.value : '') +
                    (filter.value !== 'all' && targetType ? '&' : '') +
                    (targetType ? 'targetType=' + targetType : '')
                  : '');

              return (
                <Link
                  key={filter.value}
                  href={href}
                  className={
                    'px-3 py-1 text-sm rounded-full transition-colors ' +
                    ((status || 'all') === filter.value
                      ? 'bg-primary-600 text-white'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200')
                  }
                >
                  {filter.label} ({filter.count})
                </Link>
              );
            })}
          </div>
        </div>
      </div>

      {/* Type Filters */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 mb-6">
        <div className="flex items-center gap-2 flex-wrap">
          <Flag className="w-5 h-5 text-slate-400" />
          <span className="text-sm text-slate-600">Type:</span>
          <div className="flex gap-2 flex-wrap">
            {[
              { value: 'all', label: 'All Types' },
              { value: 'REVIEW', label: 'Reviews' },
              { value: 'PROFILE', label: 'Profiles' },
              { value: 'MESSAGE', label: 'Messages' },
            ].map((filter) => {
              const href = '/admin/reports' +
                (filter.value !== 'all' || status
                  ? '?' +
                    (status ? 'status=' + status : '') +
                    (status && filter.value !== 'all' ? '&' : '') +
                    (filter.value !== 'all' ? 'targetType=' + filter.value : '')
                  : '');

              return (
                <Link
                  key={filter.value}
                  href={href}
                  className={
                    'px-3 py-1 text-sm rounded-full transition-colors ' +
                    ((targetType || 'all') === filter.value
                      ? 'bg-slate-800 text-white'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200')
                  }
                >
                  {filter.label}
                </Link>
              );
            })}
          </div>
        </div>
      </div>

      {/* Reports List */}
      {reports.length === 0 ? (
        <div className="bg-white rounded-xl border border-slate-200 p-12 text-center">
          <Flag className="w-12 h-12 text-slate-300 mx-auto mb-4" />
          <h2 className="text-lg font-semibold text-slate-900 mb-2">No reports</h2>
          <p className="text-slate-600">
            {status === 'PENDING'
              ? 'No pending reports to review.'
              : 'No reports found matching your filters.'}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {reports.map((report) => {
            const statusInfo = statusConfig[report.status];
            const typeInfo = targetTypeConfig[report.targetType];
            const StatusIcon = statusInfo.icon;
            const TypeIcon = typeInfo.icon;

            return (
              <div
                key={report.id}
                className="bg-white rounded-xl border border-slate-200 p-6"
              >
                <div className="flex items-start justify-between gap-4 mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span
                        className={
                          'inline-flex items-center gap-1 px-2 py-0.5 text-xs font-medium rounded-full ' +
                          typeInfo.className
                        }
                      >
                        <TypeIcon className="w-3 h-3" />
                        {typeInfo.label}
                      </span>
                      <span
                        className={
                          'inline-flex items-center gap-1 px-2 py-0.5 text-xs font-medium rounded-full ' +
                          statusInfo.className
                        }
                      >
                        <StatusIcon className="w-3 h-3" />
                        {statusInfo.label}
                      </span>
                      <span className="px-2 py-0.5 text-xs font-medium rounded-full bg-red-100 text-red-700">
                        {reasonLabels[report.reason] || report.reason}
                      </span>
                    </div>
                    <h3 className="font-semibold text-slate-900">
                      {report.targetType} Report
                    </h3>
                    {report.description && (
                      <p className="text-slate-600 mt-1 line-clamp-2">{report.description}</p>
                    )}
                  </div>
                  <Link
                    href={'/admin/reports/' + report.id}
                    className="flex-shrink-0 inline-flex items-center gap-1 px-4 py-2 bg-primary-50 text-primary-700 font-medium rounded-lg hover:bg-primary-100"
                  >
                    Review
                    <ExternalLink className="w-4 h-4" />
                  </Link>
                </div>

                <div className="flex items-center gap-6 text-sm text-slate-500">
                  <div>
                    <span className="text-slate-400">Reported by:</span>{' '}
                    <span className="text-slate-700">{report.reporter.name}</span>
                  </div>
                  <div>
                    <span className="text-slate-400">Date:</span>{' '}
                    {new Date(report.createdAt).toLocaleDateString('en-GB', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric',
                    })}
                  </div>
                  <div>
                    <span className="text-slate-400">Target ID:</span>{' '}
                    <span className="font-mono text-xs">{report.targetId.slice(0, 8)}...</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
