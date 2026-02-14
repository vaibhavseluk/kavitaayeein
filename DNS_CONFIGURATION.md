# Custom Domain Configuration for Shabdly.online

**Domain**: shabdly.online  
**Date**: February 14, 2026  
**Status**: Ready for Configuration

---

## 🌐 Domain Architecture

### Primary Domain Structure
```
https://shabdly.online              → Platform Hub (Landing Page)
https://shabdly.online/translate    → E-commerce Translation Platform
https://hey.shabdly.online          → HeyShabdly Career Guidance PWA
https://app.shabdly.online          → Unified Dashboard (Future)
https://docs.shabdly.online         → Documentation (Future)
```

---

## 📋 DNS Configuration Steps

### Step 1: Login to Your Domain Registrar
Log in to the dashboard where you purchased `shabdly.online` (e.g., GoDaddy, Namecheap, Google Domains, Cloudflare Registrar).

### Step 2: Access DNS Management
Navigate to the DNS settings/DNS management section for `shabdly.online`.

### Step 3: Add DNS Records

#### **For Main Domain (shabdly.online)**

**Option A: Using CNAME (Recommended)**
```
Type: CNAME
Name: @ (or leave blank for root domain)
Target: poetry-platform.pages.dev
TTL: Auto or 3600
Proxy: Enabled (if using Cloudflare)
```

**Option B: Using A Records (Alternative)**
```
Type: A
Name: @ (or leave blank)
IPv4: 
  - 172.66.40.0
  - 172.66.41.0
TTL: Auto or 3600
```

#### **For HeyShabdly Subdomain (hey.shabdly.online)**

```
Type: CNAME
Name: hey
Target: [your-heyshabdly-deployment].pages.dev
TTL: Auto or 3600
Proxy: Enabled
```

**Example**:
- If HeyShabdly is deployed to `heyshabdly.pages.dev`, use that as target
- If you haven't deployed HeyShabdly yet, skip this for now

#### **For WWW Subdomain (www.shabdly.online)**

```
Type: CNAME
Name: www
Target: shabdly.online
TTL: Auto or 3600
Proxy: Enabled
```

---

## 🚀 Cloudflare Pages Custom Domain Configuration

### Step 4: Add Custom Domain in Cloudflare Dashboard

1. **Login to Cloudflare Dashboard**: https://dash.cloudflare.com
2. **Navigate to Pages**: Workers & Pages → Pages
3. **Select Project**: Click on `poetry-platform` (or `shabdly-online` after renaming)
4. **Custom Domains**: Go to "Custom domains" tab
5. **Add Domain**: Click "Set up a custom domain"
6. **Enter Domain**: 
   - Primary: `shabdly.online`
   - Also add: `www.shabdly.online`
7. **Verify**: Cloudflare will verify DNS records
8. **SSL Certificate**: Cloudflare will automatically provision SSL (wait 5-10 minutes)

---

## 🔧 Alternative: Using Wrangler CLI

### Create New Cloudflare Pages Project (Optional)

If you want to create a fresh project with the new name:

```bash
# Create new project
npx wrangler pages project create shabdly-online --production-branch main

# Deploy to new project
npx wrangler pages deploy dist --project-name shabdly-online

# Add custom domain via CLI (requires Cloudflare zone)
npx wrangler pages domain add shabdly.online --project-name shabdly-online
```

---

## ✅ Verification Steps

### Step 5: Verify DNS Propagation

Wait 5-60 minutes for DNS to propagate globally, then test:

```bash
# Check if domain resolves
nslookup shabdly.online

# Test HTTPS (may take 10 minutes for SSL)
curl -I https://shabdly.online

# Check if it redirects to HTTPS
curl -I http://shabdly.online
```

### Step 6: Test All Routes

Once DNS is active, verify these URLs work:

```
✅ https://shabdly.online/                 → Platform Hub
✅ https://shabdly.online/translate        → Translation Platform
✅ https://shabdly.online/dashboard        → Dashboard
✅ https://shabdly.online/help             → Help Center
✅ https://shabdly.online/documentation    → Documentation
✅ https://www.shabdly.online              → Should redirect to main
```

---

## 🎯 Current Deployment URLs (Before Custom Domain)

**Active Deployment**: https://11532a0c.poetry-platform.pages.dev

This will continue to work even after adding custom domain. Cloudflare will serve both URLs.

---

## 📊 DNS Record Summary Table

| Type | Name | Target/Value | Purpose |
|------|------|--------------|---------|
| CNAME | @ | poetry-platform.pages.dev | Main domain |
| CNAME | www | shabdly.online | WWW redirect |
| CNAME | hey | heyshabdly.pages.dev | HeyShabdly platform |
| A | @ | 172.66.40.0 | Cloudflare IP (alt) |
| A | @ | 172.66.41.0 | Cloudflare IP (alt) |

---

## 🔒 SSL/HTTPS Configuration

Cloudflare Pages automatically provides:
- ✅ Free SSL certificate
- ✅ Automatic HTTPS redirect
- ✅ HTTP/2 and HTTP/3 support
- ✅ Edge caching and CDN
- ✅ DDoS protection

**No additional configuration needed!**

---

## 🚨 Troubleshooting

### Issue 1: "DNS_PROBE_FINISHED_NXDOMAIN"
**Solution**: DNS not propagated yet. Wait 10-60 minutes.

### Issue 2: "ERR_SSL_VERSION_OR_CIPHER_MISMATCH"
**Solution**: SSL certificate still provisioning. Wait 5-10 minutes after DNS is active.

### Issue 3: "This site can't be reached"
**Solution**: Check DNS records are correct. Use `nslookup shabdly.online` to verify.

### Issue 4: 404 Error on Custom Domain
**Solution**: 
1. Verify custom domain added in Cloudflare Pages dashboard
2. Check `wrangler.jsonc` has correct project name
3. Redeploy: `npx wrangler pages deploy dist --project-name shabdly-online`

---

## 📱 Email Configuration (Optional)

If you want email@shabdly.online:

```
Type: MX
Name: @
Priority: 10
Target: [your-email-provider-mx]
TTL: 3600
```

Popular providers:
- **Google Workspace**: `smtp.gmail.com`
- **Zoho Mail**: `mx.zoho.com`
- **ProtonMail**: `mail.protonmail.ch`

---

## 🎉 Next Steps After Domain is Live

1. **Update Social Media Links**: Change all URLs from `.pages.dev` to `shabdly.online`
2. **Update Email Signatures**: Use `shabdly.online` in professional communications
3. **Set up Google Search Console**: Submit sitemap for SEO
4. **Configure Analytics**: Add Google Analytics to track traffic
5. **Monitor Performance**: Use Cloudflare analytics dashboard

---

## 📞 Support

**Domain Issues**: Contact your domain registrar  
**Cloudflare Issues**: https://support.cloudflare.com  
**Shabdly Support**: heyshabdly@gmail.com

---

## 🔗 Useful Links

- **Cloudflare Dashboard**: https://dash.cloudflare.com
- **Cloudflare Pages Docs**: https://developers.cloudflare.com/pages
- **DNS Propagation Checker**: https://dnschecker.org
- **SSL Checker**: https://www.ssllabs.com/ssltest/

---

**Status**: Configuration guide complete. Ready to implement! 🚀

*Last updated: February 14, 2026*
