import Link from 'next/link';
import { Search, Shield, Star, MessageSquare, CheckCircle, ArrowRight, Building2, Droplet, Zap, Hammer, PaintBucket, Trees } from 'lucide-react';

// Force dynamic rendering - no SSG
export const dynamic = 'force-dynamic';

const popularTrades = [
  { name: 'Builders', slug: 'building-construction', icon: Building2, description: 'Extensions, renovations & new builds' },
  { name: 'Plumbers', slug: 'plumbing-heating', icon: Droplet, description: 'Repairs, installations & heating' },
  { name: 'Electricians', slug: 'electrical', icon: Zap, description: 'Rewiring, installations & repairs' },
  { name: 'Carpenters', slug: 'carpentry-joinery', icon: Hammer, description: 'Kitchens, staircases & bespoke' },
  { name: 'Decorators', slug: 'decorating', icon: PaintBucket, description: 'Painting, wallpapering & more' },
  { name: 'Landscapers', slug: 'gardens-landscaping', icon: Trees, description: 'Gardens, patios & driveways' },
];

const howItWorks = [
  {
    step: 1,
    title: 'Search for a trade',
    description: 'Enter your postcode and the type of work you need. Browse verified tradespeople in your area.',
    icon: Search,
  },
  {
    step: 2,
    title: 'Compare & choose',
    description: 'Read genuine reviews, view portfolios, and compare quotes from multiple tradespeople.',
    icon: Star,
  },
  {
    step: 3,
    title: 'Get in touch',
    description: 'Contact your chosen tradesperson directly through our platform to discuss your project.',
    icon: MessageSquare,
  },
  {
    step: 4,
    title: 'Leave a review',
    description: 'Once the work is complete, share your experience to help others find great tradespeople.',
    icon: CheckCircle,
  },
];

const stats = [
  { value: '50,000+', label: 'Verified Tradespeople' },
  { value: '2M+', label: 'Reviews' },
  { value: '98%', label: 'Customer Satisfaction' },
  { value: '£0', label: 'Free to Use' },
];

const testimonials = [
  {
    content: 'Found an amazing builder through Builder. The whole process was so easy - I could see reviews, compare quotes, and the work was done perfectly.',
    author: 'Sarah M.',
    location: 'Manchester',
    rating: 5,
  },
  {
    content: 'As a plumber, Builder has transformed my business. I get quality leads and the platform makes it easy to showcase my work.',
    author: 'James T.',
    location: 'London',
    rating: 5,
  },
  {
    content: 'Finally, a platform I can trust. Every tradesperson is verified and the reviews are genuine. Highly recommend!',
    author: 'David H.',
    location: 'Birmingham',
    rating: 5,
  },
];

