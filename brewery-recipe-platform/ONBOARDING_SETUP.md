# User Onboarding & Dashboard Setup Guide

## Phase 2 - Priority 2: COMPLETE

The user onboarding flow and basic dashboard have been successfully created!

---

## What Was Built

### **Files Created:**

1. **`src/app/onboarding/page.tsx`** - Multi-step onboarding questionnaire
2. **`src/app/dashboard/page.tsx`** - User dashboard with subscription status
3. **`src/components/ui/checkbox.tsx`** - Checkbox component for multi-select

### **Dependencies Installed:**
- `@radix-ui/react-checkbox` - For checkbox UI component

---

## Features Implemented

### **Multi-Step Onboarding Form**

#### **Step 1: Brewery Information**
- Brewery size selection (Homebrewer, Nano, Micro, Regional)
- Experience level selection (Beginner, Intermediate, Advanced, Expert)

#### **Step 2: Equipment**
- Multi-select checkboxes for 10 equipment types:
  - Brew Kettle
  - Fermenter
  - Kegerator
  - Bottles & Bottling Equipment
  - Temperature Control
  - Grain Mill
  - Mash Tun
  - Pump
  - Wort Chiller
  - Conical Fermenter

#### **Step 3: Beer Styles**
- Multi-select checkboxes for 12 beer styles:
  - IPA (India Pale Ale)
  - Pale Ale
  - Stout
  - Porter
  - Lager
  - Pilsner
  - Wheat Beer
  - Sour Ale
  - Saison
  - Belgian Ale
  - Amber Ale
  - Brown Ale

#### **Step 4: Final Touches**
- Dietary restrictions (optional):
  - Gluten-Free
  - Vegan
  - Low Alcohol
  - Non-Alcoholic
- Additional notes text area (optional)

### **Form Features:**
- Progress indicator showing current step (1-4)
- Form validation using Zod schema
- Clean, modern UI with shadcn/ui components
- Mobile-responsive design
- Previous/Next navigation buttons
- Save directly to Supabase `user_preferences` table
- Automatic redirect to dashboard after completion

### **Dashboard Features:**
- Welcome message with user's name
- Subscription status card with visual indicator
- User profile summary (brewery size, experience, equipment count, styles count)
- Recipe library placeholder (empty state)
- Quick actions section
- Sign out functionality
- Automatic redirect to onboarding if preferences don't exist

---

## User Flow

### **New User Journey:**

```
1. Landing Page → Click "Sign Up"
2. Sign Up Form → Enter details → Submit
3. Email Confirmation → Check email → Click confirmation link
4. Auto Login → Redirect to /dashboard
5. Dashboard → Check preferences → Redirect to /onboarding
6. Onboarding → Complete 4 steps → Submit
7. Dashboard → View subscription & profile
```

### **Returning User Journey:**

```
1. Landing Page → Click "Sign In"
2. Sign In Form → Enter credentials → Submit
3. Dashboard → View subscription, profile, recipes
```

---

## Database Integration

### **Table: `user_preferences`**

The onboarding form saves to the `user_preferences` table with the following structure:

```typescript
{
  user_id: UUID (references profiles.id)
  brewery_size: 'homebrewer' | 'nano' | 'micro' | 'regional'
  experience_level: 'beginner' | 'intermediate' | 'advanced' | 'expert'
  equipment_type: string[]
  preferred_styles: string[]
  dietary_restrictions: string[]
  additional_notes: string | null
  created_at: timestamp
  updated_at: timestamp
}
```

### **Authentication Flow:**

- Uses Supabase Auth for user management
- Profile automatically created via database trigger on signup
- Preferences checked on dashboard load
- Missing preferences trigger redirect to onboarding

---

## Route Protection

### **Protected Routes:**
- `/onboarding` - Requires authentication
- `/dashboard` - Requires authentication & completed preferences

### **Redirect Logic:**

| Route | Condition | Action |
|-------|-----------|--------|
| `/onboarding` | Not logged in | Redirect to `/login` |
| `/onboarding` | Preferences exist | Redirect to `/dashboard` |
| `/dashboard` | Not logged in | Redirect to `/login` |
| `/dashboard` | No preferences | Redirect to `/onboarding` |

---

## Testing the Onboarding Flow

### **Local Testing Steps:**

1. **Start the dev server** (if not already running):
   ```bash
   npm run dev
   ```

2. **Create a new account:**
   - Navigate to http://localhost:3000/signup
   - Enter full name, email, password
   - Click "Create Account"

3. **Confirm email:**
   - Check your email inbox
   - Click the confirmation link from Supabase
   - You'll be automatically logged in

4. **Complete onboarding:**
   - You should be redirected to `/onboarding`
   - Step 1: Select brewery size and experience level
   - Step 2: Check equipment you own
   - Step 3: Select your favorite beer styles
   - Step 4: Optionally add dietary restrictions and notes
   - Click "Complete Setup"

5. **Verify dashboard:**
   - You should be redirected to `/dashboard`
   - Verify your subscription status shows "trial"
   - Verify your profile information is displayed correctly
   - Check that recipe library shows empty state

6. **Test returning user:**
   - Sign out from dashboard
   - Sign in again with same credentials
   - Should go directly to dashboard (skip onboarding)

---

## Validation Rules

### **Required Fields:**
- Brewery size (Step 1)
- Experience level (Step 1)
- At least 1 equipment type (Step 2)
- At least 1 beer style (Step 3)

### **Optional Fields:**
- Dietary restrictions (Step 4)
- Additional notes (Step 4)

