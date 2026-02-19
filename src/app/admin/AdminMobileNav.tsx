'use client';

import {
  LayoutDashboard,
  Shield,
  Star,
  Flag,
} from 'lucide-react';
import MobileDrawer from '@/components/navigation/MobileDrawer';

const navItems = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/verifications', label: 'Verifications', icon: Shield },
  { href: '/admin/reviews', label: 'Reviews', icon: Star },
  { href: '/admin/reports', label: 'Reports', icon: Flag },
];

interface AdminMobileNavProps {
  user: {
    name?: string | null;
    email?: string | null;
  };
  pendingVerifications: number;
  pendingReviews: number;
  pendingReports: number;
}

export default function AdminMobileNav({
  user,
  pendingVerifications,
  pendingReviews,
  pendingReports,
}: AdminMobileNavProps) {
  const itemsWithBadges = navItems.map((item) => ({
    ...item,
    badge:
      item.href === '/admin/verifications'
        ? pendingVerifications
        : item.href === '/admin/reviews'
        ? pendingReviews
        : item.href === '/admin/reports'
        ? pendingReports
        : undefined,
  }));

  return (
    <MobileDrawer
      navItems={itemsWithBadges}
      title="Admin"
      titleHref="/admin"
      user={user}
      variant="dark"
    />
  );
}
