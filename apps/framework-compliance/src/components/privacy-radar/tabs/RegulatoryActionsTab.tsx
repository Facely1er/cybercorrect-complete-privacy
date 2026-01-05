import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { 
  Scale, 
  Building2, 
  DollarSign, 
  TrendingUp,
  Filter
} from 'lucide-react';

interface RegulatoryAction {
  id: string;
  date: string;
  company: string;
  regulator: string;
  violation: string;
  fine: {
    amount: number;
    currency: 'USD' | 'EUR' | 'GBP';
  };
  url?: string;
}

const REGULATORY_ACTIONS: RegulatoryAction[] = [
  {
    id: '1',
    date: '2024-12-01',
    company: 'Meta Platforms Inc.',
    regulator: 'EU GDPR (Ireland DPC)',
    violation: 'Unlawful processing of user data for targeted advertising without proper consent',
    fine: { amount: 390000000, currency: 'EUR' }
  },
  {
    id: '2',
    date: '2024-11-15',
    company: 'Amazon Europe',
    regulator: 'EU GDPR (Luxembourg)',
    violation: 'Non-compliance with transparency obligations and excessive data collection',
    fine: { amount: 746000000, currency: 'EUR' }
  },
  {
    id: '3',
    date: '2024-10-20',
    company: 'TikTok Inc.',
    regulator: 'UK Information Commissioner\'s Office',
    violation: 'Failure to adequately protect children\'s privacy and unlawful data processing',
    fine: { amount: 12700000, currency: 'GBP' }
  },
  {
    id: '4',
    date: '2024-10-10',
    company: 'Google LLC',
    regulator: 'French CNIL',
    violation: 'Cookie consent violations - failing to obtain valid consent before placing cookies',
    fine: { amount: 90000000, currency: 'EUR' }
  },
  {
    id: '5',
    date: '2024-09-15',
    company: 'Microsoft Corporation',
    regulator: 'EU GDPR (Multiple DPAs)',
    violation: 'Inadequate data protection measures and international data transfer violations',
    fine: { amount: 60000000, currency: 'EUR' }
  },
  {
    id: '6',
    date: '2024-09-01',
    company: 'Healthcare Services Corp',
    regulator: 'HHS Office for Civil Rights (US)',
    violation: 'HIPAA violations - unsecured PHI exposure affecting 780,000 individuals',
    fine: { amount: 4750000, currency: 'USD' }
  },
  {
    id: '7',
    date: '2024-08-12',
    company: 'National Retail Chain',
    regulator: 'California Attorney General',
    violation: 'CCPA violations - unauthorized sale of consumer data without opt-out mechanism',
    fine: { amount: 7500000, currency: 'USD' }
  },
  {
    id: '8',
    date: '2024-08-05',
    company: 'Financial Services Group',
    regulator: 'New York Department of Financial Services',
    violation: 'Inadequate cybersecurity controls and incident response procedures',
    fine: { amount: 5000000, currency: 'USD' }
  }
];

