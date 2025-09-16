import { render, screen, fireEvent } from "@testing-library/react";
import Section from "@/components/home/Section";

test("section header hides when expanded and shows when collapsed", () => {
  render(<Section title="Top Pools"><div>Body</div></Section>);
  const chip = screen.getByRole("button");
  // Initially expanded: title visually hidden
  expect(screen.getByText("Top Pools").className).toContain("sr-only");
  fireEvent.click(chip);
  // Collapsed: title visible
  expect(screen.getByText("Top Pools").className).not.toContain("sr-only");
});


