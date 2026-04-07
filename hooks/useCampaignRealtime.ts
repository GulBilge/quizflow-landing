"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { Database } from "@/types/database.types";

type Campaign = Database['public']['Tables']['campaigns']['Row'];
type SocialPost = Database['public']['Tables']['social_posts']['Row'];
type BlogPost = Database['public']['Tables']['blog_posts']['Row'];

export function useCampaignRealtime(campaignId: string) {
    const supabase = createClient();
    const [campaign, setCampaign] = useState<Campaign | null>(null);
    const [socialPosts, setSocialPosts] = useState<SocialPost[]>([]);
    const [blogPost, setBlogPost] = useState<BlogPost | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!campaignId) return;

        const fetchData = async () => {
            setIsLoading(true);
            try {
                const [campRes, socialRes, blogRes] = await Promise.all([
                    supabase.from('campaigns').select('*').eq('id', campaignId).single(),
                    supabase.from('social_posts').select('*').eq('campaign_id', campaignId),
                    supabase.from('blog_posts').select('*').eq('campaign_id', campaignId).eq('is_current', true).maybeSingle()
                ]);

                if (campRes.error) throw campRes.error;
                setCampaign(campRes.data);
                setSocialPosts(socialRes.data || []);
                setBlogPost(blogRes.data);
            } catch (err: any) {
                console.error("Realtime fetch error:", err);
                setError(err.message);
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();

        // Subscribe to changes
        const campaignChannel = supabase
            .channel(`campaign-${campaignId}`)
            .on(
                'postgres_changes',
                {
                    event: '*',
                    schema: 'public',
                    table: 'campaigns',
                    filter: `id=eq.${campaignId}`,
                },
                (payload) => {
                    console.log('Campaign change received!', payload);
                    setCampaign(payload.new as Campaign);
                }
            )
            .on(
                'postgres_changes',
                {
                    event: '*',
                    schema: 'public',
                    table: 'social_posts',
                    filter: `campaign_id=eq.${campaignId}`,
                },
                (payload) => {
                    console.log('Social post change received!', payload);
                    if (payload.eventType === 'INSERT') {
                        setSocialPosts(prev => [...prev, payload.new as SocialPost]);
                    } else if (payload.eventType === 'UPDATE') {
                        setSocialPosts(prev => prev.map(p => p.id === payload.new.id ? payload.new as SocialPost : p));
                    } else if (payload.eventType === 'DELETE') {
                        setSocialPosts(prev => prev.filter(p => p.id !== payload.old.id));
                    }
                }
            )
            .on(
                'postgres_changes',
                {
                    event: '*',
                    schema: 'public',
                    table: 'blog_posts',
                    filter: `campaign_id=eq.${campaignId}`,
                },
                (payload) => {
                    console.log('Blog post change received!', payload);
                    const newBlog = payload.new as BlogPost;
                    if (newBlog.is_current) {
                        setBlogPost(newBlog);
                    }
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(campaignChannel);
        };
    }, [campaignId, supabase]);

    return { campaign, socialPosts, blogPost, isLoading, error };
}
