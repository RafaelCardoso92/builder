import { getServerSession } from 'next-auth';
import { redirect, notFound } from 'next/navigation';
import Link from 'next/link';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { ArrowLeft, MapPin, Calendar, Phone, Mail, Star, Shield, MessageSquare } from 'lucide-react';

async function getQuote(userId: string, quoteId: string) {
  const quote = await prisma.quoteRequest.findUnique({
    where: { id: quoteId },
    include: {
      profile: {
        select: {
          id: true,
          businessName: true,
          slug: true,
          phone: true,
          email: true,
          averageRating: true,
          reviewCount: true,
          isVerified: true,
        },
      },
    },
  });

  if (!quote || quote.customerId !== userId) return null;

  // Get conversation messages if any
  const conversation = await prisma.conversation.findFirst({
    where: { quoteRequestId: quoteId },
    include: {
      messages: {
        orderBy: { createdAt: 'asc' },
        include: {
          sender: {
            select: { name: true, id: true },
          },
        },
      },
    },
  });

  return { quote, conversation };
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

const statusConfig = {
  PENDING: { label: 'Awaiting Response', color: 'bg-orange-100 text-orange-700' },
  VIEWED: { label: 'Viewed by Tradesperson', color: 'bg-blue-100 text-blue-700' },
  RESPONDED: { label: 'Response Received', color: 'bg-green-100 text-green-700' },
  ACCEPTED: { label: 'Accepted', color: 'bg-emerald-100 text-emerald-700' },
  DECLINED: { label: 'Declined', color: 'bg-red-100 text-red-700' },
  COMPLETED: { label: 'Completed', color: 'bg-slate-100 text-slate-700' },
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
  const data = await getQuote(session.user.id, id);

  if (!data) {
    notFound();
  }

  const { quote, conversation } = data;
  const status = statusConfig[quote.status as keyof typeof statusConfig];

  return (
    <div>
      <Link
        href="/account/quotes"
        className="inline-flex items-center gap-2 text-slate-600 hover:text-slate-900 mb-6"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to My Quotes
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
              <span className={`px-3 py-1 text-sm font-medium rounded-full ${status.color}`}>
                {status.label}
              </span>
            </div>

            <div className="flex flex-wrap gap-4 text-sm text-slate-500">
              <span className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                Sent {new Date(quote.createdAt).toLocaleDateString('en-GB', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric',
                })}
              </span>
              <span className="flex items-center gap-1">
                <MapPin className="w-4 h-4" />
                {quote.postcode}
              </span>
            </div>
          </div>

          {/* Your Request */}
          <div className="bg-white rounded-xl border border-slate-200 p-6">
            <h2 className="font-semibold text-slate-900 mb-4">Your Request</h2>
            <p className="text-slate-600 whitespace-pre-line">{quote.description}</p>

            <div className="grid md:grid-cols-2 gap-4 mt-6 pt-4 border-t border-slate-100">
              {quote.timeframe && (
                <div>
                  <p className="text-sm text-slate-500">Timeframe</p>
                  <p className="text-slate-900">{timeframeLabels[quote.timeframe] || quote.timeframe}</p>
                </div>
              )}
              {quote.budgetRange && (
                <div>
                  <p className="text-sm text-slate-500">Budget</p>
                  <p className="text-slate-900">{budgetLabels[quote.budgetRange] || quote.budgetRange}</p>
                </div>
              )}
            </div>
          </div>

          {/* Messages/Response */}
          {conversation && conversation.messages.length > 0 && (
            <div className="bg-white rounded-xl border border-slate-200 p-6">
              <h2 className="font-semibold text-slate-900 mb-4 flex items-center gap-2">
                <MessageSquare className="w-5 h-5" />
                Messages
              </h2>
              
              <div className="space-y-4">
                {conversation.messages.map((message) => {
                  const isFromTradesperson = message.sender.id !== session.user.id;
                  
                  return (
                    <div
                      key={message.id}
                      className={`p-4 rounded-lg ${
                        isFromTradesperson
                          ? 'bg-primary-50 border border-primary-100'
                          : 'bg-slate-50 border border-slate-100'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <p className="font-medium text-slate-900">
                          {isFromTradesperson ? quote.profile.businessName : 'You'}
                        </p>
                        <p className="text-xs text-slate-500">
                          {new Date(message.createdAt).toLocaleString()}
                        </p>
                      </div>
                      <p className="text-slate-600 whitespace-pre-line">{message.content}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Waiting for Response */}
          {(quote.status === 'PENDING' || quote.status === 'VIEWED') && (
            <div className="bg-orange-50 border border-orange-200 rounded-xl p-6 text-center">
              <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <MessageSquare className="w-6 h-6 text-orange-600" />
              </div>
              <h3 className="font-semibold text-orange-800 mb-2">Waiting for Response</h3>
              <p className="text-sm text-orange-700">
                {quote.profile.businessName} {quote.status === 'VIEWED' ? 'has viewed your request and' : ''} will respond soon.
              </p>
            </div>
          )}
        </div>

        {/* Sidebar - Tradesperson Info */}
        <div className="space-y-6">
          <div className="bg-white rounded-xl border border-slate-200 p-6">
            <h2 className="font-semibold text-slate-900 mb-4">Tradesperson</h2>
            
            <Link href={`/${quote.profile.slug}`} className="block mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
                  <span className="text-primary-600 font-semibold text-lg">
                    {quote.profile.businessName.charAt(0)}
                  </span>
                </div>
                <div>
                  <p className="font-medium text-slate-900 hover:text-primary-600">
                    {quote.profile.businessName}
                  </p>
                  <div className="flex items-center gap-2 text-sm">
                    {quote.profile.isVerified && (
                      <span className="flex items-center gap-1 text-green-600">
                        <Shield className="w-3 h-3" />
                        Verified
                      </span>
                    )}
                    {quote.profile.reviewCount > 0 && (
                      <span className="flex items-center gap-1 text-slate-500">
                        <Star className="w-3 h-3 text-yellow-400 fill-current" />
                        {quote.profile.averageRating.toFixed(1)}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </Link>

            <div className="pt-4 border-t border-slate-100 space-y-3">
              {quote.status === 'RESPONDED' || quote.status === 'ACCEPTED' ? (
                <>
                  <a
                    href={`tel:${quote.profile.phone}`}
                    className="flex items-center gap-3 text-slate-600 hover:text-primary-600"
                  >
                    <Phone className="w-5 h-5" />
                    {quote.profile.phone}
                  </a>
                  <a
                    href={`mailto:${quote.profile.email}`}
                    className="flex items-center gap-3 text-slate-600 hover:text-primary-600"
                  >
                    <Mail className="w-5 h-5" />
                    {quote.profile.email}
                  </a>
                </>
              ) : (
                <p className="text-sm text-slate-500">
                  Contact details will be available once they respond.
                </p>
              )}
            </div>
          </div>

          <Link
            href={`/${quote.profile.slug}`}
            className="block w-full py-3 px-4 bg-slate-100 text-slate-700 text-center font-medium rounded-lg hover:bg-slate-200"
          >
            View Profile
          </Link>
        </div>
      </div>
    </div>
  );
}
