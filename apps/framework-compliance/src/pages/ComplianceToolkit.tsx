import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  CheckCircle, FileText, Download,
  Shield, FileCheck, Layers, Target, ArrowRight
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { ProductCatalog } from '../utils/monetization/oneTimeProducts';
import LandingLayout from '../components/layout/LandingLayout';

const ComplianceToolkit: React.FC = () => {
  const navigate = useNavigate();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [loading, setLoading] = useState(false);
  const product = ProductCatalog.getProduct('compliance-toolkit');

  const handlePurchase = () => {
    // Navigate to checkout with the product in cart
    navigate('/checkout', { 
      state: { 
        cart: ['compliance-toolkit'],
        productId: 'compliance-toolkit'
      } 
    });
  };

  const frameworks = [
    { name: 'NIST CSF', icon: Shield },
    { name: 'ISO 27001', icon: FileCheck },
    { name: 'SOC 2', icon: Layers },
    { name: 'HIPAA', icon: FileText },
    { name: 'GDPR', icon: Shield },
    { name: 'CMMC', icon: Target },
    { name: 'PCI-DSS', icon: FileCheck }
  ];

  const toolkitContents = [
    {
      category: 'Gap Analysis Templates',
      items: [
        'Multi-framework gap analysis worksheets',
        'Control mapping matrices',
        'Maturity assessment templates',
        'Risk-based prioritization frameworks'
      ]
    },
    {
      category: 'Evidence Collection',
      items: [
        'Evidence collection checklists by framework',
        'Documentation templates',
        'Evidence repository organization guides',
        'Audit trail templates'
      ]
    },
    {
      category: 'Audit Preparation',
      items: [
        'Pre-audit readiness checklists',
        'Auditor interview preparation guides',
        'Evidence validation workflows',
        'Remediation tracking templates'
      ]
    },
    {
      category: 'Compliance Programs',
      items: [
        'Compliance program charter templates',
        'Continuous monitoring frameworks',
        'Control testing procedures',
        'Compliance reporting templates'
      ]
    },
    {
      category: 'Platform Integration',
      items: [
        'CyberCorrect setup guides',
        'Workflow configuration templates',
        'Automation setup instructions',
        'Dashboard customization guides'
      ]
    }
  ];

  return (
    <LandingLayout toggleDarkMode={() => {}} darkMode={false}>
      <div className="min-h-screen bg-background py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="pt-8 mb-12 text-center"
          >
            <div className="inline-block px-4 py-2 bg-green-100 dark:bg-green-900/30 rounded-full mb-6">
              <span className="text-green-700 dark:text-green-400 font-semibold flex items-center gap-2 justify-center">
                <FileText size={18} />
                Template Package
              </span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-6 text-foreground dark:text-white">
              Compliance Framework Templates
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-4">
              Downloadable compliance templates for NIST, ISO 27001, SOC 2, HIPAA, GDPR, CMMC, and PCI-DSS frameworks
            </p>
            <p className="text-md text-muted-foreground max-w-2xl mx-auto mb-8">
              4 comprehensive template files • Customize for your needs • Works offline • One-time purchase
            </p>
            <div className="flex flex-col items-center gap-4 mb-8">
              <div className="flex items-center gap-4">
                <div className="text-4xl font-bold text-foreground dark:text-white">${product?.price || 199}</div>
                <div className="text-muted-foreground">One-time purchase</div>
              </div>
              <div className="flex gap-3">
                <Button
                  onClick={handlePurchase}
                  disabled={loading}
                  size="lg"
                >
                  {loading ? (
                    <>
                      <Download className="mr-2 animate-spin" size={20} />
                      Processing...
                    </>
                  ) : (
                    <>
                      <Download size={20} className="mr-2" />
                      Purchase Templates - ${product?.price || 199}
                      <ArrowRight className="ml-2" size={18} />
                    </>
                  )}
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  onClick={() => navigate('/store')}
                >
                  View All Products
                </Button>
              </div>
            </div>
          </motion.div>

          {/* Supported Frameworks */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mb-12"
          >
            <h2 className="text-2xl font-bold text-center mb-6 text-foreground dark:text-white">
              Supported Compliance Frameworks
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
              {frameworks.map((framework, index) => {
                const Icon = framework.icon;
                return (
                  <Card key={index} className="text-center">
                    <CardContent className="p-4">
                      <div className="text-primary dark:text-primary-foreground mb-2 flex justify-center">
                        <Icon size={24} />
                      </div>
                      <div className="text-sm font-semibold text-foreground dark:text-white">{framework.name}</div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </motion.div>

          {/* Toolkit Contents */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mb-12"
          >
            <h2 className="text-2xl font-bold text-center mb-8 text-foreground dark:text-white">
              What's Included
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {toolkitContents.map((section, index) => (
                <Card key={index} className="h-full">
                  <CardHeader>
                    <CardTitle>{section.category}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {section.items.map((item, itemIndex) => (
                        <li key={itemIndex} className="flex items-start text-sm">
                          <CheckCircle size={16} className="text-green-500 mt-0.5 mr-2 flex-shrink-0" />
                          <span className="text-muted-foreground">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              ))}
            </div>
          </motion.div>

          {/* Key Benefits */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mb-12"
          >
            <Card className="bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20">
              <CardContent className="p-6">
                <h2 className="text-2xl font-bold mb-6 text-foreground dark:text-white">Key Benefits</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {[
                    'Save 50+ hours of template creation time',
                    'Ensure consistency across all frameworks',
                    'Accelerate audit preparation by 60%',
                    'Integrate seamlessly with CyberCorrect platform',
                    'Maintain compliance with automated workflows',
                    'Reduce audit findings with comprehensive checklists'
                  ].map((benefit, index) => (
                    <div key={index} className="flex items-start">
                      <CheckCircle size={20} className="text-green-500 mt-0.5 mr-3 flex-shrink-0" />
                      <span className="text-foreground dark:text-gray-200 font-medium">{benefit}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* CTA Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="text-center mb-12"
          >
            <Card className="max-w-2xl mx-auto">
              <CardContent className="p-8">
                <h2 className="text-3xl font-bold mb-4 text-foreground dark:text-white">
                  Ready to Streamline Your Compliance?
                </h2>
                <p className="text-lg text-muted-foreground mb-8">
                  Get instant access to all compliance templates and start preparing for your next audit today
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                  <Button
                    onClick={handlePurchase}
                    disabled={loading}
                    size="lg"
                    className="transform hover:scale-105 transition-transform"
                  >
                    {loading ? (
                      <>
                        <Download className="mr-2 animate-spin" size={20} />
                        Processing...
                      </>
                    ) : (
                      <>
                        Purchase Templates - ${product?.price || 199}
                        <ArrowRight className="ml-2" size={18} />
                      </>
                    )}
                  </Button>
                </div>
                <p className="text-sm text-muted-foreground mt-4">
                  Instant digital download • Lifetime access • Free updates
                </p>
              </CardContent>
            </Card>
          </motion.div>

          {/* Back Link */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="text-center"
          >
            <Button
              variant="ghost"
              onClick={() => navigate('/store')}
              className="text-primary hover:text-primary/80"
            >
              ← Back to Store
            </Button>
          </motion.div>
        </div>
      </div>
    </LandingLayout>
  );
};

export default ComplianceToolkit;


