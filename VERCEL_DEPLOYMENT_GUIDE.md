# Vercel Deployment Guide

## Directory Structure Update
The project structure has been cleaned and flattened. All Next.js files are now at the root of the repository, eliminating the need for subdirectory configuration in Vercel.

## Deployment Steps

### Deploy to Vercel

1. **Go to Vercel Dashboard**
   - Navigate to your project: https://vercel.com/dashboard
   - Select the "brewery-recipe-platform" project (or create new if needed)

2. **Update Project Settings** (if reusing existing project)
   - Go to **Settings** → **General**
   - Scroll to **Root Directory**
   - Ensure it's set to: `.` (root) or leave blank
   - Click **Save**

3. **Configure Environment Variables**
   - Go to **Settings** → **Environment Variables**
   - Add the following variables for **Production**, **Preview**, and **Development**:

   ```
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
   STRIPE_SECRET_KEY=your_stripe_secret_key
   NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
   STRIPE_WEBHOOK_SECRET=(leave empty for now - will add after deployment)
   RESEND_API_KEY=your_resend_api_key
   GEMINI_API_KEY=your_gemini_api_key
   NEXT_PUBLIC_GA_ID=(optional - Google Analytics ID)
   NEXT_PUBLIC_META_PIXEL_ID=(optional - Meta Pixel ID)
   NEXT_PUBLIC_APP_URL=https://your-vercel-domain.vercel.app
   ```

   **Note**: Get your actual API keys from:
   - Supabase: https://app.supabase.com/project/_/settings/api
   - Stripe: https://dashboard.stripe.com/test/apikeys
   - Resend: https://resend.com/api-keys
   - Gemini: https://makersuite.google.com/app/apikey

4. **Redeploy**
   - Go to **Deployments**
   - Click the three dots on the latest deployment
   - Select **Redeploy**
   - Make sure "Use existing Build Cache" is **UNCHECKED**
   - Click **Redeploy**

### Alternative: Create New Project

If you prefer to start fresh:

1. **Delete Current Project** (optional)
   - Go to **Settings** → **General**
   - Scroll to bottom: **Delete Project**
   - Type project name to confirm

2. **Import Project**
   - Go to Vercel Dashboard
   - Click **Add New** → **Project**
   - Import your Git repository
   - **Root Directory** should be left as default (root)
   - Configure environment variables as listed above
   - Deploy

## Verify Deployment

After redeployment, your application should be accessible at your Vercel URL. You should see:

✅ Landing page loads correctly
✅ Sign up page works
✅ Login page works
✅ No 404 errors

## Post-Deployment: Configure Stripe Webhook

Once deployment is successful:

1. **Get Your Vercel URL**
   - Example: `https://brewery-recipe-platform.vercel.app`

2. **Add Webhook Endpoint to Stripe**
   - Go to: https://dashboard.stripe.com/test/webhooks
   - Click **Add endpoint**
   - Endpoint URL: `https://your-vercel-url.vercel.app/api/webhooks/stripe`
   - Select events to listen to:
     - `checkout.session.completed`
     - `customer.subscription.created`
     - `customer.subscription.updated`
     - `customer.subscription.deleted`
     - `invoice.payment_succeeded`
     - `invoice.payment_failed`
     - `customer.created`
     - `customer.updated`
   - Click **Add endpoint**

3. **Copy Webhook Secret**
   - Click on your newly created webhook
   - Click **Reveal** under "Signing secret"
   - Copy the `whsec_...` value

4. **Add to Vercel Environment Variables**
   - Go back to Vercel → **Settings** → **Environment Variables**
   - Add `STRIPE_WEBHOOK_SECRET` with the value you copied
   - Redeploy for changes to take effect

## Troubleshooting

### Still Getting 404?
1. Check **Root Directory** is set to `.` (root) or left blank
2. Check **Framework Preset** is set to **Next.js**
3. Check build logs for any errors
4. Ensure all environment variables are added
5. Verify `vercel.json` is at the root of your repository

### Build Failing?
1. Check build logs in Vercel dashboard
2. Verify all dependencies are in `package.json`
3. Try running `npm run build` locally first
4. Check that Node.js version is compatible (18.x or higher)

### Environment Variables Not Working?
1. Ensure they're added to all three environments: Production, Preview, Development
2. Redeploy after adding/changing environment variables
3. Don't use quotes around values in Vercel dashboard

## Need Help?
Contact NEXIS support team for deployment assistance.

---

**Last Updated**: October 16, 2025
**Deployment URL**: Update this with your actual Vercel URL after deployment
