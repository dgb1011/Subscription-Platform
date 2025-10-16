'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { useAuth } from '@/components/auth/auth-context'
import { supabase } from '@/lib/supabase'
import { AlertCircle, CheckCircle, ChevronRight, ChevronLeft } from 'lucide-react'

// Form validation schema
const onboardingSchema = z.object({
  brewery_size: z.enum(['homebrewer', 'nano', 'micro', 'regional'], {
    required_error: 'Please select your brewery size',
  }),
  experience_level: z.enum(['beginner', 'intermediate', 'advanced', 'expert'], {
    required_error: 'Please select your experience level',
  }),
  equipment_type: z.array(z.string()).min(1, 'Please select at least one equipment type'),
  preferred_styles: z.array(z.string()).min(1, 'Please select at least one beer style'),
  dietary_restrictions: z.array(z.string()),
  additional_notes: z.string().optional(),
})

type OnboardingFormData = z.infer<typeof onboardingSchema>

// Equipment options
const EQUIPMENT_OPTIONS = [
  { id: 'kettle', label: 'Brew Kettle' },
  { id: 'fermenter', label: 'Fermenter' },
  { id: 'kegerator', label: 'Kegerator' },
  { id: 'bottles', label: 'Bottles & Bottling Equipment' },
  { id: 'temperature_control', label: 'Temperature Control' },
  { id: 'grain_mill', label: 'Grain Mill' },
  { id: 'mash_tun', label: 'Mash Tun' },
  { id: 'pump', label: 'Pump' },
  { id: 'chiller', label: 'Wort Chiller' },
  { id: 'conical', label: 'Conical Fermenter' },
]

// Beer style options
const BEER_STYLE_OPTIONS = [
  { id: 'ipa', label: 'IPA (India Pale Ale)' },
  { id: 'pale_ale', label: 'Pale Ale' },
  { id: 'stout', label: 'Stout' },
  { id: 'porter', label: 'Porter' },
  { id: 'lager', label: 'Lager' },
  { id: 'pilsner', label: 'Pilsner' },
  { id: 'wheat', label: 'Wheat Beer' },
  { id: 'sour', label: 'Sour Ale' },
  { id: 'saison', label: 'Saison' },
  { id: 'belgian', label: 'Belgian Ale' },
  { id: 'amber', label: 'Amber Ale' },
  { id: 'brown_ale', label: 'Brown Ale' },
]

// Dietary restriction options
const DIETARY_OPTIONS = [
  { id: 'gluten_free', label: 'Gluten-Free' },
  { id: 'vegan', label: 'Vegan' },
  { id: 'low_alcohol', label: 'Low Alcohol' },
  { id: 'non_alcoholic', label: 'Non-Alcoholic' },
]

