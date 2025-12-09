# 🧪 CyberCorrect Complete Testing Guide

## Overview

This guide covers all testing aspects for CyberCorrect, from unit tests to post-deployment verification.

## 📊 Current Test Status

**Last Test Run**: 2025-02-02  
**Results**: ✅ 215 Passed | ❌ 25 Failed (89.6% Pass Rate)  
**See**: `TEST_RESULTS_SUMMARY.md` for detailed results

---

## 📋 Testing Checklist

### Phase 1: Automated Tests (30 minutes)

#### Step 1: Run Unit Tests
```bash
cd apps/framework-compliance
npm run test:run
```

**Expected**: All unit tests pass
- Component tests (Button, LoadingSpinner)
- Utility tests (PDF generation, secure storage)
- Integration tests (App, Auth, Database, Sentry)

#### Step 2: Generate Coverage Report
```bash
npm run test:coverage
```

**Expected**: 
- Coverage threshold: 80% for branches, functions, lines, statements
- Coverage report generated in `coverage/` directory

#### Step 3: Run Tests with UI (Optional)
```bash
npm run test:ui
```

**Useful for**: Visual test debugging and interactive test running

---

### Phase 2: Supabase Integration Tests (15 minutes)

#### Step 4: Verify Supabase Connection
```bash
npm run supabase:verify
```

**Checks**:
- ✅ Connection to Supabase
- ✅ All 12 required tables exist
- ✅ Tables are accessible

#### Step 5: Test Supabase Connection
```bash
npm run supabase:test
```

**Checks**:
- ✅ Database connectivity
- ✅ Authentication flow
- ✅ CRUD operations

---

### Phase 3: Manual Feature Testing (60-90 minutes)

#### Step 6: Authentication Testing

**Test Cases**:
- [ ] User registration
- [ ] User login
- [ ] User logout
- [ ] Password reset
- [ ] Session persistence
- [ ] Protected routes redirect

**How to Test**:
1. Start dev server: `npm run dev`
2. Navigate to: http://localhost:5173
3. Test each authentication flow
4. Check browser console for errors

#### Step 7: Privacy Tools Testing

**Test Each Tool**:

1. **Consent Management**
   - [ ] Create consent record
   - [ ] View consent records
   - [ ] Update consent record
   - [ ] Delete consent record
   - [ ] Filter by status
   - [ ] Export data

2. **Vendor Risk Assessment**
   - [ ] Create vendor assessment
   - [ ] Calculate risk score
   - [ ] View assessment details
   - [ ] Update assessment
   - [ ] Export report

3. **Retention Policy Generator**
   - [ ] Create retention policy
   - [ ] Link data records
   - [ ] Set retention periods
   - [ ] Generate policy document
   - [ ] Export PDF

4. **DPIA Manager**
   - [ ] Create DPIA
   - [ ] Complete risk assessment
   - [ ] Add mitigation measures
   - [ ] Generate DPIA report
   - [ ] Export document

5. **Privacy by Design Assessment**
   - [ ] Create assessment
   - [ ] Evaluate 7 principles
   - [ ] Calculate compliance score
   - [ ] View recommendations
   - [ ] Export report

6. **Service Provider Manager**
   - [ ] Add service provider
   - [ ] Track agreements
   - [ ] Monitor compliance
   - [ ] Assess risks
   - [ ] Export data

7. **Incident Response Manager**
   - [ ] Create incident
   - [ ] Track incident status
   - [ ] Add regulatory notifications
   - [ ] Document lessons learned
   - [ ] Export incident report

#### Step 8: Data Persistence Testing

**Test Cases**:
- [ ] Data saves to localStorage (Privacy by Design)
- [ ] Data syncs to Supabase
- [ ] Data persists after page refresh
- [ ] Data persists after logout/login
- [ ] Data is user-specific (RLS)

**How to Test**:
1. Create a record in any tool
2. Check browser DevTools → Application → Local Storage
3. Check Supabase Dashboard → Table Editor
4. Refresh page - data should persist
5. Logout and login - data should still be there

#### Step 9: Export Functionality Testing

**Test Cases**:
- [ ] Export to PDF works
- [ ] Export to Word works (if available)
- [ ] Export to Excel works (if available)
- [ ] Export includes all data
- [ ] Export formatting is correct

**How to Test**:
1. Create test data in each tool
2. Click export button
3. Verify file downloads
4. Open file and verify content

#### Step 10: Navigation & Routing Testing

**Test Cases**:
- [ ] All routes load correctly
- [ ] Navigation links work
- [ ] Back button works
- [ ] Direct URL access works
- [ ] 404 page shows for invalid routes

**Routes to Test**:
- `/` - Landing page
- `/login` - Login page
- `/dashboard` - Dashboard
- `/tools-and-assessments/*` - All tool pages
- `/project/*` - Project management pages
- `/resources/*` - Documentation pages
- `/account/*` - Account pages

---

### Phase 4: Production Testing (30 minutes)

#### Step 11: Production Site Testing

**Test Cases**:
- [ ] Production site loads: https://www.cybercorrect.com
- [ ] All pages accessible
- [ ] No console errors
- [ ] Performance is acceptable
- [ ] Mobile responsive
- [ ] SSL certificate valid

**How to Test**:
1. Visit production URL
2. Test key features
3. Check browser console
4. Test on mobile device
5. Run Lighthouse audit

