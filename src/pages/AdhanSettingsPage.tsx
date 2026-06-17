import { useState, useEffect } from "react";
import { Bell, Volume2, Clock, ArrowLeft, Check } from "lucide-react";
import { Link } from "react-router-dom";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

interface PrayerSettings {
  enabled: boolean;
  reminderMinutes: number;
  adhanSound: string;
}

interface AdhanSettings {
  fajr: PrayerSettings;
  dhuhr: PrayerSettings;
  asr: PrayerSettings;
  maghrib: PrayerSettings;
  isha: PrayerSettings;
  globalVolume: number;
}

const defaultSettings: AdhanSettings = {
  fajr: { enabled: true, reminderMinutes: 15, adhanSound: "makkah" },
  dhuhr: { enabled: true, reminderMinutes: 10, adhanSound: "makkah" },
  asr: { enabled: true, reminderMinutes: 10, adhanSound: "makkah" },
  maghrib: { enabled: true, reminderMinutes: 5, adhanSound: "makkah" },
  isha: { enabled: true, reminderMinutes: 10, adhanSound: "makkah" },
  globalVolume: 80,
};

const adhanSounds = [
  { id: "makkah", name: "Makkah", arabic: "مكة المكرمة" },
  { id: "madinah", name: "Madinah", arabic: "المدينة المنورة" },
  { id: "alaqsa", name: "Al-Aqsa", arabic: "المسجد الأقصى" },
  { id: "mishary", name: "Mishary Rashid", arabic: "مشاري راشد" },
];

const prayerNames = [
  { key: "fajr", name: "Fajr", arabic: "الفجر" },
  { key: "dhuhr", name: "Dhuhr", arabic: "الظهر" },
  { key: "asr", name: "Asr", arabic: "العصر" },
  { key: "maghrib", name: "Maghrib", arabic: "المغرب" },
  { key: "isha", name: "Isha", arabic: "العشاء" },
];

const AdhanSettingsPage = () => {
  const [settings, setSettings] = useState<AdhanSettings>(defaultSettings);
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    // Load saved settings
    const saved = localStorage.getItem("adhanSettings");
    if (saved) {
      setSettings(JSON.parse(saved));
    }

    // Check notification permission
    if ("Notification" in window) {
      setNotificationsEnabled(Notification.permission === "granted");
    }
  }, []);

  const saveSettings = () => {
    localStorage.setItem("adhanSettings", JSON.stringify(settings));
    toast({
      title: "Settings Saved",
      description: "Your Adhan notification preferences have been updated.",
    });
  };

  const requestNotifications = async () => {
    if ("Notification" in window) {
      const permission = await Notification.requestPermission();
      setNotificationsEnabled(permission === "granted");
      if (permission === "granted") {
        toast({
          title: "Notifications Enabled",
          description: "You will now receive Adhan reminders.",
        });
      }
    }
  };

  const updatePrayerSetting = (
    prayer: keyof Omit<AdhanSettings, "globalVolume">,
    field: keyof PrayerSettings,
    value: boolean | number | string
  ) => {
    setSettings((prev) => ({
      ...prev,
      [prayer]: { ...prev[prayer], [field]: value },
    }));
  };

  return (
    <div className="min-h-screen bg-transparent">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
        <div className="container mx-auto px-4 h-16 flex items-center gap-4">
          <Link to="/" className="p-2 hover:bg-muted rounded-lg transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-xl font-bold">Adhan Settings</h1>
            <p className="text-xs text-muted-foreground font-arabic">إعدادات الأذان</p>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-2xl">
        {/* Notification Permission */}
        {!notificationsEnabled && (
          <Card className="mb-6 border-gold/30 bg-gold/5">
            <CardContent className="pt-6">
              <div className="flex items-start gap-4">
                <Bell className="w-8 h-8 text-gold flex-shrink-0" />
                <div className="flex-1">
                  <h3 className="font-semibold mb-1">Enable Notifications</h3>
                  <p className="text-sm text-muted-foreground mb-3">
                    Allow notifications to receive Adhan reminders before prayer times.
                  </p>
                  <Button onClick={requestNotifications} className="bg-gold text-gold-foreground hover:bg-gold/90">
                    Enable Notifications
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Global Volume */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Volume2 className="w-5 h-5 text-primary" />
              Global Volume
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4">
              <Slider
                value={[settings.globalVolume]}
                onValueChange={(value) => setSettings((prev) => ({ ...prev, globalVolume: value[0] }))}
                max={100}
                step={5}
                className="flex-1"
              />
              <span className="text-sm font-medium w-12 text-right">{settings.globalVolume}%</span>
            </div>
          </CardContent>
        </Card>

        {/* Prayer Settings */}
        <div className="space-y-4">
          {prayerNames.map(({ key, name, arabic }) => {
            const prayerKey = key as keyof Omit<AdhanSettings, "globalVolume">;
            const prayerSettings = settings[prayerKey];

            return (
              <Card key={key}>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="font-semibold">{name}</h3>
                      <p className="text-sm text-muted-foreground font-arabic">{arabic}</p>
                    </div>
                    <Switch
                      checked={prayerSettings.enabled}
                      onCheckedChange={(checked) => updatePrayerSetting(prayerKey, "enabled", checked)}
                    />
                  </div>

                  {prayerSettings.enabled && (
                    <div className="space-y-4 pt-4 border-t border-border">
                      {/* Reminder Time */}
                      <div className="flex items-center gap-3">
                        <Clock className="w-4 h-4 text-muted-foreground" />
                        <span className="text-sm flex-1">Remind me</span>
                        <select
                          value={prayerSettings.reminderMinutes}
                          onChange={(e) =>
                            updatePrayerSetting(prayerKey, "reminderMinutes", parseInt(e.target.value))
                          }
                          className="px-3 py-1.5 text-sm rounded-md border border-input bg-background"
                        >
                          <option value={5}>5 min before</option>
                          <option value={10}>10 min before</option>
                          <option value={15}>15 min before</option>
                          <option value={30}>30 min before</option>
                        </select>
                      </div>

                      {/* Adhan Sound */}
                      <div className="flex items-center gap-3">
                        <Volume2 className="w-4 h-4 text-muted-foreground" />
                        <span className="text-sm flex-1">Adhan Sound</span>
                        <select
                          value={prayerSettings.adhanSound}
                          onChange={(e) => updatePrayerSetting(prayerKey, "adhanSound", e.target.value)}
                          className="px-3 py-1.5 text-sm rounded-md border border-input bg-background"
                        >
                          {adhanSounds.map((sound) => (
                            <option key={sound.id} value={sound.id}>
                              {sound.name}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Save Button */}
        <div className="mt-8">
          <Button onClick={saveSettings} className="w-full" size="lg">
            <Check className="w-5 h-5 mr-2" />
            Save Settings
          </Button>
        </div>
      </main>
    </div>
  );
};

export default AdhanSettingsPage;
