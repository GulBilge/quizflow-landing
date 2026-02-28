"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import Editor from "./Editor";
import { createClient } from "@/utils/supabase/client";
import { toast } from "sonner";
import slugify from "slugify";
import { Loader2, Save, Send, Image as ImageIcon, X } from "lucide-react";

interface BlogFormProps {
    initialData?: any;
    postId?: string;
}

export default function BlogForm({ initialData, postId }: BlogFormProps) {
    const router = useRouter();
    const supabase = createClient();
    const [loading, setLoading] = useState(false);
    const [uploading, setUploading] = useState(false);

    const [formData, setFormData] = useState({
        title: initialData?.title || "",
        slug: initialData?.slug || "",
        content: initialData?.content || "",
        excerpt: initialData?.excerpt || "",
        cover_image_url: initialData?.cover_image_url || "",
        seo_keywords: initialData?.seo_keywords || "",
        is_published: initialData?.is_published || false,
    });

    // Auto-generate slug from title if slug is empty or matches previous title-slug
    useEffect(() => {
        if (!postId && formData.title) {
            const generatedSlug = slugify(formData.title, {
                lower: true,
                strict: true,
                locale: "tr",
            });
            setFormData((prev) => ({ ...prev, slug: generatedSlug }));
        }
    }, [formData.title, postId]);

    const handleUploadCover = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setUploading(true);
        const fileExt = file.name.split(".").pop();
        const fileName = `covers/${Math.random()}.${fileExt}`;

        try {
            const { error: uploadError } = await supabase.storage
                .from("blog_images")
                .upload(fileName, file);

            if (uploadError) throw uploadError;

            const { data: { publicUrl } } = supabase.storage
                .from("blog_images")
                .getPublicUrl(fileName);

            setFormData((prev) => ({ ...prev, cover_image_url: publicUrl }));
            toast.success("Kapak fotoğrafı yüklendi.");
        } catch (error: any) {
            toast.error("Yükleme hatası: " + error.message);
        } finally {
            setUploading(false);
        }
    };

    const handleSubmit = async (publish: boolean) => {
        if (!formData.title || !formData.slug || !formData.content) {
            toast.error("Lütfen zorunlu alanları (Başlık, Slug, İçerik) doldurun.");
            return;
        }

        setLoading(true);
        const payload = {
            ...formData,
            is_published: publish,
            updated_at: new Date().toISOString(),
        };

        try {
            let res;
            if (postId) {
                res = await supabase
                    .from("blog_posts")
                    .update(payload)
                    .eq("id", postId);
            } else {
                // Get current user for author_id
                const { data: { user } } = await supabase.auth.getUser();
                res = await supabase
                    .from("blog_posts")
                    .insert([{ ...payload, author_id: user?.id }]);
            }

            if (res.error) throw res.error;

            toast.success(publish ? "Yazı yayınlandı!" : "Taslak kaydedildi.");
            router.push("/admin/blog");
            router.refresh();
        } catch (error: any) {
            toast.error("Hata: " + error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
                <div className="space-y-2">
                    <Label htmlFor="title">Başlık</Label>
                    <Input
                        id="title"
                        value={formData.title}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        placeholder="Blog başlığı..."
                        className="text-lg font-bold"
                    />
                </div>

                <div className="space-y-2">
                    <Label>İçerik</Label>
                    <Editor
                        content={formData.content}
                        onChange={(content) => setFormData({ ...formData, content })}
                    />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="excerpt">Kısa Özet (Meta Description)</Label>
                    <Textarea
                        id="excerpt"
                        value={formData.excerpt}
                        onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                        placeholder="Arama sonuçlarında görünecek kısa açıklama..."
                        rows={3}
                    />
                </div>
            </div>

            <div className="space-y-6">
                <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm space-y-4">
                    <h3 className="font-bold text-gray-800 border-b pb-2">Yayınlama Ayarları</h3>

                    <div className="flex flex-col gap-2">
                        <Button
                            onClick={() => handleSubmit(true)}
                            disabled={loading}
                            className="w-full"
                        >
                            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                            Hemen Yayınla
                        </Button>
                        <Button
                            variant="outline"
                            onClick={() => handleSubmit(false)}
                            disabled={loading}
                            className="w-full"
                        >
                            <Save className="w-4 h-4" />
                            Taslak Olarak Kaydet
                        </Button>
                    </div>

                    {postId && (
                        <p className="text-xs text-center text-gray-500">
                            Son güncelleme: {new Date(initialData?.updated_at || "").toLocaleString("tr-TR")}
                        </p>
                    )}
                </div>

                <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm space-y-4">
                    <h3 className="font-bold text-gray-800 border-b pb-2">SEO & Görsel</h3>

                    <div className="space-y-2">
                        <Label htmlFor="slug">URL Uzantısı (Slug)</Label>
                        <Input
                            id="slug"
                            value={formData.slug}
                            onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                            placeholder="blog-yazisi-adi"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="keywords">Anahtar Kelimeler (Virgül ile ayırın)</Label>
                        <Input
                            id="keywords"
                            value={formData.seo_keywords}
                            onChange={(e) => setFormData({ ...formData, seo_keywords: e.target.value })}
                            placeholder="nextjs, seo, quizflow"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label>Kapak Görseli</Label>
                        {formData.cover_image_url ? (
                            <div className="relative group rounded-lg overflow-hidden border border-gray-200">
                                <img
                                    src={formData.cover_image_url}
                                    alt="Kapak"
                                    className="w-full h-40 object-cover"
                                />
                                <button
                                    onClick={() => setFormData({ ...formData, cover_image_url: "" })}
                                    className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                                >
                                    <X className="w-4 h-4" />
                                </button>
                            </div>
                        ) : (
                            <div className="border-2 border-dashed border-gray-200 rounded-lg p-8 flex flex-col items-center justify-center text-gray-400">
                                <ImageIcon className="w-8 h-8 mb-2" />
                                <label className="cursor-pointer text-sm text-indigo-600 hover:underline">
                                    Resim Seç
                                    <input
                                        type="file"
                                        className="hidden"
                                        accept="image/*"
                                        onChange={handleUploadCover}
                                    />
                                </label>
                            </div>
                        )}
                        {uploading && <p className="text-xs text-indigo-600 flex items-center gap-1"><Loader2 className="w-3 h-3 animate-spin" /> Yükleniyor...</p>}
                    </div>
                </div>
            </div>
        </div>
    );
}
