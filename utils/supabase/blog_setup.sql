-- 1. Create blog_posts table
CREATE TABLE IF NOT EXISTS public.blog_posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  content TEXT NOT NULL,
  excerpt TEXT,
  cover_image_url TEXT,
  seo_keywords TEXT,
  is_published BOOLEAN DEFAULT false,
  author_id UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 2. Enable RLS
ALTER TABLE public.blog_posts ENABLE ROW LEVEL SECURITY;

-- 3. Policies for blog_posts
-- Public can read only published posts
CREATE POLICY "Anyone can read published posts" ON public.blog_posts
  FOR SELECT USING (is_published = true);

-- Authenticated users (Admins) can do everything
CREATE POLICY "Admins can manage all posts" ON public.blog_posts
  FOR ALL TO authenticated USING (true);

-- 4. Storage bucket for blog_images
-- Note: Insert into storage.buckets if not exists
DO $$
BEGIN
  INSERT INTO storage.buckets (id, name, public)
  VALUES ('blog_images', 'blog_images', true)
  ON CONFLICT (id) DO NOTHING;
END $$;

-- 5. Storage Policies
-- Anyone can read images
CREATE POLICY "Public Access" ON storage.objects
  FOR SELECT USING (bucket_id = 'blog_images');

-- Admins (authenticated) can manage images
CREATE POLICY "Admin Manage Images" ON storage.objects
  FOR ALL TO authenticated USING (bucket_id = 'blog_images');

-- 6. Updated At Trigger
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS set_updated_at ON public.blog_posts;
CREATE TRIGGER set_updated_at
BEFORE UPDATE ON public.blog_posts
FOR EACH ROW
EXECUTE FUNCTION public.handle_updated_at();
