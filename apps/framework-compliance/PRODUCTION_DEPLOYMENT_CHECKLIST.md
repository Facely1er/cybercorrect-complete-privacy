# Production Deployment Checklist - One-Time Payment System

**Date:** _______________  
**Deployed By:** _______________  
**Environment:** Production

---

## Pre-Deployment Configuration

### Stripe Setup
- [ ] Stripe account created and verified
- [ ] Production API keys obtained (`pk_live_...` and `sk_live_...`)
- [ ] Stripe Tax enabled (if applicable)
- [ ] Webhook endpoint created in Stripe Dashboard
- [ ] Webhook secret copied (`whsec_...`)
- [ ] Test mode checkout tested successfully

### Supabase Setup
- [ ] Supabase project created
- [ ] Database migration applied (`20251217000000_one_time_purchases.sql`)
- [ ] Table `cc_one_time_purchases` verified
- [ ] RLS policies verified
- [ ] Edge Functions deployed:
  - [ ] `create-one-time-checkout-session`
  - [ ] `stripe-webhook`
- [ ] Edge Function secrets configured:
  - [ ] `STRIPE_SECRET_KEY` (production key)
  - [ ] `STRIPE_WEBHOOK_SECRET` (from Stripe)
  - [ ] `SITE_URL` (production URL)

### Environment Variables
- [ ] `.env.production` created with all variables
- [ ] `VITE_SUPABASE_URL` set
- [ ] `VITE_SUPABASE_ANON_KEY` set
- [ ] `VITE_STRIPE_PUBLISHABLE_KEY` set (production key)
- [ ] `VITE_SITE_URL` set (production domain)
- [ ] Variables added to deployment platform (Vercel/Netlify/etc.)

### Email Configuration
- [ ] Email service configured (Supabase or custom)
- [ ] License key email template created
- [ ] Test email sent and received successfully

---

## Testing (Test Mode)

### Functional Testing
- [ ] Store page loads correctly
- [ ] Products display correctly
- [ ] Add to cart works
- [ ] Cart persists in localStorage
- [ ] Checkout page loads
- [ ] Guest checkout works
- [ ] Authenticated checkout works
- [ ] Stripe checkout redirects correctly
- [ ] Test payment succeeds
- [ ] Webhook receives event
- [ ] License key generated
- [ ] License key stored in database
- [ ] Email with license key sent
- [ ] Purchase success page displays
- [ ] License activation works
- [ ] My Downloads page shows purchase

### Error Handling
- [ ] Empty cart handled
- [ ] Invalid products handled
- [ ] Payment failure handled
- [ ] Network errors handled
- [ ] Missing configuration errors handled

### Security Testing
- [ ] HTTPS enforced
- [ ] No sensitive data in client code
- [ ] Webhook signature verified
- [ ] RLS policies working
- [ ] Input validation working

---

## Production Deployment

### Deployment Steps
- [ ] Code reviewed and approved
- [ ] All tests passing
- [ ] Production environment variables verified
- [ ] Application built successfully
- [ ] Deployed to production platform
- [ ] Production URL accessible
- [ ] SSL certificate valid

### Post-Deployment Verification
- [ ] Application loads at production URL
- [ ] Store page accessible
- [ ] Checkout flow works
- [ ] Real payment processed successfully
- [ ] License key generated and delivered
- [ ] Webhook processes events
- [ ] No errors in logs

### Monitoring Setup
- [ ] Stripe Dashboard monitoring configured
- [ ] Supabase logs monitoring set up
- [ ] Application error tracking configured
- [ ] Alerts configured for:
  - [ ] Failed payments
  - [ ] Webhook failures
  - [ ] Edge Function errors

---

## Production Testing

### First Production Purchase
- [ ] Small test purchase made
- [ ] Payment processed successfully
- [ ] License key received via email
- [ ] License activates correctly
- [ ] Purchase appears in My Downloads
- [ ] Database record created correctly

### Verification
- [ ] Stripe Dashboard shows payment
- [ ] Supabase database has purchase record
- [ ] Webhook logs show successful processing
- [ ] No errors in application logs

---

## Sign-Off

**Deployed By:** _______________  
**Date:** _______________  
**Time:** _______________

**Verified By:** _______________  
**Date:** _______________  
**Time:** _______________

**Status:** ☐ Ready for Production  ☐ Issues Found (see notes below)

---

## Notes

_Add any issues, concerns, or additional notes here:_

---

## Rollback Plan

If issues are discovered:

1. **Immediate Actions:**
   - [ ] Disable checkout button (if critical issue)
   - [ ] Notify team
   - [ ] Review error logs

2. **Rollback Steps:**
   - [ ] Revert to previous deployment
   - [ ] Restore previous environment variables
   - [ ] Verify previous version works

3. **Post-Rollback:**
   - [ ] Document issue
   - [ ] Create fix
   - [ ] Test fix thoroughly
   - [ ] Re-deploy when ready

---

**Checklist Version:** 1.0  
**Last Updated:** 2025-01-27

