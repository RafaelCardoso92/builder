import Link from 'next/link';
import { Metadata } from 'next';
import { Users, Star, TrendingUp, Shield, MessageSquare, BarChart3, CheckCircle, ArrowRight, Crown, AlertTriangle } from 'lucide-react';

export const metadata: Metadata = {
  title: "For Tradespeople - Grow Your Business",
  description: "Join Builder to reach more customers, build your reputation with verified reviews, and grow your trade business. Free registration for all tradespeople.",
  openGraph: {
    title: "For Tradespeople | Builder",
    description: "Join Builder to reach more customers and grow your trade business. Free registration.",
  },
};

const benefits = [
  {
    icon: Users,
    title: 'Reach More Customers',
    description: 'Get discovered by thousands of homeowners actively looking for tradespeople in your area.',
  },
  {
    icon: AlertTriangle,
    title: 'Bad Payer Protection',
    description: 'Check potential customers before accepting work. Report non-payers to protect fellow tradespeople.',
  },
  {
    icon: Star,
    title: 'Build Your Reputation',
    description: 'Collect genuine reviews from satisfied customers to showcase the quality of your work.',
  },
  {
    icon: TrendingUp,
    title: 'Grow Your Business',
    description: 'Receive quote requests directly through the platform and convert leads into customers.',
  },
  {
    icon: Shield,
    title: 'Stand Out with Verification',
    description: 'Get verified badges to show customers you are legitimate, insured, and qualified.',
  },
  {
    icon: MessageSquare,
    title: 'Easy Communication',
    description: 'Message customers directly through our platform. Keep all your conversations in one place.',
  },
  {
    icon: BarChart3,
    title: 'Track Your Performance',
    description: 'See how many people view your profile, request quotes, and leave reviews.',
  },
];

const tiers = [
  {
    name: 'Free',
    price: '£0',
    period: 'forever',
    description: 'Get started and see the benefits',
    features: [
      'Basic profile listing',
      'Up to 5 portfolio photos',
      '10 quote requests per month',
      '1 verification badge',
      'Message customers',
    ],
    cta: 'Start Free',
    highlighted: false,
  },
  {
    name: 'Pro',
    price: '£29',
    period: 'per month',
    description: 'For growing businesses',
    features: [
      'Enhanced profile listing',
      'Up to 20 portfolio photos',
      'Unlimited quote requests',
      '3 verification badges',
      'Priority in search results',
      'Response templates',
      'Basic analytics',
    ],
    cta: 'Go Pro',
    highlighted: true,
  },
  {
    name: 'Premium',
    price: '£59',
    period: 'per month',
    description: 'For established businesses',
    features: [
      'Featured profile listing',
      'Unlimited portfolio photos',
      'Unlimited quote requests',
      'Unlimited verification badges',
      'Top placement in search',
      'Advanced analytics',
      'Priority support',
      'Featured badge',
    ],
    cta: 'Go Premium',
    highlighted: false,
  },
];

const testimonials = [
  {
    content: 'Since joining Builder, my business has grown significantly. I get quality leads every week and the reviews help me win more jobs.',
    author: 'Mike R.',
    trade: 'Builder',
    location: 'Manchester',
  },
  {
    content: 'The verification badges really help build trust with customers. They know I am insured and qualified before they even contact me.',
    author: 'Sarah T.',
    trade: 'Electrician',
    location: 'London',
  },
  {
    content: 'Easy to use platform with great support. I have doubled my customer base in just 6 months.',
    author: 'John D.',
    trade: 'Plumber',
    location: 'Birmingham',
  },
];