export default function OnboardingPage() {
  const [currentStep, setCurrentStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [checking, setChecking] = useState(true)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  const { user } = useAuth()
  const router = useRouter()

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<OnboardingFormData>({
    resolver: zodResolver(onboardingSchema),
    defaultValues: {
      equipment_type: [],
      preferred_styles: [],
      dietary_restrictions: [],
      additional_notes: '',
    },
  })

  const equipmentType = watch('equipment_type')
  const preferredStyles = watch('preferred_styles')
  const dietaryRestrictions = watch('dietary_restrictions')

  // Check if user is authenticated and if preferences already exist
  useEffect(() => {
    const checkAuth = async () => {
      if (!user) {
        router.push('/login')
        return
      }

      // Check if user already has preferences
      const { data, error } = await supabase
        .from('user_preferences')
        .select('*')
        .eq('user_id', user.id)
        .single()

      if (data && !error) {
        // User already has preferences, redirect to dashboard
        router.push('/dashboard')
      } else {
        setChecking(false)
      }
    }

    checkAuth()
  }, [user, router])

  const totalSteps = 4

  const nextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1)
    }
  }

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const toggleArrayValue = (array: string[], value: string, field: keyof OnboardingFormData) => {
    const newArray = array.includes(value)
      ? array.filter((item) => item !== value)
      : [...array, value]
    setValue(field, newArray)
  }

  const onSubmit = async (data: OnboardingFormData) => {
    if (!user) {
      setMessage({ type: 'error', text: 'You must be logged in to save preferences' })
      return
    }

    setLoading(true)
    setMessage(null)

    try {
      const { error } = await supabase
        .from('user_preferences')
        .insert({
          user_id: user.id,
          brewery_size: data.brewery_size,
          equipment_type: data.equipment_type,
          experience_level: data.experience_level,
          preferred_styles: data.preferred_styles,
          dietary_restrictions: data.dietary_restrictions,
          additional_notes: data.additional_notes || null,
        })

      if (error) throw error

      setMessage({ type: 'success', text: 'Preferences saved successfully!' })

      // Redirect to dashboard after a short delay
      setTimeout(() => {
        router.push('/dashboard')
      }, 1500)
    } catch (error: any) {
      console.error('Error saving preferences:', error)
      setMessage({
        type: 'error',
        text: error.message || 'Failed to save preferences. Please try again.'
      })
    } finally {
      setLoading(false)
    }
  }

  if (checking) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        {/* Progress indicator */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-2xl font-bold">Welcome! Let's personalize your experience</h2>
            <span className="text-sm text-muted-foreground">
              Step {currentStep} of {totalSteps}
            </span>
          </div>
          <div className="w-full bg-secondary rounded-full h-2">
            <div
              className="bg-primary h-2 rounded-full transition-all duration-300"
              style={{ width: `${(currentStep / totalSteps) * 100}%` }}
            />
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)}>
          <Card>
            <CardHeader>
              <CardTitle>
                {currentStep === 1 && 'Tell us about your brewery'}
                {currentStep === 2 && 'What equipment do you have?'}
                {currentStep === 3 && 'What beer styles do you enjoy?'}
                {currentStep === 4 && 'Final touches'}
              </CardTitle>
              <CardDescription>
                {currentStep === 1 && 'Help us understand your brewing setup and experience'}
                {currentStep === 2 && 'Select all the equipment you currently own'}
                {currentStep === 3 && 'Choose your favorite styles to brew'}
                {currentStep === 4 && 'Any dietary restrictions or additional preferences?'}
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-6">
              {/* Step 1: Brewery Size & Experience Level */}
              {currentStep === 1 && (
                <div className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="brewery_size">Brewery Size</Label>
                    <Select
                      onValueChange={(value) => setValue('brewery_size', value as any)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select your brewery size" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="homebrewer">Homebrewer (1-10 gallons)</SelectItem>
                        <SelectItem value="nano">Nano Brewery (1-7 BBL)</SelectItem>
                        <SelectItem value="micro">Micro Brewery (8-15 BBL)</SelectItem>
                        <SelectItem value="regional">Regional Brewery (15+ BBL)</SelectItem>
                      </SelectContent>
                    </Select>
                    {errors.brewery_size && (
                      <p className="text-sm text-destructive">{errors.brewery_size.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="experience_level">Experience Level</Label>
                    <Select
                      onValueChange={(value) => setValue('experience_level', value as any)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select your experience level" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="beginner">Beginner (0-10 batches)</SelectItem>
                        <SelectItem value="intermediate">Intermediate (10-50 batches)</SelectItem>
                        <SelectItem value="advanced">Advanced (50-100 batches)</SelectItem>
                        <SelectItem value="expert">Expert (100+ batches)</SelectItem>
                      </SelectContent>
                    </Select>
                    {errors.experience_level && (
                      <p className="text-sm text-destructive">{errors.experience_level.message}</p>
                    )}
                  </div>
                </div>
              )}

              {/* Step 2: Equipment */}
              {currentStep === 2 && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {EQUIPMENT_OPTIONS.map((equipment) => (
                      <div key={equipment.id} className="flex items-center space-x-2">
                        <Checkbox
                          id={equipment.id}
                          checked={equipmentType.includes(equipment.id)}
                          onCheckedChange={() =>
                            toggleArrayValue(equipmentType, equipment.id, 'equipment_type')
                          }
                        />
                        <Label
                          htmlFor={equipment.id}
                          className="text-sm font-normal cursor-pointer"
                        >
                          {equipment.label}
                        </Label>
                      </div>
                    ))}
                  </div>
                  {errors.equipment_type && (
                    <p className="text-sm text-destructive">{errors.equipment_type.message}</p>
                  )}
                </div>
              )}

              {/* Step 3: Beer Styles */}
              {currentStep === 3 && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {BEER_STYLE_OPTIONS.map((style) => (
                      <div key={style.id} className="flex items-center space-x-2">
                        <Checkbox
                          id={style.id}
                          checked={preferredStyles.includes(style.id)}
                          onCheckedChange={() =>
                            toggleArrayValue(preferredStyles, style.id, 'preferred_styles')
                          }
                        />
                        <Label
                          htmlFor={style.id}
                          className="text-sm font-normal cursor-pointer"
                        >
                          {style.label}
                        </Label>
                      </div>
                    ))}
                  </div>
                  {errors.preferred_styles && (
                    <p className="text-sm text-destructive">{errors.preferred_styles.message}</p>
                  )}
                </div>
              )}

              {/* Step 4: Dietary Restrictions & Notes */}
              {currentStep === 4 && (
                <div className="space-y-6">
                  <div className="space-y-4">
                    <Label>Dietary Restrictions (optional)</Label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {DIETARY_OPTIONS.map((dietary) => (
                        <div key={dietary.id} className="flex items-center space-x-2">
                          <Checkbox
                            id={dietary.id}
                            checked={dietaryRestrictions.includes(dietary.id)}
                            onCheckedChange={() =>
                              toggleArrayValue(
                                dietaryRestrictions,
                                dietary.id,
                                'dietary_restrictions'
                              )
                            }
                          />
                          <Label
                            htmlFor={dietary.id}
                            className="text-sm font-normal cursor-pointer"
                          >
                            {dietary.label}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="additional_notes">Additional Notes (optional)</Label>
                    <Textarea
                      id="additional_notes"
                      {...register('additional_notes')}
                      placeholder="Any other preferences or information you'd like to share?"
                      rows={4}
                    />
                    <p className="text-sm text-muted-foreground">
                      Tell us about any special requirements, favorite ingredients, or brewing goals
                    </p>
                  </div>
                </div>
              )}

              {/* Messages */}
              {message && (
                <div
                  className={`flex items-center space-x-2 p-3 rounded-md ${
                    message.type === 'error'
                      ? 'bg-red-50 text-red-700 border border-red-200'
                      : 'bg-green-50 text-green-700 border border-green-200'
                  }`}
                >
                  {message.type === 'error' ? (
                    <AlertCircle className="w-4 h-4" />
                  ) : (
                    <CheckCircle className="w-4 h-4" />
                  )}
                  <span className="text-sm">{message.text}</span>
                </div>
              )}

              {/* Navigation Buttons */}
              <div className="flex justify-between pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={prevStep}
                  disabled={currentStep === 1 || loading}
                >
                  <ChevronLeft className="w-4 h-4 mr-2" />
                  Previous
                </Button>

                {currentStep < totalSteps ? (
                  <Button type="button" onClick={nextStep} disabled={loading}>
                    Next
                    <ChevronRight className="w-4 h-4 ml-2" />
                  </Button>
                ) : (
                  <Button type="submit" disabled={loading}>
                    {loading ? 'Saving...' : 'Complete Setup'}
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </form>
      </div>
    </div>
  )
}
