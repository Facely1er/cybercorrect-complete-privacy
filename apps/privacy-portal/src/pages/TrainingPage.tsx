import { useLocation, Link } from 'react-router-dom';
import { Breadcrumb } from '../components/ui/Breadcrumb';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { 
  Play, 
  Clock, 
  Users, 
  Shield, 
  FileText, 
  CheckCircle, 
  AlertTriangle,
  Target,
  ExternalLink,
  Download
} from 'lucide-react';

export function TrainingPage() {
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const topic = params.get('topic');


  // Define comprehensive training modules
  const trainingModules = {
    'policy-updates': {
      title: 'Privacy Policy Updates & Best Practices',
      description: 'Learn how to effectively update and communicate privacy policies to employees while maintaining compliance.',
      duration: '45 minutes',
      difficulty: 'Intermediate',
      category: 'Policy Management',
      icon: FileText,
      objectives: [
        'Understand when and how to update privacy policies',
        'Learn effective communication strategies for policy changes',
        'Master compliance requirements for policy updates',
        'Develop skills for employee training on new policies'
      ],
      content: `
        <h3>Privacy Policy Update Process</h3>
        <p>This comprehensive training module covers the essential steps for updating workplace privacy policies:</p>
        
        <h4>Module 1: Policy Review & Assessment</h4>
        <ul>
          <li><strong>Regulatory Change Monitoring</strong> - How to stay current with privacy law changes</li>
          <li><strong>Policy Gap Analysis</strong> - Identifying areas needing updates</li>
          <li><strong>Stakeholder Input</strong> - Gathering feedback from HR, legal, and employees</li>
          <li><strong>Risk Assessment</strong> - Evaluating compliance risks</li>
        </ul>
        
        <h4>Module 2: Policy Development</h4>
        <ul>
          <li><strong>Legal Requirements</strong> - ADA, EEOC, CCPA, GDPR compliance</li>
          <li><strong>Clear Language</strong> - Writing accessible policy language</li>
          <li><strong>Employee Rights</strong> - Clearly defining data rights and procedures</li>
          <li><strong>Implementation Timeline</strong> - Planning rollout schedules</li>
        </ul>
        
        <h4>Module 3: Communication & Training</h4>
        <ul>
          <li><strong>Change Management</strong> - Strategies for smooth policy transitions</li>
          <li><strong>Employee Education</strong> - Training methods and materials</li>
          <li><strong>Documentation</strong> - Record-keeping requirements</li>
          <li><strong>Feedback Collection</strong> - Gathering employee input and concerns</li>
        </ul>
        
        <h4>Module 4: Implementation & Monitoring</h4>
        <ul>
          <li><strong>Rollout Planning</strong> - Phased implementation strategies</li>
          <li><strong>Compliance Monitoring</strong> - Ongoing policy adherence tracking</li>
          <li><strong>Issue Resolution</strong> - Handling policy violations and questions</li>
          <li><strong>Continuous Improvement</strong> - Regular policy review cycles</li>
        </ul>
      `,
      resources: [
        { title: 'Policy Update Checklist', type: 'Checklist', url: '/resources/policy-update-checklist' },
        { title: 'Employee Communication Templates', type: 'Template', url: '/resources/communication-templates' },
        { title: 'Training Materials', type: 'Guide', url: '/resources/training-materials' }
      ],
      assessment: {
        questions: 15,
        passingScore: 80,
        timeLimit: 20
      }
    },
    'staff-privacy': {
      title: 'Staff Privacy Training Program',
      description: 'Comprehensive privacy training for all staff members covering data protection, rights, and responsibilities.',
      duration: '60 minutes',
      difficulty: 'Beginner',
      category: 'Employee Training',
      icon: Users,
      objectives: [
        'Understand personal privacy rights in the workplace',
        'Learn proper data handling procedures',
        'Recognize privacy violations and reporting procedures',
        'Develop awareness of compliance requirements'
      ],
      content: `
        <h3>Staff Privacy Training Program</h3>
        <p>Essential privacy training for all employees to ensure workplace data protection compliance:</p>
        
        <h4>Module 1: Understanding Privacy Rights</h4>
        <ul>
          <li><strong>Employee Data Rights</strong> - Access, correction, deletion, and portability rights</li>
          <li><strong>Legal Protections</strong> - ADA, EEOC, CCPA, GDPR employee protections</li>
          <li><strong>Consent Management</strong> - Understanding consent requirements and limitations</li>
          <li><strong>Privacy Notices</strong> - How to read and understand privacy policies</li>
        </ul>
        
        <h4>Module 2: Data Handling Best Practices</h4>
        <ul>
          <li><strong>Data Minimization</strong> - Collecting only necessary information</li>
          <li><strong>Secure Storage</strong> - Proper data storage and access controls</li>
          <li><strong>Data Sharing</strong> - When and how data can be shared</li>
          <li><strong>Retention Policies</strong> - Understanding data retention requirements</li>
        </ul>
        
        <h4>Module 3: Recognizing Privacy Violations</h4>
        <ul>
          <li><strong>Common Violations</strong> - Types of privacy breaches and violations</li>
          <li><strong>Warning Signs</strong> - Recognizing potential privacy issues</li>
          <li><strong>Reporting Procedures</strong> - How to report privacy concerns</li>
          <li><strong>Whistleblower Protections</strong> - Legal protections for reporters</li>
        </ul>
        
        <h4>Module 4: Compliance Responsibilities</h4>
        <ul>
          <li><strong>Individual Responsibilities</strong> - Personal compliance obligations</li>
          <li><strong>Departmental Roles</strong> - Privacy duties by department</li>
          <li><strong>Training Requirements</strong> - Ongoing education and certification</li>
          <li><strong>Audit Preparation</strong> - How to prepare for privacy audits</li>
        </ul>
      `,
      resources: [
        { title: 'Employee Privacy Handbook', type: 'Handbook', url: '/resources/employee-handbook' },
        { title: 'Quick Reference Guide', type: 'Guide', url: '/resources/quick-reference' },
        { title: 'Reporting Forms', type: 'Form', url: '/resources/reporting-forms' }
      ],
      assessment: {
        questions: 20,
        passingScore: 75,
        timeLimit: 25
      }
    },
    'incident-response': {
      title: 'Privacy Incident Response Training',
      description: 'Comprehensive training on identifying, reporting, and responding to privacy incidents in the workplace.',
      duration: '90 minutes',
      difficulty: 'Advanced',
      category: 'Incident Management',
      icon: AlertTriangle,
      objectives: [
        'Learn to identify different types of privacy incidents',
        'Master incident reporting procedures and timelines',
        'Understand investigation and response protocols',
        'Develop skills for incident documentation and follow-up'
      ],
      content: `
        <h3>Privacy Incident Response Training</h3>
        <p>Advanced training for HR staff and privacy officers on comprehensive incident response:</p>
        
        <h4>Module 1: Incident Identification</h4>
        <ul>
          <li><strong>Types of Incidents</strong> - Data breaches, unauthorized access, policy violations</li>
          <li><strong>Severity Assessment</strong> - Classifying incident severity levels</li>
          <li><strong>Detection Methods</strong> - Monitoring and detection systems</li>
          <li><strong>Initial Response</strong> - Immediate actions upon discovery</li>
        </ul>
        
        <h4>Module 2: Reporting & Notification</h4>
        <ul>
          <li><strong>Internal Reporting</strong> - Escalation procedures and timelines</li>
          <li><strong>Regulatory Notifications</strong> - When and how to notify authorities</li>
          <li><strong>Employee Notifications</strong> - Communicating with affected employees</li>
          <li><strong>Public Disclosure</strong> - Managing public relations and media</li>
        </ul>
        
        <h4>Module 3: Investigation Process</h4>
        <ul>
          <li><strong>Investigation Team</strong> - Assembling response teams</li>
          <li><strong>Evidence Collection</strong> - Preserving and documenting evidence</li>
          <li><strong>Root Cause Analysis</strong> - Identifying underlying causes</li>
          <li><strong>Impact Assessment</strong> - Evaluating harm to individuals</li>
        </ul>
        
        <h4>Module 4: Response & Recovery</h4>
        <ul>
          <li><strong>Containment Strategies</strong> - Stopping ongoing incidents</li>
          <li><strong>Remediation Actions</strong> - Fixing vulnerabilities and gaps</li>
          <li><strong>Recovery Planning</strong> - Restoring normal operations</li>
          <li><strong>Lessons Learned</strong> - Improving future response capabilities</li>
        </ul>
      `,
      resources: [
        { title: 'Incident Response Checklist', type: 'Checklist', url: '/resources/incident-checklist' },
        { title: 'Notification Templates', type: 'Template', url: '/resources/notification-templates' },
        { title: 'Investigation Forms', type: 'Form', url: '/resources/investigation-forms' }
      ],
      assessment: {
        questions: 25,
        passingScore: 85,
        timeLimit: 30
      }
    },
    'data-rights-processing': {
      title: 'Data Rights Request Processing',
      description: 'Training for HR staff on processing employee data rights requests including access, correction, and deletion.',
      duration: '75 minutes',
      difficulty: 'Intermediate',
      category: 'Data Rights',
      icon: Shield,
      objectives: [
        'Understand different types of data rights requests',
        'Learn proper request validation and processing procedures',
        'Master timeline management and compliance requirements',
        'Develop skills for effective communication with requesters'
      ],
      content: `
        <h3>Data Rights Request Processing Training</h3>
        <p>Comprehensive training for HR professionals on handling employee data rights requests:</p>
        
        <h4>Module 1: Understanding Data Rights</h4>
        <ul>
          <li><strong>Access Rights</strong> - Employee rights to access their data</li>
          <li><strong>Correction Rights</strong> - Right to correct inaccurate information</li>
          <li><strong>Deletion Rights</strong> - Right to request data deletion</li>
          <li><strong>Portability Rights</strong> - Right to data portability</li>
        </ul>
        
        <h4>Module 2: Request Validation</h4>
        <ul>
          <li><strong>Identity Verification</strong> - Confirming requester identity</li>
          <li><strong>Request Completeness</strong> - Ensuring all required information</li>
          <li><strong>Legal Basis Review</strong> - Determining if request can be fulfilled</li>
          <li><strong>Timeline Tracking</strong> - Managing response deadlines</li>
        </ul>
        
        <h4>Module 3: Processing Procedures</h4>
        <ul>
          <li><strong>Data Location</strong> - Finding all relevant employee data</li>
          <li><strong>Data Compilation</strong> - Gathering and organizing data</li>
          <li><strong>Review Process</strong> - Ensuring data accuracy and completeness</li>
          <li><strong>Delivery Methods</strong> - Secure data delivery options</li>
        </ul>
        
        <h4>Module 4: Communication & Documentation</h4>
        <ul>
          <li><strong>Status Updates</strong> - Keeping requesters informed</li>
          <li><strong>Denial Procedures</strong> - When and how to deny requests</li>
          <li><strong>Appeal Process</strong> - Handling request appeals</li>
          <li><strong>Record Keeping</strong> - Documentation requirements</li>
        </ul>
      `,
      resources: [
        { title: 'Request Processing Checklist', type: 'Checklist', url: '/resources/request-checklist' },
        { title: 'Communication Templates', type: 'Template', url: '/resources/communication-templates' },
        { title: 'Timeline Tracker', type: 'Tool', url: '/resources/timeline-tracker' }
      ],
      assessment: {
        questions: 18,
        passingScore: 80,
        timeLimit: 22
      }
    },
    'privacy-impact-assessments': {
      title: 'Privacy Impact Assessment (DPIA) Training',
      description: 'Advanced training on conducting Data Protection Impact Assessments for new data processing activities.',
      duration: '120 minutes',
      difficulty: 'Advanced',
      category: 'Assessment',
      icon: Target,
      objectives: [
        'Learn when DPIA is required under GDPR and other regulations',
        'Master DPIA methodology and assessment criteria',
        'Develop skills for risk identification and mitigation',
        'Understand documentation and approval processes'
      ],
      content: `
        <h3>Privacy Impact Assessment (DPIA) Training</h3>
        <p>Advanced training for privacy officers and compliance professionals on conducting DPIAs:</p>
        
        <h4>Module 1: DPIA Fundamentals</h4>
        <ul>
          <li><strong>Legal Requirements</strong> - When DPIA is mandatory</li>
          <li><strong>Assessment Scope</strong> - Defining assessment boundaries</li>
          <li><strong>Stakeholder Involvement</strong> - Identifying key participants</li>
          <li><strong>Timeline Planning</strong> - Managing assessment schedules</li>
        </ul>
        
        <h4>Module 2: Data Processing Analysis</h4>
        <ul>
          <li><strong>Data Categories</strong> - Identifying types of personal data</li>
          <li><strong>Processing Purposes</strong> - Defining legitimate purposes</li>
          <li><strong>Data Flows</strong> - Mapping data movement and storage</li>
          <li><strong>Third-Party Sharing</strong> - External data sharing analysis</li>
        </ul>
        
        <h4>Module 3: Risk Assessment</h4>
        <ul>
          <li><strong>Risk Identification</strong> - Recognizing privacy risks</li>
          <li><strong>Risk Analysis</strong> - Evaluating likelihood and impact</li>
          <li><strong>Risk Rating</strong> - Categorizing risk levels</li>
          <li><strong>Mitigation Strategies</strong> - Developing risk controls</li>
        </ul>
        
        <h4>Module 4: Documentation & Approval</h4>
        <ul>
          <li><strong>DPIA Report Structure</strong> - Organizing assessment findings</li>
          <li><strong>Recommendation Development</strong> - Creating actionable recommendations</li>
          <li><strong>Review Process</strong> - Internal and external review procedures</li>
          <li><strong>Implementation Tracking</strong> - Monitoring recommendation implementation</li>
        </ul>
      `,
      resources: [
        { title: 'DPIA Template', type: 'Template', url: '/resources/dpia-template' },
        { title: 'Risk Assessment Matrix', type: 'Tool', url: '/resources/risk-matrix' },
        { title: 'Review Checklist', type: 'Checklist', url: '/resources/review-checklist' }
      ],
      assessment: {
        questions: 30,
        passingScore: 85,
        timeLimit: 40
      }
    }
  };

  const module = trainingModules[topic as keyof typeof trainingModules];

  if (!module) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Breadcrumb />

        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Training Modules</h1>
          <p className="text-muted-foreground">
            Comprehensive privacy training modules for all workplace stakeholders.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {Object.entries(trainingModules).map(([key, mod]) => (
            <Link key={key} to={`/training?topic=${key}`} className="block">
              <div className="bg-white dark:bg-gray-900 rounded-lg border p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-center mb-4">
                  <mod.icon className="h-6 w-6 mr-3 text-blue-600" />
                  <div>
                    <h3 className="font-semibold">{mod.title}</h3>
                    <Badge variant="secondary" className="text-xs mt-1">{mod.category}</Badge>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground mb-4">{mod.description}</p>
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span className="flex items-center">
                    <Clock className="h-3 w-3 mr-1" />
                    {mod.duration}
                  </span>
                  <Badge variant="secondary" className="text-xs">{mod.difficulty}</Badge>
                </div>
              </div>
            </Link>
          ))}
        </div>

        <div className="mt-8 bg-gradient-to-r from-blue-50 to-green-50 dark:from-blue-900/20 dark:to-green-900/20 rounded-lg border p-6">
          <h2 className="text-xl font-semibold mb-4">Training Program Overview</h2>
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <h3 className="font-medium mb-2">Program Features</h3>
              <ul className="space-y-1 text-sm text-muted-foreground">
                <li>• Self-paced learning modules</li>
                <li>• Interactive assessments and quizzes</li>
                <li>• Downloadable resources and templates</li>
                <li>• Certificate of completion</li>
                <li>• Progress tracking and reporting</li>
              </ul>
            </div>
            <div>
              <h3 className="font-medium mb-2">Target Audience</h3>
              <ul className="space-y-1 text-sm text-muted-foreground">
                <li>• HR professionals and staff</li>
                <li>• Privacy officers and compliance teams</li>
                <li>• Managers and supervisors</li>
                <li>• All employees (basic modules)</li>
                <li>• Legal and IT professionals</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const IconComponent = module.icon;

  return (
    <div className="container mx-auto px-4 py-8">
      <Breadcrumb />

      <div className="mb-8">
        <div className="flex items-center mb-4">
          <IconComponent className="h-8 w-8 mr-3 text-blue-600" />
          <div>
            <h1 className="text-3xl font-bold mb-2">{module.title}</h1>
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <Badge variant="secondary">{module.category}</Badge>
              <Badge variant="secondary">{module.difficulty}</Badge>
              <span className="flex items-center">
                <Clock className="h-4 w-4 mr-1" />
                {module.duration}
              </span>
            </div>
          </div>
        </div>
        <p className="text-muted-foreground text-lg">
          {module.description}
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <div className="bg-white dark:bg-gray-900 rounded-lg border p-6 mb-6">
            <h2 className="text-xl font-semibold mb-4">Training Content</h2>
            <div 
              className="prose prose-sm max-w-none dark:prose-invert"
              dangerouslySetInnerHTML={{ __html: module.content }}
            />
          </div>

          <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800 p-6">
            <h3 className="font-semibold mb-3 flex items-center">
              <CheckCircle className="h-5 w-5 mr-2 text-blue-600" />
              Learning Objectives
            </h3>
            <ul className="space-y-2 text-sm">
              {module.objectives.map((objective, index) => (
                <li key={index} className="flex items-start">
                  <span className="text-blue-600 mr-2">•</span>
                  {objective}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white dark:bg-gray-900 rounded-lg border p-6">
            <h3 className="font-semibold mb-4">Start Training</h3>
            <Button className="w-full mb-4">
              <Play className="h-4 w-4 mr-2" />
              Begin Module
            </Button>
            <div className="text-xs text-muted-foreground space-y-1">
              <p>• Self-paced learning</p>
              <p>• Progress automatically saved</p>
              <p>• Certificate upon completion</p>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-900 rounded-lg border p-6">
            <h3 className="font-semibold mb-4">Assessment Details</h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span>Questions:</span>
                <span className="font-medium">{module.assessment.questions}</span>
              </div>
              <div className="flex justify-between">
                <span>Passing Score:</span>
                <span className="font-medium">{module.assessment.passingScore}%</span>
              </div>
              <div className="flex justify-between">
                <span>Time Limit:</span>
                <span className="font-medium">{module.assessment.timeLimit} min</span>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-900 rounded-lg border p-6">
            <h3 className="font-semibold mb-4">Resources</h3>
            <div className="space-y-3">
              {module.resources.map((resource, index) => (
                <div key={index} className="flex items-center p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                  <FileText className="h-4 w-4 mr-3 text-gray-600" />
                  <div>
                    <h4 className="font-medium text-sm">{resource.title}</h4>
                    <p className="text-xs text-muted-foreground">{resource.type}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-gradient-to-r from-blue-50 to-green-50 dark:from-blue-900/20 dark:to-green-900/20 rounded-lg border p-6">
            <h3 className="font-semibold mb-3">Need Support?</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Our training specialists are available to help you succeed.
            </p>
            <div className="space-y-2">
              <Link to="/contact" className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-9 rounded-md px-3 w-full">
                <ExternalLink className="h-4 w-4 mr-2" />
                Contact Support
              </Link>
              <Link to="/resources/tools-templates" className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-9 rounded-md px-3 w-full">
                <Download className="h-4 w-4 mr-2" />
                Download Resources
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TrainingPage;

