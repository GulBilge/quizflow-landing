-- ============================================================
-- Migration: Add Platform Tracking to Profiles
-- ============================================================

-- 1. Add platform column to public.profiles
ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS platform TEXT;

-- 2. Create or update trigger function to sync metadata to profiles
CREATE OR REPLACE FUNCTION public.handle_user_metadata_sync()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE public.profiles
    SET 
        full_name = COALESCE(new.raw_user_meta_data->>'full_name', full_name),
        platform = COALESCE(new.raw_user_meta_data->>'platform', platform)
    WHERE id = new.id;
    RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 3. Create a trigger on auth.users for updates
-- We need to ensure that when metadata is updated, it reflects in profiles
DROP TRIGGER IF EXISTS on_auth_user_updated ON auth.users;
CREATE TRIGGER on_auth_user_updated
AFTER UPDATE ON auth.users
FOR EACH ROW
WHEN (old.raw_user_meta_data IS DISTINCT FROM new.raw_user_meta_data)
EXECUTE FUNCTION public.handle_user_metadata_sync();

-- 4. Create a trigger on auth.users for insertion (if not already handled by a generic profile creation trigger)
-- Since I didn't find the original profile creation trigger, I'll add one that specifically handles 
-- metadata sync on insertion just in case, or to capture initial platform.
CREATE OR REPLACE FUNCTION public.handle_new_user_metadata()
RETURNS TRIGGER AS $$
BEGIN
    -- This assumes profiles are already created by some other trigger or 
    -- we might need to insert if not exists.
    -- Usually, there's a trigger like `on_auth_user_created` that inserts into `public.profiles`.
    -- For now, let's just make sure we update it.
    UPDATE public.profiles
    SET 
        full_name = new.raw_user_meta_data->>'full_name',
        platform = new.raw_user_meta_data->>'platform'
    WHERE id = new.id;
    RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created_metadata ON auth.users;
CREATE TRIGGER on_auth_user_created_metadata
AFTER INSERT ON auth.users
FOR EACH ROW
EXECUTE FUNCTION public.handle_new_user_metadata();

COMMENT ON COLUMN public.profiles.platform IS 'The platform from which the user signed up or is currently using (Android, iOS, or Web).';
