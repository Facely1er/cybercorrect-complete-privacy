import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Shield, Lock, FileText, CheckCircle, Database, Users, Mail, AlertTriangle, Globe, UserCheck } from 'lucide-react';

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
          {/* Introduction */}
          <Card>
            <CardContent className="p-6">
              <p className="text-muted-foreground mb-4">
                ERMITS LLC ("ERMITS," "we," "our," or "us") is committed to protecting your privacy through a Privacy-First Architecture that ensures you maintain control over your data. This Privacy Policy explains how we collect, use, disclose, and safeguard information when you use our Services.
              </p>
              <p className="text-muted-foreground">
                By using our Services, you consent to the data practices described in this policy. If you do not agree with this Privacy Policy, please do not use our Services.
              </p>
            </CardContent>
          </Card>

          {/* Privacy-First Architecture Overview */}
          <Card>
            <CardContent className="p-6">
              <h2 className="text-2xl font-semibold mb-4 flex items-center">
                <Shield className="h-6 w-6 text-primary mr-2" />
                1. Privacy-First Architecture Overview
              </h2>
              
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium mb-3">1.1 Core Principles</h3>
                  <p className="text-muted-foreground mb-4">
                    ERMITS implements Privacy-First Architecture built on five fundamental principles:
                  </p>
                  
                  <div className="space-y-4">
                    <div className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-primary mr-3 mt-0.5 flex-shrink-0" />
                      <div>
                        <strong className="text-foreground">1. Client-Side Processing</strong>
                        <p className="text-muted-foreground text-sm mt-1">
                          All core computational functions (security assessments, SBOM analysis, risk scoring, compliance evaluations) are performed locally within your browser or self-managed environment whenever technically feasible. Your data remains under your control throughout the analysis process.
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-primary mr-3 mt-0.5 flex-shrink-0" />
                      <div>
                        <strong className="text-foreground">2. Data Sovereignty Options</strong>
                        <p className="text-muted-foreground text-sm mt-1 mb-2">You choose where your data resides:</p>
                        <ul className="list-disc ml-6 space-y-1 text-muted-foreground text-sm">
                          <li><strong>Local-Only Mode:</strong> All data stored exclusively in your browser or desktop application</li>
                          <li><strong>Self-Managed Cloud:</strong> Deploy to your own cloud infrastructure with full control</li>
                          <li><strong>ERMITS-Managed Cloud:</strong> Optional encrypted cloud synchronization with zero-knowledge architecture</li>
                          <li><strong>Hybrid Deployment:</strong> Local processing with selective encrypted cloud backup</li>
                        </ul>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-primary mr-3 mt-0.5 flex-shrink-0" />
                      <div>
                        <strong className="text-foreground">3. Zero-Knowledge Encryption</strong>
                        <p className="text-muted-foreground text-sm mt-1 mb-2">When using ERMITS-managed cloud features with encryption enabled:</p>
                        <ul className="list-disc ml-6 space-y-1 text-muted-foreground text-sm">
                          <li>Data is encrypted client-side using AES-256-GCM before transmission</li>
                          <li>Encryption keys are derived from your credentials and never transmitted to ERMITS</li>
                          <li>ERMITS cannot decrypt, access, or view your encrypted data</li>
                          <li>You are solely responsible for maintaining access to encryption keys</li>
                        </ul>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-primary mr-3 mt-0.5 flex-shrink-0" />
                      <div>
                        <strong className="text-foreground">4. Data Minimization</strong>
                        <p className="text-muted-foreground text-sm mt-1 mb-2">We collect only the minimum data necessary for service functionality:</p>
                        <ul className="list-disc ml-6 space-y-1 text-muted-foreground text-sm">
                          <li><strong>Never Collected:</strong> Raw SBOM files, assessment content, CUI, FCI, vulnerability findings, compliance data, or proprietary business information</li>
                          <li><strong>Pseudonymized Telemetry:</strong> Optional, anonymous performance metrics using irreversible cryptographic hashing</li>
                          <li><strong>Account Data:</strong> Only when you create an account (name, email, company for authentication and billing)</li>
                        </ul>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-primary mr-3 mt-0.5 flex-shrink-0" />
                      <div>
                        <strong className="text-foreground">5. Transparency and Control</strong>
                        <p className="text-muted-foreground text-sm mt-1 mb-2">You have complete control over your data:</p>
                        <ul className="list-disc ml-6 space-y-1 text-muted-foreground text-sm">
                          <li>Export all data at any time in standard formats (JSON, CSV, PDF)</li>
                          <li>Delete all data permanently with one click</li>
                          <li>Opt in or opt out of telemetry collection</li>
                          <li>Choose your deployment and storage model</li>
                          <li>Review detailed data flow documentation</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-medium mb-3">1.2 Privacy-First Implementation by Product</h3>
                  <p className="text-muted-foreground mb-3">Each ERMITS product implements Privacy-First Architecture as follows:</p>
                  <div className="overflow-x-auto">
                    <table className="min-w-full text-sm border-collapse">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left py-2 pr-4 font-semibold">Product</th>
                          <th className="text-left py-2 pr-4 font-semibold">Processing Model</th>
                          <th className="text-left py-2 pr-4 font-semibold">Data Storage Options</th>
                          <th className="text-left py-2 font-semibold">Encryption</th>
                        </tr>
                      </thead>
                      <tbody className="text-muted-foreground">
                        <tr className="border-b">
                          <td className="py-2 pr-4"><strong>TechnoSoluce SBOM Analyzer</strong></td>
                          <td className="py-2 pr-4">100% client-side</td>
                          <td className="py-2 pr-4">Local browser storage only</td>
                          <td className="py-2">Optional local encryption</td>
                        </tr>
                        <tr className="border-b">
                          <td className="py-2 pr-4"><strong>CyberCertitude Level 1 & 2</strong></td>
                          <td className="py-2 pr-4">Client-side with optional sync</td>
                          <td className="py-2 pr-4">Local, self-managed, or ERMITS cloud</td>
                          <td className="py-2">AES-256-GCM E2EE</td>
                        </tr>
                        <tr className="border-b">
                          <td className="py-2 pr-4"><strong>VendorSoluce</strong></td>
                          <td className="py-2 pr-4">Client-side with optional sync</td>
                          <td className="py-2 pr-4">Local, self-managed, or ERMITS cloud</td>
                          <td className="py-2">AES-256-GCM E2EE</td>
                        </tr>
                        <tr className="border-b">
                          <td className="py-2 pr-4"><strong>CyberCorrect Portal/Platform</strong></td>
                          <td className="py-2 pr-4">Client-side with optional sync</td>
                          <td className="py-2 pr-4">Local, self-managed, or ERMITS cloud</td>
                          <td className="py-2">AES-256-GCM E2EE</td>
                        </tr>
                        <tr className="border-b">
                          <td className="py-2 pr-4"><strong>CyberCaution Products</strong></td>
                          <td className="py-2 pr-4">Client-side with optional sync</td>
                          <td className="py-2 pr-4">Local, self-managed, or ERMITS cloud</td>
                          <td className="py-2">AES-256-GCM E2EE</td>
                        </tr>
                      </tbody>
                    </table>
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
                2. Information We Collect
              </h2>
              
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium mb-3">2.1 Information You Provide Directly</h3>
                  
                  <div className="mb-4">
                    <strong className="text-foreground">Account Information (Optional):</strong>
                    <p className="text-muted-foreground text-sm mb-2 mt-1">When you create an account or subscribe to paid features, we collect:</p>
                    <ul className="list-disc ml-6 space-y-1 text-muted-foreground text-sm">
                      <li>Name</li>
                      <li>Email address</li>
                      <li>Company name and job title (optional)</li>
                      <li>Billing information (processed by Stripe, not stored by ERMITS)</li>
                      <li>Password (cryptographically hashed, never stored in plaintext)</li>
                    </ul>
                  </div>

                  <div>
                    <strong className="text-foreground">User-Generated Content:</strong>
                    <ul className="list-disc ml-6 space-y-1 text-muted-foreground text-sm mt-2">
                      <li>Support requests and communications</li>
                      <li>Feedback and survey responses</li>
                      <li>Customization preferences and settings</li>
                    </ul>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-medium mb-3">2.2 Information We Do NOT Collect</h3>
                  <p className="text-muted-foreground mb-3 font-semibold">
                    ERMITS explicitly does NOT collect, access, store, or transmit:
                  </p>
                  <ul className="list-disc ml-6 space-y-2 text-muted-foreground text-sm">
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
                  <h3 className="text-lg font-medium mb-3">2.3 Automatically Collected Information</h3>
                  
                  <div className="mb-4">
                    <strong className="text-foreground">Pseudonymized Telemetry (Optional):</strong>
                    <p className="text-muted-foreground text-sm mb-2 mt-1">
                      With your consent, we collect anonymous, aggregated performance data:
                    </p>
                    <ul className="list-disc ml-6 space-y-1 text-muted-foreground text-sm">
                      <li>Feature usage statistics (which tools are used, how often)</li>
                      <li>Performance metrics (page load times, API response times)</li>
                      <li>Error reports (crash logs, exceptions) with PII automatically scrubbed by Sentry</li>
                      <li>Browser and device information (browser type, OS version, screen resolution)</li>
                      <li>Session metadata (session duration, navigation paths)</li>
                    </ul>
                  </div>

                  <div className="mb-4">
                    <strong className="text-foreground">Telemetry Characteristics:</strong>
                    <ul className="list-disc ml-6 space-y-1 text-muted-foreground text-sm mt-2">
                      <li><strong>Irreversible Pseudonymization:</strong> User identifiers are cryptographically hashed and cannot be reverse-engineered</li>
                      <li><strong>No Content Data:</strong> Telemetry never includes file contents, assessment results, or user inputs</li>
                      <li><strong>Opt-Out Available:</strong> You can disable telemetry at any time in account settings</li>
                      <li><strong>Differential Privacy:</strong> PostHog analytics use differential privacy techniques to prevent individual identification</li>
                    </ul>
                  </div>

                  <div>
                    <strong className="text-foreground">Technical Data:</strong>
                    <ul className="list-disc ml-6 space-y-1 text-muted-foreground text-sm mt-2">
                      <li>IP address (used for security, rate limiting, and geolocation for service delivery; not linked to user accounts)</li>
                      <li>Log data (server logs for security monitoring and debugging; retained for 90 days)</li>
                      <li>Cookies and similar technologies (see Cookie Policy)</li>
                    </ul>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-medium mb-3">2.4 Information from Third Parties</h3>
                  
                  <div className="mb-4">
                    <strong className="text-foreground">Authentication Providers:</strong>
                    <p className="text-muted-foreground text-sm mb-2 mt-1">If you use OAuth (Google, Microsoft, GitHub) for authentication, we receive:</p>
                    <ul className="list-disc ml-6 space-y-1 text-muted-foreground text-sm">
                      <li>Name and email address from the provider</li>
                      <li>Profile information you choose to share</li>
                      <li>Provider's unique identifier for your account</li>
                    </ul>
                  </div>

                  <div className="mb-4">
                    <strong className="text-foreground">Payment Processor:</strong>
                    <p className="text-muted-foreground text-sm mb-2 mt-1">Stripe provides us with:</p>
                    <ul className="list-disc ml-6 space-y-1 text-muted-foreground text-sm">
                      <li>Payment success/failure status</li>
                      <li>Subscription status and billing cycle</li>
                      <li>Last 4 digits of payment method (for your reference)</li>
                      <li>Billing address (for tax compliance)</li>
                    </ul>
                  </div>

                  <div>
                    <strong className="text-foreground">Vulnerability Databases:</strong>
                    <p className="text-muted-foreground text-sm mb-2 mt-1">
                      When you use SBOM analysis or security assessment tools, your browser makes anonymous, client-side queries to:
                    </p>
                    <ul className="list-disc ml-6 space-y-1 text-muted-foreground text-sm">
                      <li>OSV.dev (Google Open Source Vulnerabilities)</li>
                      <li>NIST National Vulnerability Database</li>
                      <li>CISA Known Exploited Vulnerabilities catalog</li>
                    </ul>
                    <p className="text-muted-foreground text-sm mt-2">
                      These queries are performed client-side and do not transit ERMITS servers. We do not track or log your queries to these services.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* How We Use Information */}
          <Card>
            <CardContent className="p-6">
              <h2 className="text-2xl font-semibold mb-4 flex items-center">
                <Database className="h-6 w-6 text-primary mr-2" />
                3. How We Use Information
              </h2>
              
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-medium mb-2">3.1 Service Delivery and Operation</h3>
                  <ul className="space-y-2 text-muted-foreground text-sm">
                    <li className="flex items-start">
                      <CheckCircle className="h-4 w-4 text-primary mr-2 mt-0.5 flex-shrink-0" />
                      <span>Provide, maintain, and improve the Services</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="h-4 w-4 text-primary mr-2 mt-0.5 flex-shrink-0" />
                      <span>Process transactions and send transaction confirmations</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="h-4 w-4 text-primary mr-2 mt-0.5 flex-shrink-0" />
                      <span>Authenticate users and maintain account security</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="h-4 w-4 text-primary mr-2 mt-0.5 flex-shrink-0" />
                      <span>Enable features like cloud synchronization and multi-device access</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="h-4 w-4 text-primary mr-2 mt-0.5 flex-shrink-0" />
                      <span>Provide customer support and respond to inquiries</span>
                    </li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-medium mb-2">3.2 Service Improvement and Analytics</h3>
                  <ul className="space-y-2 text-muted-foreground text-sm">
                    <li className="flex items-start">
                      <CheckCircle className="h-4 w-4 text-primary mr-2 mt-0.5 flex-shrink-0" />
                      <span>Analyze pseudonymized usage patterns to improve features</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="h-4 w-4 text-primary mr-2 mt-0.5 flex-shrink-0" />
                      <span>Identify and fix bugs, errors, and performance issues</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="h-4 w-4 text-primary mr-2 mt-0.5 flex-shrink-0" />
                      <span>Develop new features and services</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="h-4 w-4 text-primary mr-2 mt-0.5 flex-shrink-0" />
                      <span>Conduct research and analysis (using only aggregated, anonymous data)</span>
                    </li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-medium mb-2">3.3 Communication</h3>
                  <ul className="space-y-2 text-muted-foreground text-sm">
                    <li className="flex items-start">
                      <CheckCircle className="h-4 w-4 text-primary mr-2 mt-0.5 flex-shrink-0" />
                      <span>Send service-related announcements and updates</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="h-4 w-4 text-primary mr-2 mt-0.5 flex-shrink-0" />
                      <span>Respond to support requests and feedback</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="h-4 w-4 text-primary mr-2 mt-0.5 flex-shrink-0" />
                      <span>Send security alerts and critical notifications</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="h-4 w-4 text-primary mr-2 mt-0.5 flex-shrink-0" />
                      <span>Deliver marketing communications (with your consent; opt-out available)</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="h-4 w-4 text-primary mr-2 mt-0.5 flex-shrink-0" />
                      <span>Conduct user surveys and request feedback</span>
                    </li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-medium mb-2">3.4 Security and Fraud Prevention</h3>
                  <ul className="space-y-2 text-muted-foreground text-sm">
                    <li className="flex items-start">
                      <CheckCircle className="h-4 w-4 text-primary mr-2 mt-0.5 flex-shrink-0" />
                      <span>Detect and prevent security threats and abuse</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="h-4 w-4 text-primary mr-2 mt-0.5 flex-shrink-0" />
                      <span>Monitor for unauthorized access or account compromise</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="h-4 w-4 text-primary mr-2 mt-0.5 flex-shrink-0" />
                      <span>Enforce Terms of Service and Acceptable Use Policy</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="h-4 w-4 text-primary mr-2 mt-0.5 flex-shrink-0" />
                      <span>Protect ERMITS, users, and third parties from harm</span>
                    </li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-medium mb-2">3.5 Legal and Compliance</h3>
                  <ul className="space-y-2 text-muted-foreground text-sm">
                    <li className="flex items-start">
                      <CheckCircle className="h-4 w-4 text-primary mr-2 mt-0.5 flex-shrink-0" />
                      <span>Comply with legal obligations and respond to lawful requests</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="h-4 w-4 text-primary mr-2 mt-0.5 flex-shrink-0" />
                      <span>Enforce our legal rights and agreements</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="h-4 w-4 text-primary mr-2 mt-0.5 flex-shrink-0" />
                      <span>Protect against legal liability</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="h-4 w-4 text-primary mr-2 mt-0.5 flex-shrink-0" />
                      <span>Conduct audits and maintain business records</span>
                    </li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-medium mb-2">3.6 What We Do NOT Do</h3>
                  <p className="text-muted-foreground mb-2 text-sm">ERMITS does NOT:</p>
                  <ul className="space-y-2">
                    <li className="flex items-start">
                      <AlertTriangle className="h-5 w-5 text-red-500 mr-2 mt-0.5 flex-shrink-0" />
                      <span className="text-muted-foreground text-sm">Sell or rent your personal information to third parties</span>
                    </li>
                    <li className="flex items-start">
                      <AlertTriangle className="h-5 w-5 text-red-500 mr-2 mt-0.5 flex-shrink-0" />
                      <span className="text-muted-foreground text-sm">Use your data for advertising or marketing to others</span>
                    </li>
                    <li className="flex items-start">
                      <AlertTriangle className="h-5 w-5 text-red-500 mr-2 mt-0.5 flex-shrink-0" />
                      <span className="text-muted-foreground text-sm">Share your User Data with third parties (except as disclosed in Section 2.4)</span>
                    </li>
                    <li className="flex items-start">
                      <AlertTriangle className="h-5 w-5 text-red-500 mr-2 mt-0.5 flex-shrink-0" />
                      <span className="text-muted-foreground text-sm">Train AI models on your User Data</span>
                    </li>
                    <li className="flex items-start">
                      <AlertTriangle className="h-5 w-5 text-red-500 mr-2 mt-0.5 flex-shrink-0" />
                      <span className="text-muted-foreground text-sm">Analyze your assessment results or SBOM data for any purpose</span>
                    </li>
                    <li className="flex items-start">
                      <AlertTriangle className="h-5 w-5 text-red-500 mr-2 mt-0.5 flex-shrink-0" />
                      <span className="text-muted-foreground text-sm">Profile users for behavioral targeting</span>
                    </li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Information Sharing and Disclosure */}
          <Card>
            <CardContent className="p-6">
              <h2 className="text-2xl font-semibold mb-4 flex items-center">
                <Users className="h-6 w-6 text-primary mr-2" />
                4. Information Sharing and Disclosure
              </h2>
              
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium mb-3">4.1 Service Providers (Sub-Processors)</h3>
                  <p className="text-muted-foreground mb-3 text-sm">
                    We share limited data with trusted third-party service providers who assist in delivering the Services:
                  </p>
                  <div className="overflow-x-auto">
                    <table className="min-w-full text-sm border-collapse">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left py-2 pr-4 font-semibold">Service Provider</th>
                          <th className="text-left py-2 pr-4 font-semibold">Purpose</th>
                          <th className="text-left py-2 pr-4 font-semibold">Data Shared</th>
                          <th className="text-left py-2 font-semibold">Location</th>
                        </tr>
                      </thead>
                      <tbody className="text-muted-foreground">
                        <tr className="border-b">
                          <td className="py-2 pr-4"><strong>Supabase</strong></td>
                          <td className="py-2 pr-4">Database and authentication</td>
                          <td className="py-2 pr-4">Email, encrypted user data (if cloud sync enabled)</td>
                          <td className="py-2">United States</td>
                        </tr>
                        <tr className="border-b">
                          <td className="py-2 pr-4"><strong>Stripe</strong></td>
                          <td className="py-2 pr-4">Payment processing</td>
                          <td className="py-2 pr-4">Email, billing information</td>
                          <td className="py-2">United States</td>
                        </tr>
                        <tr className="border-b">
                          <td className="py-2 pr-4"><strong>Sentry</strong></td>
                          <td className="py-2 pr-4">Error monitoring</td>
                          <td className="py-2 pr-4">Error logs with PII automatically scrubbed</td>
                          <td className="py-2">United States</td>
                        </tr>
                        <tr className="border-b">
                          <td className="py-2 pr-4"><strong>PostHog</strong></td>
                          <td className="py-2 pr-4">Analytics</td>
                          <td className="py-2 pr-4">Pseudonymized usage metrics with differential privacy</td>
                          <td className="py-2">United States / EU</td>
                        </tr>
                        <tr className="border-b">
                          <td className="py-2 pr-4"><strong>Vercel</strong></td>
                          <td className="py-2 pr-4">Hosting and CDN</td>
                          <td className="py-2 pr-4">IP address, HTTP headers (standard web traffic)</td>
                          <td className="py-2">Global CDN</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                  <div className="mt-4">
                    <strong className="text-foreground text-sm">Sub-Processor Requirements:</strong>
                    <p className="text-muted-foreground text-sm mb-2 mt-1">All sub-processors are contractually required to:</p>
                    <ul className="list-disc ml-6 space-y-1 text-muted-foreground text-sm">
                      <li>Use data only for specified purposes</li>
                      <li>Implement appropriate security measures</li>
                      <li>Comply with applicable privacy laws</li>
                      <li>Not use data for their own purposes</li>
                      <li>Delete data when no longer needed</li>
                    </ul>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-medium mb-2">4.2 Legal Requirements</h3>
                  <p className="text-muted-foreground text-sm mb-2">We may disclose information if required by law or in response to:</p>
                  <ul className="list-disc ml-6 space-y-1 text-muted-foreground text-sm">
                    <li>Court orders, subpoenas, or legal process</li>
                    <li>Government or regulatory investigations</li>
                    <li>Law enforcement requests (where legally required)</li>
                    <li>National security or public safety threats</li>
                  </ul>
                  <p className="text-muted-foreground text-sm mt-3 mb-2">When legally permitted, we will:</p>
                  <ul className="list-disc ml-6 space-y-1 text-muted-foreground text-sm">
                    <li>Notify affected users of legal requests</li>
                    <li>Challenge overly broad or improper requests</li>
                    <li>Provide only the minimum information required</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-medium mb-2">4.3 Business Transfers</h3>
                  <p className="text-muted-foreground text-sm mb-2">If ERMITS is involved in a merger, acquisition, asset sale, or bankruptcy:</p>
                  <ul className="list-disc ml-6 space-y-1 text-muted-foreground text-sm">
                    <li>User information may be transferred as part of the business assets</li>
                    <li>We will provide notice before information is transferred</li>
                    <li>The successor entity will be bound by this Privacy Policy</li>
                    <li>You will have the option to delete your data before transfer</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-medium mb-2">4.4 Consent-Based Sharing</h3>
                  <p className="text-muted-foreground text-sm mb-2">We may share information with your explicit consent for purposes such as:</p>
                  <ul className="list-disc ml-6 space-y-1 text-muted-foreground text-sm">
                    <li>Integration with third-party tools you authorize</li>
                    <li>Sharing data with your organization's administrators</li>
                    <li>Public testimonials or case studies (with identifying information only if you approve)</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-medium mb-2">4.5 Aggregated and Anonymous Data</h3>
                  <p className="text-muted-foreground text-sm mb-2">We may share aggregated, anonymous data that cannot identify you:</p>
                  <ul className="list-disc ml-6 space-y-1 text-muted-foreground text-sm">
                    <li>Industry benchmarks and statistics</li>
                    <li>Research publications and presentations</li>
                    <li>Public reports on security trends</li>
                    <li>Product improvement insights</li>
                  </ul>
                  <p className="text-muted-foreground text-sm mt-2">
                    This data is derived from pseudonymized telemetry and cannot be reverse-engineered to identify users or organizations.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Data Security Measures */}
          <Card>
            <CardContent className="p-6">
              <h2 className="text-2xl font-semibold mb-4 flex items-center">
                <Shield className="h-6 w-6 text-primary mr-2" />
                5. Data Security Measures
              </h2>
              
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium mb-3">5.1 Encryption</h3>
                  
                  <div className="mb-4">
                    <strong className="text-foreground">Data in Transit:</strong>
                    <ul className="list-disc ml-6 space-y-1 text-muted-foreground text-sm mt-2">
                      <li>TLS 1.3 encryption for all data transmission</li>
                      <li>HTTPS required for all web traffic</li>
                      <li>Certificate pinning for critical connections</li>
                      <li>Perfect Forward Secrecy (PFS) enabled</li>
                    </ul>
                  </div>

                  <div className="mb-4">
                    <strong className="text-foreground">Data at Rest:</strong>
                    <ul className="list-disc ml-6 space-y-1 text-muted-foreground text-sm mt-2">
                      <li>AES-256-GCM encryption for cloud-stored data</li>
                      <li>Client-side encryption with user-controlled keys (zero-knowledge architecture)</li>
                      <li>Encrypted database backups</li>
                      <li>Secure key management practices</li>
                    </ul>
                  </div>

                  <div>
                    <strong className="text-foreground">Data in Use:</strong>
                    <ul className="list-disc ml-6 space-y-1 text-muted-foreground text-sm mt-2">
                      <li>Local processing minimizes data exposure</li>
                      <li>Memory encryption where supported by browser</li>
                      <li>Secure coding practices to prevent data leakage</li>
                    </ul>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-medium mb-3">5.2 Access Controls</h3>
                  <ul className="list-disc ml-6 space-y-2 text-muted-foreground text-sm">
                    <li><strong>Multi-Factor Authentication (MFA):</strong> Available for all accounts, required for administrators</li>
                    <li><strong>Role-Based Access Control (RBAC):</strong> Granular permissions based on user roles</li>
                    <li><strong>Row-Level Security (RLS):</strong> Database-level isolation ensuring users can only access their own data</li>
                    <li><strong>Principle of Least Privilege:</strong> Internal access limited to minimum necessary</li>
                    <li><strong>Access Logging:</strong> All data access logged for audit and security monitoring</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-medium mb-3">5.3 Infrastructure Security</h3>
                  <ul className="list-disc ml-6 space-y-2 text-muted-foreground text-sm">
                    <li><strong>Secure Cloud Hosting:</strong> Enterprise-grade infrastructure (Supabase, Vercel)</li>
                    <li><strong>Network Segmentation:</strong> Isolated production, staging, and development environments</li>
                    <li><strong>DDoS Protection:</strong> Distributed denial-of-service attack mitigation</li>
                    <li><strong>Intrusion Detection:</strong> 24/7 monitoring for suspicious activity</li>
                    <li><strong>Regular Security Audits:</strong> Penetration testing and vulnerability assessments</li>
                    <li><strong>Incident Response Plan:</strong> Documented procedures for security incidents</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-medium mb-3">5.4 Application Security</h3>
                  <ul className="list-disc ml-6 space-y-2 text-muted-foreground text-sm">
                    <li><strong>Secure Coding Practices:</strong> Following OWASP Top 10 guidelines</li>
                    <li><strong>Input Validation:</strong> Comprehensive sanitization of all user inputs</li>
                    <li><strong>SQL Injection Prevention:</strong> Parameterized queries and prepared statements</li>
                    <li><strong>XSS Protection:</strong> Content Security Policy (CSP) and output encoding</li>
                    <li><strong>CSRF Protection:</strong> Anti-CSRF tokens for state-changing operations</li>
                    <li><strong>Dependency Management:</strong> Regular updates and vulnerability scanning</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-medium mb-3">5.5 Employee and Contractor Access</h3>
                  <ul className="list-disc ml-6 space-y-1 text-muted-foreground text-sm">
                    <li>Background checks for employees with data access</li>
                    <li>Confidentiality agreements and security training</li>
                    <li>Access granted only on need-to-know basis</li>
                    <li>Regular access reviews and revocations</li>
                    <li>Monitoring and logging of all employee data access</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-medium mb-3">5.6 Security Incident Response</h3>
                  <p className="text-muted-foreground text-sm mb-2">In the event of a data breach or security incident:</p>
                  <ul className="list-disc ml-6 space-y-1 text-muted-foreground text-sm">
                    <li><strong>Detection:</strong> 24/7 monitoring and alerting systems</li>
                    <li><strong>Containment:</strong> Immediate action to isolate affected systems</li>
                    <li><strong>Investigation:</strong> Forensic analysis to determine scope and impact</li>
                    <li><strong>Notification:</strong> Timely notification to affected users and regulators as required by law</li>
                    <li><strong>Remediation:</strong> Fixes to prevent recurrence</li>
                    <li><strong>Documentation:</strong> Comprehensive incident reporting and lessons learned</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Data Retention */}
          <Card>
            <CardContent className="p-6">
              <h2 className="text-2xl font-semibold mb-4 flex items-center">
                <Database className="h-6 w-6 text-primary mr-2" />
                6. Data Retention
              </h2>
              
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium mb-3">6.1 Active Accounts</h3>
                  <p className="text-muted-foreground mb-3 text-sm">
                    We retain your data for as long as your account is active or as needed to provide Services:
                  </p>
                  <div className="overflow-x-auto">
                    <table className="min-w-full text-sm border-collapse">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left py-2 pr-4 font-semibold">Data Type</th>
                          <th className="text-left py-2 pr-4 font-semibold">Retention Period</th>
                          <th className="text-left py-2 font-semibold">Purpose</th>
                        </tr>
                      </thead>
                      <tbody className="text-muted-foreground">
                        <tr className="border-b">
                          <td className="py-2 pr-4"><strong>Account Information</strong></td>
                          <td className="py-2 pr-4">Duration of account + 30 days</td>
                          <td className="py-2">Service delivery, support</td>
                        </tr>
                        <tr className="border-b">
                          <td className="py-2 pr-4"><strong>User-Generated Content</strong></td>
                          <td className="py-2 pr-4">User-controlled (can delete anytime)</td>
                          <td className="py-2">Service functionality</td>
                        </tr>
                        <tr className="border-b">
                          <td className="py-2 pr-4"><strong>Encrypted Cloud Data</strong></td>
                          <td className="py-2 pr-4">User-controlled (can delete anytime)</td>
                          <td className="py-2">Cloud synchronization</td>
                        </tr>
                        <tr className="border-b">
                          <td className="py-2 pr-4"><strong>Support Communications</strong></td>
                          <td className="py-2 pr-4">3 years</td>
                          <td className="py-2">Customer support, quality improvement</td>
                        </tr>
                        <tr className="border-b">
                          <td className="py-2 pr-4"><strong>Pseudonymized Telemetry</strong></td>
                          <td className="py-2 pr-4">Indefinite (anonymous, cannot be deleted)</td>
                          <td className="py-2">Service improvement, analytics</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-medium mb-2">6.2 Deleted Accounts</h3>
                  <p className="text-muted-foreground text-sm mb-2">When you delete your account or request data deletion:</p>
                  <ul className="list-disc ml-6 space-y-1 text-muted-foreground text-sm">
                    <li><strong>Immediate:</strong> Account access disabled, data marked for deletion</li>
                    <li><strong>Within 30 days:</strong> User Data permanently deleted from production systems</li>
                    <li><strong>Within 90 days:</strong> Backup copies permanently deleted</li>
                    <li><strong>Exceptions:</strong> Data retained longer only where legally required</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-medium mb-2">6.3 Legal and Regulatory Retention</h3>
                  <p className="text-muted-foreground text-sm mb-2">
                    Certain data must be retained for legal, regulatory, or tax purposes:
                  </p>
                  <ul className="list-disc ml-6 space-y-1 text-muted-foreground text-sm">
                    <li><strong>Financial Records:</strong> 7 years (IRS requirements)</li>
                    <li><strong>Audit Logs:</strong> 3 years (security and compliance)</li>
                    <li><strong>Legal Hold Data:</strong> Retained as required by litigation or investigation</li>
                    <li><strong>Pseudonymized Analytics:</strong> Indefinite (anonymous, cannot be reverse-engineered)</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-medium mb-2">6.4 Inactive Accounts</h3>
                  <ul className="list-disc ml-6 space-y-1 text-muted-foreground text-sm">
                    <li><strong>Free Accounts:</strong> May be deleted after 12 months of inactivity (with 30 days' notice)</li>
                    <li><strong>Paid Accounts:</strong> Retained for duration of subscription plus 30 days</li>
                    <li><strong>Data Export:</strong> Users notified before deletion and given opportunity to export data</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Your Privacy Rights */}
          <Card>
            <CardContent className="p-6">
              <h2 className="text-2xl font-semibold mb-4 flex items-center">
                <Lock className="h-6 w-6 text-primary mr-2" />
                7. Your Privacy Rights
              </h2>
              
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium mb-3">7.1 Universal Rights</h3>
                  <p className="text-muted-foreground mb-3 text-sm">
                    All users have the following rights regardless of location:
                  </p>
                  
                  <div className="space-y-4">
                    <div>
                      <strong className="text-foreground">Right to Access:</strong>
                      <ul className="list-disc ml-6 space-y-1 text-muted-foreground text-sm mt-1">
                        <li>Request a copy of all personal data we hold about you</li>
                        <li>Receive information about how your data is processed</li>
                        <li>Request access within the Services (Account Settings → Export Data)</li>
                      </ul>
                    </div>
                    
                    <div>
                      <strong className="text-foreground">Right to Rectification:</strong>
                      <ul className="list-disc ml-6 space-y-1 text-muted-foreground text-sm mt-1">
                        <li>Correct inaccurate or incomplete personal data</li>
                        <li>Update information directly in Account Settings</li>
                        <li>Contact support for assistance: contact@ermits.com</li>
                      </ul>
                    </div>
                    
                    <div>
                      <strong className="text-foreground">Right to Deletion (Right to be Forgotten):</strong>
                      <ul className="list-disc ml-6 space-y-1 text-muted-foreground text-sm mt-1">
                        <li>Request deletion of your personal data</li>
                        <li>Delete account and all data via Account Settings → Delete Account</li>
                        <li>Data deleted within 30 days (90 days for backups)</li>
                      </ul>
                    </div>
                    
                    <div>
                      <strong className="text-foreground">Right to Data Portability:</strong>
                      <ul className="list-disc ml-6 space-y-1 text-muted-foreground text-sm mt-1">
                        <li>Export your data in machine-readable formats (JSON, CSV)</li>
                        <li>Transfer data to another service provider</li>
                        <li>Export available anytime via Account Settings → Export Data</li>
                      </ul>
                    </div>
                    
                    <div>
                      <strong className="text-foreground">Right to Restriction of Processing:</strong>
                      <ul className="list-disc ml-6 space-y-1 text-muted-foreground text-sm mt-1">
                        <li>Request limitation of processing in certain circumstances</li>
                        <li>Temporarily suspend processing while disputes are resolved</li>
                      </ul>
                    </div>
                    
                    <div>
                      <strong className="text-foreground">Right to Object:</strong>
                      <ul className="list-disc ml-6 space-y-1 text-muted-foreground text-sm mt-1">
                        <li>Object to processing based on legitimate interests</li>
                        <li>Opt out of marketing communications</li>
                        <li>Disable telemetry collection</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-medium mb-3">7.2 Additional Rights for EU/UK/Swiss Users (GDPR/UK GDPR/Swiss DPA)</h3>
                  <p className="text-muted-foreground mb-3 text-sm">
                    If you are located in the European Economic Area, United Kingdom, or Switzerland, you have additional rights:
                  </p>
                  
                  <div className="space-y-4">
                    <div>
                      <strong className="text-foreground">Legal Basis for Processing:</strong>
                      <p className="text-muted-foreground text-sm mb-2 mt-1">We process your data based on:</p>
                      <ul className="list-disc ml-6 space-y-1 text-muted-foreground text-sm">
                        <li><strong>Consent:</strong> When you provide explicit consent (e.g., marketing communications, telemetry)</li>
                        <li><strong>Contract:</strong> To perform our contract with you (provide Services)</li>
                        <li><strong>Legitimate Interests:</strong> For service improvement, security, and fraud prevention (balanced against your rights)</li>
                        <li><strong>Legal Obligation:</strong> To comply with applicable laws</li>
                      </ul>
                    </div>
                    
                    <div>
                      <strong className="text-foreground">Right to Withdraw Consent:</strong>
                      <ul className="list-disc ml-6 space-y-1 text-muted-foreground text-sm mt-1">
                        <li>Withdraw consent at any time (does not affect prior processing)</li>
                        <li>Disable telemetry in Account Settings</li>
                        <li>Unsubscribe from marketing emails via opt-out link</li>
                      </ul>
                    </div>
                    
                    <div>
                      <strong className="text-foreground">Right to Lodge a Complaint:</strong>
                      <ul className="list-disc ml-6 space-y-1 text-muted-foreground text-sm mt-1">
                        <li>File complaint with your local data protection authority</li>
                        <li>EU: Find your DPA at https://edpb.europa.eu/about-edpb/board/members_en</li>
                        <li>UK: Information Commissioner's Office (ICO) at https://ico.org.uk/</li>
                        <li>Switzerland: Federal Data Protection and Information Commissioner (FDPIC)</li>
                      </ul>
                    </div>
                    
                    <div>
                      <strong className="text-foreground">Right to Automated Decision-Making:</strong>
                      <ul className="list-disc ml-6 space-y-1 text-muted-foreground text-sm mt-1">
                        <li>ERMITS does not engage in automated decision-making with legal or significant effects</li>
                        <li>Risk scores and assessments are informational only and require human judgment</li>
                      </ul>
                    </div>
                    
                    <div>
                      <strong className="text-foreground">Data Protection Officer:</strong>
                      <p className="text-muted-foreground text-sm mt-1">
                        For GDPR-related inquiries, contact: contact@ermits.com (Subject: "GDPR Inquiry")
                      </p>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-medium mb-3">7.3 Additional Rights for California Residents (CCPA/CPRA)</h3>
                  <p className="text-muted-foreground mb-3 text-sm">
                    If you are a California resident, you have additional rights under the California Consumer Privacy Act (CCPA) and California Privacy Rights Act (CPRA):
                  </p>
                  
                  <div className="space-y-4">
                    <div>
                      <strong className="text-foreground">Right to Know:</strong>
                      <ul className="list-disc ml-6 space-y-1 text-muted-foreground text-sm mt-1">
                        <li>Categories of personal information collected</li>
                        <li>Categories of sources of personal information</li>
                        <li>Business or commercial purposes for collecting or selling personal information</li>
                        <li>Categories of third parties with whom we share personal information</li>
                        <li>Specific pieces of personal information collected</li>
                      </ul>
                    </div>
                    
                    <div>
                      <strong className="text-foreground">Right to Delete:</strong>
                      <ul className="list-disc ml-6 space-y-1 text-muted-foreground text-sm mt-1">
                        <li>Request deletion of personal information (subject to legal exceptions)</li>
                      </ul>
                    </div>
                    
                    <div>
                      <strong className="text-foreground">Right to Opt-Out of Sale:</strong>
                      <ul className="list-disc ml-6 space-y-1 text-muted-foreground text-sm mt-1">
                        <li>ERMITS does not sell personal information and has not sold personal information in the past 12 months</li>
                        <li>We do not sell personal information of minors under 16</li>
                      </ul>
                    </div>
                    
                    <div>
                      <strong className="text-foreground">Right to Non-Discrimination:</strong>
                      <ul className="list-disc ml-6 space-y-1 text-muted-foreground text-sm mt-1">
                        <li>Equal service and pricing regardless of privacy rights exercise</li>
                        <li>No denial of goods or services for exercising privacy rights</li>
                      </ul>
                    </div>
                    
                    <div>
                      <strong className="text-foreground">Right to Limit Use of Sensitive Personal Information:</strong>
                      <ul className="list-disc ml-6 space-y-1 text-muted-foreground text-sm mt-1">
                        <li>ERMITS does not use or disclose sensitive personal information for purposes other than providing Services</li>
                      </ul>
                    </div>
                    
                    <div>
                      <strong className="text-foreground">Authorized Agent:</strong>
                      <ul className="list-disc ml-6 space-y-1 text-muted-foreground text-sm mt-1">
                        <li>You may designate an authorized agent to make requests on your behalf</li>
                        <li>Authorized agent must provide written authorization and verify identity</li>
                      </ul>
                    </div>
                    
                    <div>
                      <strong className="text-foreground">California Consumer Privacy Request:</strong>
                      <p className="text-muted-foreground text-sm mt-1">
                        Submit requests via email: contact@ermits.com (Subject: "CCPA Request")
                      </p>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-medium mb-3">7.4 Exercising Your Rights</h3>
                  
                  <div className="mb-4">
                    <strong className="text-foreground">How to Submit Requests:</strong>
                    <ul className="list-disc ml-6 space-y-1 text-muted-foreground text-sm mt-2">
                      <li><strong>Email:</strong> contact@ermits.com (Subject: "Privacy Rights Request")</li>
                      <li><strong>In-App:</strong> Account Settings → Privacy Rights</li>
                      <li><strong>Mail:</strong> ERMITS LLC, [Physical Address], Attn: Privacy Rights</li>
                    </ul>
                  </div>
                  
                  <div className="mb-4">
                    <strong className="text-foreground">Verification Process:</strong>
                    <p className="text-muted-foreground text-sm mb-2 mt-1">
                      To protect your privacy, we must verify your identity before fulfilling requests:
                    </p>
                    <ul className="list-disc ml-6 space-y-1 text-muted-foreground text-sm">
                      <li>Account-based verification (log in to verify identity)</li>
                      <li>Email verification (confirmation link sent to registered email)</li>
                      <li>Additional verification for sensitive requests (government-issued ID may be required)</li>
                    </ul>
                  </div>
                  
                  <div className="mb-4">
                    <strong className="text-foreground">Response Timeline:</strong>
                    <ul className="list-disc ml-6 space-y-1 text-muted-foreground text-sm mt-2">
                      <li><strong>Initial Response:</strong> Within 10 business days acknowledging receipt</li>
                      <li><strong>Complete Response:</strong> Within 45 days (may extend 45 days with notice for complex requests)</li>
                      <li><strong>Free of Charge:</strong> First two requests per year are free; reasonable fee may apply for excessive requests</li>
                    </ul>
                  </div>
                  
                  <div>
                    <strong className="text-foreground">Authorized Agent Requests:</strong>
                    <p className="text-muted-foreground text-sm mb-2 mt-1">If submitting through an authorized agent:</p>
                    <ul className="list-disc ml-6 space-y-1 text-muted-foreground text-sm">
                      <li>Provide written authorization signed by you</li>
                      <li>Verify your identity and the agent's authority</li>
                      <li>California residents: Agent must be registered with California Secretary of State</li>
                    </ul>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* International Data Transfers */}
          <Card>
            <CardContent className="p-6">
              <h2 className="text-2xl font-semibold mb-4 flex items-center">
                <Globe className="h-6 w-6 text-primary mr-2" />
                8. International Data Transfers
              </h2>
              
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium mb-3">8.1 Data Processing Locations</h3>
                  <p className="text-muted-foreground mb-3 text-sm">
                    ERMITS is based in the United States. If you access Services from outside the U.S., your data may be transferred to, stored, and processed in the United States or other countries where our service providers operate.
                  </p>
                  
                  <div>
                    <strong className="text-foreground">Primary Data Locations:</strong>
                    <ul className="list-disc ml-6 space-y-1 text-muted-foreground text-sm mt-2">
                      <li><strong>United States:</strong> Primary data processing and storage (Supabase, Vercel, Stripe)</li>
                      <li><strong>European Union:</strong> Optional data residency for EU customers (Supabase EU region)</li>
                      <li><strong>Global CDN:</strong> Content delivery network nodes worldwide (Vercel)</li>
                    </ul>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-medium mb-3">8.2 Safeguards for International Transfers</h3>
                  <p className="text-muted-foreground mb-3 text-sm">
                    For data transfers from the EEA, UK, or Switzerland to the United States:
                  </p>
                  
                  <div className="mb-4">
                    <strong className="text-foreground">Standard Contractual Clauses (SCCs):</strong>
                    <ul className="list-disc ml-6 space-y-1 text-muted-foreground text-sm mt-2">
                      <li>ERMITS uses European Commission-approved Standard Contractual Clauses</li>
                      <li>SCCs incorporated into agreements with sub-processors</li>
                      <li>Full text available in Standard Contractual Clauses addendum (Enterprise Policies)</li>
                    </ul>
                  </div>
                  
                  <div className="mb-4">
                    <strong className="text-foreground">Additional Safeguards:</strong>
                    <ul className="list-disc ml-6 space-y-1 text-muted-foreground text-sm mt-2">
                      <li>Encryption in transit and at rest</li>
                      <li>Access controls and authentication</li>
                      <li>Regular security assessments</li>
                      <li>Incident response procedures</li>
                      <li>Transparency about government access requests</li>
                    </ul>
                  </div>
                  
                  <div>
                    <strong className="text-foreground">Data Residency Options:</strong>
                    <p className="text-muted-foreground text-sm mb-2 mt-1">Enterprise customers can request:</p>
                    <ul className="list-disc ml-6 space-y-1 text-muted-foreground text-sm">
                      <li>EU-only data storage (Supabase EU region)</li>
                      <li>Self-managed infrastructure in preferred jurisdiction</li>
                      <li>On-premises deployment for complete data control</li>
                    </ul>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-medium mb-3">8.3 UK and Swiss Transfers</h3>
                  
                  <div className="mb-4">
                    <strong className="text-foreground">UK Transfers:</strong>
                    <ul className="list-disc ml-6 space-y-1 text-muted-foreground text-sm mt-2">
                      <li>UK Addendum to Standard Contractual Clauses applied</li>
                      <li>Compliance with UK GDPR requirements</li>
                      <li>UK International Data Transfer Agreement (IDTA) available upon request</li>
                    </ul>
                  </div>
                  
                  <div>
                    <strong className="text-foreground">Swiss Transfers:</strong>
                    <ul className="list-disc ml-6 space-y-1 text-muted-foreground text-sm mt-2">
                      <li>Swiss-EU data transfer mechanisms applied</li>
                      <li>Compliance with Swiss Federal Data Protection Act (FADP)</li>
                      <li>Swiss data protection requirements met</li>
                    </ul>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Children's Privacy */}
          <Card>
            <CardContent className="p-6">
              <h2 className="text-2xl font-semibold mb-4 flex items-center">
                <UserCheck className="h-6 w-6 text-primary mr-2" />
                9. Children's Privacy
              </h2>
              
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium mb-3">9.1 Age Restrictions</h3>
                  <p className="text-muted-foreground mb-3 text-sm">
                    The Services are not intended for children under 18 years of age. We do not knowingly collect personal information from children under 18.
                  </p>
                  
                  <div>
                    <strong className="text-foreground">If You Are Under 18:</strong>
                    <ul className="list-disc ml-6 space-y-1 text-muted-foreground text-sm mt-2">
                      <li>Do not use the Services</li>
                      <li>Do not provide any information to ERMITS</li>
                      <li>Have a parent or guardian contact us if you have provided information</li>
                    </ul>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-medium mb-3">9.2 Parental Rights</h3>
                  <p className="text-muted-foreground mb-3 text-sm">
                    If we learn that we have collected personal information from a child under 18:
                  </p>
                  <ul className="list-disc ml-6 space-y-1 text-muted-foreground text-sm">
                    <li>We will delete the information as quickly as possible</li>
                    <li>Parents may contact us to request deletion: contact@ermits.com</li>
                    <li>Parents have the right to review, delete, and refuse further collection of their child's information</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-medium mb-3">9.3 Educational Use</h3>
                  <p className="text-muted-foreground mb-3 text-sm">
                    For educational institutions using Services for students:
                  </p>
                  <ul className="list-disc ml-6 space-y-1 text-muted-foreground text-sm">
                    <li>Institution must obtain appropriate parental consent</li>
                    <li>Institution acts as agent for parents</li>
                    <li>FERPA and COPPA compliance is institution's responsibility</li>
                    <li>Student data is processed under institution's direction</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Federal Contractor Privacy Considerations */}
          <Card>
            <CardContent className="p-6">
              <h2 className="text-2xl font-semibold mb-4 flex items-center">
                <Shield className="h-6 w-6 text-primary mr-2" />
                10. Federal Contractor Privacy Considerations
              </h2>
              
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium mb-3">10.1 CUI and FCI Handling</h3>
                  <p className="text-muted-foreground mb-3 text-sm">
                    For users handling Controlled Unclassified Information (CUI) or Federal Contract Information (FCI):
                  </p>
                  
                  <div className="mb-4">
                    <strong className="text-foreground">Privacy-First Architecture Benefits:</strong>
                    <ul className="list-disc ml-6 space-y-1 text-muted-foreground text-sm mt-2">
                      <li>CUI/FCI is processed client-side and never transmitted to ERMITS</li>
                      <li>Zero-knowledge encryption ensures ERMITS cannot access CUI/FCI</li>
                      <li>Local storage options eliminate cloud transmission of sensitive data</li>
                      <li>Users maintain complete control over CUI/FCI data</li>
                    </ul>
                  </div>
                  
                  <div>
                    <strong className="text-foreground">User Responsibilities:</strong>
                    <ul className="list-disc ml-6 space-y-1 text-muted-foreground text-sm mt-2">
                      <li>Properly mark and handle CUI/FCI according to NIST SP 800-171</li>
                      <li>Use encryption features and self-managed deployment options</li>
                      <li>Implement appropriate access controls</li>
                      <li>Maintain audit logs for CUI/FCI access</li>
                    </ul>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-medium mb-3">10.2 NIST SP 800-171 Privacy Controls</h3>
                  <p className="text-muted-foreground mb-3 text-sm">
                    ERMITS Services support implementation of NIST SP 800-171 privacy controls:
                  </p>
                  <ul className="list-disc ml-6 space-y-1 text-muted-foreground text-sm">
                    <li>3.13.1: Monitor, control, and protect organizational communications</li>
                    <li>3.13.2: Employ architectural designs, software development techniques, and systems engineering principles</li>
                    <li>3.13.3: Separate user functionality from information system management functionality</li>
                    <li>3.13.5: Implement subnetworks for publicly accessible system components</li>
                  </ul>
                  <div className="mt-4">
                    <strong className="text-foreground">User Implementation:</strong>
                    <ul className="list-disc ml-6 space-y-1 text-muted-foreground text-sm mt-2">
                      <li>Services provide tools and templates for privacy control implementation</li>
                      <li>Users must configure and implement controls according to their requirements</li>
                      <li>ERMITS does not implement controls on behalf of users</li>
                    </ul>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-medium mb-3">10.3 Incident Reporting</h3>
                  <p className="text-muted-foreground mb-3 text-sm">
                    Federal contractors must report cyber incidents involving CUI to DoD within 72 hours (DFARS 252.204-7012). Because ERMITS does not access CUI due to Privacy-First Architecture:
                  </p>
                  <ul className="list-disc ml-6 space-y-1 text-muted-foreground text-sm">
                    <li>Users are solely responsible for incident detection and reporting</li>
                    <li>ERMITS will cooperate with authorized incident investigations</li>
                    <li>ERMITS maintains audit logs that may assist incident investigations</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Updates to This Privacy Policy */}
          <Card>
            <CardContent className="p-6">
              <h2 className="text-2xl font-semibold mb-4 flex items-center">
                <FileText className="h-6 w-6 text-primary mr-2" />
                11. Updates to This Privacy Policy
              </h2>
              
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium mb-3">11.1 Policy Updates</h3>
                  <p className="text-muted-foreground mb-3 text-sm">
                    We may update this Privacy Policy periodically to reflect:
                  </p>
                  <ul className="list-disc ml-6 space-y-1 text-muted-foreground text-sm">
                    <li>Changes in data practices or Services</li>
                    <li>Legal or regulatory developments</li>
                    <li>Technological improvements</li>
                    <li>User feedback and industry best practices</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-medium mb-3">11.2 Notification of Changes</h3>
                  
                  <div className="mb-4">
                    <strong className="text-foreground">Material Changes:</strong>
                    <p className="text-muted-foreground text-sm mb-2 mt-1">For significant changes affecting your rights:</p>
                    <ul className="list-disc ml-6 space-y-1 text-muted-foreground text-sm">
                      <li><strong>30 Days' Notice:</strong> Advance notice via email and in-app notification</li>
                      <li><strong>Prominent Display:</strong> Notice displayed on website and in Services</li>
                      <li><strong>Opt-Out Option:</strong> Option to export data and close account before changes take effect</li>
                      <li><strong>Continued Use:</strong> Continued use after effective date constitutes acceptance</li>
                    </ul>
                  </div>
                  
                  <div>
                    <strong className="text-foreground">Non-Material Changes:</strong>
                    <p className="text-muted-foreground text-sm mb-2 mt-1">For clarifications, formatting, or minor updates:</p>
                    <ul className="list-disc ml-6 space-y-1 text-muted-foreground text-sm">
                      <li>Update "Last Updated" date at top of policy</li>
                      <li>Changes effective immediately upon posting</li>
                      <li>No advance notice required</li>
                    </ul>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-medium mb-2">11.3 Version History</h3>
                  <p className="text-muted-foreground text-sm">
                    Previous versions of this Privacy Policy are available upon request: contact@ermits.com
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Contact Information */}
          <Card>
            <CardContent className="p-6">
              <h2 className="text-2xl font-semibold mb-4 flex items-center">
                <Mail className="h-6 w-6 text-primary mr-2" />
                12. Contact Information
              </h2>
              
              <div className="space-y-3 text-muted-foreground">
                <p><strong>Privacy Inquiries:</strong></p>
                <p>Email: <Mail className="inline h-4 w-4" /> contact@ermits.com | Subject: "Privacy Inquiry"</p>
                
                <p className="mt-4"><strong>Data Rights Requests:</strong></p>
                <p>Email: <Mail className="inline h-4 w-4" /> contact@ermits.com | Subject: "Privacy Rights Request"</p>
                
                <p className="mt-4"><strong>Data Protection Officer (EU/UK/Swiss):</strong></p>
                <p>Email: <Mail className="inline h-4 w-4" /> contact@ermits.com | Subject: "GDPR Inquiry"</p>
                
                <p className="mt-4"><strong>California Privacy Requests:</strong></p>
                <p>Email: <Mail className="inline h-4 w-4" /> contact@ermits.com | Subject: "CCPA Request"</p>
                
                <p className="mt-4"><strong>Security Concerns:</strong></p>
                <p>Email: <Mail className="inline h-4 w-4" /> contact@ermits.com | Subject: "Security Issue"</p>
                
                <p className="mt-4"><strong>General Inquiries:</strong></p>
                <p>Email: <Mail className="inline h-4 w-4" /> contact@ermits.com | Website: www.ermits.com</p>
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
