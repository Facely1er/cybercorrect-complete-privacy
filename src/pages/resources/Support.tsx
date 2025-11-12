import React, { useState } from 'react';
import { Card, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Link } from 'react-router-dom';
import { useChatSupport } from '../../components/chat/ChatSupportProvider';
import { useChatbot } from '../../components/chat/ChatbotProvider';
import { MessageSquare, Mail, BookOpen, Video, FileQuestion, ArrowRight, Shield, FileText, HelpCircle, Notebook as Robot, Send, User, Building } from 'lucide-react';
import { toast } from '../../components/ui/Toaster';

const Support = () => {
  const { openChat } = useChatSupport();
  const { openChatbot } = useChatbot();
  
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

  const handleContactFormChange = (field: string, value: string) => {
    setContactForm(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleContactFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would typically send the form data to your backend
    // Contact form submission handled
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
  };
  
  const supportOptions = [
    {
      icon: MessageSquare,
      title: "Live Chat Support",
      description: "Get instant help from our support team",
      action: "Start Chat",
      availability: "24/7",
      onClick: () => openChat()
    },
    {
      icon: Robot,
      title: "Interactive Guide Bot",
      description: "Get guided assistance with our interactive bot",
      action: "Launch Guide",
      availability: "24/7",
      onClick: () => openChatbot()
    },
    {
      icon: Mail,
      title: "Email Support",
      description: "Send us your questions or issues",
      action: "Send Email",
      availability: "24/7",
      onClick: () => window.location.href = "mailto:support@cybercorrect.com"
    }
  ];

  const resources = [
    {
      icon: FileQuestion,
      title: "FAQs",
      description: "Find answers to common questions",
      articles: 100,
      path: "/documentation/faqs" 
    },
    {
      icon: BookOpen,
      title: "Knowledge Base",
      description: "Browse our comprehensive knowledge base",
      articles: 250,
      path: "/documentation"
    },
    {
      icon: Video, 
      title: "Video Tutorials",
      description: "Learn through step-by-step video guides",
      articles: 50,
      path: "/documentation/tutorials"
    }
  ];

  return (
    <div className="py-20">
      <div className="max-w-7xl mx-auto px-4">
        
        
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold mb-4">Support Center</h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Get the help you need to succeed with CyberCorrect Privacy Platform
          </p>
        </div>

        <div className="mb-16">
          <h2 className="text-2xl font-bold text-center mb-8">Contact Support</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {supportOptions.map((option, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <option.icon className="h-12 w-12 text-primary mb-4" />
                  <h3 className="text-xl font-semibold mb-2">{option.title}</h3>
                  <p className="text-muted-foreground mb-2">{option.description}</p>
                  <p className="text-sm text-primary mb-4">Available: {option.availability}</p>
                  <Button 
                    className="w-full" 
                    onClick={option.onClick}
                  >
                    {option.action}
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        <div>
          <h2 className="text-2xl font-bold text-center mb-8">Self-Help Resources</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {resources.map((resource, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <resource.icon className="h-12 w-12 text-primary mb-4" />
                  <h3 className="text-xl font-semibold mb-2">{resource.title}</h3>
                  <p className="text-muted-foreground mb-2">{resource.description}</p>
                  <p className="text-sm text-primary mb-4">{resource.articles}+ articles</p>
                  <Link to={resource.path}>
                    <Button variant="outline" className="w-full">
                      Browse
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Additional Support Section */}
        <div className="mt-16 bg-muted/30 rounded-lg p-8">
          <div className="max-w-3xl mx-auto text-center">
            <HelpCircle className="h-12 w-12 text-primary mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-4">Need More Specialized Support?</h2>
            <p className="text-muted-foreground mb-6">
              Our compliance experts are available for personalized consultations to help you navigate complex regulatory requirements.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <CardContent className="p-4">
                  <FileText className="h-8 w-8 text-primary mx-auto mb-2" />
                  <h3 className="font-medium">Compliance Documentation</h3>
                  <p className="text-sm text-muted-foreground mb-3">Get expert help with your compliance documentation</p>
                  <Link to="/documentation">
                    <Button variant="outline" size="sm" className="w-full">Learn More</Button>
                  </Link>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <Shield className="h-8 w-8 text-primary mx-auto mb-2" />
                  <h3 className="font-medium">Privacy Assessment</h3>
                  <p className="text-sm text-muted-foreground mb-3">Schedule a comprehensive privacy assessment</p>
                  <Link to="/assessments/privacy-assessment">
                    <Button variant="outline" size="sm" className="w-full">Learn More</Button>
                  </Link>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>

        {/* Contact Form Section */}
        <div className="mb-16">
        <h2 className="text-2xl font-bold text-center mb-8">Send Us a Message</h2>
        <div className="max-w-4xl mx-auto">
          <Card>
            <CardContent className="p-8">
              <form onSubmit={handleContactFormSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      <User className="h-4 w-4 inline mr-1" />
                      Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={contactForm.name}
                      onChange={(e) => handleContactFormChange('name', e.target.value)}
                      className="w-full px-4 py-3 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                      placeholder="Your full name"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      <Mail className="h-4 w-4 inline mr-1" />
                      Email Address *
                    </label>
                    <input
                      type="email"
                      required
                      value={contactForm.email}
                      onChange={(e) => handleContactFormChange('email', e.target.value)}
                      className="w-full px-4 py-3 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                      placeholder="your.email@company.com"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      <Building className="h-4 w-4 inline mr-1" />
                      Company/Organization
                    </label>
                    <input
                      type="text"
                      value={contactForm.company}
                      onChange={(e) => handleContactFormChange('company', e.target.value)}
                      className="w-full px-4 py-3 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                      placeholder="Your organization name"
                    />
                  </div>
                  
                  
                  
                  <div>
                    <label className="block text-sm font-medium mb-2">Department</label>
                    <select
                      value={contactForm.department}
                      onChange={(e) => handleContactFormChange('department', e.target.value)}
                      className="w-full px-4 py-3 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                    >
                      <option value="general">General Inquiry</option>
                      <option value="sales">Sales</option>
                      <option value="support">Technical Support</option>
                      <option value="compliance">Compliance Consulting</option>
                      <option value="training">Training & Implementation</option>
                      <option value="billing">Billing & Accounts</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2">Priority Level</label>
                    <select
                      value={contactForm.priority}
                      onChange={(e) => handleContactFormChange('priority', e.target.value)}
                      className="w-full px-4 py-3 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                    >
                      <option value="low">Low - General question</option>
                      <option value="medium">Medium - Need assistance</option>
                      <option value="high">High - Urgent support needed</option>
                      <option value="critical">Critical - System down</option>
                    </select>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">Subject *</label>
                  <input
                    type="text"
                    required
                    value={contactForm.subject}
                    onChange={(e) => handleContactFormChange('subject', e.target.value)}
                    className="w-full px-4 py-3 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="Brief description of your inquiry"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">Message *</label>
                  <textarea
                    required
                    rows={6}
                    value={contactForm.message}
                    onChange={(e) => handleContactFormChange('message', e.target.value)}
                    className="w-full px-4 py-3 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary resize-vertical"
                    placeholder="Please provide details about your inquiry, including any specific requirements or questions you have..."
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
                  <Button type="submit" size="lg" className="px-8">
                    <Send className="h-4 w-4 mr-2" />
                    Send Message
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

export default Support;