export default function ForTradespeopleePage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <section className="bg-gradient-to-br from-secondary-600 to-secondary-800 text-white py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <Link
              href="/switch"
              className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 rounded-full px-4 py-2 mb-6 text-sm transition-colors"
            >
              <span>Switching from Checkatrade?</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Grow Your Trade Business with Builder
            </h1>
            <p className="text-xl text-secondary-100 mb-8">
              Join thousands of tradespeople already using Builder to find new customers, build their reputation, and grow their business.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                href="/register/tradesperson"
                className="inline-flex items-center justify-center px-8 py-4 bg-white text-secondary-700 font-medium rounded-lg hover:bg-secondary-50 transition-colors"
              >
                Join for Free
                <ArrowRight className="w-5 h-5 ml-2" />
              </Link>
              <Link
                href="#pricing"
                className="inline-flex items-center justify-center px-8 py-4 border-2 border-white text-white font-medium rounded-lg hover:bg-white/10 transition-colors"
              >
                View Pricing
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-slate-900 text-center mb-4">Why Join Builder?</h2>
          <p className="text-lg text-slate-600 text-center mb-12 max-w-2xl mx-auto">
            Everything you need to find new customers and grow your trade business.
          </p>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {benefits.map((benefit, index) => (
              <div key={index} className="p-6">
                <div className="w-14 h-14 bg-primary-100 rounded-xl flex items-center justify-center mb-4">
                  <benefit.icon className="w-7 h-7 text-primary-600" />
                </div>
                <h3 className="text-xl font-semibold text-slate-900 mb-2">{benefit.title}</h3>
                <p className="text-slate-600">{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-16 md:py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-slate-900 text-center mb-4">Simple, Transparent Pricing</h2>
          <p className="text-lg text-slate-600 text-center mb-12 max-w-2xl mx-auto">
            Start free and upgrade as your business grows. No hidden fees.
          </p>
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {tiers.map((tier, index) => (
              <div
                key={index}
                className={
                  'bg-white rounded-2xl shadow-sm border p-8 relative ' +
                  (tier.highlighted ? 'border-primary-500 ring-2 ring-primary-500' : 'border-slate-200')
                }
              >
                {tier.highlighted && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-primary-600 text-white text-sm font-medium rounded-full">
                    Most Popular
                  </div>
                )}
                <div className="text-center mb-6">
                  <h3 className="text-xl font-semibold text-slate-900 mb-2">{tier.name}</h3>
                  <div className="flex items-baseline justify-center gap-1">
                    <span className="text-4xl font-bold text-slate-900">{tier.price}</span>
                    <span className="text-slate-500">/{tier.period}</span>
                  </div>
                  <p className="text-slate-600 mt-2">{tier.description}</p>
                </div>
                <ul className="space-y-3 mb-8">
                  {tier.features.map((feature, i) => (
                    <li key={i} className="flex items-center gap-3 text-slate-600">
                      <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>
                <Link
                  href="/register/tradesperson"
                  className={
                    'block w-full py-3 text-center font-medium rounded-lg transition-colors ' +
                    (tier.highlighted
                      ? 'bg-primary-600 text-white hover:bg-primary-700'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200')
                  }
                >
                  {tier.cta}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-slate-900 text-center mb-12">What Tradespeople Say</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-slate-50 rounded-xl p-8">
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-slate-600 mb-6 italic">&quot;{testimonial.content}&quot;</p>
                <div>
                  <p className="font-semibold text-slate-900">{testimonial.author}</p>
                  <p className="text-sm text-slate-500">{testimonial.trade} • {testimonial.location}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 md:py-24 bg-primary-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Crown className="w-16 h-16 mx-auto mb-6 text-primary-200" />
          <h2 className="text-3xl font-bold mb-6">Ready to Grow Your Business?</h2>
          <p className="text-xl text-primary-100 mb-8 max-w-2xl mx-auto">
            Join Builder today and start connecting with customers in your area. It is free to get started.
          </p>
          <Link
            href="/register/tradesperson"
            className="inline-flex items-center gap-2 px-8 py-4 bg-white text-primary-700 font-medium rounded-lg hover:bg-primary-50 transition-colors text-lg"
          >
            Create Your Profile
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>
    </div>
  );
}
