-- ============================================================
-- Migration: Align web DB schema with mobile app schema
-- Run this in Supabase SQL Editor BEFORE deploying code changes
-- ============================================================

-- ============================================================
-- STEP 1: user_quizzes — rename quiz_id → global_quiz_id
-- ============================================================

-- Drop old unique constraint (uses old column name)
ALTER TABLE public.user_quizzes
  DROP CONSTRAINT IF EXISTS user_quizzes_user_id_quiz_id_key;

-- Rename the column
ALTER TABLE public.user_quizzes
  RENAME COLUMN quiz_id TO global_quiz_id;

-- Add user_folder_id (FK to user_folders.id, nullable)
ALTER TABLE public.user_quizzes
  ADD COLUMN IF NOT EXISTS user_folder_id UUID REFERENCES public.user_folders(id) ON DELETE SET NULL;

-- Add custom_title for user-personalized quiz names
ALTER TABLE public.user_quizzes
  ADD COLUMN IF NOT EXISTS custom_title TEXT;

-- Re-create unique constraint with new column name
ALTER TABLE public.user_quizzes
  ADD CONSTRAINT user_quizzes_user_id_global_quiz_id_key UNIQUE (user_id, global_quiz_id);

-- ============================================================
-- STEP 2: user_folders — rename folder_id → global_folder_id
-- ============================================================

ALTER TABLE public.user_folders
  DROP CONSTRAINT IF EXISTS user_folders_user_id_folder_id_key;

ALTER TABLE public.user_folders
  RENAME COLUMN folder_id TO global_folder_id;

-- Add custom_name for user-personalized folder names
ALTER TABLE public.user_folders
  ADD COLUMN IF NOT EXISTS custom_name TEXT;

-- Re-create unique constraint
ALTER TABLE public.user_folders
  ADD CONSTRAINT user_folders_user_id_global_folder_id_key UNIQUE (user_id, global_folder_id);

-- ============================================================
-- STEP 3: quiz_attempts — ensure it references quizzes correctly
-- (quiz_id should already be correct, just confirming)
-- ============================================================
-- No changes needed to quiz_attempts

-- ============================================================
-- STEP 4: quiz_folders — ensure unique constraint exists
-- ============================================================
ALTER TABLE public.quiz_folders
  ADD CONSTRAINT IF NOT EXISTS quiz_folders_created_by_quiz_id_folder_id_key
  UNIQUE (created_by, quiz_id, folder_id);

-- ============================================================
-- STEP 5: Update v_user_library view to use new column names
-- ============================================================
CREATE OR REPLACE VIEW public.v_user_library
WITH (security_invoker = on) AS
SELECT
    uq.id                                           AS id,
    uq.user_id                                      AS user_id,
    uq.global_quiz_id                               AS quiz_id,
    uq.added_at                                     AS added_at,
    uq.last_accessed_at                             AS last_accessed_at,
    uf.id                                           AS folder_id,
    COALESCE(uq.custom_title, q.title)              AS user_quiz_name,
    COALESCE(uf.custom_name, f.name)                AS user_folder_name
FROM
    public.user_quizzes uq
LEFT JOIN
    public.quizzes q ON uq.global_quiz_id = q.id
LEFT JOIN
    public.user_folders uf ON uq.user_folder_id = uf.id
LEFT JOIN
    public.folders f ON uf.global_folder_id = f.id
WHERE
    uq.user_id IS NOT NULL;

COMMENT ON VIEW public.v_user_library IS
  'Normalized user library view using global_quiz_id and user_folder_id. Aligned with mobile app schema.';
