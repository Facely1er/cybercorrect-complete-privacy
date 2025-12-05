// Calendar service for managing compliance events and deadlines
import { supabase } from '../lib/supabase';
import { secureStorage } from '../utils/storage';
import { CalendarEvent, CalendarEventType, EventStatus, ActivityMetrics } from '../types/calendar';
import { errorMonitoring } from '../lib/errorMonitoring';

const CALENDAR_EVENTS_STORAGE_KEY = 'cybercorrect-calendar-events';

class CalendarService {
  /**
   * Get all calendar events
   */
  async getEvents(filters?: {
    type?: CalendarEventType;
    status?: EventStatus;
    startDate?: Date;
    endDate?: Date;
    priority?: string;
  }): Promise<CalendarEvent[]> {
    try {
      // Try to get from Supabase first
      const { data: { user } } = await supabase.auth.getUser();
      
      if (user) {
        let query = supabase
          .from('calendar_events')
          .select('*')
          .eq('user_id', user.id)
          .order('start_date', { ascending: true });

        if (filters?.type) {
          query = query.eq('type', filters.type);
        }
        if (filters?.status) {
          query = query.eq('status', filters.status);
        }
        if (filters?.priority) {
          query = query.eq('priority', filters.priority);
        }
        if (filters?.startDate) {
          query = query.gte('start_date', filters.startDate.toISOString());
        }
        if (filters?.endDate) {
          query = query.lte('end_date', filters.endDate.toISOString());
        }

        const { data, error } = await query;

        if (!error && data) {
          return this.mapDatabaseEventsToCalendarEvents(data);
        }
      }

      // Fallback to local storage
      return this.getLocalEvents(filters);
    } catch (error) {
      errorMonitoring.captureException(error instanceof Error ? error : new Error('Get events failed'), {
        context: 'calendar_service',
        operation: 'getEvents'
      });
      return this.getLocalEvents(filters);
    }
  }

  /**
   * Get a single event by ID
   */
  async getEventById(eventId: string): Promise<CalendarEvent | null> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (user) {
        const { data, error } = await supabase
          .from('calendar_events')
          .select('*')
          .eq('id', eventId)
          .eq('user_id', user.id)
          .single();

        if (!error && data) {
          return this.mapDatabaseEventToCalendarEvent(data);
        }
      }

