"use server";

import { createAdminClient } from "@/utils/supabase/admin";
import { createClient } from "@/utils/supabase/server";

const ITEMS_PER_PAGE = 10;

// Security check helper
const checkAdminAccess = async () => {
    const supabase = await createClient();
    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
        throw new Error("Unauthorized");
    }

    const adminEmails = (process.env.ADMIN_EMAILS || "")
        .split(",")
        .map((e) => e.trim().replace(/['"]+/g, '').toLowerCase());

    const userEmail = (user.email || "").trim().toLowerCase();

    if (!adminEmails.includes(userEmail)) {
        throw new Error("Unauthorized Access");
    }
    return true;
};

export async function getKpiAndPopular() {
    await checkAdminAccess();
    const supabaseAdmin = createAdminClient();

    const { data: kpi, error: kpiError } = await supabaseAdmin
        .from("admin_kpi_summary")
        .select("*")
        .single();

    if (kpiError) throw new Error(kpiError.message);

    const { data: popular, error: popularError } = await supabaseAdmin
        .from("admin_popular_quizzes")
        .select("*")
        .limit(10);

    if (popularError) throw new Error(popularError.message);

    return { kpi, popular };
}

export async function getContentFeed(page: number) {
    await checkAdminAccess();
    const supabaseAdmin = createAdminClient();

    const from = page * ITEMS_PER_PAGE;
    const to = from + ITEMS_PER_PAGE - 1;

    const { data, error } = await supabaseAdmin
        .from("admin_content_feed")
        .select("*")
        .range(from, to);

    if (error) throw new Error(error.message);
    return data;
}

export async function getAttemptsFeed(page: number) {
    await checkAdminAccess();
    const supabaseAdmin = createAdminClient();

    const from = page * ITEMS_PER_PAGE;
    const to = from + ITEMS_PER_PAGE - 1;

    const { data, error } = await supabaseAdmin
        .from("admin_attempts_feed")
        .select("*")
        .range(from, to);

    if (error) throw new Error(error.message);
    return data;
}

export async function getUserEngagement() {
    await checkAdminAccess();
    const supabaseAdmin = createAdminClient();

    const { data, error } = await supabaseAdmin
        .from("user_daily_engagement")
        .select("*")
        .order("participation_rate", { ascending: false });

    if (error) throw new Error(error.message);
    return data;
}
