import Link from 'next/link';
import {
  AlertTriangle,
  Search,
  MapPin,
  PoundSterling,
  Calendar,
  Shield,
  FileText,
} from 'lucide-react';
import { prisma } from '@/lib/prisma';

interface SearchParams {
  search?: string;
  postcode?: string;
  page?: string;
}

interface BadPayerWhereClause {
  status: 'PUBLISHED';
  isPublic: boolean;
  OR?: Array<{
    workDescription?: { contains: string; mode: 'insensitive' };
    locationArea?: { contains: string; mode: 'insensitive' };
  }>;
  locationPostcode?: { startsWith: string };
}

async function getPublicReports(params: SearchParams) {
  const page = Math.max(1, parseInt(params.page || '1'));
  const limit = 20;

  const where: BadPayerWhereClause = {
    status: 'PUBLISHED',
    isPublic: true,
  };

  if (params.search) {
    where.OR = [
      { workDescription: { contains: params.search, mode: 'insensitive' } },
      { locationArea: { contains: params.search, mode: 'insensitive' } },
    ];
  }

  if (params.postcode) {
    where.locationPostcode = {
      startsWith: params.postcode.toUpperCase().slice(0, 4),
    };
  }

  const [reports, total] = await Promise.all([
    prisma.badPayerReport.findMany({
      where,
      include: {
        reporter: {
          select: {
            businessName: true,
            slug: true,
            isVerified: true,
          },
        },
        _count: {
          select: { evidence: true, disputes: true },
        },
      },
      orderBy: { createdAt: 'desc' },
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.badPayerReport.count({ where }),
  ]);

  return {
    reports,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
}

export default async function BadPayersPublicPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const params = await searchParams;
  const { reports, pagination } = await getPublicReports(params);

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-red-600 text-white">
        <div className="max-w-6xl mx-auto px-4 py-12">
          <div className="flex items-center gap-3 mb-4">
            <AlertTriangle className="w-10 h-10" />
            <h1 className="text-3xl font-bold">Bad Payer Reports</h1>
          </div>
          <p className="text-red-100 max-w-2xl">
            Search reports of non-paying customers submitted by verified tradespeople.
            Protect yourself before taking on new work.
          </p>

          {/* Search Form */}
          <form
            action="/bad-payers"
            method="GET"
            className="mt-8 flex flex-col sm:flex-row gap-4"
          >
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="text"
                name="search"
                defaultValue={params.search}
                placeholder="Search by area or description"
                className="w-full pl-10 pr-4 py-3 text-slate-900 rounded-lg border-0 focus:outline-none focus:ring-2 focus:ring-white"
              />
            </div>
            <div className="sm:w-40 relative">
              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="text"
                name="postcode"
                defaultValue={params.postcode}
                placeholder="Postcode"
                maxLength={4}
                className="w-full pl-10 pr-4 py-3 text-slate-900 rounded-lg border-0 focus:outline-none focus:ring-2 focus:ring-white uppercase"
              />
            </div>
            <button
              type="submit"
              className="px-8 py-3 bg-white text-red-600 font-medium rounded-lg hover:bg-red-50"
            >
              Search
            </button>
          </form>
        </div>
      </div>

      {/* Results */}
      <div className="max-w-6xl mx-auto px-4 py-8">
        <p className="text-slate-600 mb-6">
          {pagination.total} {pagination.total === 1 ? 'report' : 'reports'} found
        </p>

        {reports.length > 0 ? (
          <div className="space-y-4">
            {reports.map((report) => (
              <Link
                key={report.id}
                href={`/bad-payers/${report.id}`}
                className="block bg-white rounded-xl border border-slate-200 p-6 hover:shadow-md hover:border-red-200 transition-all"
              >
                <div className="flex gap-6">
                  <div className="flex-shrink-0">
                    <div className="w-14 h-14 bg-red-100 rounded-xl flex items-center justify-center">
                      <AlertTriangle className="w-7 h-7 text-red-600" />
                    </div>
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="text-slate-900 font-medium line-clamp-2">
                          {report.workDescription}
                        </p>
                        <div className="flex items-center gap-2 mt-2">
                          <span className="text-sm text-slate-500 flex items-center gap-1">
                            <MapPin className="w-4 h-4" />
                            {report.locationArea}
                            {report.locationPostcode && ` (${report.locationPostcode})`}
                          </span>
                        </div>
                      </div>

                      <div className="text-right flex-shrink-0">
                        <p className="text-xl font-bold text-red-600 flex items-center gap-1">
                          <PoundSterling className="w-5 h-5" />
                          {report.amountOwed.toLocaleString()}
                        </p>
                        <p className="text-xs text-slate-500">owed</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 mt-4 text-sm text-slate-500">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {new Date(report.incidentDate).toLocaleDateString('en-GB', {
                          month: 'short',
                          year: 'numeric',
                        })}
                      </span>
                      {report._count.evidence > 0 && (
                        <span className="flex items-center gap-1">
                          <FileText className="w-4 h-4" />
                          {report._count.evidence} evidence
                        </span>
                      )}
                      <span className="flex items-center gap-1">
                        {report.reporter.isVerified && (
                          <Shield className="w-4 h-4 text-green-600" />
                        )}
                        Reported by{' '}
                        <span className="text-primary-600">
                          {report.reporter.businessName}
                        </span>
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-white rounded-xl border border-slate-200">
            <AlertTriangle className="w-12 h-12 text-slate-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-slate-900 mb-2">No reports found</h3>
            <p className="text-slate-600">
              Try adjusting your search filters or check back later.
            </p>
          </div>
        )}

        {/* Pagination */}
        {pagination.totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 mt-8">
            {pagination.page > 1 && (
              <Link
                href={`/bad-payers?search=${params.search || ''}&postcode=${params.postcode || ''}&page=${pagination.page - 1}`}
                className="px-4 py-2 border border-slate-300 rounded-lg hover:bg-slate-50"
              >
                Previous
              </Link>
            )}
            <span className="px-4 py-2 text-slate-600">
              Page {pagination.page} of {pagination.totalPages}
            </span>
            {pagination.page < pagination.totalPages && (
              <Link
                href={`/bad-payers?search=${params.search || ''}&postcode=${params.postcode || ''}&page=${pagination.page + 1}`}
                className="px-4 py-2 border border-slate-300 rounded-lg hover:bg-slate-50"
              >
                Next
              </Link>
            )}
          </div>
        )}
      </div>

      {/* Info Section */}
      <div className="bg-white border-t border-slate-200">
        <div className="max-w-6xl mx-auto px-4 py-12">
          <h2 className="text-xl font-bold text-slate-900 mb-6">
            About Bad Payer Reports
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <h3 className="font-semibold text-slate-900 mb-2">Verified Reporters</h3>
              <p className="text-sm text-slate-600">
                All reports are submitted by registered tradespeople with verified
                business profiles.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-slate-900 mb-2">Fair Dispute Process</h3>
              <p className="text-sm text-slate-600">
                The accused party can dispute any report. All disputes are reviewed
                by our team before any action is taken.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-slate-900 mb-2">Privacy Protected</h3>
              <p className="text-sm text-slate-600">
                Reports do not contain personal names, addresses, or other identifying
                information to protect privacy.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
