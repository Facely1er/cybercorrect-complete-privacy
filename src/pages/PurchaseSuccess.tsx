import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Check, Copy, Download, ExternalLink, Loader2, AlertCircle, Key } from 'lucide-react';
import { LicenseManager } from '../utils/oneTimeProducts';
import { ProductCatalog } from '../utils/oneTimeProducts';
import { toast } from '../components/ui/Toaster';

const PurchaseSuccess = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [activatedLicenses, setActivatedLicenses] = useState<Array<{
    productId: string;
    licenseKey: string;
    productName: string;
  }>>([]);
  const [isActivating, setIsActivating] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Get license keys from URL parameters
  // Format: /store/success?licenses=PROD1-KEY1,PROD2-KEY2 or ?product=PROD1&key=KEY1
  useEffect(() => {
    const activateFromUrl = async () => {
      try {
        // Method 1: Multiple licenses in query string
        const licensesParam = searchParams.get('licenses');
        if (licensesParam) {
          const licensePairs = licensesParam.split(',').map(pair => {
            const [productId, ...keyParts] = pair.split('-');
            return { productId, licenseKey: keyParts.join('-') };
          });
          
          const activated = [];
          for (const { productId, licenseKey } of licensePairs) {
            const product = ProductCatalog.getProduct(productId);
            if (product && licenseKey) {
              // Check if already activated
              if (!LicenseManager.verifyLicense(productId, licenseKey)) {
                LicenseManager.activateLicense(productId, licenseKey);
              }
              activated.push({
                productId,
                licenseKey,
                productName: product.name,
              });
            }
          }
          setActivatedLicenses(activated);
          setIsActivating(false);
          return;
        }

        // Method 2: Single product and key
        const productId = searchParams.get('product');
        const licenseKey = searchParams.get('key');
        if (productId && licenseKey) {
          const product = ProductCatalog.getProduct(productId);
          if (product) {
            // Check if already activated
            if (!LicenseManager.verifyLicense(productId, licenseKey)) {
              LicenseManager.activateLicense(productId, licenseKey);
            }
            setActivatedLicenses([{
              productId,
              licenseKey,
              productName: product.name,
            }]);
            setIsActivating(false);
            return;
        }
      }

        // Method 3: Session ID - fetch licenses from session (if backend available)
        const sessionId = searchParams.get('session_id');
        if (sessionId) {
          // Try to fetch license keys from session
          // This would require a backend endpoint, but we can handle gracefully
          try {
            // For now, show manual activation option
            // In production, you'd call: /api/session/{sessionId}/licenses
            if (import.meta.env.DEV) {
              console.log('Session ID received:', sessionId);
            }
            // If backend is available, fetch licenses here
            // Otherwise, show manual activation
          } catch (err) {
            console.warn('Could not fetch licenses from session:', err);
          }
        }

        // No licenses in URL - show manual activation option
        setIsActivating(false);
      } catch (err) {
        console.error('Error activating licenses:', err);
        setError('Failed to activate licenses. Please use manual activation.');
        setIsActivating(false);
      }
    };

    activateFromUrl();
  }, [searchParams]);

  const handleCopyLicense = (licenseKey: string) => {
    navigator.clipboard.writeText(licenseKey);
    toast.success('Copied', 'License key copied to clipboard');
  };

  const handleDownloadLicenses = () => {
    const licensesText = activatedLicenses
      .map(l => `${l.productName}: ${l.licenseKey}`)
      .join('\n');
    const blob = new Blob([licensesText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'license-keys.txt';
    a.click();
    URL.revokeObjectURL(url);
    toast.success('Downloaded', 'License keys saved to file');
  };

  return (
    <div className="min-h-screen bg-surface dark:bg-dark-bg py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        {isActivating ? (
          <Card>
            <CardContent className="p-12 text-center">
              <Loader2 className="w-12 h-12 animate-spin text-primary mx-auto mb-4" />
              <h2 className="text-2xl font-bold mb-2">Activating Your Licenses...</h2>
              <p className="text-muted-foreground">Please wait while we activate your products.</p>
            </CardContent>
          </Card>
        ) : activatedLicenses.length > 0 ? (
          <>
            {/* Success Header */}
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 dark:bg-green-900/20 rounded-full mb-4">
                <Check className="w-8 h-8 text-green-600 dark:text-green-400" />
              </div>
              <h1 className="text-4xl font-bold text-foreground mb-2">Purchase Successful!</h1>
              <p className="text-xl text-muted-foreground">
                Your licenses have been activated and are ready to use.
              </p>
            </div>

            {/* Activated Licenses */}
            <Card className="mb-6">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Key className="w-5 h-5" />
                  Activated Licenses
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {activatedLicenses.map((license) => (
                    <div
                      key={license.productId}
                      className="p-4 bg-muted/50 rounded-lg border border-border"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <h3 className="font-semibold text-foreground mb-1">
                            {license.productName}
                          </h3>
                          <div className="flex items-center gap-2 mt-2">
                            <code className="text-sm bg-background px-3 py-1 rounded border border-border font-mono">
                              {license.licenseKey}
                            </code>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleCopyLicense(license.licenseKey)}
                              className="h-8"
                            >
                              <Copy className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 text-green-600 dark:text-green-400">
                          <Check className="w-5 h-5" />
                          <span className="text-sm font-medium">Active</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-6 flex gap-3">
                  <Button
                    variant="outline"
                    onClick={handleDownloadLicenses}
                    className="flex-1"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Download All Keys
                  </Button>
                  <Button
                    onClick={() => navigate('/store')}
                    className="flex-1"
                  >
                    Continue Shopping
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Next Steps */}
            <Card>
              <CardHeader>
                <CardTitle>What's Next?</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-medium">Your products are ready to use</p>
                      <p className="text-sm text-muted-foreground">
                        All purchased tools are now available in your account. No additional setup required.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-medium">Save your license keys</p>
                      <p className="text-sm text-muted-foreground">
                        Download or copy your license keys for your records. You'll need them if you reinstall or switch devices.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-medium">Start using your tools</p>
                      <p className="text-sm text-muted-foreground">
                        Navigate to the tools section to start using your purchased products.
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </>
        ) : (
          <>
            {/* Manual Activation Option */}
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 dark:bg-blue-900/20 rounded-full mb-4">
                <Key className="w-8 h-8 text-blue-600 dark:text-blue-400" />
              </div>
              <h1 className="text-4xl font-bold text-foreground mb-2">Purchase Successful!</h1>
              <p className="text-xl text-muted-foreground">
                Activate your license keys to start using your products.
              </p>
            </div>

            {error && (
              <Card className="mb-6 border-alert-coral/20 bg-alert-coral/5">
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-alert-coral flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-medium text-alert-coral">Activation Notice</p>
                      <p className="text-sm text-muted-foreground mt-1">{error}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            <Card>
              <CardHeader>
                <CardTitle>Activate Your License</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-6">
                  If you received license keys via email, you can activate them manually. 
                  Otherwise, your licenses should activate automatically.
                </p>
                <div className="flex gap-3">
                  <Button
                    onClick={() => navigate('/activate-license')}
                    className="flex-1"
                  >
                    <Key className="w-4 h-4 mr-2" />
                    Activate License Key
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => navigate('/store')}
                    className="flex-1"
                  >
                    Back to Store
                  </Button>
                </div>
              </CardContent>
            </Card>
          </>
        )}

        {/* Support Section */}
        <Card className="mt-6">
          <CardContent className="p-6">
            <div className="text-center">
              <p className="text-muted-foreground mb-4">
                Need help? Contact our support team
              </p>
              <div className="flex gap-4 justify-center">
                <Button variant="outline" asChild>
                  <a href="mailto:contact@ermits.com">
                    <ExternalLink className="w-4 h-4 mr-2" />
                    Email Support
                  </a>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PurchaseSuccess;

