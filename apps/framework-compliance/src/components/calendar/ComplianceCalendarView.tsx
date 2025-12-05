import React, { useState, useEffect } from 'react';
import { 
  Calendar, ChevronLeft, ChevronRight, Plus, Filter,
  Clock, Users, CheckSquare, AlertTriangle, Target,
  Award, Shield, FileText, Eye, Edit3, Bell, X
} from 'lucide-react';
import { CalendarEvent, CalendarEventType, ActivityMetrics } from '../../types/calendar';
import { calendarService } from '../../services/calendarService';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';
import { Button } from '../ui/Button';
import { toast } from '../ui/Toaster';

interface ComplianceCalendarViewProps {
  onBack?: () => void;
  addNotification?: (type: 'success' | 'error' | 'warning' | 'info', message: string) => void;
}

export const ComplianceCalendarView: React.FC<ComplianceCalendarViewProps> = ({
  onBack,
  addNotification
}) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [viewMode, setViewMode] = useState<'month' | 'week' | 'agenda'>('month');
  const [filterType, setFilterType] = useState<CalendarEventType | 'all'>('all');
  const [showCreateEvent, setShowCreateEvent] = useState(false);
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [activityMetrics, setActivityMetrics] = useState<ActivityMetrics>({
    upcomingEvents: 0,
    overdueEvents: 0,
    completedThisMonth: 0,
    criticalDeadlines: 0,
    complianceActivities: 0,
    evidenceCollection: 0,
    policyReviews: 0,
    controlAssessments: 0
  });
  const [loading, setLoading] = useState(true);
  const [eventFormData, setEventFormData] = useState({
    title: '',
    description: '',
    type: 'assessment' as CalendarEventType,
    priority: 'medium' as 'low' | 'medium' | 'high' | 'critical',
    startDate: '',
    endDate: '',
    allDay: false,
    location: '',
    attendees: ''
  });

  useEffect(() => {
    loadEvents();
    loadActivityMetrics();
  }, [filterType, currentDate]);

  const loadEvents = async () => {
    try {
      setLoading(true);
      const filters: any = {};
      if (filterType !== 'all') {
        filters.type = filterType;
      }
      
      // Filter by current month
      const startOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
      const endOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
      filters.startDate = startOfMonth;
      filters.endDate = endOfMonth;
      
      const loadedEvents = await calendarService.getEvents(filters);
      setEvents(loadedEvents);
    } catch (error) {
      console.error('Failed to load events:', error);
      toast.error('Failed to load calendar events');
    } finally {
      setLoading(false);
    }
  };

  const loadActivityMetrics = async () => {
    try {
      const metrics = await calendarService.getActivityMetrics();
      setActivityMetrics(metrics);
    } catch (error) {
      console.error('Failed to load activity metrics:', error);
    }
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      if (direction === 'prev') {
        newDate.setMonth(newDate.getMonth() - 1);
      } else {
        newDate.setMonth(newDate.getMonth() + 1);
      }
      return newDate;
    });
  };

  const getEventTypeColor = (type: CalendarEventType) => {
    const colors = {
      'assessment': 'bg-blue-500',
      'control-review': 'bg-green-500',
      'evidence-collection': 'bg-purple-500',
      'policy-review': 'bg-orange-500',
      'training': 'bg-yellow-500',
      'audit': 'bg-red-500',
      'risk-assessment': 'bg-pink-500',
      'incident-review': 'bg-gray-500',
      'milestone': 'bg-indigo-500',
      'deadline': 'bg-red-600'
    };
    return colors[type] || 'bg-gray-500';
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return 'border-l-red-500';
      case 'high': return 'border-l-orange-500';
      case 'medium': return 'border-l-yellow-500';
      case 'low': return 'border-l-green-500';
      default: return 'border-l-gray-500';
    }
  };

  const getEventsForDate = (date: Date) => {
    return events.filter(event => {
      const eventDate = new Date(event.startDate);
      return eventDate.toDateString() === date.toDateString();
    });
  };

  const getDaysInMonth = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay());

    const days = [];
    const current = new Date(startDate);
    
    for (let i = 0; i < 42; i++) {
      days.push(new Date(current));
      current.setDate(current.getDate() + 1);
    }
    
    return days;
  };

  const handleCreateEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!eventFormData.title.trim() || !eventFormData.startDate) {
      toast.error('Title and start date are required');
      if (addNotification) {
        addNotification('error', 'Title and start date are required');
      }
      return;
    }

    try {
      const newEvent = await calendarService.createEvent({
        title: eventFormData.title,
        description: eventFormData.description,
        type: eventFormData.type,
        startDate: new Date(eventFormData.startDate),
        endDate: eventFormData.endDate ? new Date(eventFormData.endDate) : new Date(eventFormData.startDate),
        allDay: eventFormData.allDay,
        priority: eventFormData.priority,
        status: 'scheduled',
        attendees: eventFormData.attendees.split(',').map(email => ({
          id: `attendee-${Date.now()}-${Math.random()}`,
          name: email.trim(),
          email: email.trim(),
          role: 'Participant',
          required: true,
          response: 'pending' as const
        })).filter(a => a.email),
        location: eventFormData.location,
        relatedItems: [],
        notifications: [
          {
            type: 'email',
            timing: 60, // 1 hour before
            recipients: eventFormData.attendees.split(',').map(email => email.trim()).filter(Boolean),
            enabled: true
          }
        ]
      });

      toast.success(`Event "${newEvent.title}" created successfully`);
      if (addNotification) {
        addNotification('success', `Event "${newEvent.title}" created successfully`);
      }
      setShowCreateEvent(false);
      
      // Reset form
      setEventFormData({
        title: '',
        description: '',
        type: 'assessment',
        priority: 'medium',
        startDate: '',
        endDate: '',
        allDay: false,
        location: '',
        attendees: ''
      });

      // Reload events
      await loadEvents();
      await loadActivityMetrics();
    } catch (error) {
      toast.error('Failed to create event');
      if (addNotification) {
        addNotification('error', 'Failed to create event');
      }
    }
  };

  const notify = (type: 'success' | 'error' | 'warning' | 'info', message: string) => {
    if (addNotification) {
      addNotification(type, message);
    } else {
      if (type === 'success') toast.success(message);
      else if (type === 'error') toast.error(message);
      else if (type === 'warning') toast.warning(message);
      else toast.info(message);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <Card className="mb-8">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-gradient-to-br from-blue-100 to-indigo-100 dark:from-blue-900/30 dark:to-indigo-900/30 rounded-xl">
                <Calendar className="w-8 h-8 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <CardTitle className="text-2xl">Compliance Activity Calendar</CardTitle>
                <p className="text-gray-600 dark:text-gray-300 mt-1">
                  Schedule and track privacy compliance activities
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              {onBack && (
                <Button variant="outline" onClick={onBack}>
                  Back
                </Button>
              )}
              <Button onClick={() => setShowCreateEvent(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Add Event
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Activity Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4 mb-8">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">{activityMetrics.upcomingEvents}</div>
            <div className="text-xs text-gray-600 dark:text-gray-300">Upcoming</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-red-600 dark:text-red-400">{activityMetrics.overdueEvents}</div>
            <div className="text-xs text-gray-600 dark:text-gray-300">Overdue</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-green-600 dark:text-green-400">{activityMetrics.completedThisMonth}</div>
            <div className="text-xs text-gray-600 dark:text-gray-300">Completed</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">{activityMetrics.criticalDeadlines}</div>
            <div className="text-xs text-gray-600 dark:text-gray-300">Critical</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">{activityMetrics.complianceActivities}</div>
            <div className="text-xs text-gray-600 dark:text-gray-300">Assessments</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-pink-600 dark:text-pink-400">{activityMetrics.evidenceCollection}</div>
            <div className="text-xs text-gray-600 dark:text-gray-300">Evidence</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">{activityMetrics.policyReviews}</div>
            <div className="text-xs text-gray-600 dark:text-gray-300">Policies</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-teal-600 dark:text-teal-400">{activityMetrics.controlAssessments}</div>
            <div className="text-xs text-gray-600 dark:text-gray-300">Controls</div>
          </CardContent>
        </Card>
      </div>

      {/* Calendar Controls */}
      <Card className="mb-8">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-4">
              <div className="flex space-x-1 bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
                {(['month', 'week', 'agenda'] as const).map((mode) => (
                  <button
                    key={mode}
                    onClick={() => setViewMode(mode)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors capitalize ${
                      viewMode === mode
                        ? 'bg-blue-600 text-white'
                        : 'text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                    }`}
                  >
                    {mode}
                  </button>
                ))}
              </div>
              
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value as any)}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Events</option>
                <option value="assessment">Assessments</option>
                <option value="evidence-collection">Evidence Collection</option>
                <option value="policy-review">Policy Reviews</option>
                <option value="control-review">Control Reviews</option>
                <option value="training">Training</option>
                <option value="audit">Audits</option>
              </select>
            </div>
            
            <div className="flex items-center space-x-4">
              <Button variant="outline" size="sm" onClick={() => navigateMonth('prev')}>
                <ChevronLeft className="w-5 h-5" />
              </Button>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                {currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
              </h3>
              <Button variant="outline" size="sm" onClick={() => navigateMonth('next')}>
                <ChevronRight className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Calendar Grid */}
      {viewMode === 'month' && (
        <Card>
          <CardContent className="p-6">
            <div className="grid grid-cols-7 gap-1 mb-4">
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                <div key={day} className="p-2 text-center text-sm font-medium text-gray-500 dark:text-gray-400">
                  {day}
                </div>
              ))}
            </div>
            
            <div className="grid grid-cols-7 gap-1">
              {getDaysInMonth().map((day, index) => {
                const dayEvents = getEventsForDate(day);
                const isCurrentMonth = day.getMonth() === currentDate.getMonth();
                const isToday = day.toDateString() === new Date().toDateString();
                
                return (
                  <div
                    key={index}
                    className={`min-h-[120px] p-2 border border-gray-200 dark:border-gray-700 rounded-lg ${
                      isCurrentMonth 
                        ? 'bg-white dark:bg-gray-800' 
                        : 'bg-gray-50 dark:bg-gray-700/50'
                    } ${
                      isToday ? 'ring-2 ring-blue-500' : ''
                    }`}
                  >
                    <div className={`text-sm font-medium mb-2 ${
                      isCurrentMonth 
                        ? 'text-gray-900 dark:text-white' 
                        : 'text-gray-400 dark:text-gray-500'
                    } ${
                      isToday ? 'text-blue-600 dark:text-blue-400' : ''
                    }`}>
                      {day.getDate()}
                    </div>
                    
                    <div className="space-y-1">
                      {dayEvents.slice(0, 2).map((event) => (
                        <div
                          key={event.id}
                          className={`p-1 rounded text-xs cursor-pointer hover:opacity-80 transition-opacity text-white border-l-4 ${getEventTypeColor(event.type)} ${getPriorityColor(event.priority)}`}
                          title={event.title}
                          onClick={() => notify('info', `Viewing event: ${event.title}`)}
                        >
                          <div className="font-medium truncate">
                            {event.title}
                          </div>
                          {!event.allDay && (
                            <div className="text-xs opacity-90">
                              {event.startDate.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}
                            </div>
                          )}
                        </div>
                      ))}
                      {dayEvents.length > 2 && (
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          +{dayEvents.length - 2} more
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Agenda View */}
      {viewMode === 'agenda' && (
        <Card>
          <CardHeader>
            <CardTitle>Upcoming Events</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {events
                .filter(event => event.startDate >= new Date())
                .sort((a, b) => a.startDate.getTime() - b.startDate.getTime())
                .slice(0, 10)
                .map((event) => (
                  <div
                    key={event.id}
                    className={`border-l-4 ${getPriorityColor(event.priority)} bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg hover:shadow-md transition-shadow cursor-pointer`}
                    onClick={() => notify('info', `Viewing event: ${event.title}`)}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h4 className="font-semibold text-gray-900 dark:text-white">
                            {event.title}
                          </h4>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium text-white ${getEventTypeColor(event.type)}`}>
                            {event.type.replace('-', ' ')}
                          </span>
                          <span className="px-2 py-1 rounded-full text-xs font-medium bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-gray-200">
                            {event.priority}
                          </span>
                        </div>
                        
                        <p className="text-gray-600 dark:text-gray-300 mb-2">
                          {event.description}
                        </p>
                        
                        <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
                          <div className="flex items-center space-x-1">
                            <Calendar className="w-4 h-4" />
                            <span>{event.startDate.toLocaleDateString()}</span>
                          </div>
                          {!event.allDay && (
                            <div className="flex items-center space-x-1">
                              <Clock className="w-4 h-4" />
                              <span>
                                {event.startDate.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}
                                {event.endDate && ` - ${event.endDate.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}`}
                              </span>
                            </div>
                          )}
                          {event.attendees.length > 0 && (
                            <div className="flex items-center space-x-1">
                              <Users className="w-4 h-4" />
                              <span>{event.attendees.length} attendees</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              {events.filter(event => event.startDate >= new Date()).length === 0 && (
                <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                  No upcoming events
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Create Event Modal */}
      {showCreateEvent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50">
          <Card className="max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Create Compliance Event</CardTitle>
                <Button variant="ghost" size="sm" onClick={() => setShowCreateEvent(false)}>
                  <X className="w-5 h-5" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleCreateEvent} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Event Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={eventFormData.title}
                    onChange={(e) => setEventFormData(prev => ({ ...prev, title: e.target.value }))}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter event title"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Description
                  </label>
                  <textarea
                    value={eventFormData.description}
                    onChange={(e) => setEventFormData(prev => ({ ...prev, description: e.target.value }))}
                    rows={3}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                    placeholder="Describe the event purpose and agenda"
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Event Type *
                    </label>
                    <select
                      required
                      value={eventFormData.type}
                      onChange={(e) => setEventFormData(prev => ({ ...prev, type: e.target.value as CalendarEventType }))}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="assessment">Assessment</option>
                      <option value="control-review">Control Review</option>
                      <option value="evidence-collection">Evidence Collection</option>
                      <option value="policy-review">Policy Review</option>
                      <option value="training">Training</option>
                      <option value="audit">Audit</option>
                      <option value="risk-assessment">Risk Assessment</option>
                      <option value="incident-review">Incident Review</option>
                      <option value="milestone">Milestone</option>
                      <option value="deadline">Deadline</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Priority
                    </label>
                    <select
                      value={eventFormData.priority}
                      onChange={(e) => setEventFormData(prev => ({ ...prev, priority: e.target.value as any }))}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                      <option value="critical">Critical</option>
                    </select>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Start Date & Time *
                    </label>
                    <input
                      type="datetime-local"
                      required
                      value={eventFormData.startDate}
                      onChange={(e) => setEventFormData(prev => ({ ...prev, startDate: e.target.value }))}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      End Date & Time
                    </label>
                    <input
                      type="datetime-local"
                      value={eventFormData.endDate}
                      onChange={(e) => setEventFormData(prev => ({ ...prev, endDate: e.target.value }))}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={eventFormData.allDay}
                      onChange={(e) => setEventFormData(prev => ({ ...prev, allDay: e.target.checked }))}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      All Day Event
                    </span>
                  </label>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Location
                  </label>
                  <input
                    type="text"
                    value={eventFormData.location}
                    onChange={(e) => setEventFormData(prev => ({ ...prev, location: e.target.value }))}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Meeting room, virtual, etc."
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Attendees (comma-separated emails)
                  </label>
                  <input
                    type="text"
                    value={eventFormData.attendees}
                    onChange={(e) => setEventFormData(prev => ({ ...prev, attendees: e.target.value }))}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="user@company.com, team@company.com"
                  />
                </div>
                
                <div className="flex space-x-4 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setShowCreateEvent(false);
                      setEventFormData({
                        title: '',
                        description: '',
                        type: 'assessment',
                        priority: 'medium',
                        startDate: '',
                        endDate: '',
                        allDay: false,
                        location: '',
                        attendees: ''
                      });
                    }}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    className="flex-1"
                  >
                    Create Event
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};


