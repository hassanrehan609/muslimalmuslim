import { MapPin, Loader2 } from "lucide-react";
import { useQiblaDirection } from "@/hooks/useQiblaDirection";

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
  const { qiblaData, loading, compassHeading } = useQiblaDirection();

  // Calculate the rotation for the needle
  const needleRotation = qiblaData
    ? compassHeading !== null
      ? qiblaData.direction - compassHeading
      : qiblaData.direction
    : 0;

  // Calculate Kaaba icon position based on direction
  const kaabaPosition = qiblaData
    ? {
        x: 50 + 35 * Math.sin((needleRotation * Math.PI) / 180),
        y: 50 - 35 * Math.cos((needleRotation * Math.PI) / 180),
      }
    : { x: 85, y: 15 };

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
                <div>
                  <p className="text-sm text-muted-foreground">Your Location</p>
                  {loading ? (
                    <div className="flex items-center gap-2">
                      <Loader2 className="w-4 h-4 animate-spin text-primary" />
                      <span className="text-sm text-muted-foreground">Detecting...</span>
                    </div>
                  ) : (
                    <p className="font-semibold text-foreground">
                      {qiblaData?.city}, {qiblaData?.country}
                    </p>
                  )}
                </div>
                <div className="ml-auto text-right">
                  <p className="text-sm text-muted-foreground">Qibla Direction</p>
                  {loading ? (
                    <span className="text-sm text-muted-foreground">...</span>
                  ) : (
                    <p className="font-semibold text-primary">
                      {qiblaData?.direction}° {getDirectionLabel(qiblaData?.direction || 0)}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Compass visual */}
            <div className="flex justify-center">
              <div className="relative w-64 h-64">
                {/* Outer ring */}
                <div className="absolute inset-0 rounded-full border-4 border-primary/20 bg-gradient-to-br from-card to-muted shadow-elevated" />
                
                {/* Compass markings */}
                <div className="absolute inset-4 rounded-full border-2 border-gold/30">
                  {/* Cardinal directions */}
                  <span className="absolute top-2 left-1/2 -translate-x-1/2 text-sm font-bold text-foreground">N</span>
                  <span className="absolute bottom-2 left-1/2 -translate-x-1/2 text-sm font-bold text-muted-foreground">S</span>
                  <span className="absolute left-2 top-1/2 -translate-y-1/2 text-sm font-bold text-muted-foreground">W</span>
                  <span className="absolute right-2 top-1/2 -translate-y-1/2 text-sm font-bold text-muted-foreground">E</span>
                </div>

                {/* Inner compass */}
                <div className="absolute inset-8 rounded-full bg-card shadow-soft flex items-center justify-center">
                  <div className="relative">
                    {/* Qibla needle */}
                    <div 
                      className="absolute w-1 h-20 bg-gradient-to-t from-primary to-gold rounded-full origin-bottom left-1/2 -translate-x-1/2 bottom-1/2 transition-transform duration-300"
                      style={{ transform: `translateX(-50%) rotate(${needleRotation}deg)` }}
                    />
                    {/* Center dot */}
                    <div className="w-4 h-4 rounded-full bg-gold shadow-gold" />
                  </div>
                </div>

                {/* Kaaba icon at Qibla direction */}
                <div 
                  className="absolute w-10 h-10 bg-primary rounded-lg flex items-center justify-center shadow-soft transition-all duration-300"
                  style={{ 
                    left: `${kaabaPosition.x}%`,
                    top: `${kaabaPosition.y}%`,
                    transform: "translate(-50%, -50%)",
                  }}
                >
                  <span className="text-primary-foreground text-xs font-bold">🕋</span>
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
