import { useEffect, useState } from "react";

/** Detect budget devices once: few CPU cores, low RAM or data-saver. */
const detectLowEnd = () => {
  if (typeof navigator === "undefined") return false;
  const n = navigator as Navigator & { deviceMemory?: number; connection?: { saveData?: boolean } };
  return (
    (n.hardwareConcurrency ?? 8) <= 4 ||
    (n.deviceMemory ?? 8) <= 4 ||
    !!n.connection?.saveData
  );
};

/**
 * Global liquid-glass backdrop + refraction filter.
 * On budget devices it adds `lite-glass` to <html>: static backdrop, lighter
 * blur and no animated SVG distortion, so scrolling stays smooth.
 */
const LiquidGlassLayer = () => {
  const [lowEnd] = useState(detectLowEnd);

  useEffect(() => {
    document.documentElement.classList.toggle("lite-glass", lowEnd);
  }, [lowEnd]);

  return (
    <>
      {!lowEnd && (
        <svg aria-hidden="true" focusable="false" style={{ position: "absolute", width: 0, height: 0, pointerEvents: "none" }}>
          <defs>
            <filter id="liquid-glass-refraction" x="-20%" y="-20%" width="140%" height="140%">
              <feTurbulence type="fractalNoise" baseFrequency="0.009 0.012" numOctaves={1} seed={7} result="noise" />
              <feDisplacementMap in="SourceGraphic" in2="noise" scale={12} xChannelSelector="R" yChannelSelector="G" />
            </filter>
          </defs>
        </svg>
      )}
      <div aria-hidden="true" className="liquid-ambient">
        <span className="liquid-blob liquid-blob--1" />
        <span className="liquid-blob liquid-blob--2" />
        <span className="liquid-blob liquid-blob--3" />
        {!lowEnd && <span className="liquid-blob liquid-blob--4" />}
        <div className="liquid-ambient__pattern islamic-pattern" />
      </div>
    </>
  );
};

export default LiquidGlassLayer;
