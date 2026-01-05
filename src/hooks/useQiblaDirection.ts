import { useState, useEffect } from "react";

interface QiblaData {
  direction: number;
  city: string;
  country: string;
  latitude: number;
  longitude: number;
}

export const useQiblaDirection = () => {
  const [qiblaData, setQiblaData] = useState<QiblaData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [compassHeading, setCompassHeading] = useState<number | null>(null);

  useEffect(() => {
    const fetchQiblaDirection = async (latitude: number, longitude: number) => {
      try {
        // Calculate Qibla direction using the formula
        const kaabaLat = 21.4225;
        const kaabaLng = 39.8262;

        const latRad = (latitude * Math.PI) / 180;
        const lngRad = (longitude * Math.PI) / 180;
        const kaabaLatRad = (kaabaLat * Math.PI) / 180;
        const kaabaLngRad = (kaabaLng * Math.PI) / 180;

        const dLng = kaabaLngRad - lngRad;

        const x = Math.sin(dLng);
        const y = Math.cos(latRad) * Math.tan(kaabaLatRad) - Math.sin(latRad) * Math.cos(dLng);

        let qiblaDirection = (Math.atan2(x, y) * 180) / Math.PI;
        if (qiblaDirection < 0) qiblaDirection += 360;

        // Get location name
        const locationRes = await fetch(
          `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`
        );
        const locationData = await locationRes.json();

        setQiblaData({
          direction: Math.round(qiblaDirection * 10) / 10,
          city: locationData.city || locationData.locality || "Unknown",
          country: locationData.countryName || "Unknown",
          latitude,
          longitude,
        });
      } catch (err) {
        console.error("Failed to calculate Qibla direction:", err);
        setError("Failed to calculate Qibla direction");
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
          await fetchQiblaDirection(latitude, longitude);
          setLoading(false);
        },
        (err) => {
          console.error("Geolocation error:", err);
          // Fallback to a default location (New York)
          fetchQiblaDirection(40.7128, -74.006).then(() => setLoading(false));
        },
        { timeout: 10000, enableHighAccuracy: true }
      );
    };

    // Device orientation for compass
    const handleOrientation = (event: DeviceOrientationEvent) => {
      if (event.alpha !== null) {
        setCompassHeading(event.alpha);
      }
    };

    // Request permission for device orientation on iOS
    if (typeof (DeviceOrientationEvent as any).requestPermission === "function") {
      (DeviceOrientationEvent as any)
        .requestPermission()
        .then((response: string) => {
          if (response === "granted") {
            window.addEventListener("deviceorientation", handleOrientation);
          }
        })
        .catch(console.error);
    } else {
      window.addEventListener("deviceorientation", handleOrientation);
    }

    getLocation();

    return () => {
      window.removeEventListener("deviceorientation", handleOrientation);
    };
  }, []);

  return { qiblaData, loading, error, compassHeading };
};
