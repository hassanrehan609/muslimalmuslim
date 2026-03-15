import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.7.1";
import { encode as hexEncode } from "https://deno.land/std@0.168.0/encoding/hex.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
};

async function hashOTP(otp: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(otp);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  return new TextDecoder().decode(hexEncode(new Uint8Array(hashBuffer)));
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { phone, otp, newPassword } = await req.json();

    // Validate inputs
    if (!phone || typeof phone !== 'string') {
      return new Response(JSON.stringify({ error: 'Phone number is required' }), {
        status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }
    if (!otp || typeof otp !== 'string' || otp.length !== 6) {
      return new Response(JSON.stringify({ error: 'Valid 6-digit OTP is required' }), {
        status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }
    if (!newPassword || typeof newPassword !== 'string' || newPassword.length < 6) {
      return new Response(JSON.stringify({ error: 'Password must be at least 6 characters' }), {
        status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    const cleanPhone = phone.replace(/\D/g, '');
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Find valid, unused OTP for this phone
    const { data: resetRecords, error: fetchError } = await supabase
      .from('password_reset_otps')
      .select('*')
      .eq('phone_number', cleanPhone)
      .eq('used', false)
      .gt('expires_at', new Date().toISOString())
      .order('created_at', { ascending: false })
      .limit(1);

    if (fetchError || !resetRecords || resetRecords.length === 0) {
      return new Response(JSON.stringify({ error: 'Invalid or expired OTP. Please request a new one.' }), {
        status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    const resetRecord = resetRecords[0];

    // Check max attempts (5)
    if (resetRecord.attempts >= 5) {
      await supabase.from('password_reset_otps').update({ used: true }).eq('id', resetRecord.id);
      return new Response(JSON.stringify({ error: 'Too many attempts. Please request a new OTP.' }), {
        status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    // Increment attempts
    await supabase.from('password_reset_otps')
      .update({ attempts: resetRecord.attempts + 1 })
      .eq('id', resetRecord.id);

    // Verify OTP hash
    const otpHash = await hashOTP(otp);
    if (otpHash !== resetRecord.otp_hash) {
      return new Response(JSON.stringify({ error: 'Invalid OTP. Please try again.' }), {
        status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    // Mark OTP as used
    await supabase.from('password_reset_otps').update({ used: true }).eq('id', resetRecord.id);

    // Update password using admin API
    const { error: updateError } = await supabase.auth.admin.updateUserById(
      resetRecord.user_id,
      { password: newPassword }
    );

    if (updateError) {
      console.error('Password update error:', updateError);
      return new Response(JSON.stringify({ error: 'Failed to update password. Please try again.' }), {
        status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    console.log(`Password reset successful for user ${resetRecord.user_id}`);

    return new Response(JSON.stringify({ success: true, message: 'Password updated successfully.' }), {
      status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Reset password error:', error);
    return new Response(JSON.stringify({ error: 'An error occurred. Please try again.' }), {
      status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});
