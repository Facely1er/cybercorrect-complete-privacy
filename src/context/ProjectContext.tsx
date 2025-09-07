import React, { createContext, useContext, useState, useEffect } from 'react';
import { setProjectData, getProjectData, setAppSetting, getAppSetting } from '../utils/secureStorage';

interface ProjectTask {
  id: string;
  title: string;
  description: string;
  status: 'not_started' | 'in_progress' | 'completed' | 'blocked';
  assignee?: string;
  dueDate: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  category: 'assessment' | 'implementation' | 'documentation' | 'training' | 'review';
  deliverable?: string;
  evidence?: string[];
  dependencies?: string[];
  estimatedHours?: number;
  actualHours?: number;
}

interface ProjectPhase {
  id: string;
  name: string;
  description: string;
  status: 'planning' | 'in_progress' | 'completed' | 'on_hold';
  startDate: string;
  endDate: string;
  tasks: ProjectTask[];
  deliverables: string[];
  milestones: string[];
}

interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: 'dpo' | 'legal' | 'data_steward' | 'it_admin' | 'business_analyst' | 'project_manager';
  responsibilities: string[];
  availability: number; // percentage
}

interface ProjectProgress {
  projectId: string;
  phases: ProjectPhase[];
  teamMembers: TeamMember[];
  overallProgress: number;
  currentPhase: string;
  lastUpdated: string;
  startDate: string;
  targetCompletionDate: string;
}

interface ProjectContextType {
  projects: Record<string, ProjectProgress>;
  currentProject?: string;
  userMode: 'solo' | 'team';
  createProject: (projectData: Partial<ProjectProgress>) => string;
  updateTaskStatus: (projectId: string, taskId: string, status: ProjectTask['status']) => void;
  assignTask: (projectId: string, taskId: string, assignee: string) => void;
  addEvidence: (projectId: string, taskId: string, evidence: string) => void;
  setUserMode: (mode: 'solo' | 'team') => void;
  getCurrentProject: () => ProjectProgress | null;
  updateProject: (projectId: string, updates: Partial<ProjectProgress>) => void;
}

const ProjectContext = createContext<ProjectContextType | undefined>(undefined);

export const useProject = () => {
  const context = useContext(ProjectContext);
  if (context === undefined) {
    throw new Error('useProject must be used within a ProjectProvider');
  }
  return context;
};

