import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import JobPostForm from './JobPostForm';

async function getTrades() {
  const trades = await prisma.trade.findMany({
    where: { parentId: { not: null } }, // Get child trades only
    include: {
      parent: { select: { name: true } },
    },
    orderBy: [{ parent: { sortOrder: 'asc' } }, { sortOrder: 'asc' }],
  });

  return trades;
}

export default async function PostJobPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    redirect('/login?callbackUrl=/jobs/post');
  }

  const trades = await getTrades();

  return (
    <div className="min-h-screen bg-slate-50 py-8">
      <div className="max-w-2xl mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900">Post a Job</h1>
          <p className="text-slate-600 mt-2">
            Describe the work you need done and receive quotes from local
            tradespeople.
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <JobPostForm trades={trades} />
        </div>
      </div>
    </div>
  );
}
