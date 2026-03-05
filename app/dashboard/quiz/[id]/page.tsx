import { createClient } from "@/utils/supabase/server";
import { notFound, redirect } from "next/navigation";
import QuizPlayer from "@/components/features/quiz/QuizPlayer";

interface QuizPageProps {
    params: Promise<{ id: string }>;
}

export default async function QuizPage({ params }: QuizPageProps) {
    const { id } = await params;
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        redirect("/?login=true");
    }

    const { data: quiz, error } = await supabase
        .from("quizzes")
        .select("*")
        .eq("id", id)
        .single();

    if (error || !quiz) {
        notFound();
    }

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
            <QuizPlayer
                quiz={quiz as any}
                userId={user.id}
            />
        </div>
    );
}