#### Step 12: Edge Functions Testing

**Test Cases**:
- [ ] Email notifications work
- [ ] Automated reports generate
- [ ] Scheduled assessments run
- [ ] Compliance health tracking works
- [ ] Regulatory updates check works

**How to Test**:
1. Trigger each function manually
2. Check Supabase Dashboard → Edge Functions → Logs
3. Verify function execution
4. Check for errors

---

### Phase 5: Performance Testing (15 minutes)

#### Step 13: Performance Metrics

**Test Cases**:
- [ ] Page load time < 3 seconds
- [ ] Time to Interactive < 5 seconds
- [ ] Lighthouse score > 90
- [ ] No memory leaks
- [ ] Smooth animations

**How to Test**:
1. Open Chrome DevTools → Lighthouse
2. Run performance audit
3. Check Core Web Vitals
4. Monitor network tab
5. Check memory usage

#### Step 14: Browser Compatibility

**Test Cases**:
- [ ] Chrome (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest)
- [ ] Edge (latest)
- [ ] Mobile browsers

**How to Test**:
1. Test in each browser
2. Check for console errors
3. Verify features work
4. Check responsive design

---

### Phase 6: Security Testing (20 minutes)

#### Step 15: Security Checks

**Test Cases**:
- [ ] Authentication required for protected routes
- [ ] RLS policies enforce data isolation
- [ ] No sensitive data in client code
- [ ] HTTPS enforced
- [ ] Security headers present
- [ ] XSS protection works
- [ ] CSRF protection works

**How to Test**:
1. Try accessing protected routes without auth
2. Test with different user accounts
3. Check network requests
4. Inspect source code
5. Test input validation

---

### Phase 7: Accessibility Testing (15 minutes)

#### Step 16: Accessibility Checks

**Test Cases**:
- [ ] Keyboard navigation works
- [ ] Screen reader compatible
- [ ] ARIA labels present
- [ ] Color contrast sufficient
- [ ] Focus indicators visible
- [ ] WCAG 2.1 AA compliance

**How to Test**:
1. Navigate with keyboard only
2. Use screen reader (NVDA/JAWS)
3. Check ARIA attributes
4. Run accessibility audit
5. Test color contrast

---

## 📊 Test Results Template

### Automated Tests
```
✅ Unit Tests: [X/X] passed
✅ Integration Tests: [X/X] passed
✅ Coverage: [XX]% (target: 80%)
```

### Manual Tests
```
✅ Authentication: [X/X] passed
✅ Privacy Tools: [X/7] passed
✅ Data Persistence: [X/X] passed
✅ Export Functionality: [X/X] passed
✅ Navigation: [X/X] passed
```

### Production Tests
```
✅ Production Site: [X/X] passed
✅ Edge Functions: [X/6] passed
✅ Performance: [X/X] passed
✅ Browser Compatibility: [X/5] passed
```

### Security & Accessibility
```
✅ Security: [X/X] passed
✅ Accessibility: [X/X] passed
```

---

## 🐛 Common Issues & Solutions

### Issue: Tests Fail with "Cannot find module"
**Solution**: 
```bash
npm install
npm run test:run
```

### Issue: Supabase Connection Fails
**Solution**:
- Check `.env` file has correct credentials
- Verify Supabase project is active
- Check network connectivity

### Issue: Coverage Below Threshold
**Solution**:
- Review coverage report
- Add tests for uncovered code
- Focus on critical paths first

### Issue: Production Site Shows Blank Page
**Solution**:
- Check environment variables in Vercel
- Verify Supabase credentials
- Check browser console for errors
- Redeploy after fixing

---

## 📈 Test Metrics

### Coverage Goals
- **Branches**: 80%+
- **Functions**: 80%+
- **Lines**: 80%+
- **Statements**: 80%+

### Performance Goals
- **Page Load**: < 3 seconds
- **Time to Interactive**: < 5 seconds
- **Lighthouse Score**: > 90

### Quality Goals
- **Zero Critical Bugs**
- **Zero Security Vulnerabilities**
- **WCAG 2.1 AA Compliance**

---

## ✅ Testing Sign-Off

### Pre-Production Checklist
- [ ] All automated tests pass
- [ ] Coverage meets thresholds
- [ ] All manual tests completed
- [ ] Production site tested
- [ ] Edge Functions tested
- [ ] Performance acceptable
- [ ] Security verified
- [ ] Accessibility verified

### Sign-Off
```
Tested by: ________________
Date: ________________
Status: ✅ PASS / ❌ FAIL
Notes: ________________
```

---

## 🚀 Quick Test Commands

```bash
# Run all tests
npm run test:run

# Run with coverage
npm run test:coverage

# Run with UI
npm run test:ui

# Verify Supabase
npm run supabase:verify

# Test Supabase connection
npm run supabase:test

# Verify production
npm run verify:production

# Verify deployment
npm run verify:deployment
```

---

## 📚 Additional Resources

- **Test Documentation**: `TESTING_DOCUMENTATION.md`
- **Dev Test Results**: `DEV_TEST_RESULTS.md`
- **Setup Guide**: `COMPLETE_SETUP_GUIDE.md`
- **Vitest Docs**: https://vitest.dev/

---

**Status**: Ready for testing
**Estimated Time**: 2-3 hours for complete testing
**Last Updated**: 2024-12-05

