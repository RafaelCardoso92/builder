import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import ProfileForm from './ProfileForm';

async function getProfileData(userId: string) {
  const profile = await prisma.tradesProfile.findUnique({
    where: { userId },
    include: {
      trades: {
        include: { trade: true },
      },
      openingHours: true,
    },
  });

  const allTrades = await prisma.trade.findMany({
    where: { parentId: null },
    include: {
      children: {
        orderBy: { name: 'asc' },
      },
    },
    orderBy: { name: 'asc' },
  });

  return { profile, allTrades };
}

export default async function ProfilePage() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    redirect('/login');
  }

  const { profile, allTrades } = await getProfileData(session.user.id);

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900">Edit Profile</h1>
        <p className="text-slate-600 mt-1">
          Keep your profile up to date to attract more customers
        </p>
      </div>

      <ProfileForm profile={profile} allTrades={allTrades} />
    </div>
  );
}
