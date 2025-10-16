'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/components/auth/auth-context'
import { supabase } from '@/lib/supabase'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

interface UserProfile {
  id: string
  email: string
  full_name: string | null
  subscription_status: 'active' | 'inactive' | 'cancelled' | 'trial'
  created_at: string
}

interface UserPreferences {
  brewery_size: string
  experience_level: string
  equipment_type: string[]
  preferred_styles: string[]
}

export default function DashboardPage() {
  const [loading, setLoading] = useState(true)
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [preferences, setPreferences] = useState<UserPreferences | null>(null)

  const { user, signOut } = useAuth()
  const router = useRouter()

  useEffect(() => {
    const loadUserData = async () => {
      if (!user) {
        router.push('/login')
        return
      }

      try {
        // Load profile
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('email', user.email)
          .single()

        if (profileError) throw profileError
        setProfile(profileData)

        // Load preferences
        const { data: preferencesData, error: preferencesError } = await supabase
          .from('user_preferences')
          .select('*')
          .eq('user_id', profileData.id)
          .single()

        if (preferencesError && preferencesError.code !== 'PGRST116') {
          // PGRST116 = no rows returned, which is okay
          throw preferencesError
        }

        if (!preferencesData) {
          // User hasn't completed onboarding yet
          router.push('/onboarding')
          return
        }

        setPreferences(preferencesData)
      } catch (error) {
        console.error('Error loading user data:', error)
      } finally {
        setLoading(false)
      }
    }

    loadUserData()
  }, [user, router])

  const handleSignOut = async () => {
    await signOut()
    router.push('/')
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-500'
      case 'trial':
        return 'bg-blue-500'
      case 'inactive':
        return 'bg-yellow-500'
      case 'cancelled':
        return 'bg-red-500'
      default:
        return 'bg-gray-500'
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading your dashboard...</p>
        </div>
      </div>
    )
  }

  if (!profile) {
    return null
  }

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold">Welcome back, {profile.full_name || 'Brewer'}!</h1>
            <p className="text-muted-foreground mt-1">Your personalized brewing dashboard</p>
          </div>
          <Button variant="outline" onClick={handleSignOut}>
            Sign Out
          </Button>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {/* Subscription Status Card */}
          <Card>
            <CardHeader>
              <CardTitle>Subscription Status</CardTitle>
              <CardDescription>Your current plan and status</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-2">
                <div className={`h-3 w-3 rounded-full ${getStatusColor(profile.subscription_status)}`} />
                <Badge variant="secondary" className="text-lg capitalize">
                  {profile.subscription_status}
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground mt-4">
                {profile.subscription_status === 'trial' && 'Enjoy your free trial!'}
                {profile.subscription_status === 'active' && 'Your subscription is active'}
                {profile.subscription_status === 'inactive' && 'Please update your payment method'}
                {profile.subscription_status === 'cancelled' && 'Your subscription has been cancelled'}
              </p>
              <Button className="w-full mt-4" variant="outline">
                Manage Billing
              </Button>
            </CardContent>
          </Card>

          {/* Your Profile Card */}
          {preferences && (
            <Card>
              <CardHeader>
                <CardTitle>Your Profile</CardTitle>
                <CardDescription>Brewing preferences</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm font-medium">Brewery Size</p>
                  <p className="text-sm text-muted-foreground capitalize">{preferences.brewery_size}</p>
                </div>
                <div>
                  <p className="text-sm font-medium">Experience Level</p>
                  <p className="text-sm text-muted-foreground capitalize">{preferences.experience_level}</p>
                </div>
                <div>
                  <p className="text-sm font-medium">Equipment</p>
                  <p className="text-sm text-muted-foreground">{preferences.equipment_type.length} items</p>
                </div>
                <div>
                  <p className="text-sm font-medium">Favorite Styles</p>
                  <p className="text-sm text-muted-foreground">{preferences.preferred_styles.length} styles</p>
                </div>
                <Button className="w-full" variant="outline">
                  Update Preferences
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Recipe Library Card */}
          <Card>
            <CardHeader>
              <CardTitle>Recipe Library</CardTitle>
              <CardDescription>Your personalized recipes</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <p className="text-muted-foreground mb-4">
                  No recipes yet. Your first batch will be delivered soon!
                </p>
                <p className="text-sm text-muted-foreground">
                  Recipes are sent monthly based on your preferences
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Common tasks and settings</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Button variant="outline" className="w-full">
                View All Recipes
              </Button>
              <Button variant="outline" className="w-full">
                Download History
              </Button>
              <Button variant="outline" className="w-full">
                Account Settings
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Coming Soon Notice */}
        <div className="mt-8 p-6 bg-muted rounded-lg">
          <h3 className="font-semibold mb-2">Coming Soon</h3>
          <p className="text-sm text-muted-foreground">
            We're working on exciting features including AI-powered recipe recommendations,
            brewing analytics, community features, and more. Stay tuned!
          </p>
        </div>
      </div>
    </div>
  )
}
