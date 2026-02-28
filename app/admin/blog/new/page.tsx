import BlogForm from "@/components/admin/BlogForm";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NewBlogPostPage() {
    return (
        <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-6">
            <div className="flex items-center gap-4">
                <Link href="/admin/blog">
                    <Button variant="ghost" size="icon">
                        <ChevronLeft className="w-5 h-5" />
                    </Button>
                </Link>
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Yeni Blog Yazısı</h1>
                    <p className="text-gray-500 text-sm">İçeriğinizi oluşturun ve SEO ayarlarını yapın.</p>
                </div>
            </div>

            <BlogForm />
        </div>
    );
}
