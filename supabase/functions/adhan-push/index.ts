import webpush from "npm:web-push@3.6.7";
import { createClient } from "npm:@supabase/supabase-js@2";

const cors = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};
const json = (b: unknown, status = 200) => new Response(JSON.stringify(b), { status, headers: { ...cors, "Content-Type": "application/json" } });

const PRAYERS = ["Fajr", "Dhuhr", "Asr", "Maghrib", "Isha"] as const;
const ARABIC: Record<string, string> = { Fajr: "الفجر", Dhuhr: "الظهر", Asr: "العصر", Maghrib: "المغرب", Isha: "العشاء" };

const admin = () => createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!);

/** Local date (DD-MM-YYYY) and minutes-since-midnight in a time zone. */
function localNow(tz: string) {
  const parts = Object.fromEntries(new Intl.DateTimeFormat("en-GB", { timeZone: tz, year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit", hourCycle: "h23" }).formatToParts(new Date()).map((p) => [p.type, p.value]));
  return { date: `${parts.day}-${parts.month}-${parts.year}`, minutes: +parts.hour * 60 + +parts.minute };
}
const toMin = (t: string) => { const [h, m] = t.split(" ")[0].split(":").map(Number); return h * 60 + m; };

async function subscribe(req: Request) {
  const auth = req.headers.get("Authorization");
  if (!auth?.startsWith("Bearer ")) return json({ error: "Unauthorized" }, 401);
  const userClient = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_ANON_KEY")!, { global: { headers: { Authorization: auth } } });
  const { data: claims, error } = await userClient.auth.getClaims(auth.slice(7));
  if (error || !claims?.claims) return json({ error: "Unauthorized" }, 401);

  const body = await req.json().catch(() => null);
  const s = body?.subscription;
  const lat = Number(body?.latitude), lng = Number(body?.longitude);
  const tz = typeof body?.timezone === "string" && body.timezone.length < 64 ? body.timezone : "UTC";
  const reminder = Math.min(60, Math.max(0, Number(body?.reminderMinutes ?? 10) || 0));
  if (!s?.endpoint || !s?.keys?.p256dh || !s?.keys?.auth || !isFinite(lat) || !isFinite(lng) || Math.abs(lat) > 90 || Math.abs(lng) > 180) {
    return json({ error: "Invalid subscription" }, 400);
  }
  try { new Intl.DateTimeFormat("en", { timeZone: tz }); } catch { return json({ error: "Invalid timezone" }, 400); }

  const { error: upErr } = await admin().from("push_subscriptions").upsert({
    user_id: claims.claims.sub, endpoint: s.endpoint, p256dh: s.keys.p256dh, auth: s.keys.auth,
    latitude: lat, longitude: lng, timezone: tz, reminder_minutes: reminder,
    times_date: null, times: null, updated_at: new Date().toISOString(),
  }, { onConflict: "endpoint" });
  if (upErr) { console.error(upErr); return json({ error: "Could not save" }, 500); }

  // Confirmation push so the user knows background alerts work
  try {
    await webpush.sendNotification({ endpoint: s.endpoint, keys: s.keys }, JSON.stringify({ title: "Muslim al Muslim", body: "Adhan alerts are on — they'll ring even when the app is closed ✓", tag: "adhan-setup" }));
  } catch (e) { console.error("confirm push failed", e); }
  return json({ ok: true });
}

/** Called every minute by the scheduler: sends due reminders and Adhan alerts. Idempotent. */
async function run() {
  const db = admin();
  const { data: subs, error } = await db.from("push_subscriptions").select("*");
  if (error) { console.error(error); return json({ error: "load failed" }, 500); }
  let sent = 0;
  for (const s of subs ?? []) {
    try {
      const now = localNow(s.timezone);
      let times = s.times as Record<string, string> | null;
      let sentMap = (s.sent ?? {}) as Record<string, boolean>;
      if (s.times_date !== now.date || !times) {
        const r = await fetch(`https://api.aladhan.com/v1/timings/${now.date}?latitude=${s.latitude}&longitude=${s.longitude}&method=1&timezonestring=${encodeURIComponent(s.timezone)}`);
        if (!r.ok) { console.error("aladhan", r.status, await r.text()); continue; }
        times = (await r.json()).data.timings;
        sentMap = {};
        await db.from("push_subscriptions").update({ times, times_date: now.date, sent: {} }).eq("id", s.id);
      }
      for (const p of PRAYERS) {
        const at = toMin(times![p]);
        const jobs: [string, number, { title: string; body: string }][] = [
          [`${p}-adhan`, at, { title: `${p} — ${ARABIC[p]}`, body: `It's time for ${p} prayer. حَيَّ عَلَى الصَّلَاةِ` }],
        ];
        if (s.reminder_minutes > 0) jobs.push([`${p}-rem`, at - s.reminder_minutes, { title: `${p} in ${s.reminder_minutes} minutes`, body: `Prepare for ${p} (${ARABIC[p]}) prayer` }]);
        for (const [key, due, msg] of jobs) {
          // Fire within a 5-minute window after the due time, once per day
          if (sentMap[key] || now.minutes < due || now.minutes > due + 5) continue;
          sentMap[key] = true;
          await db.from("push_subscriptions").update({ sent: sentMap }).eq("id", s.id);
          try {
            await webpush.sendNotification({ endpoint: s.endpoint, keys: { p256dh: s.p256dh, auth: s.auth } }, JSON.stringify({ ...msg, tag: key }), { TTL: 600, urgency: "high" });
            sent++;
          } catch (e: any) {
            if (e?.statusCode === 404 || e?.statusCode === 410) { await db.from("push_subscriptions").delete().eq("id", s.id); break; }
            console.error("push failed", e?.statusCode, e?.body);
          }
        }
      }
    } catch (e) { console.error("sub error", s.id, e); }
  }
  return json({ ok: true, checked: subs?.length ?? 0, sent });
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: cors });
  const pub = Deno.env.get("VAPID_PUBLIC_KEY"), priv = Deno.env.get("VAPID_PRIVATE_KEY");
  if (!pub || !priv) return json({ error: "Push not configured" }, 500);
  webpush.setVapidDetails("mailto:support@muslimalmuslim.app", pub, priv);
  const action = new URL(req.url).searchParams.get("action");
  try {
    if (action === "subscribe") return await subscribe(req);
    if (action === "run") return await run();
    return json({ error: "Unknown action" }, 400);
  } catch (e) {
    console.error(e);
    return json({ error: "Server error" }, 500);
  }
});
