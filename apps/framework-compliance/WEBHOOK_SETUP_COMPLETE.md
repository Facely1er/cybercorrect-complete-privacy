# ✅ Stripe Webhook Setup - Ready to Complete

**All information ready for webhook creation**

---

## 📋 Webhook Configuration

### Endpoint URL
```
https://dfklqsdfycwjlcasfciu.supabase.co/functions/v1/stripe-webhook
```

### Events Required
1. `checkout.session.completed`
2. `customer.subscription.updated`
3. `customer.subscription.deleted`
4. `invoice.payment_succeeded`

---

## 🚀 Quick Setup (5 minutes)

### Step 1: Create Webhook in Stripe

**URL:** https://dashboard.stripe.com/webhooks

1. Click "+ Add endpoint"
2. Paste endpoint URL: `https://dfklqsdfycwjlcasfciu.supabase.co/functions/v1/stripe-webhook`
3. Select the 4 events above
4. Click "Add endpoint"

### Step 2: Copy Webhook Secret

1. Click on the webhook you created
2. Find "Signing secret"
3. Click "Reveal"
4. Copy the secret (starts with `whsec_...`)

### Step 3: Add Secret to Supabase

**URL:** https://supabase.com/dashboard/project/dfklqsdfycwjlcasfciu/settings/functions

1. Click on `stripe-webhook` function
2. Go to Settings → Secrets
3. Add new secret:
   - **Name:** `STRIPE_WEBHOOK_SECRET`
   - **Value:** `whsec_...` (paste from Step 2)

---

## ✅ Verification

After setup:
- [ ] Webhook created in Stripe
- [ ] Endpoint URL correct
- [ ] 4 events selected
- [ ] Webhook secret copied
- [ ] Secret added to Supabase function

---

## 📚 Detailed Guides

- **Complete Guide:** `STRIPE_WEBHOOK_SETUP_COMPLETE.md`
- **Quick Setup:** `STRIPE_WEBHOOK_QUICK_SETUP.md`

---

**Ready to create!** Follow the steps above. 🚀