export function RegulatoryActionsTab() {
  const [actions] = useState<RegulatoryAction[]>(REGULATORY_ACTIONS);
  const [selectedRegulator, setSelectedRegulator] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<'date' | 'amount'>('date');

  const regulators = Array.from(new Set(actions.map(a => a.regulator)));

  const formatFullCurrency = (amount: number, currency: string) => {
    const symbol = currency === 'USD' ? '$' : currency === 'EUR' ? '€' : '£';
    return `${symbol}${amount.toLocaleString()}`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const filteredActions = selectedRegulator
    ? actions.filter(a => a.regulator === selectedRegulator)
    : actions;

  const sortedActions = [...filteredActions].sort((a, b) => {
    if (sortBy === 'date') {
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    }
    return b.fine.amount - a.fine.amount;
  });

  const totalFines = actions.reduce((sum, a) => {
    // Convert to USD for totaling (rough conversion)
    const usdAmount = a.fine.currency === 'EUR' ? a.fine.amount * 1.1 :
                     a.fine.currency === 'GBP' ? a.fine.amount * 1.27 :
                     a.fine.amount;
    return sum + usdAmount;
  }, 0);

  return (
    <div className="space-y-4">
      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Scale className="h-4 w-4" />
              Total Actions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{actions.length}</div>
            <p className="text-xs text-muted-foreground mt-1">In 2024</p>
          </CardContent>
        </Card>

        <Card className="border-destructive/50">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-destructive flex items-center gap-2">
              <DollarSign className="h-4 w-4" />
              Total Fines
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">
              ${(totalFines / 1000000000).toFixed(1)}B
            </div>
            <p className="text-xs text-muted-foreground mt-1">Combined penalties</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Building2 className="h-4 w-4" />
              Largest Fine
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">€746M</div>
            <p className="text-xs text-muted-foreground mt-1">Amazon Europe</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              Avg Fine
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${(totalFines / actions.length / 1000000).toFixed(1)}M
            </div>
            <p className="text-xs text-muted-foreground mt-1">Per action</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Sort */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1">
              <label className="text-sm font-medium mb-2 block">Filter by Regulator</label>
              <div className="flex gap-2 flex-wrap">
                <Button
                  onClick={() => setSelectedRegulator(null)}
                  variant={selectedRegulator === null ? 'default' : 'outline'}
                  size="sm"
                >
                  All Regulators
                </Button>
                {regulators.map(reg => (
                  <Button
                    key={reg}
                    onClick={() => setSelectedRegulator(reg)}
                    variant={selectedRegulator === reg ? 'default' : 'outline'}
                    size="sm"
                    className="text-xs"
                  >
                    {reg.length > 30 ? reg.substring(0, 27) + '...' : reg}
                  </Button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Sort By</label>
              <div className="flex gap-2">
                <Button
                  onClick={() => setSortBy('date')}
                  variant={sortBy === 'date' ? 'default' : 'outline'}
                  size="sm"
                >
                  Date
                </Button>
                <Button
                  onClick={() => setSortBy('amount')}
                  variant={sortBy === 'amount' ? 'default' : 'outline'}
                  size="sm"
                >
                  Amount
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Regulatory Actions Table */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-muted/50 border-b">
                <tr>
                  <th className="text-left p-4 text-sm font-semibold">Date</th>
                  <th className="text-left p-4 text-sm font-semibold">Company</th>
                  <th className="text-left p-4 text-sm font-semibold">Regulator</th>
                  <th className="text-left p-4 text-sm font-semibold">Violation</th>
                  <th className="text-right p-4 text-sm font-semibold">Fine Amount</th>
                </tr>
              </thead>
              <tbody>
                {sortedActions.map((action, index) => (
                  <tr 
                    key={action.id}
                    className={`border-b hover:bg-muted/30 transition-colors ${
                      index === sortedActions.length - 1 ? 'border-b-0' : ''
                    }`}
                  >
                    <td className="p-4 text-sm text-muted-foreground whitespace-nowrap">
                      {formatDate(action.date)}
                    </td>
                    <td className="p-4">
                      <span className="font-semibold text-foreground">{action.company}</span>
                    </td>
                    <td className="p-4 text-sm">
                      <Badge variant="secondary" className="text-xs">
                        {action.regulator}
                      </Badge>
                    </td>
                    <td className="p-4 text-sm text-muted-foreground max-w-md">
                      {action.violation}
                    </td>
                    <td className="p-4 text-right">
                      <span className="font-bold text-destructive text-base">
                        {formatFullCurrency(action.fine.amount, action.fine.currency)}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {sortedActions.length === 0 && (
        <Card>
          <CardContent className="py-12 text-center">
            <Filter className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No Actions Found</h3>
            <p className="text-muted-foreground">
              No regulatory actions match the selected filter.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

