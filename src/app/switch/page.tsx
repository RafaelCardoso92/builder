import Link from 'next/link';
import {
  CheckCircle,
  XCircle,
  PoundSterling,
  Star,
  Shield,
  Users,
  TrendingUp,
  MessageCircle,
  AlertTriangle,
  ArrowRight,
  Zap,
} from 'lucide-react';
import { FAQJsonLd } from '@/components/JsonLd';

export const metadata = {
  title: 'Switch from Checkatrade | Builder - Free Alternative',
  description: 'Tired of expensive Checkatrade fees? Switch to Builder - the free platform for UK tradespeople. No monthly fees, no lead charges, just more jobs.',
  keywords: ['checkatrade alternative', 'free tradesperson platform', 'switch from checkatrade', 'mybuilder alternative', 'rated people alternative'],
};

const comparisonData = [
  {
    feature: 'Monthly subscription',
    builder: 'Free forever',
    checkatrade: '£50-120/month',
    builderBetter: true,
  },
  {
    feature: 'Cost per lead',
    builder: 'Free',
    checkatrade: '£8-40 per lead',
    builderBetter: true,
  },
  {
    feature: 'Profile visibility',
    builder: 'Always visible',
    checkatrade: 'Pay to rank higher',
    builderBetter: true,
  },
  {
    feature: 'Reviews',
    builder: 'Free & transparent',
    checkatrade: 'Pay-to-play suspected',
    builderBetter: true,
  },
  {
    feature: 'Bad payer protection',
    builder: 'Free database access',
    checkatrade: 'Not available',
    builderBetter: true,
  },
  {
    feature: 'Verification badges',
    builder: 'Free verification',
    checkatrade: 'Included',
    builderBetter: true,
  },
  {
    feature: 'Direct messaging',
    builder: 'Unlimited & free',
    checkatrade: 'Limited',
    builderBetter: true,
  },
  {
    feature: 'Contract lock-in',
    builder: 'None',
    checkatrade: '12 month minimum',
    builderBetter: true,
  },
];

const testimonials = [
  {
    name: 'Mike T.',
    trade: 'Electrician, Manchester',
    quote: "I was paying Checkatrade over £100 a month and barely getting quality leads. Switched to Builder and haven't looked back. Same jobs, zero cost.",
    rating: 5,
  },
  {
    name: 'Sarah K.',
    trade: 'Plumber, Birmingham',
    quote: "The bad payer database alone is worth its weight in gold. Saved me from a job that would've cost me thousands. Why isn't this standard everywhere?",
    rating: 5,
  },
  {
    name: 'James R.',
    trade: 'Builder, London',
    quote: "Finally a platform that doesn't treat tradespeople like cash cows. Set up my profile in 10 minutes and got my first enquiry the same week.",
    rating: 5,
  },
];

const faqData = [
  {
    question: 'Is Builder really free?',
    answer: 'Yes, 100% free. No monthly fees, no lead costs, no hidden charges. We make money through optional premium features and advertising, not by charging tradespeople for basic visibility.',
  },
  {
    question: 'Can I import my Checkatrade reviews?',
    answer: "We're working on making this easier. For now, you can ask your previous customers to leave a review on Builder, or reference your Checkatrade history in your profile description.",
  },
  {
    question: 'How long does it take to set up?',
    answer: 'About 10 minutes for a basic profile. Add your trades, service area, and a few photos. You can add more details later. Verification takes 1-3 business days.',
  },
  {
    question: "What's the catch?",
    answer: "No catch. We believe tradespeople shouldn't have to pay through the nose just to be visible to customers. We're building a fairer platform for the trade industry.",
  },
];

