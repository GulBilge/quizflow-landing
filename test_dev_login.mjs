import { createClient } from "@supabase/supabase-js";
import { config } from "dotenv";
config();

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function test() {
    const { data, error } = await supabase.auth.admin.generateLink({
        type: "magiclink",
        email: "gul.bilge00@gmail.com",
    });

    console.log("Error:", error);
    console.log("Data properties:", data?.properties);
}

test();
