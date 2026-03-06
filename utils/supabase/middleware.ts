import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function updateSession(request: NextRequest, response?: NextResponse) {
    try {
        let res = response || NextResponse.next({
            request: {
                headers: request.headers,
            },
        });

        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
        const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

        if (!supabaseUrl || !supabaseKey) {
            console.error("Middleware: Supabase credentials missing! Check NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY");
            return res;
        }

        const supabase = createServerClient(
            supabaseUrl,
            supabaseKey,
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
                        res = response || NextResponse.next({
                            request: {
                                headers: request.headers,
                            },
                        });
                        cookiesToSet.forEach(({ name, value, options }) =>
                            res.cookies.set(name, value, options)
                        );
                    },
                },
            }
        );
        // ... existing logic but using `res` instead of `response` ...

        const {
            data: { user },
        } = await supabase.auth.getUser();

        if (request.nextUrl.pathname.startsWith("/admin")) {
            // 1. Check if user is logged in
            if (!user) {
                if (request.nextUrl.pathname !== "/admin/login") {
                    const redirectResponse = NextResponse.redirect(new URL("/admin/login", request.url));
                    // Add refreshed cookies to the redirect response
                    res.cookies.getAll().forEach((cookie) => {
                        redirectResponse.cookies.set(cookie.name, cookie.value, cookie);
                    });
                    return redirectResponse;
                }
                return res;
            }

            // 2. Check if user is in the whitelist (ADMIN_EMAILS)
            const adminEmailsEnv = process.env.ADMIN_EMAILS;
            if (!adminEmailsEnv) {
                console.error("Middleware: ADMIN_EMAILS is missing!");
                const redirectResponse = NextResponse.redirect(new URL("/", request.url));
                res.cookies.getAll().forEach((cookie) => {
                    redirectResponse.cookies.set(cookie.name, cookie.value, cookie);
                });
                return redirectResponse;
            }

            const adminEmails = (adminEmailsEnv || "")
                .split(",")
                .map((e) => e.trim().replace(/['"]+/g, '').toLowerCase());
            const userEmail = (user.email || "").trim().toLowerCase();

            console.log("Admin Auth Check:", { userEmail, adminEmails });

            if (!adminEmails.includes(userEmail)) {
                console.log("User not authorized. Redirecting to home.");
                const redirectResponse = NextResponse.redirect(new URL("/", request.url));
                res.cookies.getAll().forEach((cookie) => {
                    redirectResponse.cookies.set(cookie.name, cookie.value, cookie);
                });
                return redirectResponse;
            }

            // If user is logged in and is admin, and trying to go to login page, redirect to dashboard
            if (request.nextUrl.pathname === "/admin/login") {
                const redirectResponse = NextResponse.redirect(new URL("/admin", request.url));
                res.cookies.getAll().forEach((cookie) => {
                    redirectResponse.cookies.set(cookie.name, cookie.value, cookie);
                });
                return redirectResponse;
            }
        }

        return res;
    } catch (e) {
        console.error("Middleware Error:", e);
        // Fallback: Return success to avoid 500 error page, preventing the app from crashing entirely
        return NextResponse.next({
            request: {
                headers: request.headers,
            },
        });
    }
}
