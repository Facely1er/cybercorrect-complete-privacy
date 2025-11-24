# API Documentation

## Supabase Edge Functions

This document provides comprehensive API documentation for all Supabase Edge Functions used in the CyberCorrect Privacy Platform.

### Base URL

All edge functions are accessible at:
```
https://<your-project-ref>.supabase.co/functions/v1/<function-name>
```

### Authentication

All edge functions require authentication via Supabase JWT token in the Authorization header:

```http
Authorization: Bearer <supabase-jwt-token>
```

---

## Functions

### 1. create-checkout-session

Creates a Stripe checkout session for subscription purchases.

**Endpoint:** `POST /functions/v1/create-checkout-session`

**Request Body:**
```json
{
  "priceId": "price_xxxxx",
  "successUrl": "https://app.cybercorrect.com/success",
  "cancelUrl": "https://app.cybercorrect.com/cancel",
  "userId": "user-uuid"
}
```

**Response:**
```json
{
  "sessionId": "cs_xxxxx",
  "url": "https://checkout.stripe.com/pay/cs_xxxxx"
}
```

**Error Response:**
```json
{
  "error": "Error message",
  "code": "ERROR_CODE"
}
```

**Status Codes:**
- `200` - Success
- `400` - Bad Request
- `401` - Unauthorized
- `500` - Internal Server Error

---

### 2. create-one-time-checkout-session

Creates a Stripe checkout session for one-time product purchases.

**Endpoint:** `POST /functions/v1/create-one-time-checkout-session`

**Request Body:**
```json
{
  "priceId": "price_xxxxx",
  "quantity": 1,
  "successUrl": "https://app.cybercorrect.com/success",
  "cancelUrl": "https://app.cybercorrect.com/cancel",
  "userId": "user-uuid",
  "metadata": {
    "productId": "product-uuid"
  }
}
```

**Response:**
```json
{
  "sessionId": "cs_xxxxx",
  "url": "https://checkout.stripe.com/pay/cs_xxxxx"
}
```

**Error Response:**
```json
{
  "error": "Error message",
  "code": "ERROR_CODE"
}
```

**Status Codes:**
- `200` - Success
- `400` - Bad Request
- `401` - Unauthorized
- `500` - Internal Server Error

---

### 3. stripe-webhook

Handles Stripe webhook events for payment processing.

**Endpoint:** `POST /functions/v1/stripe-webhook`

**Headers:**
```http
stripe-signature: <stripe-signature>
```

**Request Body:**
Raw Stripe webhook event (JSON)

**Response:**
```json
{
  "received": true,
  "eventType": "checkout.session.completed"
}
```

**Status Codes:**
- `200` - Success
- `400` - Bad Request (invalid signature)
- `500` - Internal Server Error

**Supported Events:**
- `checkout.session.completed` - Payment successful
- `customer.subscription.created` - Subscription created
- `customer.subscription.updated` - Subscription updated
- `customer.subscription.deleted` - Subscription cancelled
- `invoice.payment_succeeded` - Invoice paid
- `invoice.payment_failed` - Invoice payment failed

---

### 4. send-email-notification

Sends email notifications to users.

**Endpoint:** `POST /functions/v1/send-email-notification`

**Request Body:**
```json
{
  "to": "user@example.com",
  "subject": "Notification Subject",
  "template": "notification",
  "data": {
    "userName": "John Doe",
    "message": "Your compliance report is ready"
  }
}
```

**Response:**
```json
{
  "success": true,
  "messageId": "msg_xxxxx"
}
```

**Error Response:**
```json
{
  "error": "Error message",
  "code": "ERROR_CODE"
}
```

**Status Codes:**
- `200` - Success
- `400` - Bad Request
- `401` - Unauthorized
- `500` - Internal Server Error

**Available Templates:**
- `notification` - General notification
- `report-ready` - Report generation complete
- `assessment-due` - Assessment reminder
- `deadline-approaching` - Deadline warning

---

### 5. generate-automated-reports

Generates automated compliance reports on schedule.

**Endpoint:** `POST /functions/v1/generate-automated-reports`

**Request Body:**
```json
{
  "userId": "user-uuid",
  "reportType": "compliance" | "executive" | "risk" | "health",
  "format": "pdf" | "word" | "excel",
  "scheduleId": "schedule-uuid"
}
```

**Response:**
```json
{
  "success": true,
  "reportId": "report-uuid",
  "downloadUrl": "https://storage.supabase.co/object/reports/report.pdf"
}
```

**Error Response:**
```json
{
  "error": "Error message",
  "code": "ERROR_CODE"
}
```

**Status Codes:**
- `200` - Success
- `400` - Bad Request
- `401` - Unauthorized
- `500` - Internal Server Error

---

### 6. run-scheduled-assessments

Runs scheduled compliance assessments automatically.

**Endpoint:** `POST /functions/v1/run-scheduled-assessments`

