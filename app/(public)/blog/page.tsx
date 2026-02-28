import { createClient } from "@/utils/supabase/server";
import Link from "next/link";
import { format } from "date-fns";
import { tr } from "date-fns/locale";
import { ArrowRight, Calendar, User } from "lucide-react";

// Local Card components if not in UI
const BlogCard = ({ post }: { post: any }) => (
    <div className="group bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all overflow-hidden flex flex-col h-full">
        <div className="relative aspect-video overflow-hidden">
            {post.cover_image_url ? (
                <img
                    src={post.cover_image_url}
                    alt={post.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
            ) : (
                <div className="w-full h-full bg-indigo-50 flex items-center justify-center">
                    <span className="text-indigo-200 font-bold text-4xl">Q</span>
                </div>
            )}
        </div>
        <div className="p-6 flex flex-col flex-grow">
            <div className="flex items-center gap-4 text-xs text-gray-400 mb-3">
                <span className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {format(new Date(post.created_at), "d MMM yyyy", { locale: tr })}
                </span>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-indigo-600 transition-colors line-clamp-2">
                {post.title}
            </h3>
            <p className="text-gray-500 text-sm line-clamp-3 mb-4 flex-grow">
                {post.excerpt}
            </p>
            <Link
                href={`/blog/${post.slug}`}
                className="inline-flex items-center gap-2 text-sm font-bold text-indigo-600 hover:gap-3 transition-all"
            >
                Devamını Oku
                <ArrowRight className="w-4 h-4" />
            </Link>
        </div>
    </div>
);

export default async function BlogPage() {
    const supabase = await createClient();

    const { data: posts } = await supabase
        .from("blog_posts")
        .select("*")
        .eq("is_published", true)
        .order("created_at", { ascending: false });

    return (
        <div className="min-h-screen bg-gray-50/50">
            {/* Hero Section */}
            <div className="bg-white border-b border-gray-100 pt-20 pb-16">
                <div className="max-w-7xl mx-auto px-4 md:px-8 text-center">
                    <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 tracking-tight mb-4">
                        Quizyen <span className="text-indigo-600">Blog</span>
                    </h1>
                    <p className="text-lg text-gray-500 max-w-2xl mx-auto">
                        Eğitim teknolojileri, yapay zeka ve verimli çalışma yöntemleri üzerine en güncel içerikler.
                    </p>
                </div>
            </div>

            {/* Grid Section */}
            <div className="max-w-7xl mx-auto px-4 md:px-8 py-12">
                {posts && posts.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {posts.map((post) => (
                            <BlogCard key={post.id} post={post} />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-20">
                        <p className="text-gray-400">Henüz yayınlanmış bir yazı bulunmuyor.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
