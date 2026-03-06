-- 1. KPI ÖZETİ (Sistemin Nabzı)
DROP VIEW IF EXISTS admin_kpi_summary;
CREATE OR REPLACE VIEW admin_kpi_summary AS
SELECT
  (SELECT count(*) FROM public.profiles) as total_users,
  (SELECT count(*) FROM public.quizzes) as pool_size, -- Havuzdaki toplam içerik (Fabrika Üretimi)
  (SELECT count(*) FROM public.user_quizzes) as total_adoptions, -- Kütüphaneye eklenme (Sahiplenme Oranı - EN ÖNEMLİSİ)
  (SELECT count(*) FROM public.quiz_attempts) as total_plays, -- Toplam oynanma
  (SELECT count(*) FROM public.waitlist) as waitlist_count;

-- 2. EN POPÜLER İÇERİKLER (Hangi Quiz Tutuldu?)
DROP VIEW IF EXISTS admin_popular_quizzes;
CREATE OR REPLACE VIEW admin_popular_quizzes AS
SELECT
  q.title,
  count(uq.id) as adoption_count, -- Kaç kişinin kütüphanesinde
  count(distinct qa.id) as play_count -- Kaç kere oynandı
FROM public.quizzes q
LEFT JOIN public.user_quizzes uq ON q.id = uq.quiz_id
LEFT JOIN public.quiz_attempts qa ON q.id = qa.quiz_id
GROUP BY q.id, q.title
ORDER BY adoption_count DESC;

-- 3. CANLI ÜRETİM AKIŞI (Sistemi Kim Büyütüyor?)
DROP VIEW IF EXISTS admin_content_feed;
CREATE OR REPLACE VIEW admin_content_feed AS
SELECT
  q.title as quiz_title,
  q.created_at,
  q.question_count,
  p.email as creator_email
FROM public.quizzes q
LEFT JOIN public.profiles p ON q.created_by = p.id
ORDER BY q.created_at DESC;

-- 4. CANLI ÇÖZÜM HAREKETLERİ (Kim Ne Çözüyor?)
DROP VIEW IF EXISTS admin_attempts_feed;
CREATE OR REPLACE VIEW admin_attempts_feed AS
SELECT
  qa.id,
  p.email,
  q.title as quiz_title,
  qa.status,             -- 'in_progress' veya 'completed'
  qa.score,              -- Puan
  qa.started_at,
  qa.completed_at
FROM public.quiz_attempts qa
JOIN public.profiles p ON qa.user_id = p.id
JOIN public.quizzes q ON qa.quiz_id = q.id
ORDER BY qa.started_at DESC;
