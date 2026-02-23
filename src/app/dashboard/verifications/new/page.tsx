import { getServerSession } from 'next-auth';
import { redirect, notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import VerificationRequestForm from './VerificationRequestForm';

const verificationTypes: Record<string, { name: string; description: string; requirements: string[] }> = {
  IDENTITY: {
    name: 'ID Verification',
    description: 'Verify your identity with a government-issued photo ID',
    requirements: [
      'Clear photo or scan of your passport, driving licence, or national ID card',
      'Document must be valid and not expired',
      'All text must be clearly readable',
      'Full document including edges must be visible',
    ],
  },
  INSURANCE: {
    name: 'Insurance Certificate',
    description: 'Verify your business insurance coverage',
    requirements: [
      'Current insurance certificate or policy schedule',
      'Must show your business name',
      'Must show coverage dates and amounts',
      'Document must be valid and not expired',
    ],
  },
  PUBLIC_LIABILITY: {
    name: 'Public Liability Insurance',
    description: 'Verify your public liability insurance coverage',
    requirements: [
      'Public liability insurance certificate',
      'Minimum £1,000,000 coverage recommended',
      'Must show your business name',
      'Must be currently valid',
    ],
  },
  QUALIFICATION: {
    name: 'Professional Qualification',
    description: 'Verify your professional qualifications and certifications',
    requirements: [
      'Clear photo or scan of your qualification certificate',
      'Must show your name and qualification details',
      'Include any registration numbers if applicable',
      'NVQ, City & Guilds, or equivalent accepted',
    ],
  },
  GAS_SAFE: {
    name: 'Gas Safe Registration',
    description: 'Verify your Gas Safe Register credentials',
    requirements: [
      'Current Gas Safe ID card (front and back)',
      'Gas Safe registration certificate',
      'Must show your licence number and categories',
      'Must be currently valid',
    ],
  },
  NICEIC: {
    name: 'NICEIC Certification',
    description: 'Verify your NICEIC registration',
    requirements: [
      'NICEIC registration certificate',
      'Must show your registration number',
      'Must show approved contractor or domestic installer status',
      'Must be currently valid',
    ],
  },
  TRUSTMARK: {
    name: 'TrustMark Registration',
    description: 'Verify your TrustMark registered business status',
    requirements: [
      'TrustMark registration certificate',
      'Must show your TrustMark licence number',
      'Must show registered trade categories',
      'Must be currently valid',
    ],
  },
};

async function getProfile(userId: string) {
  const profile = await prisma.tradesProfile.findUnique({
    where: { userId },
    include: {
      verifications: true,
    },
  });
  return profile;
}

export default async function NewVerificationPage({
  searchParams,
}: {
  searchParams: Promise<{ type?: string }>;
}) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    redirect('/login');
  }

  const { type } = await searchParams;

  if (!type || !verificationTypes[type]) {
    notFound();
  }

  const profile = await getProfile(session.user.id);

  if (!profile) {
    redirect('/dashboard/profile');
  }

  // Check if already requested this type
  const existingVerification = profile.verifications.find(v => v.type === type);
  if (existingVerification) {
    redirect('/dashboard/verifications');
  }

  const typeInfo = verificationTypes[type];

  return (
    <div>
      <Link
        href="/dashboard/verifications"
        className="inline-flex items-center gap-2 text-slate-600 hover:text-slate-900 mb-6"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Verifications
      </Link>

      <div className="max-w-2xl">
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
          {/* Header */}
          <div className="p-6 border-b border-slate-200">
            <h1 className="text-xl font-bold text-slate-900">{typeInfo.name}</h1>
            <p className="text-slate-600 mt-1">{typeInfo.description}</p>
          </div>

          {/* Requirements */}
          <div className="p-6 bg-slate-50 border-b border-slate-200">
            <h3 className="font-semibold text-slate-900 mb-3">Requirements</h3>
            <ul className="space-y-2">
              {typeInfo.requirements.map((req, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-slate-600">
                  <span className="text-primary-600 mt-0.5">•</span>
                  {req}
                </li>
              ))}
            </ul>
          </div>

          {/* Form */}
          <div className="p-6">
            <VerificationRequestForm verificationType={type} />
          </div>
        </div>
      </div>
    </div>
  );
}
