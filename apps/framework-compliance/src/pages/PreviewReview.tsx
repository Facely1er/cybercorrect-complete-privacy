import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Eye, CheckCircle, FileText, Download, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import ProductPreviewModal from '../components/product/ProductPreviewModal';
import { ProductCatalog, OneTimeProduct } from '../utils/monetization/oneTimeProducts';

/**
 * Preview Review Page
 * 
 * This page allows content reviewers to easily access and review all product previews
 * in one place. Useful for content review, visual readiness checks, and QA testing.
 * 
 * Access: /preview-review (add to routes)
 */
const PreviewReview = () => {
  const [selectedProduct, setSelectedProduct] = useState<OneTimeProduct | null>(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [reviewedProducts, setReviewedProducts] = useState<Set<string>>(new Set());

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
            <div className="flex items-center gap-4">
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

