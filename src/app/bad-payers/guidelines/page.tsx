import Link from 'next/link';
import { AlertTriangle, Shield, Scale, FileText, CheckCircle, XCircle } from 'lucide-react';

export const metadata = {
  title: 'Bad Payer Report Guidelines | Builder',
  description: 'Guidelines and terms for submitting bad payer reports on the Builder platform',
};

export default function BadPayerGuidelinesPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <section className="bg-gradient-to-br from-red-600 to-red-800 text-white py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <AlertTriangle className="w-16 h-16 mx-auto mb-4" />
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Bad Payer Report Guidelines</h1>
          <p className="text-red-100">Important terms and conditions for using the Bad Payer reporting system</p>
        </div>
      </section>

      {/* Content */}
      <section className="py-12 md:py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="prose prose-slate max-w-none">

            {/* Important Notice */}
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-6 mb-8">
              <h2 className="text-xl font-bold text-amber-800 mt-0 mb-3 flex items-center gap-2">
                <AlertTriangle className="w-6 h-6" />
                Important Legal Notice
              </h2>
              <p className="text-amber-800 mb-0">
                By submitting a Bad Payer Report, you acknowledge that <strong>you are solely responsible</strong> for the accuracy and truthfulness of the information provided. Builder UK Ltd acts only as a neutral platform and does not verify the accuracy of reports. False or malicious reports may expose you to legal action for defamation.
              </p>
            </div>

            <h2 className="text-2xl font-bold text-slate-900 mt-8 mb-4">1. Purpose of Bad Payer Reports</h2>
            <p className="text-slate-600 mb-4">
              The Bad Payer Report system is designed to help tradespeople share their experiences with non-paying or late-paying customers, enabling other tradespeople to make informed decisions about potential work. This system is provided as a community service feature.
            </p>

            <h2 className="text-2xl font-bold text-slate-900 mt-8 mb-4">2. Eligibility to Submit Reports</h2>
            <p className="text-slate-600 mb-4">
              To submit a Bad Payer Report, you must:
            </p>
            <ul className="list-disc pl-6 text-slate-600 mb-4 space-y-2">
              <li>Be a registered Tradesperson on the Builder platform</li>
              <li>Have a verified business profile</li>
              <li>Have personally undertaken work for the customer in question</li>
              <li>Have made reasonable attempts to collect payment before submitting a report</li>
            </ul>

            <h2 className="text-2xl font-bold text-slate-900 mt-8 mb-4">3. Your Warranties and Representations</h2>
            <p className="text-slate-600 mb-4">
              By submitting a Bad Payer Report, you warrant and represent that:
            </p>
            <ul className="list-disc pl-6 text-slate-600 mb-4 space-y-2">
              <li>All information in the report is <strong>true, accurate, and complete</strong> to the best of your knowledge</li>
              <li>You have <strong>documentary evidence</strong> (quotes, invoices, contracts, communications) to support your claim</li>
              <li>The work described was actually performed by you or your business</li>
              <li>The amount stated as owed is accurate and has not been paid</li>
              <li>You have made <strong>genuine attempts to resolve the matter</strong> directly with the customer</li>
              <li>The report is submitted in <strong>good faith</strong> and not for malicious purposes</li>
              <li>You are not submitting the report as revenge for a legitimate dispute, negative review, or other grievance</li>
              <li>The report does not contain any information that is defamatory, false, or misleading</li>
            </ul>

            <h2 className="text-2xl font-bold text-slate-900 mt-8 mb-4">4. What You Must NOT Include</h2>
            <div className="bg-red-50 border border-red-200 rounded-xl p-6 mb-6">
              <p className="text-slate-600 mb-4">
                <strong>Reports must NOT contain:</strong>
              </p>
              <ul className="list-disc pl-6 text-slate-600 space-y-2">
                <li><XCircle className="w-4 h-4 inline text-red-600 mr-1" /> Full names of individuals (use initials only, e.g., &quot;Mr J. Smith&quot;)</li>
                <li><XCircle className="w-4 h-4 inline text-red-600 mr-1" /> Full addresses (postcode area only, e.g., &quot;SW1&quot; not &quot;123 High Street, SW1A 1AA&quot;)</li>
                <li><XCircle className="w-4 h-4 inline text-red-600 mr-1" /> Phone numbers or email addresses</li>
                <li><XCircle className="w-4 h-4 inline text-red-600 mr-1" /> Social media profiles or usernames</li>
                <li><XCircle className="w-4 h-4 inline text-red-600 mr-1" /> Photographs of the property that could identify it</li>
                <li><XCircle className="w-4 h-4 inline text-red-600 mr-1" /> Defamatory language, insults, or personal attacks</li>
                <li><XCircle className="w-4 h-4 inline text-red-600 mr-1" /> Information about disputes unrelated to payment</li>
                <li><XCircle className="w-4 h-4 inline text-red-600 mr-1" /> Any protected characteristics (race, religion, disability, etc.)</li>
              </ul>
            </div>

            <h2 className="text-2xl font-bold text-slate-900 mt-8 mb-4">5. Evidence Requirements</h2>
            <p className="text-slate-600 mb-4">
              We strongly recommend uploading supporting evidence, which may include:
            </p>
            <ul className="list-disc pl-6 text-slate-600 mb-4 space-y-2">
              <li><CheckCircle className="w-4 h-4 inline text-green-600 mr-1" /> Written quotes or estimates (with personal details redacted)</li>
              <li><CheckCircle className="w-4 h-4 inline text-green-600 mr-1" /> Signed contracts or agreements</li>
              <li><CheckCircle className="w-4 h-4 inline text-green-600 mr-1" /> Invoices showing amounts owed</li>
              <li><CheckCircle className="w-4 h-4 inline text-green-600 mr-1" /> Screenshots of payment requests</li>
              <li><CheckCircle className="w-4 h-4 inline text-green-600 mr-1" /> Correspondence demonstrating non-payment</li>
              <li><CheckCircle className="w-4 h-4 inline text-green-600 mr-1" /> Small claims court documents (if applicable)</li>
            </ul>
            <p className="text-slate-600 mb-4">
              <strong>All evidence must be redacted</strong> to remove personal identifying information before upload.
            </p>

            <h2 className="text-2xl font-bold text-slate-900 mt-8 mb-4">6. Moderation and Review</h2>
            <p className="text-slate-600 mb-4">
              All reports are subject to moderation before publication. We reserve the right to:
            </p>
            <ul className="list-disc pl-6 text-slate-600 mb-4 space-y-2">
              <li>Reject reports that do not comply with these guidelines</li>
              <li>Request additional evidence or clarification</li>
              <li>Edit reports to remove prohibited content</li>
              <li>Remove reports at any time without notice</li>
              <li>Suspend or terminate accounts that abuse the system</li>
            </ul>

            <h2 className="text-2xl font-bold text-slate-900 mt-8 mb-4">7. Dispute Process</h2>
            <p className="text-slate-600 mb-4">
              Any person named in a report may dispute its accuracy. The dispute process works as follows:
            </p>
            <ol className="list-decimal pl-6 text-slate-600 mb-4 space-y-2">
              <li>The accused party may submit a dispute through our contact form</li>
              <li>The report will be marked as &quot;Disputed&quot; and may be temporarily hidden</li>
              <li>The reporter will be notified and asked to provide evidence</li>
              <li>Our team will review the evidence from both parties</li>
              <li>A decision will be made to uphold, modify, or remove the report</li>
              <li>Both parties will be notified of the outcome</li>
            </ol>
            <p className="text-slate-600 mb-4">
              <strong>Builder UK Ltd is not an arbiter of disputes.</strong> We do not determine whether money is owed. Our review is limited to ensuring reports comply with these guidelines.
            </p>

            <h2 className="text-2xl font-bold text-slate-900 mt-8 mb-4">8. Your Liability and Indemnification</h2>
            <div className="bg-slate-100 border border-slate-300 rounded-xl p-6 mb-6">
              <p className="text-slate-700 mb-4">
                <strong>You are solely and fully responsible for all content you submit</strong> through the Bad Payer Report system. By submitting a report, you agree to:
              </p>
              <ul className="list-disc pl-6 text-slate-700 space-y-2">
                <li><strong>Indemnify and hold harmless</strong> Builder UK Ltd, its officers, directors, employees, and agents from any claims, damages, losses, or expenses (including legal fees) arising from your report</li>
                <li>Accept full legal responsibility if your report is found to be false, defamatory, or malicious</li>
                <li>Defend Builder UK Ltd against any legal action brought by a third party as a result of your report</li>
              </ul>
            </div>

            <h2 className="text-2xl font-bold text-slate-900 mt-8 mb-4">9. Platform Liability Disclaimer</h2>
            <p className="text-slate-600 mb-4">
              <strong>Builder UK Ltd acts only as a neutral intermediary platform.</strong> We:
            </p>
            <ul className="list-disc pl-6 text-slate-600 mb-4 space-y-2">
              <li>Do NOT verify the accuracy or truthfulness of any report</li>
              <li>Do NOT investigate the underlying disputes between parties</li>
              <li>Do NOT guarantee that information in reports is accurate, complete, or current</li>
              <li>Do NOT endorse any report or take a position on any dispute</li>
              <li>Accept NO liability for any loss or damage arising from reliance on Bad Payer Reports</li>
            </ul>
            <p className="text-slate-600 mb-4">
              Reports represent the personal views and experiences of the reporters only. Users should conduct their own due diligence and not rely solely on Bad Payer Reports when making business decisions.
            </p>

            <h2 className="text-2xl font-bold text-slate-900 mt-8 mb-4">10. Report Removal</h2>
            <p className="text-slate-600 mb-4">
              Reports may be removed under the following circumstances:
            </p>
            <ul className="list-disc pl-6 text-slate-600 mb-4 space-y-2">
              <li>The debt has been paid in full (reporter must confirm)</li>
              <li>A satisfactory resolution has been reached</li>
              <li>The report is found to violate these guidelines</li>
              <li>The reporter requests removal</li>
              <li>A court order requires removal</li>
              <li>The report is more than 6 years old</li>
            </ul>

            <h2 className="text-2xl font-bold text-slate-900 mt-8 mb-4">11. Legal Action and Defamation</h2>
            <p className="text-slate-600 mb-4">
              Be aware that publishing false statements about a person that damage their reputation may constitute <strong>defamation</strong> under English law. If you submit a false or misleading report:
            </p>
            <ul className="list-disc pl-6 text-slate-600 mb-4 space-y-2">
              <li>The subject of the report may take legal action against you personally</li>
              <li>We may be required to disclose your identity pursuant to a court order</li>
              <li>You may be liable for damages, legal costs, and other expenses</li>
              <li>Your account will be terminated</li>
            </ul>
            <p className="text-slate-600 mb-4">
              <strong>Truth is a complete defence to defamation.</strong> If your report is accurate and you can prove it, you are protected. This is why documentary evidence is so important.
            </p>

            <h2 className="text-2xl font-bold text-slate-900 mt-8 mb-4">12. Data Protection</h2>
            <p className="text-slate-600 mb-4">
              Bad Payer Reports may contain personal data. By submitting a report, you confirm that you have a legitimate interest in processing this data to protect yourself and other tradespeople from financial loss. Reports are processed in accordance with our <Link href="/privacy" className="text-primary-600 hover:text-primary-700">Privacy Policy</Link>.
            </p>

            <h2 className="text-2xl font-bold text-slate-900 mt-8 mb-4">13. Changes to Guidelines</h2>
            <p className="text-slate-600 mb-4">
              We may update these guidelines at any time. Continued use of the Bad Payer Report system after changes constitutes acceptance of the updated guidelines.
            </p>

            <h2 className="text-2xl font-bold text-slate-900 mt-8 mb-4">14. Acceptance</h2>
            <p className="text-slate-600 mb-4">
              By submitting a Bad Payer Report, you confirm that you have read, understood, and agree to these guidelines and the <Link href="/terms" className="text-primary-600 hover:text-primary-700">Terms of Service</Link>.
            </p>

          </div>

          {/* Related Links */}
          <div className="mt-12 pt-8 border-t border-slate-200">
            <h3 className="text-lg font-semibold text-slate-900 mb-4">Related Pages</h3>
            <div className="flex flex-wrap gap-4">
              <Link href="/terms" className="text-primary-600 hover:text-primary-700 font-medium">
                Terms of Service
              </Link>
              <Link href="/privacy" className="text-primary-600 hover:text-primary-700 font-medium">
                Privacy Policy
              </Link>
              <Link href="/bad-payers" className="text-primary-600 hover:text-primary-700 font-medium">
                View Bad Payer Reports
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
