import { Card, CardContent } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowRight,
  Shield,
  CheckCircle,
  ArrowLeft,
  FileText,
  AlertTriangle,
  Info,
  BarChart2,
  PieChart,
  FileSearch,
  Activity,
  Zap,
  Download,
  Database,
  ChevronRight
} from 'lucide-react';
import './AssessmentGuide.css';

const AssessmentGuide = () => {
  const navigate = useNavigate();

  return (
    <div className="py-20">
      <div className="max-w-7xl mx-auto px-6">
        <Button 
          variant="outline" 
          className="mb-8"
          onClick={() => navigate('/resources')}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Docs & Guides
        </Button>
        
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold mb-4 text-foreground">Reading Assessment Results</h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Understanding and interpreting your security assessment reports for effective remediation
          </p>
        </div>

        {/* Assessment Overview */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold mb-8 text-foreground">Assessment Report Structure</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <Card>
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold mb-4 flex items-center">
                  <FileText className="h-6 w-6 text-primary mr-2" />
                  Report Components
                </h3>
                <p className="text-muted-foreground mb-4">
                  Understanding the key sections of your assessment reports:
                </p>
                <ul className="text-muted-foreground space-y-2">
                  <li className="flex items-start">
                    <CheckCircle className="h-4 w-4 text-primary mr-2 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-medium text-foreground">Executive Summary</p>
                      <p className="text-sm">High-level overview of assessment findings and compliance status</p>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-4 w-4 text-primary mr-2 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-medium text-foreground">Compliance Scores</p>
                      <p className="text-sm">Overall and section-level compliance percentages</p>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-4 w-4 text-primary mr-2 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-medium text-foreground">Gap Analysis</p>
                      <p className="text-sm">Identified gaps and deficiencies in security controls</p>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-4 w-4 text-primary mr-2 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-medium text-foreground">Recommendations</p>
                      <p className="text-sm">Prioritized actions to address identified gaps</p>
                    </div>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold mb-4 flex items-center">
                  <BarChart2 className="h-6 w-6 text-primary mr-2" />
                  Assessment Metrics
                </h3>
                <p className="text-muted-foreground mb-4">
                  Key metrics and scoring methods used in assessment reports:
                </p>
                <ul className="text-muted-foreground space-y-2">
                  <li className="flex items-start">
                    <CheckCircle className="h-4 w-4 text-primary mr-2 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-medium text-foreground">Overall Compliance Score</p>
                      <p className="text-sm">Percentage of compliance across all controls</p>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-4 w-4 text-primary mr-2 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-medium text-foreground">Section Scores</p>
                      <p className="text-sm">Compliance levels for specific control families or areas</p>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-4 w-4 text-primary mr-2 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-medium text-foreground">Risk Levels</p>
                      <p className="text-sm">Risk classification based on compliance scores</p>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-4 w-4 text-primary mr-2 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-medium text-foreground">Remediation Priorities</p>
                      <p className="text-sm">Categorization of findings by urgency and impact</p>
                    </div>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-start space-x-4">
                <div className="bg-primary/10 p-3 rounded-lg">
                  <FileSearch className="h-8 w-8 text-primary" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-4">Using Assessment Data Effectively</h3>
                  <p className="text-muted-foreground mb-4">
                    Assessment results are most valuable when they drive actionable improvements to your security program.
                    Here's how to effectively use your assessment data:
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
                    <div className="bg-muted/30 p-4 rounded-lg">
                      <h4 className="font-medium mb-2">Strategic Planning</h4>
                      <ul className="text-sm text-muted-foreground space-y-1 list-disc pl-5">
                        <li>Identify systemic weaknesses across control families</li>
                        <li>Develop long-term security roadmap based on findings</li>
                        <li>Allocate resources to highest-risk areas</li>
                        <li>Establish security program objectives</li>
                      </ul>
                    </div>
                    <div className="bg-muted/30 p-4 rounded-lg">
                      <h4 className="font-medium mb-2">Tactical Remediation</h4>
                      <ul className="text-sm text-muted-foreground space-y-1 list-disc pl-5">
                        <li>Address critical and high-priority findings first</li>
                        <li>Develop specific remediation plans with timelines</li>
                        <li>Assign responsibility for each remediation task</li>
                        <li>Track progress with metrics and milestones</li>
                      </ul>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Regular reassessment is crucial to validate that remediation efforts have been effective and to identify any new gaps that may have emerged.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Understanding Assessment Results */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold mb-8 text-foreground">Interpreting Assessment Results</h2>
          
          <div className="space-y-6 mb-8">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  <div className="rounded-full bg-primary/10 p-3">
                    <PieChart className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold ml-3">Compliance Score Interpretation</h3>
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-center p-4 rounded-lg bg-success/10">
                    <div className="w-16 h-16 rounded-full bg-green-100 border-4 border-green-200 dark:bg-green-900/30 dark:border-green-800 flex items-center justify-center font-bold text-xl text-green-800 dark:text-green-300">
                      80%+
                    </div>
                    <div className="ml-4">
                      <h4 className="font-medium text-success">Low Risk (80-100%)</h4>
                      <p className="text-sm text-muted-foreground">
                        Strong compliance posture with minimal gaps. Focus on maintaining controls and continuous improvement.
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center p-4 rounded-lg bg-primary/10">
                    <div className="w-16 h-16 rounded-full bg-blue-100 border-4 border-blue-200 dark:bg-blue-900/30 dark:border-blue-800 flex items-center justify-center font-bold text-xl text-blue-800 dark:text-blue-300">
                      60-79%
                    </div>
                    <div className="ml-4">
                      <h4 className="font-medium text-primary">Moderate Risk (60-79%)</h4>
                      <p className="text-sm text-muted-foreground">
                        Generally sound compliance posture with some notable gaps. Address medium and high priority findings.
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center p-4 rounded-lg bg-warning/10">
                    <div className="w-16 h-16 rounded-full bg-yellow-100 border-4 border-yellow-200 dark:bg-yellow-900/30 dark:border-yellow-800 flex items-center justify-center font-bold text-xl text-yellow-800 dark:text-yellow-300">
                      40-59%
                    </div>
                    <div className="ml-4">
                      <h4 className="font-medium text-warning">High Risk (40-59%)</h4>
                      <p className="text-sm text-muted-foreground">
                        Significant compliance gaps requiring immediate attention. Develop comprehensive remediation plan.
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center p-4 rounded-lg bg-destructive/10">
                    <div className="w-16 h-16 rounded-full bg-red-100 border-4 border-red-200 dark:bg-red-900/30 dark:border-red-800 flex items-center justify-center font-bold text-xl text-red-800 dark:text-red-300">
                      0-39%
                    </div>
                    <div className="ml-4">
                      <h4 className="font-medium text-destructive">Critical Risk (0-39%)</h4>
                      <p className="text-sm text-muted-foreground">
                        Critical compliance gaps present immediate security risk. Urgent remediation required.
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold mb-4 flex items-center">
                    <Activity className="h-6 w-6 text-primary mr-2" />
                    Section Scores
                  </h3>
                  <p className="text-muted-foreground mb-4">
                    Assessment reports break down compliance by control families or assessment domains:
                  </p>
                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-sm font-medium">Access Control</span>
                        <span className="text-sm font-bold">78%</span>
                      </div>
                      <div className="w-full bg-muted h-2 rounded-full">
                        <div 
                          className="h-2 rounded-full bg-primary progress-bar"
                          ref={(node) => {
                            if (node) node.style.setProperty('--progress-width', '78%');
                          }}
                        ></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-sm font-medium">Identification & Authentication</span>
                        <span className="text-sm font-bold">82%</span>
                      </div>
                      <div className="w-full bg-muted h-2 rounded-full">
                        <div 
                          className="h-2 rounded-full bg-primary progress-bar"
                          ref={(node) => {
                            if (node) node.style.setProperty('--progress-width', '82%');
                          }}
                        ></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-sm font-medium">System & Information Integrity</span>
                        <span className="text-sm font-bold">62%</span>
                      </div>
                      <div className="w-full bg-muted h-2 rounded-full">
                        <div 
                          className="h-2 rounded-full bg-primary progress-bar"
                          ref={(node) => {
                            if (node) node.style.setProperty('--progress-width', '62%');
                          }}
                        ></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-sm font-medium">Configuration Management</span>
                        <span className="text-sm font-bold">55%</span>
                      </div>
                      <div className="w-full bg-muted h-2 rounded-full">
                        <div 
                          className="h-2 rounded-full bg-primary progress-bar"
                          ref={(node) => {
                            if (node) node.style.setProperty('--progress-width', '55%');
                          }}
                        ></div>
                      </div>
                    </div>
                  </div>
                  <div className="mt-4 text-xs text-muted-foreground">
                    <p>
                      Look for control families with the lowest scores to identify areas requiring immediate attention and focus remediation efforts.
                    </p>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold mb-4 flex items-center">
                    <Zap className="h-6 w-6 text-primary mr-2" />
                    Finding Categories
                  </h3>
                  <p className="text-muted-foreground mb-4">
                    Assessment findings are typically categorized by severity:
                  </p>
                  <ul className="space-y-3">
                    <li className="flex items-start">
                      <div className="bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300 p-1 rounded flex-shrink-0 mt-0.5 mr-2">
                        <AlertTriangle className="h-4 w-4" />
                      </div>
                      <div>
                        <p className="font-medium">Critical</p>
                        <p className="text-xs text-muted-foreground">Severe vulnerabilities that could lead to immediate compromise if exploited</p>
                      </div>
                    </li>
                    <li className="flex items-start">
                      <div className="bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300 p-1 rounded flex-shrink-0 mt-0.5 mr-2">
                        <AlertTriangle className="h-4 w-4" />
                      </div>
                      <div>
                        <p className="font-medium">High</p>
                        <p className="text-xs text-muted-foreground">Significant security issues that could result in data loss or system compromise</p>
                      </div>
                    </li>
                    <li className="flex items-start">
                      <div className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300 p-1 rounded flex-shrink-0 mt-0.5 mr-2">
                        <AlertTriangle className="h-4 w-4" />
                      </div>
                      <div>
                        <p className="font-medium">Medium</p>
                        <p className="text-xs text-muted-foreground">Security weaknesses that pose moderate risk to the environment</p>
                      </div>
                    </li>
                    <li className="flex items-start">
                      <div className="bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300 p-1 rounded flex-shrink-0 mt-0.5 mr-2">
                        <Info className="h-4 w-4" />
                      </div>
                      <div>
                        <p className="font-medium">Low</p>
                        <p className="text-xs text-muted-foreground">Minor issues with limited security impact</p>
                      </div>
                    </li>
                  </ul>
                  <div className="mt-4 text-xs text-muted-foreground">
                    <p>
                      Always prioritize critical and high findings for immediate remediation, followed by medium and low findings.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          <div className="bg-muted/30 rounded-lg p-6 mb-8">
            <div className="flex items-start space-x-4">
              <div className="bg-primary/10 p-3 rounded-lg">
                <Info className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2">Beyond the Score: Qualitative Analysis</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  While compliance scores provide a quantitative measure, effective remediation requires looking beyond the numbers:
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="text-sm font-medium mb-2">Patterns and Themes</h4>
                    <p className="text-xs text-muted-foreground">
                      Look for recurring issues across control families that may indicate systemic problems, such as:
                    </p>
                    <ul className="text-xs text-muted-foreground mt-1 list-disc pl-5">
                      <li>Consistent documentation gaps</li>
                      <li>Authentication weaknesses across systems</li>
                      <li>Inadequate monitoring capabilities</li>
                      <li>Insufficient access controls</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium mb-2">Root Cause Analysis</h4>
                    <p className="text-xs text-muted-foreground">
                      Identify underlying causes for findings rather than just treating symptoms:
                    </p>
                    <ul className="text-xs text-muted-foreground mt-1 list-disc pl-5">
                      <li>Resource constraints</li>
                      <li>Insufficient training</li>
                      <li>Process deficiencies</li>
                      <li>Technology limitations</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* From Assessment to Action */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold mb-8 text-foreground">From Assessment to Action</h2>
          
          <div className="space-y-6 mb-8">
            <Card>
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold mb-4">Creating an Effective Remediation Plan</h3>
                <div className="space-y-4">
                  <div className="flex items-start">
                    <div className="bg-primary/10 w-8 h-8 rounded-full flex items-center justify-center mr-3 flex-shrink-0">
                      <ChevronRight className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-medium mb-1">Prioritize Findings</h4>
                      <p className="text-sm text-muted-foreground">
                        Order remediation activities based on risk level and potential impact to your organization.
                      </p>
                      <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 gap-2">
                        <div className="bg-muted/30 p-2 rounded text-xs">
                          <span className="font-medium">Priority 1:</span> Critical findings
                        </div>
                        <div className="bg-muted/30 p-2 rounded text-xs">
                          <span className="font-medium">Priority 2:</span> High-risk findings
                        </div>
                        <div className="bg-muted/30 p-2 rounded text-xs">
                          <span className="font-medium">Priority 3:</span> Medium-risk findings
                        </div>
                        <div className="bg-muted/30 p-2 rounded text-xs">
                          <span className="font-medium">Priority 4:</span> Low-risk findings
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="bg-primary/10 w-8 h-8 rounded-full flex items-center justify-center mr-3 flex-shrink-0">
                      <ChevronRight className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-medium mb-1">Assign Responsibility</h4>
                      <p className="text-sm text-muted-foreground">
                        Clearly define who is responsible for implementing each remediation item.
                      </p>
                      <div className="mt-2 bg-muted/30 p-2 rounded text-xs">
                        <p>For each remediation item, assign:</p>
                        <ul className="list-disc pl-5 mt-1">
                          <li>Owner (responsible for completion)</li>
                          <li>Approver (validates the remediation)</li>
                          <li>Subject matter experts (provide technical guidance)</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="bg-primary/10 w-8 h-8 rounded-full flex items-center justify-center mr-3 flex-shrink-0">
                      <ChevronRight className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-medium mb-1">Set Realistic Timelines</h4>
                      <p className="text-sm text-muted-foreground">
                        Establish achievable deadlines for remediation activities.
                      </p>
                      <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 gap-2">
                        <div className="bg-muted/30 p-2 rounded text-xs">
                          <span className="font-medium">Critical findings:</span> 7-30 days
                        </div>
                        <div className="bg-muted/30 p-2 rounded text-xs">
                          <span className="font-medium">High-risk findings:</span> 30-60 days
                        </div>
                        <div className="bg-muted/30 p-2 rounded text-xs">
                          <span className="font-medium">Medium-risk findings:</span> 60-90 days
                        </div>
                        <div className="bg-muted/30 p-2 rounded text-xs">
                          <span className="font-medium">Low-risk findings:</span> 90-180 days
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="bg-primary/10 w-8 h-8 rounded-full flex items-center justify-center mr-3 flex-shrink-0">
                      <ChevronRight className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-medium mb-1">Document Remediation Steps</h4>
                      <p className="text-sm text-muted-foreground">
                        Clearly outline specific actions required to address each finding.
                      </p>
                      <div className="mt-2 bg-muted/30 p-2 rounded text-xs">
                        <p>Effective remediation steps should be:</p>
                        <ul className="list-disc pl-5 mt-1">
                          <li>Specific and actionable</li>
                          <li>Measurable and verifiable</li>
                          <li>Aligned with compliance requirements</li>
                          <li>Technically feasible</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="bg-primary/10 w-8 h-8 rounded-full flex items-center justify-center mr-3 flex-shrink-0">
                      <ChevronRight className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-medium mb-1">Track Progress</h4>
                      <p className="text-sm text-muted-foreground">
                        Implement a system to monitor remediation progress.
                      </p>
                      <div className="mt-2 bg-muted/30 p-2 rounded text-xs">
                        <p>Key tracking elements:</p>
                        <ul className="list-disc pl-5 mt-1">
                          <li>Current status of each finding</li>
                          <li>Percentage complete</li>
                          <li>Days remaining until deadline</li>
                          <li>Dependencies and blockers</li>
                          <li>Evidence of completion</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center mb-4">
                    <div className="rounded-full bg-primary/10 p-3">
                      <Database className="h-6 w-6 text-primary" />
                    </div>
                    <h3 className="text-lg font-semibold ml-3">Evidence Collection</h3>
                  </div>
                  <p className="text-muted-foreground mb-4">
                    Properly document remediation activities with evidence:
                  </p>
                  <ul className="text-sm space-y-2">
                    <li className="flex items-center">
                      <CheckCircle className="h-4 w-4 text-primary mr-2" />
                      <span>Screenshots of implemented configurations</span>
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="h-4 w-4 text-primary mr-2" />
                      <span>Updated policy and procedure documents</span>
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="h-4 w-4 text-primary mr-2" />
                      <span>System-generated reports and logs</span>
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="h-4 w-4 text-primary mr-2" />
                      <span>Change management records</span>
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="h-4 w-4 text-primary mr-2" />
                      <span>Testing results validating remediation</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center mb-4">
                    <div className="rounded-full bg-primary/10 p-3">
                      <Shield className="h-6 w-6 text-primary" />
                    </div>
                    <h3 className="text-lg font-semibold ml-3">Validation Process</h3>
                  </div>
                  <p className="text-muted-foreground mb-4">
                    Ensure remediation efforts effectively address findings:
                  </p>
                  <ul className="text-sm space-y-2">
                    <li className="flex items-center">
                      <CheckCircle className="h-4 w-4 text-primary mr-2" />
                      <span>Test effectiveness of implemented controls</span>
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="h-4 w-4 text-primary mr-2" />
                      <span>Conduct independent verification when possible</span>
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="h-4 w-4 text-primary mr-2" />
                      <span>Document verification methods and results</span>
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="h-4 w-4 text-primary mr-2" />
                      <span>Update assessment documentation</span>
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="h-4 w-4 text-primary mr-2" />
                      <span>Re-assess to confirm compliance scores improve</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>

          <div className="bg-muted/30 rounded-lg p-6">
            <div className="flex items-start">
              <AlertTriangle className="h-5 w-5 text-warning mt-0.5 mr-3 flex-shrink-0" />
              <div>
                <h3 className="font-medium text-foreground mb-2">Common Remediation Pitfalls</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <ul className="text-sm text-muted-foreground space-y-1 list-disc pl-5">
                    <li>Focusing solely on technical controls while neglecting administrative controls</li>
                    <li>Implementing temporary fixes rather than addressing root causes</li>
                    <li>Setting unrealistic remediation timelines</li>
                    <li>Inadequate documentation of remediation activities</li>
                  </ul>
                  <ul className="text-sm text-muted-foreground space-y-1 list-disc pl-5">
                    <li>Failing to validate that remediation actions resolved the findings</li>
                    <li>Not updating policies and procedures to reflect changes</li>
                    <li>Addressing findings in isolation rather than systemically</li>
                    <li>Neglecting to communicate changes to affected stakeholders</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Continuous Improvement */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold mb-8 text-foreground">Continuous Improvement Process</h2>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center mb-6">
                <div className="rounded-full bg-primary/10 p-3">
                  <Activity className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold ml-3">The Assessment Lifecycle</h3>
              </div>
              
              <div className="relative">
                <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-muted"></div>
                <div className="space-y-8">
                  <div className="flex">
                    <div className="relative">
                      <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white z-10">
                        1
                      </div>
                    </div>
                    <div className="ml-6">
                      <h4 className="text-lg font-medium mb-2">Initial Assessment</h4>
                      <p className="text-muted-foreground mb-3">
                        Establish your baseline compliance status by conducting a comprehensive assessment.
                      </p>
                      <div className="bg-muted/30 p-3 rounded text-sm">
                        <p>Key outcomes:</p>
                        <ul className="list-disc pl-5 mt-1">
                          <li>Baseline compliance scores</li>
                          <li>Comprehensive gap analysis</li>
                          <li>Initial remediation plan</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex">
                    <div className="relative">
                      <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white z-10">
                        2
                      </div>
                    </div>
                    <div className="ml-6">
                      <h4 className="text-lg font-medium mb-2">Remediation</h4>
                      <p className="text-muted-foreground mb-3">
                        Implement changes to address identified gaps and vulnerabilities.
                      </p>
                      <div className="bg-muted/30 p-3 rounded text-sm">
                        <p>Key activities:</p>
                        <ul className="list-disc pl-5 mt-1">
                          <li>Prioritized control implementation</li>
                          <li>Documentation updates</li>
                          <li>Technical fixes and improvements</li>
                          <li>Process enhancements</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex">
                    <div className="relative">
                      <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white z-10">
                        3
                      </div>
                    </div>
                    <div className="ml-6">
                      <h4 className="text-lg font-medium mb-2">Validation</h4>
                      <p className="text-muted-foreground mb-3">
                        Verify that remediation efforts effectively address identified gaps.
                      </p>
                      <div className="bg-muted/30 p-3 rounded text-sm">
                        <p>Key activities:</p>
                        <ul className="list-disc pl-5 mt-1">
                          <li>Testing remediated controls</li>
                          <li>Evidence collection and validation</li>
                          <li>Independent verification when possible</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex">
                    <div className="relative">
                      <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white z-10">
                        4
                      </div>
                    </div>
                    <div className="ml-6">
                      <h4 className="text-lg font-medium mb-2">Reassessment</h4>
                      <p className="text-muted-foreground mb-3">
                        Conduct follow-up assessment to measure improvement and identify new gaps.
                      </p>
                      <div className="bg-muted/30 p-3 rounded text-sm">
                        <p>Key outcomes:</p>
                        <ul className="list-disc pl-5 mt-1">
                          <li>Updated compliance scores</li>
                          <li>Verification of closed findings</li>
                          <li>Identification of new gaps</li>
                          <li>Refined remediation plan</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex">
                    <div className="relative">
                      <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white z-10">
                        5
                      </div>
                    </div>
                    <div className="ml-6">
                      <h4 className="text-lg font-medium mb-2">Continuous Monitoring</h4>
                      <p className="text-muted-foreground mb-3">
                        Implement ongoing monitoring to maintain and improve your security posture.
                      </p>
                      <div className="bg-muted/30 p-3 rounded text-sm">
                        <p>Key activities:</p>
                        <ul className="list-disc pl-5 mt-1">
                          <li>Automated compliance checks</li>
                          <li>Regular control reviews</li>
                          <li>Security metrics tracking</li>
                          <li>Continuous improvement initiatives</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* CTA Section */}
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-6 text-foreground">Start Interpreting Your Assessment Results</h2>
          <p className="text-muted-foreground mb-8 max-w-3xl mx-auto">
            Use our tools to better understand your assessment results and create effective remediation plans
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg"
              onClick={() => navigate('/assessment')}
            >
              View Your Assessments
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
            <Button 
              size="lg" 
              variant="outline"
              onClick={() => {
                const templates = `REMEDIATION TEMPLATES FOR PRIVACY ASSESSMENTS

================================================================================
1. REMEDIATION PLAN TEMPLATE
================================================================================

ASSESSMENT INFORMATION
- Assessment ID: 
- Assessment Date: 
- Assessor: 
- Framework: [ ] NIST Privacy Framework [ ] GDPR [ ] CCPA [ ] Other

FINDING INFORMATION
- Finding ID: 
- Finding Title: 
- Severity: [ ] Critical [ ] High [ ] Medium [ ] Low
- Affected Controls: 
- Description: 
- Risk Impact: 

REMEDIATION PLAN
- Remediation Strategy: 
- Planned Actions: 
  1. 
  2. 
  3. 
- Resources Required: 
- Estimated Cost: 
- Timeline: 
- Start Date: 
- Target Completion Date: 

RESPONSIBILITY
- Responsible Party: 
- Supporting Team: 
- Contact Information: 

MILESTONES
- Milestone 1: 
  - Description: 
  - Target Date: 
  - Status: [ ] Not Started [ ] In Progress [ ] Completed
- Milestone 2: 
  - Description: 
  - Target Date: 
  - Status: [ ] Not Started [ ] In Progress [ ] Completed
- Milestone 3: 
  - Description: 
  - Target Date: 
  - Status: [ ] Not Started [ ] In Progress [ ] Completed

VERIFICATION
- Verification Method: 
- Success Criteria: 
- Verification Date: 
- Verified By: 

STATUS TRACKING
- Current Status: [ ] Not Started [ ] In Progress [ ] Completed [ ] On Hold
- Progress Notes: 
- Last Update: 
- Next Review Date: 

APPROVAL
- Prepared By: 
- Date: 
- Approved By: 
- Approval Date: 

================================================================================
2. CONTROL IMPLEMENTATION TEMPLATE
================================================================================

CONTROL INFORMATION
- Control ID: 
- Control Name: 
- Framework: 
- Category: 

CURRENT STATE
- Implementation Status: [ ] Not Implemented [ ] Partially Implemented [ ] Implemented
- Current Implementation Description: 
- Gaps Identified: 

TARGET STATE
- Target Implementation: 
- Required Changes: 
- New Processes/Procedures: 
- Technology Requirements: 

IMPLEMENTATION PLAN
- Phase 1: 
  - Activities: 
  - Timeline: 
  - Resources: 
- Phase 2: 
  - Activities: 
  - Timeline: 
  - Resources: 
- Phase 3: 
  - Activities: 
  - Timeline: 
  - Resources: 

TESTING & VALIDATION
- Test Plan: 
- Test Scenarios: 
- Success Criteria: 
- Test Results: 

DOCUMENTATION
- Procedures Updated: [ ] Yes [ ] No
- Training Materials: [ ] Yes [ ] No
- Documentation Updated: [ ] Yes [ ] No

APPROVAL
- Implemented By: 
- Date: 
- Verified By: 
- Date: 

================================================================================
3. GAP ANALYSIS & REMEDIATION TEMPLATE
================================================================================

GAP IDENTIFICATION
- Gap ID: 
- Gap Description: 
- Affected Controls: 
- Framework Requirements: 
- Current State: 
- Target State: 

GAP ANALYSIS
- Root Cause: 
- Impact Assessment: 
- Risk Level: [ ] Low [ ] Medium [ ] High
- Business Impact: 

REMEDIATION APPROACH
- Remediation Option Selected: 
- Rationale: 
- Alternative Options Considered: 
- Cost-Benefit Analysis: 

IMPLEMENTATION DETAILS
- Implementation Steps: 
  1. 
  2. 
  3. 
- Dependencies: 
- Prerequisites: 
- Timeline: 
- Resources: 

VERIFICATION & VALIDATION
- Verification Method: 
- Test Plan: 
- Success Criteria: 
- Validation Results: 

CLOSURE
- Gap Closed: [ ] Yes [ ] No
- Closure Date: 
- Verified By: 
- Notes: 

================================================================================
4. PRIORITY REMEDIATION TRACKER
================================================================================

PRIORITY LEVEL: [ ] P0 - Critical [ ] P1 - High [ ] P2 - Medium [ ] P3 - Low

FINDING INFORMATION
- Finding ID: 
- Title: 
- Description: 
- Affected Areas: 

REMEDIATION STATUS
- Status: [ ] Not Started [ ] In Progress [ ] Completed [ ] Blocked
- Assigned To: 
- Start Date: 
- Due Date: 
- Completion Date: 

PROGRESS TRACKING
- Progress: ___%
- Current Phase: 
- Blockers: 
- Notes: 

VERIFICATION
- Verified: [ ] Yes [ ] No
- Verification Date: 
- Verified By: 

================================================================================
END OF TEMPLATES
================================================================================
`;

                const blob = new Blob([templates], { type: 'text/plain' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `Remediation-Templates-${new Date().toISOString().split('T')[0]}.txt`;
                a.click();
                URL.revokeObjectURL(url);
              }}
            >
              Download Remediation Templates
              <Download className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AssessmentGuide;