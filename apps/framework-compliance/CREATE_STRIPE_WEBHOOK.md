# 🔗 Create Stripe Webhook - Step by Step

**Time Required:** 5 minutes

---

## 📋 Steps

### 1. Go to Stripe Dashboard

**URL:** https://dashboard.stripe.com/webhooks

### 2. Add Endpoint

1. Click **"+ Add endpoint"** button

### 3. Configure Endpoint

**Endpoint URL:**
```
https://dfklqsdfycwjlcasfciu.supabase.co/functions/v1/stripe-webhook
```

**Description (optional):**
```
CyberCorrect - One-time purchases and subscriptions webhook
```

### 4. Select Events

Check these events:
- ✅ `checkout.session.completed`
- ✅ `customer.subscription.updated`
- ✅ `customer.subscription.deleted`
- ✅ `invoice.payment_succeeded`

### 5. Create Endpoint

Click **"Add endpoint"** button

### 6. Copy Webhook Secret

1. Click on the webhook you just created
2. Scroll to **"Signing secret"** section
3. Click **"Reveal"** button
4. Copy the secret (starts with `whsec_...`)

### 7. Add Secret to Supabase

1. **Go to:** https://supabase.com/dashboard/project/dfklqsdfycwjlcasfciu/settings/functions
2. Click on **`stripe-webhook`** function
3. Go to **Settings** tab → **Secrets** section
4. Click **"Add new secret"**
5. **Name:** `STRIPE_WEBHOOK_SECRET`
6. **Value:** `whsec_...` (paste the value you copied)
7. Click **"Save"**

---

## ✅ Verification

After completing:
- [ ] Webhook created in Stripe Dashboard
- [ ] Webhook secret added to stripe-webhook function
- [ ] All events selected
- [ ] Endpoint URL is correct

---

## 🧪 Test Webhook

1. Go to Stripe Dashboard → Webhooks
2. Click on your webhook
3. Click **"Send test webhook"**
4. Select `checkout.session.completed`
5. Click **"Send test webhook"**
6. Check Supabase function logs to verify it was received

---

## 📊 Webhook Details

**Endpoint:** `https://dfklqsdfycwjlcasfciu.supabase.co/functions/v1/stripe-webhook`  
**Events:** 4 events selected  
**Status:** Active (after creation)

---

**Ready to create!** Follow the steps above. 🚀

