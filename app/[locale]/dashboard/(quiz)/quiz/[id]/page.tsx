import { createClient } from "@/utils/supabase/server";
import { notFound, redirect } from "next/navigation";
import QuizPlayer from "@/components/features/quiz/QuizPlayer";

interface QuizPageProps {
    params: Promise<{ id: string }>;
    searchParams: Promise<{ shared?: string }>;
}

export default async function QuizPage({ params, searchParams }: QuizPageProps) {
    const { id } = await params;
    const { shared } = await searchParams;
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    const isShared = shared === "true";

    if (!user && !isShared) {
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

    let isPremium = false;
    if (user) {
        const { data: profileData } = await (supabase as any)
            .from("profiles")
            .select("is_pro")
            .eq("id", user.id)
            .single();
        isPremium = !!(profileData as any)?.is_pro;
    }

    return (
        <div className="bg-transparent">
            <QuizPlayer
                quiz={quiz as any}
                userId={user?.id as string}
                isPremium={isPremium}
                isShared={isShared}
            />
        </div>
    );
}
