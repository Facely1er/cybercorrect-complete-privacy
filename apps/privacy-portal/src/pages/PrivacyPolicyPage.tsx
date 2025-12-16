import { Link } from 'react-router-dom';
import { ArrowLeft, Mail, Lock, Database, Globe, Users } from 'lucide-react';
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
              <strong>Effective Date:</strong> October 31, 2025 | <strong>Last Updated:</strong> December 13, 2025
            </p>
          </div>

          <div className="bg-card rounded-lg border p-8 space-y-12 prose prose-lg max-w-none">
            {/* Introduction */}
            <div className="bg-gray-50 dark:bg-gray-800/50 border-l-4 border-primary p-6 rounded-r-lg mb-8">
              <p className="text-muted-foreground leading-relaxed text-base mb-4">
                ERMITS LLC ("ERMITS," "we," "our," or "us") is committed to protecting your privacy through a Privacy-First Architecture that ensures you maintain control over your data. This Privacy Policy explains how we collect, use, disclose, and safeguard information when you use our Services across all ERMITS product lines.
              </p>
              <p className="text-muted-foreground leading-relaxed text-base">
                By using our Services, you consent to the data practices described in this policy. If you do not agree with this Privacy Policy, please do not use our Services.
              </p>
            </div>

            {/* Section 1: Scope and Applicability */}
            <section>
              <h2 id="section-1" className="text-2xl font-bold mb-6 pb-3 border-b">1. SCOPE AND APPLICABILITY</h2>
              
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-semibold mb-4">1.1 Services Covered</h3>
                  <p className="text-muted-foreground leading-relaxed mb-4">
                    This Privacy Policy applies to all ERMITS products and services, including:
                  </p>
                  <div className="bg-gray-50 dark:bg-gray-800/30 rounded-lg p-6 space-y-4">
                    <div className="border-l-4 border-blue-500 pl-4">
                      <p className="font-bold mb-2">CyberSoluce™:</p>
                      <ul className="list-disc pl-6 space-y-1 text-muted-foreground">
                        <li>Enhanced Asset Inventory Management Platform</li>
                        <li>Dependency-aware visibility into asset inventory</li>
                        <li>Focus signals for attention areas</li>
                        <li>Service funneling guidance toward appropriate ERMITS services</li>
                      </ul>
                    </div>
                    <div className="border-l-4 border-indigo-500 pl-4">
                      <p className="font-bold mb-2">SocialCaution:</p>
                      <ul className="list-disc pl-6 space-y-1 text-muted-foreground">
                        <li>Personalized privacy platform</li>
                        <li>AI-powered persona detection</li>
                        <li>Privacy exposure index and risk scoring</li>
                        <li>Service catalog with privacy risk profiles</li>
                      </ul>
                    </div>
                    <div className="border-l-4 border-yellow-500 pl-4">
                      <p className="font-bold mb-2">TechnoSoluce™:</p>
                      <ul className="list-disc pl-6 space-y-1 text-muted-foreground">
                        <li>SBOM (Software Bill of Materials) Analyzer</li>
                        <li>Software supply chain security and vulnerability analysis</li>
                        <li>Client-side SBOM processing</li>
                      </ul>
                    </div>
                    <div className="border-l-4 border-orange-500 pl-4">
                      <p className="font-bold mb-2">CyberCertitude™:</p>
                      <ul className="list-disc pl-6 space-y-1 text-muted-foreground">
                        <li>CMMC 2.0 Level 1 Implementation Suite</li>
                        <li>CMMC 2.0 Level 2 Compliance Platform</li>
                        <li>NIST SP 800-171 assessment and compliance tools</li>
                        <li>Original Toolkit (localStorage-based compliance management)</li>
                      </ul>
                    </div>
                    <div className="border-l-4 border-green-500 pl-4">
                      <p className="font-bold mb-2">VendorSoluce™:</p>
                      <ul className="list-disc pl-6 space-y-1 text-muted-foreground">
                        <li>Supply Chain Risk Management Platform</li>
                        <li>Vendor assessment and monitoring</li>
                        <li>Third-party risk evaluation</li>
                      </ul>
                    </div>
                    <div className="border-l-4 border-blue-500 pl-4">
                      <p className="font-bold mb-2">CyberCorrect™:</p>
                      <ul className="list-disc pl-6 space-y-1 text-muted-foreground">
                        <li>Privacy Portal (workplace privacy compliance)</li>
                        <li>Privacy Platform (multi-regulation privacy compliance automation)</li>
                        <li>Data subject rights management</li>
                      </ul>
                    </div>
                    <div className="border-l-4 border-indigo-500 pl-4">
                      <p className="font-bold mb-2">CyberCaution™:</p>
                      <ul className="list-disc pl-6 space-y-1 text-muted-foreground">
                        <li>RansomCheck (ransomware readiness assessment)</li>
                        <li>Security Toolkit (comprehensive cybersecurity assessments)</li>
                        <li>RiskProfessional (CISA-aligned security assessments)</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-xl font-semibold mb-4">1.2 Geographic Scope</h3>
                  <p className="text-muted-foreground leading-relaxed mb-4">
                    This Privacy Policy applies to users worldwide and complies with:
                  </p>
                  <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                    <li>General Data Protection Regulation (GDPR) - European Union, United Kingdom, Switzerland</li>
                    <li>California Consumer Privacy Act (CCPA) / California Privacy Rights Act (CPRA)</li>
                    <li>Personal Information Protection and Electronic Documents Act (PIPEDA) - Canada</li>
                    <li>Lei Geral de Proteção de Dados (LGPD) - Brazil</li>
                    <li>Other applicable privacy and data protection laws</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* Section 2: Privacy-First Architecture Overview */}
            <section>
              <h2 id="section-2" className="text-2xl font-bold mb-6 pb-3 border-b">2. PRIVACY-FIRST ARCHITECTURE OVERVIEW</h2>
              
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-semibold mb-4">2.1 Core Privacy Principles</h3>
                  <p className="text-muted-foreground leading-relaxed mb-4">
                    ERMITS implements Privacy-First Architecture built on five fundamental principles that distinguish our approach:
                  </p>
                  <div className="space-y-6">
                    <div>
                      <h4 className="font-semibold mb-3">1. Client-Side Processing</h4>
                      <p className="text-muted-foreground leading-relaxed mb-2">All core computational functions are performed locally within your browser or self-managed environment whenever technically feasible:</p>
                      <ul className="list-disc pl-6 text-muted-foreground space-y-1">
                        <li>Security Assessments: CMMC, cybersecurity assessments processed in your browser</li>
                        <li>Asset Inventory: CyberSoluce asset data processed client-side</li>
                        <li>SBOM Analysis: TechnoSoluce processes SBOM files entirely client-side</li>
                        <li>Risk Scoring: All risk calculations performed locally</li>
                        <li>Compliance Evaluations: Assessment scoring and gap analysis done in your browser</li>
                        <li>Privacy Analysis: SocialCaution persona detection runs entirely client-side</li>
                      </ul>
                      <p className="text-muted-foreground leading-relaxed mt-2 italic">Your data remains under your control throughout the analysis process.</p>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-3">2. Data Sovereignty Options</h4>
                      <p className="text-muted-foreground leading-relaxed mb-2">You choose where your data resides:</p>
                      <ul className="list-disc pl-6 text-muted-foreground space-y-1">
                        <li><strong>Local-Only Mode:</strong> All data stored exclusively in your browser (IndexedDB, localStorage)</li>
                        <li><strong>Self-Managed Cloud:</strong> Deploy to your own cloud infrastructure with full control (AWS, Azure, GCP)</li>
                        <li><strong>ERMITS-Managed Cloud:</strong> Optional encrypted cloud synchronization with zero-knowledge architecture</li>
                        <li><strong>Hybrid Deployment:</strong> Local processing with selective encrypted cloud backup</li>
                        <li><strong>On-Premises:</strong> Enterprise customers can deploy on their own infrastructure</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-3">3. Zero-Knowledge Encryption</h4>
                      <p className="text-muted-foreground leading-relaxed mb-2">When using ERMITS-managed cloud features with encryption enabled:</p>
                      <ul className="list-disc pl-6 text-muted-foreground space-y-1">
                        <li>Data is encrypted client-side using <strong>AES-256-GCM</strong> before transmission</li>
                        <li>Encryption keys are <strong>derived from your credentials</strong> using PBKDF2 and never transmitted to ERMITS</li>
                        <li>ERMITS <strong>cannot decrypt, access, or view</strong> your encrypted data</li>
                        <li>You are <strong>solely responsible</strong> for maintaining access to encryption keys</li>
                        <li><strong>Lost keys = permanent data loss</strong> (we cannot recover your data)</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-3">4. Data Minimization</h4>
                      <p className="text-muted-foreground leading-relaxed mb-2">We collect only the minimum data necessary for service functionality:</p>
                      <p className="font-semibold text-foreground mt-3 mb-1">Never Collected:</p>
                      <ul className="list-disc pl-6 text-muted-foreground space-y-1 mb-3">
                        <li>Asset inventory data and dependency information</li>
                        <li>Raw SBOM files, component lists, dependency graphs</li>
                        <li>Assessment content, responses, or findings</li>
                        <li>Vulnerability scan results or CVE data</li>
                        <li>Compliance documentation (SSPs, POA&Ms, evidence)</li>
                        <li>CUI (Controlled Unclassified Information)</li>
                        <li>FCI (Federal Contract Information)</li>
                        <li>PHI (Protected Health Information)</li>
                        <li>Proprietary business data or trade secrets</li>
                      </ul>
                      <p className="font-semibold text-foreground mt-3 mb-1">Optionally Collected:</p>
                      <ul className="list-disc pl-6 text-muted-foreground space-y-1">
                        <li>Account information (name, email, company) - only when you create an account</li>
                        <li>Pseudonymized telemetry (anonymous performance metrics) - opt-in only</li>
                        <li>Encrypted user data (if cloud sync enabled) - we cannot decrypt</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-3">5. Transparency and Control</h4>
                      <p className="text-muted-foreground leading-relaxed mb-2">You have complete control over your data:</p>
                      <ul className="list-disc pl-6 text-muted-foreground space-y-1">
                        <li><strong>Export</strong> all data at any time in standard formats (JSON, CSV, PDF)</li>
                        <li><strong>Delete</strong> all data permanently with one click</li>
                        <li><strong>Opt in or opt out</strong> of telemetry collection anytime</li>
                        <li><strong>Choose</strong> your deployment and storage model</li>
                        <li><strong>Review</strong> detailed data flow documentation for each product</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-xl font-semibold mb-3">2.2 Privacy-First Implementation by Product</h3>
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
                          <td className="border border-gray-300 dark:border-gray-700 px-4 py-2"><strong>CyberSoluce Asset Inventory</strong></td>
                          <td className="border border-gray-300 dark:border-gray-700 px-4 py-2">Client-side with optional sync</td>
                          <td className="border border-gray-300 dark:border-gray-700 px-4 py-2">Local, self-managed, or ERMITS cloud</td>
                          <td className="border border-gray-300 dark:border-gray-700 px-4 py-2">AES-256-GCM E2EE</td>
                        </tr>
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
                        <tr>
                          <td className="border border-gray-300 dark:border-gray-700 px-4 py-2"><strong>SocialCaution</strong></td>
                          <td className="border border-gray-300 dark:border-gray-700 px-4 py-2">100% client-side</td>
                          <td className="border border-gray-300 dark:border-gray-700 px-4 py-2">Local browser storage only</td>
                          <td className="border border-gray-300 dark:border-gray-700 px-4 py-2">Optional local encryption</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </section>

            {/* Section 3: Information We Collect */}
            <section>
              <h2 id="section-3" className="text-2xl font-bold mb-6 pb-3 border-b">3. INFORMATION WE COLLECT</h2>
              
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-semibold mb-4">3.1 Information You Provide Directly</h3>
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
                  <h3 className="text-xl font-semibold mb-4">3.2 Information We Do NOT Collect</h3>
                  <div className="bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500 p-6 rounded-r-lg my-6">
                    <p className="font-bold text-foreground mb-3">ERMITS explicitly does NOT collect, access, store, or transmit:</p>

                    <p className="font-semibold text-foreground mt-4 mb-2">Assessment and Analysis Data:</p>
                    <ul className="list-disc pl-6 text-muted-foreground space-y-1">
                      <li>Asset inventory data and dependency information</li>
                      <li>Security assessment responses or scores</li>
                      <li>CMMC compliance assessments or documentation</li>
                      <li>Cybersecurity evaluation results</li>
                      <li>Privacy assessments or persona analysis results</li>
                    </ul>

                    <p className="font-semibold text-foreground mt-4 mb-2">Technical Data:</p>
                    <ul className="list-disc pl-6 text-muted-foreground space-y-1">
                      <li>SBOM (Software Bill of Materials) files or contents</li>
                      <li>Software component lists or dependency graphs</li>
                      <li>Vulnerability scan results or CVE findings</li>
                      <li>Package metadata or software inventories</li>
                    </ul>

                    <p className="font-semibold text-foreground mt-4 mb-2">Compliance and Regulatory Data:</p>
                    <ul className="list-disc pl-6 text-muted-foreground space-y-1">
                      <li>System Security Plans (SSPs)</li>
                      <li>Plans of Action and Milestones (POA&Ms)</li>
                      <li>Compliance evidence or audit documentation</li>
                      <li>Certification materials or assessment reports</li>
                    </ul>

                    <p className="font-semibold text-foreground mt-4 mb-2">Controlled Information:</p>
                    <ul className="list-disc pl-6 text-muted-foreground space-y-1">
                      <li>CUI (Controlled Unclassified Information)</li>
                      <li>FCI (Federal Contract Information)</li>
                      <li>PHI (Protected Health Information) under HIPAA</li>
                      <li>PCI data (payment card information) except via Stripe</li>
                    </ul>

                    <p className="font-semibold text-foreground mt-4 mb-2">Business Data:</p>
                    <ul className="list-disc pl-6 text-muted-foreground space-y-1">
                      <li>Trade secrets or proprietary information</li>
                      <li>Confidential business strategies</li>
                      <li>Financial records (except billing data)</li>
                      <li>Customer lists or business relationships</li>
                    </ul>

                    <p className="text-muted-foreground italic mt-4">Due to our client-side processing model, this data is processed entirely in your browser or local environment. It never leaves your device unless you explicitly enable cloud sync with encryption.</p>
                  </div>
                </div>

                <div>
                  <h3 className="text-xl font-semibold mb-4">3.3 Automatically Collected Information</h3>
                  <div className="bg-gray-50 dark:bg-gray-800/30 rounded-lg p-6 my-6">
                    <p className="font-bold text-foreground mb-3">Pseudonymized Telemetry (Optional - Opt-In Required):</p>
                    <p className="text-muted-foreground mb-2">With your explicit consent, we collect anonymous, aggregated performance data:</p>

                    <p className="font-semibold text-foreground mt-3 mb-1">What We Collect:</p>
                    <ul className="list-disc pl-6 text-muted-foreground space-y-1">
                      <li>Feature usage statistics (which tools are used, how often)</li>
                      <li>Performance metrics (page load times, API response times)</li>
                      <li>Error reports (crash logs, exceptions) with PII automatically scrubbed by Sentry</li>
                      <li>Browser and device information (browser type/version, OS, screen resolution)</li>
                      <li>Session metadata (session duration, navigation paths, timestamps)</li>
                    </ul>

                    <p className="font-semibold text-foreground mt-4 mb-1">Privacy Protections:</p>
                    <ul className="list-disc pl-6 text-muted-foreground space-y-1">
                      <li><strong>Irreversible Pseudonymization:</strong> User identifiers are cryptographically hashed (SHA-256) and cannot be reverse-engineered</li>
                      <li><strong>No Content Data:</strong> Telemetry never includes file contents, assessment results, or user inputs</li>
                      <li><strong>Differential Privacy:</strong> PostHog analytics use differential privacy techniques to prevent individual identification</li>
                      <li><strong>Opt-Out Available:</strong> You can disable telemetry at any time in account settings with retroactive deletion</li>
                      <li><strong>Aggregate Only:</strong> Data used only in aggregate; individual user behavior cannot be identified</li>
                    </ul>
                  </div>
                  <div className="bg-gray-50 dark:bg-gray-800/30 rounded-lg p-6 my-6">
                    <p className="font-bold text-foreground mb-3">Technical and Security Data:</p>

                    <p className="font-semibold text-foreground mt-3 mb-1">IP Addresses:</p>
                    <ul className="list-disc pl-6 text-muted-foreground space-y-1">
                      <li><strong>Collected for:</strong> Security monitoring, rate limiting, geolocation for service delivery</li>
                      <li><strong>Not linked to:</strong> User accounts or identifiable information</li>
                      <li><strong>Retention:</strong> 90 days in server logs, then automatically deleted</li>
                      <li><strong>Use:</strong> Fraud prevention, DDoS protection, regional service optimization</li>
                    </ul>

                    <p className="font-semibold text-foreground mt-3 mb-1">Server Logs:</p>
                    <ul className="list-disc pl-6 text-muted-foreground space-y-1">
                      <li>Standard web server access logs (timestamp, HTTP method, endpoint, status code, IP)</li>
                      <li>Error logs for debugging and system monitoring</li>
                      <li>Retention: 90 days, then automatically deleted</li>
                      <li>Access: Restricted to security and engineering teams only</li>
                    </ul>

                    <p className="font-semibold text-foreground mt-3 mb-1">Cookies and Similar Technologies:</p>
                    <ul className="list-disc pl-6 text-muted-foreground space-y-1">
                      <li>See our separate <Link to="/cookie-policy" className="text-primary hover:underline">Cookie Policy</Link> for detailed information</li>
                      <li>Essential cookies for authentication and security only (required)</li>
                      <li>Optional cookies for analytics and preferences (opt-in)</li>
                    </ul>
                  </div>
                </div>

                <div>
                  <h3 className="text-xl font-semibold mb-4">3.4 Information from Third Parties</h3>
                  <div className="bg-gray-50 dark:bg-gray-800/30 rounded-lg p-6 my-6">
                    <p className="font-bold text-foreground mb-3">Authentication Providers (OAuth):</p>
                    <p className="text-muted-foreground mb-2">If you use OAuth for authentication (Google, Microsoft, GitHub), we receive:</p>
                    <ul className="list-disc pl-6 text-muted-foreground space-y-1">
                      <li>Name and email address from the provider</li>
                      <li>Profile information you choose to share with the provider's permission</li>
                      <li>Provider's unique identifier for your account (for account linking)</li>
                    </ul>
                    <p className="text-muted-foreground italic mt-2">We do not access your contacts, files, or other data from these providers.</p>
                  </div>
                  <div className="bg-gray-50 dark:bg-gray-800/30 rounded-lg p-6 my-6">
                    <p className="font-bold text-foreground mb-3">Payment Processor (Stripe):</p>
                    <p className="text-muted-foreground mb-2">Stripe provides us with:</p>
                    <ul className="list-disc pl-6 text-muted-foreground space-y-1">
                      <li>Payment success/failure status</li>
                      <li>Subscription status and billing cycle information</li>
                      <li>Last 4 digits of payment method (for your reference)</li>
                      <li>Billing address (for tax compliance)</li>
                    </ul>
                    <p className="text-muted-foreground italic mt-2">We do not receive or store complete payment card numbers.</p>
                  </div>
                  <div className="bg-gray-50 dark:bg-gray-800/30 rounded-lg p-6 my-6">
                    <p className="font-bold text-foreground mb-3">Vulnerability Databases (Public APIs):</p>
                    <p className="text-muted-foreground mb-2">When you use SBOM analysis or security assessment tools, your browser makes anonymous, client-side queries to:</p>
                    <ul className="list-disc pl-6 text-muted-foreground space-y-1">
                      <li><strong>OSV.dev</strong> (Google Open Source Vulnerabilities)</li>
                      <li><strong>NIST National Vulnerability Database (NVD)</strong></li>
                      <li><strong>CISA Known Exploited Vulnerabilities (KEV) catalog</strong></li>
                    </ul>

                    <p className="font-semibold text-foreground mt-4 mb-1">Privacy Protection:</p>
                    <ul className="list-disc pl-6 text-muted-foreground space-y-1">
                      <li>Queries performed <strong>client-side</strong> directly from your browser</li>
                      <li>Only public component identifiers sent (package name, version)</li>
                      <li>No proprietary information, file paths, or business context transmitted</li>
                      <li>ERMITS does not track or log your queries to these services</li>
                      <li>These services may have their own logging policies (outside ERMITS control)</li>
                    </ul>
                  </div>
                </div>
              </div>
            </section>

            {/* Section 4: How We Use Information */}
            <section>
              <h2 id="section-4" className="text-2xl font-bold mb-6 pb-3 border-b">4. HOW WE USE INFORMATION</h2>
              
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-semibold mb-4">4.1 Service Delivery and Operation</h3>
                  <p className="text-muted-foreground mb-2">We use collected information to:</p>
                  <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                    <li><strong>Provide Services:</strong> Deliver CyberSoluce, SocialCaution, TechnoSoluce, CyberCertitude, VendorSoluce, CyberCorrect, and CyberCaution services</li>
                    <li><strong>Process Transactions:</strong> Handle subscriptions, billing, and payment confirmations</li>
                    <li><strong>Authenticate Users:</strong> Verify identity and maintain account security</li>
                    <li><strong>Enable Features:</strong> Provide cloud synchronization, multi-device access, collaboration features (when opted-in)</li>
                    <li><strong>Customer Support:</strong> Respond to inquiries, troubleshoot issues, provide technical assistance</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-xl font-semibold mb-4">4.2 Service Improvement and Analytics</h3>
                  <p className="text-muted-foreground mb-2">We use pseudonymized, aggregate data to:</p>
                  <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                    <li><strong>Analyze Usage Patterns:</strong> Understand which features are used and how often (aggregate only)</li>
                    <li><strong>Identify Issues:</strong> Detect and fix bugs, errors, and performance problems</li>
                    <li><strong>Develop Features:</strong> Plan and build new features based on anonymized usage trends</li>
                    <li><strong>Conduct Research:</strong> Perform security and privacy research using aggregated, anonymous data</li>
                    <li><strong>Benchmark Performance:</strong> Measure and improve service performance and reliability</li>
                  </ul>
                  <div className="bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500 p-4 rounded-r-lg my-4">
                    <p className="font-bold text-foreground mb-2">We do NOT:</p>
                    <ul className="list-disc pl-6 text-muted-foreground space-y-1">
                      <li>Analyze your individual assessment results or SBOM data</li>
                      <li>Use your data to train AI models or machine learning systems</li>
                      <li>Profile users for behavioral targeting or marketing</li>
                      <li>Sell or monetize your data in any way</li>
                    </ul>
                  </div>
                </div>

                <div>
                  <h3 className="text-xl font-semibold mb-4">4.3 Communication</h3>
                  <p className="text-muted-foreground mb-2">We use your contact information to:</p>
                  <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                    <li><strong>Service Announcements:</strong> Notify you of system updates, maintenance, or service changes</li>
                    <li><strong>Security Alerts:</strong> Send critical security notifications or breach notifications</li>
                    <li><strong>Support Responses:</strong> Reply to your support requests and feedback</li>
                    <li><strong>Transactional Emails:</strong> Send receipts, invoices, account confirmations</li>
                    <li><strong>Product Updates:</strong> Inform you of new features or product launches (opt-in only)</li>
                    <li><strong>Marketing Communications:</strong> Send promotional content only with your explicit consent (easy opt-out)</li>
                  </ul>
                  <p className="text-muted-foreground italic mt-3">You can opt out of marketing emails anytime. You cannot opt out of critical service/security notifications.</p>
                </div>

                <div>
                  <h3 className="text-xl font-semibold mb-4">4.4 Security and Fraud Prevention</h3>
                  <p className="text-muted-foreground mb-2">We use technical data to:</p>
                  <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                    <li><strong>Detect Threats:</strong> Identify and prevent security threats, attacks, and abuse</li>
                    <li><strong>Monitor Security:</strong> Track unauthorized access attempts or account compromise</li>
                    <li><strong>Enforce Policies:</strong> Ensure compliance with <Link to="/terms-of-service" className="text-primary hover:underline">Terms of Service</Link> and <Link to="/acceptable-use-policy" className="text-primary hover:underline">Acceptable Use Policy</Link></li>
                    <li><strong>Prevent Fraud:</strong> Detect fraudulent transactions, account creation, or service abuse</li>
                    <li><strong>Protect Users:</strong> Safeguard ERMITS, our users, and third parties from harm</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-xl font-semibold mb-4">4.5 Legal and Compliance</h3>
                  <p className="text-muted-foreground mb-2">We process information as required to:</p>
                  <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                    <li><strong>Comply with Laws:</strong> Fulfill legal obligations and respond to lawful requests</li>
                    <li><strong>Enforce Rights:</strong> Protect ERMITS' legal rights and enforce agreements</li>
                    <li><strong>Liability Protection:</strong> Defend against legal claims or liability</li>
                    <li><strong>Audits:</strong> Conduct internal audits and maintain business records</li>
                    <li><strong>Regulatory Compliance:</strong> Meet requirements under GDPR, CCPA, HIPAA, and other laws</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* Section 5: Information Sharing and Disclosure */}
            <section>
              <h2 id="section-5" className="text-2xl font-bold mb-6 pb-3 border-b">5. INFORMATION SHARING AND DISCLOSURE</h2>
              
              <div className="space-y-6">
                <div className="bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500 p-6 rounded-r-lg my-6">
                  <p className="font-bold text-foreground mb-3">ERMITS does NOT sell, rent, or monetize your personal information.</p>
                  <p className="text-muted-foreground mb-2">We share information only in the limited circumstances described below:</p>
                </div>

                <div>
                  <h3 className="text-xl font-semibold mb-4">5.1 Service Providers (Sub-Processors)</h3>
                  <p className="text-muted-foreground leading-relaxed mb-3">
                    We share limited data with trusted third-party service providers who assist in delivering the Services. All providers are contractually bound to protect your data and use it only for specified purposes:
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
                  <p className="text-muted-foreground italic mt-3">All service providers are required to maintain appropriate security measures and comply with applicable privacy laws.</p>
                </div>

                <div>
                  <h3 className="text-xl font-semibold mb-4">5.2 Legal Requirements</h3>
                  <p className="text-muted-foreground leading-relaxed mb-2">We may disclose information if required by law or in good faith belief that disclosure is necessary to:</p>
                  <ul className="list-disc pl-6 text-muted-foreground space-y-1">
                    <li>Comply with legal obligations, court orders, or government requests</li>
                    <li>Enforce our Terms of Service or Acceptable Use Policy</li>
                    <li>Protect ERMITS' rights, property, or safety</li>
                    <li>Protect users or third parties from harm</li>
                    <li>Investigate fraud, security threats, or violations</li>
                  </ul>
                  <p className="text-muted-foreground italic mt-3">We will notify you of legal requests when legally permitted, unless prohibited by law or court order.</p>
                </div>

                <div>
                  <h3 className="text-xl font-semibold mb-4">5.3 Business Transfers</h3>
                  <p className="text-muted-foreground leading-relaxed mb-2">In the event of a merger, acquisition, or sale of assets:</p>
                  <ul className="list-disc pl-6 text-muted-foreground space-y-1">
                    <li>Your information may be transferred to the acquiring entity</li>
                    <li>We will notify you via email and prominent website notice</li>
                    <li>Your privacy rights under this Policy will continue to apply</li>
                    <li>You may request deletion of your data before transfer</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-xl font-semibold mb-4">5.4 With Your Consent</h3>
                  <p className="text-muted-foreground leading-relaxed">We may share information with third parties when you explicitly consent, such as:</p>
                  <ul className="list-disc pl-6 text-muted-foreground space-y-1">
                    <li>Integrating with third-party services you authorize</li>
                    <li>Sharing assessment results with partners you designate</li>
                    <li>Participating in beta programs or research studies</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* Section 6: Data Security Measures */}
            <section>
              <h2 id="section-6" className="text-2xl font-bold mb-6 pb-3 border-b flex items-center">
                <Lock className="h-6 w-6 mr-2 text-primary" />
                6. DATA SECURITY MEASURES
              </h2>
              
              <div className="space-y-4">
                <div>
                  <h3 className="text-xl font-semibold mb-4">6.1 Encryption</h3>
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
                  <h3 className="text-xl font-semibold mb-4">6.2 Access Controls</h3>
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

            {/* Section 7: Data Retention */}
            <section>
              <h2 id="section-7" className="text-2xl font-bold mb-6 pb-3 border-b flex items-center">
                <Database className="h-6 w-6 mr-2 text-primary" />
                7. DATA RETENTION
              </h2>
              
              <div className="space-y-4">
                <div>
                  <h3 className="text-xl font-semibold mb-4">7.1 Active Account Data</h3>
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

            {/* Section 8: Your Privacy Rights */}
            <section>
              <h2 id="section-8" className="text-2xl font-bold mb-6 pb-3 border-b flex items-center">
                <Users className="h-6 w-6 mr-2 text-primary" />
                8. YOUR PRIVACY RIGHTS
              </h2>
              
              <div className="space-y-4">
                <div>
                  <h3 className="text-xl font-semibold mb-4">8.1 Universal Rights (All Users)</h3>
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

            {/* Section 9: International Data Transfers */}
            <section>
              <h2 id="section-9" className="text-2xl font-bold mb-6 pb-3 border-b flex items-center">
                <Globe className="h-6 w-6 mr-2 text-primary" />
                9. INTERNATIONAL DATA TRANSFERS
              </h2>
              
              <div className="space-y-4">
                <div>
                  <h3 className="text-xl font-semibold mb-4">9.1 Data Processing Locations</h3>
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

            {/* Section 10: Children's Privacy */}
            <section>
              <h2 id="section-10" className="text-2xl font-bold mb-6 pb-3 border-b">10. CHILDREN'S PRIVACY</h2>
              
              <div className="space-y-4">
                <div>
                  <h3 className="text-xl font-semibold mb-4">10.1 Age Restrictions</h3>
                  <p className="text-muted-foreground leading-relaxed mb-3">
                    The Services are not intended for children under 18 years of age. We do not knowingly collect personal information from children under 18.
                  </p>
                </div>
              </div>
            </section>

            {/* Section 11: Product-Specific Privacy Considerations */}
            <section>
              <h2 id="section-11" className="text-2xl font-bold mb-6 pb-3 border-b">11. PRODUCT-SPECIFIC PRIVACY CONSIDERATIONS</h2>
              
              <div className="bg-gray-50 dark:bg-gray-800/30 rounded-lg p-6 space-y-6">
                <div className="border-l-4 border-blue-500 pl-4">
                  <p className="font-bold mb-2">TechnoSoluce™ (SBOM Analyzer):</p>
                  <ul className="list-disc pl-6 space-y-1 text-muted-foreground">
                    <li>SBOM files: Never transmitted to or stored on ERMITS servers</li>
                    <li>Analysis results: Stored locally in user's browser only</li>
                    <li>No retention on ERMITS infrastructure</li>
                  </ul>
                </div>
                <div className="border-l-4 border-indigo-500 pl-4">
                  <p className="font-bold mb-2">SocialCaution:</p>
                  <ul className="list-disc pl-6 space-y-1 text-muted-foreground">
                    <li>Privacy assessment responses: Processed 100% client-side</li>
                    <li>All assessment data stored locally in browser (IndexedDB, localStorage)</li>
                    <li>Zero data transmission to ERMITS servers during assessments</li>
                  </ul>
                </div>
                <div className="border-l-4 border-yellow-500 pl-4">
                  <p className="font-bold mb-2">CyberCertitude™ (CMMC Compliance):</p>
                  <ul className="list-disc pl-6 space-y-1 text-muted-foreground">
                    <li>Toolkit (localStorage-based): 100% local storage, no data collected</li>
                    <li>Level 1 & 2 Platform: Encrypted compliance data with zero-knowledge E2EE</li>
                    <li>ERMITS cannot decrypt your compliance data</li>
                  </ul>
                </div>
                <div className="border-l-4 border-orange-500 pl-4">
                  <p className="font-bold mb-2">CyberCaution™ (Security Assessments):</p>
                  <ul className="list-disc pl-6 space-y-1 text-muted-foreground">
                    <li>Browser-Based: 100% local processing, no data collected</li>
                    <li>Cloud-Enabled: Encrypted security assessment data (if cloud sync enabled)</li>
                    <li>Anonymous benchmarking opt-in only with differential privacy</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* Section 12: Special Considerations */}
            <section>
              <h2 id="section-12" className="text-2xl font-bold mb-6 pb-3 border-b">12. SPECIAL CONSIDERATIONS</h2>
              
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-semibold mb-4">12.1 Federal Contractor Privacy</h3>
                  <div className="bg-gray-50 dark:bg-gray-800/30 rounded-lg p-6">
                    <p className="text-muted-foreground mb-3">For users handling Controlled Unclassified Information (CUI) or Federal Contract Information (FCI):</p>
                    <div>
                      <h4 className="font-semibold mb-2">Privacy-First Architecture Benefits:</h4>
                      <ul className="list-disc pl-6 space-y-1 text-muted-foreground">
                        <li>CUI/FCI processed client-side; never transmitted to ERMITS</li>
                        <li>Zero-knowledge encryption ensures ERMITS cannot access CUI/FCI</li>
                        <li>Local storage options eliminate cloud transmission of sensitive data</li>
                        <li>You maintain complete control over CUI/FCI data</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-xl font-semibold mb-4">12.2 Healthcare Privacy (HIPAA)</h3>
                  <div className="bg-gray-50 dark:bg-gray-800/30 rounded-lg p-6">
                    <p className="text-muted-foreground mb-3">For healthcare organizations subject to HIPAA:</p>
                    <div>
                      <h4 className="font-semibold mb-2">Business Associate Agreement (BAA) Available:</h4>
                      <ul className="list-disc pl-6 space-y-1 text-muted-foreground">
                        <li>Required for healthcare customers processing PHI</li>
                        <li>Contact: privacy@ermits.com to execute BAA</li>
                        <li>HIPAA-compliant infrastructure and safeguards</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Section 13: Updates to This Privacy Policy */}
            <section>
              <h2 id="section-13" className="text-2xl font-bold mb-6 pb-3 border-b">13. UPDATES TO THIS PRIVACY POLICY</h2>
              
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-semibold mb-4">13.1 Policy Updates</h3>
                  <p className="text-muted-foreground leading-relaxed mb-4">
                    We may update this Privacy Policy periodically to reflect:
                  </p>
                  <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                    <li>Changes in data practices or Services</li>
                    <li>New product launches or features</li>
                    <li>Legal or regulatory developments</li>
                    <li>Technological improvements</li>
                    <li>User feedback and industry best practices</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-xl font-semibold mb-4">13.2 Notification of Changes</h3>
                  <div className="bg-gray-50 dark:bg-gray-800/30 rounded-lg p-6">
                    <p className="font-bold text-foreground mb-3">Material Changes:</p>
                    <p className="text-muted-foreground mb-2">For significant changes affecting your rights or data practices:</p>
                    <ul className="list-disc pl-6 space-y-1 text-muted-foreground">
                      <li><strong>30 Days' Advance Notice:</strong> Email notification and in-app announcement</li>
                      <li><strong>Prominent Display:</strong> Notice displayed on website and in Services</li>
                      <li><strong>Opt-Out Option:</strong> Option to export data and close account before changes take effect</li>
                      <li><strong>Continued Use:</strong> Continued use after effective date constitutes acceptance</li>
                    </ul>

                    <p className="font-bold text-foreground mt-4 mb-2">Non-Material Changes:</p>
                    <p className="text-muted-foreground mb-2">For clarifications, formatting, or minor updates:</p>
                    <ul className="list-disc pl-6 space-y-1 text-muted-foreground">
                      <li>Update "Last Updated" date at top of policy</li>
                      <li>Changes effective immediately upon posting</li>
                      <li>No advance notice required</li>
                    </ul>
                  </div>
                </div>
              </div>
            </section>

            {/* Section 14: Contact Information */}
            <section>
              <h2 id="section-14" className="text-2xl font-bold mb-6 pb-3 border-b flex items-center">
                <Mail className="h-6 w-6 mr-2 text-primary" />
                14. CONTACT INFORMATION
              </h2>
              
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-semibold mb-4">14.1 General Contact</h3>
                  <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6 space-y-3">
                    <p className="text-muted-foreground"><strong>ERMITS LLC</strong></p>
                    <p className="text-muted-foreground">Email: <a href="mailto:contact@ermits.com" className="text-primary hover:underline">contact@ermits.com</a></p>
                    <p className="text-muted-foreground">Website: <a href="https://www.ermits.com" className="text-primary hover:underline">www.ermits.com</a></p>
                  </div>
                </div>

                <div>
                  <h3 className="text-xl font-semibold mb-4">14.2 Privacy Inquiries</h3>
                  <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6 space-y-3">
                    <p className="text-muted-foreground"><strong>General Privacy Questions:</strong><br />
                    Email: <a href="mailto:privacy@ermits.com" className="text-primary hover:underline">privacy@ermits.com</a><br />
                    Subject: "Privacy Inquiry"</p>
                    <p className="text-muted-foreground"><strong>Data Rights Requests:</strong><br />
                    Online Form: <a href="https://www.ermits.com/privacy-request" className="text-primary hover:underline">www.ermits.com/privacy-request</a><br />
                    Email: <a href="mailto:privacy@ermits.com" className="text-primary hover:underline">privacy@ermits.com</a><br />
                    Subject: "Privacy Rights Request - [Type]"</p>
                  </div>
                </div>

                <div>
                  <h3 className="text-xl font-semibold mb-4">14.3 Jurisdiction-Specific Contacts</h3>
                  <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6 space-y-3">
                    <p className="text-muted-foreground"><strong>Data Protection Officer (EU/UK/Swiss):</strong><br />
                    Email: <a href="mailto:privacy@ermits.com" className="text-primary hover:underline">privacy@ermits.com</a><br />
                    Subject: "GDPR Inquiry - DPO"</p>
                    <p className="text-muted-foreground"><strong>California Privacy Requests (CCPA/CPRA):</strong><br />
                    Online Form: <a href="https://www.ermits.com/privacy-request" className="text-primary hover:underline">www.ermits.com/privacy-request</a><br />
                    Email: <a href="mailto:privacy@ermits.com" className="text-primary hover:underline">privacy@ermits.com</a><br />
                    Subject: "CCPA Request"</p>
                    <p className="text-muted-foreground"><strong>HIPAA Privacy Officer (Healthcare):</strong><br />
                    Email: <a href="mailto:privacy@ermits.com" className="text-primary hover:underline">privacy@ermits.com</a><br />
                    Subject: "HIPAA Privacy Matter"</p>
                  </div>
                </div>

                <div>
                  <h3 className="text-xl font-semibold mb-4">14.4 Security Concerns</h3>
                  <p className="text-muted-foreground">Email: <a href="mailto:security@ermits.com" className="text-primary hover:underline">security@ermits.com</a><br />
                  Subject: "Security Issue - [Urgent/Non-Urgent]"</p>
                </div>

                <div>
                  <h3 className="text-xl font-semibold mb-4">14.5 Technical Support</h3>
                  <p className="text-muted-foreground">Email: <a href="mailto:support@ermits.com" className="text-primary hover:underline">support@ermits.com</a></p>
                </div>
              </div>
            </section>

            {/* Section 15: Effective Date and Acceptance */}
            <section>
              <h2 id="section-15" className="text-2xl font-bold mb-6 pb-3 border-b">15. EFFECTIVE DATE AND ACCEPTANCE</h2>
              
              <div className="bg-gray-50 dark:bg-gray-800/50 border-l-4 border-primary p-6 rounded-r-lg">
                <p className="text-muted-foreground leading-relaxed mb-2"><strong>Effective Date:</strong> October 31, 2025</p>
                <p className="text-muted-foreground leading-relaxed mb-2"><strong>Last Updated:</strong> December 13, 2025</p>
                <p className="text-muted-foreground leading-relaxed mt-4"><strong>By using ERMITS Services, you acknowledge that you have read, understood, and agree to be bound by this Privacy Policy.</strong></p>
                <p className="text-muted-foreground leading-relaxed mt-2">If you do not agree with this Privacy Policy, you must discontinue use of all ERMITS Services immediately.</p>
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