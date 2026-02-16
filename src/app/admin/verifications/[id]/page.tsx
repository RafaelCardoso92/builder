import { getServerSession } from 'next-auth';
import { redirect, notFound } from 'next/navigation';
import Link from 'next/link';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import {
  ArrowLeft,
  Shield,
  Building2,
  Mail,
  Phone,
  MapPin,
  Calendar,
  FileText,
  ExternalLink,
  Clock,
  CheckCircle,
  XCircle,
} from 'lucide-react';
import VerificationActions from './VerificationActions';

async function getVerification(id: string) {
  const verification = await prisma.verification.findUnique({
    where: { id },
    include: {
      profile: {
        include: {
          user: {
            select: { email: true, name: true, createdAt: true },
          },
          trades: {
            include: { trade: true },
          },
          verifications: {
            where: { status: 'APPROVED' },
          },
        },
      },
    },
  });

  return verification;
}

function formatVerificationType(type: string) {
  const labels: Record<string, string> = {
    IDENTITY: 'ID Verification',
    INSURANCE: 'Insurance Certificate',
    PUBLIC_LIABILITY: 'Public Liability Insurance',
    QUALIFICATION: 'Professional Qualification',
    GAS_SAFE: 'Gas Safe Registration',
    NICEIC: 'NICEIC Certification',
    TRUSTMARK: 'TrustMark Registration',
  };
  return labels[type] || type.replace(/_/g, ' ');
}

function getTypeDescription(type: string) {
  const descriptions: Record<string, string> = {
    IDENTITY: 'Government-issued photo ID (passport, driving licence)',
    INSURANCE: 'Valid insurance certificate covering their work',
    PUBLIC_LIABILITY: 'Public liability insurance (minimum £1m recommended)',
    QUALIFICATION: 'Professional qualification or certification',
    GAS_SAFE: 'Gas Safe Register ID card and certificate',
    NICEIC: 'NICEIC registration certificate',
    TRUSTMARK: 'TrustMark registered business certificate',
  };
  return descriptions[type] || '';
}

