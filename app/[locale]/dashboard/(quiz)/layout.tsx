import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

export default async function QuizLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const supabase = await createClient();

    // Safe user check
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        redirect("/?login=true");
    }

    return (
        <div className="min-h-screen w-full bg-slate-50 dark:bg-slate-900 transition-colors duration-300">
            {children}
        </div>
    );
}
