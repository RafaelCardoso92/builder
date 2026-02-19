import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import {
  Users,
  Building2,
  Shield,
  Star,
  Flag,
  Clock,
  CheckCircle,
  XCircle,
  Search,
  ArrowRight,
} from 'lucide-react';

async function getStats() {
  const [
    totalUsers,
    totalTradespeople,
    totalCustomers,
    pendingVerifications,
    approvedVerifications,
    pendingReviews,
    flaggedReviews,
    approvedReviews,
    rejectedReviews,
    pendingReports,
    investigatingReports,
    resolvedReports,
    recentUsers,
    recentVerifications,
    recentReviews,
    recentReports,
  ] = await Promise.all([
    prisma.user.count(),
    prisma.user.count({ where: { role: 'TRADESPERSON' } }),
    prisma.user.count({ where: { role: 'CUSTOMER' } }),
    prisma.verification.count({ where: { status: 'PENDING' } }),
    prisma.verification.count({ where: { status: 'APPROVED' } }),
    prisma.review.count({ where: { status: 'PENDING' } }),
    prisma.review.count({ where: { status: 'FLAGGED' } }),
    prisma.review.count({ where: { status: 'APPROVED' } }),
    prisma.review.count({ where: { status: 'REJECTED' } }),
    prisma.report.count({ where: { status: 'PENDING' } }),
    prisma.report.count({ where: { status: 'INVESTIGATING' } }),
    prisma.report.count({ where: { status: 'RESOLVED' } }),
    prisma.user.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      select: { id: true, name: true, email: true, role: true, createdAt: true },
    }),
    prisma.verification.findMany({
      where: { status: 'PENDING' },
      take: 5,
      orderBy: { createdAt: 'desc' },
      include: {
        profile: {
          select: { businessName: true },
        },
      },
    }),
    prisma.review.findMany({
      where: { status: { in: ['PENDING', 'FLAGGED'] } },
      take: 5,
      orderBy: { createdAt: 'desc' },
      include: {
        profile: { select: { businessName: true } },
        author: { select: { name: true } },
      },
    }),
    prisma.report.findMany({
      where: { status: { in: ['PENDING', 'INVESTIGATING'] } },
      take: 5,
      orderBy: { createdAt: 'desc' },
      include: {
        reporter: { select: { name: true } },
      },
    }),
  ]);

  return {
    totalUsers,
    totalTradespeople,
    totalCustomers,
    pendingVerifications,
    approvedVerifications,
    pendingReviews,
    flaggedReviews,
    approvedReviews,
    rejectedReviews,
    pendingReports,
    investigatingReports,
    resolvedReports,
    recentUsers,
    recentVerifications,
    recentReviews,
    recentReports,
  };
}

const reasonLabels: Record<string, string> = {
  SPAM: 'Spam',
  FAKE_REVIEW: 'Fake Review',
  INAPPROPRIATE_CONTENT: 'Inappropriate',
  HARASSMENT: 'Harassment',
  MISLEADING_INFO: 'Misleading',
  OFFENSIVE_LANGUAGE: 'Offensive',
  SCAM: 'Scam',
  OTHER: 'Other',
};

