import { createClient } from "@/utils/supabase/server";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import { format } from "date-fns";
import { tr } from "date-fns/locale";
import { Calendar, ChevronLeft } from "lucide-react";
import Link from "next/link";
import GoogleAd from "@/components/features/ads/GoogleAd";

interface Props {
    params: Promise<{ slug: string; locale: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { slug } = await params;
    const supabase = await createClient();

    const { data: post } = await supabase
        .from("blog_posts")
        .select(`
            *,
            campaigns!inner (
                title,
                slug,
                status
            )
        `)
        .eq("campaigns.slug", slug)
        .eq("campaigns.status", "published")
        .eq("is_current", true)
        .maybeSingle();

    if (!post) return { title: "Yazı Bulunamadı" };

    const campaign = (post as any).campaigns;

    return {
        title: `${post.meta_title} | Quizyen Blog`,
        description: post.meta_description,
        openGraph: {
            title: post.og_title || post.meta_title,
            description: post.og_description || post.meta_description,
            images: [], 
            type: "article",
            publishedTime: post.created_at,
        }
    };
}

export default async function BlogDetailPage({ params }: Props) {
    const { slug } = await params;
    const supabase = await createClient();

    const { data: post, error } = await supabase
        .from("blog_posts")
        .select(`
            *,
            campaigns!inner (
                title,
                slug,
                status
            )
        `)
        .eq("campaigns.slug", slug)
        .eq("campaigns.status", "published")
        .eq("is_current", true)
        .maybeSingle();

    if (error || !post) {
        return notFound();
    }

    const campaign = (post as any).campaigns;

    // Check for premium status
    const { data: { session } } = await supabase.auth.getSession();
    let isPremium = false;
    if (session?.user) {
        const { data: profile } = await supabase
            .from("profiles")
            .select("is_pro")
            .eq("id", session.user.id)
            .maybeSingle();
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
                        {campaign.title}
                    </h1>
                </div>
            </div>

            {/* Content Area */}
            <div className="max-w-7xl mx-auto px-4 md:px-8 pb-20">
                <div className="flex flex-col lg:flex-row gap-12">
                    {/* Left Sidebar Ad - Desktop Only */}
                    <aside className="hidden lg:block w-64 shrink-0">
                        <div className="sticky top-24 space-y-4">
                            <div className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-2">Sponsörlü Giriş</div>
                            <GoogleAd
                                slot="5202700378"
                                format="vertical"
                                className="w-full min-h-[600px] rounded-2xl bg-slate-50 border border-slate-100"
                                isPremium={isPremium}
                            />
                        </div>
                    </aside>

                    {/* Main Content Area */}
                    <div className="flex-1 max-w-4xl mx-auto lg:mx-0">
                        {post.content_html ? (
                            <div
                                className="prose prose-indigo lg:prose-xl max-w-none prose-headings:font-bold prose-a:text-indigo-600 mb-12"
                                dangerouslySetInnerHTML={{ __html: post.content_html }}
                            />
                        ) : (
                            <div className="prose prose-indigo lg:prose-xl max-w-none whitespace-pre-wrap font-sans text-slate-700">
                                {post.content_markdown}
                            </div>
                        )}

                        {/* Mobile Ad - In Content Flow */}
                        <div className="lg:hidden my-12 py-8 border-y border-slate-100">
                            <div className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-4 text-center">Reklam</div>
                            <GoogleAd
                                slot="5202700378"
                                format="auto"
                                className="w-full min-h-[250px] rounded-2xl bg-slate-50"
                                isPremium={isPremium}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </article>
    );
}
