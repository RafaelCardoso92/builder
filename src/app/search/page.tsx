import Link from 'next/link';
import { Search, MapPin, Star, Shield, Clock, Phone } from 'lucide-react';
import { prisma } from '@/lib/prisma';

interface SearchParams {
  trade?: string;
  postcode?: string;
  page?: string;
}

async function searchTradespeople(params: SearchParams) {
  const { trade, postcode, page = '1' } = params;
  const perPage = 10;
  const skip = (parseInt(page) - 1) * perPage;

  const where: any = {
    isActive: true,
  };

  // Search by trade name
  if (trade) {
    where.trades = {
      some: {
        trade: {
          OR: [
            { name: { contains: trade, mode: 'insensitive' } },
            { slug: { contains: trade.toLowerCase() } },
            { parent: { name: { contains: trade, mode: 'insensitive' } } },
          ],
        },
      },
    };
  }

  // Search by postcode area (first part)
  if (postcode) {
    const postcodeArea = postcode.split(' ')[0].toUpperCase();
    where.postcode = { startsWith: postcodeArea };
  }

  const [profiles, total] = await Promise.all([
    prisma.tradesProfile.findMany({
      where,
      include: {
        trades: {
          include: {
            trade: true,
          },
        },
        user: {
          select: { name: true },
        },
      },
      orderBy: [
        { isVerified: 'desc' },
        { averageRating: 'desc' },
        { reviewCount: 'desc' },
      ],
      skip,
      take: perPage,
    }),
    prisma.tradesProfile.count({ where }),
  ]);

  return { profiles, total, perPage };
}

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const params = await searchParams;
  const { profiles, total, perPage } = await searchTradespeople(params);
  const currentPage = parseInt(params.page || '1');
  const totalPages = Math.ceil(total / perPage);

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Search Header */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <form action="/search" method="GET" className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="text"
                name="trade"
                defaultValue={params.trade}
                placeholder="What do you need? (e.g. Plumber, Electrician)"
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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-slate-900">
            {params.trade ? `${params.trade} ` : ''}
            {params.postcode ? `near ${params.postcode}` : 'Tradespeople'}
          </h1>
          <p className="text-slate-600">
            {total} result{total !== 1 ? 's' : ''} found
          </p>
        </div>

        {profiles.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-12 text-center">
            <Search className="w-12 h-12 text-slate-300 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-slate-900 mb-2">No results found</h2>
            <p className="text-slate-600 mb-6">
              Try adjusting your search terms or location
            </p>
            <Link href="/" className="text-primary-600 hover:text-primary-700 font-medium">
              Back to homepage
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {profiles.map((profile) => (
              <Link
                key={profile.id}
                href={`/${profile.slug}`}
                className="block bg-white rounded-xl shadow-sm border border-slate-200 p-6 hover:shadow-md hover:border-primary-200 transition-all"
              >
                <div className="flex gap-6">
                  {/* Logo */}
                  <div className="flex-shrink-0">
                    <div className="w-20 h-20 bg-primary-100 rounded-xl flex items-center justify-center">
                      <span className="text-2xl font-bold text-primary-600">
                        {profile.businessName.charAt(0)}
                      </span>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <div className="flex items-center gap-2">
                          <h2 className="text-lg font-semibold text-slate-900">
                            {profile.businessName}
                          </h2>
                          {profile.isVerified && (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-green-100 text-green-700 text-xs font-medium rounded-full">
                              <Shield className="w-3 h-3" />
                              Verified
                            </span>
                          )}
                        </div>
                        <p className="text-slate-600 mt-1">
                          {profile.trades.map((t) => t.trade.name).join(', ')}
                        </p>
                      </div>

                      {/* Rating */}
                      {profile.reviewCount > 0 && (
                        <div className="text-right">
                          <div className="flex items-center gap-1">
                            <Star className="w-5 h-5 text-yellow-400 fill-current" />
                            <span className="font-semibold text-slate-900">
                              {profile.averageRating.toFixed(1)}
                            </span>
                          </div>
                          <p className="text-sm text-slate-500">
                            {profile.reviewCount} review{profile.reviewCount !== 1 ? 's' : ''}
                          </p>
                        </div>
                      )}
                    </div>

                    {profile.tagline && (
                      <p className="text-slate-600 mt-2 line-clamp-2">{profile.tagline}</p>
                    )}

                    <div className="flex items-center gap-4 mt-4 text-sm text-slate-500">
                      <span className="flex items-center gap-1">
                        <MapPin className="w-4 h-4" />
                        {profile.city}, {profile.postcode}
                      </span>
                      {profile.responseTime && (
                        <span className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          {profile.responseTime}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 mt-8">
            {currentPage > 1 && (
              <Link
                href={`/search?trade=${params.trade || ''}&postcode=${params.postcode || ''}&page=${currentPage - 1}`}
                className="px-4 py-2 border border-slate-300 rounded-lg hover:bg-slate-50"
              >
                Previous
              </Link>
            )}
            <span className="px-4 py-2 text-slate-600">
              Page {currentPage} of {totalPages}
            </span>
            {currentPage < totalPages && (
              <Link
                href={`/search?trade=${params.trade || ''}&postcode=${params.postcode || ''}&page=${currentPage + 1}`}
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
