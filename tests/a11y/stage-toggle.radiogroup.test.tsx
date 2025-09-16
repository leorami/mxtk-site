import { render, screen } from "@testing-library/react";
import ExperienceToggle from "@/components/ExperienceToggle";

test("Journey Stage control is a radiogroup with 3 options", () => {
  render(<ExperienceToggle /> as any);
  const group = screen.getByRole("radiogroup", { name: /journey stage/i });
  const opts = screen.getAllByRole("radio");
  expect(!!group).toBe(true);
  expect(opts.length).toBeGreaterThanOrEqual(3);
});


