import Link from 'next/link';
import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import {
  FileText,
  Briefcase,
  MapPin,
  Clock,
  PoundSterling,
  Calendar,
  CheckCircle,
  XCircle,
  Bookmark,
  Eye,
  ExternalLink,
} from 'lucide-react';

const statusConfig: Record<
  string,
  { label: string; color: string; icon: any }
> = {
  PENDING: {
    label: 'Pending',
    color: 'bg-orange-100 text-orange-700',
    icon: Clock,
  },
  VIEWED: {
    label: 'Viewed',
    color: 'bg-slate-100 text-slate-700',
    icon: Eye,
  },
  SHORTLISTED: {
    label: 'Shortlisted',
    color: 'bg-blue-100 text-blue-700',
    icon: Bookmark,
  },
  ACCEPTED: {
    label: 'Accepted',
    color: 'bg-emerald-100 text-emerald-700',
    icon: CheckCircle,
  },
  DECLINED: {
    label: 'Declined',
    color: 'bg-red-100 text-red-700',
    icon: XCircle,
  },
  WITHDRAWN: {
    label: 'Withdrawn',
    color: 'bg-slate-100 text-slate-500',
    icon: XCircle,
  },
};

const timeframeLabels: Record<string, string> = {
  ASAP: 'ASAP',
  '1_WEEK': '1 week',
  '2_WEEKS': '2 weeks',
  '1_MONTH': '1 month',
  FLEXIBLE: 'Flexible',
};

async function getMyApplications(userId: string) {
  const profile = await prisma.tradesProfile.findUnique({
    where: { userId },
  });

  if (!profile) {
    return null;
  }

  const applications = await prisma.jobApplication.findMany({
    where: { profileId: profile.id },
    include: {
      job: {
        select: {
          id: true,
          title: true,
          postcode: true,
          status: true,
          budgetMin: true,
          budgetMax: true,
          timeframe: true,
          createdAt: true,
          trade: { select: { name: true } },
          customer: { select: { name: true } },
        },
      },
    },
    orderBy: { createdAt: 'desc' },
  });

  return applications;
}

export default async function MyApplicationsPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    redirect('/login?callbackUrl=/dashboard/applications');
  }

  const applications = await getMyApplications(session.user.id);

  if (!applications) {
    redirect('/register/tradesperson');
  }

  const stats = {
    total: applications.length,
    pending: applications.filter(
      (a) => a.status === 'PENDING' || a.status === 'VIEWED'
    ).length,
    shortlisted: applications.filter((a) => a.status === 'SHORTLISTED').length,
    accepted: applications.filter((a) => a.status === 'ACCEPTED').length,
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">My Applications</h1>
        <p className="text-slate-600">Track your job applications</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl border border-slate-200 p-4">
          <p className="text-sm text-slate-500">Total</p>
          <p className="text-2xl font-bold text-slate-900">{stats.total}</p>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-4">
          <p className="text-sm text-slate-500">Pending</p>
          <p className="text-2xl font-bold text-orange-600">{stats.pending}</p>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-4">
          <p className="text-sm text-slate-500">Shortlisted</p>
          <p className="text-2xl font-bold text-blue-600">{stats.shortlisted}</p>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-4">
          <p className="text-sm text-slate-500">Accepted</p>
          <p className="text-2xl font-bold text-emerald-600">{stats.accepted}</p>
        </div>
      </div>

      {/* Applications List */}
      {applications.length > 0 ? (
        <div className="space-y-4">
          {applications.map((application) => {
            const status =
              statusConfig[application.status] || statusConfig.PENDING;
            const StatusIcon = status.icon;
            const job = application.job;

            return (
              <div
                key={application.id}
                className="bg-white rounded-xl shadow-sm border border-slate-200 p-6"
              >
                <div className="flex gap-4">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center">
                      <Briefcase className="w-6 h-6 text-primary-600" />
                    </div>
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <Link
                          href={`/jobs/${job.id}`}
                          className="text-lg font-semibold text-slate-900 hover:text-primary-600"
                        >
                          {job.title}
                        </Link>
                        <p className="text-primary-600 text-sm">
                          {job.trade.name}
                        </p>
                      </div>
                      <span
                        className={`inline-flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-full ${status.color}`}
                      >
                        <StatusIcon className="w-3 h-3" />
                        {status.label}
                      </span>
                    </div>

                    <div className="flex flex-wrap items-center gap-4 mt-3 text-sm text-slate-500">
                      <span className="flex items-center gap-1">
                        <MapPin className="w-4 h-4" />
                        {job.postcode}
                      </span>
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
                      {job.timeframe && (
                        <span className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          {timeframeLabels[job.timeframe]}
                        </span>
                      )}
                    </div>

                    <div className="flex items-center justify-between mt-4 pt-4 border-t border-slate-100">
                      <div className="text-sm text-slate-500">
                        <span>
                          Applied{' '}
                          {new Date(application.createdAt).toLocaleDateString(
                            'en-GB',
                            { day: 'numeric', month: 'short', year: 'numeric' }
                          )}
                        </span>
                        {application.proposedBudget && (
                          <span className="ml-4">
                            Your quote:{' '}
                            <strong className="text-slate-900">
                              £{application.proposedBudget.toLocaleString()}
                            </strong>
                          </span>
                        )}
                      </div>
                      <Link
                        href={`/jobs/${job.id}`}
                        className="text-sm text-primary-600 hover:text-primary-700 flex items-center gap-1"
                      >
                        View Job
                        <ExternalLink className="w-4 h-4" />
                      </Link>
                    </div>

                    {/* Status-specific messages */}
                    {application.status === 'ACCEPTED' && (
                      <div className="mt-4 p-3 bg-emerald-50 border border-emerald-200 rounded-lg">
                        <p className="text-sm text-emerald-800">
                          Congratulations! The customer has accepted your
                          application. Check your messages to get in touch.
                        </p>
                        <Link
                          href="/dashboard/messages"
                          className="text-sm font-medium text-emerald-700 hover:underline mt-1 inline-block"
                        >
                          Go to Messages
                        </Link>
                      </div>
                    )}

                    {application.status === 'SHORTLISTED' && (
                      <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                        <p className="text-sm text-blue-800">
                          You have been shortlisted! The customer is considering
                          your application.
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-12 bg-white rounded-xl border border-slate-200">
          <FileText className="w-12 h-12 text-slate-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-slate-900 mb-2">
            No applications yet
          </h3>
          <p className="text-slate-600 mb-4">
            Browse the job board and apply to jobs that match your skills.
          </p>
          <Link
            href="/dashboard/jobs"
            className="inline-flex items-center gap-2 px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
          >
            Browse Jobs
          </Link>
        </div>
      )}
    </div>
  );
}
