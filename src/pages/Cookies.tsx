import { Link } from 'react-router-dom';
import { Card, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Cookie, Info, CheckCircle, Clock, Settings, ArrowLeft, FileText, Shield, Mail } from 'lucide-react';

const Cookies = () => {
  return (
    <div className="py-20">
      <div className="max-w-4xl mx-auto px-6">
        <Link to="/" className="inline-flex items-center text-foreground hover:text-primary transition-colors mb-8">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Home
        </Link>

        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold mb-4 text-foreground">Cookie Policy</h1>
          <p className="text-xl text-muted-foreground mb-2">
            ERMITS LLC uses cookies and similar technologies when you use our Services
          </p>
          <p className="text-sm text-muted-foreground">
            <strong>Effective Date:</strong> October 31, 2025 | <strong>Last Updated:</strong> October 31, 2025
          </p>
        </div>

        <div className="space-y-8">
          {/* What Are Cookies */}
          <Card>
            <CardContent className="p-6">
              <h2 className="text-2xl font-semibold mb-4 flex items-center">
                <Cookie className="h-6 w-6 text-primary mr-2" />
                4.1 What Are Cookies?
              </h2>
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-medium mb-2">4.1.1 Definition</h3>
                  <p className="text-muted-foreground">
                    Cookies are small text files stored on your device (computer, tablet, smartphone) when you visit websites 
                    or use applications. Cookies enable websites to remember your actions and preferences over time.
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-medium mb-2">4.1.2 Similar Technologies</h3>
                  <p className="text-muted-foreground mb-2">This policy also covers similar technologies including:</p>
                  <ul className="list-disc ml-6 space-y-1 text-muted-foreground">
                    <li>Local Storage: Browser-based storage (localStorage, IndexedDB)</li>
                    <li>Session Storage: Temporary storage cleared when browser closes</li>
                    <li>Web Beacons (Pixels): Small graphics that track page views</li>
                    <li>SDKs: Software development kits for mobile applications</li>
                    <li>Fingerprinting: Device and browser characteristic collection</li>
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
                4.2 How We Use Cookies
              </h2>
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-medium mb-2">4.2.1 Cookie Categories</h3>
                  
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
                        Help us understand how Services are used (PostHog with differential privacy):
                      </p>
                      <ul className="list-disc ml-6 space-y-1 text-muted-foreground text-sm">
                        <li>User behavior patterns</li>
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
                4.3 Specific Cookies We Use
              </h2>
              <div className="overflow-x-auto">
                <table className="min-w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-2 pr-4">Cookie Name</th>
                      <th className="text-left py-2 pr-4">Provider</th>
                      <th className="text-left py-2 pr-4">Purpose</th>
                      <th className="text-left py-2 pr-4">Type</th>
                      <th className="text-left py-2">Duration</th>
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
                      <td className="py-2 pr-4"><strong>phc_*</strong></td>
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
                Note: Cookie names and specifics may change. This table represents typical cookies; actual implementation may vary by product.
              </p>
            </CardContent>
          </Card>

          {/* Cookies and Privacy-First Architecture */}
          <Card>
            <CardContent className="p-6">
              <h2 className="text-2xl font-semibold mb-4 flex items-center">
                <Shield className="h-6 w-6 text-primary mr-2" />
                4.5 Cookies and Privacy-First Architecture
              </h2>
              
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-medium mb-2">4.5.1 Minimal Cookie Use</h3>
                  <p className="text-muted-foreground mb-2">
                    Due to Privacy-First Architecture:
                  </p>
                  <ul className="space-y-2">
                    <li className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-primary mr-2 mt-0.5 flex-shrink-0" />
                      <span className="text-muted-foreground">No tracking cookies for advertising or marketing</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-primary mr-2 mt-0.5 flex-shrink-0" />
                      <span className="text-muted-foreground">No cross-site tracking or profiling</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-primary mr-2 mt-0.5 flex-shrink-0" />
                      <span className="text-muted-foreground">Minimal essential cookies only for functionality</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-primary mr-2 mt-0.5 flex-shrink-0" />
                      <span className="text-muted-foreground">Local processing reduces need for server-side cookies</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-primary mr-2 mt-0.5 flex-shrink-0" />
                      <span className="text-muted-foreground">Pseudonymized analytics cannot identify individual users</span>
                    </li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-medium mb-2">4.5.2 Data Minimization</h3>
                  <p className="text-muted-foreground mb-2">
                    Cookies are designed to collect minimum data necessary:
                  </p>
                  <ul className="space-y-2">
                    <li className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-primary mr-2 mt-0.5 flex-shrink-0" />
                      <span className="text-muted-foreground">No PII in cookies (names, emails, addresses not stored in cookies)</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-primary mr-2 mt-0.5 flex-shrink-0" />
                      <span className="text-muted-foreground">Session tokens only for authentication</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-primary mr-2 mt-0.5 flex-shrink-0" />
                      <span className="text-muted-foreground">Hashed identifiers for analytics (cannot be reverse-engineered)</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-primary mr-2 mt-0.5 flex-shrink-0" />
                      <span className="text-muted-foreground">No sensitive data in cookies (passwords, financial info, CUI/FCI)</span>
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
                4.6 Your Cookie Choices
              </h2>
              
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-medium mb-2">4.6.1 Cookie Consent</h3>
                  <p className="text-muted-foreground mb-2">
                    When you first visit ERMITS Services:
                  </p>
                  <ul className="space-y-2">
                    <li className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-primary mr-2 mt-0.5 flex-shrink-0" />
                      <span className="text-muted-foreground">You'll see a cookie consent banner</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-primary mr-2 mt-0.5 flex-shrink-0" />
                      <span className="text-muted-foreground">Choose which cookie categories to accept</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-primary mr-2 mt-0.5 flex-shrink-0" />
                      <span className="text-muted-foreground">Only essential cookies enabled by default</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-primary mr-2 mt-0.5 flex-shrink-0" />
                      <span className="text-muted-foreground">Update preferences anytime in Account Settings</span>
                    </li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-medium mb-2">4.6.2 Managing Cookie Preferences</h3>
                  <p className="text-muted-foreground mb-2">
                    Within ERMITS Services: Navigate to Account Settings → Privacy → Cookie Preferences
                  </p>
                  <p className="text-muted-foreground text-sm">
                    Most browsers also allow cookie management through browser settings (Chrome, Firefox, Safari, Edge).
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Local Storage and IndexedDB */}
          <Card>
            <CardContent className="p-6">
              <h2 className="text-2xl font-semibold mb-4 flex items-center">
                <FileText className="h-6 w-6 text-primary mr-2" />
                4.11 Local Storage and IndexedDB
              </h2>
              
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-medium mb-2">4.11.1 Privacy-First Local Storage</h3>
                  <p className="text-muted-foreground mb-2">
                    ERMITS products extensively use browser local storage (localStorage, IndexedDB) for Privacy-First Architecture:
                  </p>
                  <ul className="space-y-2">
                    <li className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-primary mr-2 mt-0.5 flex-shrink-0" />
                      <span className="text-muted-foreground"><strong>Purpose:</strong> Store assessment data locally (never transmitted to servers)</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-primary mr-2 mt-0.5 flex-shrink-0" />
                      <span className="text-muted-foreground"><strong>Privacy Benefits:</strong> Data stays local, ERMITS doesn't access local storage data</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-primary mr-2 mt-0.5 flex-shrink-0" />
                      <span className="text-muted-foreground"><strong>User Control:</strong> You can clear local storage anytime via Account Settings → Data → Clear Local Data</span>
                    </li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Contact Information */}
          <Card>
            <CardContent className="p-6">
              <h2 className="text-2xl font-semibold mb-4 flex items-center">
                <Mail className="h-6 w-6 text-primary mr-2" />
                4.13 Contact Information
              </h2>
              
              <div className="space-y-3 text-muted-foreground">
                <p><strong>Cookie Policy Questions:</strong></p>
                <p>Email: <Mail className="inline h-4 w-4" /> contact@ermits.com (Subject: "Cookie Policy Inquiry")</p>
                <p className="mt-4"><strong>Cookie Preferences:</strong></p>
                <p>Account Settings → Privacy → Cookie Preferences</p>
                <p className="mt-4"><strong>Data Protection Officer (EU/UK/Swiss):</strong></p>
                <p>Email: <Mail className="inline h-4 w-4" /> contact@ermits.com (Subject: "Cookie GDPR Inquiry")</p>
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
