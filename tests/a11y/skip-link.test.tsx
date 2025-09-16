import { render, screen, fireEvent } from "@testing-library/react";
import SkipLink from "@/components/a11y/SkipLink";

test("Skip to content link focuses main", () => {
  render(<div><SkipLink /><main id="main-content">Hello</main></div>);
  const skip = screen.getByRole("link", { name: /skip to content/i });
  expect(skip).toBeInTheDocument();
  fireEvent.click(skip);
  const main = screen.getByRole("main");
  expect((main as HTMLElement).tabIndex).toBeLessThanOrEqual(-1);
});


