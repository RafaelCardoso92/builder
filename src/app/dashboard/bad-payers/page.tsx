import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import {
  AlertTriangle,
  Plus,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  PoundSterling,
  FileText,
  MessageSquare,
} from 'lucide-react';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

import type { LucideIcon } from 'lucide-react';

const statusConfig: Record<string, { label: string; color: string; icon: LucideIcon }> = {
  DRAFT: { label: 'Draft', color: 'bg-slate-100 text-slate-700', icon: FileText },
  PENDING_REVIEW: { label: 'Pending Review', color: 'bg-yellow-100 text-yellow-700', icon: Clock },
  PUBLISHED: { label: 'Published', color: 'bg-green-100 text-green-700', icon: CheckCircle },
  DISPUTED: { label: 'Disputed', color: 'bg-orange-100 text-orange-700', icon: AlertCircle },
  RESOLVED: { label: 'Resolved', color: 'bg-blue-100 text-blue-700', icon: CheckCircle },
  REJECTED: { label: 'Rejected', color: 'bg-red-100 text-red-700', icon: XCircle },
  REMOVED: { label: 'Removed', color: 'bg-slate-100 text-slate-700', icon: XCircle },
  EXPIRED: { label: 'Expired', color: 'bg-slate-100 text-slate-700', icon: Clock },
};

async function getMyReports(profileId: string) {
  const reports = await prisma.badPayerReport.findMany({
    where: { reporterId: profileId },
    include: {
      _count: {
        select: {
          evidence: true,
          disputes: true,
        },
      },
    },
    orderBy: { createdAt: 'desc' },
  });

  const stats = {
    total: reports.length,
    pending: reports.filter((r) => r.status === 'PENDING_REVIEW').length,
    published: reports.filter((r) => r.status === 'PUBLISHED').length,
    totalOwed: reports.reduce((sum, r) => sum + r.amountOwed, 0),
  };

  return { reports, stats };
}

export default async function BadPayersPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    redirect('/login?callbackUrl=/dashboard/bad-payers');
  }

  const profile = await prisma.tradesProfile.findUnique({
    where: { userId: session.user.id },
  });

  if (!profile) {
    redirect('/dashboard');
  }

  const { reports, stats } = await getMyReports(profile.id);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Bad Payer Reports</h1>
          <p className="text-slate-600 mt-1">
            Report non-paying customers to protect fellow tradespeople
          </p>
        </div>
        <Link
          href="/dashboard/bad-payers/new"
          className="inline-flex items-center gap-2 px-4 py-2 bg-primary-600 text-white font-medium rounded-lg hover:bg-primary-700"
        >
          <Plus className="w-5 h-5" />
          Submit Report
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl border border-slate-200 p-4">
          <p className="text-sm text-slate-600">Total Reports</p>
          <p className="text-2xl font-bold text-slate-900">{stats.total}</p>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-4">
          <p className="text-sm text-slate-600">Pending Review</p>
          <p className="text-2xl font-bold text-yellow-600">{stats.pending}</p>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-4">
          <p className="text-sm text-slate-600">Published</p>
          <p className="text-2xl font-bold text-green-600">{stats.published}</p>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-4">
          <p className="text-sm text-slate-600">Total Amount Owed</p>
          <p className="text-2xl font-bold text-red-600">
            £{stats.totalOwed.toLocaleString()}
          </p>
        </div>
      </div>

      {/* Reports List */}
      <div className="bg-white rounded-xl border border-slate-200">
        <div className="p-4 border-b border-slate-200">
          <h2 className="font-semibold text-slate-900">Your Reports</h2>
        </div>

        {reports.length === 0 ? (
          <div className="p-12 text-center">
            <AlertTriangle className="w-12 h-12 text-slate-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-slate-900 mb-2">No reports yet</h3>
            <p className="text-slate-600 mb-6">
              You have not submitted any bad payer reports yet.
            </p>
            <Link
              href="/dashboard/bad-payers/new"
              className="inline-flex items-center gap-2 px-6 py-3 bg-primary-600 text-white font-medium rounded-lg hover:bg-primary-700"
            >
              <Plus className="w-5 h-5" />
              Submit Your First Report
            </Link>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {reports.map((report) => {
              const config = statusConfig[report.status] || statusConfig.DRAFT;
              const StatusIcon = config.icon;

              return (
                <Link
                  key={report.id}
                  href={`/bad-payers/${report.id}`}
                  className="flex items-start gap-4 p-4 hover:bg-slate-50 transition-colors"
                >
                  <div className="flex-shrink-0 mt-1">
                    <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                      <AlertTriangle className="w-5 h-5 text-red-600" />
                    </div>
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${config.color}`}>
                        <StatusIcon className="w-3 h-3" />
                        {config.label}
                      </span>
                      {report._count.disputes > 0 && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-700">
                          <MessageSquare className="w-3 h-3" />
                          {report._count.disputes} dispute(s)
                        </span>
                      )}
                    </div>

                    <p className="text-slate-900 font-medium line-clamp-1">
                      {report.workDescription}
                    </p>

                    <div className="flex items-center gap-4 mt-2 text-sm text-slate-500">
                      <span>{report.locationArea}</span>
                      <span>
                        {new Date(report.incidentDate).toLocaleDateString('en-GB', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric',
                        })}
                      </span>
                    </div>
                  </div>

                  <div className="flex-shrink-0 text-right">
                    <p className="text-lg font-bold text-red-600 flex items-center gap-1">
                      <PoundSterling className="w-4 h-4" />
                      {report.amountOwed.toLocaleString()}
                    </p>
                    <p className="text-xs text-slate-500">owed</p>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>

      {/* Info Box */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
        <h3 className="font-semibold text-blue-900 mb-2">How it works</h3>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>1. Submit a report with details of the non-payment incident</li>
          <li>2. Our team reviews the report for accuracy and compliance</li>
          <li>3. Once approved, the report is published publicly</li>
          <li>4. The accused party can dispute the report if they believe it is inaccurate</li>
          <li>5. Reports expire after 2 years or when resolved</li>
        </ul>
      </div>
    </div>
  );
}
