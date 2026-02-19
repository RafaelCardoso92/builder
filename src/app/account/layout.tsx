import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import Link from 'next/link';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { FileText, MessageCircle, Star, LogOut, Briefcase } from 'lucide-react';
import AccountMobileNav from './AccountMobileNav';

const navItems = [
  { href: '/account/jobs', label: 'My Jobs', icon: Briefcase },
  { href: '/account/quotes', label: 'My Quotes', icon: FileText },
  { href: '/account/messages', label: 'Messages', icon: MessageCircle },
  { href: '/account/reviews', label: 'My Reviews', icon: Star },
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

export default async function AccountLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect('/login?callbackUrl=/account/quotes');
  }

  const unreadCount = await getUnreadCount(session.user.id);

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Mobile Navigation */}
      <AccountMobileNav
        user={{ name: session.user.name, email: session.user.email }}
        unreadCount={unreadCount}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 md:pt-8 pb-8">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Desktop Sidebar - hidden on mobile */}
          <aside className="hidden md:block md:w-64 flex-shrink-0">
            <div className="bg-white rounded-xl border border-slate-200 p-4">
              {/* User Info */}
              <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-100">
                <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
                  <span className="text-primary-600 font-semibold text-lg">
                    {session.user.name?.charAt(0) || 'U'}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-slate-900 truncate">
                    {session.user.name}
                  </p>
                  <p className="text-sm text-slate-500 truncate">
                    {session.user.email}
                  </p>
                </div>
              </div>

              {/* Navigation */}
              <nav className="space-y-1">
                {navItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="flex items-center gap-3 px-3 py-2 text-slate-600 rounded-lg hover:bg-slate-100 hover:text-slate-900 transition-colors"
                  >
                    <item.icon className="w-5 h-5" />
                    <span className="flex-1">{item.label}</span>
                    {item.href === '/account/messages' && unreadCount > 0 && (
                      <span className="inline-flex items-center justify-center px-2 py-0.5 text-xs font-bold text-white bg-primary-600 rounded-full">
                        {unreadCount > 99 ? '99+' : unreadCount}
                      </span>
                    )}
                  </Link>
                ))}
              </nav>

              <div className="mt-6 pt-4 border-t border-slate-100">
                <Link
                  href="/api/auth/signout"
                  className="flex items-center gap-2 px-3 py-2 text-sm text-slate-600 rounded-lg hover:bg-slate-100 w-full"
                >
                  <LogOut className="w-4 h-4" />
                  Sign out
                </Link>
              </div>
            </div>
          </aside>

          {/* Main content */}
          <main className="flex-1">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}
