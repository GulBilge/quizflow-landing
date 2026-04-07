import { createClient } from "@/utils/supabase/server";
import { notFound } from "next/navigation";
import ReviewContent from "./ReviewContent";

interface Props {
    params: Promise<{ id: string; locale: string }>;
}

export default async function CampaignReviewPage({ params }: Props) {
    const { id } = await params;
    const supabase = await createClient();

    // Fetch campaign data
    const { data: campaign, error: campaignError } = await supabase
        .from("campaigns")
        .select("*")
        .eq("id", id)
        .single();

    if (campaignError || !campaign) {
        return notFound();
    }

    // Fetch associated blog post
    const { data: blogPost } = await supabase
        .from("blog_posts")
        .select("*")
        .eq("campaign_id", id)
        .eq("is_current", true)
        .single();

    // Fetch social posts
    const { data: socialPosts } = await supabase
        .from("social_posts")
        .select("*")
        .eq("campaign_id", id);

    return (
        <div className="min-h-screen bg-slate-50/50">
            <ReviewContent 
                campaign={campaign} 
                blogPost={blogPost} 
                socialPosts={socialPosts || []} 
            />
        </div>
    );
}
