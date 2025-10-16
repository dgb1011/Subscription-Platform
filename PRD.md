# Product Requirements Document (PRD)
## Brewery Recipe Subscription Platform MVP

### Document Information
- **Product Name**: Brewery Recipe Subscription Platform
- **Version**: 1.0 MVP
- **Document Owner**: Development Team
- **Last Updated**: December 2024
- **Status**: Ready for Development

---

## 1. Executive Summary

### 1.1 Product Vision
An AI-powered subscription platform that delivers personalized brewery recipes to brewers of all levels. The platform combines intelligent content curation with automated distribution to create a "Netflix for Brewing" experience.

### 1.2 Business Objectives
- **Primary Goal**: Validate subscription-based recipe delivery business model
- **Target Timeline**: 18-21 days to MVP launch
- **Success Metrics**: 
  - 100+ active subscribers within 30 days
  - 80%+ user satisfaction with recipe recommendations
  - $2,000+ MRR within 60 days

### 1.3 Key Value Propositions
- **For Brewers**: Access to professionally curated, personalized recipes
- **For Business**: Recurring revenue model with scalable content delivery
- **Differentiator**: AI-powered personalization vs. generic recipe libraries

---

## 2. Market Analysis

### 2.1 Target Market
- **Primary**: Homebrewers and nano breweries (1-7 BBL capacity)
- **Secondary**: Micro breweries (8-15 BBL capacity)
- **Tertiary**: Regional breweries seeking recipe inspiration

### 2.2 Market Size
- **Homebrewers**: 1.2M+ in US alone
- **Craft Breweries**: 9,000+ in US
- **Addressable Market**: Estimated 50,000+ potential subscribers

### 2.3 Competitive Landscape
- **Direct Competitors**: None identified (blue ocean opportunity)
- **Indirect Competitors**: Recipe books, brewing forums, individual recipe sites
- **Competitive Advantage**: AI personalization + subscription convenience

---

## 3. Product Requirements

### 3.1 Core Features

#### 3.1.1 User Portal
**Priority**: P0 (Must Have)

**Features**:
- User registration and authentication
- Subscription management
- Onboarding questionnaire (brewery size, equipment, experience, preferences)
- Personalized dashboard
- Recipe library with download history
- Profile and preference management
- Secure PDF + BeerXML downloads with watermarking

**Acceptance Criteria**:
- Users can complete onboarding in <5 minutes
- Dashboard shows subscription status and next delivery date
- Recipe downloads are secure and watermarked
- Mobile-responsive design

#### 3.1.2 Admin Portal
**Priority**: P0 (Must Have)

**Features**:
- Recipe upload and management
- User subscription overview
- AI-powered recipe matching with manual override
- Monthly distribution trigger
- Analytics dashboard
- User preference management

**Acceptance Criteria**:
- Admin can upload recipes with PDF + BeerXML files
- System generates recipe recommendations for all active users
- Admin can override AI suggestions before sending
- Distribution tracking shows delivery status

#### 3.1.3 AI-Powered Matching System
**Priority**: P0 (Must Have)

**Features**:
- Gemini 2.5 Flash integration for intelligent recipe matching
- User preference analysis
- Equipment compatibility checking
- Experience level consideration
- Seasonal appropriateness
- Confidence scoring and reasoning

**Acceptance Criteria**:
- AI provides 3 recipe recommendations per user per month
- Recommendations include detailed explanations
- Confidence scores >70% for primary recommendations
- Admin can review and override suggestions

#### 3.1.4 Subscription & Payment System
**Priority**: P0 (Must Have)

**Features**:
- Stripe integration for subscription management
- Multiple pricing tiers
- Free trial period
- Automated billing
- Payment failure handling
- Customer portal integration

**Acceptance Criteria**:
- Users can subscribe via Stripe Checkout
- Webhooks update subscription status in real-time
- Payment failures trigger appropriate notifications
- Users can manage billing through Stripe portal 

### 3.2 Secondary Features

#### 3.2.1 Analytics & Tracking
**Priority**: P1 (Should Have)

**Features**:
- Vercel Analytics for performance monitoring
- Google Analytics 4 for business intelligence
- Meta Pixel for ad optimization
- Conversion tracking
- User behavior analysis

#### 3.2.2 Email Automation
**Priority**: P1 (Should Have)

**Features**:
- Welcome email sequence
- Monthly recipe delivery notifications
- Payment failure notifications
- Subscription renewal reminders
- Personalized email content using AI

#### 3.2.3 Content Management
**Priority**: P1 (Should Have)

**Features**:
- PDF watermarking with user identification
- Version control for recipe updates
- Download tracking and audit trail
- Secure file storage with signed URLs

---

## 4. Technical Requirements

### 4.1 Technology Stack

#### 4.1.1 Frontend
- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS + shadcn/ui
- **Deployment**: Vercel

