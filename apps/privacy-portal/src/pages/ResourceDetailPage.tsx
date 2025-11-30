import { useParams, Link } from 'react-router-dom';
import { Breadcrumb } from '../components/ui/Breadcrumb';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { 
  Download, 
  FileText, 
  Shield, 
  CheckCircle, 
  Clock,
  ExternalLink,
  BookOpen,
  FileCheck
} from 'lucide-react';

export function ResourceDetailPage() {
  const { slug } = useParams();

  // Define comprehensive resource content
  const resources = {
    'privacy-regulations': {
      title: 'Privacy Regulations Guide',
      description: 'Comprehensive guide to workplace privacy regulations including ADA, EEOC, CCPA, and GDPR compliance requirements.',
      type: 'Guide',
      category: 'Compliance',
      icon: Shield,
      content: `
        <h3>Workplace Privacy Regulations Overview</h3>
        <p>This comprehensive guide covers the key privacy regulations that apply to workplace data protection:</p>
        
        <h4>Americans with Disabilities Act (ADA)</h4>
        <ul>
          <li>Medical information confidentiality requirements</li>
          <li>Reasonable accommodation data protection</li>
          <li>Employee health information safeguards</li>
          <li>Disability-related inquiry restrictions</li>
        </ul>
        
        <h4>Equal Employment Opportunity Commission (EEOC)</h4>
        <ul>
          <li>Protected characteristic data handling</li>
          <li>Discrimination prevention through data practices</li>
          <li>EEOC investigation data requirements</li>
          <li>Workplace harassment data protection</li>
        </ul>
        
        <h4>California Consumer Privacy Act (CCPA/CPRA)</h4>
        <ul>
          <li>Employee data rights and disclosures</li>
          <li>Data collection limitation requirements</li>
          <li>Employee consent management</li>
          <li>Data deletion and correction rights</li>
        </ul>
        
        <h4>General Data Protection Regulation (GDPR)</h4>
        <ul>
          <li>Lawful basis for processing employee data</li>
          <li>Data minimization principles</li>
          <li>Employee consent and legitimate interests</li>
          <li>Cross-border data transfer requirements</li>
        </ul>
      `,
      downloadUrl: '/downloads/privacy-regulations-guide.pdf',
      lastUpdated: '2025-01-15',
      tags: ['ADA', 'EEOC', 'CCPA', 'GDPR', 'Compliance']
    },
    'tools-templates': {
      title: 'Privacy Tools & Templates',
      description: 'Essential templates and tools for privacy compliance including assessment checklists, consent forms, and documentation templates.',
      type: 'Template Collection',
      category: 'Tools',
      icon: FileText,
      content: `
        <h3>Privacy Compliance Tools & Templates</h3>
        <p>Download ready-to-use templates and tools to streamline your privacy compliance efforts:</p>
        
        <h4>Assessment Templates</h4>
        <ul>
          <li><strong>Vendor Assessment Checklist</strong> - Comprehensive vendor privacy evaluation form</li>
          <li><strong>Data Inventory Template</strong> - Systematic data asset mapping worksheet</li>
          <li><strong>Privacy Impact Assessment</strong> - DPIA template for new data processing activities</li>
          <li><strong>Incident Response Checklist</strong> - Step-by-step privacy incident handling guide</li>
        </ul>
        
        <h4>Consent & Documentation Forms</h4>
        <ul>
          <li><strong>Employee Consent Forms</strong> - GDPR/CCPA compliant consent collection</li>
          <li><strong>Data Processing Agreement</strong> - Vendor contract template</li>
          <li><strong>Privacy Notice Template</strong> - Employee-facing privacy policy</li>
          <li><strong>Data Retention Schedule</strong> - Systematic data lifecycle management</li>
        </ul>
        
        <h4>Training Materials</h4>
        <ul>
          <li><strong>Privacy Training Slides</strong> - Employee education presentation</li>
          <li><strong>Compliance Quiz Template</strong> - Knowledge assessment tool</li>
          <li><strong>Policy Acknowledgment Form</strong> - Employee policy acceptance tracking</li>
        </ul>
      `,
      downloadUrl: '/downloads/privacy-tools-templates.zip',
      lastUpdated: '2025-01-15',
      tags: ['Templates', 'Checklists', 'Forms', 'Training']
    },
    'privacy-policy-template': {
      title: 'Privacy Policy Template',
      description: 'Comprehensive privacy policy template tailored for workplace data protection and employee privacy rights.',
      type: 'Template',
      category: 'Legal',
      icon: FileCheck,
      content: `
        <h3>Workplace Privacy Policy Template</h3>
        <p>A comprehensive privacy policy template designed specifically for workplace data protection:</p>
        
        <h4>Key Sections Included</h4>
        <ul>
          <li><strong>Data Collection</strong> - What employee data we collect and why</li>
          <li><strong>Legal Basis</strong> - Lawful grounds for processing employee information</li>
          <li><strong>Data Usage</strong> - How employee data is used and shared</li>
          <li><strong>Data Rights</strong> - Employee rights under applicable privacy laws</li>
          <li><strong>Data Security</strong> - Technical and organizational security measures</li>
          <li><strong>Data Retention</strong> - How long we keep employee data</li>
          <li><strong>Contact Information</strong> - How to exercise privacy rights</li>
        </ul>
        
        <h4>Compliance Features</h4>
        <ul>
          <li>ADA-compliant medical information handling</li>
          <li>EEOC-aligned protected characteristic protection</li>
          <li>CCPA/CPRA employee data rights</li>
          <li>GDPR lawful basis documentation</li>
          <li>State privacy law considerations</li>
        </ul>
        
        <h4>Customization Guide</h4>
        <p>This template includes detailed instructions for customizing the policy to your organization's specific needs, including industry-specific requirements and state law variations.</p>
      `,
      downloadUrl: '/downloads/privacy-policy-template.docx',
      lastUpdated: '2025-01-15',
      tags: ['Policy', 'Legal', 'Template', 'Compliance']
    },
    'ada-guide': {
      title: 'ADA Compliance Guide',
      description: 'Detailed guide to Americans with Disabilities Act compliance for workplace privacy and accommodation data protection.',
      type: 'Guide',
      category: 'Compliance',
      icon: Shield,
      content: `
        <h3>ADA Workplace Privacy Compliance Guide</h3>
        <p>Comprehensive guidance on protecting employee privacy rights under the Americans with Disabilities Act:</p>
        
        <h4>Medical Information Protection</h4>
        <ul>
          <li><strong>Confidentiality Requirements</strong> - Strict limits on medical information disclosure</li>
          <li><strong>Storage Requirements</strong> - Separate storage of medical files from personnel records</li>
          <li><strong>Access Controls</strong> - Limited access to medical information on need-to-know basis</li>
          <li><strong>Disclosure Restrictions</strong> - Prohibited and permitted disclosures</li>
        </ul>
        
        <h4>Reasonable Accommodation Process</h4>
        <ul>
          <li><strong>Interactive Process</strong> - Collaborative accommodation discussions</li>
          <li><strong>Documentation Requirements</strong> - What to document and what to avoid</li>
          <li><strong>Medical Verification</strong> - When and how to request medical documentation</li>
          <li><strong>Privacy Protections</strong> - Maintaining confidentiality during accommodation process</li>
        </ul>
        
        <h4>Common Compliance Pitfalls</h4>
        <ul>
          <li>Inadvertent medical information disclosure</li>
          <li>Improper medical file storage</li>
          <li>Excessive medical documentation requests</li>
          <li>Failure to maintain confidentiality during accommodation process</li>
        </ul>
        
        <h4>Best Practices</h4>
        <ul>
          <li>Implement strict medical information handling procedures</li>
          <li>Train all staff on ADA confidentiality requirements</li>
          <li>Regular audit of medical information practices</li>
          <li>Document accommodation processes without revealing medical details</li>
        </ul>
      `,
      downloadUrl: '/downloads/ada-compliance-guide.pdf',
      lastUpdated: '2025-01-15',
      tags: ['ADA', 'Medical', 'Accommodation', 'Compliance']
    },
    'training-tracker': {
      title: 'Training Tracking Template',
      description: 'Comprehensive template for tracking employee privacy training completion and compliance documentation.',
      type: 'Template',
      category: 'Training',
      icon: BookOpen,
      content: `
        <h3>Privacy Training Tracking Template</h3>
        <p>Systematic approach to tracking employee privacy training completion and maintaining compliance records:</p>
        
        <h4>Tracking Features</h4>
        <ul>
          <li><strong>Employee Information</strong> - Name, department, role, hire date</li>
          <li><strong>Training Modules</strong> - Required and optional training courses</li>
          <li><strong>Completion Status</strong> - Completed, in-progress, overdue, exempt</li>
          <li><strong>Certification Tracking</strong> - Training certificates and expiration dates</li>
          <li><strong>Assessment Scores</strong> - Knowledge test results and retake requirements</li>
        </ul>
        
        <h4>Compliance Reporting</h4>
        <ul>
          <li><strong>Department Summaries</strong> - Training completion by department</li>
          <li><strong>Overdue Reports</strong> - Employees with incomplete required training</li>
          <li><strong>Certification Status</strong> - Expired or expiring certifications</li>
          <li><strong>Audit Trail</strong> - Complete training history for compliance audits</li>
        </ul>
        
        <h4>Automation Features</h4>
        <ul>
          <li>Automatic reminder notifications for overdue training</li>
          <li>Integration with HR systems for employee data</li>
          <li>Automated compliance reporting</li>
          <li>Customizable training requirements by role</li>
        </ul>
        
        <h4>Regulatory Compliance</h4>
        <p>This template helps ensure compliance with various privacy training requirements under ADA, EEOC, CCPA, and GDPR regulations.</p>
      `,
      downloadUrl: '/downloads/training-tracker-template.xlsx',
      lastUpdated: '2025-01-15',
      tags: ['Training', 'Tracking', 'Compliance', 'HR']
    },
    'documentation-guide': {
      title: 'Compliance Documentation Guide',
      description: 'Step-by-step guide for creating and maintaining comprehensive privacy compliance documentation.',
      type: 'Guide',
      category: 'Compliance',
      icon: FileCheck,
      content: `
        <h3>Privacy Compliance Documentation Guide</h3>
        <p>Comprehensive guide to creating and maintaining effective privacy compliance documentation:</p>
        
        <h4>Essential Documentation Types</h4>
        <ul>
          <li><strong>Privacy Policies</strong> - Employee-facing privacy notices and policies</li>
          <li><strong>Data Processing Records</strong> - Documentation of data processing activities</li>
          <li><strong>Consent Records</strong> - Employee consent collection and management</li>
          <li><strong>Incident Reports</strong> - Privacy incident documentation and response</li>
          <li><strong>Assessment Reports</strong> - Privacy impact assessments and vendor evaluations</li>
        </ul>
        
        <h4>Documentation Standards</h4>
        <ul>
          <li><strong>Version Control</strong> - Systematic versioning and change tracking</li>
          <li><strong>Review Cycles</strong> - Regular review and update schedules</li>
          <li><strong>Approval Process</strong> - Legal and compliance review requirements</li>
          <li><strong>Distribution Control</strong> - Controlled access and distribution</li>
        </ul>
        
        <h4>Regulatory Requirements</h4>
        <ul>
          <li><strong>GDPR Article 30</strong> - Records of processing activities</li>
          <li><strong>CCPA Documentation</strong> - Consumer rights request handling</li>
          <li><strong>ADA Medical Records</strong> - Confidentiality documentation</li>
          <li><strong>EEOC Compliance</strong> - Discrimination prevention records</li>
        </ul>
        
        <h4>Best Practices</h4>
        <ul>
          <li>Use clear, accessible language</li>
          <li>Regular updates for regulatory changes</li>
          <li>Employee training on documentation</li>
          <li>Audit trail maintenance</li>
        </ul>
      `,
      downloadUrl: '/downloads/documentation-guide.pdf',
      lastUpdated: '2025-01-15',
      tags: ['Documentation', 'Compliance', 'GDPR', 'CCPA']
    }
  };

  const resource = resources[slug as keyof typeof resources];

  if (!resource) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Breadcrumb />
        
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Resource Not Found</h1>
          <p className="text-muted-foreground">
            The requested resource could not be found.
          </p>
        </div>

        <div className="bg-white dark:bg-gray-900 rounded-lg border p-6">
          <h2 className="text-xl font-semibold mb-4">Available Resources</h2>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {Object.entries(resources).map(([key, res]) => (
              <Link key={key} to={`/resources/${key}`} className="block">
                <div className="border rounded-lg p-4 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                  <div className="flex items-center mb-2">
                    <res.icon className="h-5 w-5 mr-2 text-blue-600" />
                    <h3 className="font-medium">{res.title}</h3>
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">{res.description}</p>
                  <Badge variant="secondary" className="text-xs">{res.type}</Badge>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    );
  }

  const IconComponent = resource.icon;

  return (
    <div className="container mx-auto px-4 py-8">
      <Breadcrumb />

      <div className="mb-8">
        <div className="flex items-center mb-4">
          <IconComponent className="h-8 w-8 mr-3 text-blue-600" />
          <div>
            <h1 className="text-3xl font-bold mb-2">{resource.title}</h1>
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <Badge variant="secondary">{resource.type}</Badge>
              <Badge variant="secondary">{resource.category}</Badge>
              <span className="flex items-center">
                <Clock className="h-4 w-4 mr-1" />
                Updated {resource.lastUpdated}
              </span>
            </div>
          </div>
        </div>
        <p className="text-muted-foreground text-lg">
          {resource.description}
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <div className="bg-white dark:bg-gray-900 rounded-lg border p-6 mb-6">
            <h2 className="text-xl font-semibold mb-4">Resource Content</h2>
            <div 
              className="prose prose-sm max-w-none dark:prose-invert"
              dangerouslySetInnerHTML={{ __html: resource.content }}
            />
          </div>

          <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800 p-6">
            <h3 className="font-semibold mb-3 flex items-center">
              <CheckCircle className="h-5 w-5 mr-2 text-blue-600" />
              How to Use This Resource
            </h3>
            <ul className="space-y-2 text-sm">
              <li>• Review the content thoroughly before implementation</li>
              <li>• Customize templates to match your organization's needs</li>
              <li>• Consult with legal counsel for compliance requirements</li>
              <li>• Train relevant staff on proper implementation</li>
              <li>• Regular review and updates as regulations change</li>
            </ul>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white dark:bg-gray-900 rounded-lg border p-6">
            <h3 className="font-semibold mb-4">Download Resource</h3>
            <Button className="w-full mb-4" onClick={() => window.open(resource.downloadUrl, '_blank')}>
              <Download className="h-4 w-4 mr-2" />
              Download {resource.type}
            </Button>
            <p className="text-xs text-muted-foreground">
              Download includes the complete resource with additional templates and examples.
            </p>
          </div>

          <div className="bg-white dark:bg-gray-900 rounded-lg border p-6">
            <h3 className="font-semibold mb-4">Related Resources</h3>
            <div className="space-y-3">
              {Object.entries(resources)
                .filter(([key]) => key !== slug)
                .slice(0, 3)
                .map(([key, res]) => (
                  <Link key={key} to={`/resources/${key}`} className="block">
                    <div className="flex items-center p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                      <res.icon className="h-4 w-4 mr-3 text-gray-600" />
                      <div>
                        <h4 className="font-medium text-sm">{res.title}</h4>
                        <p className="text-xs text-muted-foreground">{res.type}</p>
                      </div>
                    </div>
                  </Link>
                ))}
            </div>
          </div>

          <div className="bg-white dark:bg-gray-900 rounded-lg border p-6">
            <h3 className="font-semibold mb-4">Tags</h3>
            <div className="flex flex-wrap gap-2">
              {resource.tags.map((tag) => (
                <Badge key={tag} variant="secondary" className="text-xs">
                  {tag}
                </Badge>
              ))}
            </div>
          </div>

          <div className="bg-gradient-to-r from-blue-50 to-green-50 dark:from-blue-900/20 dark:to-green-900/20 rounded-lg border p-6">
            <h3 className="font-semibold mb-3">Need Help?</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Our privacy experts are here to help you implement these resources effectively.
            </p>
            <div className="space-y-2">
              <Button variant="secondary" size="sm" className="w-full">
                <Link to="/contact" className="flex items-center">
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Contact Support
                </Link>
              </Button>
              <Button variant="secondary" size="sm" className="w-full">
                <Link to="/training" className="flex items-center">
                  <BookOpen className="h-4 w-4 mr-2" />
                  View Training
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ResourceDetailPage;

