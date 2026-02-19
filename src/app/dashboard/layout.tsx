import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import Link from 'next/link';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import {
  LayoutDashboard,
  User,
  Images,
  FileText,
  MessageCircle,
  Star,
  Shield,
  CreditCard,
  BarChart3,
  Settings,
  LogOut,
  Briefcase,
  ClipboardList,
  AlertTriangle,
} from 'lucide-react';
import DashboardMobileNav from './DashboardMobileNav';

const navItems = [
  { href: '/dashboard', label: 'Overview', icon: LayoutDashboard },
  { href: '/dashboard/profile', label: 'Profile', icon: User },
  { href: '/dashboard/portfolio', label: 'Portfolio', icon: Images },
  { href: '/dashboard/jobs', label: 'Job Board', icon: Briefcase },
  { href: '/dashboard/applications', label: 'My Applications', icon: ClipboardList },
  { href: '/dashboard/quotes', label: 'Quote Requests', icon: FileText },
  { href: '/dashboard/messages', label: 'Messages', icon: MessageCircle },
  { href: '/dashboard/reviews', label: 'Reviews', icon: Star },
  { href: '/dashboard/verifications', label: 'Verifications', icon: Shield },
  { href: '/dashboard/analytics', label: 'Analytics', icon: BarChart3 },
  { href: '/dashboard/bad-payers', label: 'Bad Payers', icon: AlertTriangle },
  { href: '/dashboard/subscription', label: 'Subscription', icon: CreditCard },
  { href: '/dashboard/settings', label: 'Settings', icon: Settings },
];

async function getUnreadCount(userId: string) {
  const conversations = await prisma.conversation.findMany({
    where: {
      participants: {
        some: { userId },
      },
    },
    include: {
      participants: {
        where: { userId },
      },
    },
  });

  let totalUnread = 0;
  for (const conv of conversations) {
    const participant = conv.participants[0];
    const unread = await prisma.message.count({
      where: {
        conversationId: conv.id,
        senderId: { not: userId },
        createdAt: {
          gt: participant?.lastReadAt || new Date(0),
        },
      },
    });
    totalUnread += unread;
  }

  return totalUnread;
}

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect('/login?callbackUrl=/dashboard');
  }

  if (session.user.role !== 'TRADESPERSON' && session.user.role !== 'ADMIN') {
    redirect('/');
  }

  const unreadCount = await getUnreadCount(session.user.id);

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Mobile Navigation */}
      <DashboardMobileNav
        user={{ name: session.user.name, email: session.user.email }}
        unreadCount={unreadCount}
      />

      <div className="flex">
        {/* Desktop Sidebar */}
        <aside className="hidden md:flex md:flex-col md:w-64 md:fixed md:inset-y-0 bg-white border-r border-slate-200">
          {/* Logo */}
          <div className="flex items-center h-16 px-6 border-b border-slate-200">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold">B</span>
              </div>
              <span className="font-bold text-slate-900">Builder</span>
            </Link>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center gap-3 px-3 py-2 text-slate-600 rounded-lg hover:bg-slate-100 hover:text-slate-900 transition-colors"
              >
                <item.icon className="w-5 h-5" />
                <span className="flex-1">{item.label}</span>
                {item.href === '/dashboard/messages' && unreadCount > 0 && (
                  <span className="inline-flex items-center justify-center px-2 py-0.5 text-xs font-bold text-white bg-primary-600 rounded-full">
                    {unreadCount > 99 ? '99+' : unreadCount}
                  </span>
                )}
              </Link>
            ))}
          </nav>

          {/* User */}
          <div className="p-4 border-t border-slate-200">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                <span className="text-primary-600 font-semibold">
                  {session.user.name?.charAt(0) || 'U'}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-slate-900 truncate">
                  {session.user.name}
                </p>
                <p className="text-xs text-slate-500 truncate">
                  {session.user.email}
                </p>
              </div>
            </div>
            <Link
              href="/api/auth/signout"
              className="flex items-center gap-2 px-3 py-2 text-sm text-slate-600 rounded-lg hover:bg-slate-100 w-full"
            >
              <LogOut className="w-4 h-4" />
              Sign out
            </Link>
          </div>
        </aside>

        {/* Main content */}
        <main className="flex-1 md:pl-64">
          <div className="pt-16 md:pt-0 p-4 md:p-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
