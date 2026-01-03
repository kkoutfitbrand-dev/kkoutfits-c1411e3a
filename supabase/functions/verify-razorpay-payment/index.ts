import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Verify authentication
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      console.error('Missing authorization header');
      return new Response(
        JSON.stringify({ error: 'Unauthorized', verified: false }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Validate JWT and get user
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseAnonKey, {
      global: { headers: { Authorization: authHeader } }
    });

    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      console.error('Authentication failed:', authError?.message);
      return new Response(
        JSON.stringify({ error: 'Unauthorized', verified: false }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('Authenticated user:', user.id);

    const { 
      razorpay_order_id, 
      razorpay_payment_id, 
      razorpay_signature,
      // Order details to create order after successful payment
      order_data
    } = await req.json();

    console.log('Verifying Razorpay payment:', { razorpay_order_id, razorpay_payment_id, userId: user.id });

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      console.error('Missing payment details');
      return new Response(
        JSON.stringify({ error: 'Missing payment details', verified: false }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const keySecret = Deno.env.get('RAZORPAY_KEY_SECRET');

    if (!keySecret) {
      console.error('Razorpay key secret not configured');
      return new Response(
        JSON.stringify({ error: 'Payment gateway not configured', verified: false }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Verify signature using HMAC SHA256
    const encoder = new TextEncoder();
    const key = await crypto.subtle.importKey(
      'raw',
      encoder.encode(keySecret),
      { name: 'HMAC', hash: 'SHA-256' },
      false,
      ['sign']
    );

    const message = `${razorpay_order_id}|${razorpay_payment_id}`;
    const signature = await crypto.subtle.sign('HMAC', key, encoder.encode(message));
    
    // Convert to hex
    const generatedSignature = Array.from(new Uint8Array(signature))
      .map(b => b.toString(16).padStart(2, '0'))
      .join('');

    const isValid = generatedSignature === razorpay_signature;

    console.log('Signature verification:', { isValid });

    if (!isValid) {
      console.error('Invalid payment signature');
      return new Response(
        JSON.stringify({ error: 'Payment verification failed', verified: false }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Create order in database only after successful payment verification
    // Use the authenticated user's ID, NOT the client-supplied user_id
    let orderId = null;
    if (order_data) {
      // Validate that the order belongs to the authenticated user
      if (order_data.user_id && order_data.user_id !== user.id) {
        console.error('User ID mismatch:', { orderUserId: order_data.user_id, authUserId: user.id });
        return new Response(
          JSON.stringify({ error: 'Unauthorized: user mismatch', verified: false }),
          { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
      const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

      const { data: orderResult, error: insertError } = await supabaseAdmin
        .from('orders')
        .insert([{
          user_id: user.id, // Always use authenticated user's ID
          order_items: order_data.order_items,
          total_cents: order_data.total_cents,
          shipping_address: order_data.shipping_address,
          status: 'paid',
          payment_method: 'online',
          stripe_payment_intent_id: razorpay_payment_id,
          coupon_code: order_data.coupon_code || null,
          coupon_discount_cents: order_data.coupon_discount_cents || 0
        }])
        .select('id')
        .single();

      if (insertError) {
        console.error('Error creating order:', insertError);
        return new Response(
          JSON.stringify({ error: 'Failed to create order', verified: true }),
          { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      orderId = orderResult.id;
      console.log('Order created successfully:', orderId);

      // Clear user's cart using authenticated user's ID
      const { error: cartError } = await supabaseAdmin
        .from('carts')
        .update({ items: [] })
        .eq('user_id', user.id);

      if (cartError) {
        console.error('Error clearing cart:', cartError);
        // Don't fail - order is already created
      }
    }

    return new Response(
      JSON.stringify({ 
        verified: true,
        paymentId: razorpay_payment_id,
        orderId: orderId
      }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error verifying payment:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error', verified: false }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
