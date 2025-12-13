import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Mail, Cookie, Settings, Shield, Globe } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Breadcrumb } from '../components/ui/Breadcrumb';

export function CookiePolicyPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <Breadcrumb />
        
        <div className="max-w-5xl mx-auto">
          <div className="mb-8">
            <Link to="/" className="inline-flex items-center text-primary-600 hover:text-primary-500 mb-4">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Home
            </Link>
            <h1 className="text-4xl font-bold mb-2">COOKIE POLICY</h1>
            <p className="text-muted-foreground text-lg">
              <strong>Effective Date:</strong> October 31, 2025 | <strong>Last Updated:</strong> December 13, 2025
            </p>
          </div>

          <div className="bg-card rounded-lg border p-8 space-y-12 prose prose-lg max-w-none">
            {/* Introduction */}
            <section className="border-b pb-8">
              <p className="text-muted-foreground leading-relaxed text-base">
                This Cookie Policy explains how ERMITS LLC ("ERMITS," "we," "our," or "us") uses cookies and similar technologies when you use our Services. This policy should be read in conjunction with our Privacy Policy.
              </p>
            </section>

            {/* Section 1: What Are Cookies? */}
            <section>
              <h2 className="text-2xl font-semibold mb-4 flex items-center">
                <Cookie className="h-6 w-6 mr-2 text-primary" />
                1. What Are Cookies?
              </h2>
              
              <div className="space-y-4">
                <div>
                  <h3 className="text-xl font-semibold mb-3">1.1 Definition</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    Cookies are small text files stored on your device (computer, tablet, smartphone) when you visit websites or use applications. Cookies enable websites to remember your actions and preferences over time.
                  </p>
                </div>

                <div>
                  <h3 className="text-xl font-semibold mb-3">1.2 Similar Technologies</h3>
                  <p className="text-muted-foreground leading-relaxed mb-2">
                    This policy also covers similar technologies including:
                  </p>
                  <ul className="list-disc pl-6 text-muted-foreground space-y-1">
                    <li><strong>Local Storage:</strong> Browser-based storage (localStorage, IndexedDB)</li>
                    <li><strong>Session Storage:</strong> Temporary storage cleared when browser closes</li>
                    <li><strong>Web Beacons (Pixels):</strong> Small graphics that track page views</li>
                    <li><strong>SDKs:</strong> Software development kits for mobile applications</li>
                    <li><strong>Fingerprinting:</strong> Device and browser characteristic collection</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* Section 2: How We Use Cookies */}
            <section>
              <h2 className="text-2xl font-semibold mb-4">2. How We Use Cookies</h2>
              
              <div className="space-y-4">
                <div>
                  <h3 className="text-xl font-semibold mb-3">2.1 Cookie Categories</h3>
                  <p className="text-muted-foreground leading-relaxed mb-3">
                    We use the following categories of cookies:
                  </p>
                  <div className="space-y-3">
                    <div>
                      <h4 className="font-semibold mb-2">Essential Cookies (Always Active):</h4>
                      <p className="text-muted-foreground leading-relaxed mb-2">Required for basic service functionality:</p>
                      <ul className="list-disc pl-6 text-muted-foreground space-y-1">
                        <li>Authentication and session management</li>
                        <li>Security and fraud prevention</li>
                        <li>Load balancing and performance</li>
                        <li>User preference storage (language, theme)</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2">Performance Cookies (Optional):</h4>
                      <p className="text-muted-foreground leading-relaxed mb-2">Help us improve service performance:</p>
                      <ul className="list-disc pl-6 text-muted-foreground space-y-1">
                        <li>Page load time measurement</li>
                        <li>Error tracking and debugging (Sentry)</li>
                        <li>Feature usage analytics</li>
                        <li>Service optimization</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2">Analytics Cookies (Optional):</h4>
                      <p className="text-muted-foreground leading-relaxed mb-2">Help us understand how Services are used:</p>
                      <ul className="list-disc pl-6 text-muted-foreground space-y-1">
                        <li>User behavior patterns (PostHog with differential privacy)</li>
                        <li>Popular features and pages</li>
                        <li>User journey analysis</li>
                        <li>Conversion tracking</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2">Functional Cookies (Optional):</h4>
                      <p className="text-muted-foreground leading-relaxed mb-2">Enable enhanced functionality:</p>
                      <ul className="list-disc pl-6 text-muted-foreground space-y-1">
                        <li>Remember settings and preferences</li>
                        <li>Personalize user experience</li>
                        <li>Enable integrations with third-party services</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Section 3: Specific Cookies We Use */}
            <section>
              <h2 className="text-2xl font-semibold mb-4">3. Specific Cookies We Use</h2>
              
              <div className="overflow-x-auto">
                <table className="min-w-full border border-gray-300 dark:border-gray-700">
                  <thead className="bg-gray-50 dark:bg-gray-800">
                    <tr>
                      <th className="border border-gray-300 dark:border-gray-700 px-4 py-2 text-left">Cookie Name</th>
                      <th className="border border-gray-300 dark:border-gray-700 px-4 py-2 text-left">Provider</th>
                      <th className="border border-gray-300 dark:border-gray-700 px-4 py-2 text-left">Purpose</th>
                      <th className="border border-gray-300 dark:border-gray-700 px-4 py-2 text-left">Type</th>
                      <th className="border border-gray-300 dark:border-gray-700 px-4 py-2 text-left">Duration</th>
                    </tr>
                  </thead>
                  <tbody className="text-muted-foreground">
                    <tr>
                      <td className="border border-gray-300 dark:border-gray-700 px-4 py-2"><strong>sb-access-token</strong></td>
                      <td className="border border-gray-300 dark:border-gray-700 px-4 py-2">Supabase</td>
                      <td className="border border-gray-300 dark:border-gray-700 px-4 py-2">Authentication</td>
                      <td className="border border-gray-300 dark:border-gray-700 px-4 py-2">Essential</td>
                      <td className="border border-gray-300 dark:border-gray-700 px-4 py-2">1 hour</td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 dark:border-gray-700 px-4 py-2"><strong>sb-refresh-token</strong></td>
                      <td className="border border-gray-300 dark:border-gray-700 px-4 py-2">Supabase</td>
                      <td className="border border-gray-300 dark:border-gray-700 px-4 py-2">Session renewal</td>
                      <td className="border border-gray-300 dark:border-gray-700 px-4 py-2">Essential</td>
                      <td className="border border-gray-300 dark:border-gray-700 px-4 py-2">30 days</td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 dark:border-gray-700 px-4 py-2"><strong>theme</strong></td>
                      <td className="border border-gray-300 dark:border-gray-700 px-4 py-2">ERMITS</td>
                      <td className="border border-gray-300 dark:border-gray-700 px-4 py-2">UI theme preference (light/dark)</td>
                      <td className="border border-gray-300 dark:border-gray-700 px-4 py-2">Functional</td>
                      <td className="border border-gray-300 dark:border-gray-700 px-4 py-2">1 year</td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 dark:border-gray-700 px-4 py-2"><strong>language</strong></td>
                      <td className="border border-gray-300 dark:border-gray-700 px-4 py-2">ERMITS</td>
                      <td className="border border-gray-300 dark:border-gray-700 px-4 py-2">Language preference</td>
                      <td className="border border-gray-300 dark:border-gray-700 px-4 py-2">Functional</td>
                      <td className="border border-gray-300 dark:border-gray-700 px-4 py-2">1 year</td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 dark:border-gray-700 px-4 py-2"><strong>consent</strong></td>
                      <td className="border border-gray-300 dark:border-gray-700 px-4 py-2">ERMITS</td>
                      <td className="border border-gray-300 dark:border-gray-700 px-4 py-2">Cookie consent preferences</td>
                      <td className="border border-gray-300 dark:border-gray-700 px-4 py-2">Essential</td>
                      <td className="border border-gray-300 dark:border-gray-700 px-4 py-2">1 year</td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 dark:border-gray-700 px-4 py-2"><strong>phc_***</strong></td>
                      <td className="border border-gray-300 dark:border-gray-700 px-4 py-2">PostHog</td>
                      <td className="border border-gray-300 dark:border-gray-700 px-4 py-2">Anonymous analytics</td>
                      <td className="border border-gray-300 dark:border-gray-700 px-4 py-2">Analytics</td>
                      <td className="border border-gray-300 dark:border-gray-700 px-4 py-2">1 year</td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 dark:border-gray-700 px-4 py-2"><strong>sentry-session</strong></td>
                      <td className="border border-gray-300 dark:border-gray-700 px-4 py-2">Sentry</td>
                      <td className="border border-gray-300 dark:border-gray-700 px-4 py-2">Error tracking session</td>
                      <td className="border border-gray-300 dark:border-gray-700 px-4 py-2">Performance</td>
                      <td className="border border-gray-300 dark:border-gray-700 px-4 py-2">Session</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <p className="text-muted-foreground leading-relaxed mt-3 italic">
                <strong>Note:</strong> Cookie names and specifics may change. This table represents typical cookies; actual implementation may vary by product.
              </p>
            </section>

            {/* Section 4: Third-Party Cookies */}
            <section>
              <h2 className="text-2xl font-semibold mb-4">4. Third-Party Cookies</h2>
              
              <div className="space-y-4">
                <div>
                  <h3 className="text-xl font-semibold mb-3">4.1 Third-Party Service Providers</h3>
                  <p className="text-muted-foreground leading-relaxed mb-3">
                    We use third-party services that may set cookies:
                  </p>
                  <div className="space-y-3">
                    <div>
                      <h4 className="font-semibold mb-2">Supabase (Authentication & Database):</h4>
                      <ul className="list-disc pl-6 text-muted-foreground space-y-1">
                        <li><strong>Purpose:</strong> User authentication and session management</li>
                        <li><strong>Privacy:</strong> Essential for service functionality</li>
                        <li><strong>Control:</strong> Required for service use; cannot be disabled</li>
                        <li><strong>More info:</strong> https://supabase.com/privacy</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2">Sentry (Error Tracking):</h4>
                      <ul className="list-disc pl-6 text-muted-foreground space-y-1">
                        <li><strong>Purpose:</strong> Monitor application errors and performance</li>
                        <li><strong>Privacy:</strong> Automatically scrubs PII from error reports</li>
                        <li><strong>Control:</strong> Can be disabled in privacy settings</li>
                        <li><strong>More info:</strong> https://sentry.io/privacy/</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2">PostHog (Analytics):</h4>
                      <ul className="list-disc pl-6 text-muted-foreground space-y-1">
                        <li><strong>Purpose:</strong> Anonymous usage analytics with differential privacy</li>
                        <li><strong>Privacy:</strong> Cannot identify individual users</li>
                        <li><strong>Control:</strong> Can be disabled in privacy settings (opt-out)</li>
                        <li><strong>More info:</strong> https://posthog.com/privacy</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2">Stripe (Payment Processing):</h4>
                      <ul className="list-disc pl-6 text-muted-foreground space-y-1">
                        <li><strong>Purpose:</strong> Payment processing and fraud prevention</li>
                        <li><strong>Privacy:</strong> Handles payment information securely</li>
                        <li><strong>Control:</strong> Required for payment functionality</li>
                        <li><strong>More info:</strong> https://stripe.com/privacy</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2">Vercel (Hosting & CDN):</h4>
                      <ul className="list-disc pl-6 text-muted-foreground space-y-1">
                        <li><strong>Purpose:</strong> Content delivery and performance optimization</li>
                        <li><strong>Privacy:</strong> Standard web server logs</li>
                        <li><strong>Control:</strong> Required for service delivery</li>
                        <li><strong>More info:</strong> https://vercel.com/legal/privacy-policy</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Section 5: Cookies and Privacy-First Architecture */}
            <section>
              <h2 className="text-2xl font-semibold mb-4 flex items-center">
                <Shield className="h-6 w-6 mr-2 text-primary" />
                5. Cookies and Privacy-First Architecture
              </h2>
              
              <div className="space-y-4">
                <div>
                  <h3 className="text-xl font-semibold mb-3">5.1 Minimal Cookie Use</h3>
                  <p className="text-muted-foreground leading-relaxed mb-2">
                    Due to Privacy-First Architecture:
                  </p>
                  <ul className="list-disc pl-6 text-muted-foreground space-y-1">
                    <li><strong>No tracking cookies</strong> for advertising or marketing</li>
                    <li><strong>No cross-site tracking</strong> or profiling</li>
                    <li><strong>Minimal essential cookies</strong> only for functionality</li>
                    <li><strong>Local processing</strong> reduces need for server-side cookies</li>
                    <li><strong>Pseudonymized analytics</strong> cannot identify individual users</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-xl font-semibold mb-3">5.2 Data Minimization</h3>
                  <p className="text-muted-foreground leading-relaxed mb-2">
                    Cookies are designed to collect minimum data necessary:
                  </p>
                  <ul className="list-disc pl-6 text-muted-foreground space-y-1">
                    <li><strong>No PII in cookies</strong> (names, emails, addresses not stored in cookies)</li>
                    <li><strong>Session tokens only</strong> for authentication</li>
                    <li><strong>Hashed identifiers</strong> for analytics (cannot be reverse-engineered)</li>
                    <li><strong>No sensitive data</strong> in cookies (passwords, financial info, CUI/FCI)</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* Section 6: Your Cookie Choices */}
            <section>
              <h2 className="text-2xl font-semibold mb-4 flex items-center">
                <Settings className="h-6 w-6 mr-2 text-primary" />
                6. Your Cookie Choices
              </h2>
              
              <div className="space-y-4">
                <div>
                  <h3 className="text-xl font-semibold mb-3">6.1 Cookie Consent</h3>
                  <p className="text-muted-foreground leading-relaxed mb-2">
                    When you first visit ERMITS Services:
                  </p>
                  <ul className="list-disc pl-6 text-muted-foreground space-y-1">
                    <li><strong>Cookie Banner:</strong> You'll see a cookie consent banner</li>
                    <li><strong>Granular Control:</strong> Choose which cookie categories to accept</li>
                    <li><strong>Default Settings:</strong> Only essential cookies enabled by default</li>
                    <li><strong>Change Anytime:</strong> Update preferences in Account Settings</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-xl font-semibold mb-3">6.2 Managing Cookie Preferences</h3>
                  <div>
                    <h4 className="font-semibold mb-2">Within ERMITS Services:</h4>
                    <ul className="list-disc pl-6 text-muted-foreground space-y-1">
                      <li>Navigate to Account Settings → Privacy → Cookie Preferences</li>
                      <li>Toggle categories on/off (except essential cookies)</li>
                      <li>Save preferences (stored in essential consent cookie)</li>
                    </ul>
                  </div>
                  <div className="mt-3">
                    <h4 className="font-semibold mb-2">Browser Controls:</h4>
                    <p className="text-muted-foreground leading-relaxed mb-2">
                      Most browsers allow cookie management:
                    </p>
                    <ul className="list-disc pl-6 text-muted-foreground space-y-1">
                      <li><strong>Block all cookies:</strong> May prevent service functionality</li>
                      <li><strong>Block third-party cookies:</strong> Reduces tracking</li>
                      <li><strong>Delete cookies:</strong> Clear existing cookies</li>
                      <li><strong>Incognito/Private mode:</strong> Cookies deleted when browser closes</li>
                    </ul>
                  </div>
                </div>
              </div>
            </section>

            {/* Section 7: Do Not Track (DNT) */}
            <section>
              <h2 className="text-2xl font-semibold mb-4 flex items-center">
                <Globe className="h-6 w-6 mr-2 text-primary" />
                7. Do Not Track (DNT)
              </h2>
              
              <div className="space-y-4">
                <div>
                  <h3 className="text-xl font-semibold mb-3">7.1 DNT Support</h3>
                  <p className="text-muted-foreground leading-relaxed mb-2">
                    ERMITS respects browser Do Not Track signals:
                  </p>
                  <ul className="list-disc pl-6 text-muted-foreground space-y-1">
                    <li><strong>DNT Enabled:</strong> We disable optional analytics and performance cookies</li>
                    <li><strong>Essential Cookies Only:</strong> Authentication and security cookies remain active</li>
                    <li><strong>No Tracking:</strong> No behavioral tracking when DNT is enabled</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* Section 10: Cookies and Security */}
            <section>
              <h2 className="text-2xl font-semibold mb-4">10. Cookies and Security</h2>
              
              <div className="space-y-4">
                <div>
                  <h3 className="text-xl font-semibold mb-3">10.1 Secure Cookie Practices</h3>
                  <p className="text-muted-foreground leading-relaxed mb-2">
                    ERMITS implements secure cookie handling:
                  </p>
                  <ul className="list-disc pl-6 text-muted-foreground space-y-1">
                    <li><strong>Secure Flag:</strong> Cookies transmitted only over HTTPS</li>
                    <li><strong>HttpOnly Flag:</strong> Cookies inaccessible to JavaScript (prevents XSS attacks)</li>
                    <li><strong>SameSite Attribute:</strong> Cookies sent only to same-site requests (prevents CSRF)</li>
                    <li><strong>Encrypted Values:</strong> Sensitive cookie values are encrypted</li>
                    <li><strong>Short Expiration:</strong> Session cookies expire quickly</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* Section 11: Local Storage and IndexedDB */}
            <section>
              <h2 className="text-2xl font-semibold mb-4">11. Local Storage and IndexedDB</h2>
              
              <div className="space-y-4">
                <div>
                  <h3 className="text-xl font-semibold mb-3">11.1 Privacy-First Local Storage</h3>
                  <p className="text-muted-foreground leading-relaxed mb-2">
                    ERMITS products extensively use browser local storage (localStorage, IndexedDB) for Privacy-First Architecture:
                  </p>
                  <div>
                    <h4 className="font-semibold mb-2">Purpose:</h4>
                    <ul className="list-disc pl-6 text-muted-foreground space-y-1">
                      <li>Store assessment data locally (never transmitted to servers)</li>
                      <li>Enable offline functionality</li>
                      <li>Reduce server data storage</li>
                      <li>Provide faster performance</li>
                    </ul>
                  </div>
                  <div className="mt-3">
                    <h4 className="font-semibold mb-2">Privacy Benefits:</h4>
                    <ul className="list-disc pl-6 text-muted-foreground space-y-1">
                      <li><strong>Data stays local:</strong> Your data remains on your device</li>
                      <li><strong>No server transmission:</strong> ERMITS doesn't access local storage data</li>
                      <li><strong>User control:</strong> You can clear local storage anytime</li>
                      <li><strong>Encryption option:</strong> Sensitive data can be encrypted locally</li>
                    </ul>
                  </div>
                </div>
              </div>
            </section>

            {/* Section 12: Updates to This Cookie Policy */}
            <section>
              <h2 className="text-2xl font-semibold mb-4">12. Updates to This Cookie Policy</h2>
              
              <div className="space-y-4">
                <div>
                  <h3 className="text-xl font-semibold mb-3">12.1 Policy Changes</h3>
                  <p className="text-muted-foreground leading-relaxed mb-2">
                    We may update this Cookie Policy to reflect:
                  </p>
                  <ul className="list-disc pl-6 text-muted-foreground space-y-1">
                    <li>New cookies or technologies</li>
                    <li>Changes in legal requirements</li>
                    <li>Service updates or new features</li>
                    <li>User feedback</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* Section 13: Contact Information */}
            <section>
              <h2 className="text-2xl font-semibold mb-4 flex items-center">
                <Mail className="h-6 w-6 mr-2 text-primary" />
                13. Contact Information
              </h2>
              
              <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6 space-y-4">
                <div>
                  <h3 className="font-semibold mb-2">Cookie Policy Questions:</h3>
                  <p className="text-muted-foreground">Email: contact@ermits.com</p>
                  <p className="text-muted-foreground">Subject: "Cookie Policy Inquiry"</p>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Cookie Preferences:</h3>
                  <p className="text-muted-foreground">Account Settings → Privacy → Cookie Preferences</p>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Data Protection Officer (EU/UK/Swiss):</h3>
                  <p className="text-muted-foreground">Email: contact@ermits.com</p>
                  <p className="text-muted-foreground">Subject: "Cookie GDPR Inquiry"</p>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Technical Support:</h3>
                  <p className="text-muted-foreground">Email: contact@ermits.com</p>
                </div>
              </div>
            </section>
          </div>

          <div className="mt-8 text-center">
            <Link to="/">
              <Button className="bg-white text-gray-900 hover:bg-gray-50 border border-gray-200 shadow-sm">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Return to Home
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
