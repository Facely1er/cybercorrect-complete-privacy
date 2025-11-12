import React from 'react';
import { Card, CardContent } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowRight,
  CheckCircle,
  ArrowLeft,
  AlertTriangle,
  Clock
} from 'lucide-react';

const IncidentResponseGuide = () => {
  const navigate = useNavigate();

  return (
    <div className="py-20">
      <div className="max-w-7xl mx-auto px-6">
        <Button 
          variant="outline" 
          className="mb-8"
          onClick={() => navigate('/documentation')}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Documentation
        </Button>
        
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold mb-4 text-foreground">Privacy Incident Response Guide</h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Comprehensive guide to handling privacy incidents and data breaches
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Card className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <AlertTriangle className="h-12 w-12 text-primary mb-4" />
              <h3 className="text-xl font-semibold mb-2 text-foreground">Incident Classification</h3>
              <p className="text-muted-foreground mb-4">
                Learn how to classify and prioritize privacy incidents effectively.
              </p>
              <ul className="space-y-2 mb-6">
                <li className="flex items-center text-sm">
                  <CheckCircle className="h-4 w-4 text-primary mr-2 flex-shrink-0" />
                  <span>Incident severity levels</span>
                </li>
                <li className="flex items-center text-sm">
                  <CheckCircle className="h-4 w-4 text-primary mr-2 flex-shrink-0" />
                  <span>Data breach assessment</span>
                </li>
                <li className="flex items-center text-sm">
                  <CheckCircle className="h-4 w-4 text-primary mr-2 flex-shrink-0" />
                  <span>Risk evaluation criteria</span>
                </li>
              </ul>
              <Button 
                variant="outline" 
                className="w-full"
                onClick={() => navigate('/documentation/breach-response-guide')}
              >
                Learn Classification
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <Clock className="h-12 w-12 text-primary mb-4" />
              <h3 className="text-xl font-semibold mb-2 text-foreground">Response Timeline</h3>
              <p className="text-muted-foreground mb-4">
                Understand regulatory timeframes and response requirements.
              </p>
              <ul className="space-y-2 mb-6">
                <li className="flex items-center text-sm">
                  <CheckCircle className="h-4 w-4 text-primary mr-2 flex-shrink-0" />
                  <span>GDPR 72-hour notification</span>
                </li>
                <li className="flex items-center text-sm">
                  <CheckCircle className="h-4 w-4 text-primary mr-2 flex-shrink-0" />
                  <span>Individual notification requirements</span>
                </li>
                <li className="flex items-center text-sm">
                  <CheckCircle className="h-4 w-4 text-primary mr-2 flex-shrink-0" />
                  <span>Documentation deadlines</span>
                </li>
              </ul>
              <Button 
                variant="outline" 
                className="w-full"
                onClick={() => navigate('/documentation/breach-response-guide')}
              >
                View Timeline Requirements
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </CardContent>
          </Card>
        </div>

        <div className="mt-16 text-center">
          <h2 className="text-2xl font-bold mb-6 text-foreground">Privacy Incident Response Resources</h2>
          <p className="text-muted-foreground mb-8 max-w-3xl mx-auto">
            Access templates and tools for effective privacy incident response
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg"
              onClick={() => {
                const templates = `PRIVACY INCIDENT RESPONSE TEMPLATES

================================================================================
1. INCIDENT CLASSIFICATION MATRIX
================================================================================

SEVERITY LEVELS:
- LOW: Minimal impact, limited data affected, no special categories
- MEDIUM: Moderate impact, significant data affected, some risk
- HIGH: Severe impact, large-scale breach, special categories or high risk

CLASSIFICATION CRITERIA:
[ ] Number of individuals affected
[ ] Types of personal data involved
[ ] Special categories of data (if applicable)
[ ] Likelihood of harm
[ ] Severity of potential harm
[ ] Sensitivity of data
[ ] Context of processing

================================================================================
2. RESPONSE TIMELINE CHECKLIST
================================================================================

WITHIN 1 HOUR:
[ ] Contain the breach
[ ] Assess initial scope
[ ] Notify incident response team
[ ] Document initial findings

WITHIN 4 HOURS:
[ ] Complete initial assessment
[ ] Determine if breach is reportable
[ ] Begin detailed investigation
[ ] Notify management/DPO

WITHIN 24 HOURS:
[ ] Complete detailed assessment
[ ] Document all findings
[ ] Prepare notification if required
[ ] Implement remediation measures

WITHIN 72 HOURS (GDPR):
[ ] Notify supervisory authority (if required)
[ ] Complete notification form
[ ] Submit notification
[ ] Document notification

WITHIN REASONABLE TIME:
[ ] Notify affected individuals (if high risk)
[ ] Provide clear information
[ ] Offer support and guidance
[ ] Monitor for additional issues

================================================================================
3. BREACH ASSESSMENT FORM
================================================================================

INCIDENT ID: _____________________________
ASSESSMENT DATE: _____________________________
ASSESSOR: _____________________________

1. BREACH DETAILS
   - Date/time discovered:
   - Date/time occurred:
   - Method of discovery:
   - Current status:

2. DATA AFFECTED
   - Categories of personal data:
   - Special categories (if any):
   - Approximate number of records:
   - Approximate number of individuals:

3. CAUSE ANALYSIS
   - Root cause:
   - Contributing factors:
   - System/process involved:
   - Human error: [ ] Yes [ ] No
   - Technical failure: [ ] Yes [ ] No
   - Malicious activity: [ ] Yes [ ] No

4. RISK EVALUATION
   - Likelihood of harm: [ ] Low [ ] Medium [ ] High
   - Severity of potential harm: [ ] Low [ ] Medium [ ] High
   - Overall risk level: [ ] Low [ ] Medium [ ] High
   - Factors increasing risk:
   - Factors decreasing risk:

5. NOTIFICATION REQUIREMENTS
   - Supervisory authority: [ ] Required [ ] Not Required
   - Rationale:
   - Affected individuals: [ ] Required [ ] Not Required
   - Rationale:

6. REMEDIATION MEASURES
   - Immediate actions:
   - Short-term measures:
   - Long-term measures:
   - Preventive actions:

7. APPROVAL
   - DPO approval: [ ] Yes [ ] No
   - Management approval: [ ] Yes [ ] No
   - Signature: _____________________________
   - Date: _____________________________

================================================================================
4. RESPONSE PROCEDURE CHECKLIST
================================================================================

DETECTION & CONTAINMENT
[ ] Breach detected and reported
[ ] Immediate containment measures taken
[ ] Affected systems isolated
[ ] Evidence preserved
[ ] Initial documentation completed

ASSESSMENT & INVESTIGATION
[ ] Incident response team activated
[ ] Detailed investigation conducted
[ ] Root cause identified
[ ] Scope of breach determined
[ ] Risk assessment completed

NOTIFICATION
[ ] Decision made on notification requirements
[ ] Supervisory authority notified (if required)
[ ] Affected individuals notified (if required)
[ ] Internal stakeholders informed
[ ] All notifications documented

REMEDIATION
[ ] Immediate remediation measures implemented
[ ] Long-term fixes planned
[ ] Systems restored/updated
[ ] Security measures enhanced
[ ] Monitoring increased

FOLLOW-UP
[ ] Post-incident review conducted
[ ] Lessons learned documented
[ ] Procedures updated
[ ] Training provided
[ ] Monitoring continued

================================================================================
END OF TEMPLATES
================================================================================
`;

                const blob = new Blob([templates], { type: 'text/plain' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `Incident-Response-Templates-${new Date().toISOString().split('T')[0]}.txt`;
                a.click();
                URL.revokeObjectURL(url);
              }}
            >
              Download Response Templates
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
            <Button 
              size="lg" 
              variant="outline"
              onClick={() => navigate('/documentation/breach-response-guide')}
            >
              View Breach Procedures
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IncidentResponseGuide;