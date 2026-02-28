"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Trash2, Loader2 } from "lucide-react";
import { createClient } from "@/utils/supabase/client";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export default function DeleteButton({ id, coverImageUrl }: { id: string; coverImageUrl?: string }) {
    const [loading, setLoading] = useState(false);
    const supabase = createClient();
    const router = useRouter();

    const handleDelete = async () => {
        if (!confirm("Bu yazıyı tamamen silmek istediğinizden emin misiniz? Bu işlem geri alınamaz ve görseller de silinecektir.")) {
            return;
        }

        setLoading(true);
        try {
            // 1. Delete the post from DB
            const { error: dbError } = await supabase
                .from("blog_posts")
                .delete()
                .eq("id", id);

            if (dbError) throw dbError;

            // 2. Cleanup Storage (Hard Delete rule)
            if (coverImageUrl) {
                // Extract file path from URL
                // URL example: https://xxx.supabase.co/storage/v1/object/public/blog_images/filename.jpg
                const pathParts = coverImageUrl.split("blog_images/");
                if (pathParts.length > 1) {
                    const filePath = pathParts[1];
                    const { error: storageError } = await supabase.storage
                        .from("blog_images")
                        .remove([filePath]);

                    if (storageError) {
                        console.error("Storage cleanup error:", storageError);
                        // Don't stop the flow if storage removal fails, but log it
                    }
                }
            }

            toast.success("Yazı ve görselleri silindi.");
            router.refresh();
        } catch (error: any) {
            toast.error("Silme hatası: " + error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Button
            variant="ghost"
            size="icon"
            onClick={handleDelete}
            disabled={loading}
            title="Sil"
        >
            {loading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
                <Trash2 className="w-4 h-4 text-red-400" />
            )}
        </Button>
    );
}
