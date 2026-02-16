import { getServerSession } from 'next-auth';
import { redirect, notFound } from 'next/navigation';
import Link from 'next/link';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import {
  ArrowLeft,
  Flag,
  User,
  Clock,
  Search,
  CheckCircle,
  XCircle,
  Star,
  Building2,
  MessageCircle,
  ExternalLink,
  Calendar,
  Mail,
} from 'lucide-react';
import ReportActions from './ReportActions';

async function getReport(id: string) {
  const report = await prisma.report.findUnique({
    where: { id },
    include: {
      reporter: {
        select: {
          id: true,
          name: true,
          email: true,
          createdAt: true,
        },
      },
    },
  });

  return report;
}

async function getReviewDetails(targetId: string) {
  return prisma.review.findUnique({
    where: { id: targetId },
    include: {
      profile: {
        select: {
          id: true,
          businessName: true,
          slug: true,
        },
      },
      author: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
    },
  });
}

async function getProfileDetails(targetId: string) {
  return prisma.tradesProfile.findUnique({
    where: { id: targetId },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
    },
  });
}

async function getMessageDetails(targetId: string) {
  return prisma.message.findUnique({
    where: { id: targetId },
    include: {
      sender: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
      conversation: {
        select: {
          id: true,
        },
      },
    },
  });
}