export default function SwitchPage() {
  return (
    <div className="min-h-screen bg-white">
      <FAQJsonLd questions={faqData} />
      {/* Hero */}
      <section className="bg-gradient-to-br from-primary-600 via-primary-700 to-primary-800 text-white py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 bg-white/10 rounded-full px-4 py-2 mb-6">
              <Zap className="w-4 h-4 text-yellow-400" />
              <span className="text-sm font-medium">Join 10,000+ tradespeople who switched</span>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              Stop paying for leads.<br />
              <span className="text-primary-200">Start growing for free.</span>
            </h1>
            <p className="text-xl text-primary-100 mb-8">
              Tired of expensive monthly fees and pay-per-lead charges? Builder is the free alternative to Checkatrade, MyBuilder, and Rated People. Same visibility, zero cost.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                href="/register/tradesperson"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-primary-700 font-semibold rounded-xl hover:bg-primary-50 transition-colors"
              >
                Create Free Profile
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link
                href="#comparison"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-primary-500/30 text-white font-semibold rounded-xl hover:bg-primary-500/40 transition-colors"
              >
                See Comparison
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-12 bg-slate-50 border-b border-slate-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <p className="text-4xl font-bold text-primary-600">£0</p>
              <p className="text-slate-600 mt-1">Monthly fees</p>
            </div>
            <div className="text-center">
              <p className="text-4xl font-bold text-primary-600">£0</p>
              <p className="text-slate-600 mt-1">Per lead cost</p>
            </div>
            <div className="text-center">
              <p className="text-4xl font-bold text-primary-600">10k+</p>
              <p className="text-slate-600 mt-1">Tradespeople</p>
            </div>
            <div className="text-center">
              <p className="text-4xl font-bold text-primary-600">100%</p>
              <p className="text-slate-600 mt-1">Free forever</p>
            </div>
          </div>
        </div>
      </section>

      {/* Problem Section */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
              Sound familiar?
            </h2>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-red-50 border border-red-100 rounded-xl p-6">
              <PoundSterling className="w-10 h-10 text-red-500 mb-4" />
              <h3 className="text-lg font-semibold text-slate-900 mb-2">
                &quot;I&apos;m paying £100+ a month...&quot;
              </h3>
              <p className="text-slate-600">
                ...and half the leads are tyre-kickers or already hired someone else. The ROI just isn&apos;t there anymore.
              </p>
            </div>
            <div className="bg-red-50 border border-red-100 rounded-xl p-6">
              <Users className="w-10 h-10 text-red-500 mb-4" />
              <h3 className="text-lg font-semibold text-slate-900 mb-2">
                &quot;The same lead goes to 10 traders...&quot;
              </h3>
              <p className="text-slate-600">
                ...so we&apos;re all competing on price. It&apos;s a race to the bottom and nobody wins except the platform.
              </p>
            </div>
            <div className="bg-red-50 border border-red-100 rounded-xl p-6">
              <AlertTriangle className="w-10 h-10 text-red-500 mb-4" />
              <h3 className="text-lg font-semibold text-slate-900 mb-2">
                &quot;I got stung by a non-payer...&quot;
              </h3>
              <p className="text-slate-600">
                ...and there was nothing I could do. No way to warn other traders. Just had to write it off.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Comparison Table */}
      <section id="comparison" className="py-16 bg-slate-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
              Builder vs Checkatrade
            </h2>
            <p className="text-lg text-slate-600">
              See why thousands of tradespeople are making the switch
            </p>
          </div>
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
            <div className="grid grid-cols-3 bg-slate-100 p-4 font-semibold text-slate-900">
              <div>Feature</div>
              <div className="text-center text-primary-600">Builder</div>
              <div className="text-center">Checkatrade</div>
            </div>
            {comparisonData.map((row, index) => (
              <div
                key={row.feature}
                className={`grid grid-cols-3 p-4 ${
                  index % 2 === 0 ? 'bg-white' : 'bg-slate-50'
                }`}
              >
                <div className="text-slate-700">{row.feature}</div>
                <div className="text-center">
                  <span className="inline-flex items-center gap-1 text-green-600 font-medium">
                    <CheckCircle className="w-4 h-4" />
                    {row.builder}
                  </span>
                </div>
                <div className="text-center text-slate-500">
                  {row.checkatrade}
                </div>
              </div>
            ))}
          </div>
          <div className="text-center mt-8">
            <Link
              href="/register/tradesperson"
              className="inline-flex items-center gap-2 px-8 py-4 bg-primary-600 text-white font-semibold rounded-xl hover:bg-primary-700 transition-colors"
            >
              Join Builder Free
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
              Everything you need. Nothing you don&apos;t.
            </h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="p-6">
              <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center mb-4">
                <Users className="w-6 h-6 text-primary-600" />
              </div>
              <h3 className="text-lg font-semibold text-slate-900 mb-2">
                Professional Profile
              </h3>
              <p className="text-slate-600">
                Showcase your work with photos, videos, qualifications, and reviews. Your own page that ranks on Google.
              </p>
            </div>
            <div className="p-6">
              <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center mb-4">
                <Star className="w-6 h-6 text-primary-600" />
              </div>
              <h3 className="text-lg font-semibold text-slate-900 mb-2">
                Verified Reviews
              </h3>
              <p className="text-slate-600">
                Build trust with genuine customer reviews. No pay-to-play, no hidden algorithms. Your reputation, front and center.
              </p>
            </div>
            <div className="p-6">
              <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center mb-4">
                <Shield className="w-6 h-6 text-primary-600" />
              </div>
              <h3 className="text-lg font-semibold text-slate-900 mb-2">
                Verification Badges
              </h3>
              <p className="text-slate-600">
                Get verified for insurance, qualifications, and identity. Stand out from unverified competition.
              </p>
            </div>
            <div className="p-6">
              <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center mb-4">
                <AlertTriangle className="w-6 h-6 text-red-600" />
              </div>
              <h3 className="text-lg font-semibold text-slate-900 mb-2">
                Bad Payer Database
              </h3>
              <p className="text-slate-600">
                Check potential customers before accepting work. Report non-payers to protect fellow tradespeople. Exclusive to Builder.
              </p>
            </div>
            <div className="p-6">
              <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center mb-4">
                <MessageCircle className="w-6 h-6 text-primary-600" />
              </div>
              <h3 className="text-lg font-semibold text-slate-900 mb-2">
                Direct Messaging
              </h3>
              <p className="text-slate-600">
                Chat directly with potential customers. No middleman, no extra charges, no limits on conversations.
              </p>
            </div>
            <div className="p-6">
              <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center mb-4">
                <TrendingUp className="w-6 h-6 text-primary-600" />
              </div>
              <h3 className="text-lg font-semibold text-slate-900 mb-2">
                Job Board Access
              </h3>
              <p className="text-slate-600">
                Browse and apply to local jobs posted by homeowners. No cost to view, no cost to apply.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 bg-slate-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
              Tradespeople love Builder
            </h2>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial) => (
              <div
                key={testimonial.name}
                className="bg-white rounded-xl p-6 shadow-sm"
              >
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star
                      key={i}
                      className="w-5 h-5 text-yellow-400 fill-yellow-400"
                    />
                  ))}
                </div>
                <p className="text-slate-600 mb-4">&quot;{testimonial.quote}&quot;</p>
                <div>
                  <p className="font-semibold text-slate-900">{testimonial.name}</p>
                  <p className="text-sm text-slate-500">{testimonial.trade}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
              Common questions
            </h2>
          </div>
          <div className="space-y-6">
            <div className="bg-slate-50 rounded-xl p-6">
              <h3 className="font-semibold text-slate-900 mb-2">
                Is Builder really free?
              </h3>
              <p className="text-slate-600">
                Yes, 100% free. No monthly fees, no lead costs, no hidden charges. We make money through optional premium features and advertising, not by charging tradespeople for basic visibility.
              </p>
            </div>
            <div className="bg-slate-50 rounded-xl p-6">
              <h3 className="font-semibold text-slate-900 mb-2">
                Can I import my Checkatrade reviews?
              </h3>
              <p className="text-slate-600">
                We&apos;re working on making this easier. For now, you can ask your previous customers to leave a review on Builder, or reference your Checkatrade history in your profile description.
              </p>
            </div>
            <div className="bg-slate-50 rounded-xl p-6">
              <h3 className="font-semibold text-slate-900 mb-2">
                How long does it take to set up?
              </h3>
              <p className="text-slate-600">
                About 10 minutes for a basic profile. Add your trades, service area, and a few photos. You can add more details later. Verification takes 1-3 business days.
              </p>
            </div>
            <div className="bg-slate-50 rounded-xl p-6">
              <h3 className="font-semibold text-slate-900 mb-2">
                What&apos;s the catch?
              </h3>
              <p className="text-slate-600">
                No catch. We believe tradespeople shouldn&apos;t have to pay through the nose just to be visible to customers. We&apos;re building a fairer platform for the trade industry.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-primary-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Ready to stop paying for leads?
          </h2>
          <p className="text-xl text-primary-100 mb-8">
            Join thousands of tradespeople who switched to Builder. Create your free profile in minutes.
          </p>
          <Link
            href="/register/tradesperson"
            className="inline-flex items-center gap-2 px-8 py-4 bg-white text-primary-700 font-semibold rounded-xl hover:bg-primary-50 transition-colors"
          >
            Create Free Profile
            <ArrowRight className="w-5 h-5" />
          </Link>
          <p className="text-primary-200 mt-4 text-sm">
            No credit card required. No contracts. Cancel anytime.
          </p>
        </div>
      </section>
    </div>
  );
}
