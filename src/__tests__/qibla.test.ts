import { describe, it, expect, vi } from "vitest";
vi.mock("@/integrations/supabase/client", () => ({ supabase: {} }));
import { qiblaBearing } from "@/lib/community";

describe("qiblaBearing", () => {
  it("Karachi faces about 267° (west)", () => {
    expect(qiblaBearing(24.8607, 67.0011)).toBeCloseTo(267.6, 0);
  });
  it("London faces about 119°", () => {
    expect(qiblaBearing(51.5074, -0.1278)).toBeCloseTo(119, 0);
  });
});
