import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function updateSession(request: NextRequest) {
    let response = NextResponse.next({
        request: {
            headers: request.headers,
        },
    });

    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                getAll() {
                    return request.cookies.getAll();
                },
                setAll(cookiesToSet) {
                    cookiesToSet.forEach(({ name, value, options }) =>
                        request.cookies.set({
                            name,
                            value,
                            ...options,
                        })
                    );
                    response = NextResponse.next({
                        request: {
                            headers: request.headers,
                        },
                    });
                    cookiesToSet.forEach(({ name, value, options }) =>
                        response.cookies.set(name, value, options)
                    );
                },
            },
        }
    );

    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (request.nextUrl.pathname.startsWith("/admin")) {
        // 1. Check if user is logged in
        if (!user) {
            if (request.nextUrl.pathname !== "/admin/login") {
                return NextResponse.redirect(new URL("/admin/login", request.url));
            }
            return response;
        }

        // 2. Check if user is in the whitelist (ADMIN_EMAILS)
        const adminEmails = (process.env.ADMIN_EMAILS || "")
            .split(",")
            .map((e) => e.trim().toLowerCase());
        const userEmail = (user.email || "").trim().toLowerCase();

        console.log("Admin Auth Check:", { userEmail, adminEmails });

        if (!adminEmails.includes(userEmail)) {
            console.log("User not authorized. Redirecting to home.");
            return NextResponse.redirect(new URL("/", request.url));
        }

        // If user is logged in and is admin, and trying to go to login page, redirect to dashboard
        if (request.nextUrl.pathname === "/admin/login") {
            return NextResponse.redirect(new URL("/admin", request.url));
        }
    }

    return response;
}
