import { createAdminClient } from "@/utils/supabase/admin";
import { NextResponse } from "next/server";
import crypto from "crypto";

// Shopier sends data as application/x-www-form-urlencoded
export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const data: Record<string, string> = {};
    formData.forEach((value, key) => {
      data[key] = value.toString();
    });

    const apiSecret = process.env.SHOPIER_API_SECRET;
    if (!apiSecret) {
      console.error("Shopier API Secret is missing");
      return new Response("Configuration error", { status: 500 });
    }

    // Hash verification
    // Shopier sends 'platform_order_id' and 'random_nr' and 'status'
    // signature = base64_encode(hash_hmac('sha256', random_nr + platform_order_id, api_secret, true))
    
    const { platform_order_id, random_nr, status, installation_id } = data;
    const expectedHash = crypto
      .createHmac("sha256", apiSecret)
      .update(`${random_nr}${platform_order_id}`)
      .digest("base64");

    if (data.res_sig !== expectedHash) {
      console.error("Shopier hash verification failed");
      return new Response("Invalid signature", { status: 401 });
    }

    // Payment Status Check
    if (status !== "success") {
      console.log("Shopier payment status is not success:", status);
      return new Response("Payment not successful", { status: 200 });
    }

    // Extract User IDs from orderId (format: PREMIUM_USERID_TIMESTAMP)
    const orderParts = platform_order_id.split("_");
    if (orderParts.length < 2) {
      console.error("Invalid order ID format:", platform_order_id);
      return new Response("Invalid order ID", { status: 400 });
    }
    const userId = orderParts[1];

    // Update Supabase using Admin Client (Service Role)
    const supabaseAdmin = createAdminClient();

    // calculate expiration (30 days from now)
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 30);

    const { error } = await supabaseAdmin
      .from("profiles")
      .update({
        is_pro: true,
        subscription_status: "active",
        payment_method: "shopier",
        pro_expires_at: expiresAt.toISOString(),
        last_payment_id: platform_order_id
      })
      .eq("id", userId);

    if (error) {
      console.error("Error updating profile via admin client:", error);
      return new Response("Database update failed", { status: 500 });
    }

    console.log(`Successfully activated Premium for user: ${userId}`);
    return new Response("OK", { status: 200 });

  } catch (err: any) {
    console.error("Shopier Callback Error:", err);
    return new Response("Internal Server Error", { status: 500 });
  }
}
