import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Shield, Lock, FileText, CheckCircle, Database, Users, Mail } from 'lucide-react';

const Privacy = () => {
  return (
    <div className="py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4 text-foreground">Master Privacy Policy</h1>
          <p className="text-xl text-muted-foreground mb-2">
            ERMITS LLC is committed to protecting your privacy through a Privacy-First Architecture
          </p>
          <p className="text-sm text-muted-foreground">
            <strong>Effective Date:</strong> October 31, 2025 | <strong>Last Updated:</strong> October 31, 2025
          </p>
        </div>

        <div className="space-y-8">
          {/* Privacy-First Architecture Overview */}
          <Card>
            <CardContent className="p-6">
              <h2 className="text-2xl font-semibold mb-4 flex items-center">
                <Shield className="h-6 w-6 text-primary mr-2" />
                1.1 Privacy-First Architecture Overview
              </h2>
              
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-medium mb-3">1.1.1 Core Principles</h3>
                  <p className="text-muted-foreground mb-4">
                    ERMITS implements Privacy-First Architecture built on five fundamental principles:
                  </p>
                  
                  <div className="space-y-3">
                    <div className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-primary mr-3 mt-0.5 flex-shrink-0" />
                      <div>
                        <strong className="text-foreground">1. Client-Side Processing</strong>
                        <p className="text-muted-foreground text-sm mt-1">
                          All core computational functions (security assessments, SBOM analysis, risk scoring, compliance evaluations) 
                          are performed locally within your browser or self-managed environment whenever technically feasible.
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-primary mr-3 mt-0.5 flex-shrink-0" />
                      <div>
                        <strong className="text-foreground">2. Data Sovereignty Options</strong>
                        <p className="text-muted-foreground text-sm mt-1">
                          You choose where your data resides: Local-Only Mode, Self-Managed Cloud, ERMITS-Managed Cloud, or Hybrid Deployment.
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-primary mr-3 mt-0.5 flex-shrink-0" />
                      <div>
                        <strong className="text-foreground">3. Zero-Knowledge Encryption</strong>
                        <p className="text-muted-foreground text-sm mt-1">
                          Data encrypted client-side using AES-256-GCM before transmission. Encryption keys derived from your credentials 
                          and never transmitted to ERMITS. ERMITS cannot decrypt, access, or view your encrypted data.
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-primary mr-3 mt-0.5 flex-shrink-0" />
                      <div>
                        <strong className="text-foreground">4. Data Minimization</strong>
                        <p className="text-muted-foreground text-sm mt-1">
                          We collect only the minimum data necessary. Never collected: Raw SBOM files, assessment content, CUI, FCI, 
                          vulnerability findings, compliance data, or proprietary business information.
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-primary mr-3 mt-0.5 flex-shrink-0" />
                      <div>
                        <strong className="text-foreground">5. Transparency and Control</strong>
                        <p className="text-muted-foreground text-sm mt-1">
                          Export all data at any time in standard formats (JSON, CSV, PDF). Delete all data permanently with one click. 
                          Opt in or opt out of telemetry collection. Choose your deployment and storage model.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Information We Collect */}
          <Card>
            <CardContent className="p-6">
              <h2 className="text-2xl font-semibold mb-4 flex items-center">
                <FileText className="h-6 w-6 text-primary mr-2" />
                1.2 Information We Collect
              </h2>
              
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-medium mb-2">1.2.1 Information You Provide Directly</h3>
                  <p className="text-muted-foreground mb-2">When you create an account or subscribe to paid features, we collect:</p>
                  <ul className="list-disc ml-6 space-y-1 text-muted-foreground">
                    <li>Name</li>
                    <li>Email address</li>
                    <li>Company name and job title (optional)</li>
                    <li>Billing information (processed by Stripe, not stored by ERMITS)</li>
                    <li>Password (cryptographically hashed, never stored in plaintext)</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-medium mb-2">1.2.2 Information We Do NOT Collect</h3>
                  <p className="text-muted-foreground mb-2 font-semibold">
                    ERMITS explicitly does NOT collect, access, store, or transmit:
                  </p>
                  <ul className="list-disc ml-6 space-y-1 text-muted-foreground">
                    <li>SBOM Data: Software bill of materials files, component lists, dependency graphs</li>
                    <li>Assessment Content: Security assessments, compliance evaluations, risk analyses</li>
                    <li>Vulnerability Data: Vulnerability scan results, CVE findings, remediation plans</li>
                    <li>Compliance Data: CMMC documentation, POAMs, SSPs, evidence portfolios</li>
                    <li>Proprietary Business Data: Trade secrets, confidential information</li>
                    <li>CUI/FCI: Controlled Unclassified Information or Federal Contract Information</li>
                    <li>PHI: Protected health information under HIPAA</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-medium mb-2">1.2.3 Automatically Collected Information</h3>
                  <p className="text-muted-foreground mb-2">
                    <strong>Pseudonymized Telemetry (Optional):</strong> With your consent, we collect anonymous, aggregated performance data:
                  </p>
                  <ul className="list-disc ml-6 space-y-1 text-muted-foreground">
                    <li>Feature usage statistics</li>
                    <li>Performance metrics (page load times, API response times)</li>
                    <li>Error reports with PII automatically scrubbed by Sentry</li>
                    <li>Browser and device information</li>
                    <li>Session metadata</li>
                  </ul>
                  <p className="text-muted-foreground text-sm mt-2">
                    Telemetry uses irreversible pseudonymization and differential privacy techniques. You can disable telemetry at any time.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* How We Use Information */}
          <Card>
            <CardContent className="p-6">
              <h2 className="text-2xl font-semibold mb-4 flex items-center">
                <Database className="h-6 w-6 text-primary mr-2" />
                1.3 How We Use Information
              </h2>
              
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-medium mb-2">1.3.1 Service Delivery and Operation</h3>
                  <ul className="space-y-2">
                    <li className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-primary mr-2 mt-0.5 flex-shrink-0" />
                      <span className="text-muted-foreground">Provide, maintain, and improve the Services</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-primary mr-2 mt-0.5 flex-shrink-0" />
                      <span className="text-muted-foreground">Process transactions and send transaction confirmations</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-primary mr-2 mt-0.5 flex-shrink-0" />
                      <span className="text-muted-foreground">Authenticate users and maintain account security</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-primary mr-2 mt-0.5 flex-shrink-0" />
                      <span className="text-muted-foreground">Enable features like cloud synchronization and multi-device access</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-primary mr-2 mt-0.5 flex-shrink-0" />
                      <span className="text-muted-foreground">Provide customer support and respond to inquiries</span>
                    </li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-medium mb-2">1.3.2 What We Do NOT Do</h3>
                  <p className="text-muted-foreground mb-2">ERMITS does NOT:</p>
                  <ul className="space-y-2">
                    <li className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-red-500 mr-2 mt-0.5 flex-shrink-0" />
                      <span className="text-muted-foreground">Sell or rent your personal information to third parties</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-red-500 mr-2 mt-0.5 flex-shrink-0" />
                      <span className="text-muted-foreground">Use your data for advertising or marketing to others</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-red-500 mr-2 mt-0.5 flex-shrink-0" />
                      <span className="text-muted-foreground">Train AI models on your User Data</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-red-500 mr-2 mt-0.5 flex-shrink-0" />
                      <span className="text-muted-foreground">Analyze your assessment results or SBOM data for any purpose</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-red-500 mr-2 mt-0.5 flex-shrink-0" />
                      <span className="text-muted-foreground">Profile users for behavioral targeting</span>
                    </li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Information Sharing */}
          <Card>
            <CardContent className="p-6">
              <h2 className="text-2xl font-semibold mb-4 flex items-center">
                <Users className="h-6 w-6 text-primary mr-2" />
                1.4 Information Sharing and Disclosure
              </h2>
              
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-medium mb-2">1.4.1 Service Providers (Sub-Processors)</h3>
                  <p className="text-muted-foreground mb-3">
                    We share limited data with trusted third-party service providers:
                  </p>
                  <div className="overflow-x-auto">
                    <table className="min-w-full text-sm">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left py-2 pr-4">Service Provider</th>
                          <th className="text-left py-2 pr-4">Purpose</th>
                          <th className="text-left py-2">Location</th>
                        </tr>
                      </thead>
                      <tbody className="text-muted-foreground">
                        <tr className="border-b">
                          <td className="py-2 pr-4"><strong>Supabase</strong></td>
                          <td className="py-2 pr-4">Database and authentication</td>
                          <td className="py-2">United States</td>
                        </tr>
                        <tr className="border-b">
                          <td className="py-2 pr-4"><strong>Stripe</strong></td>
                          <td className="py-2 pr-4">Payment processing</td>
                          <td className="py-2">United States</td>
                        </tr>
                        <tr className="border-b">
                          <td className="py-2 pr-4"><strong>Sentry</strong></td>
                          <td className="py-2 pr-4">Error monitoring</td>
                          <td className="py-2">United States</td>
                        </tr>
                        <tr className="border-b">
                          <td className="py-2 pr-4"><strong>PostHog</strong></td>
                          <td className="py-2 pr-4">Analytics (differential privacy)</td>
                          <td className="py-2">United States / EU</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Your Privacy Rights */}
          <Card>
            <CardContent className="p-6">
              <h2 className="text-2xl font-semibold mb-4 flex items-center">
                <Lock className="h-6 w-6 text-primary mr-2" />
                1.5 Your Privacy Rights
              </h2>
              
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-medium mb-2">1.5.1 Universal Rights</h3>
                  <p className="text-muted-foreground mb-3">All users have the following rights regardless of location:</p>
                  <ul className="space-y-2">
                    <li className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-primary mr-2 mt-0.5 flex-shrink-0" />
                      <div>
                        <strong className="text-foreground">Right to Access:</strong>
                        <span className="text-muted-foreground"> Request a copy of all personal data we hold about you</span>
                      </div>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-primary mr-2 mt-0.5 flex-shrink-0" />
                      <div>
                        <strong className="text-foreground">Right to Rectification:</strong>
                        <span className="text-muted-foreground"> Correct inaccurate or incomplete personal data</span>
                      </div>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-primary mr-2 mt-0.5 flex-shrink-0" />
                      <div>
                        <strong className="text-foreground">Right to Deletion:</strong>
                        <span className="text-muted-foreground"> Request deletion of your personal data (Right to be Forgotten)</span>
                      </div>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-primary mr-2 mt-0.5 flex-shrink-0" />
                      <div>
                        <strong className="text-foreground">Right to Data Portability:</strong>
                        <span className="text-muted-foreground"> Export your data in machine-readable formats (JSON, CSV)</span>
                      </div>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-primary mr-2 mt-0.5 flex-shrink-0" />
                      <div>
                        <strong className="text-foreground">Right to Object:</strong>
                        <span className="text-muted-foreground"> Object to processing and opt out of marketing communications</span>
                      </div>
                    </li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-medium mb-2">1.5.2 Additional Rights for EU/UK/Swiss Users (GDPR/UK GDPR/Swiss DPA)</h3>
                  <p className="text-muted-foreground mb-2">
                    If you are located in the European Economic Area, United Kingdom, or Switzerland, you have additional rights 
                    under GDPR, UK GDPR, and Swiss DPA.
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-medium mb-2">1.5.3 Additional Rights for California Residents (CCPA/CPRA)</h3>
                  <p className="text-muted-foreground mb-2">
                    California residents have additional rights under CCPA and CPRA, including the right to know, right to delete, 
                    and right to opt-out of sale (ERMITS does not sell personal information).
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-medium mb-2">1.5.4 Exercising Your Rights</h3>
                  <p className="text-muted-foreground">
                    Submit requests via email: <Mail className="inline h-4 w-4" /> <strong>contact@ermits.com</strong> (Subject: "Privacy Rights Request")
                  </p>
                  <p className="text-muted-foreground text-sm mt-2">
                    Response timeline: Initial response within 10 business days, complete response within 45 days.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Data Security */}
          <Card>
            <CardContent className="p-6">
              <h2 className="text-2xl font-semibold mb-4 flex items-center">
                <Shield className="h-6 w-6 text-primary mr-2" />
                1.6 Data Security Measures
              </h2>
              
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-medium mb-2">Encryption</h3>
                  <ul className="space-y-2">
                    <li className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-primary mr-2 mt-0.5 flex-shrink-0" />
                      <span className="text-muted-foreground"><strong>Data in Transit:</strong> TLS 1.3 encryption for all data transmission</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-primary mr-2 mt-0.5 flex-shrink-0" />
                      <span className="text-muted-foreground"><strong>Data at Rest:</strong> AES-256-GCM encryption with user-controlled keys</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-primary mr-2 mt-0.5 flex-shrink-0" />
                      <span className="text-muted-foreground"><strong>Data in Use:</strong> Local processing minimizes data exposure</span>
                    </li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-medium mb-2">Access Controls</h3>
                  <ul className="space-y-2">
                    <li className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-primary mr-2 mt-0.5 flex-shrink-0" />
                      <span className="text-muted-foreground">Multi-Factor Authentication (MFA) available for all accounts</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-primary mr-2 mt-0.5 flex-shrink-0" />
                      <span className="text-muted-foreground">Role-Based Access Control (RBAC) with granular permissions</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-primary mr-2 mt-0.5 flex-shrink-0" />
                      <span className="text-muted-foreground">Row-Level Security (RLS) ensuring users can only access their own data</span>
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
                1.7 Contact Information
              </h2>
              
              <div className="space-y-3 text-muted-foreground">
                <p><strong>Privacy Inquiries:</strong> <Mail className="inline h-4 w-4" /> contact@ermits.com (Subject: "Privacy Inquiry")</p>
                <p><strong>Data Rights Requests:</strong> <Mail className="inline h-4 w-4" /> contact@ermits.com (Subject: "Privacy Rights Request")</p>
                <p><strong>Data Protection Officer (EU/UK/Swiss):</strong> <Mail className="inline h-4 w-4" /> contact@ermits.com (Subject: "GDPR Inquiry")</p>
                <p><strong>California Privacy Requests:</strong> <Mail className="inline h-4 w-4" /> contact@ermits.com (Subject: "CCPA Request")</p>
                <p><strong>Security Concerns:</strong> <Mail className="inline h-4 w-4" /> contact@ermits.com (Subject: "Security Issue")</p>
                <p><strong>General Inquiries:</strong> <Mail className="inline h-4 w-4" /> contact@ermits.com | Website: www.ermits.com</p>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="mt-8 text-center">
          <p className="text-sm text-muted-foreground mb-2">Last Updated: October 31, 2025</p>
          <div className="space-x-4 mt-4">
            <Link to="/terms">
              <Button variant="outline">Terms of Service</Button>
            </Link>
            <Link to="/cookies">
              <Button variant="outline">Cookie Policy</Button>
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

export default Privacy;
