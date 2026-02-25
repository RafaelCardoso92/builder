import Link from 'next/link';

export const metadata = {
  title: 'Terms of Service | Builder',
  description: 'Terms of Service for using the Builder platform',
};

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <section className="bg-gradient-to-br from-primary-600 to-primary-800 text-white py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Terms of Service</h1>
          <p className="text-primary-100">Last updated: February 2026</p>
        </div>
      </section>

      {/* Content */}
      <section className="py-12 md:py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="prose prose-slate max-w-none">

            <h2 className="text-2xl font-bold text-slate-900 mt-8 mb-4">1. Introduction</h2>
            <p className="text-slate-600 mb-4">
              Welcome to Builder (&quot;we&quot;, &quot;our&quot;, &quot;us&quot;, or the &quot;Platform&quot;). These Terms of Service (&quot;Terms&quot;) govern your access to and use of our website, mobile applications, and services (collectively, the &quot;Services&quot;).
            </p>
            <p className="text-slate-600 mb-4">
              By accessing or using our Services, you agree to be bound by these Terms. If you do not agree to these Terms, you may not access or use the Services.
            </p>
            <p className="text-slate-600 mb-4">
              Builder is operated by Builder UK Ltd. Company registration details are available upon request by contacting us at legal@builder.co.uk.
            </p>

            <h2 className="text-2xl font-bold text-slate-900 mt-8 mb-4">2. Definitions</h2>
            <ul className="list-disc pl-6 text-slate-600 mb-4 space-y-2">
              <li><strong>&quot;Customer&quot;</strong> or <strong>&quot;Homeowner&quot;</strong> means any person using the Platform to find, contact, or engage Tradespeople for services.</li>
              <li><strong>&quot;Tradesperson&quot;</strong> or <strong>&quot;Trade Member&quot;</strong> means any individual or business registered on the Platform offering trade services.</li>
              <li><strong>&quot;User&quot;</strong> means any Customer, Tradesperson, or visitor accessing the Platform.</li>
              <li><strong>&quot;Services&quot;</strong> means all features, tools, and functionality provided through the Platform.</li>
              <li><strong>&quot;Content&quot;</strong> means all information, text, images, reviews, messages, and other materials uploaded to or transmitted through the Platform.</li>
            </ul>

            <h2 className="text-2xl font-bold text-slate-900 mt-8 mb-4">3. Eligibility and Account Registration</h2>
            <h3 className="text-xl font-semibold text-slate-800 mt-6 mb-3">3.1 Eligibility</h3>
            <p className="text-slate-600 mb-4">
              To use our Services, you must:
            </p>
            <ul className="list-disc pl-6 text-slate-600 mb-4 space-y-2">
              <li>Be at least 18 years of age</li>
              <li>Be legally capable of entering into binding contracts</li>
              <li>Not be prohibited from using the Services under applicable law</li>
              <li>For Tradespeople: be legally entitled to work in the United Kingdom and hold all necessary licenses, certifications, and insurance required for your trade</li>
            </ul>

            <h3 className="text-xl font-semibold text-slate-800 mt-6 mb-3">3.2 Account Registration</h3>
            <p className="text-slate-600 mb-4">
              When creating an account, you agree to:
            </p>
            <ul className="list-disc pl-6 text-slate-600 mb-4 space-y-2">
              <li>Provide accurate, current, and complete information</li>
              <li>Maintain and promptly update your account information</li>
              <li>Maintain the security of your password and account</li>
              <li>Accept responsibility for all activities under your account</li>
              <li>Notify us immediately of any unauthorized use of your account</li>
            </ul>

            <h2 className="text-2xl font-bold text-slate-900 mt-8 mb-4">4. The Nature of Our Services</h2>
            <h3 className="text-xl font-semibold text-slate-800 mt-6 mb-3">4.1 Platform Role</h3>
            <p className="text-slate-600 mb-4">
              Builder is an online marketplace that connects Customers with Tradespeople. <strong>We are not a party to any agreement between Customers and Tradespeople.</strong> We do not:
            </p>
            <ul className="list-disc pl-6 text-slate-600 mb-4 space-y-2">
              <li>Employ Tradespeople or act as their agent</li>
              <li>Guarantee the quality, safety, or legality of work performed</li>
              <li>Guarantee that Tradespeople will complete work as agreed</li>
              <li>Guarantee that Customers will pay for work as agreed</li>
              <li>Provide any warranty for work performed by Tradespeople</li>
            </ul>

            <h3 className="text-xl font-semibold text-slate-800 mt-6 mb-3">4.2 No Employment Relationship</h3>
            <p className="text-slate-600 mb-4">
              Tradespeople are independent contractors and not employees, workers, agents, or partners of Builder. The relationship between a Tradesperson and Customer is a direct contractual relationship to which Builder is not a party.
            </p>

            <h3 className="text-xl font-semibold text-slate-800 mt-6 mb-3">4.3 No Payment Processing or Escrow</h3>
            <p className="text-slate-600 mb-4">
              <strong>Builder does not process, hold, or guarantee any payments between Customers and Tradespeople.</strong> We are not a payment intermediary, escrow service, or financial services provider. Specifically:
            </p>
            <ul className="list-disc pl-6 text-slate-600 mb-4 space-y-2">
              <li>All payments are made directly between Customers and Tradespeople</li>
              <li>We do not hold funds on behalf of either party</li>
              <li>We do not guarantee that payment will be made or received</li>
              <li>We cannot recover funds or intervene in payment disputes</li>
              <li>We are not responsible for non-payment by either party</li>
            </ul>
            <p className="text-slate-600 mb-4">
              Users are solely responsible for agreeing payment terms, collecting payments, and resolving any payment disputes. We strongly recommend reviewing our <Link href="/safety" className="text-primary-600 hover:text-primary-700">Safety Guidelines</Link> for payment best practices.
            </p>

            <h2 className="text-2xl font-bold text-slate-900 mt-8 mb-4">5. Tradesperson Obligations</h2>
            <h3 className="text-xl font-semibold text-slate-800 mt-6 mb-3">5.1 Verification and Standards</h3>
            <p className="text-slate-600 mb-4">
              By registering as a Tradesperson, you warrant and agree that:
            </p>
            <ul className="list-disc pl-6 text-slate-600 mb-4 space-y-2">
              <li>All information provided during registration and verification is accurate and truthful</li>
              <li>You hold all necessary qualifications, certifications, and licenses for your stated trades</li>
              <li>You maintain adequate public liability insurance (minimum £1,000,000 cover recommended)</li>
              <li>You will notify us immediately if your qualifications, insurance, or certifications expire or are revoked</li>
              <li>You will comply with all applicable laws, regulations, and industry standards</li>
              <li>You will not misrepresent your qualifications, experience, or capabilities</li>
            </ul>

            <h3 className="text-xl font-semibold text-slate-800 mt-6 mb-3">5.2 Conduct and Service Standards</h3>
            <p className="text-slate-600 mb-4">
              Tradespeople agree to:
            </p>
            <ul className="list-disc pl-6 text-slate-600 mb-4 space-y-2">
              <li>Respond to quote requests promptly and professionally</li>
              <li>Provide accurate quotes and estimates</li>
              <li>Complete work to a reasonable standard of care and skill</li>
              <li>Communicate clearly and honestly with Customers</li>
              <li>Honor agreed prices unless changes are agreed in writing</li>
              <li>Maintain appropriate behavior when visiting Customer premises</li>
              <li>Comply with all health and safety requirements</li>
            </ul>

            <h3 className="text-xl font-semibold text-slate-800 mt-6 mb-3">5.3 Subscription and Fees</h3>
            <p className="text-slate-600 mb-4">
              Tradespeople may access the Platform under different subscription tiers:
            </p>
            <ul className="list-disc pl-6 text-slate-600 mb-4 space-y-2">
              <li><strong>Free:</strong> Basic profile with limited features</li>
              <li><strong>Pro:</strong> Enhanced features at £29/month</li>
              <li><strong>Premium:</strong> Full features at £59/month</li>
            </ul>
            <p className="text-slate-600 mb-4">
              Subscription fees are billed in advance on a monthly basis. You may cancel your subscription at any time, which will take effect at the end of the current billing period. No refunds are provided for partial months.
            </p>

            <h2 className="text-2xl font-bold text-slate-900 mt-8 mb-4">6. Customer Obligations</h2>
            <p className="text-slate-600 mb-4">
              By using the Platform as a Customer, you agree to:
            </p>
            <ul className="list-disc pl-6 text-slate-600 mb-4 space-y-2">
              <li>Provide accurate information when requesting quotes</li>
              <li>Communicate clearly about project requirements</li>
              <li>Allow reasonable access to your property for agreed work</li>
              <li>Pay Tradespeople as agreed for completed work</li>
              <li>Leave honest and fair reviews based on genuine experiences</li>
              <li>Not use the Platform to harass, abuse, or defraud Tradespeople</li>
            </ul>

            <h2 className="text-2xl font-bold text-slate-900 mt-8 mb-4">7. Reviews and Ratings</h2>
            <h3 className="text-xl font-semibold text-slate-800 mt-6 mb-3">7.1 Review Guidelines</h3>
            <p className="text-slate-600 mb-4">
              Reviews are a vital part of our Platform. When leaving a review, you agree that:
            </p>
            <ul className="list-disc pl-6 text-slate-600 mb-4 space-y-2">
              <li>Your review is based on a genuine experience with the Tradesperson</li>
              <li>Your review is honest, accurate, and fair</li>
              <li>You will not include false or misleading information</li>
              <li>You will not include defamatory, abusive, or offensive content</li>
              <li>You will not include personal information about third parties</li>
              <li>You have not been offered payment or incentives in exchange for your review</li>
            </ul>

            <h3 className="text-xl font-semibold text-slate-800 mt-6 mb-3">7.2 Review Moderation</h3>
            <p className="text-slate-600 mb-4">
              We reserve the right to moderate, edit, or remove reviews that:
            </p>
            <ul className="list-disc pl-6 text-slate-600 mb-4 space-y-2">
              <li>Violate these Terms or our Review Guidelines</li>
              <li>Contain false or misleading information</li>
              <li>Are defamatory, abusive, or offensive</li>
              <li>Are suspected to be fake or fraudulent</li>
              <li>Are not based on a genuine customer experience</li>
            </ul>

            <h3 className="text-xl font-semibold text-slate-800 mt-6 mb-3">7.3 Tradesperson Responses</h3>
            <p className="text-slate-600 mb-4">
              Tradespeople may respond to reviews. Responses must be professional and not contain abusive, threatening, or defamatory content. We reserve the right to remove inappropriate responses.
            </p>

            <h2 className="text-2xl font-bold text-slate-900 mt-8 mb-4">8. Verification and Badges</h2>
            <h3 className="text-xl font-semibold text-slate-800 mt-6 mb-3">8.1 Verification Process</h3>
            <p className="text-slate-600 mb-4">
              We offer verification services for Tradespeople, including identity verification, insurance verification, and qualification checks. Verification involves:
            </p>
            <ul className="list-disc pl-6 text-slate-600 mb-4 space-y-2">
              <li>Submission of relevant documentation</li>
              <li>Review by our verification team</li>
              <li>Ongoing monitoring and periodic re-verification</li>
            </ul>

            <h3 className="text-xl font-semibold text-slate-800 mt-6 mb-3">8.2 Verification Limitations</h3>
            <p className="text-slate-600 mb-4">
              While we take reasonable steps to verify Tradesperson credentials:
            </p>
            <ul className="list-disc pl-6 text-slate-600 mb-4 space-y-2">
              <li>Verification is based on information provided by Tradespeople</li>
              <li>We cannot guarantee the accuracy of all information</li>
              <li>Verification status may change over time</li>
              <li>Customers should conduct their own due diligence</li>
            </ul>

            <h2 className="text-2xl font-bold text-slate-900 mt-8 mb-4">9. Messaging and Communications</h2>
            <p className="text-slate-600 mb-4">
              Our Platform includes messaging features. When using these features, you agree to:
            </p>
            <ul className="list-disc pl-6 text-slate-600 mb-4 space-y-2">
              <li>Use messaging for legitimate purposes related to projects and quotes</li>
              <li>Not send spam, unsolicited advertising, or promotional material</li>
              <li>Not send abusive, threatening, or harassing messages</li>
              <li>Not share inappropriate or offensive content</li>
              <li>Not attempt to circumvent the Platform to avoid fees</li>
            </ul>
            <p className="text-slate-600 mb-4">
              We may monitor messages to ensure compliance with these Terms and to protect Users from fraud and abuse.
            </p>

            <h2 className="text-2xl font-bold text-slate-900 mt-8 mb-4">10. Bad Payer Reports</h2>
            <h3 className="text-xl font-semibold text-slate-800 mt-6 mb-3">10.1 Purpose and Nature</h3>
            <p className="text-slate-600 mb-4">
              The Bad Payer Report system allows registered Tradespeople to report non-payment experiences. <strong>Builder acts solely as a neutral platform</strong> for these reports and does not verify their accuracy.
            </p>

            <h3 className="text-xl font-semibold text-slate-800 mt-6 mb-3">10.2 Reporter Responsibilities</h3>
            <p className="text-slate-600 mb-4">
              By submitting a Bad Payer Report, you:
            </p>
            <ul className="list-disc pl-6 text-slate-600 mb-4 space-y-2">
              <li>Warrant that all information is true, accurate, and complete</li>
              <li>Accept sole responsibility for the content of your report</li>
              <li>Agree to indemnify Builder against any claims arising from your report</li>
              <li>Acknowledge that false reports may constitute defamation</li>
              <li>Agree to comply with the <Link href="/bad-payers/guidelines" className="text-primary-600 hover:text-primary-700">Bad Payer Report Guidelines</Link></li>
            </ul>

            <h3 className="text-xl font-semibold text-slate-800 mt-6 mb-3">10.3 Platform Disclaimer</h3>
            <p className="text-slate-600 mb-4">
              Builder UK Ltd:
            </p>
            <ul className="list-disc pl-6 text-slate-600 mb-4 space-y-2">
              <li>Does NOT verify the accuracy of Bad Payer Reports</li>
              <li>Does NOT investigate or arbitrate underlying disputes</li>
              <li>Does NOT endorse any report or take sides in disputes</li>
              <li>Accepts NO liability for any loss arising from reliance on reports</li>
              <li>Reserves the right to remove any report at any time</li>
            </ul>

            <h3 className="text-xl font-semibold text-slate-800 mt-6 mb-3">10.4 Disputes and Removal</h3>
            <p className="text-slate-600 mb-4">
              Any person may dispute a report by contacting us. We will review disputed reports but are not obligated to resolve disputes or determine their merits. Reports may be removed for policy violations, upon reporter request, upon payment resolution, or as required by law.
            </p>

            <h2 className="text-2xl font-bold text-slate-900 mt-8 mb-4">11. Prohibited Conduct</h2>
            <p className="text-slate-600 mb-4">
              You agree not to:
            </p>
            <ul className="list-disc pl-6 text-slate-600 mb-4 space-y-2">
              <li>Use the Platform for any illegal purpose</li>
              <li>Violate any applicable laws or regulations</li>
              <li>Infringe the intellectual property rights of others</li>
              <li>Transmit any malware, viruses, or harmful code</li>
              <li>Attempt to gain unauthorized access to our systems</li>
              <li>Scrape, harvest, or collect data from the Platform</li>
              <li>Impersonate another person or entity</li>
              <li>Create fake accounts or reviews</li>
              <li>Manipulate ratings or reviews</li>
              <li>Circumvent any security measures</li>
              <li>Use the Platform to harass, abuse, or threaten others</li>
              <li>Engage in any fraudulent activity</li>
            </ul>

            <h2 className="text-2xl font-bold text-slate-900 mt-8 mb-4">12. Intellectual Property</h2>
            <h3 className="text-xl font-semibold text-slate-800 mt-6 mb-3">12.1 Our Intellectual Property</h3>
            <p className="text-slate-600 mb-4">
              The Platform, including its design, features, content, and branding, is owned by Builder UK Ltd and protected by intellectual property laws. You may not copy, modify, distribute, or create derivative works without our written permission.
            </p>

            <h3 className="text-xl font-semibold text-slate-800 mt-6 mb-3">12.2 User Content</h3>
            <p className="text-slate-600 mb-4">
              You retain ownership of Content you upload to the Platform. By uploading Content, you grant us a non-exclusive, worldwide, royalty-free license to use, display, reproduce, and distribute that Content in connection with operating and promoting the Platform.
            </p>

            <h2 className="text-2xl font-bold text-slate-900 mt-8 mb-4">13. Limitation of Liability</h2>
            <h3 className="text-xl font-semibold text-slate-800 mt-6 mb-3">13.1 Platform Services</h3>
            <p className="text-slate-600 mb-4">
              The Platform is provided &quot;as is&quot; and &quot;as available&quot;. To the fullest extent permitted by law:
            </p>
            <ul className="list-disc pl-6 text-slate-600 mb-4 space-y-2">
              <li>We make no warranties regarding the Platform&apos;s availability, reliability, or functionality</li>
              <li>We are not liable for any losses arising from your use of the Platform</li>
              <li>We are not liable for the actions, omissions, or conduct of any User</li>
              <li>We are not liable for any disputes between Customers and Tradespeople</li>
            </ul>

            <h3 className="text-xl font-semibold text-slate-800 mt-6 mb-3">13.2 Work Performed by Tradespeople</h3>
            <p className="text-slate-600 mb-4">
              <strong>Builder is not responsible for work performed by Tradespeople.</strong> Any contract for work is between the Customer and Tradesperson directly. Customers should:
            </p>
            <ul className="list-disc pl-6 text-slate-600 mb-4 space-y-2">
              <li>Verify Tradesperson credentials independently</li>
              <li>Obtain written quotes and contracts</li>
              <li>Ensure Tradespeople have adequate insurance</li>
              <li>Check references where appropriate</li>
            </ul>

            <h3 className="text-xl font-semibold text-slate-800 mt-6 mb-3">13.3 Maximum Liability</h3>
            <p className="text-slate-600 mb-4">
              To the maximum extent permitted by law, our total liability to you for any claims arising from your use of the Platform shall not exceed the greater of: (a) £100, or (b) the fees you have paid to us in the 12 months preceding the claim.
            </p>

            <h2 className="text-2xl font-bold text-slate-900 mt-8 mb-4">14. Indemnification</h2>
            <p className="text-slate-600 mb-4">
              You agree to indemnify and hold harmless Builder UK Ltd, its officers, directors, employees, and agents from any claims, damages, losses, or expenses (including legal fees) arising from:
            </p>
            <ul className="list-disc pl-6 text-slate-600 mb-4 space-y-2">
              <li>Your use of the Platform</li>
              <li>Your violation of these Terms</li>
              <li>Your violation of any third-party rights</li>
              <li>Any Content you upload to the Platform</li>
              <li>Any work performed by you (for Tradespeople)</li>
            </ul>

            <h2 className="text-2xl font-bold text-slate-900 mt-8 mb-4">15. Suspension and Termination</h2>
            <h3 className="text-xl font-semibold text-slate-800 mt-6 mb-3">15.1 By You</h3>
            <p className="text-slate-600 mb-4">
              You may close your account at any time by contacting us. If you have an active subscription, it will be canceled at the end of the current billing period.
            </p>

            <h3 className="text-xl font-semibold text-slate-800 mt-6 mb-3">15.2 By Us</h3>
            <p className="text-slate-600 mb-4">
              We may suspend or terminate your account immediately if:
            </p>
            <ul className="list-disc pl-6 text-slate-600 mb-4 space-y-2">
              <li>You breach these Terms</li>
              <li>We suspect fraudulent or illegal activity</li>
              <li>Your conduct harms other Users or our reputation</li>
              <li>You fail to maintain required verifications or insurance (for Tradespeople)</li>
              <li>We receive multiple legitimate complaints about your conduct</li>
            </ul>

            <h2 className="text-2xl font-bold text-slate-900 mt-8 mb-4">16. Dispute Resolution</h2>
            <h3 className="text-xl font-semibold text-slate-800 mt-6 mb-3">16.1 Disputes Between Users</h3>
            <p className="text-slate-600 mb-4">
              We encourage Customers and Tradespeople to resolve disputes directly. While we may provide guidance or mediation, we are not obligated to resolve disputes between Users and accept no liability for their outcome.
            </p>

            <h3 className="text-xl font-semibold text-slate-800 mt-6 mb-3">16.2 Disputes With Builder</h3>
            <p className="text-slate-600 mb-4">
              If you have a dispute with us, please contact us first to attempt to resolve it. Any legal proceedings must be brought in the courts of England and Wales.
            </p>

            <h2 className="text-2xl font-bold text-slate-900 mt-8 mb-4">17. Changes to Terms</h2>
            <p className="text-slate-600 mb-4">
              We may modify these Terms at any time. We will notify you of material changes by email or through the Platform. Continued use of the Platform after changes take effect constitutes acceptance of the modified Terms.
            </p>

            <h2 className="text-2xl font-bold text-slate-900 mt-8 mb-4">18. General Provisions</h2>
            <h3 className="text-xl font-semibold text-slate-800 mt-6 mb-3">18.1 Entire Agreement</h3>
            <p className="text-slate-600 mb-4">
              These Terms, together with our Privacy Policy and Cookie Policy, constitute the entire agreement between you and Builder UK Ltd.
            </p>

            <h3 className="text-xl font-semibold text-slate-800 mt-6 mb-3">18.2 Severability</h3>
            <p className="text-slate-600 mb-4">
              If any provision of these Terms is found to be unenforceable, the remaining provisions will continue in effect.
            </p>

            <h3 className="text-xl font-semibold text-slate-800 mt-6 mb-3">18.3 No Waiver</h3>
            <p className="text-slate-600 mb-4">
              Our failure to enforce any right or provision of these Terms shall not constitute a waiver of that right or provision.
            </p>

            <h3 className="text-xl font-semibold text-slate-800 mt-6 mb-3">18.4 Governing Law</h3>
            <p className="text-slate-600 mb-4">
              These Terms are governed by the laws of England and Wales. You agree to submit to the exclusive jurisdiction of the courts of England and Wales.
            </p>

            <h2 className="text-2xl font-bold text-slate-900 mt-8 mb-4">19. Contact Us</h2>
            <p className="text-slate-600 mb-4">
              If you have any questions about these Terms, please contact us at:
            </p>
            <div className="bg-slate-50 rounded-lg p-6 mb-4">
              <p className="text-slate-600">
                <strong>Builder UK Ltd</strong><br />
                Email: legal@builder.co.uk
              </p>
            </div>

          </div>

          {/* Related Links */}
          <div className="mt-12 pt-8 border-t border-slate-200">
            <h3 className="text-lg font-semibold text-slate-900 mb-4">Related Policies</h3>
            <div className="flex flex-wrap gap-4">
              <Link href="/privacy" className="text-primary-600 hover:text-primary-700 font-medium">
                Privacy Policy
              </Link>
              <Link href="/cookies" className="text-primary-600 hover:text-primary-700 font-medium">
                Cookie Policy
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
