import Link from 'next/link';
import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import {
  Briefcase,
  MapPin,
  Clock,
  PoundSterling,
  Users,
  Plus,
  Eye,
} from 'lucide-react';

const timeframeLabels: Record<string, string> = {
  ASAP: 'ASAP',
  '1_WEEK': '1 week',
  '2_WEEKS': '2 weeks',
  '1_MONTH': '1 month',
  FLEXIBLE: 'Flexible',
};

const statusConfig: Record<string, { label: string; color: string }> = {
  OPEN: { label: 'Open', color: 'bg-green-100 text-green-700' },
  IN_PROGRESS: { label: 'In Progress', color: 'bg-blue-100 text-blue-700' },
  COMPLETED: { label: 'Completed', color: 'bg-slate-100 text-slate-700' },
  CLOSED: { label: 'Closed', color: 'bg-red-100 text-red-700' },
  EXPIRED: { label: 'Expired', color: 'bg-orange-100 text-orange-700' },
};

async function getMyJobs(userId: string) {
  const jobs = await prisma.job.findMany({
    where: { customerId: userId },
    include: {
      trade: { select: { name: true } },
      _count: { select: { applications: true } },
      applications: {
        where: { viewedAt: null },
        select: { id: true },
      },
    },
    orderBy: { createdAt: 'desc' },
  });

  return jobs;
}

export default async function MyJobsPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    redirect('/login?callbackUrl=/account/jobs');
  }

  const jobs = await getMyJobs(session.user.id);

  const stats = {
    total: jobs.length,
    open: jobs.filter((j) => j.status === 'OPEN').length,
    totalApplications: jobs.reduce((sum, j) => sum + j._count.applications, 0),
    newApplications: jobs.reduce((sum, j) => sum + j.applications.length, 0),
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">My Jobs</h1>
          <p className="text-slate-600">Manage jobs you&apos;ve posted</p>
        </div>
        <Link
          href="/jobs/post"
          className="inline-flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
        >
          <Plus className="w-4 h-4" />
          Post a Job
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl border border-slate-200 p-4">
          <p className="text-sm text-slate-500">Total Jobs</p>
          <p className="text-2xl font-bold text-slate-900">{stats.total}</p>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-4">
          <p className="text-sm text-slate-500">Open Jobs</p>
          <p className="text-2xl font-bold text-green-600">{stats.open}</p>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-4">
          <p className="text-sm text-slate-500">Total Applications</p>
          <p className="text-2xl font-bold text-slate-900">
            {stats.totalApplications}
          </p>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-4">
          <p className="text-sm text-slate-500">New Applications</p>
          <p className="text-2xl font-bold text-primary-600">
            {stats.newApplications}
          </p>
        </div>
      </div>

      {/* Jobs List */}
      {jobs.length > 0 ? (
        <div className="space-y-4">
          {jobs.map((job) => {
            const status = statusConfig[job.status] || statusConfig.OPEN;
            const newApps = job.applications.length;

            return (
              <Link
                key={job.id}
                href={`/account/jobs/${job.id}`}
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
                        <h2 className="text-lg font-semibold text-slate-900">
                          {job.title}
                        </h2>
                        <p className="text-primary-600 text-sm">{job.trade.name}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        {newApps > 0 && (
                          <span className="px-2 py-1 bg-primary-600 text-white text-xs font-medium rounded-full">
                            {newApps} new
                          </span>
                        )}
                        <span
                          className={`px-2 py-1 text-xs font-medium rounded-full ${status.color}`}
                        >
                          {status.label}
                        </span>
                      </div>
                    </div>

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
                      {(job.budgetMin || job.budgetMax) && (
                        <span className="flex items-center gap-1">
                          <PoundSterling className="w-4 h-4" />
                          {job.budgetMin && job.budgetMax
                            ? `${job.budgetMin.toLocaleString()} - ${job.budgetMax.toLocaleString()}`
                            : job.budgetMax
                            ? `Up to ${job.budgetMax.toLocaleString()}`
                            : `From ${job.budgetMin?.toLocaleString()}`}
                        </span>
                      )}
                      <span className="flex items-center gap-1">
                        <Users className="w-4 h-4" />
                        {job._count.applications} applications
                      </span>
                      <span className="flex items-center gap-1">
                        <Eye className="w-4 h-4" />
                        {job.viewCount} views
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-12 bg-white rounded-xl border border-slate-200">
          <Briefcase className="w-12 h-12 text-slate-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-slate-900 mb-2">
            No jobs posted yet
          </h3>
          <p className="text-slate-600 mb-4">
            Post your first job to start receiving quotes from tradespeople.
          </p>
          <Link
            href="/jobs/post"
            className="inline-flex items-center gap-2 px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
          >
            <Plus className="w-4 h-4" />
            Post a Job
          </Link>
        </div>
      )}
    </div>
  );
}
