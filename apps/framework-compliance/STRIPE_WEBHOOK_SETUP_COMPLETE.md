# 🔗 Stripe Webhook Setup - Complete Guide

**Endpoint URL:** `https://dfklqsdfycwjlcasfciu.supabase.co/functions/v1/stripe-webhook`

---

## 📋 Step-by-Step Instructions

### Step 1: Login to Stripe Dashboard

1. **Go to:** https://dashboard.stripe.com/webhooks
2. **Login** if not already logged in

### Step 2: Add Webhook Endpoint

1. **Click:** "+ Add endpoint" button (top right)

### Step 3: Configure Endpoint

**Endpoint URL:**
```
https://dfklqsdfycwjlcasfciu.supabase.co/functions/v1/stripe-webhook
```

**Description (optional):**
```
CyberCorrect - Payment webhook for subscriptions and one-time purchases
```

### Step 4: Select Events

**Check these 4 events:**

- ✅ `checkout.session.completed` - Fires when checkout completes
- ✅ `customer.subscription.updated` - Fires when subscription changes
- ✅ `customer.subscription.deleted` - Fires when subscription is cancelled
- ✅ `invoice.payment_succeeded` - Fires when invoice is paid

**How to select:**
- Scroll through the events list
- Check the boxes next to each event name
- Or use the search box to find events quickly

### Step 5: Create Endpoint

1. **Click:** "Add endpoint" button (bottom of form)
2. **Wait** for confirmation message

### Step 6: Copy Webhook Signing Secret

1. **Click** on the webhook you just created (in the webhooks list)
2. **Scroll down** to "Signing secret" section
3. **Click:** "Reveal" button
4. **Copy** the secret (starts with `whsec_...`)
   - Example: `whsec_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx`

### Step 7: Add Secret to Supabase

1. **Go to:** https://supabase.com/dashboard/project/dfklqsdfycwjlcasfciu/settings/functions
2. **Click** on `stripe-webhook` function
3. **Go to:** Settings tab → Secrets section
4. **Click:** "Add new secret"
5. **Enter:**
   - **Name:** `STRIPE_WEBHOOK_SECRET`
   - **Value:** `whsec_...` (paste the value you copied from Stripe)
6. **Click:** "Save"

---

## ✅ Verification Checklist

After completing all steps:

- [ ] Webhook created in Stripe Dashboard
- [ ] Endpoint URL is correct: `https://dfklqsdfycwjlcasfciu.supabase.co/functions/v1/stripe-webhook`
- [ ] All 4 events are selected
- [ ] Webhook shows "Enabled" status in Stripe
- [ ] Webhook secret copied (`whsec_...`)
- [ ] Secret added to `stripe-webhook` function in Supabase
- [ ] Secret name is exactly: `STRIPE_WEBHOOK_SECRET`

---

## 🧪 Test Webhook

### Option 1: Send Test Webhook

1. **Go to:** Stripe Dashboard → Webhooks
2. **Click** on your webhook
3. **Click:** "Send test webhook" button
4. **Select event:** `checkout.session.completed`
5. **Click:** "Send test webhook"
6. **Check Supabase logs:**
   - Go to: https://supabase.com/dashboard/project/dfklqsdfycwjlcasfciu/functions
   - Click on `stripe-webhook`
   - Go to "Logs" tab
   - Verify the webhook was received

### Option 2: Test with Real Checkout

1. Go to your site: `https://www.cybercorrect.com`
2. Navigate to `/store` or checkout page
3. Complete a test purchase with card: `4242 4242 4242 4242`
4. Check webhook events in Stripe Dashboard
5. Verify function processed the event

---

## 📊 Webhook Details Summary

| Setting | Value |
|---------|-------|
| **Endpoint URL** | `https://dfklqsdfycwjlcasfciu.supabase.co/functions/v1/stripe-webhook` |
| **Events** | 4 events selected |
| **Status** | Enabled (after creation) |
| **Secret Location** | Supabase: `stripe-webhook` function → Secrets → `STRIPE_WEBHOOK_SECRET` |

---

## 🔗 Quick Links

- **Stripe Webhooks:** https://dashboard.stripe.com/webhooks
- **Supabase Secrets:** https://supabase.com/dashboard/project/dfklqsdfycwjlcasfciu/settings/functions
- **Function Logs:** https://supabase.com/dashboard/project/dfklqsdfycwjlcasfciu/functions/stripe-webhook/logs

---

## 🆘 Troubleshooting

### Webhook Not Receiving Events

1. **Check endpoint URL** is correct
2. **Verify events** are selected in Stripe
3. **Check webhook status** is "Enabled"
4. **Verify secret** is set in Supabase
5. **Check function logs** for errors

### Secret Not Working

1. **Verify secret name** is exactly: `STRIPE_WEBHOOK_SECRET`
2. **Check secret value** matches Stripe (starts with `whsec_`)
3. **Ensure no extra spaces** in secret value
4. **Redeploy function** if needed

---

## ✅ Completion

Once all steps are complete:
- ✅ Webhook created and enabled
- Secret added to function
- Ready to process payments!

---

**Ready to create!** Follow the steps above. 🚀

