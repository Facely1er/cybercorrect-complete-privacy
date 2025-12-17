import { useState } from 'react';
import { Card, CardContent } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Link } from 'react-router-dom';
import { 
  ArrowRight,
  ArrowLeft,
  Clock,
  FileText,
  AlertTriangle,
  CheckCircle,
  Globe,
  Users,
  Shield,
  Bell,
  Clipboard,
  Scale,
  ChevronDown,
  ChevronUp
} from 'lucide-react';

type TabId = 'detection' | 'response' | 'notification' | 'reporting' | 'recovery';

interface TimelineStep {
  time: string;
  title: string;
  description: string;
  actions: string[];
  responsible: string;
}

const IncidentBreachGuide = () => {
  const [activeTab, setActiveTab] = useState<TabId>('detection');
  const [expandedSection, setExpandedSection] = useState<string | null>('gdpr');

  const tabs: { id: TabId; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
    { id: 'detection', label: 'Detection & Assessment', icon: AlertTriangle },
    { id: 'response', label: 'Incident Response', icon: Shield },
    { id: 'notification', label: 'Notification Requirements', icon: Bell },
    { id: 'reporting', label: 'Regulatory Reporting', icon: FileText },
    { id: 'recovery', label: 'Recovery & Lessons', icon: CheckCircle },
  ];

  const gdprTimeline: TimelineStep[] = [
    {
      time: '0-24 Hours',
      title: 'Initial Discovery & Containment',
      description: 'Identify the breach, contain it, and begin initial assessment',
      actions: [
        'Identify the nature and scope of the breach',
        'Contain the breach to prevent further data loss',
        'Preserve evidence for investigation',
        'Notify internal incident response team',
        'Begin documenting the incident timeline'
      ],
      responsible: 'IT Security / DPO'
    },
    {
      time: '24-48 Hours',
      title: 'Risk Assessment & Impact Analysis',
      description: 'Assess the risk to individuals and determine notification requirements',
      actions: [
        'Identify categories of personal data affected',
        'Determine number of data subjects affected',
        'Assess likelihood and severity of risk to individuals',
        'Evaluate if notification to supervisory authority is required',
        'Prepare initial notification documentation'
      ],
      responsible: 'DPO / Legal'
    },
    {
      time: '48-72 Hours',
      title: 'Authority Notification',
      description: 'Notify supervisory authority within 72 hours (GDPR requirement)',
      actions: [
        'Complete notification form for supervisory authority',
        'Submit notification via official channels',
        'Document submission confirmation',
        'Prepare for potential follow-up inquiries',
        'Begin preparing data subject notification if required'
      ],
      responsible: 'DPO / Legal'
    },
    {
      time: '72+ Hours',
      title: 'Data Subject Notification',
      description: 'Notify affected individuals if high risk is identified',
      actions: [
        'Draft clear, plain language notification',
        'Include required information (nature, DPO contact, consequences, measures)',
        'Determine appropriate notification channels',
        'Send notifications to affected individuals',
        'Document all communications'
      ],
      responsible: 'Communications / DPO'
    }
  ];

  const regulatoryRequirements = [
    {
      id: 'gdpr',
      name: 'GDPR (EU)',
      authority: 'Lead Supervisory Authority',
      timeframe: '72 hours',
      threshold: 'Risk to rights and freedoms',
      dataSubjectNotification: 'When high risk to rights and freedoms',
      penalties: 'Up to €20M or 4% global turnover',
      details: [
        'Notify supervisory authority without undue delay (max 72 hours)',
        'Document all breaches regardless of notification requirement',
        'Provide details: nature, categories, approximate numbers, DPO contact, consequences, measures',
        'Notify data subjects directly if high risk identified'
      ]
    },
    {
      id: 'ccpa',
      name: 'CCPA/CPRA (California)',
      authority: 'California Attorney General',
      timeframe: 'Most expedient time possible',
      threshold: 'Unauthorized access to unencrypted data',
      dataSubjectNotification: 'When unencrypted personal information accessed',
      penalties: '$100-$750 per consumer per incident (statutory damages)',
      details: [
        'Notify affected California residents',
        'Written notice via mail or electronic means',
        'Include description of incident, types of data, contact information',
        'Offer identity theft prevention services if SSN affected'
      ]
    },
    {
      id: 'pipeda',
      name: 'PIPEDA (Canada)',
      authority: 'Privacy Commissioner of Canada',
      timeframe: 'As soon as feasible',
      threshold: 'Real risk of significant harm',
      dataSubjectNotification: 'When real risk of significant harm',
      penalties: 'Up to CAD $100,000 per violation',
      details: [
        'Report breaches creating real risk of significant harm',
        'Maintain records of all breaches for 24 months',
        'Notify affected individuals directly',
        'Content must include circumstances, date, personal information involved'
      ]
    },
    {
      id: 'lgpd',
      name: 'LGPD (Brazil)',
      authority: 'ANPD (National Data Protection Authority)',
      timeframe: 'Reasonable time',
      threshold: 'May create risk or relevant damage',
      dataSubjectNotification: 'When may cause damage to data subjects',
      penalties: 'Up to 2% of revenue (max R$50M per infraction)',
      details: [
        'Communicate to ANPD and data subjects in reasonable time',
        'Include description, data types, risks, measures taken',
        'ANPD may order media disclosure',
        'Maintain incident records'
      ]
    }
  ];

  const incidentClassification = [
    {
      severity: 'Critical',
      color: 'bg-red-100 text-red-800 border-red-300 dark:bg-red-900/30 dark:text-red-300 dark:border-red-700',
      criteria: [
        'Large-scale breach (>10,000 data subjects)',
        'Sensitive/special category data exposed',
        'Evidence of malicious actor',
        'Financial data or credentials compromised',
        'High likelihood of identity theft or fraud'
      ],
      responseTime: 'Immediate (within 1 hour)',
      escalation: 'Executive leadership, legal counsel, external counsel'
    },
    {
      severity: 'High',
      color: 'bg-orange-100 text-orange-800 border-orange-300 dark:bg-orange-900/30 dark:text-orange-300 dark:border-orange-700',
      criteria: [
        'Medium-scale breach (1,000-10,000 data subjects)',
        'Personal identifiers exposed',
        'Potential regulatory notification required',
        'System compromise detected'
      ],
      responseTime: 'Within 4 hours',
      escalation: 'DPO, IT Security leadership, Legal'
    },
    {
      severity: 'Medium',
      color: 'bg-yellow-100 text-yellow-800 border-yellow-300 dark:bg-yellow-900/30 dark:text-yellow-300 dark:border-yellow-700',
      criteria: [
        'Small-scale breach (<1,000 data subjects)',
        'Limited personal data exposed',
        'No sensitive data involved',
        'Contained incident'
      ],
      responseTime: 'Within 24 hours',
      escalation: 'DPO, IT Security'
    },
    {
      severity: 'Low',
      color: 'bg-green-100 text-green-800 border-green-300 dark:bg-green-900/30 dark:text-green-300 dark:border-green-700',
      criteria: [
        'Near-miss or potential vulnerability',
        'No actual data exposure confirmed',
        'Internal policy violation',
        'Training opportunity identified'
      ],
      responseTime: 'Within 72 hours',
      escalation: 'IT Security team'
    }
  ];

  const recoveryChecklist = [
    {
      phase: 'Immediate Recovery',
      items: [
        'Restore affected systems from clean backups',
        'Patch vulnerabilities that led to the breach',
        'Reset compromised credentials',
        'Implement additional monitoring',
        'Verify containment effectiveness'
      ]
    },
    {
      phase: 'Documentation & Analysis',
      items: [
        'Complete incident timeline documentation',
        'Conduct root cause analysis',
        'Document lessons learned',
        'Update incident response procedures',
        'Archive all evidence and communications'
      ]
    },
    {
      phase: 'Process Improvement',
      items: [
        'Update security controls based on findings',
        'Revise training programs if human error involved',
        'Enhance detection capabilities',
        'Review and update vendor agreements if applicable',
        'Schedule follow-up security assessment'
      ]
    },
    {
      phase: 'Stakeholder Communication',
      items: [
        'Prepare executive summary of incident',
        'Brief board/leadership on lessons learned',
        'Update privacy notices if procedures changed',
        'Consider public communication strategy if appropriate',
        'Document regulatory correspondence outcomes'
      ]
    }
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <Link to="/resources" className="inline-flex items-center text-foreground hover:text-primary transition-colors mb-6">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Resources
      </Link>

      {/* Header */}
      <div className="text-center mb-12">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 mb-4">
          <AlertTriangle className="w-4 h-4" />
          <span className="text-sm font-medium">Critical Compliance Guide</span>
        </div>
        <h1 className="text-4xl font-bold mb-4 text-foreground">
          Privacy Incident & Breach Management
        </h1>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
          Comprehensive guide for detecting, responding to, and reporting privacy incidents 
          and data breaches across global privacy regulations
        </p>
      </div>

      {/* Quick Reference Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <Card className="border-l-4 border-l-red-500">
          <CardContent className="p-4">
            <Clock className="h-6 w-6 text-red-500 mb-2" />
            <div className="text-2xl font-bold text-foreground">72 hrs</div>
            <p className="text-sm text-muted-foreground">GDPR notification deadline</p>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-orange-500">
          <CardContent className="p-4">
            <Globe className="h-6 w-6 text-orange-500 mb-2" />
            <div className="text-2xl font-bold text-foreground">4+</div>
            <p className="text-sm text-muted-foreground">Regulations covered</p>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-blue-500">
          <CardContent className="p-4">
            <Clipboard className="h-6 w-6 text-blue-500 mb-2" />
            <div className="text-2xl font-bold text-foreground">5</div>
            <p className="text-sm text-muted-foreground">Response phases</p>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-green-500">
          <CardContent className="p-4">
            <Shield className="h-6 w-6 text-green-500 mb-2" />
            <div className="text-2xl font-bold text-foreground">24/7</div>
            <p className="text-sm text-muted-foreground">Incident readiness</p>
          </CardContent>
        </Card>
      </div>

      {/* Navigation Tabs */}
      <div className="flex flex-wrap gap-2 mb-8 border-b border-border pb-4">
        {tabs.map((tab) => (
          <Button
            key={tab.id}
            variant={activeTab === tab.id ? 'default' : 'outline'}
            onClick={() => setActiveTab(tab.id)}
            className="flex items-center gap-2"
          >
            <tab.icon className="h-4 w-4" />
            {tab.label}
          </Button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="space-y-8">
        {/* Detection & Assessment Tab */}
        {activeTab === 'detection' && (
          <div className="space-y-8">
            <Card>
              <CardContent className="p-6">
                <h2 className="text-2xl font-bold mb-6 text-foreground flex items-center gap-2">
                  <AlertTriangle className="h-6 w-6 text-red-500" />
                  Incident Classification Matrix
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {incidentClassification.map((level) => (
                    <Card key={level.severity} className={`border-2 ${level.color}`}>
                      <CardContent className="p-4">
                        <div className="flex justify-between items-start mb-3">
                          <h3 className="text-lg font-bold">{level.severity} Severity</h3>
                          <span className="text-xs font-medium px-2 py-1 bg-background/70 dark:bg-background/50 rounded">
                            {level.responseTime}
                          </span>
                        </div>
                        <ul className="space-y-1 mb-3">
                          {level.criteria.map((criterion, idx) => (
                            <li key={idx} className="text-sm flex items-start gap-2">
                              <CheckCircle className="h-3 w-3 mt-1 flex-shrink-0" />
                              {criterion}
                            </li>
                          ))}
                        </ul>
                        <p className="text-xs mt-2">
                          <strong>Escalate to:</strong> {level.escalation}
                        </p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <h2 className="text-2xl font-bold mb-4 text-foreground">Detection Checklist</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-semibold mb-3 text-foreground">Initial Questions</h3>
                    <ul className="space-y-2">
                      {[
                        'What type of data was potentially affected?',
                        'How many individuals may be affected?',
                        'When did the incident occur?',
                        'Is the incident still ongoing?',
                        'What systems are involved?',
                        'Is there evidence of malicious activity?'
                      ].map((question, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-sm">
                          <CheckCircle className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                          {question}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-3 text-foreground">Immediate Actions</h3>
                    <ul className="space-y-2">
                      {[
                        'Activate incident response team',
                        'Preserve all evidence and logs',
                        'Document initial findings',
                        'Assess containment options',
                        'Notify DPO/Privacy Officer',
                        'Begin incident log timeline'
                      ].map((action, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-sm">
                          <ArrowRight className="h-4 w-4 text-orange-500 mt-0.5 flex-shrink-0" />
                          {action}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Response Tab */}
        {activeTab === 'response' && (
          <div className="space-y-6">
            <Card>
              <CardContent className="p-6">
                <h2 className="text-2xl font-bold mb-6 text-foreground flex items-center gap-2">
                  <Clock className="h-6 w-6 text-orange-500" />
                  72-Hour Response Timeline (GDPR)
                </h2>
                <div className="space-y-6">
                  {gdprTimeline.map((step, index) => (
                    <div key={index} className="flex gap-4">
                      <div className="flex flex-col items-center">
                        <div className="w-12 h-12 rounded-full bg-primary text-white flex items-center justify-center font-bold">
                          {index + 1}
                        </div>
                        {index < gdprTimeline.length - 1 && (
                          <div className="w-0.5 h-full bg-border mt-2"></div>
                        )}
                      </div>
                      <Card className="flex-1">
                        <CardContent className="p-4">
                          <div className="flex justify-between items-start mb-2">
                            <h3 className="font-bold text-foreground">{step.title}</h3>
                            <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">
                              {step.time}
                            </span>
                          </div>
                          <p className="text-sm text-muted-foreground mb-3">{step.description}</p>
                          <ul className="space-y-1 mb-2">
                            {step.actions.map((action, idx) => (
                              <li key={idx} className="text-sm flex items-start gap-2">
                                <CheckCircle className="h-3 w-3 text-green-500 mt-1 flex-shrink-0" />
                                {action}
                              </li>
                            ))}
                          </ul>
                          <p className="text-xs text-muted-foreground">
                            <Users className="h-3 w-3 inline mr-1" />
                            Responsible: {step.responsible}
                          </p>
                        </CardContent>
                      </Card>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Notification Requirements Tab */}
        {activeTab === 'notification' && (
          <div className="space-y-6">
            <Card>
              <CardContent className="p-6">
                <h2 className="text-2xl font-bold mb-6 text-foreground flex items-center gap-2">
                  <Globe className="h-6 w-6 text-blue-500" />
                  Global Notification Requirements
                </h2>
                <div className="space-y-4">
                  {regulatoryRequirements.map((reg) => (
                    <Card key={reg.id} className="border">
                      <CardContent className="p-0">
                        <button
                          onClick={() => setExpandedSection(expandedSection === reg.id ? null : reg.id)}
                          className="w-full p-4 flex items-center justify-between hover:bg-muted/50 transition-colors"
                        >
                          <div className="flex items-center gap-4">
                            <Scale className="h-5 w-5 text-primary" />
                            <div className="text-left">
                              <h3 className="font-bold text-foreground">{reg.name}</h3>
                              <p className="text-sm text-muted-foreground">
                                Timeframe: {reg.timeframe} • Authority: {reg.authority}
                              </p>
                            </div>
                          </div>
                          {expandedSection === reg.id ? (
                            <ChevronUp className="h-5 w-5 text-muted-foreground" />
                          ) : (
                            <ChevronDown className="h-5 w-5 text-muted-foreground" />
                          )}
                        </button>
                        
                        {expandedSection === reg.id && (
                          <div className="px-4 pb-4 border-t border-border pt-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                              <div>
                                <p className="text-sm"><strong>Notification Threshold:</strong></p>
                                <p className="text-sm text-muted-foreground">{reg.threshold}</p>
                              </div>
                              <div>
                                <p className="text-sm"><strong>Data Subject Notification:</strong></p>
                                <p className="text-sm text-muted-foreground">{reg.dataSubjectNotification}</p>
                              </div>
                              <div className="md:col-span-2">
                                <p className="text-sm"><strong>Potential Penalties:</strong></p>
                                <p className="text-sm text-destructive">{reg.penalties}</p>
                              </div>
                            </div>
                            <div>
                              <p className="text-sm font-medium mb-2">Key Requirements:</p>
                              <ul className="space-y-1">
                                {reg.details.map((detail, idx) => (
                                  <li key={idx} className="text-sm flex items-start gap-2">
                                    <CheckCircle className="h-3 w-3 text-primary mt-1 flex-shrink-0" />
                                    {detail}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Regulatory Reporting Tab */}
        {activeTab === 'reporting' && (
          <div className="space-y-6">
            <Card>
              <CardContent className="p-6">
                <h2 className="text-2xl font-bold mb-6 text-foreground flex items-center gap-2">
                  <FileText className="h-6 w-6 text-purple-500" />
                  Authority Notification Content Requirements
                </h2>
                <div className="bg-muted/30 p-6 rounded-lg">
                  <p className="text-sm text-muted-foreground mb-4">
                    Most privacy regulations require similar information when notifying authorities. 
                    Prepare the following information before submitting:
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {[
                      { title: 'Nature of Breach', items: ['Type of breach (confidentiality, integrity, availability)', 'How the breach occurred', 'Attack vector if known'] },
                      { title: 'Data Affected', items: ['Categories of personal data', 'Categories of data subjects', 'Approximate number of records'] },
                      { title: 'Impact Assessment', items: ['Likely consequences for data subjects', 'Severity of potential harm', 'Risk mitigation factors'] },
                      { title: 'Contact Information', items: ['DPO name and contact details', 'Technical contact if different', 'Organization details'] },
                      { title: 'Measures Taken', items: ['Containment actions', 'Mitigation measures', 'Future prevention plans'] },
                      { title: 'Timeline', items: ['Date/time of discovery', 'Date/time breach began (if known)', 'Date of containment'] }
                    ].map((section, idx) => (
                      <div key={idx}>
                        <h4 className="font-semibold text-foreground mb-2">{section.title}</h4>
                        <ul className="space-y-1">
                          {section.items.map((item, itemIdx) => (
                            <li key={itemIdx} className="text-sm flex items-start gap-2">
                              <CheckCircle className="h-3 w-3 text-green-500 mt-1 flex-shrink-0" />
                              {item}
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <h2 className="text-2xl font-bold mb-4 text-foreground">Data Subject Notification Template</h2>
                <div className="bg-muted/30 p-6 rounded-lg border border-dashed border-border">
                  <p className="text-sm text-muted-foreground mb-4">Include these elements in notifications to affected individuals:</p>
                  <ol className="space-y-3">
                    {[
                      'Clear description of what happened (in plain language)',
                      'Types of personal data involved',
                      'Name and contact details of DPO or privacy contact',
                      'Description of likely consequences',
                      'Description of measures taken to address the breach',
                      'Description of measures individuals can take to protect themselves',
                      'Apology and commitment to prevent future incidents'
                    ].map((item, idx) => (
                      <li key={idx} className="text-sm flex items-start gap-3">
                        <span className="w-6 h-6 rounded-full bg-primary text-white text-xs flex items-center justify-center flex-shrink-0">
                          {idx + 1}
                        </span>
                        {item}
                      </li>
                    ))}
                  </ol>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Recovery Tab */}
        {activeTab === 'recovery' && (
          <div className="space-y-6">
            <Card>
              <CardContent className="p-6">
                <h2 className="text-2xl font-bold mb-6 text-foreground flex items-center gap-2">
                  <CheckCircle className="h-6 w-6 text-green-500" />
                  Post-Incident Recovery Checklist
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {recoveryChecklist.map((phase, idx) => (
                    <Card key={idx} className="border">
                      <CardContent className="p-4">
                        <h3 className="font-bold text-foreground mb-3 flex items-center gap-2">
                          <span className="w-6 h-6 rounded-full bg-primary text-white text-xs flex items-center justify-center">
                            {idx + 1}
                          </span>
                          {phase.phase}
                        </h3>
                        <ul className="space-y-2">
                          {phase.items.map((item, itemIdx) => (
                            <li key={itemIdx} className="text-sm flex items-start gap-2">
                              <div className="w-4 h-4 border border-border rounded mt-0.5 flex-shrink-0"></div>
                              {item}
                            </li>
                          ))}
                        </ul>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>

      {/* Related Tools CTA */}
      <Card className="mt-12 bg-gradient-to-r from-primary/5 via-background to-secondary/5 border-primary/20">
        <CardContent className="p-8">
          <div className="flex flex-col md:flex-row items-center gap-6">
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-foreground mb-2">
                Ready to Manage Incidents?
              </h2>
              <p className="text-muted-foreground">
                Use our Incident Response Manager tool to track, document, and manage 
                privacy incidents with built-in regulatory notification workflows.
              </p>
            </div>
            <div className="flex gap-3">
              <Link to="/toolkit/incident-response-manager">
                <Button size="lg">
                  Open Incident Manager
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link to="/toolkit">
                <Button size="lg" variant="outline">
                  View All Tools
                </Button>
              </Link>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default IncidentBreachGuide;

