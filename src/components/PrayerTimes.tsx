import { Sun, Sunrise, Moon, Clock, CloudSun, MapPin, Loader2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { usePrayerTimes } from "@/hooks/usePrayerTimes";
import { useMemo, useState } from "react";
import { Bell } from "lucide-react";
import { Button } from "@/components/ui/button";

const prayerConfig = [
  { name: "Fajr", arabic: "الفجر", icon: Sunrise, key: "Fajr" as const },
  { name: "Sunrise", arabic: "الشروق", icon: Sun, key: "Sunrise" as const },
  { name: "Dhuhr", arabic: "الظهر", icon: CloudSun, key: "Dhuhr" as const },
  { name: "Asr", arabic: "العصر", icon: Sun, key: "Asr" as const },
  { name: "Maghrib", arabic: "المغرب", icon: Sunrise, key: "Maghrib" as const },
  { name: "Isha", arabic: "العشاء", icon: Moon, key: "Isha" as const },
];

const PrayerTimes = () => {
  const { prayerTimes, location, loading, error, currentDate } = usePrayerTimes();

  const [perm, setPerm] = useState(typeof Notification !== "undefined" ? Notification.permission : "denied");
  const enableAlerts = async () => {
    if (typeof Notification === "undefined") return alert("This browser doesn't support notifications.");
    if (window.top !== window.self) return alert("Open the app in its own tab (or the published link) to allow notifications.");
    const r = await Notification.requestPermission();
    setPerm(r);
    if (r === "granted") {
      const reg = await navigator.serviceWorker?.ready;
      reg?.showNotification("Muslim al Muslim", { body: "Adhan alerts are on ✓", icon: "/favicon.ico" });
    } else alert("Notifications are blocked. Allow them in your browser's site settings.");
  };

  const nextPrayer = useMemo(() => {
    if (!prayerTimes) return null;
    
    const now = new Date();
    const currentMinutes = now.getHours() * 60 + now.getMinutes();

    for (const prayer of prayerConfig) {
      if (prayer.key === "Sunrise") continue; // Skip sunrise for next prayer
      
      const time = prayerTimes[prayer.key];
      const [timePart, ampm] = time.split(" ");
      const [hours, minutes] = timePart.split(":").map(Number);
      let hour24 = hours;
      if (ampm === "PM" && hours !== 12) hour24 += 12;
      if (ampm === "AM" && hours === 12) hour24 = 0;
      
      const prayerMinutes = hour24 * 60 + minutes;
      if (prayerMinutes > currentMinutes) {
        return prayer.key;
      }
    }
    
    return "Fajr"; // Next day's Fajr
  }, [prayerTimes]);

  if (loading) {
    return (
      <section id="prayers" className="py-20">
        <div className="container mx-auto px-4">
          <div className="flex flex-col items-center justify-center py-12">
            <Loader2 className="w-8 h-8 text-primary animate-spin mb-4" />
            <p className="text-muted-foreground">Detecting your location...</p>
          </div>
        </div>
      </section>
    );
  }

  if (error && !prayerTimes) {
    return (
      <section id="prayers" className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center py-12">
            <p className="text-destructive mb-2">{error}</p>
            <p className="text-muted-foreground">Please enable location access for accurate prayer times.</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="prayers" className="py-20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <p className="text-gold font-arabic text-xl mb-2">أوقات الصلاة</p>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Prayer Times</h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Stay connected with your daily prayers. Times are calculated based on your location.
          </p>
        </div>

        {/* Current location */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-4 mb-8">
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-foreground">
              {location?.city}, {location?.country}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">{currentDate}</span>
          </div>
        </div>

        <div className="flex justify-center mb-8">
          {perm === "granted" ? (
            <span className="text-sm text-primary flex items-center gap-2"><Bell className="w-4 h-4" /> Adhan alerts on</span>
          ) : (
            <Button onClick={enableAlerts} className="gap-2"><Bell className="w-4 h-4" /> Enable Adhan alerts</Button>
          )}
        </div>

        {/* Prayer cards */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 max-w-5xl mx-auto">
          {prayerConfig.map((prayer, index) => {
            const Icon = prayer.icon;
            const isNext = prayer.key === nextPrayer;
            const time = prayerTimes?.[prayer.key] || "--:--";
            
            return (
              <Card
                key={prayer.name}
                className={`p-6 text-center transition-all duration-300 hover:shadow-elevated hover:-translate-y-1 ${
                  isNext
                    ? "bg-primary text-primary-foreground ring-2 ring-gold shadow-gold"
                    : "bg-card"
                }`}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <Icon className={`w-8 h-8 mx-auto mb-3 ${isNext ? "text-gold" : "text-primary"}`} />
                <p className={`font-arabic text-lg mb-1 ${isNext ? "text-gold" : "text-gold"}`}>
                  {prayer.arabic}
                </p>
                <h3 className={`font-semibold mb-2 ${isNext ? "text-primary-foreground" : "text-foreground"}`}>
                  {prayer.name}
                </h3>
                <p className={`text-lg font-bold ${isNext ? "text-primary-foreground" : "text-foreground"}`}>
                  {time}
                </p>
                {isNext && (
                  <span className="inline-block mt-2 text-xs bg-gold/20 text-gold px-2 py-1 rounded-full">
                    Next Prayer
                  </span>
                )}
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default PrayerTimes;
