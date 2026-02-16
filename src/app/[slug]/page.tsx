import { notFound } from 'next/navigation';
import Link from 'next/link';
import { MapPin, Star, Shield, Clock, Phone, Mail, Globe, CheckCircle, ArrowLeft, PenLine } from 'lucide-react';
import { prisma } from '@/lib/prisma';
import MessageButton from './MessageButton';
import ReportButton from '@/components/ui/ReportButton';

async function getProfile(slug: string) {
  const profile = await prisma.tradesProfile.findUnique({
    where: { slug },
    include: {
      user: {
        select: { id: true, name: true, image: true },
      },
      trades: {
        include: { trade: true },
      },
      portfolio: {
        orderBy: { createdAt: 'desc' },
        take: 6,
      },
      reviews: {
        where: { status: 'APPROVED' },
        include: {
          author: {
            select: { name: true, image: true },
          },
        },
        orderBy: { createdAt: 'desc' },
        take: 5,
      },
      verifications: {
        where: { status: 'APPROVED' },
      },
    },
  });

  return profile;
}

export default async function ProfilePage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ reviewed?: string }>;
}) {
  const { slug } = await params;
  const { reviewed } = await searchParams;
  const profile = await getProfile(slug);

  if (!profile || !profile.isActive) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Success Message */}
      {reviewed === 'true' && (
        <div className="bg-green-600 text-white py-3">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            Thank you for your review! It will be visible once approved.
          </div>
        </div>
      )}

      {/* Header */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Link href="/search" className="inline-flex items-center gap-2 text-slate-600 hover:text-slate-900 mb-6">
            <ArrowLeft className="w-4 h-4" />
            Back to search
          </Link>

          <div className="flex flex-col md:flex-row gap-6">
            {/* Logo */}
            <div className="flex-shrink-0">
              {profile.logo ? (
                <img
                  src={profile.logo}
                  alt={profile.businessName}
                  className="w-32 h-32 rounded-xl object-cover"
                />
              ) : (
                <div className="w-32 h-32 bg-primary-100 rounded-xl flex items-center justify-center">
                  <span className="text-4xl font-bold text-primary-600">
                    {profile.businessName.charAt(0)}
                  </span>
                </div>
              )}
            </div>

            {/* Info */}
            <div className="flex-1">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="flex items-center gap-3">
                    <h1 className="text-2xl md:text-3xl font-bold text-slate-900">
                      {profile.businessName}
                    </h1>
                    {profile.isVerified && (
                      <span className="inline-flex items-center gap-1 px-3 py-1 bg-green-100 text-green-700 text-sm font-medium rounded-full">
                        <Shield className="w-4 h-4" />
                        Verified
                      </span>
                    )}
                  </div>
                  {profile.tagline && (
                    <p className="text-lg text-slate-600 mt-2">{profile.tagline}</p>
                  )}
                </div>

                {/* Rating */}
                {profile.reviewCount > 0 && (
                  <div className="text-right">
                    <div className="flex items-center gap-2">
                      <Star className="w-6 h-6 text-yellow-400 fill-current" />
                      <span className="text-2xl font-bold text-slate-900">
                        {profile.averageRating.toFixed(1)}
                      </span>
                    </div>
                    <p className="text-slate-500">
                      {profile.reviewCount} review{profile.reviewCount !== 1 ? 's' : ''}
                    </p>
                  </div>
                )}
              </div>

              {/* Trades */}
              <div className="flex flex-wrap gap-2 mt-4">
                {profile.trades.map((t) => (
                  <span
                    key={t.id}
                    className="px-3 py-1 bg-primary-50 text-primary-700 text-sm font-medium rounded-full"
                  >
                    {t.trade.name}
                  </span>
                ))}
              </div>

              {/* Quick Info */}
              <div className="flex flex-wrap items-center gap-4 mt-6 text-slate-600">
                <span className="flex items-center gap-2">
                  <MapPin className="w-5 h-5" />
                  {profile.city}, {profile.postcode}
                </span>
                {profile.responseTime && (
                  <span className="flex items-center gap-2">
                    <Clock className="w-5 h-5" />
                    {profile.responseTime}
                  </span>
                )}
              </div>
            </div>

            {/* Contact */}
            <div className="md:w-64 flex-shrink-0">
              <div className="space-y-3">
                <a
                  href={'tel:' + profile.phone}
                  className="flex items-center gap-3 text-slate-600 hover:text-primary-600"
                >
                  <Phone className="w-5 h-5" />
                  {profile.phone}
                </a>
                <a
                  href={'mailto:' + profile.email}
                  className="flex items-center gap-3 text-slate-600 hover:text-primary-600"
                >
                  <Mail className="w-5 h-5" />
                  {profile.email}
                </a>
                {profile.website && (
                  <a
                    href={profile.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 text-slate-600 hover:text-primary-600"
                  >
                    <Globe className="w-5 h-5" />
                    Website
                  </a>
                )}
              </div>
              <div className="mt-6 space-y-3">
                <Link
                  href={'/' + profile.slug + '/quote'}
                  className="block w-full py-3 px-4 bg-primary-600 text-white text-center font-medium rounded-lg hover:bg-primary-700 transition-colors"
                >
                  Request a Quote
                </Link>
                <MessageButton
                  recipientId={profile.user.id}
                  recipientName={profile.businessName}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid md:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="md:col-span-2 space-y-8">
            {/* About */}
            {profile.description && (
              <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                <h2 className="text-xl font-semibold text-slate-900 mb-4">About</h2>
                <p className="text-slate-600 whitespace-pre-line">{profile.description}</p>
              </div>
            )}

            {/* Portfolio */}
            {profile.portfolio.length > 0 && (
              <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                <h2 className="text-xl font-semibold text-slate-900 mb-4">Recent Work</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {profile.portfolio.map((item) => (
                    <div key={item.id} className="aspect-square rounded-lg overflow-hidden bg-slate-100">
                      {item.images[0] ? (
                        <img
                          src={item.images[0]}
                          alt={item.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-slate-400">
                          No image
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Reviews */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-4">
                  <h2 className="text-xl font-semibold text-slate-900">Reviews</h2>
                  {profile.reviewCount > 0 && (
                    <div className="flex items-center gap-2">
                      <Star className="w-5 h-5 text-yellow-400 fill-current" />
                      <span className="font-semibold">{profile.averageRating.toFixed(1)}</span>
                      <span className="text-slate-500">({profile.reviewCount})</span>
                    </div>
                  )}
                </div>
                <Link
                  href={'/' + profile.slug + '/review'}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-primary-50 text-primary-700 font-medium rounded-lg hover:bg-primary-100 transition-colors"
                >
                  <PenLine className="w-4 h-4" />
                  Write a Review
                </Link>
              </div>

              {profile.reviews.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-slate-500 mb-4">No reviews yet. Be the first to review!</p>
                  <Link
                    href={'/' + profile.slug + '/review'}
                    className="inline-flex items-center gap-2 px-6 py-3 bg-primary-600 text-white font-medium rounded-lg hover:bg-primary-700"
                  >
                    <PenLine className="w-4 h-4" />
                    Write a Review
                  </Link>
                </div>
              ) : (
                <div className="space-y-6">
                  {profile.reviews.map((review) => (
                    <div key={review.id} className="border-b border-slate-100 pb-6 last:border-0 last:pb-0">
                      <div className="flex items-center justify-between gap-3 mb-3">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                            <span className="text-primary-600 font-semibold">
                              {review.author.name.charAt(0)}
                            </span>
                          </div>
                          <div className="flex-1">
                            <p className="font-medium text-slate-900">{review.author.name}</p>
                            <div className="flex items-center gap-2">
                              <div className="flex items-center gap-1">
                                {[...Array(5)].map((_, i) => (
                                  <Star
                                    key={i}
                                    className={'w-4 h-4 ' + (i < review.overallRating ? 'text-yellow-400 fill-current' : 'text-slate-200')}
                                  />
                                ))}
                              </div>
                              <span className="text-sm text-slate-500">
                                {new Date(review.createdAt).toLocaleDateString('en-GB', {
                                  month: 'short',
                                  year: 'numeric',
                                })}
                              </span>
                            </div>
                          </div>
                        </div>
                        <ReportButton
                          targetType="REVIEW"
                          targetId={review.id}
                          variant="icon"
                        />
                      </div>
                      <h4 className="font-medium text-slate-900 mb-1">{review.title}</h4>
                      <p className="text-slate-600">{review.content}</p>
                      {review.response && (
                        <div className="mt-4 pl-4 border-l-2 border-primary-200 bg-primary-50 rounded-r-lg p-4">
                          <p className="text-sm font-medium text-primary-700 mb-1">
                            Response from {profile.businessName}
                          </p>
                          <p className="text-slate-600 text-sm">{review.response}</p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Write Review Card */}
            <div className="bg-primary-50 rounded-xl border border-primary-200 p-6">
              <h3 className="font-semibold text-slate-900 mb-2">Had work done?</h3>
              <p className="text-sm text-slate-600 mb-4">
                Help others by sharing your experience with {profile.businessName}.
              </p>
              <Link
                href={'/' + profile.slug + '/review'}
                className="block w-full py-2 px-4 bg-primary-600 text-white text-center font-medium rounded-lg hover:bg-primary-700 transition-colors"
              >
                Write a Review
              </Link>
            </div>

            {/* Verifications */}
            {profile.verifications.length > 0 && (
              <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                <h3 className="font-semibold text-slate-900 mb-4">Verifications</h3>
                <div className="space-y-3">
                  {profile.verifications.map((v) => (
                    <div key={v.id} className="flex items-center gap-3">
                      <CheckCircle className="w-5 h-5 text-green-600" />
                      <span className="text-slate-700">{v.type.replace('_', ' ')}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Coverage Area */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
              <h3 className="font-semibold text-slate-900 mb-4">Coverage Area</h3>
              <p className="text-slate-600">
                Based in <strong>{profile.city}</strong>
              </p>
              <p className="text-slate-600 mt-1">
                Covers a <strong>{profile.coverageRadius} mile</strong> radius
              </p>
            </div>

            {/* Report Profile */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
              <h3 className="font-semibold text-slate-900 mb-2">Something wrong?</h3>
              <p className="text-sm text-slate-600 mb-3">
                Report inappropriate content or suspicious activity.
              </p>
              <ReportButton
                targetType="PROFILE"
                targetId={profile.id}
                variant="full"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
