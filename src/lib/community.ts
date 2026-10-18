import { supabase } from "@/integrations/supabase/client";

export type PostKind = "manzil" | "quran" | "prayer" | "note";

/** Posts to the community feed. Automatic posts respect the user's auto-share setting (on by default). */
export async function shareToCommunity(kind: PostKind, content: string, opts: { manual?: boolean } = {}) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return false;
  if (!opts.manual) {
    const { data } = await supabase.from("user_prayer_settings").select("auto_share").eq("user_id", user.id).maybeSingle();
    if (data && data.auto_share === false) return false;
  }
  const { data: profile } = await supabase.from("profiles").select("full_name").eq("user_id", user.id).maybeSingle();
  const { error } = await supabase.from("community_posts").insert({
    user_id: user.id,
    author_name: profile?.full_name || "Member",
    kind,
    content: content.slice(0, 500),
  });
  if (error) console.error("community share failed", error);
  return !error;
}

/** Great-circle bearing from a point to the Kaaba, degrees from true north. */
export function qiblaBearing(lat: number, lng: number) {
  const k = { lat: 21.4225, lng: 39.8262 };
  const r = Math.PI / 180;
  const dL = (k.lng - lng) * r;
  const y = Math.sin(dL);
  const x = Math.cos(lat * r) * Math.tan(k.lat * r) - Math.sin(lat * r) * Math.cos(dL);
  return (Math.atan2(y, x) / r + 360) % 360;
}
