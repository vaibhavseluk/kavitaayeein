# HeyShabdly Custom Domain Fix Guide

## Current Status (2026-02-22)

### ❌ Problem Identified
**hey.shabdly.online** is pointing to an **OLD Cloudflare Pages project** called `heyshabdly` (last deployed 1 week ago).

The latest code with all fixes is deployed to the **`poetry-platform`** project (deployed 5 minutes ago).

### 🔍 Current Configuration

#### Cloudflare Pages Projects:
1. **poetry-platform** (✅ CORRECT - Latest)
   - Domains: `poetry-platform.pages.dev`, `shabdly.online`, `www.shabdly.online`
   - Last deployment: 487a0bd9 (5 minutes ago)
   - Status: ✅ All fixes applied
   
2. **heyshabdly** (⚠️ OLD - Wrong project)
   - Domains: `heyshabdly.pages.dev`, `hey.shabdly.online`
   - Last deployment: 7a484427 (1 week ago)
   - Status: ⚠️ Outdated, missing all recent fixes

### ✅ What's Working
- ✅ **shabdly.online** → Correct (points to `poetry-platform`)
- ✅ **Latest deployment** (487a0bd9) → Has all fixes
- ✅ Code is correct (routes, domain detection, catch-all exclusions)
- ✅ Database schema (HeyShabdly tables created)
- ✅ API routes mounted (poems, anthology, editor, etc.)

### ❌ What's NOT Working
- ❌ **hey.shabdly.online/settings** → Shows old homepage (wrong project)
- ❌ **hey.shabdly.online/api/poems** → Old API (missing endpoints)
- ❌ Custom domain pointing to wrong project

---

## 🛠️ Fix Instructions (Cloudflare Dashboard)

### Step 1: Remove hey.shabdly.online from OLD project

1. Go to **Cloudflare Dashboard** → **Pages**
2. Click on **`heyshabdly`** project (the old one)
3. Go to **Custom domains** tab
4. Find **hey.shabdly.online** in the list
5. Click **"Remove domain"** or **"Delete"**
6. Confirm removal

### Step 2: Add hey.shabdly.online to CORRECT project

1. Go to **Cloudflare Dashboard** → **Pages**
2. Click on **`poetry-platform`** project (the current one)
3. Go to **Custom domains** tab
4. Click **"Set up a custom domain"** or **"Add domain"**
5. Enter: **hey.shabdly.online**
6. Click **"Activate domain"**
7. Wait 2-5 minutes for DNS propagation

### Step 3: Verify the Fix

After DNS propagates (2-5 minutes), run these commands:

```bash
# Test settings page
curl -s https://hey.shabdly.online/settings | grep -o "<title>[^<]*</title>"
# Expected: <title>Settings - HeyShabdly</title>

# Test API
curl -s https://hey.shabdly.online/api/health
# Expected: {"status":"ok","service":"shabdly-ecommerce-translation","timestamp":"..."}

# Test poems API (HeyShabdly specific)
curl -s https://hey.shabdly.online/api/poems
# Expected: {"poems":[],"limit":50,"offset":0,"sort":"newest"}
```

---

## 🎯 Expected Results After Fix

| URL | Expected Title | Expected Behavior |
|-----|----------------|-------------------|
| https://hey.shabdly.online/ | "HeyShabdly - Help Me Grow" | Homepage with SPA |
| https://hey.shabdly.online/settings | "Settings - HeyShabdly" | Settings page with orange/plum branding |
| https://shabdly.online/ | "Shabdly - AI-Powered Solutions for Growth & Translation" | E-commerce homepage |
| https://shabdly.online/settings | "Settings - Shabdly" | Settings page with blue branding |

---

## 📊 Technical Details

### Domain Detection Logic
```typescript
const host = c.req.header('host') || '';
const isHeyShabdly = host.includes('hey.shabdly');

// Dynamic branding
const title = isHeyShabdly ? 'Settings - HeyShabdly' : 'Settings - Shabdly';
const colors = isHeyShabdly 
  ? { primary: '#F9A03F', secondary: '#4A225D', accent: '#FFF8E7' }
  : { primary: '#3B82F6', secondary: '#1E40AF', accent: '#DBEAFE' };
```

