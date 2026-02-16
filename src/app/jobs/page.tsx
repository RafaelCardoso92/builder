import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import {
  Search,
  MapPin,
  Briefcase,
  Clock,
  PoundSterling,
  Users,
  Plus,
} from 'lucide-react';

interface SearchParams {
  trade?: string;
  postcode?: string;
  page?: string;
}

const timeframeLabels: Record<string, string> = {
  ASAP: 'As soon as possible',
  '1_WEEK': 'Within 1 week',
  '2_WEEKS': 'Within 2 weeks',
  '1_MONTH': 'Within 1 month',
  FLEXIBLE: 'Flexible',
};

async function getJobs(params: SearchParams) {
  const page = parseInt(params.page || '1');
  const perPage = 10;

  const where: any = {
    status: 'OPEN',
  };

  if (params.trade) {
    where.trade = {
      OR: [
        { name: { contains: params.trade, mode: 'insensitive' } },
        { slug: { contains: params.trade.toLowerCase() } },
        { parent: { name: { contains: params.trade, mode: 'insensitive' } } },
      ],
    };
  }

  if (params.postcode) {
    const postcodeArea = params.postcode.split(' ')[0].toUpperCase();
    where.postcode = { startsWith: postcodeArea };
  }

  const [jobs, total] = await Promise.all([
    prisma.job.findMany({
      where,
      include: {
        trade: { select: { name: true } },
        customer: { select: { name: true } },
        _count: { select: { applications: true } },
      },
      orderBy: { createdAt: 'desc' },
      skip: (page - 1) * perPage,
      take: perPage,
    }),
    prisma.job.count({ where }),
  ]);

  return { jobs, total, page, perPage, totalPages: Math.ceil(total / perPage) };
}

export default async function JobsPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const params = await searchParams;
  const { jobs, total, page, totalPages } = await getJobs(params);

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-6xl mx-auto px-4 py-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-slate-900">Job Board</h1>
              <p className="text-slate-600 mt-1">
                Browse jobs posted by homeowners looking for tradespeople
              </p>
            </div>
            <Link
              href="/jobs/post"
              className="inline-flex items-center gap-2 px-6 py-3 bg-primary-600 text-white font-medium rounded-lg hover:bg-primary-700 transition-colors"
            >
              <Plus className="w-5 h-5" />
              Post a Job
            </Link>
          </div>

          {/* Search Form */}
          <form action="/jobs" method="GET" className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="text"
                name="trade"
                defaultValue={params.trade}
                placeholder="What trade? (e.g. Plumber, Electrician)"
                className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
            <div className="sm:w-48 relative">
              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="text"
                name="postcode"
                defaultValue={params.postcode}
                placeholder="Postcode"
                className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
            <button
              type="submit"
              className="px-8 py-3 bg-primary-600 text-white font-medium rounded-lg hover:bg-primary-700 transition-colors"
            >
              Search
            </button>
          </form>
        </div>
      </div>

      {/* Results */}
      <div className="max-w-6xl mx-auto px-4 py-8">
        <p className="text-slate-600 mb-6">
          {total} {total === 1 ? 'job' : 'jobs'} found
        </p>

        {jobs.length > 0 ? (
          <div className="space-y-4">
            {jobs.map((job) => (
              <Link
                key={job.id}
                href={`/jobs/${job.id}`}
                data-testid="job-card"
                className="block bg-white rounded-xl shadow-sm border border-slate-200 p-6 hover:shadow-md hover:border-primary-200 transition-all"
              >
                <div className="flex gap-6">
                  <div className="flex-shrink-0">
                    <div className="w-14 h-14 bg-primary-100 rounded-xl flex items-center justify-center">
                      <Briefcase className="w-7 h-7 text-primary-600" />
                    </div>
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h2 className="text-lg font-semibold text-slate-900">
                          {job.title}
                        </h2>
                        <p className="text-primary-600 font-medium mt-1">
                          {job.trade.name}
                        </p>
                      </div>

                      <div className="text-right flex-shrink-0">
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
                        <div className="flex items-center gap-1 text-sm text-slate-500 mt-1">
                          <Users className="w-4 h-4" />
                          {job._count.applications}{' '}
                          {job._count.applications === 1
                            ? 'application'
                            : 'applications'}
                        </div>
                      </div>
                    </div>

                    <p className="text-slate-600 mt-2 line-clamp-2">
                      {job.description}
                    </p>

                    <div className="flex items-center gap-4 mt-4 text-sm text-slate-500">
                      <span className="flex items-center gap-1">
                        <MapPin className="w-4 h-4" />
                        {job.postcode}
                      </span>
                      {job.timeframe && (
                        <span className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          {timeframeLabels[job.timeframe] || job.timeframe}
                        </span>
                      )}
                      <span className="text-slate-400">
                        Posted{' '}
                        {new Date(job.createdAt).toLocaleDateString('en-GB', {
                          day: 'numeric',
                          month: 'short',
                        })}
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-white rounded-xl border border-slate-200">
            <Briefcase className="w-12 h-12 text-slate-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-slate-900 mb-2">
              No jobs found
            </h3>
            <p className="text-slate-600">
              Try adjusting your search filters or check back later.
            </p>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 mt-8">
            {page > 1 && (
              <Link
                href={`/jobs?trade=${params.trade || ''}&postcode=${
                  params.postcode || ''
                }&page=${page - 1}`}
                className="px-4 py-2 border border-slate-300 rounded-lg hover:bg-slate-50"
              >
                Previous
              </Link>
            )}
            <span className="px-4 py-2 text-slate-600">
              Page {page} of {totalPages}
            </span>
            {page < totalPages && (
              <Link
                href={`/jobs?trade=${params.trade || ''}&postcode=${
                  params.postcode || ''
                }&page=${page + 1}`}
                className="px-4 py-2 border border-slate-300 rounded-lg hover:bg-slate-50"
              >
                Next
              </Link>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
