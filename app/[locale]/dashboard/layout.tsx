import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import Sidebar from "@/components/features/dashboard/Sidebar";
import Header from "@/components/layout/Header";

export default async function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const supabase = await createClient(); // Await the promise

    // Safe user check
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        redirect("/?login=true");
    }

    return (
        <div className="flex h-screen bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100 transition-colors duration-300">
            {/* Desktop Sidebar */}
            <div className="hidden lg:flex w-64 flex-col fixed inset-y-0 z-50">
                <Sidebar user={user} />
            </div>

            {/* Main Content Area */}
            <div className="flex-1 lg:pl-64 flex flex-col min-h-0 relative">
                <Header user={user} />

                <main className="flex-1 flex flex-col min-h-0 overflow-y-auto">
                    <div className="flex-1 p-3 sm:p-4 lg:p-8">
                        {children}
                    </div>
                </main>
            </div>

        </div>
    );
}
