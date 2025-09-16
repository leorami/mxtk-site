import { render, screen } from "@testing-library/react";
import Button from "@/components/ui/Button";

test("buttons show accessible focus styles", () => {
  render(<Button>Focus me</Button> as any);
  const btn = screen.getByRole("button", { name: /focus me/i });
  expect(btn.className).toMatch(/focus:ring/);
});


