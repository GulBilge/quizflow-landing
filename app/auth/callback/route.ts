import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";
import { getURL } from "@/utils/env";

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const code = searchParams.get("code");
    const locale = searchParams.get("locale") ?? "tr";
    // if "next" is in param, use it as the redirect URL
    const next = searchParams.get("next") ?? "/dashboard";

    const origin = new URL(request.url).origin;

    if (code) {
        const supabase = await createClient();
        const { error } = await supabase.auth.exchangeCodeForSession(code);
        if (!error) {
            // Redirect to the localized dashboard using the same origin
            return NextResponse.redirect(`${origin}/${locale}${next}`);
        }
    }

    // return the user to an error page with instructions
    return NextResponse.redirect(`${origin}/${locale}/auth-code-error`);
}
