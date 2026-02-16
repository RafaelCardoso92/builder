import { redirect, notFound } from 'next/navigation';
import Link from 'next/link';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import {
  Briefcase,
  MapPin,
  Clock,
  PoundSterling,
  Calendar,
  Users,
  ArrowLeft,
  Shield,
  CheckCircle,
} from 'lucide-react';
import JobApplicationForm from './JobApplicationForm';

const timeframeLabels: Record<string, string> = {
  ASAP: 'As soon as possible',
  '1_WEEK': 'Within 1 week',
  '2_WEEKS': 'Within 2 weeks',
  '1_MONTH': 'Within 1 month',
  FLEXIBLE: 'Flexible',
};

const applicationStatusLabels: Record<string, string> = {
  PENDING: 'Pending review',
  VIEWED: 'Viewed by customer',
  SHORTLISTED: 'Shortlisted',
  ACCEPTED: 'Accepted',
  DECLINED: 'Declined',
  WITHDRAWN: 'Withdrawn',
};

async function getJob(id: string) {
  const job = await prisma.job.findUnique({
    where: { id },
    include: {
      trade: { select: { id: true, name: true } },
      customer: { select: { id: true, name: true } },
      _count: { select: { applications: true } },
    },
  });

  return job;
}

async function getUserProfile(userId: string) {
  const profile = await prisma.tradesProfile.findUnique({
    where: { userId },
    include: {
      trades: { select: { tradeId: true } },
    },
  });

  return profile;
}

async function getExistingApplication(jobId: string, profileId: string) {
  const application = await prisma.jobApplication.findUnique({
    where: {
      jobId_profileId: { jobId, profileId },
    },
  });

  return application;
}

