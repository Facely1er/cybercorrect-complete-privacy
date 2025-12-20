import React, { useState } from 'react';
import { X, FileText, Eye, Download, ChevronLeft, ChevronRight, CheckCircle } from 'lucide-react';
import { Card, CardContent } from '../ui/Card';
import { Button } from '../ui/Button';
import { OneTimeProduct, ProductBundle, ProductCatalog } from '../../utils/monetization/oneTimeProducts';

interface PreviewContent {
  type: 'template' | 'screenshot' | 'sample' | 'demo';
  title: string;
  content: string | React.ReactNode;
  format?: string;
}

interface ProductPreviewModalProps {
  product: OneTimeProduct | ProductBundle | null;
  isOpen: boolean;
  onClose: () => void;
  onAddToCart?: (productId: string) => void;
}

const ProductPreviewModal: React.FC<ProductPreviewModalProps> = ({ 
  product, 
  isOpen, 
  onClose,
  onAddToCart 
}) => {
  const [activePreviewIndex, setActivePreviewIndex] = useState(0);

  if (!isOpen || !product) return null;

  // Check if product is a bundle
  const isBundle = 'products' in product;

  // Generate preview content based on product
  const getPreviewContent = (): PreviewContent[] => {
    const previews: PreviewContent[] = [];

    // Handle bundles - show previews from included products
    if (isBundle) {
      const bundle = product as ProductBundle;
      const includedProducts = ProductCatalog.getProductsInBundle(bundle.id);
      
      previews.push({
        type: 'sample',
        title: 'Bundle Overview',
        content: (
          <div className="p-6 bg-white dark:bg-gray-800 rounded border border-border">
            <h3 className="text-xl font-bold mb-4 text-foreground">{bundle.name}</h3>
            <p className="text-sm mb-4 text-foreground/80">{bundle.description}</p>
            <div className="space-y-3">
              <div className="p-3 bg-primary/10 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <strong className="text-foreground">Bundle Price:</strong>
                  <span className="text-2xl font-bold text-primary">${bundle.price}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-foreground/70">You Save:</span>
                  <span className="font-semibold text-green-600 dark:text-green-400">${bundle.savings}</span>
                </div>
              </div>
              <div>
                <strong className="text-foreground mb-2 block">This bundle includes:</strong>
                <div className="space-y-2">
                  {includedProducts.map((prod, idx) => (
                    <div key={idx} className="flex items-center gap-2 p-2 bg-muted/50 rounded">
                      <CheckCircle className="w-4 h-4 text-primary flex-shrink-0" />
                      <div className="flex-1">
                        <div className="font-medium text-sm text-foreground">{prod.name}</div>
                        <div className="text-xs text-foreground/60">{prod.tagline}</div>
                      </div>
                      <div className="text-sm font-semibold text-foreground/70">${prod.price}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )
      });
      
      // Add previews from the first product in the bundle
      if (includedProducts.length > 0) {
        const firstProduct = includedProducts[0];
        const firstProductPreviews = getPreviewContentForProduct(firstProduct);
        previews.push(...firstProductPreviews.slice(0, 2)); // Add first 2 previews from first product
      }
      
      return previews;
    }

    const oneTimeProduct = product as OneTimeProduct;

    // Privacy Toolkit Pro
    if (oneTimeProduct.id === 'privacy-toolkit-pro') {
      previews.push(
        {
          type: 'template',
          title: 'DPIA Generator Sample',
          format: 'PDF',
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
          type: 'template',
          title: 'Privacy Policy Sample',
          format: 'Word',
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
          type: 'template',
          title: 'Data Mapping Tool Interface',
          format: 'Interactive',
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
          type: 'template',
          title: 'GDPR Privacy Notice',
          format: 'PDF',
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
          type: 'template',
          title: 'Data Breach Notification Template',
          format: 'Word',
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
          type: 'template',
          title: 'Data Subject Rights Request Manager',
          format: 'Interactive',
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
          type: 'template',
          title: 'Website Privacy Policy',
          format: 'Word',
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
          type: 'template',
          title: 'Cookie Policy Template',
          format: 'PDF',
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
          type: 'template',
          title: 'Terms of Service Template',
          format: 'Word',
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
          type: 'sample',
          title: 'Gap Analysis Report Sample',
          format: 'PDF',
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
          type: 'template',
          title: 'Compliance Roadmap Generator',
          format: 'Excel',
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
          type: 'template',
          title: 'Gap Analysis Worksheet',
          format: 'Excel',
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
          type: 'template',
          title: 'Evidence Collection Checklist',
          format: 'PDF',
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

    // Default preview if no specific content
    if (previews.length === 0) {
      previews.push({
        type: 'sample',
        title: 'Product Overview',
        content: (
          <div className="p-6 bg-white dark:bg-gray-800 rounded border border-border">
            <h3 className="text-xl font-bold mb-4 text-foreground">{oneTimeProduct.name}</h3>
            <p className="text-sm mb-4 text-foreground/80">{oneTimeProduct.description}</p>
            <div className="space-y-2">
              <strong className="text-foreground">Included Tools:</strong>
              <ul className="list-disc list-inside space-y-1 text-sm text-foreground/80">
                {oneTimeProduct.includedTools.slice(0, 5).map((tool, idx) => (
                  <li key={idx}>{tool}</li>
                ))}
              </ul>
            </div>
          </div>
        )
      });
    }

    return previews;
  };

  const previews = getPreviewContent();
  const activePreview = previews[activePreviewIndex];
  const productId = isBundle ? (product as ProductBundle).id : (product as OneTimeProduct).id;
  const productPrice = isBundle ? (product as ProductBundle).price : (product as OneTimeProduct).price;

  return (
    <div 
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div 
        className="bg-background rounded-lg shadow-xl max-w-5xl w-full max-h-[90vh] overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 bg-background border-b border-border p-6 flex items-center justify-between z-10">
          <div className="flex-1">
            <h2 className="text-2xl font-bold text-foreground mb-1">
              {product.name} - Preview
            </h2>
            <p className="text-sm text-muted-foreground">
              See what you'll receive with this product
            </p>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="rounded-full"
            aria-label="Close preview"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Preview Navigation */}
        {previews.length > 1 && (
          <div className="px-6 py-4 bg-muted/30 border-b border-border flex items-center justify-between">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setActivePreviewIndex((prev) => 
                prev > 0 ? prev - 1 : previews.length - 1
              )}
            >
              <ChevronLeft className="w-4 h-4 mr-2" />
              Previous
            </Button>
            <div className="flex items-center gap-2">
              {previews.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setActivePreviewIndex(idx)}
                  className={`w-2 h-2 rounded-full transition-all ${
                    idx === activePreviewIndex 
                      ? 'bg-primary w-8' 
                      : 'bg-muted-foreground/30 hover:bg-muted-foreground/50'
                  }`}
                  aria-label={`Go to preview ${idx + 1}`}
                />
              ))}
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setActivePreviewIndex((prev) => 
                prev < previews.length - 1 ? prev + 1 : 0
              )}
            >
              Next
              <ChevronRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        )}

        {/* Preview Content */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
                <Eye className="w-5 h-5 text-primary" />
                {activePreview.title}
              </h3>
              {activePreview.format && (
                <span className="text-xs text-muted-foreground mt-1 inline-block">
                  Format: {activePreview.format}
                </span>
              )}
            </div>
            <div className="flex items-center gap-2">
              <FileText className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">
                {activePreviewIndex + 1} of {previews.length}
              </span>
            </div>
          </div>

          <div className="bg-muted/20 rounded-lg p-4 border border-border">
            {typeof activePreview.content === 'string' 
              ? <p className="text-sm whitespace-pre-wrap text-foreground">{activePreview.content}</p>
              : activePreview.content
            }
          </div>

          {/* Preview Info */}
          <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
            <div className="flex items-start gap-3">
              <Eye className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
              <div className="text-sm">
                <p className="font-semibold text-blue-900 dark:text-blue-200 mb-1">
                  This is a preview of what you'll receive
                </p>
                <p className="text-blue-800 dark:text-blue-300">
                  After purchase, you'll get full access to all templates, tools, and customization options. 
                  All content is customizable and ready to use for your organization.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="sticky bottom-0 bg-background border-t border-border p-6 flex items-center justify-between">
          <div className="text-sm text-muted-foreground">
            <strong className="text-foreground">${productPrice}</strong> - One-time payment, lifetime access
          </div>
          <div className="flex gap-3">
            <Button variant="outline" onClick={onClose}>
              Close Preview
            </Button>
            {onAddToCart && (
              <Button 
                className="bg-primary hover:bg-primary/90"
                onClick={() => {
                  onAddToCart(productId);
                  onClose();
                }}
              >
                <Download className="w-4 h-4 mr-2" />
                Add to Cart
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductPreviewModal;

