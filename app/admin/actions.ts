"use server";

import { createAdminClient } from "@/utils/supabase/admin";
import { createClient } from "@/utils/supabase/server";

const ITEMS_PER_PAGE = 10;

import { env } from "@/utils/env";

export type ActionResult<T> = {
    data: T | null;
    error: string | null;
};

// Security check helper
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

        if (!adminEmails.includes(userEmail)) {
            return { data: null, error: "Unauthorized Access" };
        }
        return { data: true, error: null };
    } catch (e) {
        return { data: null, error: "Security Check Failed" };
    }
};

export async function getKpiAndPopular(): Promise<ActionResult<{ kpi: any; popular: any }>> {
    const access = await checkAdminAccess();
    if (access.error) return { data: null, error: access.error };

    const supabaseAdmin = createAdminClient();

    const { data: kpi, error: kpiError } = await supabaseAdmin
        .from("admin_kpi_summary")
        .select("*")
        .single();

    if (kpiError) {
        console.error("KPI Fetch Error:", kpiError);
        return { data: null, error: `Database Error (KPI): ${kpiError.message}` };
    }

    const { data: popular, error: popularError } = await supabaseAdmin
        .from("admin_popular_quizzes")
        .select("*")
        .limit(10);

    if (popularError) {
        console.error("Popular Quizzes Fetch Error:", popularError);
        return { data: null, error: `Database Error (Popular Quizzes): ${popularError.message}` };
    }

    return { data: { kpi, popular }, error: null };
}

export async function getContentFeed(page: number): Promise<ActionResult<any[]>> {
    const access = await checkAdminAccess();
    if (access.error) return { data: null, error: access.error };

    const supabaseAdmin = createAdminClient();

    const from = page * ITEMS_PER_PAGE;
    const to = from + ITEMS_PER_PAGE - 1;

    const { data, error } = await supabaseAdmin
        .from("admin_content_feed")
        .select("*")
        .range(from, to);

    if (error) {
        console.error("Content Feed Fetch Error:", error);
        return { data: null, error: `Database Error (Content Feed): ${error.message}` };
    }
    return { data, error: null };
}

export async function getAttemptsFeed(page: number): Promise<ActionResult<any[]>> {
    const access = await checkAdminAccess();
    if (access.error) return { data: null, error: access.error };

    const supabaseAdmin = createAdminClient();

    const from = page * ITEMS_PER_PAGE;
    const to = from + ITEMS_PER_PAGE - 1;

    const { data, error } = await supabaseAdmin
        .from("admin_attempts_feed")
        .select("*")
        .range(from, to);

    if (error) {
        console.error("Attempts Feed Fetch Error:", error);
        return { data: null, error: `Database Error (Attempts Feed): ${error.message}` };
    }
    return { data, error: null };
}

export async function getUserEngagement(): Promise<ActionResult<any[]>> {
    const access = await checkAdminAccess();
    if (access.error) return { data: null, error: access.error };

    const supabaseAdmin = createAdminClient();

    const { data, error } = await supabaseAdmin
        .from("user_daily_engagement")
        .select("*")
        .order("participation_rate", { ascending: false });

    if (error) {
        console.error("User Engagement Fetch Error:", error);
        return { data: null, error: `Database Error (Engagement): ${error.message}` };
    }
    return { data, error: null };
}
