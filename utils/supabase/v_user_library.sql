-- View: v_user_library
-- Normalized user library view combining personalized folders and quizzes with fallbacks.
-- Language: Javascript (Supabase reported columns below)
--
-- Columns:
--   id              uuid   (user_quizzes.id)
--   user_id         uuid
--   quiz_id         uuid
--   added_at        timestamptz
--   last_accessed_at timestamptz
--   folder_id       uuid   (user_quizzes.folder_id)
--   user_quiz_name  text   (personalized quiz name override)
--   user_folder_name text  (personalized folder name override)

CREATE OR REPLACE VIEW public.v_user_library
WITH (security_invoker = on) AS
SELECT
    uq.id                                      AS id,
    uq.user_id                                 AS user_id,
    uq.quiz_id                                 AS quiz_id,
    uq.added_at                                AS added_at,
    uq.last_accessed_at                        AS last_accessed_at,
    uq.folder_id                               AS folder_id,
    COALESCE(uq.custom_title, q.title)         AS user_quiz_name,
    COALESCE(uf.custom_name, f.name)           AS user_folder_name
FROM
    public.user_quizzes uq
LEFT JOIN
    public.quizzes q ON uq.quiz_id = q.id
LEFT JOIN
    public.user_folders uf ON uq.folder_id = uf.id
LEFT JOIN
    public.folders f ON uf.folder_id = f.id
WHERE
    uq.user_id IS NOT NULL;

COMMENT ON VIEW public.v_user_library IS 'Normalized user library view combining personalized folders and quizzes with fallbacks';
