import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";
import { getURL } from "@/utils/env";

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const code = searchParams.get("code");
    const locale = searchParams.get("locale") ?? "tr";
    // if "next" is in param, use it as the redirect URL
    const next = searchParams.get("next") ?? "/dashboard";

    if (code) {
        const supabase = await createClient();
        const { error } = await supabase.auth.exchangeCodeForSession(code);
        if (!error) {
            // Redirect to the localized dashboard
            return NextResponse.redirect(`${getURL()}/${locale}${next}`);
        }
    }

    // return the user to an error page with instructions
    return NextResponse.redirect(`${getURL()}/${locale}/auth-code-error`);
}
