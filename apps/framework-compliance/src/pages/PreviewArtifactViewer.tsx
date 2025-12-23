import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { ArrowLeft, Eye, ChevronLeft, ChevronRight, Download, FileText, Lock } from 'lucide-react';
import { ProductCatalog, OneTimeProduct } from '../utils/monetization/oneTimeProducts';
import { CheckCircle } from 'lucide-react';
import { generateArtifact } from '../utils/artifacts/artifactGenerators';
import { toast } from '../components/ui/Toaster';

/**
 * Preview Artifact Viewer
 * 
 * INTERNAL USE ONLY - Displays individual preview artifacts separately for detailed review.
 * 
 * Routes:
 * - /preview-artifact/:productId/:previewIndex - View specific preview
 * - /preview-artifact/:productId - View all previews for a product
 */

interface Preview {
  id: string;
  type: string;
  title: string;
  format: string;
  productId: string;
  productName: string;
  content: React.ReactNode | string;
}

const PreviewArtifactViewer = () => {
  const { productId, previewIndex } = useParams<{ productId: string; previewIndex?: string }>();
  const navigate = useNavigate();
  const [product, setProduct] = useState<OneTimeProduct | null>(null);
  const [previews, setPreviews] = useState<Preview[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isInternal, setIsInternal] = useState<boolean | null>(null);

  // Generate preview content for a specific product (helper function)
  // Must be defined before useEffect that uses it
  const generatePreviewsForProduct = React.useCallback((oneTimeProduct: OneTimeProduct): Preview[] => {
    const previews: Preview[] = [];

    // Privacy Toolkit Pro
    if (oneTimeProduct.id === 'privacy-toolkit-pro') {
      previews.push(
        {
          id: 'dpia-sample',
          type: 'template',
          title: 'DPIA Generator Sample',
          format: 'PDF',
          productId: oneTimeProduct.id,
          productName: oneTimeProduct.name,
          content: (
            <div className="p-6 bg-white dark:bg-gray-800 rounded border border-border max-h-[80vh] overflow-y-auto">
              <h3 className="text-xl font-bold mb-4 text-foreground">Data Protection Impact Assessment (DPIA)</h3>
              <div className="space-y-4 text-sm">
                <div className="p-4 bg-blue-50 dark:bg-blue-900/30 rounded border border-blue-200 dark:border-blue-800">
                  <h4 className="font-bold text-foreground mb-2">1. Executive Summary</h4>
                  <p className="text-foreground/80 mb-2">
                    This Data Protection Impact Assessment (DPIA) evaluates the privacy risks associated with the processing of personal data in our customer relationship management system. The assessment identifies potential risks to data subjects' rights and freedoms and outlines mitigation measures to address identified risks.
                  </p>
                  <div className="mt-2 space-y-1 text-xs text-foreground/70">
                    <p><strong>Assessment Date:</strong> {new Date().toLocaleDateString()}</p>
                    <p><strong>Assessment Version:</strong> 1.0</p>
                    <p><strong>Next Review Date:</strong> {new Date(Date.now() + 365*24*60*60*1000).toLocaleDateString()}</p>
                    <p><strong>Assessed By:</strong> Data Protection Officer</p>
                  </div>
                </div>

                <div>
                  <h4 className="font-bold text-foreground mb-2">2. Description of Processing Activity</h4>
                  <div className="space-y-2 text-foreground/80 text-xs">
                    <p><strong>Processing Activity Name:</strong> Customer Data Collection and Storage</p>
                    <p><strong>Purpose of Processing:</strong> To manage customer relationships, process orders, provide customer support, and maintain service records.</p>
                    <p><strong>Legal Basis:</strong> Contract performance (GDPR Article 6(1)(b)) and Legitimate Interest (GDPR Article 6(1)(f))</p>
                    <p><strong>Data Controller:</strong> [Your Organization Name], [Address], [Contact Information]</p>
                    <p><strong>Data Processor:</strong> [Third-party service providers as applicable]</p>
                    <p><strong>Processing Duration:</strong> For the duration of the customer relationship plus 7 years for legal compliance</p>
                  </div>
                </div>

                <div>
                  <h4 className="font-bold text-foreground mb-2">3. Categories of Personal Data</h4>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-3 bg-muted/50 rounded">
                      <strong className="text-foreground text-xs">Identity Data:</strong>
                      <ul className="list-disc list-inside mt-1 text-foreground/80 text-xs space-y-0.5">
                        <li>Full name</li>
                        <li>Email address</li>
                        <li>Phone number</li>
                        <li>Mailing address</li>
                        <li>Date of birth</li>
                      </ul>
                    </div>
                    <div className="p-3 bg-muted/50 rounded">
                      <strong className="text-foreground text-xs">Financial Data:</strong>
                      <ul className="list-disc list-inside mt-1 text-foreground/80 text-xs space-y-0.5">
                        <li>Payment card information (tokenized)</li>
                        <li>Billing address</li>
                        <li>Transaction history</li>
                        <li>Bank account details (where applicable)</li>
                      </ul>
                    </div>
                    <div className="p-3 bg-muted/50 rounded">
                      <strong className="text-foreground text-xs">Technical Data:</strong>
                      <ul className="list-disc list-inside mt-1 text-foreground/80 text-xs space-y-0.5">
                        <li>IP address</li>
                        <li>Browser type and version</li>
                        <li>Device information</li>
                        <li>Usage analytics</li>
                        <li>Login timestamps</li>
                      </ul>
                    </div>
                    <div className="p-3 bg-muted/50 rounded">
                      <strong className="text-foreground text-xs">Profile Data:</strong>
                      <ul className="list-disc list-inside mt-1 text-foreground/80 text-xs space-y-0.5">
                        <li>Preferences and interests</li>
                        <li>Purchase history</li>
                        <li>Support ticket history</li>
                        <li>Communication preferences</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-bold text-foreground mb-2">4. Data Subjects</h4>
                  <p className="text-foreground/80 text-xs">
                    The processing activity affects the following categories of data subjects: customers, prospective customers, website visitors, and individuals who contact our support services. Estimated number of data subjects: [To be determined based on business scale].
                  </p>
                </div>

                <div>
                  <h4 className="font-bold text-foreground mb-2">5. Data Recipients and Transfers</h4>
                  <div className="space-y-2 text-foreground/80 text-xs">
                    <p><strong>Internal Recipients:</strong> Authorized employees in sales, customer support, and IT departments on a need-to-know basis. Access is logged and monitored.</p>
                    <p><strong>External Recipients:</strong> Cloud service providers (AWS, Azure), payment processors (Stripe), email service providers, and analytics platforms. All processors are bound by Data Processing Agreements (DPAs).</p>
                    <p><strong>International Transfers:</strong> Data may be transferred to countries outside the EEA. All transfers are subject to appropriate safeguards including Standard Contractual Clauses (SCCs), adequacy decisions, or Binding Corporate Rules (BCRs).</p>
                  </div>
                </div>

                <div>
                  <h4 className="font-bold text-foreground mb-2">6. Risk Assessment</h4>
                  <div className="space-y-3">
                    <div className="p-3 bg-yellow-50 dark:bg-yellow-900/30 rounded border border-yellow-200 dark:border-yellow-800">
                      <div className="flex items-center gap-2 mb-2">
                        <strong className="text-foreground">Overall Risk Level: MEDIUM</strong>
                        <span className="px-2 py-1 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-200 rounded text-xs font-semibold">
                          Medium Risk
                        </span>
                      </div>
                      <p className="text-xs text-foreground/70">Risk calculated based on likelihood and impact assessment of all identified risks.</p>
                    </div>
                    
                    <div>
                      <strong className="text-foreground mb-2 block text-xs">Identified Risks:</strong>
                      <div className="space-y-2 text-xs">
                        <div className="p-2 bg-red-50 dark:bg-red-900/20 rounded">
                          <strong className="text-foreground">Risk 1: Unauthorized Access (Likelihood: Medium, Impact: High)</strong>
                          <p className="text-foreground/80 mt-1">Potential for unauthorized access to customer data through security vulnerabilities, insider threats, or compromised credentials. Could result in identity theft, financial fraud, or privacy violations.</p>
                          <p className="text-foreground/70 mt-1"><strong>Mitigation:</strong> Multi-factor authentication, role-based access control, regular access reviews, intrusion detection systems.</p>
                        </div>
                        <div className="p-2 bg-orange-50 dark:bg-orange-900/20 rounded">
                          <strong className="text-foreground">Risk 2: Data Breach (Likelihood: Low, Impact: High)</strong>
                          <p className="text-foreground/80 mt-1">Risk of data breach through cyberattacks, system failures, or human error. Could expose sensitive customer information to unauthorized parties.</p>
                          <p className="text-foreground/70 mt-1"><strong>Mitigation:</strong> Encryption at rest and in transit, regular security audits, incident response plan, 72-hour breach notification procedures.</p>
                        </div>
                        <div className="p-2 bg-yellow-50 dark:bg-yellow-900/20 rounded">
                          <strong className="text-foreground">Risk 3: Inadequate Data Retention (Likelihood: Medium, Impact: Medium)</strong>
                          <p className="text-foreground/80 mt-1">Data may be retained longer than necessary, violating data minimization principles and increasing exposure risk.</p>
                          <p className="text-foreground/70 mt-1"><strong>Mitigation:</strong> Automated data retention policies, scheduled deletion procedures, regular data audits.</p>
                        </div>
                        <div className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded">
                          <strong className="text-foreground">Risk 4: Insufficient Transparency (Likelihood: Low, Impact: Medium)</strong>
                          <p className="text-foreground/80 mt-1">Data subjects may not be adequately informed about processing activities, limiting their ability to exercise rights.</p>
                          <p className="text-foreground/70 mt-1"><strong>Mitigation:</strong> Clear privacy notices, accessible privacy policy, easy-to-use data subject rights request process.</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-bold text-foreground mb-2">7. Mitigation Measures</h4>
                  <div className="space-y-2 text-foreground/80 text-xs">
                    <div className="p-3 bg-green-50 dark:bg-green-900/30 rounded border border-green-200 dark:border-green-800">
                      <strong className="text-foreground">Security Measures:</strong>
                      <ul className="list-disc list-inside mt-2 space-y-1">
                        <li>Encryption at rest (AES-256) and in transit (TLS 1.3)</li>
                        <li>Multi-factor authentication (MFA) for all system access</li>
                        <li>Role-based access control (RBAC) with principle of least privilege</li>
                        <li>Regular security audits and penetration testing (quarterly)</li>
                        <li>Intrusion detection and monitoring systems (24/7)</li>
                        <li>Automated backup and disaster recovery procedures</li>
                        <li>Network segmentation and firewall protection</li>
                        <li>Regular software updates and patch management</li>
                      </ul>
                    </div>
                    <div className="p-3 bg-blue-50 dark:bg-blue-900/30 rounded">
                      <strong className="text-foreground">Organizational Measures:</strong>
                      <ul className="list-disc list-inside mt-2 space-y-1">
                        <li>Privacy training for all staff (annually, with updates as needed)</li>
                        <li>Data Protection Officer (DPO) oversight and consultation</li>
                        <li>Incident response plan with 72-hour notification procedures</li>
                        <li>Regular data protection impact assessments (annually or when changes occur)</li>
                        <li>Data processing agreements with all processors</li>
                        <li>Privacy by design and default principles in system development</li>
                        <li>Regular compliance audits and reviews</li>
                      </ul>
                    </div>
                    <div className="p-3 bg-purple-50 dark:bg-purple-900/30 rounded">
                      <strong className="text-foreground">Technical Measures:</strong>
                      <ul className="list-disc list-inside mt-2 space-y-1">
                        <li>Automated data retention policies with scheduled deletion</li>
                        <li>Data minimization - only collect necessary data</li>
                        <li>Pseudonymization where possible</li>
                        <li>Regular data quality checks and validation</li>
                        <li>Automated logging and audit trails</li>
                        <li>Data subject rights request automation</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-bold text-foreground mb-2">8. Consultation and Approval</h4>
                  <div className="space-y-2 text-foreground/80 text-xs">
                    <p><strong>DPO Review:</strong> [Date] - Approved with recommendations implemented</p>
                    <p><strong>IT Security Review:</strong> [Date] - Approved, security measures validated</p>
                    <p><strong>Legal Review:</strong> [Date] - Approved, legal basis confirmed</p>
                    <p><strong>Management Approval:</strong> [Date] - Approved, resources allocated</p>
                    <p className="text-foreground/70 mt-2 italic">
                      This DPIA has been reviewed and approved by the Data Protection Officer and relevant stakeholders. The processing activity may proceed subject to implementation of all identified mitigation measures. This assessment will be reviewed annually or when significant changes to the processing occur.
                    </p>
                  </div>
                </div>

                <div className="mt-4 p-3 bg-primary/10 rounded">
                  <p className="text-xs text-foreground/70">
                    ✓ GDPR Article 35 Compliant | ✓ Comprehensive risk assessment | ✓ Detailed mitigation measures | ✓ Regular review schedule | ✓ Stakeholder consultation
                  </p>
                </div>
              </div>
            </div>
          )
        },
        {
          id: 'privacy-policy-sample',
          type: 'template',
          title: 'Privacy Policy Sample',
          format: 'Word',
          productId: oneTimeProduct.id,
          productName: oneTimeProduct.name,
          content: (
            <div className="p-6 bg-white dark:bg-gray-800 rounded border border-border">
              <h3 className="text-xl font-bold mb-4 text-foreground">Privacy Policy Template</h3>
              <div className="space-y-3 text-sm">
                <div>
                  <p className="font-semibold text-foreground mb-1">1. Introduction</p>
                  <p className="text-foreground/80">This privacy policy explains how we collect, use, and protect your personal information in compliance with GDPR, CCPA, and other applicable regulations.</p>
                </div>
                <div>
                  <p className="font-semibold text-foreground mb-1">2. Data We Collect</p>
                  <p className="text-foreground/80">We collect information you provide directly, automatically through your use of our services, and from third-party sources as permitted by law.</p>
                </div>
                <div>
                  <p className="font-semibold text-foreground mb-1">3. How We Use Your Data</p>
                  <p className="text-foreground/80">We use your information to provide services, improve our offerings, comply with legal obligations, and protect our rights and interests.</p>
                </div>
                <div className="mt-4 p-3 bg-primary/10 rounded">
                  <p className="text-xs text-foreground/70">
                    ✓ GDPR Article 13 Compliant | ✓ CCPA Compliant | ✓ Multi-jurisdiction ready
                  </p>
                </div>
              </div>
            </div>
          )
        },
        {
          id: 'data-mapping-interface',
          type: 'template',
          title: 'Data Mapping Tool Interface',
          format: 'Interactive',
          productId: oneTimeProduct.id,
          productName: oneTimeProduct.name,
          content: (
            <div className="p-6 bg-white dark:bg-gray-800 rounded border border-border max-h-[80vh] overflow-y-auto">
              <h3 className="text-xl font-bold mb-4 text-foreground">Data Flow Mapping Tool</h3>
              <div className="space-y-4 text-sm">
                <div className="p-3 bg-blue-50 dark:bg-blue-900/30 rounded border border-blue-200 dark:border-blue-800">
                  <h4 className="font-bold text-foreground mb-2">Data Flow Overview</h4>
                  <p className="text-xs text-foreground/80">
                    This interactive tool allows you to map data flows from collection through processing, storage, and deletion. Track data across systems, identify compliance requirements, and document data subject rights applicability.
                  </p>
                </div>

                <div>
                  <h4 className="font-bold text-foreground mb-2 text-xs">Sample Data Flow: Customer Registration</h4>
                  <div className="space-y-3">
                    <div className="grid grid-cols-4 gap-2">
                      <div className="p-3 bg-blue-50 dark:bg-blue-900/30 rounded text-center border border-blue-200 dark:border-blue-800">
                        <div className="font-semibold text-foreground text-xs">1. Collection</div>
                        <div className="text-xs text-foreground/70 mt-1">Web Form</div>
                        <div className="text-xs text-foreground/60 mt-1">Name, Email, Phone</div>
                      </div>
                      <div className="p-3 bg-green-50 dark:bg-green-900/30 rounded text-center border border-green-200 dark:border-green-800">
                        <div className="font-semibold text-foreground text-xs">2. Validation</div>
                        <div className="text-xs text-foreground/70 mt-1">API Gateway</div>
                        <div className="text-xs text-foreground/60 mt-1">Format Check</div>
                      </div>
                      <div className="p-3 bg-purple-50 dark:bg-purple-900/30 rounded text-center border border-purple-200 dark:border-purple-800">
                        <div className="font-semibold text-foreground text-xs">3. Processing</div>
                        <div className="text-xs text-foreground/70 mt-1">CRM System</div>
                        <div className="text-xs text-foreground/60 mt-1">Account Creation</div>
                      </div>
                      <div className="p-3 bg-orange-50 dark:bg-orange-900/30 rounded text-center border border-orange-200 dark:border-orange-800">
                        <div className="font-semibold text-foreground text-xs">4. Storage</div>
                        <div className="text-xs text-foreground/70 mt-1">Cloud DB</div>
                        <div className="text-xs text-foreground/60 mt-1">Encrypted</div>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-bold text-foreground mb-2 text-xs">Data Flow Details</h4>
                  <div className="border border-border rounded-lg overflow-hidden">
                    <table className="w-full text-xs">
                      <thead className="bg-muted">
                        <tr>
                          <th className="p-2 text-left text-foreground">Stage</th>
                          <th className="p-2 text-left text-foreground">System</th>
                          <th className="p-2 text-left text-foreground">Data Elements</th>
                          <th className="p-2 text-left text-foreground">Retention</th>
                          <th className="p-2 text-left text-foreground">Legal Basis</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr className="border-t border-border">
                          <td className="p-2 text-foreground/80">Collection</td>
                          <td className="p-2 text-foreground/80">Web Form</td>
                          <td className="p-2 text-foreground/80">Name, Email, Phone</td>
                          <td className="p-2 text-foreground/80">7 years</td>
                          <td className="p-2 text-foreground/80">Contract</td>
                        </tr>
                        <tr className="border-t border-border">
                          <td className="p-2 text-foreground/80">Processing</td>
                          <td className="p-2 text-foreground/80">CRM System</td>
                          <td className="p-2 text-foreground/80">All customer data</td>
                          <td className="p-2 text-foreground/80">Account lifetime</td>
                          <td className="p-2 text-foreground/80">Contract</td>
                        </tr>
                        <tr className="border-t border-border">
                          <td className="p-2 text-foreground/80">Storage</td>
                          <td className="p-2 text-foreground/80">Cloud Database</td>
                          <td className="p-2 text-foreground/80">Encrypted records</td>
                          <td className="p-2 text-foreground/80">7 years</td>
                          <td className="p-2 text-foreground/80">Legal obligation</td>
                        </tr>
                        <tr className="border-t border-border">
                          <td className="p-2 text-foreground/80">Analytics</td>
                          <td className="p-2 text-foreground/80">Analytics Platform</td>
                          <td className="p-2 text-foreground/80">Aggregated data</td>
                          <td className="p-2 text-foreground/80">26 months</td>
                          <td className="p-2 text-foreground/80">Legitimate interest</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

                <div>
                  <h4 className="font-bold text-foreground mb-2 text-xs">Third-Party Data Sharing</h4>
                  <div className="space-y-2">
                    <div className="p-2 bg-muted/50 rounded text-xs">
                      <strong className="text-foreground">Payment Processor:</strong>
                      <span className="text-foreground/80 ml-2">Stripe - Payment data only, encrypted, DPA in place</span>
                    </div>
                    <div className="p-2 bg-muted/50 rounded text-xs">
                      <strong className="text-foreground">Email Service:</strong>
                      <span className="text-foreground/80 ml-2">SendGrid - Email addresses, DPA in place</span>
                    </div>
                    <div className="p-2 bg-muted/50 rounded text-xs">
                      <strong className="text-foreground">Analytics:</strong>
                      <span className="text-foreground/80 ml-2">Google Analytics - Aggregated usage data, anonymized</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-bold text-foreground mb-2 text-xs">Compliance Mapping</h4>
                  <div className="grid grid-cols-3 gap-2 text-xs">
                    <div className="p-2 bg-green-50 dark:bg-green-900/30 rounded">
                      <strong className="text-foreground">GDPR:</strong>
                      <p className="text-foreground/70 mt-1">Article 30 Record, Article 35 DPIA required</p>
                    </div>
                    <div className="p-2 bg-blue-50 dark:bg-blue-900/30 rounded">
                      <strong className="text-foreground">CCPA:</strong>
                      <p className="text-foreground/70 mt-1">Data inventory, disclosure requirements</p>
                    </div>
                    <div className="p-2 bg-purple-50 dark:bg-purple-900/30 rounded">
                      <strong className="text-foreground">NIST:</strong>
                      <p className="text-foreground/70 mt-1">Data flow documentation, risk assessment</p>
                    </div>
                  </div>
                </div>

                <div className="mt-4 p-3 bg-muted/50 rounded">
                  <p className="text-xs text-foreground/70">
                    <strong>Features:</strong> Visual data flow mapping with unlimited flows, export to Excel/PDF, compliance tracking, automated DPIA generation, data subject rights mapping, retention policy enforcement, third-party vendor tracking, and real-time collaboration.
                  </p>
                </div>
              </div>
            </div>
          )
        }
      );
    }

    // GDPR Complete Kit
    if (oneTimeProduct.id === 'gdpr-complete-kit') {
      previews.push(
        {
          id: 'gdpr-privacy-notice',
          type: 'template',
          title: 'GDPR Privacy Notice',
          format: 'PDF',
          productId: oneTimeProduct.id,
          productName: oneTimeProduct.name,
          content: (
            <div className="p-6 bg-white dark:bg-gray-800 rounded border border-border max-h-[80vh] overflow-y-auto">
              <h3 className="text-xl font-bold mb-4 text-foreground">GDPR-Compliant Privacy Notice</h3>
              <div className="space-y-4 text-sm">
                <div className="p-3 bg-green-50 dark:bg-green-900/30 rounded border border-green-200 dark:border-green-800">
                  <div className="flex items-center gap-2 mb-2">
                    <CheckCircle className="w-4 h-4 text-green-600 dark:text-green-400" />
                    <strong className="text-foreground">GDPR Article 13 Compliant</strong>
                  </div>
                  <p className="text-xs text-foreground/70">This notice fulfills all requirements under GDPR Article 13 for transparent information provision to data subjects.</p>
                </div>

                <div>
                  <h4 className="font-bold text-foreground mb-2 text-xs">1. Identity and Contact Details of the Controller</h4>
                  <div className="space-y-1 text-foreground/80 text-xs">
                    <p><strong>Data Controller:</strong> [Your Organization Name]</p>
                    <p><strong>Registered Address:</strong> [Your Address]</p>
                    <p><strong>Contact Email:</strong> privacy@yourcompany.com</p>
                    <p><strong>Phone:</strong> [Your Phone Number]</p>
                    <p><strong>Data Protection Officer:</strong> dpo@yourcompany.com</p>
                    <p><strong>Supervisory Authority:</strong> [Your local data protection authority]</p>
                  </div>
                </div>

                <div>
                  <h4 className="font-bold text-foreground mb-2 text-xs">2. Purposes and Legal Basis for Processing</h4>
                  <div className="space-y-2 text-xs">
                    <div className="p-2 bg-muted/50 rounded">
                      <strong className="text-foreground">Purpose: Service Delivery</strong>
                      <p className="text-foreground/80 mt-1">Legal Basis: Contract performance (Article 6(1)(b))</p>
                      <p className="text-foreground/70 mt-1">Processing customer orders, managing accounts, providing support services</p>
                    </div>
                    <div className="p-2 bg-muted/50 rounded">
                      <strong className="text-foreground">Purpose: Marketing Communications</strong>
                      <p className="text-foreground/80 mt-1">Legal Basis: Consent (Article 6(1)(a))</p>
                      <p className="text-foreground/70 mt-1">Sending promotional emails, newsletters, special offers (with opt-out option)</p>
                    </div>
                    <div className="p-2 bg-muted/50 rounded">
                      <strong className="text-foreground">Purpose: Legal Compliance</strong>
                      <p className="text-foreground/80 mt-1">Legal Basis: Legal obligation (Article 6(1)(c))</p>
                      <p className="text-foreground/70 mt-1">Tax reporting, fraud prevention, regulatory compliance</p>
                    </div>
                    <div className="p-2 bg-muted/50 rounded">
                      <strong className="text-foreground">Purpose: Service Improvement</strong>
                      <p className="text-foreground/80 mt-1">Legal Basis: Legitimate interest (Article 6(1)(f))</p>
                      <p className="text-foreground/70 mt-1">Analytics, usage tracking, product development (balancing test conducted)</p>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-bold text-foreground mb-2 text-xs">3. Categories of Personal Data</h4>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="p-2 bg-blue-50 dark:bg-blue-900/30 rounded">
                      <strong className="text-foreground">Identity Data:</strong>
                      <p className="text-foreground/70 mt-1">Name, email, phone, address, date of birth</p>
                    </div>
                    <div className="p-2 bg-green-50 dark:bg-green-900/30 rounded">
                      <strong className="text-foreground">Financial Data:</strong>
                      <p className="text-foreground/70 mt-1">Payment information, billing details, transaction history</p>
                    </div>
                    <div className="p-2 bg-purple-50 dark:bg-purple-900/30 rounded">
                      <strong className="text-foreground">Technical Data:</strong>
                      <p className="text-foreground/70 mt-1">IP address, browser type, device information, cookies</p>
                    </div>
                    <div className="p-2 bg-orange-50 dark:bg-orange-900/30 rounded">
                      <strong className="text-foreground">Usage Data:</strong>
                      <p className="text-foreground/70 mt-1">Pages visited, time spent, interaction patterns</p>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-bold text-foreground mb-2 text-xs">4. Recipients of Personal Data</h4>
                  <div className="space-y-1 text-foreground/80 text-xs">
                    <p><strong>Internal:</strong> Authorized employees on a need-to-know basis (sales, support, IT)</p>
                    <p><strong>Service Providers:</strong> Cloud hosting (AWS), payment processing (Stripe), email services (SendGrid), analytics (Google Analytics)</p>
                    <p><strong>Legal/Regulatory:</strong> When required by law, court order, or regulatory authority</p>
                    <p><strong>Business Transfers:</strong> In connection with mergers, acquisitions, or asset sales</p>
                    <p className="text-foreground/70 mt-1">All processors are bound by Data Processing Agreements (DPAs) compliant with GDPR Article 28.</p>
                  </div>
                </div>

                <div>
                  <h4 className="font-bold text-foreground mb-2 text-xs">5. International Transfers</h4>
                  <p className="text-foreground/80 text-xs mb-2">
                    Your data may be transferred to countries outside the European Economic Area (EEA). We ensure appropriate safeguards are in place:
                  </p>
                  <ul className="list-disc list-inside ml-4 space-y-1 text-foreground/80 text-xs">
                    <li>Standard Contractual Clauses (SCCs) approved by the European Commission</li>
                    <li>Adequacy decisions where applicable</li>
                    <li>Binding Corporate Rules (BCRs) for intra-group transfers</li>
                    <li>Certification schemes and codes of conduct where recognized</li>
                  </ul>
                  <p className="text-foreground/70 text-xs mt-2">You can request details about specific safeguards by contacting our DPO.</p>
                </div>

                <div>
                  <h4 className="font-bold text-foreground mb-2 text-xs">6. Data Retention Periods</h4>
                  <div className="space-y-1 text-foreground/80 text-xs">
                    <p><strong>Account Data:</strong> Duration of account plus 7 years for legal compliance</p>
                    <p><strong>Transaction Records:</strong> 7 years for tax and accounting purposes</p>
                    <p><strong>Marketing Data:</strong> Until consent withdrawn or 3 years of inactivity</p>
                    <p><strong>Support Communications:</strong> 3 years from last interaction</p>
                    <p><strong>Analytics Data:</strong> Aggregated and anonymized after 26 months</p>
                    <p className="text-foreground/70 mt-1">After retention periods expire, data is securely deleted or anonymized in accordance with GDPR Article 5(1)(e).</p>
                  </div>
                </div>

                <div>
                  <h4 className="font-bold text-foreground mb-2 text-xs">7. Data Subject Rights (Articles 15-22)</h4>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="p-2 bg-muted/50 rounded">
                      <strong className="text-foreground">Right of Access (Article 15):</strong>
                      <p className="text-foreground/70 mt-1">Obtain confirmation and copy of your data</p>
                    </div>
                    <div className="p-2 bg-muted/50 rounded">
                      <strong className="text-foreground">Right to Rectification (Article 16):</strong>
                      <p className="text-foreground/70 mt-1">Correct inaccurate or incomplete data</p>
                    </div>
                    <div className="p-2 bg-muted/50 rounded">
                      <strong className="text-foreground">Right to Erasure (Article 17):</strong>
                      <p className="text-foreground/70 mt-1">Request deletion ("right to be forgotten")</p>
                    </div>
                    <div className="p-2 bg-muted/50 rounded">
                      <strong className="text-foreground">Right to Restrict Processing (Article 18):</strong>
                      <p className="text-foreground/70 mt-1">Limit processing in certain circumstances</p>
                    </div>
                    <div className="p-2 bg-muted/50 rounded">
                      <strong className="text-foreground">Right to Data Portability (Article 20):</strong>
                      <p className="text-foreground/70 mt-1">Receive data in structured, machine-readable format</p>
                    </div>
                    <div className="p-2 bg-muted/50 rounded">
                      <strong className="text-foreground">Right to Object (Article 21):</strong>
                      <p className="text-foreground/70 mt-1">Object to processing based on legitimate interests</p>
                    </div>
                  </div>
                  <p className="mt-2 text-xs text-foreground/70">
                    To exercise these rights, contact us at privacy@yourcompany.com. We will respond within one month (extendable by two months for complex requests).
                  </p>
                </div>

                <div>
                  <h4 className="font-bold text-foreground mb-2 text-xs">8. Right to Withdraw Consent</h4>
                  <p className="text-foreground/80 text-xs">
                    Where processing is based on consent (Article 6(1)(a) or Article 9(2)(a)), you have the right to withdraw consent at any time. Withdrawal does not affect the lawfulness of processing before withdrawal. Contact us to withdraw consent.
                  </p>
                </div>

                <div>
                  <h4 className="font-bold text-foreground mb-2 text-xs">9. Right to Lodge a Complaint</h4>
                  <p className="text-foreground/80 text-xs">
                    You have the right to lodge a complaint with your local supervisory authority if you believe our processing violates GDPR. Contact details: [Supervisory Authority Name], [Address], [Website], [Email].
                  </p>
                </div>

                <div>
                  <h4 className="font-bold text-foreground mb-2 text-xs">10. Automated Decision-Making</h4>
                  <p className="text-foreground/80 text-xs">
                    We do not use automated decision-making, including profiling, that produces legal effects or significantly affects you. If this changes, we will inform you and provide details about the logic, significance, and consequences.
                  </p>
                </div>

                <div>
                  <h4 className="font-bold text-foreground mb-2 text-xs">11. Statutory or Contractual Requirement</h4>
                  <p className="text-foreground/80 text-xs">
                    Providing personal data is necessary for contract performance. Failure to provide data may result in inability to provide services. We will inform you if provision is mandatory or optional.
                  </p>
                </div>

                <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/30 rounded">
                  <p className="text-xs text-foreground/70">
                    ✓ GDPR Article 13 Compliant | ✓ All required disclosures included | ✓ Multi-language support (EN, DE, FR, ES) | ✓ Customizable sections | ✓ Regular updates
                  </p>
                </div>
              </div>
            </div>
          )
        },
        {
          id: 'breach-notification-template',
          type: 'template',
          title: 'Data Breach Notification Template',
          format: 'Word',
          productId: oneTimeProduct.id,
          productName: oneTimeProduct.name,
          content: (
            <div className="p-6 bg-white dark:bg-gray-800 rounded border border-border max-h-[80vh] overflow-y-auto">
              <h3 className="text-xl font-bold mb-4 text-foreground">Data Breach Notification Template</h3>
              <div className="space-y-4 text-sm">
                <div className="p-4 bg-red-50 dark:bg-red-900/30 rounded border border-red-200 dark:border-red-800">
                  <h4 className="font-bold text-foreground mb-2">1. Incident Overview</h4>
                  <div className="space-y-2 text-foreground/80 text-xs">
                    <p><strong>Incident ID:</strong> INC-{new Date().getFullYear()}-{String(new Date().getMonth() + 1).padStart(2, '0')}-{String(new Date().getDate()).padStart(2, '0')}-001</p>
                    <p><strong>Date Detected:</strong> {new Date().toLocaleString()}</p>
                    <p><strong>Date Occurred:</strong> [Estimated date/time of breach]</p>
                    <p><strong>Date Reported:</strong> {new Date().toLocaleDateString()}</p>
                    <p><strong>Incident Type:</strong> Unauthorized access / Data breach / System compromise</p>
                    <p><strong>Severity Level:</strong> High / Medium / Low</p>
                    <p><strong>Affected Data Categories:</strong> Contact information, email addresses, names, [other categories]</p>
                    <p><strong>Number of Data Subjects Affected:</strong> [Number] individuals</p>
                    <p><strong>Geographic Scope:</strong> [Countries/regions affected]</p>
                  </div>
                </div>

                <div>
                  <h4 className="font-bold text-foreground mb-2 text-xs">2. Nature of the Breach</h4>
                  <div className="space-y-2 text-foreground/80 text-xs">
                    <p><strong>Description:</strong> [Detailed description of what happened, how the breach occurred, and what systems/data were affected]</p>
                    <p><strong>Cause:</strong> [Suspected or confirmed cause - e.g., cyberattack, human error, system failure, insider threat]</p>
                    <p><strong>Attack Vector:</strong> [If applicable - e.g., phishing, malware, SQL injection, unauthorized access]</p>
                    <p><strong>Data Compromised:</strong> [Specific data types and sensitivity levels]</p>
                    <p><strong>Potential Impact:</strong> [Assessment of potential harm to data subjects]</p>
                  </div>
                </div>

                <div>
                  <h4 className="font-bold text-foreground mb-2 text-xs">3. Immediate Response Actions</h4>
                  <div className="p-3 bg-yellow-50 dark:bg-yellow-900/30 rounded">
                    <div className="space-y-1 text-foreground/80 text-xs">
                      <p>✓ Containment measures implemented - [Details]</p>
                      <p>✓ System isolation completed - [Affected systems isolated]</p>
                      <p>✓ Investigation initiated - [Investigation team and timeline]</p>
                      <p>✓ Forensic analysis commenced - [Tools and methods]</p>
                      <p>✓ Access credentials revoked/changed - [Number of accounts]</p>
                      <p>✓ Security patches applied - [If applicable]</p>
                      <p>✓ Law enforcement notified - [If applicable, date and agency]</p>
                      <p>✓ Third-party security experts engaged - [If applicable]</p>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-bold text-foreground mb-2 text-xs">4. Assessment of Risk to Data Subjects</h4>
                  <div className="space-y-2 text-xs">
                    <div className="p-2 bg-orange-50 dark:bg-orange-900/20 rounded">
                      <strong className="text-foreground">Risk Level: HIGH / MEDIUM / LOW</strong>
                      <p className="text-foreground/80 mt-1">[Explanation of risk assessment]</p>
                    </div>
                    <div>
                      <strong className="text-foreground">Potential Consequences:</strong>
                      <ul className="list-disc list-inside ml-4 mt-1 space-y-1 text-foreground/80">
                        <li>Identity theft</li>
                        <li>Financial fraud</li>
                        <li>Phishing attacks</li>
                        <li>Unauthorized access to accounts</li>
                        <li>Reputation damage</li>
                        <li>[Other specific risks]</li>
                      </ul>
                    </div>
                    <div>
                      <strong className="text-foreground">Mitigation Measures for Data Subjects:</strong>
                      <ul className="list-disc list-inside ml-4 mt-1 space-y-1 text-foreground/80">
                        <li>Change passwords immediately</li>
                        <li>Monitor accounts for suspicious activity</li>
                        <li>Enable two-factor authentication</li>
                        <li>Review credit reports</li>
                        <li>Be cautious of phishing attempts</li>
                        <li>[Other recommendations]</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-bold text-foreground mb-2 text-xs">5. Notification Details</h4>
                  <div className="space-y-2 text-foreground/80 text-xs">
                    <p><strong>Supervisory Authority Notification:</strong></p>
                    <ul className="list-disc list-inside ml-4 space-y-1">
                      <li>Authority: [Name of supervisory authority]</li>
                      <li>Date Notified: [Date within 72 hours of detection]</li>
                      <li>Notification Method: [Online portal / Email / Other]</li>
                      <li>Reference Number: [If provided by authority]</li>
                    </ul>
                    <p className="mt-2"><strong>Data Subject Notification:</strong></p>
                    <ul className="list-disc list-inside ml-4 space-y-1">
                      <li>Notification Method: Email / Postal mail / Website notice</li>
                      <li>Date Notified: [Date]</li>
                      <li>Number Notified: [Number] individuals</li>
                      <li>Language: [Languages used for notification]</li>
                    </ul>
                    <p className="mt-2"><strong>Processor Notification (if applicable):</strong></p>
                    <ul className="list-disc list-inside ml-4 space-y-1">
                      <li>Processors Notified: [List of processors]</li>
                      <li>Date Notified: [Date]</li>
                      <li>Coordination: [Details of coordination efforts]</li>
                    </ul>
                  </div>
                </div>

                <div>
                  <h4 className="font-bold text-foreground mb-2 text-xs">6. Remediation Measures</h4>
                  <div className="space-y-2 text-foreground/80 text-xs">
                    <p><strong>Short-term Measures (Completed):</strong></p>
                    <ul className="list-disc list-inside ml-4 space-y-1">
                      <li>[Specific measures taken]</li>
                      <li>[Timeline and status]</li>
                    </ul>
                    <p className="mt-2"><strong>Long-term Measures (Planned):</strong></p>
                    <ul className="list-disc list-inside ml-4 space-y-1">
                      <li>[Security enhancements]</li>
                      <li>[Process improvements]</li>
                      <li>[Training and awareness]</li>
                      <li>[Timeline for implementation]</li>
                    </ul>
                  </div>
                </div>

                <div>
                  <h4 className="font-bold text-foreground mb-2 text-xs">7. Compliance Checklist</h4>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="p-2 bg-green-50 dark:bg-green-900/30 rounded">
                      <strong className="text-foreground">GDPR Article 33:</strong>
                      <p className="text-foreground/70 mt-1">Supervisory authority notified within 72 hours</p>
                    </div>
                    <div className="p-2 bg-green-50 dark:bg-green-900/30 rounded">
                      <strong className="text-foreground">GDPR Article 34:</strong>
                      <p className="text-foreground/70 mt-1">Data subjects notified without undue delay (if high risk)</p>
                    </div>
                    <div className="p-2 bg-blue-50 dark:bg-blue-900/30 rounded">
                      <strong className="text-foreground">CCPA:</strong>
                      <p className="text-foreground/70 mt-1">Notification requirements met (if applicable)</p>
                    </div>
                    <div className="p-2 bg-blue-50 dark:bg-blue-900/30 rounded">
                      <strong className="text-foreground">Other Jurisdictions:</strong>
                      <p className="text-foreground/70 mt-1">[State/provincial requirements if applicable]</p>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-bold text-foreground mb-2 text-xs">8. Contact Information</h4>
                  <div className="space-y-1 text-foreground/80 text-xs">
                    <p><strong>Data Protection Officer:</strong> dpo@yourcompany.com</p>
                    <p><strong>Incident Response Team:</strong> security@yourcompany.com</p>
                    <p><strong>Phone:</strong> [Phone number]</p>
                    <p><strong>Support for Affected Individuals:</strong> breach-support@yourcompany.com</p>
                  </div>
                </div>

                <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/30 rounded">
                  <p className="text-xs text-foreground/70">
                    ✓ 72-hour GDPR notification checklist | ✓ CCPA requirements | ✓ Multi-jurisdiction compliance | ✓ Comprehensive incident documentation | ✓ Remediation tracking
                  </p>
                </div>
              </div>
            </div>
          )
        },
        {
          id: 'dsr-manager',
          type: 'template',
          title: 'Data Subject Rights Request Manager',
          format: 'Interactive',
          productId: oneTimeProduct.id,
          productName: oneTimeProduct.name,
          content: (
            <div className="p-6 bg-white dark:bg-gray-800 rounded border border-border max-h-[80vh] overflow-y-auto">
              <h3 className="text-xl font-bold mb-4 text-foreground">Data Subject Rights Request Manager</h3>
              <div className="space-y-4 text-sm">
                <div className="p-3 bg-blue-50 dark:bg-blue-900/30 rounded border border-blue-200 dark:border-blue-800">
                  <h4 className="font-bold text-foreground mb-2 text-xs">Request Dashboard Overview</h4>
                  <div className="grid grid-cols-4 gap-2 text-xs">
                    <div className="text-center">
                      <div className="text-lg font-bold text-foreground">12</div>
                      <div className="text-foreground/70">Total Requests</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-bold text-yellow-600 dark:text-yellow-400">5</div>
                      <div className="text-foreground/70">In Progress</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-bold text-green-600 dark:text-green-400">6</div>
                      <div className="text-foreground/70">Completed</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-bold text-red-600 dark:text-red-400">1</div>
                      <div className="text-foreground/70">Overdue</div>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-bold text-foreground mb-2 text-xs">Active Requests</h4>
                  <div className="border border-border rounded-lg overflow-hidden">
                    <table className="w-full text-xs">
                      <thead className="bg-muted">
                        <tr>
                          <th className="p-2 text-left text-foreground">Request ID</th>
                          <th className="p-2 text-left text-foreground">Requester</th>
                          <th className="p-2 text-left text-foreground">Type</th>
                          <th className="p-2 text-left text-foreground">Submitted</th>
                          <th className="p-2 text-left text-foreground">Status</th>
                          <th className="p-2 text-left text-foreground">Days Remaining</th>
                          <th className="p-2 text-left text-foreground">Assigned To</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr className="border-t border-border">
                          <td className="p-2 text-foreground/80">DSR-2025-001</td>
                          <td className="p-2 text-foreground/80">john.doe@example.com</td>
                          <td className="p-2 text-foreground/80">Access Request (Article 15)</td>
                          <td className="p-2 text-foreground/80">{new Date(Date.now() - 8*24*60*60*1000).toLocaleDateString()}</td>
                          <td className="p-2">
                            <span className="px-2 py-1 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-200 rounded text-xs">
                              In Progress
                            </span>
                          </td>
                          <td className="p-2 text-foreground/80 font-semibold">22 days</td>
                          <td className="p-2 text-foreground/80">Privacy Team</td>
                        </tr>
                        <tr className="border-t border-border">
                          <td className="p-2 text-foreground/80">DSR-2025-002</td>
                          <td className="p-2 text-foreground/80">jane.smith@example.com</td>
                          <td className="p-2 text-foreground/80">Erasure Request (Article 17)</td>
                          <td className="p-2 text-foreground/80">{new Date(Date.now() - 15*24*60*60*1000).toLocaleDateString()}</td>
                          <td className="p-2">
                            <span className="px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200 rounded text-xs">
                              Completed
                            </span>
                          </td>
                          <td className="p-2 text-foreground/80">-</td>
                          <td className="p-2 text-foreground/80">Data Team</td>
                        </tr>
                        <tr className="border-t border-border">
                          <td className="p-2 text-foreground/80">DSR-2025-003</td>
                          <td className="p-2 text-foreground/80">bob.wilson@example.com</td>
                          <td className="p-2 text-foreground/80">Portability Request (Article 20)</td>
                          <td className="p-2 text-foreground/80">{new Date(Date.now() - 3*24*60*60*1000).toLocaleDateString()}</td>
                          <td className="p-2">
                            <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200 rounded text-xs">
                              Under Review
                            </span>
                          </td>
                          <td className="p-2 text-foreground/80">27 days</td>
                          <td className="p-2 text-foreground/80">IT Team</td>
                        </tr>
                        <tr className="border-t border-border">
                          <td className="p-2 text-foreground/80">DSR-2025-004</td>
                          <td className="p-2 text-foreground/80">alice.brown@example.com</td>
                          <td className="p-2 text-foreground/80">Rectification Request (Article 16)</td>
                          <td className="p-2 text-foreground/80">{new Date(Date.now() - 35*24*60*60*1000).toLocaleDateString()}</td>
                          <td className="p-2">
                            <span className="px-2 py-1 bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-200 rounded text-xs">
                              Overdue
                            </span>
                          </td>
                          <td className="p-2 text-foreground/80 font-semibold text-red-600 dark:text-red-400">-5 days</td>
                          <td className="p-2 text-foreground/80">Privacy Team</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

                <div>
                  <h4 className="font-bold text-foreground mb-2 text-xs">Request Types Supported</h4>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="p-2 bg-muted/50 rounded">
                      <strong className="text-foreground">Article 15 - Right of Access:</strong>
                      <p className="text-foreground/70 mt-1">Obtain confirmation and copy of personal data</p>
                    </div>
                    <div className="p-2 bg-muted/50 rounded">
                      <strong className="text-foreground">Article 16 - Right to Rectification:</strong>
                      <p className="text-foreground/70 mt-1">Correct inaccurate or incomplete data</p>
                    </div>
                    <div className="p-2 bg-muted/50 rounded">
                      <strong className="text-foreground">Article 17 - Right to Erasure:</strong>
                      <p className="text-foreground/70 mt-1">Request deletion ("right to be forgotten")</p>
                    </div>
                    <div className="p-2 bg-muted/50 rounded">
                      <strong className="text-foreground">Article 18 - Right to Restrict Processing:</strong>
                      <p className="text-foreground/70 mt-1">Limit processing in certain circumstances</p>
                    </div>
                    <div className="p-2 bg-muted/50 rounded">
                      <strong className="text-foreground">Article 20 - Right to Data Portability:</strong>
                      <p className="text-foreground/70 mt-1">Receive data in structured, machine-readable format</p>
                    </div>
                    <div className="p-2 bg-muted/50 rounded">
                      <strong className="text-foreground">Article 21 - Right to Object:</strong>
                      <p className="text-foreground/70 mt-1">Object to processing based on legitimate interests</p>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-bold text-foreground mb-2 text-xs">Request Workflow</h4>
                  <div className="space-y-2 text-xs">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400 font-bold">1</div>
                      <div className="flex-1 p-2 bg-muted/50 rounded">
                        <strong className="text-foreground">Request Received:</strong>
                        <span className="text-foreground/70 ml-2">Automated acknowledgment sent, request logged</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-yellow-100 dark:bg-yellow-900/30 flex items-center justify-center text-yellow-600 dark:text-yellow-400 font-bold">2</div>
                      <div className="flex-1 p-2 bg-muted/50 rounded">
                        <strong className="text-foreground">Identity Verification:</strong>
                        <span className="text-foreground/70 ml-2">Requester identity verified, additional info requested if needed</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center text-purple-600 dark:text-purple-400 font-bold">3</div>
                      <div className="flex-1 p-2 bg-muted/50 rounded">
                        <strong className="text-foreground">Data Collection:</strong>
                        <span className="text-foreground/70 ml-2">Relevant data identified and collected from all systems</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center text-green-600 dark:text-green-400 font-bold">4</div>
                      <div className="flex-1 p-2 bg-muted/50 rounded">
                        <strong className="text-foreground">Response Preparation:</strong>
                        <span className="text-foreground/70 ml-2">Response prepared, reviewed, and formatted according to request type</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center text-green-600 dark:text-green-400 font-bold">5</div>
                      <div className="flex-1 p-2 bg-muted/50 rounded">
                        <strong className="text-foreground">Response Delivered:</strong>
                        <span className="text-foreground/70 ml-2">Response sent to requester, request marked as completed</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-bold text-foreground mb-2 text-xs">Compliance Metrics</h4>
                  <div className="grid grid-cols-3 gap-2 text-xs">
                    <div className="p-2 bg-green-50 dark:bg-green-900/30 rounded text-center">
                      <div className="font-bold text-green-700 dark:text-green-300">98%</div>
                      <div className="text-foreground/70">On-Time Completion</div>
                    </div>
                    <div className="p-2 bg-blue-50 dark:bg-blue-900/30 rounded text-center">
                      <div className="font-bold text-blue-700 dark:text-blue-300">18 days</div>
                      <div className="text-foreground/70">Average Response Time</div>
                    </div>
                    <div className="p-2 bg-purple-50 dark:bg-purple-900/30 rounded text-center">
                      <div className="font-bold text-purple-700 dark:text-purple-300">30 days</div>
                      <div className="text-foreground/70">SLA Target</div>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-bold text-foreground mb-2 text-xs">Features</h4>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="p-2 bg-muted/50 rounded">
                      <strong className="text-foreground">Automated Tracking:</strong>
                      <p className="text-foreground/70 mt-1">30-day compliance window tracking with automated reminders</p>
                    </div>
                    <div className="p-2 bg-muted/50 rounded">
                      <strong className="text-foreground">Multi-Channel Support:</strong>
                      <p className="text-foreground/70 mt-1">Email, web form, phone, postal mail integration</p>
                    </div>
                    <div className="p-2 bg-muted/50 rounded">
                      <strong className="text-foreground">Identity Verification:</strong>
                      <p className="text-foreground/70 mt-1">Automated and manual verification workflows</p>
                    </div>
                    <div className="p-2 bg-muted/50 rounded">
                      <strong className="text-foreground">Data Discovery:</strong>
                      <p className="text-foreground/70 mt-1">Automated data location across all systems</p>
                    </div>
                    <div className="p-2 bg-muted/50 rounded">
                      <strong className="text-foreground">Response Generation:</strong>
                      <p className="text-foreground/70 mt-1">Automated response templates and formatting</p>
                    </div>
                    <div className="p-2 bg-muted/50 rounded">
                      <strong className="text-foreground">Export & Reporting:</strong>
                      <p className="text-foreground/70 mt-1">Export to PDF, Excel, CSV for audit and reporting</p>
                    </div>
                  </div>
                </div>

                <div className="mt-4 p-3 bg-muted/50 rounded">
                  <p className="text-xs text-foreground/70">
                    <strong>Full Features:</strong> Track all GDPR Article 15-22 requests with 30-day compliance window, automated reminders, identity verification, data discovery across systems, response generation, multi-channel support, SLA tracking, export capabilities, audit trail, and integration with data mapping tools.
                  </p>
                </div>
              </div>
            </div>
          )
        }
      );
    }

    // Policy Template Library
    if (oneTimeProduct.id === 'policy-template-library') {
      previews.push(
        {
          id: 'website-privacy-policy',
          type: 'template',
          title: 'Website Privacy Policy',
          format: 'Word',
          productId: oneTimeProduct.id,
          productName: oneTimeProduct.name,
          content: (
            <div className="p-6 bg-white dark:bg-gray-800 rounded border border-border">
              <h3 className="text-xl font-bold mb-4 text-foreground">Website Privacy Policy Template</h3>
              <div className="space-y-3 text-sm">
                <p className="text-foreground/80">
                  Comprehensive privacy policy covering all essential sections for website operators:
                </p>
                <ul className="list-disc list-inside space-y-1 text-foreground/80">
                  <li>Data collection practices and purposes</li>
                  <li>Cookie usage and tracking technologies</li>
                  <li>Third-party sharing and service providers</li>
                  <li>User rights under GDPR, CCPA, and other regulations</li>
                  <li>Data retention and security measures</li>
                  <li>Contact information and DPO details</li>
                </ul>
                <div className="mt-4 p-3 bg-primary/10 rounded">
                  <p className="text-xs text-foreground/70">
                    ✓ 50+ templates available | ✓ Industry-specific versions | ✓ Multi-jurisdiction compliance
                  </p>
                </div>
              </div>
            </div>
          )
        },
        {
          id: 'cookie-policy',
          type: 'template',
          title: 'Cookie Policy Template',
          format: 'PDF',
          productId: oneTimeProduct.id,
          productName: oneTimeProduct.name,
          content: (
            <div className="p-6 bg-white dark:bg-gray-800 rounded border border-border">
              <h3 className="text-xl font-bold mb-4 text-foreground">Cookie Policy Template</h3>
              <div className="space-y-3 text-sm">
                <div className="grid grid-cols-2 gap-2">
                  <div className="p-3 bg-green-50 dark:bg-green-900/30 rounded">
                    <div className="font-semibold text-foreground mb-1">Essential Cookies</div>
                    <p className="text-xs text-foreground/70">Required for site functionality</p>
                  </div>
                  <div className="p-3 bg-blue-50 dark:bg-blue-900/30 rounded">
                    <div className="font-semibold text-foreground mb-1">Analytics Cookies</div>
                    <p className="text-xs text-foreground/70">Google Analytics, usage tracking</p>
                  </div>
                  <div className="p-3 bg-purple-50 dark:bg-purple-900/30 rounded">
                    <div className="font-semibold text-foreground mb-1">Marketing Cookies</div>
                    <p className="text-xs text-foreground/70">Advertising, retargeting</p>
                  </div>
                  <div className="p-3 bg-yellow-50 dark:bg-yellow-900/30 rounded">
                    <div className="font-semibold text-foreground mb-1">Cookie Consent</div>
                    <p className="text-xs text-foreground/70">Opt-in/opt-out mechanisms</p>
                  </div>
                </div>
                <div className="mt-4 p-3 bg-muted/50 rounded">
                  <p className="text-xs text-foreground/70">
                    Includes cookie categories, purposes, retention periods, and consent management guidance
                  </p>
                </div>
              </div>
            </div>
          )
        },
        {
          id: 'terms-of-service',
          type: 'template',
          title: 'Terms of Service Template',
          format: 'Word',
          productId: oneTimeProduct.id,
          productName: oneTimeProduct.name,
          content: (
            <div className="p-6 bg-white dark:bg-gray-800 rounded border border-border">
              <h3 className="text-xl font-bold mb-4 text-foreground">Terms of Service Template</h3>
              <div className="space-y-2 text-sm">
                <div>
                  <p className="font-semibold text-foreground mb-1">Key Sections Included:</p>
                  <ul className="list-disc list-inside space-y-1 text-foreground/80">
                    <li>Acceptance of terms and conditions</li>
                    <li>User obligations and restrictions</li>
                    <li>Intellectual property rights</li>
                    <li>Limitation of liability</li>
                    <li>Dispute resolution and governing law</li>
                    <li>Termination clauses</li>
                  </ul>
                </div>
                <div className="mt-4 p-3 bg-primary/10 rounded">
                  <p className="text-xs text-foreground/70">
                    Professional legal templates ready for customization and review by your legal counsel
                  </p>
                </div>
              </div>
            </div>
          )
        }
      );
    }

    // Compliance Assessment Suite
    if (oneTimeProduct.id === 'compliance-assessment-suite') {
      previews.push(
        {
          id: 'gap-analysis-report',
          type: 'sample',
          title: 'Gap Analysis Report Sample',
          format: 'PDF',
          productId: oneTimeProduct.id,
          productName: oneTimeProduct.name,
          content: (
            <div className="p-6 bg-white dark:bg-gray-800 rounded border border-border">
              <h3 className="text-xl font-bold mb-4 text-foreground">Privacy Gap Analysis Report</h3>
              <div className="space-y-4 text-sm">
                <div className="grid grid-cols-3 gap-3">
                  <div className="p-4 bg-green-50 dark:bg-green-900/30 rounded text-center border border-green-200 dark:border-green-800">
                    <div className="text-2xl font-bold text-green-700 dark:text-green-300">65%</div>
                    <div className="text-xs text-foreground/70 mt-1">Compliant</div>
                  </div>
                  <div className="p-4 bg-yellow-50 dark:bg-yellow-900/30 rounded text-center border border-yellow-200 dark:border-yellow-800">
                    <div className="text-2xl font-bold text-yellow-700 dark:text-yellow-300">25%</div>
                    <div className="text-xs text-foreground/70 mt-1">Partial</div>
                  </div>
                  <div className="p-4 bg-red-50 dark:bg-red-900/30 rounded text-center border border-red-200 dark:border-red-800">
                    <div className="text-2xl font-bold text-red-700 dark:text-red-300">10%</div>
                    <div className="text-xs text-foreground/70 mt-1">Gaps</div>
                  </div>
                </div>
                <div className="mt-4">
                  <strong className="text-foreground">Key Findings:</strong>
                  <ul className="list-disc list-inside mt-2 space-y-1 text-foreground/80">
                    <li>Data retention policies need updating to align with GDPR requirements</li>
                    <li>Consent mechanisms require enhancement for explicit opt-in</li>
                    <li>DPIA process needs formalization and documentation</li>
                    <li>Data subject rights procedures need streamlining</li>
                  </ul>
                </div>
                <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/30 rounded">
                  <p className="text-xs text-foreground/70">
                    Comprehensive assessment covering GDPR, CCPA, NIST Privacy Framework with prioritized remediation roadmap
                  </p>
                </div>
              </div>
            </div>
          )
        },
        {
          id: 'compliance-roadmap',
          type: 'template',
          title: 'Compliance Roadmap Generator',
          format: 'Excel',
          productId: oneTimeProduct.id,
          productName: oneTimeProduct.name,
          content: (
            <div className="p-6 bg-white dark:bg-gray-800 rounded border border-border">
              <h3 className="text-xl font-bold mb-4 text-foreground">Compliance Roadmap</h3>
              <div className="space-y-3 text-sm">
                <div className="border border-border rounded-lg overflow-hidden">
                  <table className="w-full text-xs">
                    <thead className="bg-muted">
                      <tr>
                        <th className="p-2 text-left text-foreground">Priority</th>
                        <th className="p-2 text-left text-foreground">Action Item</th>
                        <th className="p-2 text-left text-foreground">Timeline</th>
                        <th className="p-2 text-left text-foreground">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-t border-border">
                        <td className="p-2">
                          <span className="px-2 py-1 bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-200 rounded text-xs">
                            High
                          </span>
                        </td>
                        <td className="p-2 text-foreground/80">Update data retention policies</td>
                        <td className="p-2 text-foreground/80">30 days</td>
                        <td className="p-2">
                          <span className="px-2 py-1 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-200 rounded text-xs">
                            In Progress
                          </span>
                        </td>
                      </tr>
                      <tr className="border-t border-border">
                        <td className="p-2">
                          <span className="px-2 py-1 bg-orange-100 dark:bg-orange-900/30 text-orange-800 dark:text-orange-200 rounded text-xs">
                            Medium
                          </span>
                        </td>
                        <td className="p-2 text-foreground/80">Enhance consent mechanisms</td>
                        <td className="p-2 text-foreground/80">60 days</td>
                        <td className="p-2">
                          <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200 rounded text-xs">
                            Planned
                          </span>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <div className="mt-4 p-3 bg-muted/50 rounded">
                  <p className="text-xs text-foreground/70">
                    Automated roadmap generation with risk-based prioritization and timeline tracking
                  </p>
                </div>
              </div>
            </div>
          )
        }
      );
    }

    // Compliance Framework Templates
    if (oneTimeProduct.id === 'compliance-toolkit') {
      previews.push(
        {
          id: 'gap-analysis-worksheet',
          type: 'template',
          title: 'Gap Analysis Worksheet',
          format: 'Excel',
          productId: oneTimeProduct.id,
          productName: oneTimeProduct.name,
          content: (
            <div className="p-6 bg-white dark:bg-gray-800 rounded border border-border">
              <h3 className="text-xl font-bold mb-4 text-foreground">NIST Privacy Framework Gap Analysis</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-xs border-collapse">
                  <thead>
                    <tr className="bg-muted">
                      <th className="border border-border p-2 text-left text-foreground">Control ID</th>
                      <th className="border border-border p-2 text-left text-foreground">Control Name</th>
                      <th className="border border-border p-2 text-center text-foreground">Status</th>
                      <th className="border border-border p-2 text-center text-foreground">Priority</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="border border-border p-2 text-foreground/80">ID.AM-1</td>
                      <td className="border border-border p-2 text-foreground/80">Asset Inventory</td>
                      <td className="border border-border p-2 text-center">
                        <span className="px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200 rounded text-xs">
                          ✓ Compliant
                        </span>
                      </td>
                      <td className="border border-border p-2 text-center text-foreground/80">High</td>
                    </tr>
                    <tr>
                      <td className="border border-border p-2 text-foreground/80">PR.AC-3</td>
                      <td className="border border-border p-2 text-foreground/80">Access Control</td>
                      <td className="border border-border p-2 text-center">
                        <span className="px-2 py-1 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-200 rounded text-xs">
                          ⚠ Partial
                        </span>
                      </td>
                      <td className="border border-border p-2 text-center text-foreground/80">High</td>
                    </tr>
                    <tr>
                      <td className="border border-border p-2 text-foreground/80">DE.AE-2</td>
                      <td className="border border-border p-2 text-foreground/80">Anomaly Detection</td>
                      <td className="border border-border p-2 text-center">
                        <span className="px-2 py-1 bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-200 rounded text-xs">
                          ✗ Gap
                        </span>
                      </td>
                      <td className="border border-border p-2 text-center text-foreground/80">Medium</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div className="mt-4 p-3 bg-muted/50 rounded">
                <p className="text-xs text-foreground/70">
                  Comprehensive worksheets for NIST, ISO 27001, SOC 2, HIPAA, GDPR, CMMC, and PCI-DSS with 50+ pre-mapped controls
                </p>
              </div>
            </div>
          )
        },
        {
          id: 'evidence-checklist',
          type: 'template',
          title: 'Evidence Collection Checklist',
          format: 'PDF',
          productId: oneTimeProduct.id,
          productName: oneTimeProduct.name,
          content: (
            <div className="p-6 bg-white dark:bg-gray-800 rounded border border-border">
              <h3 className="text-xl font-bold mb-4 text-foreground">Evidence Collection Checklist</h3>
              <div className="space-y-3 text-sm">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600 dark:text-green-400" />
                    <span className="text-foreground/80">Policy documents and procedures</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600 dark:text-green-400" />
                    <span className="text-foreground/80">Access control logs and reports</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600 dark:text-green-400" />
                    <span className="text-foreground/80">Training records and certifications</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600 dark:text-green-400" />
                    <span className="text-foreground/80">Incident response documentation</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600 dark:text-green-400" />
                    <span className="text-foreground/80">Vendor assessment reports</span>
                  </div>
                </div>
                <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/30 rounded">
                  <p className="text-xs text-foreground/70">
                    Framework-specific checklists with evidence requirements, collection methods, and validation criteria
                  </p>
                </div>
              </div>
            </div>
          )
        }
      );
    }

    return previews;
  }, []);

  // Check if user has internal access
  useEffect(() => {
    // Check environment variable for internal access
    const internalAccess = import.meta.env.VITE_ENABLE_INTERNAL_REVIEW === 'true' || 
                          import.meta.env.MODE === 'development' ||
                          window.location.hostname === 'localhost' ||
                          window.location.hostname === '127.0.0.1';
    
    setIsInternal(internalAccess);
  }, []);

  // Load product and previews when productId changes
  useEffect(() => {
    if (!productId || isInternal === null) return; // Wait for access check
    if (!isInternal) return; // Don't load if not internal

    const foundProduct = ProductCatalog.getProduct(productId);
    if (!foundProduct) {
      navigate('/preview-review');
      return;
    }

    setProduct(foundProduct);
    
    // Generate previews for this product
    const productPreviews = generatePreviewsForProduct(foundProduct);
    setPreviews(productPreviews);

    // Set initial preview index
    if (previewIndex !== undefined) {
      const index = parseInt(previewIndex, 10);
      if (!isNaN(index) && index >= 0 && index < productPreviews.length) {
        setCurrentIndex(index);
      }
    }
  }, [productId, previewIndex, navigate, isInternal, generatePreviewsForProduct]);

  // Show loading state while checking access
  if (isInternal === null) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground">Checking access...</p>
        </div>
      </div>
    );
  }

  // Deny access if not internal
  if (!isInternal) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="max-w-md">
          <CardContent className="p-8 text-center">
            <Lock className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-foreground mb-2">Access Restricted</h2>
            <p className="text-muted-foreground mb-4">
              This page is for internal use only. Preview content is available to customers
              through the product store pages.
            </p>
            <Link to="/store">
              <Button>Go to Store</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!product || previews.length === 0) {
    return (
      <div className="min-h-screen bg-background py-12">
        <div className="container mx-auto px-4 text-center">
          <p className="text-muted-foreground">Loading preview artifacts...</p>
        </div>
      </div>
    );
  }

  const currentPreview = previews[currentIndex];

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      navigate(`/preview-artifact/${productId}/${currentIndex - 1}`, { replace: true });
    }
  };

  const handleNext = () => {
    if (currentIndex < previews.length - 1) {
      setCurrentIndex(currentIndex + 1);
      navigate(`/preview-artifact/${productId}/${currentIndex + 1}`, { replace: true });
    }
  };

  const handleExport = async () => {
    try {
      // Map artifact IDs to generator format
      const artifactIdMap: Record<string, string> = {
        'dpia-sample': 'dpia-sample',
        'privacy-policy-sample': 'privacy-policy-sample',
        'data-mapping-interface': 'data-mapping-interface', // Interactive - no download
        'gdpr-privacy-notice': 'privacy-policy-sample',
        'breach-notification-template': 'breach-notification-template',
        'dsr-request-manager': 'dsr-request-manager', // Interactive - no download
        'website-privacy-policy': 'privacy-policy-sample',
        'cookie-policy-template': 'privacy-policy-sample',
        'terms-of-service-template': 'privacy-policy-sample',
        'gap-analysis-report': 'gap-analysis-report',
        'compliance-roadmap': 'compliance-roadmap',
        'gap-analysis-worksheet': 'nist-gap-worksheet',
        'evidence-collection-checklist': 'evidence-checklist'
      };

      const artifactId = artifactIdMap[currentPreview.id] || currentPreview.id;
      const format = currentPreview.format as 'PDF' | 'Word' | 'Excel';

      // Skip interactive artifacts
      if (format === 'Interactive') {
        toast.info('Interactive Tool', 'This is an interactive tool. Use the main application to access full functionality.');
        return;
      }

      // Generate the artifact
      await generateArtifact(productId, artifactId, format);
      toast.success('Download Started', `${currentPreview.title} is being downloaded.`);
    } catch (error) {
      console.error('Error generating artifact:', error);
      toast.error('Download Failed', 'Failed to generate artifact. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-2">
                {currentPreview.title}
              </h1>
              <p className="text-muted-foreground">
                {product.name} • Preview {currentIndex + 1} of {previews.length}
              </p>
            </div>
            <div className="flex items-center gap-3">
              {currentPreview.format !== 'Interactive' && (
                <Button onClick={handleExport} className="bg-primary hover:bg-primary/90">
                  <Download className="w-4 h-4 mr-2" />
                  Download {currentPreview.format}
                </Button>
              )}
              <Link to="/preview-review">
                <Button variant="outline">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Review
                </Button>
              </Link>
            </div>
          </div>

          {/* Navigation */}
          {previews.length > 1 && (
            <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg border border-border">
              <Button
                variant="outline"
                onClick={handlePrevious}
                disabled={currentIndex === 0}
              >
                <ChevronLeft className="w-4 h-4 mr-2" />
                Previous
              </Button>
              <div className="flex items-center gap-2">
                {previews.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      setCurrentIndex(idx);
                      navigate(`/preview-artifact/${productId}/${idx}`, { replace: true });
                    }}
                    className={`w-2 h-2 rounded-full transition-all ${
                      idx === currentIndex
                        ? 'bg-primary w-8'
                        : 'bg-muted-foreground/30 hover:bg-muted-foreground/50'
                    }`}
                    aria-label={`Go to preview ${idx + 1}`}
                  />
                ))}
              </div>
              <Button
                variant="outline"
                onClick={handleNext}
                disabled={currentIndex === previews.length - 1}
              >
                Next
                <ChevronRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          )}
        </div>

        {/* Preview Content */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Eye className="w-5 h-5 text-primary" />
                  {currentPreview.title}
                </CardTitle>
                {currentPreview.format && (
                  <p className="text-sm text-muted-foreground mt-1">
                    Format: {currentPreview.format}
                  </p>
                )}
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <FileText className="w-4 h-4" />
                <span>
                  {currentIndex + 1} / {previews.length}
                </span>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="bg-muted/20 rounded-lg p-6 border border-border min-h-[400px]">
              {typeof currentPreview.content === 'string' 
                ? <p className="text-sm whitespace-pre-wrap text-foreground">{currentPreview.content}</p>
                : currentPreview.content
              }
            </div>
          </CardContent>
        </Card>

        {/* All Previews List */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>All Previews for {product.name}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-3">
              {previews.map((preview, idx) => (
                <Link
                  key={preview.id}
                  to={`/preview-artifact/${productId}/${idx}`}
                  className={`p-4 rounded-lg border transition-all ${
                    idx === currentIndex
                      ? 'border-primary bg-primary/5'
                      : 'border-border hover:border-primary/50'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="font-semibold text-foreground mb-1">
                        {preview.title}
                      </h3>
                      <p className="text-xs text-muted-foreground">
                        {preview.type} • {preview.format || 'N/A'}
                      </p>
                    </div>
                    {idx === currentIndex && (
                      <CheckCircle className="w-5 h-5 text-primary flex-shrink-0" />
                    )}
                  </div>
                </Link>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PreviewArtifactViewer;

