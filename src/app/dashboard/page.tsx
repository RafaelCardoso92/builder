import { getServerSession } from 'next-auth';
import Link from 'next/link';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { 
  Eye, 
  MessageSquare, 
  Star, 
  TrendingUp,
  ArrowRight,
  Clock,
  CheckCircle,
  AlertCircle
} from 'lucide-react';

async function getDashboardData(userId: string) {
  const profile = await prisma.tradesProfile.findUnique({
    where: { userId },
    include: {
      quoteRequests: {
        orderBy: { createdAt: 'desc' },
        take: 5,
        include: {
          customer: {
            select: { name: true },
          },
        },
      },
      reviews: {
        where: { status: 'APPROVED' },
        orderBy: { createdAt: 'desc' },
        take: 3,
        include: {
          author: {
            select: { name: true },
          },
        },
      },
      _count: {
        select: {
          quoteRequests: true,
          reviews: true,
          portfolio: true,
        },
      },
    },
  });

  return profile;
}

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return null;

  const profile = await getDashboardData(session.user.id);

  if (!profile) {
    return (
      <div className="max-w-2xl mx-auto text-center py-12">
        <AlertCircle className="w-16 h-16 text-orange-500 mx-auto mb-4" />
        <h1 className="text-2xl font-bold text-slate-900 mb-2">Complete Your Profile</h1>
        <p className="text-slate-600 mb-6">
          You need to set up your tradesperson profile before you can access the dashboard.
        </p>
        <Link
          href="/dashboard/profile"
          className="inline-flex items-center gap-2 px-6 py-3 bg-primary-600 text-white font-medium rounded-lg hover:bg-primary-700"
        >
          Set Up Profile
          <ArrowRight className="w-5 h-5" />
        </Link>
      </div>
    );
  }

  const stats = [
    {
      label: 'Profile Views',
      value: '0', // Would need view tracking
      icon: Eye,
      change: '+0% this month',
    },
    {
      label: 'Quote Requests',
      value: profile._count.quoteRequests.toString(),
      icon: MessageSquare,
      change: 'Total received',
    },
    {
      label: 'Average Rating',
      value: profile.averageRating > 0 ? profile.averageRating.toFixed(1) : '-',
      icon: Star,
      change: `${profile._count.reviews} reviews`,
    },
    {
      label: 'Response Rate',
      value: profile.responseRate > 0 ? `${Math.round(profile.responseRate)}%` : '-',
      icon: TrendingUp,
      change: profile.responseTime || 'Not set',
    },
  ];

  const pendingQuotes = profile.quoteRequests.filter(q => q.status === 'PENDING').length;

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900">Welcome back, {session.user.name}</h1>
        <p className="text-slate-600 mt-1">Here&apos;s what&apos;s happening with your business</p>
      </div>

      {/* Profile Completion Alert */}
      {!profile.description && (
        <div className="mb-6 p-4 bg-orange-50 border border-orange-200 rounded-xl flex items-start gap-4">
          <AlertCircle className="w-6 h-6 text-orange-500 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <h3 className="font-medium text-orange-800">Complete your profile</h3>
            <p className="text-sm text-orange-700 mt-1">
              Add a description, portfolio images, and more to attract more customers.
            </p>
          </div>
          <Link
            href="/dashboard/profile"
            className="px-4 py-2 bg-orange-600 text-white text-sm font-medium rounded-lg hover:bg-orange-700"
          >
            Complete Profile
          </Link>
        </div>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white rounded-xl border border-slate-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
                <stat.icon className="w-5 h-5 text-primary-600" />
              </div>
            </div>
            <p className="text-2xl font-bold text-slate-900">{stat.value}</p>
            <p className="text-sm text-slate-600">{stat.label}</p>
            <p className="text-xs text-slate-400 mt-1">{stat.change}</p>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Recent Quote Requests */}
        <div className="bg-white rounded-xl border border-slate-200">
          <div className="flex items-center justify-between p-6 border-b border-slate-200">
            <h2 className="font-semibold text-slate-900">Recent Quote Requests</h2>
            {pendingQuotes > 0 && (
              <span className="px-2 py-1 bg-orange-100 text-orange-700 text-xs font-medium rounded-full">
                {pendingQuotes} pending
              </span>
            )}
          </div>
          <div className="divide-y divide-slate-100">
            {profile.quoteRequests.length === 0 ? (
              <div className="p-6 text-center text-slate-500">
                No quote requests yet
              </div>
            ) : (
              profile.quoteRequests.map((quote) => (
                <Link
                  key={quote.id}
                  href={`/dashboard/quotes/${quote.id}`}
                  className="flex items-center gap-4 p-4 hover:bg-slate-50"
                >
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-slate-900 truncate">{quote.title}</p>
                    <p className="text-sm text-slate-500">{quote.customer.name}</p>
                  </div>
                  <div className="text-right">
                    <span className={`inline-flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-full ${
                      quote.status === 'PENDING' 
                        ? 'bg-orange-100 text-orange-700'
                        : quote.status === 'RESPONDED'
                        ? 'bg-blue-100 text-blue-700'
                        : 'bg-green-100 text-green-700'
                    }`}>
                      {quote.status === 'PENDING' && <Clock className="w-3 h-3" />}
                      {quote.status === 'RESPONDED' && <CheckCircle className="w-3 h-3" />}
                      {quote.status.charAt(0) + quote.status.slice(1).toLowerCase()}
                    </span>
                  </div>
                </Link>
              ))
            )}
          </div>
          <div className="p-4 border-t border-slate-200">
            <Link
              href="/dashboard/quotes"
              className="text-sm text-primary-600 hover:text-primary-700 font-medium flex items-center gap-1"
            >
              View all quotes
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

        {/* Recent Reviews */}
        <div className="bg-white rounded-xl border border-slate-200">
          <div className="flex items-center justify-between p-6 border-b border-slate-200">
            <h2 className="font-semibold text-slate-900">Recent Reviews</h2>
            <div className="flex items-center gap-1">
              <Star className="w-4 h-4 text-yellow-400 fill-current" />
              <span className="font-semibold text-slate-900">
                {profile.averageRating > 0 ? profile.averageRating.toFixed(1) : '-'}
              </span>
            </div>
          </div>
          <div className="divide-y divide-slate-100">
            {profile.reviews.length === 0 ? (
              <div className="p-6 text-center text-slate-500">
                No reviews yet
              </div>
            ) : (
              profile.reviews.map((review) => (
                <div key={review.id} className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="flex items-center gap-0.5">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-4 h-4 ${i < review.overallRating ? 'text-yellow-400 fill-current' : 'text-slate-200'}`}
                        />
                      ))}
                    </div>
                    <span className="text-sm text-slate-500">{review.author.name}</span>
                  </div>
                  <p className="text-sm text-slate-600 line-clamp-2">{review.content}</p>
                  {!review.response && (
                    <Link
                      href={`/dashboard/reviews/${review.id}`}
                      className="text-xs text-primary-600 hover:text-primary-700 mt-2 inline-block"
                    >
                      Respond to review
                    </Link>
                  )}
                </div>
              ))
            )}
          </div>
          <div className="p-4 border-t border-slate-200">
            <Link
              href="/dashboard/reviews"
              className="text-sm text-primary-600 hover:text-primary-700 font-medium flex items-center gap-1"
            >
              View all reviews
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4">
        <Link
          href="/dashboard/profile"
          className="p-4 bg-white rounded-xl border border-slate-200 hover:border-primary-200 hover:shadow-sm transition-all text-center"
        >
          <span className="text-sm font-medium text-slate-900">Edit Profile</span>
        </Link>
        <Link
          href="/dashboard/portfolio"
          className="p-4 bg-white rounded-xl border border-slate-200 hover:border-primary-200 hover:shadow-sm transition-all text-center"
        >
          <span className="text-sm font-medium text-slate-900">Add Portfolio</span>
        </Link>
        <Link
          href={`/${profile.slug}`}
          className="p-4 bg-white rounded-xl border border-slate-200 hover:border-primary-200 hover:shadow-sm transition-all text-center"
        >
          <span className="text-sm font-medium text-slate-900">View Public Profile</span>
        </Link>
        <Link
          href="/dashboard/subscription"
          className="p-4 bg-white rounded-xl border border-slate-200 hover:border-primary-200 hover:shadow-sm transition-all text-center"
        >
          <span className="text-sm font-medium text-slate-900">Upgrade Plan</span>
        </Link>
      </div>
    </div>
  );
}
