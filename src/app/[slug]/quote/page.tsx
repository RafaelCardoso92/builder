import { notFound } from 'next/navigation';
import { getServerSession } from 'next-auth';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import QuoteRequestForm from './QuoteRequestForm';

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

export default async function QuoteRequestPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const session = await getServerSession(authOptions);
  
  const profile = await getProfile(slug);

  if (!profile || !profile.isActive) {
    notFound();
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
            <h1 className="text-2xl font-bold">Request a Quote</h1>
            <p className="text-primary-100 mt-1">
              from {profile.businessName}
            </p>
          </div>

          {/* Form */}
          <div className="p-6">
            <QuoteRequestForm
              profile={profile}
              isLoggedIn={!!session}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
