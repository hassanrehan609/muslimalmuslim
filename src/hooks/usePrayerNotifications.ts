import { useEffect, useCallback } from "react";
import { usePrayerTimes } from "./usePrayerTimes";

interface AdhanSettings {
  fajr: { enabled: boolean; reminderMinutes: number; adhanSound: string };
  dhuhr: { enabled: boolean; reminderMinutes: number; adhanSound: string };
  asr: { enabled: boolean; reminderMinutes: number; adhanSound: string };
  maghrib: { enabled: boolean; reminderMinutes: number; adhanSound: string };
  isha: { enabled: boolean; reminderMinutes: number; adhanSound: string };
  globalVolume: number;
}

const prayerNameMap: Record<string, { name: string; arabic: string }> = {
  Fajr: { name: "Fajr", arabic: "الفجر" },
  Dhuhr: { name: "Dhuhr", arabic: "الظهر" },
  Asr: { name: "Asr", arabic: "العصر" },
  Maghrib: { name: "Maghrib", arabic: "المغرب" },
  Isha: { name: "Isha", arabic: "العشاء" },
};

// Audio URLs for Adhan sounds (using public domain/free Islamic audio)
const adhanAudioUrls: Record<string, string> = {
  makkah: "https://www.islamcan.com/audio/adhan/azan1.mp3",
  madinah: "https://www.islamcan.com/audio/adhan/azan2.mp3",
  alaqsa: "https://www.islamcan.com/audio/adhan/azan3.mp3",
  mishary: "https://www.islamcan.com/audio/adhan/azan4.mp3",
};

export const usePrayerNotifications = () => {
  const { prayerTimes } = usePrayerTimes();

  const getSettings = useCallback((): AdhanSettings | null => {
    const saved = localStorage.getItem("adhanSettings");
    if (saved) {
      return JSON.parse(saved);
    }
    return null;
  }, []);

  const playAdhan = useCallback((soundId: string, volume: number) => {
    const audioUrl = adhanAudioUrls[soundId] || adhanAudioUrls.makkah;
    const audio = new Audio(audioUrl);
    audio.volume = volume / 100;
    audio.play().catch(console.error);
    
    // Stop after 60 seconds
    setTimeout(() => {
      audio.pause();
      audio.currentTime = 0;
    }, 60000);
  }, []);

  const showNotification = useCallback((prayerName: string, isReminder: boolean, minutesBefore?: number) => {
    if ("Notification" in window && Notification.permission === "granted") {
      const prayerInfo = prayerNameMap[prayerName];
      const title = isReminder 
        ? `${prayerName} Prayer in ${minutesBefore} minutes`
        : `${prayerName} Prayer Time - ${prayerInfo?.arabic || ""}`;
      
      const body = isReminder
        ? `Prepare for ${prayerName} (${prayerInfo?.arabic || ""}) prayer`
        : `It's time for ${prayerName} prayer. ${prayerInfo?.arabic || ""}`;

      const notification = new Notification(title, {
        body,
        icon: "/favicon.ico",
        badge: "/favicon.ico",
        tag: `prayer-${prayerName}-${isReminder ? "reminder" : "time"}`,
      });

      notification.onclick = () => {
        window.focus();
        notification.close();
      };
    }
  }, []);

  const parseTime = useCallback((timeStr: string): Date | null => {
    // Parse time like "5:30 AM" or "6:45 PM"
    const match = timeStr.match(/(\d+):(\d+)\s*(AM|PM)/i);
    if (!match) return null;

    let hours = parseInt(match[1]);
    const minutes = parseInt(match[2]);
    const period = match[3].toUpperCase();

    if (period === "PM" && hours !== 12) hours += 12;
    if (period === "AM" && hours === 12) hours = 0;

    const now = new Date();
    const prayerDate = new Date(now.getFullYear(), now.getMonth(), now.getDate(), hours, minutes, 0);
    return prayerDate;
  }, []);

  const scheduleNotifications = useCallback(() => {
    if (!prayerTimes) return;
    
    const settings = getSettings();
    if (!settings) return;

    const now = new Date();
    const prayers = ["Fajr", "Dhuhr", "Asr", "Maghrib", "Isha"] as const;

    prayers.forEach((prayer) => {
      const prayerKey = prayer.toLowerCase() as keyof Omit<AdhanSettings, "globalVolume">;
      const prayerSettings = settings[prayerKey];
      
      if (!prayerSettings?.enabled) return;

      const timeStr = prayerTimes[prayer as keyof typeof prayerTimes];
      if (!timeStr) return;

      const prayerTime = parseTime(timeStr);
      if (!prayerTime) return;

      // Schedule reminder notification
      const reminderTime = new Date(prayerTime.getTime() - prayerSettings.reminderMinutes * 60000);
      if (reminderTime > now) {
        const reminderDelay = reminderTime.getTime() - now.getTime();
        setTimeout(() => {
          showNotification(prayer, true, prayerSettings.reminderMinutes);
        }, reminderDelay);
      }

      // Schedule prayer time notification and Adhan
      if (prayerTime > now) {
        const prayerDelay = prayerTime.getTime() - now.getTime();
        setTimeout(() => {
          showNotification(prayer, false);
          playAdhan(prayerSettings.adhanSound, settings.globalVolume);
        }, prayerDelay);
      }
    });
  }, [prayerTimes, getSettings, parseTime, showNotification, playAdhan]);

  useEffect(() => {
    // Request notification permission on mount
    if ("Notification" in window && Notification.permission === "default") {
      Notification.requestPermission();
    }

    // Schedule notifications
    scheduleNotifications();

    // Re-schedule every hour
    const interval = setInterval(scheduleNotifications, 60 * 60 * 1000);

    return () => clearInterval(interval);
  }, [scheduleNotifications]);

  return { scheduleNotifications };
};
