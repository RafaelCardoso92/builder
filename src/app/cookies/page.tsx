import Link from 'next/link';

export const metadata = {
  title: 'Cookie Policy | Builder',
  description: 'Cookie Policy for the Builder platform',
};

export default function CookiesPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <section className="bg-gradient-to-br from-primary-600 to-primary-800 text-white py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Cookie Policy</h1>
          <p className="text-primary-100">Last updated: February 2026</p>
        </div>
      </section>

      {/* Content */}
      <section className="py-12 md:py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="prose prose-slate max-w-none">

            <h2 className="text-2xl font-bold text-slate-900 mt-8 mb-4">1. What Are Cookies?</h2>
            <p className="text-slate-600 mb-4">
              Cookies are small text files that are stored on your device (computer, tablet, or mobile) when you visit websites. They are widely used to make websites work more efficiently and to provide information to website owners.
            </p>
            <p className="text-slate-600 mb-4">
              This Cookie Policy explains how Builder UK Ltd (&quot;we&quot;, &quot;our&quot;, &quot;us&quot;) uses cookies and similar technologies on our website and services (the &quot;Platform&quot;).
            </p>

            <h2 className="text-2xl font-bold text-slate-900 mt-8 mb-4">2. Types of Cookies We Use</h2>

            <h3 className="text-xl font-semibold text-slate-800 mt-6 mb-3">2.1 Essential Cookies</h3>
            <p className="text-slate-600 mb-4">
              These cookies are necessary for the Platform to function and cannot be switched off. They are usually set in response to actions you take, such as logging in or filling out forms.
            </p>
            <div className="overflow-x-auto mb-6">
              <table className="min-w-full border border-slate-200 rounded-lg">
                <thead className="bg-slate-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-slate-900">Cookie</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-slate-900">Purpose</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-slate-900">Duration</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  <tr>
                    <td className="px-4 py-3 text-sm text-slate-600">next-auth.session-token</td>
                    <td className="px-4 py-3 text-sm text-slate-600">Maintains your logged-in session</td>
                    <td className="px-4 py-3 text-sm text-slate-600">Session</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 text-sm text-slate-600">next-auth.csrf-token</td>
                    <td className="px-4 py-3 text-sm text-slate-600">Protects against cross-site request forgery</td>
                    <td className="px-4 py-3 text-sm text-slate-600">Session</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 text-sm text-slate-600">next-auth.callback-url</td>
                    <td className="px-4 py-3 text-sm text-slate-600">Stores redirect URL after authentication</td>
                    <td className="px-4 py-3 text-sm text-slate-600">Session</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <h3 className="text-xl font-semibold text-slate-800 mt-6 mb-3">2.2 Functional Cookies</h3>
            <p className="text-slate-600 mb-4">
              These cookies enable enhanced functionality and personalization, such as remembering your preferences and settings.
            </p>
            <div className="overflow-x-auto mb-6">
              <table className="min-w-full border border-slate-200 rounded-lg">
                <thead className="bg-slate-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-slate-900">Cookie</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-slate-900">Purpose</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-slate-900">Duration</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  <tr>
                    <td className="px-4 py-3 text-sm text-slate-600">user_preferences</td>
                    <td className="px-4 py-3 text-sm text-slate-600">Stores your display and search preferences</td>
                    <td className="px-4 py-3 text-sm text-slate-600">1 year</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 text-sm text-slate-600">recent_searches</td>
                    <td className="px-4 py-3 text-sm text-slate-600">Remembers your recent search queries</td>
                    <td className="px-4 py-3 text-sm text-slate-600">30 days</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 text-sm text-slate-600">location_pref</td>
                    <td className="px-4 py-3 text-sm text-slate-600">Stores your preferred location/postcode</td>
                    <td className="px-4 py-3 text-sm text-slate-600">1 year</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <h3 className="text-xl font-semibold text-slate-800 mt-6 mb-3">2.3 Analytics Cookies</h3>
            <p className="text-slate-600 mb-4">
              These cookies help us understand how visitors interact with our Platform by collecting and reporting information anonymously.
            </p>
            <div className="overflow-x-auto mb-6">
              <table className="min-w-full border border-slate-200 rounded-lg">
                <thead className="bg-slate-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-slate-900">Cookie</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-slate-900">Purpose</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-slate-900">Duration</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  <tr>
                    <td className="px-4 py-3 text-sm text-slate-600">_ga</td>
                    <td className="px-4 py-3 text-sm text-slate-600">Google Analytics - distinguishes users</td>
                    <td className="px-4 py-3 text-sm text-slate-600">2 years</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 text-sm text-slate-600">_ga_*</td>
                    <td className="px-4 py-3 text-sm text-slate-600">Google Analytics - maintains session state</td>
                    <td className="px-4 py-3 text-sm text-slate-600">2 years</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 text-sm text-slate-600">_gid</td>
                    <td className="px-4 py-3 text-sm text-slate-600">Google Analytics - distinguishes users</td>
                    <td className="px-4 py-3 text-sm text-slate-600">24 hours</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <h3 className="text-xl font-semibold text-slate-800 mt-6 mb-3">2.4 Marketing Cookies</h3>
            <p className="text-slate-600 mb-4">
              These cookies may be set by our advertising partners to build a profile of your interests and show you relevant ads on other sites.
            </p>
            <div className="overflow-x-auto mb-6">
              <table className="min-w-full border border-slate-200 rounded-lg">
                <thead className="bg-slate-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-slate-900">Cookie</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-slate-900">Purpose</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-slate-900">Duration</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  <tr>
                    <td className="px-4 py-3 text-sm text-slate-600">_fbp</td>
                    <td className="px-4 py-3 text-sm text-slate-600">Facebook - tracks visits across websites</td>
                    <td className="px-4 py-3 text-sm text-slate-600">3 months</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 text-sm text-slate-600">_gcl_au</td>
                    <td className="px-4 py-3 text-sm text-slate-600">Google Ads - conversion tracking</td>
                    <td className="px-4 py-3 text-sm text-slate-600">3 months</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <h2 className="text-2xl font-bold text-slate-900 mt-8 mb-4">3. Third-Party Cookies</h2>
            <p className="text-slate-600 mb-4">
              Some cookies are placed by third-party services that appear on our pages. We use the following third-party services:
            </p>
            <ul className="list-disc pl-6 text-slate-600 mb-4 space-y-2">
              <li><strong>Stripe:</strong> For secure payment processing</li>
              <li><strong>Google Analytics:</strong> For website analytics</li>
              <li><strong>Google Maps:</strong> For displaying tradesperson locations</li>
            </ul>
            <p className="text-slate-600 mb-4">
              These third parties may use cookies in accordance with their own privacy policies. We encourage you to review their policies.
            </p>

            <h2 className="text-2xl font-bold text-slate-900 mt-8 mb-4">4. Managing Cookies</h2>
            <h3 className="text-xl font-semibold text-slate-800 mt-6 mb-3">4.1 Cookie Consent</h3>
            <p className="text-slate-600 mb-4">
              When you first visit our Platform, you will be shown a cookie banner allowing you to accept or manage your cookie preferences. You can change your preferences at any time.
            </p>

            <h3 className="text-xl font-semibold text-slate-800 mt-6 mb-3">4.2 Browser Settings</h3>
            <p className="text-slate-600 mb-4">
              Most web browsers allow you to control cookies through their settings. You can:
            </p>
            <ul className="list-disc pl-6 text-slate-600 mb-4 space-y-2">
              <li>View cookies stored on your device</li>
              <li>Delete all or specific cookies</li>
              <li>Block all cookies or cookies from specific websites</li>
              <li>Set preferences for different types of cookies</li>
            </ul>
            <p className="text-slate-600 mb-4">
              To manage cookies in popular browsers:
            </p>
            <ul className="list-disc pl-6 text-slate-600 mb-4 space-y-2">
              <li><strong>Chrome:</strong> Settings → Privacy and security → Cookies</li>
              <li><strong>Firefox:</strong> Settings → Privacy & Security → Cookies</li>
              <li><strong>Safari:</strong> Preferences → Privacy → Cookies</li>
              <li><strong>Edge:</strong> Settings → Privacy → Cookies</li>
            </ul>

            <h3 className="text-xl font-semibold text-slate-800 mt-6 mb-3">4.3 Impact of Disabling Cookies</h3>
            <p className="text-slate-600 mb-4">
              Please note that disabling certain cookies may affect the functionality of our Platform:
            </p>
            <ul className="list-disc pl-6 text-slate-600 mb-4 space-y-2">
              <li><strong>Essential cookies:</strong> Disabling these will prevent you from logging in and using core features</li>
              <li><strong>Functional cookies:</strong> Your preferences won&apos;t be remembered</li>
              <li><strong>Analytics cookies:</strong> We won&apos;t be able to improve the Platform based on usage data</li>
              <li><strong>Marketing cookies:</strong> You may still see ads, but they won&apos;t be personalized</li>
            </ul>

            <h2 className="text-2xl font-bold text-slate-900 mt-8 mb-4">5. Similar Technologies</h2>
            <p className="text-slate-600 mb-4">
              In addition to cookies, we may use similar technologies:
            </p>
            <ul className="list-disc pl-6 text-slate-600 mb-4 space-y-2">
              <li><strong>Local Storage:</strong> Similar to cookies but with larger storage capacity, used to store preferences</li>
              <li><strong>Session Storage:</strong> Stores data for the duration of your browser session</li>
              <li><strong>Pixels/Web Beacons:</strong> Small images used to track email opens and website visits</li>
            </ul>

            <h2 className="text-2xl font-bold text-slate-900 mt-8 mb-4">6. Updates to This Policy</h2>
            <p className="text-slate-600 mb-4">
              We may update this Cookie Policy from time to time to reflect changes in our practices or for operational, legal, or regulatory reasons. The &quot;Last updated&quot; date at the top indicates when the policy was last revised.
            </p>

            <h2 className="text-2xl font-bold text-slate-900 mt-8 mb-4">7. Contact Us</h2>
            <p className="text-slate-600 mb-4">
              If you have questions about our use of cookies, please contact us:
            </p>
            <div className="bg-slate-50 rounded-lg p-6 mb-4">
              <p className="text-slate-600">
                <strong>Builder UK Ltd</strong><br />
                Email: privacy@builder.co.uk<br />
                Address: [Registered Address]
              </p>
            </div>

          </div>

          {/* Related Links */}
          <div className="mt-12 pt-8 border-t border-slate-200">
            <h3 className="text-lg font-semibold text-slate-900 mb-4">Related Policies</h3>
            <div className="flex flex-wrap gap-4">
              <Link href="/terms" className="text-primary-600 hover:text-primary-700 font-medium">
                Terms of Service
              </Link>
              <Link href="/privacy" className="text-primary-600 hover:text-primary-700 font-medium">
                Privacy Policy
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
