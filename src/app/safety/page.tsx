import Link from 'next/link';
import {
  Shield,
  AlertTriangle,
  CheckCircle,
  XCircle,
  FileText,
  Camera,
  MessageCircle,
  PoundSterling,
  Users,
  Scale,
  Phone,
  Home,
} from 'lucide-react';

export const metadata = {
  title: 'Safety Guidelines | Builder',
  description: 'Safety guidelines for homeowners and tradespeople using Builder. Learn how to protect yourself and ensure safe, successful projects.',
};

export default function SafetyPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <section className="bg-gradient-to-br from-primary-600 to-primary-800 text-white py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Shield className="w-16 h-16 mx-auto mb-4" />
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Safety Guidelines</h1>
          <p className="text-primary-100 text-lg">
            Protecting both homeowners and tradespeople for successful projects
          </p>
        </div>
      </section>

      {/* Important Notice */}
      <section className="py-8 bg-amber-50 border-b border-amber-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex gap-4">
            <AlertTriangle className="w-6 h-6 text-amber-600 flex-shrink-0 mt-1" />
            <div>
              <h2 className="text-lg font-bold text-amber-800 mb-2">Important: Builder is Not a Payment Intermediary</h2>
              <p className="text-amber-800">
                Builder is a platform that connects homeowners with tradespeople. <strong>We do not process, hold, or guarantee any payments between parties.</strong> All financial transactions are directly between you and the other party. We strongly recommend following the payment guidelines below to protect yourself.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Navigation */}
      <section className="py-8 border-b border-slate-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap gap-4 justify-center">
            <a href="#homeowners" className="px-4 py-2 bg-slate-100 rounded-lg hover:bg-slate-200 transition-colors font-medium text-slate-700">
              For Homeowners
            </a>
            <a href="#tradespeople" className="px-4 py-2 bg-slate-100 rounded-lg hover:bg-slate-200 transition-colors font-medium text-slate-700">
              For Tradespeople
            </a>
            <a href="#payments" className="px-4 py-2 bg-slate-100 rounded-lg hover:bg-slate-200 transition-colors font-medium text-slate-700">
              Payment Safety
            </a>
            <a href="#disputes" className="px-4 py-2 bg-slate-100 rounded-lg hover:bg-slate-200 transition-colors font-medium text-slate-700">
              Handling Disputes
            </a>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="py-12 md:py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">

          {/* For Homeowners */}
          <div id="homeowners" className="mb-16">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                <Home className="w-6 h-6 text-blue-600" />
              </div>
              <h2 className="text-2xl font-bold text-slate-900">For Homeowners</h2>
            </div>

            <div className="space-y-6">
              <div className="bg-slate-50 rounded-xl p-6">
                <h3 className="font-semibold text-slate-900 mb-4 flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  Before Hiring a Tradesperson
                </h3>
                <ul className="space-y-3 text-slate-600">
                  <li className="flex gap-3">
                    <span className="text-green-600 font-bold">✓</span>
                    <span>Check their profile for reviews from previous customers</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="text-green-600 font-bold">✓</span>
                    <span>Look for verification badges (insurance, qualifications, ID verified)</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="text-green-600 font-bold">✓</span>
                    <span>Get at least 3 quotes from different tradespeople</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="text-green-600 font-bold">✓</span>
                    <span>Ask for references and examples of similar work</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="text-green-600 font-bold">✓</span>
                    <span>Verify their insurance is current and covers your project</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="text-green-600 font-bold">✓</span>
                    <span>For regulated work (gas, electrical), verify certifications independently</span>
                  </li>
                </ul>
              </div>

              <div className="bg-slate-50 rounded-xl p-6">
                <h3 className="font-semibold text-slate-900 mb-4 flex items-center gap-2">
                  <FileText className="w-5 h-5 text-primary-600" />
                  Get Everything in Writing
                </h3>
                <ul className="space-y-3 text-slate-600">
                  <li className="flex gap-3">
                    <span className="text-green-600 font-bold">✓</span>
                    <span>Detailed written quote with full breakdown of costs</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="text-green-600 font-bold">✓</span>
                    <span>Scope of work clearly defined</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="text-green-600 font-bold">✓</span>
                    <span>Start and estimated completion dates</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="text-green-600 font-bold">✓</span>
                    <span>Payment schedule and terms</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="text-green-600 font-bold">✓</span>
                    <span>What happens if there are changes or delays</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="text-green-600 font-bold">✓</span>
                    <span>Warranty or guarantee terms</span>
                  </li>
                </ul>
              </div>

              <div className="bg-red-50 border border-red-200 rounded-xl p-6">
                <h3 className="font-semibold text-red-800 mb-4 flex items-center gap-2">
                  <XCircle className="w-5 h-5 text-red-600" />
                  Red Flags to Watch For
                </h3>
                <ul className="space-y-3 text-red-800">
                  <li className="flex gap-3">
                    <span className="text-red-600 font-bold">✗</span>
                    <span>Demanding large upfront payments or cash only</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="text-red-600 font-bold">✗</span>
                    <span>Pressure to make quick decisions</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="text-red-600 font-bold">✗</span>
                    <span>No written quote or contract offered</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="text-red-600 font-bold">✗</span>
                    <span>Unable or unwilling to provide insurance details</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="text-red-600 font-bold">✗</span>
                    <span>Quote significantly lower than all others (too good to be true)</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="text-red-600 font-bold">✗</span>
                    <span>Vague about timeline or scope</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="text-red-600 font-bold">✗</span>
                    <span>No physical business address or just a mobile number</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* For Tradespeople */}
          <div id="tradespeople" className="mb-16">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
                <Users className="w-6 h-6 text-orange-600" />
              </div>
              <h2 className="text-2xl font-bold text-slate-900">For Tradespeople</h2>
            </div>

            <div className="space-y-6">
              <div className="bg-slate-50 rounded-xl p-6">
                <h3 className="font-semibold text-slate-900 mb-4 flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  Before Starting Work
                </h3>
                <ul className="space-y-3 text-slate-600">
                  <li className="flex gap-3">
                    <span className="text-green-600 font-bold">✓</span>
                    <span>Visit the property to assess the work before quoting</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="text-green-600 font-bold">✓</span>
                    <span>Verify the customer&apos;s identity and property ownership/tenancy</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="text-green-600 font-bold">✓</span>
                    <span>Check our Bad Payer Database (tradespeople only)</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="text-green-600 font-bold">✓</span>
                    <span>Provide a detailed written quote with clear terms</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="text-green-600 font-bold">✓</span>
                    <span>Get the quote signed and returned before starting</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="text-green-600 font-bold">✓</span>
                    <span>Agree payment terms in writing</span>
                  </li>
                </ul>
              </div>

              <div className="bg-slate-50 rounded-xl p-6">
                <h3 className="font-semibold text-slate-900 mb-4 flex items-center gap-2">
                  <Camera className="w-5 h-5 text-primary-600" />
                  Document Everything
                </h3>
                <ul className="space-y-3 text-slate-600">
                  <li className="flex gap-3">
                    <span className="text-green-600 font-bold">✓</span>
                    <span>Photograph the area before starting work</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="text-green-600 font-bold">✓</span>
                    <span>Document progress throughout the job</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="text-green-600 font-bold">✓</span>
                    <span>Keep all written communications (texts, emails, messages)</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="text-green-600 font-bold">✓</span>
                    <span>Get sign-off on completed stages before moving on</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="text-green-600 font-bold">✓</span>
                    <span>Issue proper invoices with your business details</span>
                  </li>
                </ul>
              </div>

              <div className="bg-red-50 border border-red-200 rounded-xl p-6">
                <h3 className="font-semibold text-red-800 mb-4 flex items-center gap-2">
                  <XCircle className="w-5 h-5 text-red-600" />
                  Red Flags to Watch For
                </h3>
                <ul className="space-y-3 text-red-800">
                  <li className="flex gap-3">
                    <span className="text-red-600 font-bold">✗</span>
                    <span>Customer reluctant to put anything in writing</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="text-red-600 font-bold">✗</span>
                    <span>Constantly changing requirements after agreeing scope</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="text-red-600 font-bold">✗</span>
                    <span>Disputing agreed prices after work has started</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="text-red-600 font-bold">✗</span>
                    <span>Pressure to start immediately without proper documentation</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="text-red-600 font-bold">✗</span>
                    <span>History of disputes with previous tradespeople</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="text-red-600 font-bold">✗</span>
                    <span>Asking for work that seems illegal or unsafe</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Payment Safety */}
          <div id="payments" className="mb-16">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                <PoundSterling className="w-6 h-6 text-green-600" />
              </div>
              <h2 className="text-2xl font-bold text-slate-900">Payment Safety</h2>
            </div>

            {/* Platform Notice */}
            <div className="bg-slate-900 text-white rounded-xl p-6 mb-6">
              <h3 className="font-semibold text-lg mb-3">Builder Does Not Handle Payments</h3>
              <p className="text-slate-300">
                Builder is a directory and communication platform only. We do not process payments, hold funds in escrow, or act as a financial intermediary. All payments are made directly between homeowners and tradespeople. We cannot recover funds or guarantee payment.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {/* For Homeowners */}
              <div className="bg-blue-50 rounded-xl p-6">
                <h3 className="font-semibold text-slate-900 mb-4">For Homeowners</h3>
                <ul className="space-y-3 text-slate-600 text-sm">
                  <li className="flex gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                    <span><strong>Never pay 100% upfront.</strong> Standard practice is a small deposit (10-20%), stage payments, and final payment on completion.</span>
                  </li>
                  <li className="flex gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                    <span><strong>Avoid cash payments.</strong> Use bank transfer for a clear payment trail.</span>
                  </li>
                  <li className="flex gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                    <span><strong>Get receipts for everything.</strong> Including deposit payments.</span>
                  </li>
                  <li className="flex gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                    <span><strong>Inspect work before final payment.</strong> Don&apos;t pay until you&apos;re satisfied.</span>
                  </li>
                  <li className="flex gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                    <span><strong>Keep 5-10% retention</strong> until any snagging is completed.</span>
                  </li>
                </ul>
              </div>

              {/* For Tradespeople */}
              <div className="bg-orange-50 rounded-xl p-6">
                <h3 className="font-semibold text-slate-900 mb-4">For Tradespeople</h3>
                <ul className="space-y-3 text-slate-600 text-sm">
                  <li className="flex gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                    <span><strong>Request a deposit</strong> for materials before starting larger jobs.</span>
                  </li>
                  <li className="flex gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                    <span><strong>Use stage payments</strong> for larger projects - agree milestones in advance.</span>
                  </li>
                  <li className="flex gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                    <span><strong>Issue proper invoices</strong> with your business details, VAT number if applicable.</span>
                  </li>
                  <li className="flex gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                    <span><strong>Set clear payment terms</strong> (e.g., payment within 14 days).</span>
                  </li>
                  <li className="flex gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                    <span><strong>Don&apos;t leave materials on site</strong> until deposit is received.</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Recommended Payment Structure */}
            <div className="bg-slate-50 rounded-xl p-6 mt-6">
              <h3 className="font-semibold text-slate-900 mb-4">Recommended Payment Structure (Larger Jobs)</h3>
              <div className="grid grid-cols-4 gap-4 text-center">
                <div className="bg-white rounded-lg p-4 border border-slate-200">
                  <p className="text-2xl font-bold text-primary-600">10-20%</p>
                  <p className="text-sm text-slate-600">Deposit</p>
                  <p className="text-xs text-slate-400 mt-1">On accepting quote</p>
                </div>
                <div className="bg-white rounded-lg p-4 border border-slate-200">
                  <p className="text-2xl font-bold text-primary-600">25-30%</p>
                  <p className="text-sm text-slate-600">First Stage</p>
                  <p className="text-xs text-slate-400 mt-1">Work commenced</p>
                </div>
                <div className="bg-white rounded-lg p-4 border border-slate-200">
                  <p className="text-2xl font-bold text-primary-600">25-30%</p>
                  <p className="text-sm text-slate-600">Second Stage</p>
                  <p className="text-xs text-slate-400 mt-1">Midway milestone</p>
                </div>
                <div className="bg-white rounded-lg p-4 border border-slate-200">
                  <p className="text-2xl font-bold text-primary-600">20-30%</p>
                  <p className="text-sm text-slate-600">Final Payment</p>
                  <p className="text-xs text-slate-400 mt-1">On completion</p>
                </div>
              </div>
            </div>
          </div>

          {/* Handling Disputes */}
          <div id="disputes" className="mb-16">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                <Scale className="w-6 h-6 text-purple-600" />
              </div>
              <h2 className="text-2xl font-bold text-slate-900">Handling Disputes</h2>
            </div>

            <div className="bg-amber-50 border border-amber-200 rounded-xl p-6 mb-6">
              <p className="text-amber-800">
                <strong>Note:</strong> Builder does not mediate or resolve disputes between users. We provide a platform for connection only. The following guidance is for informational purposes.
              </p>
            </div>

            <div className="space-y-6">
              <div className="bg-slate-50 rounded-xl p-6">
                <h3 className="font-semibold text-slate-900 mb-4">Step 1: Direct Communication</h3>
                <p className="text-slate-600 mb-4">
                  Most disputes can be resolved through calm, direct communication. Put your concerns in writing (email or message through the platform) and give the other party a reasonable chance to respond.
                </p>
              </div>

              <div className="bg-slate-50 rounded-xl p-6">
                <h3 className="font-semibold text-slate-900 mb-4">Step 2: Formal Complaint</h3>
                <p className="text-slate-600 mb-4">
                  If direct communication fails, send a formal letter of complaint outlining the issue, what resolution you&apos;re seeking, and a reasonable deadline to respond.
                </p>
              </div>

              <div className="bg-slate-50 rounded-xl p-6">
                <h3 className="font-semibold text-slate-900 mb-4">Step 3: Alternative Dispute Resolution</h3>
                <p className="text-slate-600 mb-4">
                  Consider mediation through services like:
                </p>
                <ul className="list-disc pl-6 text-slate-600 space-y-2">
                  <li>Citizens Advice - free guidance and mediation referrals</li>
                  <li>Trade body dispute resolution (if the tradesperson is a member)</li>
                  <li>The Property Ombudsman or similar schemes</li>
                </ul>
              </div>

              <div className="bg-slate-50 rounded-xl p-6">
                <h3 className="font-semibold text-slate-900 mb-4">Step 4: Legal Action</h3>
                <p className="text-slate-600 mb-4">
                  As a last resort, you may need to pursue legal action:
                </p>
                <ul className="list-disc pl-6 text-slate-600 space-y-2">
                  <li><strong>Small Claims Court:</strong> For disputes up to £10,000 (England/Wales)</li>
                  <li><strong>County Court:</strong> For larger claims</li>
                  <li><strong>Seek legal advice:</strong> Many solicitors offer free initial consultations</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Emergency Contacts */}
          <div className="bg-red-50 border border-red-200 rounded-xl p-6">
            <h3 className="font-semibold text-red-800 mb-4 flex items-center gap-2">
              <Phone className="w-5 h-5" />
              If You&apos;ve Been Scammed
            </h3>
            <ul className="space-y-3 text-red-800">
              <li><strong>Action Fraud:</strong> 0300 123 2040 - Report fraud and cybercrime</li>
              <li><strong>Citizens Advice:</strong> 0800 144 8848 - Free consumer advice</li>
              <li><strong>Trading Standards:</strong> Contact through Citizens Advice</li>
              <li><strong>Police:</strong> 101 for non-emergency, 999 for emergencies</li>
            </ul>
          </div>

        </div>
      </section>

      {/* Related Links */}
      <section className="py-8 bg-slate-50 border-t border-slate-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">Related Pages</h3>
          <div className="flex flex-wrap gap-4">
            <Link href="/terms" className="text-primary-600 hover:text-primary-700 font-medium">
              Terms of Service
            </Link>
            <Link href="/privacy" className="text-primary-600 hover:text-primary-700 font-medium">
              Privacy Policy
            </Link>
            <Link href="/bad-payers/guidelines" className="text-primary-600 hover:text-primary-700 font-medium">
              Bad Payer Report Guidelines
            </Link>
            <Link href="/for-tradespeople" className="text-primary-600 hover:text-primary-700 font-medium">
              For Tradespeople
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
