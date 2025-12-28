import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { AlertTriangle, ExternalLink, Calendar, Database, Shield } from 'lucide-react';
import { Button } from '@/components/ui/Button';

interface Breach {
  id: string;
  date: string;
  title: string;
  company: string;
  description: string;
  recordsAffected: number;
  dataTypes: string[];
  source: {
    name: string;
    url: string;
  };
  severity: 'critical' | 'high' | 'medium' | 'low';
}

const SAMPLE_BREACHES: Breach[] = [
  {
    id: '1',
    date: '2024-12-15',
    title: 'Major Healthcare Provider - 2.3M Records',
    company: 'Healthcare Provider Inc.',
    description: 'Unauthorized access to electronic medical records affecting 2,347,829 individuals. Breach included names, SSNs, medical record numbers, diagnosis codes, and treatment information.',
    recordsAffected: 2347829,
    dataTypes: ['Names', 'SSN', 'Medical Records', 'Diagnosis Codes'],
    source: {
      name: 'HIPAA Breach Portal (HHS)',
      url: 'https://ocrportal.hhs.gov/ocr/breach/breach_report.jsf'
    },
    severity: 'critical'
  },
  {
    id: '2',
    date: '2024-12-10',
    title: 'Financial Services - Ransomware Attack',
    company: 'Financial Corp',
    description: 'Ransomware attack compromised customer financial data including account numbers, transaction history, and personal identification information affecting 890,000 customers.',
    recordsAffected: 890000,
    dataTypes: ['Account Numbers', 'Transaction History', 'PII'],
    source: {
      name: 'California Attorney General',
      url: 'https://oag.ca.gov/privacy/databreach/list'
    },
    severity: 'critical'
  },
  {
    id: '3',
    date: '2024-12-05',
    title: 'SaaS Platform - Database Misconfiguration',
    company: 'Tech Platform Inc.',
    description: 'Database misconfiguration exposed user email addresses, hashed passwords, and profile information. Company has reset all passwords and notified affected users.',
    recordsAffected: 1200000,
    dataTypes: ['Email', 'Hashed Passwords', 'Profile Data'],
    source: {
      name: 'Have I Been Pwned',
      url: 'https://haveibeenpwned.com/'
    },
    severity: 'high'
  },
  {
    id: '4',
    date: '2024-11-28',
    title: 'E-Commerce Retailer - Payment Card Skimming',
    company: 'Online Retailer LLC',
    description: 'Payment card skimming malware detected on checkout pages. Potentially affected customers\' payment card data, billing addresses, and purchase history over 3-month period.',
    recordsAffected: 450000,
    dataTypes: ['Payment Cards', 'Billing Addresses', 'Purchase History'],
    source: {
      name: 'Maine Attorney General',
      url: 'https://apps.web.maine.gov/online/aeviewer/'
    },
    severity: 'high'
  },
  {
    id: '5',
    date: '2024-11-20',
    title: 'Educational Institution - Phishing Attack',
    company: 'State University',
    description: 'Phishing attack led to unauthorized email account access. Compromised student and faculty data including names, email addresses, student IDs, and grade information.',
    recordsAffected: 67000,
    dataTypes: ['Names', 'Email', 'Student IDs', 'Grades'],
    source: {
      name: 'Vermont Attorney General',
      url: 'https://ago.vermont.gov/consumer-resources/data-security-breach-notices'
    },
    severity: 'medium'
  }
];

