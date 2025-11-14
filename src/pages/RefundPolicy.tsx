import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { DollarSign, RefreshCw, CheckCircle, XCircle, Clock, Mail } from 'lucide-react';

const RefundPolicy = () => {
  return (
    <div className="py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4 text-foreground">Refund & Cancellation Policy</h1>
          <p className="text-xl text-muted-foreground mb-2">
            ERMITS LLC Refund, Cancellation, and Return Policy
          </p>
          <p className="text-sm text-muted-foreground">
            <strong>Effective Date:</strong> October 31, 2025 | <strong>Last Updated:</strong> October 31, 2025
          </p>
        </div>

        <div className="space-y-8">
          {/* Introduction */}
          <Card>
            <CardContent className="p-6">
              <p className="text-muted-foreground mb-4">
                This Refund & Cancellation Policy ("Policy") governs refunds, cancellations, and returns for
                ERMITS LLC ("ERMITS," "we," "our," or "us") products and services. By making a purchase, you
                agree to the terms outlined in this Policy.
              </p>
              <p className="text-muted-foreground">
                This Policy supplements the Master Terms of Service and applies to all subscription services,
                one-time purchases, templates, and add-ons.
              </p>
            </CardContent>
          </Card>

          {/* Subscription Refunds and Cancellations */}
          <Card>
            <CardContent className="p-6">
              <h2 className="text-2xl font-semibold mb-4 flex items-center">
                <RefreshCw className="h-6 w-6 text-primary mr-2" />
                1. Subscription Refunds and Cancellations
              </h2>

              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium mb-3">1.1 Monthly Subscriptions</h3>

                  <div className="mb-4">
                    <strong className="text-foreground">Cancellation:</strong>
                    <ul className="list-disc ml-6 space-y-1 text-muted-foreground text-sm mt-2">
                      <li>You may cancel your monthly subscription at any time</li>
                      <li>Cancellations must be submitted before the next billing date to avoid charges</li>
                      <li>Access continues until the end of the current billing period</li>
                      <li>No pro-rated refunds for partial months</li>
                    </ul>
                  </div>

                  <div>
                    <strong className="text-foreground">Refund Policy:</strong>
                    <ul className="list-disc ml-6 space-y-1 text-muted-foreground text-sm mt-2">
                      <li><strong>First Month:</strong> Full refund if cancelled within 7 days of initial purchase</li>
                      <li><strong>Subsequent Months:</strong> No refunds after the first month</li>
                      <li><strong>Service Issues:</strong> Pro-rated refunds at ERMITS' discretion for extended outages</li>
                    </ul>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-medium mb-3">1.2 Annual Subscriptions</h3>

                  <div className="mb-4">
                    <strong className="text-foreground">Cancellation:</strong>
                    <ul className="list-disc ml-6 space-y-1 text-muted-foreground text-sm mt-2">
                      <li>You may cancel your annual subscription at any time</li>
                      <li>Cancellations must be submitted before the next annual renewal date</li>
                      <li>Access continues until the end of the current annual period</li>
                      <li>No pro-rated refunds for unused portions of annual subscriptions</li>
                    </ul>
                  </div>

                  <div>
                    <strong className="text-foreground">Refund Policy:</strong>
                    <ul className="list-disc ml-6 space-y-1 text-muted-foreground text-sm mt-2">
                      <li><strong>30-Day Money-Back Guarantee:</strong> Full refund if cancelled within 30 days of initial purchase</li>
                      <li><strong>After 30 Days:</strong> No refunds for the remaining subscription period</li>
                      <li><strong>Renewal:</strong> No refunds once annual subscription renews</li>
                      <li><strong>Abuse Prevention:</strong> Refunds limited to one per customer per product</li>
                    </ul>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-medium mb-3">1.3 How to Cancel Subscriptions</h3>

                  <div className="space-y-3">
                    <div>
                      <strong className="text-foreground">Self-Service Cancellation:</strong>
                      <ul className="list-disc ml-6 space-y-1 text-muted-foreground text-sm mt-2">
                        <li>Log in to your account</li>
                        <li>Navigate to Account Settings → Subscription</li>
                        <li>Click "Cancel Subscription"</li>
                        <li>Confirm cancellation</li>
                        <li>Receive email confirmation</li>
                      </ul>
                    </div>

                    <div>
                      <strong className="text-foreground">Email Cancellation:</strong>
                      <ul className="list-disc ml-6 space-y-1 text-muted-foreground text-sm mt-2">
                        <li>Email: contact@ermits.com (Subject: "Subscription Cancellation")</li>
                        <li>Include: Account email, product name, cancellation reason (optional)</li>
                        <li>Response time: Within 2 business days</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* One-Time Purchase Refunds */}
          <Card>
            <CardContent className="p-6">
              <h2 className="text-2xl font-semibold mb-4 flex items-center">
                <DollarSign className="h-6 w-6 text-primary mr-2" />
                2. One-Time Purchase Refunds
              </h2>

              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium mb-3">2.1 LocalStorage Toolkit Products</h3>

                  <div className="mb-4">
                    <strong className="text-foreground">Refund Policy:</strong>
                    <ul className="list-disc ml-6 space-y-1 text-muted-foreground text-sm mt-2">
                      <li><strong>14-Day Satisfaction Guarantee:</strong> Full refund within 14 days of purchase</li>
                      <li><strong>Condition:</strong> Must demonstrate technical issue or product not as described</li>
                      <li><strong>No Refunds After:</strong> 14 days from purchase date</li>
                      <li><strong>Digital Download:</strong> Refunds available if product fails to function as described</li>
                    </ul>
                  </div>

                  <div>
                    <strong className="text-foreground">Refund Eligibility:</strong>
                    <div className="mt-3 space-y-3">
                      <div className="flex items-start">
                        <CheckCircle className="h-5 w-5 text-primary mr-2 mt-0.5 flex-shrink-0" />
                        <span className="text-muted-foreground text-sm">Technical defects preventing product use</span>
                      </div>
                      <div className="flex items-start">
                        <CheckCircle className="h-5 w-5 text-primary mr-2 mt-0.5 flex-shrink-0" />
                        <span className="text-muted-foreground text-sm">Product does not match description or advertised features</span>
                      </div>
                      <div className="flex items-start">
                        <CheckCircle className="h-5 w-5 text-primary mr-2 mt-0.5 flex-shrink-0" />
                        <span className="text-muted-foreground text-sm">Compatibility issues documented and unresolvabl</span>
                      </div>
                      <div className="flex items-start">
                        <CheckCircle className="h-5 w-5 text-primary mr-2 mt-0.5 flex-shrink-0" />
                        <span className="text-muted-foreground text-sm">Duplicate purchase (credited toward correct purchase)</span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4">
                    <strong className="text-foreground">Non-Refundable:</strong>
                    <div className="mt-3 space-y-3">
                      <div className="flex items-start">
                        <XCircle className="h-5 w-5 text-red-500 mr-2 mt-0.5 flex-shrink-0" />
                        <span className="text-muted-foreground text-sm">Change of mind after 14 days</span>
                      </div>
                      <div className="flex items-start">
                        <XCircle className="h-5 w-5 text-red-500 mr-2 mt-0.5 flex-shrink-0" />
                        <span className="text-muted-foreground text-sm">User error or lack of technical knowledge</span>
                      </div>
                      <div className="flex items-start">
                        <XCircle className="h-5 w-5 text-red-500 mr-2 mt-0.5 flex-shrink-0" />
                        <span className="text-muted-foreground text-sm">Products purchased on sale or with discount codes (unless defective)</span>
                      </div>
                      <div className="flex items-start">
                        <XCircle className="h-5 w-5 text-red-500 mr-2 mt-0.5 flex-shrink-0" />
                        <span className="text-muted-foreground text-sm">Bundle purchases (individual items in bundle cannot be refunded separately)</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-medium mb-3">2.2 Premium Templates and Documents</h3>

                  <div className="mb-4">
                    <strong className="text-foreground">Refund Policy:</strong>
                    <ul className="list-disc ml-6 space-y-1 text-muted-foreground text-sm mt-2">
                      <li><strong>7-Day Satisfaction Guarantee:</strong> Full refund within 7 days of purchase</li>
                      <li><strong>Condition:</strong> Template must contain errors or not match description</li>
                      <li><strong>No Refunds:</strong> After template has been customized and exported</li>
                      <li><strong>Preview Available:</strong> Templates include free previews to evaluate before purchase</li>
                    </ul>
                  </div>

                  <div>
                    <strong className="text-foreground">Template Bundle Refunds:</strong>
                    <ul className="list-disc ml-6 space-y-1 text-muted-foreground text-sm mt-2">
                      <li>Bundle refunds must be requested for entire bundle, not individual templates</li>
                      <li>Same 7-day guarantee applies to bundles</li>
                      <li>If any template in bundle has been customized/exported, no refund available</li>
                    </ul>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-medium mb-3">2.3 Export Credits</h3>

                  <div>
                    <strong className="text-foreground">Refund Policy:</strong>
                    <ul className="list-disc ml-6 space-y-1 text-muted-foreground text-sm mt-2">
                      <li><strong>Non-Refundable:</strong> Export credits are non-refundable once purchased</li>
                      <li><strong>Unused Credits:</strong> No refunds for unused credits</li>
                      <li><strong>Technical Issues:</strong> Credits refunded if export fails due to system error</li>
                      <li><strong>Expiration:</strong> Credits expire as stated at time of purchase (typically 12 months)</li>
                    </ul>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Refund Request Process */}
          <Card>
            <CardContent className="p-6">
              <h2 className="text-2xl font-semibold mb-4 flex items-center">
                <Clock className="h-6 w-6 text-primary mr-2" />
                3. Refund Request Process
              </h2>

              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium mb-3">3.1 How to Request a Refund</h3>

                  <div className="mb-4">
                    <strong className="text-foreground">Step 1: Initiate Request</strong>
                    <ul className="list-disc ml-6 space-y-1 text-muted-foreground text-sm mt-2">
                      <li>Email: contact@ermits.com (Subject: "Refund Request")</li>
                      <li>Include: Order number, purchase date, product name, reason for refund</li>
                      <li>Provide: Supporting documentation for technical issues (screenshots, error messages)</li>
                    </ul>
                  </div>

                  <div className="mb-4">
                    <strong className="text-foreground">Step 2: Review Process</strong>
                    <ul className="list-disc ml-6 space-y-1 text-muted-foreground text-sm mt-2">
                      <li>Initial response: Within 2 business days</li>
                      <li>Review period: Up to 5 business days for investigation</li>
                      <li>May request additional information or troubleshooting steps</li>
                    </ul>
                  </div>

                  <div className="mb-4">
                    <strong className="text-foreground">Step 3: Decision and Processing</strong>
                    <ul className="list-disc ml-6 space-y-1 text-muted-foreground text-sm mt-2">
                      <li>Approved refunds: Processed within 5-7 business days</li>
                      <li>Refund method: Original payment method via Stripe</li>
                      <li>Processing time: 5-10 business days to appear in account (bank-dependent)</li>
                      <li>Confirmation: Email notification when refund is processed</li>
                    </ul>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-medium mb-3">3.2 Refund Eligibility Verification</h3>

                  <p className="text-muted-foreground mb-3 text-sm">
                    To prevent fraud, ERMITS may verify:
                  </p>
                  <ul className="list-disc ml-6 space-y-1 text-muted-foreground text-sm">
                    <li>Purchase date and refund window compliance</li>
                    <li>Account activity and usage patterns</li>
                    <li>Previous refund history (abuse prevention)</li>
                    <li>Technical issue legitimacy</li>
                    <li>Payment method authenticity</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-medium mb-3">3.3 Refund Denials</h3>

                  <div>
                    <strong className="text-foreground">Common Reasons for Denial:</strong>
                    <ul className="list-disc ml-6 space-y-1 text-muted-foreground text-sm mt-2">
                      <li>Request submitted after applicable refund window</li>
                      <li>Violation of Terms of Service or Acceptable Use Policy</li>
                      <li>Evidence of refund abuse or fraud</li>
                      <li>Product used extensively before refund request</li>
                      <li>Failure to cooperate with troubleshooting</li>
                      <li>Issue is user error, not product defect</li>
                    </ul>
                  </div>

                  <div className="mt-4">
                    <strong className="text-foreground">Appeal Process:</strong>
                    <ul className="list-disc ml-6 space-y-1 text-muted-foreground text-sm mt-2">
                      <li>Email: contact@ermits.com (Subject: "Refund Appeal")</li>
                      <li>Provide: Additional evidence or clarification</li>
                      <li>Review: Final decision within 5 business days</li>
                      <li>Decisions: Final and at ERMITS' sole discretion</li>
                    </ul>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Chargebacks */}
          <Card>
            <CardContent className="p-6">
              <h2 className="text-2xl font-semibold mb-4 flex items-center">
                <XCircle className="h-6 w-6 text-red-500 mr-2" />
                4. Chargebacks and Disputes
              </h2>

              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-medium mb-3">4.1 Chargeback Policy</h3>

                  <p className="text-muted-foreground mb-3 text-sm">
                    <strong>Contact Us First:</strong> We strongly encourage you to contact ERMITS before initiating a chargeback.
                    Most issues can be resolved quickly through our support channels.
                  </p>

                  <div className="mb-4">
                    <strong className="text-foreground">Consequences of Chargebacks:</strong>
                    <ul className="list-disc ml-6 space-y-1 text-muted-foreground text-sm mt-2">
                      <li><strong>Account Suspension:</strong> Immediate suspension pending resolution</li>
                      <li><strong>Service Termination:</strong> Account may be terminated for fraudulent chargebacks</li>
                      <li><strong>Loss of Access:</strong> All data and services become inaccessible</li>
                      <li><strong>Collections:</strong> Unjustified chargebacks may be sent to collections</li>
                      <li><strong>Legal Action:</strong> ERMITS reserves the right to pursue legal remedies</li>
                    </ul>
                  </div>

                  <div>
                    <strong className="text-foreground">Legitimate Chargebacks:</strong>
                    <ul className="list-disc ml-6 space-y-1 text-muted-foreground text-sm mt-2">
                      <li>Unauthorized charges (fraud, stolen card)</li>
                      <li>Duplicate charges</li>
                      <li>ERMITS failed to deliver promised services</li>
                      <li>ERMITS non-responsive to refund request within 30 days</li>
                    </ul>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-medium mb-3">4.2 Payment Disputes</h3>

                  <p className="text-muted-foreground mb-3 text-sm">
                    For billing disputes or questions:
                  </p>
                  <ul className="list-disc ml-6 space-y-1 text-muted-foreground text-sm">
                    <li>Email: contact@ermits.com (Subject: "Billing Dispute")</li>
                    <li>Include: Invoice number, transaction ID, dispute details</li>
                    <li>Response: Within 3 business days</li>
                    <li>Resolution: Within 10 business days</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Enterprise and Custom Agreements */}
          <Card>
            <CardContent className="p-6">
              <h2 className="text-2xl font-semibold mb-4 flex items-center">
                <DollarSign className="h-6 w-6 text-primary mr-2" />
                5. Enterprise and Custom Agreements
              </h2>

              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-medium mb-3">5.1 Enterprise Subscriptions</h3>

                  <p className="text-muted-foreground mb-3 text-sm">
                    Enterprise customers with custom pricing agreements:
                  </p>
                  <ul className="list-disc ml-6 space-y-1 text-muted-foreground text-sm">
                    <li>Refund and cancellation terms governed by Master Service Agreement (MSA)</li>
                    <li>Custom refund policies negotiated in contract</li>
                    <li>Contact your account manager for cancellations</li>
                    <li>Typically require 30-90 days notice for cancellation</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-medium mb-3">5.2 Government and Educational Institutions</h3>

                  <p className="text-muted-foreground mb-3 text-sm">
                    Special terms may apply:
                  </p>
                  <ul className="list-disc ml-6 space-y-1 text-muted-foreground text-sm">
                    <li>Subject to procurement regulations and institutional policies</li>
                    <li>Refunds processed per institutional requirements</li>
                    <li>May require additional documentation (PO, requisition forms)</li>
                    <li>Contact: contact@ermits.com (Subject: "Institutional Refund")</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Tax Refunds */}
          <Card>
            <CardContent className="p-6">
              <h2 className="text-2xl font-semibold mb-4 flex items-center">
                <DollarSign className="h-6 w-6 text-primary mr-2" />
                6. Taxes and Fees
              </h2>

              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-medium mb-3">6.1 Tax Refunds</h3>

                  <p className="text-muted-foreground mb-3 text-sm">
                    Refunds include all applicable taxes paid:
                  </p>
                  <ul className="list-disc ml-6 space-y-1 text-muted-foreground text-sm">
                    <li>Sales tax, VAT, GST refunded with purchase price</li>
                    <li>Tax refund processing follows applicable tax regulations</li>
                    <li>Some jurisdictions may require separate tax refund process</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-medium mb-3">6.2 Processing Fees</h3>

                  <p className="text-muted-foreground mb-3 text-sm">
                    Transaction fees:
                  </p>
                  <ul className="list-disc ml-6 space-y-1 text-muted-foreground text-sm">
                    <li>ERMITS absorbs payment processing fees (Stripe) for refunds</li>
                    <li>Bank fees imposed by your financial institution are your responsibility</li>
                    <li>Currency conversion fees (if applicable) are non-refundable</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Data and Access After Refund */}
          <Card>
            <CardContent className="p-6">
              <h2 className="text-2xl font-semibold mb-4 flex items-center">
                <Clock className="h-6 w-6 text-primary mr-2" />
                7. Data and Access After Refund or Cancellation
              </h2>

              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-medium mb-3">7.1 Subscription Cancellations</h3>

                  <ul className="list-disc ml-6 space-y-1 text-muted-foreground text-sm">
                    <li><strong>Access:</strong> Continues until end of current billing period</li>
                    <li><strong>Data Export:</strong> 30 days to export data after cancellation (paid accounts)</li>
                    <li><strong>Free Accounts:</strong> 7 days to export data</li>
                    <li><strong>Data Deletion:</strong> 90 days after cancellation (per Privacy Policy)</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-medium mb-3">7.2 Refunded Purchases</h3>

                  <ul className="list-disc ml-6 space-y-1 text-muted-foreground text-sm">
                    <li><strong>One-Time Products:</strong> License revoked immediately upon refund</li>
                    <li><strong>Templates:</strong> Access removed; previously exported documents remain yours</li>
                    <li><strong>LocalStorage Products:</strong> License key deactivated</li>
                    <li><strong>Data:</strong> Locally stored data (browser/desktop) is not affected by refund</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-medium mb-3">7.3 Data Retention</h3>

                  <p className="text-muted-foreground mb-3 text-sm">
                    After refund or cancellation:
                  </p>
                  <ul className="list-disc ml-6 space-y-1 text-muted-foreground text-sm">
                    <li>Account information retained per Privacy Policy</li>
                    <li>Financial records retained for 7 years (tax compliance)</li>
                    <li>Pseudonymized analytics data retained indefinitely</li>
                    <li>Export your data before refund/cancellation if needed</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Policy Changes */}
          <Card>
            <CardContent className="p-6">
              <h2 className="text-2xl font-semibold mb-4 flex items-center">
                <RefreshCw className="h-6 w-6 text-primary mr-2" />
                8. Policy Updates and Changes
              </h2>

              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-medium mb-3">8.1 Modifications to Policy</h3>

                  <p className="text-muted-foreground mb-3 text-sm">
                    ERMITS may update this Policy:
                  </p>
                  <ul className="list-disc ml-6 space-y-1 text-muted-foreground text-sm">
                    <li>Material changes: 30 days' advance notice</li>
                    <li>Applies to new purchases after effective date</li>
                    <li>Existing purchases governed by policy at time of purchase</li>
                    <li>Notification via email and website posting</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-medium mb-3">8.2 Grandfather Clause</h3>

                  <p className="text-muted-foreground text-sm">
                    If you purchased under a previous version of this Policy, those terms apply to your purchase.
                    Policy changes do not retroactively affect existing purchases or subscriptions.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Contact Information */}
          <Card>
            <CardContent className="p-6">
              <h2 className="text-2xl font-semibold mb-4 flex items-center">
                <Mail className="h-6 w-6 text-primary mr-2" />
                9. Contact Information
              </h2>

              <div className="space-y-3 text-muted-foreground">
                <p><strong>Refund Requests:</strong></p>
                <p>Email: <Mail className="inline h-4 w-4" /> contact@ermits.com (Subject: "Refund Request")</p>

                <p className="mt-4"><strong>Cancellations:</strong></p>
                <p>Email: <Mail className="inline h-4 w-4" /> contact@ermits.com (Subject: "Subscription Cancellation")</p>

                <p className="mt-4"><strong>Billing Disputes:</strong></p>
                <p>Email: <Mail className="inline h-4 w-4" /> contact@ermits.com (Subject: "Billing Dispute")</p>

                <p className="mt-4"><strong>General Questions:</strong></p>
                <p>Email: <Mail className="inline h-4 w-4" /> contact@ermits.com | Website: www.ermits.com</p>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="mt-8 text-center">
          <p className="text-sm text-muted-foreground mb-2">Last Updated: October 31, 2025</p>
          <div className="space-x-4 mt-4">
            <Link to="/terms">
              <Button variant="outline">Terms of Service</Button>
            </Link>
            <Link to="/privacy">
              <Button variant="outline">Privacy Policy</Button>
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

export default RefundPolicy;
