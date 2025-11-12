import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Cookie, Info, CheckCircle, Clock, Settings, FileText, Shield, Mail, Globe, Smartphone } from 'lucide-react';

const Cookies = () => {
  return (
    <div className="py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4 text-foreground">Cookie Policy</h1>
          <p className="text-xl text-muted-foreground mb-2">
            ERMITS LLC uses cookies and similar technologies when you use our Services
          </p>
          <p className="text-sm text-muted-foreground">
            <strong>Effective Date:</strong> October 31, 2025 | <strong>Last Updated:</strong> October 31, 2025
          </p>
        </div>

        <div className="space-y-8">
          {/* Introduction */}
          <Card>
            <CardContent className="p-6">
              <p className="text-muted-foreground">
                This Cookie Policy explains how ERMITS LLC ("ERMITS," "we," "our," or "us") uses cookies and similar technologies when you use our Services. This policy should be read in conjunction with our Privacy Policy.
              </p>
            </CardContent>
          </Card>

          {/* What Are Cookies */}
          <Card>
            <CardContent className="p-6">
              <h2 className="text-2xl font-semibold mb-4 flex items-center">
                <Cookie className="h-6 w-6 text-primary mr-2" />
                1. What Are Cookies?
              </h2>
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-medium mb-2">1.1 Definition</h3>
                  <p className="text-muted-foreground">
                    Cookies are small text files stored on your device (computer, tablet, smartphone) when you visit websites 
                    or use applications. Cookies enable websites to remember your actions and preferences over time.
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-medium mb-2">1.2 Similar Technologies</h3>
                  <p className="text-muted-foreground mb-2">This policy also covers similar technologies including:</p>
                  <ul className="list-disc ml-6 space-y-1 text-muted-foreground">
                    <li><strong>Local Storage:</strong> Browser-based storage (localStorage, IndexedDB)</li>
                    <li><strong>Session Storage:</strong> Temporary storage cleared when browser closes</li>
                    <li><strong>Web Beacons (Pixels):</strong> Small graphics that track page views</li>
                    <li><strong>SDKs:</strong> Software development kits for mobile applications</li>
                    <li><strong>Fingerprinting:</strong> Device and browser characteristic collection</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* How We Use Cookies */}
          <Card>
            <CardContent className="p-6">
              <h2 className="text-2xl font-semibold mb-4 flex items-center">
                <Settings className="h-6 w-6 text-primary mr-2" />
                2. How We Use Cookies
              </h2>
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-medium mb-2">2.1 Cookie Categories</h3>
                  <p className="text-muted-foreground mb-3 text-sm">
                    We use the following categories of cookies:
                  </p>
                  
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-medium mb-2 flex items-center">
                        <CheckCircle className="h-5 w-5 text-success mr-2" />
                        Essential Cookies (Always Active)
                      </h4>
                      <p className="text-muted-foreground text-sm mb-2">
                        Required for basic service functionality:
                      </p>
                      <ul className="list-disc ml-6 space-y-1 text-muted-foreground text-sm">
                        <li>Authentication and session management</li>
                        <li>Security and fraud prevention</li>
                        <li>Load balancing and performance</li>
                        <li>User preference storage (language, theme)</li>
                      </ul>
                    </div>

                    <div>
                      <h4 className="font-medium mb-2 flex items-center">
                        <Clock className="h-5 w-5 text-primary mr-2" />
                        Performance Cookies (Optional)
                      </h4>
                      <p className="text-muted-foreground text-sm mb-2">
                        Help us improve service performance:
                      </p>
                      <ul className="list-disc ml-6 space-y-1 text-muted-foreground text-sm">
                        <li>Page load time measurement</li>
                        <li>Error tracking and debugging (Sentry)</li>
                        <li>Feature usage analytics</li>
                        <li>Service optimization</li>
                      </ul>
                    </div>

                    <div>
                      <h4 className="font-medium mb-2 flex items-center">
                        <Info className="h-5 w-5 text-primary mr-2" />
                        Analytics Cookies (Optional)
                      </h4>
                      <p className="text-muted-foreground text-sm mb-2">
                        Help us understand how Services are used:
                      </p>
                      <ul className="list-disc ml-6 space-y-1 text-muted-foreground text-sm">
                        <li>User behavior patterns (PostHog with differential privacy)</li>
                        <li>Popular features and pages</li>
                        <li>User journey analysis</li>
                        <li>Conversion tracking</li>
                      </ul>
                    </div>

                    <div>
                      <h4 className="font-medium mb-2 flex items-center">
                        <Settings className="h-5 w-5 text-primary mr-2" />
                        Functional Cookies (Optional)
                      </h4>
                      <p className="text-muted-foreground text-sm mb-2">
                        Enable enhanced functionality:
                      </p>
                      <ul className="list-disc ml-6 space-y-1 text-muted-foreground text-sm">
                        <li>Remember settings and preferences</li>
                        <li>Personalize user experience</li>
                        <li>Enable integrations with third-party services</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Specific Cookies We Use */}
          <Card>
            <CardContent className="p-6">
              <h2 className="text-2xl font-semibold mb-4 flex items-center">
                <FileText className="h-6 w-6 text-primary mr-2" />
                3. Specific Cookies We Use
              </h2>
              <div className="overflow-x-auto">
                <table className="min-w-full text-sm border-collapse">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-2 pr-4 font-semibold">Cookie Name</th>
                      <th className="text-left py-2 pr-4 font-semibold">Provider</th>
                      <th className="text-left py-2 pr-4 font-semibold">Purpose</th>
                      <th className="text-left py-2 pr-4 font-semibold">Type</th>
                      <th className="text-left py-2 font-semibold">Duration</th>
                    </tr>
                  </thead>
                  <tbody className="text-muted-foreground">
                    <tr className="border-b">
                      <td className="py-2 pr-4"><strong>sb-access-token</strong></td>
                      <td className="py-2 pr-4">Supabase</td>
                      <td className="py-2 pr-4">Authentication</td>
                      <td className="py-2 pr-4">Essential</td>
                      <td className="py-2">1 hour</td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-2 pr-4"><strong>sb-refresh-token</strong></td>
                      <td className="py-2 pr-4">Supabase</td>
                      <td className="py-2 pr-4">Session renewal</td>
                      <td className="py-2 pr-4">Essential</td>
                      <td className="py-2">30 days</td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-2 pr-4"><strong>theme</strong></td>
                      <td className="py-2 pr-4">ERMITS</td>
                      <td className="py-2 pr-4">UI theme preference (light/dark)</td>
                      <td className="py-2 pr-4">Functional</td>
                      <td className="py-2">1 year</td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-2 pr-4"><strong>language</strong></td>
                      <td className="py-2 pr-4">ERMITS</td>
                      <td className="py-2 pr-4">Language preference</td>
                      <td className="py-2 pr-4">Functional</td>
                      <td className="py-2">1 year</td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-2 pr-4"><strong>consent</strong></td>
                      <td className="py-2 pr-4">ERMITS</td>
                      <td className="py-2 pr-4">Cookie consent preferences</td>
                      <td className="py-2 pr-4">Essential</td>
                      <td className="py-2">1 year</td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-2 pr-4"><strong>phc_***</strong></td>
                      <td className="py-2 pr-4">PostHog</td>
                      <td className="py-2 pr-4">Anonymous analytics</td>
                      <td className="py-2 pr-4">Analytics</td>
                      <td className="py-2">1 year</td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-2 pr-4"><strong>sentry-session</strong></td>
                      <td className="py-2 pr-4">Sentry</td>
                      <td className="py-2 pr-4">Error tracking session</td>
                      <td className="py-2 pr-4">Performance</td>
                      <td className="py-2">Session</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <p className="text-muted-foreground text-xs mt-4">
                <strong>Note:</strong> Cookie names and specifics may change. This table represents typical cookies; actual implementation may vary by product.
              </p>
            </CardContent>
          </Card>

          {/* Third-Party Cookies */}
          <Card>
            <CardContent className="p-6">
              <h2 className="text-2xl font-semibold mb-4 flex items-center">
                <FileText className="h-6 w-6 text-primary mr-2" />
                4. Third-Party Cookies
              </h2>
              
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium mb-3">4.1 Third-Party Service Providers</h3>
                  <p className="text-muted-foreground mb-3 text-sm">
                    We use third-party services that may set cookies:
                  </p>
                  
                  <div className="space-y-4">
                    <div>
                      <strong className="text-foreground">Supabase (Authentication & Database):</strong>
                      <ul className="list-disc ml-6 space-y-1 text-muted-foreground text-sm mt-2">
                        <li>Purpose: User authentication and session management</li>
                        <li>Privacy: Essential for service functionality</li>
                        <li>Control: Required for service use; cannot be disabled</li>
                        <li>More info: <a href="https://supabase.com/privacy" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">https://supabase.com/privacy</a></li>
                      </ul>
                    </div>
                    
                    <div>
                      <strong className="text-foreground">Sentry (Error Tracking):</strong>
                      <ul className="list-disc ml-6 space-y-1 text-muted-foreground text-sm mt-2">
                        <li>Purpose: Monitor application errors and performance</li>
                        <li>Privacy: Automatically scrubs PII from error reports</li>
                        <li>Control: Can be disabled in privacy settings</li>
                        <li>More info: <a href="https://sentry.io/privacy/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">https://sentry.io/privacy/</a></li>
                      </ul>
                    </div>
                    
                    <div>
                      <strong className="text-foreground">PostHog (Analytics):</strong>
                      <ul className="list-disc ml-6 space-y-1 text-muted-foreground text-sm mt-2">
                        <li>Purpose: Anonymous usage analytics with differential privacy</li>
                        <li>Privacy: Cannot identify individual users</li>
                        <li>Control: Can be disabled in privacy settings (opt-out)</li>
                        <li>More info: <a href="https://posthog.com/privacy" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">https://posthog.com/privacy</a></li>
                      </ul>
                    </div>
                    
                    <div>
                      <strong className="text-foreground">Stripe (Payment Processing):</strong>
                      <ul className="list-disc ml-6 space-y-1 text-muted-foreground text-sm mt-2">
                        <li>Purpose: Payment processing and fraud prevention</li>
                        <li>Privacy: Handles payment information securely</li>
                        <li>Control: Required for payment functionality</li>
                        <li>More info: <a href="https://stripe.com/privacy" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">https://stripe.com/privacy</a></li>
                      </ul>
                    </div>
                    
                    <div>
                      <strong className="text-foreground">Vercel (Hosting & CDN):</strong>
                      <ul className="list-disc ml-6 space-y-1 text-muted-foreground text-sm mt-2">
                        <li>Purpose: Content delivery and performance optimization</li>
                        <li>Privacy: Standard web server logs</li>
                        <li>Control: Required for service delivery</li>
                        <li>More info: <a href="https://vercel.com/legal/privacy-policy" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">https://vercel.com/legal/privacy-policy</a></li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-medium mb-2">4.2 Third-Party Privacy</h3>
                  <p className="text-muted-foreground mb-2 text-sm">
                    ERMITS is not responsible for third-party cookie practices. We encourage you to review third-party privacy policies. We contractually require third parties to:
                  </p>
                  <ul className="list-disc ml-6 space-y-1 text-muted-foreground text-sm">
                    <li>Use data only for specified purposes</li>
                    <li>Comply with applicable privacy laws</li>
                    <li>Implement appropriate security measures</li>
                    <li>Respect user privacy choices</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Cookies and Privacy-First Architecture */}
          <Card>
            <CardContent className="p-6">
              <h2 className="text-2xl font-semibold mb-4 flex items-center">
                <Shield className="h-6 w-6 text-primary mr-2" />
                5. Cookies and Privacy-First Architecture
              </h2>
              
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-medium mb-2">5.1 Minimal Cookie Use</h3>
                  <p className="text-muted-foreground mb-2">
                    Due to Privacy-First Architecture:
                  </p>
                  <ul className="space-y-2">
                    <li className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-primary mr-2 mt-0.5 flex-shrink-0" />
                      <span className="text-muted-foreground text-sm"><strong>No tracking cookies</strong> for advertising or marketing</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-primary mr-2 mt-0.5 flex-shrink-0" />
                      <span className="text-muted-foreground text-sm"><strong>No cross-site tracking</strong> or profiling</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-primary mr-2 mt-0.5 flex-shrink-0" />
                      <span className="text-muted-foreground text-sm"><strong>Minimal essential cookies</strong> only for functionality</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-primary mr-2 mt-0.5 flex-shrink-0" />
                      <span className="text-muted-foreground text-sm"><strong>Local processing</strong> reduces need for server-side cookies</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-primary mr-2 mt-0.5 flex-shrink-0" />
                      <span className="text-muted-foreground text-sm"><strong>Pseudonymized analytics</strong> cannot identify individual users</span>
                    </li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-medium mb-2">5.2 Data Minimization</h3>
                  <p className="text-muted-foreground mb-2">
                    Cookies are designed to collect minimum data necessary:
                  </p>
                  <ul className="space-y-2">
                    <li className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-primary mr-2 mt-0.5 flex-shrink-0" />
                      <span className="text-muted-foreground text-sm"><strong>No PII in cookies</strong> (names, emails, addresses not stored in cookies)</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-primary mr-2 mt-0.5 flex-shrink-0" />
                      <span className="text-muted-foreground text-sm"><strong>Session tokens only</strong> for authentication</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-primary mr-2 mt-0.5 flex-shrink-0" />
                      <span className="text-muted-foreground text-sm"><strong>Hashed identifiers</strong> for analytics (cannot be reverse-engineered)</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-primary mr-2 mt-0.5 flex-shrink-0" />
                      <span className="text-muted-foreground text-sm"><strong>No sensitive data</strong> in cookies (passwords, financial info, CUI/FCI)</span>
                    </li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Your Cookie Choices */}
          <Card>
            <CardContent className="p-6">
              <h2 className="text-2xl font-semibold mb-4 flex items-center">
                <Settings className="h-6 w-6 text-primary mr-2" />
                6. Your Cookie Choices
              </h2>
              
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium mb-3">6.1 Cookie Consent</h3>
                  <p className="text-muted-foreground mb-2 text-sm">
                    When you first visit ERMITS Services:
                  </p>
                  <ul className="space-y-2">
                    <li className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-primary mr-2 mt-0.5 flex-shrink-0" />
                      <span className="text-muted-foreground text-sm"><strong>Cookie Banner:</strong> You'll see a cookie consent banner</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-primary mr-2 mt-0.5 flex-shrink-0" />
                      <span className="text-muted-foreground text-sm"><strong>Granular Control:</strong> Choose which cookie categories to accept</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-primary mr-2 mt-0.5 flex-shrink-0" />
                      <span className="text-muted-foreground text-sm"><strong>Default Settings:</strong> Only essential cookies enabled by default</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-primary mr-2 mt-0.5 flex-shrink-0" />
                      <span className="text-muted-foreground text-sm"><strong>Change Anytime:</strong> Update preferences in Account Settings</span>
                    </li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-medium mb-3">6.2 Managing Cookie Preferences</h3>
                  
                  <div className="mb-4">
                    <strong className="text-foreground text-sm">Within ERMITS Services:</strong>
                    <ul className="list-disc ml-6 space-y-1 text-muted-foreground text-sm mt-2">
                      <li>Navigate to Account Settings → Privacy → Cookie Preferences</li>
                      <li>Toggle categories on/off (except essential cookies)</li>
                      <li>Save preferences (stored in essential consent cookie)</li>
                    </ul>
                  </div>

                  <div className="mb-4">
                    <strong className="text-foreground text-sm">Browser Controls:</strong>
                    <p className="text-muted-foreground text-sm mb-2 mt-1">Most browsers allow cookie management:</p>
                    <ul className="list-disc ml-6 space-y-1 text-muted-foreground text-sm">
                      <li><strong>Block all cookies:</strong> May prevent service functionality</li>
                      <li><strong>Block third-party cookies:</strong> Reduces tracking</li>
                      <li><strong>Delete cookies:</strong> Clear existing cookies</li>
                      <li><strong>Incognito/Private mode:</strong> Cookies deleted when browser closes</li>
                    </ul>
                  </div>

                  <div>
                    <strong className="text-foreground text-sm">Browser-Specific Instructions:</strong>
                    <ul className="list-disc ml-6 space-y-1 text-muted-foreground text-sm mt-2">
                      <li><strong>Chrome:</strong> Settings → Privacy and Security → Cookies</li>
                      <li><strong>Firefox:</strong> Settings → Privacy & Security → Cookies and Site Data</li>
                      <li><strong>Safari:</strong> Preferences → Privacy → Cookies and Website Data</li>
                      <li><strong>Edge:</strong> Settings → Privacy, Search, and Services → Cookies</li>
                    </ul>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-medium mb-2">6.3 Opt-Out Tools</h3>
                  
                  <div className="mb-4">
                    <strong className="text-foreground text-sm">Analytics Opt-Out:</strong>
                    <ul className="list-disc ml-6 space-y-1 text-muted-foreground text-sm mt-2">
                      <li>Disable analytics cookies in Account Settings</li>
                      <li>Use browser Do Not Track (DNT) signal (we honor DNT)</li>
                      <li>PostHog opt-out: <a href="https://posthog.com/opt-out" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">https://posthog.com/opt-out</a></li>
                    </ul>
                  </div>

                  <div>
                    <strong className="text-foreground text-sm">Error Tracking Opt-Out:</strong>
                    <ul className="list-disc ml-6 space-y-1 text-muted-foreground text-sm mt-2">
                      <li>Disable performance cookies in Account Settings</li>
                      <li>Sentry respects privacy settings</li>
                    </ul>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Do Not Track (DNT) */}
          <Card>
            <CardContent className="p-6">
              <h2 className="text-2xl font-semibold mb-4 flex items-center">
                <Shield className="h-6 w-6 text-primary mr-2" />
                7. Do Not Track (DNT)
              </h2>
              
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-medium mb-3">7.1 DNT Support</h3>
                  <p className="text-muted-foreground mb-2 text-sm">
                    ERMITS respects browser Do Not Track signals:
                  </p>
                  <ul className="space-y-2">
                    <li className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-primary mr-2 mt-0.5 flex-shrink-0" />
                      <span className="text-muted-foreground text-sm"><strong>DNT Enabled:</strong> We disable optional analytics and performance cookies</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-primary mr-2 mt-0.5 flex-shrink-0" />
                      <span className="text-muted-foreground text-sm"><strong>Essential Cookies Only:</strong> Authentication and security cookies remain active</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-primary mr-2 mt-0.5 flex-shrink-0" />
                      <span className="text-muted-foreground text-sm"><strong>No Tracking:</strong> No behavioral tracking when DNT is enabled</span>
                    </li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-medium mb-2">7.2 Enabling DNT</h3>
                  <p className="text-muted-foreground mb-2 text-sm">
                    To enable Do Not Track in your browser:
                  </p>
                  <ul className="list-disc ml-6 space-y-1 text-muted-foreground text-sm">
                    <li><strong>Chrome:</strong> Not supported (use cookie controls instead)</li>
                    <li><strong>Firefox:</strong> Settings → Privacy & Security → Send websites a "Do Not Track" signal</li>
                    <li><strong>Safari:</strong> Preferences → Privacy → Website Tracking → Prevent cross-site tracking</li>
                    <li><strong>Edge:</strong> Settings → Privacy, Search, and Services → Send "Do Not Track" requests</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Mobile Applications */}
          <Card>
            <CardContent className="p-6">
              <h2 className="text-2xl font-semibold mb-4 flex items-center">
                <Smartphone className="h-6 w-6 text-primary mr-2" />
                8. Mobile Applications
              </h2>
              
              <div className="space-y-4">
                <p className="text-muted-foreground mb-3 text-sm">
                  For ERMITS mobile applications (if applicable):
                </p>
                
                <div>
                  <strong className="text-foreground text-sm">Mobile SDKs:</strong>
                  <ul className="list-disc ml-6 space-y-1 text-muted-foreground text-sm mt-2">
                    <li>Similar functionality to cookies</li>
                    <li>Device identifiers may be collected</li>
                    <li>Opt-out available in app settings</li>
                  </ul>
                </div>

                <div>
                  <strong className="text-foreground text-sm">Mobile Privacy Controls:</strong>
                  <ul className="list-disc ml-6 space-y-1 text-muted-foreground text-sm mt-2">
                    <li><strong>iOS:</strong> Settings → Privacy → Tracking → Allow Apps to Request to Track (disable)</li>
                    <li><strong>Android:</strong> Settings → Privacy → Ads → Opt out of Ads Personalization</li>
                  </ul>
                </div>

                <p className="text-muted-foreground text-sm italic mt-4">
                  <strong>Note:</strong> ERMITS current products are web-based. Mobile-specific policies will be added if mobile apps are released.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Cookies and International Privacy Laws */}
          <Card>
            <CardContent className="p-6">
              <h2 className="text-2xl font-semibold mb-4 flex items-center">
                <Globe className="h-6 w-6 text-primary mr-2" />
                9. Cookies and International Privacy Laws
              </h2>
              
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium mb-3">9.1 GDPR Compliance (EU/UK/Swiss)</h3>
                  <p className="text-muted-foreground mb-3 text-sm">
                    For users in the European Economic Area, United Kingdom, or Switzerland:
                  </p>
                  <ul className="space-y-2">
                    <li className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-primary mr-2 mt-0.5 flex-shrink-0" />
                      <span className="text-muted-foreground text-sm"><strong>Consent Required:</strong> We obtain consent before setting non-essential cookies</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-primary mr-2 mt-0.5 flex-shrink-0" />
                      <span className="text-muted-foreground text-sm"><strong>Granular Control:</strong> You can accept/reject specific cookie categories</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-primary mr-2 mt-0.5 flex-shrink-0" />
                      <span className="text-muted-foreground text-sm"><strong>Easy Withdrawal:</strong> Withdraw consent anytime in Account Settings</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-primary mr-2 mt-0.5 flex-shrink-0" />
                      <span className="text-muted-foreground text-sm"><strong>Pre-Checked Boxes Prohibited:</strong> Cookie preferences start with only essential cookies enabled</span>
                    </li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-medium mb-3">9.2 CCPA Compliance (California)</h3>
                  <p className="text-muted-foreground mb-3 text-sm">
                    For California residents:
                  </p>
                  <ul className="space-y-2">
                    <li className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-primary mr-2 mt-0.5 flex-shrink-0" />
                      <span className="text-muted-foreground text-sm"><strong>No Sale of Data:</strong> We do not sell personal information collected via cookies</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-primary mr-2 mt-0.5 flex-shrink-0" />
                      <span className="text-muted-foreground text-sm"><strong>Opt-Out Rights:</strong> You can disable optional cookies anytime</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-primary mr-2 mt-0.5 flex-shrink-0" />
                      <span className="text-muted-foreground text-sm"><strong>Disclosure:</strong> This policy discloses all cookies used</span>
                    </li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-medium mb-2">9.3 Other Jurisdictions</h3>
                  <p className="text-muted-foreground mb-2 text-sm">
                    We comply with cookie laws in all jurisdictions where we operate, including:
                  </p>
                  <ul className="list-disc ml-6 space-y-1 text-muted-foreground text-sm">
                    <li>Canada's PIPEDA</li>
                    <li>Brazil's LGPD</li>
                    <li>Australia's Privacy Act</li>
                    <li>Other applicable data protection laws</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Cookies and Security */}
          <Card>
            <CardContent className="p-6">
              <h2 className="text-2xl font-semibold mb-4 flex items-center">
                <Shield className="h-6 w-6 text-primary mr-2" />
                10. Cookies and Security
              </h2>
              
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium mb-3">10.1 Secure Cookie Practices</h3>
                  <p className="text-muted-foreground mb-2 text-sm">
                    ERMITS implements secure cookie handling:
                  </p>
                  <ul className="space-y-2">
                    <li className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-primary mr-2 mt-0.5 flex-shrink-0" />
                      <span className="text-muted-foreground text-sm"><strong>Secure Flag:</strong> Cookies transmitted only over HTTPS</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-primary mr-2 mt-0.5 flex-shrink-0" />
                      <span className="text-muted-foreground text-sm"><strong>HttpOnly Flag:</strong> Cookies inaccessible to JavaScript (prevents XSS attacks)</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-primary mr-2 mt-0.5 flex-shrink-0" />
                      <span className="text-muted-foreground text-sm"><strong>SameSite Attribute:</strong> Cookies sent only to same-site requests (prevents CSRF)</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-primary mr-2 mt-0.5 flex-shrink-0" />
                      <span className="text-muted-foreground text-sm"><strong>Encrypted Values:</strong> Sensitive cookie values are encrypted</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-primary mr-2 mt-0.5 flex-shrink-0" />
                      <span className="text-muted-foreground text-sm"><strong>Short Expiration:</strong> Session cookies expire quickly</span>
                    </li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-medium mb-3">10.2 Cookie Security Risks</h3>
                  <p className="text-muted-foreground mb-2 text-sm">
                    Be aware of cookie-related security risks:
                  </p>
                  <ul className="list-disc ml-6 space-y-1 text-muted-foreground text-sm">
                    <li><strong>Session Hijacking:</strong> Attackers stealing session cookies</li>
                    <li><strong>XSS Attacks:</strong> Malicious scripts accessing cookies</li>
                    <li><strong>CSRF Attacks:</strong> Unauthorized actions using your cookies</li>
                  </ul>
                  
                  <div className="mt-4">
                    <strong className="text-foreground text-sm">Protect Yourself:</strong>
                    <ul className="list-disc ml-6 space-y-1 text-muted-foreground text-sm mt-2">
                      <li>Use strong, unique passwords</li>
                      <li>Enable multi-factor authentication</li>
                      <li>Log out when finished (especially on shared devices)</li>
                      <li>Clear cookies on shared/public computers</li>
                      <li>Keep browser and OS updated</li>
                      <li>Use antivirus and security software</li>
                    </ul>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Local Storage and IndexedDB */}
          <Card>
            <CardContent className="p-6">
              <h2 className="text-2xl font-semibold mb-4 flex items-center">
                <FileText className="h-6 w-6 text-primary mr-2" />
                11. Local Storage and IndexedDB
              </h2>
              
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium mb-3">11.1 Privacy-First Local Storage</h3>
                  <p className="text-muted-foreground mb-3 text-sm">
                    ERMITS products extensively use browser local storage (localStorage, IndexedDB) for Privacy-First Architecture:
                  </p>
                  
                  <div className="mb-4">
                    <strong className="text-foreground text-sm">Purpose:</strong>
                    <ul className="list-disc ml-6 space-y-1 text-muted-foreground text-sm mt-2">
                      <li>Store assessment data locally (never transmitted to servers)</li>
                      <li>Enable offline functionality</li>
                      <li>Reduce server data storage</li>
                      <li>Provide faster performance</li>
                    </ul>
                  </div>

                  <div>
                    <strong className="text-foreground text-sm">Privacy Benefits:</strong>
                    <ul className="space-y-2 mt-2">
                      <li className="flex items-start">
                        <CheckCircle className="h-5 w-5 text-primary mr-2 mt-0.5 flex-shrink-0" />
                        <span className="text-muted-foreground text-sm"><strong>Data stays local:</strong> Your data remains on your device</span>
                      </li>
                      <li className="flex items-start">
                        <CheckCircle className="h-5 w-5 text-primary mr-2 mt-0.5 flex-shrink-0" />
                        <span className="text-muted-foreground text-sm"><strong>No server transmission:</strong> ERMITS doesn't access local storage data</span>
                      </li>
                      <li className="flex items-start">
                        <CheckCircle className="h-5 w-5 text-primary mr-2 mt-0.5 flex-shrink-0" />
                        <span className="text-muted-foreground text-sm"><strong>User control:</strong> You can clear local storage anytime</span>
                      </li>
                      <li className="flex items-start">
                        <CheckCircle className="h-5 w-5 text-primary mr-2 mt-0.5 flex-shrink-0" />
                        <span className="text-muted-foreground text-sm"><strong>Encryption option:</strong> Sensitive data can be encrypted locally</span>
                      </li>
                    </ul>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-medium mb-3">11.2 Managing Local Storage</h3>
                  
                  <div className="mb-4">
                    <strong className="text-foreground text-sm">Clear Local Storage:</strong>
                    <ul className="list-disc ml-6 space-y-1 text-muted-foreground text-sm mt-2">
                      <li><strong>Within Services:</strong> Account Settings → Data → Clear Local Data</li>
                      <li><strong>Browser Settings:</strong> Developer Tools → Application → Storage → Clear</li>
                      <li><strong>Warning:</strong> Clearing local storage deletes locally-stored assessments and data</li>
                    </ul>
                  </div>

                  <div>
                    <strong className="text-foreground text-sm">Backup Local Data:</strong>
                    <ul className="list-disc ml-6 space-y-1 text-muted-foreground text-sm mt-2">
                      <li>Export data before clearing: Account Settings → Export Data</li>
                      <li>Download JSON/CSV backups</li>
                      <li>Store backups securely</li>
                    </ul>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Updates to This Cookie Policy */}
          <Card>
            <CardContent className="p-6">
              <h2 className="text-2xl font-semibold mb-4 flex items-center">
                <FileText className="h-6 w-6 text-primary mr-2" />
                12. Updates to This Cookie Policy
              </h2>
              
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-medium mb-2">12.1 Policy Changes</h3>
                  <p className="text-muted-foreground mb-2 text-sm">
                    We may update this Cookie Policy to reflect:
                  </p>
                  <ul className="list-disc ml-6 space-y-1 text-muted-foreground text-sm">
                    <li>New cookies or technologies</li>
                    <li>Changes in legal requirements</li>
                    <li>Service updates or new features</li>
                    <li>User feedback</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-medium mb-2">12.2 Notification</h3>
                  
                  <div className="mb-4">
                    <strong className="text-foreground text-sm">Material Changes:</strong>
                    <ul className="list-disc ml-6 space-y-1 text-muted-foreground text-sm mt-2">
                      <li>30 days' advance notice via email</li>
                      <li>Updated cookie consent banner on first visit</li>
                      <li>Opportunity to review and adjust preferences</li>
                    </ul>
                  </div>

                  <div>
                    <strong className="text-foreground text-sm">Non-Material Changes:</strong>
                    <ul className="list-disc ml-6 space-y-1 text-muted-foreground text-sm mt-2">
                      <li>Update "Last Updated" date</li>
                      <li>Effective immediately upon posting</li>
                    </ul>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Contact Information */}
          <Card>
            <CardContent className="p-6">
              <h2 className="text-2xl font-semibold mb-4 flex items-center">
                <Mail className="h-6 w-6 text-primary mr-2" />
                13. Contact Information
              </h2>
              
              <div className="space-y-3 text-muted-foreground">
                <p><strong>Cookie Policy Questions:</strong></p>
                <p>Email: <Mail className="inline h-4 w-4" /> contact@ermits.com | Subject: "Cookie Policy Inquiry"</p>
                
                <p className="mt-4"><strong>Cookie Preferences:</strong></p>
                <p>Account Settings → Privacy → Cookie Preferences</p>
                
                <p className="mt-4"><strong>Data Protection Officer (EU/UK/Swiss):</strong></p>
                <p>Email: <Mail className="inline h-4 w-4" /> contact@ermits.com | Subject: "Cookie GDPR Inquiry"</p>
                
                <p className="mt-4"><strong>Technical Support:</strong></p>
                <p>Email: <Mail className="inline h-4 w-4" /> contact@ermits.com</p>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="mt-8 text-center">
          <p className="text-sm text-muted-foreground mb-2">Last Updated: October 31, 2025</p>
          <div className="space-x-4 mt-4">
            <Link to="/privacy">
              <Button variant="outline">Privacy Policy</Button>
            </Link>
            <Link to="/terms">
              <Button variant="outline">Terms of Service</Button>
            </Link>
            <Link to="/acceptable-use">
              <Button variant="outline">Acceptable Use Policy</Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cookies;
