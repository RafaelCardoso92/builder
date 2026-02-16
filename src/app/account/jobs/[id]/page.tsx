import { redirect, notFound } from 'next/navigation';
import Link from 'next/link';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import {
  Briefcase,
  MapPin,
  Clock,
  PoundSterling,
  Calendar,
  Users,
  ArrowLeft,
  Eye,
  Star,
  Shield,
  Phone,
  Mail,
} from 'lucide-react';
import ApplicationCard from './ApplicationCard';
import JobActions from './JobActions';

const timeframeLabels: Record<string, string> = {
  ASAP: 'As soon as possible',
  '1_WEEK': 'Within 1 week',
  '2_WEEKS': 'Within 2 weeks',
  '1_MONTH': 'Within 1 month',
  FLEXIBLE: 'Flexible',
};

const statusConfig: Record<string, { label: string; color: string }> = {
  OPEN: { label: 'Open', color: 'bg-green-100 text-green-700' },
  IN_PROGRESS: { label: 'In Progress', color: 'bg-blue-100 text-blue-700' },
  COMPLETED: { label: 'Completed', color: 'bg-slate-100 text-slate-700' },
  CLOSED: { label: 'Closed', color: 'bg-red-100 text-red-700' },
  EXPIRED: { label: 'Expired', color: 'bg-orange-100 text-orange-700' },
};

async function getJob(jobId: string, userId: string) {
  const job = await prisma.job.findUnique({
    where: { id: jobId },
    include: {
      trade: { select: { name: true } },
      applications: {
        include: {
          profile: {
            select: {
              id: true,
              businessName: true,
              slug: true,
              phone: true,
              email: true,
              city: true,
              postcode: true,
              averageRating: true,
              reviewCount: true,
              isVerified: true,
              logo: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
      },
    },
  });

  if (!job || job.customerId !== userId) {
    return null;
  }

  // Mark unviewed applications as viewed
  const unviewedIds = job.applications
    .filter((app) => !app.viewedAt)
    .map((app) => app.id);

  if (unviewedIds.length > 0) {
    await prisma.jobApplication.updateMany({
      where: { id: { in: unviewedIds } },
      data: { viewedAt: new Date(), status: 'VIEWED' },
    });
  }

  return job;
}

export default async function JobDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    redirect('/login?callbackUrl=/account/jobs/' + id);
  }

  const job = await getJob(id, session.user.id);

  if (!job) {
    notFound();
  }

  const status = statusConfig[job.status] || statusConfig.OPEN;

  // Group applications by status
  const pendingApps = job.applications.filter(
    (a) => a.status === 'PENDING' || a.status === 'VIEWED'
  );
  const shortlistedApps = job.applications.filter(
    (a) => a.status === 'SHORTLISTED'
  );
  const acceptedApps = job.applications.filter((a) => a.status === 'ACCEPTED');
  const declinedApps = job.applications.filter(
    (a) => a.status === 'DECLINED' || a.status === 'WITHDRAWN'
  );

  return (
    <div className="space-y-6">
      <Link
        href="/account/jobs"
        className="inline-flex items-center gap-2 text-slate-600 hover:text-slate-900"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to My Jobs
      </Link>

      {/* Header */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <div className="flex items-start gap-4">
          <div className="w-14 h-14 bg-primary-100 rounded-xl flex items-center justify-center flex-shrink-0">
            <Briefcase className="w-7 h-7 text-primary-600" />
          </div>
          <div className="flex-1">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h1 className="text-2xl font-bold text-slate-900">
                  {job.title}
                </h1>
                <p className="text-primary-600 font-medium">{job.trade.name}</p>
              </div>
              <div className="flex items-center gap-2">
                <span
                  className={`px-3 py-1 text-sm font-medium rounded-full ${status.color}`}
                >
                  {status.label}
                </span>
                <JobActions job={job} />
              </div>
            </div>

            <div className="flex flex-wrap gap-4 mt-4 text-sm text-slate-600">
              <span className="flex items-center gap-1">
                <MapPin className="w-4 h-4" />
                {job.postcode}
              </span>
              {job.timeframe && (
                <span className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  {timeframeLabels[job.timeframe]}
                </span>
              )}
              {(job.budgetMin || job.budgetMax) && (
                <span className="flex items-center gap-1">
                  <PoundSterling className="w-4 h-4" />
                  {job.budgetMin && job.budgetMax
                    ? `£${job.budgetMin.toLocaleString()} - £${job.budgetMax.toLocaleString()}`
                    : job.budgetMax
                    ? `Up to £${job.budgetMax.toLocaleString()}`
                    : `From £${job.budgetMin?.toLocaleString()}`}
                </span>
              )}
              <span className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                Posted{' '}
                {new Date(job.createdAt).toLocaleDateString('en-GB', {
                  day: 'numeric',
                  month: 'short',
                })}
              </span>
              <span className="flex items-center gap-1">
                <Eye className="w-4 h-4" />
                {job.viewCount} views
              </span>
              <span className="flex items-center gap-1">
                <Users className="w-4 h-4" />
                {job.applications.length} applications
              </span>
            </div>
          </div>
        </div>

        {/* Description */}
        <div className="mt-6 pt-6 border-t border-slate-100">
          <h3 className="font-semibold text-slate-900 mb-2">Description</h3>
          <p className="text-slate-600 whitespace-pre-line">{job.description}</p>
        </div>
      </div>

      {/* Applications */}
      <div className="space-y-6">
        <h2 className="text-xl font-bold text-slate-900">
          Applications ({job.applications.length})
        </h2>

        {job.applications.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-xl border border-slate-200">
            <Users className="w-12 h-12 text-slate-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-slate-900 mb-2">
              No applications yet
            </h3>
            <p className="text-slate-600">
              Your job is live. Tradespeople will start applying soon.
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Accepted */}
            {acceptedApps.length > 0 && (
              <div>
                <h3 className="text-sm font-medium text-emerald-700 mb-3">
                  Accepted ({acceptedApps.length})
                </h3>
                <div className="space-y-4">
                  {acceptedApps.map((app) => (
                    <ApplicationCard
                      key={app.id}
                      application={app}
                      jobId={job.id}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Shortlisted */}
            {shortlistedApps.length > 0 && (
              <div>
                <h3 className="text-sm font-medium text-blue-700 mb-3">
                  Shortlisted ({shortlistedApps.length})
                </h3>
                <div className="space-y-4">
                  {shortlistedApps.map((app) => (
                    <ApplicationCard
                      key={app.id}
                      application={app}
                      jobId={job.id}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Pending/Viewed */}
            {pendingApps.length > 0 && (
              <div>
                <h3 className="text-sm font-medium text-slate-700 mb-3">
                  New Applications ({pendingApps.length})
                </h3>
                <div className="space-y-4">
                  {pendingApps.map((app) => (
                    <ApplicationCard
                      key={app.id}
                      application={app}
                      jobId={job.id}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Declined/Withdrawn */}
            {declinedApps.length > 0 && (
              <div>
                <h3 className="text-sm font-medium text-slate-500 mb-3">
                  Declined ({declinedApps.length})
                </h3>
                <div className="space-y-4">
                  {declinedApps.map((app) => (
                    <ApplicationCard
                      key={app.id}
                      application={app}
                      jobId={job.id}
                      disabled
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
