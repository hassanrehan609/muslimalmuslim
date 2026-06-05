import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import { Card } from "@/components/ui/card";

/**
 * Visual regression (DOM/markup) snapshots for liquid-glass surfaces.
 *
 * These lock in the class contract that produces transparency, the sheen
 * pseudo-element, and the rounded layout. If a future change drops the
 * `glass` token classes or alters the structure, the snapshot diff fails.
 */
describe("liquid-glass component snapshots", () => {
  it("base Card keeps glass + rounded layout classes", () => {
    const { container } = render(<Card>content</Card>);
    const el = container.firstChild as HTMLElement;
    expect(el.className).toContain("glass");
    expect(el.className).toContain("rounded-2xl");
    expect(container.firstChild).toMatchSnapshot();
  });

  it("glass-strong variant snapshot", () => {
    const { container } = render(
      <Card className="glass-strong p-6">strong</Card>,
    );
    const el = container.firstChild as HTMLElement;
    expect(el.className).toContain("glass-strong");
    expect(container.firstChild).toMatchSnapshot();
  });

  it("glass-subtle variant snapshot", () => {
    const { container } = render(
      <Card className="glass-subtle">subtle</Card>,
    );
    const el = container.firstChild as HTMLElement;
    expect(el.className).toContain("glass-subtle");
    expect(container.firstChild).toMatchSnapshot();
  });
});
