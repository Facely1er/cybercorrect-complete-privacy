// Deadline checker utility
import { alertService } from './alertService';
import { localReminderService } from './localReminderService';

export interface Deadline {
  id: string;
  title: string;
  dueDate: string;
  priority?: 'low' | 'normal' | 'high' | 'critical';
  actionUrl?: string;
  metadata?: Record<string, unknown>;
}

class DeadlineChecker {
  /**
   * Check deadlines and generate alerts
   */
  async checkDeadlines(deadlines: Deadline[]): Promise<void> {
    try {
      // Use alert service to check deadlines
      await alertService.checkDeadlines(deadlines.map(d => ({
        id: d.id,
        title: d.title,
        dueDate: d.dueDate,
        priority: d.priority,
        actionUrl: d.actionUrl,
      })));

      // Also create local reminders for upcoming deadlines
      for (const deadline of deadlines) {
        const dueDate = new Date(deadline.dueDate);
        const now = new Date();
        const daysUntil = Math.ceil((dueDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

        // Create reminders at 7, 3, and 1 days before
        if (daysUntil > 0 && daysUntil <= 7) {
          if (daysUntil === 7 || daysUntil === 3 || daysUntil === 1) {
            await localReminderService.createReminder({
              title: `Deadline Approaching: ${deadline.title}`,
              message: `${deadline.title} is due in ${daysUntil} day${daysUntil !== 1 ? 's' : ''}`,
              scheduledAt: new Date(now.getTime() + (daysUntil - 1) * 24 * 60 * 60 * 1000).toISOString(),
              actionUrl: deadline.actionUrl,
              priority: deadline.priority || (daysUntil <= 1 ? 'critical' : daysUntil <= 3 ? 'high' : 'normal'),
              metadata: deadline.metadata,
            });
          }
        }
      }
    } catch (error) {
      console.error('Failed to check deadlines:', error);
    }
  }

  /**
   * Get upcoming deadlines
   */
  getUpcomingDeadlines(deadlines: Deadline[], daysAhead: number = 30): Deadline[] {
    const now = new Date();
    const futureDate = new Date(now.getTime() + daysAhead * 24 * 60 * 60 * 1000);

    return deadlines
      .filter(d => {
        const dueDate = new Date(d.dueDate);
        return dueDate >= now && dueDate <= futureDate;
      })
      .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime());
  }

  /**
   * Get overdue deadlines
   */
  getOverdueDeadlines(deadlines: Deadline[]): Deadline[] {
    const now = new Date();

    return deadlines
      .filter(d => new Date(d.dueDate) < now)
      .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime());
  }

  /**
   * Get deadlines by priority
   */
  getDeadlinesByPriority(deadlines: Deadline[], priority: Deadline['priority']): Deadline[] {
    return deadlines.filter(d => d.priority === priority);
  }

  /**
   * Calculate days until deadline
   */
  getDaysUntil(dueDate: string): number {
    const now = new Date();
    const due = new Date(dueDate);
    return Math.ceil((due.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
  }

  /**
   * Check if deadline is approaching
   */
  isApproaching(dueDate: string, daysThreshold: number = 7): boolean {
    const daysUntil = this.getDaysUntil(dueDate);
    return daysUntil > 0 && daysUntil <= daysThreshold;
  }

  /**
   * Check if deadline is overdue
   */
  isOverdue(dueDate: string): boolean {
    return this.getDaysUntil(dueDate) < 0;
  }
}

export const deadlineChecker = new DeadlineChecker();

