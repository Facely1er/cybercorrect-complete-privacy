import { useState } from 'react';
import { 
  Users, 
  UserCheck, 
  Shield, 
  Scale, 
  Check, 
  ArrowRight, 
  DollarSign, 
  Palette, 
  Zap, 
  Target, 
  Award
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/Label';
import { Textarea } from '@/components/ui/Textarea';
import { Checkbox } from '@/components/ui/Checkbox';

export default function PortalBetaProgram() {
  const [showApplicationForm, setShowApplicationForm] = useState(false);
  const [formData, setFormData] = useState({
    companyName: '',
    industry: '',
    companySize: '',
    contactName: '',
    contactEmail: '',
    contactRole: '',
    phone: '',
    website: '',
    primaryCohort: '',
    stakeholderEmployees: false,
    stakeholderHR: false,
    stakeholderCompliance: false,
    stakeholderLegal: false,
    employeeCount: '',
    hrCount: '',
    complianceCount: '',
    legalCount: '',
    whiteLabelInterest: '',
    feedbackCommitment: false,
    monthlyCallsCommitment: false,
    surveyCommitment: false,
    whyJoin: '',
    currentPlatform: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement actual submission to backend
    // Form data ready for submission: formData
    alert('Thank you for your application! We\'ll review and contact you within 48 hours.');
    setShowApplicationForm(false);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-br from-amber-50 to-orange-50">
        <div className="container mx-auto max-w-5xl text-center px-4">
          <div className="inline-flex items-center gap-2 bg-amber-400 text-amber-900 px-4 py-2 rounded-full text-sm font-bold mb-6">
            <Users className="h-4 w-4" />
            BUILD IT WITH US: Multistakeholder Beta Program
          </div>
          
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            Shape Privacy Portal<br />
            <span className="text-amber-600">From Your Stakeholders' Perspective</span>
          </h1>
          
          <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
            We're building Privacy Portal with real employees, HR teams, compliance officers,
            and legal representatives. Join our beta to shape features for YOUR stakeholders—
            and lock in white-label pricing forever.
          </p>

          {/* Multistakeholder Value Props */}
          <div className="grid md:grid-cols-4 gap-6 mb-8">
            {[
              {
                icon: Users,
                role: 'Employee Testers',
                count: '250+',
                contribution: 'Build rights exercise features'
              },
              {
                icon: UserCheck,
                role: 'HR Professionals',
                count: '75+',
                contribution: 'Build duty tracking features'
              },
              {
                icon: Shield,
                role: 'Compliance Officers',
                count: '50+',
                contribution: 'Build oversight features'
              },
              {
                icon: Scale,
                role: 'Legal Representatives',
                count: '25+',
                contribution: 'Build authorized access'
              }
            ].map((stakeholder, idx) => (
              <Card key={idx} className="p-6 text-center border-2 border-amber-300">
                <stakeholder.icon className="h-10 w-10 text-amber-600 mx-auto mb-3" />
                <div className="text-2xl font-bold text-amber-700 mb-1">{stakeholder.count}</div>
                <div className="font-semibold text-sm mb-2">{stakeholder.role}</div>
                <div className="text-xs text-muted-foreground">{stakeholder.contribution}</div>
              </Card>
            ))}
          </div>

          <Button 
            size="lg" 
            className="bg-amber-500 hover:bg-amber-600 text-white px-8"
            onClick={() => setShowApplicationForm(true)}
          >
            Apply for Beta Program
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
          <p className="text-sm text-muted-foreground mt-4">
            Limited to 100 organizations • 4 cohorts of 25 • Beta pricing locked forever
          </p>
        </div>
      </section>

      {/* Beta Benefits - White Label Focused */}
      <section className="py-16 bg-white">
        <div className="container mx-auto max-w-6xl px-4">
          <h2 className="text-3xl font-bold text-center mb-12">
            Beta Benefits: Co-Create + White-Label Ready
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: DollarSign,
                title: 'Lock In Beta Pricing Forever',
                description: 'Standard: +$99/mo, Branded: +$149/mo, White-Label: +$249/mo',
                value: 'Up to 50% off forever'
              },
              {
                icon: Users,
                title: 'Shape Features for YOUR Stakeholders',
                description: 'Your employees, HR, compliance teams help build Portal',
                value: 'Built from real input'
              },
              {
                icon: Palette,
                title: 'Early White-Label Access',
                description: 'Beta participants get priority white-label access & discounts',
                value: 'Your brand, your workforce'
              },
              {
                icon: Zap,
                title: 'Direct Founder Access',
                description: 'Monthly calls, Slack access, priority feature requests',
                value: 'VIP support'
              },
              {
                icon: Target,
                title: 'Multistakeholder Testing',
                description: 'Test with multiple roles in your organization simultaneously',
                value: 'Complete validation'
              },
              {
                icon: Award,
                title: 'Reseller Program Priority',
                description: 'Active beta participants get priority access to reseller licensing',
                value: 'Revenue opportunity'
              }
            ].map((benefit, idx) => (
              <Card key={idx} className="p-6">
                <benefit.icon className="h-8 w-8 text-amber-600 mb-4" />
                <h3 className="font-bold mb-2">{benefit.title}</h3>
                <p className="text-sm text-muted-foreground mb-3">{benefit.description}</p>
                <Badge variant="default" className="text-xs bg-green-100 text-green-700">{benefit.value}</Badge>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Cohort Structure */}
      <section className="py-16 bg-gradient-to-br from-blue-50 to-teal-50">
        <div className="container mx-auto max-w-6xl px-4">
          <h2 className="text-3xl font-bold text-center mb-4">
            Beta Cohort Structure
          </h2>
          <p className="text-center text-muted-foreground mb-12 max-w-3xl mx-auto">
            We're dividing our 100 beta organizations into 4 cohorts, each focused on building
            features for a specific stakeholder type. Your organization helps shape the Portal
            features YOUR team needs most.
          </p>

          <div className="grid md:grid-cols-2 gap-6">
            {[
              {
                cohort: 'Cohort A',
                icon: Users,
                focus: 'Employee-Focused Features',
                orgs: '25 organizations',
                testers: '5-10 employees per org (125-250 total)',
                builds: [
                  'Data access request flow',
                  'Correction request workflow',
                  'Deletion request process',
                  'Privacy preference management',
                  'Employee self-service portal'
                ],
                timeline: 'Month 1',
                color: 'blue'
              },
              {
                cohort: 'Cohort B',
                icon: UserCheck,
                focus: 'HR & Manager Features',
                orgs: '25 organizations',
                testers: '2-3 HR staff per org (50-75 total)',
                builds: [
                  'Privacy duty dashboard',
                  'Request processing workflows',
                  'Incident reporting tools',
                  'Consent management interface',
                  'HR compliance guidelines'
                ],
                timeline: 'Month 2',
                color: 'green'
              },
              {
                cohort: 'Cohort C',
                icon: Shield,
                focus: 'Compliance & Oversight Features',
                orgs: '25 organizations',
                testers: '1-2 compliance officers per org (25-50 total)',
                builds: [
                  'Executive oversight dashboard',
                  'Request monitoring system',
                  'Compliance analytics',
                  'Audit report generation',
                  'Stakeholder access management'
                ],
                timeline: 'Month 3',
                color: 'purple'
              },
              {
                cohort: 'Cohort D',
                icon: Scale,
                focus: 'Representative & Legal Features',
                orgs: '25 organizations',
                testers: 'Legal reps & authorized parties (25+ total)',
                builds: [
                  'Authorized representative portal',
                  'Verification workflows',
                  'Request submission system',
                  'Status tracking interface',
                  'Secure communication channels'
                ],
                timeline: 'Month 4',
                color: 'amber'
              }
            ].map((cohort, idx) => (
              <Card key={idx} className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className={`p-3 rounded-lg bg-${cohort.color}-100`}>
                      <cohort.icon className={`h-6 w-6 text-${cohort.color}-600`} />
                    </div>
                    <div>
                      <h3 className="font-bold">{cohort.cohort}</h3>
                      <p className="text-sm text-muted-foreground">{cohort.timeline}</p>
                    </div>
                  </div>
                  <Badge variant="info">{cohort.orgs}</Badge>
                </div>
                
                <h4 className="font-semibold mb-2">{cohort.focus}</h4>
                <p className="text-sm text-muted-foreground mb-4">{cohort.testers}</p>
                
                <div className="space-y-2">
                  <p className="text-sm font-semibold">We'll Build Together:</p>
                  <ul className="text-sm space-y-1">
                    {cohort.builds.map((item, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <Check className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </Card>
            ))}
          </div>

          <Card className="mt-8 p-6 bg-white">
            <h3 className="font-bold mb-3 text-center">Cross-Testing Phase (Month 5)</h3>
            <p className="text-sm text-muted-foreground text-center">
              All 100 organizations test the complete Portal with multi-role workflows,
              ensuring seamless integration across all stakeholder types before production launch.
            </p>
          </Card>
        </div>
      </section>

      {/* White-Label Preview */}
      <section className="py-16 bg-white">
        <div className="container mx-auto max-w-6xl px-4">
          <h2 className="text-3xl font-bold text-center mb-4">
            Built for White-Label
          </h2>
          <p className="text-center text-muted-foreground mb-12 max-w-3xl mx-auto">
            Portal's multistakeholder nature makes it perfect for white-labeling.
            Brand it for your workforce or resell to clients.
          </p>

          <div className="grid md:grid-cols-3 gap-6">
            {/* Standard */}
            <Card>
              <CardHeader>
                <CardTitle>Standard Portal</CardTitle>
                <CardDescription>CyberCorrect branded</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="border rounded-lg p-4 mb-4 bg-gradient-to-br from-gray-50 to-gray-100">
                  <div className="flex items-center gap-2 mb-3">
                    <Shield className="h-5 w-5 text-primary" />
                    <span className="font-semibold text-sm">CyberCorrect Portal</span>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    [company].portal.cybercorrect.com
                  </div>
                </div>
                <div className="text-3xl font-bold mb-2">+$99<span className="text-sm text-muted-foreground">/mo</span></div>
                <div className="text-xs text-muted-foreground mb-4">Beta pricing (vs $199/mo regular)</div>
                <ul className="text-sm space-y-2">
                  <li className="flex items-start gap-2">
                    <Check className="h-4 w-4 text-green-600 mt-0.5" />
                    <span>All Portal features</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="h-4 w-4 text-green-600 mt-0.5" />
                    <span>CyberCorrect branding</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="h-4 w-4 text-green-600 mt-0.5" />
                    <span>Standard subdomain</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="h-4 w-4 text-green-600 mt-0.5" />
                    <span>Shape features with feedback</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            {/* Branded */}
            <Card className="border-2 border-primary relative">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                <Badge className="bg-blue-600 text-white">POPULAR</Badge>
              </div>
              <CardHeader>
                <CardTitle>Branded Portal</CardTitle>
                <CardDescription>Your logo & colors</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="border rounded-lg p-4 mb-4 bg-gradient-to-br from-blue-50 to-teal-50">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-5 h-5 bg-gradient-to-br from-blue-500 to-teal-500 rounded"></div>
                    <span className="font-semibold text-sm">Your Company Portal</span>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    portal.yourcompany.com
                  </div>
                </div>
                <div className="text-3xl font-bold mb-2">+$149<span className="text-sm text-muted-foreground">/mo</span></div>
                <div className="text-xs text-muted-foreground mb-4">Beta pricing (vs $299/mo regular)</div>
                <ul className="text-sm space-y-2">
                  <li className="flex items-start gap-2">
                    <Check className="h-4 w-4 text-green-600 mt-0.5" />
                    <span>All Standard features</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="h-4 w-4 text-green-600 mt-0.5" />
                    <span>Your company logo & colors</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="h-4 w-4 text-green-600 mt-0.5" />
                    <span>Custom domain support</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="h-4 w-4 text-green-600 mt-0.5" />
                    <span>Better workforce adoption</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            {/* White-Label */}
            <Card className="border-2 border-amber-400 relative">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                <Badge className="bg-amber-400 text-amber-900">WHITE-LABEL</Badge>
              </div>
              <CardHeader>
                <CardTitle>White-Label Portal</CardTitle>
                <CardDescription>100% your brand</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="border rounded-lg p-4 mb-4 bg-gradient-to-br from-amber-50 to-orange-50">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-5 h-5 bg-gradient-to-br from-amber-500 to-orange-500 rounded"></div>
                    <span className="font-semibold text-sm">Your Portal Name</span>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    yourportal.yourdomain.com
                  </div>
                </div>
                <div className="text-3xl font-bold mb-2">+$249<span className="text-sm text-muted-foreground">/mo</span></div>
                <div className="text-xs text-muted-foreground mb-4">Beta pricing (vs $499/mo regular)</div>
                <ul className="text-sm space-y-2">
                  <li className="flex items-start gap-2">
                    <Check className="h-4 w-4 text-green-600 mt-0.5" />
                    <span>All Branded features</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="h-4 w-4 text-green-600 mt-0.5" />
                    <span>100% your brand (no CyberCorrect)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="h-4 w-4 text-green-600 mt-0.5" />
                    <span>Fully custom domain</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="h-4 w-4 text-green-600 mt-0.5" />
                    <span>Perfect for MSPs & resellers</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>

          <div className="text-center mt-8">
            <p className="text-sm text-muted-foreground mb-4">
              Beta participants lock in these prices forever, even after Portal launches at 2x regular pricing
            </p>
            <Card className="inline-block p-6 bg-gradient-to-br from-purple-50 to-pink-50 border-2 border-purple-300">
              <h4 className="font-bold mb-2">Reseller License</h4>
              <p className="text-sm text-muted-foreground mb-3">
                Multi-tenant white-label for MSPs, consultancies, and HR tech companies
              </p>
              <Button variant="outline" size="sm">
                Contact Sales for Reseller Pricing
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Card>
          </div>
        </div>
      </section>

      {/* Beta Application Form */}
      {showApplicationForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 overflow-y-auto">
          <Card className="w-full max-w-3xl my-8">
            <CardHeader>
              <CardTitle>Privacy Portal Beta Application</CardTitle>
              <CardDescription>
                Join 100 organizations building Portal with multistakeholder input
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Company Information */}
                <div className="space-y-4">
                  <h3 className="font-semibold text-lg">Company Information</h3>
                  
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="companyName">Company Name *</Label>
                      <Input 
                        id="companyName" 
                        required
                        value={formData.companyName}
                        onChange={(e) => setFormData({...formData, companyName: e.target.value})}
                      />
                    </div>
                    <div>
                      <Label htmlFor="industry">Industry *</Label>
                      <Input 
                        id="industry" 
                        required
                        value={formData.industry}
                        onChange={(e) => setFormData({...formData, industry: e.target.value})}
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="companySize">Company Size *</Label>
                    <select 
                      id="companySize"
                      aria-label="Company Size"
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                      value={formData.companySize} 
                      onChange={(e) => setFormData({...formData, companySize: e.target.value})}
                      required
                    >
                      <option value="">Select company size</option>
                      <option value="1-10">1-10 employees</option>
                      <option value="11-50">11-50 employees</option>
                      <option value="51-200">51-200 employees</option>
                      <option value="201-500">201-500 employees</option>
                      <option value="501+">501+ employees</option>
                    </select>
                  </div>
                </div>

                {/* Contact Information */}
                <div className="space-y-4">
                  <h3 className="font-semibold text-lg">Contact Information</h3>
                  
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="contactName">Your Name *</Label>
                      <Input 
                        id="contactName" 
                        required
                        value={formData.contactName}
                        onChange={(e) => setFormData({...formData, contactName: e.target.value})}
                      />
                    </div>
                    <div>
                      <Label htmlFor="contactRole">Your Role *</Label>
                      <Input 
                        id="contactRole" 
                        required
                        value={formData.contactRole}
                        onChange={(e) => setFormData({...formData, contactRole: e.target.value})}
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="contactEmail">Email *</Label>
                      <Input 
                        id="contactEmail" 
                        type="email"
                        required
                        value={formData.contactEmail}
                        onChange={(e) => setFormData({...formData, contactEmail: e.target.value})}
                      />
                    </div>
                    <div>
                      <Label htmlFor="phone">Phone</Label>
                      <Input 
                        id="phone"
                        value={formData.phone}
                        onChange={(e) => setFormData({...formData, phone: e.target.value})}
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="website">Company Website</Label>
                    <Input 
                      id="website"
                      type="url"
                      value={formData.website}
                      onChange={(e) => setFormData({...formData, website: e.target.value})}
                    />
                  </div>
                </div>

                {/* Cohort Selection */}
                <div className="space-y-4">
                  <h3 className="font-semibold text-lg">Primary Cohort Interest</h3>
                  <p className="text-sm text-muted-foreground">
                    Which stakeholder group can your organization provide for testing?
                  </p>
                  
                  <Label htmlFor="primaryCohort" className="sr-only">Primary Cohort</Label>
                  <select 
                    id="primaryCohort"
                    aria-label="Primary Cohort Interest"
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    value={formData.primaryCohort} 
                    onChange={(e) => setFormData({...formData, primaryCohort: e.target.value})}
                  >
                    <option value="">Select primary cohort</option>
                    <option value="employee">Cohort A: Employee Features (need 5-10 employees)</option>
                    <option value="hr">Cohort B: HR Features (need 2-3 HR staff)</option>
                    <option value="compliance">Cohort C: Compliance Features (need 1-2 officers)</option>
                    <option value="legal">Cohort D: Legal/Rep Features (need legal reps)</option>
                    <option value="multiple">Multiple Cohorts (comprehensive testing)</option>
                  </select>
                </div>

                {/* Stakeholder Availability */}
                <div className="space-y-4">
                  <h3 className="font-semibold text-lg">Stakeholder Testing Availability</h3>
                  <p className="text-sm text-muted-foreground">
                    Which stakeholders can you provide for testing? (Check all that apply)
                  </p>
                  
                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <Checkbox 
                        id="stakeholderEmployees"
                        checked={formData.stakeholderEmployees}
                        onChange={(e) => setFormData({...formData, stakeholderEmployees: e.target.checked})}
                      />
                      <div className="flex-1">
                        <Label htmlFor="stakeholderEmployees" className="font-normal cursor-pointer">
                          Employees (5-10 people to test employee features)
                        </Label>
                        {formData.stakeholderEmployees && (
                          <Input 
                            placeholder="How many employees can test?" 
                            className="mt-2"
                            value={formData.employeeCount}
                            onChange={(e) => setFormData({...formData, employeeCount: e.target.value})}
                          />
                        )}
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <Checkbox 
                        id="stakeholderHR"
                        checked={formData.stakeholderHR}
                        onChange={(e) => setFormData({...formData, stakeholderHR: e.target.checked})}
                      />
                      <div className="flex-1">
                        <Label htmlFor="stakeholderHR" className="font-normal cursor-pointer">
                          HR/Manager Staff (2-3 people to test HR features)
                        </Label>
                        {formData.stakeholderHR && (
                          <Input 
                            placeholder="How many HR staff can test?" 
                            className="mt-2"
                            value={formData.hrCount}
                            onChange={(e) => setFormData({...formData, hrCount: e.target.value})}
                          />
                        )}
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <Checkbox 
                        id="stakeholderCompliance"
                        checked={formData.stakeholderCompliance}
                        onChange={(e) => setFormData({...formData, stakeholderCompliance: e.target.checked})}
                      />
                      <div className="flex-1">
                        <Label htmlFor="stakeholderCompliance" className="font-normal cursor-pointer">
                          Compliance Officers (1-2 people to test oversight features)
                        </Label>
                        {formData.stakeholderCompliance && (
                          <Input 
                            placeholder="How many compliance officers can test?" 
                            className="mt-2"
                            value={formData.complianceCount}
                            onChange={(e) => setFormData({...formData, complianceCount: e.target.value})}
                          />
                        )}
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <Checkbox 
                        id="stakeholderLegal"
                        checked={formData.stakeholderLegal}
                        onChange={(e) => setFormData({...formData, stakeholderLegal: e.target.checked})}
                      />
                      <div className="flex-1">
                        <Label htmlFor="stakeholderLegal" className="font-normal cursor-pointer">
                          Legal Representatives (external authorized parties)
                        </Label>
                        {formData.stakeholderLegal && (
                          <Input 
                            placeholder="How many legal reps can test?" 
                            className="mt-2"
                            value={formData.legalCount}
                            onChange={(e) => setFormData({...formData, legalCount: e.target.value})}
                          />
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* White-Label Interest */}
                <div className="space-y-4">
                  <h3 className="font-semibold text-lg">White-Label Interest</h3>
                  
                  <Label htmlFor="whiteLabelInterest" className="sr-only">White Label Interest</Label>
                  <select 
                    id="whiteLabelInterest"
                    aria-label="White Label Interest"
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    value={formData.whiteLabelInterest} 
                    onChange={(e) => setFormData({...formData, whiteLabelInterest: e.target.value})}
                  >
                    <option value="">Are you interested in white-labeling Portal?</option>
                    <option value="yes-workforce">Yes, for our workforce (internal use)</option>
                    <option value="yes-reseller">Yes, to resell to clients (MSP/consultancy)</option>
                    <option value="maybe">Maybe, want to learn more</option>
                    <option value="no">No, standard branding is fine</option>
                  </select>
                </div>

                {/* Feedback Commitment */}
                <div className="space-y-4">
                  <h3 className="font-semibold text-lg">Feedback Commitment</h3>
                  <p className="text-sm text-muted-foreground">
                    Beta participation requires active feedback. Can you commit to:
                  </p>
                  
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <Checkbox 
                        id="monthlyCallsCommitment"
                        checked={formData.monthlyCallsCommitment}
                        onChange={(e) => setFormData({...formData, monthlyCallsCommitment: e.target.checked})}
                      />
                      <Label htmlFor="monthlyCallsCommitment" className="font-normal cursor-pointer">
                        Monthly feedback calls with founders (required)
                      </Label>
                    </div>

                    <div className="flex items-center gap-3">
                      <Checkbox 
                        id="surveyCommitment"
                        checked={formData.surveyCommitment}
                        onChange={(e) => setFormData({...formData, surveyCommitment: e.target.checked})}
                      />
                      <Label htmlFor="surveyCommitment" className="font-normal cursor-pointer">
                        Bi-weekly stakeholder surveys (required)
                      </Label>
                    </div>

                    <div className="flex items-center gap-3">
                      <Checkbox 
                        id="feedbackCommitment"
                        checked={formData.feedbackCommitment}
                        onChange={(e) => setFormData({...formData, feedbackCommitment: e.target.checked})}
                      />
                      <Label htmlFor="feedbackCommitment" className="font-normal cursor-pointer">
                        Active in-app feedback and feature testing (required)
                      </Label>
                    </div>
                  </div>
                </div>

                {/* Why Join */}
                <div className="space-y-4">
                  <h3 className="font-semibold text-lg">Why Join Beta?</h3>
                  <Textarea 
                    placeholder="Tell us why you want to join the beta program and what you hope to achieve..."
                    rows={4}
                    value={formData.whyJoin}
                    onChange={(e) => setFormData({...formData, whyJoin: e.target.value})}
                  />
                </div>

                {/* Current Platform */}
                <div className="space-y-4">
                  <h3 className="font-semibold text-lg">Current CyberCorrect Platform Tier</h3>
                  <Label htmlFor="currentPlatform" className="sr-only">Current Platform Tier</Label>
                  <select 
                    id="currentPlatform"
                    aria-label="Current CyberCorrect Platform Tier"
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    value={formData.currentPlatform} 
                    onChange={(e) => setFormData({...formData, currentPlatform: e.target.value})}
                  >
                    <option value="">Are you a current Platform user?</option>
                    <option value="free">Free tier</option>
                    <option value="starter">Starter ($99/mo)</option>
                    <option value="professional">Professional ($399/mo)</option>
                    <option value="enterprise">Enterprise (custom)</option>
                    <option value="not-yet">Not yet (interested in Platform + Portal)</option>
                  </select>
                </div>

                {/* Submit */}
                <div className="flex gap-3 pt-4">
                  <Button type="submit" className="flex-1">
                    Submit Application
                  </Button>
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => setShowApplicationForm(false)}
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      )}

      {/* FAQ / Timeline */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto max-w-4xl px-4">
          <h2 className="text-3xl font-bold text-center mb-12">
            Beta Program Timeline
          </h2>

          <div className="space-y-6">
            {[
              {
                month: 'Month 1',
                cohort: 'Cohort A: Employee Features',
                activities: [
                  'Onboard 25 organizations',
                  '125-250 employees test employee portal',
                  'Build: Data rights, corrections, deletions, preferences',
                  'Weekly feedback synthesis'
                ]
              },
              {
                month: 'Month 2',
                cohort: 'Cohort B: HR Features',
                activities: [
                  'Onboard 25 organizations',
                  '50-75 HR staff test HR dashboard',
                  'Build: Duty tracking, request processing, consent management',
                  'Integrate with employee features'
                ]
              },
              {
                month: 'Month 3',
                cohort: 'Cohort C: Compliance Features',
                activities: [
                  'Onboard 25 organizations',
                  '25-50 compliance officers test oversight',
                  'Build: Analytics, monitoring, audit reports',
                  'White-label beta testing begins'
                ]
              },
              {
                month: 'Month 4',
                cohort: 'Cohort D: Legal/Rep Features',
                activities: [
                  'Onboard 25 organizations',
                  '25+ legal reps test external access',
                  'Build: Verification, authorized requests, secure comms',
                  'Complete feature set integration'
                ]
              },
              {
                month: 'Month 5',
                cohort: 'Cross-Cohort Integration Testing',
                activities: [
                  'All 100 orgs test complete Portal',
                  'Multi-role workflow validation',
                  'White-label production testing',
                  'Performance & security audits'
                ]
              },
              {
                month: 'Month 6',
                cohort: 'Production Launch',
                activities: [
                  'Portal exits beta, launches at $199/$299/$499/mo',
                  'Beta participants keep locked pricing forever',
                  'Reseller program opens',
                  'Public launch & marketing'
                ]
              }
            ].map((phase, idx) => (
              <Card key={idx} className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="font-bold text-lg">{phase.month}</h3>
                    <p className="text-sm text-muted-foreground">{phase.cohort}</p>
                  </div>
                  <Badge variant="info">{`Phase ${idx + 1}`}</Badge>
                </div>
                <ul className="space-y-2">
                  {phase.activities.map((activity, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm">
                      <Check className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                      <span>{activity}</span>
                    </li>
                  ))}
                </ul>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 bg-gradient-to-br from-amber-50 to-orange-50">
        <div className="container mx-auto max-w-4xl text-center px-4">
          <h2 className="text-4xl font-bold mb-6">
            Ready to Shape Privacy Portal?
          </h2>
          <p className="text-xl text-muted-foreground mb-8">
            Limited to 100 organizations • Lock in beta pricing forever • White-label access
          </p>

          <Card className="p-8 bg-white border-2 border-amber-400 mb-8">
            <h3 className="text-xl font-bold mb-4">Beta Participant Benefits Summary</h3>
            <div className="grid md:grid-cols-2 gap-4 text-left">
              {[
                '50% off forever (even white-label)',
                'Shape features for YOUR stakeholders',
                'Free upgrade: Standard → Branded',
                'Priority reseller program access',
                'Direct founder access & VIP support',
                'Lock pricing before 2x increase'
              ].map((benefit, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <Check className="h-5 w-5 text-green-600" />
                  <span className="text-sm">{benefit}</span>
                </div>
              ))}
            </div>
          </Card>

          <Button 
            size="lg" 
            className="bg-amber-500 hover:bg-amber-600 text-white px-8 text-lg"
            onClick={() => setShowApplicationForm(true)}
          >
            Apply for Beta Program
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
          <p className="text-sm text-muted-foreground mt-4">
            Applications reviewed within 48 hours • Selection based on stakeholder availability
          </p>
        </div>
      </section>
    </div>
  );
}

