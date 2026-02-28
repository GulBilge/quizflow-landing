import Sidebar from "@/components/admin/Sidebar";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Quizyen Admin | Yönetim Paneli",
    description: "Quizyen Yönetim Paneli",
};

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="min-h-screen bg-gray-50 text-gray-900 font-sans">
            <Sidebar />
            <main className="md:pl-64 transition-all duration-300 min-h-screen">
                <div className="pt-16 md:pt-0">
                    {children}
                </div>
            </main>
        </div>
    );
}
