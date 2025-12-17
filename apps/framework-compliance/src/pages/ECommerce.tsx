import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { CreditCard, RefreshCw } from 'lucide-react';

const ECommerce = () => {
  return (
    <div className="py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4 text-foreground">E-Commerce Policies</h1>
          <p className="text-xl text-muted-foreground mb-2">
            ERMITS LLC - Subscription, Payment, Refund & Cancellation Terms
          </p>
          <p className="text-sm text-muted-foreground">
            <strong>Version:</strong> 1.0 | <strong>Effective Date:</strong> October 31, 2025 | <strong>Last Updated:</strong> December 13, 2025
          </p>
        </div>

        <div className="space-y-8">
          {/* Introduction */}
          <Card>
            <CardContent className="p-6">
              <p className="text-muted-foreground mb-4">
                These E-Commerce Policies supplement the ERMITS LLC Master Terms of Service and govern all paid subscriptions, purchases, and financial transactions related to ERMITS Services.
              </p>
              <div className="mt-4">
                <h3 className="text-lg font-semibold mb-2">Table of Contents</h3>
                <ul className="list-disc ml-6 space-y-1 text-muted-foreground">
                  <li><a href="#subscription-payment" className="text-primary hover:underline">1. Subscription & Payment Terms</a></li>
                  <li><a href="#refund-cancellation" className="text-primary hover:underline">2. Refund & Cancellation Policy</a></li>
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* Section 1: Subscription & Payment Terms */}
          <Card id="subscription-payment">
            <CardContent className="p-6">
              <h2 className="text-2xl font-semibold mb-4 flex items-center">
                <CreditCard className="h-6 w-6 text-primary mr-2" />
                1. SUBSCRIPTION & PAYMENT TERMS
              </h2>
              <p className="text-sm text-muted-foreground mb-6">
                <strong>Effective Date:</strong> October 31, 2025 | <strong>Last Updated:</strong> December 13, 2025
              </p>

              <div className="space-y-6">
                {/* 1.1 Subscription Plans and Pricing */}
                <div>
                  <h3 className="text-lg font-medium mb-3">1.1 Subscription Plans and Pricing</h3>
                  
                  <div className="mb-4">
                    <h4 className="font-semibold mb-2 text-foreground">1.1.1 Available Plans</h4>
                    <p className="text-muted-foreground text-sm mb-3">
                      ERMITS offers various subscription tiers across its product portfolio:
                    </p>
                    
                    <div className="space-y-3">
                      <div>
                        <strong className="text-foreground text-sm">Freemium Tiers (No Payment Required):</strong>
                        <ul className="list-disc ml-6 space-y-1 text-muted-foreground text-sm mt-1">
                          <li>Limited feature access</li>
                          <li>Usage quotas and restrictions</li>
                          <li>Community support only</li>
                          <li>No service level commitments</li>
                          <li>May include advertisements or promotional content</li>
                          <li>Subject to modification or termination at any time</li>
                        </ul>
                      </div>

                      <div>
                        <strong className="text-foreground text-sm">Free Trial Plans:</strong>
                        <ul className="list-disc ml-6 space-y-1 text-muted-foreground text-sm mt-1">
                          <li>Full feature access for trial period</li>
                          <li>Duration varies by product (typically 14-30 days)</li>
                          <li>Requires payment method on file</li>
                          <li>Automatically converts to paid subscription unless cancelled</li>
                          <li>One free trial per user/organization per product</li>
                          <li>Abuse of free trials (multiple accounts, etc.) is prohibited</li>
                        </ul>
                      </div>

                      <div>
                        <strong className="text-foreground text-sm">Paid Subscription Tiers:</strong>
                        <p className="text-muted-foreground text-sm mt-1 mb-2">Each ERMITS product offers multiple paid tiers with varying features, quotas, and support levels:</p>
                        
                        <div className="ml-4 space-y-2">
                          <div>
                            <strong className="text-foreground text-sm">Standard/Professional Plans:</strong>
                            <ul className="list-disc ml-6 space-y-1 text-muted-foreground text-sm mt-1">
                              <li>Core features and functionality</li>
                              <li>Standard usage quotas</li>
                              <li>Email support (24-hour response)</li>
                              <li>Monthly or annual billing</li>
                              <li>Pricing published on product websites</li>
                            </ul>
                          </div>

                          <div>
                            <strong className="text-foreground text-sm">Enterprise Plans:</strong>
                            <ul className="list-disc ml-6 space-y-1 text-muted-foreground text-sm mt-1">
                              <li>Advanced features and customization</li>
                              <li>Higher usage quotas or unlimited usage</li>
                              <li>Priority support (4-hour response)</li>
                              <li>Custom billing arrangements</li>
                              <li>Volume discounts available</li>
                              <li>Dedicated account management</li>
                              <li>Custom contracts and SLAs</li>
                            </ul>
                          </div>

                          <div>
                            <strong className="text-foreground text-sm">Federal/Government Plans:</strong>
                            <ul className="list-disc ml-6 space-y-1 text-muted-foreground text-sm mt-1">
                              <li>CMMC-compliant features</li>
                              <li>FedRAMP-aligned infrastructure options</li>
                              <li>Government-specific support</li>
                              <li>DFARS/FAR compliance features</li>
                              <li>Custom pricing and contracts</li>
                              <li>Contact sales for details</li>
                            </ul>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mb-4">
                    <h4 className="font-semibold mb-2 text-foreground">1.1.2 Pricing Structure</h4>
                    
                    <div className="mb-3">
                      <strong className="text-foreground text-sm">Currency:</strong>
                      <ul className="list-disc ml-6 space-y-1 text-muted-foreground text-sm mt-1">
                        <li>All prices listed in U.S. Dollars (USD) unless otherwise specified</li>
                        <li>International customers may see estimated local currency prices</li>
                        <li>Charges processed in USD; currency conversion by payment processor</li>
                      </ul>
                    </div>

                    <div className="mb-3">
                      <strong className="text-foreground text-sm">Pricing Transparency:</strong>
                      <ul className="list-disc ml-6 space-y-1 text-muted-foreground text-sm mt-1">
                        <li>Current pricing published on product websites</li>
                        <li>All fees disclosed before purchase</li>
                        <li>No hidden charges or surprise fees</li>
                        <li>Transparent overage fee structure (where applicable)</li>
                      </ul>
                    </div>

                    <div>
                      <strong className="text-foreground text-sm">Price Changes:</strong>
                      <ul className="list-disc ml-6 space-y-1 text-muted-foreground text-sm mt-1">
                        <li>ERMITS reserves the right to modify pricing at any time</li>
                        <li><strong>Existing Customers:</strong> 30 days' advance notice of price increases</li>
                        <li><strong>Grandfathering:</strong> Current subscription price honored through current billing cycle</li>
                        <li><strong>Acceptance:</strong> Continued use after price change effective date constitutes acceptance</li>
                        <li><strong>Cancellation Option:</strong> Cancel before price increase takes effect to avoid new pricing</li>
                      </ul>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-2 text-foreground">1.1.3 Product-Specific Pricing</h4>
                    <p className="text-muted-foreground text-sm mb-3">
                      Detailed pricing for each product family:
                    </p>
                    
                    <div className="space-y-3">
                      <div>
                        <strong className="text-foreground text-sm">ERMITS Advisory + STEEL™:</strong>
                        <div className="ml-4 mt-1">
                          <p className="text-muted-foreground text-sm mb-1"><strong>Digital Products (Self-Service - One-Time Purchase):</strong></p>
                          <ul className="list-disc ml-6 space-y-1 text-muted-foreground text-sm">
                            <li>STEEL™ Premium Assessment: $29 (lifetime access)</li>
                            <li>vCISO Starter Kit: $299-$499 (37 templates)</li>
                          </ul>
                          <p className="text-muted-foreground text-sm mb-1 mt-2"><strong>Advisory Services (Custom Pricing - Consultation Required):</strong></p>
                          <ul className="list-disc ml-6 space-y-1 text-muted-foreground text-sm">
                            <li>STEEL Strategic Assessment: $25,000 - $125,000</li>
                            <li>On-Demand Advisory: Custom (hourly or project-based)</li>
                          </ul>
                        </div>
                      </div>

                      <div>
                        <strong className="text-foreground text-sm">SocialCaution™ Privacy Platform:</strong>
                        <p className="text-muted-foreground text-sm ml-4">N/A</p>
                      </div>

                      <div>
                        <strong className="text-foreground text-sm">TechnoSoluce™ SBOM Analyzer:</strong>
                        <ul className="list-disc ml-6 space-y-1 text-muted-foreground text-sm mt-1">
                          <li>Free trial: 14 days</li>
                          <li>Starter: $5,000/year (up to 50 applications)</li>
                          <li>Professional: $12,000/year (up to 51-200 applications)</li>
                          <li>Enterprise: $25,000/year (200+ applications)</li>
                          <li>Federal: $40,000/year</li>
                        </ul>
                      </div>

                      <div>
                        <strong className="text-foreground text-sm">CyberCertitude™ Products:</strong>
                        <ul className="list-disc ml-6 space-y-1 text-muted-foreground text-sm mt-1">
                          <li>CMMC Level 1: Free</li>
                          <li>CMMC Level 2: $179.99-$359.99/month</li>
                          <li>Enterprise: Custom pricing</li>
                          <li>CMMC Certification Bundle: Contact sales</li>
                        </ul>
                        <p className="text-muted-foreground text-sm mt-2 ml-4"><strong>One-Time Purchases:</strong></p>
                        <ul className="list-disc ml-6 space-y-1 text-muted-foreground text-sm">
                          <li>CMMC Planner Pro: $699</li>
                          <li>Incident Response Planner: $699</li>
                          <li>CMMC Gap Analysis Pro: $499</li>
                          <li>Risk Assessment Tool: $499</li>
                          <li>Security Control Mapper: $499</li>
                          <li>CUI Data Mapper Pro: $399</li>
                          <li>Tool Bundles: $1,299-$2,199</li>
                        </ul>
                      </div>

                      <div>
                        <strong className="text-foreground text-sm">VendorSoluce™:</strong>
                        <ul className="list-disc ml-6 space-y-1 text-muted-foreground text-sm mt-1">
                          <li>Free trial: 14 days</li>
                          <li>Starter: $39/month (up to 25 vendors)</li>
                          <li>Professional: $129/month (up to 100 vendors)</li>
                          <li>Enterprise: $399/month (unlimited vendors)</li>
                          <li>Federal: Custom pricing</li>
                          <li>Bundles: $299-$599</li>
                        </ul>
                      </div>

                      <div>
                        <strong className="text-foreground text-sm">CyberCorrect™ Products:</strong>
                        <ul className="list-disc ml-6 space-y-1 text-muted-foreground text-sm mt-1">
                          <li>Free Tier: Basic features</li>
                          <li>Starter: $49/month</li>
                          <li>Professional: $99/month</li>
                          <li>Enterprise: Custom pricing</li>
                        </ul>
                        <p className="text-muted-foreground text-sm mt-2 ml-4"><strong>One-Time Purchases:</strong></p>
                        <ul className="list-disc ml-6 space-y-1 text-muted-foreground text-sm">
                          <li>Policy & Template Library: $99</li>
                          <li>GDPR Complete Kit: $199</li>
                          <li>Privacy Toolkit Pro: $299</li>
                          <li>Compliance Assessment Suite: $149</li>
                          <li>Bundles: $249-$599</li>
                        </ul>
                      </div>

                      <div>
                        <strong className="text-foreground text-sm">CyberCaution™ Products:</strong>
                        <p className="text-muted-foreground text-sm ml-4 mb-1">(One-Time Purchases)</p>
                        <ul className="list-disc ml-6 space-y-1 text-muted-foreground text-sm">
                          <li>Free Assessments: Basic features</li>
                          <li>Starter: $49</li>
                          <li>Analyst: $89</li>
                          <li>Professional: $149</li>
                          <li>Enterprise: Custom pricing</li>
                        </ul>
                      </div>
                    </div>

                    <p className="text-muted-foreground text-sm mt-4">
                      <strong>Note:</strong> Exact pricing subject to change. See individual product websites for current pricing. Advisory services require consultation for custom quotes.
                    </p>
                  </div>

                  <div className="mt-4">
                    <h4 className="font-semibold mb-2 text-foreground">Digital Products vs. Advisory Services</h4>
                    <p className="text-muted-foreground text-sm mb-2">
                      ERMITS offers two distinct product categories with different purchasing models:
                    </p>
                    
                    <div className="space-y-2">
                      <div>
                        <strong className="text-foreground text-sm">Digital Products (Self-Service):</strong>
                        <ul className="list-disc ml-6 space-y-1 text-muted-foreground text-sm mt-1">
                          <li>Immediate access upon purchase</li>
                          <li>One-time payment (lifetime access) or subscription</li>
                          <li>No consultation required</li>
                          <li>Automated delivery via download or account access</li>
                          <li>Payment via Stripe or Gumroad</li>
                          <li>Examples: STEEL Premium ($29), vCISO Starter Kit ($299)</li>
                        </ul>
                      </div>

                      <div>
                        <strong className="text-foreground text-sm">Advisory Services (Consultation Required):</strong>
                        <ul className="list-disc ml-6 space-y-1 text-muted-foreground text-sm mt-1">
                          <li>Custom pricing based on scope, timeline, and requirements</li>
                          <li>Requires initial consultation and quote</li>
                          <li>Statement of Work (SOW) or Master Services Agreement (MSA)</li>
                          <li>Payment via invoice, wire transfer, or payment plan</li>
                          <li>Dedicated project management and deliverables</li>
                          <li>Examples: STEEL Strategic Assessment ($25K-$125K), Compliance Advisory, On-Demand vCISO</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 1.2 Billing and Payment */}
                <div>
                  <h3 className="text-lg font-medium mb-3">1.2 Billing and Payment</h3>
                  
                  <div className="mb-4">
                    <h4 className="font-semibold mb-2 text-foreground">1.2.1 Payment Methods</h4>
                    
                    <div className="mb-3">
                      <strong className="text-foreground text-sm">Accepted Payment Methods:</strong>
                      <ul className="list-disc ml-6 space-y-1 text-muted-foreground text-sm mt-1">
                        <li>Credit cards (Visa, Mastercard, American Express, Discover)</li>
                        <li>Debit cards with credit card logo</li>
                        <li>ACH bank transfers (Enterprise customers only)</li>
                        <li>Wire transfers (Enterprise customers, annual plans only)</li>
                        <li>Purchase orders (Enterprise/Government customers with approved credit)</li>
                      </ul>
                    </div>

                    <div className="mb-3">
                      <strong className="text-foreground text-sm">Payment Processor:</strong>
                      <ul className="list-disc ml-6 space-y-1 text-muted-foreground text-sm mt-1">
                        <li>All credit/debit card payments processed by Stripe, Inc.</li>
                        <li>ERMITS does not store complete payment card information</li>
                        <li>Payment security governed by PCI-DSS compliance</li>
                        <li>See Stripe Privacy Policy: <a href="https://stripe.com/privacy" className="text-primary hover:underline" target="_blank" rel="noopener noreferrer">stripe.com/privacy</a></li>
                      </ul>
                    </div>

                    <div>
                      <strong className="text-foreground text-sm">Payment Method Requirements:</strong>
                      <ul className="list-disc ml-6 space-y-1 text-muted-foreground text-sm mt-1">
                        <li>Valid payment method required for free trials</li>
                        <li>Payment method must be kept current and valid</li>
                        <li>Automatic updates for card expiration dates (where supported by issuer)</li>
                        <li>User responsible for updating expired or invalid payment methods</li>
                      </ul>
                    </div>
                  </div>

                  <div className="mb-4">
                    <h4 className="font-semibold mb-2 text-foreground">1.2.2 Billing Cycles</h4>
                    
                    <div className="mb-3">
                      <strong className="text-foreground text-sm">Monthly Subscriptions:</strong>
                      <ul className="list-disc ml-6 space-y-1 text-muted-foreground text-sm mt-1">
                        <li>Billed on the same day each month (subscription start date)</li>
                        <li>Example: Subscribe on January 15 → billed on 15th of each month</li>
                        <li>Prorated charges for mid-cycle upgrades</li>
                        <li>No proration for downgrades (takes effect next billing cycle)</li>
                      </ul>
                    </div>

                    <div className="mb-3">
                      <strong className="text-foreground text-sm">Annual Subscriptions:</strong>
                      <ul className="list-disc ml-6 space-y-1 text-muted-foreground text-sm mt-1">
                        <li>Billed once per year on subscription anniversary date</li>
                        <li>Discounted pricing compared to monthly (typically 15-20% savings)</li>
                        <li>Entire year charged upfront</li>
                        <li>Prorated refunds not available (see Refund Policy, Section 2)</li>
                        <li>Automatic renewal unless cancelled before anniversary</li>
                      </ul>
                    </div>

                    <div>
                      <strong className="text-foreground text-sm">Custom Billing (Enterprise):</strong>
                      <ul className="list-disc ml-6 space-y-1 text-muted-foreground text-sm mt-1">
                        <li>Negotiated billing terms</li>
                        <li>Quarterly or semi-annual billing available</li>
                        <li>Invoice payment terms (Net 30, Net 60)</li>
                        <li>Multi-year contracts with fixed pricing</li>
                        <li>Volume discounts and custom arrangements</li>
                      </ul>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-2 text-foreground">1.2.3 Automatic Renewal</h4>
                    
                    <div className="mb-3">
                      <strong className="text-foreground text-sm">Renewal Process:</strong>
                      <ul className="list-disc ml-6 space-y-1 text-muted-foreground text-sm mt-1">
                        <li>Subscriptions automatically renew at the end of each billing cycle</li>
                        <li>Renewal charge processed using payment method on file</li>
                        <li>No action required to continue service</li>
                        <li>Same subscription tier and features unless modified</li>
                      </ul>
                    </div>

                    <div className="mb-3">
                      <strong className="text-foreground text-sm">Renewal Notifications:</strong>
                      <ul className="list-disc ml-6 space-y-1 text-muted-foreground text-sm mt-1">
                        <li>Email notification 7 days before renewal (monthly subscriptions)</li>
                        <li>Email notification 30 days before renewal (annual subscriptions)</li>
                        <li>Notification includes renewal date, amount, and payment method</li>
                        <li>Instructions for cancellation included in notification</li>
                      </ul>
                    </div>

                    <div className="mb-3">
                      <strong className="text-foreground text-sm">Renewal Failure:</strong>
                      <ul className="list-disc ml-6 space-y-1 text-muted-foreground text-sm mt-1">
                        <li>If payment fails, ERMITS will retry up to 3 times over 7 days</li>
                        <li>Email notifications sent for each failed attempt</li>
                        <li>After final failure, subscription cancelled and access suspended</li>
                        <li>Grace period of 7 days to update payment method</li>
                        <li>Service restored immediately upon successful payment</li>
                      </ul>
                    </div>

                    <div>
                      <strong className="text-foreground text-sm">Cancellation to Prevent Renewal:</strong>
                      <ul className="list-disc ml-6 space-y-1 text-muted-foreground text-sm mt-1">
                        <li>Cancel anytime before renewal date to prevent automatic renewal</li>
                        <li>Cancellation takes effect at end of current billing period</li>
                        <li>Access continues through end of paid period</li>
                        <li>No charges after cancellation takes effect</li>
                      </ul>
                    </div>
                  </div>
                </div>

                {/* 1.3 Upgrades, Downgrades, and Plan Changes */}
                <div>
                  <h3 className="text-lg font-medium mb-3">1.3 Upgrades, Downgrades, and Plan Changes</h3>
                  
                  <div className="mb-4">
                    <h4 className="font-semibold mb-2 text-foreground">1.3.1 Upgrading Subscriptions</h4>
                    
                    <div className="mb-3">
                      <strong className="text-foreground text-sm">Mid-Cycle Upgrades:</strong>
                      <ul className="list-disc ml-6 space-y-1 text-muted-foreground text-sm mt-1">
                        <li>Immediate access to upgraded features</li>
                        <li>Prorated credit applied for unused portion of current plan</li>
                        <li>Prorated charge for upgraded plan through end of current cycle</li>
                        <li>Next renewal at full upgraded plan price</li>
                      </ul>
                    </div>

                    <div>
                      <strong className="text-foreground text-sm">Example Calculation:</strong>
                      <div className="bg-muted p-3 rounded mt-2 text-sm">
                        <ul className="list-none space-y-1">
                          <li>Current Plan: $49/month, 15 days remaining in cycle</li>
                          <li>Upgraded Plan: $149/month</li>
                          <li>Unused Credit: ($49 ÷ 30 days) × 15 days = $24.50</li>
                          <li>Prorated Charge: ($149 ÷ 30 days) × 15 days = $74.50</li>
                          <li>Amount Due Today: $74.50 - $24.50 = $50.00</li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  <div className="mb-4">
                    <h4 className="font-semibold mb-2 text-foreground">1.3.2 Downgrading Subscriptions</h4>
                    
                    <div className="mb-3">
                      <strong className="text-foreground text-sm">Mid-Cycle Downgrades:</strong>
                      <ul className="list-disc ml-6 space-y-1 text-muted-foreground text-sm mt-1">
                        <li>Downgrade request recorded immediately</li>
                        <li>Current plan features remain active through end of billing cycle</li>
                        <li>Downgrade takes effect at next renewal date</li>
                        <li>No prorated refund for unused portion of higher-tier plan</li>
                        <li>Lower price charged at next renewal</li>
                      </ul>
                    </div>

                    <div>
                      <strong className="text-foreground text-sm">Feature Access After Downgrade:</strong>
                      <ul className="list-disc ml-6 space-y-1 text-muted-foreground text-sm mt-1">
                        <li>Access to premium features removed at downgrade effective date</li>
                        <li>Data and settings preserved (if compatible with lower tier)</li>
                        <li>Some features may become read-only</li>
                        <li>Quota limits applied (excess data may require deletion or upgrade)</li>
                      </ul>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-2 text-foreground">1.3.3 Digital Product Purchases</h4>
                    <p className="text-muted-foreground text-sm mb-2">
                      Digital products purchased as one-time payments (vCISO Kit, etc.) are:
                    </p>
                    <ul className="list-disc ml-6 space-y-1 text-muted-foreground text-sm">
                      <li>Non-refundable after download/access (see Refund Policy Section 2)</li>
                      <li>Lifetime access (no subscription required)</li>
                      <li>No upgrades or downgrades (purchase is final)</li>
                      <li>May include future updates at ERMITS' discretion</li>
                    </ul>
                  </div>
                </div>

                {/* 1.4 Taxes and Fees */}
                <div>
                  <h3 className="text-lg font-medium mb-3">1.4 Taxes and Fees</h3>
                  
                  <div className="mb-4">
                    <h4 className="font-semibold mb-2 text-foreground">1.4.1 Sales Tax and VAT</h4>
                    
                    <div className="mb-3">
                      <strong className="text-foreground text-sm">United States:</strong>
                      <ul className="list-disc ml-6 space-y-1 text-muted-foreground text-sm mt-1">
                        <li>Sales tax charged based on billing address</li>
                        <li>Rates vary by state, county, and municipality</li>
                        <li>Tax-exempt organizations: Provide valid exemption certificate to <a href="mailto:legal@ermits.com" className="text-primary hover:underline">legal@ermits.com</a></li>
                        <li>Tax amounts shown before final payment confirmation</li>
                      </ul>
                    </div>

                    <div className="mb-3">
                      <strong className="text-foreground text-sm">European Union:</strong>
                      <ul className="list-disc ml-6 space-y-1 text-muted-foreground text-sm mt-1">
                        <li>VAT charged for EU customers based on location</li>
                        <li>VAT rate determined by customer's country</li>
                        <li>Business customers: Provide valid VAT ID for reverse charge (if applicable)</li>
                        <li>VAT shown separately on invoices</li>
                      </ul>
                    </div>

                    <div>
                      <strong className="text-foreground text-sm">Other Jurisdictions:</strong>
                      <ul className="list-disc ml-6 space-y-1 text-muted-foreground text-sm mt-1">
                        <li>Applicable taxes charged per local requirements</li>
                        <li>GST (Canada, Australia, India, etc.)</li>
                        <li>Other consumption taxes as required by law</li>
                      </ul>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-2 text-foreground">1.4.2 Additional Fees</h4>
                    
                    <div className="mb-3">
                      <strong className="text-foreground text-sm">Payment Processing Fees:</strong>
                      <ul className="list-disc ml-6 space-y-1 text-muted-foreground text-sm mt-1">
                        <li>No additional fees for standard credit/debit card payments</li>
                        <li>Wire transfer fees may apply (typically $25-50 per transfer, paid by customer)</li>
                        <li>ACH processing fees may apply for large transactions</li>
                      </ul>
                    </div>

                    <div className="mb-3">
                      <strong className="text-foreground text-sm">Currency Conversion Fees:</strong>
                      <ul className="list-disc ml-6 space-y-1 text-muted-foreground text-sm mt-1">
                        <li>Charged by payment processor (Stripe) or your bank</li>
                        <li>ERMITS has no control over conversion rates or fees</li>
                        <li>Estimated local currency prices are approximate</li>
                      </ul>
                    </div>

                    <div className="mb-3">
                      <strong className="text-foreground text-sm">Late Payment Fees:</strong>
                      <ul className="list-disc ml-6 space-y-1 text-muted-foreground text-sm mt-1">
                        <li>No late fees for monthly subscriptions (subscription cancelled after grace period)</li>
                        <li>Enterprise/Invoice customers: 1.5% monthly interest on overdue balances (or maximum allowed by law)</li>
                        <li>Collection costs may be charged for significantly overdue accounts</li>
                      </ul>
                    </div>

                    <div>
                      <strong className="text-foreground text-sm">Overage Fees:</strong>
                      <p className="text-muted-foreground text-sm mt-1 mb-1">Some products charge overage fees for usage exceeding plan limits:</p>
                      <ul className="list-disc ml-6 space-y-1 text-muted-foreground text-sm">
                        <li>Storage overage: Billed per GB over limit</li>
                        <li>API request overage: Billed per 1,000 requests over limit</li>
                        <li>User overage: Billed per additional user over limit</li>
                        <li>Overage fees detailed on product pricing pages</li>
                        <li>Notification before overage fees applied (where possible)</li>
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Continue with remaining sections... */}
                <div>
                  <h3 className="text-lg font-medium mb-3">1.5 Invoicing and Receipts</h3>
                  <p className="text-muted-foreground text-sm">
                    Automatic invoices emailed after each successful payment. Available in Account Settings → Billing → Invoices. 
                    PDF format for easy download and printing. Additional receipts available upon request.
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-medium mb-3">1.6 Free Trials</h3>
                  <p className="text-muted-foreground text-sm mb-2">
                    Free trials provide full access to paid plan features for a limited period (typically 14-30 days). 
                    Valid payment method required. Automatically converts to paid subscription unless cancelled before trial ends.
                  </p>
                  <p className="text-muted-foreground text-sm">
                    <strong>Important:</strong> Cancel anytime during trial to avoid charges. One free trial per user per product.
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-medium mb-3">1.7 Freemium Accounts</h3>
                  <p className="text-muted-foreground text-sm mb-2">
                    Freemium accounts provide basic core functionality with limitations:
                  </p>
                  <ul className="list-disc ml-6 space-y-1 text-muted-foreground text-sm">
                    <li>Reduced storage limits</li>
                    <li>Lower API rate limits</li>
                    <li>Fewer concurrent users</li>
                    <li>No priority support</li>
                    <li>No SLA commitments</li>
                    <li>Potential advertisements or promotional content</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-medium mb-3">1.8 Enterprise and Custom Agreements</h3>
                  <p className="text-muted-foreground text-sm mb-2">
                    Enterprise customers receive custom pricing, flexible billing terms, dedicated account management, 
                    and custom contracts. Contact sales at <a href="mailto:sales@ermits.com" className="text-primary hover:underline">sales@ermits.com</a> for enterprise inquiries.
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-medium mb-3">1.9 Payment Failures and Account Suspension</h3>
                  <p className="text-muted-foreground text-sm mb-2">
                    If payment fails, ERMITS will retry up to 3 times over 7 days. After final failure, subscription 
                    cancelled and access suspended. Grace period of 7 days to update payment method. Service restored 
                    immediately upon successful payment.
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-medium mb-3">1.10 Contact and Support for Billing Issues</h3>
                  <p className="text-muted-foreground text-sm">
                    For billing questions, payment issues, or invoice requests, contact <a href="mailto:contact@ermits.com" className="text-primary hover:underline">contact@ermits.com</a>. 
                    Response time: Standard inquiries within 24 hours, payment issues within 4 hours.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Section 2: Refund & Cancellation Policy */}
          <Card id="refund-cancellation">
            <CardContent className="p-6">
              <h2 className="text-2xl font-semibold mb-4 flex items-center">
                <RefreshCw className="h-6 w-6 text-primary mr-2" />
                2. REFUND & CANCELLATION POLICY
              </h2>
              <p className="text-sm text-muted-foreground mb-6">
                <strong>Effective Date:</strong> October 31, 2025 | <strong>Last Updated:</strong> December 13, 2025
              </p>

              <div className="space-y-6">
                {/* 2.1 No Money-Back Guarantee */}
                <div>
                  <h3 className="text-lg font-medium mb-3">2.1 No Money-Back Guarantee</h3>
                  <p className="text-muted-foreground text-sm mb-3">
                    ERMITS does <strong>not</strong> offer a standard 30-day money-back guarantee or similar blanket refund policy. 
                    All sales are final except as specifically provided in this policy.
                  </p>
                  <p className="text-muted-foreground text-sm mb-2">
                    <strong>Rationale:</strong>
                  </p>
                  <ul className="list-disc ml-6 space-y-1 text-muted-foreground text-sm">
                    <li>Free trials available for most products</li>
                    <li>Freemium tiers allow service evaluation without payment</li>
                    <li>Privacy-First Architecture makes usage verification difficult</li>
                    <li>Client-side data processing limits ERMITS' ability to assess service use</li>
                  </ul>
                  <p className="text-muted-foreground text-sm mt-3">
                    <strong>Exceptions:</strong> Refunds may be granted under specific circumstances outlined in Section 2.3.
                  </p>
                </div>

                {/* 2.2 Cancellation Process */}
                <div>
                  <h3 className="text-lg font-medium mb-3">2.2 Cancellation Process</h3>
                  
                  <div className="mb-4">
                    <h4 className="font-semibold mb-2 text-foreground">2.2.1 How to Cancel</h4>
                    
                    <div className="mb-3">
                      <strong className="text-foreground text-sm">Self-Service Cancellation:</strong>
                      <ol className="list-decimal ml-6 space-y-1 text-muted-foreground text-sm mt-1">
                        <li>Log in to your account</li>
                        <li>Navigate to Account Settings → Billing → Subscription</li>
                        <li>Click "Cancel Subscription"</li>
                        <li>Select cancellation reason (optional feedback)</li>
                        <li>Confirm cancellation</li>
                        <li>Receive email confirmation</li>
                      </ol>
                    </div>

                    <div>
                      <strong className="text-foreground text-sm">Email Cancellation:</strong>
                      <ul className="list-disc ml-6 space-y-1 text-muted-foreground text-sm mt-1">
                        <li>Email <a href="mailto:contact@ermits.com?subject=Subscription Cancellation" className="text-primary hover:underline">contact@ermits.com</a></li>
                        <li>Subject: "Subscription Cancellation - [Your Name]"</li>
                        <li>Include account email and subscription details</li>
                        <li>Confirmation sent within 1 business day</li>
                      </ul>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-2 text-foreground">2.2.2 Cancellation Effective Date</h4>
                    <p className="text-muted-foreground text-sm mb-2">
                      <strong>End-of-Period Cancellation:</strong>
                    </p>
                    <ul className="list-disc ml-6 space-y-1 text-muted-foreground text-sm">
                      <li>Cancellation takes effect at end of current billing period</li>
                      <li>Access continues through paid period</li>
                      <li>No charges after cancellation effective date</li>
                      <li>No partial refunds for remaining time in billing period</li>
                    </ul>
                    <p className="text-muted-foreground text-sm mt-3">
                      <strong>Example:</strong> Current billing period: January 1 - January 31. Cancel on January 15. 
                      Access continues through January 31. No charge on February 1. No refund for January 15-31.
                    </p>
                  </div>
                </div>

                {/* 2.3 Refund Eligibility */}
                <div>
                  <h3 className="text-lg font-medium mb-3">2.3 Refund Eligibility</h3>
                  
                  <div className="mb-4">
                    <h4 className="font-semibold mb-2 text-foreground">2.3.1 Digital Products (One-Time Purchases)</h4>
                    <p className="text-muted-foreground text-sm mb-2">
                      <strong>Eligibility:</strong> Refund available within 7 days of purchase if:
                    </p>
                    <ul className="list-disc ml-6 space-y-1 text-muted-foreground text-sm">
                      <li>Technical failure prevents access</li>
                      <li>Product incomplete or materially different from description</li>
                      <li>Billing error or duplicate charge</li>
                    </ul>
                    <p className="text-muted-foreground text-sm mt-2 mb-2">
                      <strong>Not Eligible:</strong>
                    </p>
                    <ul className="list-disc ml-6 space-y-1 text-muted-foreground text-sm">
                      <li>After 7 days</li>
                      <li>After downloading or accessing file or assessment</li>
                      <li>Change of mind or buyer's remorse</li>
                      <li>"Didn't use it" or "Forgot I purchased it"</li>
                      <li>Incompatibility with user's environment (specs clearly documented)</li>
                    </ul>
                    <p className="text-muted-foreground text-sm mt-2">
                      <strong>Process:</strong> Email <a href="mailto:contact@ermits.com" className="text-primary hover:underline">contact@ermits.com</a> with order number and detailed reason.
                    </p>
                  </div>

                  <div className="mb-4">
                    <h4 className="font-semibold mb-2 text-foreground">2.3.2 Advisory Services</h4>
                    
                    <div className="mb-3">
                      <strong className="text-foreground text-sm">STEEL Strategic Assessments ($25K-$125K):</strong>
                      <ul className="list-disc ml-6 space-y-1 text-muted-foreground text-sm mt-1">
                        <li><strong>Refund Policy:</strong> Milestone-based billing with satisfaction checkpoints</li>
                        <li><strong>Eligibility:</strong> Pro-rated refund if ERMITS fails to deliver contracted scope or material breach of Statement of Work</li>
                        <li><strong>Not Eligible:</strong> After final deliverables accepted, subjective dissatisfaction without contractual breach</li>
                        <li><strong>Process:</strong> Contact dedicated account manager or <a href="mailto:contact@ermits.com" className="text-primary hover:underline">contact@ermits.com</a></li>
                        <li><strong>Timeline:</strong> 14 days notice for cancellation; pro-rated refund for unperformed work</li>
                      </ul>
                    </div>

                    <div>
                      <strong className="text-foreground text-sm">On-Demand Advisory Services:</strong>
                      <ul className="list-disc ml-6 space-y-1 text-muted-foreground text-sm mt-1">
                        <li><strong>Billing:</strong> Hourly or project-based (invoiced monthly or at milestones)</li>
                        <li><strong>Refund:</strong> For unperformed work only</li>
                        <li><strong>Process:</strong> Review invoices with account manager; dispute within 14 days</li>
                      </ul>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-2 text-foreground">2.3.3 Subscription Products</h4>
                    <ul className="list-disc ml-6 space-y-1 text-muted-foreground text-sm">
                      <li>No pro-rated refunds for monthly subscriptions</li>
                      <li>Annual subscriptions: No pro-rated refunds (see Section 2.5)</li>
                      <li>Refunds only for technical service failures</li>
                      <li>Free trials: Must cancel before trial ends to avoid charges</li>
                    </ul>
                  </div>
                </div>

                {/* 2.4 Non-Refundable Items */}
                <div>
                  <h3 className="text-lg font-medium mb-3">2.4 Non-Refundable Items</h3>
                  <p className="text-muted-foreground text-sm mb-2">
                    The following are <strong>never</strong> refundable:
                  </p>
                  <ul className="list-disc ml-6 space-y-1 text-muted-foreground text-sm">
                    <li>Partial period usage (unused portion of subscriptions after cancellation)</li>
                    <li>Add-on services (professional services rendered, custom development work, training sessions)</li>
                    <li>Third-party costs (payment processing fees, bank transfer fees, currency conversion fees)</li>
                    <li>Promotional and discounted purchases</li>
                    <li>Beta products</li>
                    <li>Overage fees incurred</li>
                  </ul>
                </div>

                {/* 2.5 Annual Subscription Cancellations */}
                <div>
                  <h3 className="text-lg font-medium mb-3">2.5 Annual Subscription Cancellations</h3>
                  <p className="text-muted-foreground text-sm mb-2">
                    <strong>Standard Policy:</strong>
                  </p>
                  <ul className="list-disc ml-6 space-y-1 text-muted-foreground text-sm">
                    <li><strong>No prorated refunds</strong> for annual subscriptions</li>
                    <li>Cancellation takes effect at end of annual period</li>
                    <li>Access continues through paid annual period</li>
                    <li>Renewal prevented for next year</li>
                  </ul>
                  <p className="text-muted-foreground text-sm mt-3">
                    <strong>Rationale:</strong> Discounted pricing (typically 15-20% off monthly pricing) reflects annual commitment.
                  </p>
                </div>

                {/* 2.6 Data Retention After Cancellation */}
                <div>
                  <h3 className="text-lg font-medium mb-3">2.6 Data Retention After Cancellation</h3>
                  
                  <div className="mb-3">
                    <strong className="text-foreground text-sm">Data Access Period:</strong>
                    <ul className="list-disc ml-6 space-y-1 text-muted-foreground text-sm mt-1">
                      <li><strong>Paid Accounts:</strong> 30-day grace period for data export</li>
                      <li><strong>Free Trials:</strong> 7-day grace period for data export</li>
                      <li>Read-only access to data during grace period</li>
                      <li>Download all data via Account Settings → Export Data</li>
                    </ul>
                  </div>

                  <div>
                    <strong className="text-foreground text-sm">Permanent Data Deletion:</strong>
                    <ul className="list-disc ml-6 space-y-1 text-muted-foreground text-sm mt-1">
                      <li>All user data permanently deleted from production systems after grace period</li>
                      <li>Deletion cannot be reversed</li>
                      <li>Backups deleted within 90 days</li>
                      <li>Exceptions: Pseudonymized analytics, financial records (7 years), legal hold data</li>
                    </ul>
                  </div>
                </div>

                {/* 2.7 Refund Processing */}
                <div>
                  <h3 className="text-lg font-medium mb-3">2.7 Refund Processing</h3>
                  <p className="text-muted-foreground text-sm mb-2">
                    <strong>Refund Methods:</strong>
                  </p>
                  <ul className="list-disc ml-6 space-y-1 text-muted-foreground text-sm">
                    <li>Refunded to original payment method</li>
                    <li>Credit/debit card refunds appear in 5-10 business days</li>
                    <li>Bank transfers refunded via check or wire transfer</li>
                    <li>Account credit may be offered (with your consent)</li>
                  </ul>
                  <p className="text-muted-foreground text-sm mt-3">
                    <strong>Processing Timeline:</strong> Approved refunds initiated within 2 business days. 
                    Confirmation email sent when refund processed.
                  </p>
                </div>

                {/* 2.8 Chargebacks */}
                <div>
                  <h3 className="text-lg font-medium mb-3">2.8 Chargebacks and Payment Disputes</h3>
                  <p className="text-muted-foreground text-sm mb-2">
                    ERMITS strongly encourages contacting us before initiating a chargeback. Most issues resolved quickly and amicably.
                  </p>
                  <p className="text-muted-foreground text-sm mb-2">
                    <strong>Consequences of Chargebacks:</strong>
                  </p>
                  <ul className="list-disc ml-6 space-y-1 text-muted-foreground text-sm">
                    <li>Immediate account suspension</li>
                    <li>$25 chargeback fee charged (in addition to disputed amount)</li>
                    <li>Account permanently banned from ERMITS services</li>
                    <li>Account restored only if chargeback reversed and all fees paid</li>
                  </ul>
                </div>

                {/* Additional sections would continue here... */}
                <div>
                  <h3 className="text-lg font-medium mb-3">2.9 Reactivation After Cancellation</h3>
                  <p className="text-muted-foreground text-sm">
                    Can reactivate before permanent deletion. After data deletion, must create new account. 
                    Current pricing applies (not original subscription price).
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-medium mb-3">2.10 Account Termination by ERMITS</h3>
                  <p className="text-muted-foreground text-sm">
                    ERMITS may terminate accounts for Terms of Service violations, payment fraud, illegal activities, 
                    or abuse. No refund for accounts terminated for cause.
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-medium mb-3">2.11 Advisory Service and Enterprise Account Cancellations</h3>
                  <p className="text-muted-foreground text-sm mb-2">
                    <strong>STEEL Strategic Assessment:</strong>
                  </p>
                  <ul className="list-disc ml-6 space-y-1 text-muted-foreground text-sm">
                    <li>Before work begins: Full refund minus $500 administrative fee</li>
                    <li>During assessment (0-50% complete): 50% refund of remaining balance</li>
                    <li>During assessment (50-100% complete): No refund; pay for completed work</li>
                    <li>After deliverables: No refund</li>
                  </ul>
                  <p className="text-muted-foreground text-sm mt-3">
                    <strong>Enterprise Contracts:</strong> Subject to contract terms. Early termination fees typically apply (25-50% of remaining contract value).
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-medium mb-3">2.12 Special Circumstances</h3>
                  <p className="text-muted-foreground text-sm">
                    ERMITS may grant discretionary refunds for extenuating circumstances (death, incapacity, business closure, 
                    natural disasters) on a case-by-case basis. Contact <a href="mailto:contact@ermits.com" className="text-primary hover:underline">contact@ermits.com</a> with explanation and documentation.
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-medium mb-3">2.13 Contact Information</h3>
                  <p className="text-muted-foreground text-sm mb-2">
                    <strong>Cancellation Requests:</strong> Email <a href="mailto:contact@ermits.com?subject=Subscription Cancellation" className="text-primary hover:underline">contact@ermits.com</a> | Subject: "Subscription Cancellation"
                  </p>
                  <p className="text-muted-foreground text-sm mb-2">
                    <strong>Refund Requests:</strong> Email <a href="mailto:contact@ermits.com?subject=Refund Request" className="text-primary hover:underline">contact@ermits.com</a> | Subject: "Refund Request - [Invoice Number]"
                  </p>
                  <p className="text-muted-foreground text-sm">
                    <strong>Billing Disputes:</strong> Email <a href="mailto:contact@ermits.com?subject=Billing Dispute" className="text-primary hover:underline">contact@ermits.com</a> | Subject: "Billing Dispute - [Invoice Number]"
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="mt-8 text-center">
          <p className="text-sm text-muted-foreground mb-2">Last Updated: December 13, 2025</p>
          <div className="space-x-4 mt-4">
            <Link to="/terms">
              <Button variant="outline">Terms of Service</Button>
            </Link>
            <Link to="/privacy">
              <Button variant="outline">Privacy Policy</Button>
            </Link>
            <Link to="/cookies">
              <Button variant="outline">Cookie Policy</Button>
            </Link>
            <Link to="/acceptable-use">
              <Button variant="outline">Acceptable Use Policy</Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ECommerce;