const statusConfig = {
  PENDING: {
    label: 'Pending Review',
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
  REVIEW: { label: 'Review', icon: Star },
  PROFILE: { label: 'Profile', icon: Building2 },
  MESSAGE: { label: 'Message', icon: MessageCircle },
};

const reasonLabels: Record<string, string> = {
  SPAM: 'Spam',
  FAKE_REVIEW: 'Fake Review',
  INAPPROPRIATE_CONTENT: 'Inappropriate Content',
  HARASSMENT: 'Harassment',
  MISLEADING_INFO: 'Misleading Information',
  OFFENSIVE_LANGUAGE: 'Offensive Language',
  SCAM: 'Scam',
  OTHER: 'Other',
};

export default async function AdminReportDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== 'ADMIN') {
    redirect('/');
  }

  const { id } = await params;
  const report = await getReport(id);

  if (!report) {
    notFound();
  }

  // Fetch target details based on type
  const reviewData = report.targetType === 'REVIEW' ? await getReviewDetails(report.targetId) : null;
  const profileData = report.targetType === 'PROFILE' ? await getProfileDetails(report.targetId) : null;
  const messageData = report.targetType === 'MESSAGE' ? await getMessageDetails(report.targetId) : null;

  const status = statusConfig[report.status];
  const StatusIcon = status.icon;
  const typeInfo = targetTypeConfig[report.targetType];
  const TypeIcon = typeInfo.icon;
  const isPending = report.status === 'PENDING' || report.status === 'INVESTIGATING';

  return (
    <div>
      <Link
        href="/admin/reports"
        className="inline-flex items-center gap-2 text-slate-600 hover:text-slate-900 mb-6"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Reports
      </Link>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Report Summary */}
          <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
            <div className="p-6 border-b border-slate-200">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                    <Flag className="w-6 h-6 text-red-600" />
                  </div>
                  <div>
                    <h1 className="text-xl font-bold text-slate-900">
                      {typeInfo.label} Report
                    </h1>
                    <p className="text-slate-500">
                      {reasonLabels[report.reason] || report.reason}
                    </p>
                  </div>
                </div>
                <span
                  className={
                    'inline-flex items-center gap-2 px-3 py-1.5 text-sm font-medium rounded-full ' +
                    status.className
                  }
                >
                  <StatusIcon className="w-4 h-4" />
                  {status.label}
                </span>
              </div>

              {report.description && (
                <div className="mt-4 p-4 bg-slate-50 rounded-lg">
                  <p className="text-sm font-medium text-slate-700 mb-1">Description from reporter:</p>
                  <p className="text-slate-600">{report.description}</p>
                </div>
              )}
            </div>

            {/* Reported Content */}
            <div className="p-6">
              <h2 className="font-semibold text-slate-900 mb-4 flex items-center gap-2">
                <TypeIcon className="w-5 h-5" />
                Reported Content
              </h2>

              {reviewData && (
                <div className="border border-slate-200 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="flex items-center gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={
                            'w-4 h-4 ' +
                            (i < reviewData.overallRating
                              ? 'text-yellow-400 fill-current'
                              : 'text-slate-200')
                          }
                        />
                      ))}
                    </div>
                    <span
                      className={
                        'px-2 py-0.5 text-xs font-medium rounded-full ' +
                        (reviewData.status === 'APPROVED'
                          ? 'bg-green-100 text-green-700'
                          : reviewData.status === 'FLAGGED'
                          ? 'bg-yellow-100 text-yellow-700'
                          : 'bg-orange-100 text-orange-700')
                      }
                    >
                      {reviewData.status}
                    </span>
                  </div>
                  <h3 className="font-semibold text-slate-900">{reviewData.title}</h3>
                  <p className="text-slate-600 mt-2 whitespace-pre-line">{reviewData.content}</p>
                  <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between text-sm">
                    <div>
                      <span className="text-slate-400">By:</span>{' '}
                      <span className="text-slate-700">{reviewData.author.name}</span>
                    </div>
                    <div>
                      <span className="text-slate-400">For:</span>{' '}
                      <Link
                        href={'/' + reviewData.profile.slug}
                        target="_blank"
                        className="text-primary-600 hover:text-primary-700"
                      >
                        {reviewData.profile.businessName}
                      </Link>
                    </div>
                  </div>
                  <div className="mt-3">
                    <Link
                      href={'/admin/reviews/' + reviewData.id}
                      className="inline-flex items-center gap-1 text-sm text-primary-600 hover:text-primary-700"
                    >
                      View in Review Moderation <ExternalLink className="w-3 h-3" />
                    </Link>
                  </div>
                </div>
              )}

              {profileData && (
                <div className="border border-slate-200 rounded-lg p-4">
                  <div className="flex items-center gap-4 mb-4">
                    {profileData.logo ? (
                      <img
                        src={profileData.logo}
                        alt={profileData.businessName}
                        className="w-16 h-16 rounded-lg object-cover"
                      />
                    ) : (
                      <div className="w-16 h-16 bg-slate-100 rounded-lg flex items-center justify-center">
                        <Building2 className="w-8 h-8 text-slate-400" />
                      </div>
                    )}
                    <div>
                      <h3 className="font-semibold text-slate-900">{profileData.businessName}</h3>
                      <p className="text-slate-500">{profileData.city}</p>
                    </div>
                  </div>
                  {profileData.description && (
                    <p className="text-slate-600 line-clamp-3">{profileData.description}</p>
                  )}
                  <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between text-sm">
                    <div>
                      <span className="text-slate-400">Owner:</span>{' '}
                      <span className="text-slate-700">{profileData.user.name}</span>
                    </div>
                    <Link
                      href={'/' + profileData.slug}
                      target="_blank"
                      className="inline-flex items-center gap-1 text-primary-600 hover:text-primary-700"
                    >
                      View Profile <ExternalLink className="w-3 h-3" />
                    </Link>
                  </div>
                </div>
              )}

              {messageData && (
                <div className="border border-slate-200 rounded-lg p-4">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center">
                      <User className="w-5 h-5 text-slate-400" />
                    </div>
                    <div>
                      <p className="font-medium text-slate-900">{messageData.sender.name}</p>
                      <p className="text-xs text-slate-500">
                        {new Date(messageData.createdAt).toLocaleString()}
                      </p>
                    </div>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-lg">
                    <p className="text-slate-700 whitespace-pre-line">{messageData.content}</p>
                  </div>
                </div>
              )}

              {!reviewData && !profileData && !messageData && (
                <div className="text-center py-8 text-slate-500">
                  <Flag className="w-8 h-8 mx-auto mb-2 text-slate-300" />
                  <p>The reported content has been deleted or is unavailable.</p>
                </div>
              )}
            </div>

            {/* Actions */}
            {isPending && (
              <div className="p-6 bg-slate-50 border-t border-slate-200">
                <ReportActions
                  reportId={report.id}
                  currentStatus={report.status}
                  targetType={report.targetType}
                  targetId={report.targetId}
                />
              </div>
            )}
          </div>

          {/* Resolution Info */}
          {report.resolution && (
            <div className="bg-white rounded-xl border border-slate-200 p-6">
              <h3 className="font-semibold text-slate-900 mb-4">Resolution</h3>
              <p className="text-slate-600">{report.resolution}</p>
              {report.handledAt && (
                <p className="text-sm text-slate-400 mt-3">
                  Handled on{' '}
                  {new Date(report.handledAt).toLocaleDateString('en-GB', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                  })}
                </p>
              )}
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Reporter Info */}
          <div className="bg-white rounded-xl border border-slate-200 p-6">
            <h3 className="font-semibold text-slate-900 mb-4 flex items-center gap-2">
              <User className="w-5 h-5" />
              Reporter
            </h3>

            <div className="space-y-3">
              <div>
                <p className="font-medium text-slate-900">{report.reporter.name}</p>
                <p className="text-sm text-slate-500 flex items-center gap-1">
                  <Mail className="w-3 h-3" />
                  {report.reporter.email}
                </p>
              </div>

              <div className="pt-3 border-t border-slate-100">
                <p className="text-sm text-slate-500">Member since</p>
                <p className="text-slate-900">
                  {new Date(report.reporter.createdAt).toLocaleDateString('en-GB', {
                    month: 'long',
                    year: 'numeric',
                  })}
                </p>
              </div>
            </div>
          </div>

          {/* Report Details */}
          <div className="bg-white rounded-xl border border-slate-200 p-6">
            <h3 className="font-semibold text-slate-900 mb-4 flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              Report Details
            </h3>

            <div className="space-y-3 text-sm">
              <div>
                <p className="text-slate-500">Report ID</p>
                <p className="text-slate-900 font-mono text-xs">{report.id}</p>
              </div>
              <div>
                <p className="text-slate-500">Submitted</p>
                <p className="text-slate-900">
                  {new Date(report.createdAt).toLocaleDateString('en-GB', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </p>
              </div>
              <div>
                <p className="text-slate-500">Target Type</p>
                <p className="text-slate-900">{typeInfo.label}</p>
              </div>
              <div>
                <p className="text-slate-500">Reason</p>
                <p className="text-slate-900">{reasonLabels[report.reason]}</p>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          {!isPending && (
            <div className="bg-white rounded-xl border border-slate-200 p-6">
              <h3 className="font-semibold text-slate-900 mb-4">Actions</h3>
              <ReportActions
                reportId={report.id}
                currentStatus={report.status}
                targetType={report.targetType}
                targetId={report.targetId}
                compact
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
