import { useState, useEffect, useCallback } from "react";

interface QiblaData {
  direction: number;
  city: string;
  country: string;
  latitude: number;
  longitude: number;
  distance: number;
}

// Kaaba coordinates (verified accurate)
const KAABA_LAT = 21.422487;
const KAABA_LNG = 39.826206;

const toRadians = (degrees: number) => (degrees * Math.PI) / 180;
const toDegrees = (radians: number) => (radians * 180) / Math.PI;

// Haversine formula for distance
const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
  const R = 6371; // Earth's radius in km
  const dLat = toRadians(lat2 - lat1);
  const dLon = toRadians(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c);
};

// Calculate Qibla direction using great circle bearing
const calculateQiblaDirection = (lat: number, lng: number): number => {
  const lat1 = toRadians(lat);
  const lat2 = toRadians(KAABA_LAT);
  const dLng = toRadians(KAABA_LNG - lng);

  const x = Math.cos(lat2) * Math.sin(dLng);
  const y = Math.cos(lat1) * Math.sin(lat2) - Math.sin(lat1) * Math.cos(lat2) * Math.cos(dLng);

  let bearing = toDegrees(Math.atan2(x, y));
  return (bearing + 360) % 360; // Normalize to 0-360
};

export const useQiblaDirection = () => {
  const [qiblaData, setQiblaData] = useState<QiblaData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [compassHeading, setCompassHeading] = useState<number | null>(null);

  const fetchLocationName = useCallback(async (latitude: number, longitude: number) => {
    try {
      const res = await fetch(
        `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`
      );
      const data = await res.json();
      return {
        city: data.city || data.locality || data.principalSubdivision || "Unknown",
        country: data.countryName || "Unknown",
      };
    } catch {
      return { city: "Unknown", country: "Unknown" };
    }
  }, []);

  const updateQiblaData = useCallback(
    async (latitude: number, longitude: number) => {
      const direction = calculateQiblaDirection(latitude, longitude);
      const distance = calculateDistance(latitude, longitude, KAABA_LAT, KAABA_LNG);
      const location = await fetchLocationName(latitude, longitude);

      setQiblaData({
        direction: Math.round(direction * 10) / 10,
        city: location.city,
        country: location.country,
        latitude,
        longitude,
        distance,
      });
      setLoading(false);
    },
    [fetchLocationName]
  );

  useEffect(() => {
    let watchId: number | null = null;

    const startWatching = () => {
      if (!navigator.geolocation) {
        setError("Geolocation is not supported");
        setLoading(false);
        return;
      }

      // Use watchPosition for live updates
      watchId = navigator.geolocation.watchPosition(
        (position) => {
          updateQiblaData(position.coords.latitude, position.coords.longitude);
        },
        (err) => {
          console.error("Geolocation error:", err);
          setError("Unable to get your location. Using default location.");
          // Fallback to Mecca for demo
          updateQiblaData(24.7136, 46.6753); // Riyadh as fallback
        },
        { 
          timeout: 15000, 
          enableHighAccuracy: true,
          maximumAge: 30000 
        }
      );
    };

    // Device orientation for compass
    const handleOrientation = (event: DeviceOrientationEvent) => {
      // Use webkitCompassHeading for iOS, alpha for others
      const heading = (event as any).webkitCompassHeading ?? event.alpha;
      if (heading !== null && heading !== undefined) {
        setCompassHeading(heading);
      }
    };

    // Request permission for device orientation on iOS 13+
    const requestOrientationPermission = async () => {
      if (typeof (DeviceOrientationEvent as any).requestPermission === "function") {
        try {
          const response = await (DeviceOrientationEvent as any).requestPermission();
          if (response === "granted") {
            window.addEventListener("deviceorientation", handleOrientation, true);
          }
        } catch (e) {
          console.error("Orientation permission error:", e);
        }
      } else {
        window.addEventListener("deviceorientation", handleOrientation, true);
      }
    };

    startWatching();
    requestOrientationPermission();

    return () => {
      if (watchId !== null) {
        navigator.geolocation.clearWatch(watchId);
      }
      window.removeEventListener("deviceorientation", handleOrientation, true);
    };
  }, [updateQiblaData]);

  return { qiblaData, loading, error, compassHeading };
};
