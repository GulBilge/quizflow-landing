import { createClient } from "@/utils/supabase/server";
import { Database } from "@/types/database.types";
import { Button } from "@/components/ui/button";
import { Plus, Edit2, Trash2, Eye, FileText } from "lucide-react";
import Link from "next/link";
import { format } from "date-fns";
import { tr } from "date-fns/locale";
import DeleteButton from "./DeleteButton";

export default async function BlogListingPage() {
    const supabase = await createClient(); // Already has Database generic in server.ts

    const { data: posts, error } = await supabase
        .from("blog_posts")
        .select("*")
        .order("created_at", { ascending: false });

    if (error) {
        return <div className="p-8 text-red-500">Hata: {error.message}</div>;
    }

    return (
        <div className="p-4 md:p-8 max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
                <div>
                    <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900 tracking-tight">Blog Yönetimi</h1>
                    <p className="text-gray-500 mt-1">SEO uyumlu makaleleri oluşturun ve yönetin.</p>
                </div>
                <Link href="/admin/blog/new">
                    <Button className="w-full md:w-auto">
                        <Plus className="w-4 h-4" />
                        Yeni Yazı Ekle
                    </Button>
                </Link>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead className="bg-gray-50 text-gray-500 text-xs uppercase font-semibold">
                            <tr>
                                <th className="px-6 py-4">Görsel</th>
                                <th className="px-6 py-4">Başlık / Slug</th>
                                <th className="px-6 py-4">Durum</th>
                                <th className="px-6 py-4">Tarih</th>
                                <th className="px-6 py-4 text-right">Aksiyonlar</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {(posts as any)?.map((post: any) => (
                                <tr key={post.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="w-16 h-10 rounded bg-gray-100 overflow-hidden border border-gray-100 flex items-center justify-center">
                                            {post.cover_image_url ? (
                                                <img
                                                    src={post.cover_image_url}
                                                    alt={post.title}
                                                    className="w-full h-full object-cover"
                                                />
                                            ) : (
                                                <FileText className="w-4 h-4 text-gray-400" />
                                            )}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="max-w-xs md:max-w-md">
                                            <p className="font-bold text-gray-900 truncate">{post.title}</p>
                                            <p className="text-xs text-gray-400 font-mono truncate">/{post.slug}</p>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        {post.is_published ? (
                                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                                Yayınlandı
                                            </span>
                                        ) : (
                                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                                                Taslak
                                            </span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-500 whitespace-nowrap">
                                        {format(new Date(post.created_at), "d MMMM yyyy", { locale: tr })}
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex items-center justify-end space-x-2">
                                            <Link href={`/blog/${post.slug}`} target="_blank">
                                                <Button variant="ghost" size="icon" title="Görüntüle">
                                                    <Eye className="w-4 h-4 text-gray-400" />
                                                </Button>
                                            </Link>
                                            <Link href={`/admin/blog/${post.id}/edit`}>
                                                <Button variant="ghost" size="icon" title="Düzenle">
                                                    <Edit2 className="w-4 h-4 text-indigo-500" />
                                                </Button>
                                            </Link>
                                            <DeleteButton id={post.id} coverImageUrl={post.cover_image_url} />
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {posts?.length === 0 && (
                                <tr>
                                    <td colSpan={5} className="p-12 text-center text-gray-400">
                                        Henüz blog yazısı bulunmuyor.
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