### **Validation Messages:**
- "Please select your brewery size"
- "Please select your experience level"
- "Please select at least one equipment type"
- "Please select at least one beer style"

---

## UI/UX Features

### **Design Elements:**
- Clean, modern card-based layout
- Progress bar with step counter
- Checkbox selections with hover states
- Mobile-responsive grid layouts (1 column on mobile, 2 on desktop)
- Loading states with spinners
- Success/error message notifications
- Smooth transitions between steps

### **Accessibility:**
- Form labels for all inputs
- ARIA-compliant checkbox components
- Keyboard navigation support
- Error messages linked to form fields
- High contrast text and backgrounds

---

## Common Issues & Solutions

### **Issue: "You must be logged in to save preferences"**

**Cause:** User session expired or not authenticated

**Solution:**
1. Check if user is logged in: `supabase auth session`
2. Verify `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` in `.env.local`
3. Clear browser cookies and log in again

---

### **Issue: Redirect loop between dashboard and onboarding**

**Cause:** Preferences not being saved correctly

**Solution:**
1. Check Supabase Dashboard → Table Editor → `user_preferences`
2. Verify `user_id` matches the logged-in user's ID
3. Check browser console for any database errors
4. Ensure database RLS (Row Level Security) policies allow inserts

---

### **Issue: Checkbox selections not saving**

**Cause:** Form validation or state management issue

**Solution:**
1. Check browser console for validation errors
2. Verify at least 1 equipment and 1 beer style is selected
3. Ensure JavaScript is enabled
4. Try clearing browser cache

---

### **Issue: Dashboard shows empty profile**

**Cause:** Preferences not loaded from database

**Solution:**
1. Open browser dev tools → Network tab
2. Check for failed Supabase queries
3. Verify RLS policies allow SELECT on `user_preferences`
4. Check that `user_id` in preferences matches profile

---

## Database Queries

### **Check if user has completed onboarding:**

```sql
SELECT * FROM user_preferences
WHERE user_id = 'user-uuid-here';
```

### **View all user preferences:**

```sql
SELECT
  p.email,
  p.full_name,
  p.subscription_status,
  up.brewery_size,
  up.experience_level,
  up.equipment_type,
  up.preferred_styles,
  up.dietary_restrictions,
  up.additional_notes
FROM profiles p
LEFT JOIN user_preferences up ON up.user_id = p.id
WHERE p.email = 'user@example.com';
```

### **Delete preferences to re-test onboarding:**

```sql
DELETE FROM user_preferences
WHERE user_id = 'user-uuid-here';
```

---

## Next Steps (Phase 2 - Priority 3)

Now that onboarding is complete, the next priorities are:

### **Phase 2 - Priority 3: Enhanced User Dashboard**
1. Add "Update Preferences" functionality
2. Integrate Stripe Customer Portal for billing management
3. Display actual recipe library (once recipes are added)
4. Add download history tracking
5. Implement account settings page

### **Phase 2 - Priority 4: Stripe Checkout Integration**
1. Create `/api/checkout` route for payment processing
2. Update landing page "Subscribe" buttons
3. Connect successful payment to onboarding flow
4. Handle payment success/cancel redirects

### **Phase 2 - Priority 5: Admin Portal**
1. Create `/app/admin` route
2. Build admin dashboard with user metrics
3. Add recipe upload functionality
4. Implement user management interface

---

## File Structure

```
brewery-recipe-platform/
├── src/
│   ├── app/
│   │   ├── onboarding/
│   │   │   └── page.tsx           # Multi-step onboarding form
│   │   ├── dashboard/
│   │   │   └── page.tsx           # User dashboard
│   │   ├── signup/
│   │   │   └── page.tsx           # Signup page (wrapper)
│   │   └── login/
│   │       └── page.tsx           # Login page (wrapper)
│   ├── components/
│   │   ├── auth/
│   │   │   ├── auth-context.tsx   # Auth provider
│   │   │   ├── sign-up-form.tsx   # Signup form component
│   │   │   └── sign-in-form.tsx   # Login form component
│   │   └── ui/
│   │       ├── checkbox.tsx       # NEW: Checkbox component
│   │       ├── card.tsx
│   │       ├── button.tsx
│   │       ├── input.tsx
│   │       ├── label.tsx
│   │       ├── select.tsx
│   │       └── textarea.tsx
│   ├── lib/
│   │   └── supabase.ts            # Supabase client
│   └── types/
│       └── database.ts            # Database types
└── ONBOARDING_SETUP.md            # This file
```

---

## Environment Variables Required

```bash
# Supabase (REQUIRED)
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJxxxxx
SUPABASE_SERVICE_ROLE_KEY=eyJxxxxx

# App URL
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

---

## Success Criteria

- [x] Multi-step onboarding form with 4 steps
- [x] Form validation with Zod
- [x] Save preferences to Supabase
- [x] Redirect to dashboard after completion
- [x] Dashboard displays subscription status
- [x] Dashboard displays user profile summary
- [x] Route protection for authenticated users
- [x] Automatic redirect if preferences missing
- [x] Mobile-responsive design
- [x] Clean, modern UI with shadcn/ui

---

## Congratulations!

You've successfully implemented Phase 2 - Priority 2: User Onboarding & Dashboard!

**What this enables:**
- User preference collection for personalized recipe matching
- Subscription status tracking
- Foundation for AI-powered recipe recommendations
- Professional onboarding experience
- Clean user dashboard interface

**Ready for:**
- Building enhanced dashboard features
- Integrating Stripe checkout
- Creating admin portal
- Implementing AI recipe matching (Phase 3)

Let's continue with Phase 2!
