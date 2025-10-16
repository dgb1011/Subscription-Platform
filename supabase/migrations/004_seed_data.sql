-- Insert subscription plans
INSERT INTO subscription_plans (stripe_price_id, name, price_monthly, features) VALUES 
  (
    'price_basic_monthly', 
    'Basic Plan', 
    1900, 
    '{
      "recipes_per_month": 3,
      "features": [
        "3 personalized recipes per month",
        "PDF + BeerXML downloads",
        "Basic support"
      ],
      "support_level": "basic"
    }'::jsonb
  ),
  (
    'price_pro_monthly', 
    'Pro Plan', 
    3900, 
    '{
      "recipes_per_month": 5,
      "features": [
        "5 personalized recipes per month",
        "PDF + BeerXML downloads",
        "Equipment optimization tips",
        "Priority support"
      ],
      "support_level": "priority"
    }'::jsonb
  ),
  (
    'price_expert_monthly', 
    'Expert Plan', 
    7900, 
    '{
      "recipes_per_month": -1,
      "features": [
        "Unlimited recipe access",
        "Custom recipe generation",
        "1-on-1 brewing consultation",
        "Advanced analytics"
      ],
      "support_level": "premium"
    }'::jsonb
  );

-- Insert some sample recipes
INSERT INTO recipes (title, description, difficulty_level, beer_style, batch_size, equipment_required, tags) VALUES 
  (
    'Classic American IPA',
    'A hop-forward American IPA with citrusy and piney hop character. Perfect for showcasing American hop varieties.',
    'intermediate',
    'American IPA',
    '5 gallons',
    ARRAY['kettle', 'fermenter', 'hydrometer', 'thermometer'],
    ARRAY['homebrewer', 'nano', 'micro', 'ipa', 'american', 'hoppy']
  ),
  (
    'Belgian Witbier',
    'A refreshing wheat beer with coriander and orange peel. Light, crisp, and perfect for warm weather.',
    'beginner',
    'Witbier',
    '5 gallons',
    ARRAY['kettle', 'fermenter', 'hydrometer', 'thermometer'],
    ARRAY['homebrewer', 'nano', 'wheat', 'belgian', 'refreshing']
  ),
  (
    'Imperial Stout',
    'A rich, full-bodied stout with notes of coffee, chocolate, and dark fruit. High alcohol content and complex flavors.',
    'expert',
    'Imperial Stout',
    '5 gallons',
    ARRAY['kettle', 'fermenter', 'hydrometer', 'thermometer', 'oxygenation_stone'],
    ARRAY['micro', 'regional', 'stout', 'imperial', 'dark', 'complex']
  ),
  (
    'German Pilsner',
    'A clean, crisp lager with noble hop character. Requires precise temperature control and extended lagering.',
    'advanced',
    'German Pilsner',
    '5 gallons',
    ARRAY['kettle', 'fermenter', 'hydrometer', 'thermometer', 'temperature_control'],
    ARRAY['nano', 'micro', 'regional', 'lager', 'german', 'crisp']
  ),
  (
    'New England IPA',
    'A hazy, juicy IPA with low bitterness and tropical fruit flavors. Known for its soft mouthfeel and cloudy appearance.',
    'intermediate',
    'New England IPA',
    '5 gallons',
    ARRAY['kettle', 'fermenter', 'hydrometer', 'thermometer'],
    ARRAY['homebrewer', 'nano', 'micro', 'neipa', 'hazy', 'juicy']
  );
