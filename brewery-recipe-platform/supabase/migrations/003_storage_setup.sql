-- Create storage buckets
INSERT INTO storage.buckets (id, name, public) VALUES 
  ('recipes-pdf', 'recipes-pdf', false),
  ('recipes-beerxml', 'recipes-beerxml', false),
  ('recipe-images', 'recipe-images', true);

-- Storage policies for recipes-pdf bucket
CREATE POLICY "Authenticated users can view PDFs" ON storage.objects
  FOR SELECT USING (
    bucket_id = 'recipes-pdf' 
    AND auth.role() = 'authenticated'
  );

CREATE POLICY "Admins can upload PDFs" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'recipes-pdf' 
    AND is_admin()
  );

CREATE POLICY "Admins can update PDFs" ON storage.objects
  FOR UPDATE USING (
    bucket_id = 'recipes-pdf' 
    AND is_admin()
  );

CREATE POLICY "Admins can delete PDFs" ON storage.objects
  FOR DELETE USING (
    bucket_id = 'recipes-pdf' 
    AND is_admin()
  );

-- Storage policies for recipes-beerxml bucket
CREATE POLICY "Authenticated users can view BeerXML files" ON storage.objects
  FOR SELECT USING (
    bucket_id = 'recipes-beerxml' 
    AND auth.role() = 'authenticated'
  );

CREATE POLICY "Admins can upload BeerXML files" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'recipes-beerxml' 
    AND is_admin()
  );

CREATE POLICY "Admins can update BeerXML files" ON storage.objects
  FOR UPDATE USING (
    bucket_id = 'recipes-beerxml' 
    AND is_admin()
  );

CREATE POLICY "Admins can delete BeerXML files" ON storage.objects
  FOR DELETE USING (
    bucket_id = 'recipes-beerxml' 
    AND is_admin()
  );

-- Storage policies for recipe-images bucket (public)
CREATE POLICY "Anyone can view recipe images" ON storage.objects
  FOR SELECT USING (bucket_id = 'recipe-images');

CREATE POLICY "Admins can upload recipe images" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'recipe-images' 
    AND is_admin()
  );

CREATE POLICY "Admins can update recipe images" ON storage.objects
  FOR UPDATE USING (
    bucket_id = 'recipe-images' 
    AND is_admin()
  );

CREATE POLICY "Admins can delete recipe images" ON storage.objects
  FOR DELETE USING (
    bucket_id = 'recipe-images' 
    AND is_admin()
  );
