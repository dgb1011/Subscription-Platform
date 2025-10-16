-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create custom types
CREATE TYPE subscription_status AS ENUM ('active', 'inactive', 'cancelled', 'trial');
CREATE TYPE brewery_size AS ENUM ('homebrewer', 'nano', 'micro', 'regional');
CREATE TYPE experience_level AS ENUM ('beginner', 'intermediate', 'advanced', 'expert');
CREATE TYPE difficulty_level AS ENUM ('beginner', 'intermediate', 'advanced', 'expert');
CREATE TYPE distribution_status AS ENUM ('draft', 'scheduled', 'sent');

-- Create profiles table (extends auth.users)
CREATE TABLE profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  subscription_status subscription_status DEFAULT 'trial',
  stripe_customer_id TEXT UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create user_preferences table
CREATE TABLE user_preferences (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  brewery_size brewery_size NOT NULL,
  equipment_type TEXT[] NOT NULL DEFAULT '{}',
  experience_level experience_level NOT NULL,
  preferred_styles TEXT[] NOT NULL DEFAULT '{}',
  dietary_restrictions TEXT[] NOT NULL DEFAULT '{}',
  additional_notes TEXT,
  ai_personality_profile JSONB,
  last_ai_analysis TIMESTAMP WITH TIME ZONE,
  ai_feedback_score INTEGER CHECK (ai_feedback_score >= 0 AND ai_feedback_score <= 100),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id)
);

-- Create recipes table
CREATE TABLE recipes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  difficulty_level difficulty_level NOT NULL,
  beer_style TEXT NOT NULL,
  batch_size TEXT NOT NULL,
  equipment_required TEXT[] NOT NULL DEFAULT '{}',
  pdf_url TEXT,
  beerxml_url TEXT,
  tags TEXT[] NOT NULL DEFAULT '{}',
  ai_description TEXT,
  ai_tags TEXT[] DEFAULT '{}',
  ai_difficulty_explanation TEXT,
  ai_equipment_notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create distributions table
CREATE TABLE distributions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  month TEXT NOT NULL,
  year INTEGER NOT NULL,
  sent_at TIMESTAMP WITH TIME ZONE,
  status distribution_status DEFAULT 'draft',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(month, year)
);

-- Create user_recipes table (junction table)
CREATE TABLE user_recipes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  recipe_id UUID REFERENCES recipes(id) ON DELETE CASCADE,
  distribution_id UUID REFERENCES distributions(id) ON DELETE CASCADE,
  match_score INTEGER NOT NULL CHECK (match_score >= 0 AND match_score <= 100),
  downloaded_at TIMESTAMP WITH TIME ZONE,
  sent_at TIMESTAMP WITH TIME ZONE,
  ai_match_reasoning TEXT,
  ai_confidence_score INTEGER CHECK (ai_confidence_score >= 0 AND ai_confidence_score <= 100),
  user_feedback TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, recipe_id, distribution_id)
);

-- Create subscription_plans table
CREATE TABLE subscription_plans (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  stripe_price_id TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  price_monthly INTEGER NOT NULL,
  features JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_profiles_email ON profiles(email);
CREATE INDEX idx_profiles_stripe_customer_id ON profiles(stripe_customer_id);
CREATE INDEX idx_user_preferences_user_id ON user_preferences(user_id);
CREATE INDEX idx_recipes_beer_style ON recipes(beer_style);
CREATE INDEX idx_recipes_difficulty_level ON recipes(difficulty_level);
CREATE INDEX idx_recipes_tags ON recipes USING GIN(tags);
CREATE INDEX idx_user_recipes_user_id ON user_recipes(user_id);
CREATE INDEX idx_user_recipes_recipe_id ON user_recipes(recipe_id);
CREATE INDEX idx_user_recipes_distribution_id ON user_recipes(distribution_id);
CREATE INDEX idx_subscription_plans_stripe_price_id ON subscription_plans(stripe_price_id);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_user_preferences_updated_at BEFORE UPDATE ON user_preferences FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_recipes_updated_at BEFORE UPDATE ON recipes FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_distributions_updated_at BEFORE UPDATE ON distributions FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_user_recipes_updated_at BEFORE UPDATE ON user_recipes FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_subscription_plans_updated_at BEFORE UPDATE ON subscription_plans FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
