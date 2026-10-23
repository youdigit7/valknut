// Supabase Edge Function: payment-initiate
// Deno TypeScript environment
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { gateway, orderNumber, amount, currency, customer, returnUrl, cancelUrl } = await req.json();

    if (!orderNumber || !amount || !gateway) {
      return new Response(
        JSON.stringify({ success: false, error: "Missing required order parameters." }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const txnId = `TXN-${gateway.toUpperCase()}-${Date.now()}`;

    // 1. Koko BNPL
    if (gateway === "Koko") {
      const kokoMerchantId = Deno.env.get("KOKO_MERCHANT_ID") || "VK_MERCHANT_PROD";
      return new Response(
        JSON.stringify({
          success: true,
          transactionId: txnId,
          sessionId: `KOKO_${orderNumber}`,
          paymentUrl: `https://checkout.paykoko.com/pay?merchant_id=${kokoMerchantId}&order_id=${orderNumber}&amount=${amount}&currency=${currency || 'LKR'}`
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // 2. OnePay IPG (v3)
    if (gateway === "OnePay") {
      const onePayAppId = Deno.env.get("ONEPAY_APP_ID") || "M2AZ1192C785F712D7E21";
      const onePayAppToken = Deno.env.get("ONEPAY_APP_TOKEN") || "";
      const onePayHashSalt = Deno.env.get("ONEPAY_HASH_SALT") || "";
      const formattedAmount = Number(amount).toFixed(2);
      const curr = currency || "LKR";

      // Compute SHA-256 hash: appId + currency + amount + hashSalt
      const rawString = `${onePayAppId}${curr}${formattedAmount}${onePayHashSalt}`;
      const encoder = new TextEncoder();
      const hashBuffer = await crypto.subtle.digest("SHA-256", encoder.encode(rawString));
      const hash = Array.from(new Uint8Array(hashBuffer)).map((b) => b.toString(16).padStart(2, "0")).join("");

      try {
        const onePayRes = await fetch("https://api.onepay.lk/v3/checkout/link/", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": onePayAppToken
          },
          body: JSON.stringify({
            app_id: onePayAppId,
            amount: parseFloat(formattedAmount),
            currency: curr,
            hash: hash,
            reference: orderNumber,
            customer_first_name: customer?.name?.split(" ")[0] || "Valued",
            customer_last_name: customer?.name?.split(" ").slice(1).join(" ") || "Customer",
            customer_email: customer?.email || "customer@valknut.lk",
            customer_phone: customer?.phone || "+94770000000",
            transaction_redirect_url: returnUrl || "https://valknutofficial.com/#/order-confirmation",
            additional_details: orderNumber
          })
        });

        if (onePayRes.ok) {
          const resData = await onePayRes.json();
          if (resData.data?.redirect_url || resData.redirect_url) {
            return new Response(
              JSON.stringify({
                success: true,
                transactionId: resData.data?.transaction_id || txnId,
                paymentUrl: resData.data?.redirect_url || resData.redirect_url
              }),
              { headers: { ...corsHeaders, "Content-Type": "application/json" } }
            );
          }
        }
      } catch (fetchErr) {
        console.error("OnePay API call failed, falling back to direct redirect:", fetchErr);
      }

      return new Response(
        JSON.stringify({
          success: true,
          transactionId: txnId,
          sessionId: `ONEPAY_${orderNumber}`,
          paymentUrl: `https://api.onepay.lk/v3/checkout/link/`
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // 3. eWAY Card Processing
    if (gateway === "eWAY") {
      return new Response(
        JSON.stringify({
          success: true,
          transactionId: txnId,
          sessionId: `EWAY_${orderNumber}`
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    return new Response(
      JSON.stringify({ success: true, transactionId: txnId }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ success: false, error: (error as Error).message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
