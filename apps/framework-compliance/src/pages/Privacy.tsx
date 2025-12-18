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
            <strong>Effective Date:</strong> October 31, 2025 | <strong>Last Updated:</strong> December 13, 2025
          </p>
        </div>

        <div className="space-y-8">
          {/* Introduction */}
          <Card>
            <CardContent className="p-6">
              <p className="text-muted-foreground mb-4">
                ERMITS LLC ("ERMITS," "we," "our," or "us") is committed to protecting your privacy through a Privacy-First Architecture that ensures you maintain control over your data. This Privacy Policy explains how we collect, use, disclose, and safeguard information when you use our Services across all ERMITS product lines.
              </p>
              <p className="text-muted-foreground">
                By using our Services, you consent to the data practices described in this policy. If you do not agree with this Privacy Policy, please do not use our Services.
              </p>
            </CardContent>
          </Card>

          {/* Scope and Applicability */}
          <Card>
            <CardContent className="p-6">
              <h2 className="text-2xl font-semibold mb-4 flex items-center">
                <FileText className="h-6 w-6 text-primary mr-2" />
                1. SCOPE AND APPLICABILITY
              </h2>
              
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium mb-3">1.1 Services Covered</h3>
                  <p className="text-muted-foreground mb-3 text-sm">
                    This Privacy Policy applies to all ERMITS products and services, including:
                  </p>
                  
                  <div className="space-y-3">
                    <div>
                      <strong className="text-foreground text-sm">CyberSoluce™:</strong>
                      <ul className="list-disc ml-6 space-y-1 text-muted-foreground text-sm mt-1">
                        <li>Enhanced Asset Inventory Management Platform</li>
                        <li>Dependency-aware visibility into asset inventory</li>
                        <li>Focus signals for attention areas</li>
                        <li>Service funneling guidance toward appropriate ERMITS services</li>
                      </ul>
                    </div>
                    
                    <div>
                      <strong className="text-foreground text-sm">SocialCaution:</strong>
                      <ul className="list-disc ml-6 space-y-1 text-muted-foreground text-sm mt-1">
                        <li>Personalized privacy platform</li>
                        <li>AI-powered persona detection</li>
                        <li>Privacy exposure index and risk scoring</li>
                        <li>Service catalog with privacy risk profiles</li>
                      </ul>
                    </div>
                    
                    <div>
                      <strong className="text-foreground text-sm">TechnoSoluce™:</strong>
                      <ul className="list-disc ml-6 space-y-1 text-muted-foreground text-sm mt-1">
                        <li>SBOM (Software Bill of Materials) Analyzer</li>
                        <li>Software supply chain security and vulnerability analysis</li>
                        <li>Client-side SBOM processing</li>
                      </ul>
                    </div>
                    
                    <div>
                      <strong className="text-foreground text-sm">CyberCertitude™:</strong>
                      <ul className="list-disc ml-6 space-y-1 text-muted-foreground text-sm mt-1">
                        <li>CMMC 2.0 Level 1 Implementation Suite</li>
                        <li>CMMC 2.0 Level 2 Compliance Platform</li>
                        <li>NIST SP 800-171 assessment and compliance tools</li>
                        <li>Original Toolkit (localStorage-based compliance management)</li>
                      </ul>
                    </div>
                    
                    <div>
                      <strong className="text-foreground text-sm">VendorSoluce™:</strong>
                      <ul className="list-disc ml-6 space-y-1 text-muted-foreground text-sm mt-1">
                        <li>Supply Chain Risk Management Platform</li>
                        <li>Vendor assessment and monitoring</li>
                        <li>Third-party risk evaluation</li>
                      </ul>
                    </div>
                    
                    <div>
                      <strong className="text-foreground text-sm">CyberCorrect™:</strong>
                      <ul className="list-disc ml-6 space-y-1 text-muted-foreground text-sm mt-1">
                        <li>Privacy Portal (workplace privacy compliance)</li>
                        <li>Privacy Platform (multi-regulation privacy management)</li>
                        <li>Data subject rights management</li>
                      </ul>
                    </div>
                    
                    <div>
                      <strong className="text-foreground text-sm">CyberCaution™:</strong>
                      <ul className="list-disc ml-6 space-y-1 text-muted-foreground text-sm mt-1">
                        <li>RansomCheck (ransomware readiness assessment)</li>
                        <li>Security Toolkit (comprehensive cybersecurity assessments)</li>
                        <li>RiskProfessional (CISA-aligned security assessments)</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-medium mb-3">1.2 Geographic Scope</h3>
                  <p className="text-muted-foreground mb-3 text-sm">
                    This Privacy Policy applies to users worldwide and complies with:
                  </p>
                  <ul className="list-disc ml-6 space-y-1 text-muted-foreground text-sm">
                    <li>General Data Protection Regulation (GDPR) - European Union, United Kingdom, Switzerland</li>
                    <li>California Consumer Privacy Act (CCPA) / California Privacy Rights Act (CPRA)</li>
                    <li>Personal Information Protection and Electronic Documents Act (PIPEDA) - Canada</li>
                    <li>Lei Geral de Proteção de Dados (LGPD) - Brazil</li>
                    <li>Other applicable privacy and data protection laws</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Privacy-First Architecture Overview */}
          <Card>
            <CardContent className="p-6">
              <h2 className="text-2xl font-semibold mb-4 flex items-center">
                <Shield className="h-6 w-6 text-primary mr-2" />
                2. PRIVACY-FIRST ARCHITECTURE OVERVIEW
              </h2>
              
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium mb-3">2.1 Core Privacy Principles</h3>
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
                  <h3 className="text-lg font-medium mb-3">2.2 Product-Specific Privacy-First Implementations</h3>
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
                3. INFORMATION WE COLLECT
              </h2>
              
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium mb-3">3.1 Information You Provide Directly</h3>
                  
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
                  <h3 className="text-lg font-medium mb-3">3.2 Information We Do NOT Collect</h3>
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
                  <h3 className="text-lg font-medium mb-3">3.3 Automatically Collected Information</h3>
                  
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
                  <h3 className="text-lg font-medium mb-3">3.4 Information from Third Parties</h3>
                  
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
                4. HOW WE USE INFORMATION
              </h2>
              
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-medium mb-2">4.1 Service Delivery and Operation</h3>
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
                  <h3 className="text-lg font-medium mb-2">4.2 Service Improvement and Analytics</h3>
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
                  <h3 className="text-lg font-medium mb-2">4.3 Communication</h3>
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
                  <h3 className="text-lg font-medium mb-2">4.4 Security and Fraud Prevention</h3>
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
                  <h3 className="text-lg font-medium mb-2">4.5 Legal and Compliance</h3>
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
                  <h3 className="text-lg font-medium mb-2">4.6 What We Do NOT Do</h3>
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
                5. INFORMATION SHARING AND DISCLOSURE
              </h2>
              
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium mb-3">5.1 Service Providers (Sub-Processors)</h3>
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
                  <h3 className="text-lg font-medium mb-2">5.2 Legal Requirements</h3>
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
                  <h3 className="text-lg font-medium mb-2">5.3 Business Transfers</h3>
                  <p className="text-muted-foreground text-sm mb-2">If ERMITS is involved in a merger, acquisition, asset sale, or bankruptcy:</p>
                  <ul className="list-disc ml-6 space-y-1 text-muted-foreground text-sm">
                    <li>User information may be transferred as part of the business assets</li>
                    <li>We will provide notice before information is transferred</li>
                    <li>The successor entity will be bound by this Privacy Policy</li>
                    <li>You will have the option to delete your data before transfer</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-medium mb-2">5.4 Consent-Based Sharing</h3>
                  <p className="text-muted-foreground text-sm mb-2">We may share information with your explicit consent for purposes such as:</p>
                  <ul className="list-disc ml-6 space-y-1 text-muted-foreground text-sm">
                    <li>Integration with third-party tools you authorize</li>
                    <li>Sharing data with your organization's administrators</li>
                    <li>Public testimonials or case studies (with identifying information only if you approve)</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-medium mb-2">5.5 Aggregated and Anonymous Data</h3>
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
                6. DATA SECURITY MEASURES
              </h2>
              
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium mb-3">6.1 Encryption</h3>
                  
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
                  <h3 className="text-lg font-medium mb-3">6.2 Access Controls</h3>
                  <ul className="list-disc ml-6 space-y-2 text-muted-foreground text-sm">
                    <li><strong>Multi-Factor Authentication (MFA):</strong> Available for all accounts, required for administrators</li>
                    <li><strong>Role-Based Access Control (RBAC):</strong> Granular permissions based on user roles</li>
                    <li><strong>Row-Level Security (RLS):</strong> Database-level isolation ensuring users can only access their own data</li>
                    <li><strong>Principle of Least Privilege:</strong> Internal access limited to minimum necessary</li>
                    <li><strong>Access Logging:</strong> All data access logged for audit and security monitoring</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-medium mb-3">6.3 Infrastructure Security</h3>
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
                  <h3 className="text-lg font-medium mb-3">6.4 Application Security</h3>
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
                  <h3 className="text-lg font-medium mb-3">6.5 Employee and Contractor Access</h3>
                  <ul className="list-disc ml-6 space-y-1 text-muted-foreground text-sm">
                    <li>Background checks for employees with data access</li>
                    <li>Confidentiality agreements and security training</li>
                    <li>Access granted only on need-to-know basis</li>
                    <li>Regular access reviews and revocations</li>
                    <li>Monitoring and logging of all employee data access</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-medium mb-3">6.6 Security Incident Response</h3>
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
                7. DATA RETENTION
              </h2>
              
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium mb-3">7.1 Active Account Data</h3>
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
                  <h3 className="text-lg font-medium mb-2">7.2 Product-Specific Retention</h3>
                  <p className="text-muted-foreground text-sm mb-2">When you delete your account or request data deletion:</p>
                  <ul className="list-disc ml-6 space-y-1 text-muted-foreground text-sm">
                    <li><strong>Immediate:</strong> Account access disabled, data marked for deletion</li>
                    <li><strong>Within 30 days:</strong> User Data permanently deleted from production systems</li>
                    <li><strong>Within 90 days:</strong> Backup copies permanently deleted</li>
                    <li><strong>Exceptions:</strong> Data retained longer only where legally required</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-medium mb-2">7.3 Deleted Accounts</h3>
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
                  <h3 className="text-lg font-medium mb-2">7.4 Data Deletion Verification</h3>
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
                8. YOUR PRIVACY RIGHTS
              </h2>
              
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium mb-3">8.1 Universal Rights (All Users)</h3>
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
                  <h3 className="text-lg font-medium mb-3">8.2 Additional Rights for EU/UK/Swiss Users (GDPR)</h3>
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
                  <h3 className="text-lg font-medium mb-3">8.3 Additional Rights for California Residents (CCPA/CPRA)</h3>
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
                  <h3 className="text-lg font-medium mb-3">8.4 Additional Rights for Other Jurisdictions</h3>
                  <p className="text-muted-foreground mb-3 text-sm">
                    Additional rights may apply based on location (Canada PIPEDA, Brazil LGPD, Australia Privacy Act, etc.)
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-medium mb-3">8.5 Exercising Your Rights</h3>
                  
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
                9. INTERNATIONAL DATA TRANSFERS
              </h2>
              
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium mb-3">9.1 Data Processing Locations</h3>
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
                  <h3 className="text-lg font-medium mb-3">9.2 Safeguards for International Transfers</h3>
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
                      <li>Custom deployment configurations (contact sales for options)</li>
                    </ul>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-medium mb-3">9.3 UK and Swiss Transfers</h3>
                  
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

                <div>
                  <h3 className="text-lg font-medium mb-3">9.4 No Adequacy Decision Reliance</h3>
                  <p className="text-muted-foreground text-sm">
                    ERMITS does not rely solely on adequacy decisions for international transfers. We implement Standard Contractual Clauses and additional safeguards regardless of adequacy status to ensure ongoing compliance even if adequacy decisions are invalidated.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Children's Privacy */}
          <Card>
            <CardContent className="p-6">
              <h2 className="text-2xl font-semibold mb-4 flex items-center">
                <UserCheck className="h-6 w-6 text-primary mr-2" />
                10. CHILDREN'S PRIVACY
              </h2>
              
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium mb-3">10.1 Age Restrictions</h3>
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
                  <h3 className="text-lg font-medium mb-3">10.2 Parental Rights</h3>
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
                  <h3 className="text-lg font-medium mb-3">10.3 Educational Use</h3>
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
                11. PRODUCT-SPECIFIC PRIVACY CONSIDERATIONS
              </h2>
              
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium mb-3">11.1 ERMITS Advisory + STEEL™</h3>
                  <p className="text-muted-foreground mb-3 text-sm">
                    <strong>What We Collect:</strong>
                  </p>
                  <ul className="list-disc ml-6 space-y-1 text-muted-foreground text-sm">
                    <li>Contact information (name, email, company) for consultation scheduling</li>
                    <li>Billing information (via Stripe) for paid advisory services</li>
                    <li>Communication history (emails, meeting notes) for service delivery</li>
                  </ul>
                  <p className="text-muted-foreground mb-3 text-sm mt-3">
                    <strong>What We Do NOT Collect:</strong>
                  </p>
                  <ul className="list-disc ml-6 space-y-1 text-muted-foreground text-sm">
                    <li>STEEL assessment responses (processed client-side or recorded by you)</li>
                    <li>Strategic recommendations or advisory deliverables (owned by you)</li>
                    <li>Proprietary business information or trade secrets</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-medium mb-3">11.2 SocialCaution</h3>
                  <p className="text-muted-foreground mb-3 text-sm">
                    <strong>What We Collect:</strong>
                  </p>
                  <ul className="list-disc ml-6 space-y-1 text-muted-foreground text-sm">
                    <li>Minimal account information (email for login, optional)</li>
                    <li>User preferences (theme, notification settings)</li>
                    <li>Anonymous aggregate statistics (opt-in only)</li>
                  </ul>
                  <p className="text-muted-foreground mb-3 text-sm mt-3">
                    <strong>What We Do NOT Collect:</strong>
                  </p>
                  <ul className="list-disc ml-6 space-y-1 text-muted-foreground text-sm">
                    <li>Privacy assessment responses (processed 100% client-side)</li>
                    <li>Personal data entered into assessments</li>
                    <li>Service usage details or persona detection results</li>
                    <li>Any identifiable information about your privacy posture</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-medium mb-3">11.3 TechnoSoluce™ (SBOM Analyzer)</h3>
                  <p className="text-muted-foreground mb-3 text-sm">
                    <strong>What We Collect:</strong>
                  </p>
                  <ul className="list-disc ml-6 space-y-1 text-muted-foreground text-sm">
                    <li>Account information (email, name) if you create an account</li>
                    <li>Payment information (via Stripe) for premium features</li>
                  </ul>
                  <p className="text-muted-foreground mb-3 text-sm mt-3">
                    <strong>What We Do NOT Collect:</strong>
                  </p>
                  <ul className="list-disc ml-6 space-y-1 text-muted-foreground text-sm">
                    <li>SBOM files or contents (processed 100% client-side)</li>
                    <li>Software component lists or dependency graphs</li>
                    <li>Vulnerability analysis results</li>
                    <li>Package metadata or software inventories</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-medium mb-3">11.4 CyberCertitude™ (CMMC Compliance)</h3>
                  <p className="text-muted-foreground mb-3 text-sm">
                    <strong>Toolkit (localStorage-based):</strong>
                  </p>
                  <ul className="list-disc ml-6 space-y-1 text-muted-foreground text-sm">
                    <li>No data collected: 100% local storage in browser</li>
                    <li>No account required: Anonymous use</li>
                    <li>No transmission: Zero data sent to ERMITS servers</li>
                  </ul>
                  <p className="text-muted-foreground mb-3 text-sm mt-3">
                    <strong>Level 1 & Level 2 Platform (Cloud-Enabled):</strong>
                  </p>
                  <ul className="list-disc ml-6 space-y-1 text-muted-foreground text-sm">
                    <li>Account information (name, email, company)</li>
                    <li>Encrypted compliance data (if cloud sync enabled)</li>
                    <li>Zero-knowledge E2EE with user-managed keys</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-medium mb-3">11.5 VendorSoluce™</h3>
                  <p className="text-muted-foreground mb-3 text-sm">
                    Vendor assessment data encrypted before transmission. SBOM analysis performed client-side.
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-medium mb-3">11.6 CyberCorrect™ (Privacy Compliance)</h3>
                  <p className="text-muted-foreground mb-3 text-sm">
                    Privacy assessments and DPIA documentation encrypted. Employee personal data remains in your HRIS.
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-medium mb-3">11.7 CyberCaution™ (Security Assessments)</h3>
                  <p className="text-muted-foreground mb-3 text-sm">
                    Browser-based assessments: 100% local processing, no data collected. Cloud-enabled: Encrypted security assessment data.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Special Considerations */}
          <Card>
            <CardContent className="p-6">
              <h2 className="text-2xl font-semibold mb-4 flex items-center">
                <Shield className="h-6 w-6 text-primary mr-2" />
                12. SPECIAL CONSIDERATIONS
              </h2>
              
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium mb-3">12.1 Federal Contractor Privacy</h3>
                  <p className="text-muted-foreground mb-3 text-sm">
                    For users handling Controlled Unclassified Information (CUI) or Federal Contract Information (FCI):
                  </p>
                  
                  <div className="mb-4">
                    <strong className="text-foreground text-sm">Privacy-First Architecture Benefits:</strong>
                    <ul className="list-disc ml-6 space-y-1 text-muted-foreground text-sm mt-2">
                      <li>CUI/FCI processed client-side; never transmitted to ERMITS</li>
                      <li>Zero-knowledge encryption ensures ERMITS cannot access CUI/FCI</li>
                      <li>Local storage options eliminate cloud transmission of sensitive data</li>
                      <li>You maintain complete control over CUI/FCI data</li>
                    </ul>
                  </div>
                  
                  <div>
                    <strong className="text-foreground text-sm">Your Responsibilities:</strong>
                    <ul className="list-disc ml-6 space-y-1 text-muted-foreground text-sm mt-2">
                      <li>Properly mark and handle CUI/FCI according to NIST SP 800-171 and 32 CFR Part 2002</li>
                      <li>Use encryption features and self-managed deployment options for CUI/FCI</li>
                      <li>Implement appropriate access controls per DFARS requirements</li>
                      <li>Maintain audit logs for CUI/FCI access</li>
                      <li>Report cyber incidents as required by DFARS 252.204-7012 (within 72 hours to DoD)</li>
                    </ul>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-medium mb-3">12.2 Healthcare Privacy (HIPAA)</h3>
                  <p className="text-muted-foreground mb-3 text-sm">
                    <strong>Business Associate Agreement (BAA) Available:</strong>
                  </p>
                  <ul className="list-disc ml-6 space-y-1 text-muted-foreground text-sm">
                    <li>Required for healthcare customers processing PHI</li>
                    <li>Contact: <a href="mailto:privacy@ermits.com" className="text-primary hover:underline">privacy@ermits.com</a> to execute BAA</li>
                    <li>HIPAA-compliant infrastructure and safeguards</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-medium mb-3">12.3 Financial Services Privacy</h3>
                  <p className="text-muted-foreground mb-3 text-sm">
                    For financial institutions subject to GLBA, SOX, or PCI-DSS. SOC 2 Type II certification in progress.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Updates to This Privacy Policy */}
          <Card>
            <CardContent className="p-6">
              <h2 className="text-2xl font-semibold mb-4 flex items-center">
                <FileText className="h-6 w-6 text-primary mr-2" />
                13. UPDATES TO THIS PRIVACY POLICY
              </h2>
              
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium mb-3">13.1 Policy Updates</h3>
                  <p className="text-muted-foreground mb-3 text-sm">
                    We may update this Privacy Policy periodically to reflect:
                  </p>
                  <ul className="list-disc ml-6 space-y-1 text-muted-foreground text-sm">
                    <li>Changes in data practices or Services</li>
                    <li>New product launches or features</li>
                    <li>Legal or regulatory developments</li>
                    <li>Technological improvements</li>
                    <li>User feedback and industry best practices</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-medium mb-3">13.2 Notification of Changes</h3>
                  
                  <div className="mb-4">
                    <strong className="text-foreground text-sm">Material Changes:</strong>
                    <p className="text-muted-foreground text-sm mb-2 mt-1">For significant changes affecting your rights or data practices:</p>
                    <ul className="list-disc ml-6 space-y-1 text-muted-foreground text-sm">
                      <li><strong>30 Days' Advance Notice:</strong> Email notification and in-app announcement</li>
                      <li><strong>Prominent Display:</strong> Notice displayed on website and in Services</li>
                      <li><strong>Opt-Out Option:</strong> Option to export data and close account before changes take effect</li>
                      <li><strong>Continued Use:</strong> Continued use after effective date constitutes acceptance</li>
                    </ul>
                  </div>
                  
                  <div>
                    <strong className="text-foreground text-sm">Non-Material Changes:</strong>
                    <p className="text-muted-foreground text-sm mb-2 mt-1">For clarifications, formatting, or minor updates:</p>
                    <ul className="list-disc ml-6 space-y-1 text-muted-foreground text-sm">
                      <li>Update "Last Updated" date at top of policy</li>
                      <li>Changes effective immediately upon posting</li>
                      <li>Continued use constitutes acceptance</li>
                    </ul>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-medium mb-2">13.3 Version History</h3>
                  <p className="text-muted-foreground text-sm">
                    Previous versions of this Privacy Policy are available upon request: <a href="mailto:privacy@ermits.com" className="text-primary hover:underline">privacy@ermits.com</a>
                  </p>
                  <p className="text-muted-foreground text-sm mt-2">
                    <strong>Current Version:</strong> 2.0 (January 2025)
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
                14. CONTACT INFORMATION
              </h2>
              
              <div className="space-y-3 text-muted-foreground">
                <p><strong>Privacy Inquiries:</strong></p>
                <p>Email: <a href="mailto:privacy@ermits.com?subject=Privacy Inquiry" className="text-primary hover:underline">privacy@ermits.com</a> | Subject: "Privacy Inquiry"</p>
                
                <p className="mt-4"><strong>Data Rights Requests:</strong></p>
                <p>Email: <a href="mailto:privacy@ermits.com?subject=Privacy Rights Request" className="text-primary hover:underline">privacy@ermits.com</a> | Subject: "Privacy Rights Request - [Type]"</p>
                
                <p className="mt-4"><strong>Data Protection Officer (EU/UK/Swiss):</strong></p>
                <p>Email: <a href="mailto:privacy@ermits.com?subject=GDPR Inquiry - DPO" className="text-primary hover:underline">privacy@ermits.com</a> | Subject: "GDPR Inquiry - DPO"</p>
                
                <p className="mt-4"><strong>California Privacy Requests (CCPA/CPRA):</strong></p>
                <p>Email: <a href="mailto:privacy@ermits.com?subject=CCPA Request" className="text-primary hover:underline">privacy@ermits.com</a> | Subject: "CCPA Request"</p>
                
                <p className="mt-4"><strong>HIPAA Privacy Officer (Healthcare):</strong></p>
                <p>Email: <a href="mailto:privacy@ermits.com?subject=HIPAA Privacy Matter" className="text-primary hover:underline">privacy@ermits.com</a> | Subject: "HIPAA Privacy Matter"</p>
                
                <p className="mt-4"><strong>Security Concerns:</strong></p>
                <p>Email: <a href="mailto:contact@ermits.com?subject=Security Issue" className="text-primary hover:underline">contact@ermits.com</a> | Subject: "Security Issue - [Urgent/Non-Urgent]"</p>
              </div>
            </CardContent>
          </Card>

          {/* Effective Date and Acceptance */}
          <Card>
            <CardContent className="p-6">
              <h2 className="text-2xl font-semibold mb-4 flex items-center">
                <FileText className="h-6 w-6 text-primary mr-2" />
                15. EFFECTIVE DATE AND ACCEPTANCE
              </h2>
              
              <div className="space-y-3 text-muted-foreground">
                <p><strong>Effective Date:</strong> October 31, 2025</p>
                <p><strong>Last Updated:</strong> December 13, 2025</p>
                <p className="mt-4">
                  <strong>By using ERMITS Services, you acknowledge that you have read, understood, and agree to be bound by this Privacy Policy.</strong>
                </p>
                <p>
                  If you do not agree with this Privacy Policy, you must discontinue use of all ERMITS Services immediately.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="mt-8 text-center">
          <p className="text-sm text-muted-foreground mb-2">Last Updated: December 13, 2025</p>
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
            <Link to="/ecommerce">
              <Button variant="outline">E-Commerce Policies</Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Privacy;