export function BreachIntelligenceTab() {
  const [breaches, setBreaches] = useState<Breach[]>(SAMPLE_BREACHES);
  const [filter, setFilter] = useState<'all' | 'critical' | 'high' | 'medium' | 'low'>('all');

  const filteredBreaches = filter === 'all' 
    ? breaches 
    : breaches.filter(b => b.severity === filter);

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'bg-destructive/10 text-destructive border-destructive';
      case 'high': return 'bg-warning/10 text-warning border-warning';
      case 'medium': return 'bg-warning/10 text-warning border-warning';
      case 'low': return 'bg-primary/10 text-primary border-primary';
      default: return 'bg-muted/10 text-muted-foreground border-muted';
    }
  };

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('en-US').format(num);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="space-y-4">
      {/* Header Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Breaches</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{breaches.length}</div>
            <p className="text-xs text-muted-foreground mt-1">Last 90 days</p>
          </CardContent>
        </Card>

        <Card className="border-destructive/50">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-destructive">Critical Breaches</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">
              {breaches.filter(b => b.severity === 'critical').length}
            </div>
            <p className="text-xs text-muted-foreground mt-1">Require immediate attention</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Records Affected</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatNumber(breaches.reduce((sum, b) => sum + b.recordsAffected, 0))}
            </div>
            <p className="text-xs text-muted-foreground mt-1">Total individuals</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Data Sources</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">5</div>
            <p className="text-xs text-muted-foreground mt-1">Active monitoring</p>
          </CardContent>
        </Card>
      </div>

      {/* Filter Buttons */}
      <div className="flex gap-2 flex-wrap">
        <Button
          onClick={() => setFilter('all')}
          variant={filter === 'all' ? 'default' : 'outline'}
          size="sm"
        >
          All Breaches
        </Button>
        <Button
          onClick={() => setFilter('critical')}
          variant={filter === 'critical' ? 'destructive' : 'outline'}
          size="sm"
        >
          <AlertTriangle className="h-4 w-4 mr-1" />
          Critical
        </Button>
        <Button
          onClick={() => setFilter('high')}
          variant={filter === 'high' ? 'default' : 'outline'}
          size="sm"
        >
          High
        </Button>
        <Button
          onClick={() => setFilter('medium')}
          variant={filter === 'medium' ? 'default' : 'outline'}
          size="sm"
        >
          Medium
        </Button>
        <Button
          onClick={() => setFilter('low')}
          variant={filter === 'low' ? 'default' : 'outline'}
          size="sm"
        >
          Low
        </Button>
      </div>

      {/* Breach Timeline */}
      <div className="relative space-y-4">
        {/* Timeline line */}
        <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-border" />

        {filteredBreaches.map((breach, index) => (
          <Card 
            key={breach.id}
            className={`relative ml-16 ${
              breach.severity === 'critical' ? 'border-l-4 border-l-destructive' :
              breach.severity === 'high' ? 'border-l-4 border-l-warning' :
              ''
            }`}
          >
            {/* Timeline dot */}
            <div 
              className={`absolute -left-20 top-6 w-4 h-4 rounded-full border-4 ${
                breach.severity === 'critical' ? 'bg-destructive border-destructive' :
                breach.severity === 'high' ? 'bg-warning border-warning' :
                breach.severity === 'medium' ? 'bg-warning border-warning' :
                'bg-primary border-primary'
              }`}
            />

            <CardHeader>
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground font-medium">
                      {formatDate(breach.date)}
                    </span>
                  </div>
                  <CardTitle className="text-lg mb-2">{breach.title}</CardTitle>
                  <div className="flex items-center gap-2 mb-3">
                    <Badge className={getSeverityColor(breach.severity)}>
                      {breach.severity.toUpperCase()}
                    </Badge>
                    <Badge variant="outline" className="flex items-center gap-1">
                      <Database className="h-3 w-3" />
                      {formatNumber(breach.recordsAffected)} records
                    </Badge>
                  </div>
                </div>
              </div>
            </CardHeader>

            <CardContent className="space-y-4">
              <p className="text-muted-foreground leading-relaxed">
                {breach.description}
              </p>

              {/* Data Types Affected */}
              <div>
                <span className="text-sm font-medium text-foreground">Data Types Affected:</span>
                <div className="flex gap-2 mt-2 flex-wrap">
                  {breach.dataTypes.map((type, idx) => (
                    <Badge key={idx} variant="secondary" className="text-xs">
                      {type}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Source */}
              <div className="flex items-center justify-between pt-2 border-t">
                <div className="flex items-center gap-2 text-sm">
                  <Shield className="h-4 w-4 text-primary" />
                  <span className="text-muted-foreground">Source:</span>
                  <span className="font-medium text-primary">{breach.source.name}</span>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  asChild
                >
                  <a 
                    href={breach.source.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center gap-1"
                  >
                    View Source
                    <ExternalLink className="h-3 w-3" />
                  </a>
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredBreaches.length === 0 && (
        <Card>
          <CardContent className="py-12 text-center">
            <AlertTriangle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No Breaches Found</h3>
            <p className="text-muted-foreground">
              No breaches match the selected severity filter.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

