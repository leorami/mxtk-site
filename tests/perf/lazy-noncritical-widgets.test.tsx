import Home from "@/app/home/page";
import { render } from "@testing-library/react";

test("noncritical widgets lazy-load with skeletons", () => {
  const { container } = render(<Home />);
  // Allow either animated pulses or explicit skeleton/aria-busy
  expect(container.innerHTML).toMatch(/skeleton|aria-busy|animate-pulse/i);
});