#### 4.1.2 Backend
- **Database**: Supabase PostgreSQL
- **Authentication**: Supabase Auth
- **File Storage**: Supabase Storage
- **API**: Next.js API Routes + Supabase Edge Functions

#### 4.1.3 Third-Party Integrations
- **AI Engine**: Google Gemini 2.5 Flash API
- **Payments**: Stripe (Checkout, Billing, Webhooks)
- **Email**: Resend
- **Analytics**: Vercel Analytics + GA4 + Meta Pixel

### 4.2 Database Schema

```sql
-- Core Tables
profiles (id, email, full_name, subscription_status, stripe_customer_id, created_at)
user_preferences (id, user_id, brewery_size, equipment_type[], experience_level, preferred_styles[], dietary_restrictions[], additional_notes)
recipes (id, title, description, difficulty_level, beer_style, batch_size, equipment_required[], pdf_url, beerxml_url, tags[], created_at)
distributions (id, month, year, sent_at, status)
user_recipes (id, user_id, recipe_id, distribution_id, match_score, downloaded_at, sent_at)
subscription_plans (id, stripe_price_id, name, price_monthly, features)

-- AI Enhancement Fields
user_preferences.ai_personality_profile (jsonb)
user_preferences.last_ai_analysis (timestamp)
user_preferences.ai_feedback_score (integer)
recipes.ai_description (text)
recipes.ai_tags (text[])
recipes.ai_difficulty_explanation (text)
recipes.ai_equipment_notes (text)
user_recipes.ai_match_reasoning (text)
user_recipes.ai_confidence_score (integer)
user_recipes.user_feedback (text)
```

### 4.3 Security Requirements
- **Authentication**: Supabase Auth with RLS policies
- **Authorization**: Role-based access (user/admin)
- **Data Protection**: Encrypted file storage
- **Download Security**: Signed URLs with expiration
- **Content Protection**: PDF watermarking

### 4.4 Performance Requirements
- **Page Load Time**: <2 seconds
- **API Response Time**: <500ms
- **File Download**: <10 seconds for PDF files
- **Mobile Responsiveness**: 100% mobile-friendly
- **Uptime**: 99.9% availability

---

## 5. User Experience Requirements

### 5.1 User Journey

#### 5.1.1 New User Flow
1. **Landing Page**: Value proposition and pricing
2. **Sign Up**: Email/password registration
3. **Subscription**: Stripe checkout process
4. **Onboarding**: Multi-step preference questionnaire
5. **Dashboard**: Welcome and subscription confirmation
6. **First Delivery**: Monthly recipe notification

#### 5.1.2 Returning User Flow
1. **Login**: Quick authentication
2. **Dashboard**: View subscription status and recipe library
3. **Monthly Delivery**: Receive personalized recipes
4. **Download**: Access PDF + BeerXML files
5. **Feedback**: Rate recommendations (future feature)

### 5.2 Design Requirements

