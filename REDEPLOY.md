# How to Redeploy on Vercel

## Method 1: Via Vercel Dashboard

1. **Go to:** https://vercel.com/dashboard
2. **Click on your project** (zenya-lab)
3. **Go to "Deployments" tab**
4. **Find the latest deployment**
5. **Click the three dots (⋯) menu** next to the deployment
6. **Click "Redeploy"**

**OR**

1. Go to your project
2. Click **"Deployments"** tab
3. Click on the latest deployment
4. Click **"Redeploy"** button (usually at the top right)

---

## Method 2: Via Vercel CLI

```bash
# Login to Vercel (first time only)
vercel login

# Deploy from current directory
vercel --prod

# Or deploy to preview
vercel
```

---

## Method 3: Check Branch Settings

If auto-deploy isn't working:

1. Go to **Project Settings** → **Git**
2. Check **"Production Branch"** - should be `main` or `fresh-deploy`
3. If it's `main`, either:
   - Merge `fresh-deploy` into `main`, OR
   - Change Production Branch to `fresh-deploy`

---

## Method 4: Push to Main Branch

If Vercel is watching `main` branch:

```bash
git checkout main
git merge fresh-deploy
git push origin main
```

This will trigger automatic deployment.

---

## Quick Check: Which Branch is Vercel Watching?

1. Go to Vercel Dashboard → Your Project
2. Settings → Git
3. Look at "Production Branch" setting

---

## Troubleshooting

**Can't find Redeploy button?**
- Make sure you're in the "Deployments" tab
- Look for three dots menu (⋯) next to deployment
- Or click on a specific deployment to see options

**Auto-deploy not working?**
- Check if branch matches Production Branch setting
- Verify GitHub integration is connected
- Check deployment logs for errors

