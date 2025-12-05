import { DataSubjectRequest } from '../utils/validation';
import { localStorageService } from './localStorageService';
import { supabase } from '../lib/supabase';

export const dataRightsService = {
  submitRequest: async (
    requestData: DataSubjectRequest & { requestType: string },
    organizationId: string,
    userId?: string
  ) => {
    try {
      const newRequest = {
        id: `req-${Date.now()}`,
        ...requestData,
        organization_id: organizationId,
        user_id: userId,
        request_type: requestData.requestType,
        requester_name: requestData.requesterName,
        requester_email: requestData.requesterEmail,
        requester_relationship: requestData.requesterRelationship,
        student_identifier: requestData.employeeIdentifier,
        request_details: requestData.requestDetails || {},
        applicable_regulations: requestData.applicableRegulations || [],
        status: 'submitted' as const,
        submitted_at: new Date().toISOString(),
        due_date: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000).toISOString(), // 45 days from now
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      
      // Try to save to Supabase first
      const { data, error } = await supabase
        .from('cybercorrect.data_subject_requests')
        .insert([newRequest])
        .select()
        .single();
      
      if (error) {
        console.warn('Failed to save to Supabase, falling back to localStorage:', error);
        // Fallback to localStorage
        await localStorageService.saveDataRightsRequest(newRequest, userId);
      }
      
      return {
        success: true,
        message: `Your ${requestData.requestType} request has been submitted successfully. You will receive email updates on the progress.`,
        data: data || newRequest
      };
    } catch (error) {
      console.error('Error submitting request:', error);
      return {
        success: false,
        message: 'Failed to submit request. Please try again.'
      };
    }
  },

  getRequests: async (userId: string) => {
    try {
      // Try to get requests from Supabase first
      const { data: supabaseRequests, error } = await supabase
        .from('cybercorrect.data_subject_requests')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });
      
      if (error) {
        console.warn('Failed to fetch from Supabase, falling back to localStorage:', error);
        // Fallback to localStorage
        const requests = await localStorageService.getDataRightsRequests(userId);
        return requests.filter(req => req.requesterEmail === userId);
      }
      
      return supabaseRequests || [];
    } catch (error) {
      console.error('Error fetching requests:', error);
      // Fallback to localStorage
      const requests = await localStorageService.getDataRightsRequests(userId);
      return requests.filter(req => req.requesterEmail === userId);
    }
  },

  updateRequestStatus: async (requestId: string, status: string, userId?: string) => {
    try {
      // Try to update in Supabase first
      const { error } = await supabase
        .from('cybercorrect.data_subject_requests')
        .update({ 
          status: status as string,
          updated_at: new Date().toISOString()
        })
        .eq('id', requestId);
      
      if (error) {
        console.warn('Failed to update in Supabase, falling back to localStorage:', error);
        // Fallback to localStorage
        const requests = await localStorageService.getDataRightsRequests(userId);
        const updatedRequests = requests.map(req => 
          req.id === requestId ? { ...req, status, updatedAt: new Date().toISOString() } : req
        );
        await localStorageService.setItem('data_rights_requests', updatedRequests, userId);
      }
    } catch (error) {
      console.error('Error updating request status:', error);
      // Fallback to localStorage
      const requests = await localStorageService.getDataRightsRequests(userId);
      const updatedRequests = requests.map(req => 
        req.id === requestId ? { ...req, status, updatedAt: new Date().toISOString() } : req
      );
      await localStorageService.setItem('data_rights_requests', updatedRequests, userId);
    }
  }
};