import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { FileText, Scale, AlertTriangle, Shield, Database, Globe, Lock, Mail, CheckCircle } from 'lucide-react';

const Terms = () => {
  return (
    <div className="py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4 text-foreground">Master Terms of Service</h1>
          <p className="text-xl text-muted-foreground mb-2">
            ERMITS LLC products, platforms, and services
          </p>
          <p className="text-sm text-muted-foreground">
            <strong>Effective Date:</strong> October 31, 2025 | <strong>Last Updated:</strong> October 31, 2025
          </p>
        </div>

        <div className="space-y-8">
          {/* Introduction */}
          <Card>
            <CardContent className="p-6">
              <h2 className="text-2xl font-semibold mb-4 flex items-center">
                <FileText className="h-6 w-6 text-primary mr-2" />
                1.1 Scope and Applicability
              </h2>
              <p className="text-muted-foreground mb-4">
                By accessing or using any ERMITS LLC ("ERMITS," "we," "our," or "us") products, platforms, or services 
                (collectively, the "Services"), you ("User," "you," or "your") agree to be bound by these Master Terms of 
                Service ("Terms"). If you do not agree to these Terms, do not use our Services.
              </p>
              <p className="text-muted-foreground mb-4">
                These Terms govern your use of all ERMITS products, including but not limited to:
              </p>
              <div className="space-y-3">
                <div>
                  <strong className="text-foreground">TechnoSoluce™ Brand Products:</strong>
                  <ul className="list-disc ml-6 mt-1 space-y-1 text-muted-foreground">
                    <li>SBOM Analyzer - Software supply chain security and vulnerability analysis</li>
                  </ul>
                </div>
                <div>
                  <strong className="text-foreground">CyberCertitude™ Brand Products:</strong>
                  <ul className="list-disc ml-6 mt-1 space-y-1 text-muted-foreground">
                    <li>CMMC 2.0 Level 1 Implementation Suite</li>
                    <li>CMMC 2.0 Level 2 Compliance Platform</li>
                    <li>Original Toolkit (localStorage-based compliance management)</li>
                  </ul>
                </div>
                <div>
                  <strong className="text-foreground">CyberCorrect™ Brand Products:</strong>
                  <ul className="list-disc ml-6 mt-1 space-y-1 text-muted-foreground">
                    <li>Privacy Portal (Workplace privacy compliance)</li>
                    <li>Privacy Platform (Multi-regulation privacy compliance automation)</li>
                  </ul>
                </div>
                <div>
                  <strong className="text-foreground">CyberCaution™ Brand Products:</strong>
                  <ul className="list-disc ml-6 mt-1 space-y-1 text-muted-foreground">
                    <li>RansomCheck (Ransomware readiness assessment)</li>
                    <li>Security Toolkit (Comprehensive cybersecurity assessment platform)</li>
                    <li>RiskProfessional (CISA-aligned security assessments)</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Privacy-First Architecture */}
          <Card>
            <CardContent className="p-6">
              <h2 className="text-2xl font-semibold mb-4 flex items-center">
                <Shield className="h-6 w-6 text-primary mr-2" />
                1.4 Privacy-First Architecture and Data Handling
              </h2>
              <p className="text-muted-foreground mb-4">
                ERMITS implements a Privacy-First Architecture across all products, built on the following principles:
              </p>
              
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-medium mb-2">1.4.1 Client-Side Processing</h3>
                  <p className="text-muted-foreground">
                    All core computational functions (assessments, SBOM analysis, risk scoring, compliance evaluations) 
                    are performed locally within your browser or self-managed environment whenever technically feasible.
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-medium mb-2">1.4.2 Data Sovereignty Options</h3>
                  <p className="text-muted-foreground mb-2">You have multiple deployment and storage options:</p>
                  <div className="space-y-2">
                    <div className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-primary mr-2 mt-0.5 flex-shrink-0" />
                      <div>
                        <strong className="text-foreground">Local Storage Options:</strong>
                        <span className="text-muted-foreground"> Browser-based local storage (IndexedDB, localStorage), Desktop application, On-premises deployment</span>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-primary mr-2 mt-0.5 flex-shrink-0" />
                      <div>
                        <strong className="text-foreground">Cloud Storage Options:</strong>
                        <span className="text-muted-foreground"> Self-managed cloud infrastructure, ERMITS-managed cloud, Hybrid deployment</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-medium mb-2">1.4.4 Zero-Knowledge Principles</h3>
                  <p className="text-muted-foreground">
                    When using ERMITS-managed cloud services with encryption enabled: Data is encrypted client-side using 
                    AES-256-GCM via WebCrypto. Encryption keys are derived from your credentials and never transmitted to ERMITS. 
                    ERMITS administrators cannot decrypt your data. You are solely responsible for maintaining access to your encryption keys.
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-medium mb-2">1.4.5 Data Minimization</h3>
                  <p className="text-muted-foreground mb-2">ERMITS collects only the minimum data necessary for service functionality:</p>
                  <ul className="list-disc ml-6 space-y-1 text-muted-foreground">
                    <li><strong>Never Collected:</strong> Raw SBOM files, assessment content, CUI, FCI, proprietary business data, or detailed vulnerability findings</li>
                    <li><strong>Optionally Collected:</strong> Account information (name, email, company) for authentication and billing</li>
                    <li><strong>Pseudonymized Telemetry:</strong> Anonymous performance metrics using irreversible cryptographic hashing (opt-in or opt-out)</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* User Data Ownership */}
          <Card>
            <CardContent className="p-6">
              <h2 className="text-2xl font-semibold mb-4 flex items-center">
                <Database className="h-6 w-6 text-primary mr-2" />
                1.6 User Data Ownership and Responsibilities
              </h2>
              
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-medium mb-2">1.6.1 User Data Ownership</h3>
                  <p className="text-muted-foreground">
                    You retain all ownership rights in your User Data. ERMITS does not claim any ownership or intellectual 
                    property rights in your User Data.
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-medium mb-2">1.6.3 User Data Responsibilities</h3>
                  <p className="text-muted-foreground mb-2">You are solely responsible for:</p>
                  <ul className="space-y-2">
                    <li className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-primary mr-2 mt-0.5 flex-shrink-0" />
                      <span className="text-muted-foreground">The accuracy, quality, and legality of your User Data</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-primary mr-2 mt-0.5 flex-shrink-0" />
                      <span className="text-muted-foreground">The means by which you acquired User Data</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-primary mr-2 mt-0.5 flex-shrink-0" />
                      <span className="text-muted-foreground">Compliance with all applicable laws regarding User Data processing</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-primary mr-2 mt-0.5 flex-shrink-0" />
                      <span className="text-muted-foreground">Maintaining appropriate security controls for your User Data</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-primary mr-2 mt-0.5 flex-shrink-0" />
                      <span className="text-muted-foreground">Backup and disaster recovery of locally-stored data</span>
                    </li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Acceptable Use */}
          <Card>
            <CardContent className="p-6">
              <h2 className="text-2xl font-semibold mb-4 flex items-center">
                <Lock className="h-6 w-6 text-primary mr-2" />
                1.11 Acceptable Use
              </h2>
              <p className="text-muted-foreground mb-4">
                You agree to use the Services only for lawful purposes and in accordance with these Terms. Prohibited uses include:
              </p>
              
              <div className="space-y-3">
                <div>
                  <h3 className="text-lg font-medium mb-2">1.11.1 Illegal Activities</h3>
                  <ul className="list-disc ml-6 space-y-1 text-muted-foreground">
                    <li>Violating any applicable laws, regulations, or third-party rights</li>
                    <li>Engaging in fraud, money laundering, or other criminal activities</li>
                    <li>Facilitating illegal activities or transactions</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-medium mb-2">1.11.2 Security Violations</h3>
                  <ul className="list-disc ml-6 space-y-1 text-muted-foreground">
                    <li>Attempting to gain unauthorized access to Services or user accounts</li>
                    <li>Interfering with or disrupting Services or servers</li>
                    <li>Introducing malware, viruses, or harmful code</li>
                    <li>Circumventing security measures or authentication mechanisms</li>
                    <li>Conducting security testing without prior written authorization</li>
                  </ul>
                </div>
              </div>
              
              <p className="text-muted-foreground text-sm mt-4">
                Detailed acceptable use provisions are set forth in the <Link to="/acceptable-use" className="text-primary hover:underline">Acceptable Use Policy</Link>.
              </p>
            </CardContent>
          </Card>

          {/* Limitation of Liability */}
          <Card>
            <CardContent className="p-6">
              <h2 className="text-2xl font-semibold mb-4 flex items-center">
                <AlertTriangle className="h-6 w-6 text-primary mr-2" />
                1.15 Limitation of Liability
              </h2>
              <p className="text-muted-foreground mb-4">
                TO THE MAXIMUM EXTENT PERMITTED BY APPLICABLE LAW, IN NO EVENT SHALL ERMITS LLC, ITS AFFILIATES, OFFICERS, 
                DIRECTORS, EMPLOYEES, AGENTS, OR LICENSORS BE LIABLE FOR ANY:
              </p>
              <ul className="list-disc ml-6 space-y-2 text-muted-foreground">
                <li>Indirect, incidental, special, consequential, or punitive damages</li>
                <li>Loss of profits, revenue, data, use, goodwill, or other intangible losses</li>
                <li>Business interruption or lost business opportunities</li>
                <li>Regulatory fines, penalties, or compliance costs</li>
                <li>Cost of procurement of substitute services</li>
                <li>Unauthorized access to or alteration of User Data</li>
                <li>Results of security assessments or compliance evaluations</li>
              </ul>
              
              <div className="mt-4">
                <h3 className="text-lg font-medium mb-2">1.15.2 Cap on Liability</h3>
                <p className="text-muted-foreground">
                  ERMITS' TOTAL AGGREGATE LIABILITY ARISING OUT OF OR RELATED TO THESE TERMS OR USE OF THE SERVICES SHALL 
                  NOT EXCEED THE GREATER OF: $100 USD, or The total amount paid by you to ERMITS in the 12 months preceding the claim.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Warranties and Disclaimers */}
          <Card>
            <CardContent className="p-6">
              <h2 className="text-2xl font-semibold mb-4 flex items-center">
                <Scale className="h-6 w-6 text-primary mr-2" />
                1.14 Warranties and Disclaimers
              </h2>
              
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-medium mb-2">1.14.1 Limited Warranty</h3>
                  <p className="text-muted-foreground">
                    ERMITS warrants that the Services will perform substantially in accordance with published documentation 
                    under normal use. This warranty does not apply to Beta Products, free tiers, issues caused by user error, 
                    or third-party services.
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-medium mb-2">1.14.3 Compliance Disclaimer</h3>
                  <p className="text-muted-foreground mb-2">
                    ERMITS products are tools to assist with security and compliance efforts but:
                  </p>
                  <ul className="list-disc ml-6 space-y-1 text-muted-foreground">
                    <li>Do not guarantee compliance with any regulatory framework</li>
                    <li>Do not constitute legal, compliance, or professional consulting advice</li>
                    <li>Require users to interpret results in the context of their specific obligations</li>
                    <li>Do not replace qualified security assessments or professional audits</li>
                    <li>Are not certification authorities (not C3PAO, not CISA-endorsed)</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Federal Contractor Terms */}
          <Card>
            <CardContent className="p-6">
              <h2 className="text-2xl font-semibold mb-4 flex items-center">
                <Shield className="h-6 w-6 text-primary mr-2" />
                1.10 Federal Contractor Specific Terms
              </h2>
              
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-medium mb-2">1.10.1 Applicability</h3>
                  <p className="text-muted-foreground">
                    This section applies to users who are U.S. federal contractors or subcontractors handling Federal 
                    Contract Information (FCI) or Controlled Unclassified Information (CUI).
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-medium mb-2">1.10.3 CUI and FCI Handling</h3>
                  <p className="text-muted-foreground mb-2">When using ERMITS Services to process CUI or FCI:</p>
                  <ul className="list-disc ml-6 space-y-1 text-muted-foreground">
                    <li>You must use encryption features and self-managed deployment options</li>
                    <li>You are responsible for properly marking and handling CUI/FCI</li>
                    <li>ERMITS does not access or process CUI/FCI due to Privacy-First Architecture</li>
                    <li>You must implement appropriate access controls and audit logging</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Governing Law */}
          <Card>
            <CardContent className="p-6">
              <h2 className="text-2xl font-semibold mb-4 flex items-center">
                <Globe className="h-6 w-6 text-primary mr-2" />
                1.20 Governing Law and Dispute Resolution
              </h2>
              
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-medium mb-2">1.20.1 Governing Law</h3>
                  <p className="text-muted-foreground">
                    These Terms are governed by and construed in accordance with the laws of the District of Columbia, 
                    United States, without regard to conflict of law principles.
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-medium mb-2">1.20.3 Binding Arbitration</h3>
                  <p className="text-muted-foreground">
                    Any dispute, controversy, or claim arising out of or relating to these Terms shall be resolved by 
                    binding arbitration administered by the American Arbitration Association (AAA) under its Commercial Arbitration Rules.
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
                1.22 Contact Information
              </h2>
              
              <div className="space-y-3 text-muted-foreground">
                <p><strong>ERMITS LLC</strong></p>
                <p>Email: <Mail className="inline h-4 w-4" /> contact@ermits.com</p>
                <p>Website: www.ermits.com</p>
                <p className="mt-4"><strong>For questions, concerns, or notices regarding these Terms:</strong></p>
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

export default Terms;
