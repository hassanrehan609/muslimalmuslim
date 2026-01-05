import { useState, useEffect, useCallback } from "react";
import { usePrayerTimes } from "./usePrayerTimes";

type Theme = "light" | "dark";

export const useTheme = () => {
  const [theme, setTheme] = useState<Theme>(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("theme") as Theme;
      if (stored) return stored;
      return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
    }
    return "light";
  });
  
  const [autoMode, setAutoMode] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("themeAutoMode") === "true";
    }
    return false;
  });

  const { prayerTimes } = usePrayerTimes();

  // Apply theme to document
  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove("light", "dark");
    root.classList.add(theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  // Auto-switch based on prayer times
  useEffect(() => {
    if (!autoMode || !prayerTimes) return;

    const checkPrayerTime = () => {
      const now = new Date();
      const currentMinutes = now.getHours() * 60 + now.getMinutes();

      const parseTime = (timeStr: string): number => {
        const [time, period] = timeStr.split(" ");
        const [hours, minutes] = time.split(":").map(Number);
        let h = hours;
        if (period === "PM" && hours !== 12) h += 12;
        if (period === "AM" && hours === 12) h = 0;
        return h * 60 + minutes;
      };

      const maghribMinutes = parseTime(prayerTimes.Maghrib);
      const fajrMinutes = parseTime(prayerTimes.Fajr);

      // Dark after Maghrib, Light after Fajr
      if (currentMinutes >= maghribMinutes || currentMinutes < fajrMinutes) {
        setTheme("dark");
      } else {
        setTheme("light");
      }
    };

    checkPrayerTime();
    const interval = setInterval(checkPrayerTime, 60000); // Check every minute

    return () => clearInterval(interval);
  }, [autoMode, prayerTimes]);

  const toggleTheme = useCallback(() => {
    setAutoMode(false);
    localStorage.setItem("themeAutoMode", "false");
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  }, []);

  const enableAutoMode = useCallback(() => {
    setAutoMode(true);
    localStorage.setItem("themeAutoMode", "true");
  }, []);

  return { theme, toggleTheme, autoMode, enableAutoMode };
};
