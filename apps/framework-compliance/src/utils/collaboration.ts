/**
 * Collaboration Manager
 * Handles multi-user assessment sessions, team management, and progress tracking
 */

import { CollaborativeSession, TeamMember, QuestionComment, ProgressSummary, CollaborationRole } from '../types/collaboration';
import { secureStorage } from './storage/secureStorage';

const SESSIONS_KEY = 'collaborative_assessment_sessions';
const CURRENT_USER_KEY = 'current_collaboration_user';

export class CollaborationManager {
  
  /**
   * Create a new collaborative assessment session
   */
  static createSession(
    name: string,
    organizationName: string,
    createdBy: { name: string; email: string }
  ): CollaborativeSession {
    const session: CollaborativeSession = {
      id: `collab-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      name,
      organizationName,
      createdBy: createdBy.email,
      createdAt: new Date(),
      lastModified: new Date(),
      status: 'draft',
      assessmentMode: 'organizational',
      teamMembers: [{
        id: `user-${Date.now()}`,
        name: createdBy.name,
        email: createdBy.email,
        role: 'owner',
        assignedSections: [],
        completedSections: [],
        joinedAt: new Date()
      }],
      answers: {},
      flags: [],
      sectionAssignments: {},
      currentSection: 0,
      settings: {
        requireConsensus: false,
        allowAnonymousVoting: true,
        notifyOnComments: false
      }
    };

    this.saveSession(session);
    
    // Set current user
    this.setCurrentUser({
      id: session.teamMembers[0].id,
      name: createdBy.name,
      email: createdBy.email
    });

    return session;
  }

  /**
   * Save session to storage
   */
  static saveSession(session: CollaborativeSession): void {
    const sessions = this.getAllSessions();
    const index = sessions.findIndex(s => s.id === session.id);
    
    session.lastModified = new Date();
    
    if (index >= 0) {
      sessions[index] = session;
    } else {
      sessions.push(session);
    }
    
    secureStorage.setItem(SESSIONS_KEY, sessions);
  }

  /**
   * Get a specific session by ID
   */
  static getSession(sessionId: string): CollaborativeSession | null {
    const sessions = this.getAllSessions();
    return sessions.find(s => s.id === sessionId) || null;
  }

  /**
   * Get all collaborative sessions
   */
  static getAllSessions(): CollaborativeSession[] {
    return secureStorage.getItem<CollaborativeSession[]>(SESSIONS_KEY) || [];
  }

  /**
   * Delete a session
   */
  static deleteSession(sessionId: string): void {
    const sessions = this.getAllSessions();
    const filtered = sessions.filter(s => s.id !== sessionId);
    secureStorage.setItem(SESSIONS_KEY, filtered);
  }

  /**
   * Add a team member to the session
   */
  static addTeamMember(
    sessionId: string,
    member: { name: string; email: string; role?: CollaborationRole }
  ): TeamMember | null {
    const session = this.getSession(sessionId);
    if (!session) return null;

    // Check if member already exists
    const existing = session.teamMembers.find(m => m.email === member.email);
    if (existing) return existing;

    const newMember: TeamMember = {
      id: `user-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      name: member.name,
      email: member.email,
      role: member.role || 'contributor',
      assignedSections: [],
      completedSections: [],
      joinedAt: new Date()
    };

    session.teamMembers.push(newMember);
    this.saveSession(session);
    
    return newMember;
  }

  /**
   * Remove a team member
   */
  static removeTeamMember(sessionId: string, userId: string): void {
    const session = this.getSession(sessionId);
    if (!session) return;

    session.teamMembers = session.teamMembers.filter(m => m.id !== userId);
    this.saveSession(session);
  }

  /**
   * Assign a section to team members
   */
  static assignSection(
    sessionId: string,
    sectionId: string,
    userIds: string[]
  ): void {
    const session = this.getSession(sessionId);
    if (!session) return;

    session.sectionAssignments[sectionId] = userIds;
    
    // Update team members' assigned sections
    userIds.forEach(userId => {
      const member = session.teamMembers.find(m => m.id === userId);
      if (member && !member.assignedSections.includes(sectionId)) {
        member.assignedSections.push(sectionId);
      }
    });

    this.saveSession(session);
  }

  /**
   * Submit an answer to a question
   */
  static submitAnswer(
    sessionId: string,
    questionId: string,
    answer: string,
    userId: string
  ): void {
    const session = this.getSession(sessionId);
    if (!session) return;

    session.answers[questionId] = {
      value: answer,
      answeredBy: userId,
      answeredAt: new Date()
    };

    this.saveSession(session);
  }

  /**
   * Add a comment to a question
   */
  static addComment(
    sessionId: string,
    questionId: string,
    comment: string,
    userId: string,
    userName: string
  ): void {
    const session = this.getSession(sessionId);
    if (!session) return;

    if (!session.answers[questionId]) {
      session.answers[questionId] = {
        value: '',
        answeredBy: '',
        answeredAt: new Date(),
        comments: []
      };
    }

    if (!session.answers[questionId].comments) {
      session.answers[questionId].comments = [];
    }

    session.answers[questionId].comments!.push({
      id: `comment-${Date.now()}`,
      questionId,
      userId,
      userName,
      comment,
      timestamp: new Date(),
      resolved: false
    });

    this.saveSession(session);
  }

