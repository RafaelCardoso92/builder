'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Menu, X, Search, User, ChevronDown } from 'lucide-react';

const trades = [
  { name: 'Builders', href: '/trades/building-construction' },
  { name: 'Plumbers', href: '/trades/plumbing-heating' },
  { name: 'Electricians', href: '/trades/electrical' },
  { name: 'Roofers', href: '/trades/roofing' },
  { name: 'Decorators', href: '/trades/decorating' },
  { name: 'Landscapers', href: '/trades/gardens-landscaping' },
];

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [tradesDropdownOpen, setTradesDropdownOpen] = useState(false);

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
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
                    View all trades →
                  </Link>
                </div>
              )}
            </div>

            <Link
              href="/how-it-works"
              className="px-4 py-2 text-slate-600 hover:text-slate-900 font-medium rounded-lg hover:bg-slate-100 transition-colors"
            >
              How it Works
            </Link>

            <Link
              href="/for-tradespeople"
              className="px-4 py-2 text-slate-600 hover:text-slate-900 font-medium rounded-lg hover:bg-slate-100 transition-colors"
            >
              For Tradespeople
            </Link>
          </nav>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center gap-3">
            <Link
              href="/search"
              className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
            >
              <Search className="w-5 h-5" />
            </Link>

            <Link
              href="/login"
              className="flex items-center gap-2 px-4 py-2 text-slate-600 hover:text-slate-900 font-medium rounded-lg hover:bg-slate-100 transition-colors"
            >
              <User className="w-5 h-5" />
              Sign In
            </Link>

            <Link href="/register/tradesperson" className="inline-flex items-center justify-center px-6 py-3 font-medium rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors text-sm">
              Join as Tradesperson
            </Link>
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
                href="/how-it-works"
                className="px-4 py-3 text-slate-600 hover:text-slate-900 hover:bg-slate-50 rounded-lg font-medium"
              >
                How it Works
              </Link>
              <Link
                href="/for-tradespeople"
                className="px-4 py-3 text-slate-600 hover:text-slate-900 hover:bg-slate-50 rounded-lg font-medium"
              >
                For Tradespeople
              </Link>
              <hr className="my-2 border-slate-200" />
              <Link
                href="/login"
                className="px-4 py-3 text-slate-600 hover:text-slate-900 hover:bg-slate-50 rounded-lg font-medium"
              >
                Sign In
              </Link>
              <div className="px-4 py-2">
                <Link href="/register/tradesperson" className="inline-flex items-center justify-center px-6 py-3 font-medium rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors w-full text-center text-sm">
                  Join as Tradesperson
                </Link>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
