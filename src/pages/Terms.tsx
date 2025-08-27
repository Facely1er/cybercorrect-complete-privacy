import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { FileText, Scale, AlertTriangle, CheckCircle, ArrowLeft } from 'lucide-react';

const Terms = () => {
  return (
    <div className="py-20">
      <div className="max-w-4xl mx-auto px-6">
        <Link to="/" className="inline-flex items-center text-foreground hover:text-primary transition-colors mb-8">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Home
        </Link>

        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold mb-4 text-foreground">Terms of Service</h1>
          <p className="text-xl text-muted-foreground">
            Please read these terms carefully before using our platform
          </p>
        </div>

        <div className="space-y-8">
          <Card>
            <CardContent className="p-6">
              <h2 className="text-2xl font-semibold mb-4 flex items-center">
                <FileText className="h-6 w-6 text-primary mr-2" />
                Introduction
              </h2>
              <p className="text-muted-foreground mb-4">
                These Terms of Service ("Terms") govern your access to and use of the CyberCorrect platform, 
                including any applications, websites, software, and services (collectively, "Services") 
                provided by CyberCorrect, Inc. ("CyberCorrect," "we," "us," or "our").
              </p>
              <p className="text-muted-foreground">
                By accessing or using our Services, you agree to be bound by these Terms. If you do not agree to these 
                Terms, you may not access or use the Services.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <h2 className="text-2xl font-semibold mb-4 flex items-center">
                <Scale className="h-6 w-6 text-primary mr-2" />
                Use of Services
              </h2>
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-medium mb-2">Account Registration</h3>
                  <p className="text-muted-foreground">
                    To access certain features of our Services, you may be required to register for an account. 
                    You agree to provide accurate, current, and complete information during the registration process 
                    and to update such information to keep it accurate, current, and complete.
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-medium mb-2">Account Security</h3>
                  <p className="text-muted-foreground">
                    You are responsible for safeguarding your account credentials and for all activities that occur under your account. 
                    You agree to notify us immediately of any unauthorized use of your account or any other breach of security.
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-medium mb-2">Acceptable Use</h3>
                  <p className="text-muted-foreground mb-2">
                    You agree not to use our Services:
                  </p>
                  <ul className="list-disc ml-6 space-y-1 text-muted-foreground">
                    <li>In any way that violates any applicable federal, state, local, or international law or regulation</li>
                    <li>To transmit, or procure the sending of, any advertising or promotional material, including any "junk mail," "chain letter," or "spam"</li>
                    <li>To impersonate or attempt to impersonate CyberCorrect, a CyberCorrect employee, another user, or any other person or entity</li>
                    <li>To engage in any other conduct that restricts or inhibits anyone's use or enjoyment of the Services</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <h2 className="text-2xl font-semibold mb-4 flex items-center">
                <AlertTriangle className="h-6 w-6 text-primary mr-2" />
                Limitation of Liability
              </h2>
              <p className="text-muted-foreground mb-4">
                IN NO EVENT WILL CYBERCORRECT, ITS AFFILIATES, OR THEIR LICENSORS, SERVICE PROVIDERS, EMPLOYEES, 
                AGENTS, OFFICERS, OR DIRECTORS BE LIABLE FOR DAMAGES OF ANY KIND, UNDER ANY LEGAL THEORY, ARISING 
                OUT OF OR IN CONNECTION WITH YOUR USE, OR INABILITY TO USE, THE SERVICES, INCLUDING ANY DIRECT, 
                INDIRECT, SPECIAL, INCIDENTAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES.
              </p>
              <p className="text-muted-foreground">
                Some jurisdictions do not allow the exclusion or limitation of certain warranties or consequential 
                or incidental damages, so some of the above limitations may not apply to you.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <h2 className="text-2xl font-semibold mb-4 flex items-center">
                <FileText className="h-6 w-6 text-primary mr-2" />
                Subscription and Billing
              </h2>
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-medium mb-2">Subscription Terms</h3>
                  <p className="text-muted-foreground">
                    CyberCorrect offers subscription-based access to our Services. By subscribing to our Services, 
                    you agree to pay the applicable subscription fees as they become due.
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-medium mb-2">Billing Cycle</h3>
                  <p className="text-muted-foreground">
                    Subscription fees are billed in advance on either a monthly or annual basis, depending on the 
                    subscription plan you select. You can change your billing cycle at any time by contacting our support team.
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-medium mb-2">Cancellation and Refunds</h3>
                  <p className="text-muted-foreground">
                    You can cancel your subscription at any time by contacting our support team. If you cancel, you may 
                    continue to use the Services until the end of your current billing period, but you will not receive a refund 
                    for any fees already paid.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="mt-8 text-center">
          <p className="text-sm text-muted-foreground mb-2">Last Updated: May 1, 2023</p>
          <div className="space-x-4 mt-4">
            <Link to="/privacy">
              <Button variant="outline">Privacy Policy</Button>
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

export default Terms;