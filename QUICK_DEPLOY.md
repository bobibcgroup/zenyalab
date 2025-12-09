# Quick Deployment Guide

## Fastest Way: Deploy to Vercel (5 minutes)

### Step 1: Initialize Git (if not already done)
```bash
git init
git add .
git commit -m "Initial commit - Zenya Lab landing page"
```

### Step 2: Push to GitHub
1. Create a new repository on GitHub
2. Push your code:
```bash
git remote add origin https://github.com/yourusername/zenya-lab.git
git branch -M main
git push -u origin main
```

### Step 3: Deploy to Vercel
1. Go to https://vercel.com/new
2. Sign in with GitHub
3. Click "Import Project"
4. Select your repository
5. **Add Environment Variables:**
   - `OPENAI_API_KEY` = `key`
   - `NEXT_PUBLIC_SITE_URL` = `https://zenyalab.com`
   - `NEXT_PUBLIC_CONTACT_EMAIL` = `contact@zenyalab.com`
6. Click "Deploy"

### Step 4: Done! 🎉
Your site will be live at `your-project.vercel.app`

### Step 5: Add Custom Domain (Optional)
1. Go to Project Settings → Domains
2. Add your domain
3. Update DNS records as instructed
4. SSL is automatic!

---

## Alternative: Deploy via Vercel CLI

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Follow prompts:
# - Set up and deploy? Yes
# - Which scope? (your account)
# - Link to existing project? No
# - Project name? zenya-lab
# - Directory? ./
# - Override settings? No

# Add environment variables when prompted
```

---

## What's Already Ready:
✅ Build configuration
✅ Production optimizations
✅ Environment variable setup
✅ Vercel configuration file
✅ All dependencies included

---

## Need Help?
See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed instructions.

