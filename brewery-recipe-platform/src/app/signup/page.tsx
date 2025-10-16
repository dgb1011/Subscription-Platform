import { SignUpForm } from '@/components/auth/sign-up-form'

export default function SignUpPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-lg">🍺</span>
            </div>
            <span className="text-xl font-bold">Brewery Recipes</span>
          </div>
          <h1 className="text-2xl font-bold mb-2">Join the Community</h1>
          <p className="text-muted-foreground">
            Start your personalized brewing journey today
          </p>
        </div>
        <SignUpForm />
      </div>
    </div>
  )
}
