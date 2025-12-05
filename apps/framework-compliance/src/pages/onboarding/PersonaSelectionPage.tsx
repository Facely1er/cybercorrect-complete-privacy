import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { 
  User, 
  Briefcase, 
  Users, 
  Shield, 
  ArrowRight,
  CheckCircle,
  Clock,
  Database,
  Scale,
  CheckSquare
} from 'lucide-react';
import { usePersona } from '../../contexts/PersonaContext';
import { getAllPersonas } from '../../types/personas';

interface PersonaOption {
  id: string;
  name: string;
  displayName: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  estimatedTime: string;
  features: string[];
  regulations: string[];
}

const personaIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  'privacy_officer': Shield,
  'data_steward': Database,
  'legal_counsel': Scale,
  'compliance_manager': CheckSquare
};

export function PersonaSelectionPage() {
  const [selectedPersona, setSelectedPersona] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { switchPersona, hasCompletedOnboarding, setSelectedPersona: setPersonaInContext } = usePersona();
  const allPersonas = getAllPersonas();

  const personaOptions: PersonaOption[] = allPersonas.map(persona => ({
    id: persona.id,
    name: persona.name,
    displayName: persona.displayName,
    description: persona.description,
    icon: personaIcons[persona.id] || User,
    color: persona.color,
    estimatedTime: persona.estimatedTimeCommitment,
    features: persona.features.slice(0, 4).map(f => f.name),
    regulations: persona.regulations
  }));

  const handlePersonaSelect = (personaId: string) => {
    setSelectedPersona(personaId);
  };

  const handleContinue = async () => {
    if (!selectedPersona) return;

    setIsLoading(true);

    try {
      // Set persona in context
      switchPersona(selectedPersona);
      setPersonaInContext(selectedPersona);
      
      // Check if user has completed onboarding for this persona
      if (hasCompletedOnboarding(selectedPersona)) {
        // Skip onboarding and go directly to dashboard
        navigate('/dashboard');
      } else {
        // Start onboarding process
        navigate(`/onboarding/${selectedPersona}`);
      }
    } catch (error) {
      console.error('Error selecting persona:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getPersonaIcon = (persona: PersonaOption) => {
    const IconComponent = persona.icon;
    return <IconComponent className={`h-8 w-8 text-${persona.color}-600`} />;
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-4">
              Welcome to CyberCorrect Privacy Platform
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-400 mb-6">
              Please select your role to get started with personalized privacy compliance tools and guidance.
            </p>
            <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg max-w-2xl mx-auto">
              <p className="text-sm text-blue-700 dark:text-blue-300">
                <strong>Your privacy matters.</strong> This platform provides role-specific tools to help you manage 
                privacy compliance and protect personal data.
              </p>
            </div>
          </div>

          {/* Persona Selection Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {personaOptions.map((persona) => (
              <Card 
                key={persona.id}
                className={`p-6 cursor-pointer transition-all duration-200 hover:shadow-lg ${
                  selectedPersona === persona.id 
                    ? 'ring-2 ring-blue-500 bg-blue-50 dark:bg-blue-900/20' 
                    : 'hover:bg-gray-50 dark:hover:bg-gray-800'
                }`}
                onClick={() => handlePersonaSelect(persona.id)}
              >
                <div className="flex items-start space-x-4">
                  <div className={`p-3 rounded-lg bg-${persona.color}-100 dark:bg-${persona.color}-900/30`}>
                    {getPersonaIcon(persona)}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-lg font-semibold">{persona.displayName}</h3>
                      <Badge variant="secondary" className="text-xs">
                        <Clock className="h-3 w-3 mr-1" />
                        {persona.estimatedTime}
                      </Badge>
                    </div>
                    <p className="text-gray-600 dark:text-gray-400 mb-4 text-sm">
                      {persona.description}
                    </p>
                    
                    {/* Features */}
                    <div className="mb-4">
                      <h4 className="text-sm font-medium mb-2">Key Features:</h4>
                      <ul className="text-xs text-gray-600 dark:text-gray-400 space-y-1">
                        {persona.features.map((feature, index) => (
                          <li key={index} className="flex items-center">
                            <CheckCircle className="h-3 w-3 text-green-500 mr-2 flex-shrink-0" />
                            {feature}
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Regulations */}
                    <div className="flex flex-wrap gap-1">
                      {persona.regulations.slice(0, 4).map((regulation) => (
                        <Badge key={regulation} variant="secondary" className="text-xs">
                          {regulation}
                        </Badge>
                      ))}
                      {persona.regulations.length > 4 && (
                        <Badge variant="secondary" className="text-xs">
                          +{persona.regulations.length - 4} more
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>

                {/* Selection Indicator */}
                {selectedPersona === persona.id && (
                  <div className="absolute top-4 right-4">
                    <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                      <CheckCircle className="h-4 w-4 text-white" />
                    </div>
                  </div>
                )}
              </Card>
            ))}
          </div>

          {/* Continue Button */}
          <div className="text-center">
            <Button 
              onClick={handleContinue}
              disabled={!selectedPersona || isLoading}
              size="lg"
              className="px-8"
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Setting up your experience...
                </>
              ) : (
                <>
                  Continue to {selectedPersona ? personaOptions.find(p => p.id === selectedPersona)?.displayName : 'Dashboard'}
                  <ArrowRight className="h-4 w-4 ml-2" />
                </>
              )}
            </Button>
            
            {selectedPersona && (
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-4">
                You can change your role later in your profile settings.
              </p>
            )}
          </div>

          {/* Help Section */}
          <div className="mt-12 bg-gray-100 dark:bg-gray-800 p-6 rounded-lg">
            <h3 className="text-lg font-semibold mb-4">Need Help Choosing?</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <h4 className="font-medium mb-2">Privacy Officer / DPO:</h4>
                <p className="text-gray-600 dark:text-gray-400">
                  Choose <strong>Privacy Officer</strong> if you're responsible for overall privacy program oversight 
                  and compliance management.
                </p>
              </div>
              <div>
                <h4 className="font-medium mb-2">Data Steward / Compliance Manager:</h4>
                <p className="text-gray-600 dark:text-gray-400">
                  Choose <strong>Data Steward</strong> for data classification and retention, or <strong>Compliance Manager</strong> 
                  for assessments and evidence management.
                </p>
              </div>
              <div>
                <h4 className="font-medium mb-2">Legal Counsel:</h4>
                <p className="text-gray-600 dark:text-gray-400">
                  Choose <strong>Legal Counsel</strong> if you manage privacy policies, legal documents, and regulatory compliance.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


