'use client';

import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { ArrowRight, LayoutDashboard } from 'lucide-react';

export default function DashboardReturnBanner() {
  const { data: session, status } = useSession();

  if (status !== 'authenticated' || !session?.user) {
    return null;
  }

  const isTradesperson = session.user.role === 'TRADESPERSON';
  const isAdmin = session.user.role === 'ADMIN';

  const dashboardLink = isAdmin
    ? '/admin'
    : isTradesperson
      ? '/dashboard'
      : '/account/jobs';

  const dashboardLabel = isAdmin
    ? 'Admin Panel'
    : isTradesperson
      ? 'Dashboard'
      : 'My Account';

  return (
    <div className="bg-primary-600 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
        <div className="flex items-center justify-between">
          <p className="text-sm sm:text-base">
            Welcome back, <span className="font-semibold">{session.user.name}</span>!
          </p>
          <Link
            href={dashboardLink}
            className="inline-flex items-center gap-2 px-4 py-1.5 bg-white text-primary-700 font-medium rounded-lg hover:bg-primary-50 transition-colors text-sm"
          >
            <LayoutDashboard className="w-4 h-4" />
            Go to {dashboardLabel}
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
