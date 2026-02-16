import { notFound, redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import ReviewForm from './ReviewForm';

async function getProfile(slug: string) {
  const profile = await prisma.tradesProfile.findUnique({
    where: { slug },
    include: {
      trades: {
        include: { trade: true },
      },
    },
  });
  return profile;
}

export default async function WriteReviewPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const session = await getServerSession(authOptions);
  
  if (!session) {
    redirect(`/login?callbackUrl=/${slug}/review`);
  }

  const profile = await getProfile(slug);

  if (!profile || !profile.isActive) {
    notFound();
  }

  // Check if user has already reviewed this tradesperson
  const existingReview = await prisma.review.findFirst({
    where: {
      profileId: profile.id,
      authorId: session.user.id,
    },
  });

  if (existingReview) {
    return (
      <div className="min-h-screen bg-slate-50 py-8">
        <div className="max-w-2xl mx-auto px-4">
          <div className="bg-white rounded-xl border border-slate-200 p-8 text-center">
            <h1 className="text-2xl font-bold text-slate-900 mb-4">Already Reviewed</h1>
            <p className="text-slate-600 mb-6">
              You have already submitted a review for {profile.businessName}.
            </p>
            <Link
              href={`/${slug}`}
              className="inline-flex items-center gap-2 px-6 py-3 bg-primary-600 text-white font-medium rounded-lg hover:bg-primary-700"
            >
              View Profile
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 py-8">
      <div className="max-w-2xl mx-auto px-4">
        <Link
          href={`/${slug}`}
          className="inline-flex items-center gap-2 text-slate-600 hover:text-slate-900 mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to {profile.businessName}
        </Link>

        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
          {/* Header */}
          <div className="bg-primary-600 text-white p-6">
            <h1 className="text-2xl font-bold">Write a Review</h1>
            <p className="text-primary-100 mt-1">
              for {profile.businessName}
            </p>
          </div>

          {/* Form */}
          <div className="p-6">
            <ReviewForm 
              profile={profile}
              userId={session.user.id}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
