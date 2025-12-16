import { Link } from 'react-router-dom';
import { ArrowLeft, Mail, Scale, AlertTriangle } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Breadcrumb } from '../components/ui/Breadcrumb';

export function TermsPage() {
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
            <h1 className="text-4xl font-bold mb-2">MASTER TERMS OF SERVICE</h1>
            <p className="text-muted-foreground text-lg">
              <strong>Effective Date:</strong> October 31, 2025 | <strong>Last Updated:</strong> December 13, 2025
            </p>
          </div>

          <div className="bg-card rounded-lg border p-8 space-y-12 prose prose-lg max-w-none">
            {/* Introduction */}
            <div className="bg-gray-50 dark:bg-gray-800/50 border-l-4 border-primary p-6 rounded-r-lg mb-8">
              <p className="text-muted-foreground leading-relaxed text-base">
                By accessing or using any ERMITS LLC ("ERMITS," "we," "our," or "us") products, platforms, or services (collectively, the "Services"), you ("User," "you," or "your") agree to be bound by these Master Terms of Service ("Terms"). If you do not agree to these Terms, do not use our Services.
              </p>
            </div>

            {/* Section 1: Scope and Applicability */}
            <section>
              <h2 id="section-1" className="text-2xl font-bold mb-6 pb-3 border-b">1. SCOPE AND APPLICABILITY</h2>
              
              <div className="space-y-4">
                <p className="text-muted-foreground leading-relaxed mb-4">
                  These Terms govern your use of all ERMITS products, including but not limited to:
                </p>
                <div className="bg-gray-50 dark:bg-gray-800/30 rounded-lg p-6 space-y-6">
                  <div className="border-l-4 border-blue-500 pl-4">
                    <p className="font-bold mb-2">TechnoSoluce™ Brand Products:</p>
                    <ul className="list-disc pl-6 space-y-1 text-muted-foreground">
                      <li>SBOM Analyzer - Software supply chain security and vulnerability analysis</li>
                    </ul>
                  </div>
                  <div className="border-l-4 border-indigo-500 pl-4">
                    <p className="font-bold mb-2">CyberSoluce™ Brand Products:</p>
                    <ul className="list-disc pl-6 space-y-1 text-muted-foreground">
                      <li>Enhanced Asset Inventory Management Platform</li>
                      <li>Dependency-aware asset visibility and management</li>
                      <li>Focus signals for attention areas</li>
                      <li>Service funneling guidance</li>
                    </ul>
                  </div>
                  <div className="border-l-4 border-yellow-500 pl-4">
                    <p className="font-bold mb-2">CyberCertitude™ Brand Products:</p>
                    <ul className="list-disc pl-6 space-y-1 text-muted-foreground">
                      <li>CMMC 2.0 Level 1 Implementation Suite</li>
                      <li>CMMC 2.0 Level 2 Compliance Platform</li>
                      <li>Original Toolkit (localStorage-based compliance management)</li>
                    </ul>
                  </div>
                  <div className="border-l-4 border-orange-500 pl-4">
                    <p className="font-bold mb-2">VendorSoluce™ Brand Products:</p>
                    <ul className="list-disc pl-6 space-y-1 text-muted-foreground">
                      <li>Supply Chain Risk Management Platform</li>
                    </ul>
                  </div>
                  <div className="border-l-4 border-green-500 pl-4">
                    <p className="font-bold mb-2">CyberCorrect™ Brand Products:</p>
                    <ul className="list-disc pl-6 space-y-1 text-muted-foreground">
                      <li>Privacy Portal (Workplace privacy compliance)</li>
                      <li>Privacy Platform (Multi-regulation privacy compliance automation)</li>
                    </ul>
                  </div>
                  <div className="border-l-4 border-blue-500 pl-4">
                    <p className="font-bold mb-2">CyberCaution™ Brand Products:</p>
                    <ul className="list-disc pl-6 space-y-1 text-muted-foreground">
                      <li>RansomCheck (Ransomware readiness assessment)</li>
                      <li>Security Toolkit (Comprehensive cybersecurity assessment platform)</li>
                      <li>RiskProfessional (CISA-aligned security assessments)</li>
                    </ul>
                  </div>
                  <div className="border-l-4 border-indigo-500 pl-4">
                    <p className="font-bold mb-2">SocialCaution Brand Products:</p>
                    <ul className="list-disc pl-6 space-y-1 text-muted-foreground">
                      <li>Personalized Privacy Platform with AI-powered persona detection</li>
                      <li>Privacy Exposure Index for online services</li>
                      <li>Service Catalog with risk profiles</li>
                      <li>Adaptive privacy resources and tools</li>
                      <li>Digital footprint analysis</li>
                    </ul>
                  </div>
                </div>
                <p className="text-muted-foreground leading-relaxed italic">
                  Product-specific terms may apply as set forth in Product-Specific Addendums.
                </p>
              </div>
            </section>

            {/* Section 2: Definitions */}
            <section>
              <h2 id="section-2" className="text-2xl font-bold mb-6 pb-3 border-b">2. DEFINITIONS</h2>
              
              <div className="bg-gray-50 dark:bg-gray-800/30 rounded-lg p-6 space-y-4">
                <div className="space-y-3">
                  <p className="mb-3"><strong className="text-primary">"Privacy-First Architecture"</strong> <span className="text-muted-foreground">means ERMITS' system design philosophy ensuring that user data is processed locally whenever possible, with optional encrypted cloud synchronization, pseudonymized telemetry, and zero-knowledge data handling principles.</span></p>
                  
                  <p className="mb-3"><strong className="text-primary">"User Data"</strong> <span className="text-muted-foreground">means any information, content, files, or materials that you upload, submit, generate, or process through the Services.</span></p>
                  
                  <p className="mb-3"><strong className="text-primary">"Controlled Unclassified Information" or "CUI"</strong> <span className="text-muted-foreground">means information that requires safeguarding or dissemination controls pursuant to federal law, regulations, or government-wide policies.</span></p>
                  
                  <p className="mb-3"><strong className="text-primary">"Federal Contract Information" or "FCI"</strong> <span className="text-muted-foreground">means information not intended for public release that is provided by or generated for the U.S. Government under a contract.</span></p>
                  
                  <p className="mb-3"><strong className="text-primary">"Beta Products"</strong> <span className="text-muted-foreground">means Services explicitly marked as "Beta," "Preview," "Early Access," or similar designations indicating pre-release or testing status.</span></p>
                  
                  <p className="mb-3"><strong className="text-primary">"Privacy Persona"</strong> <span className="text-muted-foreground">means the AI-determined privacy profile classification assigned by SocialCaution based on user assessment responses, used to personalize privacy recommendations and resources.</span></p>
                  
                  <p className="mb-3"><strong className="text-primary">"Privacy Exposure Index"</strong> <span className="text-muted-foreground">means SocialCaution's quantified privacy risk score (0-100) for online services based on publicly available data, privacy policies, and service characteristics.</span></p>
                </div>
              </div>
            </section>

            {/* Section 3: Eligibility and Account Requirements */}
            <section>
              <h2 id="section-3" className="text-2xl font-bold mb-6 pb-3 border-b">3. ELIGIBILITY AND ACCOUNT REQUIREMENTS</h2>
              
              <div className="space-y-6">
                <div className="bg-gray-50 dark:bg-gray-800/30 rounded-lg p-5 border-l-4 border-blue-500">
                  <p className="font-bold mb-3">Age Requirement:</p>
                  <p className="text-muted-foreground leading-relaxed">You must be at least 18 years of age to use the Services. By using the Services, you represent and warrant that you meet this age requirement.</p>
                </div>

                <div className="bg-gray-50 dark:bg-gray-800/30 rounded-lg p-5 border-l-4 border-indigo-500">
                  <p className="font-bold mb-3">Authority:</p>
                  <p className="text-muted-foreground leading-relaxed">If you are using the Services on behalf of an organization, you represent and warrant that you have the authority to bind that organization to these Terms.</p>
                </div>

                <div className="bg-gray-50 dark:bg-gray-800/30 rounded-lg p-5 border-l-4 border-yellow-500">
                  <p className="font-bold mb-3">Account Security:</p>
                  <p className="text-muted-foreground mb-3">You are responsible for:</p>
                  <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                    <li>Maintaining the confidentiality of your account credentials</li>
                    <li>All activities that occur under your account</li>
                    <li>Notifying ERMITS immediately of any unauthorized access or security breach</li>
                    <li>Using strong, unique passwords and enabling multi-factor authentication where available</li>
                  </ul>
                </div>

                <div className="bg-gray-50 dark:bg-gray-800/30 rounded-lg p-5 border-l-4 border-orange-500">
                  <p className="font-bold mb-3">Accurate Information:</p>
                  <p className="text-muted-foreground leading-relaxed">You agree to provide accurate, current, and complete information during registration and to update such information to maintain its accuracy.</p>
                </div>
              </div>
            </section>

            {/* Section 4: Privacy-First Architecture and Data Handling */}
            <section>
              <h2 id="section-4" className="text-2xl font-bold mb-6 pb-3 border-b">4. PRIVACY-FIRST ARCHITECTURE AND DATA HANDLING</h2>
              
              <p className="text-muted-foreground leading-relaxed mb-4">ERMITS implements a Privacy-First Architecture across all products, built on the following principles:</p>
              
              <div className="space-y-4">
                <div>
                  <h3 className="text-xl font-semibold mb-4">4.1 Client-Side Processing</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    All core computational functions (assessments, SBOM analysis, risk scoring, compliance evaluations, privacy persona detection) are performed locally within your browser or self-managed environment whenever technically feasible.
                  </p>
                </div>

                <div>
                  <h3 className="text-xl font-semibold mb-4">4.2 Data Sovereignty Options</h3>
                  <p className="text-muted-foreground leading-relaxed mb-2">You have multiple deployment and storage options:</p>
                  
                  <p className="font-semibold mt-4 mb-2">Local Storage Options:</p>
                  <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                    <li>Browser-based local storage (IndexedDB, localStorage)</li>
                    <li>Desktop application with local file storage</li>
                    <li>On-premises deployment (Enterprise customers)</li>
                  </ul>
                  
                  <p className="font-semibold mt-4 mb-2">Cloud Storage Options:</p>
                  <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                    <li>Self-managed cloud infrastructure (you control the environment)</li>
                    <li>ERMITS-managed cloud (Supabase or alternative providers)</li>
                    <li>Hybrid deployment (local processing with optional encrypted sync)</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-xl font-semibold mb-4">4.3 Data Residency</h3>
                  <p className="text-muted-foreground leading-relaxed mb-2">For cloud-managed options, data residency is determined by:</p>
                  <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                    <li>Your selected deployment region</li>
                    <li>Applicable compliance requirements</li>
                    <li>Service infrastructure location (disclosed per product)</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-xl font-semibold mb-4">4.4 Zero-Knowledge Principles</h3>
                  <p className="text-muted-foreground leading-relaxed mb-2">When using ERMITS-managed cloud services with encryption enabled:</p>
                  <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                    <li>Data is encrypted client-side using AES-256-GCM via WebCrypto</li>
                    <li>Encryption keys are derived from your credentials and never transmitted to ERMITS</li>
                    <li>ERMITS administrators cannot decrypt your data</li>
                    <li>You are solely responsible for maintaining access to your encryption keys</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-xl font-semibold mb-4">4.5 Data Minimization</h3>
                  <p className="text-muted-foreground leading-relaxed mb-2">ERMITS collects only the minimum data necessary for service functionality:</p>
                  <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                    <li><strong>Never Collected:</strong> Raw SBOM files, assessment content, CUI, FCI, proprietary business data, or detailed vulnerability findings remain under your exclusive control</li>
                    <li><strong>Optionally Collected:</strong> Account information (name, email, company) for authentication and billing</li>
                    <li><strong>Pseudonymized Telemetry:</strong> Anonymous performance metrics using irreversible cryptographic hashing (opt-in or opt-out based on product)</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* Section 5: License Grant and Restrictions */}
            <section>
              <h2 id="section-5" className="text-2xl font-bold mb-6 pb-3 border-b">5. LICENSE GRANT AND RESTRICTIONS</h2>
              
              <div className="space-y-4">
                <div>
                  <h3 className="text-xl font-semibold mb-4">5.1 License to Use Services</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    Subject to your compliance with these Terms, ERMITS grants you a limited, non-exclusive, non-transferable, revocable license to access and use the Services for your internal business or personal purposes.
                  </p>
                </div>

                <div>
                  <h3 className="text-xl font-semibold mb-4">5.2 License Restrictions</h3>
                  <p className="text-muted-foreground leading-relaxed mb-2">You may not:</p>
                  <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                    <li>Modify, copy, distribute, transmit, display, perform, reproduce, publish, license, create derivative works from, transfer, or sell any information, software, products, or services obtained from the Services</li>
                    <li>Reverse engineer, decompile, disassemble, or attempt to discover source code or underlying algorithms (except to the extent such restriction is prohibited by applicable law)</li>
                    <li>Remove, obscure, or alter any proprietary rights notices</li>
                    <li>Use the Services to develop competing products or services</li>
                    <li>Access the Services through automated means (bots, scrapers) without prior written authorization</li>
                    <li>Attempt to circumvent security measures or gain unauthorized access</li>
                    <li>Use the Services in any way that violates applicable laws or regulations</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-xl font-semibold mb-4">5.3 Open-Source Components</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    Certain Services incorporate open-source software components licensed under MIT, Apache 2.0, BSD, or similar licenses. These components remain subject to their original license terms, which are available in the respective source code repositories. Your rights to such open-source components are governed by their respective licenses, not these Terms.
                  </p>
                </div>
              </div>
            </section>

            {/* Section 6: User Data Ownership and Responsibilities */}
            <section>
              <h2 id="section-6" className="text-2xl font-bold mb-6 pb-3 border-b">6. USER DATA OWNERSHIP AND RESPONSIBILITIES</h2>
              
              <div className="space-y-4">
                <div>
                  <h3 className="text-xl font-semibold mb-4">6.1 User Data Ownership</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    You retain all ownership rights in your User Data. ERMITS does not claim any ownership or intellectual property rights in your User Data.
                  </p>
                </div>

                <div>
                  <h3 className="text-xl font-semibold mb-4">6.2 User Data License to ERMITS</h3>
                  <p className="text-muted-foreground leading-relaxed mb-2">You grant ERMITS a limited license to your User Data solely to the extent necessary to:</p>
                  <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                    <li>Provide the Services to you</li>
                    <li>Perform technical operations (backup, recovery, security monitoring)</li>
                    <li>Comply with legal obligations</li>
                  </ul>
                  <p className="text-muted-foreground leading-relaxed mt-3">
                    This license terminates when you delete your User Data or terminate your account, except for:
                  </p>
                  <ul className="list-disc pl-6 space-y-2 text-muted-foreground mt-2">
                    <li>Data retained for legal or regulatory compliance purposes</li>
                    <li>Pseudonymized analytics data that cannot be reverse-engineered to identify you</li>
                    <li>Backup copies maintained for disaster recovery (deleted within 90 days of account termination)</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-xl font-semibold mb-4">6.3 User Data Responsibilities</h3>
                  <p className="text-muted-foreground leading-relaxed mb-2">You are solely responsible for:</p>
                  <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                    <li>The accuracy, quality, and legality of your User Data</li>
                    <li>The means by which you acquired User Data</li>
                    <li>Compliance with all applicable laws regarding User Data processing</li>
                    <li>Maintaining appropriate security controls for your User Data</li>
                    <li>Backup and disaster recovery of locally-stored data</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-xl font-semibold mb-4">6.4 Prohibited Data</h3>
                  <p className="text-muted-foreground leading-relaxed mb-2">You may not upload, transmit, or process through the Services:</p>
                  <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                    <li>Malware, viruses, or malicious code</li>
                    <li>Content that infringes intellectual property rights</li>
                    <li>Illegally obtained data or trade secrets</li>
                    <li>Personal data of minors without appropriate consent</li>
                    <li>Data in violation of applicable export control laws</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* Section 7: Intellectual Property Rights */}
            <section>
              <h2 id="section-7" className="text-2xl font-bold mb-6 pb-3 border-b">7. INTELLECTUAL PROPERTY RIGHTS</h2>
              
              <div className="space-y-4">
                <div>
                  <h3 className="text-xl font-semibold mb-4">7.1 ERMITS Intellectual Property</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    All intellectual property rights in the Services, including but not limited to software, algorithms, user interfaces, documentation, trademarks, and branding, are owned by ERMITS LLC or its licensors. No ownership rights are transferred to you under these Terms.
                  </p>
                </div>

                <div>
                  <h3 className="text-xl font-semibold mb-4">7.2 Trademarks</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    TechnoSoluce™, CyberSoluce™, CyberCertitude™, VendorSoluce™, CyberCorrect™, CyberCaution™, SocialCaution™, and all associated logos and branding are trademarks of ERMITS LLC. You may not use these trademarks without ERMITS' prior written consent.
                  </p>
                </div>

                <div>
                  <h3 className="text-xl font-semibold mb-4">7.3 User-Generated Reports and Outputs</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    Reports, assessments, and other outputs generated by the Services using your User Data remain your property. ERMITS does not claim ownership of such outputs.
                  </p>
                </div>

                <div>
                  <h3 className="text-xl font-semibold mb-4">7.4 Feedback</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    If you provide feedback, suggestions, or ideas about the Services ("Feedback"), you grant ERMITS a perpetual, irrevocable, worldwide, royalty-free license to use, modify, and incorporate such Feedback into the Services without any obligation to you.
                  </p>
                </div>
              </div>
            </section>

            {/* Section 8: Third-Party Services and Integrations */}
            <section>
              <h2 id="section-8" className="text-2xl font-bold mb-6 pb-3 border-b">8. THIRD-PARTY SERVICES AND INTEGRATIONS</h2>
              
              <div className="space-y-4">
                <div>
                  <h3 className="text-xl font-semibold mb-4">8.1 Third-Party Services</h3>
                  <p className="text-muted-foreground leading-relaxed mb-2">The Services may integrate with or reference third-party services including:</p>
                  <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                    <li><strong>Payment Processing:</strong> Stripe, Inc.</li>
                    <li><strong>Cloud Infrastructure:</strong> Supabase (PostgreSQL database)</li>
                    <li><strong>Vulnerability Data:</strong> OSV.dev, NIST NVD, CISA advisories</li>
                    <li><strong>Error Tracking:</strong> Sentry</li>
                    <li><strong>Analytics:</strong> PostHog (with differential privacy)</li>
                    <li><strong>Authentication:</strong> OAuth providers (Google, Microsoft, GitHub)</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-xl font-semibold mb-4">8.2 Third-Party Terms</h3>
                  <p className="text-muted-foreground leading-relaxed mb-2">Your use of third-party services is subject to their respective terms and privacy policies. ERMITS:</p>
                  <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                    <li>Ensures third-party integrations adhere to equivalent security and privacy standards</li>
                    <li>Is not responsible for the acts, omissions, or policies of third parties</li>
                    <li>Makes no warranties regarding third-party services</li>
                    <li>May modify or discontinue third-party integrations at any time</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-xl font-semibold mb-4">8.3 Data Sharing with Third Parties</h3>
                  <p className="text-muted-foreground leading-relaxed mb-2">ERMITS shares data with third parties only as follows:</p>
                  <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                    <li><strong>Service Providers:</strong> Minimal data necessary for service operation (e.g., email address to Stripe for billing)</li>
                    <li><strong>Vulnerability Databases:</strong> Anonymous, client-side queries to OSV.dev and similar services (no User Data transmitted)</li>
                    <li><strong>Legal Requirements:</strong> When required by law, regulation, or court order</li>
                    <li><strong>Business Transfers:</strong> In connection with mergers, acquisitions, or asset sales (with notice to users)</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* Section 9: Beta Products and Services */}
            <section>
              <h2 id="section-9" className="text-2xl font-bold mb-6 pb-3 border-b">9. BETA PRODUCTS AND SERVICES</h2>
              
              <div className="space-y-4">
                <div>
                  <h3 className="text-xl font-semibold mb-4">9.1 Beta Designation</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    Products or features explicitly marked as "Beta," "Preview," "Early Access," or similar designations are pre-release versions provided for testing and feedback purposes.
                  </p>
                </div>

                <div>
                  <h3 className="text-xl font-semibold mb-4">9.2 Beta Terms</h3>
                  <p className="text-muted-foreground leading-relaxed mb-2">Beta Products are provided "AS IS" with the following additional limitations:</p>
                  <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                    <li>May contain bugs, errors, or incomplete features</li>
                    <li>May be modified or discontinued without notice</li>
                    <li>Are not subject to standard SLA commitments</li>
                    <li>May have limited or no customer support</li>
                    <li>Should not be used for production or mission-critical purposes</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-xl font-semibold mb-4">9.3 Beta Feedback</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    By using Beta Products, you agree to provide feedback on functionality, usability, and issues. ERMITS may use such feedback without compensation or obligation to you.
                  </p>
                </div>

                <div>
                  <h3 className="text-xl font-semibold mb-4">9.4 Beta Data</h3>
                  <p className="text-muted-foreground leading-relaxed mb-2">ERMITS recommends:</p>
                  <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                    <li>Regular backups of data in Beta Products</li>
                    <li>Not using Beta Products for sensitive, production, or regulated data</li>
                    <li>Testing Beta Products in non-production environments</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-xl font-semibold mb-4">9.5 Beta Graduation</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    When a Beta Product transitions to general availability, it becomes subject to standard Terms and SLA commitments. ERMITS will provide notice of such transitions.
                  </p>
                </div>
              </div>
            </section>

            {/* Section 10: Federal Contractor Specific Terms */}
            <section>
              <h2 id="section-10" className="text-2xl font-bold mb-6 pb-3 border-b">10. FEDERAL CONTRACTOR SPECIFIC TERMS</h2>
              
              <div className="space-y-4">
                <div>
                  <h3 className="text-xl font-semibold mb-4">10.1 Applicability</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    This section applies to users who are U.S. federal contractors or subcontractors handling Federal Contract Information (FCI) or Controlled Unclassified Information (CUI).
                  </p>
                </div>

                <div>
                  <h3 className="text-xl font-semibold mb-4">10.2 Compliance Representations</h3>
                  <p className="text-muted-foreground leading-relaxed mb-2">Users represent and warrant that they:</p>
                  <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                    <li>Understand their obligations under applicable Defense Federal Acquisition Regulation Supplement (DFARS) and Federal Acquisition Regulation (FAR) clauses</li>
                    <li>Are solely responsible for compliance with DFARS 252.204-7012, NIST SP 800-171, and CMMC requirements</li>
                    <li>Will implement appropriate controls for CUI and FCI protection</li>
                    <li>Acknowledge that ERMITS products are tools to assist with compliance but do not guarantee certification</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-xl font-semibold mb-4">10.3 CUI and FCI Handling</h3>
                  <p className="text-muted-foreground leading-relaxed mb-2">When using ERMITS Services to process CUI or FCI:</p>
                  <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                    <li>You must use encryption features and self-managed deployment options</li>
                    <li>You are responsible for properly marking and handling CUI/FCI</li>
                    <li>ERMITS does not access or process CUI/FCI due to Privacy-First Architecture</li>
                    <li>You must implement appropriate access controls and audit logging</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-xl font-semibold mb-4">10.4 Incident Reporting</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    Federal contractors must report cyber incidents affecting CUI or FCI to the appropriate government agency as required by contract and regulation. ERMITS will cooperate with reasonable incident investigation requests while maintaining user privacy and security.
                  </p>
                </div>
              </div>
            </section>

            {/* Section 11: Acceptable Use */}
            <section>
              <h2 id="section-11" className="text-2xl font-bold mb-6 pb-3 border-b">11. ACCEPTABLE USE</h2>
              
              <p className="text-muted-foreground leading-relaxed mb-4">
                You agree to use the Services only for lawful purposes and in accordance with these Terms. Prohibited uses include but are not limited to:
              </p>

              <div className="space-y-4">
                <div>
                  <h3 className="text-xl font-semibold mb-3">11.1 Illegal Activities</h3>
                  <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                    <li>Violating any applicable laws, regulations, or third-party rights</li>
                    <li>Engaging in fraud, money laundering, or other criminal activities</li>
                    <li>Facilitating illegal activities or transactions</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-xl font-semibold mb-3">11.2 Security Violations</h3>
                  <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                    <li>Attempting to gain unauthorized access to Services or user accounts</li>
                    <li>Interfering with or disrupting Services or servers</li>
                    <li>Introducing malware, viruses, or harmful code</li>
                    <li>Circumventing security measures or authentication mechanisms</li>
                    <li>Conducting security testing without prior written authorization</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-xl font-semibold mb-3">11.3 Harmful Content</h3>
                  <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                    <li>Uploading or transmitting malicious software</li>
                    <li>Distributing spam, phishing, or unsolicited communications</li>
                    <li>Hosting or distributing pirated or illegal content</li>
                    <li>Processing data in violation of applicable privacy laws</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-xl font-semibold mb-3">11.4 Abuse and Misuse</h3>
                  <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                    <li>Using Services to harass, threaten, or harm others</li>
                    <li>Impersonating others or misrepresenting affiliation</li>
                    <li>Collecting user information without consent</li>
                    <li>Exceeding rate limits or resource quotas</li>
                    <li>Using Services for cryptocurrency mining without authorization</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-xl font-semibold mb-3">11.5 Competitive Use</h3>
                  <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                    <li>Using Services to develop competing products</li>
                    <li>Benchmarking for competitive analysis without consent</li>
                    <li>Reverse engineering (except as permitted by law)</li>
                  </ul>
                </div>

                <p className="text-muted-foreground leading-relaxed mt-4">
                  Detailed acceptable use provisions are set forth in the Acceptable Use Policy.
                </p>
              </div>
            </section>

            {/* Section 12: Payment Terms */}
            <section>
              <h2 id="section-12" className="text-2xl font-bold mb-6 pb-3 border-b">12. PAYMENT TERMS</h2>
              
              <div className="space-y-4">
                <div>
                  <h3 className="text-xl font-semibold mb-4">12.1 Pricing and Billing</h3>
                  <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                    <li>Pricing for Services is set forth on the ERMITS website or in your subscription agreement</li>
                    <li>All fees are in U.S. Dollars unless otherwise specified</li>
                    <li>Fees are non-refundable except as expressly provided in the Refund & Cancellation Policy</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-xl font-semibold mb-4">12.2 Payment Processing</h3>
                  <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                    <li>Payments are processed through Stripe, Inc., a third-party payment processor</li>
                    <li>You authorize ERMITS to charge your designated payment method</li>
                    <li>You must provide accurate, current payment information</li>
                    <li>You are responsible for all applicable taxes</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-xl font-semibold mb-4">12.3 Subscription Terms</h3>
                  <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                    <li>Subscriptions automatically renew unless cancelled</li>
                    <li>Renewal pricing may change with 30 days' notice</li>
                    <li>Downgrades take effect at the next billing cycle</li>
                    <li>Cancellations must be submitted before renewal date</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-xl font-semibold mb-4">12.4 Free Trials and Freemium Tiers</h3>
                  <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                    <li>Free trials and freemium features are subject to limitations</li>
                    <li>ERMITS may modify or terminate free offerings at any time</li>
                    <li>Free trial conversions to paid subscriptions require payment method</li>
                    <li>Free trial terms vary by product (see product-specific pages)</li>
                  </ul>
                  <p className="font-semibold mt-4 mb-2">SocialCaution Freemium:</p>
                  <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                    <li>Core privacy features available free permanently</li>
                    <li>Optional premium features available via subscription</li>
                    <li>No credit card required for free tier</li>
                    <li>Upgrade anytime for enhanced functionality</li>
                  </ul>
                </div>
              </div>
              <p className="text-muted-foreground leading-relaxed mt-4">
                Detailed payment terms are set forth in the Subscription & Payment Terms (E-Commerce Policies).
              </p>
            </section>

            {/* Section 13: Term and Termination */}
            <section>
              <h2 id="section-13" className="text-2xl font-bold mb-6 pb-3 border-b">13. TERM AND TERMINATION</h2>
              
              <div className="space-y-4">
                <div>
                  <h3 className="text-xl font-semibold mb-4">13.1 Term</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    These Terms remain in effect for as long as you access or use the Services.
                  </p>
                </div>

                <div>
                  <h3 className="text-xl font-semibold mb-4">13.2 Termination by You</h3>
                  <p className="text-muted-foreground leading-relaxed mb-2">You may terminate your account at any time through:</p>
                  <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                    <li>Account settings within the Services</li>
                    <li>Contacting ERMITS support at <a href="mailto:contact@ermits.com" className="text-primary hover:underline">contact@ermits.com</a></li>
                    <li>Following product-specific cancellation procedures</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-xl font-semibold mb-4">13.3 Termination by ERMITS</h3>
                  <p className="text-muted-foreground leading-relaxed mb-2">ERMITS may suspend or terminate your access immediately without notice if:</p>
                  <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                    <li>You breach these Terms or any applicable policies</li>
                    <li>Your account is inactive for 12+ months (free accounts)</li>
                    <li>Your payment method fails or account is delinquent</li>
                    <li>Required by law or regulatory authority</li>
                    <li>Necessary to protect ERMITS or other users</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-xl font-semibold mb-4">13.4 Effect of Termination</h3>
                  <p className="text-muted-foreground leading-relaxed mb-2">Upon termination:</p>
                  <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                    <li>Your license to use the Services immediately ceases</li>
                    <li>You must cease all use of the Services</li>
                    <li>You may export your User Data for 30 days (paid accounts) or 7 days (free accounts)</li>
                    <li>ERMITS may delete your User Data in accordance with the Privacy Policy</li>
                    <li>Provisions that by their nature should survive (warranty disclaimers, limitation of liability, indemnification) remain in effect</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-xl font-semibold mb-4">13.5 Data Retention After Termination</h3>
                  <p className="text-muted-foreground leading-relaxed mb-2">After account termination:</p>
                  <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                    <li><strong>User Data:</strong> Deleted within 90 days except as required by law</li>
                    <li><strong>Backups:</strong> Retained for 90 days for disaster recovery purposes</li>
                    <li><strong>Pseudonymized Analytics:</strong> Retained indefinitely (cannot be reverse-engineered)</li>
                    <li><strong>Legal/Regulatory Data:</strong> Retained as required by applicable law</li>
                    <li><strong>Financial Records:</strong> Retained for 7 years for tax and audit purposes</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* Section 14: Warranties and Disclaimers */}
            <section>
              <h2 id="section-14" className="text-2xl font-bold mb-6 pb-3 border-b flex items-center">
                <AlertTriangle className="h-6 w-6 mr-2 text-primary" />
                14. WARRANTIES AND DISCLAIMERS
              </h2>
              
              <div className="space-y-4">
                <div>
                  <h3 className="text-xl font-semibold mb-4">14.1 Limited Warranty</h3>
                  <p className="text-muted-foreground leading-relaxed mb-3">
                    ERMITS warrants that the Services will perform substantially in accordance with published documentation under normal use. This warranty does not apply to:
                  </p>
                  <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                    <li>Beta Products or pre-release features</li>
                    <li>Free tiers or trial accounts</li>
                    <li>Issues caused by user error, misuse, or modifications</li>
                    <li>Third-party services or integrations</li>
                    <li>Force majeure events</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-xl font-semibold mb-4">14.2 Disclaimer of Warranties</h3>
                  <p className="text-muted-foreground leading-relaxed mb-2">
                    EXCEPT AS EXPRESSLY PROVIDED IN SECTION 14.1, THE SERVICES ARE PROVIDED "AS IS" AND "AS AVAILABLE" WITHOUT WARRANTIES OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO:
                  </p>
                  <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                    <li><strong>Fitness for Purpose:</strong> No warranty that Services will meet your specific requirements</li>
                    <li><strong>Uninterrupted Access:</strong> No guarantee of continuous, error-free operation</li>
                    <li><strong>Security:</strong> No guarantee that Services are completely secure or error-free</li>
                    <li><strong>Accuracy:</strong> No warranty regarding accuracy, completeness, or reliability of outputs</li>
                    <li><strong>Third-Party Content:</strong> No warranty regarding accuracy of third-party data (OSV.dev, NIST, CISA)</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-xl font-semibold mb-4">14.3 Compliance Disclaimer</h3>
                  <p className="text-muted-foreground leading-relaxed mb-2">ERMITS products are tools to assist with security and compliance efforts but:</p>
                  <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                    <li>Do not guarantee compliance with any regulatory framework</li>
                    <li>Do not constitute legal, compliance, or professional consulting advice</li>
                    <li>Require users to interpret results in the context of their specific obligations</li>
                    <li>Do not replace qualified security assessments or professional audits</li>
                    <li>Are not certification authorities (not C3PAO, not CISA-endorsed)</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-xl font-semibold mb-4">14.4 Results Disclaimer</h3>
                  <p className="text-muted-foreground leading-relaxed mb-2">Assessment results, risk scores, and recommendations are:</p>
                  <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                    <li>For informational and educational purposes only</li>
                    <li>Based on user-provided inputs and third-party data sources</li>
                    <li>Subject to interpretation and professional judgment</li>
                    <li>Not guaranteed to identify all vulnerabilities or risks</li>
                    <li>Not a substitute for comprehensive security assessments</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-xl font-semibold mb-4">14.5 Privacy-First Architecture Limitations</h3>
                  <p className="text-muted-foreground leading-relaxed mb-2">Due to Privacy-First Architecture:</p>
                  <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                    <li>ERMITS cannot verify the accuracy of locally-processed User Data</li>
                    <li>Users are responsible for data integrity and backup</li>
                    <li>ERMITS has limited ability to provide data recovery assistance</li>
                    <li>Encryption key loss results in permanent data inaccessibility</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* Section 15: Limitation of Liability */}
            <section>
              <h2 id="section-15" className="text-2xl font-bold mb-6 pb-3 border-b flex items-center">
                <Scale className="h-6 w-6 mr-2 text-primary" />
                15. LIMITATION OF LIABILITY
              </h2>
              
              <div className="space-y-4">
                <div>
                  <h3 className="text-xl font-semibold mb-4">15.1 Exclusion of Consequential Damages</h3>
                  <p className="text-muted-foreground leading-relaxed mb-2">
                    TO THE MAXIMUM EXTENT PERMITTED BY APPLICABLE LAW, IN NO EVENT SHALL ERMITS LLC, ITS AFFILIATES, OFFICERS, DIRECTORS, EMPLOYEES, AGENTS, OR LICENSORS BE LIABLE FOR ANY:
                  </p>
                  <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                    <li>Indirect, incidental, special, consequential, or punitive damages</li>
                    <li>Loss of profits, revenue, data, use, goodwill, or other intangible losses</li>
                    <li>Business interruption or lost business opportunities</li>
                    <li>Regulatory fines, penalties, or compliance costs</li>
                    <li>Cost of procurement of substitute services</li>
                    <li>Unauthorized access to or alteration of User Data</li>
                    <li>Results of security assessments or compliance evaluations</li>
                  </ul>
                  <p className="text-muted-foreground leading-relaxed mt-3 text-sm">
                    This limitation applies regardless of the legal theory (contract, tort, negligence, strict liability, or otherwise) and whether or not ERMITS was advised of the possibility of such damages.
                  </p>
                </div>

                <div>
                  <h3 className="text-xl font-semibold mb-4">15.2 Cap on Liability</h3>
                  <p className="text-muted-foreground leading-relaxed mb-2">
                    ERMITS' TOTAL AGGREGATE LIABILITY ARISING OUT OF OR RELATED TO THESE TERMS OR USE OF THE SERVICES SHALL NOT EXCEED THE GREATER OF:
                  </p>
                  <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                    <li>$100 USD, or</li>
                    <li>The total amount paid by you to ERMITS in the 12 months preceding the claim</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-xl font-semibold mb-4">15.3 Liability Allocation</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    The limitations in this section reflect the allocation of risk between the parties and the fees charged by ERMITS. The limitations will apply even if any remedy fails of its essential purpose.
                  </p>
                </div>

                <div>
                  <h3 className="text-xl font-semibold mb-4">15.4 Exceptions</h3>
                  <p className="text-muted-foreground leading-relaxed mb-2">The limitations in this section do not apply to:</p>
                  <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                    <li>ERMITS' indemnification obligations under Section 16.2</li>
                    <li>Claims arising from gross negligence or willful misconduct</li>
                    <li>Violations of intellectual property rights</li>
                    <li>Liabilities that cannot be limited under applicable law</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-xl font-semibold mb-4">15.5 Basis of the Bargain</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    You acknowledge and agree that ERMITS has offered the Services, set pricing, and entered into these Terms in reliance upon the disclaimers and limitations of liability set forth herein, and that these disclaimers and limitations are an essential basis of the bargain between the parties.
                  </p>
                </div>
              </div>
            </section>

            {/* Section 16: Indemnification */}
            <section>
              <h2 id="section-16" className="text-2xl font-bold mb-6 pb-3 border-b">16. INDEMNIFICATION</h2>
              
              <div className="space-y-4">
                <div>
                  <h3 className="text-xl font-semibold mb-4">16.1 User Indemnification</h3>
                  <p className="text-muted-foreground leading-relaxed mb-2">
                    You agree to indemnify, defend, and hold harmless ERMITS LLC, its affiliates, and their respective officers, directors, employees, agents, and licensors from and against any claims, liabilities, damages, losses, costs, and expenses (including reasonable attorneys' fees) arising out of or related to:
                  </p>
                  <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                    <li>Your use or misuse of the Services</li>
                    <li>Your User Data or processing of data through the Services</li>
                    <li>Your violation of these Terms or applicable laws</li>
                    <li>Your violation of third-party rights (including intellectual property or privacy rights)</li>
                    <li>Negligence or misconduct by you or your users</li>
                    <li>Regulatory compliance failures related to your use of the Services</li>
                    <li>Your interpretation or reliance on assessment results</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-xl font-semibold mb-4">16.2 ERMITS Indemnification</h3>
                  <p className="text-muted-foreground leading-relaxed mb-2">
                    ERMITS agrees to indemnify, defend, and hold you harmless from third-party claims alleging that the Services infringe a valid U.S. patent, copyright, or trademark, provided that you:
                  </p>
                  <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                    <li>Promptly notify ERMITS in writing of the claim</li>
                    <li>Grant ERMITS sole control of defense and settlement</li>
                    <li>Reasonably cooperate with ERMITS in the defense</li>
                  </ul>
                  <p className="text-muted-foreground leading-relaxed mt-3 text-sm mb-2">ERMITS' obligations do not apply to claims arising from:</p>
                  <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                    <li>Modifications to the Services not made by ERMITS</li>
                    <li>Use of the Services in combination with non-ERMITS products</li>
                    <li>Use of the Services in violation of these Terms</li>
                    <li>Use of open-source components subject to their original licenses</li>
                    <li>User Data or third-party content</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-xl font-semibold mb-4">16.3 Exclusive Remedy</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    Section 16.2 states ERMITS' sole obligation and your exclusive remedy for intellectual property infringement claims.
                  </p>
                </div>

                <div>
                  <h3 className="text-xl font-semibold mb-4">16.4 Indemnification Process</h3>
                  <p className="text-muted-foreground leading-relaxed mb-2">The indemnified party must:</p>
                  <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                    <li>Provide prompt written notice of any claim</li>
                    <li>Allow the indemnifying party control of defense and settlement</li>
                    <li>Cooperate reasonably in the defense</li>
                    <li>Not admit fault or settle without prior written consent</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* Section 17: Force Majeure */}
            <section>
              <h2 id="section-17" className="text-2xl font-bold mb-6 pb-3 border-b">17. FORCE MAJEURE</h2>
              
              <p className="text-muted-foreground leading-relaxed mb-4">
                ERMITS shall not be liable for any failure or delay in performance due to causes beyond its reasonable control, including but not limited to:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                <li>Acts of God (natural disasters, pandemics, epidemics)</li>
                <li>War, terrorism, civil unrest, or government actions</li>
                <li>Internet service provider failures or disruptions</li>
                <li>Power outages or telecommunications failures</li>
                <li>Cyberattacks, DDoS attacks, or security incidents</li>
                <li>Labor disputes or strikes</li>
                <li>Failures of third-party service providers</li>
              </ul>
              <p className="text-muted-foreground leading-relaxed mt-4">
                During force majeure events, ERMITS will use commercially reasonable efforts to minimize service disruptions and provide timely updates.
              </p>
            </section>

            {/* Section 18: Service Level Commitments */}
            <section>
              <h2 id="section-18" className="text-2xl font-bold mb-6 pb-3 border-b">18. SERVICE LEVEL COMMITMENTS</h2>
              
              <div className="space-y-4">
                <div>
                  <h3 className="text-xl font-semibold mb-4">18.1 Uptime Commitment</h3>
                  <p className="text-muted-foreground leading-relaxed mb-2">
                    ERMITS targets 99.9% uptime for production Services (excluding Beta Products), calculated monthly. Uptime excludes:
                  </p>
                  <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                    <li>Scheduled maintenance (announced 48 hours in advance)</li>
                    <li>Emergency maintenance for security or critical issues</li>
                    <li>Force majeure events</li>
                    <li>User error or misuse</li>
                    <li>Third-party service failures</li>
                    <li>Beta Products</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-xl font-semibold mb-4">18.2 Scheduled Maintenance</h3>
                  <p className="text-muted-foreground leading-relaxed mb-2">ERMITS may perform scheduled maintenance during low-usage windows. ERMITS will:</p>
                  <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                    <li>Provide 48 hours' advance notice for planned maintenance</li>
                    <li>Schedule maintenance during off-peak hours when possible</li>
                    <li>Minimize duration of service disruptions</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-xl font-semibold mb-4">18.3 SLA Credits</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    Detailed uptime guarantees, measurement methodologies, and SLA credits for Enterprise customers are set forth in the Service Level Agreement (Enterprise Policies).
                  </p>
                </div>

                <div>
                  <h3 className="text-xl font-semibold mb-4">18.4 Beta Product Exclusions</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    Beta Products are explicitly excluded from uptime commitments and SLA credits. ERMITS makes no guarantees regarding Beta Product availability, performance, or data integrity.
                  </p>
                </div>
              </div>
            </section>

            {/* Section 19: Modifications to Services and Terms */}
            <section>
              <h2 id="section-19" className="text-2xl font-bold mb-6 pb-3 border-b">19. MODIFICATIONS TO SERVICES AND TERMS</h2>
              
              <div className="space-y-4">
                <div>
                  <h3 className="text-xl font-semibold mb-4">19.1 Service Modifications</h3>
                  <p className="text-muted-foreground leading-relaxed mb-2">ERMITS reserves the right to:</p>
                  <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                    <li>Modify, suspend, or discontinue Services at any time</li>
                    <li>Add or remove features or functionality</li>
                    <li>Change pricing with 30 days' notice for existing customers</li>
                    <li>Update technical requirements or system specifications</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-xl font-semibold mb-4">19.2 Terms Modifications</h3>
                  <p className="text-muted-foreground leading-relaxed mb-2">ERMITS may update these Terms periodically. For material changes:</p>
                  <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                    <li>ERMITS will provide 30 days' advance notice via email or in-app notification</li>
                    <li>Continued use after the effective date constitutes acceptance</li>
                    <li>If you do not agree to changes, you must discontinue use and may cancel your account</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-xl font-semibold mb-4">19.3 Non-Material Changes</h3>
                  <p className="text-muted-foreground leading-relaxed mb-2">For non-material changes (clarifications, typo corrections, formatting):</p>
                  <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                    <li>ERMITS will update the "Last Updated" date</li>
                    <li>Changes are effective immediately upon posting</li>
                    <li>Continued use constitutes acceptance</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* Section 20: Governing Law and Dispute Resolution */}
            <section>
              <h2 id="section-20" className="text-2xl font-bold mb-6 pb-3 border-b">20. GOVERNING LAW AND DISPUTE RESOLUTION</h2>
              
              <div className="space-y-4">
                <div>
                  <h3 className="text-xl font-semibold mb-4">20.1 Governing Law</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    These Terms are governed by and construed in accordance with the laws of the District of Columbia, United States, without regard to conflict of law principles. The United Nations Convention on Contracts for the International Sale of Goods does not apply.
                  </p>
                </div>

                <div>
                  <h3 className="text-xl font-semibold mb-4">20.2 Jurisdiction and Venue</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    Subject to the arbitration provision below, any legal action or proceeding relating to these Terms shall be brought exclusively in the federal or state courts located in Washington, D.C. You consent to the personal jurisdiction of such courts and waive any objection to venue.
                  </p>
                </div>

                <div>
                  <h3 className="text-xl font-semibold mb-4">20.3 Binding Arbitration</h3>
                  <p className="text-muted-foreground leading-relaxed mb-2">
                    Any dispute, controversy, or claim arising out of or relating to these Terms or the breach, termination, enforcement, interpretation, or validity thereof (collectively, "Disputes") shall be resolved by binding arbitration administered by the American Arbitration Association (AAA) under its Commercial Arbitration Rules.
                  </p>
                  <p className="font-semibold mt-4 mb-2">Arbitration Procedures:</p>
                  <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                    <li>Arbitration shall be conducted in Washington, D.C.</li>
                    <li>Arbitration shall be by a single arbitrator</li>
                    <li>Arbitrator shall apply District of Columbia law</li>
                    <li>Discovery shall be limited as determined by the arbitrator</li>
                    <li>Each party bears its own costs and fees</li>
                    <li>Arbitrator's decision is final and binding</li>
                    <li>Judgment may be entered in any court with jurisdiction</li>
                  </ul>
                  <p className="font-semibold mt-4 mb-2">Exceptions to Arbitration:</p>
                  <p className="text-muted-foreground leading-relaxed mb-2">The following may be brought in court without arbitration:</p>
                  <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                    <li>Claims seeking injunctive or equitable relief for intellectual property infringement</li>
                    <li>Small claims court actions within jurisdictional limits</li>
                    <li>Claims for violation of computer fraud and abuse statutes</li>
                  </ul>
                  <p className="font-semibold mt-4 mb-2">Class Action Waiver:</p>
                  <p className="text-muted-foreground leading-relaxed">
                    YOU AND ERMITS AGREE THAT DISPUTES MUST BE BROUGHT ON AN INDIVIDUAL BASIS ONLY, AND NOT AS A PLAINTIFF OR CLASS MEMBER IN ANY PURPORTED CLASS, REPRESENTATIVE, OR COLLECTIVE PROCEEDING. CLASS ARBITRATIONS, CLASS ACTIONS, AND REPRESENTATIVE ACTIONS ARE NOT PERMITTED.
                  </p>
                </div>

                <div>
                  <h3 className="text-xl font-semibold mb-4">20.4 Opt-Out of Arbitration</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    You may opt out of the arbitration provision by sending written notice to ERMITS at <a href="mailto:legal@ermits.com" className="text-primary hover:underline">legal@ermits.com</a> within 30 days of first accepting these Terms. The notice must include your name, address, and a clear statement that you wish to opt out of arbitration. If you opt out, disputes will be resolved in court pursuant to Section 20.2.
                  </p>
                </div>
              </div>
            </section>

            {/* Section 21: General Provisions */}
            <section>
              <h2 id="section-21" className="text-2xl font-bold mb-6 pb-3 border-b">21. GENERAL PROVISIONS</h2>
              
              <div className="space-y-4">
                <div>
                  <h3 className="text-xl font-semibold mb-4">21.1 Entire Agreement</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    These Terms, together with the Privacy Policy and any product-specific addendums, constitute the entire agreement between you and ERMITS regarding the Services and supersede all prior agreements, understandings, and communications.
                  </p>
                </div>

                <div>
                  <h3 className="text-xl font-semibold mb-4">21.2 Severability</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    If any provision of these Terms is found to be invalid, illegal, or unenforceable, the remaining provisions shall continue in full force and effect. The invalid provision shall be modified to the minimum extent necessary to make it valid and enforceable.
                  </p>
                </div>

                <div>
                  <h3 className="text-xl font-semibold mb-4">21.3 Waiver</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    The failure of ERMITS to enforce any right or provision of these Terms shall not constitute a waiver of such right or provision. Any waiver must be in writing and signed by an authorized representative of ERMITS.
                  </p>
                </div>

                <div>
                  <h3 className="text-xl font-semibold mb-4">21.4 Assignment</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    You may not assign or transfer these Terms or any rights hereunder without ERMITS' prior written consent. ERMITS may assign these Terms without restriction, including to any successor or acquirer. Any attempted assignment in violation of this provision is void.
                  </p>
                </div>

                <div>
                  <h3 className="text-xl font-semibold mb-4">21.5 No Third-Party Beneficiaries</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    These Terms are for the benefit of you and ERMITS only and are not intended to benefit or create any right or cause of action in any third party.
                  </p>
                </div>

                <div>
                  <h3 className="text-xl font-semibold mb-4">21.6 Notices</h3>
                  <p className="text-muted-foreground leading-relaxed mb-2">All notices under these Terms must be in writing and shall be deemed given:</p>
                  <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                    <li>When delivered personally or by confirmed delivery service</li>
                    <li>When sent by email to <a href="mailto:legal@ermits.com" className="text-primary hover:underline">legal@ermits.com</a> (for notices to ERMITS)</li>
                    <li>When sent by email to your registered email address (for notices to you)</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-xl font-semibold mb-4">21.7 Export Controls</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    The Services and related technology may be subject to U.S. export control laws and regulations. You agree to comply with all applicable export and re-export restrictions and may not export or re-export the Services to prohibited countries, entities, or persons.
                  </p>
                </div>

                <div>
                  <h3 className="text-xl font-semibold mb-4">21.8 U.S. Government Rights</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    The Services are "commercial computer software" and "commercial computer software documentation" as defined in FAR 12.212 and DFARS 227.7202. U.S. Government rights are limited to those set forth in these Terms.
                  </p>
                </div>

                <div>
                  <h3 className="text-xl font-semibold mb-4">21.9 Independent Contractors</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    The parties are independent contractors. These Terms do not create a partnership, joint venture, agency, or employment relationship.
                  </p>
                </div>

                <div>
                  <h3 className="text-xl font-semibold mb-4">21.10 Survival</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    Provisions that by their nature should survive termination shall survive, including: data ownership, intellectual property, disclaimers, limitations of liability, indemnification, and dispute resolution.
                  </p>
                </div>
              </div>
            </section>

            {/* Section 22: Contact Information */}
            <section>
              <h2 id="section-22" className="text-2xl font-bold mb-6 pb-3 border-b flex items-center">
                <Mail className="h-6 w-6 mr-2 text-primary" />
                22. CONTACT INFORMATION
              </h2>
              
              <div className="space-y-4">
                <p className="text-muted-foreground leading-relaxed">For questions, concerns, or notices regarding these Terms:</p>
                
                <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6 space-y-3">
                  <p className="text-muted-foreground"><strong>ERMITS LLC</strong></p>
                  <p className="text-muted-foreground">Email: <a href="mailto:contact@ermits.com" className="text-primary hover:underline">contact@ermits.com</a></p>
                  <p className="text-muted-foreground">Website: <a href="https://www.ermits.com" className="text-primary hover:underline">www.ermits.com</a></p>
                </div>

                <p className="text-muted-foreground text-sm mt-4">For technical support inquiries:<br />
                Email: <a href="mailto:support@ermits.com" className="text-primary hover:underline">support@ermits.com</a></p>

                <p className="text-muted-foreground text-sm mt-4">For privacy inquiries:<br />
                Email: <a href="mailto:privacy@ermits.com" className="text-primary hover:underline">privacy@ermits.com</a></p>

                <p className="text-muted-foreground text-sm mt-4">For compliance and legal inquiries:<br />
                Email: <a href="mailto:legal@ermits.com" className="text-primary hover:underline">legal@ermits.com</a></p>
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