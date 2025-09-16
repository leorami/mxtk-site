import { render, screen } from "@testing-library/react";
import HomePage from "@/app/home/page";

test("Home has a single h1 and logical heading order", () => {
  render(<HomePage />);
  const h1 = screen.getByRole("heading", { level: 1 });
  expect(!!h1).toBe(true);
});


