import { Notification } from '../hooks/useNotifications';

export const createNotification = {
  dataReset: (): Notification => ({
    type: 'info',
    title: 'Demo Data Reset',
    message: 'All demo data has been cleared from your account',
    timestamp: Date.now(),
    read: false,
    category: 'system'
  }),
  
  dataRightsRequest: (type: string): Notification => ({
    type: 'success',
    title: 'Data Rights Request Submitted',
    message: `Your ${type} request has been submitted successfully`,
    timestamp: Date.now(),
    read: false,
    category: 'data_rights'
  }),
  
  privacyIncident: (): Notification => ({
    type: 'warning',
    title: 'Privacy Incident Reported',
    message: 'Your privacy incident report has been submitted',
    timestamp: Date.now(),
    read: false,
    category: 'privacy'
  })
};