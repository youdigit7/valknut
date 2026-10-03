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

    // 2. OnePay IPG
    if (gateway === "OnePay") {
      const onePayAppId = Deno.env.get("ONEPAY_APP_ID") || "VK_ONEPAY_PROD";
      return new Response(
        JSON.stringify({
          success: true,
          transactionId: txnId,
          sessionId: `ONEPAY_${orderNumber}`,
          paymentUrl: `https://merchant.onepay.lk/ipg/pay?app_id=${onePayAppId}&reference=${orderNumber}&amount=${amount}`
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
