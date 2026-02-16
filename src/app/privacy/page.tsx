import Link from 'next/link';

export const metadata = {
  title: 'Privacy Policy | Builder',
  description: 'Privacy Policy for the Builder platform',
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <section className="bg-gradient-to-br from-primary-600 to-primary-800 text-white py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Privacy Policy</h1>
          <p className="text-primary-100">Last updated: February 2026</p>
        </div>
      </section>

      {/* Content */}
      <section className="py-12 md:py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="prose prose-slate max-w-none">

            <h2 className="text-2xl font-bold text-slate-900 mt-8 mb-4">1. Introduction</h2>
            <p className="text-slate-600 mb-4">
              Builder UK Ltd (&quot;we&quot;, &quot;our&quot;, &quot;us&quot;) is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our website and services (the &quot;Platform&quot;).
            </p>
            <p className="text-slate-600 mb-4">
              We are the data controller for the purposes of the UK General Data Protection Regulation (UK GDPR) and the Data Protection Act 2018.
            </p>

            <h2 className="text-2xl font-bold text-slate-900 mt-8 mb-4">2. Information We Collect</h2>

            <h3 className="text-xl font-semibold text-slate-800 mt-6 mb-3">2.1 Information You Provide</h3>
            <p className="text-slate-600 mb-4">
              <strong>Account Information:</strong>
            </p>
            <ul className="list-disc pl-6 text-slate-600 mb-4 space-y-2">
              <li>Name, email address, phone number</li>
              <li>Password (stored securely using encryption)</li>
              <li>Profile photo</li>
              <li>Address and postcode</li>
            </ul>
            <p className="text-slate-600 mb-4">
              <strong>Tradesperson Information (additional):</strong>
            </p>
            <ul className="list-disc pl-6 text-slate-600 mb-4 space-y-2">
              <li>Business name and description</li>
              <li>Trade categories and specializations</li>
              <li>Service areas and coverage</li>
              <li>Qualifications and certifications</li>
              <li>Insurance documents</li>
              <li>Portfolio images and descriptions</li>
              <li>Business opening hours</li>
            </ul>
            <p className="text-slate-600 mb-4">
              <strong>Communications:</strong>
            </p>
            <ul className="list-disc pl-6 text-slate-600 mb-4 space-y-2">
              <li>Messages sent through the Platform</li>
              <li>Quote requests and responses</li>
              <li>Reviews and ratings</li>
              <li>Support enquiries</li>
            </ul>

            <h3 className="text-xl font-semibold text-slate-800 mt-6 mb-3">2.2 Information Collected Automatically</h3>
            <ul className="list-disc pl-6 text-slate-600 mb-4 space-y-2">
              <li>IP address and device identifiers</li>
              <li>Browser type and version</li>
              <li>Operating system</li>
              <li>Pages visited and time spent</li>
              <li>Referral source</li>
              <li>Search queries on the Platform</li>
              <li>Clicks and interactions</li>
            </ul>

            <h3 className="text-xl font-semibold text-slate-800 mt-6 mb-3">2.3 Information from Third Parties</h3>
            <ul className="list-disc pl-6 text-slate-600 mb-4 space-y-2">
              <li>Payment information from Stripe (we do not store full card details)</li>
              <li>Verification information from certification bodies</li>
              <li>Publicly available business information</li>
            </ul>

            <h2 className="text-2xl font-bold text-slate-900 mt-8 mb-4">3. How We Use Your Information</h2>
            <p className="text-slate-600 mb-4">
              We use your information for the following purposes:
            </p>
            <h3 className="text-xl font-semibold text-slate-800 mt-6 mb-3">3.1 To Provide Our Services</h3>
            <ul className="list-disc pl-6 text-slate-600 mb-4 space-y-2">
              <li>Create and manage your account</li>
              <li>Display tradesperson profiles to customers</li>
              <li>Facilitate communication between users</li>
              <li>Process quote requests</li>
              <li>Process payments and subscriptions</li>
              <li>Verify tradesperson credentials</li>
            </ul>

            <h3 className="text-xl font-semibold text-slate-800 mt-6 mb-3">3.2 To Improve and Personalize</h3>
            <ul className="list-disc pl-6 text-slate-600 mb-4 space-y-2">
              <li>Analyze usage patterns to improve the Platform</li>
              <li>Personalize your experience and search results</li>
              <li>Develop new features and services</li>
              <li>Conduct research and analytics</li>
            </ul>

            <h3 className="text-xl font-semibold text-slate-800 mt-6 mb-3">3.3 To Communicate With You</h3>
            <ul className="list-disc pl-6 text-slate-600 mb-4 space-y-2">
              <li>Send service-related notifications</li>
              <li>Respond to your enquiries</li>
              <li>Send marketing communications (with your consent)</li>
              <li>Notify you of changes to our services or policies</li>
            </ul>

            <h3 className="text-xl font-semibold text-slate-800 mt-6 mb-3">3.4 To Ensure Safety and Security</h3>
            <ul className="list-disc pl-6 text-slate-600 mb-4 space-y-2">
              <li>Detect and prevent fraud</li>
              <li>Enforce our Terms of Service</li>
              <li>Protect users from harm</li>
              <li>Comply with legal obligations</li>
            </ul>

            <h2 className="text-2xl font-bold text-slate-900 mt-8 mb-4">4. Legal Basis for Processing</h2>
            <p className="text-slate-600 mb-4">
              We process your personal data on the following legal bases:
            </p>
            <ul className="list-disc pl-6 text-slate-600 mb-4 space-y-2">
              <li><strong>Contract:</strong> Processing necessary to perform our contract with you (providing the Platform)</li>
              <li><strong>Legitimate Interests:</strong> Processing necessary for our legitimate interests (improving services, fraud prevention)</li>
              <li><strong>Consent:</strong> Where you have given consent (marketing communications)</li>
              <li><strong>Legal Obligation:</strong> Processing necessary to comply with legal requirements</li>
            </ul>

            <h2 className="text-2xl font-bold text-slate-900 mt-8 mb-4">5. How We Share Your Information</h2>
            <h3 className="text-xl font-semibold text-slate-800 mt-6 mb-3">5.1 With Other Users</h3>
            <p className="text-slate-600 mb-4">
              Tradesperson profiles, including name, business details, portfolio, and reviews, are publicly visible to customers using the Platform.
            </p>

            <h3 className="text-xl font-semibold text-slate-800 mt-6 mb-3">5.2 With Service Providers</h3>
            <p className="text-slate-600 mb-4">
              We share information with trusted third parties who assist in operating our Platform:
            </p>
            <ul className="list-disc pl-6 text-slate-600 mb-4 space-y-2">
              <li><strong>Stripe:</strong> Payment processing</li>
              <li><strong>Resend:</strong> Email delivery</li>
              <li><strong>Cloud hosting providers:</strong> Data storage</li>
              <li><strong>Analytics providers:</strong> Usage analysis</li>
            </ul>

            <h3 className="text-xl font-semibold text-slate-800 mt-6 mb-3">5.3 For Legal Reasons</h3>
            <p className="text-slate-600 mb-4">
              We may disclose information if required by law, court order, or government request, or to protect our rights, property, or safety.
            </p>

            <h3 className="text-xl font-semibold text-slate-800 mt-6 mb-3">5.4 Business Transfers</h3>
            <p className="text-slate-600 mb-4">
              If we are involved in a merger, acquisition, or sale of assets, your information may be transferred as part of that transaction.
            </p>

            <h2 className="text-2xl font-bold text-slate-900 mt-8 mb-4">6. Data Retention</h2>
            <p className="text-slate-600 mb-4">
              We retain your personal data for as long as necessary to provide our services and fulfill the purposes described in this policy. Specifically:
            </p>
            <ul className="list-disc pl-6 text-slate-600 mb-4 space-y-2">
              <li><strong>Active accounts:</strong> Data is retained while your account is active</li>
              <li><strong>Closed accounts:</strong> Account data is deleted within 30 days, except where retention is required by law</li>
              <li><strong>Reviews:</strong> Retained indefinitely to maintain platform integrity</li>
              <li><strong>Financial records:</strong> Retained for 7 years for tax and accounting purposes</li>
              <li><strong>Communication logs:</strong> Retained for 2 years</li>
            </ul>

            <h2 className="text-2xl font-bold text-slate-900 mt-8 mb-4">7. Your Rights</h2>
            <p className="text-slate-600 mb-4">
              Under UK GDPR, you have the following rights:
            </p>
            <ul className="list-disc pl-6 text-slate-600 mb-4 space-y-2">
              <li><strong>Access:</strong> Request a copy of your personal data</li>
              <li><strong>Rectification:</strong> Request correction of inaccurate data</li>
              <li><strong>Erasure:</strong> Request deletion of your data (subject to legal requirements)</li>
              <li><strong>Restriction:</strong> Request restriction of processing</li>
              <li><strong>Portability:</strong> Request transfer of your data to another service</li>
              <li><strong>Objection:</strong> Object to processing based on legitimate interests</li>
              <li><strong>Withdraw Consent:</strong> Withdraw consent where processing is based on consent</li>
            </ul>
            <p className="text-slate-600 mb-4">
              To exercise these rights, contact us at privacy@builder.co.uk. We will respond within 30 days.
            </p>

            <h2 className="text-2xl font-bold text-slate-900 mt-8 mb-4">8. Data Security</h2>
            <p className="text-slate-600 mb-4">
              We implement appropriate technical and organizational measures to protect your data, including:
            </p>
            <ul className="list-disc pl-6 text-slate-600 mb-4 space-y-2">
              <li>Encryption of data in transit (TLS/SSL)</li>
              <li>Encryption of sensitive data at rest</li>
              <li>Secure password hashing</li>
              <li>Regular security assessments</li>
              <li>Access controls and authentication</li>
              <li>Staff training on data protection</li>
            </ul>

            <h2 className="text-2xl font-bold text-slate-900 mt-8 mb-4">9. International Transfers</h2>
            <p className="text-slate-600 mb-4">
              Your data is primarily stored in the UK/EEA. Where we transfer data outside the UK/EEA, we ensure appropriate safeguards are in place, such as Standard Contractual Clauses approved by the UK Information Commissioner.
            </p>

            <h2 className="text-2xl font-bold text-slate-900 mt-8 mb-4">10. Children&apos;s Privacy</h2>
            <p className="text-slate-600 mb-4">
              Our Platform is not intended for children under 18 years of age. We do not knowingly collect personal data from children. If you believe we have collected data from a child, please contact us immediately.
            </p>

            <h2 className="text-2xl font-bold text-slate-900 mt-8 mb-4">11. Third-Party Links</h2>
            <p className="text-slate-600 mb-4">
              Our Platform may contain links to third-party websites. We are not responsible for the privacy practices of these websites. We encourage you to read the privacy policies of any websites you visit.
            </p>

            <h2 className="text-2xl font-bold text-slate-900 mt-8 mb-4">12. Changes to This Policy</h2>
            <p className="text-slate-600 mb-4">
              We may update this Privacy Policy from time to time. We will notify you of material changes by email or through the Platform. The &quot;Last updated&quot; date at the top indicates when the policy was last revised.
            </p>

            <h2 className="text-2xl font-bold text-slate-900 mt-8 mb-4">13. Contact Us</h2>
            <p className="text-slate-600 mb-4">
              If you have questions about this Privacy Policy or our data practices, please contact us:
            </p>
            <div className="bg-slate-50 rounded-lg p-6 mb-4">
              <p className="text-slate-600">
                <strong>Data Protection Officer</strong><br />
                Builder UK Ltd<br />
                Email: privacy@builder.co.uk<br />
                Address: [Registered Address]
              </p>
            </div>
            <p className="text-slate-600 mb-4">
              You also have the right to lodge a complaint with the Information Commissioner&apos;s Office (ICO) at <a href="https://ico.org.uk" className="text-primary-600 hover:text-primary-700">ico.org.uk</a>.
            </p>

          </div>

          {/* Related Links */}
          <div className="mt-12 pt-8 border-t border-slate-200">
            <h3 className="text-lg font-semibold text-slate-900 mb-4">Related Policies</h3>
            <div className="flex flex-wrap gap-4">
              <Link href="/terms" className="text-primary-600 hover:text-primary-700 font-medium">
                Terms of Service
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