export const ProjectProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [projects, setProjects] = useState<Record<string, ProjectProgress>>(() => {
    return getProjectData('privacyProjects', {});
  });

  const [currentProject, setCurrentProject] = useState<string | undefined>(() => {
    return getProjectData('currentProject') || undefined;
  });

  const [userMode, setUserModeState] = useState<'solo' | 'team'>(() => {
    return getAppSetting('userMode', 'solo');
  });

  useEffect(() => {
    setProjectData('privacyProjects', projects);
  }, [projects]);

  useEffect(() => {
    if (currentProject) {
      setProjectData('currentProject', currentProject);
    }
  }, [currentProject]);

  useEffect(() => {
    setAppSetting('userMode', userMode);
  }, [userMode]);

  const createProject = (projectData: Partial<ProjectProgress>): string => {
    const projectId = `project-${Date.now()}`;
    const defaultPhases: ProjectPhase[] = [
      {
        id: 'assessment',
        name: 'Privacy Assessment',
        description: 'Evaluate current privacy posture and identify gaps',
        status: 'planning',
        startDate: new Date().toISOString().split('T')[0],
        endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        tasks: [],
        deliverables: ['Privacy Assessment Report', 'Gap Analysis', 'Risk Register'],
        milestones: ['Assessment Complete', 'Gaps Identified']
      },
      {
        id: 'planning',
        name: 'Implementation Planning',
        description: 'Develop implementation roadmap and assign responsibilities',
        status: 'planning',
        startDate: new Date(Date.now() + 31 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        endDate: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        tasks: [],
        deliverables: ['Implementation Plan', 'RACI Matrix', 'Project Schedule'],
        milestones: ['Plan Approved', 'Resources Assigned']
      },
      {
        id: 'implementation',
        name: 'Control Implementation',
        description: 'Implement privacy controls and processes',
        status: 'planning',
        startDate: new Date(Date.now() + 61 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        endDate: new Date(Date.now() + 120 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        tasks: [],
        deliverables: ['Privacy Policies', 'Process Documentation', 'Training Materials'],
        milestones: ['Controls Implemented', 'Testing Complete']
      },
      {
        id: 'validation',
        name: 'Validation & Documentation',
        description: 'Validate implementation and prepare audit documentation',
        status: 'planning',
        startDate: new Date(Date.now() + 121 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        endDate: new Date(Date.now() + 150 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        tasks: [],
        deliverables: ['Evidence Package', 'Compliance Report', 'Audit Documentation'],
        milestones: ['Validation Complete', 'Audit Ready']
      }
    ];

    const newProject: ProjectProgress = {
      projectId,
      phases: defaultPhases,
      teamMembers: [],
      overallProgress: 0,
      currentPhase: 'assessment',
      lastUpdated: new Date().toISOString(),
      startDate: new Date().toISOString().split('T')[0],
      targetCompletionDate: new Date(Date.now() + 150 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      ...projectData
    };

    setProjects(prev => ({ ...prev, [projectId]: newProject }));
    setCurrentProject(projectId);
    return projectId;
  };

  const updateTaskStatus = (projectId: string, taskId: string, status: ProjectTask['status']) => {
    setProjects(prev => {
      const project = prev[projectId];
      if (!project) return prev;

      const updatedPhases = project.phases.map(phase => ({
        ...phase,
        tasks: phase.tasks.map(task =>
          task.id === taskId ? { ...task, status } : task
        )
      }));

      return {
        ...prev,
        [projectId]: {
          ...project,
          phases: updatedPhases,
          lastUpdated: new Date().toISOString()
        }
      };
    });
  };

  const assignTask = (projectId: string, taskId: string, assignee: string) => {
    setProjects(prev => {
      const project = prev[projectId];
      if (!project) return prev;

      const updatedPhases = project.phases.map(phase => ({
        ...phase,
        tasks: phase.tasks.map(task =>
          task.id === taskId ? { ...task, assignee } : task
        )
      }));

      return {
        ...prev,
        [projectId]: {
          ...project,
          phases: updatedPhases,
          lastUpdated: new Date().toISOString()
        }
      };
    });
  };

  const addEvidence = (projectId: string, taskId: string, evidence: string) => {
    setProjects(prev => {
      const project = prev[projectId];
      if (!project) return prev;

      const updatedPhases = project.phases.map(phase => ({
        ...phase,
        tasks: phase.tasks.map(task =>
          task.id === taskId 
            ? { ...task, evidence: [...(task.evidence || []), evidence] }
            : task
        )
      }));

      return {
        ...prev,
        [projectId]: {
          ...project,
          phases: updatedPhases,
          lastUpdated: new Date().toISOString()
        }
      };
    });
  };

  const setUserMode = (mode: 'solo' | 'team') => {
    setUserModeState(mode);
  };

  const getCurrentProject = (): ProjectProgress | null => {
    return currentProject ? projects[currentProject] || null : null;
  };

  const updateProject = (projectId: string, updates: Partial<ProjectProgress>) => {
    setProjects(prev => {
      const project = prev[projectId];
      if (!project) return prev;

      return {
        ...prev,
        [projectId]: {
          ...project,
          ...updates,
          lastUpdated: new Date().toISOString()
        }
      };
    });
  };

  return (
    <ProjectContext.Provider value={{
      projects,
      currentProject,
      userMode,
      createProject,
      updateTaskStatus,
      assignTask,
      addEvidence,
      setUserMode,
      getCurrentProject,
      updateProject
    }}>
      {children}
    </ProjectContext.Provider>
  );
};