# ⚡ Stripe Webhook - Quick Setup

**5 Minutes | Copy-Paste Ready**

---

## 🎯 Exact Values to Use

### Endpoint URL
```
https://dfklqsdfycwjlcasfciu.supabase.co/functions/v1/stripe-webhook
```

### Events to Select (4)
- ✅ checkout.session.completed
- ✅ customer.subscription.updated
- ✅ customer.subscription.deleted
- ✅ invoice.payment_succeeded

---

## 📋 Steps

### 1. Create Webhook (2 min)

1. Go to: https://dashboard.stripe.com/webhooks
2. Click: "+ Add endpoint"
3. Paste endpoint URL above
4. Check 4 events listed above
5. Click: "Add endpoint"

### 2. Get Secret (1 min)

1. Click on the webhook you created
2. Find "Signing secret"
3. Click "Reveal"
4. Copy the secret (`whsec_...`)

### 3. Add to Supabase (2 min)

1. Go to: https://supabase.com/dashboard/project/dfklqsdfycwjlcasfciu/settings/functions
2. Click: `stripe-webhook`
3. Settings → Secrets → Add new secret
4. Name: `STRIPE_WEBHOOK_SECRET`
5. Value: `whsec_...` (paste from Step 2)
6. Save

---

## ✅ Done!

Webhook is now configured and ready to process payments.

---

**Total Time:** ~5 minutes

