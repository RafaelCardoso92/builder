import Link from 'next/link';
import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { SUBSCRIPTION_TIERS } from '@/lib/stripe';
import {
  Briefcase,
  MapPin,
  Clock,
  PoundSterling,
  Users,
  Search,
  AlertTriangle,
  CheckCircle,
  Crown,
} from 'lucide-react';

const timeframeLabels: Record<string, string> = {
  ASAP: 'ASAP',
  '1_WEEK': '1 week',
  '2_WEEKS': '2 weeks',
  '1_MONTH': '1 month',
  FLEXIBLE: 'Flexible',
};

async function getMatchingJobs(userId: string) {
  const profile = await prisma.tradesProfile.findUnique({
    where: { userId },
    include: {
      trades: { select: { tradeId: true } },
      jobApplications: { select: { jobId: true } },
    },
  });

  if (!profile) {
    return { profile: null, jobs: [], applicationCount: 0 };
  }

  const tradeIds = profile.trades.map((t) => t.tradeId);
  const appliedJobIds = profile.jobApplications.map((a) => a.jobId);

  // Get jobs matching profile's trades
  const jobs = await prisma.job.findMany({
    where: {
      status: 'OPEN',
      tradeId: { in: tradeIds },
    },
    include: {
      trade: { select: { name: true } },
      customer: { select: { name: true } },
      _count: { select: { applications: true } },
    },
    orderBy: { createdAt: 'desc' },
    take: 50,
  });

  // Mark jobs that user has already applied to
  const jobsWithStatus = jobs.map((job) => ({
    ...job,
    hasApplied: appliedJobIds.includes(job.id),
  }));

  // Count applications this month
  const thisMonth = new Date();
  thisMonth.setDate(1);
  thisMonth.setHours(0, 0, 0, 0);

  const applicationCount = await prisma.jobApplication.count({
    where: {
      profileId: profile.id,
      createdAt: { gte: thisMonth },
    },
  });

  return { profile, jobs: jobsWithStatus, applicationCount };
}

