/**
 * Onboarding Checklist Component
 * Phase 4 of onboarding flow - Product-specific onboarding (Checklist pattern)
 */

import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Check, Circle, ArrowRight, Target } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../../hooks/useSupabase';
import { OnboardingService, type OnboardingProgress } from '../../services/onboardingService';
import { supabase } from '../../lib/supabase';

interface ChecklistItem {
  id: string;
  title: string;
  description: string;
  route: string;
  completed: boolean;
}

export const OnboardingChecklist: React.FC = () => {
  const { user } = useUser();
  const navigate = useNavigate();
  const [checklist, setChecklist] = useState<ChecklistItem[]>([
    {
      id: 'create-data-inventory',
      title: 'Create Your Data Inventory',
      description: 'Document your data processing activities',
      route: '/privacy/data-inventory',
      completed: false,
    },
    {
      id: 'run-compliance-assessment',
      title: 'Run Compliance Assessment',
      description: 'Evaluate your organization\'s compliance posture',
      route: '/privacy/compliance-obligations',
      completed: false,
    },
    {
      id: 'setup-data-rights',
      title: 'Set Up Data Rights Portal',
      description: 'Configure automated data rights request handling',
      route: '/privacy/data-rights-portal',
      completed: false,
    },
    {
      id: 'explore-dashboard',
      title: 'Explore Your Dashboard',
      description: 'Review your privacy metrics and analytics',
      route: '/privacy/dashboard',
      completed: false,
    },
  ]);

  const checkCompletionStatus = useCallback(async () => {
    if (!user?.id) return;

    try {
      const progress: OnboardingProgress = await OnboardingService.getOnboardingProgress(user.id);
      
      setChecklist((prev) =>
        prev.map((item) => {
          switch (item.id) {
            case 'create-data-inventory':
              return { ...item, completed: progress.checklistItems.createDataInventory };
            case 'run-compliance-assessment':
              return { ...item, completed: progress.checklistItems.runComplianceAssessment };
            case 'setup-data-rights':
              return { ...item, completed: progress.checklistItems.setupDataRights };
            case 'explore-dashboard':
              return { ...item, completed: progress.checklistItems.exploreDashboard };
            default:
              return item;
          }
        })
      );
    } catch (error) {
      console.error('Error checking completion status:', error);
    }
  }, [user]);

  useEffect(() => {
    if (!user) return;
    checkCompletionStatus();
    
    // Check periodically for updates
    const interval = setInterval(checkCompletionStatus, 5000);
    return () => clearInterval(interval);
  }, [user, checkCompletionStatus]);

  const completedCount = checklist.filter((item) => item.completed).length;
  const progress = (completedCount / checklist.length) * 100;

  // Auto-mark onboarding as completed when all items are done
  useEffect(() => {
    const markComplete = async () => {
      if (completedCount === checklist.length && user?.id) {
        try {
          await OnboardingService.markOnboardingCompleted(user.id);
        } catch (error) {
          console.error('Error marking onboarding complete:', error);
        }
      }
    };

    markComplete();
  }, [completedCount, checklist.length, user?.id]);

  const handleItemClick = (route: string) => {
    navigate(route);
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Target className="h-5 w-5 text-primary mr-2" />
            <CardTitle>Getting Started Checklist</CardTitle>
          </div>
          <Badge className="bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300">
            {completedCount} of {checklist.length} completed
          </Badge>
        </div>
        <div className="mt-4">
          <div className="w-full bg-muted rounded-full h-2">
            <div
              className="bg-primary h-2 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {checklist.map((item) => (
            <div
              key={item.id}
              className={`flex items-start p-4 rounded-lg border-2 transition-all cursor-pointer ${
                item.completed
                  ? 'bg-green-50 dark:bg-green-900/10 border-green-200 dark:border-green-800'
                  : 'bg-muted/50 border-border hover:border-primary'
              }`}
              onClick={() => handleItemClick(item.route)}
            >
              <div className="flex-shrink-0 mr-4 mt-1">
                {item.completed ? (
                  <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                    <Check className="h-4 w-4 text-white" />
                  </div>
                ) : (
                  <Circle className="h-6 w-6 text-muted-foreground" />
                )}
              </div>
              <div className="flex-1">
                <h4
                  className={`font-medium mb-1 ${
                    item.completed
                      ? 'text-green-900 dark:text-green-100'
                      : 'text-foreground'
                  }`}
                >
                  {item.title}
                </h4>
                <p className="text-sm text-muted-foreground">
                  {item.description}
                </p>
              </div>
              <ArrowRight
                className={`h-5 w-5 ml-2 flex-shrink-0 ${
                  item.completed
                    ? 'text-green-600 dark:text-green-400'
                    : 'text-muted-foreground'
                }`}
              />
            </div>
          ))}
        </div>

        {completedCount === checklist.length && (
          <div className="mt-6 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
            <div className="flex items-center">
              <Check className="h-5 w-5 text-green-600 dark:text-green-400 mr-2" />
              <p className="text-sm text-green-800 dark:text-green-300">
                Great job! You've completed the onboarding checklist. Explore more features
                or check out the documentation to learn more.
              </p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

