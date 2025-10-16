import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, Star, Users, Zap } from "lucide-react"

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      {/* Navigation */}
      <nav className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-lg">🍺</span>
            </div>
            <span className="text-xl font-bold">Brewery Recipes</span>
          </div>
          <div className="flex items-center space-x-4">
            <Button variant="ghost" asChild>
              <a href="/login">Login</a>
            </Button>
            <Button asChild>
              <a href="/signup">Start Free Trial</a>
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto text-center">
          <Badge variant="secondary" className="mb-4">
            🚀 AI-Powered Recipe Curation
          </Badge>
          <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Personalized Brewing Recipes
            <br />
            <span className="text-4xl md:text-5xl">Delivered Monthly</span>
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
            Get professionally curated, AI-matched brewery recipes tailored to your equipment, 
            experience level, and preferences. The Netflix of brewing is here.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="text-lg px-8 py-6" asChild>
              <a href="/signup">Start Free Trial</a>
            </Button>
            <Button size="lg" variant="outline" className="text-lg px-8 py-6">
              Watch Demo
            </Button>
          </div>
          <p className="text-sm text-muted-foreground mt-4">
            7-day free trial • No credit card required • Cancel anytime
          </p>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 px-4 bg-muted/30">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">How It Works</h2>
            <p className="text-xl text-muted-foreground">
              Three simple steps to personalized brewing excellence
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="text-center">
              <CardHeader>
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="w-8 h-8 text-primary" />
                </div>
                <CardTitle>1. Tell Us About Your Brewery</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Complete our quick questionnaire about your equipment, experience level, 
                  and beer style preferences.
                </p>
              </CardContent>
            </Card>
            <Card className="text-center">
              <CardHeader>
                <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Zap className="w-8 h-8 text-accent" />
                </div>
                <CardTitle>2. AI Matches Perfect Recipes</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Our Gemini AI analyzes your profile and selects 3-5 recipes that match 
                  your equipment and skill level perfectly.
                </p>
              </CardContent>
            </Card>
            <Card className="text-center">
              <CardHeader>
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="w-8 h-8 text-primary" />
                </div>
                <CardTitle>3. Receive & Brew</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Get monthly recipe deliveries with PDF guides, BeerXML files, 
                  and personalized brewing tips.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Choose Your Plan</h2>
            <p className="text-xl text-muted-foreground">
              Start with a free trial, upgrade when you're ready
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <Card>
              <CardHeader>
                <CardTitle>Basic Plan</CardTitle>
                <CardDescription>Perfect for homebrewers</CardDescription>
                <div className="text-3xl font-bold">$19<span className="text-lg text-muted-foreground">/month</span></div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  <li className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-primary mr-2" />
                    3 personalized recipes per month
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-primary mr-2" />
                    PDF + BeerXML downloads
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-primary mr-2" />
                    Basic support
                  </li>
                </ul>
                <Button className="w-full mt-6" variant="outline" asChild>
                  <a href="/signup">Start Free Trial</a>
                </Button>
              </CardContent>
            </Card>
            <Card className="border-primary relative">
              <Badge className="absolute -top-2 left-1/2 transform -translate-x-1/2 bg-primary">
                Most Popular
              </Badge>
              <CardHeader>
                <CardTitle>Pro Plan</CardTitle>
                <CardDescription>For serious brewers</CardDescription>
                <div className="text-3xl font-bold">$39<span className="text-lg text-muted-foreground">/month</span></div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  <li className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-primary mr-2" />
                    5 personalized recipes per month
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-primary mr-2" />
                    PDF + BeerXML downloads
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-primary mr-2" />
                    Equipment optimization tips
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-primary mr-2" />
                    Priority support
                  </li>
                </ul>
                <Button className="w-full mt-6" asChild>
                  <a href="/signup">Start Free Trial</a>
                </Button>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Expert Plan</CardTitle>
                <CardDescription>For professional brewers</CardDescription>
                <div className="text-3xl font-bold">$79<span className="text-lg text-muted-foreground">/month</span></div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  <li className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-primary mr-2" />
                    Unlimited recipe access
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-primary mr-2" />
                    Custom recipe generation
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-primary mr-2" />
                    1-on-1 brewing consultation
          </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-primary mr-2" />
                    Advanced analytics
          </li>
                </ul>
                <Button className="w-full mt-6" variant="outline" asChild>
                  <a href="/signup">Start Free Trial</a>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Social Proof */}
      <section className="py-20 px-4 bg-muted/30">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Trusted by Brewers Worldwide</h2>
            <p className="text-xl text-muted-foreground">
              Join thousands of brewers who've improved their craft
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-muted-foreground mb-4">
                  "The AI recommendations are spot-on. Every recipe has been perfectly matched 
                  to my equipment and skill level. My brewing has improved dramatically!"
                </p>
                <div className="font-semibold">Sarah M.</div>
                <div className="text-sm text-muted-foreground">Homebrewer, 3 years</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-muted-foreground mb-4">
                  "As a nano brewery owner, this platform has been invaluable. The recipes 
                  scale perfectly and the BeerXML integration saves hours of work."
                </p>
                <div className="font-semibold">Mike R.</div>
                <div className="text-sm text-muted-foreground">Nano Brewery Owner</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-muted-foreground mb-4">
                  "The personalized approach is game-changing. No more generic recipes - 
                  everything is tailored to what I actually want to brew."
                </p>
                <div className="font-semibold">Alex T.</div>
                <div className="text-sm text-muted-foreground">Micro Brewery Brewer</div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-3xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Frequently Asked Questions</h2>
          </div>
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>How does the AI recipe matching work?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Our Gemini AI analyzes your brewery size, equipment, experience level, 
                  and beer style preferences to match you with recipes that are perfect 
                  for your setup and skill level.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>What file formats do you provide?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Each recipe comes with a detailed PDF guide and BeerXML file for 
                  easy import into brewing software like BeerSmith or Brewfather.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Can I cancel anytime?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Yes! You can cancel your subscription at any time. You'll continue 
                  to have access to your recipes until the end of your billing period.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Do you offer refunds?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  We offer a 7-day free trial so you can test the service risk-free. 
                  If you're not satisfied, you can cancel before the trial ends.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4 bg-primary text-primary-foreground">
        <div className="container mx-auto text-center">
          <h2 className="text-4xl font-bold mb-4">Ready to Transform Your Brewing?</h2>
          <p className="text-xl mb-8 opacity-90">
            Join thousands of brewers who've discovered their perfect recipes
          </p>
          <Button size="lg" variant="secondary" className="text-lg px-8 py-6" asChild>
            <a href="/signup">Start Your Free Trial Today</a>
          </Button>
          <p className="text-sm mt-4 opacity-75">
            No credit card required • 7-day free trial • Cancel anytime
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-background">
        <div className="container mx-auto px-4 py-12">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                  <span className="text-primary-foreground font-bold text-lg">🍺</span>
                </div>
                <span className="text-xl font-bold">Brewery Recipes</span>
              </div>
              <p className="text-muted-foreground">
                AI-powered personalized brewing recipes for brewers of all levels.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Product</h3>
              <ul className="space-y-2 text-muted-foreground">
                <li><a href="#" className="hover:text-foreground">Features</a></li>
                <li><a href="#" className="hover:text-foreground">Pricing</a></li>
                <li><a href="#" className="hover:text-foreground">FAQ</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Support</h3>
              <ul className="space-y-2 text-muted-foreground">
                <li><a href="#" className="hover:text-foreground">Help Center</a></li>
                <li><a href="#" className="hover:text-foreground">Contact Us</a></li>
                <li><a href="#" className="hover:text-foreground">Community</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Legal</h3>
              <ul className="space-y-2 text-muted-foreground">
                <li><a href="#" className="hover:text-foreground">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-foreground">Terms of Service</a></li>
                <li><a href="#" className="hover:text-foreground">Cookie Policy</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t mt-12 pt-8 text-center text-muted-foreground">
            <p>&copy; 2024 Brewery Recipe Platform. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}