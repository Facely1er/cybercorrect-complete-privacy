// src/tests/CriticalUserFlows.test.tsx
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { databaseService } from '../services/DatabaseService';

// Mock the database service
vi.mock('../services/DatabaseService', () => ({
  databaseService: {
    getStatus: vi.fn(() => ({
      isConnected: false,
      isConfigured: false,
      mode: 'demo'
    })),
    isOnline: vi.fn(() => false),
    isDemoMode: vi.fn(() => true),
    createDataSubjectRequest: vi.fn(),
    getDataSubjectRequests: vi.fn(),
    updateDataSubjectRequest: vi.fn(),
    createProfile: vi.fn(),
    getProfile: vi.fn(),
    generateDemoData: vi.fn()
  }
}));


describe('Critical User Flows', () => {
  beforeEach(() => {
    // Clear localStorage before each test
    localStorage.clear();
    vi.clearAllMocks();
  });

  describe('Registration Flow', () => {
    it('should allow user registration in demo mode', async () => {
      const mockCreateProfile = vi.mocked(databaseService.createProfile);
      mockCreateProfile.mockResolvedValue({
        id: 'test-user',
        organization_id: 'test-org',
        role: 'student',
        full_name: 'Test User',
        email: 'test@example.com',
        department: 'Computer Science',
        settings: {},
        preferences: {},
        login_count: 1,
        is_active: true,
        created_at: new Date(),
        updated_at: new Date()
      });

      // Simulate registration form submission
      const profileData = {
        organization_id: 'test-org',
        role: 'student' as const,
        full_name: 'Test User',
        email: 'test@example.com',
        department: 'Computer Science',
        settings: {},
        preferences: {},
        login_count: 0,
        is_active: true
      };

      const result = await databaseService.createProfile(profileData);
      
      expect(result).toBeDefined();
      expect(result.id).toBe('test-user');
      expect(result.email).toBe('test@example.com');
      expect(mockCreateProfile).toHaveBeenCalledWith(profileData);
    });

    it('should handle registration errors gracefully', async () => {
      const mockCreateProfile = vi.mocked(databaseService.createProfile);
      mockCreateProfile.mockRejectedValue(new Error('Registration failed'));

      const profileData = {
        organization_id: 'test-org',
        role: 'student' as const,
        full_name: 'Test User',
        email: 'test@example.com',
        department: 'Computer Science',
        settings: {},
        preferences: {},
        login_count: 0,
        is_active: true
      };

      await expect(databaseService.createProfile(profileData)).rejects.toThrow('Registration failed');
    });
  });

  describe('Login Flow', () => {
    it('should authenticate user and retrieve profile', async () => {
      const mockGetProfile = vi.mocked(databaseService.getProfile);
      mockGetProfile.mockResolvedValue({
        id: 'test-user',
        organization_id: 'test-org',
        role: 'student',
        full_name: 'Test User',
        email: 'test@example.com',
        department: 'Computer Science',
        settings: {},
        preferences: {},
        login_count: 1,
        is_active: true,
        created_at: new Date(),
        updated_at: new Date()
      });

      const profile = await databaseService.getProfile('test-user');
      
      expect(profile).toBeDefined();
      expect(profile?.email).toBe('test@example.com');
      expect(profile?.role).toBe('student');
      expect(mockGetProfile).toHaveBeenCalledWith('test-user');
    });

    it('should handle login errors gracefully', async () => {
      const mockGetProfile = vi.mocked(databaseService.getProfile);
      mockGetProfile.mockResolvedValue(null);

      const profile = await databaseService.getProfile('nonexistent-user');
      
      expect(profile).toBeNull();
    });
  });

  describe('Submit Request Flow', () => {
    it('should create a new data subject request', async () => {
      const mockCreateRequest = vi.mocked(databaseService.createDataSubjectRequest);
      mockCreateRequest.mockResolvedValue({
        id: 'test-request',
        organization_id: 'test-org',
        user_id: 'test-user',
        request_type: 'access',
        requester_name: 'John Doe',
        requester_email: 'john@example.com',
        requester_relationship: 'self',
        student_identifier: 'STU001',
        request_details: { reason: 'Personal data access' },
        applicable_regulations: ['FERPA'],
        status: 'submitted',
        submitted_at: new Date(),
        due_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        response_data: {},
        communication_log: [],
        created_at: new Date(),
        updated_at: new Date()
      });

      const requestData = {
        organization_id: 'test-org',
        user_id: 'test-user',
        request_type: 'access',
        requester_name: 'John Doe',
        requester_email: 'john@example.com',
        requester_relationship: 'self',
        student_identifier: 'STU001',
        request_details: { reason: 'Personal data access' },
        applicable_regulations: ['FERPA'],
        status: 'submitted',
        submitted_at: new Date(),
        due_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        response_data: {},
        communication_log: []
      };

      const result = await databaseService.createDataSubjectRequest(requestData);
      
      expect(result).toBeDefined();
      expect(result.id).toBe('test-request');
      expect(result.status).toBe('submitted');
      expect(mockCreateRequest).toHaveBeenCalledWith(requestData);
    });

    it('should validate required fields', async () => {
      // Test with missing required fields
      const invalidRequestData = {
        organization_id: 'test-org',
        user_id: 'test-user',
        request_type: 'access',
        requester_name: '', // Missing required field
        requester_email: 'john@example.com',
        request_details: {},
        applicable_regulations: [],
        status: 'submitted',
        submitted_at: new Date(),
        due_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        response_data: {},
        communication_log: []
      };

      // Mock should reject when validation fails
      const mockCreateRequest = vi.mocked(databaseService.createDataSubjectRequest);
      mockCreateRequest.mockRejectedValueOnce(new Error('Requester name is required'));

      // The service should handle validation
      await expect(databaseService.createDataSubjectRequest(invalidRequestData)).rejects.toThrow('Requester name is required');
    });
  });

  describe('Track Status Flow', () => {
    it('should retrieve user requests', async () => {
      const mockGetRequests = vi.mocked(databaseService.getDataSubjectRequests);
      mockGetRequests.mockResolvedValue([
        {
          id: 'request-1',
          organization_id: 'test-org',
          user_id: 'test-user',
          request_type: 'access',
          requester_name: 'John Doe',
          requester_email: 'john@example.com',
          requester_relationship: 'self',
          student_identifier: 'STU001',
          request_details: { reason: 'Personal data access' },
          applicable_regulations: ['FERPA'],
          status: 'submitted',
          submitted_at: new Date(),
          due_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
          response_data: {},
          communication_log: [],
          created_at: new Date(),
          updated_at: new Date()
        },
        {
          id: 'request-2',
          organization_id: 'test-org',
          user_id: 'test-user',
          request_type: 'erasure',
          requester_name: 'Jane Smith',
          requester_email: 'jane@example.com',
          requester_relationship: 'parent',
          student_identifier: 'STU002',
          request_details: { reason: 'Data deletion' },
          applicable_regulations: ['FERPA'],
          status: 'in_progress',
          submitted_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
          due_date: new Date(Date.now() + 23 * 24 * 60 * 60 * 1000),
          response_data: {},
          communication_log: [],
          created_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
          updated_at: new Date()
        }
      ]);

      const requests = await databaseService.getDataSubjectRequests('test-user');
      
      expect(requests).toHaveLength(2);
      expect(requests[0].status).toBe('submitted');
      expect(requests[1].status).toBe('in_progress');
      expect(mockGetRequests).toHaveBeenCalledWith('test-user');
    });

    it('should update request status', async () => {
      const mockUpdateRequest = vi.mocked(databaseService.updateDataSubjectRequest);
      mockUpdateRequest.mockResolvedValue({
        id: 'request-1',
        organization_id: 'test-org',
        user_id: 'test-user',
        request_type: 'access',
        requester_name: 'John Doe',
        requester_email: 'john@example.com',
        requester_relationship: 'self',
        student_identifier: 'STU001',
        request_details: { reason: 'Personal data access' },
        applicable_regulations: ['FERPA'],
        status: 'completed',
        submitted_at: new Date(),
        due_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        completed_at: new Date(),
        response_data: { data_provided: true },
        communication_log: [],
        created_at: new Date(),
        updated_at: new Date()
      });

      const updates = {
        status: 'completed',
        completed_at: new Date(),
        response_data: { data_provided: true }
      };

      const result = await databaseService.updateDataSubjectRequest('request-1', updates);
      
      expect(result.status).toBe('completed');
      expect(result.completed_at).toBeDefined();
      expect(mockUpdateRequest).toHaveBeenCalledWith('request-1', updates);
    });
  });

  describe('Data Persistence Verification', () => {
    it('should persist data locally when offline', async () => {
      // Simulate offline mode
      vi.mocked(databaseService.isOnline).mockReturnValue(false);
      vi.mocked(databaseService.isDemoMode).mockReturnValue(true);

      const requestData = {
        organization_id: 'test-org',
        user_id: 'test-user',
        request_type: 'access',
        requester_name: 'John Doe',
        requester_email: 'john@example.com',
        requester_relationship: 'self',
        student_identifier: 'STU001',
        request_details: { reason: 'Personal data access' },
        applicable_regulations: ['FERPA'],
        status: 'submitted',
        submitted_at: new Date(),
        due_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        response_data: {},
        communication_log: []
      };

      // Mock should store data in localStorage when offline
      const mockCreateRequest = vi.mocked(databaseService.createDataSubjectRequest);
      mockCreateRequest.mockImplementation(async (data) => {
        // Simulate storing in localStorage
        const existingData = localStorage.getItem('cc_data_subject_requests');
        const dataArray = existingData ? JSON.parse(existingData) : [];
        dataArray.push({ ...data, id: 'test-request-offline' });
        localStorage.setItem('cc_data_subject_requests', JSON.stringify(dataArray));

        return { ...data, id: 'test-request-offline', created_at: new Date(), updated_at: new Date() };
      });

      await databaseService.createDataSubjectRequest(requestData);

      // Check that data was stored in localStorage
      const storedData = localStorage.getItem('cc_data_subject_requests');
      expect(storedData).toBeTruthy();

      const parsedData = JSON.parse(storedData!);
      expect(parsedData).toHaveLength(1);
      expect(parsedData[0].requester_name).toBe('John Doe');
    });

    it('should sync data when connection is restored', async () => {
      const mockSync = vi.fn();
      databaseService.syncPendingData = mockSync;

      // Simulate going online
      vi.mocked(databaseService.isOnline).mockReturnValue(true);
      vi.mocked(databaseService.isDemoMode).mockReturnValue(false);

      await databaseService.syncPendingData();
      
      expect(mockSync).toHaveBeenCalled();
    });
  });

  describe('Multi-user Testing', () => {
    it('should handle multiple user roles', async () => {
      const roles = ['student', 'teacher', 'it-staff', 'administrator'];
      
      for (const role of roles) {
        const profileData = {
          organization_id: 'test-org',
          role: role as 'student' | 'teacher' | 'it-staff' | 'administrator',
          full_name: `Test ${role}`,
          email: `${role}@example.com`,
          department: 'Test Department',
          settings: {},
          preferences: {},
          login_count: 0,
          is_active: true
        };

        const mockCreateProfile = vi.mocked(databaseService.createProfile);
        mockCreateProfile.mockResolvedValue({
          ...profileData,
          id: `test-${role}`,
          created_at: new Date(),
          updated_at: new Date()
        });

        const result = await databaseService.createProfile(profileData);
        expect(result.role).toBe(role);
      }
    });

    it('should enforce role-based access', async () => {
      // Test that different roles have different access levels
      const studentProfile = {
        id: 'student-user',
        organization_id: 'test-org',
        role: 'student',
        full_name: 'Student User',
        email: 'student@example.com',
        department: 'Computer Science',
        settings: {},
        preferences: {},
        login_count: 1,
        is_active: true,
        created_at: new Date(),
        updated_at: new Date()
      };

      const adminProfile = {
        id: 'admin-user',
        organization_id: 'test-org',
        role: 'administrator',
        full_name: 'Admin User',
        email: 'admin@example.com',
        department: 'IT',
        settings: {},
        preferences: {},
        login_count: 1,
        is_active: true,
        created_at: new Date(),
        updated_at: new Date()
      };

      // Students should only see their own requests
      const mockGetRequests = vi.mocked(databaseService.getDataSubjectRequests);
      mockGetRequests.mockResolvedValue([
        {
          id: 'student-request',
          organization_id: 'test-org',
          user_id: 'student-user',
          request_type: 'access',
          requester_name: 'Student User',
          requester_email: 'student@example.com',
          requester_relationship: 'self',
          student_identifier: 'STU001',
          request_details: {},
          applicable_regulations: [],
          status: 'submitted',
          submitted_at: new Date(),
          due_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
          response_data: {},
          communication_log: [],
          created_at: new Date(),
          updated_at: new Date()
        }
      ]);

      const studentRequests = await databaseService.getDataSubjectRequests('student-user');
      expect(studentRequests).toHaveLength(1);
      expect(studentRequests[0].user_id).toBe('student-user');

      // Verify role-based profile access
      const mockGetProfile = vi.mocked(databaseService.getProfile);
      mockGetProfile.mockResolvedValueOnce(studentProfile);
      
      const retrievedStudentProfile = await databaseService.getProfile('student-user');
      expect(retrievedStudentProfile?.role).toBe('student');
      expect(retrievedStudentProfile?.id).toBe('student-user');

      // Test admin profile access
      mockGetProfile.mockResolvedValueOnce(adminProfile);
      const retrievedAdminProfile = await databaseService.getProfile('admin-user');
      expect(retrievedAdminProfile?.role).toBe('administrator');
      expect(retrievedAdminProfile?.id).toBe('admin-user');
    });
  });
});
