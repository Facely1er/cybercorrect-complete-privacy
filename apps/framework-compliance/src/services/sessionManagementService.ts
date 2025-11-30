/**
 * Session Management Service
 * Provides multi-device session tracking, timeout management, and security features
 * Adapted from toolkitv2 for privacy compliance platform
 */

import { supabase } from '../lib/supabase';
import { errorTrackingService } from './errorTrackingService';

export interface SessionInfo {
  id: string;
  userId: string;
  deviceId: string;
  userAgent: string;
  ipAddress: string;
  location?: string;
  createdAt: Date;
  lastActive: Date;
  expiresAt: Date;
  isActive: boolean;
  deviceName?: string;
  browserInfo?: string;
  osInfo?: string;
}

export interface SessionConfig {
  maxConcurrentSessions: number;
  sessionTimeout: number; // in minutes
  idleTimeout: number; // in minutes
  extendOnActivity: boolean;
  forceLogoutOnTimeout: boolean;
}

export interface SessionAnalytics {
  totalSessions: number;
  activeSessions: number;
  sessionsByDevice: Record<string, number>;
  sessionsByLocation: Record<string, number>;
  averageSessionDuration: number;
  recentSessions: SessionInfo[];
}

class SessionManagementService {
  private static instance: SessionManagementService;
  private currentSessionId: string | null = null;
  private activityTimer: ReturnType<typeof setInterval> | null = null;
  private readonly DEFAULT_CONFIG: SessionConfig = {
    maxConcurrentSessions: 5,
    sessionTimeout: 480, // 8 hours
    idleTimeout: 30, // 30 minutes
    extendOnActivity: true,
    forceLogoutOnTimeout: true,
  };

  private constructor() {
    if (typeof window !== 'undefined') {
      this.initializeSession();
      this.setupActivityTracking();
    }
  }

  static getInstance(): SessionManagementService {
    if (!SessionManagementService.instance) {
      SessionManagementService.instance = new SessionManagementService();
    }
    return SessionManagementService.instance;
  }

  private generateSessionId(): string {
    return crypto.randomUUID();
  }

  private generateDeviceId(): string {
    if (typeof window === 'undefined') return 'unknown';
    const userAgent = navigator.userAgent;
    const screenRes = `${screen.width}x${screen.height}`;
    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const fingerprint = `${userAgent}-${screenRes}-${timezone}`;
    return btoa(fingerprint).slice(0, 16);
  }

  private async getClientIP(): Promise<string> {
    try {
      // In a real implementation, you'd get this from your server
      return '127.0.0.1';
    } catch {
      return 'unknown';
    }
  }

  private getDeviceInfo(): { deviceName: string; browserInfo: string; osInfo: string } {
    if (typeof window === 'undefined') {
      return { deviceName: 'Unknown', browserInfo: 'Unknown', osInfo: 'Unknown' };
    }

    const userAgent = navigator.userAgent;
    
    // Parse browser info
    let browserInfo = 'Unknown';
    if (userAgent.includes('Chrome')) browserInfo = 'Chrome';
    else if (userAgent.includes('Firefox')) browserInfo = 'Firefox';
    else if (userAgent.includes('Safari')) browserInfo = 'Safari';
    else if (userAgent.includes('Edge')) browserInfo = 'Edge';

    // Parse OS info
    let osInfo = 'Unknown';
    if (userAgent.includes('Windows')) osInfo = 'Windows';
    else if (userAgent.includes('Mac')) osInfo = 'macOS';
    else if (userAgent.includes('Linux')) osInfo = 'Linux';
    else if (userAgent.includes('Android')) osInfo = 'Android';
    else if (userAgent.includes('iOS')) osInfo = 'iOS';

    // Generate device name
    const deviceName = `${osInfo} - ${browserInfo}`;

    return { deviceName, browserInfo, osInfo };
  }

  private async initializeSession(): Promise<void> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const sessionId = this.generateSessionId();
      const deviceId = this.generateDeviceId();
      const ipAddress = await this.getClientIP();
      const { deviceName, browserInfo, osInfo } = this.getDeviceInfo();
      
      const now = new Date();
      const expiresAt = new Date(now.getTime() + this.DEFAULT_CONFIG.sessionTimeout * 60 * 1000);

      const sessionInfo = {
        id: sessionId,
        userId: user.id,
        deviceId,
        userAgent: navigator.userAgent,
        ipAddress,
        createdAt: now.toISOString(),
        lastActive: now.toISOString(),
        expiresAt: expiresAt.toISOString(),
        isActive: true,
        deviceName,
        browserInfo,
        osInfo,
      };

