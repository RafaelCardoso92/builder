'use client';

import { FileText, MessageCircle, Star, Heart, Settings, Briefcase } from 'lucide-react';
import MobileDrawer from '@/components/navigation/MobileDrawer';

const navItems = [
  { href: '/account/jobs', label: 'My Jobs', icon: Briefcase },
  { href: '/account/quotes', label: 'My Quotes', icon: FileText },
  { href: '/account/messages', label: 'Messages', icon: MessageCircle },
  { href: '/account/reviews', label: 'My Reviews', icon: Star },
  { href: '/account/favourites', label: 'Saved', icon: Heart },
  { href: '/account/settings', label: 'Settings', icon: Settings },
];

interface AccountMobileNavProps {
  user: {
    name?: string | null;
    email?: string | null;
  };
  unreadCount: number;
}

export default function AccountMobileNav({ user, unreadCount }: AccountMobileNavProps) {
  const itemsWithBadges = navItems.map((item) => ({
    ...item,
    badge: item.href === '/account/messages' ? unreadCount : undefined,
  }));

  return (
    <MobileDrawer
      navItems={itemsWithBadges}
      title="My Account"
      titleHref="/account/jobs"
      user={user}
      variant="light"
    />
  );
}
