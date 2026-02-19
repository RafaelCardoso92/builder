'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { X, Menu, LogOut } from 'lucide-react';

interface NavItem {
  href: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: number;
}

interface MobileDrawerProps {
  navItems: NavItem[];
  title: string;
  titleHref: string;
  user?: {
    name?: string | null;
    email?: string | null;
  };
  variant?: 'light' | 'dark';
}

export default function MobileDrawer({
  navItems,
  title,
  titleHref,
  user,
  variant = 'light',
}: MobileDrawerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  // Close drawer on route change
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  // Prevent body scroll when drawer is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const isDark = variant === 'dark';

  return (
    <>
      {/* Mobile Header Bar */}
      <div className={`md:hidden fixed top-0 left-0 right-0 h-14 z-40 flex items-center justify-between px-4 border-b ${
        isDark
          ? 'bg-slate-900 border-slate-700'
          : 'bg-white border-slate-200'
      }`}>
        <button
          onClick={() => setIsOpen(true)}
          className={`p-2 -ml-2 rounded-lg ${
            isDark
              ? 'text-slate-300 hover:bg-slate-800'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
          aria-label="Open menu"
        >
          <Menu className="w-6 h-6" />
        </button>

        <Link href={titleHref} className={`font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
          {title}
        </Link>

        <div className="w-10" />
      </div>

      {/* Drawer Overlay */}
      {isOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/50 transition-opacity"
            onClick={() => setIsOpen(false)}
          />

          {/* Drawer */}
          <div className={`absolute inset-y-0 left-0 w-72 max-w-[85vw] shadow-xl flex flex-col transform transition-transform ${
            isDark ? 'bg-slate-900' : 'bg-white'
          }`}>
            {/* Header */}
            <div className={`flex items-center justify-between h-14 px-4 border-b ${
              isDark ? 'border-slate-700' : 'border-slate-200'
            }`}>
              <Link
                href={titleHref}
                className={`flex items-center gap-2 font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}
                onClick={() => setIsOpen(false)}
              >
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                  isDark ? 'bg-primary-600' : 'bg-primary-600'
                }`}>
                  <span className="text-white font-bold">B</span>
                </div>
                {title}
              </Link>
              <button
                onClick={() => setIsOpen(false)}
                className={`p-2 rounded-lg ${
                  isDark
                    ? 'text-slate-400 hover:text-white hover:bg-slate-800'
                    : 'text-slate-400 hover:text-slate-600 hover:bg-slate-100'
                }`}
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Navigation */}
            <nav className="flex-1 overflow-y-auto py-4 px-3">
              {navItems.map((item) => {
                const isActive = pathname === item.href ||
                  (item.href !== '/dashboard' && item.href !== '/account' && item.href !== '/admin' && pathname?.startsWith(item.href));

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setIsOpen(false)}
                    className={`flex items-center gap-3 px-3 py-3 rounded-lg mb-1 transition-colors ${
                      isActive
                        ? isDark
                          ? 'bg-slate-800 text-white'
                          : 'bg-primary-50 text-primary-700'
                        : isDark
                          ? 'text-slate-300 hover:bg-slate-800 hover:text-white'
                          : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                    }`}
                  >
                    <item.icon className="w-5 h-5 flex-shrink-0" />
                    <span className="flex-1 truncate">{item.label}</span>
                    {item.badge && item.badge > 0 && (
                      <span className="px-2 py-0.5 text-xs font-bold text-white bg-primary-600 rounded-full">
                        {item.badge > 99 ? '99+' : item.badge}
                      </span>
                    )}
                  </Link>
                );
              })}
            </nav>

            {/* User & Sign Out */}
            <div className={`border-t p-4 ${isDark ? 'border-slate-700' : 'border-slate-200'}`}>
              {user && (
                <div className="flex items-center gap-3 mb-4">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    isDark ? 'bg-slate-700' : 'bg-primary-100'
                  }`}>
                    <span className={`font-semibold ${isDark ? 'text-white' : 'text-primary-600'}`}>
                      {user.name?.charAt(0) || 'U'}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm font-medium truncate ${isDark ? 'text-white' : 'text-slate-900'}`}>
                      {user.name}
                    </p>
                    <p className="text-xs text-slate-500 truncate">
                      {user.email}
                    </p>
                  </div>
                </div>
              )}
              <Link
                href="/api/auth/signout"
                className={`flex items-center gap-2 px-3 py-2 text-sm rounded-lg w-full ${
                  isDark
                    ? 'text-slate-300 hover:bg-slate-800'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                <LogOut className="w-4 h-4" />
                Sign out
              </Link>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
