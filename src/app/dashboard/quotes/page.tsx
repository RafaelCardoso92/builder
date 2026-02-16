import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { MessageSquare, Clock, CheckCircle, XCircle, MapPin, Calendar } from 'lucide-react';

async function getQuotes(userId: string) {
  const profile = await prisma.tradesProfile.findUnique({
    where: { userId },
    include: {
      quoteRequests: {
        orderBy: { createdAt: 'desc' },
        include: {
          customer: {
            select: { name: true, email: true },
          },
        },
      },
    },
  });
  return profile;
}

const statusConfig = {
  PENDING: { label: 'Pending', color: 'bg-orange-100 text-orange-700', icon: Clock },
  VIEWED: { label: 'Viewed', color: 'bg-blue-100 text-blue-700', icon: CheckCircle },
  RESPONDED: { label: 'Responded', color: 'bg-green-100 text-green-700', icon: CheckCircle },
  ACCEPTED: { label: 'Accepted', color: 'bg-emerald-100 text-emerald-700', icon: CheckCircle },
  DECLINED: { label: 'Declined', color: 'bg-red-100 text-red-700', icon: XCircle },
  COMPLETED: { label: 'Completed', color: 'bg-slate-100 text-slate-700', icon: CheckCircle },
};

export default async function QuotesPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    redirect('/login');
  }

  const profile = await getQuotes(session.user.id);

  if (!profile) {
    redirect('/dashboard/profile');
  }

  const pendingCount = profile.quoteRequests.filter(q => q.status === 'PENDING').length;

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Quote Requests</h1>
          <p className="text-slate-600 mt-1">
            Manage and respond to customer enquiries
          </p>
        </div>
        {pendingCount > 0 && (
          <span className="px-3 py-1 bg-orange-100 text-orange-700 font-medium rounded-full">
            {pendingCount} pending
          </span>
        )}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white rounded-xl border border-slate-200 p-4">
          <p className="text-2xl font-bold text-slate-900">{profile.quoteRequests.length}</p>
          <p className="text-sm text-slate-600">Total Requests</p>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-4">
          <p className="text-2xl font-bold text-orange-600">{pendingCount}</p>
          <p className="text-sm text-slate-600">Awaiting Response</p>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-4">
          <p className="text-2xl font-bold text-green-600">
            {profile.quoteRequests.filter(q => q.status === 'RESPONDED' || q.status === 'ACCEPTED').length}
          </p>
          <p className="text-sm text-slate-600">Responded</p>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-4">
          <p className="text-2xl font-bold text-emerald-600">
            {profile.quoteRequests.filter(q => q.status === 'COMPLETED').length}
          </p>
          <p className="text-sm text-slate-600">Completed</p>
        </div>
      </div>

      {/* Quotes List */}
      {profile.quoteRequests.length === 0 ? (
        <div className="bg-white rounded-xl border border-slate-200 p-12 text-center">
          <MessageSquare className="w-12 h-12 text-slate-300 mx-auto mb-4" />
          <h2 className="text-lg font-semibold text-slate-900 mb-2">No quote requests yet</h2>
          <p className="text-slate-600">
            When customers request quotes from you, they&apos;ll appear here.
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-slate-200 divide-y divide-slate-200">
          {profile.quoteRequests.map((quote) => {
            const status = statusConfig[quote.status as keyof typeof statusConfig];
            const StatusIcon = status.icon;
            
            return (
              <Link
                key={quote.id}
                href={`/dashboard/quotes/${quote.id}`}
                className="flex items-center gap-6 p-6 hover:bg-slate-50 transition-colors"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="font-semibold text-slate-900 truncate">{quote.title}</h3>
                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 text-xs font-medium rounded-full ${status.color}`}>
                      <StatusIcon className="w-3 h-3" />
                      {status.label}
                    </span>
                  </div>
                  <p className="text-sm text-slate-600 line-clamp-1 mb-2">{quote.description}</p>
                  <div className="flex items-center gap-4 text-xs text-slate-500">
                    <span className="flex items-center gap-1">
                      <MessageSquare className="w-3 h-3" />
                      {quote.customer.name}
                    </span>
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3 h-3" />
                      {quote.postcode}
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {new Date(quote.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
                {quote.timeframe && (
                  <div className="text-right">
                    <p className="text-xs text-slate-500">Timeframe</p>
                    <p className="text-sm font-medium text-slate-900">{quote.timeframe}</p>
                  </div>
                )}
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
