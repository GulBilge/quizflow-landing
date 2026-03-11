-- ============================================================
-- Migration: Add Payment Integration Fields to Profiles
-- ============================================================

-- 1. Add new columns to public.profiles
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS pro_expires_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS payment_method TEXT,
  ADD COLUMN IF NOT EXISTS subscription_status TEXT DEFAULT 'free',
  ADD COLUMN IF NOT EXISTS last_payment_id TEXT;

-- 2. Add check constraints for data integrity
-- payment_method: shopier, havale, admin
ALTER TABLE public.profiles
  DROP CONSTRAINT IF EXISTS profiles_payment_method_check;

ALTER TABLE public.profiles
  ADD CONSTRAINT profiles_payment_method_check 
  CHECK (payment_method IS NULL OR payment_method IN ('shopier', 'havale', 'admin'));

-- subscription_status: free, pending_approval, active, expired
ALTER TABLE public.profiles
  DROP CONSTRAINT IF EXISTS profiles_subscription_status_check;

ALTER TABLE public.profiles
  ADD CONSTRAINT profiles_subscription_status_check
  CHECK (subscription_status IN ('free', 'pending_approval', 'active', 'expired'));

-- 3. Create/Update a function to check if a user is PRO
-- This function checks both the is_pro flag and the expiration date.
-- If pro_expires_at is NULL, we assume it's a lifetime or manually set legacy PRO.
CREATE OR REPLACE FUNCTION public.is_user_pro(u_id UUID)
RETURNS BOOLEAN AS $$
DECLARE
    is_pro_val BOOLEAN;
    expires_at_val TIMESTAMPTZ;
BEGIN
    SELECT is_pro, pro_expires_at INTO is_pro_val, expires_at_val
    FROM public.profiles
    WHERE id = u_id;

    RETURN (
        COALESCE(is_pro_val, false) = true AND 
        (expires_at_val IS NULL OR expires_at_val > now())
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 4. Instructions for Row Level Security (RLS)
-- You can now use this function in your RLS policies.
-- Example: To restrict access to a "premium_feature" table:
-- CREATE POLICY "Only PRO users can access premium features" 
-- ON public.premium_features
-- FOR SELECT 
-- USING (public.is_user_pro(auth.uid()));

-- Suggestion: Update existing policies if they only check 'is_pro'
-- ALTER POLICY "Existing Policy Name" ON public.some_table
-- USING (public.is_user_pro(auth.uid()));

COMMENT ON COLUMN public.profiles.pro_expires_at IS 'Subscription expiration timestamp. NULL means no expiration if is_pro is true.';
COMMENT ON COLUMN public.profiles.payment_method IS 'Last used payment method: shopier, havale, or admin.';
COMMENT ON COLUMN public.profiles.subscription_status IS 'Current billing status of the user.';
COMMENT ON FUNCTION public.is_user_pro IS 'Centrally checks if a user has an active PRO subscription, considering expiration dates.';
