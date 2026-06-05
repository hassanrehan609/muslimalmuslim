import { describe, it, expect } from "vitest";
import { readFileSync } from "fs";
import { resolve } from "path";

const css = readFileSync(resolve(__dirname, "../index.css"), "utf8");

/** Parse `hsl(h s% l%)` triples from a CSS custom property declaration. */
function token(name: string, scope = css): [number, number, number] | null {
  const m = scope.match(new RegExp(`--${name}:\\s*([\\d.]+)\\s+([\\d.]+)%\\s+([\\d.]+)%`));
  return m ? [parseFloat(m[1]), parseFloat(m[2]), parseFloat(m[3])] : null;
}
function num(name: string, scope = css): number | null {
  const m = scope.match(new RegExp(`--${name}:\\s*([\\d.]+)`));
  return m ? parseFloat(m[1]) : null;
}

function hslToRgb([h, s, l]: [number, number, number]): [number, number, number] {
  s /= 100; l /= 100;
  const k = (n: number) => (n + h / 30) % 12;
  const a = s * Math.min(l, 1 - l);
  const f = (n: number) => l - a * Math.max(-1, Math.min(k(n) - 3, 9 - k(n), 1));
  return [f(0), f(8), f(4)];
}
function relLum([r, g, b]: number[]) {
  const c = (v: number) => (v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4);
  return 0.2126 * c(r) + 0.7152 * c(g) + 0.0722 * c(b);
}
function contrast(a: number[], b: number[]) {
  const la = relLum(a) + 0.05, lb = relLum(b) + 0.05;
  return Math.max(la, lb) / Math.min(la, lb);
}
function blend(fg: number[], bg: number[], alpha: number) {
  return fg.map((c, i) => c * alpha + bg[i] * (1 - alpha));
}

const light = css.slice(css.indexOf(":root"), css.indexOf(".dark"));
const dark = css.slice(css.indexOf(".dark"));

describe("liquid-glass tokens are present (regression guard)", () => {
  it("keeps transparency, blur, saturate and sheen", () => {
    // transparency must stay translucent, never fully opaque
    const op = num("glass-bg-opacity", light)!;
    expect(op).toBeGreaterThan(0);
    expect(op).toBeLessThan(0.6);
    expect(num("glass-blur", light)).toBeGreaterThan(0);
    expect(css).toMatch(/--glass-saturate:/);
    // the signature sheen pseudo-element must exist
    expect(css).toMatch(/\.glass::before/);
    expect(css).toMatch(/backdrop-filter:\s*blur/);
  });
});

describe("glass text contrast stays WCAG AA", () => {
  it("light mode foreground & muted over glass surface", () => {
    const page = hslToRgb(token("background", light)!);
    const glass = hslToRgb(token("glass-bg", light)!);
    const surf = blend(glass, page, num("glass-bg-opacity", light)!);
    const fg = hslToRgb(token("foreground", light)!);
    const muted = hslToRgb(token("muted-foreground", light)!);
    expect(contrast(fg, surf)).toBeGreaterThanOrEqual(4.5);
    expect(contrast(muted, surf)).toBeGreaterThanOrEqual(4.5);
  });

  it("dark mode foreground & muted over glass surface", () => {
    const page = hslToRgb(token("background", dark)!);
    const glass = hslToRgb(token("glass-bg", dark)!);
    const surf = blend(glass, page, num("glass-bg-opacity", dark)!);
    const fg = hslToRgb(token("foreground", dark)!);
    const muted = hslToRgb(token("muted-foreground", dark)!);
    expect(contrast(fg, surf)).toBeGreaterThanOrEqual(4.5);
    expect(contrast(muted, surf)).toBeGreaterThanOrEqual(4.5);
  });
});
