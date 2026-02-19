import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import {
  Shield,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  ExternalLink,
  Filter,
} from 'lucide-react';

async function getVerifications(status?: string) {
  const where = status && status !== 'all' ? { status: status as 'PENDING' | 'APPROVED' | 'REJECTED' | 'EXPIRED' } : {};

  const verifications = await prisma.verification.findMany({
    where,
    include: {
      profile: {
        select: {
          businessName: true,
          slug: true,
          user: {
            select: { email: true },
          },
        },
      },
    },
    orderBy: [
      { status: 'asc' }, // PENDING first
      { createdAt: 'asc' },
    ],
  });

  return verifications;
}

const statusConfig = {
  PENDING: {
    label: 'Pending',
    icon: Clock,
    className: 'bg-orange-100 text-orange-700',
  },
  APPROVED: {
    label: 'Approved',
    icon: CheckCircle,
    className: 'bg-green-100 text-green-700',
  },
  REJECTED: {
    label: 'Rejected',
    icon: XCircle,
    className: 'bg-red-100 text-red-700',
  },
  EXPIRED: {
    label: 'Expired',
    icon: AlertCircle,
    className: 'bg-slate-100 text-slate-700',
  },
};

function formatVerificationType(type: string) {
  const labels: Record<string, string> = {
    IDENTITY: 'ID Verification',
    INSURANCE: 'Insurance',
    PUBLIC_LIABILITY: 'Public Liability',
    QUALIFICATION: 'Qualification',
    GAS_SAFE: 'Gas Safe',
    NICEIC: 'NICEIC',
    TRUSTMARK: 'TrustMark',
  };
  return labels[type] || type.replace(/_/g, ' ');
}

export default async function AdminVerificationsPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== 'ADMIN') {
    redirect('/');
  }

  const { status } = await searchParams;
  const verifications = await getVerifications(status);

  const counts = {
    all: verifications.length,
    pending: verifications.filter((v) => v.status === 'PENDING').length,
    approved: verifications.filter((v) => v.status === 'APPROVED').length,
    rejected: verifications.filter((v) => v.status === 'REJECTED').length,
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900">Verifications</h1>
        <p className="text-slate-600 mt-1">
          Review and approve tradesperson verification requests
        </p>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 mb-6">
        <div className="flex items-center gap-2">
          <Filter className="w-5 h-5 text-slate-400" />
          <span className="text-sm text-slate-600">Filter:</span>
          <div className="flex gap-2">
            {[
              { value: 'all', label: 'All', count: counts.all },
              { value: 'PENDING', label: 'Pending', count: counts.pending },
              { value: 'APPROVED', label: 'Approved', count: counts.approved },
              { value: 'REJECTED', label: 'Rejected', count: counts.rejected },
            ].map((filter) => (
              <Link
                key={filter.value}
                href={'/admin/verifications' + (filter.value !== 'all' ? '?status=' + filter.value : '')}
                className={
                  'px-3 py-1 text-sm rounded-full transition-colors ' +
                  ((status || 'all') === filter.value
                    ? 'bg-primary-600 text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200')
                }
              >
                {filter.label} ({filter.count})
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Verifications List */}
      {verifications.length === 0 ? (
        <div className="bg-white rounded-xl border border-slate-200 p-12 text-center">
          <Shield className="w-12 h-12 text-slate-300 mx-auto mb-4" />
          <h2 className="text-lg font-semibold text-slate-900 mb-2">No verifications</h2>
          <p className="text-slate-600">
            {status === 'PENDING'
              ? 'No pending verifications to review.'
              : 'No verification requests found.'}
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
          <table className="w-full">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-medium text-slate-500">
                  Business
                </th>
                <th className="px-6 py-3 text-left text-sm font-medium text-slate-500">
                  Type
                </th>
                <th className="px-6 py-3 text-left text-sm font-medium text-slate-500">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-sm font-medium text-slate-500">
                  Submitted
                </th>
                <th className="px-6 py-3 text-right text-sm font-medium text-slate-500">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {verifications.map((v) => {
                const statusInfo = statusConfig[v.status];
                const StatusIcon = statusInfo.icon;

                return (
                  <tr key={v.id} className="hover:bg-slate-50">
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-medium text-slate-900">
                          {v.profile.businessName}
                        </p>
                        <p className="text-sm text-slate-500">
                          {v.profile.user.email}
                        </p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-slate-900">
                        {formatVerificationType(v.type)}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={
                          'inline-flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-full ' +
                          statusInfo.className
                        }
                      >
                        <StatusIcon className="w-3 h-3" />
                        {statusInfo.label}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-500">
                      {new Date(v.createdAt).toLocaleDateString('en-GB', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                      })}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Link
                        href={'/admin/verifications/' + v.id}
                        className="inline-flex items-center gap-1 text-sm text-primary-600 hover:text-primary-700 font-medium"
                      >
                        Review
                        <ExternalLink className="w-4 h-4" />
                      </Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
