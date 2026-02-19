import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import Link from 'next/link';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import {
  LayoutDashboard,
  Shield,
  Star,
  Flag,
  LogOut,
  Home,
} from 'lucide-react';
import AdminMobileNav from './AdminMobileNav';

const navItems = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/verifications', label: 'Verifications', icon: Shield },
  { href: '/admin/reviews', label: 'Reviews', icon: Star },
  { href: '/admin/reports', label: 'Reports', icon: Flag },
];

async function getPendingCounts() {
  const [pendingVerifications, pendingReviews, pendingReports] = await Promise.all([
    prisma.verification.count({ where: { status: 'PENDING' } }),
    prisma.review.count({ where: { status: { in: ['PENDING', 'FLAGGED'] } } }),
    prisma.report.count({ where: { status: { in: ['PENDING', 'INVESTIGATING'] } } }),
  ]);

  return { pendingVerifications, pendingReviews, pendingReports };
}

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== 'ADMIN') {
    redirect('/');
  }

  const { pendingVerifications, pendingReviews, pendingReports } = await getPendingCounts();

  return (
    <div className="min-h-screen bg-slate-100">
      {/* Mobile Navigation */}
      <AdminMobileNav
        user={{ name: session.user.name, email: session.user.email }}
        pendingVerifications={pendingVerifications}
        pendingReviews={pendingReviews}
        pendingReports={pendingReports}
      />

      <div className="flex">
        {/* Desktop Sidebar */}
        <aside className="hidden md:flex md:flex-col md:w-64 md:fixed md:inset-y-0 bg-slate-900">
          {/* Logo */}
          <div className="flex items-center h-16 px-6 border-b border-slate-700">
            <Link href="/admin" className="flex items-center gap-2">
              <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold">B</span>
              </div>
              <span className="font-bold text-white">Admin</span>
            </Link>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
            {navItems.map((item) => {
              const badgeCount =
                item.href === '/admin/verifications'
                  ? pendingVerifications
                  : item.href === '/admin/reviews'
                  ? pendingReviews
                  : item.href === '/admin/reports'
                  ? pendingReports
                  : 0;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className="flex items-center gap-3 px-3 py-2 text-slate-300 rounded-lg hover:bg-slate-800 hover:text-white transition-colors"
                >
                  <item.icon className="w-5 h-5" />
                  <span className="flex-1">{item.label}</span>
                  {badgeCount > 0 && (
                    <span className="inline-flex items-center justify-center px-2 py-0.5 text-xs font-bold text-white bg-orange-500 rounded-full">
                      {badgeCount > 99 ? '99+' : badgeCount}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Footer */}
          <div className="p-4 border-t border-slate-700">
            <Link
              href="/"
              className="flex items-center gap-2 px-3 py-2 text-sm text-slate-400 rounded-lg hover:bg-slate-800 hover:text-white w-full"
            >
              <Home className="w-4 h-4" />
              Back to Site
            </Link>
            <Link
              href="/api/auth/signout"
              className="flex items-center gap-2 px-3 py-2 text-sm text-slate-400 rounded-lg hover:bg-slate-800 hover:text-white w-full mt-1"
            >
              <LogOut className="w-4 h-4" />
              Sign out
            </Link>
          </div>
        </aside>

        {/* Main content */}
        <main className="flex-1 md:pl-64">
          <div className="pt-16 md:pt-0 p-4 md:p-8">{children}</div>
        </main>
      </div>
    </div>
  );
}