export default async function AdminDashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== 'ADMIN') {
    redirect('/');
  }

  const stats = await getStats();

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900">Admin Dashboard</h1>
        <p className="text-slate-600 mt-1">
          Overview of platform activity and pending actions
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <Users className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-slate-500">Total Users</p>
              <p className="text-2xl font-bold text-slate-900">{stats.totalUsers}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <Building2 className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-slate-500">Tradespeople</p>
              <p className="text-2xl font-bold text-slate-900">{stats.totalTradespeople}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
              <Shield className="w-6 h-6 text-orange-600" />
            </div>
            <div>
              <p className="text-sm text-slate-500">Pending Verifications</p>
              <p className="text-2xl font-bold text-slate-900">{stats.pendingVerifications}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
              <Flag className="w-6 h-6 text-red-600" />
            </div>
            <div>
              <p className="text-sm text-slate-500">Open Reports</p>
              <p className="text-2xl font-bold text-slate-900">
                {stats.pendingReports + stats.investigatingReports}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Review Stats */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-slate-900">Review Moderation</h2>
          <Link
            href="/admin/reviews"
            className="text-sm text-primary-600 hover:text-primary-700 flex items-center gap-1"
          >
            View All <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="p-4 bg-orange-50 rounded-lg">
            <div className="flex items-center gap-2 text-orange-700 mb-1">
              <Clock className="w-4 h-4" />
              <span className="text-sm font-medium">Pending</span>
            </div>
            <p className="text-2xl font-bold text-orange-900">{stats.pendingReviews}</p>
          </div>
          <div className="p-4 bg-yellow-50 rounded-lg">
            <div className="flex items-center gap-2 text-yellow-700 mb-1">
              <Flag className="w-4 h-4" />
              <span className="text-sm font-medium">Flagged</span>
            </div>
            <p className="text-2xl font-bold text-yellow-900">{stats.flaggedReviews}</p>
          </div>
          <div className="p-4 bg-green-50 rounded-lg">
            <div className="flex items-center gap-2 text-green-700 mb-1">
              <CheckCircle className="w-4 h-4" />
              <span className="text-sm font-medium">Approved</span>
            </div>
            <p className="text-2xl font-bold text-green-900">{stats.approvedReviews}</p>
          </div>
          <div className="p-4 bg-red-50 rounded-lg">
            <div className="flex items-center gap-2 text-red-700 mb-1">
              <XCircle className="w-4 h-4" />
              <span className="text-sm font-medium">Rejected</span>
            </div>
            <p className="text-2xl font-bold text-red-900">{stats.rejectedReviews}</p>
          </div>
        </div>
      </div>

      {/* Report Stats */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-slate-900">User Reports</h2>
          <Link
            href="/admin/reports"
            className="text-sm text-primary-600 hover:text-primary-700 flex items-center gap-1"
          >
            View All <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
        <div className="grid grid-cols-3 gap-4">
          <div className="p-4 bg-orange-50 rounded-lg">
            <div className="flex items-center gap-2 text-orange-700 mb-1">
              <Clock className="w-4 h-4" />
              <span className="text-sm font-medium">Pending</span>
            </div>
            <p className="text-2xl font-bold text-orange-900">{stats.pendingReports}</p>
          </div>
          <div className="p-4 bg-blue-50 rounded-lg">
            <div className="flex items-center gap-2 text-blue-700 mb-1">
              <Search className="w-4 h-4" />
              <span className="text-sm font-medium">Investigating</span>
            </div>
            <p className="text-2xl font-bold text-blue-900">{stats.investigatingReports}</p>
          </div>
          <div className="p-4 bg-green-50 rounded-lg">
            <div className="flex items-center gap-2 text-green-700 mb-1">
              <CheckCircle className="w-4 h-4" />
              <span className="text-sm font-medium">Resolved</span>
            </div>
            <p className="text-2xl font-bold text-green-900">{stats.resolvedReports}</p>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Pending Verifications */}
        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-slate-900">Pending Verifications</h2>
            <Link
              href="/admin/verifications?status=PENDING"
              className="text-sm text-primary-600 hover:text-primary-700 flex items-center gap-1"
            >
              View All <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {stats.recentVerifications.length === 0 ? (
            <p className="text-slate-500 text-center py-8">No pending verifications</p>
          ) : (
            <div className="space-y-3">
              {stats.recentVerifications.map((v) => (
                <Link
                  key={v.id}
                  href={'/admin/verifications/' + v.id}
                  className="flex items-center justify-between p-3 rounded-lg hover:bg-slate-50"
                >
                  <div>
                    <p className="font-medium text-slate-900">{v.profile.businessName}</p>
                    <p className="text-sm text-slate-500">{v.type}</p>
                  </div>
                  <span className="text-sm text-slate-400">
                    {new Date(v.createdAt).toLocaleDateString()}
                  </span>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Open Reports */}
        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-slate-900">Open Reports</h2>
            <Link
              href="/admin/reports?status=PENDING"
              className="text-sm text-primary-600 hover:text-primary-700 flex items-center gap-1"
            >
              View All <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {stats.recentReports.length === 0 ? (
            <p className="text-slate-500 text-center py-8">No open reports</p>
          ) : (
            <div className="space-y-3">
              {stats.recentReports.map((r) => (
                <Link
                  key={r.id}
                  href={'/admin/reports/' + r.id}
                  className="flex items-center justify-between p-3 rounded-lg hover:bg-slate-50"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-medium text-slate-900">{r.targetType} Report</p>
                      <span
                        className={
                          'px-2 py-0.5 text-xs font-medium rounded-full ' +
                          (r.status === 'INVESTIGATING'
                            ? 'bg-blue-100 text-blue-700'
                            : 'bg-orange-100 text-orange-700')
                        }
                      >
                        {r.status}
                      </span>
                    </div>
                    <p className="text-sm text-slate-500">
                      {reasonLabels[r.reason]} • by {r.reporter.name}
                    </p>
                  </div>
                  <span className="text-sm text-slate-400">
                    {new Date(r.createdAt).toLocaleDateString()}
                  </span>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Reviews Needing Attention */}
        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-slate-900">Reviews Needing Attention</h2>
            <Link
              href="/admin/reviews?status=PENDING"
              className="text-sm text-primary-600 hover:text-primary-700 flex items-center gap-1"
            >
              View All <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {stats.recentReviews.length === 0 ? (
            <p className="text-slate-500 text-center py-8">No reviews need attention</p>
          ) : (
            <div className="space-y-3">
              {stats.recentReviews.map((r) => (
                <Link
                  key={r.id}
                  href={'/admin/reviews/' + r.id}
                  className="flex items-center justify-between p-3 rounded-lg hover:bg-slate-50"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="font-medium text-slate-900 truncate">{r.title}</p>
                      <span
                        className={
                          'px-2 py-0.5 text-xs font-medium rounded-full ' +
                          (r.status === 'FLAGGED'
                            ? 'bg-yellow-100 text-yellow-700'
                            : 'bg-orange-100 text-orange-700')
                        }
                      >
                        {r.status}
                      </span>
                    </div>
                    <p className="text-sm text-slate-500">
                      {r.author.name} → {r.profile.businessName}
                    </p>
                  </div>
                  <div className="flex items-center gap-1 text-yellow-500">
                    {[...Array(r.overallRating)].map((_, i) => (
                      <Star key={i} className="w-3 h-3 fill-current" />
                    ))}
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Recent Users */}
        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-slate-900">Recent Registrations</h2>
          </div>

          <div className="space-y-3">
            {stats.recentUsers.map((user) => (
              <div
                key={user.id}
                className="flex items-center justify-between p-3 rounded-lg hover:bg-slate-50"
              >
                <div>
                  <p className="font-medium text-slate-900">{user.name}</p>
                  <p className="text-sm text-slate-500">{user.email}</p>
                </div>
                <span
                  className={
                    'px-2 py-0.5 text-xs font-medium rounded-full ' +
                    (user.role === 'TRADESPERSON'
                      ? 'bg-blue-100 text-blue-700'
                      : user.role === 'ADMIN'
                      ? 'bg-purple-100 text-purple-700'
                      : 'bg-slate-100 text-slate-700')
                  }
                >
                  {user.role}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
