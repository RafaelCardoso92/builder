import { getServerSession } from 'next-auth';
import { redirect, notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Star, Calendar, Briefcase, PoundSterling } from 'lucide-react';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import ReviewResponseForm from './ReviewResponseForm';

async function getReview(reviewId: string, userId: string) {
  const review = await prisma.review.findUnique({
    where: { id: reviewId },
    include: {
      profile: {
        select: {
          userId: true,
          businessName: true,
        },
      },
      author: {
        select: {
          name: true,
          image: true,
        },
      },
    },
  });

  if (!review || review.profile.userId !== userId) {
    return null;
  }

  return review;
}

export default async function ReviewDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    redirect('/login');
  }

  const review = await getReview(id, session.user.id);

  if (!review) {
    notFound();
  }

  return (
    <div>
      <Link
        href="/dashboard/reviews"
        className="inline-flex items-center gap-2 text-slate-600 hover:text-slate-900 mb-6"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Reviews
      </Link>

      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b border-slate-200">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-primary-100 rounded-full flex items-center justify-center">
                <span className="text-xl text-primary-600 font-semibold">
                  {review.author.name.charAt(0)}
                </span>
              </div>
              <div>
                <h2 className="text-xl font-semibold text-slate-900">{review.author.name}</h2>
                <p className="text-slate-600">
                  Reviewed on {new Date(review.createdAt).toLocaleDateString('en-GB', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                  })}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-1">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-6 h-6 ${i < review.overallRating ? 'text-yellow-400 fill-current' : 'text-slate-200'}`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Rating Breakdown */}
        {(review.qualityRating || review.reliabilityRating || review.valueRating) && (
          <div className="p-6 bg-slate-50 border-b border-slate-200">
            <div className="grid grid-cols-3 gap-4">
              {review.qualityRating && (
                <div>
                  <p className="text-sm text-slate-600 mb-1">Quality</p>
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 ${i < review.qualityRating! ? 'text-yellow-400 fill-current' : 'text-slate-200'}`}
                      />
                    ))}
                  </div>
                </div>
              )}
              {review.reliabilityRating && (
                <div>
                  <p className="text-sm text-slate-600 mb-1">Reliability</p>
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 ${i < review.reliabilityRating! ? 'text-yellow-400 fill-current' : 'text-slate-200'}`}
                      />
                    ))}
                  </div>
                </div>
              )}
              {review.valueRating && (
                <div>
                  <p className="text-sm text-slate-600 mb-1">Value</p>
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 ${i < review.valueRating! ? 'text-yellow-400 fill-current' : 'text-slate-200'}`}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Review Content */}
        <div className="p-6">
          <h3 className="text-lg font-semibold text-slate-900 mb-3">{review.title}</h3>
          <p className="text-slate-600 whitespace-pre-line">{review.content}</p>

          {/* Work Details */}
          {(review.workType || review.workDate || review.cost) && (
            <div className="flex flex-wrap gap-4 mt-6 pt-6 border-t border-slate-200">
              {review.workType && (
                <div className="flex items-center gap-2 text-sm text-slate-600">
                  <Briefcase className="w-4 h-4" />
                  {review.workType}
                </div>
              )}
              {review.workDate && (
                <div className="flex items-center gap-2 text-sm text-slate-600">
                  <Calendar className="w-4 h-4" />
                  {new Date(review.workDate).toLocaleDateString('en-GB', {
                    month: 'long',
                    year: 'numeric',
                  })}
                </div>
              )}
              {review.cost && (
                <div className="flex items-center gap-2 text-sm text-slate-600">
                  <PoundSterling className="w-4 h-4" />
                  {review.cost}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Response Section */}
        <div className="p-6 bg-slate-50 border-t border-slate-200">
          {review.response ? (
            <div>
              <h4 className="font-medium text-slate-900 mb-3">Your Response</h4>
              <div className="pl-4 border-l-2 border-primary-400">
                <p className="text-slate-600 whitespace-pre-line">{review.response}</p>
                <p className="text-sm text-slate-500 mt-2">
                  Responded on {new Date(review.respondedAt!).toLocaleDateString('en-GB', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                  })}
                </p>
              </div>
            </div>
          ) : review.status === 'APPROVED' ? (
            <div>
              <h4 className="font-medium text-slate-900 mb-3">Respond to this Review</h4>
              <p className="text-sm text-slate-600 mb-4">
                Responding to reviews shows potential customers that you value feedback and are engaged with your business.
              </p>
              <ReviewResponseForm reviewId={review.id} />
            </div>
          ) : (
            <div className="text-center py-4">
              <p className="text-slate-600">
                You can respond to this review once it has been approved.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
