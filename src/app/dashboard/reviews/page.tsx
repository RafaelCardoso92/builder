import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { Star, MessageSquare, AlertCircle } from 'lucide-react';

async function getReviews(userId: string) {
  const profile = await prisma.tradesProfile.findUnique({
    where: { userId },
    include: {
      reviews: {
        orderBy: { createdAt: 'desc' },
        include: {
          author: {
            select: { name: true },
          },
        },
      },
    },
  });
  return profile;
}

export default async function ReviewsPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    redirect('/login');
  }

  const profile = await getReviews(session.user.id);

  if (!profile) {
    redirect('/dashboard/profile');
  }

  const awaitingResponse = profile.reviews.filter(r => r.status === 'APPROVED' && !r.response).length;

  // Calculate rating breakdown
  const ratingCounts = [0, 0, 0, 0, 0];
  profile.reviews.forEach(r => {
    if (r.status === 'APPROVED') {
      ratingCounts[r.overallRating - 1]++;
    }
  });
  const totalApproved = profile.reviews.filter(r => r.status === 'APPROVED').length;

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Reviews</h1>
          <p className="text-slate-600 mt-1">
            Manage your customer reviews and responses
          </p>
        </div>
        {awaitingResponse > 0 && (
          <span className="px-3 py-1 bg-orange-100 text-orange-700 font-medium rounded-full">
            {awaitingResponse} awaiting response
          </span>
        )}
      </div>

      {/* Rating Overview */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 mb-8">
        <div className="flex items-center gap-8">
          {/* Overall Rating */}
          <div className="text-center">
            <div className="text-5xl font-bold text-slate-900">
              {profile.averageRating > 0 ? profile.averageRating.toFixed(1) : '-'}
            </div>
            <div className="flex items-center justify-center gap-1 mt-2">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-5 h-5 ${i < Math.round(profile.averageRating) ? 'text-yellow-400 fill-current' : 'text-slate-200'}`}
                />
              ))}
            </div>
            <p className="text-sm text-slate-500 mt-1">{totalApproved} reviews</p>
          </div>

          {/* Rating Breakdown */}
          <div className="flex-1 space-y-2">
            {[5, 4, 3, 2, 1].map((rating) => (
              <div key={rating} className="flex items-center gap-3">
                <span className="text-sm text-slate-600 w-12">{rating} star</span>
                <div className="flex-1 bg-slate-100 rounded-full h-2">
                  <div
                    className="bg-yellow-400 h-2 rounded-full"
                    style={{ width: totalApproved > 0 ? `${(ratingCounts[rating - 1] / totalApproved) * 100}%` : '0%' }}
                  />
                </div>
                <span className="text-sm text-slate-500 w-8">{ratingCounts[rating - 1]}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Reviews List */}
      {profile.reviews.length === 0 ? (
        <div className="bg-white rounded-xl border border-slate-200 p-12 text-center">
          <Star className="w-12 h-12 text-slate-300 mx-auto mb-4" />
          <h2 className="text-lg font-semibold text-slate-900 mb-2">No reviews yet</h2>
          <p className="text-slate-600">
            When customers leave reviews, they&apos;ll appear here.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {profile.reviews.map((review) => (
            <div
              key={review.id}
              className="bg-white rounded-xl border border-slate-200 p-6"
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                    <span className="text-primary-600 font-semibold">
                      {review.author.name.charAt(0)}
                    </span>
                  </div>
                  <div>
                    <p className="font-medium text-slate-900">{review.author.name}</p>
                    <p className="text-sm text-slate-500">
                      {new Date(review.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-5 h-5 ${i < review.overallRating ? 'text-yellow-400 fill-current' : 'text-slate-200'}`}
                    />
                  ))}
                </div>
              </div>

              {/* Review Status */}
              {review.status === 'PENDING' && (
                <div className="mb-4 p-3 bg-orange-50 border border-orange-200 rounded-lg flex items-center gap-2 text-sm text-orange-700">
                  <AlertCircle className="w-4 h-4" />
                  This review is pending approval
                </div>
              )}

              {/* Content */}
              <h4 className="font-medium text-slate-900 mb-2">{review.title}</h4>
              <p className="text-slate-600 mb-4">{review.content}</p>

              {/* Response */}
              {review.response ? (
                <div className="mt-4 pl-4 border-l-2 border-primary-200 bg-primary-50 rounded-r-lg p-4">
                  <p className="text-sm font-medium text-primary-700 mb-1">Your response</p>
                  <p className="text-slate-600 text-sm">{review.response}</p>
                </div>
              ) : review.status === 'APPROVED' ? (
                <Link
                  href={`/dashboard/reviews/${review.id}`}
                  className="inline-flex items-center gap-2 text-sm text-primary-600 hover:text-primary-700 font-medium"
                >
                  <MessageSquare className="w-4 h-4" />
                  Respond to this review
                </Link>
              ) : null}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
