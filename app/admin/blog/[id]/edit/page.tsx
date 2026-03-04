import BlogForm from "@/components/features/admin/BlogForm";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { createClient } from "@/utils/supabase/server";
import { Database } from "@/types/database.types";
import { notFound } from "next/navigation";

export default async function EditBlogPostPage({ params }: { params: { id: string } }) {
    const { id } = await params;
    const supabase = await createClient();

    const { data: post, error } = await supabase
        .from("blog_posts")
        .select("*")
        .eq("id", id)
        .single();

    if (error || !post) {
        return notFound();
    }

    return (
        <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-6">
            <div className="flex items-center gap-4">
                <Link href="/admin/blog">
                    <Button variant="ghost" size="icon">
                        <ChevronLeft className="w-5 h-5" />
                    </Button>
                </Link>
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Yazıyı Düzenle</h1>
                    <p className="text-gray-500 text-sm">Mevcut içeriği ve SEO ayarlarını güncelleyin.</p>
                </div>
            </div>

            <BlogForm initialData={post} postId={id} />
        </div>
    );
}