**Request Body:**
```json
{
  "userId": "user-uuid",
  "assessmentId": "assessment-uuid",
  "scheduleId": "schedule-uuid"
}
```

**Response:**
```json
{
  "success": true,
  "assessmentRunId": "run-uuid",
  "score": 85,
  "completedAt": "2025-01-15T10:00:00Z"
}
```

**Error Response:**
```json
{
  "error": "Error message",
  "code": "ERROR_CODE"
}
```

**Status Codes:**
- `200` - Success
- `400` - Bad Request
- `401` - Unauthorized
- `500` - Internal Server Error

---

### 7. track-compliance-health

Tracks and updates compliance health scores.

**Endpoint:** `POST /functions/v1/track-compliance-health`

**Request Body:**
```json
{
  "userId": "user-uuid",
  "projectId": "project-uuid",
  "metrics": {
    "overallScore": 85,
    "controlCount": 150,
    "implementedCount": 120,
    "gapCount": 30
  }
}
```

**Response:**
```json
{
  "success": true,
  "healthScore": 85,
  "trend": "improving" | "stable" | "declining",
  "updatedAt": "2025-01-15T10:00:00Z"
}
```

**Error Response:**
```json
{
  "error": "Error message",
  "code": "ERROR_CODE"
}
```

**Status Codes:**
- `200` - Success
- `400` - Bad Request
- `401` - Unauthorized
- `500` - Internal Server Error

---

### 8. check-regulatory-updates

Checks for regulatory updates and changes.

**Endpoint:** `POST /functions/v1/check-regulatory-updates`

**Request Body:**
```json
{
  "regulations": ["GDPR", "CCPA", "LGPD"],
  "lastChecked": "2025-01-01T00:00:00Z"
}
```

**Response:**
```json
{
  "success": true,
  "updates": [
    {
      "regulation": "GDPR",
      "updateType": "guidance" | "amendment" | "new_requirement",
      "title": "Update Title",
      "description": "Update description",
      "publishedDate": "2025-01-15T00:00:00Z",
      "impact": "high" | "medium" | "low"
    }
  ],
  "checkedAt": "2025-01-15T10:00:00Z"
}
```

**Error Response:**
```json
{
  "error": "Error message",
  "code": "ERROR_CODE"
}
```

**Status Codes:**
- `200` - Success
- `400` - Bad Request
- `401` - Unauthorized
- `500` - Internal Error

---

## Error Codes

| Code | Description |
|------|-------------|
| `INVALID_REQUEST` | Request body is invalid or missing required fields |
| `UNAUTHORIZED` | Authentication token is missing or invalid |
| `FORBIDDEN` | User does not have permission to perform this action |
| `NOT_FOUND` | Requested resource not found |
| `RATE_LIMIT_EXCEEDED` | Too many requests, please try again later |
| `STRIPE_ERROR` | Error communicating with Stripe API |
| `DATABASE_ERROR` | Database operation failed |
| `INTERNAL_ERROR` | Internal server error |

---

## Rate Limiting

All endpoints are rate-limited to prevent abuse:

- **Standard endpoints:** 100 requests per minute per user
- **Webhook endpoints:** 1000 requests per minute
- **Report generation:** 10 requests per hour per user

Rate limit headers are included in responses:
```http
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1640995200
```

---

## Webhooks

### Stripe Webhook Events

The platform subscribes to the following Stripe webhook events:

- `checkout.session.completed` - Payment successful
- `customer.subscription.created` - New subscription
- `customer.subscription.updated` - Subscription changed
- `customer.subscription.deleted` - Subscription cancelled
- `invoice.payment_succeeded` - Invoice paid
- `invoice.payment_failed` - Payment failed

### Webhook Security

All webhooks are verified using Stripe's signature verification. The webhook endpoint validates the `stripe-signature` header before processing events.

---

## Examples

### Creating a Checkout Session

```typescript
const response = await fetch(
  'https://your-project.supabase.co/functions/v1/create-checkout-session',
  {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${supabaseToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      priceId: 'price_xxxxx',
      successUrl: 'https://app.cybercorrect.com/success',
      cancelUrl: 'https://app.cybercorrect.com/cancel',
      userId: 'user-uuid',
    }),
  }
);

const data = await response.json();
if (data.url) {
  window.location.href = data.url;
}
```

### Sending Email Notification

```typescript
const response = await fetch(
  'https://your-project.supabase.co/functions/v1/send-email-notification',
  {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${supabaseToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      to: 'user@example.com',
      subject: 'Your Compliance Report is Ready',
      template: 'report-ready',
      data: {
        userName: 'John Doe',
        reportName: 'Q1 2025 Compliance Report',
        downloadUrl: 'https://storage.supabase.co/object/reports/report.pdf',
      },
    }),
  }
);
```

---

## Support

For API support or questions:
- **Email:** api-support@cybercorrect.com
- **Documentation:** https://docs.cybercorrect.com/api
- **Status Page:** https://status.cybercorrect.com

---

**Last Updated:** January 2025  
**API Version:** 1.0.0

