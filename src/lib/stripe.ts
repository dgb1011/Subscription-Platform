import Stripe from 'stripe'

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-06-20',
})

export const STRIPE_PRICE_IDS = {
  BASIC: process.env.STRIPE_BASIC_PRICE_ID!,
  PRO: process.env.STRIPE_PRO_PRICE_ID!,
  EXPERT: process.env.STRIPE_EXPERT_PRICE_ID!,
} as const

export const SUBSCRIPTION_PLANS = {
  BASIC: {
    name: 'Basic Plan',
    price: 19,
    features: [
      '3 personalized recipes per month',
      'PDF + BeerXML downloads',
      'Basic support',
    ],
  },
  PRO: {
    name: 'Pro Plan',
    price: 39,
    features: [
      '5 personalized recipes per month',
      'PDF + BeerXML downloads',
      'Equipment optimization tips',
      'Priority support',
    ],
  },
  EXPERT: {
    name: 'Expert Plan',
    price: 79,
    features: [
      'Unlimited recipe access',
      'Custom recipe generation',
      '1-on-1 brewing consultation',
      'Advanced analytics',
    ],
  },
} as const