      // Fallback to local storage
      const localEvents = this.getLocalEvents();
      return localEvents.find(e => e.id === eventId) || null;
    } catch (error) {
      errorMonitoring.captureException(error instanceof Error ? error : new Error('Get event failed'), {
        context: 'calendar_service',
        operation: 'getEventById',
        eventId
      });
      const localEvents = this.getLocalEvents();
      return localEvents.find(e => e.id === eventId) || null;
    }
  }

  /**
   * Create a new calendar event
   */
  async createEvent(event: Omit<CalendarEvent, 'id' | 'metadata'> & { metadata?: Partial<CalendarEvent['metadata']> }): Promise<CalendarEvent> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      const newEvent: CalendarEvent = {
        ...event,
        id: `event_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        metadata: {
          createdBy: user?.id || 'anonymous',
          createdAt: new Date(),
          lastModified: new Date(),
          category: 'compliance',
          tags: [event.type],
          ...event.metadata
        }
      };

      if (user) {
        const dbEvent = this.mapCalendarEventToDatabaseEvent(newEvent, user.id);
        const { data, error } = await supabase
          .from('calendar_events')
          .insert([dbEvent])
          .select()
          .single();

        if (!error && data) {
          this.syncToLocal(newEvent);
          return this.mapDatabaseEventToCalendarEvent(data);
        }
      }

      // Fallback to local storage
      this.syncToLocal(newEvent);
      return newEvent;
    } catch (error) {
      errorMonitoring.captureException(error instanceof Error ? error : new Error('Create event failed'), {
        context: 'calendar_service',
        operation: 'createEvent'
      });
      // Still save locally
      const newEvent: CalendarEvent = {
        ...event,
        id: `event_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        metadata: {
          createdBy: 'anonymous',
          createdAt: new Date(),
          lastModified: new Date(),
          category: 'compliance',
          tags: [event.type],
          ...event.metadata
        }
      };
      this.syncToLocal(newEvent);
      return newEvent;
    }
  }

  /**
   * Update an existing event
   */
  async updateEvent(eventId: string, updates: Partial<CalendarEvent>): Promise<CalendarEvent | null> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      const existingEvent = await this.getEventById(eventId);
      if (!existingEvent) {
        throw new Error('Event not found');
      }

      const updatedEvent: CalendarEvent = {
        ...existingEvent,
        ...updates,
        metadata: {
          ...existingEvent.metadata,
          lastModified: new Date(),
          ...updates.metadata
        }
      };

      if (user) {
        const dbEvent = this.mapCalendarEventToDatabaseEvent(updatedEvent, user.id);
        const { data, error } = await supabase
          .from('calendar_events')
          .update(dbEvent)
          .eq('id', eventId)
          .eq('user_id', user.id)
          .select()
          .single();

        if (!error && data) {
          this.syncToLocal(updatedEvent);
          return this.mapDatabaseEventToCalendarEvent(data);
        }
      }

      // Fallback to local storage
      this.syncToLocal(updatedEvent);
      return updatedEvent;
    } catch (error) {
      errorMonitoring.captureException(error instanceof Error ? error : new Error('Update event failed'), {
        context: 'calendar_service',
        operation: 'updateEvent',
        eventId
      });
      return null;
    }
  }

  /**
   * Delete an event
   */
  async deleteEvent(eventId: string): Promise<boolean> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (user) {
        const { error } = await supabase
          .from('calendar_events')
          .delete()
          .eq('id', eventId)
          .eq('user_id', user.id);

        if (!error) {
          this.removeFromLocal(eventId);
          return true;
        }
      }

      // Fallback to local storage
      this.removeFromLocal(eventId);
      return true;
    } catch (error) {
      errorMonitoring.captureException(error instanceof Error ? error : new Error('Delete event failed'), {
        context: 'calendar_service',
        operation: 'deleteEvent',
        eventId
      });
      this.removeFromLocal(eventId);
      return true;
    }
  }

  /**
   * Get activity metrics
   */
  async getActivityMetrics(): Promise<ActivityMetrics> {
    try {
      const events = await this.getEvents();
      const now = new Date();
      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

      return {
        upcomingEvents: events.filter(e => e.startDate > now && e.status !== 'completed' && e.status !== 'cancelled').length,
        overdueEvents: events.filter(e => e.endDate < now && e.status !== 'completed' && e.status !== 'cancelled').length,
        completedThisMonth: events.filter(e => 
          e.status === 'completed' && 
          e.endDate >= startOfMonth && 
          e.endDate <= now
        ).length,
        criticalDeadlines: events.filter(e => 
          e.priority === 'critical' && 
          e.startDate > now && 
          e.status !== 'completed' && 
          e.status !== 'cancelled'
        ).length,
        complianceActivities: events.filter(e => 
          ['assessment', 'audit', 'control-review'].includes(e.type)
        ).length,
        evidenceCollection: events.filter(e => e.type === 'evidence-collection').length,
        policyReviews: events.filter(e => e.type === 'policy-review').length,
        controlAssessments: events.filter(e => e.type === 'control-review').length
      };
    } catch (error) {
      errorMonitoring.captureException(error instanceof Error ? error : new Error('Get activity metrics failed'), {
        context: 'calendar_service',
        operation: 'getActivityMetrics'
      });
      return {
        upcomingEvents: 0,
        overdueEvents: 0,
        completedThisMonth: 0,
        criticalDeadlines: 0,
        complianceActivities: 0,
        evidenceCollection: 0,
        policyReviews: 0,
        controlAssessments: 0
      };
    }
  }

  // Local storage helpers
  private getLocalEvents(filters?: {
    type?: CalendarEventType;
    status?: EventStatus;
    startDate?: Date;
    endDate?: Date;
    priority?: string;
  }): CalendarEvent[] {
    const events = secureStorage.getItem<CalendarEvent[]>(CALENDAR_EVENTS_STORAGE_KEY) || [];
    
    let filtered = [...events];

    if (filters?.type) {
      filtered = filtered.filter(e => e.type === filters.type);
    }
    if (filters?.status) {
      filtered = filtered.filter(e => e.status === filters.status);
    }
    if (filters?.priority) {
      filtered = filtered.filter(e => e.priority === filters.priority);
    }
    if (filters?.startDate) {
      filtered = filtered.filter(e => e.startDate >= filters.startDate!);
    }
    if (filters?.endDate) {
      filtered = filtered.filter(e => e.endDate <= filters.endDate!);
    }

    return filtered;
  }

  private syncToLocal(event: CalendarEvent): void {
    const events = this.getLocalEvents();
    const index = events.findIndex(e => e.id === event.id);
    
    if (index >= 0) {
      events[index] = event;
    } else {
      events.push(event);
    }
    
    secureStorage.setItem(CALENDAR_EVENTS_STORAGE_KEY, events);
  }

  private removeFromLocal(eventId: string): void {
    const events = this.getLocalEvents();
    const filtered = events.filter(e => e.id !== eventId);
    secureStorage.setItem(CALENDAR_EVENTS_STORAGE_KEY, filtered);
  }

  // Database mapping helpers
  private mapDatabaseEventToCalendarEvent(dbEvent: any): CalendarEvent {
    return {
      id: dbEvent.id,
      title: dbEvent.title,
      description: dbEvent.description || '',
      type: dbEvent.type,
      startDate: new Date(dbEvent.start_date),
      endDate: new Date(dbEvent.end_date),
      allDay: dbEvent.all_day || false,
      recurrence: dbEvent.recurrence ? JSON.parse(dbEvent.recurrence) : undefined,
      priority: dbEvent.priority,
      status: dbEvent.status,
      attendees: dbEvent.attendees ? JSON.parse(dbEvent.attendees) : [],
      location: dbEvent.location,
      relatedItems: dbEvent.related_items ? JSON.parse(dbEvent.related_items) : [],
      notifications: dbEvent.notifications ? JSON.parse(dbEvent.notifications) : [],
      metadata: {
        createdBy: dbEvent.created_by || 'anonymous',
        createdAt: new Date(dbEvent.created_at),
        lastModified: new Date(dbEvent.updated_at || dbEvent.created_at),
        category: dbEvent.category || 'compliance',
        tags: dbEvent.tags ? JSON.parse(dbEvent.tags) : []
      }
    };
  }

  private mapDatabaseEventsToCalendarEvents(dbEvents: any[]): CalendarEvent[] {
    return dbEvents.map(e => this.mapDatabaseEventToCalendarEvent(e));
  }

  private mapCalendarEventToDatabaseEvent(event: CalendarEvent, userId: string): any {
    return {
      id: event.id,
      user_id: userId,
      title: event.title,
      description: event.description,
      type: event.type,
      start_date: event.startDate.toISOString(),
      end_date: event.endDate.toISOString(),
      all_day: event.allDay,
      recurrence: event.recurrence ? JSON.stringify(event.recurrence) : null,
      priority: event.priority,
      status: event.status,
      attendees: JSON.stringify(event.attendees),
      location: event.location || null,
      related_items: JSON.stringify(event.relatedItems),
      notifications: JSON.stringify(event.notifications),
      category: event.metadata.category,
      tags: JSON.stringify(event.metadata.tags),
      created_by: event.metadata.createdBy,
      created_at: event.metadata.createdAt.toISOString(),
      updated_at: event.metadata.lastModified.toISOString()
    };
  }
}

export const calendarService = new CalendarService();


