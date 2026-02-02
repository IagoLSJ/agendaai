# Deployment Guide

Complete step-by-step guide to deploy your Appointment Scheduler to production.

## Prerequisites

- GitHub account
- Supabase account
- Vercel account (recommended) or any Node.js hosting platform

## Step 1: Prepare Supabase for Production

### 1.1 Create Production Project

1. Go to [supabase.com](https://supabase.com)
2. Click **New Project**
3. Choose organization and region (select closest to your users)
4. Set a strong database password and save it securely
5. Wait for project to be created (~2 minutes)

### 1.2 Run Database Migrations

1. Go to **SQL Editor** in Supabase dashboard
2. Copy the entire contents of `supabase/migrations/20240101000000_initial_schema.sql`
3. Paste into SQL Editor
4. Click **Run** or press `Ctrl/Cmd + Enter`
5. Verify success message appears

### 1.3 Configure Authentication

1. Go to **Authentication** → **Providers**
2. Enable **Email** provider
3. Configure email templates:
   - Go to **Authentication** → **Email Templates**
   - Customize confirmation and password reset emails
   - Add your business branding

### 1.4 Get API Credentials

1. Go to **Settings** → **API**
2. Copy these values:
   - **Project URL**: `https://xxxxx.supabase.co`
   - **anon public key**: `eyJhbGc...`
3. Store these securely - you'll need them for deployment

### 1.5 Verify RLS Policies

1. Go to **Authentication** → **Policies**
2. Check that all tables have RLS enabled
3. Verify policies are active (should see green checkmarks)

## Step 2: Prepare Code for Deployment

### 2.1 Update Package.json Scripts

Ensure your `package.json` has these scripts:

```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint"
  }
}
```

### 2.2 Create .gitignore

Ensure `.gitignore` includes:

```
node_modules
.next
.env*
!.env.example
```

### 2.3 Test Build Locally

```bash
npm run build
npm start
```

Access http://localhost:3000 and verify everything works.

## Step 3: Deploy to Vercel

### Method A: Deploy via Vercel Dashboard (Recommended)

#### 3.1 Push to GitHub

```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/yourusername/appointment-scheduler.git
git push -u origin main
```

#### 3.2 Import to Vercel

1. Go to [vercel.com](https://vercel.com)
2. Click **Add New** → **Project**
3. Click **Import Git Repository**
4. Select your repository
5. Click **Import**

#### 3.3 Configure Project

**Framework Preset**: Next.js (should auto-detect)

**Root Directory**: `./` (keep default)

**Build Command**: `next build` (keep default)

**Output Directory**: `.next` (keep default)

#### 3.4 Add Environment Variables

Click **Environment Variables** and add:

| Name | Value |
|------|-------|
| `NEXT_PUBLIC_SUPABASE_URL` | Your Supabase Project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Your Supabase anon key |

Important:
- Add to **Production** environment
- Can also add to **Preview** and **Development** if needed
- Values should match your Supabase production project

#### 3.5 Deploy

1. Click **Deploy**
2. Wait for build to complete (~2-3 minutes)
3. You'll get a URL like: `https://your-app.vercel.app`

### Method B: Deploy via Vercel CLI

```bash
# Install Vercel CLI
npm install -g vercel

# Login
vercel login

# Deploy
vercel

# Follow prompts:
# - Set up and deploy? Yes
# - Which scope? (Select your account)
# - Link to existing project? No
# - Project name? appointment-scheduler
# - In which directory? ./
# - Want to modify settings? No

# Add environment variables
vercel env add NEXT_PUBLIC_SUPABASE_URL
# Paste your Supabase URL when prompted

vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY
# Paste your Supabase anon key when prompted

# Deploy to production
vercel --prod
```

## Step 4: Configure Custom Domain (Optional)

### 4.1 Add Domain in Vercel

1. Go to your project in Vercel
2. Click **Settings** → **Domains**
3. Click **Add Domain**
4. Enter your domain (e.g., `appointments.yourbusiness.com`)
5. Click **Add**

### 4.2 Configure DNS

Add these DNS records at your domain provider:

**For subdomain** (appointments.yourbusiness.com):
```
Type: CNAME
Name: appointments
Value: cname.vercel-dns.com
```

**For root domain** (yourbusiness.com):
```
Type: A
Name: @
Value: 76.76.21.21
```

### 4.3 Enable SSL

- Vercel automatically provisions SSL certificates
- Wait 24-48 hours for DNS propagation
- Your site will be available at `https://yourdomain.com`

## Step 5: Post-Deployment Setup

### 5.1 Create Admin Account

1. Visit `https://your-app.vercel.app/login`
2. Click **Sign Up**
3. Enter:
   - Your name
   - Business name
   - Business slug (e.g., "my-salon")
   - Email and password
4. Click **Create Account**

### 5.2 Configure Services

1. Go to Dashboard → Services
2. Add your services (e.g., "Haircut - 30 min")
3. Verify they appear correctly

### 5.3 Set Business Hours

1. Go to Dashboard → Hours
2. Enable days you're open
3. Set start and end times
4. Save

### 5.4 Test Booking Flow

1. Visit `https://your-app.vercel.app/your-slug`
2. Complete a test booking
3. Verify appointment appears in dashboard

## Step 6: Configure Supabase Auth URLs

### 6.1 Update Site URL

1. Go to Supabase → **Authentication** → **URL Configuration**
2. Set **Site URL** to: `https://your-app.vercel.app`
3. Click **Save**

### 6.2 Add Redirect URLs

Add these to **Redirect URLs**:
- `https://your-app.vercel.app/auth/callback`
- `https://your-app.vercel.app/**` (wildcard for all routes)

## Step 7: Monitoring and Maintenance

### 7.1 Vercel Analytics

1. Go to project in Vercel
2. Click **Analytics** tab
3. View traffic and performance metrics

### 7.2 Supabase Monitoring

1. Go to Supabase dashboard
2. Monitor:
   - Database size and usage
   - API requests
   - Auth users

### 7.3 Set Up Alerts

**In Vercel:**
- Enable deployment notifications
- Set up error alerts

**In Supabase:**
- Monitor database size
- Set up backup schedules

## Troubleshooting

### Build Fails

**Error**: "Module not found"
- Solution: Run `npm install` locally and ensure package.json is correct

**Error**: "Environment variable missing"
- Solution: Add all required env vars in Vercel dashboard

### Authentication Issues

**Error**: "Invalid API key"
- Solution: Verify `NEXT_PUBLIC_SUPABASE_ANON_KEY` is correct

**Error**: "Email not confirmed"
- Solution: Disable email confirmation in Supabase or check email

### Booking Page Not Working

**Error**: 404 on /:slug
- Solution: Verify slug is correct and user exists in database

**Error**: No available times
- Solution: Check business hours are configured

### Database Connection Issues

**Error**: "Failed to fetch"
- Solution: Check RLS policies are enabled and correct

## Production Checklist

Before announcing to customers:

- [ ] All services added
- [ ] Business hours configured
- [ ] Test booking completed successfully
- [ ] Custom domain configured (if applicable)
- [ ] SSL certificate active
- [ ] Email templates customized
- [ ] Privacy policy added
- [ ] Analytics enabled
- [ ] Backups configured
- [ ] Support contact information added

## Updating Your App

### Deploy Updates

**With Git:**
```bash
git add .
git commit -m "Update description"
git push
```

Vercel will automatically deploy changes.

**Manual Deployment:**
```bash
vercel --prod
```

### Database Migrations

For schema changes:
1. Create new SQL file in `supabase/migrations/`
2. Run SQL in Supabase dashboard
3. Test thoroughly before production

## Scaling Considerations

### As Your Business Grows

**Supabase:**
- Free tier: Up to 500MB database, 2GB bandwidth
- Pro tier ($25/mo): 8GB database, 50GB bandwidth
- Enterprise: Custom pricing

**Vercel:**
- Hobby: Free, unlimited bandwidth
- Pro ($20/mo): Better performance, analytics
- Enterprise: Custom pricing

## Support Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Supabase Documentation](https://supabase.com/docs)
- [Vercel Documentation](https://vercel.com/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)

## Need Help?

Common issues:
1. Check browser console for errors
2. Review Vercel deployment logs
3. Check Supabase logs
4. Verify environment variables

---

**Congratulations! Your appointment scheduler is now live! 🎉**

Share your booking page: `https://your-app.vercel.app/your-slug`
