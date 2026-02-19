import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import {
  Star,
  Clock,
  CheckCircle,
  XCircle,
  Flag,
  Filter,
  ExternalLink,
} from 'lucide-react';

async function getReviews(status?: string) {
  const where = status && status !== 'all' ? { status: status as 'PENDING' | 'APPROVED' | 'REJECTED' | 'FLAGGED' } : {};

  const reviews = await prisma.review.findMany({
    where,
    include: {
      profile: {
        select: {
          businessName: true,
          slug: true,
        },
      },
      author: {
        select: {
          name: true,
          email: true,
        },
      },
    },
    orderBy: [
      { status: 'asc' },
      { createdAt: 'desc' },
    ],
  });

  return reviews;
}

const statusConfig = {
  PENDING: {
    label: 'Pending',
    icon: Clock,
    className: 'bg-orange-100 text-orange-700',
  },
  APPROVED: {
    label: 'Approved',
    icon: CheckCircle,
    className: 'bg-green-100 text-green-700',
  },
  REJECTED: {
    label: 'Rejected',
    icon: XCircle,
    className: 'bg-red-100 text-red-700',
  },
  FLAGGED: {
    label: 'Flagged',
    icon: Flag,
    className: 'bg-yellow-100 text-yellow-700',
  },
};

export default async function AdminReviewsPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== 'ADMIN') {
    redirect('/');
  }

  const { status } = await searchParams;
  const reviews = await getReviews(status);

  const counts = {
    all: reviews.length,
    pending: reviews.filter((r) => r.status === 'PENDING').length,
    approved: reviews.filter((r) => r.status === 'APPROVED').length,
    rejected: reviews.filter((r) => r.status === 'REJECTED').length,
    flagged: reviews.filter((r) => r.status === 'FLAGGED').length,
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900">Review Moderation</h1>
        <p className="text-slate-600 mt-1">
          Approve, reject, or flag customer reviews
        </p>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 mb-6">
        <div className="flex items-center gap-2 flex-wrap">
          <Filter className="w-5 h-5 text-slate-400" />
          <span className="text-sm text-slate-600">Filter:</span>
          <div className="flex gap-2 flex-wrap">
            {[
              { value: 'all', label: 'All', count: counts.all },
              { value: 'PENDING', label: 'Pending', count: counts.pending },
              { value: 'APPROVED', label: 'Approved', count: counts.approved },
              { value: 'REJECTED', label: 'Rejected', count: counts.rejected },
              { value: 'FLAGGED', label: 'Flagged', count: counts.flagged },
            ].map((filter) => (
              <Link
                key={filter.value}
                href={'/admin/reviews' + (filter.value !== 'all' ? '?status=' + filter.value : '')}
                className={
                  'px-3 py-1 text-sm rounded-full transition-colors ' +
                  ((status || 'all') === filter.value
                    ? 'bg-primary-600 text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200')
                }
              >
                {filter.label} ({filter.count})
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Reviews List */}
      {reviews.length === 0 ? (
        <div className="bg-white rounded-xl border border-slate-200 p-12 text-center">
          <Star className="w-12 h-12 text-slate-300 mx-auto mb-4" />
          <h2 className="text-lg font-semibold text-slate-900 mb-2">No reviews</h2>
          <p className="text-slate-600">
            {status === 'PENDING'
              ? 'No pending reviews to moderate.'
              : 'No reviews found.'}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {reviews.map((review) => {
            const statusInfo = statusConfig[review.status];
            const StatusIcon = statusInfo.icon;

            return (
              <div
                key={review.id}
                className="bg-white rounded-xl border border-slate-200 p-6"
              >
                <div className="flex items-start justify-between gap-4 mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="flex items-center gap-1">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={
                              'w-4 h-4 ' +
                              (i < review.overallRating
                                ? 'text-yellow-400 fill-current'
                                : 'text-slate-200')
                            }
                          />
                        ))}
                      </div>
                      <span
                        className={
                          'inline-flex items-center gap-1 px-2 py-0.5 text-xs font-medium rounded-full ' +
                          statusInfo.className
                        }
                      >
                        <StatusIcon className="w-3 h-3" />
                        {statusInfo.label}
                      </span>
                    </div>
                    <h3 className="font-semibold text-slate-900">{review.title}</h3>
                    <p className="text-slate-600 mt-1 line-clamp-2">{review.content}</p>
                  </div>
                  <Link
                    href={'/admin/reviews/' + review.id}
                    className="flex-shrink-0 inline-flex items-center gap-1 px-4 py-2 bg-primary-50 text-primary-700 font-medium rounded-lg hover:bg-primary-100"
                  >
                    Review
                    <ExternalLink className="w-4 h-4" />
                  </Link>
                </div>

                <div className="flex items-center gap-6 text-sm text-slate-500">
                  <div>
                    <span className="text-slate-400">By:</span>{' '}
                    <span className="text-slate-700">{review.author.name}</span>
                  </div>
                  <div>
                    <span className="text-slate-400">For:</span>{' '}
                    <Link
                      href={'/' + review.profile.slug}
                      target="_blank"
                      className="text-primary-600 hover:text-primary-700"
                    >
                      {review.profile.businessName}
                    </Link>
                  </div>
                  <div>
                    <span className="text-slate-400">Date:</span>{' '}
                    {new Date(review.createdAt).toLocaleDateString('en-GB', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric',
                    })}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
