'use client';

import {
  LayoutDashboard,
  User,
  Images,
  FileText,
  MessageCircle,
  Star,
  Shield,
  CreditCard,
  Briefcase,
  ClipboardList,
  AlertTriangle,
} from 'lucide-react';
import MobileDrawer from '@/components/navigation/MobileDrawer';

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
  { href: '/dashboard/bad-payers', label: 'Bad Payers', icon: AlertTriangle },
  { href: '/dashboard/subscription', label: 'Subscription', icon: CreditCard },
];

interface DashboardMobileNavProps {
  user: {
    name?: string | null;
    email?: string | null;
  };
  unreadCount: number;
}

export default function DashboardMobileNav({ user, unreadCount }: DashboardMobileNavProps) {
  const itemsWithBadges = navItems.map((item) => ({
    ...item,
    badge: item.href === '/dashboard/messages' ? unreadCount : undefined,
  }));

  return (
    <MobileDrawer
      navItems={itemsWithBadges}
      title="Dashboard"
      titleHref="/dashboard"
      user={user}
      variant="light"
    />
  );
}