export default function HomePage() {
  return (
    <>
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary-600 via-primary-700 to-primary-800 text-white overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }} />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="py-20 md:py-32 max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
              Find Trusted Tradespeople
              <span className="block text-primary-200">Near You</span>
            </h1>

            <p className="text-lg md:text-xl text-primary-100 mb-10 max-w-2xl mx-auto">
              Connect with verified builders, plumbers, electricians and more.
              Read real reviews, compare quotes, and hire with confidence.
            </p>

            {/* Search Box */}
            <div className="bg-white rounded-2xl p-3 shadow-2xl max-w-2xl mx-auto">
              <form action="/search" method="GET" className="flex flex-col sm:flex-row gap-3">
                <div className="flex-1">
                  <input
                    type="text"
                    name="trade"
                    placeholder="What do you need? (e.g. Builder, Plumber)"
                    className="w-full px-4 py-3 text-slate-900 placeholder:text-slate-400 bg-slate-50 rounded-lg border-0 focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>
                <div className="sm:w-48">
                  <input
                    type="text"
                    name="postcode"
                    placeholder="Postcode"
                    className="w-full px-4 py-3 text-slate-900 placeholder:text-slate-400 bg-slate-50 rounded-lg border-0 focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>
                <button type="submit" className="inline-flex items-center justify-center px-8 py-3 font-medium rounded-lg bg-orange-500 text-white hover:bg-orange-600 transition-colors">
                  <Search className="w-5 h-5 mr-2" />
                  Search
                </button>
              </form>
            </div>

            {/* Trust Signals */}
            <div className="flex flex-wrap items-center justify-center gap-6 mt-10 text-sm text-primary-200">
              <span className="flex items-center gap-2">
                <Shield className="w-5 h-5" />
                All tradespeople verified
              </span>
              <span className="flex items-center gap-2">
                <Star className="w-5 h-5" />
                Genuine customer reviews
              </span>
              <span className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5" />
                Free to use
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <p className="text-3xl md:text-4xl font-bold text-primary-600">{stat.value}</p>
                <p className="text-slate-600 mt-1">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Popular Trades */}
      <section className="py-16 md:py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
              Popular Trades
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Browse our most popular trade categories and find the right professional for your project.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {popularTrades.map((trade) => (
              <Link
                key={trade.slug}
                href={`/search?trade=${encodeURIComponent(trade.name)}`}
                className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 text-center hover:shadow-lg hover:border-primary-200 transition-all group"
              >
                <div className="w-14 h-14 bg-primary-100 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:bg-primary-600 transition-colors">
                  <trade.icon className="w-7 h-7 text-primary-600 group-hover:text-white transition-colors" />
                </div>
                <h3 className="font-semibold text-slate-900 mb-1">{trade.name}</h3>
                <p className="text-sm text-slate-500">{trade.description}</p>
              </Link>
            ))}
          </div>

          <div className="text-center mt-10">
            <Link href="/trades" className="inline-flex items-center gap-2 px-6 py-3 font-medium rounded-lg bg-white text-slate-700 border border-slate-300 hover:bg-slate-50 transition-colors">
              View All Trades
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 md:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
              How It Works
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Finding the right tradesperson has never been easier. Here is how Builder helps you get the job done.
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-8">
            {howItWorks.map((item) => (
              <div key={item.step} className="relative">
                {/* Connector Line */}
                {item.step < 4 && (
                  <div className="hidden md:block absolute top-10 left-1/2 w-full h-0.5 bg-slate-200" />
                )}

                <div className="relative text-center">
                  <div className="w-20 h-20 bg-primary-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                    <item.icon className="w-10 h-10 text-white" />
                  </div>
                  <span className="absolute -top-2 -right-2 md:right-auto md:left-1/2 md:-translate-x-1/2 w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                    {item.step}
                  </span>
                  <h3 className="text-xl font-semibold text-slate-900 mb-3">{item.title}</h3>
                  <p className="text-slate-600">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 md:py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
              What People Say
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Do not just take our word for it. Here is what our users have to say about Builder.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-white rounded-xl shadow-sm border border-slate-200 p-8">
                {/* Stars */}
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                  ))}
                </div>

                <p className="text-slate-600 mb-6 italic">&quot;{testimonial.content}&quot;</p>

                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                    <span className="text-primary-600 font-semibold">
                      {testimonial.author.charAt(0)}
                    </span>
                  </div>
                  <div>
                    <p className="font-semibold text-slate-900">{testimonial.author}</p>
                    <p className="text-sm text-slate-500">{testimonial.location}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA for Tradespeople */}
      <section className="py-16 md:py-24 bg-gradient-to-br from-secondary-600 to-secondary-700 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Are You a Tradesperson?
            </h2>
            <p className="text-lg text-secondary-100 mb-8">
              Join thousands of tradespeople already growing their business with Builder.
              Get verified, showcase your work, and connect with customers in your area.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/register/tradesperson" className="inline-flex items-center justify-center px-6 py-3 font-medium rounded-lg bg-white text-secondary-700 hover:bg-secondary-50 transition-colors">
                Join for Free
                <ArrowRight className="w-5 h-5 ml-2" />
              </Link>
              <Link href="/pricing" className="inline-flex items-center justify-center px-6 py-3 font-medium rounded-lg border-2 border-white text-white hover:bg-white/10 transition-colors">
                View Pricing
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