      // Store in database if available (graceful degradation)
      try {
        const { error } = await supabase
          .from('user_sessions')
          .insert(sessionInfo);

        if (error && error.code !== '42P01') { // Ignore "table doesn't exist"
          throw error;
        }
      } catch (dbError) {
        // Database not available - continue with local storage only
        console.warn('Session database not available, using local storage only');
      }

      this.currentSessionId = sessionId;
      
      // Store session ID in sessionStorage
      if (typeof sessionStorage !== 'undefined') {
        sessionStorage.setItem('sessionId', sessionId);
      }
      
      await errorTrackingService.trackInfo('Session initialized', 'auth', { sessionId, deviceId });
    } catch (error) {
      await errorTrackingService.trackError(error as Error, 'auth');
    }
  }

  private setupActivityTracking(): void {
    if (typeof window === 'undefined' || typeof document === 'undefined') return;

    // Track user activity
    const activityEvents = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart', 'click'];
    
    const updateActivity = async () => {
      if (this.currentSessionId) {
        try {
          const { error } = await supabase
            .from('user_sessions')
            .update({ 
              lastActive: new Date().toISOString(),
              expiresAt: this.DEFAULT_CONFIG.extendOnActivity 
                ? new Date(Date.now() + this.DEFAULT_CONFIG.sessionTimeout * 60 * 1000).toISOString()
                : undefined
            })
            .eq('id', this.currentSessionId);

          if (error && error.code !== '42P01') {
            throw error;
          }
        } catch (error) {
          // Database not available - continue silently
        }
      }
    };

    // Debounced activity update
    let activityTimeout: ReturnType<typeof setTimeout> | null = null;
    const debouncedUpdate = () => {
      if (activityTimeout) clearTimeout(activityTimeout);
      activityTimeout = setTimeout(updateActivity, 1000);
    };

    activityEvents.forEach(event => {
      document.addEventListener(event, debouncedUpdate, { passive: true });
    });

    // Check for idle timeout
    this.activityTimer = setInterval(async () => {
      if (this.currentSessionId) {
        try {
          const { data: session, error } = await supabase
            .from('user_sessions')
            .select('lastActive')
            .eq('id', this.currentSessionId)
            .single();

          if (error && error.code !== '42P01') {
            throw error;
          }

          if (session) {
            const lastActive = new Date(session.lastActive);
            const idleTime = Date.now() - lastActive.getTime();
            const idleTimeoutMs = this.DEFAULT_CONFIG.idleTimeout * 60 * 1000;

            if (idleTime > idleTimeoutMs && this.DEFAULT_CONFIG.forceLogoutOnTimeout) {
              await this.forceLogout('Idle timeout exceeded');
            }
          }
        } catch (error) {
          // Database not available - continue silently
        }
      }
    }, 60000); // Check every minute
  }

  async getCurrentSession(): Promise<SessionInfo | null> {
    if (!this.currentSessionId) return null;

    try {
      const { data: session, error } = await supabase
        .from('user_sessions')
        .select('*')
        .eq('id', this.currentSessionId)
        .single();

      if (error) {
        if (error.code === '42P01') return null; // Table doesn't exist
        throw error;
      }
      return session as SessionInfo;
    } catch (error) {
      return null;
    }
  }

  async getUserSessions(): Promise<SessionInfo[]> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return [];

      const { data: sessions, error } = await supabase
        .from('user_sessions')
        .select('*')
        .eq('userId', user.id)
        .order('lastActive', { ascending: false });

      if (error) {
        if (error.code === '42P01') return []; // Table doesn't exist
        throw error;
      }
      return (sessions as SessionInfo[]) || [];
    } catch (error) {
      return [];
    }
  }

  async terminateSession(sessionId: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('user_sessions')
        .update({ isActive: false })
        .eq('id', sessionId);

      if (error && error.code !== '42P01') {
        throw error;
      }

      // If terminating current session, clear local state
      if (sessionId === this.currentSessionId) {
        this.currentSessionId = null;
        if (typeof sessionStorage !== 'undefined') {
          sessionStorage.removeItem('sessionId');
        }
      }

      await errorTrackingService.trackInfo('Session terminated', 'auth', { sessionId });
    } catch (error) {
      await errorTrackingService.trackError(error as Error, 'auth');
      throw error;
    }
  }

  async terminateAllOtherSessions(): Promise<void> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user || !this.currentSessionId) return;

      const { error } = await supabase
        .from('user_sessions')
        .update({ isActive: false })
        .eq('userId', user.id)
        .neq('id', this.currentSessionId);

      if (error && error.code !== '42P01') {
        throw error;
      }

      await errorTrackingService.trackInfo('All other sessions terminated', 'auth');
    } catch (error) {
      await errorTrackingService.trackError(error as Error, 'auth');
      throw error;
    }
  }

  async forceLogout(reason: string): Promise<void> {
    try {
      if (this.currentSessionId) {
        await this.terminateSession(this.currentSessionId);
      }

      await supabase.auth.signOut();
      await errorTrackingService.trackWarning(`Forced logout: ${reason}`, 'auth');
    } catch (error) {
      await errorTrackingService.trackError(error as Error, 'auth');
    }
  }

  async getSessionAnalytics(timeRange: '24h' | '7d' | '30d' = '7d'): Promise<SessionAnalytics> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const now = new Date();
      const timeRanges = {
        '24h': new Date(now.getTime() - 24 * 60 * 60 * 1000),
        '7d': new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000),
        '30d': new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000),
      };

      const startDate = timeRanges[timeRange];

      const { data: sessions, error } = await supabase
        .from('user_sessions')
        .select('*')
        .eq('userId', user.id)
        .gte('createdAt', startDate.toISOString())
        .order('createdAt', { ascending: false });

      if (error) {
        if (error.code === '42P01') {
          return this.getEmptyAnalytics();
        }
        throw error;
      }

      const analytics: SessionAnalytics = {
        totalSessions: sessions?.length || 0,
        activeSessions: (sessions || []).filter((s: any) => s.isActive).length,
        sessionsByDevice: {},
        sessionsByLocation: {},
        averageSessionDuration: 0,
        recentSessions: (sessions || []).slice(0, 10) as SessionInfo[],
      };

      // Calculate statistics
      (sessions || []).forEach((session: any) => {
        analytics.sessionsByDevice[session.deviceName || 'Unknown'] = 
          (analytics.sessionsByDevice[session.deviceName || 'Unknown'] || 0) + 1;
        
        if (session.location) {
          analytics.sessionsByLocation[session.location] = 
            (analytics.sessionsByLocation[session.location] || 0) + 1;
        }
      });

      // Calculate average session duration
      const activeSessions = (sessions || []).filter((s: any) => s.isActive);
      if (activeSessions.length > 0) {
        const totalDuration = activeSessions.reduce((sum: number, session: any) => {
          const duration = new Date(session.lastActive).getTime() - new Date(session.createdAt).getTime();
          return sum + duration;
        }, 0);
        analytics.averageSessionDuration = totalDuration / activeSessions.length;
      }

      return analytics;
    } catch (error) {
      await errorTrackingService.trackError(error as Error, 'auth');
      return this.getEmptyAnalytics();
    }
  }

  async checkConcurrentSessions(): Promise<{ allowed: boolean; currentCount: number; maxAllowed: number }> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return { allowed: false, currentCount: 0, maxAllowed: 0 };

      const { data: activeSessions, error } = await supabase
        .from('user_sessions')
        .select('id')
        .eq('userId', user.id)
        .eq('isActive', true);

      if (error) {
        if (error.code === '42P01') {
          return { allowed: true, currentCount: 0, maxAllowed: this.DEFAULT_CONFIG.maxConcurrentSessions };
        }
        throw error;
      }

      const currentCount = activeSessions?.length || 0;
      const allowed = currentCount < this.DEFAULT_CONFIG.maxConcurrentSessions;

      return {
        allowed,
        currentCount,
        maxAllowed: this.DEFAULT_CONFIG.maxConcurrentSessions,
      };
    } catch (error) {
      await errorTrackingService.trackError(error as Error, 'auth');
      return { allowed: false, currentCount: 0, maxAllowed: 0 };
    }
  }

  private getEmptyAnalytics(): SessionAnalytics {
    return {
      totalSessions: 0,
      activeSessions: 0,
      sessionsByDevice: {},
      sessionsByLocation: {},
      averageSessionDuration: 0,
      recentSessions: [],
    };
  }

  // Cleanup on page unload
  cleanup(): void {
    if (this.activityTimer) {
      clearInterval(this.activityTimer);
      this.activityTimer = null;
    }
  }
}

export const sessionManagementService = SessionManagementService.getInstance();

// Cleanup on page unload
if (typeof window !== 'undefined') {
  window.addEventListener('beforeunload', () => {
    sessionManagementService.cleanup();
  });
}