#### 5.2.1 Visual Design
- **Color Scheme**:
  - Primary: Deep purple/violet (#6366f1)
  - Accent: Cyan/blue (#06b6d4)
  - Dark backgrounds with gradient overlays
  - Clean white text with glass-morphism effects

#### 5.2.2 User Interface
- **Design System**: shadcn/ui modern components 
- **Layout**: Clean, modern, professional
- **Navigation**: Intuitive, role-based routing
- **Accessibility**: WCAG 2.1 AA compliance

### 5.3 Content Requirements

#### 5.3.1 Landing Page Content
- **Hero Section**: Clear value proposition
- **How It Works**: 3-step process explanation
- **Pricing**: Transparent subscription tiers
- **Social Proof**: Testimonials and success stories
- **FAQ**: Common questions and answers

#### 5.3.2 Onboarding Content
- **Welcome Message**: Personalized greeting
- **Questionnaire**: Brewery size, equipment, experience, preferences
- **Progress Indicator**: Visual progress through steps
- **Help Text**: Guidance for each question

---

## 6. Business Requirements

### 6.1 Pricing Strategy

#### 6.1.1 Subscription Tiers
- **Basic Plan**: $19/month
  - 3 personalized recipes per month
  - PDF + BeerXML downloads
  - Basic support
- **Pro Plan**: $39/month
  - 5 personalized recipes per month
  - PDF + BeerXML downloads
  - Equipment optimization tips
  - Priority support
- **Expert Plan**: $79/month
  - Unlimited recipe access
  - Custom recipe generation
  - 1-on-1 brewing consultation
  - Advanced analytics

#### 6.1.2 Free Trial
- **Duration**: 7 days
- **Features**: Access to 1 recipe
- **Conversion Goal**: 25% trial-to-paid conversion

### 6.2 Revenue Projections

#### 6.2.1 Year 1 Targets
- **Month 1**: 50 subscribers ($1,000 MRR)
- **Month 3**: 150 subscribers ($3,000 MRR)
- **Month 6**: 300 subscribers ($6,000 MRR)
- **Month 12**: 500 subscribers ($10,000 MRR)

#### 6.2.2 Key Metrics
- **Customer Acquisition Cost (CAC)**: <$50
- **Lifetime Value (LTV)**: >$200
- **Churn Rate**: <5% monthly
- **Trial-to-Paid Conversion**: >25%

---

## 7. Implementation Plan

### 7.1 Development Phases

#### Phase 1: Foundation (Days 1-3)
- Project setup and infrastructure
- Authentication system
- Database schema implementation
- Basic UI framework
- Landing page with analytics (static version)

#### Phase 2: Core Features (Days 4-10)
- Stripe integration and subscription flow
- User onboarding and preferences
- Admin portal and recipe management
- Connect landing page to payment system

#### Phase 3: AI Integration (Days 11-14)
- Gemini 2.5 Flash integration
- Recipe matching algorithm
- Personalized content delivery
- Email automation system

#### Phase 4: Advanced Features (Days 15-17)
- PDF watermarking and security
- Download tracking
- Performance optimization
- Mobile responsiveness

#### Phase 5: Launch Preparation (Days 18-21)
- Production setup
- Testing and QA
- Documentation and training
- Go-live preparation

### 7.2 Landing Page Strategy

#### 7.2.1 Phase 1 Landing Page (Static Version)
**Purpose**: Establish design foundation and start collecting user interest

**Features to Include**:
- Hero section with compelling value proposition
- How it works (3-step visual process)
- Pricing tiers display (modern static cards, no payment integration)
- Social proof section (placeholder testimonials)
- FAQ section addressing common concerns
- Email collection form (for early interest)
- Analytics tracking setup (Vercel, GA4, Meta Pixel)

**Technical Implementation**:
- Next.js 14 with Tailwind CSS + shadcn/ui
- Responsive design optimized for mobile
- SEO optimization with proper meta tags
- Performance optimization (images, fonts, etc.)
- Analytics event tracking for user interactions

#### 7.2.2 Phase 2 Integration (Dynamic Version)
**Purpose**: Connect static landing page to payment system

**Integration Points**:
- Replace static pricing cards with Stripe Checkout buttons
- Connect email collection to user registration flow
- Add authentication redirects after signup
- Implement conversion tracking for subscription events
- Add user feedback collection mechanisms

**Benefits of This Approach**:
- **Early Validation**: Test design and messaging before building complex features
- **Marketing Ready**: Can start driving traffic and collecting emails immediately
- **Reduced Risk**: Validate market interest before significant development investment
- **Parallel Development**: Landing page can be refined while backend features are built
- **User Testing**: Get feedback on UX/UI before committing to full feature set

### 7.3 Resource Requirements

#### 7.3.1 Development Team
- **Full-Stack Developer**: 1 (lead)
- **UI/UX Designer**: 0.5 FTE (part-time)
- **DevOps Engineer**: 0.25 FTE (consulting)

#### 7.3.2 Infrastructure Costs
- **Vercel Pro**: $20/month
- **Supabase Pro**: $25/month
- **Stripe**: 2.9% + $0.30 per transaction
- **Resend**: $20/month
- **Gemini API**: Free tier (1M tokens/day)

---

## 8. Success Criteria

### 8.1 MVP Success Metrics
- **Technical**: 99.9% uptime, <2s page load time
- **Business**: 100+ subscribers, $2,000+ MRR within 60 days
- **User Experience**: 80%+ satisfaction rating
- **Operational**: <24h support response time

### 8.2 Post-MVP Roadmap
- **Phase 2**: Community features and recipe sharing
- **Phase 3**: Mobile app development
- **Phase 4**: Advanced AI features and custom recipe generation
- **Phase 5**: International expansion and multi-language support

---

## 9. Risk Assessment

### 9.1 Technical Risks
- **AI API Limitations**: Mitigation through fallback algorithms
- **Scalability Issues**: Supabase auto-scaling capabilities
- **Security Vulnerabilities**: Regular security audits and updates

### 9.2 Business Risks
- **Market Validation**: MVP approach minimizes investment risk
- **Competition**: First-mover advantage in niche market
- **Content Quality**: Professional recipe curation standards

### 9.3 Operational Risks
- **Payment Processing**: Stripe's proven reliability
- **Email Deliverability**: Resend's high deliverability rates
- **Customer Support**: Automated systems with human backup

---

## 10. Appendices

### 10.1 Technical Specifications
- Detailed API documentation
- Database relationship diagrams
- Security implementation guide
- Performance benchmarks

### 10.2 Business Documentation
- Market research data
- Competitive analysis
- Financial projections
- Legal requirements

### 10.3 User Documentation
- User onboarding guide
- Admin operations manual
- Troubleshooting guide
- FAQ database

---

**Document Approval**:
- [ ] Product Manager
- [ ] Technical Lead
- [ ] Business Stakeholder
- [ ] Legal Review

**Next Steps**:
1. Stakeholder review and approval
2. Development team kickoff
3. Technical architecture review
4. Project timeline confirmation
5. Resource allocation
