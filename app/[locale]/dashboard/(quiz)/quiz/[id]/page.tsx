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

    const { data: quiz, error: quizError } = await supabase
        .from("quizzes")
        .select("*")
        .eq("id", id)
        .single();

    if (quizError || !quiz) {
        notFound();
    }

    const { data: profileData } = await (supabase as any)
        .from("profiles")
        .select("is_pro")
        .eq("id", user.id)
        .single();

    const isPremium = !!(profileData as any)?.is_pro;

    return (
        <div className="bg-transparent">
            <QuizPlayer
                quiz={quiz as any}
                userId={user.id}
                isPremium={isPremium}
            />
        </div>
    );
}
