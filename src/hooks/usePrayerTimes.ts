import { useState, useEffect } from "react";

interface PrayerTimesData {
  Fajr: string;
  Sunrise: string;
  Dhuhr: string;
  Asr: string;
  Maghrib: string;
  Isha: string;
}

interface LocationData {
  city: string;
  country: string;
  latitude: number;
  longitude: number;
}

interface UsePrayerTimesReturn {
  prayerTimes: PrayerTimesData | null;
  location: LocationData | null;
  loading: boolean;
  error: string | null;
  currentDate: string;
}

export const usePrayerTimes = (): UsePrayerTimesReturn => {
  const [prayerTimes, setPrayerTimes] = useState<PrayerTimesData | null>(null);
  const [location, setLocation] = useState<LocationData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const currentDate = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  useEffect(() => {
    const fetchPrayerTimes = async (latitude: number, longitude: number) => {
      try {
        const date = new Date();
        const dateStr = `${date.getDate()}-${date.getMonth() + 1}-${date.getFullYear()}`;
        
        const response = await fetch(
          `https://api.aladhan.com/v1/timings/${dateStr}?latitude=${latitude}&longitude=${longitude}&method=2`
        );
        
        if (!response.ok) throw new Error("Failed to fetch prayer times");
        
        const data = await response.json();
        const timings = data.data.timings;
        
        setPrayerTimes({
          Fajr: formatTime(timings.Fajr),
          Sunrise: formatTime(timings.Sunrise),
          Dhuhr: formatTime(timings.Dhuhr),
          Asr: formatTime(timings.Asr),
          Maghrib: formatTime(timings.Maghrib),
          Isha: formatTime(timings.Isha),
        });
      } catch (err) {
        setError("Failed to fetch prayer times");
        console.error(err);
      }
    };

    const fetchLocationName = async (latitude: number, longitude: number) => {
      try {
        const response = await fetch(
          `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`
        );
        
        if (!response.ok) throw new Error("Failed to fetch location");
        
        const data = await response.json();
        setLocation({
          city: data.city || data.locality || "Unknown",
          country: data.countryName || "Unknown",
          latitude,
          longitude,
        });
      } catch (err) {
        setLocation({
          city: "Unknown",
          country: "Unknown",
          latitude,
          longitude,
        });
      }
    };

    const getLocation = () => {
      if (!navigator.geolocation) {
        setError("Geolocation is not supported");
        setLoading(false);
        return;
      }

      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          await Promise.all([
            fetchPrayerTimes(latitude, longitude),
            fetchLocationName(latitude, longitude),
          ]);
          setLoading(false);
        },
        (err) => {
          console.error("Geolocation error:", err);
          // Fallback to a default location (Mecca)
          const defaultLat = 21.4225;
          const defaultLng = 39.8262;
          Promise.all([
            fetchPrayerTimes(defaultLat, defaultLng),
            fetchLocationName(defaultLat, defaultLng),
          ]).then(() => setLoading(false));
        },
        { timeout: 10000, enableHighAccuracy: true }
      );
    };

    getLocation();
  }, []);

  return { prayerTimes, location, loading, error, currentDate };
};

const formatTime = (time: string): string => {
  const [hours, minutes] = time.split(":");
  const hour = parseInt(hours);
  const ampm = hour >= 12 ? "PM" : "AM";
  const formattedHour = hour % 12 || 12;
  return `${formattedHour}:${minutes} ${ampm}`;
};
