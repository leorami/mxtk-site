import { render } from "@testing-library/react";
import ReducedMotionProvider from "@/components/a11y/ReducedMotionProvider";

test("ReducedMotionProvider sets data attribute", () => {
  const { container } = render(<ReducedMotionProvider><div /></ReducedMotionProvider> as any);
  expect(document.body.dataset.motion).toBeDefined();
});


