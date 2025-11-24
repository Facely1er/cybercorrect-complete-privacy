import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Mail, Shield, Lock, Database, Globe, Users } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Breadcrumb } from '../components/ui/Breadcrumb';

export function PrivacyPolicyPage() {
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
            <h1 className="text-4xl font-bold mb-2">MASTER PRIVACY POLICY</h1>
            <p className="text-muted-foreground text-lg">
              <strong>Effective Date:</strong> October 31, 2025 | <strong>Last Updated:</strong> October 31, 2025
            </p>
          </div>

          <div className="bg-card rounded-lg border p-8 space-y-12 prose prose-lg max-w-none">
            {/* Introduction */}
            <section className="border-b pb-8">
              <p className="text-muted-foreground leading-relaxed text-base mb-4">
                ERMITS LLC ("ERMITS," "we," "our," or "us") is committed to protecting your privacy through a Privacy-First Architecture that ensures you maintain control over your data. This Privacy Policy explains how we collect, use, disclose, and safeguard information when you use our Services.
              </p>
              <p className="text-muted-foreground leading-relaxed text-base">
                By using our Services, you consent to the data practices described in this policy. If you do not agree with this Privacy Policy, please do not use our Services.
              </p>
            </section>

            {/* Section 1: Privacy-First Architecture Overview */}
            <section>
              <h2 className="text-2xl font-semibold mb-4 flex items-center">
                <Shield className="h-6 w-6 mr-2 text-primary" />
                1. Privacy-First Architecture Overview
              </h2>
              
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-semibold mb-3">1.1 Core Principles</h3>
                  <p className="text-muted-foreground leading-relaxed mb-4">
                    ERMITS implements Privacy-First Architecture built on five fundamental principles:
                  </p>
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-semibold mb-2">1. Client-Side Processing</h4>
                      <p className="text-muted-foreground leading-relaxed">
                        All core computational functions (security assessments, SBOM analysis, risk scoring, compliance evaluations) are performed locally within your browser or self-managed environment whenever technically feasible. Your data remains under your control throughout the analysis process.
                      </p>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2">2. Data Sovereignty Options</h4>
                      <p className="text-muted-foreground leading-relaxed mb-2">You choose where your data resides:</p>
                      <ul className="list-disc pl-6 text-muted-foreground space-y-1">
                        <li><strong>Local-Only Mode:</strong> All data stored exclusively in your browser or desktop application</li>
                        <li><strong>Self-Managed Cloud:</strong> Deploy to your own cloud infrastructure with full control</li>
                        <li><strong>ERMITS-Managed Cloud:</strong> Optional encrypted cloud synchronization with zero-knowledge architecture</li>
                        <li><strong>Hybrid Deployment:</strong> Local processing with selective encrypted cloud backup</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2">3. Zero-Knowledge Encryption</h4>
                      <p className="text-muted-foreground leading-relaxed mb-2">When using ERMITS-managed cloud features with encryption enabled:</p>
                      <ul className="list-disc pl-6 text-muted-foreground space-y-1">
                        <li>Data is encrypted client-side using AES-256-GCM before transmission</li>
                        <li>Encryption keys are derived from your credentials and never transmitted to ERMITS</li>
                        <li>ERMITS cannot decrypt, access, or view your encrypted data</li>
                        <li>You are solely responsible for maintaining access to encryption keys</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2">4. Data Minimization</h4>
                      <p className="text-muted-foreground leading-relaxed mb-2">We collect only the minimum data necessary for service functionality:</p>
                      <ul className="list-disc pl-6 text-muted-foreground space-y-1">
                        <li><strong>Never Collected:</strong> Raw SBOM files, assessment content, CUI, FCI, vulnerability findings, compliance data, or proprietary business information</li>
                        <li><strong>Pseudonymized Telemetry:</strong> Optional, anonymous performance metrics using irreversible cryptographic hashing</li>
                        <li><strong>Account Data:</strong> Only when you create an account (name, email, company for authentication and billing)</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2">5. Transparency and Control</h4>
                      <p className="text-muted-foreground leading-relaxed mb-2">You have complete control over your data:</p>
                      <ul className="list-disc pl-6 text-muted-foreground space-y-1">
                        <li>Export all data at any time in standard formats (JSON, CSV, PDF)</li>
                        <li>Delete all data permanently with one click</li>
                        <li>Opt in or opt out of telemetry collection</li>
                        <li>Choose your deployment and storage model</li>
                        <li>Review detailed data flow documentation</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-xl font-semibold mb-3">1.2 Privacy-First Implementation by Product</h3>
                  <div className="overflow-x-auto">
                    <table className="min-w-full border border-gray-300 dark:border-gray-700">
                      <thead className="bg-gray-50 dark:bg-gray-800">
                        <tr>
                          <th className="border border-gray-300 dark:border-gray-700 px-4 py-2 text-left">Product</th>
                          <th className="border border-gray-300 dark:border-gray-700 px-4 py-2 text-left">Processing Model</th>
                          <th className="border border-gray-300 dark:border-gray-700 px-4 py-2 text-left">Data Storage Options</th>
                          <th className="border border-gray-300 dark:border-gray-700 px-4 py-2 text-left">Encryption</th>
                        </tr>
                      </thead>
                      <tbody className="text-muted-foreground">
                        <tr>
                          <td className="border border-gray-300 dark:border-gray-700 px-4 py-2"><strong>TechnoSoluce SBOM Analyzer</strong></td>
                          <td className="border border-gray-300 dark:border-gray-700 px-4 py-2">100% client-side</td>
                          <td className="border border-gray-300 dark:border-gray-700 px-4 py-2">Local browser storage only</td>
                          <td className="border border-gray-300 dark:border-gray-700 px-4 py-2">Optional local encryption</td>
                        </tr>
                        <tr>
                          <td className="border border-gray-300 dark:border-gray-700 px-4 py-2"><strong>CyberCertitude Level 1 & 2</strong></td>
                          <td className="border border-gray-300 dark:border-gray-700 px-4 py-2">Client-side with optional sync</td>
                          <td className="border border-gray-300 dark:border-gray-700 px-4 py-2">Local, self-managed, or ERMITS cloud</td>
                          <td className="border border-gray-300 dark:border-gray-700 px-4 py-2">AES-256-GCM E2EE</td>
                        </tr>
                        <tr>
                          <td className="border border-gray-300 dark:border-gray-700 px-4 py-2"><strong>VendorSoluce</strong></td>
                          <td className="border border-gray-300 dark:border-gray-700 px-4 py-2">Client-side with optional sync</td>
                          <td className="border border-gray-300 dark:border-gray-700 px-4 py-2">Local, self-managed, or ERMITS cloud</td>
                          <td className="border border-gray-300 dark:border-gray-700 px-4 py-2">AES-256-GCM E2EE</td>
                        </tr>
                        <tr>
                          <td className="border border-gray-300 dark:border-gray-700 px-4 py-2"><strong>CyberCorrect Portal/Platform</strong></td>
                          <td className="border border-gray-300 dark:border-gray-700 px-4 py-2">Client-side with optional sync</td>
                          <td className="border border-gray-300 dark:border-gray-700 px-4 py-2">Local, self-managed, or ERMITS cloud</td>
                          <td className="border border-gray-300 dark:border-gray-700 px-4 py-2">AES-256-GCM E2EE</td>
                        </tr>
                        <tr>
                          <td className="border border-gray-300 dark:border-gray-700 px-4 py-2"><strong>CyberCaution Products</strong></td>
                          <td className="border border-gray-300 dark:border-gray-700 px-4 py-2">Client-side with optional sync</td>
                          <td className="border border-gray-300 dark:border-gray-700 px-4 py-2">Local, self-managed, or ERMITS cloud</td>
                          <td className="border border-gray-300 dark:border-gray-700 px-4 py-2">AES-256-GCM E2EE</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </section>

            {/* Section 2: Information We Collect */}
            <section>
              <h2 className="text-2xl font-semibold mb-4">2. Information We Collect</h2>
              
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-semibold mb-3">2.1 Information You Provide Directly</h3>
                  <div>
                    <h4 className="font-semibold mb-2">Account Information (Optional):</h4>
                    <p className="text-muted-foreground leading-relaxed mb-2">When you create an account or subscribe to paid features, we collect:</p>
                    <ul className="list-disc pl-6 text-muted-foreground space-y-1">
                      <li>Name</li>
                      <li>Email address</li>
                      <li>Company name and job title (optional)</li>
                      <li>Billing information (processed by Stripe, not stored by ERMITS)</li>
                      <li>Password (cryptographically hashed, never stored in plaintext)</li>
                    </ul>
                  </div>
                  <div className="mt-4">
                    <h4 className="font-semibold mb-2">User-Generated Content:</h4>
                    <ul className="list-disc pl-6 text-muted-foreground space-y-1">
                      <li>Support requests and communications</li>
                      <li>Feedback and survey responses</li>
                      <li>Customization preferences and settings</li>
                    </ul>
                  </div>
                </div>

                <div>
                  <h3 className="text-xl font-semibold mb-3">2.2 Information We Do NOT Collect</h3>
                  <p className="text-muted-foreground leading-relaxed mb-3">
                    ERMITS explicitly does NOT collect, access, store, or transmit:
                  </p>
                  <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                    <li><strong>SBOM Data:</strong> Software bill of materials files, component lists, dependency graphs, or package metadata</li>
                    <li><strong>Assessment Content:</strong> Security assessments, compliance evaluations, risk analyses, or audit findings</li>
                    <li><strong>Vulnerability Data:</strong> Vulnerability scan results, CVE findings, or remediation plans</li>
                    <li><strong>Compliance Data:</strong> CMMC documentation, POAMs, SSPs, evidence portfolios, or certification materials</li>
                    <li><strong>Proprietary Business Data:</strong> Trade secrets, confidential information, or business-sensitive data</li>
                    <li><strong>CUI/FCI:</strong> Controlled Unclassified Information or Federal Contract Information</li>
                    <li><strong>Personal Health Information (PHI):</strong> Protected health information under HIPAA</li>
                    <li><strong>Financial Records:</strong> Detailed financial data or payment card information (except via Stripe)</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-xl font-semibold mb-3">2.3 Automatically Collected Information</h3>
                  <div>
                    <h4 className="font-semibold mb-2">Pseudonymized Telemetry (Optional):</h4>
                    <p className="text-muted-foreground leading-relaxed mb-2">With your consent, we collect anonymous, aggregated performance data:</p>
                    <ul className="list-disc pl-6 text-muted-foreground space-y-1">
                      <li>Feature usage statistics (which tools are used, how often)</li>
                      <li>Performance metrics (page load times, API response times)</li>
                      <li>Error reports (crash logs, exceptions) with PII automatically scrubbed by Sentry</li>
                      <li>Browser and device information (browser type, OS version, screen resolution)</li>
                      <li>Session metadata (session duration, navigation paths)</li>
                    </ul>
                  </div>
                  <div className="mt-4">
                    <h4 className="font-semibold mb-2">Telemetry Characteristics:</h4>
                    <ul className="list-disc pl-6 text-muted-foreground space-y-1">
                      <li><strong>Irreversible Pseudonymization:</strong> User identifiers are cryptographically hashed and cannot be reverse-engineered</li>
                      <li><strong>No Content Data:</strong> Telemetry never includes file contents, assessment results, or user inputs</li>
                      <li><strong>Opt-Out Available:</strong> You can disable telemetry at any time in account settings</li>
                      <li><strong>Differential Privacy:</strong> PostHog analytics use differential privacy techniques to prevent individual identification</li>
                    </ul>
                  </div>
                </div>

                <div>
                  <h3 className="text-xl font-semibold mb-3">2.4 Information from Third Parties</h3>
                  <div>
                    <h4 className="font-semibold mb-2">Authentication Providers:</h4>
                    <p className="text-muted-foreground leading-relaxed mb-2">If you use OAuth (Google, Microsoft, GitHub) for authentication, we receive:</p>
                    <ul className="list-disc pl-6 text-muted-foreground space-y-1">
                      <li>Name and email address from the provider</li>
                      <li>Profile information you choose to share</li>
                      <li>Provider's unique identifier for your account</li>
                    </ul>
                  </div>
                  <div className="mt-4">
                    <h4 className="font-semibold mb-2">Payment Processor:</h4>
                    <p className="text-muted-foreground leading-relaxed mb-2">Stripe provides us with:</p>
                    <ul className="list-disc pl-6 text-muted-foreground space-y-1">
                      <li>Payment success/failure status</li>
                      <li>Subscription status and billing cycle</li>
                      <li>Last 4 digits of payment method (for your reference)</li>
                      <li>Billing address (for tax compliance)</li>
                    </ul>
                  </div>
                </div>
              </div>
            </section>

            {/* Section 3: How We Use Information */}
            <section>
              <h2 className="text-2xl font-semibold mb-4">3. How We Use Information</h2>
              
              <div className="space-y-4">
                <div>
                  <h3 className="text-xl font-semibold mb-3">3.1 Service Delivery and Operation</h3>
                  <ul className="list-disc pl-6 text-muted-foreground space-y-1">
                    <li>Provide, maintain, and improve the Services</li>
                    <li>Process transactions and send transaction confirmations</li>
                    <li>Authenticate users and maintain account security</li>
                    <li>Enable features like cloud synchronization and multi-device access</li>
                    <li>Provide customer support and respond to inquiries</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-xl font-semibold mb-3">3.2 Service Improvement and Analytics</h3>
                  <ul className="list-disc pl-6 text-muted-foreground space-y-1">
                    <li>Analyze pseudonymized usage patterns to improve features</li>
                    <li>Identify and fix bugs, errors, and performance issues</li>
                    <li>Develop new features and services</li>
                    <li>Conduct research and analysis (using only aggregated, anonymous data)</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-xl font-semibold mb-3">3.3 Communication</h3>
                  <ul className="list-disc pl-6 text-muted-foreground space-y-1">
                    <li>Send service-related announcements and updates</li>
                    <li>Respond to support requests and feedback</li>
                    <li>Send security alerts and critical notifications</li>
                    <li>Deliver marketing communications (with your consent; opt-out available)</li>
                    <li>Conduct user surveys and request feedback</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-xl font-semibold mb-3">3.4 Security and Fraud Prevention</h3>
                  <ul className="list-disc pl-6 text-muted-foreground space-y-1">
                    <li>Detect and prevent security threats and abuse</li>
                    <li>Monitor for unauthorized access or account compromise</li>
                    <li>Enforce Terms of Service and Acceptable Use Policy</li>
                    <li>Protect ERMITS, users, and third parties from harm</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-xl font-semibold mb-3">3.5 Legal and Compliance</h3>
                  <ul className="list-disc pl-6 text-muted-foreground space-y-1">
                    <li>Comply with legal obligations and respond to lawful requests</li>
                    <li>Enforce our legal rights and agreements</li>
                    <li>Protect against legal liability</li>
                    <li>Conduct audits and maintain business records</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-xl font-semibold mb-3">3.6 What We Do NOT Do</h3>
                  <p className="text-muted-foreground leading-relaxed mb-2">ERMITS does NOT:</p>
                  <ul className="list-disc pl-6 text-muted-foreground space-y-1">
                    <li>Sell or rent your personal information to third parties</li>
                    <li>Use your data for advertising or marketing to others</li>
                    <li>Share your User Data with third parties (except as disclosed in Section 2.4)</li>
                    <li>Train AI models on your User Data</li>
                    <li>Analyze your assessment results or SBOM data for any purpose</li>
                    <li>Profile users for behavioral targeting</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* Section 4: Information Sharing and Disclosure */}
            <section>
              <h2 className="text-2xl font-semibold mb-4">4. Information Sharing and Disclosure</h2>
              
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-semibold mb-3">4.1 Service Providers (Sub-Processors)</h3>
                  <p className="text-muted-foreground leading-relaxed mb-3">
                    We share limited data with trusted third-party service providers who assist in delivering the Services:
                  </p>
                  <div className="overflow-x-auto">
                    <table className="min-w-full border border-gray-300 dark:border-gray-700">
                      <thead className="bg-gray-50 dark:bg-gray-800">
                        <tr>
                          <th className="border border-gray-300 dark:border-gray-700 px-4 py-2 text-left">Service Provider</th>
                          <th className="border border-gray-300 dark:border-gray-700 px-4 py-2 text-left">Purpose</th>
                          <th className="border border-gray-300 dark:border-gray-700 px-4 py-2 text-left">Data Shared</th>
                          <th className="border border-gray-300 dark:border-gray-700 px-4 py-2 text-left">Location</th>
                        </tr>
                      </thead>
                      <tbody className="text-muted-foreground">
                        <tr>
                          <td className="border border-gray-300 dark:border-gray-700 px-4 py-2"><strong>Supabase</strong></td>
                          <td className="border border-gray-300 dark:border-gray-700 px-4 py-2">Database and authentication</td>
                          <td className="border border-gray-300 dark:border-gray-700 px-4 py-2">Email, encrypted user data (if cloud sync enabled)</td>
                          <td className="border border-gray-300 dark:border-gray-700 px-4 py-2">United States</td>
                        </tr>
                        <tr>
                          <td className="border border-gray-300 dark:border-gray-700 px-4 py-2"><strong>Stripe</strong></td>
                          <td className="border border-gray-300 dark:border-gray-700 px-4 py-2">Payment processing</td>
                          <td className="border border-gray-300 dark:border-gray-700 px-4 py-2">Email, billing information</td>
                          <td className="border border-gray-300 dark:border-gray-700 px-4 py-2">United States</td>
                        </tr>
                        <tr>
                          <td className="border border-gray-300 dark:border-gray-700 px-4 py-2"><strong>Sentry</strong></td>
                          <td className="border border-gray-300 dark:border-gray-700 px-4 py-2">Error monitoring</td>
                          <td className="border border-gray-300 dark:border-gray-700 px-4 py-2">Error logs with PII automatically scrubbed</td>
                          <td className="border border-gray-300 dark:border-gray-700 px-4 py-2">United States</td>
                        </tr>
                        <tr>
                          <td className="border border-gray-300 dark:border-gray-700 px-4 py-2"><strong>PostHog</strong></td>
                          <td className="border border-gray-300 dark:border-gray-700 px-4 py-2">Analytics</td>
                          <td className="border border-gray-300 dark:border-gray-700 px-4 py-2">Pseudonymized usage metrics with differential privacy</td>
                          <td className="border border-gray-300 dark:border-gray-700 px-4 py-2">United States / EU</td>
                        </tr>
                        <tr>
                          <td className="border border-gray-300 dark:border-gray-700 px-4 py-2"><strong>Vercel</strong></td>
                          <td className="border border-gray-300 dark:border-gray-700 px-4 py-2">Hosting and CDN</td>
                          <td className="border border-gray-300 dark:border-gray-700 px-4 py-2">IP address, HTTP headers (standard web traffic)</td>
                          <td className="border border-gray-300 dark:border-gray-700 px-4 py-2">Global CDN</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </section>

            {/* Section 5: Data Security Measures */}
            <section>
              <h2 className="text-2xl font-semibold mb-4 flex items-center">
                <Lock className="h-6 w-6 mr-2 text-primary" />
                5. Data Security Measures
              </h2>
              
              <div className="space-y-4">
                <div>
                  <h3 className="text-xl font-semibold mb-3">5.1 Encryption</h3>
                  <div className="space-y-3">
                    <div>
                      <h4 className="font-semibold mb-2">Data in Transit:</h4>
                      <ul className="list-disc pl-6 text-muted-foreground space-y-1">
                        <li>TLS 1.3 encryption for all data transmission</li>
                        <li>HTTPS required for all web traffic</li>
                        <li>Certificate pinning for critical connections</li>
                        <li>Perfect Forward Secrecy (PFS) enabled</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2">Data at Rest:</h4>
                      <ul className="list-disc pl-6 text-muted-foreground space-y-1">
                        <li>AES-256-GCM encryption for cloud-stored data</li>
                        <li>Client-side encryption with user-controlled keys (zero-knowledge architecture)</li>
                        <li>Encrypted database backups</li>
                        <li>Secure key management practices</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-xl font-semibold mb-3">5.2 Access Controls</h3>
                  <ul className="list-disc pl-6 text-muted-foreground space-y-1">
                    <li><strong>Multi-Factor Authentication (MFA):</strong> Available for all accounts, required for administrators</li>
                    <li><strong>Role-Based Access Control (RBAC):</strong> Granular permissions based on user roles</li>
                    <li><strong>Row-Level Security (RLS):</strong> Database-level isolation ensuring users can only access their own data</li>
                    <li><strong>Principle of Least Privilege:</strong> Internal access limited to minimum necessary</li>
                    <li><strong>Access Logging:</strong> All data access logged for audit and security monitoring</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* Section 6: Data Retention */}
            <section>
              <h2 className="text-2xl font-semibold mb-4 flex items-center">
                <Database className="h-6 w-6 mr-2 text-primary" />
                6. Data Retention
              </h2>
              
              <div className="space-y-4">
                <div>
                  <h3 className="text-xl font-semibold mb-3">6.1 Active Accounts</h3>
                  <p className="text-muted-foreground leading-relaxed mb-3">
                    We retain your data for as long as your account is active or as needed to provide Services:
                  </p>
                  <div className="overflow-x-auto">
                    <table className="min-w-full border border-gray-300 dark:border-gray-700">
                      <thead className="bg-gray-50 dark:bg-gray-800">
                        <tr>
                          <th className="border border-gray-300 dark:border-gray-700 px-4 py-2 text-left">Data Type</th>
                          <th className="border border-gray-300 dark:border-gray-700 px-4 py-2 text-left">Retention Period</th>
                          <th className="border border-gray-300 dark:border-gray-700 px-4 py-2 text-left">Purpose</th>
                        </tr>
                      </thead>
                      <tbody className="text-muted-foreground">
                        <tr>
                          <td className="border border-gray-300 dark:border-gray-700 px-4 py-2"><strong>Account Information</strong></td>
                          <td className="border border-gray-300 dark:border-gray-700 px-4 py-2">Duration of account + 30 days</td>
                          <td className="border border-gray-300 dark:border-gray-700 px-4 py-2">Service delivery, support</td>
                        </tr>
                        <tr>
                          <td className="border border-gray-300 dark:border-gray-700 px-4 py-2"><strong>User-Generated Content</strong></td>
                          <td className="border border-gray-300 dark:border-gray-700 px-4 py-2">User-controlled (can delete anytime)</td>
                          <td className="border border-gray-300 dark:border-gray-700 px-4 py-2">Service functionality</td>
                        </tr>
                        <tr>
                          <td className="border border-gray-300 dark:border-gray-700 px-4 py-2"><strong>Encrypted Cloud Data</strong></td>
                          <td className="border border-gray-300 dark:border-gray-700 px-4 py-2">User-controlled (can delete anytime)</td>
                          <td className="border border-gray-300 dark:border-gray-700 px-4 py-2">Cloud synchronization</td>
                        </tr>
                        <tr>
                          <td className="border border-gray-300 dark:border-gray-700 px-4 py-2"><strong>Support Communications</strong></td>
                          <td className="border border-gray-300 dark:border-gray-700 px-4 py-2">3 years</td>
                          <td className="border border-gray-300 dark:border-gray-700 px-4 py-2">Customer support, quality improvement</td>
                        </tr>
                        <tr>
                          <td className="border border-gray-300 dark:border-gray-700 px-4 py-2"><strong>Pseudonymized Telemetry</strong></td>
                          <td className="border border-gray-300 dark:border-gray-700 px-4 py-2">Indefinite (anonymous, cannot be deleted)</td>
                          <td className="border border-gray-300 dark:border-gray-700 px-4 py-2">Service improvement, analytics</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </section>

            {/* Section 7: Your Privacy Rights */}
            <section>
              <h2 className="text-2xl font-semibold mb-4 flex items-center">
                <Users className="h-6 w-6 mr-2 text-primary" />
                7. Your Privacy Rights
              </h2>
              
              <div className="space-y-4">
                <div>
                  <h3 className="text-xl font-semibold mb-3">7.1 Universal Rights</h3>
                  <p className="text-muted-foreground leading-relaxed mb-3">
                    All users have the following rights regardless of location:
                  </p>
                  <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                    <li><strong>Right to Access:</strong> Request a copy of all personal data we hold about you</li>
                    <li><strong>Right to Rectification:</strong> Correct inaccurate or incomplete personal data</li>
                    <li><strong>Right to Deletion (Right to be Forgotten):</strong> Request deletion of your personal data</li>
                    <li><strong>Right to Data Portability:</strong> Export your data in machine-readable formats (JSON, CSV)</li>
                    <li><strong>Right to Restriction of Processing:</strong> Request limitation of processing in certain circumstances</li>
                    <li><strong>Right to Object:</strong> Object to processing based on legitimate interests</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* Section 8: International Data Transfers */}
            <section>
              <h2 className="text-2xl font-semibold mb-4 flex items-center">
                <Globe className="h-6 w-6 mr-2 text-primary" />
                8. International Data Transfers
              </h2>
              
              <div className="space-y-4">
                <div>
                  <h3 className="text-xl font-semibold mb-3">8.1 Data Processing Locations</h3>
                  <p className="text-muted-foreground leading-relaxed mb-3">
                    ERMITS is based in the United States. If you access Services from outside the U.S., your data may be transferred to, stored, and processed in the United States or other countries where our service providers operate.
                  </p>
                  <div>
                    <h4 className="font-semibold mb-2">Primary Data Locations:</h4>
                    <ul className="list-disc pl-6 text-muted-foreground space-y-1">
                      <li><strong>United States:</strong> Primary data processing and storage (Supabase, Vercel, Stripe)</li>
                      <li><strong>European Union:</strong> Optional data residency for EU customers (Supabase EU region)</li>
                      <li><strong>Global CDN:</strong> Content delivery network nodes worldwide (Vercel)</li>
                    </ul>
                  </div>
                </div>
              </div>
            </section>

            {/* Section 9: Children's Privacy */}
            <section>
              <h2 className="text-2xl font-semibold mb-4">9. Children's Privacy</h2>
              
              <div className="space-y-4">
                <div>
                  <h3 className="text-xl font-semibold mb-3">9.1 Age Restrictions</h3>
                  <p className="text-muted-foreground leading-relaxed mb-3">
                    The Services are not intended for children under 18 years of age. We do not knowingly collect personal information from children under 18.
                  </p>
                </div>
              </div>
            </section>

            {/* Section 10: Federal Contractor Privacy Considerations */}
            <section>
              <h2 className="text-2xl font-semibold mb-4">10. Federal Contractor Privacy Considerations</h2>
              
              <div className="space-y-4">
                <div>
                  <h3 className="text-xl font-semibold mb-3">10.1 CUI and FCI Handling</h3>
                  <p className="text-muted-foreground leading-relaxed mb-3">
                    For users handling Controlled Unclassified Information (CUI) or Federal Contract Information (FCI):
                  </p>
                  <div>
                    <h4 className="font-semibold mb-2">Privacy-First Architecture Benefits:</h4>
                    <ul className="list-disc pl-6 text-muted-foreground space-y-1">
                      <li>CUI/FCI is processed client-side and never transmitted to ERMITS</li>
                      <li>Zero-knowledge encryption ensures ERMITS cannot access CUI/FCI</li>
                      <li>Local storage options eliminate cloud transmission of sensitive data</li>
                      <li>Users maintain complete control over CUI/FCI data</li>
                    </ul>
                  </div>
                </div>
              </div>
            </section>

            {/* Section 11: Updates to This Privacy Policy */}
            <section>
              <h2 className="text-2xl font-semibold mb-4">11. Updates to This Privacy Policy</h2>
              
              <div className="space-y-4">
                <div>
                  <h3 className="text-xl font-semibold mb-3">11.1 Policy Updates</h3>
                  <p className="text-muted-foreground leading-relaxed mb-3">
                    We may update this Privacy Policy periodically to reflect:
                  </p>
                  <ul className="list-disc pl-6 text-muted-foreground space-y-1">
                    <li>Changes in data practices or Services</li>
                    <li>Legal or regulatory developments</li>
                    <li>Technological improvements</li>
                    <li>User feedback and industry best practices</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* Section 12: Contact Information */}
            <section>
              <h2 className="text-2xl font-semibold mb-4 flex items-center">
                <Mail className="h-6 w-6 mr-2 text-primary" />
                12. Contact Information
              </h2>
              
              <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6 space-y-4">
                <div>
                  <h3 className="font-semibold mb-2">Privacy Inquiries:</h3>
                  <p className="text-muted-foreground">Email: contact@ermits.com</p>
                  <p className="text-muted-foreground">Subject: "Privacy Inquiry"</p>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Data Rights Requests:</h3>
                  <p className="text-muted-foreground">Email: contact@ermits.com</p>
                  <p className="text-muted-foreground">Subject: "Privacy Rights Request"</p>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Data Protection Officer (EU/UK/Swiss):</h3>
                  <p className="text-muted-foreground">Email: contact@ermits.com</p>
                  <p className="text-muted-foreground">Subject: "GDPR Inquiry"</p>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">California Privacy Requests:</h3>
                  <p className="text-muted-foreground">Email: contact@ermits.com</p>
                  <p className="text-muted-foreground">Subject: "CCPA Request"</p>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">General Inquiries:</h3>
                  <p className="text-muted-foreground">Email: contact@ermits.com</p>
                  <p className="text-muted-foreground">Website: www.ermits.com</p>
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