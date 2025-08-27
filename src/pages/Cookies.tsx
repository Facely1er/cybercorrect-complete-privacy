import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Cookie, Info, CheckCircle, Clock, Settings, ArrowLeft } from 'lucide-react';

const Cookies = () => {
  return (
    <div className="py-20">
      <div className="max-w-4xl mx-auto px-6">
        <Link to="/" className="inline-flex items-center text-foreground hover:text-primary transition-colors mb-8">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Home
        </Link>

        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold mb-4 text-foreground">Cookie Policy</h1>
          <p className="text-xl text-muted-foreground">
            How CyberCorrect uses cookies and similar technologies
          </p>
        </div>

        <div className="space-y-8">
          <Card>
            <CardContent className="p-6">
              <h2 className="text-2xl font-semibold mb-4 flex items-center">
                <Cookie className="h-6 w-6 text-primary mr-2" />
                What Are Cookies?
              </h2>
              <p className="text-muted-foreground mb-4">
                Cookies are small text files that are placed on your device when you visit a website. 
                They are widely used to make websites work more efficiently, as well as to provide information to the website owners.
              </p>
              <p className="text-muted-foreground">
                Cookies help us understand how visitors interact with our website, allowing us to improve your experience 
                and provide personalized features. They can remember your preferences, help you navigate between pages efficiently, 
                and generally improve your browsing experience.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <h2 className="text-2xl font-semibold mb-4 flex items-center">
                <Info className="h-6 w-6 text-primary mr-2" />
                Types of Cookies We Use
              </h2>
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-medium mb-2">Essential Cookies</h3>
                  <p className="text-muted-foreground mb-2">
                    These cookies are necessary for the website to function properly. They enable core functionalities 
                    such as security, network management, and account access. You cannot opt out of these cookies.
                  </p>
                  <div className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-success mr-2 mt-0.5 flex-shrink-0" />
                    <span className="text-muted-foreground">Examples: session cookies, authentication cookies, load balancing cookies</span>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-medium mb-2">Preference Cookies</h3>
                  <p className="text-muted-foreground mb-2">
                    These cookies remember your preferences and settings to enhance your experience on our site.
                  </p>
                  <div className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-success mr-2 mt-0.5 flex-shrink-0" />
                    <span className="text-muted-foreground">Examples: language preference cookies, theme selection cookies</span>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-medium mb-2">Analytics Cookies</h3>
                  <p className="text-muted-foreground mb-2">
                    These cookies collect information about how visitors use our website. They help us understand 
                    which pages are the most popular, how visitors move around the site, and if they encounter any errors.
                  </p>
                  <div className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-success mr-2 mt-0.5 flex-shrink-0" />
                    <span className="text-muted-foreground">Examples: Google Analytics cookies, performance monitoring cookies</span>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-medium mb-2">Marketing Cookies</h3>
                  <p className="text-muted-foreground mb-2">
                    These cookies track your online activity to help advertisers deliver more relevant ads or to limit how many times you see an ad.
                  </p>
                  <div className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-success mr-2 mt-0.5 flex-shrink-0" />
                    <span className="text-muted-foreground">Examples: advertising cookies, social media cookies</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <h2 className="text-2xl font-semibold mb-4 flex items-center">
                <Clock className="h-6 w-6 text-primary mr-2" />
                Cookie Duration
              </h2>
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-medium mb-2">Session Cookies</h3>
                  <p className="text-muted-foreground">
                    These cookies are temporary and expire once you close your browser. They enable the website to 
                    remember your actions during that particular browser session.
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-medium mb-2">Persistent Cookies</h3>
                  <p className="text-muted-foreground">
                    These cookies remain on your device for a set period or until you delete them manually. They enable 
                    the website to remember your preferences or actions across multiple sessions.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <h2 className="text-2xl font-semibold mb-4 flex items-center">
                <Settings className="h-6 w-6 text-primary mr-2" />
                Managing Cookies
              </h2>
              <p className="text-muted-foreground mb-4">
                You can control and manage cookies in various ways. Most web browsers allow you to manage your cookie 
                preferences. You can:
              </p>
              <ul className="space-y-2">
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-primary mr-2 mt-0.5 flex-shrink-0" />
                  <span className="text-muted-foreground">Delete cookies from your device</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-primary mr-2 mt-0.5 flex-shrink-0" />
                  <span className="text-muted-foreground">Block cookies by activating the setting on your browser that allows you to refuse all or some cookies</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-primary mr-2 mt-0.5 flex-shrink-0" />
                  <span className="text-muted-foreground">Set your browser to notify you when you receive a cookie</span>
                </li>
              </ul>
              <p className="text-muted-foreground mt-4">
                Please note that if you choose to block all cookies, you may not be able to access all or parts of our site, 
                or you may experience reduced functionality when accessing certain services.
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="mt-8 text-center">
          <p className="text-sm text-muted-foreground mb-2">Last Updated: May 1, 2023</p>
          <div className="space-x-4 mt-4">
            <Link to="/privacy">
              <Button variant="outline">Privacy Policy</Button>
            </Link>
            <Link to="/terms">
              <Button variant="outline">Terms of Service</Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cookies;