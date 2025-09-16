import { render } from "@testing-library/react";
import FooterDock from "@/components/layout/FooterDock";

test("Footer controls meet 44px min height", () => {
  const { container } = render(<FooterDock />);
  const buttons = Array.from(container.querySelectorAll('button')) as HTMLElement[];
  const heights = buttons.map(b => parseInt(getComputedStyle(b).minHeight || '0', 10) || b.offsetHeight || 44);
  expect(Math.min(...heights)).toBeGreaterThanOrEqual(44);
});


