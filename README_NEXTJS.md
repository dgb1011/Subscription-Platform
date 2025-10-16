# Brewery Recipe Subscription Platform MVP

An AI-powered subscription platform that delivers personalized brewery recipes to brewers of all levels. Built with Next.js 14, Supabase, Stripe, and Gemini AI.

## 🚀 Phase 1 Complete: Foundation & Infrastructure

### ✅ What's Been Built

#### 1. **Project Setup & Infrastructure**
- ✅ Next.js 14 with TypeScript and App Router
- ✅ Tailwind CSS v4 with custom Nexis color scheme
- ✅ shadcn/ui component library
- ✅ Environment configuration for all services
- ✅ Package dependencies installed

#### 2. **Authentication System**
- ✅ Supabase Auth integration
- ✅ Auth context and hooks
- ✅ Sign up and sign in forms
- ✅ Auth pages (`/login`, `/signup`)
- ✅ Row Level Security (RLS) policies
- ✅ Admin role detection

#### 3. **Database Schema**
- ✅ Complete PostgreSQL schema with 6 tables:
  - `profiles` - User profiles extending auth.users
  - `user_preferences` - Brewery preferences and AI data
  - `recipes` - Recipe catalog with AI enhancements
  - `distributions` - Monthly distribution tracking
  - `user_recipes` - User-recipe assignments
  - `subscription_plans` - Pricing tiers
- ✅ RLS policies for data security
- ✅ Storage buckets for files (PDF, BeerXML, images)
- ✅ Seed data with sample recipes and subscription plans

#### 4. **Landing Page**
- ✅ Beautiful, modern design with Nexis color scheme
- ✅ Hero section with value proposition
- ✅ How it works (3-step process)
- ✅ Pricing tiers (Basic $19, Pro $39, Expert $79)
- ✅ Social proof testimonials
- ✅ FAQ section
- ✅ Mobile-responsive design
- ✅ Analytics integration (GA4, Meta Pixel, Vercel)

#### 5. **Core Libraries & Configuration**
- ✅ Supabase client (browser + server)
- ✅ Stripe configuration
- ✅ Gemini AI integration
- ✅ Resend email service
- ✅ Analytics tracking system

### 🎨 Design System

**Color Palette (Nexis-inspired):**
- Primary: Deep purple/violet (#6366f1)
- Accent: Cyan/blue (#06b6d4)
- Dark backgrounds with gradient overlays
- Clean white text with glass-morphism effects

### 📁 Project Structure

```
brewery-recipe-platform/
├── src/
│   ├── app/
│   │   ├── login/page.tsx          # Sign in page
│   │   ├── signup/page.tsx         # Sign up page
│   │   ├── layout.tsx              # Root layout with auth
│   │   └── page.tsx                # Landing page
│   ├── components/
│   │   ├── auth/
│   │   │   ├── auth-context.tsx    # Auth provider
│   │   │   ├── sign-in-form.tsx    # Login form
│   │   │   └── sign-up-form.tsx    # Registration form
│   │   ├── analytics.tsx           # Analytics tracking
│   │   └── ui/                     # shadcn components
│   ├── lib/
│   │   ├── supabase.ts            # Supabase client
│   │   ├── supabase-server.ts     # Server-side client
│   │   ├── stripe.ts              # Stripe configuration
│   │   ├── gemini.ts              # AI integration
│   │   └── resend.ts              # Email service
│   └── types/
│       └── database.ts            # TypeScript types
├── supabase/
│   └── migrations/                # Database migrations
└── .env.local                     # Environment variables
```

### 🔧 Environment Variables Required

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# Stripe
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
STRIPE_SECRET_KEY=your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=your_webhook_secret

# AI & Email
GEMINI_API_KEY=your_gemini_api_key
RESEND_API_KEY=your_resend_api_key

# Analytics
NEXT_PUBLIC_GA_ID=your_google_analytics_id
NEXT_PUBLIC_META_PIXEL_ID=your_meta_pixel_id

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 🚀 Getting Started

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Set up environment variables:**
   - Copy `.env.local` and fill in your API keys
   - Set up Supabase project and run migrations
   - Configure Stripe account
   - Get Gemini API key
   - Set up Resend account

3. **Run the development server:**
   ```bash
   npm run dev
   ```

4. **Access the application:**
   - Landing page: `http://localhost:3000`
   - Sign up: `http://localhost:3000/signup`
   - Login: `http://localhost:3000/login`

### 📊 Database Migrations

Run these SQL files in your Supabase project:

1. `001_initial_schema.sql` - Core tables and indexes
2. `002_rls_policies.sql` - Row Level Security policies
3. `003_storage_setup.sql` - File storage buckets
4. `004_seed_data.sql` - Sample data

### 🎯 Next Steps (Phase 2)

- [ ] Stripe integration and subscription flow
- [ ] User onboarding questionnaire
- [ ] Admin portal and recipe management
- [ ] Connect landing page to payment system

### 🛠️ Tech Stack

- **Frontend:** Next.js 14, TypeScript, Tailwind CSS, shadcn/ui
- **Backend:** Supabase (PostgreSQL, Auth, Storage)
- **AI:** Google Gemini 2.5 Flash API
- **Payments:** Stripe
- **Email:** Resend
- **Analytics:** Vercel Analytics, Google Analytics 4, Meta Pixel
- **Deployment:** Vercel

### 📈 Features Ready for Testing

- ✅ Responsive landing page
- ✅ User authentication (sign up/sign in)
- ✅ Database schema with RLS
- ✅ Analytics tracking
- ✅ Modern UI with custom design system
- ✅ Mobile-responsive design

The foundation is solid and ready for Phase 2 development!