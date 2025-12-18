/**
 * Professional Services Page for CyberCorrect
 * Privacy compliance consulting and services
 */

import React from 'react';
import { Check, Lock, FileText, Users, Shield, ArrowRight, Clock } from 'lucide-react';

const ProfessionalServices: React.FC = () => {
  const services = [
    {
      id: 'privacy-assessment',
      name: 'Privacy Compliance Assessment',
      price: 2500,
      duration: '3-4 weeks',
      description: 'Comprehensive multi-framework privacy compliance assessment',
      features: [
        'GDPR, CCPA, PIPEDA gap analysis',
        'Privacy impact assessment',
        'Compliance roadmap development',
        'Risk scoring and prioritization',
        'Documentation review',
        'Executive summary report',
      ],
      icon: <Shield className="w-6 h-6" />,
      color: 'blue',
      popular: true,
    },
    {
      id: 'dpia-service',
      name: 'DPIA Generation Service',
      price: 1500,
      duration: '2-3 weeks',
      description: 'Complete Data Protection Impact Assessment creation',
      features: [
        'Full DPIA documentation',
        'Risk assessment and scoring',
        'Mitigation planning',
        'Stakeholder consultation',
        'Regulatory compliance review',
        'Final DPIA document delivery',
      ],
      icon: <FileText className="w-6 h-6" />,
      color: 'green',
      popular: false,
    },
    {
      id: 'privacy-rights',
      name: 'Privacy Rights Implementation',
      price: 3500,
      duration: '4-6 weeks',
      description: 'Complete implementation of data subject rights workflows',
      features: [
        'Data subject rights workflow setup',
        'Request handling process design',
        'Automation configuration',
        'Team training and documentation',
        'Testing and validation',
        '30 days of support',
      ],
      icon: <Users className="w-6 h-6" />,
      color: 'purple',
      popular: false,
    },
    {
      id: 'ongoing-advisory',
      name: 'Ongoing Privacy Advisory',
      price: 1500,
      duration: 'Monthly',
      description: 'Monthly privacy compliance advisory and support',
      features: [
        'Monthly compliance reviews',
        'Regulatory change monitoring',
        'Privacy policy updates',
        'DPO support and guidance',
        'Quarterly executive briefings',
        'Priority support access',
      ],
      icon: <Lock className="w-6 h-6" />,
      color: 'orange',
      popular: false,
    },
  ];

  const handleContactSales = (serviceId: string) => {
    const service = services.find(s => s.id === serviceId);
    const subject = encodeURIComponent(`Professional Services Inquiry: ${service?.name}`);
    const body = encodeURIComponent(`I'm interested in learning more about the ${service?.name} service.`);
    window.location.href = `mailto:sales@ermits.com?subject=${subject}&body=${body}`;
  };

  const getColorClasses = (color: string) => {
    const colors: Record<string, { bg: string; border: string; text: string; button: string }> = {
      blue: {
        bg: 'bg-blue-50 dark:bg-blue-900/20',
        border: 'border-blue-200 dark:border-blue-800',
        text: 'text-blue-600 dark:text-blue-400',
        button: 'bg-blue-600 hover:bg-blue-700',
      },
      green: {
        bg: 'bg-green-50 dark:bg-green-900/20',
        border: 'border-green-200 dark:border-green-800',
        text: 'text-green-600 dark:text-green-400',
        button: 'bg-green-600 hover:bg-green-700',
      },
      purple: {
        bg: 'bg-purple-50 dark:bg-purple-900/20',
        border: 'border-purple-200 dark:border-purple-800',
        text: 'text-purple-600 dark:text-purple-400',
        button: 'bg-purple-600 hover:bg-purple-700',
      },
      orange: {
        bg: 'bg-orange-50 dark:bg-orange-900/20',
        border: 'border-orange-200 dark:border-orange-800',
        text: 'text-orange-600 dark:text-orange-400',
        button: 'bg-orange-600 hover:bg-orange-700',
      },
    };
    return colors[color] || colors.blue;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-950 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 dark:bg-blue-900 rounded-full mb-4">
            <Lock className="w-8 h-8 text-blue-600 dark:text-blue-400" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Privacy Compliance Services
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
            Expert privacy compliance consulting to help you achieve and maintain GDPR, CCPA, and other regulatory compliance.
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          {services.map((service) => {
            const colors = getColorClasses(service.color);
            return (
              <div
                key={service.id}
                className={`bg-white dark:bg-gray-800 rounded-lg shadow-lg border-2 ${
                  service.popular ? 'border-blue-500 dark:border-blue-600' : 'border-gray-200 dark:border-gray-700'
                } p-8 relative`}
              >
                {service.popular && (
                  <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                    <span className="bg-blue-500 text-white px-4 py-1 rounded-full text-sm font-medium">
                      Most Popular
                    </span>
                  </div>
                )}
                <div className={`inline-flex items-center justify-center w-12 h-12 ${colors.bg} rounded-lg mb-4`}>
                  <div className={colors.text}>
                    {service.icon}
                  </div>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                  {service.name}
                </h3>
                <div className="flex items-center gap-4 mb-4">
                  <div className="text-3xl font-bold text-gray-900 dark:text-white">
                    ${service.price.toLocaleString()}
                  </div>
                  <div className="flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400">
                    <Clock className="w-4 h-4" />
                    <span>{service.duration}</span>
                  </div>
                </div>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  {service.description}
                </p>
                <ul className="space-y-3 mb-8">
                  {service.features.map((feature, index) => (
                    <li key={index} className="flex items-start">
                      <Check className="w-5 h-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>
                <button
                  onClick={() => handleContactSales(service.id)}
                  className={`w-full py-3 px-4 ${colors.button} text-white rounded-lg font-medium transition-colors flex items-center justify-center gap-2`}
                >
                  Contact Sales
                  <ArrowRight className="w-5 h-5" />
                </button>
              </div>
            );
          })}
        </div>

        {/* Additional Info */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 mb-12">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Why Choose Our Privacy Services?
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <Shield className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                <h3 className="font-semibold text-gray-900 dark:text-white">
                  Expert Team
                </h3>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Certified privacy professionals with deep GDPR, CCPA, and regulatory expertise.
              </p>
            </div>
            <div>
              <div className="flex items-center gap-3 mb-2">
                <FileText className="w-6 h-6 text-green-600 dark:text-green-400" />
                <h3 className="font-semibold text-gray-900 dark:text-white">
                  Comprehensive Approach
                </h3>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Multi-framework compliance with actionable roadmaps and documentation.
              </p>
            </div>
            <div>
              <div className="flex items-center gap-3 mb-2">
                <Users className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                <h3 className="font-semibold text-gray-900 dark:text-white">
                  Ongoing Support
                </h3>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Continuous monitoring and support to maintain compliance as regulations evolve.
              </p>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center">
          <p className="text-lg text-gray-600 dark:text-gray-400 mb-4">
            Need a custom privacy compliance solution? Let's discuss your requirements.
          </p>
          <button
            onClick={() => window.location.href = 'mailto:sales@ermits.com?subject=Custom Privacy Services Inquiry'}
            className="inline-flex items-center gap-2 px-6 py-3 bg-gray-900 dark:bg-gray-700 text-white rounded-lg font-medium hover:bg-gray-800 dark:hover:bg-gray-600 transition-colors"
          >
            Contact Sales Team
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfessionalServices;


