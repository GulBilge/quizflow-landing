import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import QuizImportClient from "./QuizImportClient";

interface QuizImportPageProps {
    params: Promise<{ locale: string }>;
    searchParams: Promise<{ id?: string }>;
}

export default async function QuizImportPage({ params, searchParams }: QuizImportPageProps) {
    const { locale } = await params;
    const { id: quizId } = await searchParams;

    // No quiz ID — redirect home
    if (!quizId) {
        redirect(`/${locale}`);
    }

    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    // Verify the quiz exists in the global pool
    const { data: quiz } = await (supabase as any)
        .from("quizzes")
        .select("id, title")
        .eq("id", quizId)
        .maybeSingle();

    if (!quiz) {
        redirect(`/${locale}`);
    }

    // If already logged in → add to library server-side and redirect to player
    if (user) {
        const db = supabase as any;

        // Resolve folder from quiz_folders
        let userFolderId: string | null = null;
        const { data: qfData } = await db
            .from("quiz_folders")
            .select("folder_id")
            .eq("quiz_id", quizId)
            .limit(1)
            .maybeSingle();

        if (qfData?.folder_id) {
            const { data: folderData } = await db
                .from("folders")
                .select("name")
                .eq("id", qfData.folder_id)
                .maybeSingle();

            // Upsert user_folders entry
            const { data: uf } = await db
                .from("user_folders")
                .upsert(
                    { user_id: user.id, global_folder_id: qfData.folder_id, custom_name: folderData?.name ?? "Genel" },
                    { onConflict: "user_id, global_folder_id" }
                )
                .select("id")
                .single();
            userFolderId = uf?.id ?? null;
        }

        // Upsert user_quizzes
        await db
            .from("user_quizzes")
            .upsert(
                {
                    user_id: user.id,
                    global_quiz_id: quizId,
                    user_folder_id: userFolderId,
                    custom_title: quiz.title,
                    last_accessed_at: new Date().toISOString(),
                },
                { onConflict: "user_id, global_quiz_id" }
            );

        redirect(`/${locale}/dashboard/quiz/${quizId}`);
    }

    // Not logged in → show the landing page with login CTA
    return (
        <QuizImportClient
            quizId={quizId}
            quizTitle={quiz.title ?? ""}
            locale={locale}
        />
    );
}
