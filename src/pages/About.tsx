import React from 'react';
import { Card, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { 
  Shield, 
  Target, 
  Award, 
  Users,
  Smile,
  Globe,
  Heart,
  Zap,
  CheckCircle,
  BookOpen,
  Lock,
  FileCheck,
  Database,
  BarChart2,
  Network,
  Layers,
  FileText,
  ArrowRight,
  Fingerprint,
  ClipboardList,
  Settings,
  AlertTriangle,
  RefreshCw,
  LockKeyhole,
  Workflow,
  ArrowLeft
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from '../components/ui/Toaster';

const About = () => {
  const navigate = useNavigate();

  const values = [
    {
      icon: Shield,
      title: "Security First",
      description: "We prioritize security in everything we do, ensuring your sensitive data is protected."
    },
    {
      icon: Users,
      title: "Customer Focus",
      description: "Our customers' compliance success is our success. We're dedicated to delivering value."
    },
    {
      icon: Zap,
      title: "Innovation",
      description: "We continuously innovate to stay ahead of evolving compliance requirements and cybersecurity threats."
    },
    {
      icon: Heart,
      title: "Integrity",
      description: "We operate with transparency and maintain the highest ethical standards in all compliance matters."
    }
  ];

  const expertise = [
    {
      category: "Compliance & Regulatory",
      items: [
        "Information security regulatory frameworks",
        "Data protection standards",
        "Industry-specific compliance requirements",
        "Security assessment methodologies"
      ],
      icon: ClipboardList
    },
    {
      category: "Cybersecurity",
      items: [
        "Security controls implementation",
        "Risk assessment and management",
        "Security monitoring and incident response",
        "Security architecture and design"
      ],
      icon: Lock
    },
    {
      category: "Solutions & Services",
      items: [
        "Compliance assessment tools",
        "Risk management software",
        "Documentation automation",
        "Security controls mapping"
      ],
      icon: Settings
    }
  ];

  const features = [
    {
      icon: AlertTriangle,
      title: "Risk Assessment",
      description: "Identify, analyze, and prioritize security and compliance risks across your organization with our comprehensive risk assessment tools."
    },
    {
      icon: FileText,
      title: "Documentation Management",
      description: "Streamline compliance documentation with automated templates, version control, and evidence management."
    },
    {
      icon: Shield,
      title: "Control Implementation",
      description: "Efficiently implement security controls mapped to multiple compliance frameworks using our guided approach."
    },
    {
      icon: BarChart2,
      title: "Reporting and Analytics",
      description: "Generate comprehensive compliance reports and gain actionable insights with our advanced analytics dashboard."
    },
    {
      icon: Network,
      title: "Compliance Mapping",
      description: "Easily map controls across multiple regulatory frameworks to simplify your compliance efforts."
    }
  ];
  
  const industries = [
    {
      icon: Shield,
      title: "Defense Contractors",
      description: "Specialized solutions for CMMC compliance and CUI protection."
    },
    {
      icon: Database,
      title: "Government Agencies",
      description: "Tools for implementing NIST frameworks and managing regulatory requirements."
    },
    {
      icon: Fingerprint,
      title: "Privacy-Focused Organizations",
      description: "Data protection and privacy compliance solutions aligned with global standards."
    },
    {
      icon: Workflow,
      title: "Supply Chain Management",
      description: "End-to-end solutions for securing supply chains and third-party risk management."
    }
  ];

  const approach = [
    {
      number: 1,
      title: "Assess",
      description: "We begin by thoroughly assessing your current compliance posture, identifying gaps, and understanding your specific needs.",
      icon: ClipboardList
    },
    {
      number: 2,
      title: "Implement",
      description: "Our platform guides you through implementing necessary controls and security measures to meet compliance requirements.",
      icon: Settings
    },
    {
      number: 3,
      title: "Document",
      description: "We automate the documentation process, creating comprehensive policies, procedures, and evidence collections.",
      icon: FileText
    },
    {
      number: 4,
      title: "Monitor",
      description: "Continuous monitoring ensures ongoing compliance and alerts you to any deviations or emerging risks.",
      icon: RefreshCw
    }
  ];

  const handleScheduleConsultation = () => {
    toast.success('Consultation request received', 'We\'ll contact you shortly to schedule your consultation');
    navigate('/demo');
  };

  const handleExploreSolutions = () => {
    navigate('/features');
  };

  const handleContactSubmit = (e) => {
    e.preventDefault();
    toast.success('Message sent!', 'We\'ll get back to you as soon as possible');
    // In a real app, this would send the form data to a server
  };

  return (
    <div>
      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-to-b from-primary-teal/5 to-transparent dark:from-dark-primary/10">
        <Link to="/" className="absolute top-8 left-8 inline-flex items-center text-foreground hover:text-primary transition-colors mb-4">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Home
        </Link>
        <div className="container mx-auto px-4 relative z-10">
          <div className="flex flex-col items-center text-center">
            <Shield className="h-16 w-16 text-primary-teal dark:text-dark-primary mb-6" />
            <h1 className="text-4xl md:text-5xl font-bold mb-4 text-foreground">About CyberCorrect</h1>
            <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto">
              Empowering organizations to manage risk, protect sensitive information, and ensure regulatory compliance effectively
            </p>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-8 text-foreground">Our Mission</h2>
            <div className="bg-muted/30 rounded-lg p-8 text-center">
              <Target className="h-12 w-12 text-primary mx-auto mb-6" />
              <p className="text-lg text-foreground">
                To simplify cybersecurity compliance through innovative technology and expert guidance, enabling organizations to secure their data and meet regulatory requirements.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="py-16 bg-gradient-to-b from-transparent to-muted/20 dark:from-transparent dark:to-dark-support/10">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12 text-foreground">Our Core Values</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
            {values.map((value, index) => (
              <Card key={index} className="border border-support-gray dark:border-dark-support hover:shadow-md transition-all duration-300">
                <CardContent className="p-6 text-center">
                  <div className="bg-primary-teal/10 dark:bg-dark-primary/20 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                    <value.icon className="h-8 w-8 text-primary-teal dark:text-dark-primary" />
                  </div>
                  <h3 className="text-xl font-semibold mb-3 text-foreground">{value.title}</h3>
                  <p className="text-muted-foreground">{value.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Our Approach */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12 text-foreground">Our Approach</h2>
          <div className="max-w-5xl mx-auto">
            <div className="relative">
              {/* Connecting line */}
              <div className="absolute left-8 top-10 bottom-10 w-1 bg-primary-teal/20 dark:bg-dark-primary/20 hidden md:block"></div>
              
              <div className="space-y-12">
                {approach.map((step, index) => (
                  <div key={index} className="flex flex-col md:flex-row items-start gap-6">
                    <div className="flex-shrink-0 bg-primary-teal/10 dark:bg-dark-primary/20 w-16 h-16 rounded-full flex items-center justify-center text-primary-teal dark:text-dark-primary font-bold text-xl relative z-10">
                      {step.number}
                    </div>
                    <div>
                      <div className="flex items-center mb-2">
                        <step.icon className="h-5 w-5 text-primary-teal dark:text-dark-primary mr-2" />
                        <h3 className="text-xl font-semibold text-foreground">{step.title}</h3>
                      </div>
                      <p className="text-muted-foreground">{step.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Platform Features */}
      <section className="py-16 bg-gradient-to-b from-muted/10 to-transparent dark:from-dark-support/5 dark:to-transparent">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-4 text-foreground">Platform Features</h2>
          <p className="text-center text-muted-foreground max-w-3xl mx-auto mb-12">
            Our comprehensive compliance platform offers a suite of powerful features designed to simplify and streamline your regulatory compliance journey.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {features.map((feature, index) => (
              <Card key={index} className="border border-support-gray dark:border-dark-support hover:shadow-md transition-all duration-300">
                <CardContent className="p-6">
                  <div className="bg-primary-teal/10 dark:bg-dark-primary/20 rounded-lg w-12 h-12 flex items-center justify-center mb-4">
                    <feature.icon className="h-6 w-6 text-primary-teal dark:text-dark-primary" />
                  </div>
                  <h3 className="text-xl font-semibold mb-3 text-foreground">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Expertise Areas */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12 text-foreground">Areas of Expertise</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 max-w-6xl mx-auto">
            {expertise.map((area, index) => (
              <div key={index}>
                <div className="flex items-center mb-4">
                  <div className="bg-primary-teal/10 dark:bg-dark-primary/20 rounded-lg p-3 mr-3">
                    <area.icon className="h-6 w-6 text-primary-teal dark:text-dark-primary" />
                  </div>
                  <h3 className="text-xl font-semibold text-foreground">{area.category}</h3>
                </div>
                <ul className="space-y-2 pl-4">
                  {area.items.map((item, itemIndex) => (
                    <li key={itemIndex} className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-primary-teal dark:text-dark-primary mr-2 mt-0.5 flex-shrink-0" />
                      <span className="text-muted-foreground">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Industry Focus */}
      <section className="py-16 bg-gradient-to-b from-transparent to-muted/20 dark:from-transparent dark:to-dark-support/10">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-4 text-foreground">Industry Focus</h2>
          <p className="text-center text-muted-foreground max-w-3xl mx-auto mb-12">
            CyberCorrect delivers specialized solutions for organizations with complex regulatory requirements and sensitive data protection needs.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {industries.map((industry, index) => (
              <Card key={index} className="border border-support-gray dark:border-dark-support hover:shadow-md transition-all duration-300">
                <CardContent className="p-6 text-center">
                  <industry.icon className="h-12 w-12 text-primary-teal dark:text-dark-primary mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-3 text-foreground">{industry.title}</h3>
                  <p className="text-sm text-muted-foreground">{industry.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Team Expertise & Certifications */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-8 text-foreground">Team Expertise & Certifications</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {[
                {
                  category: "Risk Management",
                  certifications: [
                    "CRISC (Certified in Risk and Information Systems Control)",
                    "CISM (Certified Information Security Manager)",
                    "ISO 31000 Risk Manager",
                    "CISRM (Certified Information Security Risk Manager)"
                  ],
                  icon: Shield
                },
                {
                  category: "Security & Compliance",
                  certifications: [
                    "CISSP (Certified Information Systems Security Professional)",
                    "CISA (Certified Information Systems Auditor)",
                    "CompTIA Security+",
                    "CEH (Certified Ethical Hacker)"
                  ],
                  icon: Lock
                },
                {
                  category: "Project Management",
                  certifications: [
                    "PMP (Project Management Professional)",
                    "PMI-RMP (Risk Management Professional)",
                    "PMI-ACP (Agile Certified Practitioner)",
                    "PRINCE2 Practitioner"
                  ],
                  icon: ClipboardList
                },
                {
                  category: "Quality & Standards",
                  certifications: [
                    "ISO 27001 Lead Auditor",
                    "ISO 27001 Lead Implementer",
                    "ISO 22301 Business Continuity",
                    "ITIL Expert"
                  ],
                  icon: Award
                }
              ].map((area, index) => (
                <Card key={index} className="hover:shadow-lg transition-shadow dark:border-muted">
                  <CardContent className="p-6">
                    <div className="flex items-center mb-6">
                      <div className="rounded-full p-3 bg-primary/10">
                        <area.icon className="h-6 w-6 text-primary" />
                      </div>
                      <h3 className="text-xl font-semibold ml-4">{area.category}</h3>
                    </div>
                    <div className="space-y-3">
                      {area.certifications.map((cert, certIndex) => (
                        <div key={certIndex} className="flex items-start">
                          <Award className="h-5 w-5 text-primary mr-2 flex-shrink-0 mt-0.5" />
                          <span className="text-sm text-foreground">{cert}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Global Impact */}
      <section className="py-16 bg-gradient-to-b from-muted/10 to-transparent dark:from-dark-support/5 dark:to-transparent">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-8 text-foreground">Global Impact</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto text-center">
              <div>
                <div className="text-4xl font-bold text-primary-teal dark:text-dark-primary mb-2">1000+</div>
                <p className="text-muted-foreground">Organizations Protected</p>
              </div>
              <div>
                <div className="text-4xl font-bold text-primary-teal dark:text-dark-primary mb-2">50+</div>
                <p className="text-muted-foreground">Countries Served</p>
              </div>
              <div>
                <div className="text-4xl font-bold text-primary-teal dark:text-dark-primary mb-2">99.9%</div>
                <p className="text-muted-foreground">Uptime Guarantee</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto bg-gradient-to-r from-primary-teal to-secondary-teal dark:from-dark-primary dark:to-dark-primary/70 rounded-xl p-8 text-white text-center">
            <h2 className="text-2xl font-bold mb-4">Ready to Secure Your Compliance Journey?</h2>
            <p className="text-lg mb-6">
              Schedule a consultation with our compliance experts to learn how CyberCorrect can transform your approach to security and regulatory compliance.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Button className="bg-white text-primary-teal hover:bg-gray-100 border-2 border-white font-semibold shadow-lg" onClick={handleScheduleConsultation}>
                Schedule a Consultation
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button className="bg-gray-900 text-white hover:bg-gray-800 border-2 border-gray-900 font-semibold shadow-lg" onClick={handleExploreSolutions}>
                Explore Solutions
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Form Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12 text-foreground">Get in Touch</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <Card className="dark:border-muted">
                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold mb-6">Contact Information</h3>
                  <div className="space-y-4">
                    <div className="flex items-start">
                      <div className="bg-primary-teal/10 dark:bg-dark-primary/20 p-2 rounded mr-3 mt-1">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5 text-primary-teal dark:text-dark-primary">
                          <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                        </svg>
                      </div>
                      <div>
                        <p className="font-medium">Phone</p>
                        <p className="text-muted-foreground">+1 (888) 618-6160</p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <div className="bg-primary-teal/10 dark:bg-dark-primary/20 p-2 rounded mr-3 mt-1">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5 text-primary-teal dark:text-dark-primary">
                          <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                          <polyline points="22,6 12,13 2,6"></polyline>
                        </svg>
                      </div>
                      <div>
                        <p className="font-medium">Email</p>
                        <p className="text-muted-foreground">contact@ermits.com</p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <div className="bg-primary-teal/10 dark:bg-dark-primary/20 p-2 rounded mr-3 mt-1">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5 text-primary-teal dark:text-dark-primary">
                          <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                          <circle cx="12" cy="10" r="3"></circle>
                        </svg>
                      </div>
                      <div>
                        <p className="font-medium">Address</p>
                        <p className="text-muted-foreground">8300 McCullough Lane, Suite 203<br/>Gaithersburg, MD 20877</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="dark:border-muted">
                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold mb-6">Send us a message</h3>
                  <form className="space-y-4" onSubmit={handleContactSubmit}>
                    <div>
                      <label className="block text-sm font-medium mb-1">Name</label>
                      <input 
                        type="text" 
                        className="w-full px-3 py-2 border border-support-gray dark:border-dark-support rounded-md bg-surface dark:bg-dark-surface"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Email</label>
                      <input 
                        type="email" 
                        className="w-full px-3 py-2 border border-support-gray dark:border-dark-support rounded-md bg-surface dark:bg-dark-surface"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Message</label>
                      <textarea 
                        rows={4}
                        className="w-full px-3 py-2 border border-support-gray dark:border-dark-support rounded-md bg-surface dark:bg-dark-surface"
                      ></textarea>
                    </div>
                    <Button type="submit" className="w-full">
                      Send Message
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;