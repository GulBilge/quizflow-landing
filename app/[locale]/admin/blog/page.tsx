import { createClient } from "@/utils/supabase/server";
import { Button } from "@/components/ui/button";
import { Plus, Edit2, Eye, FileText, Megaphone } from "lucide-react";
import Link from "next/link";
import { format } from "date-fns";
import { tr } from "date-fns/locale";

export default async function BlogListingPage() {
    const supabase = await createClient();

    // Fetch published blog posts from the new architecture
    const { data: posts, error } = await supabase
        .from("blog_posts")
        .select(`
            *,
            campaigns!inner (
                title,
                slug,
                status
            )
        `)
        .eq("campaigns.status", "published")
        .eq("is_current", true)
        .order("created_at", { ascending: false });

    if (error) {
        return <div className="p-8 text-red-500">Hata: {error.message}</div>;
    }

    return (
        <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4 border-b border-slate-100 pb-6">
                <div>
                    <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
                        <FileText className="text-indigo-600" /> Yayınlanan Yazılar
                    </h1>
                    <p className="text-slate-500 mt-1">Sitede aktif olarak görünen içerikler.</p>
                </div>
                <Link href="/admin/marketing">
                    <Button className="w-full md:w-auto bg-indigo-600 hover:bg-indigo-700 gap-2">
                        <Megaphone className="w-4 h-4" />
                        Pazarlama Paneli
                    </Button>
                </Link>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead className="bg-slate-50/50 text-slate-500 text-xs uppercase font-semibold">
                            <tr>
                                <th className="px-6 py-4">Başlık / Slug</th>
                                <th className="px-6 py-4">Kampanya Durumu</th>
                                <th className="px-6 py-4">Tarih</th>
                                <th className="px-6 py-4 text-right">Aksiyonlar</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {posts?.map((post: any) => (
                                <tr key={post.id} className="hover:bg-slate-50/50 transition-colors group">
                                    <td className="px-6 py-5">
                                        <div className="max-w-xs md:max-w-md">
                                            <p className="font-bold text-slate-900 group-hover:text-indigo-600 transition-colors uppercase text-sm">{post.campaigns?.title}</p>
                                            <p className="text-xs text-slate-400 font-mono truncate">/{post.campaigns?.slug}</p>
                                        </div>
                                    </td>
                                    <td className="px-6 py-5 text-sm text-slate-500 italic">
                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800 uppercase">
                                            {post.campaigns?.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-5 text-sm text-slate-500 whitespace-nowrap">
                                        {format(new Date(post.created_at), "d MMMM yyyy", { locale: tr })}
                                    </td>
                                    <td className="px-6 py-5 text-right">
                                        <div className="flex items-center justify-end space-x-2">
                                            <Link href={`/blog/${post.campaigns?.slug}`} target="_blank">
                                                <Button variant="ghost" size="icon" title="Görüntüle" className="text-slate-400 hover:text-indigo-600">
                                                    <Eye className="w-4 h-4" />
                                                </Button>
                                            </Link>
                                            <Link href={`/admin/marketing/${post.campaign_id}/review`}>
                                                <Button variant="ghost" size="icon" title="İçeriği İncele" className="text-slate-400 hover:text-indigo-600">
                                                    <Edit2 className="w-4 h-4" />
                                                </Button>
                                            </Link>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {posts?.length === 0 && (
                                <tr>
                                    <td colSpan={4} className="p-20 text-center">
                                        <div className="flex flex-col items-center gap-3">
                                            <div className="w-16 h-16 rounded-full bg-slate-50 flex items-center justify-center text-slate-200">
                                                <FileText className="w-8 h-8" />
                                            </div>
                                            <p className="text-slate-400 font-medium italic">Henüz yayınlanmış bir yazı bulunmuyor.</p>
                                            <Link href="/admin/marketing">
                                                <Button variant="outline" size="sm">Kampanya Listesine Git</Button>
                                            </Link>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