### Catch-All Route Configuration
```typescript
app.get('*', (c) => {
  const path = c.req.path;
  const host = c.req.header('host') || '';
  const isHeyShabdly = host.includes('hey.shabdly');
  
  // Exclude specific routes from SPA catch-all
  const excludedPaths = ['/settings', '/dashboard', '/api', '/static'];
  const isExcludedPath = excludedPaths.some(excluded => path.startsWith(excluded));
  
  // Only serve SPA for HeyShabdly on non-excluded paths
  if (isHeyShabdly && !isExcludedPath) {
    return c.html(/* HeyShabdly SPA HTML */);
  }
  
  // Shabdly.online fallback
  return c.notFound();
});
```

### Database Schema
All HeyShabdly tables created:
- ✅ `poems` - Poetry content
- ✅ `poem_likes` - User likes
- ✅ `poem_reports` - Content reports
- ✅ `questions` - Mentorship questions
- ✅ `interview_sessions` - Practice interviews
- ✅ `interview_questions` - Interview Q&A
- ✅ `sponsored_content` - Sponsorships
- ✅ `subscriptions` - User subscriptions

### API Routes Mounted
- ✅ `/api/auth` - Domain-aware authentication
- ✅ `/api/poems` - Poetry management
- ✅ `/api/anthology` - Poem collections
- ✅ `/api/editor` - Poem editor
- ✅ `/api/reports` - User reports
- ✅ `/api/sponsors` - Sponsorships
- ✅ `/api/subscriptions` - User subscriptions
- ✅ `/api/admin` - Domain-aware admin panel
- ✅ `/api/settings` - Shared settings API

---

## 🚨 Why This Happened

The system has **two separate Cloudflare Pages projects**:
1. **Old setup** (heyshabdly) - Created initially, now outdated
2. **New unified setup** (poetry-platform) - Contains both Shabdly and HeyShabdly

The custom domain **hey.shabdly.online** was never moved from the old project to the new one, so it's still serving 1-week-old code.

---

## ✅ Post-Fix Checklist

After completing the domain migration:

- [ ] hey.shabdly.online/settings shows "Settings - HeyShabdly" (orange/plum theme)
- [ ] hey.shabdly.online/ shows HeyShabdly SPA homepage
- [ ] hey.shabdly.online/api/poems returns JSON (not HTML)
- [ ] hey.shabdly.online/api/health returns correct service name
- [ ] shabdly.online/settings still works (blue theme)
- [ ] No 404 errors on either domain

---

## 📝 Notes

- **DNS Propagation**: Takes 2-5 minutes after adding custom domain
- **Cache**: May need to clear browser cache or use incognito mode
- **Testing**: Use `curl` commands to bypass browser cache
- **Rollback**: If issues occur, re-add domain to old project temporarily

---

## 🆘 Troubleshooting

### If hey.shabdly.online still shows old content after 5 minutes:

1. **Check DNS:**
   ```bash
   nslookup hey.shabdly.online
   ```
   Should point to Cloudflare Pages IP

2. **Purge Cloudflare Cache:**
   - Go to Cloudflare Dashboard → Caching
   - Click "Purge Everything"
   - Wait 30 seconds, test again

3. **Verify Custom Domain:**
   - Check if hey.shabdly.online appears in poetry-platform's custom domains
   - Check if it's removed from heyshabdly project

4. **Test with cache-busting:**
   ```bash
   curl -s "https://hey.shabdly.online/settings?t=$(date +%s)" | grep "<title>"
   ```

---

## 📞 Support

If the fix doesn't work after following these steps, the issue might be:
- DNS propagation delay (wait up to 30 minutes)
- Cloudflare caching (purge cache)
- Domain verification pending (check Cloudflare email)

Current deployment: **487a0bd9.poetry-platform.pages.dev**
Commit: **4287982** ("fix: Mount HeyShabdly API routes and add database schema")
Date: **2026-02-22 11:09 UTC**