export default async function DashboardJobsPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    redirect('/login?callbackUrl=/dashboard/jobs');
  }

  const { profile, jobs, applicationCount } = await getMatchingJobs(
    session.user.id
  );

  if (!profile) {
    redirect('/register/tradesperson');
  }

  const tierLimits = SUBSCRIPTION_TIERS[profile.subscriptionTier].limits;
  const monthlyLimit = tierLimits.jobApplicationsPerMonth;
  const remaining =
    monthlyLimit === -1 ? -1 : Math.max(0, monthlyLimit - applicationCount);

  const newJobs = jobs.filter((j) => !j.hasApplied);
  const appliedJobs = jobs.filter((j) => j.hasApplied);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Job Board</h1>
        <p className="text-slate-600">Jobs matching your trade categories</p>
      </div>

      {/* Stats & Limits */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl border border-slate-200 p-4">
          <p className="text-sm text-slate-500">Matching Jobs</p>
          <p className="text-2xl font-bold text-slate-900">{newJobs.length}</p>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-4">
          <p className="text-sm text-slate-500">Applied This Month</p>
          <p className="text-2xl font-bold text-slate-900">{applicationCount}</p>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-4">
          <p className="text-sm text-slate-500">Applications Remaining</p>
          <p className="text-2xl font-bold text-primary-600">
            {remaining === -1 ? 'Unlimited' : remaining}
          </p>
        </div>
      </div>

      {/* Upgrade Notice */}
      {remaining !== -1 && remaining <= 2 && (
        <div className="flex items-start gap-3 p-4 bg-orange-50 border border-orange-200 rounded-xl">
          <AlertTriangle className="w-5 h-5 text-orange-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-medium text-orange-900">
              {remaining === 0
                ? 'You have reached your application limit'
                : `Only ${remaining} application${remaining === 1 ? '' : 's'} remaining`}
            </p>
            <p className="text-sm text-orange-700 mt-1">
              Upgrade your subscription to apply to more jobs.
            </p>
            <Link
              href="/dashboard/subscription"
              className="inline-flex items-center gap-1 mt-2 text-sm font-medium text-orange-700 hover:text-orange-900"
            >
              <Crown className="w-4 h-4" />
              Upgrade Now
            </Link>
          </div>
        </div>
      )}

      {/* Jobs List */}
      {jobs.length > 0 ? (
        <div className="space-y-6">
          {/* New Jobs */}
          {newJobs.length > 0 && (
            <div>
              <h2 className="text-lg font-semibold text-slate-900 mb-4">
                Available Jobs ({newJobs.length})
              </h2>
              <div className="space-y-4">
                {newJobs.map((job) => (
                  <Link
                    key={job.id}
                    href={`/jobs/${job.id}`}
                    className="block bg-white rounded-xl shadow-sm border border-slate-200 p-6 hover:shadow-md hover:border-primary-200 transition-all"
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
                            <h3 className="text-lg font-semibold text-slate-900">
                              {job.title}
                            </h3>
                            <p className="text-primary-600 text-sm">
                              {job.trade.name}
                            </p>
                          </div>
                          {(job.budgetMin || job.budgetMax) && (
                            <div className="flex items-center gap-1 text-slate-900 font-semibold">
                              <PoundSterling className="w-4 h-4" />
                              {job.budgetMin && job.budgetMax
                                ? `${job.budgetMin.toLocaleString()} - ${job.budgetMax.toLocaleString()}`
                                : job.budgetMax
                                ? `Up to ${job.budgetMax.toLocaleString()}`
                                : `From ${job.budgetMin?.toLocaleString()}`}
                            </div>
                          )}
                        </div>

                        <p className="text-slate-600 mt-2 line-clamp-2">
                          {job.description}
                        </p>

                        <div className="flex flex-wrap items-center gap-4 mt-3 text-sm text-slate-500">
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
                          <span className="flex items-center gap-1">
                            <Users className="w-4 h-4" />
                            {job._count.applications} applied
                          </span>
                          <span className="text-slate-400">
                            Posted{' '}
                            {new Date(job.createdAt).toLocaleDateString(
                              'en-GB',
                              { day: 'numeric', month: 'short' }
                            )}
                          </span>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Applied Jobs */}
          {appliedJobs.length > 0 && (
            <div>
              <h2 className="text-lg font-semibold text-slate-500 mb-4">
                Already Applied ({appliedJobs.length})
              </h2>
              <div className="space-y-4 opacity-60">
                {appliedJobs.map((job) => (
                  <Link
                    key={job.id}
                    href={`/jobs/${job.id}`}
                    className="block bg-white rounded-xl shadow-sm border border-slate-200 p-6"
                  >
                    <div className="flex gap-4">
                      <div className="flex-shrink-0">
                        <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                          <CheckCircle className="w-6 h-6 text-green-600" />
                        </div>
                      </div>

                      <div className="flex-1 min-w-0">
                        <h3 className="text-lg font-semibold text-slate-900">
                          {job.title}
                        </h3>
                        <p className="text-primary-600 text-sm">
                          {job.trade.name}
                        </p>
                        <div className="flex items-center gap-4 mt-2 text-sm text-slate-500">
                          <span className="flex items-center gap-1">
                            <MapPin className="w-4 h-4" />
                            {job.postcode}
                          </span>
                          <span className="text-green-600 font-medium">
                            Application submitted
                          </span>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="text-center py-12 bg-white rounded-xl border border-slate-200">
          <Search className="w-12 h-12 text-slate-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-slate-900 mb-2">
            No matching jobs found
          </h3>
          <p className="text-slate-600 mb-4">
            There are no open jobs matching your trade categories right now.
            Check back later!
          </p>
          <Link
            href="/jobs"
            className="text-primary-600 hover:underline font-medium"
          >
            Browse all jobs
          </Link>
        </div>
      )}
    </div>
  );
}
