import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
    const isLocalhost = request.url.includes("localhost") || request.url.includes("127.0.0.1");
    
    if (process.env.NODE_ENV !== "development" && !isLocalhost) {
        return new NextResponse("Not found", { status: 404 });
    }

    try {
        const { email } = await request.json();
        
        // Use the environment variable for safety and convenience
        const targetEmail = process.env.SUPERADMIN_EMAIL || email;

        const supabase = createClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.SUPABASE_SERVICE_ROLE_KEY!
        );

        const { data, error } = await supabase.auth.admin.generateLink({
            type: "magiclink",
            email: targetEmail
        });

        if (error) throw error;

        return NextResponse.json({ 
            email: targetEmail,
            hashed_token: data.properties.hashed_token,
            email_otp: data.properties.email_otp
        });
    } catch (error: any) {
        console.error("Dev login error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
