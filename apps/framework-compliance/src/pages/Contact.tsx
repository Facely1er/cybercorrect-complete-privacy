import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { 
  Mail, 
  Send, 
  User, 
  Building,
  Shield,
  ArrowLeft,
  Phone,
  MapPin
} from 'lucide-react';
import { toast } from '../components/ui/Toaster';

const Contact = () => {
  const [contactForm, setContactForm] = useState({
    name: '',
    email: '',
    company: '',
    phone: '',
    subject: '',
    message: '',
    priority: 'medium',
    department: 'general'
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleContactFormChange = (field: string, value: string) => {
    setContactForm(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleContactFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    toast.success('Message sent!', 'We\'ll get back to you within 24 hours');
    
    // Reset form
    setContactForm({
      name: '',
      email: '',
      company: '',
      phone: '',
      subject: '',
      message: '',
      priority: 'medium',
      department: 'general'
    });
    
    setIsSubmitting(false);
  };

  return (
    <div>
      {/* Page Header */}
      <section className="py-8 border-b border-border bg-surface dark:bg-dark-bg">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <h1 className="text-3xl md:text-4xl font-semibold text-foreground">Contact Us</h1>
            <p className="text-muted-foreground mt-2">Get in touch with our team for support, sales, or general inquiries</p>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-8">
        <Link to="/resources" className="inline-flex items-center text-muted-foreground hover:text-primary transition-colors mb-8">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Resources
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {/* Contact Info Sidebar */}
          <div className="space-y-6">
            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold mb-4 text-foreground">Contact Information</h3>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <Mail className="h-5 w-5 text-primary mt-0.5" />
                    <div>
                      <p className="font-medium text-foreground">Email</p>
                      <a href="mailto:support@cybercorrect.com" className="text-sm text-muted-foreground hover:text-primary">
                        support@cybercorrect.com
                      </a>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Phone className="h-5 w-5 text-primary mt-0.5" />
                    <div>
                      <p className="font-medium text-foreground">Phone</p>
                      <p className="text-sm text-muted-foreground">+1 (555) 123-4567</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <MapPin className="h-5 w-5 text-primary mt-0.5" />
                    <div>
                      <p className="font-medium text-foreground">Address</p>
                      <p className="text-sm text-muted-foreground">
                        123 Privacy Street<br />
                        Suite 456<br />
                        San Francisco, CA 94102
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold mb-3 text-foreground">Response Times</h3>
                <ul className="text-sm space-y-2 text-muted-foreground">
                  <li className="flex justify-between">
                    <span>General Inquiries</span>
                    <span className="text-foreground">24-48 hours</span>
                  </li>
                  <li className="flex justify-between">
                    <span>Technical Support</span>
                    <span className="text-foreground">4-8 hours</span>
                  </li>
                  <li className="flex justify-between">
                    <span>Critical Issues</span>
                    <span className="text-foreground">1-2 hours</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2">
            <Card>
              <CardContent className="p-6 sm:p-8">
                <h2 className="text-xl font-semibold mb-6 text-foreground">Send Us a Message</h2>
                <form onSubmit={handleContactFormSubmit} className="space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-sm font-medium mb-2 text-foreground">
                        <User className="h-4 w-4 inline mr-1" />
                        Full Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={contactForm.name}
                        onChange={(e) => handleContactFormChange('name', e.target.value)}
                        className="w-full px-4 py-2.5 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary text-foreground"
                        placeholder="Your full name"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium mb-2 text-foreground">
                        <Mail className="h-4 w-4 inline mr-1" />
                        Email Address *
                      </label>
                      <input
                        type="email"
                        required
                        value={contactForm.email}
                        onChange={(e) => handleContactFormChange('email', e.target.value)}
                        className="w-full px-4 py-2.5 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary text-foreground"
                        placeholder="your.email@company.com"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium mb-2 text-foreground">
                        <Building className="h-4 w-4 inline mr-1" />
                        Company/Organization
                      </label>
                      <input
                        type="text"
                        value={contactForm.company}
                        onChange={(e) => handleContactFormChange('company', e.target.value)}
                        className="w-full px-4 py-2.5 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary text-foreground"
                        placeholder="Your organization name"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium mb-2 text-foreground">Department</label>
                      <select
                        value={contactForm.department}
                        onChange={(e) => handleContactFormChange('department', e.target.value)}
                        className="w-full px-4 py-2.5 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary text-foreground"
                      >
                        <option value="general">General Inquiry</option>
                        <option value="sales">Sales</option>
                        <option value="support">Technical Support</option>
                        <option value="compliance">Compliance Consulting</option>
                        <option value="training">Training & Implementation</option>
                        <option value="billing">Billing & Accounts</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2 text-foreground">Priority Level</label>
                    <select
                      value={contactForm.priority}
                      onChange={(e) => handleContactFormChange('priority', e.target.value)}
                      className="w-full px-4 py-2.5 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary text-foreground"
                    >
                      <option value="low">Low - General question</option>
                      <option value="medium">Medium - Need assistance</option>
                      <option value="high">High - Urgent support needed</option>
                      <option value="critical">Critical - System down</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2 text-foreground">Subject *</label>
                    <input
                      type="text"
                      required
                      value={contactForm.subject}
                      onChange={(e) => handleContactFormChange('subject', e.target.value)}
                      className="w-full px-4 py-2.5 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary text-foreground"
                      placeholder="Brief description of your inquiry"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2 text-foreground">Message *</label>
                    <textarea
                      required
                      rows={5}
                      value={contactForm.message}
                      onChange={(e) => handleContactFormChange('message', e.target.value)}
                      className="w-full px-4 py-2.5 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary resize-vertical text-foreground"
                      placeholder="Please provide details about your inquiry..."
                    />
                  </div>
                  
                  <div className="bg-muted/30 p-4 rounded-lg">
                    <p className="text-sm text-muted-foreground">
                      <Shield className="h-4 w-4 inline mr-1" />
                      Your information is secure and will only be used to respond to your inquiry. 
                      We typically respond within 24 hours during business days.
                    </p>
                  </div>
                  
                  <div className="flex justify-end">
                    <Button type="submit" size="lg" className="px-8" disabled={isSubmitting}>
                      <Send className="h-4 w-4 mr-2" />
                      {isSubmitting ? 'Sending...' : 'Send Message'}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;

