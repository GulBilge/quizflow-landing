"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";
import { env } from "@/utils/env";
import { Database } from "@/types/database.types";

export type ActionResult<T> = {
    data: T | null;
    error: string | null;
};

// Security check helper (copying logic from main admin actions)
const checkAdminAccess = async (): Promise<ActionResult<boolean>> => {
    try {
        const supabase = await createClient();
        const {
            data: { user },
        } = await supabase.auth.getUser();

        if (!user) {
            return { data: null, error: "Unauthorized" };
        }

        const adminEmails = (env.ADMIN_EMAILS || "")
            .split(",")
            .map((e: string) => e.trim().replace(/['"]+/g, '').toLowerCase());

        const userEmail = (user.email || "").trim().toLowerCase();
        const superAdminEmail = (env.SUPERADMIN_EMAIL || "").trim().toLowerCase();

        if (!adminEmails.includes(userEmail) && userEmail !== superAdminEmail) {
            return { data: null, error: "Unauthorized Access" };
        }
        return { data: true, error: null };
    } catch (e) {
        return { data: null, error: "Security Check Failed" };
    }
};

/**
 * Approves a campaign and its associated content.
 * Triggers the n8n distribution pipeline (placeholder).
 */
export async function approveCampaign(
    campaignId: string,
    data: {
        reviewer_notes?: string;
        updated_blog_content?: string;
        updated_meta_title?: string;
        updated_meta_description?: string;
    }
): Promise<ActionResult<any>> {
    const access = await checkAdminAccess();
    if (access.error) return { data: null, error: access.error };

    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    try {
        // 1. Update Blog Post if there are edits
        if (data.updated_blog_content || data.updated_meta_title || data.updated_meta_description) {
            const { error: blogError } = await supabase
                .from("blog_posts")
                .update({
                    content_markdown: data.updated_blog_content,
                    meta_title: data.updated_meta_title,
                    meta_description: data.updated_meta_description,
                    updated_at: new Date().toISOString(),
                })
                .eq("campaign_id", campaignId)
                .eq("is_current", true);

            if (blogError) throw blogError;
        }

        // 2. Update Campaign Status
        const { data: campaign, error: campaignError } = await supabase
            .from("campaigns")
            .update({
                status: "approved",
                reviewer_notes: data.reviewer_notes,
                reviewed_by: user?.id,
                reviewed_at: new Date().toISOString(),
            })
            .eq("id", campaignId)
            .select()
            .single();

        if (campaignError) throw campaignError;

        // 3. Update Social Posts Status
        const { error: socialError } = await supabase
            .from("social_posts")
            .update({ status: "approved" })
            .eq("campaign_id", campaignId)
            .eq("status", "pending_review");

        // 4. Trigger n8n Placeholder
        await triggerN8nDistribution(campaignId);

        revalidatePath("/admin/marketing");
        revalidatePath(`/admin/marketing/${campaignId}/review`);

        return { data: campaign, error: null };
    } catch (err: any) {
        console.error("[APPROVE_CAMPAIGN_ERROR]", err);
        return { data: null, error: err.message || "Onaylama sırasında bir hata oluştu." };
    }
}

async function triggerN8nDistribution(campaignId: string) {
    console.log(`[N8N_TRIGGER_PLACEHOLDER] campaignId: ${campaignId}`);
    
    const webhookUrl = env.N8N_DISTRIBUTION_WEBHOOK_URL;
    if (!webhookUrl) {
        console.warn("N8N_DISTRIBUTION_WEBHOOK_URL is not set. Skipping real trigger.");
        return;
    }

    // Example of how the real trigger would look
    /*
    await fetch(webhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ campaignId, action: 'approved' })
    });
    */
}
