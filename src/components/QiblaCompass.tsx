import { MapPin, Loader2, Navigation, RefreshCw } from "lucide-react";
import { useQiblaDirection } from "@/hooks/useQiblaDirection";
import { Button } from "@/components/ui/button";

const getDirectionLabel = (degrees: number): string => {
  if (degrees >= 337.5 || degrees < 22.5) return "N";
  if (degrees >= 22.5 && degrees < 67.5) return "NE";
  if (degrees >= 67.5 && degrees < 112.5) return "E";
  if (degrees >= 112.5 && degrees < 157.5) return "SE";
  if (degrees >= 157.5 && degrees < 202.5) return "S";
  if (degrees >= 202.5 && degrees < 247.5) return "SW";
  if (degrees >= 247.5 && degrees < 292.5) return "W";
  return "NW";
};

const QiblaCompass = () => {
  const { qiblaData, loading, error, compassHeading, permissionNeeded, isAligned, requestOrientationPermission } = useQiblaDirection();

  const hasCompass = compassHeading !== null;

  // Needle points toward Qibla relative to device orientation
  const needleRotation = qiblaData
    ? hasCompass
      ? qiblaData.direction - compassHeading
      : qiblaData.direction
    : 0;

  // Compass ring counter-rotates so N label tracks true north
  const compassRingRotation = hasCompass ? -compassHeading : 0;

  const handleRefresh = () => {
    window.location.reload();
  };

  return (
    <section id="qibla" className="py-20 bg-muted islamic-pattern">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* Text content */}
            <div>
              <p className="text-gold font-arabic text-xl mb-2">اتجاه القبلة</p>
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Qibla Direction</h2>
              <p className="text-muted-foreground mb-6">
                Find the exact direction to the Kaaba in Mecca from anywhere in the world. 
                Our accurate compass guides you to face the right direction for your prayers.
              </p>
              
              <div className="flex items-center gap-3 p-4 bg-card rounded-lg shadow-soft">
                <MapPin className="w-5 h-5 text-primary" />
                <div className="flex-1">
                  <p className="text-sm text-muted-foreground">Your Location</p>
                  {loading ? (
                    <div className="flex items-center gap-2">
                      <Loader2 className="w-4 h-4 animate-spin text-primary" />
                      <span className="text-sm text-muted-foreground">Detecting...</span>
                    </div>
                  ) : (
                    <>
                      <p className="font-semibold text-foreground">
                        {qiblaData?.city}, {qiblaData?.country}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {qiblaData?.latitude.toFixed(4)}°, {qiblaData?.longitude.toFixed(4)}°
                      </p>
                    </>
                  )}
                </div>
                <Button variant="ghost" size="icon" onClick={handleRefresh} className="shrink-0">
                  <RefreshCw className="w-4 h-4" />
                </Button>
              </div>

              <div className="mt-4 grid grid-cols-2 gap-4">
                <div className="p-4 bg-card rounded-lg shadow-soft text-center">
                  <Navigation className="w-5 h-5 text-primary mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground">Qibla Direction</p>
                  {loading ? (
                    <span className="text-lg font-bold text-primary">...</span>
                  ) : (
                    <p className="text-lg font-bold text-primary">
                      {qiblaData?.direction}° {getDirectionLabel(qiblaData?.direction || 0)}
                    </p>
                  )}
                </div>
                <div className="p-4 bg-card rounded-lg shadow-soft text-center">
                  <span className="text-2xl mb-1 block">🕋</span>
                  <p className="text-sm text-muted-foreground">Distance to Kaaba</p>
                  {loading ? (
                    <span className="text-lg font-bold text-primary">...</span>
                  ) : (
                    <p className="text-lg font-bold text-primary">
                      {qiblaData?.distance.toLocaleString()} km
                    </p>
                  )}
                </div>
              </div>

              {error && (
                <p className="mt-4 text-sm text-destructive bg-destructive/10 p-3 rounded-lg">
                  {error}
                </p>
              )}

              {permissionNeeded && (
                <Button 
                  onClick={requestOrientationPermission}
                  className="mt-4 w-full"
                  variant="outline"
                >
                  🧭 Enable Compass (Tap to Allow)
                </Button>
              )}

              {!hasCompass && !loading && !permissionNeeded && (
                <p className="mt-4 text-sm text-muted-foreground bg-muted p-3 rounded-lg">
                  💡 Tip: On mobile, rotate your device to see the compass needle point towards Qibla in real-time.
                </p>
              )}

              {hasCompass && isAligned && (
                <p className="mt-4 text-sm text-green-600 bg-green-500/10 p-3 rounded-lg font-bold animate-pulse">
                  ✅ You are facing Qibla! — Allahu Akbar
                </p>
              )}

              {hasCompass && !isAligned && (
                <p className="mt-4 text-sm text-primary bg-primary/10 p-3 rounded-lg font-medium">
                  🧭 Live compass active — rotate your device to find Qibla
                </p>
              )}
            </div>

            {/* Compass visual */}
            <div className="flex justify-center">
              <div className={`relative w-72 h-72 ${isAligned ? "ring-4 ring-green-500/50 rounded-full" : ""}`}>
                {/* Outer ring */}
                <div className="absolute inset-0 rounded-full border-4 border-primary/20 bg-gradient-to-br from-card to-muted shadow-elevated" />
                
                {/* Compass markings - rotate with device (no CSS transition, JS-smoothed) */}
                <div 
                  className="absolute inset-4 rounded-full border-2 border-gold/30"
                  style={{ transform: `rotate(${compassRingRotation}deg)` }}
                >
                  <span className="absolute -top-1 left-1/2 -translate-x-1/2 text-sm font-bold text-primary bg-card px-1 rounded">N</span>
                  <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 text-sm font-bold text-muted-foreground bg-card px-1 rounded">S</span>
                  <span className="absolute -left-1 top-1/2 -translate-y-1/2 text-sm font-bold text-muted-foreground bg-card px-1 rounded">W</span>
                  <span className="absolute -right-1 top-1/2 -translate-y-1/2 text-sm font-bold text-muted-foreground bg-card px-1 rounded">E</span>
                  
                  {/* Degree ticks */}
                  {[...Array(36)].map((_, i) => (
                    <div
                      key={i}
                      className="absolute top-0 left-1/2 origin-bottom"
                      style={{
                        transform: `translateX(-50%) rotate(${i * 10}deg)`,
                        height: "50%",
                      }}
                    >
                      <div className={`w-px ${i % 3 === 0 ? "h-3 bg-foreground/40" : "h-1.5 bg-foreground/20"}`} />
                    </div>
                  ))}
                </div>

                {/* Inner compass face */}
                <div className="absolute inset-10 rounded-full bg-card shadow-soft flex items-center justify-center overflow-hidden">
                  {/* Qibla needle (no CSS transition — smoothed via JS low-pass filter) */}
                  <div 
                    className="absolute w-full h-full"
                    style={{ transform: `rotate(${needleRotation}deg)` }}
                  >
                    {/* Arrow pointing up (toward Qibla) */}
                    <div className="absolute left-1/2 top-3 -translate-x-1/2 flex flex-col items-center">
                      <div className={`w-0 h-0 border-l-[8px] border-l-transparent border-r-[8px] border-r-transparent border-b-[14px] ${isAligned ? "border-b-green-500" : "border-b-primary"}`} />
                      <div className={`w-1.5 h-16 rounded-b bg-gradient-to-b ${isAligned ? "from-green-500 to-green-500/40" : "from-primary to-primary/40"}`} />
                    </div>
                    {/* Tail */}
                    <div className="absolute left-1/2 bottom-3 -translate-x-1/2 flex flex-col items-center">
                      <div className="w-1 h-12 bg-gradient-to-t from-muted-foreground/30 to-muted-foreground/10 rounded-t" />
                    </div>
                  </div>
                  {/* Center dot */}
                  <div className={`relative z-10 w-5 h-5 rounded-full border-2 border-card shadow-gold ${isAligned ? "bg-green-500" : "bg-gold"}`} />
                </div>

                {/* Kaaba icon at the Qibla direction on the outer ring */}
                <div 
                  className={`absolute w-10 h-10 rounded-lg flex items-center justify-center shadow-soft z-20 ${isAligned ? "bg-green-500" : "bg-primary"}`}
                  style={{ 
                    left: `${50 + 42 * Math.sin((needleRotation * Math.PI) / 180)}%`,
                    top: `${50 - 42 * Math.cos((needleRotation * Math.PI) / 180)}%`,
                    transform: "translate(-50%, -50%)",
                  }}
                >
                  <span className="text-lg">🕋</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default QiblaCompass;
