import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { 
  ArrowLeft,
  Download,
  ShoppingCart,
  CheckCircle,
  Star,
  Building,
  Shield,
  FileText,
  Package,
  DollarSign,
  X,
  Info
} from 'lucide-react';
import { toast } from '../../components/ui/Toaster';
import { 
  monetization, 
  PREMIUM_TEMPLATES, 
  TEMPLATE_BUNDLES,
  TemplateCategory,
  PremiumTemplate 
} from '../../utils/monetization';

const TemplateStore = () => {
  const [selectedCategory, setSelectedCategory] = useState<TemplateCategory | 'all' | 'bundles'>('all');
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const [showPurchaseModal, setShowPurchaseModal] = useState(false);

  const subscriptionTier = monetization.getSubscriptionTier();
  const purchasedTemplates = monetization.getPurchasedTemplates();

  const getTemplates = () => {
    if (selectedCategory === 'all') {
      return PREMIUM_TEMPLATES;
    }
    if (selectedCategory === 'bundles') {
      return [];
    }
    return PREMIUM_TEMPLATES.filter(t => t.category === selectedCategory);
  };

  const isTemplateIncluded = (template: PremiumTemplate) => {
    return template.includedInTiers.includes(subscriptionTier);
  };

  const isTemplatePurchased = (templateId: string) => {
    return purchasedTemplates.some(p => p.templateId === templateId && p.status === 'active');
  };

  const handlePurchase = (templateId: string) => {
    const result = monetization.purchaseTemplate(templateId);
    if (result.success) {
      toast.success('Purchase successful', result.message);
      setShowPurchaseModal(false);
      setSelectedTemplate(null);
    } else {
      toast.error('Purchase failed', result.message);
    }
  };

  const handleBundlePurchase = (bundleId: string) => {
    const result = monetization.purchaseTemplateBundle(bundleId);
    if (result.success) {
      toast.success('Bundle purchased', result.message);
    } else {
      toast.error('Purchase failed', result.message);
    }
  };

  const categories: Array<{ id: TemplateCategory | 'all' | 'bundles'; label: string; icon: any }> = [
    { id: 'all', label: 'All Templates', icon: FileText },
    { id: 'premium', label: 'Premium', icon: Star },
    { id: 'industry', label: 'Industry-Specific', icon: Building },
    { id: 'bundles', label: 'Bundles', icon: Package }
  ];

  return (
    <div className="py-8">
      <div className="mb-6">
        <Link to="/toolkit" className="inline-flex items-center text-muted-foreground hover:text-foreground mb-4">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Toolkit
        </Link>
        <h1 className="text-3xl font-bold mb-2 text-foreground">Template Store</h1>
        <p className="text-muted-foreground">
          Purchase premium compliance templates and documentation packs
        </p>
      </div>

      {/* Subscription Info */}
      <Card className="mb-6 bg-primary/5 border-primary/20">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Current Plan</p>
              <p className="text-lg font-semibold capitalize">{subscriptionTier}</p>
            </div>
            <Link to="/pricing">
              <Button variant="outline" size="sm">
                Upgrade Plan
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>

      {/* Category Filter */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
        {categories.map(category => {
          const Icon = category.icon;
          return (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`flex items-center px-4 py-2 rounded-lg border transition-colors whitespace-nowrap ${
                selectedCategory === category.id
                  ? 'border-primary bg-primary/10 text-primary'
                  : 'border-border bg-background text-muted-foreground hover:text-foreground'
              }`}
            >
              <Icon className="h-4 w-4 mr-2" />
              {category.label}
            </button>
          );
        })}
      </div>

      {/* Bundles Section */}
      {selectedCategory === 'bundles' && (
        <div className="space-y-6 mb-8">
          <h2 className="text-2xl font-bold">Template Bundles</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {TEMPLATE_BUNDLES.map(bundle => (
              <Card key={bundle.id} className="relative">
                {bundle.savings > 0 && (
                  <div className="absolute top-4 right-4 bg-success text-success-foreground text-xs font-semibold px-2 py-1 rounded">
                    Save ${bundle.savings}
                  </div>
                )}
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Package className="h-5 w-5 mr-2 text-primary" />
                    {bundle.name}
                  </CardTitle>
                  <CardDescription>{bundle.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="mb-4">
                    <p className="text-2xl font-bold">${bundle.price}</p>
                    <p className="text-sm text-muted-foreground">
                      {bundle.templates.length} templates included
                    </p>
                  </div>
                  <ul className="space-y-2 mb-4 text-sm">
                    {bundle.templates.map(templateId => {
                      const template = PREMIUM_TEMPLATES.find(t => t.id === templateId);
                      return template ? (
                        <li key={templateId} className="flex items-center">
                          <CheckCircle className="h-4 w-4 text-success mr-2" />
                          {template.name}
                        </li>
                      ) : null;
                    })}
                  </ul>
                  <Button 
                    className="w-full"
                    onClick={() => handleBundlePurchase(bundle.id)}
                  >
                    <ShoppingCart className="h-4 w-4 mr-2" />
                    Purchase Bundle
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Templates Grid */}
      {selectedCategory !== 'bundles' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {getTemplates().map(template => {
            const included = isTemplateIncluded(template);
            const purchased = isTemplatePurchased(template.id);
            const canAccess = included || purchased;

            return (
              <Card key={template.id} className="relative">
                {included && (
                  <div className="absolute top-4 right-4 bg-primary text-primary-foreground text-xs font-semibold px-2 py-1 rounded">
                    Included
                  </div>
                )}
                {purchased && !included && (
                  <div className="absolute top-4 right-4 bg-success text-success-foreground text-xs font-semibold px-2 py-1 rounded">
                    Purchased
                  </div>
                )}
                {template.industry && (
                  <div className="absolute top-4 left-4 bg-muted text-muted-foreground text-xs font-semibold px-2 py-1 rounded">
                    {template.industry}
                  </div>
                )}
                
                <CardHeader>
                  <CardTitle className="flex items-center">
                    {template.category === 'industry' ? (
                      <Building className="h-5 w-5 mr-2 text-primary" />
                    ) : (
                      <Shield className="h-5 w-5 mr-2 text-primary" />
                    )}
                    {template.name}
                  </CardTitle>
                  <CardDescription>{template.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="mb-4">
                    <p className="text-2xl font-bold">${template.price}</p>
                    {included && (
                      <p className="text-sm text-success">Included in your {subscriptionTier} plan</p>
                    )}
                  </div>
                  
                  <ul className="space-y-1 mb-4 text-sm">
                    {template.features.slice(0, 3).map((feature, idx) => (
                      <li key={idx} className="flex items-center text-muted-foreground">
                        <CheckCircle className="h-3 w-3 text-primary mr-2" />
                        {feature}
                      </li>
                    ))}
                  </ul>

                  <div className="flex gap-2">
                    {canAccess ? (
                      <Button variant="outline" className="flex-1" disabled>
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Available
                      </Button>
                    ) : (
                      <Button 
                        className="flex-1"
                        onClick={() => {
                          setSelectedTemplate(template.id);
                          setShowPurchaseModal(true);
                        }}
                      >
                        <ShoppingCart className="h-4 w-4 mr-2" />
                        Purchase
                      </Button>
                    )}
                    <Button 
                      variant="outline"
                      onClick={() => {
                        setSelectedTemplate(template.id);
                        setShowPurchaseModal(true);
                      }}
                    >
                      <Info className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* Purchase Modal */}
      {showPurchaseModal && selectedTemplate && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Purchase Template</span>
                <Button variant="ghost" size="icon" onClick={() => setShowPurchaseModal(false)}>
                  <X className="h-4 w-4" />
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {(() => {
                const template = PREMIUM_TEMPLATES.find(t => t.id === selectedTemplate);
                if (!template) return null;

                const included = isTemplateIncluded(template);
                const purchased = isTemplatePurchased(template.id);

                if (included) {
                  return (
                    <div className="text-center py-4">
                      <CheckCircle className="h-12 w-12 text-success mx-auto mb-4" />
                      <p className="font-semibold mb-2">Template Included</p>
                      <p className="text-sm text-muted-foreground mb-4">
                        This template is already included in your {subscriptionTier} subscription.
                      </p>
                      <Button onClick={() => setShowPurchaseModal(false)}>
                        Close
                      </Button>
                    </div>
                  );
                }

                if (purchased) {
                  return (
                    <div className="text-center py-4">
                      <CheckCircle className="h-12 w-12 text-success mx-auto mb-4" />
                      <p className="font-semibold mb-2">Already Purchased</p>
                      <p className="text-sm text-muted-foreground mb-4">
                        You already own this template.
                      </p>
                      <Button onClick={() => setShowPurchaseModal(false)}>
                        Close
                      </Button>
                    </div>
                  );
                }

                return (
                  <div>
                    <div className="mb-4">
                      <h3 className="font-semibold mb-2">{template.name}</h3>
                      <p className="text-sm text-muted-foreground mb-4">{template.description}</p>
                      <div className="bg-muted p-4 rounded-lg mb-4">
                        <div className="flex justify-between items-center mb-2">
                          <span>Price:</span>
                          <span className="text-2xl font-bold">${template.price}</span>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          One-time purchase • Lifetime access
                        </p>
                      </div>
                    </div>
                    <div className="space-y-2 mb-4">
                      <h4 className="font-medium text-sm">Features:</h4>
                      <ul className="space-y-1 text-sm">
                        {template.features.map((feature, idx) => (
                          <li key={idx} className="flex items-center">
                            <CheckCircle className="h-3 w-3 text-primary mr-2" />
                            {feature}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="flex gap-2">
                      <Button 
                        variant="outline" 
                        className="flex-1"
                        onClick={() => setShowPurchaseModal(false)}
                      >
                        Cancel
                      </Button>
                      <Button 
                        className="flex-1"
                        onClick={() => handlePurchase(template.id)}
                      >
                        <DollarSign className="h-4 w-4 mr-2" />
                        Purchase ${template.price}
                      </Button>
                    </div>
                    <p className="text-xs text-muted-foreground mt-4 text-center">
                      Payment will be processed securely. In production, this would integrate with Stripe.
                    </p>
                  </div>
                );
              })()}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default TemplateStore;