export default async function JobDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const session = await getServerSession(authOptions);
  const job = await getJob(id);

  if (!job) {
    notFound();
  }

  // If owner, redirect to account view
  if (session?.user?.id === job.customerId) {
    redirect(`/account/jobs/${id}`);
  }

  // Check if user is a tradesperson and has already applied
  let userProfile = null;
  let existingApplication = null;
  let canApply = false;

  if (session?.user?.id) {
    userProfile = await getUserProfile(session.user.id);
    if (userProfile) {
      existingApplication = await getExistingApplication(id, userProfile.id);
      canApply = job.status === 'OPEN' && !existingApplication;
    }
  }

  const statusConfig: Record<string, { label: string; color: string }> = {
    OPEN: { label: 'Open', color: 'bg-green-100 text-green-700' },
    IN_PROGRESS: { label: 'In Progress', color: 'bg-blue-100 text-blue-700' },
    COMPLETED: { label: 'Completed', color: 'bg-slate-100 text-slate-700' },
    CLOSED: { label: 'Closed', color: 'bg-red-100 text-red-700' },
    EXPIRED: { label: 'Expired', color: 'bg-orange-100 text-orange-700' },
  };

  const status = statusConfig[job.status] || statusConfig.OPEN;

  return (
    <div className="min-h-screen bg-slate-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <Link
          href="/jobs"
          className="inline-flex items-center gap-2 text-slate-600 hover:text-slate-900 mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Jobs
        </Link>

        <div className="grid md:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="md:col-span-2 space-y-6">
            {/* Header Card */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
              <div className="flex items-start gap-4">
                <div className="w-14 h-14 bg-primary-100 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Briefcase className="w-7 h-7 text-primary-600" />
                </div>
                <div className="flex-1">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h1 className="text-2xl font-bold text-slate-900">
                        {job.title}
                      </h1>
                      <p className="text-primary-600 font-medium mt-1">
                        {job.trade.name}
                      </p>
                    </div>
                    <span
                      className={`px-3 py-1 text-sm font-medium rounded-full ${status.color}`}
                    >
                      {status.label}
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-4 mt-4 text-sm text-slate-600">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-4 h-4" />
                      {job.postcode}
                    </span>
                    {job.timeframe && (
                      <span className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {timeframeLabels[job.timeframe]}
                      </span>
                    )}
                    <span className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      Posted{' '}
                      {new Date(job.createdAt).toLocaleDateString('en-GB', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                      })}
                    </span>
                    <span className="flex items-center gap-1">
                      <Users className="w-4 h-4" />
                      {job._count.applications} applications
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
              <h2 className="text-lg font-semibold text-slate-900 mb-4">
                Job Description
              </h2>
              <p className="text-slate-600 whitespace-pre-line">
                {job.description}
              </p>

              {job.address && (
                <div className="mt-4 pt-4 border-t border-slate-100">
                  <p className="text-sm text-slate-500">
                    <strong>Address:</strong> {job.address}
                  </p>
                </div>
              )}
            </div>

            {/* Images */}
            {job.images.length > 0 && (
              <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                <h2 className="text-lg font-semibold text-slate-900 mb-4">
                  Photos
                </h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {job.images.map((img, idx) => (
                    <img
                      key={idx}
                      src={img}
                      alt={`Job photo ${idx + 1}`}
                      className="w-full h-32 object-cover rounded-lg"
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Application Form */}
            {canApply && userProfile && (
              <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                <h2 className="text-lg font-semibold text-slate-900 mb-4">
                  Apply for this Job
                </h2>
                <JobApplicationForm
                  jobId={job.id}
                  subscriptionTier={userProfile.subscriptionTier}
                />
              </div>
            )}

            {existingApplication && (
              <div className="bg-green-50 border border-green-200 rounded-xl p-6">
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-6 h-6 text-green-600" />
                  <div>
                    <h3 className="font-semibold text-green-900">
                      Application Submitted
                    </h3>
                    <p className="text-green-700 text-sm">
                      You applied on{' '}
                      {new Date(
                        existingApplication.createdAt
                      ).toLocaleDateString('en-GB')}
                      . Status:{' '}
                      <span className="font-medium">
                        {applicationStatusLabels[existingApplication.status] || existingApplication.status}
                      </span>
                    </p>
                  </div>
                </div>
              </div>
            )}

            {!session && job.status === 'OPEN' && (
              <div className="bg-slate-100 border border-slate-200 rounded-xl p-6 text-center">
                <h3 className="font-semibold text-slate-900 mb-2">
                  Want to apply for this job?
                </h3>
                <p className="text-slate-600 mb-4">
                  Sign in as a tradesperson to submit your application.
                </p>
                <Link
                  href={`/login?callbackUrl=/jobs/${job.id}`}
                  className="inline-flex items-center gap-2 px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
                >
                  Sign In to Apply
                </Link>
              </div>
            )}

            {session && !userProfile && job.status === 'OPEN' && (
              <div className="bg-slate-100 border border-slate-200 rounded-xl p-6 text-center">
                <h3 className="font-semibold text-slate-900 mb-2">
                  Are you a tradesperson?
                </h3>
                <p className="text-slate-600 mb-4">
                  Create a tradesperson profile to apply for jobs.
                </p>
                <Link
                  href="/register/tradesperson"
                  className="inline-flex items-center gap-2 px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
                >
                  Register as Tradesperson
                </Link>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Budget Card */}
            {(job.budgetMin || job.budgetMax) && (
              <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                <h3 className="text-sm font-medium text-slate-500 mb-2">
                  Budget
                </h3>
                <div className="flex items-center gap-2 text-2xl font-bold text-slate-900">
                  <PoundSterling className="w-6 h-6" />
                  {job.budgetMin && job.budgetMax
                    ? `${job.budgetMin.toLocaleString()} - ${job.budgetMax.toLocaleString()}`
                    : job.budgetMax
                    ? `Up to ${job.budgetMax.toLocaleString()}`
                    : `From ${job.budgetMin?.toLocaleString()}`}
                </div>
              </div>
            )}

            {/* Posted By Card */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
              <h3 className="text-sm font-medium text-slate-500 mb-2">
                Posted by
              </h3>
              <p className="font-semibold text-slate-900">{job.customer.name}</p>
            </div>

            {/* Tips Card */}
            <div className="bg-primary-50 border border-primary-100 rounded-xl p-6">
              <h3 className="font-semibold text-primary-900 mb-3 flex items-center gap-2">
                <Shield className="w-5 h-5" />
                Tips for Applying
              </h3>
              <ul className="space-y-2 text-sm text-primary-800">
                <li>Write a personalized cover letter</li>
                <li>Highlight relevant experience</li>
                <li>Be clear about your availability</li>
                <li>Provide a realistic quote</li>
                <li>Respond promptly to messages</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
