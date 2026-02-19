'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { Menu, X, Search, User, ChevronDown, LayoutDashboard, Briefcase } from 'lucide-react';

const trades = [
  { name: 'Builders', href: '/search?trade=builder' },
  { name: 'Plumbers', href: '/search?trade=plumber' },
  { name: 'Electricians', href: '/search?trade=electrician' },
  { name: 'Roofers', href: '/search?trade=roofer' },
  { name: 'Decorators', href: '/search?trade=decorator' },
  { name: 'Landscapers', href: '/search?trade=landscaper' },
];

export default function Header() {
  const { data: session, status } = useSession();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [tradesDropdownOpen, setTradesDropdownOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const isLoggedIn = status === 'authenticated' && session?.user;
  const isTradesperson = session?.user?.role === 'TRADESPERSON';
  const isAdmin = session?.user?.role === 'ADMIN';

  // Determine logo link based on user role
  const logoHref = isLoggedIn
    ? isAdmin
      ? '/admin'
      : isTradesperson
        ? '/dashboard'
        : '/account/jobs'
    : '/';

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo - links to dashboard when logged in */}
          <Link href={logoHref} className="flex items-center gap-2">
            <div className="w-10 h-10 bg-primary-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xl">B</span>
            </div>
            <span className="text-xl font-bold text-slate-900">Builder</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1">
            {/* Trades Dropdown */}
            <div className="relative">
              <button
                onClick={() => setTradesDropdownOpen(!tradesDropdownOpen)}
                onBlur={() => setTimeout(() => setTradesDropdownOpen(false), 150)}
                className="flex items-center gap-1 px-4 py-2 text-slate-600 hover:text-slate-900 font-medium rounded-lg hover:bg-slate-100 transition-colors"
              >
                Find a Trade
                <ChevronDown className={`w-4 h-4 transition-transform ${tradesDropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              {tradesDropdownOpen && (
                <div className="absolute top-full left-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-slate-200 py-2">
                  {trades.map((trade) => (
                    <Link
                      key={trade.href}
                      href={trade.href}
                      className="block px-4 py-2 text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                    >
                      {trade.name}
                    </Link>
                  ))}
                  <hr className="my-2 border-slate-200" />
                  <Link
                    href="/trades"
                    className="block px-4 py-2 text-primary-600 hover:text-primary-700 font-medium"
                  >
                    View all trades
                  </Link>
                </div>
              )}
            </div>

            <Link
              href="/jobs"
              className="px-4 py-2 text-slate-600 hover:text-slate-900 font-medium rounded-lg hover:bg-slate-100 transition-colors"
            >
              Job Board
            </Link>

            <Link
              href="/how-it-works"
              className="px-4 py-2 text-slate-600 hover:text-slate-900 font-medium rounded-lg hover:bg-slate-100 transition-colors"
            >
              How it Works
            </Link>

            {!isTradesperson && (
              <Link
                href="/for-tradespeople"
                className="px-4 py-2 text-slate-600 hover:text-slate-900 font-medium rounded-lg hover:bg-slate-100 transition-colors"
              >
                For Tradespeople
              </Link>
            )}
          </nav>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center gap-3">
            <Link
              href="/search"
              className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
            >
              <Search className="w-5 h-5" />
            </Link>

            {status === 'loading' ? (
              <div className="w-20 h-10 bg-slate-100 rounded-lg animate-pulse" />
            ) : isLoggedIn ? (
              <div className="relative">
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  onBlur={() => setTimeout(() => setUserDropdownOpen(false), 150)}
                  className="flex items-center gap-2 px-4 py-2 text-slate-600 hover:text-slate-900 font-medium rounded-lg hover:bg-slate-100 transition-colors"
                >
                  <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                    <span className="text-primary-600 font-semibold text-sm">
                      {session.user.name?.charAt(0) || 'U'}
                    </span>
                  </div>
                  <span className="max-w-24 truncate">{session.user.name}</span>
                  <ChevronDown className={`w-4 h-4 transition-transform ${userDropdownOpen ? 'rotate-180' : ''}`} />
                </button>

                {userDropdownOpen && (
                  <div className="absolute top-full right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-slate-200 py-2">
                    <div className="px-4 py-2 border-b border-slate-100">
                      <p className="font-medium text-slate-900 truncate">{session.user.name}</p>
                      <p className="text-sm text-slate-500 truncate">{session.user.email}</p>
                    </div>

                    {(isTradesperson || isAdmin) && (
                      <Link
                        href="/dashboard"
                        className="flex items-center gap-2 px-4 py-2 text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                      >
                        <LayoutDashboard className="w-4 h-4" />
                        Dashboard
                      </Link>
                    )}

                    {!isTradesperson && !isAdmin && (
                      <>
                        <Link
                          href="/account/jobs"
                          className="flex items-center gap-2 px-4 py-2 text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                        >
                          <Briefcase className="w-4 h-4" />
                          My Jobs
                        </Link>
                        <Link
                          href="/account/quotes"
                          className="flex items-center gap-2 px-4 py-2 text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                        >
                          <User className="w-4 h-4" />
                          My Account
                        </Link>
                      </>
                    )}

                    <hr className="my-2 border-slate-200" />
                    <Link
                      href="/api/auth/signout"
                      className="block px-4 py-2 text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      Sign Out
                    </Link>
                  </div>
                )}
              </div>
            ) : (
              <>
                <Link
                  href="/login"
                  className="flex items-center gap-2 px-4 py-2 text-slate-600 hover:text-slate-900 font-medium rounded-lg hover:bg-slate-100 transition-colors"
                >
                  <User className="w-5 h-5" />
                  Sign In
                </Link>

                <Link
                  href="/register/tradesperson"
                  className="inline-flex items-center justify-center px-6 py-3 font-medium rounded-lg bg-primary-600 text-white hover:bg-primary-700 transition-colors text-sm"
                >
                  Join as Tradesperson
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-slate-600 hover:bg-slate-100 rounded-lg"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-slate-200">
            <nav className="flex flex-col gap-1">
              <Link
                href="/trades"
                className="px-4 py-3 text-slate-600 hover:text-slate-900 hover:bg-slate-50 rounded-lg font-medium"
              >
                Find a Trade
              </Link>
              <Link
                href="/jobs"
                className="px-4 py-3 text-slate-600 hover:text-slate-900 hover:bg-slate-50 rounded-lg font-medium"
              >
                Job Board
              </Link>
              <Link
                href="/how-it-works"
                className="px-4 py-3 text-slate-600 hover:text-slate-900 hover:bg-slate-50 rounded-lg font-medium"
              >
                How it Works
              </Link>
              {!isTradesperson && (
                <Link
                  href="/for-tradespeople"
                  className="px-4 py-3 text-slate-600 hover:text-slate-900 hover:bg-slate-50 rounded-lg font-medium"
                >
                  For Tradespeople
                </Link>
              )}
              <hr className="my-2 border-slate-200" />

              {isLoggedIn ? (
                <>
                  <div className="px-4 py-2">
                    <p className="font-medium text-slate-900">{session.user.name}</p>
                    <p className="text-sm text-slate-500">{session.user.email}</p>
                  </div>
                  {(isTradesperson || isAdmin) ? (
                    <Link
                      href="/dashboard"
                      className="px-4 py-3 text-slate-600 hover:text-slate-900 hover:bg-slate-50 rounded-lg font-medium"
                    >
                      Dashboard
                    </Link>
                  ) : (
                    <Link
                      href="/account/jobs"
                      className="px-4 py-3 text-slate-600 hover:text-slate-900 hover:bg-slate-50 rounded-lg font-medium"
                    >
                      My Account
                    </Link>
                  )}
                  <Link
                    href="/api/auth/signout"
                    className="px-4 py-3 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg font-medium"
                  >
                    Sign Out
                  </Link>
                </>
              ) : (
                <>
                  <Link
                    href="/login"
                    className="px-4 py-3 text-slate-600 hover:text-slate-900 hover:bg-slate-50 rounded-lg font-medium"
                  >
                    Sign In
                  </Link>
                  <div className="px-4 py-2">
                    <Link
                      href="/register/tradesperson"
                      className="inline-flex items-center justify-center px-6 py-3 font-medium rounded-lg bg-primary-600 text-white hover:bg-primary-700 transition-colors w-full text-center text-sm"
                    >
                      Join as Tradesperson
                    </Link>
                  </div>
                </>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
