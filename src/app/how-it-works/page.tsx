import Link from 'next/link';
import { Search, Star, MessageSquare, CheckCircle, Shield, Clock, ThumbsUp, ArrowRight } from 'lucide-react';

const steps = [
  {
    number: 1,
    title: 'Search for a Trade',
    description: 'Enter your postcode and the type of work you need. Our smart search will find verified tradespeople in your area who can help.',
    icon: Search,
    details: [
      'Search by trade type or specific service',
      'Filter by location and coverage area',
      'See ratings and reviews at a glance',
    ],
  },
  {
    number: 2,
    title: 'Compare Options',
    description: 'Browse detailed profiles, portfolios of previous work, and genuine customer reviews to find the perfect match for your project.',
    icon: Star,
    details: [
      'Read verified customer reviews',
      'View photos of completed work',
      'Check qualifications and insurance',
    ],
  },
  {
    number: 3,
    title: 'Get in Touch',
    description: 'Request a quote or send a message directly through our platform. Discuss your project requirements and get a detailed estimate.',
    icon: MessageSquare,
    details: [
      'Request quotes from multiple tradespeople',
      'Message directly through the platform',
      'Compare quotes side by side',
    ],
  },
  {
    number: 4,
    title: 'Hire with Confidence',
    description: 'Choose your tradesperson and book the work. All our tradespeople are verified so you can hire with complete peace of mind.',
    icon: ThumbsUp,
    details: [
      'All tradespeople are ID verified',
      'Insurance and qualifications checked',
      'Direct communication throughout',
    ],
  },
  {
    number: 5,
    title: 'Leave a Review',
    description: 'Once the work is complete, share your experience to help others find great tradespeople. Your feedback helps maintain quality.',
    icon: CheckCircle,
    details: [
      'Rate quality, reliability, and value',
      'Share photos of completed work',
      'Help the community make informed choices',
    ],
  },
];

const trustPoints = [
  {
    icon: Shield,
    title: 'Verified Tradespeople',
    description: 'Every tradesperson on Builder is verified. We check ID, qualifications, and insurance so you can hire with confidence.',
  },
  {
    icon: Star,
    title: 'Genuine Reviews',
    description: 'All reviews are from real customers who have used the service. We moderate reviews to ensure authenticity.',
  },
  {
    icon: Clock,
    title: 'Quick Response',
    description: 'Most tradespeople respond to enquiries within hours, not days. Get quotes and start your project faster.',
  },
];

export default function HowItWorksPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <section className="bg-gradient-to-br from-primary-600 to-primary-800 text-white py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">How Builder Works</h1>
          <p className="text-xl text-primary-100 max-w-2xl mx-auto">
            Finding a trusted tradesperson has never been easier. Here is our simple process to help you get the job done.
          </p>
        </div>
      </section>

      {/* Steps */}
      <section className="py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-16">
            {steps.map((step, index) => (
              <div
                key={step.number}
                className={'flex flex-col md:flex-row gap-8 items-center ' + (index % 2 === 1 ? 'md:flex-row-reverse' : '')}
              >
                <div className="flex-1">
                  <div className="flex items-center gap-4 mb-4">
                    <span className="w-12 h-12 bg-primary-600 rounded-full flex items-center justify-center text-white text-xl font-bold">
                      {step.number}
                    </span>
                    <h2 className="text-2xl md:text-3xl font-bold text-slate-900">{step.title}</h2>
                  </div>
                  <p className="text-lg text-slate-600 mb-6">{step.description}</p>
                  <ul className="space-y-3">
                    {step.details.map((detail, i) => (
                      <li key={i} className="flex items-center gap-3 text-slate-600">
                        <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                        {detail}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="flex-1 flex justify-center">
                  <div className="w-48 h-48 bg-primary-100 rounded-3xl flex items-center justify-center">
                    <step.icon className="w-24 h-24 text-primary-600" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Trust Points */}
      <section className="py-16 md:py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-slate-900 text-center mb-12">Why Trust Builder?</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {trustPoints.map((point, index) => (
              <div key={index} className="bg-white rounded-xl shadow-sm border border-slate-200 p-8 text-center">
                <div className="w-16 h-16 bg-primary-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <point.icon className="w-8 h-8 text-primary-600" />
                </div>
                <h3 className="text-xl font-semibold text-slate-900 mb-3">{point.title}</h3>
                <p className="text-slate-600">{point.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-slate-900 mb-6">Ready to Get Started?</h2>
          <p className="text-lg text-slate-600 mb-8 max-w-2xl mx-auto">
            Find trusted tradespeople in your area today. It is completely free to search and request quotes.
          </p>
          <Link
            href="/search"
            className="inline-flex items-center gap-2 px-8 py-4 bg-primary-600 text-white font-medium rounded-lg hover:bg-primary-700 transition-colors text-lg"
          >
            Find a Tradesperson
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>
    </div>
  );
}
