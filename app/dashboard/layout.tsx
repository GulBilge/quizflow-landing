import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import Sidebar from "@/components/dashboard/Sidebar";
import MobileNav from "@/components/dashboard/MobileNav";

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
            <div className="hidden md:flex w-64 flex-col fixed inset-y-0 z-50">
                <Sidebar user={user} />
            </div>

            {/* Main Content */}
            <main className="flex-1 md:pl-64 flex flex-col min-h-0 overflow-y-auto pb-20 md:pb-0">
                <div className="flex-1 p-4 md:p-8 pt-6">
                    {children}
                </div>
            </main>

            {/* Mobile Navigation */}
            <div className="md:hidden fixed bottom-0 left-0 right-0 z-50">
                <MobileNav />
            </div>
        </div>
    );
}
