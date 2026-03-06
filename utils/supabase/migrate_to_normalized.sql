-- Migration: Populating normalized tables from legacy user_library
-- This script ensures existing folders and quizzes are visible in the new v_user_library view.

-- 1. Migrate Folders from legacy user_library to user_folders
INSERT INTO public.user_folders (user_id, folder_id, custom_name)
SELECT DISTINCT user_id, folder_id, user_folder_name
FROM public.user_library 
WHERE folder_id IS NOT NULL
ON CONFLICT (user_id, folder_id) DO UPDATE 
SET custom_name = EXCLUDED.custom_name 
WHERE public.user_folders.custom_name IS NULL;

-- 2. Migrate Quizzes from legacy user_library to user_quizzes
INSERT INTO public.user_quizzes (user_id, quiz_id, last_accessed_at, added_at, custom_title)
SELECT user_id, quiz_id, last_accessed_at, added_at, user_quiz_name
FROM public.user_library
ON CONFLICT (user_id, quiz_id) DO UPDATE
SET 
    last_accessed_at = GREATEST(public.user_quizzes.last_accessed_at, EXCLUDED.last_accessed_at),
    custom_title = EXCLUDED.custom_title
WHERE public.user_quizzes.custom_title IS NULL;

-- 3. Link Quizzes to their respective user-folders in the new structure
UPDATE public.user_quizzes uq
SET user_folder_id = uf.id
FROM public.user_folders uf
JOIN public.user_library ul ON ul.user_id = uf.user_id AND ul.folder_id = uf.folder_id
WHERE uq.user_id = ul.user_id AND uq.quiz_id = ul.quiz_id
AND uq.user_folder_id IS NULL;

-- 4. (Optional) Migrate folders that user created but are not in user_library yet
INSERT INTO public.user_folders (user_id, folder_id)
SELECT created_by, id
FROM public.folders
ON CONFLICT DO NOTHING;
