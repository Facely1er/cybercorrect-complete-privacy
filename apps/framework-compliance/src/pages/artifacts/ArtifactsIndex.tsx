import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { FileText, Shield, ClipboardList, BarChart, FileCheck, AlertTriangle, UserCheck, Map, Lock, Cookie, Scale, FileWarning } from 'lucide-react';

interface Artifact {
  id: string;
  title: string;
  description: string;
  category: string;
  icon: React.ReactNode;
  route: string;
  product: string;
}

const artifacts: Artifact[] = [
  {
    id: 'dpia-generator',
    title: 'DPIA Generator Sample',
    description: 'Comprehensive Data Protection Impact Assessment template with risk assessment, mitigation measures, and compliance tracking.',
    category: 'Privacy Toolkit Pro',
    icon: <Shield className="w-6 h-6" />,
    route: '/artifacts/dpia-generator',
    product: 'privacy-toolkit-pro'
  },
  {
    id: 'breach-notification',
    title: 'Data Breach Notification Template',
    description: 'Complete GDPR Article 33/34 breach notification template with 72-hour compliance checklist and remediation tracking.',
    category: 'GDPR Complete Kit',
    icon: <AlertTriangle className="w-6 h-6" />,
    route: '/artifacts/breach-notification',
    product: 'gdpr-complete-kit'
  },
  {
    id: 'dsr-manager',
    title: 'Data Subject Rights Request Manager',
    description: 'Interactive DSR management interface with 30-day compliance tracking, request routing, and automated workflows.',
    category: 'GDPR Complete Kit',
    icon: <UserCheck className="w-6 h-6" />,
    route: '/artifacts/dsr-manager',
    product: 'gdpr-complete-kit'
  },
  {
    id: 'gap-analysis-report',
    title: 'Gap Analysis Report Sample',
    description: 'Comprehensive privacy gap analysis with compliance scoring, prioritized remediation roadmap, and framework mapping.',
    category: 'Compliance Assessment Suite',
    icon: <BarChart className="w-6 h-6" />,
    route: '/artifacts/gap-analysis-report',
    product: 'compliance-assessment-suite'
  },
  {
    id: 'compliance-roadmap',
    title: 'Compliance Roadmap Generator',
    description: 'Risk-based compliance roadmap with timeline tracking, priority levels, and milestone management.',
    category: 'Compliance Assessment Suite',
    icon: <Map className="w-6 h-6" />,
    route: '/artifacts/compliance-roadmap',
    product: 'compliance-assessment-suite'
  },
  {
    id: 'gap-analysis-worksheet',
    title: 'Gap Analysis Worksheet',
    description: 'Multi-framework gap analysis worksheets for NIST, ISO 27001, SOC 2, HIPAA, GDPR, CMMC, and PCI-DSS.',
    category: 'Compliance Framework Templates',
    icon: <ClipboardList className="w-6 h-6" />,
    route: '/artifacts/gap-analysis-worksheet',
    product: 'compliance-toolkit'
  },
  {
    id: 'evidence-checklist',
    title: 'Evidence Collection Checklist',
    description: 'Framework-specific evidence collection checklists with validation workflows and audit preparation guides.',
    category: 'Compliance Framework Templates',
    icon: <FileCheck className="w-6 h-6" />,
    route: '/artifacts/evidence-checklist',
    product: 'compliance-toolkit'
  }
];

const ArtifactsIndex: React.FC = () => {
  const categories = Array.from(new Set(artifacts.map(a => a.category)));

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-foreground mb-4">Artifact Documents</h1>
        <p className="text-lg text-foreground/80">
          Access complete artifact documents and templates for privacy compliance. Each artifact includes full content, export capabilities, and detailed documentation.
        </p>
      </div>

      {categories.map(category => (
        <div key={category} className="mb-8">
          <h2 className="text-2xl font-semibold text-foreground mb-4">{category}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {artifacts
              .filter(a => a.category === category)
              .map(artifact => (
                <Card key={artifact.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-center gap-3 mb-2">
                      <div className="p-2 bg-primary/10 rounded text-primary">
                        {artifact.icon}
                      </div>
                      <CardTitle className="text-xl">{artifact.title}</CardTitle>
                    </div>
                    <CardDescription>{artifact.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Link to={artifact.route}>
                      <Button className="w-full">
                        <FileText className="w-4 h-4 mr-2" />
                        View Full Document
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              ))}
          </div>
        </div>
      ))}

      <div className="mt-8 p-6 bg-muted/50 rounded-lg">
        <h3 className="text-lg font-semibold text-foreground mb-2">About Artifact Documents</h3>
        <p className="text-foreground/80">
          These artifact documents provide complete, production-ready templates and tools for privacy compliance. Each document includes:
        </p>
        <ul className="list-disc list-inside mt-3 space-y-1 text-foreground/80">
          <li>Full content and detailed sections</li>
          <li>PDF export capabilities</li>
          <li>Compliance checklists and validation</li>
          <li>Framework-specific requirements</li>
          <li>Best practices and guidance</li>
        </ul>
      </div>
    </div>
  );
};

export default ArtifactsIndex;

