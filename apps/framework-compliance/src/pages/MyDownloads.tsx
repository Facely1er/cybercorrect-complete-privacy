import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import {
  Download,
  Key,
  FileText,
  Package,
  CheckCircle,
  Clock,
  ExternalLink,
  FileSpreadsheet,
  File,
  FileType,
  ShoppingCart,
} from 'lucide-react';
import { LicenseManager, ProductCatalog } from '../utils/monetization';
import { toast } from '../components/ui/Toaster';

interface Purchase {
  id: string;
  productId: string;
  purchaseDate: string;
  price: number;
  licenseKey: string;
  status: 'active' | 'refunded' | 'expired';
}

const MyDownloads = () => {
  const [purchases, setPurchases] = useState<Purchase[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPurchases();
  }, []);

  const loadPurchases = () => {
    try {
      const storedPurchases = LicenseManager.getPurchases();
      setPurchases(storedPurchases);
    } catch (error) {
      console.error('Error loading purchases:', error);
      toast.error('Error', 'Failed to load your purchases');
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadLicense = (purchase: Purchase) => {
    const product = ProductCatalog.getProduct(purchase.productId);
    const licenseText = `${product?.name || purchase.productId}\nLicense Key: ${purchase.licenseKey}\nPurchase Date: ${new Date(purchase.purchaseDate).toLocaleDateString()}\nStatus: ${purchase.status}`;
    
    const blob = new Blob([licenseText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `license-${purchase.productId}-${new Date().toISOString().split('T')[0]}.txt`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success('Downloaded', 'License key saved');
  };

  const handleDownloadAllLicenses = () => {
    const allLicenses = purchases
      .filter(p => p.status === 'active')
      .map(p => {
        const product = ProductCatalog.getProduct(p.productId);
        return `${product?.name || p.productId}\nLicense Key: ${p.licenseKey}\nPurchase Date: ${new Date(p.purchaseDate).toLocaleDateString()}\n---\n`;
      })
      .join('\n');

    const blob = new Blob([allLicenses], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `all-licenses-${new Date().toISOString().split('T')[0]}.txt`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success('Downloaded', 'All license keys saved');
  };

  const getProductDownloadLinks = (productId: string) => {
    const product = ProductCatalog.getProduct(productId);
    if (!product) return [];

    const links: Array<{ name: string; path: string; icon: typeof FileText }> = [];

    // Map product IDs to tool paths
    const productToolMap: Record<string, string> = {
      'privacy-toolkit-pro': '/toolkit',
      'compliance-assessment-suite': '/assessments',
      'gdpr-complete-kit': '/toolkit/gdpr',
      'policy-template-library': '/toolkit/templates',
      'compliance-toolkit': '/toolkit/frameworks',
    };

    if (productToolMap[productId]) {
      links.push({
        name: 'Access Tools',
        path: productToolMap[productId],
        icon: ExternalLink,
      });
    }

    // Add common tool links based on included tools
    if (product.includedTools.includes('DPIA Generator')) {
      links.push({
        name: 'DPIA Generator',
        path: '/toolkit/dpia-generator',
        icon: FileText,
      });
    }

    if (product.includedTools.includes('Privacy Policy Generator')) {
      links.push({
        name: 'Privacy Policy Generator',
        path: '/toolkit/privacy-policy',
        icon: FileText,
      });
    }

    if (product.includedTools.includes('Data Mapping Tool')) {
      links.push({
        name: 'Data Mapping Tool',
        path: '/toolkit/data-mapping',
        icon: FileSpreadsheet,
      });
    }

    return links;
  };

  const activePurchases = purchases.filter(p => p.status === 'active');
  const hasPurchases = activePurchases.length > 0;

  if (loading) {
    return (
      <div className="min-h-screen bg-surface dark:bg-dark-bg py-12">
        <div className="container mx-auto px-4 max-w-6xl">
          <Card>
            <CardContent className="p-12 text-center">
              <Clock className="w-12 h-12 animate-spin text-primary mx-auto mb-4" />
              <h2 className="text-2xl font-bold mb-2">Loading Your Downloads...</h2>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface dark:bg-dark-bg py-12">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">My Downloads</h1>
          <p className="text-muted-foreground">
            Access your purchased products, license keys, and downloadable resources
          </p>
        </div>

        {!hasPurchases ? (
          <Card>
            <CardContent className="p-12 text-center">
              <Package className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <h2 className="text-2xl font-bold mb-2">No Purchases Yet</h2>
              <p className="text-muted-foreground mb-6">
                You haven't purchased any products yet. Browse our store to find tools and templates that fit your needs.
              </p>
              <Link to="/store">
                <Button>
                  <ShoppingCart className="w-4 h-4 mr-2" />
                  Browse Store
                </Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <>
            {/* Quick Actions */}
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-3">
                  <Button
                    variant="outline"
                    onClick={handleDownloadAllLicenses}
                    disabled={activePurchases.length === 0}
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Download All License Keys
                  </Button>
                  <Link to="/store">
                    <Button variant="outline">
                      <ShoppingCart className="w-4 h-4 mr-2" />
                      Browse More Products
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>

            {/* Purchased Products */}
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-foreground">Purchased Products</h2>
              
              {activePurchases.map((purchase) => {
                const product = ProductCatalog.getProduct(purchase.productId);
                const downloadLinks = getProductDownloadLinks(purchase.productId);

                return (
                  <Card key={purchase.id}>
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <CardTitle className="flex items-center gap-2">
                            <Package className="w-5 h-5 text-primary" />
                            {product?.name || purchase.productId}
                          </CardTitle>
                          <p className="text-sm text-muted-foreground mt-1">
                            Purchased on {new Date(purchase.purchaseDate).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
                          <span className="text-sm font-medium text-green-600 dark:text-green-400">
                            Active
                          </span>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {/* License Key */}
                        <div className="p-4 bg-muted/50 rounded-lg border border-border">
                          <div className="flex items-start justify-between gap-4">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-2">
                                <Key className="w-4 h-4 text-primary" />
                                <span className="font-semibold text-sm">License Key</span>
                              </div>
                              <code className="text-sm bg-background px-3 py-2 rounded border border-border font-mono block">
                                {purchase.licenseKey}
                              </code>
                            </div>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleDownloadLicense(purchase)}
                            >
                              <Download className="w-4 h-4 mr-2" />
                              Download
                            </Button>
                          </div>
                        </div>

                        {/* Product Features */}
                        {product && (
                          <div>
                            <h3 className="font-semibold text-sm mb-2">Included Tools & Features</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                              {product.includedTools.slice(0, 6).map((tool, index) => (
                                <div key={index} className="flex items-center gap-2 text-sm text-muted-foreground">
                                  <CheckCircle className="w-4 h-4 text-primary flex-shrink-0" />
                                  <span>{tool}</span>
                                </div>
                              ))}
                              {product.includedTools.length > 6 && (
                                <div className="text-sm text-muted-foreground">
                                  +{product.includedTools.length - 6} more tools
                                </div>
                              )}
                            </div>
                          </div>
                        )}

                        {/* Download Links */}
                        {downloadLinks.length > 0 && (
                          <div>
                            <h3 className="font-semibold text-sm mb-2">Access Your Tools</h3>
                            <div className="flex flex-wrap gap-2">
                              {downloadLinks.map((link, index) => {
                                const Icon = link.icon;
                                return (
                                  <Link key={index} to={link.path}>
                                    <Button
                                      variant="outline"
                                      size="sm"
                                    >
                                      <Icon className="w-4 h-4 mr-2" />
                                      {link.name}
                                    </Button>
                                  </Link>
                                );
                              })}
                            </div>
                          </div>
                        )}

                        {/* Export Capabilities */}
                        {product && product.features.some(f => f.includes('Export')) && (
                          <div className="p-4 bg-primary/5 rounded-lg">
                            <h3 className="font-semibold text-sm mb-2">Export Formats Available</h3>
                            <div className="flex flex-wrap gap-2">
                              {product.features
                                .filter(f => f.includes('Export') || f.includes('PDF') || f.includes('Word') || f.includes('Excel'))
                                .map((feature, index) => {
                                  let icon = File;
                                  if (feature.includes('PDF')) icon = FileType;
                                  if (feature.includes('Excel')) icon = FileSpreadsheet;
                                  if (feature.includes('Word')) icon = FileText;
                                  
                                  const Icon = icon;
                                  return (
                                    <div key={index} className="flex items-center gap-1 text-xs text-muted-foreground">
                                      <Icon className="w-3 h-3" />
                                      <span>{feature}</span>
                                    </div>
                                  );
                                })}
                            </div>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            {/* Help Section */}
            <Card className="mt-6">
              <CardHeader>
                <CardTitle>Need Help?</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <FileText className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-medium">How to Use Your Products</p>
                      <p className="text-sm text-muted-foreground">
                        After purchasing, your license is automatically activated. Access your tools from the links above or navigate to the Tools section.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Key className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-medium">License Keys</p>
                      <p className="text-sm text-muted-foreground">
                        Save your license keys for your records. You'll need them if you reinstall or switch devices.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Download className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-medium">Exporting Your Work</p>
                      <p className="text-sm text-muted-foreground">
                        All purchased tools support exporting to PDF, Word, Excel, and JSON formats. Look for the export button in each tool.
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </div>
  );
};

export default MyDownloads;

