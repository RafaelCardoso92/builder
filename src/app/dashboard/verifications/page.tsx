import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import {
  CheckCircle,
  Clock,
  XCircle,
  AlertTriangle,
  Plus,
  FileText,
} from 'lucide-react';

async function getVerifications(userId: string) {
  const profile = await prisma.tradesProfile.findUnique({
    where: { userId },
    include: {
      verifications: {
        orderBy: { createdAt: 'desc' },
      },
    },
  });
  return profile;
}

const verificationTypes = [
  {
    type: 'IDENTITY',
    name: 'ID Verification',
    description: 'Government-issued photo ID (passport, driving licence)',
    icon: '🪪',
  },
  {
    type: 'INSURANCE',
    name: 'Insurance',
    description: 'Valid business insurance certificate',
    icon: '📋',
  },
  {
    type: 'PUBLIC_LIABILITY',
    name: 'Public Liability',
    description: 'Public liability insurance (min £1m recommended)',
    icon: '🛡️',
  },
  {
    type: 'QUALIFICATION',
    name: 'Qualification',
    description: 'Professional qualification or certification',
    icon: '🎓',
  },
  {
    type: 'GAS_SAFE',
    name: 'Gas Safe',
    description: 'Gas Safe Register ID and certificate',
    icon: '🔥',
  },
  {
    type: 'NICEIC',
    name: 'NICEIC',
    description: 'NICEIC registration certificate',
    icon: '⚡',
  },
  {
    type: 'TRUSTMARK',
    name: 'TrustMark',
    description: 'TrustMark registered business certificate',
    icon: '✓',
  },
];

const statusConfig = {
  PENDING: {
    label: 'Pending Review',
    icon: Clock,
    className: 'bg-orange-100 text-orange-700',
  },
  APPROVED: {
    label: 'Verified',
    icon: CheckCircle,
    className: 'bg-green-100 text-green-700',
  },
  REJECTED: {
    label: 'Rejected',
    icon: XCircle,
    className: 'bg-red-100 text-red-700',
  },
  EXPIRED: {
    label: 'Expired',
    icon: AlertTriangle,
    className: 'bg-slate-100 text-slate-700',
  },
};

export default async function DashboardVerificationsPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    redirect('/login');
  }

  const profile = await getVerifications(session.user.id);

  if (!profile) {
    redirect('/dashboard/profile');
  }

  const approvedCount = profile.verifications.filter(v => v.status === 'APPROVED').length;

  // Get existing verification types
  const existingTypes = new Set(profile.verifications.map(v => v.type as string));
  const availableTypes = verificationTypes.filter(t => !existingTypes.has(t.type));

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900">Verifications</h1>
        <p className="text-slate-600 mt-1">
          Build trust with customers by verifying your credentials
        </p>
      </div>

      {/* Verification Stats */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 mb-8">
        <div>
          <p className="text-sm text-slate-500">Verified Badges</p>
          <p className="text-lg font-semibold text-slate-900">{approvedCount}</p>
        </div>
      </div>

      {/* Existing Verifications */}
      {profile.verifications.length > 0 && (
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-slate-900 mb-4">Your Verifications</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {profile.verifications.map((v) => {
              const typeInfo = verificationTypes.find(t => t.type === v.type);
              const status = statusConfig[v.status];
              const StatusIcon = status.icon;

              return (
                <div
                  key={v.id}
                  className="bg-white rounded-xl border border-slate-200 p-4"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{typeInfo?.icon || '📄'}</span>
                      <div>
                        <p className="font-medium text-slate-900">
                          {typeInfo?.name || v.type}
                        </p>
                        <span
                          className={
                            'inline-flex items-center gap-1 px-2 py-0.5 text-xs font-medium rounded-full mt-1 ' +
                            status.className
                          }
                        >
                          <StatusIcon className="w-3 h-3" />
                          {status.label}
                        </span>
                      </div>
                    </div>
                  </div>

                  {v.status === 'REJECTED' && v.notes && (
                    <div className="p-3 bg-red-50 rounded-lg mt-3">
                      <p className="text-sm text-red-700">{v.notes}</p>
                    </div>
                  )}

                  {v.status === 'APPROVED' && v.expiresAt && (
                    <p className="text-sm text-slate-500 mt-2">
                      Expires: {new Date(v.expiresAt).toLocaleDateString()}
                    </p>
                  )}

                  {v.documentUrl && (
                    <a
                      href={v.documentUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-sm text-primary-600 hover:text-primary-700 mt-3"
                    >
                      <FileText className="w-4 h-4" />
                      View Document
                    </a>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Add New Verification */}
      {availableTypes.length > 0 && (
        <div>
          <h2 className="text-lg font-semibold text-slate-900 mb-4">Add Verification</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {availableTypes.map((type) => (
              <Link
                key={type.type}
                href={'/dashboard/verifications/new?type=' + type.type}
                className="bg-white rounded-xl border border-slate-200 border-dashed p-4 hover:border-primary-300 hover:bg-primary-50 transition-colors group"
              >
                <div className="flex items-start gap-3">
                  <span className="text-2xl">{type.icon}</span>
                  <div>
                    <p className="font-medium text-slate-900 group-hover:text-primary-700">
                      {type.name}
                    </p>
                    <p className="text-sm text-slate-500 mt-1">{type.description}</p>
                  </div>
                </div>
                <div className="flex items-center gap-1 text-sm text-primary-600 mt-3">
                  <Plus className="w-4 h-4" />
                  Request Verification
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Info */}
      <div className="mt-8 bg-blue-50 rounded-xl p-6">
        <h3 className="font-semibold text-blue-900 mb-2">Why Get Verified?</h3>
        <ul className="space-y-2 text-sm text-blue-700">
          <li className="flex items-start gap-2">
            <CheckCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
            Build trust with potential customers
          </li>
          <li className="flex items-start gap-2">
            <CheckCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
            Stand out in search results with verification badges
          </li>
          <li className="flex items-start gap-2">
            <CheckCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
            Show customers you are legitimate and qualified
          </li>
          <li className="flex items-start gap-2">
            <CheckCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
            Verifications are reviewed within 24-48 hours
          </li>
        </ul>
      </div>
    </div>
  );
}
