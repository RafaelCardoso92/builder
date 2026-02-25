import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { AlertTriangle } from 'lucide-react';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import BadPayerReportForm from './BadPayerReportForm';

export default async function NewBadPayerReportPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    redirect('/login?callbackUrl=/dashboard/bad-payers/new');
  }

  const profile = await prisma.tradesProfile.findUnique({
    where: { userId: session.user.id },
  });

  if (!profile) {
    redirect('/dashboard');
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900">Submit Bad Payer Report</h1>
        <p className="text-slate-600 mt-2">
          Report a customer who has not paid for work you completed. Please provide
          accurate information and evidence to support your claim.
        </p>
      </div>

      {/* Legal Warning */}
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6">
        <div className="flex gap-3">
          <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm text-amber-800">
              <strong>Important:</strong> You are solely responsible for the accuracy of this report.
              False reports may constitute defamation. By submitting, you agree to our{' '}
              <Link href="/bad-payers/guidelines" className="underline hover:text-amber-900">
                Bad Payer Report Guidelines
              </Link>.
            </p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 p-6">
        <BadPayerReportForm />
      </div>
    </div>
  );
}
