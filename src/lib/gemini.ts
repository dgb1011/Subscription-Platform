import { GoogleGenerativeAI } from '@google/generative-ai'

// Initialize Gemini AI only if the API key is available
// This prevents build errors when environment variables are not set
const geminiApiKey = process.env.GEMINI_API_KEY || ''

export const genAI = geminiApiKey ? new GoogleGenerativeAI(geminiApiKey) : null

export const model = genAI ? genAI.getGenerativeModel({ model: 'gemini-2.0-flash-exp' }) : null

export interface UserProfile {
  experience_level: 'beginner' | 'intermediate' | 'advanced' | 'expert'
  brewery_size: 'homebrewer' | 'nano' | 'micro' | 'regional'
  equipment_type: string[]
  preferred_styles: string[]
  dietary_restrictions: string[]
  additional_notes?: string
}

export interface RecipeRecommendation {
  recipe_id: string
  title: string
  beer_style: string
  difficulty_level: string
  match_reasoning: string
  confidence_score: number
  brewing_tips: string[]
}

export async function getAIRecipeRecommendations(
  userProfile: UserProfile,
  availableRecipes: any[]
): Promise<RecipeRecommendation[]> {
  // Check if Gemini AI is configured
  if (!model) {
    console.warn('Gemini AI is not configured - returning empty recommendations')
    return []
  }

  const prompt = `
    You are a professional brewing consultant with 20+ years experience.
    
    USER PROFILE:
    - Experience Level: ${userProfile.experience_level}
    - Brewery Size: ${userProfile.brewery_size}
    - Equipment: ${userProfile.equipment_type.join(', ')}
    - Preferred Styles: ${userProfile.preferred_styles.join(', ')}
    - Dietary Restrictions: ${userProfile.dietary_restrictions.join(', ')}
    - Additional Notes: ${userProfile.additional_notes || 'None'}
    
    AVAILABLE RECIPES:
    ${availableRecipes.map(recipe => `
      - ${recipe.title} (${recipe.beer_style})
      - Difficulty: ${recipe.difficulty_level}
      - Equipment: ${recipe.equipment_required.join(', ')}
      - Batch Size: ${recipe.batch_size}
      - Tags: ${recipe.tags.join(', ')}
    `).join('\n')}
    
    TASK: Recommend exactly 3 recipes with detailed explanations.
    
    For each recommendation, provide:
    1. Recipe name and why it matches their profile
    2. Specific brewing tips for their equipment
    3. Potential modifications based on their preferences
    4. Confidence score (0-100)
    5. What they'll learn from brewing this recipe
    
    Consider:
    - Equipment compatibility and scaling
    - Skill progression and learning opportunities
    - Seasonal appropriateness
    - Ingredient availability
    - Previous brewing patterns
    
    Format as JSON with detailed explanations.
  `;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    // Parse the JSON response
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
    
    throw new Error('No valid JSON found in AI response');
  } catch (error) {
    console.error('Error getting AI recommendations:', error);
    throw error;
  }
}
