import { Resend } from 'resend'

export const resend = new Resend(process.env.RESEND_API_KEY!)

export const EMAIL_TEMPLATES = {
  WELCOME: 'welcome',
  MONTHLY_DELIVERY: 'monthly-delivery',
  PAYMENT_FAILED: 'payment-failed',
  SUBSCRIPTION_RENEWAL: 'subscription-renewal',
} as const

export interface EmailData {
  to: string
  subject: string
  template: string
  data: Record<string, any>
}

export async function sendEmail({ to, subject, template, data }: EmailData) {
  try {
    const { data: result, error } = await resend.emails.send({
      from: 'Brewery Recipe Platform <noreply@breweryrecipes.com>',
      to: [to],
      subject,
      html: generateEmailHTML(template, data),
    })

    if (error) {
      console.error('Error sending email:', error)
      throw error
    }

    return result
  } catch (error) {
    console.error('Failed to send email:', error)
    throw error
  }
}

function generateEmailHTML(template: string, data: Record<string, any>): string {
  switch (template) {
    case EMAIL_TEMPLATES.WELCOME:
      return `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1>Welcome to Brewery Recipe Platform!</h1>
          <p>Hi ${data.name},</p>
          <p>Welcome to the most personalized brewing experience! We're excited to help you discover amazing recipes tailored to your equipment and preferences.</p>
          <p>Your subscription is now active and you'll receive your first personalized recipe recommendations soon.</p>
          <p>Happy brewing!</p>
          <p>The Brewery Recipe Team</p>
        </div>
      `
    
    case EMAIL_TEMPLATES.MONTHLY_DELIVERY:
      return `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1>Your Monthly Recipe Delivery is Here!</h1>
          <p>Hi ${data.name},</p>
          <p>We've curated ${data.recipeCount} personalized recipes just for you based on your preferences and equipment.</p>
          <div style="margin: 20px 0;">
            ${data.recipes.map((recipe: any) => `
              <div style="border: 1px solid #ddd; padding: 15px; margin: 10px 0; border-radius: 5px;">
                <h3>${recipe.title}</h3>
                <p><strong>Style:</strong> ${recipe.beer_style}</p>
                <p><strong>Difficulty:</strong> ${recipe.difficulty_level}</p>
                <p><strong>Why we chose this:</strong> ${recipe.match_reasoning}</p>
                <a href="${recipe.download_url}" style="background: #6366f1; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Download Recipe</a>
              </div>
            `).join('')}
          </div>
          <p>Happy brewing!</p>
          <p>The Brewery Recipe Team</p>
        </div>
      `
    
    case EMAIL_TEMPLATES.PAYMENT_FAILED:
      return `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1>Payment Update Required</h1>
          <p>Hi ${data.name},</p>
          <p>We encountered an issue processing your payment for your Brewery Recipe subscription.</p>
          <p>Please update your payment method to continue receiving your personalized recipes.</p>
          <a href="${data.update_url}" style="background: #6366f1; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Update Payment Method</a>
          <p>If you have any questions, please contact our support team.</p>
          <p>The Brewery Recipe Team</p>
        </div>
      `
    
    default:
      return '<p>Email template not found</p>'
  }
}
