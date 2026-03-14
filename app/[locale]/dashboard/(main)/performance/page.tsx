import { createClient } from "@/utils/supabase/server";
import PerformanceContent from "@/components/features/performance/PerformanceContent";
import { redirect } from "next/navigation";

export const dynamic = 'force-dynamic';

interface PerformancePageProps {
    params: Promise<{ locale: string }>;
    searchParams: Promise<{ quizId?: string }>;
}

export default async function PerformancePage({
    params,
    searchParams
}: PerformancePageProps) {
    const { locale } = await params;
    const { quizId: initialQuizId } = await searchParams;
    const supabase = await createClient();

    // 1. Get User
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
        redirect(`/${locale}/login`);
    }

    // 2. Fetch All Completed Quiz Attempts
    const { data: attempts } = await (supabase as any)
        .from('quiz_attempts')
        .select('*')
        .eq('user_id', user.id)
        .eq('status', 'completed')
        .order('completed_at', { ascending: false });

    // 3. Fetch Library Info (to get custom names and folder links)
    const { data: library } = await supabase
        .from('v_user_library')
        .select(`
            quiz_id,
            user_quiz_name,
            user_folder_name,
            folder_id
        `)
        .eq('user_id', user.id);

    // 4. Fetch User Folders
    const { data: folders } = await (supabase as any)
        .from('user_folders')
        .select('id, custom_name')
        .eq('user_id', user.id);

    return (
        <div className="p-4 md:p-8">
            <PerformanceContent
                attempts={attempts || []}
                library={library || []}
                folders={folders || []}
                initialQuizId={initialQuizId}
            />
        </div>
    );
}
