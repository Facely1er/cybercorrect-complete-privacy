import {
  Eye,
  Target,
  Wrench,
  BarChart3
} from 'lucide-react';

export interface JourneyStep {
  id: number;
  key: string;
  title: string;
  shortTitle: string;
  path: string;
  icon: typeof Eye;
  completed: boolean;
}

export const JOURNEY_STEPS: JourneyStep[] = [
  {
    id: 1,
    key: 'assess',
    title: 'Assess Your Current State',
    shortTitle: 'Assess',
    path: '/assessments/privacy-assessment',
    icon: Eye,
    completed: false
  },
  {
    id: 2,
    key: 'discover',
    title: 'Discover Your Compliance Gaps',
    shortTitle: 'Discover',
    path: '/compliance',
    icon: Target,
    completed: false
  },
  {
    id: 3,
    key: 'act',
    title: 'Act on Recommendations',
    shortTitle: 'Act',
    path: '/toolkit',
    icon: Wrench,
    completed: false
  },
  {
    id: 4,
    key: 'maintain',
    title: 'Maintain Compliance',
    shortTitle: 'Maintain',
    path: '/dashboard/privacy',
    icon: BarChart3,
    completed: false
  }
];

