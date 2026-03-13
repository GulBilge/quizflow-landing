import { z } from "zod";

const envSchema = z.object({
    NEXT_PUBLIC_SUPABASE_URL: z.string().url(),
    NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().min(1),
    SUPABASE_SERVICE_ROLE_KEY: z.string().min(1).optional(),
    ADMIN_EMAILS: z.string().optional(),
    SUPERADMIN_EMAIL: z.string().email().optional(),
    NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
});

// For tests, we might not have all env vars, so we only parse if not in test env or if they exist
const isTest = process.env.NODE_ENV === "test";

const envData = {
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL || (isTest ? "https://example.supabase.co" : undefined),
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || (isTest ? "test-key" : undefined),
    SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY,
    ADMIN_EMAILS: process.env.ADMIN_EMAILS,
    SUPERADMIN_EMAIL: process.env.SUPERADMIN_EMAIL,
    NODE_ENV: process.env.NODE_ENV,
};

const parsed = envSchema.safeParse(envData);

if (!parsed.success && !isTest) {
    console.error(
        "❌ Invalid environment variables:",
        JSON.stringify(parsed.error.format(), null, 2)
    );
    throw new Error("Invalid environment variables");
}

export const env = parsed.success ? parsed.data : (envData as any);

export const getURL = () => {
    // For development, we want to be flexible with the origin
    if (process.env.NODE_ENV === "development") {
        return ""; 
    }

    let url =
        process.env.NEXT_PUBLIC_SITE_URL ??
        process.env.NEXT_PUBLIC_VERCEL_URL ?? // Automatically set on Vercel.
        "";

    // Make sure to include `https://` when not localhost.
    url = url.includes("http") ? url : `https://${url}`;
    // Remove trailing slash
    url = url.endsWith("/") ? url.slice(0, -1) : url;
    return url;
};
