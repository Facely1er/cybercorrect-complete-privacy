import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Key, Check, X, AlertCircle, Loader2 } from 'lucide-react';
import { LicenseManager, ProductCatalog } from '../utils/oneTimeProducts';
import { toast } from '../components/ui/Toaster';

const ActivateLicense = () => {
  const navigate = useNavigate();
  const [licenseKey, setLicenseKey] = useState('');
  const [productId, setProductId] = useState('');
  const [isActivating, setIsActivating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<{
    productName: string;
    licenseKey: string;
  } | null>(null);

  // Auto-detect product from license key format (e.g., PRIV-xxxxx-xxxxx)
  const detectProductFromKey = (key: string): string | null => {
    const parts = key.split('-');
    if (parts.length >= 2) {
      const productCode = parts[0].toLowerCase();
      // Map product codes to product IDs
      const codeMap: Record<string, string> = {
        'priv': 'privacy-toolkit-pro',
        'comp': 'compliance-assessment-suite',
        'gdpr': 'gdpr-complete-kit',
        'poli': 'policy-template-library',
      };
      return codeMap[productCode] || null;
    }
    return null;
  };

  const handleActivate = async () => {
    setError(null);
    setSuccess(null);

    if (!licenseKey.trim()) {
      setError('Please enter a license key');
      return;
    }

    // Auto-detect product if not specified
    let targetProductId = productId;
    if (!targetProductId) {
      const detected = detectProductFromKey(licenseKey);
      if (detected) {
        targetProductId = detected;
      } else {
        setError('Could not detect product from license key. Please select a product.');
        return;
      }
    }

    setIsActivating(true);

    try {
      // Check if product exists
      const product = ProductCatalog.getProduct(targetProductId);
      if (!product) {
        setError('Invalid product selected');
        setIsActivating(false);
        return;
      }

      // Check if license is already activated
      if (LicenseManager.verifyLicense(targetProductId, licenseKey)) {
        setError('This license key is already activated');
        setIsActivating(false);
        return;
      }

      // Activate license
      const purchase = LicenseManager.activateLicense(targetProductId, licenseKey);
      
      setSuccess({
        productName: product.name,
        licenseKey: licenseKey,
      });

      toast.success('License Activated', `${product.name} is now active!`);
      
      // Clear form
      setLicenseKey('');
      setProductId('');

      // Auto-redirect after 3 seconds
      setTimeout(() => {
        navigate('/store');
      }, 3000);
    } catch (err) {
      console.error('License activation error:', err);
      setError('Failed to activate license. Please check your license key and try again.');
      setIsActivating(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleActivate();
    }
  };

  return (
    <div className="min-h-screen bg-surface dark:bg-dark-bg py-12">
      <div className="container mx-auto px-4 max-w-2xl">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-4">
            <Key className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-4xl font-bold text-foreground mb-2">Activate License Key</h1>
          <p className="text-xl text-muted-foreground">
            Enter your license key to activate your purchased product
          </p>
        </div>

        {success && (
          <Card className="mb-6 border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-900/20">
            <CardContent className="p-6">
              <div className="flex items-start gap-3">
                <Check className="w-6 h-6 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <h3 className="font-semibold text-green-800 dark:text-green-300 mb-1">
                    License Activated Successfully!
                  </h3>
                  <p className="text-sm text-green-700 dark:text-green-400 mb-3">
                    <strong>{success.productName}</strong> is now active and ready to use.
                  </p>
                  <div className="flex items-center gap-2">
                    <code className="text-xs bg-background px-2 py-1 rounded border border-border font-mono">
                      {success.licenseKey}
                    </code>
                  </div>
                  <p className="text-xs text-green-600 dark:text-green-400 mt-3">
                    Redirecting to store in 3 seconds...
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        <Card>
          <CardHeader>
            <CardTitle>Enter License Key</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <label htmlFor="licenseKey" className="block text-sm font-medium mb-2">
                  License Key
                </label>
                <Input
                  id="licenseKey"
                  type="text"
                  placeholder="PRIV-XXXXX-XXXXX"
                  value={licenseKey}
                  onChange={(e) => {
                    setLicenseKey(e.target.value.toUpperCase());
                    setError(null);
                    // Auto-detect product
                    const detected = detectProductFromKey(e.target.value);
                    if (detected) {
                      setProductId(detected);
                    }
                  }}
                  onKeyDown={handleKeyDown}
                  className="font-mono"
                  disabled={isActivating}
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Your license key was sent to your email after purchase
                </p>
              </div>

              <div>
                <label htmlFor="product" className="block text-sm font-medium mb-2">
                  Product (Auto-detected)
                </label>
                <select
                  id="product"
                  value={productId}
                  onChange={(e) => setProductId(e.target.value)}
                  className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground"
                  disabled={isActivating}
                >
                  <option value="">Auto-detect from license key</option>
                  {ProductCatalog.getAllProducts().map((product) => (
                    <option key={product.id} value={product.id}>
                      {product.name}
                    </option>
                  ))}
                </select>
              </div>

              {error && (
                <div className="p-3 bg-alert-coral/10 border border-alert-coral/20 rounded-lg">
                  <div className="flex items-start gap-2">
                    <AlertCircle className="w-5 h-5 text-alert-coral flex-shrink-0 mt-0.5" />
                    <p className="text-sm text-alert-coral">{error}</p>
                  </div>
                </div>
              )}

              <div className="flex gap-3">
                <Button
                  onClick={handleActivate}
                  disabled={isActivating || !licenseKey.trim()}
                  className="flex-1"
                >
                  {isActivating ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Activating...
                    </>
                  ) : (
                    <>
                      <Key className="w-4 h-4 mr-2" />
                      Activate License
                    </>
                  )}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => navigate('/store')}
                  disabled={isActivating}
                >
                  Cancel
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Help Section */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Need Help?</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 text-sm text-muted-foreground">
              <p>
                <strong>Where to find your license key:</strong>
              </p>
              <ul className="list-disc list-inside space-y-1 ml-2">
                <li>Check your email inbox for the purchase confirmation</li>
                <li>Look for an email from contact@ermits.com</li>
                <li>License keys are also shown on the purchase success page</li>
              </ul>
              <p className="mt-4">
                <strong>Having trouble?</strong> Contact support at{' '}
                <a href="mailto:contact@ermits.com" className="text-primary hover:underline">
                  contact@ermits.com
                </a>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ActivateLicense;

