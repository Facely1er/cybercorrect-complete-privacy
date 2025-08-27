import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { useAuth } from '../context/AuthContext';
import { toast } from '../components/ui/Toaster';
import { 
  User, 
  Mail, 
  Shield, 
  Calendar, 
  Save, 
  Pencil, 
  LogOut, 
  UserCircle,
  Building,
  Briefcase
} from 'lucide-react';
import { Link } from 'react-router-dom';

const UserProfile = () => {
  const { user, logout } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    jobTitle: 'Security Analyst',
    department: 'Cybersecurity',
    company: 'ACME Defense Systems',
    phone: '+1 (555) 123-4567',
    joinDate: '2023-05-15',
  });

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <UserCircle className="h-20 w-20 text-muted-foreground mx-auto mb-6" />
        <h1 className="text-2xl font-bold mb-4 text-foreground">Not Logged In</h1>
        <p className="text-muted-foreground mb-6">You need to be logged in to view your profile.</p>
        <Link to="/login">
          <Button>Log In</Button>
        </Link>
      </div>
    );
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProfileData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSaveProfile = () => {
    // In a real app, you would save these changes to the backend
    setIsEditing(false);
    toast.success('Profile updated', 'Your profile changes have been saved successfully');
  };

  const handleLogout = () => {
    logout();
    toast.info('Logged out', 'You have been successfully logged out');
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-3xl font-bold mb-6 text-foreground">User Profile</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Profile Overview Card */}
        <div className="md:col-span-1">
          <Card className="border border-support-gray dark:border-dark-support">
            <CardContent className="p-6 flex flex-col items-center text-center">
              <div className="w-32 h-32 rounded-full bg-muted flex items-center justify-center mb-4">
                <UserCircle className="h-20 w-20 text-muted-foreground" />
              </div>
              
              <h2 className="text-xl font-bold text-foreground">{user.name}</h2>
              <p className="text-muted-foreground mb-2">{profileData.jobTitle}</p>
              <p className="text-primary-teal dark:text-dark-primary text-sm">{user.role.replace('_', ' ').toUpperCase()}</p>
              
              <div className="border-t border-border w-full mt-4 pt-4">
                <div className="flex items-center justify-center mb-2">
                  <Mail className="h-4 w-4 mr-2 text-muted-foreground" />
                  <span className="text-sm">{user.email}</span>
                </div>
                <div className="flex items-center justify-center">
                  <Building className="h-4 w-4 mr-2 text-muted-foreground" />
                  <span className="text-sm">{profileData.company}</span>
                </div>
              </div>

              <Button 
                variant="destructive" 
                className="mt-6 w-full" 
                onClick={handleLogout}
              >
                <LogOut className="mr-2 h-4 w-4" />
                Logout
              </Button>
            </CardContent>
          </Card>

          {/* Quick Stats */}
          <Card className="mt-6 border border-support-gray dark:border-dark-support">
            <CardHeader>
              <CardTitle className="text-lg">Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Last Assessment</span>
                  <span className="text-sm font-medium">2 days ago</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Completed Assessments</span>
                  <span className="text-sm font-medium">12</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">POA&Ms Created</span>
                  <span className="text-sm font-medium">5</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Profile Content */}
        <div className="md:col-span-2">
          <Card className="border border-support-gray dark:border-dark-support">
            <CardHeader className="pb-3">
              <div className="flex justify-between items-center">
                <CardTitle className="text-xl">Profile Information</CardTitle>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => setIsEditing(!isEditing)}
                >
                  {isEditing ? 'Cancel' : (
                    <>
                      <Pencil className="mr-2 h-4 w-4" />
                      Edit
                    </>
                  )}
                </Button>
              </div>
              <CardDescription>Manage your personal information</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium block mb-1">Full Name</label>
                    {isEditing ? (
                      <input
                        type="text"
                        name="name"
                        value={profileData.name}
                        onChange={handleInputChange}
                        className="w-full rounded-md border-border bg-background py-2 px-3 text-sm"
                      />
                    ) : (
                      <div className="flex items-center">
                        <User className="h-4 w-4 mr-2 text-primary-teal dark:text-dark-primary" />
                        <span>{profileData.name}</span>
                      </div>
                    )}
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium block mb-1">Email</label>
                    {isEditing ? (
                      <input
                        type="email"
                        name="email"
                        value={profileData.email}
                        onChange={handleInputChange}
                        className="w-full rounded-md border-border bg-background py-2 px-3 text-sm"
                      />
                    ) : (
                      <div className="flex items-center">
                        <Mail className="h-4 w-4 mr-2 text-primary-teal dark:text-dark-primary" />
                        <span>{profileData.email}</span>
                      </div>
                    )}
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium block mb-1">Job Title</label>
                    {isEditing ? (
                      <input
                        type="text"
                        name="jobTitle"
                        value={profileData.jobTitle}
                        onChange={handleInputChange}
                        className="w-full rounded-md border-border bg-background py-2 px-3 text-sm"
                      />
                    ) : (
                      <div className="flex items-center">
                        <Briefcase className="h-4 w-4 mr-2 text-primary-teal dark:text-dark-primary" />
                        <span>{profileData.jobTitle}</span>
                      </div>
                    )}
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium block mb-1">Department</label>
                    {isEditing ? (
                      <input
                        type="text"
                        name="department"
                        value={profileData.department}
                        onChange={handleInputChange}
                        className="w-full rounded-md border-border bg-background py-2 px-3 text-sm"
                      />
                    ) : (
                      <div className="flex items-center">
                        <Building className="h-4 w-4 mr-2 text-primary-teal dark:text-dark-primary" />
                        <span>{profileData.department}</span>
                      </div>
                    )}
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium block mb-1">Phone</label>
                    {isEditing ? (
                      <input
                        type="text"
                        name="phone"
                        value={profileData.phone}
                        onChange={handleInputChange}
                        className="w-full rounded-md border-border bg-background py-2 px-3 text-sm"
                      />
                    ) : (
                      <div className="flex items-center">
                        <Phone className="h-4 w-4 mr-2 text-primary-teal dark:text-dark-primary" />
                        <span>{profileData.phone}</span>
                      </div>
                    )}
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium block mb-1">Join Date</label>
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-2 text-primary-teal dark:text-dark-primary" />
                      <span>{profileData.joinDate}</span>
                    </div>
                  </div>
                </div>

                {isEditing && (
                  <div className="flex justify-end mt-4">
                    <Button onClick={handleSaveProfile}>
                      <Save className="mr-2 h-4 w-4" />
                      Save Changes
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Compliance Role */}
          <Card className="mt-6 border border-support-gray dark:border-dark-support">
            <CardHeader className="pb-3">
              <CardTitle className="text-xl">Compliance Role & Permissions</CardTitle>
              <CardDescription>Your system access and permissions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <Shield className="h-5 w-5 text-primary-teal dark:text-dark-primary mt-0.5" />
                  <div>
                    <p className="font-medium">{user.role.replace('_', ' ').charAt(0).toUpperCase() + user.role.replace('_', ' ').slice(1)}</p>
                    <p className="text-sm text-muted-foreground">
                      {user.role === 'admin' && 'Full system access with ability to manage users and system settings.'}
                      {user.role === 'risk_manager' && 'Ability to manage risks, treatments, and generate reports.'}
                      {user.role === 'auditor' && 'Read-only access to compliance data for auditing purposes.'}
                      {user.role === 'viewer' && 'Limited view access to compliance information and reports.'}
                    </p>
                  </div>
                </div>
                
                <div className="bg-muted/30 dark:bg-muted/20 rounded-lg p-4">
                  <h4 className="text-sm font-medium mb-2">Access Permissions:</h4>
                  <ul className="space-y-1 text-sm">
                    {user.role === 'admin' && (
                      <>
                        <li className="flex items-center">
                          <CheckCircle className="h-4 w-4 text-success mr-2" />
                          <span>User management</span>
                        </li>
                        <li className="flex items-center">
                          <CheckCircle className="h-4 w-4 text-success mr-2" />
                          <span>System configuration</span>
                        </li>
                      </>
                    )}
                    <li className="flex items-center">
                      <CheckCircle className="h-4 w-4 text-success mr-2" />
                      <span>Assessment tools access</span>
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="h-4 w-4 text-success mr-2" />
                      <span>Reporting and analytics</span>
                    </li>
                    {(user.role === 'admin' || user.role === 'risk_manager') && (
                      <li className="flex items-center">
                        <CheckCircle className="h-4 w-4 text-success mr-2" />
                        <span>Create and manage POA&Ms</span>
                      </li>
                    )}
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card className="mt-6 border border-support-gray dark:border-dark-support">
            <CardHeader className="pb-3">
              <CardTitle className="text-xl">Recent Activity</CardTitle>
              <CardDescription>Your latest actions in the system</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center py-3 border-b border-border">
                  <div className="flex items-center">
                    <div className="bg-primary/10 p-2 rounded mr-3">
                      <FileText className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium">Completed CMMC Quick Check</p>
                      <p className="text-sm text-muted-foreground">Score: 78%</p>
                    </div>
                  </div>
                  <span className="text-xs text-muted-foreground">2 days ago</span>
                </div>
                
                <div className="flex justify-between items-center py-3 border-b border-border">
                  <div className="flex items-center">
                    <div className="bg-primary/10 p-2 rounded mr-3">
                      <Database className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium">Created CUI Data Flow Map</p>
                      <p className="text-sm text-muted-foreground">5 nodes, 6 connections</p>
                    </div>
                  </div>
                  <span className="text-xs text-muted-foreground">1 week ago</span>
                </div>
                
                <div className="flex justify-between items-center py-3">
                  <div className="flex items-center">
                    <div className="bg-primary/10 p-2 rounded mr-3">
                      <FileCheck className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium">Generated POA&M</p>
                      <p className="text-sm text-muted-foreground">8 action items</p>
                    </div>
                  </div>
                  <span className="text-xs text-muted-foreground">2 weeks ago</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;