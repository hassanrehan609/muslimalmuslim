import { useEffect, useState } from "react";
import { Bell, Compass, Loader2, MapPin, Search, Share2 } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useLanguage } from "@/contexts/LanguageContext";
import { qiblaBearing, shareToCommunity } from "@/lib/community";
import { toast } from "sonner";

const PRAYERS = [
  ["Fajr", "الفجر", "فجر"], ["Sunrise", "الشروق", "طلوع"], ["Dhuhr", "الظهر", "ظہر"],
  ["Asr", "العصر", "عصر"], ["Maghrib", "المغرب", "مغرب"], ["Isha", "العشاء", "عشاء"],
] as const;

type Place = { city: string; country: string; latitude: number; longitude: number };
const fmt = (t: string) => { const [h, m] = t.split(" ")[0].split(":").map(Number); return `${h % 12 || 12}:${String(m).padStart(2, "0")} ${h >= 12 ? "PM" : "AM"}`; };

const PrayerTimesPage = () => {
  const { user } = useAuth();
  const { language } = useLanguage();
  const ur = language === "ur";
  const [query, setQuery] = useState("");
  const [place, setPlace] = useState<Place | null>(null);
  const [times, setTimes] = useState<Record<string, string> | null>(null);
  const [loading, setLoading] = useState(true);

  const loadTimes = async (p: Place) => {
    const d = new Date();
    const r = await fetch(`https://api.aladhan.com/v1/timings/${d.getDate()}-${d.getMonth() + 1}-${d.getFullYear()}?latitude=${p.latitude}&longitude=${p.longitude}&method=1`);
    const j = await r.json();
    setTimes(j.data.timings);
    setPlace(p);
  };

  // Load the city saved to this account (so every phone shows the same city)
  useEffect(() => {
    if (!user) return;
    (async () => {
      const { data } = await supabase.from("user_prayer_settings").select("*").eq("user_id", user.id).maybeSingle();
      if (data?.latitude != null && data.longitude != null) {
        await loadTimes({ city: data.city || "", country: data.country || "", latitude: data.latitude, longitude: data.longitude });
      } else {
        await loadTimes({ city: "Makkah", country: "Saudi Arabia", latitude: 21.4225, longitude: 39.8262 });
      }
      setLoading(false);
    })();
  }, [user]);

  const save = async (p: Place) => {
    await loadTimes(p);
    if (user) await supabase.from("user_prayer_settings").upsert({ user_id: user.id, ...p, updated_at: new Date().toISOString() });
    toast.success(ur ? "شہر محفوظ ہو گیا — تمام فونز پر" : "City saved — synced to all your phones");
  };

  const searchCity = async () => {
    if (!query.trim()) return;
    setLoading(true);
    try {
      const r = await fetch(`https://nominatim.openstreetmap.org/search?format=json&limit=1&addressdetails=1&q=${encodeURIComponent(query)}`);
      const [hit] = await r.json();
      if (!hit) { toast.error(ur ? "شہر نہیں ملا" : "City not found"); return; }
      const a = hit.address || {};
      await save({ city: a.city || a.town || a.village || hit.display_name.split(",")[0], country: a.country || "", latitude: +hit.lat, longitude: +hit.lon });
    } catch { toast.error(ur ? "تلاش ناکام" : "Search failed"); } finally { setLoading(false); }
  };

  const useMyLocation = () => {
    if (!navigator.geolocation) return;
    setLoading(true);
    navigator.geolocation.getCurrentPosition(async ({ coords }) => {
      let city = "", country = "";
      try {
        const r = await fetch(`https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${coords.latitude}&longitude=${coords.longitude}&localityLanguage=en`);
        const j = await r.json(); city = j.city || j.locality || ""; country = j.countryName || "";
      } catch { /* name optional */ }
      await save({ city, country, latitude: coords.latitude, longitude: coords.longitude });
      setLoading(false);
    }, () => { setLoading(false); toast.error(ur ? "مقام کی اجازت نہیں ملی" : "Location permission denied"); });
  };

  const testAlert = async () => {
    if (!("Notification" in window)) return toast.error("Notifications not supported");
    if (window.top !== window.self) return toast.error(ur ? "ایپ کو الگ ٹیب میں کھولیں" : "Open the published app in its own tab to test alerts");
    const p = await Notification.requestPermission();
    if (p !== "granted") return toast.error(ur ? "براؤزر سیٹنگز میں اجازت دیں" : "Allow notifications in browser site settings");
    const reg = await navigator.serviceWorker?.ready;
    if (reg) await reg.showNotification("Muslim al Muslim", { body: ur ? "اذان الرٹ کام کر رہا ہے ✓" : "Adhan alerts are working ✓", icon: "/favicon.ico" });
    else new Notification("Muslim al Muslim", { body: "Adhan alerts are working ✓" });
  };

  const qibla = place ? Math.round(qiblaBearing(place.latitude, place.longitude)) : 0;

  return (
    <div className="min-h-screen bg-transparent">
      <Header />
      <main className="container mx-auto px-4 py-10 max-w-3xl space-y-6">
        <div className="text-center">
          <p className="text-gold font-arabic text-xl">أوقات الصلاة</p>
          <h1 className="text-3xl font-bold text-foreground">{ur ? "نماز کے اوقات" : "Prayer Times"}</h1>
        </div>

        <Card className="p-4 space-y-3">
          <div className="flex gap-2">
            <Input value={query} onChange={(e) => setQuery(e.target.value)} onKeyDown={(e) => e.key === "Enter" && searchCity()} placeholder={ur ? "کوئی بھی شہر لکھیں…" : "Type any city, e.g. Lahore"} />
            <Button onClick={searchCity} aria-label="Search"><Search className="w-4 h-4" /></Button>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" size="sm" onClick={useMyLocation}><MapPin className="w-4 h-4 mr-1" />{ur ? "میرا مقام" : "Use my location"}</Button>
            <Button variant="outline" size="sm" onClick={testAlert}><Bell className="w-4 h-4 mr-1" />{ur ? "الرٹ آزمائیں" : "Test Adhan alert"}</Button>
            {place && times && (
              <Button variant="outline" size="sm" onClick={async () => {
                const ok = await shareToCommunity("prayer", `🕌 ${place.city}: Fajr ${fmt(times.Fajr)} · Dhuhr ${fmt(times.Dhuhr)} · Asr ${fmt(times.Asr)} · Maghrib ${fmt(times.Maghrib)} · Isha ${fmt(times.Isha)}`, { manual: true });
                ok ? toast.success(ur ? "کمیونٹی میں شیئر ہو گیا" : "Shared to community") : toast.error("Share failed");
              }}><Share2 className="w-4 h-4 mr-1" />{ur ? "شیئر" : "Share"}</Button>
            )}
          </div>
        </Card>

        {loading || !times ? (
          <div className="flex justify-center py-10"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>
        ) : (
          <>
            <p className="text-center text-sm text-muted-foreground flex items-center justify-center gap-1">
              <MapPin className="w-4 h-4 text-primary" />{place?.city}{place?.country ? `, ${place.country}` : ""}
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {PRAYERS.map(([key, ar, u]) => (
                <Card key={key} className="p-4 text-center">
                  <p className="font-arabic text-gold">{ar}</p>
                  <p className="font-semibold text-foreground">{ur ? u : key}</p>
                  <p className="text-lg font-bold text-foreground">{fmt(times[key])}</p>
                </Card>
              ))}
            </div>
            <Card className="p-6 flex items-center gap-6">
              <div className="relative w-24 h-24 rounded-full border-2 border-gold/50 flex items-center justify-center shrink-0">
                <span className="absolute top-1 text-[10px] text-muted-foreground">N</span>
                <Compass className="w-10 h-10 text-primary" style={{ transform: `rotate(${qibla - 45}deg)` }} />
              </div>
              <div>
                <p className="font-semibold text-foreground">{ur ? "قبلہ کی سمت" : "Qibla direction"}</p>
                <p className="text-2xl font-bold text-primary">{qibla}°</p>
                <p className="text-xs text-muted-foreground">{ur ? "شمال سے گھڑی کی سمت" : "clockwise from true north"}</p>
              </div>
            </Card>
          </>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default PrayerTimesPage;
