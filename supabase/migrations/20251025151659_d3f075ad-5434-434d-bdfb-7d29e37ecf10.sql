-- Add enhanced features to walls table
ALTER TABLE walls ADD COLUMN IF NOT EXISTS showreel_url TEXT;
ALTER TABLE walls ADD COLUMN IF NOT EXISTS showreel_type TEXT CHECK (showreel_type IN ('embed', 'upload'));
ALTER TABLE walls ADD COLUMN IF NOT EXISTS journey_content TEXT;
ALTER TABLE walls ADD COLUMN IF NOT EXISTS logo_url TEXT;
ALTER TABLE walls ADD COLUMN IF NOT EXISTS brand_colors JSONB DEFAULT '{"primary": "#ef4444", "secondary": "#1a1a1a"}'::jsonb;
ALTER TABLE walls ADD COLUMN IF NOT EXISTS tagline TEXT;
ALTER TABLE walls ADD COLUMN IF NOT EXISTS awards TEXT[];
ALTER TABLE walls ADD COLUMN IF NOT EXISTS social_links JSONB DEFAULT '{}'::jsonb;

-- Add enhanced features to profiles table
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS logo_url TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS brand_colors JSONB DEFAULT '{"primary": "#ef4444", "secondary": "#1a1a1a"}'::jsonb;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS tagline TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS awards TEXT[];
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS social_links JSONB DEFAULT '{}'::jsonb;

-- Add showreel support to projects table
ALTER TABLE projects ADD COLUMN IF NOT EXISTS showreel_url TEXT;
ALTER TABLE projects ADD COLUMN IF NOT EXISTS showreel_type TEXT CHECK (showreel_type IN ('embed', 'upload'));

-- Create storage bucket for wall assets if it doesn't exist
INSERT INTO storage.buckets (id, name, public)
VALUES ('wall-assets', 'wall-assets', true)
ON CONFLICT (id) DO NOTHING;

-- Storage policies for wall assets
CREATE POLICY "Public can view wall assets"
ON storage.objects FOR SELECT
USING (bucket_id = 'wall-assets');

CREATE POLICY "Authenticated users can upload wall assets"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'wall-assets' 
  AND auth.role() = 'authenticated'
);

CREATE POLICY "Users can update their wall assets"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'wall-assets' 
  AND auth.role() = 'authenticated'
);

CREATE POLICY "Users can delete their wall assets"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'wall-assets' 
  AND auth.role() = 'authenticated'
);