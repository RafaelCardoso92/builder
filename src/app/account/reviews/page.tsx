import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { Star, ExternalLink, Clock, CheckCircle, AlertCircle } from 'lucide-react';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

async function getMyReviews(userId: string) {
  const reviews = await prisma.review.findMany({
    where: { authorId: userId },
    include: {
      profile: {
        select: {
          businessName: true,
          slug: true,
          logo: true,
        },
      },
    },
    orderBy: { createdAt: 'desc' },
  });
  return reviews;
}

const statusConfig = {
  PENDING: {
    label: 'Pending Review',
    icon: Clock,
    className: 'bg-orange-100 text-orange-700',
  },
  APPROVED: {
    label: 'Published',
    icon: CheckCircle,
    className: 'bg-green-100 text-green-700',
  },
  REJECTED: {
    label: 'Not Published',
    icon: AlertCircle,
    className: 'bg-red-100 text-red-700',
  },
  FLAGGED: {
    label: 'Under Review',
    icon: AlertCircle,
    className: 'bg-yellow-100 text-yellow-700',
  },
};

export default async function MyReviewsPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    redirect('/login');
  }

  const reviews = await getMyReviews(session.user.id);

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900">My Reviews</h1>
        <p className="text-slate-600 mt-1">
          Reviews you have left for tradespeople
        </p>
      </div>

      {reviews.length === 0 ? (
        <div className="bg-white rounded-xl border border-slate-200 p-12 text-center">
          <Star className="w-12 h-12 text-slate-300 mx-auto mb-4" />
          <h2 className="text-lg font-semibold text-slate-900 mb-2">No reviews yet</h2>
          <p className="text-slate-600 mb-6">
            After you have work done by a tradesperson, you can leave them a review.
          </p>
          <Link
            href="/search"
            className="inline-flex items-center gap-2 px-6 py-3 bg-primary-600 text-white font-medium rounded-lg hover:bg-primary-700"
          >
            Find Tradespeople
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {reviews.map((review) => {
            const status = statusConfig[review.status];
            const StatusIcon = status.icon;

            return (
              <div
                key={review.id}
                className="bg-white rounded-xl border border-slate-200 p-6"
              >
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    {review.profile.logo ? (
                      <img
                        src={review.profile.logo}
                        alt={review.profile.businessName}
                        className="w-12 h-12 rounded-lg object-cover"
                      />
                    ) : (
                      <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
                        <span className="text-primary-600 font-semibold text-lg">
                          {review.profile.businessName.charAt(0)}
                        </span>
                      </div>
                    )}
                    <div>
                      <Link
                        href={'/' + review.profile.slug}
                        className="font-medium text-slate-900 hover:text-primary-600 flex items-center gap-1"
                      >
                        {review.profile.businessName}
                        <ExternalLink className="w-3 h-3" />
                      </Link>
                      <p className="text-sm text-slate-500">
                        {new Date(review.createdAt).toLocaleDateString('en-GB', {
                          day: 'numeric',
                          month: 'long',
                          year: 'numeric',
                        })}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-5 h-5 ${i < review.overallRating ? 'text-yellow-400 fill-current' : 'text-slate-200'}`}
                        />
                      ))}
                    </div>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full flex items-center gap-1 ${status.className}`}>
                      <StatusIcon className="w-3 h-3" />
                      {status.label}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <h4 className="font-medium text-slate-900 mb-2">{review.title}</h4>
                <p className="text-slate-600 line-clamp-3">{review.content}</p>

                {/* Response */}
                {review.response && (
                  <div className="mt-4 pl-4 border-l-2 border-primary-200 bg-primary-50 rounded-r-lg p-4">
                    <p className="text-sm font-medium text-primary-700 mb-1">
                      Response from {review.profile.businessName}
                    </p>
                    <p className="text-slate-600 text-sm">{review.response}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
