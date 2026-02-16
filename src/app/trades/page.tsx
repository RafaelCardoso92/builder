import Link from 'next/link';
import { ArrowLeft, Building2, Droplet, Zap, Hammer, PaintBucket, Trees, Home, Wrench, Wind, DoorOpen, Sparkles, HardHat } from 'lucide-react';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

async function getTrades() {
  const trades = await prisma.trade.findMany({
    where: { parentId: null },
    include: {
      children: {
        orderBy: { sortOrder: 'asc' },
      },
    },
    orderBy: { sortOrder: 'asc' },
  });
  return trades;
}

const iconMap: Record<string, any> = {
  'building-construction': Building2,
  'plumbing-heating': Droplet,
  'electrical': Zap,
  'carpentry-joinery': Hammer,
  'decorating': PaintBucket,
  'gardens-landscaping': Trees,
  'roofing': Home,
  'plastering-rendering': Wrench,
  'windows-doors': DoorOpen,
  'flooring': HardHat,
  'cleaning': Sparkles,
  'other-services': Wind,
};

export default async function TradesPage() {
  const trades = await getTrades();

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Link href="/" className="inline-flex items-center gap-2 text-slate-600 hover:text-slate-900 mb-6">
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Link>
          <h1 className="text-3xl font-bold text-slate-900">All Trades</h1>
          <p className="text-slate-600 mt-2">Browse all trade categories and find the right professional for your project.</p>
        </div>
      </div>

      {/* Trades Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {trades.map((trade) => {
            const IconComponent = iconMap[trade.slug] || Building2;
            return (
              <div key={trade.id} className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-14 h-14 bg-primary-100 rounded-xl flex items-center justify-center">
                    <IconComponent className="w-7 h-7 text-primary-600" />
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold text-slate-900">{trade.name}</h2>
                    <p className="text-sm text-slate-500">{trade.children.length} subcategories</p>
                  </div>
                </div>

                <div className="space-y-2">
                  {trade.children.slice(0, 5).map((child) => (
                    <Link
                      key={child.id}
                      href={'/search?trade=' + encodeURIComponent(child.name)}
                      className="block px-3 py-2 text-slate-600 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                    >
                      {child.name}
                    </Link>
                  ))}
                  {trade.children.length > 5 && (
                    <p className="px-3 py-2 text-sm text-slate-400">
                      + {trade.children.length - 5} more
                    </p>
                  )}
                </div>

                <Link
                  href={'/search?trade=' + encodeURIComponent(trade.name)}
                  className="inline-block mt-4 text-primary-600 hover:text-primary-700 font-medium"
                >
                  Browse all {trade.name} →
                </Link>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
