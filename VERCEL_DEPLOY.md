# Deploy to Vercel - Step by Step

## Quick Deploy (5 minutes)

### Step 1: Go to Vercel
Visit: https://vercel.com/new

### Step 2: Sign In
- Sign in with GitHub (use the same account as your repository)

### Step 3: Import Repository
1. Click "Import Project"
2. Find and select: `bobibcgroup/zenya-lab`
3. Click "Import"

### Step 4: Configure Project
- **Framework Preset:** Next.js (auto-detected) ✅
- **Root Directory:** `./` (default) ✅
- **Build Command:** `npm run build` (auto) ✅
- **Output Directory:** `.next` (auto) ✅
- **Install Command:** `npm install` (auto) ✅

### Step 5: Select Branch
- **Branch:** Select `fresh-deploy` (or `main` if you merge it)

### Step 6: Add Environment Variables (CRITICAL!)
Click "Environment Variables" and add these three:

```
OPENAI_API_KEY
your_openai_api_key_here
```

```
NEXT_PUBLIC_SITE_URL
https://zenyalab.com
```

```
NEXT_PUBLIC_CONTACT_EMAIL
contact@zenyalab.com
```

### Step 7: Deploy!
Click "Deploy" button

### Step 8: Wait ~2 minutes
Your site will be live at: `your-project.vercel.app`

---

## After Deployment

### Add Custom Domain (Optional)
1. Go to Project Settings → Domains
2. Add your domain: `zenyalab.com`
3. Follow DNS configuration instructions
4. SSL certificate is automatic!

### Verify Deployment
- [ ] Landing page loads correctly
- [ ] Mobile layout is centered
- [ ] Modal opens and is centered
- [ ] Assessment form works
- [ ] ChatGPT analysis generates
- [ ] PDF export works

---

## Auto-Deployments

Once connected, Vercel will automatically deploy:
- ✅ Every push to `main` branch → Production
- ✅ Every push to other branches → Preview deployment

---

## Update Existing Vercel Project

If you already have a Vercel project:

1. Go to your Vercel dashboard
2. Select your project
3. Go to Settings → Git
4. Make sure it's connected to `bobibcgroup/zenya-lab`
5. Select branch: `fresh-deploy` (or merge to `main`)
6. Go to Settings → Environment Variables
7. Verify all 3 variables are set
8. Go to Deployments tab
9. Click "Redeploy" → "Use Existing Build Cache" (or let it auto-deploy on next push)

---

## Troubleshooting

**Build fails?**
- Check Environment Variables are set
- Check Node.js version (needs 18+)
- Check build logs in Vercel dashboard

**API not working?**
- Verify `OPENAI_API_KEY` is set correctly
- Check API key has credits
- Review function logs in Vercel dashboard

**Site not updating?**
- Check which branch is connected
- Verify latest commit is pushed
- Trigger manual redeploy

