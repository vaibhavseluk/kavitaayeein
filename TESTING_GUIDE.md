# Testing Guide - Policies & Signup Validation

## Live Test URL
🌐 **Development Server:** https://3000-i50h0iu6uof9fu9t33zaw-5c13a017.sandbox.novita.ai

---

## Test 1: Signup Page - Checkbox Visibility

### Steps:
1. Open homepage: https://3000-i50h0iu6uof9fu9t33zaw-5c13a017.sandbox.novita.ai
2. Click "Sign Up" button in navigation

### Expected Result:
✅ You should see a signup form with:
- Username, Email, Password fields
- Display Name field
- Preferred Language dropdown
- **NEW:** Checkbox with text: "I agree to the Terms of Service and Privacy Policy, including granting the platform rights to include my poems in paid anthologies."
- Two underlined blue links: "Terms of Service" and "Privacy Policy"

---

## Test 2: Policy Links

### Steps:
1. On the signup page, click "Terms of Service" link
2. Verify it opens in a new tab
3. Return to signup tab
4. Click "Privacy Policy" link
5. Verify it opens in a new tab

### Expected Result:
✅ Both links open in new tabs
✅ Terms of Service page displays with full content
✅ Privacy Policy page displays with full content
✅ Original signup page remains open

---

## Test 3: Checkbox Validation (Unchecked)

### Steps:
1. On signup page, fill in all fields:
   - Username: testuser123
   - Email: test@example.com
   - Password: Test123!
   - Display Name: Test User
   - Language: English
2. **DO NOT** check the Terms & Privacy checkbox
3. Click "Sign Up" button

### Expected Result:
✅ Alert appears: "You must agree to the Terms of Service and Privacy Policy to create an account."
✅ Form does NOT submit
✅ User remains on signup page

---

## Test 4: Checkbox Validation (Checked)

### Steps:
1. On signup page, fill in all fields:
   - Username: testuser456
   - Email: test2@example.com
   - Password: Test123!
   - Display Name: Test User 2
   - Language: English
2. **CHECK** the Terms & Privacy checkbox
3. Click "Sign Up" button

### Expected Result:
✅ Alert: "Account created successfully!"
✅ Page reloads
✅ User is logged in
✅ Navigation shows user menu instead of "Login/Sign Up"

---

## Test 5: Footer Policy Links

### Steps:
1. Scroll to bottom of homepage
2. Locate "Legal" section in footer
3. Click each link:
   - Privacy Policy
   - Terms of Service
   - Refund Policy
   - FAQ

### Expected Result:
✅ All 4 links work
✅ All open in new tabs
✅ All pages load successfully with full content

---

## Test 6: Policy Page Navigation

### Steps:
1. Open any policy page (e.g., /privacy-policy)
2. Click "Back to Home" link in top navigation
3. Verify you return to homepage

### Expected Result:
✅ Navigation back to homepage works
✅ No broken links

---

## Test 7: Theme Toggle on Policy Pages

### Steps:
1. Open any policy page
2. Look for theme toggle button (moon/sun icon) in navigation
3. Click to toggle between light and dark modes

### Expected Result:
✅ Theme toggle button is visible
✅ Clicking toggles between light/dark themes
✅ Theme persists across page navigation

---

## Test 8: Mobile Responsiveness

### Steps:
1. Open homepage on mobile device or use browser dev tools
2. Navigate to signup page
3. Check checkbox visibility and functionality
4. Open policy pages

### Expected Result:
✅ Signup form is responsive
✅ Checkbox and text are readable on mobile
✅ Policy pages are mobile-friendly
✅ Footer is properly formatted on mobile

---

## Test 9: Policy Content Verification

### Privacy Policy (`/privacy-policy`)
**Check for:**
- ✅ Sections 1-11 present
- ✅ Contact email: heyshabdly@gmail.com
- ✅ Effective Date: January 13, 2026
- ✅ Footer with all policy links

### Terms of Service (`/terms-of-service`)
**Check for:**
- ✅ Sections 1-13 present
- ✅ Anthology rights explanation
- ✅ Premium plan pricing: $4.66/year
- ✅ Contact email: heyshabdly@gmail.com

### Refund Policy (`/refund-policy`)
**Check for:**
- ✅ 7-day money-back guarantee
- ✅ No refunds after 7 days
- ✅ Cancellation process explained
- ✅ Contact email: heyshabdly@gmail.com

### FAQ (`/faq`)
**Check for:**
- ✅ 7 main sections
- ✅ Clear Q&A format
- ✅ "Still Have Questions?" CTA
- ✅ Contact email: heyshabdly@gmail.com

---

## Test 10: Google AdSense Meta Tag

### Steps:
1. Open any page (homepage, signup, policy pages)
2. Right-click → "View Page Source"
3. Search for "google-adsense-account"

### Expected Result:
✅ Meta tag found: `<meta name="google-adsense-account" content="ca-pub-8929399363373996">`
✅ Present on ALL pages

---

## Quick Test Checklist

- [ ] Signup page shows checkbox with policy links
- [ ] Terms of Service link works and opens in new tab
- [ ] Privacy Policy link works and opens in new tab
- [ ] Unchecked checkbox shows validation alert
- [ ] Checked checkbox allows form submission
- [ ] Footer has all 4 policy links
- [ ] All policy pages load successfully
- [ ] Policy pages have "Back to Home" navigation
- [ ] Theme toggle works on policy pages
- [ ] Mobile responsiveness is good
- [ ] Contact email is heyshabdly@gmail.com on all pages
- [ ] Google AdSense meta tag present on all pages

---

## Bug Reporting

If you find any issues:
1. Note the page URL
2. Describe the issue
3. Include browser/device info
4. Send to: heyshabdly@gmail.com

---

## Summary

✅ **4 Policy Pages Created:**
- /privacy-policy
- /terms-of-service
- /refund-policy
- /faq

✅ **Signup Validation:**
- Checkbox required before registration
- JavaScript validation with custom alert
- Links to policies open in new tabs

✅ **Footer Updated:**
- All policy links in "Legal" section
- Links open in new tabs
- Consistent across all pages

**Status:** Ready for testing and production! 🚀
