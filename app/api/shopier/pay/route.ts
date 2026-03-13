import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";
import crypto from "crypto";
import { getURL } from "@/utils/env";

export async function POST(req: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Fetch user details from profile
    const { data: profile } = await (supabase
      .from("profiles")
      .select("email, full_name")
      .eq("id", user.id)
      .single() as any);

    const apiKey = process.env.SHOPIER_API_KEY;
    const apiSecret = process.env.SHOPIER_API_SECRET;

    if (!apiKey || !apiSecret) {
      console.error("Shopier API keys are missing");
      return NextResponse.json({ error: "Configuration error" }, { status: 500 });
    }

    // Payment Details
    const userEmail = profile?.email || user.email;
    const userName = profile?.full_name || "User";
    const amount = 99; // 99 TL
    const orderId = `PREMIUM_${user.id}_${Date.now()}`;
    const callbackUrl = `${getURL()}/api/shopier/callback`;

    // Shopier Required Fields
    const shopier_data = {
      API_KEY: apiKey,
      USER_ID: user.id,
      USER_NAME: userName,
      USER_SURNAME: "", // Assuming empty or parsed from full_name
      USER_EMAIL: userEmail,
      USER_PHONE: "05000000000", // Placeholder if not in profile
      USER_ADDRESS: "Turkey", // Placeholder
      USER_CITY: "Istanbul", // Placeholder
      USER_COUNTRY: "Turkey", // Placeholder
      USER_POSTCODE: "34000", // Placeholder
      ORDER_ID: orderId,
      ORDER_AMOUNT: amount,
      CURRENCY: 0, // 0 for TL
      PRODUCT_NAME: "Quizyen Premium Monthly",
      CALLBACK_URL: callbackUrl,
    };

    // Signature Generation
    // Formula: hash_hmac('sha256', $user_id . $user_email . $order_amount . $order_id . $currency . $payment_type, $api_secret, true);
    // Note: Shopier might have different versions, this is standard HMAC-SHA256

    const dataToHash = `${shopier_data.USER_ID}${shopier_data.USER_EMAIL}${shopier_data.ORDER_AMOUNT}${shopier_data.ORDER_ID}${shopier_data.CURRENCY}1`; // 1 for payment_type usually
    const signature = crypto
      .createHmac("sha256", apiSecret)
      .update(dataToHash)
      .digest("base64");

    // Shopier Payment Form (Redirect)
    // In a real scenario, you usually send this to Shopier's endpoint.
    // For this implementation, we will return the "auto-submit form" HTML as requested in ADIM 3.

    const formHtml = `
      <form action="https://www.shopier.com/ShowProduct/api/pay4.php" method="POST" id="shopier_form">
        <input type="hidden" name="API_KEY" value="${apiKey}">
        <input type="hidden" name="USER_ID" value="${shopier_data.USER_ID}">
        <input type="hidden" name="USER_NAME" value="${shopier_data.USER_NAME}">
        <input type="hidden" name="USER_SURNAME" value="${shopier_data.USER_SURNAME}">
        <input type="hidden" name="USER_EMAIL" value="${shopier_data.USER_EMAIL}">
        <input type="hidden" name="USER_PHONE" value="${shopier_data.USER_PHONE}">
        <input type="hidden" name="USER_ADDRESS" value="${shopier_data.USER_ADDRESS}">
        <input type="hidden" name="USER_CITY" value="${shopier_data.USER_CITY}">
        <input type="hidden" name="USER_COUNTRY" value="${shopier_data.USER_COUNTRY}">
        <input type="hidden" name="USER_POSTCODE" value="${shopier_data.USER_POSTCODE}">
        <input type="hidden" name="ORDER_ID" value="${shopier_data.ORDER_ID}">
        <input type="hidden" name="ORDER_AMOUNT" value="${shopier_data.ORDER_AMOUNT}">
        <input type="hidden" name="CURRENCY" value="${shopier_data.CURRENCY}">
        <input type="hidden" name="PRODUCT_NAME" value="${shopier_data.PRODUCT_NAME}">
        <input type="hidden" name="CALLBACK_URL" value="${shopier_data.CALLBACK_URL}">
        <input type="hidden" name="signature" value="${signature}">
      </form>
      <script type="text/javascript">
        document.getElementById('shopier_form').submit();
      </script>
    `;

    return NextResponse.json({ form: formHtml });

  } catch (err: any) {
    console.error("Shopier Pay Error:", err);
    return NextResponse.json({ error: "Payment initiation failed" }, { status: 500 });
  }
}
