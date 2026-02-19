import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { MessageSquare, MapPin, Calendar, CheckCircle, ArrowRight } from 'lucide-react';

async function getMyQuotes(userId: string) {
  return prisma.quoteRequest.findMany({
    where: { customerId: userId },
    include: {
      profile: {
        select: {
          businessName: true,
          slug: true,
          phone: true,
        },
      },
    },
    orderBy: { createdAt: 'desc' },
  });
}

const statusConfig = {
  PENDING: { label: 'Awaiting Response', color: 'bg-orange-100 text-orange-700' },
  VIEWED: { label: 'Viewed', color: 'bg-blue-100 text-blue-700' },
  RESPONDED: { label: 'Response Received', color: 'bg-green-100 text-green-700' },
  ACCEPTED: { label: 'Accepted', color: 'bg-emerald-100 text-emerald-700' },
  DECLINED: { label: 'Declined', color: 'bg-red-100 text-red-700' },
  COMPLETED: { label: 'Completed', color: 'bg-slate-100 text-slate-700' },
};

export default async function MyQuotesPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    redirect('/login');
  }

  const quotes = await getMyQuotes(session.user.id);

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900">My Quote Requests</h1>
        <p className="text-slate-600 mt-1">
          Track and manage your quote requests
        </p>
      </div>

      {quotes.length === 0 ? (
        <div className="bg-white rounded-xl border border-slate-200 p-12 text-center">
          <MessageSquare className="w-12 h-12 text-slate-300 mx-auto mb-4" />
          <h2 className="text-lg font-semibold text-slate-900 mb-2">No quotes yet</h2>
          <p className="text-slate-600 mb-6">
            Find a tradesperson and request a quote to get started.
          </p>
          <Link
            href="/search"
            className="inline-flex items-center gap-2 px-6 py-3 bg-primary-600 text-white font-medium rounded-lg hover:bg-primary-700"
          >
            Find Tradespeople
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {quotes.map((quote) => {
            const status = statusConfig[quote.status as keyof typeof statusConfig];
            
            return (
              <Link
                key={quote.id}
                href={`/account/quotes/${quote.id}`}
                className="block bg-white rounded-xl border border-slate-200 p-6 hover:border-primary-200 hover:shadow-sm transition-all"
              >
                <div className="flex items-start justify-between gap-4 mb-4">
                  <div>
                    <h3 className="font-semibold text-slate-900">{quote.title}</h3>
                    <p className="text-slate-600 mt-1">
                      to{' '}
                      <span className="font-medium text-primary-600">
                        {quote.profile.businessName}
                      </span>
                    </p>
                  </div>
                  <span className={`px-3 py-1 text-sm font-medium rounded-full ${status.color}`}>
                    {status.label}
                  </span>
                </div>

                <p className="text-sm text-slate-600 line-clamp-2 mb-4">
                  {quote.description}
                </p>

                <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3 h-3" />
                    {quote.postcode}
                  </span>
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {new Date(quote.createdAt).toLocaleDateString()}
                  </span>
                  {quote.status === 'RESPONDED' && (
                    <span className="flex items-center gap-1 text-green-600">
                      <CheckCircle className="w-3 h-3" />
                      New response available
                    </span>
                  )}
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
