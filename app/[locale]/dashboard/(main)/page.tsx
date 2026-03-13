import { createClient } from "@/utils/supabase/server";
import DashboardContent from "@/components/features/dashboard/DashboardContent";

export const dynamic = 'force-dynamic';

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return null;
  
  // Fetch user profile for status
  const { data: profile } = await supabase
    .from('profiles')
    .select('is_pro')
    .eq('id', user.id)
    .single();

  // 1. Fetch Recent Activity from v_user_library (includes custom names)
  const { data: recentActivity } = await supabase
    .from('v_user_library')
    .select(`
      id,
      quiz_id,
      added_at,
      last_accessed_at,
      user_quiz_name,
      user_folder_name,
      quizzes:quiz_id (
        id,
        title,
        question_count
      )
    `)
    .eq('user_id', user.id)
    .order('last_accessed_at', { ascending: false })
    .limit(5);

  // 2. Fetch Last Attempts for these quizzes to show in cards
  const quizIds = (recentActivity || []).map((a: any) => a.quiz_id).filter(Boolean);
  const { data: lastAttempts } = quizIds.length > 0 ? await (supabase as any)
    .from('quiz_attempts')
    .select('id, quiz_id, score, correct_count, wrong_count, status, completed_at')
    .eq('user_id', user.id)
    .in('quiz_id', quizIds)
    .eq('status', 'completed')
    .order('completed_at', { ascending: false }) : { data: [] };

  // Combine data
  const activityWithStats = (recentActivity || []).map((item: any) => ({
    ...item,
    lastAttempt: (lastAttempts || []).find((a: any) => a.quiz_id === item.quiz_id)
  }));

  // 3. Overall Last Attempt (for the stats panel)
  const lastOverallAttempt = lastAttempts && (lastAttempts as any[]).length > 0 ? lastAttempts[0] : null;

  // 4. Fetch User Folders
  const { data: userFoldersData } = await (supabase as any)
    .from('user_folders')
    .select('id, custom_name')
    .eq('user_id', user.id);

  return (
    <DashboardContent
      user={user}
      profile={profile}
      recentActivity={activityWithStats as any}
      lastAttempt={lastOverallAttempt as any}
      userFolders={userFoldersData || []}
    />
  );
}
