/**
 * LiquidGlassLayer
 *
 * Renders two pieces of the global "Apple Liquid Glass" system, once per app:
 *  1. A fixed, animated aurora ambient backdrop. Real liquid glass only looks
 *     like glass when there is a rich, colourful, moving scene *behind* it to
 *     refract and scatter. This layer provides that scene.
 *  2. A hidden SVG <filter> using fractal turbulence + displacement so the
 *     `.glass-refract` surfaces get genuine optical distortion of whatever
 *     sits behind them (not just a flat blur).
 *
 * It is purely decorative (aria-hidden) and sits at the very back (z-index < 0).
 */
const LiquidGlassLayer = () => {
  return (
    <>
      {/* SVG refraction filter — referenced from CSS via url(#liquid-glass-refraction) */}
      <svg
        aria-hidden="true"
        focusable="false"
        style={{ position: "absolute", width: 0, height: 0, pointerEvents: "none" }}
      >
        <defs>
          <filter id="liquid-glass-refraction" x="-20%" y="-20%" width="140%" height="140%">
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.008 0.012"
              numOctaves={2}
              seed={7}
              result="noise"
            >
              <animate
                attributeName="baseFrequency"
                dur="24s"
                values="0.008 0.012; 0.011 0.009; 0.008 0.012"
                repeatCount="indefinite"
              />
            </feTurbulence>
            <feDisplacementMap
              in="SourceGraphic"
              in2="noise"
              scale={14}
              xChannelSelector="R"
              yChannelSelector="G"
            />
          </filter>
        </defs>
      </svg>

      {/* Fixed ambient backdrop — the colourful scene the glass refracts */}
      <div aria-hidden="true" className="liquid-ambient">
        <span className="liquid-blob liquid-blob--1" />
        <span className="liquid-blob liquid-blob--2" />
        <span className="liquid-blob liquid-blob--3" />
        <span className="liquid-blob liquid-blob--4" />
        <div className="liquid-ambient__pattern islamic-pattern" />
      </div>
    </>
  );
};

export default LiquidGlassLayer;
