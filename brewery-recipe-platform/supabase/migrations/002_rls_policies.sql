-- Enable Row Level Security on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE recipes ENABLE ROW LEVEL SECURITY;
ALTER TABLE distributions ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_recipes ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscription_plans ENABLE ROW LEVEL SECURITY;

-- Create a function to check if user is admin
CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM profiles 
    WHERE id = auth.uid() 
    AND email IN (
      'admin@breweryrecipes.com',
      'support@breweryrecipes.com'
    )
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Profiles policies
CREATE POLICY "Users can view own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Admins can view all profiles" ON profiles
  FOR SELECT USING (is_admin());

CREATE POLICY "Admins can update all profiles" ON profiles
  FOR UPDATE USING (is_admin());

-- User preferences policies
CREATE POLICY "Users can view own preferences" ON user_preferences
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own preferences" ON user_preferences
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own preferences" ON user_preferences
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all preferences" ON user_preferences
  FOR SELECT USING (is_admin());

CREATE POLICY "Admins can update all preferences" ON user_preferences
  FOR UPDATE USING (is_admin());

-- Recipes policies
CREATE POLICY "Authenticated users can view recipes" ON recipes
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Admins can insert recipes" ON recipes
  FOR INSERT WITH CHECK (is_admin());

CREATE POLICY "Admins can update recipes" ON recipes
  FOR UPDATE USING (is_admin());

CREATE POLICY "Admins can delete recipes" ON recipes
  FOR DELETE USING (is_admin());

-- Distributions policies
CREATE POLICY "Admins can view all distributions" ON distributions
  FOR SELECT USING (is_admin());

CREATE POLICY "Admins can insert distributions" ON distributions
  FOR INSERT WITH CHECK (is_admin());

CREATE POLICY "Admins can update distributions" ON distributions
  FOR UPDATE USING (is_admin());

CREATE POLICY "Admins can delete distributions" ON distributions
  FOR DELETE USING (is_admin());

-- User recipes policies
CREATE POLICY "Users can view own user_recipes" ON user_recipes
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update own user_recipes" ON user_recipes
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all user_recipes" ON user_recipes
  FOR SELECT USING (is_admin());

CREATE POLICY "Admins can insert user_recipes" ON user_recipes
  FOR INSERT WITH CHECK (is_admin());

CREATE POLICY "Admins can update user_recipes" ON user_recipes
  FOR UPDATE USING (is_admin());

CREATE POLICY "Admins can delete user_recipes" ON user_recipes
  FOR DELETE USING (is_admin());

-- Subscription plans policies
CREATE POLICY "Authenticated users can view subscription plans" ON subscription_plans
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Admins can insert subscription plans" ON subscription_plans
  FOR INSERT WITH CHECK (is_admin());

CREATE POLICY "Admins can update subscription plans" ON subscription_plans
  FOR UPDATE USING (is_admin());

CREATE POLICY "Admins can delete subscription plans" ON subscription_plans
  FOR DELETE USING (is_admin());

-- Create a function to handle new user signup
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO profiles (id, email, full_name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email)
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for new user signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();
