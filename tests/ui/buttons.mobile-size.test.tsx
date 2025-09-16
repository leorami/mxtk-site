import { render, screen } from "@testing-library/react";
import HomePage from "@/app/home/page";

test("hero buttons are small on mobile", () => {
  ;(global as any).innerWidth = 360;
  render(<HomePage />);
  const links = screen.getAllByRole("link");
  links.forEach(b => expect(b.className).toContain("h-11"));
});


