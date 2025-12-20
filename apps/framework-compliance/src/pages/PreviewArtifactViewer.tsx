import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { ArrowLeft, Eye, ChevronLeft, ChevronRight, Download, FileText, Lock } from 'lucide-react';
import { ProductCatalog, OneTimeProduct } from '../utils/monetization/oneTimeProducts';
import { CheckCircle } from 'lucide-react';

/**
 * Preview Artifact Viewer
 * 
 * INTERNAL USE ONLY - Displays individual preview artifacts separately for detailed review.
 * 
 * Routes:
 * - /preview-artifact/:productId/:previewIndex - View specific preview
 * - /preview-artifact/:productId - View all previews for a product
 */
const PreviewArtifactViewer = () => {
  const { productId, previewIndex } = useParams<{ productId: string; previewIndex?: string }>();
  const navigate = useNavigate();
  const [product, setProduct] = useState<OneTimeProduct | null>(null);
  const [previews, setPreviews] = useState<any[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isInternal, setIsInternal] = useState<boolean | null>(null);

  // Generate preview content for a specific product (helper function)
  // Must be defined before useEffect that uses it
  const generatePreviewsForProduct = React.useCallback((oneTimeProduct: OneTimeProduct): any[] => {
    const previews: any[] = [];

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
            <div className="p-6 bg-white dark:bg-gray-800 rounded border border-border">
              <h3 className="text-xl font-bold mb-4 text-foreground">Data Protection Impact Assessment</h3>
              <div className="space-y-3 text-sm">
                <div className="p-3 bg-blue-50 dark:bg-blue-900/30 rounded border border-blue-200 dark:border-blue-800">
                  <strong className="text-foreground">Processing Activity:</strong>
                  <p className="text-foreground/80 mt-1">Customer data collection and storage</p>
                </div>
                <div>
                  <strong className="text-foreground">Legal Basis:</strong>
                  <p className="text-foreground/80">Contract performance (GDPR Article 6(1)(b))</p>
                </div>
                <div>
                  <strong className="text-foreground">Data Categories:</strong>
                  <p className="text-foreground/80">Contact information, payment data, usage analytics</p>
                </div>
                <div className="flex items-center gap-2">
                  <strong className="text-foreground">Risk Level:</strong>
                  <span className="px-2 py-1 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-200 rounded text-xs font-semibold">
                    Medium
                  </span>
                </div>
                <div className="mt-4 p-3 bg-green-50 dark:bg-green-900/30 rounded border border-green-200 dark:border-green-800">
                  <strong className="text-foreground">Mitigation Measures:</strong>
                  <p className="text-foreground/80 mt-1">Encryption at rest, access controls, regular audits</p>
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
            <div className="p-6 bg-white dark:bg-gray-800 rounded border border-border">
              <h3 className="text-xl font-bold mb-4 text-foreground">Data Flow Mapping</h3>
              <div className="space-y-3 text-sm">
                <div className="grid grid-cols-3 gap-2">
                  <div className="p-3 bg-blue-50 dark:bg-blue-900/30 rounded text-center">
                    <div className="font-semibold text-foreground">Data Source</div>
                    <div className="text-xs text-foreground/70 mt-1">Customer Forms</div>
                  </div>
                  <div className="p-3 bg-green-50 dark:bg-green-900/30 rounded text-center">
                    <div className="font-semibold text-foreground">Processing</div>
                    <div className="text-xs text-foreground/70 mt-1">CRM System</div>
                  </div>
                  <div className="p-3 bg-purple-50 dark:bg-purple-900/30 rounded text-center">
                    <div className="font-semibold text-foreground">Storage</div>
                    <div className="text-xs text-foreground/70 mt-1">Cloud Database</div>
                  </div>
                </div>
                <div className="mt-4 p-3 bg-muted/50 rounded">
                  <p className="text-xs text-foreground/70">
                    Visual data flow mapping with unlimited flows, export to Excel/PDF, and compliance tracking
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
            <div className="p-6 bg-white dark:bg-gray-800 rounded border border-border">
              <h3 className="text-xl font-bold mb-4 text-foreground">GDPR-Compliant Privacy Notice</h3>
              <div className="space-y-3 text-sm">
                <div className="p-3 bg-green-50 dark:bg-green-900/30 rounded border border-green-200 dark:border-green-800">
                  <div className="flex items-center gap-2 mb-2">
                    <CheckCircle className="w-4 h-4 text-green-600 dark:text-green-400" />
                    <strong className="text-foreground">GDPR Article 13 Compliant</strong>
                  </div>
                </div>
                <div>
                  <strong className="text-foreground">Data Controller:</strong>
                  <p className="text-foreground/80">[Your Organization Name]</p>
                </div>
                <div>
                  <strong className="text-foreground">Legal Basis:</strong>
                  <p className="text-foreground/80">Consent, Contract, Legitimate Interest</p>
                </div>
                <div>
                  <strong className="text-foreground">Data Subject Rights:</strong>
                  <p className="text-foreground/80">Access, Rectification, Erasure, Portability, Objection, Restriction</p>
                </div>
                <div>
                  <strong className="text-foreground">Retention Period:</strong>
                  <p className="text-foreground/80">As specified in data retention policy</p>
                </div>
                <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/30 rounded">
                  <p className="text-xs text-foreground/70">
                    Includes all required GDPR disclosures, multi-language support (EN, DE, FR, ES), and customizable sections
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
            <div className="p-6 bg-white dark:bg-gray-800 rounded border border-border">
              <h3 className="text-xl font-bold mb-4 text-foreground">Breach Notification Template</h3>
              <div className="space-y-3 text-sm">
                <div className="p-3 bg-red-50 dark:bg-red-900/30 rounded border border-red-200 dark:border-red-800">
                  <div className="font-semibold text-foreground mb-2">Incident Overview</div>
                  <div className="space-y-1 text-foreground/80">
                    <p><strong>Incident ID:</strong> INC-2025-0205-001</p>
                    <p><strong>Date Detected:</strong> [Date/Time]</p>
                    <p><strong>Affected Data:</strong> Contact information, email addresses</p>
                    <p><strong>Number Affected:</strong> [Number] individuals</p>
                  </div>
                </div>
                <div className="p-3 bg-yellow-50 dark:bg-yellow-900/30 rounded">
                  <div className="font-semibold text-foreground mb-2">Immediate Actions</div>
                  <ul className="list-disc list-inside space-y-1 text-foreground/80">
                    <li>Containment measures implemented</li>
                    <li>System isolation completed</li>
                    <li>Investigation initiated</li>
                  </ul>
                </div>
                <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/30 rounded">
                  <p className="text-xs text-foreground/70">
                    ✓ 72-hour GDPR notification checklist | ✓ CCPA requirements | ✓ Multi-jurisdiction compliance
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
            <div className="p-6 bg-white dark:bg-gray-800 rounded border border-border">
              <h3 className="text-xl font-bold mb-4 text-foreground">DSR Request Tracking</h3>
              <div className="space-y-3 text-sm">
                <div className="border border-border rounded-lg overflow-hidden">
                  <table className="w-full text-xs">
                    <thead className="bg-muted">
                      <tr>
                        <th className="p-2 text-left text-foreground">Request ID</th>
                        <th className="p-2 text-left text-foreground">Type</th>
                        <th className="p-2 text-left text-foreground">Status</th>
                        <th className="p-2 text-left text-foreground">Days Remaining</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-t border-border">
                        <td className="p-2 text-foreground/80">DSR-001</td>
                        <td className="p-2 text-foreground/80">Access Request</td>
                        <td className="p-2">
                          <span className="px-2 py-1 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-200 rounded text-xs">
                            In Progress
                          </span>
                        </td>
                        <td className="p-2 text-foreground/80">22 days</td>
                      </tr>
                      <tr className="border-t border-border">
                        <td className="p-2 text-foreground/80">DSR-002</td>
                        <td className="p-2 text-foreground/80">Erasure Request</td>
                        <td className="p-2">
                          <span className="px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200 rounded text-xs">
                            Completed
                          </span>
                        </td>
                        <td className="p-2 text-foreground/80">-</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <div className="mt-4 p-3 bg-muted/50 rounded">
                  <p className="text-xs text-foreground/70">
                    Track all GDPR Article 15-22 requests with 30-day compliance window, automated reminders, and export capabilities
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

  const handleExport = () => {
    const exportData = {
      product: {
        id: product.id,
        name: product.name,
      },
      preview: {
        id: currentPreview.id,
        title: currentPreview.title,
        type: currentPreview.type,
        format: currentPreview.format,
      },
      exportedAt: new Date().toISOString(),
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${product.id}-${currentPreview.id}-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
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
              <Button variant="outline" onClick={handleExport}>
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>
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

