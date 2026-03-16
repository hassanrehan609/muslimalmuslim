import { useState, useEffect, useCallback, useRef } from "react";

interface QiblaData {
  direction: number;
  city: string;
  country: string;
  latitude: number;
  longitude: number;
  distance: number;
}

const KAABA_LAT = 21.422487;
const KAABA_LNG = 39.826206;

const toRadians = (degrees: number) => (degrees * Math.PI) / 180;
const toDegrees = (radians: number) => (radians * 180) / Math.PI;

const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
  const R = 6371;
  const dLat = toRadians(lat2 - lat1);
  const dLon = toRadians(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c);
};

const calculateQiblaDirection = (lat: number, lng: number): number => {
  const lat1 = toRadians(lat);
  const lat2 = toRadians(KAABA_LAT);
  const dLng = toRadians(KAABA_LNG - lng);

  const x = Math.cos(lat2) * Math.sin(dLng);
  const y = Math.cos(lat1) * Math.sin(lat2) - Math.sin(lat1) * Math.cos(lat2) * Math.cos(dLng);

  let bearing = toDegrees(Math.atan2(x, y));
  return (bearing + 360) % 360;
};

export const useQiblaDirection = () => {
  const [qiblaData, setQiblaData] = useState<QiblaData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [compassHeading, setCompassHeading] = useState<number | null>(null);
  const [permissionNeeded, setPermissionNeeded] = useState(false);
  const orientationListenerRef = useRef(false);

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

  // Smoothing for compass heading
  const lastHeadingRef = useRef<number | null>(null);

  const handleOrientation = useCallback((event: DeviceOrientationEvent) => {
    // iOS provides webkitCompassHeading (0=North, clockwise)
    const iosHeading = (event as any).webkitCompassHeading;
    // Android absolute orientation: alpha is degrees from North (but counterclockwise)
    const alpha = event.alpha;

    let heading: number | null = null;

    if (typeof iosHeading === "number" && !isNaN(iosHeading)) {
      heading = iosHeading;
    } else if (typeof alpha === "number" && !isNaN(alpha)) {
      // For absolute orientation, alpha=0 means North, but it goes counterclockwise
      // Convert to clockwise compass heading
      heading = (360 - alpha) % 360;
    }

    if (heading !== null) {
      // Smooth the heading to avoid jitter
      if (lastHeadingRef.current !== null) {
        let diff = heading - lastHeadingRef.current;
        // Handle wrap-around
        if (diff > 180) diff -= 360;
        if (diff < -180) diff += 360;
        // Low-pass filter
        heading = (lastHeadingRef.current + diff * 0.3 + 360) % 360;
      }
      lastHeadingRef.current = heading;
      setCompassHeading(Math.round(heading * 10) / 10);
    }
  }, []);

  const requestOrientationPermission = useCallback(async () => {
    if (orientationListenerRef.current) return;

    // iOS 13+ requires explicit permission
    if (typeof (DeviceOrientationEvent as any).requestPermission === "function") {
      try {
        const response = await (DeviceOrientationEvent as any).requestPermission();
        if (response === "granted") {
          window.addEventListener("deviceorientation", handleOrientation, true);
          orientationListenerRef.current = true;
          setPermissionNeeded(false);
        } else {
          setPermissionNeeded(true);
        }
      } catch (e) {
        console.error("Orientation permission error:", e);
        setPermissionNeeded(true);
      }
    } else {
      // Try absolute orientation first (Android), fallback to regular
      if ("ondeviceorientationabsolute" in window) {
        window.addEventListener("deviceorientationabsolute" as any, handleOrientation, true);
      } else {
        window.addEventListener("deviceorientation", handleOrientation, true);
      }
      orientationListenerRef.current = true;
    }
  }, [handleOrientation]);

  useEffect(() => {
    let watchId: number | null = null;

    if (!navigator.geolocation) {
      setError("Geolocation is not supported");
      setLoading(false);
    } else {
      watchId = navigator.geolocation.watchPosition(
        (position) => {
          updateQiblaData(position.coords.latitude, position.coords.longitude);
        },
        (err) => {
          console.error("Geolocation error:", err);
          setError("Unable to get your location. Using default location.");
          updateQiblaData(24.7136, 46.6753);
        },
        { timeout: 15000, enableHighAccuracy: true, maximumAge: 30000 }
      );
    }

    requestOrientationPermission();

    return () => {
      if (watchId !== null) navigator.geolocation.clearWatch(watchId);
      window.removeEventListener("deviceorientation", handleOrientation, true);
      window.removeEventListener("deviceorientationabsolute" as any, handleOrientation, true);
      orientationListenerRef.current = false;
    };
  }, [updateQiblaData, requestOrientationPermission, handleOrientation]);

  return { qiblaData, loading, error, compassHeading, permissionNeeded, requestOrientationPermission };
};
