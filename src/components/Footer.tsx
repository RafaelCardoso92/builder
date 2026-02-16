import Link from 'next/link';
import { Facebook, Twitter, Instagram, Linkedin } from 'lucide-react';

const footerLinks = {
  company: [
    { name: 'About Us', href: '/about' },
    { name: 'How it Works', href: '/how-it-works' },
    { name: 'Careers', href: '/careers' },
    { name: 'Press', href: '/press' },
  ],
  tradespeople: [
    { name: 'Join as Tradesperson', href: '/register/tradesperson' },
    { name: 'Pricing', href: '/pricing' },
    { name: 'Success Stories', href: '/success-stories' },
    { name: 'Help Centre', href: '/help' },
  ],
  popular: [
    { name: 'Find a Builder', href: '/trades/building-construction' },
    { name: 'Find a Plumber', href: '/trades/plumbing-heating' },
    { name: 'Find an Electrician', href: '/trades/electrical' },
    { name: 'Find a Roofer', href: '/trades/roofing' },
  ],
  legal: [
    { name: 'Terms of Service', href: '/terms' },
    { name: 'Privacy Policy', href: '/privacy' },
    { name: 'Cookie Policy', href: '/cookies' },
  ],
};

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 bg-primary-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">B</span>
              </div>
              <span className="text-xl font-bold text-white">Builder</span>
            </Link>
            <p className="text-sm text-slate-400 mb-6">
              Find trusted tradespeople in your area. Read reviews, compare quotes, and hire with confidence.
            </p>
            <div className="flex items-center gap-4">
              <a href="#" className="text-slate-400 hover:text-white transition-colors">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="text-slate-400 hover:text-white transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="text-slate-400 hover:text-white transition-colors">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="text-slate-400 hover:text-white transition-colors">
                <Linkedin className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Company */}
          <div>
            <h4 className="text-white font-semibold mb-4">Company</h4>
            <ul className="space-y-3">
              {footerLinks.company.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm hover:text-white transition-colors">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Tradespeople */}
          <div>
            <h4 className="text-white font-semibold mb-4">Tradespeople</h4>
            <ul className="space-y-3">
              {footerLinks.tradespeople.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm hover:text-white transition-colors">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Popular Searches */}
          <div>
            <h4 className="text-white font-semibold mb-4">Popular</h4>
            <ul className="space-y-3">
              {footerLinks.popular.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm hover:text-white transition-colors">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="text-white font-semibold mb-4">Legal</h4>
            <ul className="space-y-3">
              {footerLinks.legal.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm hover:text-white transition-colors">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-slate-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-slate-400">
            © {new Date().getFullYear()} Builder. All rights reserved.
          </p>
          <p className="text-sm text-slate-400">
            Made with care in the UK 🇬🇧
          </p>
        </div>
      </div>
    </footer>
  );
}
