import { createClient } from "@/utils/supabase/server";
import DashboardContent from "@/components/features/dashboard/DashboardContent";

export const dynamic = 'force-dynamic';

export default async function DashboardPage() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return null;

    // 1. Fetch Recent Activity (Limit 5)
    const { data: recentActivity } = await supabase
        .from('user_library')
        .select(`
      id,
      last_accessed_at,
      quizzes (
        id,
        title,
        question_count
      )
    `)
        .eq('user_id', user.id)
        .order('last_accessed_at', { ascending: false })
        .limit(5);

    // 2. Fetch Last Attempt
    const { data: lastAttempt } = await supabase
        .from('quiz_attempts')
        .select(`
        id,
        score,
        correct_count,
        wrong_count,
        quiz_id,
        status,
        quizzes (title)
      `)
        .eq('user_id', user.id)
        .eq('status', 'completed')
        .order('completed_at', { ascending: false })
        .limit(1)
        .single();

    return (
        <DashboardContent
            user={user}
            recentActivity={recentActivity || []}
            lastAttempt={lastAttempt}
        />
    );
}
