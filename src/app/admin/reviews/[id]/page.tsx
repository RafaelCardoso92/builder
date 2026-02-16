import { getServerSession } from 'next-auth';
import { redirect, notFound } from 'next/navigation';
import Link from 'next/link';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import {
  ArrowLeft,
  Star,
  User,
  Building2,
  Mail,
  Calendar,
  Briefcase,
  PoundSterling,
  Clock,
  CheckCircle,
  XCircle,
  Flag,
  ExternalLink,
  ImageIcon,
} from 'lucide-react';
import ReviewModerationActions from './ReviewModerationActions';

async function getReview(id: string) {
  const review = await prisma.review.findUnique({
    where: { id },
    include: {
      profile: {
        select: {
          id: true,
          businessName: true,
          slug: true,
          averageRating: true,
          reviewCount: true,
        },
      },
      author: {
        select: {
          id: true,
          name: true,
          email: true,
          createdAt: true,
          reviewsGiven: {
            select: { id: true, status: true },
          },
        },
      },
    },
  });

  return review;
}

const statusConfig = {
  PENDING: {
    label: 'Pending Review',
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
    label: 'Flagged for Review',
    icon: Flag,
    className: 'bg-yellow-100 text-yellow-700',
  },
};

export default async function AdminReviewDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== 'ADMIN') {
    redirect('/');
  }

  const { id } = await params;
  const review = await getReview(id);

  if (!review) {
    notFound();
  }

  const status = statusConfig[review.status];
  const StatusIcon = status.icon;
  const isPending = review.status === 'PENDING' || review.status === 'FLAGGED';

  // Calculate author's review history
  const authorApprovedReviews = review.author.reviewsGiven.filter(r => r.status === 'APPROVED').length;
  const authorRejectedReviews = review.author.reviewsGiven.filter(r => r.status === 'REJECTED').length;

  return (
    <div>
      <Link
        href="/admin/reviews"
        className="inline-flex items-center gap-2 text-slate-600 hover:text-slate-900 mb-6"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Reviews
      </Link>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Review Content */}
          <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
            <div className="p-6 border-b border-slate-200">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={
                        'w-6 h-6 ' +
                        (i < review.overallRating
                          ? 'text-yellow-400 fill-current'
                          : 'text-slate-200')
                      }
                    />
                  ))}
                  <span className="text-2xl font-bold text-slate-900 ml-2">
                    {review.overallRating}/5
                  </span>
                </div>
                <span
                  className={
                    'inline-flex items-center gap-2 px-3 py-1.5 text-sm font-medium rounded-full ' +
                    status.className
                  }
                >
                  <StatusIcon className="w-4 h-4" />
                  {status.label}
                </span>
              </div>

              <h1 className="text-xl font-bold text-slate-900">{review.title}</h1>
            </div>

            {/* Rating Breakdown */}
            {(review.qualityRating || review.reliabilityRating || review.valueRating) && (
              <div className="p-4 bg-slate-50 border-b border-slate-200">
                <div className="grid grid-cols-3 gap-4">
                  {review.qualityRating && (
                    <div>
                      <p className="text-sm text-slate-500 mb-1">Quality</p>
                      <div className="flex items-center gap-1">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={
                              'w-4 h-4 ' +
                              (i < review.qualityRating!
                                ? 'text-yellow-400 fill-current'
                                : 'text-slate-200')
                            }
                          />
                        ))}
                      </div>
                    </div>
                  )}
                  {review.reliabilityRating && (
                    <div>
                      <p className="text-sm text-slate-500 mb-1">Reliability</p>
                      <div className="flex items-center gap-1">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={
                              'w-4 h-4 ' +
                              (i < review.reliabilityRating!
                                ? 'text-yellow-400 fill-current'
                                : 'text-slate-200')
                            }
                          />
                        ))}
                      </div>
                    </div>
                  )}
                  {review.valueRating && (
                    <div>
                      <p className="text-sm text-slate-500 mb-1">Value</p>
                      <div className="flex items-center gap-1">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={
                              'w-4 h-4 ' +
                              (i < review.valueRating!
                                ? 'text-yellow-400 fill-current'
                                : 'text-slate-200')
                            }
                          />
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Review Text */}
            <div className="p-6">
              <p className="text-slate-700 whitespace-pre-line">{review.content}</p>

              {/* Work Details */}
              {(review.workType || review.workDate || review.cost) && (
                <div className="flex flex-wrap gap-4 mt-6 pt-6 border-t border-slate-200">
                  {review.workType && (
                    <div className="flex items-center gap-2 text-sm text-slate-600">
                      <Briefcase className="w-4 h-4 text-slate-400" />
                      {review.workType}
                    </div>
                  )}
                  {review.workDate && (
                    <div className="flex items-center gap-2 text-sm text-slate-600">
                      <Calendar className="w-4 h-4 text-slate-400" />
                      {new Date(review.workDate).toLocaleDateString('en-GB', {
                        month: 'long',
                        year: 'numeric',
                      })}
                    </div>
                  )}
                  {review.cost && (
                    <div className="flex items-center gap-2 text-sm text-slate-600">
                      <PoundSterling className="w-4 h-4 text-slate-400" />
                      {review.cost}
                    </div>
                  )}
                </div>
              )}

              {/* Images */}
              {review.images && review.images.length > 0 && (
                <div className="mt-6 pt-6 border-t border-slate-200">
                  <p className="text-sm font-medium text-slate-700 mb-3 flex items-center gap-2">
                    <ImageIcon className="w-4 h-4" />
                    Attached Images ({review.images.length})
                  </p>
                  <div className="grid grid-cols-3 gap-3">
                    {review.images.map((img, i) => (
                      <a
                        key={i}
                        href={img}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="aspect-square rounded-lg overflow-hidden bg-slate-100"
                      >
                        <img
                          src={img}
                          alt={'Review image ' + (i + 1)}
                          className="w-full h-full object-cover"
                        />
                      </a>
                    ))}
                  </div>
                </div>
              )}

              {/* Tradesperson Response */}
              {review.response && (
                <div className="mt-6 pt-6 border-t border-slate-200">
                  <p className="text-sm font-medium text-slate-700 mb-2">
                    Tradesperson Response:
                  </p>
                  <div className="pl-4 border-l-2 border-primary-300 bg-primary-50 rounded-r-lg p-4">
                    <p className="text-slate-700">{review.response}</p>
                    {review.respondedAt && (
                      <p className="text-sm text-slate-500 mt-2">
                        Responded on{' '}
                        {new Date(review.respondedAt).toLocaleDateString('en-GB', {
                          day: 'numeric',
                          month: 'long',
                          year: 'numeric',
                        })}
                      </p>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Moderation Actions */}
            {isPending && (
              <div className="p-6 bg-slate-50 border-t border-slate-200">
                <ReviewModerationActions
                  reviewId={review.id}
                  profileId={review.profile.id}
                  currentStatus={review.status}
                />
              </div>
            )}
          </div>

          {/* Submission Info */}
          <div className="bg-white rounded-xl border border-slate-200 p-6">
            <h3 className="font-semibold text-slate-900 mb-4">Submission Details</h3>
            <div className="grid sm:grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-slate-500">Submitted</p>
                <p className="text-slate-900">
                  {new Date(review.createdAt).toLocaleDateString('en-GB', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </p>
              </div>
              <div>
                <p className="text-slate-500">Last Updated</p>
                <p className="text-slate-900">
                  {new Date(review.updatedAt).toLocaleDateString('en-GB', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </p>
              </div>
              <div>
                <p className="text-slate-500">Review ID</p>
                <p className="text-slate-900 font-mono text-xs">{review.id}</p>
              </div>
              <div>
                <p className="text-slate-500">Verified Purchase</p>
                <p className="text-slate-900">{review.isVerified ? 'Yes' : 'No'}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Author Card */}
          <div className="bg-white rounded-xl border border-slate-200 p-6">
            <h3 className="font-semibold text-slate-900 mb-4 flex items-center gap-2">
              <User className="w-5 h-5" />
              Review Author
            </h3>

            <div className="space-y-3">
              <div>
                <p className="font-medium text-slate-900">{review.author.name}</p>
                <p className="text-sm text-slate-500">{review.author.email}</p>
              </div>

              <div className="pt-3 border-t border-slate-100">
                <p className="text-sm text-slate-500">Member since</p>
                <p className="text-slate-900">
                  {new Date(review.author.createdAt).toLocaleDateString('en-GB', {
                    month: 'long',
                    year: 'numeric',
                  })}
                </p>
              </div>

              <div className="pt-3 border-t border-slate-100">
                <p className="text-sm text-slate-500 mb-2">Review History</p>
                <div className="flex gap-4 text-sm">
                  <div>
                    <span className="text-green-600 font-medium">{authorApprovedReviews}</span>
                    <span className="text-slate-500"> approved</span>
                  </div>
                  <div>
                    <span className="text-red-600 font-medium">{authorRejectedReviews}</span>
                    <span className="text-slate-500"> rejected</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Business Card */}
          <div className="bg-white rounded-xl border border-slate-200 p-6">
            <h3 className="font-semibold text-slate-900 mb-4 flex items-center gap-2">
              <Building2 className="w-5 h-5" />
              Business Being Reviewed
            </h3>

            <div className="space-y-3">
              <div>
                <Link
                  href={'/' + review.profile.slug}
                  target="_blank"
                  className="font-medium text-primary-600 hover:text-primary-700 flex items-center gap-1"
                >
                  {review.profile.businessName}
                  <ExternalLink className="w-4 h-4" />
                </Link>
              </div>

              <div className="pt-3 border-t border-slate-100">
                <p className="text-sm text-slate-500">Current Rating</p>
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={
                          'w-4 h-4 ' +
                          (i < Math.round(review.profile.averageRating)
                            ? 'text-yellow-400 fill-current'
                            : 'text-slate-200')
                        }
                      />
                    ))}
                  </div>
                  <span className="font-medium">
                    {review.profile.averageRating.toFixed(1)}
                  </span>
                  <span className="text-slate-500">
                    ({review.profile.reviewCount} reviews)
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          {!isPending && (
            <div className="bg-white rounded-xl border border-slate-200 p-6">
              <h3 className="font-semibold text-slate-900 mb-4">Actions</h3>
              <ReviewModerationActions
                reviewId={review.id}
                profileId={review.profile.id}
                currentStatus={review.status}
                compact
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
