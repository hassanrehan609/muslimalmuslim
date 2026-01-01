import { Sun, Sunrise, Moon, Clock, CloudSun } from "lucide-react";
import { Card } from "@/components/ui/card";

const prayers = [
  { name: "Fajr", arabic: "الفجر", time: "5:23 AM", icon: Sunrise, isNext: false },
  { name: "Sunrise", arabic: "الشروق", time: "6:45 AM", icon: Sun, isNext: false },
  { name: "Dhuhr", arabic: "الظهر", time: "12:30 PM", icon: CloudSun, isNext: true },
  { name: "Asr", arabic: "العصر", time: "3:45 PM", icon: Sun, isNext: false },
  { name: "Maghrib", arabic: "المغرب", time: "6:15 PM", icon: Sunrise, isNext: false },
  { name: "Isha", arabic: "العشاء", time: "7:45 PM", icon: Moon, isNext: false },
];

const PrayerTimes = () => {
  return (
    <section id="prayers" className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <p className="text-gold font-arabic text-xl mb-2">أوقات الصلاة</p>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Prayer Times</h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Stay connected with your daily prayers. Times are calculated based on your location.
          </p>
        </div>

        {/* Current location */}
        <div className="flex items-center justify-center gap-2 mb-8">
          <Clock className="w-4 h-4 text-muted-foreground" />
          <span className="text-sm text-muted-foreground">New York, USA • January 1, 2026</span>
        </div>

        {/* Prayer cards */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 max-w-5xl mx-auto">
          {prayers.map((prayer, index) => {
            const Icon = prayer.icon;
            return (
              <Card
                key={prayer.name}
                className={`p-6 text-center transition-all duration-300 hover:shadow-elevated hover:-translate-y-1 ${
                  prayer.isNext
                    ? "bg-primary text-primary-foreground ring-2 ring-gold shadow-gold"
                    : "bg-card"
                }`}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <Icon className={`w-8 h-8 mx-auto mb-3 ${prayer.isNext ? "text-gold" : "text-primary"}`} />
                <p className={`font-arabic text-lg mb-1 ${prayer.isNext ? "text-gold" : "text-gold"}`}>
                  {prayer.arabic}
                </p>
                <h3 className={`font-semibold mb-2 ${prayer.isNext ? "text-primary-foreground" : "text-foreground"}`}>
                  {prayer.name}
                </h3>
                <p className={`text-lg font-bold ${prayer.isNext ? "text-primary-foreground" : "text-foreground"}`}>
                  {prayer.time}
                </p>
                {prayer.isNext && (
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
