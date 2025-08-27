import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Shield, Lock, FileText, CheckCircle, ArrowLeft } from 'lucide-react';

const Privacy = () => {
  return (
    <div className="py-20">
      <div className="max-w-4xl mx-auto px-6">
        <Link to="/" className="inline-flex items-center text-foreground hover:text-primary transition-colors mb-8">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Home
        </Link>

        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold mb-4 text-foreground">Privacy Policy</h1>
          <p className="text-xl text-muted-foreground">
            How CyberCorrect collects, uses, and protects your personal information
          </p>
        </div>

        <div className="space-y-8">
          <Card>
            <CardContent className="p-6">
              <h2 className="text-2xl font-semibold mb-4 flex items-center">
                <Shield className="h-6 w-6 text-primary mr-2" />
                Our Commitment to Privacy
              </h2>
              <p className="text-muted-foreground mb-4">
                At CyberCorrect, we take your privacy seriously. This Privacy Policy explains how we collect, use, disclose, 
                and safeguard your information when you use our platform and services. Please read this privacy policy 
                carefully. If you do not agree with the terms of this privacy policy, please do not access the site.
              </p>
              <p className="text-muted-foreground">
                We reserve the right to make changes to this Privacy Policy at any time and for any reason. We will alert 
                you about any changes by updating the "Last Updated" date of this privacy policy. You are encouraged to 
                periodically review this privacy policy to stay informed of updates.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <h2 className="text-2xl font-semibold mb-4 flex items-center">
                <FileText className="h-6 w-6 text-primary mr-2" />
                Information We Collect
              </h2>
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-medium mb-2">Personal Data</h3>
                  <p className="text-muted-foreground">
                    We may collect personal identification information, including but not limited to:
                  </p>
                  <ul className="list-disc ml-6 mt-2 space-y-1 text-muted-foreground">
                    <li>Name</li>
                    <li>Email address</li>
                    <li>Phone number</li>
                    <li>Job title and organization</li>
                    <li>IP address and browser information</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-medium mb-2">Usage Data</h3>
                  <p className="text-muted-foreground">
                    We automatically collect certain information when you visit, use or navigate our platform. This information 
                    may include device type, browser type, operating system, IP address, and pages visited.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <h2 className="text-2xl font-semibold mb-4 flex items-center">
                <Lock className="h-6 w-6 text-primary mr-2" />
                How We Use Your Information
              </h2>
              <p className="text-muted-foreground mb-4">
                We use the information we collect in various ways, including to:
              </p>
              <ul className="space-y-2">
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-primary mr-2 mt-0.5 flex-shrink-0" />
                  <span className="text-muted-foreground">Provide, operate, and maintain our platform</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-primary mr-2 mt-0.5 flex-shrink-0" />
                  <span className="text-muted-foreground">Improve, personalize, and expand our platform</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-primary mr-2 mt-0.5 flex-shrink-0" />
                  <span className="text-muted-foreground">Understand and analyze how you use our platform</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-primary mr-2 mt-0.5 flex-shrink-0" />
                  <span className="text-muted-foreground">Develop new products, services, features, and functionality</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-primary mr-2 mt-0.5 flex-shrink-0" />
                  <span className="text-muted-foreground">Communicate with you about updates, security alerts, and support</span>
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <h2 className="text-2xl font-semibold mb-4 flex items-center">
                <Shield className="h-6 w-6 text-primary mr-2" />
                How We Protect Your Information
              </h2>
              <p className="text-muted-foreground mb-4">
                We adopt appropriate data collection, storage, and processing practices and security measures to protect 
                against unauthorized access, alteration, disclosure, or destruction of your personal information and data 
                stored on our platform. Our security measures include:
              </p>
              <ul className="space-y-2">
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-primary mr-2 mt-0.5 flex-shrink-0" />
                  <span className="text-muted-foreground">End-to-end encryption for all data in transit and at rest</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-primary mr-2 mt-0.5 flex-shrink-0" />
                  <span className="text-muted-foreground">Regular security assessments and penetration testing</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-primary mr-2 mt-0.5 flex-shrink-0" />
                  <span className="text-muted-foreground">Role-based access controls for all system users</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-primary mr-2 mt-0.5 flex-shrink-0" />
                  <span className="text-muted-foreground">Regular security training for all employees</span>
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>

        <div className="mt-8 text-center">
          <p className="text-sm text-muted-foreground mb-2">Last Updated: May 1, 2023</p>
          <div className="space-x-4 mt-4">
            <Link to="/terms">
              <Button variant="outline">Terms of Service</Button>
            </Link>
            <Link to="/cookies">
              <Button variant="outline">Cookie Policy</Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Privacy;