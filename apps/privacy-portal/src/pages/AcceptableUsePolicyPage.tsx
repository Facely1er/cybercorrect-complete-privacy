import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Mail, Shield, AlertTriangle, Ban } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Breadcrumb } from '../components/ui/Breadcrumb';

export function AcceptableUsePolicyPage() {
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
            <h1 className="text-4xl font-bold mb-2">ACCEPTABLE USE POLICY</h1>
            <p className="text-muted-foreground text-lg">
              <strong>Effective Date:</strong> October 31, 2025 | <strong>Last Updated:</strong> December 13, 2025
            </p>
          </div>

          <div className="bg-card rounded-lg border p-8 space-y-12 prose prose-lg max-w-none">
            {/* Introduction */}
            <section className="border-b pb-8">
              <p className="text-muted-foreground leading-relaxed text-base mb-4">
                This Acceptable Use Policy ("AUP") governs your use of ERMITS LLC ("ERMITS") Services and supplements the Master Terms of Service. By using the Services, you agree to comply with this AUP.
              </p>
            </section>

            {/* Section 1: Purpose and Scope */}
            <section>
              <h2 className="text-2xl font-semibold mb-4">1. Purpose and Scope</h2>
              <p className="text-muted-foreground leading-relaxed">
                This AUP defines prohibited activities and behavioral standards for all ERMITS users. Violation of this AUP may result in immediate suspension or termination of your access to the Services.
              </p>
            </section>

            {/* Section 2: Prohibited Activities */}
            <section>
              <h2 className="text-2xl font-semibold mb-4 flex items-center">
                <Ban className="h-6 w-6 mr-2 text-primary" />
                2. Prohibited Activities
              </h2>
              
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-semibold mb-3">2.1 Illegal Activities</h3>
                  <p className="text-muted-foreground leading-relaxed mb-2">You may not use the Services to:</p>
                  <ul className="list-disc pl-6 text-muted-foreground space-y-1">
                    <li>Violate any applicable laws, regulations, or ordinances</li>
                    <li>Engage in, promote, or facilitate illegal activities</li>
                    <li>Violate intellectual property rights, privacy rights, or other third-party rights</li>
                    <li>Engage in fraud, money laundering, or financial crimes</li>
                    <li>Facilitate human trafficking, child exploitation, or other serious crimes</li>
                    <li>Violate export control or economic sanctions laws</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-xl font-semibold mb-3">2.2 Security Violations</h3>
                  <p className="text-muted-foreground leading-relaxed mb-2">You may not:</p>
                  <ul className="list-disc pl-6 text-muted-foreground space-y-1">
                    <li>Attempt to gain unauthorized access to Services, user accounts, or computer systems</li>
                    <li>Interfere with or disrupt Services, servers, or networks</li>
                    <li>Introduce malware, viruses, worms, Trojan horses, or other harmful code</li>
                    <li>Conduct vulnerability scanning, penetration testing, or security assessments without prior written authorization</li>
                    <li>Circumvent or attempt to circumvent authentication mechanisms or security controls</li>
                    <li>Exploit security vulnerabilities for any purpose</li>
                    <li>Participate in denial-of-service (DoS) or distributed denial-of-service (DDoS) attacks</li>
                    <li>Engage in password cracking, network sniffing, or packet manipulation</li>
                    <li>Use automated tools to bypass rate limits or access restrictions</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-xl font-semibold mb-3">2.3 Data and Privacy Violations</h3>
                  <p className="text-muted-foreground leading-relaxed mb-2">You may not:</p>
                  <ul className="list-disc pl-6 text-muted-foreground space-y-1">
                    <li>Collect, store, or process personal data in violation of applicable privacy laws (GDPR, CCPA, etc.)</li>
                    <li>Scrape, harvest, or collect user information without authorization</li>
                    <li>Use Services to process data you do not have the right to process</li>
                    <li>Upload or transmit data containing personally identifiable information (PII) without appropriate safeguards</li>
                    <li>Process special categories of personal data (health, biometric, genetic, racial/ethnic origin, religious beliefs, etc.) without appropriate legal basis</li>
                    <li>Violate data subject rights or ignore data deletion requests</li>
                    <li>Transmit unsolicited communications (spam, phishing, etc.)</li>
                    <li>Engage in identity theft, impersonation, or social engineering attacks</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-xl font-semibold mb-3">2.4 Abusive Behavior</h3>
                  <p className="text-muted-foreground leading-relaxed mb-2">You may not:</p>
                  <ul className="list-disc pl-6 text-muted-foreground space-y-1">
                    <li>Harass, threaten, intimidate, or harm others</li>
                    <li>Engage in hate speech, discrimination, or incitement of violence</li>
                    <li>Impersonate any person or entity or misrepresent your affiliation</li>
                    <li>Stalk or otherwise harass individuals</li>
                    <li>Post or transmit sexually explicit, violent, or disturbing content (unless specifically authorized for security research purposes)</li>
                    <li>Engage in cyberbullying or coordinated harassment campaigns</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-xl font-semibold mb-3">2.5 System Abuse</h3>
                  <p className="text-muted-foreground leading-relaxed mb-2">You may not:</p>
                  <ul className="list-disc pl-6 text-muted-foreground space-y-1">
                    <li>Exceed rate limits, quotas, or resource allocations</li>
                    <li>Use Services for cryptocurrency mining without authorization</li>
                    <li>Consume excessive bandwidth, storage, or computational resources</li>
                    <li>Interfere with other users' use of Services</li>
                    <li>Attempt to reverse engineer, decompile, or disassemble Services (except as permitted by law)</li>
                    <li>Create or use multiple accounts to circumvent restrictions or abuse free trials</li>
                    <li>Share accounts or credentials with unauthorized users</li>
                    <li>Resell, rent, or lease Services without authorization</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-xl font-semibold mb-3">2.6 Content Violations</h3>
                  <p className="text-muted-foreground leading-relaxed mb-2">You may not upload, transmit, or distribute:</p>
                  <ul className="list-disc pl-6 text-muted-foreground space-y-1">
                    <li>Pirated software, copyrighted materials, or illegally obtained content</li>
                    <li>Malware, exploit code, or hacking tools (except for authorized security research)</li>
                    <li>Content that violates export control laws</li>
                    <li>Misleading, deceptive, or fraudulent content</li>
                    <li>Content promoting dangerous or illegal activities</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-xl font-semibold mb-3">2.7 Competitive Activities</h3>
                  <p className="text-muted-foreground leading-relaxed mb-2">You may not:</p>
                  <ul className="list-disc pl-6 text-muted-foreground space-y-1">
                    <li>Use Services to develop competing products or services</li>
                    <li>Conduct competitive benchmarking or analysis without consent</li>
                    <li>Copy, reproduce, or reverse engineer Services for competitive purposes</li>
                    <li>Publicly disclose performance or benchmark data without authorization</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* Section 3: Acceptable Security Research */}
            <section>
              <h2 className="text-2xl font-semibold mb-4 flex items-center">
                <Shield className="h-6 w-6 mr-2 text-primary" />
                3. Acceptable Security Research
              </h2>
              
              <div className="space-y-4">
                <div>
                  <h3 className="text-xl font-semibold mb-3">3.1 Bug Bounty and Responsible Disclosure</h3>
                  <p className="text-muted-foreground leading-relaxed mb-3">
                    ERMITS encourages responsible security research. If you discover a security vulnerability:
                  </p>
                  <div>
                    <h4 className="font-semibold mb-2">Permitted Activities:</h4>
                    <ul className="list-disc pl-6 text-muted-foreground space-y-1">
                      <li>Responsibly report vulnerabilities to contact@ermits.com</li>
                      <li>Conduct good-faith security research on your own accounts</li>
                      <li>Test security features within scope of your own data</li>
                    </ul>
                  </div>
                  <div className="mt-3">
                    <h4 className="font-semibold mb-2">Required Practices:</h4>
                    <ul className="list-disc pl-6 text-muted-foreground space-y-1">
                      <li>Do not access or modify data belonging to other users</li>
                      <li>Do not perform testing that degrades service performance</li>
                      <li>Do not publicly disclose vulnerabilities before ERMITS has had reasonable time to remediate</li>
                      <li>Provide detailed vulnerability reports with reproduction steps</li>
                      <li>Allow ERMITS reasonable time to respond (90 days recommended)</li>
                    </ul>
                  </div>
                  <div className="mt-3">
                    <h4 className="font-semibold mb-2">Prohibited Activities:</h4>
                    <ul className="list-disc pl-6 text-muted-foreground space-y-1">
                      <li>Social engineering of ERMITS employees or users</li>
                      <li>Denial-of-service testing or performance degradation</li>
                      <li>Physical attacks on ERMITS facilities</li>
                      <li>Testing on production systems without authorization</li>
                    </ul>
                  </div>
                </div>
              </div>
            </section>

            {/* Section 4: Federal Contractor and CUI/FCI Handling */}
            <section>
              <h2 className="text-2xl font-semibold mb-4">4. Federal Contractor and CUI/FCI Handling</h2>
              
              <div className="space-y-4">
                <div>
                  <h3 className="text-xl font-semibold mb-3">4.1 CUI Marking and Handling</h3>
                  <p className="text-muted-foreground leading-relaxed mb-2">Users processing CUI or FCI must:</p>
                  <ul className="list-disc pl-6 text-muted-foreground space-y-1">
                    <li>Properly mark CUI according to NIST SP 800-171 and 32 CFR Part 2002</li>
                    <li>Use encryption features and self-managed deployment options</li>
                    <li>Implement appropriate access controls and authentication</li>
                    <li>Maintain audit logs of CUI access</li>
                    <li>Report cyber incidents as required by DFARS 252.204-7012</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-xl font-semibold mb-3">4.2 Prohibited CUI Activities</h3>
                  <p className="text-muted-foreground leading-relaxed mb-2">You may not:</p>
                  <ul className="list-disc pl-6 text-muted-foreground space-y-1">
                    <li>Process CUI without appropriate safeguards</li>
                    <li>Share CUI with unauthorized users or countries</li>
                    <li>Export CUI in violation of export control laws</li>
                    <li>Fail to report cyber incidents involving CUI within required timeframes (72 hours to DoD)</li>
                    <li>Store CUI on unauthorized systems or in unauthorized locations</li>
                    <li>Transmit CUI over unsecured channels without encryption</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* Section 7: Enforcement and Consequences */}
            <section>
              <h2 className="text-2xl font-semibold mb-4 flex items-center">
                <AlertTriangle className="h-6 w-6 mr-2 text-primary" />
                7. Enforcement and Consequences
              </h2>
              
              <div className="space-y-4">
                <div>
                  <h3 className="text-xl font-semibold mb-3">7.1 Investigation</h3>
                  <p className="text-muted-foreground leading-relaxed mb-2">
                    ERMITS may investigate suspected violations by:
                  </p>
                  <ul className="list-disc pl-6 text-muted-foreground space-y-1">
                    <li>Reviewing account activity and usage patterns</li>
                    <li>Examining audit logs and system logs (pseudonymized)</li>
                    <li>Requesting information from the user</li>
                    <li>Cooperating with law enforcement or regulatory authorities</li>
                  </ul>
                  <p className="text-muted-foreground leading-relaxed mt-3 italic">
                    <strong>Privacy Note:</strong> Due to Privacy-First Architecture, ERMITS cannot access encrypted User Data. Investigations rely on metadata, logs, and user cooperation.
                  </p>
                </div>

                <div>
                  <h3 className="text-xl font-semibold mb-3">7.2 Enforcement Actions</h3>
                  <p className="text-muted-foreground leading-relaxed mb-3">
                    Depending on violation severity, ERMITS may:
                  </p>
                  <div className="space-y-3">
                    <div>
                      <h4 className="font-semibold mb-2">Warning:</h4>
                      <ul className="list-disc pl-6 text-muted-foreground space-y-1">
                        <li>Email notification of violation</li>
                        <li>Request for corrective action</li>
                        <li>Monitoring of future compliance</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2">Temporary Suspension:</h4>
                      <ul className="list-disc pl-6 text-muted-foreground space-y-1">
                        <li>Immediate suspension of account access</li>
                        <li>Opportunity to respond and remediate</li>
                        <li>Reinstatement upon resolution</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2">Permanent Termination:</h4>
                      <ul className="list-disc pl-6 text-muted-foreground space-y-1">
                        <li>Immediate and permanent account closure</li>
                        <li>No refund of fees</li>
                        <li>Ban from future use of Services</li>
                        <li>Reporting to authorities if required</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Section 11: Contact Information */}
            <section>
              <h2 className="text-2xl font-semibold mb-4 flex items-center">
                <Mail className="h-6 w-6 mr-2 text-primary" />
                11. Contact Information
              </h2>
              
              <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6 space-y-4">
                <div>
                  <h3 className="font-semibold mb-2">AUP Violation Reports:</h3>
                  <p className="text-muted-foreground">Email: contact@ermits.com</p>
                  <p className="text-muted-foreground">Subject: "AUP Violation Report"</p>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">AUP Questions:</h3>
                  <p className="text-muted-foreground">Email: contact@ermits.com</p>
                  <p className="text-muted-foreground">Subject: "AUP Inquiry"</p>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Appeals:</h3>
                  <p className="text-muted-foreground">Email: contact@ermits.com</p>
                  <p className="text-muted-foreground">Subject: "AUP Enforcement Appeal"</p>
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
