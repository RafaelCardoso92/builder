import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
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

      <div className="bg-white rounded-xl border border-slate-200 p-6">
        <BadPayerReportForm />
      </div>
    </div>
  );
}
