import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Shield, AlertTriangle, Lock, FileText, CheckCircle, XCircle, Mail } from 'lucide-react';

const AcceptableUse = () => {
  return (
    <div className="py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4 text-foreground">Acceptable Use Policy</h1>
          <p className="text-xl text-muted-foreground mb-2">
            ERMITS LLC Acceptable Use Policy governs your use of Services
          </p>
          <p className="text-sm text-muted-foreground">
            <strong>Effective Date:</strong> October 31, 2025 | <strong>Last Updated:</strong> October 31, 2025
          </p>
        </div>

        <div className="space-y-8">
          {/* Purpose and Scope */}
          <Card>
            <CardContent className="p-6">
              <h2 className="text-2xl font-semibold mb-4 flex items-center">
                <FileText className="h-6 w-6 text-primary mr-2" />
                3.1 Purpose and Scope
              </h2>
              <p className="text-muted-foreground mb-4">
                This Acceptable Use Policy ("AUP") governs your use of ERMITS LLC ("ERMITS") Services and supplements 
                the Master Terms of Service. By using the Services, you agree to comply with this AUP.
              </p>
              <p className="text-muted-foreground">
                This AUP defines prohibited activities and behavioral standards for all ERMITS users. Violation of this 
                AUP may result in immediate suspension or termination of your access to the Services.
              </p>
            </CardContent>
          </Card>

          {/* Prohibited Activities */}
          <Card>
            <CardContent className="p-6">
              <h2 className="text-2xl font-semibold mb-4 flex items-center">
                <XCircle className="h-6 w-6 text-red-500 mr-2" />
                3.2 Prohibited Activities
              </h2>
              
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium mb-3">3.2.1 Illegal Activities</h3>
                  <p className="text-muted-foreground mb-2">You may not use the Services to:</p>
                  <ul className="space-y-2">
                    <li className="flex items-start">
                      <XCircle className="h-5 w-5 text-red-500 mr-2 mt-0.5 flex-shrink-0" />
                      <span className="text-muted-foreground">Violate any applicable laws, regulations, or ordinances</span>
                    </li>
                    <li className="flex items-start">
                      <XCircle className="h-5 w-5 text-red-500 mr-2 mt-0.5 flex-shrink-0" />
                      <span className="text-muted-foreground">Engage in, promote, or facilitate illegal activities</span>
                    </li>
                    <li className="flex items-start">
                      <XCircle className="h-5 w-5 text-red-500 mr-2 mt-0.5 flex-shrink-0" />
                      <span className="text-muted-foreground">Violate intellectual property rights, privacy rights, or other third-party rights</span>
                    </li>
                    <li className="flex items-start">
                      <XCircle className="h-5 w-5 text-red-500 mr-2 mt-0.5 flex-shrink-0" />
                      <span className="text-muted-foreground">Engage in fraud, money laundering, or financial crimes</span>
                    </li>
                    <li className="flex items-start">
                      <XCircle className="h-5 w-5 text-red-500 mr-2 mt-0.5 flex-shrink-0" />
                      <span className="text-muted-foreground">Facilitate human trafficking, child exploitation, or other serious crimes</span>
                    </li>
                    <li className="flex items-start">
                      <XCircle className="h-5 w-5 text-red-500 mr-2 mt-0.5 flex-shrink-0" />
                      <span className="text-muted-foreground">Violate export control or economic sanctions laws</span>
                    </li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-medium mb-3">3.2.2 Security Violations</h3>
                  <p className="text-muted-foreground mb-2">You may not:</p>
                  <ul className="space-y-2">
                    <li className="flex items-start">
                      <XCircle className="h-5 w-5 text-red-500 mr-2 mt-0.5 flex-shrink-0" />
                      <span className="text-muted-foreground">Attempt to gain unauthorized access to Services, user accounts, or computer systems</span>
                    </li>
                    <li className="flex items-start">
                      <XCircle className="h-5 w-5 text-red-500 mr-2 mt-0.5 flex-shrink-0" />
                      <span className="text-muted-foreground">Interfere with or disrupt Services, servers, or networks</span>
                    </li>
                    <li className="flex items-start">
                      <XCircle className="h-5 w-5 text-red-500 mr-2 mt-0.5 flex-shrink-0" />
                      <span className="text-muted-foreground">Introduce malware, viruses, worms, Trojan horses, or other harmful code</span>
                    </li>
                    <li className="flex items-start">
                      <XCircle className="h-5 w-5 text-red-500 mr-2 mt-0.5 flex-shrink-0" />
                      <span className="text-muted-foreground">Conduct vulnerability scanning, penetration testing, or security assessments without prior written authorization</span>
                    </li>
                    <li className="flex items-start">
                      <XCircle className="h-5 w-5 text-red-500 mr-2 mt-0.5 flex-shrink-0" />
                      <span className="text-muted-foreground">Circumvent or attempt to circumvent authentication mechanisms or security controls</span>
                    </li>
                    <li className="flex items-start">
                      <XCircle className="h-5 w-5 text-red-500 mr-2 mt-0.5 flex-shrink-0" />
                      <span className="text-muted-foreground">Participate in denial-of-service (DoS) or distributed denial-of-service (DDoS) attacks</span>
                    </li>
                    <li className="flex items-start">
                      <XCircle className="h-5 w-5 text-red-500 mr-2 mt-0.5 flex-shrink-0" />
                      <span className="text-muted-foreground">Engage in password cracking, network sniffing, or packet manipulation</span>
                    </li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-medium mb-3">3.2.3 Data and Privacy Violations</h3>
                  <p className="text-muted-foreground mb-2">You may not:</p>
                  <ul className="space-y-2">
                    <li className="flex items-start">
                      <XCircle className="h-5 w-5 text-red-500 mr-2 mt-0.5 flex-shrink-0" />
                      <span className="text-muted-foreground">Collect, store, or process personal data in violation of applicable privacy laws (GDPR, CCPA, etc.)</span>
                    </li>
                    <li className="flex items-start">
                      <XCircle className="h-5 w-5 text-red-500 mr-2 mt-0.5 flex-shrink-0" />
                      <span className="text-muted-foreground">Scrape, harvest, or collect user information without authorization</span>
                    </li>
                    <li className="flex items-start">
                      <XCircle className="h-5 w-5 text-red-500 mr-2 mt-0.5 flex-shrink-0" />
                      <span className="text-muted-foreground">Upload or transmit data containing personally identifiable information (PII) without appropriate safeguards</span>
                    </li>
                    <li className="flex items-start">
                      <XCircle className="h-5 w-5 text-red-500 mr-2 mt-0.5 flex-shrink-0" />
                      <span className="text-muted-foreground">Process special categories of personal data without appropriate legal basis</span>
                    </li>
                    <li className="flex items-start">
                      <XCircle className="h-5 w-5 text-red-500 mr-2 mt-0.5 flex-shrink-0" />
                      <span className="text-muted-foreground">Transmit unsolicited communications (spam, phishing, etc.)</span>
                    </li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-medium mb-3">3.2.4 Abusive Behavior</h3>
                  <p className="text-muted-foreground mb-2">You may not:</p>
                  <ul className="space-y-2">
                    <li className="flex items-start">
                      <XCircle className="h-5 w-5 text-red-500 mr-2 mt-0.5 flex-shrink-0" />
                      <span className="text-muted-foreground">Harass, threaten, intimidate, or harm others</span>
                    </li>
                    <li className="flex items-start">
                      <XCircle className="h-5 w-5 text-red-500 mr-2 mt-0.5 flex-shrink-0" />
                      <span className="text-muted-foreground">Engage in hate speech, discrimination, or incitement of violence</span>
                    </li>
                    <li className="flex items-start">
                      <XCircle className="h-5 w-5 text-red-500 mr-2 mt-0.5 flex-shrink-0" />
                      <span className="text-muted-foreground">Impersonate any person or entity or misrepresent your affiliation</span>
                    </li>
                    <li className="flex items-start">
                      <XCircle className="h-5 w-5 text-red-500 mr-2 mt-0.5 flex-shrink-0" />
                      <span className="text-muted-foreground">Engage in cyberbullying or coordinated harassment campaigns</span>
                    </li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-medium mb-3">3.2.5 System Abuse</h3>
                  <p className="text-muted-foreground mb-2">You may not:</p>
                  <ul className="space-y-2">
                    <li className="flex items-start">
                      <XCircle className="h-5 w-5 text-red-500 mr-2 mt-0.5 flex-shrink-0" />
                      <span className="text-muted-foreground">Exceed rate limits, quotas, or resource allocations</span>
                    </li>
                    <li className="flex items-start">
                      <XCircle className="h-5 w-5 text-red-500 mr-2 mt-0.5 flex-shrink-0" />
                      <span className="text-muted-foreground">Use Services for cryptocurrency mining without authorization</span>
                    </li>
                    <li className="flex items-start">
                      <XCircle className="h-5 w-5 text-red-500 mr-2 mt-0.5 flex-shrink-0" />
                      <span className="text-muted-foreground">Consume excessive bandwidth, storage, or computational resources</span>
                    </li>
                    <li className="flex items-start">
                      <XCircle className="h-5 w-5 text-red-500 mr-2 mt-0.5 flex-shrink-0" />
                      <span className="text-muted-foreground">Create or use multiple accounts to circumvent restrictions or abuse free trials</span>
                    </li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Acceptable Security Research */}
          <Card>
            <CardContent className="p-6">
              <h2 className="text-2xl font-semibold mb-4 flex items-center">
                <Shield className="h-6 w-6 text-primary mr-2" />
                3.3 Acceptable Security Research
              </h2>
              
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-medium mb-2">3.3.1 Bug Bounty and Responsible Disclosure</h3>
                  <p className="text-muted-foreground mb-4">
                    ERMITS encourages responsible security research. If you discover a security vulnerability:
                  </p>
                  
                  <div className="space-y-3">
                    <div>
                      <strong className="text-foreground">Permitted Activities:</strong>
                      <ul className="list-disc ml-6 mt-2 space-y-1 text-muted-foreground">
                        <li>Responsibly report vulnerabilities to contact@ermits.com</li>
                        <li>Conduct good-faith security research on your own accounts</li>
                        <li>Test security features within scope of your own data</li>
                      </ul>
                    </div>
                    
                    <div>
                      <strong className="text-foreground">Required Practices:</strong>
                      <ul className="list-disc ml-6 mt-2 space-y-1 text-muted-foreground">
                        <li>Do not access or modify data belonging to other users</li>
                        <li>Do not perform testing that degrades service performance</li>
                        <li>Do not publicly disclose vulnerabilities before ERMITS has had reasonable time to remediate (90 days recommended)</li>
                        <li>Provide detailed vulnerability reports with reproduction steps</li>
                      </ul>
                    </div>
                    
                    <div>
                      <strong className="text-foreground">Prohibited Activities:</strong>
                      <ul className="list-disc ml-6 mt-2 space-y-1 text-muted-foreground">
                        <li>Social engineering of ERMITS employees or users</li>
                        <li>Denial-of-service testing or performance degradation</li>
                        <li>Physical attacks on ERMITS facilities</li>
                        <li>Testing on production systems without authorization</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Federal Contractor and CUI/FCI Handling */}
          <Card>
            <CardContent className="p-6">
              <h2 className="text-2xl font-semibold mb-4 flex items-center">
                <Shield className="h-6 w-6 text-primary mr-2" />
                3.4 Federal Contractor and CUI/FCI Handling
              </h2>
              
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-medium mb-2">3.4.1 CUI Marking and Handling</h3>
                  <p className="text-muted-foreground mb-2">
                    Users processing CUI or FCI must:
                  </p>
                  <ul className="space-y-2">
                    <li className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-primary mr-2 mt-0.5 flex-shrink-0" />
                      <span className="text-muted-foreground">Properly mark CUI according to NIST SP 800-171 and 32 CFR Part 2002</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-primary mr-2 mt-0.5 flex-shrink-0" />
                      <span className="text-muted-foreground">Use encryption features and self-managed deployment options</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-primary mr-2 mt-0.5 flex-shrink-0" />
                      <span className="text-muted-foreground">Implement appropriate access controls and authentication</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-primary mr-2 mt-0.5 flex-shrink-0" />
                      <span className="text-muted-foreground">Maintain audit logs of CUI access</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-primary mr-2 mt-0.5 flex-shrink-0" />
                      <span className="text-muted-foreground">Report cyber incidents as required by DFARS 252.204-7012 (72 hours to DoD)</span>
                    </li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-medium mb-2">3.4.2 Prohibited CUI Activities</h3>
                  <p className="text-muted-foreground mb-2">You may not:</p>
                  <ul className="space-y-2">
                    <li className="flex items-start">
                      <XCircle className="h-5 w-5 text-red-500 mr-2 mt-0.5 flex-shrink-0" />
                      <span className="text-muted-foreground">Process CUI without appropriate safeguards</span>
                    </li>
                    <li className="flex items-start">
                      <XCircle className="h-5 w-5 text-red-500 mr-2 mt-0.5 flex-shrink-0" />
                      <span className="text-muted-foreground">Share CUI with unauthorized users or countries</span>
                    </li>
                    <li className="flex items-start">
                      <XCircle className="h-5 w-5 text-red-500 mr-2 mt-0.5 flex-shrink-0" />
                      <span className="text-muted-foreground">Export CUI in violation of export control laws</span>
                    </li>
                    <li className="flex items-start">
                      <XCircle className="h-5 w-5 text-red-500 mr-2 mt-0.5 flex-shrink-0" />
                      <span className="text-muted-foreground">Fail to report cyber incidents involving CUI within required timeframes (72 hours to DoD)</span>
                    </li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Enforcement and Consequences */}
          <Card>
            <CardContent className="p-6">
              <h2 className="text-2xl font-semibold mb-4 flex items-center">
                <AlertTriangle className="h-6 w-6 text-primary mr-2" />
                3.7 Enforcement and Consequences
              </h2>
              
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-medium mb-2">3.7.2 Enforcement Actions</h3>
                  <p className="text-muted-foreground mb-3">
                    Depending on violation severity, ERMITS may:
                  </p>
                  
                  <div className="space-y-3">
                    <div>
                      <strong className="text-foreground">Warning:</strong>
                      <ul className="list-disc ml-6 mt-1 space-y-1 text-muted-foreground">
                        <li>Email notification of violation</li>
                        <li>Request for corrective action</li>
                        <li>Monitoring of future compliance</li>
                      </ul>
                    </div>
                    
                    <div>
                      <strong className="text-foreground">Temporary Suspension:</strong>
                      <ul className="list-disc ml-6 mt-1 space-y-1 text-muted-foreground">
                        <li>Immediate suspension of account access</li>
                        <li>Opportunity to respond and remediate</li>
                        <li>Reinstatement upon resolution</li>
                      </ul>
                    </div>
                    
                    <div>
                      <strong className="text-foreground">Permanent Termination:</strong>
                      <ul className="list-disc ml-6 mt-1 space-y-1 text-muted-foreground">
                        <li>Immediate and permanent account closure</li>
                        <li>No refund of fees</li>
                        <li>Ban from future use of Services</li>
                        <li>Reporting to authorities if required</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-medium mb-2">3.7.3 Appeals</h3>
                  <p className="text-muted-foreground">
                    If you believe an enforcement action was made in error, contact contact@ermits.com (Subject: "AUP Enforcement Appeal"). 
                    Provide detailed explanation and evidence. ERMITS will review and respond within 10 business days. 
                    Decision is final and at ERMITS' sole discretion.
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
                3.11 Contact Information
              </h2>
              
              <div className="space-y-3 text-muted-foreground">
                <p><strong>AUP Violation Reports:</strong></p>
                <p>Email: <Mail className="inline h-4 w-4" /> contact@ermits.com (Subject: "AUP Violation Report")</p>
                <p className="mt-4"><strong>AUP Questions:</strong></p>
                <p>Email: <Mail className="inline h-4 w-4" /> contact@ermits.com (Subject: "AUP Inquiry")</p>
                <p className="mt-4"><strong>Appeals:</strong></p>
                <p>Email: <Mail className="inline h-4 w-4" /> contact@ermits.com (Subject: "AUP Enforcement Appeal")</p>
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
            <Link to="/cookies">
              <Button variant="outline">Cookie Policy</Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AcceptableUse;

