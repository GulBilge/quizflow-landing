import { createClient } from "@/utils/supabase/server";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import { format } from "date-fns";
import { tr } from "date-fns/locale";
import { Calendar, ChevronLeft, Share2 } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import GoogleAd from "@/components/features/ads/GoogleAd";

interface Props {
    params: { slug: string };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { slug } = await params;
    const supabase = await createClient();

    const { data: post } = await supabase
        .from("blog_posts")
        .select("*")
        .eq("slug", slug)
        .eq("is_published", true)
        .single();

    if (!post) return { title: "Yazı Bulunamadı" };

    return {
        title: `${post.title} | Quizyen Blog`,
        description: post.excerpt,
        keywords: post.seo_keywords,
        openGraph: {
            title: post.title,
            description: post.excerpt,
            images: post.cover_image_url ? [post.cover_image_url] : [],
            type: "article",
            publishedTime: post.created_at,
        },
        twitter: {
            card: "summary_large_image",
            title: post.title,
            description: post.excerpt,
            images: post.cover_image_url ? [post.cover_image_url] : [],
        }
    };
}

export default async function BlogDetailPage({ params }: Props) {
    const { slug } = await params;
    const supabase = await createClient();

    const { data: post, error } = await supabase
        .from("blog_posts")
        .select("*")
        .eq("slug", slug)
        .eq("is_published", true)
        .single();

    if (error || !post) {
        return notFound();
    }

    // Check for premium status
    const { data: { session } } = await supabase.auth.getSession();
    let isPremium = false;
    if (session?.user) {
        const { data: profile } = await supabase
            .from("profiles")
            .select("is_pro")
            .eq("id", session.user.id)
            .single();
        isPremium = !!profile?.is_pro;
    }

    return (
        <article className="min-h-screen bg-white">
            {/* Header */}
            <div className="max-w-4xl mx-auto px-4 md:px-8 pt-12 pb-8">
                <Link
                    href="/blog"
                    className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-indigo-600 mb-8 transition-colors"
                >
                    <ChevronLeft className="w-4 h-4" />
                    Blog'a Dön
                </Link>

                <div className="space-y-4">
                    <div className="flex items-center gap-3 text-sm text-gray-400">
                        <span className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            {format(new Date(post.created_at), "d MMMM yyyy", { locale: tr })}
                        </span>
                    </div>
                    <h1 className="text-3xl md:text-5xl font-extrabold text-gray-900 leading-tight">
                        {post.title}
                    </h1>
                </div>
            </div>

            {/* Cover Image */}
            {post.cover_image_url && (
                <div className="max-w-5xl mx-auto px-4 md:px-8 mb-12">
                    <div className="aspect-[21/9] rounded-3xl overflow-hidden shadow-2xl">
                        <img
                            src={post.cover_image_url}
                            alt={post.title}
                            className="w-full h-full object-cover"
                        />
                    </div>
                </div>
            )}

            {/* Content Switched to Prose */}
            <div className="max-w-7xl mx-auto px-4 md:px-8 pb-20">
                <div className="flex flex-col lg:flex-row gap-12">
                    {/* Left Sidebar Ad - Desktop Only */}
                    <aside className="hidden lg:block w-64 shrink-0">
                        <div className="sticky top-24 space-y-4">
                            <div className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-2">Sponsörlü Giriş</div>
                            <GoogleAd 
                                slot="2847291047" 
                                format="vertical" 
                                className="w-full min-h-[600px] rounded-2xl bg-slate-50 border border-slate-100"
                                isPremium={isPremium}
                            />
                        </div>
                    </aside>

                    {/* Main Content Area */}
                    <div className="flex-1 max-w-4xl mx-auto lg:mx-0">
                        <div
                            className="prose prose-indigo lg:prose-xl max-w-none prose-headings:font-bold prose-a:text-indigo-600 mb-12"
                            dangerouslySetInnerHTML={{ __html: post.content }}
                        />

                        {/* Mobile Ad - In Content Flow */}
                        <div className="lg:hidden my-12 py-8 border-y border-slate-100">
                             <div className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-4 text-center">Reklam</div>
                             <GoogleAd 
                                slot="5827394012" 
                                format="auto" 
                                className="w-full min-h-[250px] rounded-2xl bg-slate-50"
                                isPremium={isPremium}
                             />
                        </div>

                        {post.seo_keywords && (
                            <div className="mt-12 pt-8 border-t border-gray-100 flex flex-wrap gap-2">
                                {post.seo_keywords.split(",").map((tag: string) => (
                                    <span
                                        key={tag}
                                        className="px-3 py-1 bg-gray-100 text-gray-500 text-xs rounded-full font-medium"
                                    >
                                        #{tag.trim()}
                                    </span>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </article>
    );
}
