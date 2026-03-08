-- Create user_quizzes table (replaces user_library)
CREATE TABLE IF NOT EXISTS public.user_quizzes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  quiz_id UUID REFERENCES public.quizzes(id) ON DELETE CASCADE,
  added_at TIMESTAMPTZ DEFAULT now(),
  last_accessed_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id, quiz_id)
);

-- Create user_folders table
CREATE TABLE IF NOT EXISTS public.user_folders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  folder_id UUID REFERENCES public.folders(id) ON DELETE CASCADE,
  added_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id, folder_id)
);

-- Enable RLS
ALTER TABLE public.user_quizzes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_folders ENABLE ROW LEVEL SECURITY;

-- Policies for user_quizzes
CREATE POLICY "Users can manage their own quizzes" ON public.user_quizzes
  FOR ALL USING (user_id = auth.uid());

-- Policies for user_folders
CREATE POLICY "Users can manage their own folders" ON public.user_folders
  FOR ALL USING (user_id = auth.uid());
