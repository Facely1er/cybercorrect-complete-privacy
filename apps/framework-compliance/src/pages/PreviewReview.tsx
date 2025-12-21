import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Eye, CheckCircle, FileText, Download, ArrowLeft, Lock, FileDown } from 'lucide-react';
import { Link } from 'react-router-dom';
import ProductPreviewModal from '../components/product/ProductPreviewModal';
import { ProductCatalog, OneTimeProduct } from '../utils/monetization/oneTimeProducts';
import { generateDataExportPdf } from '../utils/pdf/generateExportPdf';

/**
 * Preview Review Page
 * 
 * INTERNAL USE ONLY - Content review page for internal team members.
 * This page allows content reviewers to easily access and review all product previews
 * in one place. Useful for content review, visual readiness checks, and QA testing.
 * 
 * Access: /preview-review (internal only)
 */
const PreviewReview = () => {
  // All hooks must be called at the top level, before any conditional returns
  const [isInternal, setIsInternal] = useState<boolean | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<OneTimeProduct | null>(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [reviewedProducts, setReviewedProducts] = useState<Set<string>>(new Set());

  // Check if user has internal access
  useEffect(() => {
    // Check environment variable for internal access
    const internalAccess = import.meta.env.VITE_ENABLE_INTERNAL_REVIEW === 'true' || 
                          import.meta.env.MODE === 'development' ||
                          window.location.hostname === 'localhost' ||
                          window.location.hostname === '127.0.0.1';
    
    setIsInternal(internalAccess);
  }, []);

  // Show loading state while checking
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

  // Get all one-time products
  const products = ProductCatalog.getAllProducts();

  const handleOpenPreview = (product: OneTimeProduct) => {
    setSelectedProduct(product);
    setIsPreviewOpen(true);
  };

  const handleMarkReviewed = (productId: string) => {
    setReviewedProducts(prev => new Set(prev).add(productId));
  };

  const handleClosePreview = () => {
    setIsPreviewOpen(false);
    // Auto-mark as reviewed when closing
    if (selectedProduct) {
      handleMarkReviewed(selectedProduct.id);
    }
  };

  const allReviewed = products.every(p => reviewedProducts.has(p.id));
  const reviewProgress = Math.round((reviewedProducts.size / products.length) * 100);

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="container mx-auto px-4 max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-4xl font-bold text-foreground mb-2">
                Product Preview Review
              </h1>
              <p className="text-muted-foreground">
                Review all product preview content for accuracy and visual readiness
              </p>
            </div>
            <Link to="/store">
              <Button variant="outline">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Store
              </Button>
            </Link>
          </div>

          {/* Progress Bar */}
          <Card className="mb-6">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-foreground">
                  Review Progress
                </span>
                <span className="text-sm text-muted-foreground">
                  {reviewedProducts.size} / {products.length} products reviewed
                </span>
              </div>
              <div className="w-full bg-muted rounded-full h-2">
                <div
                  className="bg-primary h-2 rounded-full transition-all duration-300"
                  style={{ width: `${reviewProgress}%` }}
                />
              </div>
              {allReviewed && (
                <div className="mt-3 flex items-center gap-2 text-green-600 dark:text-green-400">
                  <CheckCircle className="w-5 h-5" />
                  <span className="text-sm font-medium">All products reviewed!</span>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Product Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => {
            const isReviewed = reviewedProducts.has(product.id);
            
            return (
              <Card
                key={product.id}
                className={`hover:shadow-lg transition-shadow ${
                  isReviewed ? 'border-green-500 dark:border-green-400' : ''
                }`}
              >
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <CardTitle className="text-xl text-foreground">
                      {product.name}
                    </CardTitle>
                    {isReviewed && (
                      <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0" />
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">
                    {product.tagline}
                  </p>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {/* Product Info */}
                    <div>
                      <p className="text-sm text-foreground/80 mb-2">
                        {product.description}
                      </p>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <FileText className="w-4 h-4" />
                        <span>
                          {product.includedTools.length} tools included
                        </span>
                      </div>
                    </div>

                    {/* Preview Count Info */}
                    <div className="p-3 bg-muted/50 rounded-lg">
                      <div className="text-xs text-muted-foreground mb-1">
                        Preview Content:
                      </div>
                      <div className="text-sm text-foreground">
                        {product.id === 'privacy-toolkit-pro' && '3 previews (DPIA, Privacy Policy, Data Mapping)'}
                        {product.id === 'gdpr-complete-kit' && '3 previews (Privacy Notice, Breach Notification, DSR Manager)'}
                        {product.id === 'policy-template-library' && '3 previews (Privacy Policy, Cookie Policy, Terms of Service)'}
                        {product.id === 'compliance-assessment-suite' && '2 previews (Gap Analysis, Roadmap)'}
                        {product.id === 'compliance-toolkit' && '2 previews (Gap Analysis Worksheet, Evidence Checklist)'}
                        {!['privacy-toolkit-pro', 'gdpr-complete-kit', 'policy-template-library', 'compliance-assessment-suite', 'compliance-toolkit'].includes(product.id) && 'Preview content available'}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="space-y-2">
                      <Button
                        onClick={() => handleOpenPreview(product)}
                        className="w-full bg-primary hover:bg-primary/90"
                      >
                        <Eye className="w-4 h-4 mr-2" />
                        Review Previews
                      </Button>
                      <Link to={`/preview-artifact/${product.id}`}>
                        <Button
                          variant="outline"
                          className="w-full"
                        >
                          <FileText className="w-4 h-4 mr-2" />
                          View Individual Artifacts
                        </Button>
                      </Link>
                      {isReviewed && (
                        <Button
                          variant="outline"
                          onClick={() => handleMarkReviewed(product.id)}
                          className="w-full border-green-500 text-green-600 dark:text-green-400"
                          disabled
                        >
                          <CheckCircle className="w-4 h-4 mr-2" />
                          Reviewed
                        </Button>
                      )}
                    </div>

                    {/* Quick Stats */}
                    <div className="pt-3 border-t border-border">
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <div>
                          <span className="text-muted-foreground">Price:</span>
                          <span className="ml-1 font-semibold text-foreground">
                            ${product.price}
                          </span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Category:</span>
                          <span className="ml-1 font-semibold text-foreground capitalize">
                            {product.category}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Review Checklist */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Review Checklist</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium text-foreground">Content Accuracy</p>
                  <p className="text-sm text-muted-foreground">
                    Verify that preview content accurately represents what customers will receive
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium text-foreground">Visual Design</p>
                  <p className="text-sm text-muted-foreground">
                    Check colors, spacing, typography, and overall visual appeal
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium text-foreground">Dark Mode</p>
                  <p className="text-sm text-muted-foreground">
                    Ensure all content is readable and visually appealing in dark mode
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium text-foreground">Responsiveness</p>
                  <p className="text-sm text-muted-foreground">
                    Test preview modal on mobile, tablet, and desktop screen sizes
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium text-foreground">Navigation</p>
                  <p className="text-sm text-muted-foreground">
                    Verify Previous/Next buttons work correctly for products with multiple previews
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium text-foreground">Format Labels</p>
                  <p className="text-sm text-muted-foreground">
                    Confirm PDF/Word/Excel format labels match the preview content type
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Export Options */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Export Review Report</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap items-center gap-4">
              <Button
                variant="outline"
                onClick={async () => {
                  try {
                    const getPreviewCount = (productId: string): number => {
                      if (productId === 'privacy-toolkit-pro') return 3;
                      if (productId === 'gdpr-complete-kit') return 3;
                      if (productId === 'policy-template-library') return 3;
                      if (productId === 'compliance-assessment-suite') return 2;
                      if (productId === 'compliance-toolkit') return 2;
                      return 1;
                    };

                    const getPreviewDetails = (productId: string): string => {
                      if (productId === 'privacy-toolkit-pro') return 'DPIA Generator, Privacy Policy, Data Mapping';
                      if (productId === 'gdpr-complete-kit') return 'Privacy Notice, Breach Notification, DSR Manager';
                      if (productId === 'policy-template-library') return 'Privacy Policy, Cookie Policy, Terms of Service';
                      if (productId === 'compliance-assessment-suite') return 'Gap Analysis Report, Compliance Roadmap';
                      if (productId === 'compliance-toolkit') return 'Gap Analysis Worksheet, Evidence Checklist';
                      return 'Preview content available';
                    };

                    const productsTable = products.map(p => [
                      p.name.length > 45 ? p.name.substring(0, 45) + '...' : p.name,
                      p.category,
                      `$${p.price}`,
                      getPreviewCount(p.id).toString(),
                      reviewedProducts.has(p.id) ? 'Reviewed' : 'Pending',
                      reviewedProducts.has(p.id) ? '✓' : '○'
                    ]);

                    // Detailed product information table
                    const productDetailsTable = products.map(p => [
                      p.name.length > 40 ? p.name.substring(0, 40) + '...' : p.name,
                      getPreviewDetails(p.id),
                      p.includedTools.length.toString() + ' tools',
                      reviewedProducts.has(p.id) ? 'Completed' : 'In Progress'
                    ]);

                    // Review checklist items
                    const checklistTable = [
                      ['Content Accuracy', 'Verify preview content accurately represents deliverables', reviewedProducts.size > 0 ? '✓' : '○'],
                      ['Visual Design', 'Check colors, spacing, typography, and overall appeal', reviewedProducts.size > 0 ? '✓' : '○'],
                      ['Dark Mode', 'Ensure readability and visual appeal in dark mode', reviewedProducts.size > 0 ? '✓' : '○'],
                      ['Responsiveness', 'Test on mobile, tablet, and desktop screen sizes', reviewedProducts.size > 0 ? '✓' : '○'],
                      ['Navigation', 'Verify Previous/Next buttons work correctly', reviewedProducts.size > 0 ? '✓' : '○'],
                      ['Format Labels', 'Confirm PDF/Word/Excel labels match content type', reviewedProducts.size > 0 ? '✓' : '○']
                    ];

                    // Individual product review breakdown
                    const productReviewBreakdown = products.map(p => {
                      const previewCount = getPreviewCount(p.id);
                      const previewDetails = getPreviewDetails(p.id);
                      return [
                        p.name.length > 35 ? p.name.substring(0, 35) + '...' : p.name,
                        previewCount.toString(),
                        previewDetails.length > 50 ? previewDetails.substring(0, 50) + '...' : previewDetails,
                        reviewedProducts.has(p.id) ? 'Completed' : 'Pending',
                        reviewedProducts.has(p.id) ? new Date().toLocaleDateString() : 'N/A'
                      ];
                    });

                    await generateDataExportPdf(
                      {
                        title: 'Product Preview Review Report',
                        subtitle: 'Internal Content Review & Quality Assurance',
                        timestamp: new Date().toISOString(),
                        reportId: `PREVIEW-REVIEW-${Date.now()}`,
                        version: '1.0',
                        generatedBy: 'Internal Review Team'
                      },
                      {
                        'Total Products': products.length,
                        'Reviewed Products': reviewedProducts.size,
                        'Pending Review': products.length - reviewedProducts.size,
                        'Review Progress': `${reviewProgress}%`,
                        'Review Date': new Date().toLocaleDateString(),
                        'Completion Status': allReviewed ? '100% Complete' : 'In Progress'
                      },
                      [
                        {
                          title: 'Product Review Status',
                          headers: ['Product Name', 'Category', 'Price', 'Previews', 'Status', 'Reviewed'],
                          rows: productsTable
                        },
                        {
                          title: 'Product Preview Details',
                          headers: ['Product Name', 'Preview Content', 'Tools Included', 'Review Status'],
                          rows: productDetailsTable
                        },
                        {
                          title: 'Individual Product Review Breakdown',
                          headers: ['Product Name', 'Preview Count', 'Preview Types', 'Review Status', 'Review Date'],
                          rows: productReviewBreakdown
                        },
                        {
                          title: 'Review Checklist',
                          headers: ['Checklist Item', 'Description', 'Status'],
                          rows: checklistTable
                        }
                      ],
                      `preview-review-report-${new Date().toISOString().split('T')[0]}.pdf`
                    );
                  } catch (error) {
                    console.error('Error generating PDF:', error);
                    alert('Failed to generate PDF. Please try again.');
                  }
                }}
              >
                <FileDown className="w-4 h-4 mr-2" />
                Export PDF Report
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  const report = {
                    reviewDate: new Date().toISOString(),
                    totalProducts: products.length,
                    reviewedProducts: reviewedProducts.size,
                    reviewProgress: `${reviewProgress}%`,
                    products: products.map(p => ({
                      id: p.id,
                      name: p.name,
                      reviewed: reviewedProducts.has(p.id),
                      previewCount: p.id === 'privacy-toolkit-pro' ? 3 :
                                   p.id === 'gdpr-complete-kit' ? 3 :
                                   p.id === 'policy-template-library' ? 3 :
                                   p.id === 'compliance-assessment-suite' ? 2 :
                                   p.id === 'compliance-toolkit' ? 2 : 1
                    }))
                  };
                  
                  const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' });
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement('a');
                  a.href = url;
                  a.download = `preview-review-report-${new Date().toISOString().split('T')[0]}.json`;
                  a.click();
                  URL.revokeObjectURL(url);
                }}
              >
                <Download className="w-4 h-4 mr-2" />
                Export JSON Report
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  const report = `Product Preview Review Report
Generated: ${new Date().toLocaleString()}

Review Progress: ${reviewedProducts.size} / ${products.length} products (${reviewProgress}%)

Products Reviewed:
${products.map(p => 
  `- ${p.name}: ${reviewedProducts.has(p.id) ? '✓ Reviewed' : '○ Pending'}`
).join('\n')}

Review Checklist:
□ Content Accuracy
□ Visual Design
□ Dark Mode Compatibility
□ Responsiveness
□ Navigation Functionality
□ Format Labels

Notes:
- Review all preview content for accuracy
- Test in both light and dark modes
- Verify responsive design on all screen sizes
- Check navigation between multiple previews
`;
                  
                  const blob = new Blob([report], { type: 'text/plain' });
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement('a');
                  a.href = url;
                  a.download = `preview-review-report-${new Date().toISOString().split('T')[0]}.txt`;
                  a.click();
                  URL.revokeObjectURL(url);
                }}
              >
                <Download className="w-4 h-4 mr-2" />
                Export Text Report
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Preview Modal */}
      <ProductPreviewModal
        product={selectedProduct}
        isOpen={isPreviewOpen}
        onClose={handleClosePreview}
      />
    </div>
  );
};

export default PreviewReview;

