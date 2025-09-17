import HomePage from "@/app/home/page";
import { homeCopy } from "@/copy/home";
import '@testing-library/jest-dom';
import { render, screen } from "@testing-library/react";

test("hero + helper come from copy registry and render", () => {
  const mockRes = { id: 'default', widgets: [], sections: [] }
  vi.spyOn(global as any, 'fetch').mockResolvedValue(new Response(JSON.stringify(mockRes), { status: 200 }))
  render(<HomePage />);
  expect(screen.getByTestId("home-hero-title")).toBeInTheDocument();
  // Should render one of the registered strings
  const anyHero = Object.values(homeCopy.heroTitle);
  const titleText = screen.getByTestId("home-hero-title").textContent || ''
  expect(anyHero.some(s => titleText.includes(s))).toBe(true)
});


