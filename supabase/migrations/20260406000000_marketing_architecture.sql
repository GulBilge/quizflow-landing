-- Quizflow Marketing Architecture Migration
-- Renames old blog_posts and sets up the new campaign-driven system

-- 1. Rename existing blog_posts to avoid conflict
ALTER TABLE IF EXISTS public.blog_posts RENAME TO old_blog_posts;

-- 2. Create Enum Types
DO $$ BEGIN
    CREATE TYPE content_status AS ENUM ('draft', 'pending_review', 'approved','planned', 'publishing', 'published', 'archived', 'rejected');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE social_platform AS ENUM ('twitter_x', 'linkedin', 'newsletter', 'instagram', 'tiktok', 'youtube', 'facebook', 'whatsapp', 'telegram', 'other');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE pipeline_stage AS ENUM ('research', 'strategy', 'writing', 'social_media', 'completed', 'failed');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE source_type AS ENUM ('google_trends', 'reddit', 'manual_seed', 'ga4_feedback', 'competitor_analysis', 'other');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- 3. Create Tables
CREATE TABLE IF NOT EXISTS campaigns (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    title text NOT NULL,
    slug text UNIQUE,
    topic_seed text NOT NULL,
    target_keyword text NOT NULL,
    secondary_keywords text[],
    search_volume integer,
    difficulty_score smallint CHECK (difficulty_score >= 0 AND difficulty_score <= 100),
    status content_status NOT NULL DEFAULT 'draft',
    pipeline_stage pipeline_stage NOT NULL DEFAULT 'research',
    target_audience text,
    content_angle text,
    cta_type text DEFAULT 'quizyen_signup',
    reviewer_notes text,
    reviewed_by uuid REFERENCES auth.users(id),
    reviewed_at timestamptz,
    published_at timestamptz,
    blog_url text,
    page_views integer DEFAULT 0,
    conversions integer DEFAULT 0,
    avg_time_on_page integer,
    performance_score numeric(5,2),
    n8n_execution_id text,
    created_at timestamptz DEFAULT NOW(),
    updated_at timestamptz DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS blog_posts (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    campaign_id uuid NOT NULL REFERENCES campaigns(id) ON DELETE CASCADE,
    meta_title text NOT NULL CHECK (char_length(meta_title) >= 30 AND char_length(meta_title) <= 60),
    meta_description text NOT NULL CHECK (char_length(meta_description) >= 120 AND char_length(meta_description) <= 160),
    og_title text,
    og_description text,
    outline jsonb,
    content_markdown text NOT NULL DEFAULT '',
    content_html text,
    schema_jsonld jsonb,
    word_count integer,
    reading_time_min smallint,
    version smallint DEFAULT 1,
    is_current boolean DEFAULT true,
    created_at timestamptz DEFAULT NOW(),
    updated_at timestamptz DEFAULT NOW(),
    UNIQUE(campaign_id, version)
);

CREATE TABLE IF NOT EXISTS social_posts (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    campaign_id uuid NOT NULL REFERENCES campaigns(id) ON DELETE CASCADE,
    platform social_platform NOT NULL,
    content jsonb NOT NULL,
    status content_status NOT NULL DEFAULT 'pending_review',
    scheduled_at timestamptz,
    published_at timestamptz,
    platform_post_id text,
    platform_url text,
    impressions integer DEFAULT 0,
    engagements integer DEFAULT 0,
    link_clicks integer DEFAULT 0,
    created_at timestamptz DEFAULT NOW(),
    updated_at timestamptz DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS research_signals (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    campaign_id uuid REFERENCES campaigns(id),
    source source_type NOT NULL,
    raw_data jsonb NOT NULL,
    topic text NOT NULL,
    pain_points text[],
    opportunity_score numeric(5,2),
    is_used boolean DEFAULT false,
    created_at timestamptz DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS brand_voice_guidelines (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    category text NOT NULL CHECK (category IN ('tone', 'vocabulary', 'cta_templates', 'avoid_list', 'ga4_insights')),
    title text NOT NULL,
    content text NOT NULL,
    examples jsonb,
    is_active boolean DEFAULT true,
    priority smallint DEFAULT 5,
    created_at timestamptz DEFAULT NOW(),
    updated_at timestamptz DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS pipeline_logs (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    campaign_id uuid REFERENCES campaigns(id),
    n8n_execution_id text,
    stage pipeline_stage NOT NULL,
    status text NOT NULL CHECK (status IN ('started', 'completed', 'failed')),
    agent_name text,
    model_used text,
    input_tokens integer,
    output_tokens integer,
    latency_ms integer,
    error_message text,
    metadata jsonb,
    created_at timestamptz DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS performance_snapshots (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    campaign_id uuid NOT NULL REFERENCES campaigns(id),
    snapshot_date date NOT NULL,
    page_views integer DEFAULT 0,
    unique_visitors integer DEFAULT 0,
    avg_position numeric(5,2),
    impressions integer DEFAULT 0,
    clicks integer DEFAULT 0,
    ctr numeric(5,4),
    conversions integer DEFAULT 0,
    bounce_rate numeric(5,4),
    created_at timestamptz DEFAULT NOW(),
    UNIQUE(campaign_id, snapshot_date)
);

-- 4. Functions and Triggers
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER tr_campaigns_updated_at BEFORE UPDATE ON campaigns FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER tr_blog_posts_updated_at BEFORE UPDATE ON blog_posts FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER tr_social_posts_updated_at BEFORE UPDATE ON social_posts FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER tr_brand_voice_guidelines_updated_at BEFORE UPDATE ON brand_voice_guidelines FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

CREATE OR REPLACE FUNCTION generate_slug_from_title()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.slug IS NULL OR NEW.slug = '' THEN
        NEW.slug := lower(regexp_replace(NEW.title, '\s+', '-', 'g'));
        NEW.slug := regexp_replace(NEW.slug, '[^a-z0-9\-]', '', 'g');
        NEW.slug := regexp_replace(NEW.slug, '-+', '-', 'g');
        NEW.slug := trim(both '-' from NEW.slug);
    END IF;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER tr_campaigns_generate_slug
BEFORE INSERT OR UPDATE OF title ON campaigns
FOR EACH ROW EXECUTE PROCEDURE generate_slug_from_title();

-- 5. RLS Policies
ALTER TABLE campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE social_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE research_signals ENABLE ROW LEVEL SECURITY;
ALTER TABLE brand_voice_guidelines ENABLE ROW LEVEL SECURITY;
ALTER TABLE pipeline_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE performance_snapshots ENABLE ROW LEVEL SECURITY;

-- Service Role (Full Access)
CREATE POLICY "Service Role Full Access" ON campaigns FOR ALL TO service_role USING (true) WITH CHECK (true);
CREATE POLICY "Service Role Full Access" ON blog_posts FOR ALL TO service_role USING (true) WITH CHECK (true);
CREATE POLICY "Service Role Full Access" ON social_posts FOR ALL TO service_role USING (true) WITH CHECK (true);
CREATE POLICY "Service Role Full Access" ON research_signals FOR ALL TO service_role USING (true) WITH CHECK (true);
CREATE POLICY "Service Role Full Access" ON brand_voice_guidelines FOR ALL TO service_role USING (true) WITH CHECK (true);
CREATE POLICY "Service Role Full Access" ON pipeline_logs FOR ALL TO service_role USING (true) WITH CHECK (true);
CREATE POLICY "Service Role Full Access" ON performance_snapshots FOR ALL TO service_role USING (true) WITH CHECK (true);

-- Admin Policies (Read/Update for campaigns/blog_posts/social_posts)
CREATE POLICY "Admin access policy" ON campaigns FOR ALL TO authenticated USING (auth.jwt() ->> 'role' = 'admin') WITH CHECK (auth.jwt() ->> 'role' = 'admin');
CREATE POLICY "Admin access policy" ON blog_posts FOR ALL TO authenticated USING (auth.jwt() ->> 'role' = 'admin') WITH CHECK (auth.jwt() ->> 'role' = 'admin');
CREATE POLICY "Admin access policy" ON social_posts FOR ALL TO authenticated USING (auth.jwt() ->> 'role' = 'admin') WITH CHECK (auth.jwt() ->> 'role' = 'admin');

-- Public Access
CREATE POLICY "Public Read Published Campaigns" ON campaigns FOR SELECT USING (status = 'published');
CREATE POLICY "Public Read Published Posts" ON blog_posts FOR SELECT USING (EXISTS (SELECT 1 FROM campaigns WHERE campaigns.id = blog_posts.campaign_id AND campaigns.status = 'published'));
