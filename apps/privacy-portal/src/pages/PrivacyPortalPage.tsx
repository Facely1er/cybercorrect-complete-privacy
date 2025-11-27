import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Shield, 
  Users, 
  FileText, 
  Eye, 
  Lock, 
  CheckCircle, 
  ArrowRight,
  Database,
  UserCheck,
  AlertTriangle,
  BarChart3,
  Clock,
  Building
} from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';

export function PrivacyPortalPage() {
  const stakeholderCategories = [
    {
      id: 'administrators',
      title: 'Administrators',
      description: 'Institution-wide privacy management and compliance oversight',
      icon: <Shield className="h-12 w-12 text-blue-600" />,
      responsibilities: [
        'Institutional privacy compliance management',
        'Stakeholder access control and permissions',
        'Privacy policy development and implementation',
        'Compliance reporting and oversight'
      ],
      quickActions: [
        { title: 'Compliance Dashboard', href: '/privacy/dashboard' },
        { title: 'Stakeholder Management', href: '/privacy/stakeholders' },
        { title: 'Privacy Reports', href: '/privacy/reports' }
      ],
      color: 'blue'
    },
    {
      id: 'privacy-officers',
      title: 'Privacy Officers',
      description: 'Data protection and privacy rights management',
      icon: <Lock className="h-12 w-12 text-purple-600" />,
      responsibilities: [
        'Data subject rights request processing',
        'Privacy incident investigation and response',
        'Vendor privacy assessment coordination',
        'Compliance obligation tracking'
      ],
      quickActions: [
        { title: 'Data Rights Portal', href: '/privacy/data-rights' },
        { title: 'Privacy Incidents', href: '/privacy/incidents' },
        { title: 'Vendor Assessments', href: '/privacy/vendors' }
      ],
      color: 'purple'
    },
    {
      id: 'staff',
      title: 'Staff Members',
      description: 'Daily privacy practices and data handling responsibilities',
      icon: <UserCheck className="h-12 w-12 text-green-600" />,
      responsibilities: [
        'Student data protection in daily activities',
        'Privacy incident reporting',
        'Compliance with institutional privacy policies',
        'Consent management for their areas'
      ],
      quickActions: [
        { title: 'My Privacy Duties', href: '/stakeholder-duties' },
        { title: 'Report Incident', href: '/privacy/incidents' },
        { title: 'Consent Records', href: '/privacy/consent' }
      ],
      color: 'green'
    },
    {
      id: 'employees-families',
      title: 'Employees & Families',
      description: 'Exercise privacy rights and manage personal data',
      icon: <Users className="h-12 w-12 text-amber-600" />,
      responsibilities: [
        'Understanding and exercising data privacy rights',
        'Managing consent preferences',
        'Accessing personal employment records',
        'Privacy settings and preferences management'
      ],
      quickActions: [
        { title: 'My Data Rights', href: '/data-rights' },
        { title: 'Access My Records', href: '/privacy/data-rights?type=access' },
        { title: 'Privacy Settings', href: '/settings' }
      ],
      color: 'amber'
    }
  ];

  const keyFeatures = [
    {
      icon: <FileText className="h-8 w-8 text-blue-600" />,
      title: 'Data Rights Management',
      description: 'Submit and track data access, correction, and deletion requests',
      link: '/privacy/data-rights'
    },
    {
      icon: <Shield className="h-8 w-8 text-green-600" />,
      title: 'Privacy Compliance',
      description: 'Monitor compliance obligations and regulatory requirements',
      link: '/privacy/obligations'
    },
    {
      icon: <Users className="h-8 w-8 text-purple-600" />,
      title: 'Stakeholder Management',
      description: 'Manage access rights and permissions for all stakeholders',
      link: '/privacy/stakeholders'
    },
    {
      icon: <Building className="h-8 w-8 text-red-600" />,
      title: 'Vendor Oversight',
      description: 'Assess and monitor third-party data processing compliance',
      link: '/privacy/vendors'
    },
    {
      icon: <AlertTriangle className="h-8 w-8 text-orange-600" />,
      title: 'Incident Response',
      description: 'Report and manage privacy incidents and data breaches',
      link: '/privacy/incidents'
    },
    {
      icon: <BarChart3 className="h-8 w-8 text-indigo-600" />,
      title: 'Analytics & Reports',
      description: 'Generate insights and compliance reports',
      link: '/privacy/analytics'
    }
  ];

  const recentActivity = [
    {
      type: 'data_request',
      title: 'Data Access Request Submitted',
      description: 'Student record access request for Emma Johnson',
      timestamp: '2 hours ago',
      status: 'pending'
    },
    {
      type: 'consent',
      title: 'Consent Updated',
      description: 'Directory information consent withdrawn',
      timestamp: '1 day ago',
      status: 'completed'
    },
    {
      type: 'incident',
      title: 'Privacy Incident Reported',
      description: 'Unauthorized email access incident',
      timestamp: '2 days ago',
      status: 'investigating'
    }
  ];

  return (
    <>
      {/* Hero Section - Reduced Size */}
      <section className="relative py-8 px-6 bg-gradient-to-b from-blue-600 to-blue-700 text-white">
        <div className="max-w-7xl mx-auto text-center">
          <div className="inline-flex items-center justify-center bg-white/10 text-white rounded-full px-3 py-1 mb-4">
            <Database className="h-3 w-3 mr-2" />
            <span className="text-xs font-medium">Self‑Service for Faster Compliance</span>
          </div>

          <h1 className="text-2xl md:text-3xl font-bold tracking-tight mb-3">
            Privacy Action Center
          </h1>

          <p className="text-sm md:text-base text-blue-100 max-w-2xl mx-auto mb-6">
            A comprehensive portal where employees, families, staff, and administrators can understand their privacy duties and exercise data rights under ADA, EEOC, CCPA/CPRA, GDPR, and other applicable regulations
          </p>

          <div className="flex flex-col sm:flex-row justify-center gap-3">
            <Link to="/data-rights">
              <Button size="default" className="font-medium bg-white text-gray-900 hover:bg-gray-100 border border-gray-200 shadow-sm">
                Exercise My Data Rights <Eye className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <Link to="/stakeholder-duties">
              <Button size="default" className="font-medium bg-white text-gray-900 hover:bg-gray-100 border border-gray-200 shadow-sm">
                View My Privacy Duties <UserCheck className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Stakeholder Categories */}
      <section className="py-16 px-6 bg-gray-50 dark:bg-gray-950">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
            Privacy Portal Access by Role
          </h2>
          
          <div className="grid md:grid-cols-2 gap-8">
            {stakeholderCategories.map((category) => (
              <div key={category.id} className="bg-white dark:bg-gray-900 rounded-lg border shadow-sm p-8">
                <div className="flex items-center gap-4 mb-6">
                  <div className={`p-3 bg-${category.color}-100 dark:bg-${category.color}-900/30 rounded-lg`}>
                    {category.icon}
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold">{category.title}</h3>
                    <p className="text-muted-foreground">{category.description}</p>
                  </div>
                </div>
                
                <div className="mb-6">
                  <h4 className="font-medium mb-3">Key Responsibilities</h4>
                  <ul className="space-y-2">
                    {category.responsibilities.map((responsibility, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                        <span className="text-sm text-muted-foreground">{responsibility}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div className="space-y-2">
                  <h4 className="font-medium mb-3">Quick Actions</h4>
                  {category.quickActions.map((action) => (
                    <Link key={action.title} to={action.href} className="block">
                      <Button variant="outline" size="sm" className="w-full justify-start">
                        <ArrowRight className="h-4 w-4 mr-2" />
                        {action.title}
                      </Button>
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Key Features */}
      <section className="py-16 px-6 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
            Privacy Management Features
          </h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {keyFeatures.map((feature, index) => (
              <Link 
                key={index}
                to={feature.link}
                className="group"
                title={`Access ${feature.title}`}
              >
                <div className="bg-gray-50 dark:bg-gray-800 rounded-lg border p-6 h-full transition-all duration-200 hover:shadow-md group-hover:border-primary-300">
                  <div className="mb-4">
                    {feature.icon}
                  </div>
                  <h3 className="font-semibold text-xl mb-2 group-hover:text-primary-700 transition-colors">
                    {feature.title}
                  </h3>
                  <p className="text-muted-foreground">
                    {feature.description}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Recent Activity */}
      <section className="py-16 px-6 bg-gray-50 dark:bg-gray-950">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white dark:bg-gray-900 rounded-lg border p-8">
            <h2 className="text-2xl font-semibold mb-6 flex items-center">
              <Clock className="h-6 w-6 mr-2 text-blue-600" />
              Recent Privacy Activity
            </h2>
            
            <div className="space-y-4">
              {recentActivity.map((activity, index) => (
                <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-4">
                    <div className="flex-shrink-0">
                      {activity.type === 'data_request' ? (
                        <FileText className="h-5 w-5 text-blue-500" />
                      ) : activity.type === 'consent' ? (
                        <Users className="h-5 w-5 text-green-500" />
                      ) : (
                        <AlertTriangle className="h-5 w-5 text-orange-500" />
                      )}
                    </div>
                    <div>
                      <h3 className="font-medium text-sm">{activity.title}</h3>
                      <p className="text-xs text-muted-foreground">{activity.description}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-muted-foreground">{activity.timestamp}</span>
                    <Badge className={
                      activity.status === 'completed' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300' :
                      activity.status === 'pending' ? 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300' :
                      'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300'
                    }>
                      {activity.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="mt-6 text-center">
              <Link to="/privacy/dashboard">
                <Button variant="outline">
                  View Complete Activity Log
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 px-6 bg-primary-600 dark:bg-primary-700 text-white">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Secure Your Privacy Rights Today
          </h2>
          <p className="text-blue-100 text-lg mb-8 max-w-3xl mx-auto">
            Take control of your personal data and ensure your privacy rights are protected with our comprehensive privacy management portal.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link to="/data-rights">
              <Button size="lg" className="font-medium bg-white text-gray-900 hover:bg-gray-100 border border-gray-200 shadow-sm">
                Exercise Data Rights <FileText className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <Link to="/contact">
              <Button size="lg" className="font-medium bg-white text-gray-900 hover:bg-gray-100 border border-gray-200 shadow-sm">
                Get Support
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}