  /**
   * Resolve a comment
   */
  static resolveComment(sessionId: string, questionId: string, commentId: string): void {
    const session = this.getSession(sessionId);
    if (!session || !session.answers[questionId]?.comments) return;

    const comment = session.answers[questionId].comments!.find(c => c.id === commentId);
    if (comment) {
      comment.resolved = true;
      this.saveSession(session);
    }
  }

  /**
   * Flag a question for discussion
   */
  static flagQuestion(
    sessionId: string,
    questionId: string,
    userId: string,
    reason: string
  ): void {
    const session = this.getSession(sessionId);
    if (!session) return;

    const existingFlag = session.flags.find(f => f.questionId === questionId);
    
    if (existingFlag) {
      if (!existingFlag.flaggedBy.includes(userId)) {
        existingFlag.flaggedBy.push(userId);
      }
    } else {
      session.flags.push({
        questionId,
        flaggedBy: [userId],
        reason,
        status: 'pending'
      });
    }

    this.saveSession(session);
  }

  /**
   * Unflag a question
   */
  static unflagQuestion(sessionId: string, questionId: string): void {
    const session = this.getSession(sessionId);
    if (!session) return;

    session.flags = session.flags.filter(f => f.questionId !== questionId);
    this.saveSession(session);
  }

  /**
   * Update flag status
   */
  static updateFlagStatus(
    sessionId: string,
    questionId: string,
    status: 'pending' | 'discussed' | 'resolved'
  ): void {
    const session = this.getSession(sessionId);
    if (!session) return;

    const flag = session.flags.find(f => f.questionId === questionId);
    if (flag) {
      flag.status = status;
      this.saveSession(session);
    }
  }

  /**
   * Mark a section as completed by a user
   */
  static markSectionCompleted(sessionId: string, sectionId: string, userId: string): void {
    const session = this.getSession(sessionId);
    if (!session) return;

    const member = session.teamMembers.find(m => m.id === userId);
    if (member && !member.completedSections.includes(sectionId)) {
      member.completedSections.push(sectionId);
      member.lastActive = new Date();
      this.saveSession(session);
    }
  }

  /**
   * Update session status
   */
  static updateSessionStatus(
    sessionId: string,
    status: 'draft' | 'in-progress' | 'review' | 'completed'
  ): void {
    const session = this.getSession(sessionId);
    if (!session) return;

    session.status = status;
    this.saveSession(session);
  }

  /**
   * Update current section
   */
  static updateCurrentSection(sessionId: string, sectionIndex: number): void {
    const session = this.getSession(sessionId);
    if (!session) return;

    session.currentSection = sectionIndex;
    this.saveSession(session);
  }

  /**
   * Get progress summary for a session
   */
  static getProgressSummary(sessionId: string): ProgressSummary | null {
    const session = this.getSession(sessionId);
    if (!session) return null;

    const totalQuestions = Object.keys(session.answers).length;
    const answeredQuestions = Object.values(session.answers).filter(a => a.value).length;
    const flaggedQuestions = session.flags.filter(f => f.status === 'pending').length;
    const unresolvedComments = Object.values(session.answers)
      .flatMap(a => a.comments || [])
      .filter(c => !c.resolved).length;

    const memberProgress = session.teamMembers.map(member => ({
      ...member,
      completionRate: member.assignedSections.length > 0
        ? (member.completedSections.length / member.assignedSections.length) * 100
        : 0
    }));

    return {
      totalQuestions,
      answeredQuestions,
      completionPercentage: totalQuestions > 0 ? (answeredQuestions / totalQuestions) * 100 : 0,
      flaggedQuestions,
      unresolvedComments,
      memberProgress
    };
  }

  /**
   * Generate shareable link for a session
   */
  static generateShareLink(sessionId: string): string {
    const baseUrl = window.location.origin;
    return `${baseUrl}/assessment/collaborate/${sessionId}`;
  }

  /**
   * Set current user
   */
  static setCurrentUser(user: { id: string; name: string; email: string }): void {
    secureStorage.setItem(CURRENT_USER_KEY, user);
  }

  /**
   * Get current user
   */
  static getCurrentUser(): { id: string; name: string; email: string } | null {
    return secureStorage.getItem(CURRENT_USER_KEY);
  }

  /**
   * Check if user is session owner
   */
  static isSessionOwner(sessionId: string, userId: string): boolean {
    const session = this.getSession(sessionId);
    if (!session) return false;

    const member = session.teamMembers.find(m => m.id === userId);
    return member?.role === 'owner';
  }

  /**
   * Get user's assigned sections
   */
  static getUserAssignedSections(sessionId: string, userId: string): string[] {
    const session = this.getSession(sessionId);
    if (!session) return [];

    const member = session.teamMembers.find(m => m.id === userId);
    return member?.assignedSections || [];
  }

  /**
   * Export session data for backup/sharing
   */
  static exportSession(sessionId: string): string {
    const session = this.getSession(sessionId);
    if (!session) return '';

    return JSON.stringify(session, null, 2);
  }

  /**
   * Import session data
   */
  static importSession(sessionData: string): CollaborativeSession | null {
    try {
      const session = JSON.parse(sessionData) as CollaborativeSession;
      this.saveSession(session);
      return session;
    } catch (error) {
      console.error('Failed to import session:', error);
      return null;
    }
  }
}

