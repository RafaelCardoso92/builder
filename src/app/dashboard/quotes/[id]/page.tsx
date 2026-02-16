import { getServerSession } from 'next-auth';
import { redirect, notFound } from 'next/navigation';
import Link from 'next/link';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { ArrowLeft, MapPin, Calendar, Clock, PoundSterling, Phone, Mail, User } from 'lucide-react';
import QuoteResponseForm from './QuoteResponseForm';

async function getQuote(userId: string, quoteId: string) {
  const profile = await prisma.tradesProfile.findUnique({
    where: { userId },
  });

  if (!profile) return null;

  const quote = await prisma.quoteRequest.findUnique({
    where: { id: quoteId },
    include: {
      customer: {
        select: { name: true, email: true, phone: true },
      },
    },
  });

  if (!quote || quote.profileId !== profile.id) return null;

  // Mark as viewed if pending
  if (quote.status === 'PENDING') {
    await prisma.quoteRequest.update({
      where: { id: quoteId },
      data: { status: 'VIEWED' },
    });
  }

  return quote;
}

const timeframeLabels: Record<string, string> = {
  ASAP: 'As soon as possible',
  '1_WEEK': 'Within 1 week',
  '2_WEEKS': 'Within 2 weeks',
  '1_MONTH': 'Within 1 month',
  FLEXIBLE: 'Flexible',
};

const budgetLabels: Record<string, string> = {
  UNDER_500: 'Under £500',
  '500_1000': '£500 - £1,000',
  '1000_2500': '£1,000 - £2,500',
  '2500_5000': '£2,500 - £5,000',
  '5000_10000': '£5,000 - £10,000',
  OVER_10000: 'Over £10,000',
  NOT_SURE: 'Not sure yet',
};

export default async function QuoteDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    redirect('/login');
  }

  const { id } = await params;
  const quote = await getQuote(session.user.id, id);

  if (!quote) {
    notFound();
  }

  return (
    <div>
      <Link
        href="/dashboard/quotes"
        className="inline-flex items-center gap-2 text-slate-600 hover:text-slate-900 mb-6"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Quotes
      </Link>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Header */}
          <div className="bg-white rounded-xl border border-slate-200 p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h1 className="text-2xl font-bold text-slate-900">{quote.title}</h1>
                <p className="text-slate-600 mt-1">{quote.tradeType}</p>
              </div>
              <span className={`px-3 py-1 text-sm font-medium rounded-full ${
                quote.status === 'PENDING' || quote.status === 'VIEWED'
                  ? 'bg-orange-100 text-orange-700'
                  : quote.status === 'RESPONDED'
                  ? 'bg-blue-100 text-blue-700'
                  : quote.status === 'ACCEPTED'
                  ? 'bg-green-100 text-green-700'
                  : 'bg-slate-100 text-slate-700'
              }`}>
                {quote.status}
              </span>
            </div>

            <div className="flex flex-wrap gap-4 text-sm text-slate-500">
              <span className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                {new Date(quote.createdAt).toLocaleDateString('en-GB', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric',
                })}
              </span>
              <span className="flex items-center gap-1">
                <MapPin className="w-4 h-4" />
                {quote.postcode}
              </span>
              {quote.timeframe && (
                <span className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  {timeframeLabels[quote.timeframe] || quote.timeframe}
                </span>
              )}
              {quote.budgetRange && (
                <span className="flex items-center gap-1">
                  <PoundSterling className="w-4 h-4" />
                  {budgetLabels[quote.budgetRange] || quote.budgetRange}
                </span>
              )}
            </div>
          </div>

          {/* Description */}
          <div className="bg-white rounded-xl border border-slate-200 p-6">
            <h2 className="font-semibold text-slate-900 mb-4">Job Description</h2>
            <p className="text-slate-600 whitespace-pre-line">{quote.description}</p>

            {quote.address && (
              <div className="mt-4 pt-4 border-t border-slate-100">
                <p className="text-sm text-slate-500">Address</p>
                <p className="text-slate-900">{quote.address}, {quote.postcode}</p>
              </div>
            )}

            {quote.preferredDates && (
              <div className="mt-4 pt-4 border-t border-slate-100">
                <p className="text-sm text-slate-500">Preferred Dates/Times</p>
                <p className="text-slate-900">{quote.preferredDates}</p>
              </div>
            )}
          </div>

          {/* Images */}
          {quote.images && quote.images.length > 0 && (
            <div className="bg-white rounded-xl border border-slate-200 p-6">
              <h2 className="font-semibold text-slate-900 mb-4">Photos</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {quote.images.map((url, index) => (
                  <a
                    key={index}
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="aspect-square bg-slate-100 rounded-lg overflow-hidden"
                  >
                    <img
                      src={url}
                      alt={`Photo ${index + 1}`}
                      className="w-full h-full object-cover hover:scale-105 transition-transform"
                    />
                  </a>
                ))}
              </div>
            </div>
          )}

          {/* Response Form */}
          {(quote.status === 'PENDING' || quote.status === 'VIEWED') && (
            <div className="bg-white rounded-xl border border-slate-200 p-6">
              <h2 className="font-semibold text-slate-900 mb-4">Send a Response</h2>
              <QuoteResponseForm quoteId={quote.id} />
            </div>
          )}
        </div>

        {/* Sidebar - Customer Info */}
        <div className="space-y-6">
          <div className="bg-white rounded-xl border border-slate-200 p-6">
            <h2 className="font-semibold text-slate-900 mb-4">Customer Details</h2>
            
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
                  <User className="w-6 h-6 text-primary-600" />
                </div>
                <div>
                  <p className="font-medium text-slate-900">{quote.customer.name}</p>
                  <p className="text-sm text-slate-500">Customer</p>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 space-y-3">
                {quote.customer.phone && (
                  <a
                    href={`tel:${quote.customer.phone}`}
                    className="flex items-center gap-3 text-slate-600 hover:text-primary-600"
                  >
                    <Phone className="w-5 h-5" />
                    {quote.customer.phone}
                  </a>
                )}
                <a
                  href={`mailto:${quote.customer.email}`}
                  className="flex items-center gap-3 text-slate-600 hover:text-primary-600"
                >
                  <Mail className="w-5 h-5" />
                  {quote.customer.email}
                </a>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-xl border border-slate-200 p-6">
            <h2 className="font-semibold text-slate-900 mb-4">Quick Actions</h2>
            <div className="space-y-2">
              <a
                href={`tel:${quote.customer.phone}`}
                className="block w-full py-2 px-4 bg-primary-600 text-white text-center font-medium rounded-lg hover:bg-primary-700"
              >
                Call Customer
              </a>
              <a
                href={`mailto:${quote.customer.email}?subject=Re: ${quote.title}`}
                className="block w-full py-2 px-4 bg-slate-100 text-slate-700 text-center font-medium rounded-lg hover:bg-slate-200"
              >
                Send Email
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