export default async function VerificationDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== 'ADMIN') {
    redirect('/');
  }

  const { id } = await params;
  const verification = await getVerification(id);

  if (!verification) {
    notFound();
  }

  const profile = verification.profile;
  const isPending = verification.status === 'PENDING';

  return (
    <div>
      <Link
        href="/admin/verifications"
        className="inline-flex items-center gap-2 text-slate-600 hover:text-slate-900 mb-6"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Verifications
      </Link>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Verification Details */}
          <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
            <div className="p-6 border-b border-slate-200">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
                  <Shield className="w-6 h-6 text-primary-600" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-slate-900">
                    {formatVerificationType(verification.type)}
                  </h1>
                  <p className="text-slate-500">
                    {getTypeDescription(verification.type)}
                  </p>
                </div>
              </div>
            </div>

            <div className="p-6">
              {/* Status */}
              <div className="mb-6">
                <span
                  className={
                    'inline-flex items-center gap-2 px-3 py-1.5 text-sm font-medium rounded-full ' +
                    (verification.status === 'PENDING'
                      ? 'bg-orange-100 text-orange-700'
                      : verification.status === 'APPROVED'
                      ? 'bg-green-100 text-green-700'
                      : 'bg-red-100 text-red-700')
                  }
                >
                  {verification.status === 'PENDING' && <Clock className="w-4 h-4" />}
                  {verification.status === 'APPROVED' && <CheckCircle className="w-4 h-4" />}
                  {verification.status === 'REJECTED' && <XCircle className="w-4 h-4" />}
                  {verification.status}
                </span>
              </div>

              {/* Document */}
              {verification.documentUrl ? (
                <div className="mb-6">
                  <h3 className="text-sm font-medium text-slate-500 mb-2">
                    Uploaded Document
                  </h3>
                  <a
                    href={verification.documentUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-3 bg-slate-100 rounded-lg hover:bg-slate-200 transition-colors"
                  >
                    <FileText className="w-5 h-5 text-slate-600" />
                    <span className="text-slate-900 font-medium">View Document</span>
                    <ExternalLink className="w-4 h-4 text-slate-400" />
                  </a>
                </div>
              ) : (
                <div className="mb-6 p-4 bg-orange-50 border border-orange-200 rounded-lg">
                  <p className="text-orange-700 text-sm">
                    No document was uploaded with this verification request.
                  </p>
                </div>
              )}

              {/* Timeline */}
              <div className="space-y-3">
                <div className="flex items-center gap-3 text-sm">
                  <Calendar className="w-4 h-4 text-slate-400" />
                  <span className="text-slate-500">Submitted:</span>
                  <span className="text-slate-900">
                    {new Date(verification.createdAt).toLocaleDateString('en-GB', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </span>
                </div>

                {verification.verifiedAt && (
                  <div className="flex items-center gap-3 text-sm">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span className="text-slate-500">Verified:</span>
                    <span className="text-slate-900">
                      {new Date(verification.verifiedAt).toLocaleDateString('en-GB', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric',
                      })}
                    </span>
                  </div>
                )}

                {verification.expiresAt && (
                  <div className="flex items-center gap-3 text-sm">
                    <Clock className="w-4 h-4 text-slate-400" />
                    <span className="text-slate-500">Expires:</span>
                    <span className="text-slate-900">
                      {new Date(verification.expiresAt).toLocaleDateString('en-GB', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric',
                      })}
                    </span>
                  </div>
                )}

                {verification.notes && (
                  <div className="mt-4 p-3 bg-slate-50 rounded-lg">
                    <p className="text-sm text-slate-500 mb-1">Notes:</p>
                    <p className="text-slate-700">{verification.notes}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Actions */}
            {isPending && (
              <div className="p-6 bg-slate-50 border-t border-slate-200">
                <VerificationActions
                  verificationId={verification.id}
                  profileId={profile.id}
                />
              </div>
            )}
          </div>
        </div>

        {/* Sidebar - Business Info */}
        <div className="space-y-6">
          {/* Business Card */}
          <div className="bg-white rounded-xl border border-slate-200 p-6">
            <h3 className="font-semibold text-slate-900 mb-4 flex items-center gap-2">
              <Building2 className="w-5 h-5" />
              Business Details
            </h3>

            <div className="space-y-4">
              <div>
                <Link
                  href={'/' + profile.slug}
                  target="_blank"
                  className="text-lg font-semibold text-primary-600 hover:text-primary-700 flex items-center gap-1"
                >
                  {profile.businessName}
                  <ExternalLink className="w-4 h-4" />
                </Link>
                <p className="text-sm text-slate-500">@{profile.slug}</p>
              </div>

              <div className="flex items-center gap-2 text-sm text-slate-600">
                <Mail className="w-4 h-4 text-slate-400" />
                {profile.user.email}
              </div>

              <div className="flex items-center gap-2 text-sm text-slate-600">
                <Phone className="w-4 h-4 text-slate-400" />
                {profile.phone}
              </div>

              <div className="flex items-center gap-2 text-sm text-slate-600">
                <MapPin className="w-4 h-4 text-slate-400" />
                {profile.city}, {profile.postcode}
              </div>
            </div>

            {/* Trades */}
            <div className="mt-4 pt-4 border-t border-slate-100">
              <p className="text-sm text-slate-500 mb-2">Trades:</p>
              <div className="flex flex-wrap gap-2">
                {profile.trades.map((t) => (
                  <span
                    key={t.id}
                    className="px-2 py-1 bg-slate-100 text-slate-700 text-xs rounded-full"
                  >
                    {t.trade.name}
                  </span>
                ))}
              </div>
            </div>

            {/* Member Since */}
            <div className="mt-4 pt-4 border-t border-slate-100">
              <p className="text-sm text-slate-500">
                Member since{' '}
                {new Date(profile.user.createdAt).toLocaleDateString('en-GB', {
                  month: 'long',
                  year: 'numeric',
                })}
              </p>
            </div>
          </div>

          {/* Other Verifications */}
          <div className="bg-white rounded-xl border border-slate-200 p-6">
            <h3 className="font-semibold text-slate-900 mb-4">Other Verifications</h3>

            {profile.verifications.length === 0 ? (
              <p className="text-sm text-slate-500">No other approved verifications</p>
            ) : (
              <div className="space-y-2">
                {profile.verifications.map((v) => (
                  <div
                    key={v.id}
                    className="flex items-center gap-2 text-sm"
                  >
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span className="text-slate-700">
                      {formatVerificationType(v.type)}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
